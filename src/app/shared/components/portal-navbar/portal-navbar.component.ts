import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-portal-navbar',
  templateUrl: './portal-navbar.component.html',
  styleUrls: ['./portal-navbar.component.scss'],
})
export class PortalNavbarComponent {
  @Output() toggleMenu: EventEmitter<boolean> = new EventEmitter();
  isFullScreen: boolean = false;
  openMenu = true;

  setToggleMenu(toggle: boolean): void {
    this.openMenu = toggle;
    this.toggleMenu.emit(toggle);
  }

  toggleFullScreen(): void {
    this.isFullScreen = !this.isFullScreen;
    if (this.isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  darkMode(): void {
    alert('holas');
  }
}
