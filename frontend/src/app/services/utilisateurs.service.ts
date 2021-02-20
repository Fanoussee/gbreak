import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Utilisateur } from "../models/Utilisateur.model";

@Injectable()

export class UtilisateursService {

  private urlUtilisateurs = 'http://localhost:3000/api/utilisateurs';

  constructor(private http: HttpClient) { }

  createUtilisateur(utilisateur: Utilisateur){
    return this.http.post<any>(this.urlUtilisateurs + "/inscription", utilisateur);
  }

  getUtilisateurs() {
    return this.http.get<Utilisateur[]>(this.urlUtilisateurs);
  }

  getUtilisateurById(uuid_util: string){
    return this.http.get<Utilisateur>(this.urlUtilisateurs + "/" + uuid_util);
  }

  modifyUtilisateur(uuid_util: string, values: any){
    return this.http.put(this.urlUtilisateurs + "/" + uuid_util, values);
  }

  deleteUtilisateur(uuid_util: string){
    return this.http.delete(this.urlUtilisateurs + "/" + uuid_util);
  }

}