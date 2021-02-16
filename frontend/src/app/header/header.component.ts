import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuth: boolean;
  prenom: string;
  moderateur: number;
  private infosUtilActif: any;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.isAuth = false;
    this.prenom = "";
    this.moderateur = 0;
    /*console.log("initialisation du header");
    this.isAuth = this.authService.getAuth();
    if(this.isAuth){
      this.infosUtilActif = this.authService.getInfosUtilActif();
      this.moderateur = this.infosUtilActif.moderateur;
      this.prenom = this.infosUtilActif.prenom;
    }else{
      this.prenom = "";
      this.moderateur = 0;
    }*/
    //this.getIsAuth();

  }

  onDeconnexion() {
    
    this.isAuth = false;
  }

  getIsAuth() {
    /*this.isAuth = this.authService.getAuth();
    if(this.isAuth){
      this.infosUtilActif = this.authService.getInfosUtilActif();
      try {
        this.moderateur = this.infosUtilActif.moderateur;
        this.prenom = this.infosUtilActif.prenom;
      } catch (error) {
        this.moderateur = 0;
        this.prenom = "";
      }
    }
    return this.isAuth;*/
  }

}
