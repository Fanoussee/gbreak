import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Utilisateur } from "../models/Utilisateur.model";

@Injectable()

export class AuthService {
    isAuth = false;
    messErreur = "";

    utilisateurs = new Subject<Utilisateur[]>();
    urlUtilisateurs = 'http://localhost:3000/api/utilisateurs';

    constructor() { }

    deconnexion() {
        this.isAuth = false;
    }
    
}