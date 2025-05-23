export class AssignRoleEndpoint {
    roleId: string;
    roleEndpoints: RoleEndpoint[] = [];
}

export class RoleEndpoint {
    menuName: string;
    endpointCode: string;
    isAuthorized: boolean;
}