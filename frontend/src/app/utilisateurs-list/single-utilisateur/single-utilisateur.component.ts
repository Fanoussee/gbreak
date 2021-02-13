import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UtilisateursService } from 'src/app/services/utilisateurs.service';

@Component({
  selector: 'app-single-utilisateur',
  templateUrl: './single-utilisateur.component.html',
  styleUrls: ['./single-utilisateur.component.scss']
})
export class SingleUtilisateurComponent implements OnInit {

  infosUtilisateurActif : any;
  moderateur: boolean = false;

  constructor(
    private authService : AuthService,
    private utilisateursService: UtilisateursService
  ) { }

  ngOnInit(): void {
    this.infosUtilisateurActif = this.authService.getInfosUtilActif();
    if(this.infosUtilisateurActif.moderateur === 1){
      this.moderateur = true;
    }
  }

  onDeleteUtilisateur(){
    if (window.confirm("Etes-vous sûr de vouloir supprimer votre compte ?")){
      this.utilisateursService.deleteUtilisateur(this.infosUtilisateurActif.uuid_util).subscribe(
        () => {
          this.authService.setAuth(false);
        },
        (error) => {
          //à voir
        }
      );
    }
  }

}
