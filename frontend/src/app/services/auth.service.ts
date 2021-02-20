import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable()

export class AuthService {
    private isAuth = false;
    private msgErreur = "";
    urlUtilisateurs = 'http://localhost:3000/api/utilisateurs/connexion';
    private infosUtilisateurActif : any;
    prenom: string;
    moderateur: number;

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    connexion(email, mot_passe) : Observable<any>{
        this.http.post(this.urlUtilisateurs, { email, mot_passe }).subscribe(
            (infos: any) => {
                this.isAuth = true;
                this.infosUtilisateurActif = infos;
            },
            (err) => {
                this.msgErreur = err.error.erreur;
            }
        );
        return this.http.post<any>(this.urlUtilisateurs, {email, mot_passe});
        //.do(res => this.setSession)
        //.shareReplay(); 
    }

    /*private setSession(authResult) {
        const expiresAt = moment().add(authResult.expiresIn, 'second');
        localstorage.setItem('id_token', authResult.idToken);
        localstorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));*/

    deconnexion() {
        localStorage.removeItem('uuid_util');
        localStorage.removeItem('prenom');
        localStorage.removeItem('moderateur');
        localStorage.removeItem('token');
        localStorage.removeItem('expiresIn');
        this.isAuth = false;
        this.router.navigate(['/connexion']);
    }

    utilisateurConnecte(){
        return !!localStorage.getItem('token');
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getAuth(){
        return this.isAuth;
    }

    setAuth(value: boolean){
        this.isAuth = value;
    }

    getInfosUtilActif(){
        return this.infosUtilisateurActif;
    }

    setEmailUtilActif(email:string){
        this.infosUtilisateurActif.email = email;
    }

    getMsgErreur(){
        return this.msgErreur;
    }
    
}