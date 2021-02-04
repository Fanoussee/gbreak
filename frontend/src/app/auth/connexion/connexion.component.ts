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

  authStatut: boolean;
  connexionForm: FormGroup;
  msgErreur: string;
  //email: "celine.laurent@gmail.com";
  //mot_passe: "celine";

  constructor(private authService: AuthService,
              private router: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.authStatut = this.authService.isAuth;
  }

  onConnexion() {
    const email = this.connexionForm.get('email').value;
    const mot_passe = this.connexionForm.get('mot_passe').value;
    this.authService.connexion(email, mot_passe);
    this.authStatut = this.authService.isAuth;
    this.router.navigate(['/articles']);
  }

  onDeconnexion() {
    this.authService.deconnexion();
    this.authStatut = this.authService.isAuth;
  }

  initForm(){
    this.connexionForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      mot_passe: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }

}
