export class Commentaire {
    nom: string;
    prenom: string;
    uuid_article: string;
    uuid_commentaire: string;
    date_commentaire: Date;
    constructor(public uuid_util:string, public commentaire: string){}
}