/* eslint-disable no-undef */
/* eslint-disable arrow-body-style */
import request from 'supertest';
import url from './config';

let token: string;
describe('Login endpoint /api/v1/login [POST]', () => {
    it('Should return status code 200 with token and refresh token', async () => {
        const response = await request(url).post('/api/v1/login').send({
            email: 'ravn-challenge-v2@gmail.com',
            password: 'admin'
        });

        expect(response.statusCode).toBe(200);
        expect(Object.keys(response.body).sort()).toEqual(['token', 'refresh_token'].sort());
        token = response.body.token;
    })
});

describe('List of orders /api/v1/orders [GET]', () => {
    it('Should return status code 200 and a list of orders', async () => {
        const response = await request(url).get('/api/v1/orders')
            .set({
                Authorization: token
            });

        expect(response.statusCode).toBe(200);
    })
});

describe('Order detail /api/v1/orders/:order_id [GET]', () => {
    it('Should return status code 200 and order detail', async () => {
        const response = await request(url).get('/api/v1/orders/10001')
            .set({
                Authorization: token
            });

        expect(response.statusCode).toBe(200);
        expect(Object.keys(response.body).sort()).toEqual([
            'id',
            'order_date',
            'total',
            'user_id',
            'address',
            'phone',
            'status_id',
            'OrderDetail'
        ].sort());
    });
});

describe('Order detail /api/v1/orders/:order_id [GET]', () => {
    it('Should return status code 404 and error message', async () => {
        const response = await request(url).get('/api/v1/orders/10002')
            .set({
                Authorization: token
            });

        expect(response.statusCode).toBe(404);
        expect(response.body).toMatchObject({
            message: 'order not found'
        });
    });
});

describe('Creates an order /api/v1/orders', () => {
    it('Should return status 200 and orders object', async () => {
        const response = await request(url).post('/api/v1/orders')
            .set({
                Authorization: token
            })
            .send({
                address: 'address',
                phone: '77482233'
            });

        expect(response.statusCode).toBe(200);
        expect(Object.keys(response.body).sort()).toEqual([
            'id',
            'order_date',
            'total',
            'user_id',
            'address',
            'phone',
            'status_id'
        ].sort());
    });
});

describe('Creates an order /api/v1/orders > wrong body request', () => {
    it('Should return status 400 and error message', async () => {
        const response = await request(url).post('/api/v1/orders')
            .set({
                Authorization: token
            });

        expect(response.statusCode).toBe(400);
    });
});

describe('Creates an order /api/v1/orders/:order_id/payment', () => {
    it('Should return status 200 and success message', async () => {
        const response = await request(url).post('/api/v1/orders/10001/payment')
            .set({
                Authorization: token
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            message: 'Order successfully paid'
        });
    });
});

describe('Creates an order /api/v1/orders/:order_id/payment > wrong order id', () => {
    it('Should return status 404 and error message', async () => {
        const response = await request(url).post('/api/v1/orders/10002/payment')
            .set({
                Authorization: token
            });

        expect(response.statusCode).toBe(404);
        expect(response.body).toMatchObject({
            message: 'order not found'
        });
    });
});