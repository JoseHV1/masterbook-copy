export interface InternalMenuItemModel {
  title?: string; // Optional, used for top-level menus or submenus
  name?: string; // Optional, used for individual options
  url?: string;
  icon?: string;
  options?: InternalMenuItemModel[]; // Recursive type to handle nested submenus
}

export interface iternalMenuModel {
  [key: string]: InternalMenuItemModel[]; // The key can be 'agent', 'client', etc.
}
