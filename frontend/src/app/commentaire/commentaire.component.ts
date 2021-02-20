import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Commentaire } from '../models/Commentaire.model';
import { CommentairesService } from '../services/commentaires.service';
import { faAngleRight, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { UtilisateursService } from '../services/utilisateurs.service';
import { Utilisateur } from '../models/Utilisateur.model';
import { AuthService } from '../services/auth.service';

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
  infosUtilActif = new Utilisateur ("", "", null, 0, "", "");
  @Input() uuid_article: string;
  msgErreur: string = null;

  constructor(
    private formBuilder: FormBuilder,
    private commentairesServices: CommentairesService,
    private utilisateursServices: UtilisateursService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.initNewCommentForm();
    const uuid_util = localStorage.getItem('uuid_util');
    if(uuid_util){
      //Récupération du nom et du prénom de l'utilisateur connecté
      this.utilisateursServices.getUtilisateurById(uuid_util).subscribe(
        (utilisateur: Utilisateur) => {
          this.infosUtilActif = utilisateur[0];
          //Récupération des commentaires de l'article sélectionné
          this.commentairesServices.getCommentairesByUuidArticle(this.uuid_article).subscribe(
            (commentaires: Commentaire[]) => {
              this.commentaires = commentaires;
            },
            (error) => {
              this.msgErreur = error.error.erreur;
            });
        },
        (error) => {
          window.alert(error.error.erreur);
          this.authService.deconnexion();
        }
      );
    }else{
      window.alert("Vous n'avez pas le droit d'accéder à cette application.");
      this.authService.deconnexion();
    }
  }

  initNewCommentForm() {
    this.newCommentForm = this.formBuilder.group({
      newComment: ""
    });
  }

  onAjouterCommentaire() {
    const uuid_util = localStorage.getItem('uuid_util');
    if(uuid_util){
      this.utilisateursServices.getUtilisateurById(uuid_util).subscribe(
        () => {
          let newCommentaire: Commentaire = new Commentaire(
            uuid_util,
            this.newCommentForm.get("newComment").value
          );
          newCommentaire.uuid_article = this.uuid_article;
          this.commentairesServices.ajouterCommentaire(newCommentaire).subscribe(
            () => {
              this.ngOnInit();
            }
          );
        },
        (error) => {
          window.alert(error.error.erreur);
          this.authService.deconnexion();
        }
      );
    }else{
      window.alert("Vous n'avez pas le droit d'accéder à cette application.");
      this.authService.deconnexion();
    }
  }

}