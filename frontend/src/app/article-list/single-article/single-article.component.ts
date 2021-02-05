import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Article } from 'src/app/models/Article.model';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-single-article',
  templateUrl: './single-article.component.html',
  styleUrls: ['./single-article.component.scss']
})
export class SingleArticleComponent implements OnInit {

  article: Article;
  articleSubscription: Subscription;
  msgErreur = null;
  
  constructor(private articleService: ArticlesService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.articleSubscription = this.articleService.oneArticleSubject.subscribe(
      (article :Article) => {
        this.article = article;
      },
      (error) => {
        this.msgErreur = error;
      }
      );
      const id = this.route.snapshot.params['uuid_article'];
      this.articleService.getArticleById(id);
      
  }

}
