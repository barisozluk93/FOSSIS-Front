import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth';
import { MenuModel } from 'src/app/modules/menu-management/models/menu.model';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit {
  
  menuList: MenuModel[];
  permissionList: number[] | undefined;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    setTimeout(() => {
      var menuFromStorage = localStorage.getItem("menu");
      if(menuFromStorage) {
        this.menuList = JSON.parse(menuFromStorage);

        this.authService.currentUserSubject.asObservable().subscribe(result => {
          if(result?.permissions)
          {
            this.permissionList = (JSON.parse(result?.permissions) as number[]);
            
            this.menuList.forEach(menu => {
              if(menu.permissionId) {
                if(this.permissionList?.includes(menu.permissionId)) {
                  menu.isForbid = false;
                }
                else {
                  menu.isForbid = true;
                }
              }
              else{
                menu.childMenus?.forEach(childMenu => {
                  if(this.permissionList?.includes(childMenu.permissionId!)) {
                    childMenu.isForbid = false;
                    menu.isForbid = false;
                  }
                  else{
                    childMenu.isForbid = true;
                  }
                })

                if(menu.isForbid != false) {
                  menu.isForbid = true;
                }
              }


            })
          }
        })
      }
    }, 200);
  }

  calculateMenuItemCssClass(url: string): string {
    return checkIsActive(this.router.url, url) ? 'active' : '';
  }
}

const getCurrentUrl = (pathname: string): string => {
  return pathname.split(/[?#]/)[0];
};

const checkIsActive = (pathname: string, url: string) => {
  const current = getCurrentUrl(pathname);
  if (!current || !url) {
    return false;
  }

  if (current === url) {
    return true;
  }

  if (current.indexOf(url) > -1) {
    return true;
  }

  return false;
};
