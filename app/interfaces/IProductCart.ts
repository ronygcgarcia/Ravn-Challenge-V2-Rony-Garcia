export default interface IProductCart {
    cart_id: number
    product_id: number;
    quantity: number;
    product: {
        id: number
        name: string
        price: number
        quantity: number
        active: boolean
        category_id: number
    }
}