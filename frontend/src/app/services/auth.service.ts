import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()

export class AuthService {
    private isAuth = false;
    messErreur = "";
    urlUtilisateurs = 'http://localhost:3000/api/utilisateurs/connexion';
    private infosUtilisateurActif : any;

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    connexion(email, mot_passe){
        this.http.post(this.urlUtilisateurs, { email, mot_passe }).subscribe(
            (infos: any) => {
                this.infosUtilisateurActif = infos;
            },
            (err) => {
                this.messErreur = err;
            }
        );
        return this.http.post(this.urlUtilisateurs, {email, mot_passe});
    }

    deconnexion() {
        this.isAuth = false;
        this.router.navigate(['/connexion']);
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
    
}