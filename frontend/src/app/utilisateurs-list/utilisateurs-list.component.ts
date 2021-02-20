import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Utilisateur } from '../models/Utilisateur.model';
import { AuthService } from '../services/auth.service';
import { UtilisateursService } from '../services/utilisateurs.service';

@Component({
  selector: 'app-utilisateurs-list',
  templateUrl: './utilisateurs-list.component.html',
  styleUrls: ['./utilisateurs-list.component.scss']
})
export class UtilisateursListComponent implements OnInit {

  utilisateurs: Utilisateur[];
  msgErreur: string = null;
  infosUtilActif: any;
  moderateur: number = 0;

  constructor(
    private utilisateurService: UtilisateursService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    const uuid_util = localStorage.getItem('uuid_util');
    if(uuid_util){
      this.utilisateurService.getUtilisateurById(uuid_util).subscribe(
        (utilisateur: Utilisateur) => {
          this.moderateur = utilisateur[0].moderateur;
          if(this.moderateur === 1){
            this.utilisateurService.getUtilisateurs().subscribe(
              (utilisateurs: Utilisateur[]) => {
                this.utilisateurs = utilisateurs;
                this.infosUtilActif = this.authService.getInfosUtilActif();
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
      window.alert("Vous n'avez pas le droit d'accéder à cette application.");
      this.authService.deconnexion();
    }
  }

  onDeleteUtilisateur(index){
    const uuid_util = localStorage.getItem('uuid_util');
    if(uuid_util){
      this.utilisateurService.getUtilisateurById(uuid_util).subscribe(
        (utilisateur: Utilisateur) => {
          this.moderateur = utilisateur[0].moderateur;
          if(this.moderateur === 1){
            if(window.confirm(
              "Etes-vous sûr de vouloir supprimer "
               + this.utilisateurs[index].prenom + " " + this.utilisateurs[index].nom
               + " de la liste des utilisateurs ?"
            )){
                this.utilisateurService.deleteUtilisateur(this.utilisateurs[index].uuid_util).subscribe(
                  () => {
                    this.router.navigate(["/articles"]);
                  },
                  (error) => {
                    this.msgErreur = error.error.erreur;
                  }
                );
            }
          }else{
            window.alert("Vous n'êtes pas modérateur.");
            this.router.navigate(['/articles']);
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