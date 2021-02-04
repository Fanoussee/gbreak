export class Utilisateur {
    uuid_util : string;
    constructor(public nom: string,
                public prenom: string, 
                public date_naiss: Date, 
                public moderateur: number,
                public email: string, 
                public mot_passe: string){}
}