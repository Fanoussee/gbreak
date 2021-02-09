import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Utilisateur } from "../models/Utilisateur.model";

@Injectable()

export class UtilisateursService {

  private urlUtilisateurs = 'http://localhost:3000/api/utilisateurs';

  constructor(private http: HttpClient) { }

  getUtilisateurs() {
    return this.http.get<Utilisateur[]>(this.urlUtilisateurs);
  }

  getOneUtilisateur(){
    
  }

  createUtilisateur(utilisateur: Utilisateur){
    return this.http.post(this.urlUtilisateurs + "/inscription", utilisateur);
  }

}