import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArticlesService } from './services/articles.service';
import { SingleArticleComponent } from './article-list/single-article/single-article.component';
import { ConnexionComponent } from './auth/connexion/connexion.component';
import { InscriptionComponent } from './auth/inscription/inscription.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { NewArticleComponent } from './article-list/new-article/new-article.component';
import { HeaderComponent } from './header/header.component';

const appRoutes : Routes = [
  { path: 'articles', canActivate: [AuthGuard], component: ArticleListComponent },
  { path: 'articles/new', canActivate: [AuthGuard], component: NewArticleComponent },
  { path: 'articles/:uuid_article', canActivate: [AuthGuard], component: SingleArticleComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: '', component: ConnexionComponent },
  { path: '**', component: ConnexionComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ArticleListComponent,
    SingleArticleComponent,
    ConnexionComponent,
    InscriptionComponent,
    NewArticleComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    ArticlesService,
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
