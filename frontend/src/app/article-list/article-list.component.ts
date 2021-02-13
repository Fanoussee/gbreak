import { Component, OnInit } from '@angular/core';
import { Article } from '../models/Article.model';
import { ArticlesService } from '../services/articles.service';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { CommentairesService } from '../services/commentaires.service';
import { Commentaire } from '../models/Commentaire.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {

  faArrowRight = faArrowCircleRight;

  articles: Article[];
  msgErreur: string = null;
  nbCommentaires: number ;
  infosUtilActif: any;
  rightToModify: boolean;
  rightToDelete: boolean;

  constructor(
    private articlesService: ArticlesService, 
    private commentairesServices : CommentairesService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.articlesService.getArticles().subscribe(
      (articles : Article[]) => {
        this.articles = articles;
        this.articles.forEach(element => {
          this.commentairesServices.getCommentairesByUuidArticle(element.uuid_article).subscribe(
            (commentaires: Commentaire[]) => {
              this.infosUtilActif = this.authService.getInfosUtilActif();
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

}