import User from "./User"
export default interface Token {
    user: User;
    roles: string[];
    iat: number;
    exp: number;
}