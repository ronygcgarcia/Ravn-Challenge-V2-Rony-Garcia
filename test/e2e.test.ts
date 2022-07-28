/* eslint-disable no-undef */
/* eslint-disable arrow-body-style */
import request from 'supertest';
import { faker } from '@faker-js/faker';
import path from 'path';
import url from './config';

let token: string;
describe('Login endpoint', () => {
    it('Should return status code 200 with token and refresh token', async () => {
        const response = await request(url).post('/api/v1/login').send({
            email: 'ronyacxel503@gmail.com',
            password: 'admin'
        });

        expect(response.statusCode).toBe(200);
        expect(Object.keys(response.body).sort()).toEqual(['token', 'refresh_token'].sort());
        token = response.body.token;
        })
});

describe('Try to logout when is not logged', () => {
    it('Should return status code 401', async () => {
        const response = await request(url).post('/api/v1/logout');

        expect(response.statusCode).toBe(401);
    })
});

let clientToken: string;
describe('Test for register a new user', () => {
    it('Should return status code 200 and return user object', async () => {
        const email = faker.internet.email();
        const password = 'Admin123';
        const response = await request(url).post('/api/v1/signup').send({
            email,
            password,
            confirm_password: password
        });

        const login = await request(url).post('/api/v1/login').send({
            email,
            password
        });
        clientToken = login.body.token;

        expect(response.statusCode).toBe(201);
        expect(Object.keys(response.body).sort()).toEqual(['id', 'email'].sort());
    })
})

describe('List of products', () => {
    it('Should return status code 200 and an array of products', async () => {
        const response = await request(url).get('/api/v1/products');

        expect(response.statusCode).toBe(200);
    });
});

let productId: number;
describe('Creation of product', () => {
    it('Should return status code 201 and the product object', async () => {
        const response = await request(url).post('/api/v1/products').send({
            name: 'Testing product',
            price: 10,
            quantity: 50,
            category_id: 1
        })
            .set({
                Authorization: token
            });

        expect(response.statusCode).toBe(201);
        expect(Object.keys(response.body).sort()).toEqual(['id', 'name', 'price', 'quantity', 'active', 'category_id'].sort());
        productId = response.body.id;
    });
});

describe('Updating a product', () => {
    it('Should return status code 200 and the updated product object', async () => {
        const response = await request(url).put(`/api/v1/products/${productId}`).send({
            name: 'Product 1',
            price: 20,
            quantity: 25,
            category_id: 2
        })
            .set({
                Authorization: token
            });

        expect(response.statusCode).toBe(200);
        expect(Object.keys(response.body).sort()).toEqual(['id', 'name', 'price', 'quantity', 'category_id'].sort());
    });
});

describe('Disable a product', () => {
    it('Should return status code 200 and a success message', async () => {
        const response = await request(url).patch(`/api/v1/products/${productId}`)
            .send({
                active: false
            })
            .set({
                Authorization: token
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            message: 'The product has been disabled successfully'
        });
    });
});

describe('Upload an image', () => {
    it('Should return status code 200 and a success message', async () => {
        const image = path.resolve(__dirname, `./assets/product.jpg`);
        const response = await request(url).put(`/api/v1/products/${productId}/image`)
            .attach('picture', image)
            .set({
                Authorization: token
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({
            message: 'Image saved succesfully'
        });
    });
});

const productImage = 10001;
describe('Detail product', () => {
    it('Should return status code 200 and detail product', async () => {
        const response = await request(url).get(`/api/v1/products/${productId}`);

        expect(response.statusCode).toBe(200);
        expect(Object.keys(response.body).sort()).toEqual(['id', 'name', 'price', 'quantity', 'active', 'category_id', 'ProductImages'].sort());
    });
});

describe('Getting product image', () => {
    it('Should return status code 200 and a success message', async () => {
        const response = await request(url).get(`/api/v1/products/${productImage}/image`);

        expect(response.statusCode).toBe(200);
    });
});

describe('Adding a product to cart', () => {
    it('Should return status code 201 and the product object', async () => {
        const response = await request(url).post(`/api/v1/products/cart`).send({
            quantity: 1,
            product_id: productId
        }).set({
            Authorization: clientToken
        });

        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({
            message: 'Product added to cart'
        });
    });
});

describe('Adding reaction to a product', () => {
    it('Should return status code 200', async () => {
        const response = await request(url).post(`/api/v1/products/${productId}/reaction`)
            .send({
                reaction_type_id: 1
            })
            .set({
                Authorization: clientToken
            });
        expect(response.statusCode).toBe(200);
    });
});

describe('Removing a product from cart', () => {
    it('Should return status code 200 and a success message', async () => {
        const response = await request(url).delete(`/api/v1/products/${productId}/cart`)
            .set({
                Authorization: clientToken
            });
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            message: 'Product was removed'
        });
    });
});

describe('List of orders', () => {
    it('Should return status code 200 and an array of orders', async () => {
        const response = await request(url).get('/api/v1/orders').set({
            Authorization: clientToken
        });

        expect(response.statusCode).toBe(200);
    });
});

let order: number;
describe('Creating and order', () => {
    it('Should return status code 200 order object created', async () => {
        await request(url).post(`/api/v1/products/cart`).send({
            quantity: 1,
            product_id: productId
        }).set({
            Authorization: clientToken
        });

        const response = await request(url).post('/api/v1/orders')
            .send({
                address: 'address',
                phone: '77665544'
            }).set({
                Authorization: clientToken
            });

        expect(response.statusCode).toBe(200);
        expect(Object.keys(response.body).sort()).toEqual(['id', 'order_date', 'total', 'user_id', 'address', 'phone', 'status_id'].sort());
        order = response.body.id;
    });
});

describe('Show order details', () => {
    it('Should return status code 200 and order details', async () => {
        const response = await request(url).get(`/api/v1/orders/${order}`).set({
            Authorization: clientToken
        });
        expect(response.statusCode).toBe(200);
    });
});

describe('Update order status', () => {
    it('Should return status code 200 and a success message', async () => {
        const response = await request(url).post(`/api/v1/orders/${order}/payment`).set({
            Authorization: clientToken
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            message: 'Order successfully paid'
        });
    });
});

describe('Deleting a product', () => {
    it('Should return status code 200 and a success message', async () => {
        const product = await request(url).post('/api/v1/products').send({
            name: 'Testing product',
            price: 10,
            quantity: 50,
            category_id: 1
        }).set({
            Authorization: token
        });

        const response = await request(url).delete(`/api/v1/products/${product.body.id}`)
            .set({
                Authorization: token
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            message: 'Product has been deleted successfully'
        });
        productId = response.body.id;
    });
});

describe('Logout endpoint', () => {
    it('Should return status code 200', async () => {
        const response = await request(url).post('/api/v1/logout').set({
            Authorization: token
        });

        expect(response.statusCode).toBe(200);
    })
});