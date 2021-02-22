# gbreak

G pour Groupomania
Break pour pause dans le sens faire un "break" pour les salariés de Groupomania.

Cette application est destiné aux salariés de Groupomania afin d'améliorer la communication entre eux.
Ils peuvent :
 - s'inscrire,
 - se connecter,
 - se déconneter,
 - supprimer leur compte,
 - poster et gérer leurs articles (texte et/ou photo),
 - commenter les articles et gérer leurs commentaires.

Un modérateur a été intégré à l'application afin de pouvoir supprimer un article et/ou un commentaire ainsi qu'un salarié en cas de besoin.

## Prérequis
Afin de pouvoir exécuter l'application, il faut avoir installer : 
- MySQL
- NodeJS
- Npm
- Nodemon
- Angular CLI

## Installation
### MySQL
(Pour PC Windows)
- Télécharger et installer MySQL : https://dev.mysql.com/downloads/mysql/#downloads
- Exécuter la ligne de commande suivante : set PATH=%PATH%;C:\"Program Files"\MySQL\"MySQL Server 8.0"\bin
- Taper ensuite : mysql -h localhost -u root -p
- Saisir votre mot de passe
- Créer la database gbreak en tapant : CREATE DATABASE gbreak CHARACTER SET 'utf8';
- Entrer dans la base de données en tapant : USE gbreak;
- Importer le fichier script en tapant : SOURCE chemin_vers_fichier/gbreak_save.sql;

### NodeJS
- Télécharger et installer la version LTS de NodeJS : https://nodejs.org/en/download/
- Suivre les étapes d'installation en laissant les options par défaut.

### Npm
- Taper en ligne de commande : npm install -g npm@latest

### Nodemon
- Taper en ligne de commande : npm install -g nodemon

### Angular CLI
- Taper en ligne de commande : npm install -g @angular/cli

## Exécution

### Backend
- Ouvrir un terminal sur le dossier backend
- Exécuter le serveur en tapant : npm start

### Frontend
- Ouvrir un terminal sur le dossier frontend
- Lancer l'application en tapant : ng serve -o
(cela ouvre votre navigateur par défaut sur localhost:4200)
