/* eslint-disable no-undef */
/* eslint-disable arrow-body-style */
import path from 'path';
import request from 'supertest';
import url from './config';

describe('List of products /api/v1/products [GET]', () => {
    it('Should return status code 200 and a list of products', async () => {
        const response = await request(url).get('/api/v1/products');

        expect(response.statusCode).toBe(200);
    })
});

describe('Product details /api/v1/products/:product_id [GET]', () => {
    it('Should return status code 200 and product details', async () => {
        const response = await request(url).get('/api/v1/products/10001');

        expect(response.statusCode).toBe(200);
        expect(Object.keys(response.body).sort()).toEqual(['id', 'name', 'price', 'quantity', 'active', 'category_id', 'ProductImages'].sort());
    })
});

describe('Product details /api/v1/products/:product_id [GET] > wrong product_id', () => {
    it('Should return status code 404 not found exception', async () => {
        const response = await request(url).get('/api/v1/products/10002');

        expect(response.statusCode).toBe(404);
        expect(response.body).toMatchObject({
            message: 'product not found'
        });
    });
});

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

let productId: number;
describe('Creation product /api/v1/products [POST]', () => {
    it('Should return status code 201 and product object created', async () => {
        const response = await request(url).post('/api/v1/products')
            .set({
                Authorization: token,
            })
            .send({
                name: 'Testing product unit',
                price: 40,
                quantity: 100,
                category_id: 1
            });


        expect(response.statusCode).toBe(201);
        expect(Object.keys(response.body).sort()).toEqual(['id', 'name', 'price', 'quantity', 'active', 'category_id'].sort());
        productId = response.body.id;
    });
});

describe('Creation product /api/v1/products [POST] > wrong body', () => {
    it('Should return status code 400 and array of wrong properties', async () => {
        const response = await request(url).post('/api/v1/products')
            .set({
                Authorization: token,
            });

        expect(response.statusCode).toBe(400);
    });
});

describe('Creation product /api/v1/products [POST] > no authorized', () => {
    it('Should return status code 401 No Auth Exception', async () => {
        const response = await request(url).post('/api/v1/products')
            .send({
                name: 'Testing product unit',
                price: 40,
                quantity: 100,
                category_id: 1
            });

        expect(response.statusCode).toBe(401);
        expect(response.body).toMatchObject({
            message: 'Unauthorized'
        });
    });
});

describe('Updating product /api/v1/products/:product_id [PUT]', () => {
    it('Should return status code 200 and updated product', async () => {
        const response = await request(url).put(`/api/v1/products/${productId}`)
            .set({
                Authorization: token,
            })
            .send({
                name: 'Product edited',
                price: 30,
                quantity: 50,
                category_id: 2
            });

        expect(response.statusCode).toBe(200);
        expect(Object.keys(response.body).sort()).toEqual(['id', 'name', 'price', 'quantity', 'category_id'].sort());
    });
});

describe('Updating product /api/v1/products/:product_id [PUT] > wrong body', () => {
    it('Should return status code 400 and error message', async () => {
        const response = await request(url).put(`/api/v1/products/${productId}`)
            .set({
                Authorization: token,
            })
            .send({
                category_id: 'string'
            });

        expect(response.statusCode).toBe(400);
    });
});

describe('Updating product /api/v1/products/:product_id [PUT] > wrong product id', () => {
    it('Should return status code 404 and error message', async () => {
        const response = await request(url).put(`/api/v1/products/10002`)
            .set({
                Authorization: token,
            });

        expect(response.statusCode).toBe(404);
        expect(response.body).toMatchObject({
            message: 'product not found'
        });
    });
});

describe('Updating product /api/v1/products/:product_id [PUT] > wrong category id', () => {
    it('Should return status code 404 and error message', async () => {
        const response = await request(url).put(`/api/v1/products/${productId}`)
            .set({
                Authorization: token,
            })
            .send({
                name: 'Product edited',
                price: 30,
                quantity: 50,
                category_id: 22222
            });;

        expect(response.statusCode).toBe(404);
        expect(response.body).toMatchObject({
            message: 'category not found'
        });
    });
});

describe('Updating product /api/v1/products/:product_id [PUT] > wrong format product id', () => {
    it('Should return status code 422 and error message', async () => {
        const response = await request(url).put(`/api/v1/products/test`)
            .set({
                Authorization: token,
            })
            .send({
                name: 'Product edited',
                price: 30,
                quantity: 50,
                category_id: 1
            });;

        expect(response.statusCode).toBe(422);
        expect(response.body).toMatchObject({
            message: 'The parameter must be a number'
        });
    });
});

describe('Updating product /api/v1/products/:product_id [PUT] > wrong format product id', () => {
    it('Should return status code 422 and error message', async () => {
        const response = await request(url).put(`/api/v1/products/test`)
            .set({
                Authorization: token,
            })
            .send({
                name: 'Product edited',
                price: 30,
                quantity: 50,
                category_id: 1
            });;

        expect(response.statusCode).toBe(422);
        expect(response.body).toMatchObject({
            message: 'The parameter must be a number'
        });
    });
});

describe('Disable product /api/v1/products/:product_id [PATCH]', () => {
    it('Should return status code 200 and success message', async () => {
        const response = await request(url).patch(`/api/v1/products/${productId}`)
            .set({
                Authorization: token,
            })
            .send({
                active: false,
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            message: 'The product has been disabled successfully'
        });
    });
});

describe('Disable product /api/v1/products/:product_id [PATCH]', () => {
    it('Should return status code 422 and error message', async () => {
        const response = await request(url).patch(`/api/v1/products/token`)
            .set({
                Authorization: token,
            })
            .send({
                active: false,
            });

        expect(response.statusCode).toBe(422);
        expect(response.body).toMatchObject({
            message: 'The parameter must be a number'
        });
    });
});

describe('Disable product /api/v1/products/:product_id [PATCH]', () => {
    it('Should return status code 404 and error message', async () => {
        const response = await request(url).patch(`/api/v1/products/10002`)
            .set({
                Authorization: token,
            })
            .send({
                active: false,
            });

        expect(response.statusCode).toBe(404);
        expect(response.body).toMatchObject({
            message: 'product not found'
        });
    });
});

describe('Uploading product image /api/v1/products/:product_id/image', () => {
    it('Should return status code 200 and success message', async () => {
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

describe('Uploading product image /api/v1/products/:product_id/image > image not send', () => {
    it('Should return status code 400 and error message', async () => {
        const response = await request(url).put(`/api/v1/products/${productId}/image`)
            .set({
                Authorization: token
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            message: 'picture is required'
        });
    });
});

// pending upload more than process env picture config

describe('Adding product to a cart /api/v1/products/cart [POST]', () => {
    it('Should return status code 201 and success message', async () => {
        const response = await request(url).post('/api/v1/products/cart')
            .set({
                Authorization: token
            }).send({
                product_id: productId,
                quantity: 1
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({
            message: 'Product added to cart'
        });
    });
});

describe('Adding product to a cart /api/v1/products/cart [POST] > wrong body', () => {
    it('Should return status code 400 and error message', async () => {
        const response = await request(url).post('/api/v1/products/cart')
            .set({
                Authorization: token
            }).send({
                product_id: "productId",
                quantity: 1
            });

        expect(response.statusCode).toBe(400);
    });
});

describe('Adding product to a cart /api/v1/products/cart [POST] > wrong product id', () => {
    it('Should return status code 404 and error message', async () => {
        const response = await request(url).post('/api/v1/products/cart')
            .set({
                Authorization: token
            }).send({
                product_id: 100002,
                quantity: 1
            });

        expect(response.statusCode).toBe(404);
        expect(response.body).toMatchObject({
            message: 'product not found'
        });
    });
});

describe('Adding product to a cart /api/v1/products/cart [POST] > quantity greater than stock', () => {
    it('Should return status code 400 and error message', async () => {
        const response = await request(url).post('/api/v1/products/cart')
            .set({
                Authorization: token
            }).send({
                product_id: productId,
                quantity: 101
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            message: 'Cannot add more than 50'
        });
    });
});

describe('Adding product to a cart /api/v1/products/cart [POST] > product already added', () => {
    it('Should return status code 400 and error message', async () => {
        const response = await request(url).post('/api/v1/products/cart')
            .set({
                Authorization: token
            }).send({
                product_id: productId,
                quantity: 1
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            message: 'product is already added'
        });
    });
});

describe('Removing product to a cart /api/v1/products/:product_id/cart [DELETE]', () => {
    it('Should return status code 200 and success message', async () => {
        const response = await request(url).delete(`/api/v1/products/${productId}/cart`)
            .set({
                Authorization: token
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            message: 'Product was removed'
        });
    });
});

describe('Removing product to a cart /api/v1/products/:product_id/cart [DELETE] > wrong product id', () => {
    it('Should return status code 404 and error message', async () => {
        const response = await request(url).delete(`/api/v1/products/10002/cart`)
            .set({
                Authorization: token
            });

        expect(response.statusCode).toBe(404);
        expect(response.body).toMatchObject({
            message: 'product not found'
        });
    });
});

describe('Removing product to a cart /api/v1/products/:product_id/cart [DELETE]', () => {
    it('Should return status code 400 and error message', async () => {
        const response = await request(url).delete(`/api/v1/products/${productId}/cart`)
            .set({
                Authorization: token
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            message: 'The product is not in the cart'
        });
    });
});

describe('Adding reaction to a product /api/v1/products/:product_id/reaction [POST]', () => {
    it('Should return status code 200 and success message', async () => {
        const response = await request(url).post(`/api/v1/products/${productId}/reaction`)
            .set({
                Authorization: token
            })
            .send({
                reaction_type_id: 1
            });

        expect(response.statusCode).toBe(200);
    });
});

describe('Adding reaction to a product /api/v1/products/:product_id/reaction [POST] > Reaction type not found', () => {
    it('Should return status code 404 and error message', async () => {
        const response = await request(url).post(`/api/v1/products/${productId}/reaction`)
            .set({
                Authorization: token
            })
            .send({
                reaction_type_id: 122
            });;

        expect(response.statusCode).toBe(404);
        expect(response.body).toMatchObject({
            message: 'reaction type not found'
        });
    });
});

describe('Adding reaction to a product /api/v1/products/:product_id/reaction [POST] > Product not found', () => {
    it('Should return status code 404 and error message', async () => {
        const response = await request(url).post(`/api/v1/products/10002/reaction`)
            .set({
                Authorization: token
            })
            .send({
                reaction_type_id: 1
            });;

        expect(response.statusCode).toBe(404);
        expect(response.body).toMatchObject({
            message: 'product not found'
        });
    });
});

describe('Getting product image /api/v1/products/:product_image_id/image [GET]', () => {
    it('Should return status code 200 and success message', async () => {
        const response = await request(url).get(`/api/v1/products/10001/image`);
        
        expect(response.statusCode).toBe(200);
    });
});

describe('Getting prodcut image /api/v1/products/:product_image_id/image [GET] > wrong product image id', () => {
    it('Should return status code 404 and error message', async () => {
        const response = await request(url).get(`/api/v1/products/10002/image`);

        expect(response.statusCode).toBe(404);
        expect(response.body).toMatchObject({
            message: 'Image not found'
        });
    });
});

describe('Deleting product /api/v1/products/:product_id [DELETE] > wrong product id', () => {
    it('Should return status code 404 and error message', async () => {
        const response = await request(url).delete(`/api/v1/products/10002`)
            .set({
                Authorization: token,
            });

        expect(response.statusCode).toBe(404);
        expect(response.body).toMatchObject({
            message: 'product not found'
        });
    });
});

describe('Deleting product /api/v1/products/:product_id [DELETE] > product associated to an order', () => {
    it('Should return status code 400 and error message', async () => {
        const response = await request(url).delete(`/api/v1/products/10001`)
            .set({
                Authorization: token,
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            message: 'Is not possible to delete this product, because it´s associated to an order'
        });
    });
});


describe('Deleting product /api/v1/products/:product_id [DELETE]', () => {
    it('Should return status code 200 and success message', async () => {
        const response = await request(url).delete(`/api/v1/products/${productId}`)
            .set({
                Authorization: token,
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            message: 'Product has been deleted successfully'
        });
    });
});

describe('Deleting product /api/v1/products/:product_id [DELETE] > wrong product id', () => {
    it('Should return status code 422 and error message', async () => {
        const response = await request(url).delete(`/api/v1/products/test`)
            .set({
                Authorization: token,
            });

        expect(response.statusCode).toBe(422);
        expect(response.body).toMatchObject({
            message: 'The parameter must be a number'
        });
    });
});