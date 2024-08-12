import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { NotificationModel } from 'src/app/models/notification.model';
import { AuthService } from 'src/app/modules/auth';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notifications-inner',
  templateUrl: './notifications-inner.component.html',
})
export class NotificationsInnerComponent implements OnInit {
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  @Input() notifications: Array<NotificationModel> = [];
  @Input() unreadedNotificationCount: number = 0;
  @Input() totalNotificationCount: number = 0;

  constructor(private notificationService: NotificationService, private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  delete(notificationId: number) {
    var notification = this.notifications.filter(f => f.id == notificationId)[0];

    this.notificationService.delete(notificationId).subscribe(result => {
      if(result.isSuccess) {
        this.notificationService.updateNotifications(notification.userId);
      }
    })
  }

}


