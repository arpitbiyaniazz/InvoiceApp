import React, { createContext, useReducer, useContext, useEffect, useCallback } from 'react';
import { saveState, loadState } from '../utils/storage';

const InvoiceContext = createContext();

const getToday = () => {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const initialState = {
  items: [],
  invoiceSettings: {
    // Business details
    businessName: 'MY BUSINESS',
    businessAddress: '',
    businessPhone: '',
    businessState: '',

    // Invoice meta
    invoiceNumber: '001',
    invoiceDate: getToday(),
    invoiceTitle: 'Bill of Supply',

    // Customer details
    customerName: '',
    customerEmail: '',
    customerAddress: '',

    // Financials
    taxRate: 0,
    discountType: 'percentage',
    discountValue: 0,
    receivedAmount: 0,

    // Terms
    termsAndConditions: 'Thank you for doing business with us.',
  },
  isLoaded: false,
};

function invoiceReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };

    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        ),
      };

    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        invoiceSettings: { ...state.invoiceSettings, ...action.payload },
      };

    case 'LOAD_STATE':
      return { ...action.payload, isLoaded: true };

    case 'CLEAR_INVOICE':
      return {
        ...initialState,
        invoiceSettings: {
          ...initialState.invoiceSettings,
          invoiceNumber: action.payload?.invoiceNumber || initialState.invoiceSettings.invoiceNumber,
          invoiceDate: getToday(),
        },
        isLoaded: true,
      };

    default:
      return state;
  }
}

export function InvoiceProvider({ children }) {
  const [state, dispatch] = useReducer(invoiceReducer, initialState);

  // Load saved state on mount
  useEffect(() => {
    (async () => {
      const saved = await loadState();
      if (saved) {
        dispatch({ type: 'LOAD_STATE', payload: saved });
      } else {
        dispatch({ type: 'LOAD_STATE', payload: initialState });
      }
    })();
  }, []);

  // Auto-save on state change
  useEffect(() => {
    if (state.isLoaded) {
      const { isLoaded, ...stateToSave } = state;
      saveState(stateToSave);
    }
  }, [state]);

  const addItem = useCallback((item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const updateItem = useCallback((item) => {
    dispatch({ type: 'UPDATE_ITEM', payload: item });
  }, []);

  const deleteItem = useCallback((id) => {
    dispatch({ type: 'DELETE_ITEM', payload: id });
  }, []);

  const updateSettings = useCallback((settings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  const clearInvoice = useCallback((invoiceNumber) => {
    dispatch({ type: 'CLEAR_INVOICE', payload: { invoiceNumber } });
  }, []);

  return (
    <InvoiceContext.Provider
      value={{
        state,
        addItem,
        updateItem,
        deleteItem,
        updateSettings,
        clearInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoice() {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
}

export default InvoiceContext;
