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
    const dialogRef = this.dialog.open(dialogParameters.componentType, {
      maxWidth: '1500px', //dialogParameters.options?.maxWidth
      maxHeight: '1000px', // dialogParameters.options?.maxHeight
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
  maxWidth?: string = '1500px';
  maxHeight?: string;
  width?: string = 'auto';
  height?: string;
  positions?: DialogPosition
}