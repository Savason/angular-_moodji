import {Injectable} from '@angular/core';
import {BaseMoodjaApi} from '../../../shared/base-api/base-moodja-api.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class InboundsService extends BaseMoodjaApi {

  constructor(public http: HttpClient) {
    super(http);
  }

  getInboundsList(): Observable<any> {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Accept': 'application/json',
    //   'Authorization': `Basic ` + btoa('ALEX_TEXT:x)-(JtB1C39KcYm^e.G*')
    // });
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Basic ' + btoa('ALEX_TEXT:x)-(JtB1C39KcYm^e.G*'));
    console.log(btoa('ALEX_TEXT:x)-(JtB1C39KcYm^e.G*'));
    return this.get(`purchase_order`,  {headers: headers});
  }
}
