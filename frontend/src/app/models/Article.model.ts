export class Article {
    photo: string;
    texte: string;
    constructor(public uuid_article: string,
                public uuid_util: string,
                public date_heure: Date, 
                public nb_commentaires: number){}
}