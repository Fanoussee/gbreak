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
        if (this.donneesValides) {
            this.http.post(this.urlUtilisateurs + '/connexion', infosConnect);
            this.isAuth = true;
        } else {
            this.messErreur = "Les données saisies sont incorrectes !";
        }
    }

    deconnexion() {
        this.isAuth = false;
    }

    private donneesValides({ email, mot_passe }) {
        let donneesValides = false;
        donneesValides = this.verifEmail(email);
        donneesValides = this.verifTailleString(mot_passe, 5);
        return donneesValides;
    }

    private verifTailleString(texte: string, taille: number) {
        if (texte.length >= taille) {
            return true;
        } else {
            return false;
        }
    }

    private verifEmail(email: string) {
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (email.match(regex)) {
            return true;
        } else {
            return false;
        }
    }
}