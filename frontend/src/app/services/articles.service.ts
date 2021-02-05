import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Article } from '../models/Article.model';

@Injectable({ providedIn: 'root' })

export class ArticlesService implements OnInit {

  private urlApi = 'http://localhost:3000/api/articles';
  articlesSubject = new Subject<Article[]>();
  oneArticleSubject = new Subject<Article>();
  msgErreur = "";
  articles = [];
  
  constructor(private http: HttpClient) { }

  ngOnInit() { }

  createArticle(article: Article, image: File) {
  }

  getArticles() {
    this.http.get(this.urlApi).subscribe(
      (articles: Article[]) => {
        this.articlesSubject.next(articles);
      },
      (error) => {
        this.articlesSubject.next([]);
        this.msgErreur = error;
      }
    );
  }

  getArticleById(idArticle: string) {
    const url = this.urlApi + "/" + idArticle;
    this.http.get(url).subscribe(
      (article: Article) => {
        this.oneArticleSubject.next(article);
      },
      (error) => {
        this.oneArticleSubject.next();
        this.msgErreur = error;
      }
    );
  }

  modifyArticle() {
  }

  deleteArticle() {
  }

}