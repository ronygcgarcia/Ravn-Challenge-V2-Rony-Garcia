/* eslint-disable @typescript-eslint/ban-types */
export default interface IMail {
    email: string,
    header?: {
        [key: string]: any
    }[],
    subject: string,
    message: string,
    body?: {
        [key: string]: any
    }[],
}