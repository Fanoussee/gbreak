import { Component, OnInit } from '@angular/core';
import { Utilisateur } from '../models/Utilisateur.model';
import { UtilisateursService } from '../services/utilisateurs.service';

@Component({
  selector: 'app-utilisateurs-list',
  templateUrl: './utilisateurs-list.component.html',
  styleUrls: ['./utilisateurs-list.component.scss']
})
export class UtilisateursListComponent implements OnInit {

  utilisateurs: Utilisateur[];
  msgErreur: string = null;

  constructor(private utilisateurService: UtilisateursService) { }

  ngOnInit() {
    this.utilisateurService.getUtilisateurs().subscribe(
      (utilisateurs: Utilisateur[]) => {
        this.utilisateurs = utilisateurs;
        this.utilisateurs.shift();
        this.utilisateurs.splice(0,2);
      },
      (error) => {
        this.msgErreur = JSON.stringify(error);
      }
    );
  }

}
