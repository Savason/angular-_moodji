import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BaseApi} from '../../shared/base-api/base-api.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Activity} from '../../shared/models/activity.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable()
export class ActivitiesService extends BaseApi {
  public Activities = [];
  public totalActivitiesCount = 0;
  public Activities$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(this.Activities);

  constructor(public http: HttpClient) {
    super(http);
  }

  getAllActivities(searchParams): Observable<any> {
    return this.get(`api/activities?page=${searchParams}`);
  }
  setDataActivity(data) {
    return this.Activities$.next(data);
  }

  addToActivitiesList(data) {
    this.Activities$.next(this.Activities$.getValue().concat(data));
  }
}


