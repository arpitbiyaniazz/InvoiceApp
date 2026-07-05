import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@invoice_app_state';
const INVOICES_KEY = '@invoice_app_saved_invoices';

/**
 * Save current invoice state to AsyncStorage
 */
export const saveState = async (state) => {
  try {
    const jsonValue = JSON.stringify(state);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving state:', e);
  }
};

/**
 * Load saved invoice state from AsyncStorage
 */
export const loadState = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error loading state:', e);
    return null;
  }
};

/**
 * Clear saved state
 */
export const clearState = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing state:', e);
  }
};

/**
 * Generate next invoice number
 */
export const generateInvoiceNumber = async () => {
  try {
    const saved = await AsyncStorage.getItem(INVOICES_KEY);
    const invoices = saved ? JSON.parse(saved) : [];
    const nextNum = invoices.length + 1;
    return `INV-${String(nextNum).padStart(4, '0')}`;
  } catch (e) {
    return `INV-0001`;
  }
};

/**
 * Save a completed invoice
 */
export const saveInvoice = async (invoice) => {
  try {
    const saved = await AsyncStorage.getItem(INVOICES_KEY);
    const invoices = saved ? JSON.parse(saved) : [];
    invoices.push({ ...invoice, savedAt: new Date().toISOString() });
    await AsyncStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
  } catch (e) {
    console.error('Error saving invoice:', e);
  }
};
