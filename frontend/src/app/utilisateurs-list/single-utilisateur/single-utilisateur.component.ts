import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UtilisateursService } from 'src/app/services/utilisateurs.service';
import { faPenSquare, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Utilisateur } from 'src/app/models/Utilisateur.model';


@Component({
  selector: 'app-single-utilisateur',
  templateUrl: './single-utilisateur.component.html',
  styleUrls: ['./single-utilisateur.component.scss']
})
export class SingleUtilisateurComponent implements OnInit {

  faPenSquare = faPenSquare;
  faTimesCircle = faTimesCircle;

  passwordForm: FormGroup;
  emailForm: FormGroup;

  infosUtilisateurActif = new Utilisateur ("", "", null, 0, "", "");
  moderateur: boolean = false;
  msgErreur;
  modifyEmail: boolean;

  constructor(
    private authService: AuthService,
    private utilisateursService: UtilisateursService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.msgErreur = null;
    this.modifyEmail = false;
    const uuid_util = localStorage.getItem('uuid_util');
    this.utilisateursService.getUtilisateurById(uuid_util).subscribe(
      (utilisateur: Utilisateur) => {
        this.infosUtilisateurActif = utilisateur[0];
        this.initEmailForm();
        this.initPasswordForm();
        if (this.infosUtilisateurActif.moderateur == 1) {
          this.moderateur = true;
        }
      },
      (error) => {
        this.msgErreur = error;
      }
    );
  }

  initPasswordForm() {
    this.passwordForm = this.formBuilder.group({
      prenom: this.infosUtilisateurActif.prenom,
      nom: this.infosUtilisateurActif.nom,
      dateNaiss: this.infosUtilisateurActif.date_naiss,
      email: this.infosUtilisateurActif.email,
      mdp: "default"
    });
  }

  initEmailForm() {
    this.emailForm = this.formBuilder.group({
      email: this.infosUtilisateurActif.email
    });
  }

  onChangeModifyEmail() {
    this.modifyEmail = !this.modifyEmail;
    this.initEmailForm();
  }

  onModifyEmail() {
    const uuid_util = this.infosUtilisateurActif.uuid_util;
    const values = { email: this.emailForm.get("email").value };
    this.utilisateursService.modifyUtilisateur(uuid_util, values).subscribe(
      () => {
        this.authService.setEmailUtilActif(values.email);
        this.router.navigate(["/articles"]);
      },
      (error) => {
        this.msgErreur = "La modification n'a pas fonctionnée !";
      }
    );
  }

  onModifyUtilisateur() {
    const uuid_util = this.infosUtilisateurActif.uuid_util;
    const values = {
      mot_passe: this.passwordForm.get("mdp").value
    }
    this.utilisateursService.modifyUtilisateur(uuid_util, values).subscribe(
      () => {
        this.router.navigate(["/articles"]);
      },
      (error) => {
        this.msgErreur = error.error.erreur;
        ;
      }
    );
  }

  onDeleteUtilisateur() {
    if (window.confirm("Etes-vous sûr de vouloir supprimer votre compte ?")) {
      this.utilisateursService.deleteUtilisateur(this.infosUtilisateurActif.uuid_util).subscribe(
        () => {
          this.authService.deconnexion();
        },
        (error) => {
          this.msgErreur = error;
        }
      );
    } else {
      this.router.navigate(["/articles"]);
    }
  }

}
