import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  prenom: string;
  moderateur: number;
  urlLogo: any = "../assets/images/icon-left-font-monochrome-black.svg";

  constructor(public authService: AuthService) { }

  ngOnInit(): void { }

  onDeconnexion() {
    this.authService.deconnexion();
  }

  getIsAuth() {
    if (this.authService.utilisateurConnecte()) {
      this.prenom = localStorage.getItem('prenom');
      this.moderateur = +localStorage.getItem('moderateur');
      return true;
    } else {
      return false;
    }
  }

}