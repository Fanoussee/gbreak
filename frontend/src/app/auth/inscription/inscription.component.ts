import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Utilisateur } from 'src/app/models/Utilisateur.model';
import { AuthService } from 'src/app/services/auth.service';
import { UtilisateursService } from 'src/app/services/utilisateurs.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit {

  inscriptionForm: FormGroup;
  msgErreur: string = null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private utilisateursService: UtilisateursService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.inscriptionForm = this.formBuilder.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      date_naiss: ['', [Validators.required]],
      moderateur: [0, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mot_passe: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }

  onInscription() {
    const nom = this.inscriptionForm.get('nom').value;
    const prenom = this.inscriptionForm.get('prenom').value;
    const date_naiss = this.inscriptionForm.get('date_naiss').value;
    const moderateur = 0;
    const email = this.inscriptionForm.get('email').value;
    const mot_passe = this.inscriptionForm.get('mot_passe').value;
    const newUser = new Utilisateur(nom, prenom, date_naiss, moderateur, email, mot_passe);
    if(this.donneesValides(newUser)){
      this.utilisateursService.createUtilisateur(newUser).subscribe(
        () => {
          this.authService.connexion(email, mot_passe).subscribe(
            (res: any) => {
              localStorage.setItem('uuid_util', res.uuid_util);
              localStorage.setItem('prenom', res.prenom);
              localStorage.setItem('moderateur', res.moderateur);
              localStorage.setItem('token', res.token);
              localStorage.setItem('expiresIn', res.expiresIn);
              this.router.navigate(['/articles']);
            },
            (error) => {
              this.msgErreur = this.authService.getMsgErreur();
            }
          );
        },
        (error) => {
          this.msgErreur = error.error.erreur;
        }
      );
    }else{
      this.msgErreur = "Les données sont invalides !";
    }
  }
  
  onResetForm(){
    this.initForm();
    this.msgErreur = null;
  }

  private donneesValides(utilisateur: Utilisateur) {
    let donneesValides = false;
    donneesValides = 
      this.verifTailleString(utilisateur.nom, 2) &&
      this.verifTailleString(utilisateur.prenom, 2) &&
      this.verifMotPasse(utilisateur.mot_passe) &&
      this.verifDate(utilisateur.date_naiss) &&
      this.verifEmail(utilisateur.email);
    return donneesValides;
  }

  private verifTailleString(texte: string, taille: number) {
    if (texte.length >= taille) {
      return true;
    } else {
      return false;
    }
  }

  private verifDate(date_naiss) {
    const verifDate_naiss = new Date (date_naiss);
    let aujourdhui = new Date();
    const annee = aujourdhui.getFullYear();
    const mois = aujourdhui.getMonth();
    const jour = aujourdhui.getDate();
    const majeur = new Date("" + (annee - 18) + "-" + mois + "-" + jour);
    if (verifDate_naiss <= majeur) {
      return true;
    } else {
      return false;
    }
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