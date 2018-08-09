import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class BaseMoodjaApi {
  private baseApi = 'https://internal-api.moodja.com/';

  constructor(public http: HttpClient) {
  }

  private getUrl(url: string = ''): string {
    return this.baseApi + url;
  }

  public get(url: string = '', options): Observable<any> {
    return this.http.get(this.getUrl(url), options);
  }

  public post(url: string = '', data: any = {}, headers = {}): Observable<any> {
    return this.http.post(this.getUrl(url), data, headers);
  }

  public put(url: string = '', data: any = {}, headers = {}): Observable<any> {
    return this.http.put(this.getUrl(url), data, headers);
  }

  public delete(url: string = '', data: any = {}): Observable<any> {
    return this.http.delete(this.getUrl(url), data);
  }
}
