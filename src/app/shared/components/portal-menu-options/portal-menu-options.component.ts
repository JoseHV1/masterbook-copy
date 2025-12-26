import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MenuItemModel } from './menu-item-models';

@Component({
  selector: 'app-portal-menu-options',
  templateUrl: './portal-menu-options.component.html',
  styleUrls: ['./portal-menu-options.component.scss'],
})
export class PortalMenuOptionsComponent {
  @Input() item!: MenuItemModel;
  @Input() isOpen: boolean = false;
  @Output() optionClick: EventEmitter<void> = new EventEmitter();
}
