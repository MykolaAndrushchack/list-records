import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {IRecord} from '../../../models/record.interface';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Role} from '../../../models/role.enum';
import {Status} from '../../../models/status.enum';

@Component({
  selector: 'app-record-modal',
  templateUrl: './record-modal.component.html',
  styleUrls: ['./record-modal.component.scss']
})
export class RecordModalComponent implements OnInit {
  form!: FormGroup;
  record: IRecord;
  roles = Object.keys(Role);
  statuses = Object.keys(Status);


  constructor(public dialogRef: MatDialogRef<RecordModalComponent>,
              @Inject(MAT_DIALOG_DATA) data: IRecord,
              private _dialog: MatDialog,
              private _fb: FormBuilder) {
    this.record = data;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this._fb.group({
      name: [this.record?.name ? this.record?.name : '', [Validators.required]],
      address: [this.record?.address ? this.record?.address : '', []],
      amount: [this.record?.amount ? this.record?.amount : '', []],
      role: [this.record?.role ? this.record?.role : '', []],
      status: [this.record?.status ? this.record?.status : '', []],
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close({...this.record, ...this.form.value});
  }

}
