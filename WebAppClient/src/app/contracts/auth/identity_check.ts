export class IdentityCheck {
    userId: string;
    username: string;
    isAuthenticated: boolean;
    expiration: Date;
    refreshBeforeTime: string;
    isAdmin: boolean;
}