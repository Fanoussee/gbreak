import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article } from '../models/Article.model';

@Injectable()

export class ArticlesService {

  private urlArticles = 'http://localhost:3000/api/articles';
  
  constructor(private http: HttpClient) { }

  getArticles(){
    return this.http.get<Article[]>(this.urlArticles);
  }

  getArticleById(id){
    return this.http.get<Article>(this.urlArticles + "/" + id);
  }

  createArticle(article : Article){
    return this.http.post(this.urlArticles, article);
  }

  deleteArticle(uuid_article){
    return this.http.delete(this.urlArticles + "/" + uuid_article);
  }

}