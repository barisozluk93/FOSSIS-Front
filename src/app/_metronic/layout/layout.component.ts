import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { LayoutService } from './core/layout.service';
import { LayoutInitService } from './core/layout-init.service';
import { MenuManagementService } from 'src/app/modules/menu-management/menu-management.service';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  // Public variables
  selfLayout = 'default';
  asideSelfDisplay: true;
  asideMenuStatic: true;
  contentClasses = '';
  contentContainerClasses = '';
  toolbarDisplay = true;
  contentExtended: false;
  asideCSSClasses: string;
  asideHTMLAttributes: any = {};
  headerMobileClasses = '';
  headerMobileAttributes = {};
  footerDisplay: boolean;
  footerCSSClasses: string;
  headerCSSClasses: string;
  headerHTMLAttributes: any = {};
  // offcanvases
  extrasSearchOffcanvasDisplay = false;
  extrasNotificationsOffcanvasDisplay = false;
  extrasQuickActionsOffcanvasDisplay = false;
  extrasCartOffcanvasDisplay = false;
  extrasUserOffcanvasDisplay = false;
  extrasQuickPanelDisplay = false;
  extrasScrollTopDisplay = false;
  asideDisplay: boolean;
  @ViewChild('ktAside', { static: true }) ktAside: ElementRef;
  @ViewChild('ktHeaderMobile', { static: true }) ktHeaderMobile: ElementRef;
  @ViewChild('ktHeader', { static: true }) ktHeader: ElementRef;

  headerDisplay: boolean = true;

  private unsubscribe: Subscription[] = [];

  constructor(
    private initService: LayoutInitService,
    private layout: LayoutService,
    private router: Router
  ) {
    this.initService.init();

  }

  ngOnInit(): void {
    // build view by layout config settings
    this.asideDisplay = true; //this.layout.getProp('aside.display') as boolean;
    this.toolbarDisplay = this.layout.getProp('toolbar.display') as boolean;
    this.contentContainerClasses = this.layout.getStringCSSClasses('contentContainer');
    this.asideCSSClasses = this.layout.getStringCSSClasses('aside');
    this.headerCSSClasses = this.layout.getStringCSSClasses('header');
    this.headerHTMLAttributes = this.layout.getHTMLAttributes('headerMenu');
    this.footerCSSClasses = this.layout.getStringCSSClasses('footer')
  }

  ngAfterViewInit(): void {
    if (this.ktHeader) {
      for (const key in this.headerHTMLAttributes) {
        if (this.headerHTMLAttributes.hasOwnProperty(key)) {
          this.ktHeader.nativeElement.attributes[key] =
            this.headerHTMLAttributes[key];
        }
      }
    }

    this.routingChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  routingChanges() {
    var el = document.getElementById("kt_wrapper");
    var el2 = document.getElementById("kt_header");
    var el3 = document.getElementById("kt_header_container");

    const routerSubscription = this.router.events.subscribe((event) => {
        if(this.router.url == "/map") {
          this.asideDisplay = false;
          this.headerDisplay = true;

          if(el) {
            el?.classList.add("map-aside-menu-container-xxl");
            el3?.classList.add("map-aside-menu-container-xxl");
          }

          if(el2) {
            el2?.classList.add("map-header-menu-height");
          }
        }
        else{
          this.asideDisplay = true;
          this.headerDisplay = false;

          if(el) {
            el?.classList.remove("map-aside-menu-container-xxl");
            el3?.classList.remove("map-aside-menu-container-xxl");
          }

          if(el2) {
            el2?.classList.remove("map-header-menu-height");
          }
        }
    });
    this.unsubscribe.push(routerSubscription);
  }
}
