export class List_User {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    twoFactorEnabled: string;
    dateCreated: Date;
    dateUpdated: Date;
}

////////////////////////////// View Model
export class List_User_VM {
    id: string;
    user: string;
    // firstName: string;
    // lastName: string;
    // userName: string;
    email: string;
    phoneNumber: string;
    twoFactorEnabled: string;
    dateCreated: Partial<any>;
    dateUpdated: Partial<any>;
}