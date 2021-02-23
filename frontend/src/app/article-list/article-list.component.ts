import { Component, OnInit } from '@angular/core';
import { Article } from '../models/Article.model';
import { ArticlesService } from '../services/articles.service';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { CommentairesService } from '../services/commentaires.service';
import { Commentaire } from '../models/Commentaire.model';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Utilisateur } from '../models/Utilisateur.model';

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
  infosUtilActif = new Utilisateur("", "", null, 0, "", "");
  rightToModify: boolean;
  rightToDelete: boolean;

  constructor(
    private articlesService: ArticlesService, 
    private commentairesServices : CommentairesService,
    private authService: AuthService,
    private router: Router
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
              if(error instanceof HttpErrorResponse) {
                if(error.status === 401){
                  this.router.navigate(['/connexion']);
                }
              }
            }
          );
        });
      },
      (error) => {
        if(error instanceof HttpErrorResponse) {
          if(error.status === 401){
            this.router.navigate(['/connexion']);
          }
        }
      }
    );
  }

}