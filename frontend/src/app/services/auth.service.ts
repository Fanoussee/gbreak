import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { Utilisateur } from "../models/Utilisateur.model";

@Injectable()

export class AuthService {
    private isAuth = false;
    messErreur = "";

    utilisateurs = new Subject<Utilisateur[]>();
    urlUtilisateurs = 'http://localhost:3000/api/utilisateurs/connexion';

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    connexion(email, mot_passe){
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
    
}