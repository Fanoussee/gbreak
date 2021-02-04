import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Article } from 'src/app/models/Article.model';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-single-article',
  templateUrl: './single-article.component.html',
  styleUrls: ['./single-article.component.scss']
})
export class SingleArticleComponent implements OnInit {

  article: Article;

  constructor(private articleService: ArticlesService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.article = this.route.snapshot.params['id'];
  }

  onGetOneArticle(){

  }

}
