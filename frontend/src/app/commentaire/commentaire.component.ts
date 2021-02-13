import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Commentaire } from '../models/Commentaire.model';
import { AuthService } from '../services/auth.service';
import { CommentairesService } from '../services/commentaires.service';
import { faAngleRight, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-commentaire',
  templateUrl: './commentaire.component.html',
  styleUrls: ['./commentaire.component.scss']
})
export class CommentaireComponent implements OnInit {

  faAngleRight = faAngleRight;
  faCheckCircle = faCheckCircle;
  
  newCommentForm: FormGroup;
  
  commentaires: Commentaire[];
  infosUtilActif: any;
  @Input() uuid_article: string;
  msgErreur: string = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private commentairesServices: CommentairesService,
    private router: Router) { }

  ngOnInit(): void {
    this.initNewCommentForm();
    this.infosUtilActif = this.authService.getInfosUtilActif();
    this.commentairesServices.getCommentairesByUuidArticle(this.uuid_article).subscribe(
      (commentaires: Commentaire[]) => {
        this.commentaires = commentaires;
      },
      (error) => {
        this.msgErreur = error;
      });
  }

  initNewCommentForm(){
    this.newCommentForm = this.formBuilder.group({
      newComment: ""
    });
  }

  onAjouterCommentaire(){
    let newCommentaire : Commentaire = new Commentaire (
      this.infosUtilActif.uuid_util,
      this.newCommentForm.get("newComment").value
    );
    newCommentaire.uuid_article = this.uuid_article;
    this.commentairesServices.ajouterCommentaire(newCommentaire).subscribe(
      () => {
        this.router.navigate(["/articles"]);
      }
    );
  }

}
