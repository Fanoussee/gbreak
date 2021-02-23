import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UtilisateursService } from 'src/app/services/utilisateurs.service';
import { Utilisateur } from 'src/app/models/Utilisateur.model';


@Component({
  selector: 'app-single-utilisateur',
  templateUrl: './single-utilisateur.component.html',
  styleUrls: ['./single-utilisateur.component.scss']
})
export class SingleUtilisateurComponent implements OnInit {

  infosUtilisateurActif = new Utilisateur ("", "", null, 0, "", "");
  moderateur: boolean;
  msgErreur;

  constructor(
    private authService: AuthService,
    private utilisateursService: UtilisateursService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.msgErreur = null;
    this.moderateur = false;
    const uuid_util = localStorage.getItem('uuid_util');
    if(uuid_util){
      this.utilisateursService.getUtilisateurById(uuid_util).subscribe(
        (utilisateur: Utilisateur) => {
          this.infosUtilisateurActif = utilisateur[0];
          if (this.infosUtilisateurActif.moderateur == 1) {
            this.moderateur = true;
          }
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

  onDeleteUtilisateur() {
    const uuid_util = localStorage.getItem('uuid_util');
    if(uuid_util && uuid_util === this.infosUtilisateurActif.uuid_util){
      this.utilisateursService.getUtilisateurById(uuid_util).subscribe(
        () => {
          if (window.confirm("Etes-vous sûr de vouloir supprimer votre compte ?")) {
            this.utilisateursService.deleteUtilisateur(this.infosUtilisateurActif.uuid_util).subscribe(
              () => {
                this.authService.deconnexion();
              },
              (error) => {
                this.msgErreur = error.error.erreur;
              }
            );
          } else {
            this.router.navigate(["/articles"]);
          }
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