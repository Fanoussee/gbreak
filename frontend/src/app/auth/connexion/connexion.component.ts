import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  connexionForm: FormGroup;
  msgErreur: string = null;
  urlUtilisateurs = 'http://localhost:3000/api/utilisateurs/connexion';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService){}

  ngOnInit() {
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
      this.authService.connexion(email, mot_passe).subscribe(
        (res: any) => {
          console.log(res);
          localStorage.setItem('token', res.token);
          localStorage.setItem('expiresIn', res.expiresIn);
          this.authService.setAuth(true);
          this.router.navigate(['/articles']);
        },
        (error) => {
          this.authService.setAuth(false);
          this.msgErreur = this.authService.getMsgErreur();
        }
      );
    } else {
      this.msgErreur = "Les données sont invalides !";
    }
  }

  onResetForm(){
    this.initForm();
    this.msgErreur = null;
  }

  onDeconnexion() {
    this.authService.deconnexion();
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
