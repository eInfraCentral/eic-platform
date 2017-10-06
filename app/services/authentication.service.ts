/**
 * Created by stefania on 8/30/16.
 */
import {Injectable} from "@angular/core";
import {User} from "../domain/eic-model";
import {Http, URLSearchParams} from "@angular/http";
import {deleteCookie, getCookie} from "../domain/utils";
import {Router} from "@angular/router";

@Injectable()
export class AuthenticationService {

    private endpoint = process.env.API_ENDPOINT + ':' + process.env.API_PORT + process.env.API_PATH;

    constructor(private http: Http, private router: Router) {
    }

    isLoggedIn: boolean = false;

    // store the URL so we can redirect after logging in
    redirectUrl: string;

    private _storage: Storage = sessionStorage;

    public clientId = "";

    public redirectUri = "";

    public loginUrl = "";

    public serverLoginURL = "";

    public scope = "";

    login(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
        this.isLoggedIn = true;
    }

    logout() {
        deleteCookie('name');
        sessionStorage.removeItem('name');
        window.location.href = `https://aai.openminted.eu/proxy/saml2/idp/SingleLogoutService.php?ReturnTo=${process.env.API_ENDPOINT}`;
        //https://aai.openminted.eu/registry/auth/logout
    }

    public get isUserLoggedIn(): boolean {
        return sessionStorage.getItem('name') != null;
    }

    public get getLoggedInUser(): string {
        return sessionStorage.getItem('name');
    }

    public tryLogin() {
        if (getCookie('name')) {
            if (!sessionStorage.getItem('name')) {
                this.http.get(this.endpoint + '/user', {withCredentials: true}).subscribe(
                    userInfo => {
                        console.log(userInfo.json());
                        sessionStorage.setItem('name', userInfo.json()['name'])
                    },
                    () => {
                        sessionStorage.removeItem('name');
                        deleteCookie('name');
                    }
                );
            }
        }
        if (sessionStorage.getItem("state.location")) {
            let state = sessionStorage.getItem("state.location");
            sessionStorage.removeItem("state.location");
            this.router.navigateByUrl(state);
        }
    }

    private implicitFlow() {
        let parts = this.getFragment();

        let codeToken = parts["code"];
        let state = parts["state"];

        let oidcSuccess = false;
        let oauthSuccess = false;

        if (!codeToken || !state) return false;

        let savedNonce = this._storage.getItem("nonce");

        if (savedNonce === state) {
            oauthSuccess = true;
        }

        if (!oauthSuccess) return false;
        let params = new URLSearchParams();
        params.append('code', codeToken);
        params.append('state', state);
        console.log(params.toString());

        // this.http.get(this.serverLoginURL +'&'+ params.toString()).subscribe();


        // location.hash = '';

        return true;
    }

    private getFragment() {
        if (window.location.hash.indexOf("#") === 0) {
            return this.parseQueryString(window.location.hash.substr(1));
        } else {
            return {};
        }
    }

    private parseQueryString(queryString) {
        var data = {}, pairs, pair, separatorIndex, escapedKey, escapedValue, key, value;

        if (queryString === null) {
            return data;
        }

        pairs = queryString.split("&");

        for (var i = 0; i < pairs.length; i++) {
            pair = pairs[i];
            separatorIndex = pair.indexOf("=");

            if (separatorIndex === -1) {
                escapedKey = pair;
                escapedValue = null;
            } else {
                escapedKey = pair.substr(0, separatorIndex);
                escapedValue = pair.substr(separatorIndex + 1);
            }

            key = decodeURIComponent(escapedKey);
            value = decodeURIComponent(escapedValue);

            if (key.substr(0, 1) === '/')
                key = key.substr(1);

            data[key] = value;
        }

        return data;
    };

    private createLoginURL() {
        var self = this;

        return this.createAndSaveNonce().then(function (nonce: any) {

            let state = nonce;

            let response_type = "code+token";


            let url = self.loginUrl
                + "?response_type="
                + response_type
                + "&client_id="
                + encodeURIComponent(self.clientId)
                + "&state="
                + encodeURIComponent(state)
                + "&redirect_uri="
                + encodeURIComponent(self.redirectUri)
                + "&scope="
                + encodeURIComponent(self.scope)
                + "&nonce="
                + "1234556";

            return url;
        });
    }

    public initCodeFlow() {
        this.createLoginURL().then(function (url) {
            location.href = url;
        })
            .catch(function (error) {
                console.error("Error in initImplicitFlow");
                console.error(error);
            });
    }

    private createAndSaveNonce() {
        var that = this;
        return this.createNonce().then(function (nonce: any) {
            that._storage.setItem("nonce", nonce);
            return nonce;
        })

    };

    private createNonce() {

        return new Promise((resolve, reject) => {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 40; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            resolve(text);
        });
    };
}