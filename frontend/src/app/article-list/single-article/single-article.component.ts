import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Article } from 'src/app/models/Article.model';
import { Commentaire } from 'src/app/models/Commentaire.model';
import { ArticlesService } from 'src/app/services/articles.service';
import { CommentairesService } from 'src/app/services/commentaires.service';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { Utilisateur } from 'src/app/models/Utilisateur.model';
import { UtilisateursService } from 'src/app/services/utilisateurs.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-single-article',
  templateUrl: './single-article.component.html',
  styleUrls: ['./single-article.component.scss']
})
export class SingleArticleComponent implements OnInit {

  faImage = faImage;

  article = new Article("", "", "");
  articleForm: FormGroup;
  uuid_article: string;
  msgErreur = null;
  modify: boolean = false;
  rightToModify: boolean = false;
  rightToDelete: boolean = false;
  image: File = null;
  imageUrl: string = null;
  uuid_util: string;
  infosUtilActif: Utilisateur;
  moderateur: boolean = false;
  commentaires: Commentaire[];

  constructor(
    private articleService: ArticlesService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private commentairesServices: CommentairesService,
    private utilisateursServices: UtilisateursService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const uuid_util = localStorage.getItem('uuid_util');
    //Vérifie si l'utilisateur existe
    if (uuid_util) {
      this.utilisateursServices.getUtilisateurById(uuid_util).subscribe(
        (utilisateur: Utilisateur) => {
          this.infosUtilActif = utilisateur[0];
          this.uuid_article = this.route.snapshot.params['uuid_article'];
          //Vérifie si l'article existe
          this.articleService.getArticleById(this.uuid_article).subscribe(
            (article: Article) => {
              this.article = article[0];
              this.initForm();
              if (uuid_util === this.article.uuid_util) {
                this.rightToModify = true;
                this.rightToDelete = true;
              }
              if (this.infosUtilActif.moderateur === 1) {
                this.moderateur = true;
                this.rightToDelete = true;
              }
              this.commentairesServices.getCommentairesByUuidArticle(this.uuid_article).subscribe(
                (commentaires: Commentaire[]) => {
                  this.commentaires = commentaires;
                  this.article.nb_commentaires = this.commentaires.length;
                },
                (error) => {
                  this.msgErreur = error.error.erreur;
                }
              );
            },
            (error) => {
              window.alert(error.error.erreur);
              this.router.navigate(['/articles']);
            }
          );
        },
        (error) => {
          window.alert(error.error.erreur);
          this.authService.deconnexion();
        }
      );
    } else {
      window.alert("Vous n'avez pas le droit d'accéder à cette application !");
      this.authService.deconnexion();
    }
  }

  initForm() {
    this.articleForm = this.formBuilder.group({
      photo: null,
      texteModifie: this.article.texte
    });
  }

  onDeleteArticle() {
    //Vérifie si l'uuid de l'utilisateur existe
    this.uuid_util = localStorage.getItem('uuid_util');
    if(this.uuid_util){
      this.utilisateursServices.getUtilisateurById(this.uuid_util).subscribe(
        () => {
          this.uuid_article = this.route.snapshot.params['uuid_article'];
          if (window.confirm("Etes-vous sûr de vouloir supprimer cet article ?")) {
            this.articleService.deleteArticle(this.uuid_article).subscribe(
              () => {
                this.router.navigate(['/articles']);
              },
              (error) => {
                this.msgErreur = error.error.erreur;
              }
            );
          }
        },
        (error) => {
          window.alert(error.error.erreur);
          this.authService.deconnexion();
        }
      );
    }else{
      window.alert("Vous n'avez pas le droit d'accéder à cette application !");
      this.authService.deconnexion();
    }
  }

  onChangeModify() {
    this.modify = !this.modify;
    this.msgErreur = null;
    this.initForm();
  }

  onModifyArticle() {
    const texteModifie = this.articleForm.get('texteModifie').value;
    let nouvellePhoto = null;
    if (this.image != null && this.article.photo == null) {
      nouvellePhoto = this.image.name;
    } else {
      this.image = null;
    }
    this.uuid_util = localStorage.getItem('uuid_util');
    if(this.uuid_util){
      this.utilisateursServices.getUtilisateurById(this.uuid_util).subscribe(
        () => {
          const nouvelArticle = this.newArticle(
            this.article.uuid_util,
            this.article.photo,
            texteModifie);
          if(this.donneesValides(nouvelArticle)){
            this.modifArticle(nouvelArticle, this.image);
          }else{
            this.msgErreur = "Un article doit contenir soit une photo, soit un texte, soit les deux"
            + " et le texte doit contenir au moins 2 caractères.";
          }
        },
        (error) => {
          window.alert(error.error.erreur);
          this.authService.deconnexion();
        }
      );
    }else{
      window.alert("Vous n'avez pas le droit d'accéder à cette application !");
      this.authService.deconnexion();
    }
  }

  onDeletePhoto() {
    this.article.photo = null;
  }

  private newArticle(uuid_util, photo, texte) {
    let nouvelArticle = new Article(uuid_util, photo, texte);
    nouvelArticle.uuid_article = this.uuid_article;
    return nouvelArticle;
  }

  private modifArticle(article: Article, image: File) {
    this.articleService.modifyArticle(article, image).subscribe(
      () => {
        this.router.navigate(['/articles']);
      },
      (error) => {
        this.msgErreur = error.error.erreur;
      }
    );
  }

  onFileSelected(event, file) {
    this.image = <File>event.target.files[0];
    this.getBase64(file[0]).subscribe(str => this.imageUrl = str);
    this.article.photo = null;
  }

  getBase64(file): Observable<string> {
    return new Observable<string>(sub => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        sub.next(reader.result.toString());
        sub.complete();
      };
      reader.onerror = error => {
        sub.error(error);
      };
    })
  }

  private donneesValides(article: Article) {
    if (article.photo == null && article.texte == null) {
      return false;
    } else if (article.texte == null) {
      return true;
    } else {
      return this.verifTailleString(article.texte, 2);
    }
  }

  private verifTailleString(texte: string, taille: number) {
    if (texte.length >= taille) {
      return true;
    } else {
      return false;
    }
  }

}