import {User} from './user.model';

export class Activity {
  constructor(public createdAt?: any,
              public username?: string,
              public name?: string,
  ) {
  }
}
