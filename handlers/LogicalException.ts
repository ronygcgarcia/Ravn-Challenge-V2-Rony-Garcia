export default class LogicalException extends Error {
    name: string;

    description: string;

    constructor(name: string, message: string) {
        super(message);
        this.name = name;
        this.description = message;
    }
}
