import { Component, Input, OnInit } from '@angular/core';
import { Commentaire } from 'src/app/models/Commentaire.model';
import { faAngleRight, faCheckCircle, faPenSquare, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommentairesService } from 'src/app/services/commentaires.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UtilisateursService } from 'src/app/services/utilisateurs.service';

@Component({
  selector: 'app-single-commentaire',
  templateUrl: './single-commentaire.component.html',
  styleUrls: ['./single-commentaire.component.scss']
})
export class SingleCommentaireComponent implements OnInit {

  faAngleRight = faAngleRight;
  faCheckCircle = faCheckCircle;
  faPenSquare = faPenSquare;
  faTimesCircle = faTimesCircle;

  @Input() index: number;
  @Input() commentaire: Commentaire;
  @Input() infosUtilActif: any;

  modify: boolean;
  msgErreur: string = null;

  modifyCommentForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private commentairesServices: CommentairesService,
    private router: Router,
    private authService: AuthService,
    private utilisateursService: UtilisateursService) { }

  ngOnInit(): void {
    this.modify = false;
  }

  initModifyCommentForm() {
    this.modifyCommentForm = this.formBuilder.group({
      modifyComment: this.commentaire.commentaire
    });
  }

  onChangeModify() {
    this.modify = !this.modify;
    this.msgErreur = null;
    this.initModifyCommentForm();
  }

  onModifyCommentaire() {
    const uuid_util = localStorage.getItem('uuid_util');
    if (uuid_util) {
      this.utilisateursService.getUtilisateurById(uuid_util).subscribe(
        () => {
          const texte = this.modifyCommentForm.get("modifyComment").value;
          if(this.donneesValides(texte)){
            this.commentairesServices.modifyCommentaire(this.commentaire.uuid_commentaire, texte).subscribe(
              () => {
                this.router.navigate(["/articles"]);
              },
              (error) => {
                this.msgErreur = error;
              }
            );
          }else{
            this.msgErreur = "Le texte doit contenir au moins deux caractères.";
          }
        },
        (error) => {
          window.alert(error.error.erreur);
          this.authService.deconnexion();
        }
      );
    } else {
      window.alert("Vous n'avez pas le droit d'accéder à cette application.");
      this.authService.deconnexion();
    }
  }

  onDeleteCommentaire() {
    const uuid_util = localStorage.getItem('uuid_util');
    if (uuid_util) {
      this.utilisateursService.getUtilisateurById(uuid_util).subscribe(
        () => {
          if (window.confirm("Etes-vous sûr de vouloir supprimer ce commentaire ?")) {
            this.commentairesServices.deleteCommentaire(this.commentaire.uuid_commentaire).subscribe(
              () => {
                this.router.navigate(["/articles"]);
              },
              (error) => {
                this.msgErreur = error;
              }
            );
          }
        },
        (error) => {
          window.alert(error.error.erreur);
          this.authService.deconnexion();
        }
      );
    } else {
      window.alert("Vous n'avez pas le droit d'accéder à cette application.");
      this.authService.deconnexion();
    }
  }

  private donneesValides(texte: string) {
    if (texte == null) {
      return false;
    } else {
      return this.verifTailleString(texte, 2);
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