import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Utilisateur } from 'src/app/models/Utilisateur.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit {

  inscriptionForm: FormGroup;
  msgErreur: string = null;
  urlUtilisateurs = 'http://localhost:3000/api/utilisateurs';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
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
      this.http.post(this.urlUtilisateurs + "/inscription", newUser).subscribe(
        () => {
          this.authService.isAuth = true;
          this.router.navigate(['/articles']);
        },
        (error) => {
          this.authService.isAuth = false;
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
    donneesValides = this.verifTailleString(utilisateur.nom, 2);
    donneesValides = this.verifTailleString(utilisateur.prenom, 2);
    donneesValides = this.verifMotPasse(utilisateur.mot_passe);
    donneesValides = this.verifDate(utilisateur.date_naiss);
    donneesValides = utilisateur.moderateur === 0 || utilisateur.moderateur === 1;
    donneesValides = this.verifEmail(utilisateur.email);
    return donneesValides;
  }

  private verifTailleString(texte: string, taille: number) {
    if (texte.length >= taille) {
      return true;
    } else {
      return false;
    }
  }

  private verifDate(date_naiss: Date) {
    const aujourdhui = new Date();
    let nbMilliSecAuj = aujourdhui.getMilliseconds();
    let nbMillisecMajeur = 24 * 60 * 60 * 1000 * 365 * 18;
    const dateMajorite = nbMilliSecAuj - nbMillisecMajeur;
    const majeur = new Date(dateMajorite);
    if (date_naiss <= majeur) {
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