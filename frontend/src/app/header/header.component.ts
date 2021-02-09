import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuth : boolean ;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isAuth = this.authService.getAuth();
  }

  onDeconnexion() {
    this.authService.deconnexion();
    this.isAuth = false;
  }

  getIsAuth(){
    return this.authService.getAuth();
  }

  setIsAuth(value: boolean){
    this.isAuth = this.authService.getAuth();
  }
  
}
