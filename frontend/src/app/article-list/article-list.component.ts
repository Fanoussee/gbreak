import { Component, OnInit } from '@angular/core';
import { Article } from '../models/Article.model';
import { ArticlesService } from '../services/articles.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {

  articles: Article[];
  msgErreur: string = null;

  constructor(private articlesService: ArticlesService) { }

  ngOnInit() {
    this.articlesService.getArticles().subscribe(
      (articles : Article[]) => {
        this.articles = articles;
      },
      (error) => {
        console.log(error);
        this.msgErreur = JSON.stringify(error);
      }
    );
  }

  ajouterArticle(){
    console.log("J'ai ajouté un article !");
  }
}