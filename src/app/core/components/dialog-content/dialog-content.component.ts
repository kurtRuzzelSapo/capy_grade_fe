import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-content',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  template: `
    <div [@dialogAnimation]="'visible'" class="dialog-content">
      <div class="font-bold" mat-dialog-content>{{ data.message }}</div>
    </div>
  `,
  styles: [`
    .dialog-content {
      overflow: hidden;
      padding: 16px;
    }
    :host ::ng-deep .mat-mdc-dialog-container {
      overflow: hidden !important;
    }
    :host ::ng-deep .mdc-dialog__surface {
      overflow: hidden !important;
    }
    :host ::ng-deep .mat-mdc-dialog-content {
      overflow: hidden !important;
      margin: 0 !important;
      padding: 0 !important;
    }
  `],
  animations: [
    trigger('dialogAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'scale(0.3)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('void => visible', [
        animate('300ms cubic-bezier(0.34, 1.56, 0.64, 1)')
      ]),
      transition('visible => void', [
        animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({
          opacity: 0,
          transform: 'scale(1.2)'
        }))
      ])
    ])
  ]
})
export class DialogContentComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    private dialogRef: MatDialogRef<DialogContentComponent>
  ) {
    setTimeout(() => {
      this.dialogRef.close();
    }, 1800);
  }
}
