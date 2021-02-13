import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Commentaire } from '../models/Commentaire.model';

@Injectable({
  providedIn: 'root'
})
export class CommentairesService {

  private urlCommentaires = 'http://localhost:3000/api/commentaires';

  constructor(private http: HttpClient) { }

  getCommentaires(){
    return this.http.get<Commentaire[]>(this.urlCommentaires);
  }

  getCommentairesByUuidArticle(uuid_article: string){
    return this.http.get<Commentaire[]>(this.urlCommentaires + "/" + uuid_article);
  }

  ajouterCommentaire(commentaire : Commentaire){
    return this.http.post(this.urlCommentaires + "/" + commentaire.uuid_article, commentaire);
  }

  modifyCommentaire(uuid_commentaire: string, texteCommentaire: string){
    const texte = { commentaire : texteCommentaire };
    return this.http.put(this.urlCommentaires + "/" + uuid_commentaire, texte);
  }

  deleteCommentaire(uuid_commentaire: string){
    return this.http.delete(this.urlCommentaires + "/" + uuid_commentaire);
  }
}
