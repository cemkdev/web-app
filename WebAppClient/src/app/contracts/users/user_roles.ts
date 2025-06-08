export class User_Roles {
    userId: string;
    roles: Role[];
}

export class Role {
    roleId: string;
    roleName: string;
    isAdmin: boolean;
    isAssigned: boolean;
}