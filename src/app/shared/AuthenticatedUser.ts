export class AuthenticatedUser {
    AuthToken: string;
    Username: string;
    Name: string;
    Surname: string;
    ValidTo: Date;

    constructor(AuthToken: string, Username: string, Name: string, Surname: string, ValidTo: Date)
    {
        this.AuthToken = AuthToken;
        this.Username = Username;
        this.Name = Name;
        this.Surname = Surname;
        this.ValidTo = ValidTo;
    }
}