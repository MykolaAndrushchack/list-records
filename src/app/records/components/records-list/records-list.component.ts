import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {RecordModalComponent} from '../../modals/record-modal/record-modal.component';
import {filter, map, Subscription, tap} from 'rxjs';
import {RecordsFirebaseService} from '../../../services/records-firebase.service';
import {IRecord} from '../../../models/record.interface';
import {Role} from '../../../models/role.enum';
import {Status} from '../../../models/status.enum';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-records-list',
  templateUrl: './records-list.component.html',
  styleUrls: ['./records-list.component.scss']
})
export class RecordsListComponent implements OnInit, OnDestroy {
  data: IRecord[] = [];
  filteredData: IRecord[] = [];
  filterForm!: FormGroup;
  roles = Object.keys(Role);
  statuses = Object.keys(Status);
  filtersApplied = false;

  private _subs: Subscription = new Subscription;

  constructor(private dialog: MatDialog,
              private _recordsFirebaseService: RecordsFirebaseService,
              private _fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.initForm();
    this.getRecords();

   this.changeFilter();
  }

  initForm() {
    this.filterForm = this._fb.group({
      name: [''],
      role: [''],
      status: [''],
    });
  }

  getRecords(): void {
    this._recordsFirebaseService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({...c.payload.doc.data(), id: c.payload.doc.id}))
      )
    ).subscribe((data: IRecord[]) => {
      this.data = data;
    });
  }

  handleOpenModal() {
    const dialogRef = this.dialog.open(RecordModalComponent, {});

    dialogRef.afterClosed()
      .pipe(
        filter(Boolean),
        tap((record) => this._recordsFirebaseService.create(record))
      )
      .subscribe();
  }

  handleEditRecord(record: IRecord) {
    const dialogRef = this.dialog.open(RecordModalComponent, {
      data: record
    });

    dialogRef.afterClosed()
      .pipe(
        filter(Boolean),
        tap((record) => this._recordsFirebaseService.update(record.id, record)),
        tap(() => this.getRecords())
      )
      .subscribe();
  }

  handleDeleteRecord(id: string) {
    this._recordsFirebaseService.delete(id)
      .then(() => {
        this.getRecords();
      })
      .catch(err => console.log(err));
  }

  changeFilter() {
    this._subs =  this.filterForm.valueChanges.subscribe(x => {
      if (!this.filtersApplied) {
        this.filtersApplied = true;
      }

      let filters: any = {};

      if (x?.name) {
        filters.name = (name: string) => name.toLowerCase().includes(x.name.toLowerCase())
      }

      if (x?.role) {
        filters.role = (role: string) => role.toLowerCase() === x.role.toLowerCase()
      }

      if (x?.status) {
        filters.status = (status: string) => status.toLowerCase() === x.status.toLowerCase()
      }

      this.filteredData = this.filterArray(this.data, filters);
    })
  }

  resetFilters() {
    this.filtersApplied = false;
    this.filterForm.reset();
  }

  trackByFn(index: number, item: IRecord) {
    return item.id;
  }

  private filterArray(array: any[], filters: any) {
    const filterKeys = Object.keys(filters);
    return array.filter(item => {
      // validates all filter criteria
      return filterKeys.every(key => {
        // ignores non-function predicates
        if (typeof filters[key] !== 'function') return true;
        return filters[key](item[key]);
      });
    });
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }


}
