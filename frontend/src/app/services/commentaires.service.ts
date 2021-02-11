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

  getCommentairesByUuidArticle(uuid_article){
    return this.http.get<Commentaire[]>(this.urlCommentaires + "/" + uuid_article);
  }
}
