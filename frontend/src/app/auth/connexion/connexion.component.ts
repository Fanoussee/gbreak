import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { rejects } from 'assert';
import { error } from 'protractor';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  authStatut: boolean = false;
  connexionForm: FormGroup;
  @Input() msgErreur: string = null;
  urlUtilisateurs = 'http://localhost:3000/api/utilisateurs';

  //email: "celine.laurent@gmail.com";
  //mot_passe: "celine";

  constructor(private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.connexionForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      mot_passe: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }

  onConnexion() {
    const email = this.connexionForm.get('email').value;
    const mot_passe = this.connexionForm.get('mot_passe').value;
    if (this.donneesValides(email, mot_passe)) {
      this.authService.connexion(email, mot_passe).then(
        () => {
          this.authStatut = this.authService.isAuth;
          console.log("Vous êtes authentifié !");
          this.router.navigate(['/articles']);
        }
      ).catch((error) => {
        this.msgErreur = this.authService.messErreur;
      });
    } else {
      this.msgErreur = "Les données sont incorrectes !";
    }
  }

  private async connectToServer(email, mot_passe) {
    return new Promise((resolve, reject) => {
      resolve(
        this.authService.connexion(email, mot_passe)
      );
    });
  }

  onDeconnexion() {
    this.authService.deconnexion();
    this.authStatut = this.authService.isAuth;
  }

  private donneesValides(email: string, mot_passe: string) {
    let donneesValides = false;
    donneesValides = this.verifEmail(email);
    donneesValides = this.verifMotPasse(mot_passe);
    return donneesValides;
  }

  private verifEmail(email: string) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(regex)) {
      return true;
    } else {
      return false;
    }
  }

  private verifMotPasse(mot_passe: string) {
    const regex = /[0-9a-zA-Z]{6,}/;
    if (mot_passe.match(regex)) {
      return true;
    } else {
      return false;
    }
  }

}
