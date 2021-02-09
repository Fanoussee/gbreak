import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from 'src/app/models/Article.model';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-single-article',
  templateUrl: './single-article.component.html',
  styleUrls: ['./single-article.component.scss']
})
export class SingleArticleComponent implements OnInit {

  article: Article;
  uuid_article: string;
  msgErreur = null;
  modify : boolean = false;
  
  constructor(
    private articleService: ArticlesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.article = new Article("", "", "");
    this.uuid_article = this.route.snapshot.params['uuid_article'];
    this.articleService.getArticleById(this.uuid_article).subscribe(
      (article: Article) => {
        this.article = article[0];
      },
      (error) => {
        this.msgErreur = JSON.stringify(error);
      }
    );
  }

  deleteArticle(){
    if(window.confirm("Etes-vous sûr de vouloir supprimer cet article ?")){
      this.articleService.deleteArticle(this.uuid_article).subscribe(
        () => {
          this.router.navigate(['/articles']);
        },
        (error) => {
          this.msgErreur = JSON.stringify(error);
        }
      );
    }
  }

  changeModify(){
    this.modify = true;
    console.log(this.modify);
  }

}
