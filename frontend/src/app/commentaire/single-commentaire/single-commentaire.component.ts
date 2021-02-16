import { Component, Input, OnInit } from '@angular/core';
import { Commentaire } from 'src/app/models/Commentaire.model';
import { faAngleRight, faCheckCircle, faPenSquare, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommentairesService } from 'src/app/services/commentaires.service';
import { Router } from '@angular/router';


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
    private router: Router) { }

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
    const texte = this.modifyCommentForm.get("modifyComment").value;
    this.commentairesServices.modifyCommentaire(this.commentaire.uuid_commentaire, texte).subscribe(
      () => {
        this.router.navigate(["/articles"]);
      },
      (error) => {
        this.msgErreur = error;
      }
    );
  }

  onDeleteCommentaire() {
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
  }

}
