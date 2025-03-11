//import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { ComponentType } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private readonly dialog: MatDialog
  ) { }

  openDialog(dialogParameters: Partial<DialogParameters>): void {
    debugger;
    const dialogRef = this.dialog.open(dialogParameters.componentType, {
      width: dialogParameters.options?.width,
      height: dialogParameters.options?.height,
      position: dialogParameters.options?.positions,
      data: dialogParameters.data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == dialogParameters.data) {
        dialogParameters.afterClosed();
      }
    });
  }
}

export class DialogParameters {
  componentType: ComponentType<any>;
  data: any;
  afterClosed: () => void;
  options?: Partial<DialogOptions> = new DialogOptions();
}

export class DialogOptions {
  width?: string = 'auto';
  height?: string;
  positions?: DialogPosition
}