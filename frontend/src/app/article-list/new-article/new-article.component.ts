import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Article } from 'src/app/models/Article.model';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-new-article',
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.scss']
})
export class NewArticleComponent implements OnInit {

  articleForm: FormGroup;
  msgErreur: string = null;
  image: File = null;
  imageUrl: string = null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private articlesService: ArticlesService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.articleForm = this.formBuilder.group({
      photo: null,
      texte: null
    });
  }

  onAjouterArticle() {
    let photo = null;
    if (this.image != null) {
      photo = this.image.name;
    }
    const texte = this.articleForm.get('texte').value;
    const uuid_util = "9032306b-2b12-41d7-b1f9-fa1ecd61b52d";
    const newArticle = new Article(uuid_util, photo, texte);
    if (this.donneesValides(newArticle)) {
      this.articlesService.createArticle(newArticle, this.image).subscribe(
        () => {
          this.router.navigate(['/articles']);
        },
        (error) => {
          this.msgErreur = error.error.erreur;
        }
      );
    } else {
      this.msgErreur = "Un article doit contenir soit une photo, soit un texte, soit les deux."
        + " Les informations saisies doivent contenir au moins 2 caractères.";
    }

  }

  onResetForm() {
    this.initForm();
    this.msgErreur = null;
  }

  onFileSelected(event, file) {
    this.image = <File>event.target.files[0];
    this.getBase64(file[0]).subscribe(str => this.imageUrl = str);
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