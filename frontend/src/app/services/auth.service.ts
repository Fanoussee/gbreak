import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Utilisateur } from "../models/Utilisateur.model";

@Injectable()

export class AuthService {
    isAuth = false;
    messErreur = "";

    utilisateurs = new Subject<Utilisateur[]>();
    urlUtilisateurs = 'http://localhost:3000/api/utilisateurs';

    constructor(private http: HttpClient) { }

    connexion(email: string, mot_passe: string) {
        const infosConnect = {
            email,
            mot_passe
        };
        if (this.donneesValides(infosConnect)) {
            return new Promise((resolve, reject) => {
                this.http.post(this.urlUtilisateurs + '/connexion', infosConnect).subscribe(
                    (value) => {
                        this.isAuth = true;
                        this.messErreur = null;
                        resolve(value);
                    },
                    (error) => {
                        this.messErreur = error.error.erreur;
                        reject(error);
                    });
            });
        } else {
            this.messErreur = "Les données saisies sont incorrectes !";
        }
    }

    deconnexion() {
        this.isAuth = false;
    }

    getIsAuth(){
        return this.isAuth;
    }

    private donneesValides({ email, mot_passe }) {
        let donneesValides = false;
        donneesValides = this.verifEmail(email);
        donneesValides = this.verifMotPasse(mot_passe);
        return donneesValides;
    }

    private verifEmail(email: string) {
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (email.match(regex)) {
            return true;
        } else {
            return false;
        }
    }

    private verifMotPasse(mot_passe: string) {
        const regex = /[0-9a-zA-Z]{6,}/;
        if (mot_passe.match(regex)) {
            return true;
        } else {
            return false;
        }
    }
}