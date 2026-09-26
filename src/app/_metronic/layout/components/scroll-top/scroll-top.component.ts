import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.scss'],
})
export class AppScrollTopComponent implements OnInit {
  windowScrolled = false;

  ngOnInit(): void {
    this.updateVisibility();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateVisibility();
  }

  private updateVisibility(): void {
    this.windowScrolled = window.scrollY > Math.max(250, window.innerHeight * 0.6);
  }

  scrollToTop(): void {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  }
}
