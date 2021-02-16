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

  constructor(
    private utilisateurService: UtilisateursService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.utilisateurService.getUtilisateurs().subscribe(
      (utilisateurs: Utilisateur[]) => {
        this.utilisateurs = utilisateurs;
        this.infosUtilActif = this.authService.getInfosUtilActif();
      },
      (error) => {
        this.msgErreur = JSON.stringify(error);
      }
    );
  }

  onDeleteUtilisateur(index){
    if(window.confirm(
      "Etes-vous sûr de vouloir supprimer "
       + this.utilisateurs[index].prenom + " " + this.utilisateurs[index].nom
       + " de la liste des utilisateurs ?"
    )){
        this.utilisateurService.deleteUtilisateur(this.utilisateurs[index].uuid_util).subscribe(
          () => {
            this.router.navigate(["/articles"]);
          }
        );
    }
  }

}
