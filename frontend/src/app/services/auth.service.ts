import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { Utilisateur } from "../models/Utilisateur.model";

@Injectable()

export class AuthService {
    private msgErreur = "";
    urlUtilisateurs = "http://localhost:3000/api/utilisateurs";
    private infosUtilisateurActif : any;
    prenom: string;
    moderateur: number;

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    connexion(email, mot_passe) : Observable<any>{
        this.http.post(this.urlUtilisateurs + "/connexion", { email, mot_passe }).subscribe(
            (infos: any) => {
                this.infosUtilisateurActif = infos;
            },
            (err) => {
                this.msgErreur = err.error.erreur;
            }
        );
        return this.http.post<any>(this.urlUtilisateurs + "/connexion", {email, mot_passe});
    }

    inscription(utilisateur: Utilisateur) : Observable<any>{
        this.http.post(this.urlUtilisateurs + "/inscription", utilisateur).subscribe(
            (infos: any) => {
                this.infosUtilisateurActif = infos;
            },
            (err) => {
                this.msgErreur = err.error.erreur;
            }
        );
        return this.http.post<any>(this.urlUtilisateurs + "/inscription", utilisateur);
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