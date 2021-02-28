import { Basket } from '../../typings';

export const exampleBasket1: Basket = {
    products: [
        {
            sku: 'BEANS',
            qty: 4,
        },
        {
            sku: 'BIS45',
            qty: 1,
        },
    ],
};

export const exampleBasket2: Basket = {
    products: [
        {
            sku: 'BEANS',
            qty: 2,
        },
        {
            sku: 'BIS45',
            qty: 1,
        },
        {
            sku: 'SRD123',
            qty: 2,
        },
    ],
};

export const exampleBasket3: Basket = {
    products: [
        {
            sku: 'SHAMLG',
            qty: 3,
        },
        {
            sku: 'SHAMMD',
            qty: 1,
        },
        {
            sku: 'SHAMSM',
            qty: 2,
        },
    ],
};

export const exampleBasket4: Basket = {
    products: [
        {
            sku: 'BEANS',
            qty: 3,
        },
        {
            sku: 'SHAMSM',
            qty: 2,
        },
        {
            sku: 'SHAMMD',
            qty: 1,
        },
        {
            sku: 'SHAMLG',
            qty: 3,
        },
        {
            sku: 'SRD123',
            qty: 2,
        },
    ],
};

export const nonExistanceBasketProduct: Basket = {
    products: [{ sku: 'IDONOTEXIST', qty: 10 }],
};
