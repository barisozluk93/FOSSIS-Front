import { AfterViewInit, Component, HostListener } from '@angular/core';
import { TranslationService } from '../modules/i18n';
import { MenuComponent } from '../_metronic/kt/components';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements AfterViewInit {
  readonly year = new Date().getFullYear();
  languageOpen = false;
  selectedLanguage: string;
  readonly languages = [
    { lang: 'tr', label: 'Türkçe', flag: './assets/media/flags/turkey.svg' },
    { lang: 'en', label: 'English', flag: './assets/media/flags/united-states.svg' },
  ];

  constructor(private translationService: TranslationService) {
    this.selectedLanguage = this.translationService.getSelectedLanguage();
  }

  ngAfterViewInit(): void {
    // The protected layout normally initializes Metronic menus. This public route
    // initializes the same menu system so the shared theme switcher works here.
    setTimeout(() => MenuComponent.bootstrap());
  }

  @HostListener('document:click')
  closeLanguageMenu(): void {
    this.languageOpen = false;
  }

  toggleLanguageMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.languageOpen = !this.languageOpen;
  }

  selectLanguage(lang: string, event: MouseEvent): void {
    event.stopPropagation();
    this.translationService.setLanguage(lang);
    this.selectedLanguage = lang;
    this.languageOpen = false;
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
