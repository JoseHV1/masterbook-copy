import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuStateService {
  private openMenus = new Map<string, boolean>(); // Tracks which menus are open
  public openMenus$ = new BehaviorSubject<Map<string, boolean>>(this.openMenus);

  // Check if a menu is open
  isMenuOpen(path: string): boolean {
    return this.openMenus.get(path) || false;
  }

  // Toggle a specific menu
  toggleMenu(path: string, parentPath?: string): void {
    const isOpen = this.openMenus.get(path) || false;
    if (!parentPath) {
      // It's a main menu item → Close others
      this.openMenus.forEach((_, key) => {
        if (!key.startsWith(path)) {
          this.openMenus.set(key, false);
        }
      });
    } else {
      // It's a submenu → Close sibling submenus but keep parent open
      this.openMenus.forEach((_, key) => {
        if (key.startsWith(parentPath) && key !== path) {
          this.openMenus.set(key, false);
        }
      });
      this.openMenus.set(parentPath, true); // Keep parent open
    }

    // Toggle current menu
    this.openMenus.set(path, !isOpen);

    this.openMenus$.next(new Map(this.openMenus)); // Trigger state update
  }

  closeMenusInGroup(parentPath: string, excludePath: string): void {
    const updatedMenus = new Map(this.openMenus);

    updatedMenus.forEach((_, key) => {
      if (key.startsWith(parentPath) && key !== excludePath) {
        updatedMenus.set(key, false);
      }
    });

    this.openMenus$.next(updatedMenus);
  }

  // Close only one specific menu
  closeMenu(path: string): void {
    this.openMenus.set(path, false);
    this.openMenus$.next(new Map(this.openMenus));
  }

  // Close all child menus of a given path
  private closeChildMenus(parentPath: string): void {
    this.openMenus.forEach((_, key) => {
      if (key.startsWith(parentPath) && key !== parentPath) {
        this.openMenus.set(key, false);
      }
    });
  }
}
