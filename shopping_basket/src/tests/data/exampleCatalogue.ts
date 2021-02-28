import { ProductCatalogue } from '../../typings';

const exampleCatalogue: ProductCatalogue = {
    products: [
        {
            sku: 'BEANS',
            price: 0.99,
            title: 'Baked Beans',
        },
        {
            sku: 'SRD123',
            price: 1.89,
            title: 'Sardines 🤮',
        },
        {
            sku: 'BIS45',
            price: 1.2,
            title: 'Biscuits',
        },
        {
            sku: 'SHAMSM',
            price: 2.0,
            title: 'Shampoo (Small)',
        },
        {
            sku: 'SHAMMD',
            price: 2.5,
            title: 'Shampoo (Medium)',
        },
        {
            sku: 'SHAMLG',
            price: 3.5,
            title: 'Shampoo (Large)',
        },
    ],
};

export default exampleCatalogue;
