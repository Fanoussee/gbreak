import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Utilisateur } from "../models/Utilisateur.model";

export class UtilisateursService {

  utilisateurs = new Subject<Utilisateur[]>();
  urlUtilisateurs = 'http://localhost:3000/api/utilisateurs';

  constructor(private http: HttpClient) { }

  createUtilisateur(utilisateur : Utilisateur){

  }

  getUtilisateurs() {
    this.http.get(this.urlUtilisateurs).subscribe(
      (utilisateurs: Utilisateur[]) => {
        this.utilisateurs.next(utilisateurs);
      },
      (error) => {
        this.utilisateurs.next([]);
        console.log(error);
      }
    );
  }

  getUtilisateurById(idUtil: string) {

  }

  modifyUtilisateur() {

  }

  deleteUtilisateur() {

  }

}