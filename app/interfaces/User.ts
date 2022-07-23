export default interface User{
    id: number;
    email: string;
    password: string;
    last_login: string | null;
    is_suspended: boolean;
    token_valid_after: string | null;
    verified: boolean;
}