import { Injectable } from '@angular/core';
declare var alertify: any;

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() { }

  message(message: string, options: Partial<AlertifyOptions>) {
    alertify.set('notifier', 'position', options.position);
    alertify.set('notifier', 'delay', options.delay);
    const msg = alertify[options.messageType](message, options.custom);

    // When a parameter 'true' is added, it allows only one notification to be created and removes the previous one.
    if (options.dismissOthers)
      msg.dismissOthers();
  }

  dismissAll() {
    alertify.dismissAll();
  }
}

export class AlertifyOptions {
  messageType: MessageType = MessageType.Message;
  position: Position = Position.TopRight;
  delay: number = 3;
  dismissOthers: boolean = false;
  custom?: string;
}

export enum MessageType {
  Message = "message",
  Notify = "notify",
  Success = "success",
  Warning = "warning",
  Error = "error"
}

export enum Position {
  TopCenter = "top-center",
  TopRight = "top-right",
  TopLeft = "top-left",
  BottomCenter = "bottom-center",
  BottomRight = "bottom-right",
  BottomLeft = "bottom-left"
}
