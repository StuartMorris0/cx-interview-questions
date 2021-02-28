import handler from '../handler';
import exampleCatalogue from './data/exampleCatalogue';
import { exampleBasket1, exampleBasket2, exampleBasket3 } from './data/exampleBasket';
import exampleOffers from './data/exampleOffers';
import { Basket, ProductCatalogue, SpecialOffer } from '../typings';

describe('BasketPricer tests: ', () => {
    it('example basket 1', () => {
        // Testing example basket 1
        const result = handler(exampleBasket1, exampleCatalogue, exampleOffers);
        expect(result.totals).toStrictEqual({ subTotal: 5.16, total: 4.17, discount: 0.99 });
    });

    it('example basket 2', () => {
        // Testing example basket 2
        const result = handler(exampleBasket2, exampleCatalogue, exampleOffers);
        expect(result.totals).toStrictEqual({ subTotal: 6.96, total: 6.01, discount: 0.95 });
    });

    it('example basket 3', () => {
        // Testing example basket 2
        const result = handler(exampleBasket3, exampleCatalogue, exampleOffers);
        expect(result.totals).toStrictEqual({ subTotal: 17.0, total: 11.5, discount: 5.5 });
    });

    it('product in basket does not exist in catalogue', () => {
        const testBasket: Basket = {
            products: [
                {
                    sku: 'DOESNOTEXIST',
                    qty: 1,
                },
            ],
        };
        const result = handler(testBasket, exampleCatalogue, exampleOffers);
        expect(result.totals).toStrictEqual({ subTotal: 0, total: 0, discount: 0 });
        expect(result.errorMessage).toBe('Basket Item does not exist in the catalogue DOESNOTEXIST');
    });

    it('no offers returns expected result', () => {
        const result = handler(exampleBasket1, exampleCatalogue, null);
        expect(result.totals).toStrictEqual({ subTotal: 5.16, total: 5.16, discount: 0 });
    });

    it('matching offers that do not meet min requirements', () => {
        const offers: SpecialOffer[] = [
            {
                offerName: 'Test offer',
                offerType: 'buyXgetXfree',
                config: {
                    buyMinQty: 5,
                    freeQty: 1,
                },
                productSKUs: ['BEANS'],
            },
        ];
        const result = handler(exampleBasket1, exampleCatalogue, offers);
        expect(result.totals).toStrictEqual({ subTotal: 5.16, total: 5.16, discount: 0 });
    });

    it('badly priced catalogue item responds with error', () => {
        const exampleCatalogue: ProductCatalogue = {
            products: [
                {
                    sku: 'BEANS',
                    price: -0.99,
                    title: 'Baked Beans',
                },
            ],
        };
        const result = handler(exampleBasket1, exampleCatalogue, null);
        expect(result.totals).toStrictEqual({ subTotal: 0, total: 0, discount: 0 });
        expect(result.errorMessage).toBe('Catalogue is misconfigured');
    });
});
