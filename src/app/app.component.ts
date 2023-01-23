import { AfterViewInit, Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SidebarOption } from './general-module/componentes-comunes/interfaces/sidebar-option.interface';
import { UserLogged } from './general-module/componentes-comunes/interfaces/user.interface';
import { DialogService } from './general-module/componentes-comunes/servicios/dialog.service';
import { UserService } from './general-module/componentes-comunes/servicios/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {
  title = ''/* 'Sistema Integral de los Procesos de Fiscalización' */;
  hasImg = false;
  expanded = false;
  user!: UserLogged;
  options: SidebarOption[] = [];
  showNavbar: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private dialog: DialogService,
  ) {
    this.user = JSON.parse(sessionStorage.getItem('userLogged') as string);

    if (!this.user) {
      this.userService.getUserLoggedValue().subscribe(res => {
        if (res) {
          location.reload();
        }
      });
    } else {
      this.validateOptions();
    }
  }

  ngAfterViewInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const items = document.querySelectorAll(".item");
        for (let index = 0; index < items.length; index++) {
          const item = items[index];
          const value = item.attributes.getNamedItem("ng-reflect-router-link")?.value;
          if (value && event.url.includes(value)) {
            item.classList.add("active-route");
          } else {
            item.classList.remove("active-route");
          }
        }
      }
    });

    const items = document.querySelectorAll("mat-list-item");
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      item.setAttribute("title", item.querySelector("span")?.innerText ?? "");
    }
  }

  private validateOptions() {
    if (this.user.options.length > 0) {
      this.showNavbar = true;
      return this.getUserImageUrl();
    }
    this.dialog.show({
      title: "IFI-401",
      text: "El usuario no posee ningun perfil asignado para acceder al sistema.",
      icon: "error",
      disableClose: true,
      showCloseButton: true,
    });
  }

  toggleMenu() {
    document.getElementById("sidebar")?.classList.toggle('open');
    document.getElementById("menu-icon")?.classList.toggle('morph');

    this.expanded = !this.expanded;
  }

  activateItem(id: string) {
    const element = document.getElementById(id) as HTMLDivElement;
    const child = element.children[1] as HTMLDivElement;

    this.options?.filter(item => item.id != id).forEach(item => {
      const child = document.getElementById(item.id) as HTMLDivElement;
      child.classList.remove("selected");
      if (item.children) {
        const innerChild = child.children[1] as HTMLDivElement;
        innerChild.style.cssText = `height: 0px !important;`;
      }
    });

    if (child) {
      if (element.classList.contains("selected")) {
        element.classList.remove("selected")
        child.style.cssText = `height: 0px !important;`;
      } else {
        element.classList.add("selected")
        child.style.cssText = `height: ${child.children.length * 53}px !important;`;
      }
    } else {
      element.classList.toggle("selected");
    }
  }

  noImg(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    console.log("No se encontró la imagen");
    this.hasImg = false;
  }

  value(_: number, item: SidebarOption) {
    return item;
  }

  getUserImageUrl() {
    this.userService.getUserImageUrl().toPromise().then(res => {
      this.hasImg = true;

      setTimeout(() => {
        document.getElementById(this.user?.nit)?.setAttribute("src", res);
      });
    });
  }
}
