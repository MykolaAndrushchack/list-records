import {Role} from './role.enum';
import {Status} from './status.enum';

export interface IRecord {
  id: string;
  name: string;
  address: string;
  amount: number;
  role: Role;
  status: Status;
}
