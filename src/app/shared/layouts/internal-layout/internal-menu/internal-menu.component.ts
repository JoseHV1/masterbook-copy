import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MENU_ITEMS } from './internal-menu-items';
import { InternalMenuItemModel } from './internal-menu-item-model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';

@Component({
  selector: 'app-internal-menu',
  templateUrl: './internal-menu.component.html',
  styleUrls: ['./internal-menu.component.scss'],
})
export class InternalMenuComponent {
  @Input() openMenu: boolean = true;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  role!: string;
  MENU_ITEMS = MENU_ITEMS;
  menuItemRole: InternalMenuItemModel[] = [];

  roleMap: Record<RolesEnum, string> = {
    [RolesEnum.INSURED]: 'client',
    [RolesEnum.ADMIN]: 'admin',
    [RolesEnum.AGENCY_BROKER]: 'agent',
    [RolesEnum.INDEPENDANT_BROKER]: 'agent',
    [RolesEnum.AGENCY_ADMINISTRATOR]: 'agent',
    [RolesEnum.AGENCY_OWNER]: 'agent',
    [RolesEnum.PREREGISTER_INSURED]: 'client',
    [RolesEnum.PREREGISTER_USER]: 'agent',
  };

  canSeeReports: RolesEnum[] = [
    RolesEnum.ADMIN,
    RolesEnum.INDEPENDANT_BROKER,
    RolesEnum.AGENCY_OWNER,
  ];

  canSeeInsurers: RolesEnum[] = [
    RolesEnum.INDEPENDANT_BROKER,
    RolesEnum.AGENCY_OWNER,
  ];

  constructor(private _auth: AuthService) {
    const userRole = this._auth.getAuth()?.user.role as RolesEnum | undefined;

    if (userRole && this.roleMap[userRole]) {
      this.role = this.roleMap[userRole];
    } else {
      this.role = 'agent';
    }

    this.menuItemRole = [...this.MENU_ITEMS[this.role]];

    if (userRole !== RolesEnum.AGENCY_OWNER) {
      this.menuItemRole = this.menuItemRole.filter(
        item => item.title !== 'Users' && item.url !== 'users'
      );
    }

    if (!userRole || !this.canSeeInsurers.includes(userRole)) {
      this.menuItemRole = this.menuItemRole.filter(
        item => item.title !== 'Insurers' && item.url !== 'insurers'
      );
    }

    if (!userRole || !this.canSeeReports.includes(userRole)) {
      this.menuItemRole = this.menuItemRole.filter(
        item => item.title !== 'Reports' && item.url !== 'reports'
      );
    }
  }
}
