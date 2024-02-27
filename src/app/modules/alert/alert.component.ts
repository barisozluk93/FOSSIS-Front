import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit, OnDestroy {

  show: boolean = false;
  type: string = "";
  message: string = "";

  constructor() { }

  ngOnInit(): void {

  }

  ngOnDestroy() {

  }

  alert(type: string, message: string) {
    this.show = true;
    this.type = type;
    this.message = message;

    setTimeout(() => {
      this.show = false;
      this.type = "";
      this.message = "";
    }, 3000);
  }

  close() {
    this.show = false;
    this.type = "";
    this.message = "";
  }
}
