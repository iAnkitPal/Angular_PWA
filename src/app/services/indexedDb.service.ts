import { Injectable } from '@angular/core';
import { fromEventPattern, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private dbName = 'myDatabase';
  private storeName = 'myStore';

  private openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName);
      request.onupgradeneeded = (event:any) => {
        const db = event?.target?.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
      request.onsuccess = (event:any) => {
        resolve(event.target.result);
      };
      request.onerror = (event:any) => {
        reject(event.target.error);
      };
    });
  }

  addData(data: any): Observable<void> {
    return fromEventPattern((handler) => {
      this.openDb().then((db) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.add(data);
        request.onsuccess = handler;
        request.onerror = (event:any) => {
          console.error('Error adding data:', event.target.error);
        };
      });
    });
  }
  getData(): Observable<void> {
    return fromEventPattern((handler) => {
      this.openDb().then((db) => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();
        request.onsuccess = handler;
        request.onerror = (event:any) => {
          console.error('Error adding data:', event.target.error);
        };
      });
    });
  }

  // ... other methods for getting, updating, and deleting data
}