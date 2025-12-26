import { Component, Input } from '@angular/core';
import { MENU_ITEMS } from './menu-items';

@Component({
  selector: 'app-portal-menu',
  templateUrl: './portal-menu.component.html',
  styleUrls: ['./portal-menu.component.scss'],
})
export class PortalMenuComponent {
  @Input() openMenu: boolean = true;
  MENU_ITEMS = MENU_ITEMS;
  selectedIndex?: number;
}
