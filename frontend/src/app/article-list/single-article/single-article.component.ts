import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Article } from 'src/app/models/Article.model';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-single-article',
  templateUrl: './single-article.component.html',
  styleUrls: ['./single-article.component.scss']
})
export class SingleArticleComponent implements OnInit {

  article: Article;
  articleForm: FormGroup;
  uuid_article: string;
  msgErreur = null;
  modify: boolean = false;
  image: File = null;
  imageUrl: string = null;

  constructor(
    private articleService: ArticlesService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.article = new Article("", "", "");
    this.uuid_article = this.route.snapshot.params['uuid_article'];
    this.articleService.getArticleById(this.uuid_article).subscribe(
      (article: Article) => {
        this.article = article[0];
        this.initForm();
      },
      (error) => {
        this.msgErreur = JSON.stringify(error);
      }
    );
  }

  initForm() {
    this.articleForm = this.formBuilder.group({
      photo: null,
      texteModifie: this.article.texte
    });
  }

  onDeleteArticle() {
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
      const nouvelArticle = this.newArticle(
        this.article.uuid_util,
        null,
        texteModifie);
      this.modifWithFile(nouvelArticle, this.image);
    } else {
      const nouvelArticle = this.newArticle(
        this.article.uuid_util,
        this.article.photo,
        texteModifie);
        this.modifWithoutFile(nouvelArticle);
    }
  }

  newArticle(uuid_util, photo, texte){
    let nouvelArticle = new Article(uuid_util, photo, texte);
    nouvelArticle.uuid_article = this.uuid_article;
    return nouvelArticle;
  }

  modifWithFile(article: Article, image: File){
    this.articleService.modifyArticleWithFile(article, image).subscribe(
      () => {
        this.router.navigate(['/articles']);
      },
      (error) => {
        this.msgErreur = error.error.erreur;
      }
    );
  }

  modifWithoutFile(article: Article){
    this.articleService.modifyArticleWithoutFile(article).subscribe(
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
