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
    
  }

  onDeconnexion() {
    this.authService.deconnexion();
  }

  setIsAuth(value: boolean){
    this.isAuth = value;
  }
  
}
