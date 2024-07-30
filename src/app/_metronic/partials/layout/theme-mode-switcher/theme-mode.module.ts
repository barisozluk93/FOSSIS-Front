import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ThemeModeSwitcherComponent } from './theme-mode-switcher.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ThemeModeSwitcherComponent],
  imports: [CommonModule, InlineSVGModule, TranslateModule],
  exports: [ThemeModeSwitcherComponent],
})
export class ThemeModeModule {}
