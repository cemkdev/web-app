export class User_Roles {
    userId: string;
    roles: Role[];
}

export class Role {
    roleId: string;
    roleName: string;
    isAssigned: boolean;
}