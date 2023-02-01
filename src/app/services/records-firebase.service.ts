import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {IRecord} from '../models/record.interface';

@Injectable({
  providedIn: 'root'
})
export class RecordsFirebaseService {

  private dbPath = '/records';

  recordsRef: AngularFirestoreCollection<IRecord>;

  constructor(private db: AngularFirestore) {
    this.recordsRef = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<IRecord> {
    return this.recordsRef;
  }

  create(record: IRecord): any {
    return this.recordsRef.add({ ...record });
  }

  update(id: string, data: IRecord): Promise<void> {
    return this.recordsRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.recordsRef.doc(id).delete();
  }
}
