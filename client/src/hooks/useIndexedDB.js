import { useEffect, useState } from 'react';

const useIndexedDB = () => {
  const [db, setDb] = useState(null);

  useEffect(() => {
    const openRequest = indexedDB.open('cryptoWalletDB', 1);

    openRequest.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('accounts')) {
        db.createObjectStore('accounts', { keyPath: 'address' });
      }
    };

    openRequest.onsuccess = (event) => {
      setDb(event.target.result);
    };

    openRequest.onerror = (event) => {
      console.error('Error opening IndexedDB:', event.target.errorCode);
    };
  }, []);

  const saveAccountToIndexedDB = async (address, encryptedAccountObject) => {
    if (!db) {
      console.error('IndexedDB not initialized');
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['accounts'], 'readwrite');
      const objectStore = transaction.objectStore('accounts');

      const request = objectStore.put({ address, encryptedAccountObject });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        console.error('Error saving to IndexedDB:', event.target.errorCode);
        reject(event.target.errorCode);
      };
    });
  };

  const getAccountFromIndexedDB = async (address) => {
    if (!db) {
      console.error('IndexedDB not initialized');
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['accounts'], 'readonly');
      const objectStore = transaction.objectStore('accounts');

      const request = objectStore.get(address);

      request.onsuccess = (event) => {
        resolve(event.target.result ? event.target.result.encryptedAccountObject : null);
      };

      request.onerror = (event) => {
        console.error('Error getting from IndexedDB:', event.target.errorCode);
        reject(event.target.errorCode);
      };
    });
  };

  return {
    saveAccountToIndexedDB,
    getAccountFromIndexedDB,
  };
};

export default useIndexedDB;
