import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuth: boolean;
  prenom: string ;
  moderateur: number ;
  private infosUtilActif: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isAuth = this.authService.getAuth();
    this.prenom = "";
    this.moderateur = 0;
  }

  onDeconnexion() {
    this.authService.deconnexion();
    this.isAuth = false;
  }

  getIsAuth() {
    if(this.authService.getAuth()){
      this.infosUtilActif = this.authService.getInfosUtilActif();
      this.moderateur = this.infosUtilActif.moderateur;
      this.prenom = this.infosUtilActif.prenom;
      return true;
    }else{
      return false;
    }
  }

}
