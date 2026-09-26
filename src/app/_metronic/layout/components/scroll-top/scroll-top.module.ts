import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AppScrollTopComponent } from './scroll-top.component';

@NgModule({
  declarations: [AppScrollTopComponent],
  imports: [CommonModule, TranslateModule],
  exports: [AppScrollTopComponent],
})
export class ScrollTopModule {}
