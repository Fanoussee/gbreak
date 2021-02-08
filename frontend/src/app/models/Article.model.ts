export class Article {
    uuid_article: string;
    nom: string;
    prenom: string;
    date_heure: Date;

    constructor(
        public uuid_util: string,
        public photo: string,
        public texte: string
    ) { }
}
