import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Article } from '../models/Article.model';
import { ArticlesService } from '../services/articles.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {

  articleSubscription: Subscription;
  articles: Article[];
  msgErreur = "" ;

  constructor(private articleService: ArticlesService) { }

  ngOnInit() {
    this.articleSubscription = this.articleService.articlesSubject.subscribe(
      (articles :Article[]) => {
        this.articles = articles;
      },
      (error) => {
        this.msgErreur = error;
      }
    );
    this.articleService.getArticles();
  }
  
}