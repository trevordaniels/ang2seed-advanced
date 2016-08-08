
import {Injectable} from '@angular/core';
// import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {HttpService} from '../core/services/http.service';
import 'rxjs/add/observable/of';

/*
* Allows for providing hooks for cross platform dev.
* ie., {N} needs to use file-system api to get local files
*/
@Injectable()
export class AuthenticationService {

    private token: string = "sample token";
    private expiryTime: Date;

    constructor(private httpService: HttpService) { }

    getToken(): Observable<string> {

        if (!this.token || !this.expiryTime || this.expiryTime.getTime() <= Date.now()) {
            // console.log("refreshing token");
            return this.authenticate("faee996b1c3f4e85aca06fbfcd32864b", "").map((data: any) => {
                    this.token = data.access_token;
                    this.expiryTime = new Date(Date.now() + parseInt(data.expires_in) * 1000);
                    return `Bearer ${this.token}`;
                });
            // error => {
            //     return Promise.reject("Authentication failed");
            // });
        } else {
            // console.log("using existing token");
            return Observable.of(`Bearer ${this.token}`);
        }
        // return this.auth.authenticate(this.preferences.clientId, this.preferences.clientSecret);
    }

    handleResponse(response: any): any {
        if (typeof (response) == "string") {
            return response.json();
        }
        return response;
    }

    authenticate(primaryKey: string, secondaryKey: string): Observable<any> {
        var params = `grant_type=client_credentials
            &client_id=${encodeURIComponent(primaryKey)}
            &client_secret=${encodeURIComponent(primaryKey)}
            &scope=${encodeURIComponent("https://speech.platform.bing.com")}`;

        let url = "https://oxford-speech.cloudapp.net/token/issueToken";

        return this.httpService.post(url, "application/x-www-form-urlencoded", 'json', params);


        // if (xhr.readyState == 4 && xhr.status === 200) {
    }
}