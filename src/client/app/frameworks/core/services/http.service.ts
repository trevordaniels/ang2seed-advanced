import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
* Allows for providing hooks for cross platform dev.
* ie., {N} needs to use file-system api to get local files
*/
@Injectable()
export class HttpService {
  constructor(private http:Http) {
    
  }
  
  public get(url: string): Observable<any> {
    return this.http.get(url)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  public upload(url: string, contentType: string, data: any, authToken?: string): Observable<any> {
    return Observable.create((observer: any) => {
      let xhr: XMLHttpRequest = new XMLHttpRequest();


      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            observer.next(JSON.parse(xhr.response));
            observer.complete();
          } else {
            observer.error(xhr.response);
          }
        }
      };
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', contentType);
      xhr.setRequestHeader('Authorization', authToken);
      xhr.send(data);
    });
  }
  
  public post(url: string, contentType: string, responseType: string, data: any, authToken?: string ): Observable<any> {

    // let body = JSON.stringify({ data }); client should json stringify data if required
    let headers = new Headers({
      'Content-Type': contentType,
      "Authorization": authToken
    });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, data, options)
      .map((response: Response) => {
        console.log(response); 
        return response.json();
      })
      .catch(this.handleError);
  }

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(error); // log to console instead
    return Observable.throw(errMsg);
  }
}
