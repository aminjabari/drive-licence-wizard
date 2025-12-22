const EXPIRY_DAYS = 10;

interface StoredData<T> {
  value: T;
  expiry: number;
}

export function saveWithExpiry<T>(key: string, value: T): void {
  const now = new Date();
  const expiryTime = now.getTime() + EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  
  const item: StoredData<T> = {
    value,
    expiry: expiryTime,
  };
  
  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function getWithExpiry<T>(key: string): T | null {
  try {
    const itemStr = localStorage.getItem(key);
    
    if (!itemStr) {
      return null;
    }
    
    const item: StoredData<T> = JSON.parse(itemStr);
    const now = new Date();
    
    // Check if expired
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

// Key generator based on phone number
export function getWizardStorageKey(phoneNumber?: string): string {
  return phoneNumber ? `wizard_data_${phoneNumber}` : 'wizard_data_guest';
}
