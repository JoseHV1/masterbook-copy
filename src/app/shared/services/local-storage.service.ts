import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private data: Record<string, any> = {};
  private isStorage = checkStorage();

  setItem(id: string, val: any) {
    return this.isStorage
      ? (window as Window).localStorage.setItem(id, JSON.stringify(val))
      : (this.data[id] = String(JSON.stringify(val)));
  }

  getItem(id: string) {
    const data = this.isStorage
      ? (window as Window).localStorage.getItem(id)
      : null;

    return data ? JSON.parse(data) : null;
  }

  deleteItem(id: string) {
    return this.isStorage ? (window as Window).localStorage.removeItem(id) : '';
  }

  clear() {
    return this.isStorage ? (window as Window).localStorage.clear() : '';
  }
}

export function checkStorage(): boolean {
  try {
    return 'localStorage' in window && window.localStorage !== null;
  } catch (e) {
    return false;
  }
}
