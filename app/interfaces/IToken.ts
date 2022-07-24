import User from "./IUser"

export default interface IToken {
    user: User;
    roles: string[];
    iat: number;
    exp: number;
}