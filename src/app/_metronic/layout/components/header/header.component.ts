import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../core/layout.service';
import { MenuComponent } from '../../../kt/components';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  headerContainerCssClasses: string = '';
  mobileMenuOpen = false;
  
  private unsubscribe: Subscription[] = [];
  private menuObserver?: MutationObserver;
  private menuInitFrame = 0;

  constructor(private layout: LayoutService, private router: Router, private elementRef: ElementRef<HTMLElement>) {
    this.routingChanges();
  }

  ngOnInit(): void {
    this.headerContainerCssClasses =
      this.layout.getStringCSSClasses('headerContainer');

  }

  ngAfterViewInit(): void {
    // Auth/profile menu nodes can be inserted asynchronously after the first login.
    // Observe the header so Metronic attaches to those newly rendered dropdowns immediately.
    this.menuObserver = new MutationObserver(() => {
      cancelAnimationFrame(this.menuInitFrame);
      this.menuInitFrame = requestAnimationFrame(() => MenuComponent.reinitialization());
    });
    this.menuObserver.observe(this.elementRef.nativeElement, { childList: true, subtree: true });
    requestAnimationFrame(() => MenuComponent.reinitialization());
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  routingChanges() {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this.mobileMenuOpen = false;
        requestAnimationFrame(() => MenuComponent.reinitialization());
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  ngOnDestroy(): void {
    this.menuObserver?.disconnect();
    cancelAnimationFrame(this.menuInitFrame);
    this.unsubscribe.forEach((subscription) => subscription.unsubscribe());
  }

}
