import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable()

export class AuthService {
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
                this.infosUtilisateurActif = infos;
            },
            (err) => {
                this.msgErreur = err.error.erreur;
            }
        );
        return this.http.post<any>(this.urlUtilisateurs, {email, mot_passe});
    }

    deconnexion() {
        localStorage.removeItem('uuid_util');
        localStorage.removeItem('prenom');
        localStorage.removeItem('moderateur');
        localStorage.removeItem('token');
        localStorage.removeItem('expiresIn');
        this.router.navigate(['/connexion']);
    }

    utilisateurConnecte(){
        return !!localStorage.getItem('token');
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getInfosUtilActif(){
        return this.infosUtilisateurActif;
    }

    getMsgErreur(){
        return this.msgErreur;
    }
    
}