/* eslint-disable no-undef */
/* eslint-disable arrow-body-style */
import request from 'supertest';
import { faker } from '@faker-js/faker';
import url from './config';

let token: string;
describe('Login endpoint', () => {
    it('Should return status code 200 with token and refresh token', async () => {
        const response = await request(url).post('/api/v1/login').send({
            email: 'ronygcgarcia@gmail.com',
            password: 'admin'
        });

        expect(response.statusCode).toBe(200);
        expect(Object.keys(response.body).sort()).toEqual(['token', 'refresh_token'].sort());
        token = response.body.token;
    })
});

describe('Login > wrong credentials', () => {
    it('Should return status code 200 with token and refresh token', async () => {
        const response = await request(url).post('/api/v1/login').send({
            email: 'ronygcgarcia@gmail.com',
            password: 'admins'
        });

        expect(response.statusCode).toBe(401);
    })
});

describe('Logout endpoint', () => {
    it('Should return status code 200', async () => {
        const response = await request(url).post('/api/v1/logout').set({
            Authorization: token
        });

        expect(response.statusCode).toBe(200);
    })
});

describe('Try to logout when is not logged', () => {
    it('Should return status code 401', async () => {
        const response = await request(url).post('/api/v1/logout');

        expect(response.statusCode).toBe(401);
    })
});

describe('Test for register a new user', () => {
    it('Should return status code 200 and return user object', async () => {
        const email = faker.internet.email();
        const password = 'Admin123';
        const response = await request(url).post('/api/v1/signup').send({
            email,
            password,
            confirm_password: password
        });

        await request(url).post('/api/v1/login').send({
            email,
            password
        });

        expect(response.statusCode).toBe(201);
        expect(Object.keys(response.body).sort()).toEqual(['id', 'email'].sort());
    })
});


describe('Test for register a new user > email taken', () => {
    it('Should return status code 400 and error message', async () => {
        const password = 'Admin123';
        const response = await request(url).post('/api/v1/signup').send({
            email: 'ronygcgarcia@gmail.com',
            password,
            confirm_password: password
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            message: 'This email has been taken'
        });
    })
});

describe('Test for register a new user > passwords does not match', () => {
    it('Should return status code 400 and array of wrong properties', async () => {
        const password = 'Admin123';
        const response = await request(url).post('/api/v1/signup').send({
            email: 'ronygcgarcia@gmail.com',
            password,
            confirm_password: 'password'
        });

        expect(response.statusCode).toBe(400);
    })
});

describe('Confirm user > wrong token', () => {
    it('Should return status code 401 and error message', async () => {
        const response = await request(url).get('/api/v1/user/confirm/token');

        expect(response.statusCode).toBe(401);
    })
});

describe('Recovery password send email', () => {
    it('Should return status code 200 and success message', async () => {
        const response = await request(url).post('/api/v1/user/recovery/password')
            .send({
                email: 'ronygcgarcia@gmail.com'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            message: 'Email has been sent'
        });
    })
});

describe('Recovery password send email > wrong body', () => {
    it('Should return status code 400 and array of wrong properties', async () => {
        const response = await request(url).post('/api/v1/user/recovery/password');

        expect(response.statusCode).toBe(400);
    })
});

describe('Recovery password send email > wrong body', () => {
    it('Should return status code 400 and array of wrong properties', async () => {
        const response = await request(url).post('/api/v1/user/recovery/password');

        expect(response.statusCode).toBe(400);
    })
});