import { Commentaire } from "./Commentaire.model";

export class Article {
    uuid_article: string;
    nom: string;
    prenom: string;
    date_heure: Date;
    nb_commentaires: number;
    commentaires: Commentaire[];

    constructor(
        public uuid_util: string,
        public photo: string,
        public texte: string
    ) { }
}
