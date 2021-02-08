import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    const photo = this.articleForm.get('photo').value;
    const texte = this.articleForm.get('texte').value;
    const uuid_util = "9032306b-2b12-41d7-b1f9-fa1ecd61b52d";
    const newArticle = new Article(uuid_util, photo, texte);
    if(this.donneesValides(newArticle)){
      this.articlesService.createArticle(newArticle).subscribe(
        () => {
          this.router.navigate(['/articles']);
        },
        (error) => {
          this.msgErreur = error.error.erreur;
        }
      );
    }else{
      this.msgErreur = "Un article doit contenir soit une photo, soit un texte, soit les deux."
                       + " Les informations saisies doivent contenir au moins 2 caractères.";
    }
  }
  
  onResetForm(){
    this.initForm();
    this.msgErreur = null;
  }

  private donneesValides(article: Article) {
    if(article.photo == null && article.texte == null){
      return false;
    }
    if(article.photo != null && article.texte == null){
      return this.verifTailleString(article.photo, 2);
    }
    if(article.photo == null && article.texte != null){
      return this.verifTailleString(article.texte, 2);
    }
    if(article.photo != null && article.texte != null) {
      return this.verifTailleString(article.photo, 2) && this.verifTailleString(article.texte, 2);
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