import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article } from '../models/Article.model';

@Injectable()

export class ArticlesService {

  private urlArticles = 'http://localhost:3000/api/articles';
  
  constructor(private http: HttpClient) { }

  createArticle(article : Article, image: File){
    const formData = new FormData();
    formData.append('article', JSON.stringify(article));
    formData.append('image', image);
    return this.http.post(this.urlArticles, formData);
  }

  getArticles(){
    return this.http.get<Article[]>(this.urlArticles);
  }

  getArticleById(id){
    return this.http.get<Article>(this.urlArticles + "/" + id);
  }

  modifyArticle(article: Article, image: File){
    const formData = new FormData();
    formData.append('article', JSON.stringify(article));
    formData.append('image', image);
    return this.http.put(this.urlArticles + "/" + article.uuid_article, formData);
  }

  deleteArticle(uuid_article){
    return this.http.delete(this.urlArticles + "/" + uuid_article);
  }

}