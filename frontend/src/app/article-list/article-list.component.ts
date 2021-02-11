import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../models/Article.model';
import { ArticlesService } from '../services/articles.service';
import { faArrowCircleUp, faArrowCircleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Commentaire } from '../models/Commentaire.model';
import { CommentairesService } from '../services/commentaires.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {

  faArrowDown = faArrowCircleDown;
  faArrowUp = faArrowCircleUp;
  faAngleRight = faAngleRight;

  articles: Article[];
  msgErreur: string = null;
  affCommentaires: boolean = false;
  commentairesArticleActif: Commentaire[];
  nbCommentaires: number ;

  constructor(
    private articlesService: ArticlesService,
    private commentairesServices: CommentairesService
  ) { }

  ngOnInit() {
    this.articlesService.getArticles().subscribe(
      (articles : Article[]) => {
        this.articles = articles;
        this.articles.forEach(element => {
          this.commentairesServices.getCommentairesByUuidArticle(element.uuid_article).subscribe(
            (commentaires: Commentaire[]) => {
              element.commentaires = commentaires;
              element.nb_commentaires = element.commentaires.length;
            },
            (error) => {
              this.msgErreur = error;
            }
          );
        });
      },
      (error) => {
        this.msgErreur = error.error.erreur;
      }
    );
  }
  
  afficherCommentaires(index){
    this.affCommentaires = !this.affCommentaires;
    this.commentairesArticleActif = this.articles[index].commentaires;
  }

}