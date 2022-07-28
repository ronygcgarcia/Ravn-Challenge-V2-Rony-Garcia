import moment from "moment";

const users = [
    {
        id: 10001,
        email: 'ronygcgarcia@gmail.com',
        password: '$2a$12$MhjYzaIFCNFEmY.iba/fK.i/XHRCOpSbobnO/jJifxh7DrodgaJaq',
        is_suspended: false,
        token_valid_after: moment().format(),
        verified: true
    },
    {
        id: 10002,
        email: 'ronyacxel503@gmail.com',
        password: '$2a$12$MhjYzaIFCNFEmY.iba/fK.i/XHRCOpSbobnO/jJifxh7DrodgaJaq',
        is_suspended: false,
        token_valid_after: moment().format(),
        verified: true
    },
    {
        id: 10003,
        email: 'ravn-challenge-v2@gmail.com',
        password: '$2a$12$MhjYzaIFCNFEmY.iba/fK.i/XHRCOpSbobnO/jJifxh7DrodgaJaq',
        is_suspended: false,
        token_valid_after: moment().format(),
        verified: true
    }
];

export default users;