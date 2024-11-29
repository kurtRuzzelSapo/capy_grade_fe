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
    <div [@dialogAnimation]="'visible'">
      <!-- <h1 mat-dialog-title>Message</h1> -->
      <div class="font-bold" mat-dialog-content>{{ data.message }}</div>
    </div>
  `,
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
