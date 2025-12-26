export interface MenuItemModel {
  title: string;
  icon: string;
  options: SubMenuItemModel[];
}

export interface SubMenuItemModel {
  url: string;
  name: string;
}
