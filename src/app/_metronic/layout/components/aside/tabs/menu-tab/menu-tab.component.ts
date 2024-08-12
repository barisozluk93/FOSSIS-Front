import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  DrawerComponent,
  MenuComponent,
  ScrollComponent,
  ToggleComponent,
} from 'src/app/_metronic/kt/components';
import { environment } from '../../../../../../../environments/environment';
import { AuthService } from 'src/app/modules/auth';
import { MenuModel } from 'src/app/models/menu.model';

const menuList = [
  {
    "id": 1,
    "name": "Dashboard",
    "nameEn": "Dashboard",
    "url": "/dashboard",
    "icon": undefined,
    "permissionId": 21,
    "isDeleted": false,
    "isSystemData": true,
    "parentId": undefined,
    "parent": undefined,
    "childMenus": [],
    "isForbid": undefined,
  },
  {
    "id": 2,
    "name": "Harita",
    "nameEn": "Map",
    "url": "/map",
    "icon": undefined,
    "permissionId": 22,
    "isDeleted": false,
    "isSystemData": true,
    "parentId": undefined,
    "parent": undefined,
    "childMenus": [],
    "isForbid": undefined,
  },
  {
    "id": 3,
    "name": "Kullanıcı Yönetimi",
    "nameEn": "User Management",
    "url": undefined,
    "icon": undefined,
    "permissionId": undefined,
    "isDeleted": false,
    "isSystemData": true,
    "parentId": undefined,
    "parent": undefined,
    "isForbid": undefined,
    "childMenus": [
      {
        "id": 4,
        "name": "Yetkiler",
        "nameEn": "Permissions",
        "url": "/usermanagement/permissions",
        "icon": undefined,
        "permissionId": 1,
        "isDeleted": false,
        "isSystemData": true,
        "parentId": 3,
        "parent": undefined,
        "childMenus": [],
        "isForbid": undefined,
      },
      {
        "id": 5,
        "name": "Roller",
        "nameEn": "Roles",
        "url": "/usermanagement/roles",
        "icon": undefined,
        "permissionId": 5,
        "isDeleted": false,
        "isSystemData": true,
        "parentId": 3,
        "parent": undefined,
        "childMenus": [],
        "isForbid": undefined,
      },
      {
        "id": 6,
        "name": "Kullanıcılar",
        "nameEn": "Users",
        "url": "/usermanagement/users",
        "icon": undefined,
        "permissionId": 13,
        "isDeleted": false,
        "isSystemData": true,
        "parentId": 3,
        "parent": undefined,
        "childMenus": [],
        "isForbid": undefined,
      },
    ],
  },
  {
    "id": 7,
    "name": "Organizasyon Yönetimi",
    "nameEn": "Organization Management",
    "url": "/organizationmanagement",
    "icon": undefined,
    "permissionId": 9,
    "isDeleted": false,
    "isSystemData": true,
    "parentId": undefined,
    "parent": undefined,
    "childMenus": [],
    "isForbid": undefined,
  },
  {
    "id": 10,
    "name": "Malzeme Yönetimi",
    "nameEn": "Material Management",
    "url": undefined,
    "icon": undefined,
    "permissionId": undefined,
    "isDeleted": false,
    "isSystemData": true,
    "parentId": undefined,
    "parent": undefined,
    "isForbid": undefined,
    "childMenus": [
      {
        "id": 11,
        "name": "Paneller",
        "nameEn": "Panels",
        "url": "/materialmanagement/panels",
        "icon": undefined,
        "permissionId": 27,
        "isDeleted": false,
        "isSystemData": true,
        "parentId": 10,
        "parent": undefined,
        "childMenus": [],
        "isForbid": undefined,
      },
      {
        "id": 12,
        "name": "İnverterlar",
        "nameEn": "Inverters",
        "url": "/materialmanagement/inverters",
        "icon": undefined,
        "permissionId": 23,
        "isDeleted": false,
        "isSystemData": true,
        "parentId": 10,
        "parent": undefined,
        "childMenus": [],
        "isForbid": undefined,
      },
      {
        "id": 13,
        "name": "Bataryalar",
        "nameEn": "Batteries",
        "url": "/materialmanagement/batteries",
        "icon": undefined,
        "permissionId": 31,
        "isDeleted": false,
        "isSystemData": true,
        "parentId": 10,
        "parent": undefined,
        "childMenus": [],
        "isForbid": undefined,
      },
      {
        "id": 14,
        "name": "Isı Pompaları",
        "nameEn": "Heat Pumps",
        "url": "/materialmanagement/heatpumps",
        "icon": undefined,
        "permissionId": 35,
        "isDeleted": false,
        "isSystemData": true,
        "parentId": 10,
        "parent": undefined,
        "childMenus": [],
        "isForbid": undefined,
      },
      {
        "id": 15,
        "name": "Konstrüksiyonlar",
        "nameEn": "Constructions",
        "url": "/materialmanagement/constructions",
        "icon": undefined,
        "permissionId": 39,
        "isDeleted": false,
        "isSystemData": true,
        "parentId": 10,
        "parent": undefined,
        "childMenus": [],
        "isForbid": undefined,
      },
      {
        "id": 16,
        "name": "Kablolar",
        "nameEn": "Cables",
        "url": "/materialmanagement/cables",
        "icon": undefined,
        "permissionId": 43,
        "isDeleted": false,
        "isSystemData": true,
        "parentId": 10,
        "parent": undefined,
        "childMenus": [],
        "isForbid": undefined,
      },
      {
        "id": 17,
        "name": "Elektrikli Şarj İstasyonları",
        "nameEn": "EV Charging Stations",
        "url": "/materialmanagement/chargingstations",
        "icon": undefined,
        "permissionId": 47,
        "isDeleted": false,
        "isSystemData": true,
        "parentId": 10,
        "parent": undefined,
        "childMenus": [],
        "isForbid": undefined,
      }
    ]
  },
]

@Component({
  selector: 'app-menu-tab',
  templateUrl: './menu-tab.component.html',
  styleUrls: ['./menu-tab.component.scss'],
})
export class MenuTabComponent implements OnInit, AfterViewInit, OnDestroy {
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;
  @ViewChild('ktAsideScroll', { static: true }) ktAsideScroll: ElementRef;
  private unsubscribe: Subscription[] = [];

  menuList: MenuModel[] = menuList;
  permissionList: number[] | undefined;

  constructor(private router: Router, private authService: AuthService) {}

  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
    this.routingChanges();
    
    this.authService.currentUserSubject.asObservable().subscribe(result => {
      if (result?.permissions) {
        this.permissionList = (JSON.parse(result?.permissions) as number[]);

        this.menuList.forEach(menu => {
          if (menu.permissionId) {
            if (this.permissionList?.includes(menu.permissionId)) {
              menu.isForbid = false;
            }
            else {
              menu.isForbid = true;
            }
          }
          else {
            menu.childMenus?.forEach(childMenu => {
              if (this.permissionList?.includes(childMenu.permissionId!)) {
                childMenu.isForbid = false;
                menu.isForbid = false;
              }
              else {
                childMenu.isForbid = true;
              }

              if(!childMenu.isForbid) {
                menu.isForbid = false;
              }
              else {
                menu.isForbid = true;
              }
            })
          }
        })

        console.log(this.menuList)
      }
    })
  }

  routingChanges() {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this.menuReinitialization();
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  menuReinitialization() {
    setTimeout(() => {
      MenuComponent.reinitialization();
      DrawerComponent.reinitialization();
      ToggleComponent.reinitialization();
      ScrollComponent.reinitialization();
      if (this.ktAsideScroll && this.ktAsideScroll.nativeElement) {
        this.ktAsideScroll.nativeElement.scrollTop = 0;
      }
    }, 50);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
