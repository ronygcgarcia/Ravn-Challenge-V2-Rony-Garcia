export default interface User{
    id: number;
    email: string;
    password: string;
    last_login: string;
    is_suspended: boolean;
    token_valid_after: string;
    verified: boolean;
}