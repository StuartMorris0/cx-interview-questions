import { Basket, SpecialOffer } from '../../../typings';
import applyOffers from '../offerService';
import { exampleGroupProductOffer, exampleProductOffer, examplePercOffOffer } from './testData';

describe('offerService: ', function () {
    it('No applicable offers returns 0 discount', function () {
        const offers: SpecialOffer[] = [
            {
                offerName: 'No match offer',
                offerType: 'buyNofXGetCheapestFree',
                config: {},
                productSKUs: ['NOTINBASKET'],
            },
        ];
        const userBasket: Basket = {
            products: [
                {
                    qty: 1,
                    sku: 'TEST',
                },
            ],
        };
        const result = applyOffers(offers, userBasket);
        expect(result).toStrictEqual({ totalDiscount: 0 });
    });

    // apply offer: buy 1 get 1 free
    it('buy X get X free offer returns expected discount', () => {
        const productPrice = 23.99;
        const userBasket: Basket = {
            products: [
                {
                    qty: 2,
                    sku: 'BEANS',
                    individualItemPrice: productPrice,
                },
            ],
        };
        const result = applyOffers([exampleProductOffer], userBasket);
        expect(result.totalDiscount).toBe(productPrice);
    });

    // apply offer: buy 3 get 1 free
    it('buy X get X free offer returns expected discount for multiple', () => {
        const minRequired: number = 3;
        const updatedOffer: SpecialOffer = {
            ...exampleProductOffer,
            config: {
                ...exampleProductOffer.config,
                buyMinQty: 3,
            },
        };
        const productPrice = 23.99;
        const basketItemQty = 15;
        const userBasket: Basket = {
            products: [
                {
                    qty: basketItemQty,
                    sku: 'BEANS',
                    individualItemPrice: productPrice,
                },
            ],
        };
        const result = applyOffers([updatedOffer], userBasket);
        const roundQty = Math.floor(basketItemQty / minRequired);
        const expectedResult = updatedOffer.config.freeQty! * roundQty * productPrice;
        expect(result.totalDiscount).toBe(expectedResult);
    });

    // apply offer: 25% percentage off product
    it('perc off applies expected discount', () => {
        const basketItemTotal = 4.55;
        const userBasket: Basket = {
            products: [
                {
                    qty: 1,
                    sku: 'SRD123',
                    itemTotal: basketItemTotal,
                },
            ],
        };
        const result = applyOffers([examplePercOffOffer], userBasket);
        const expectedResult = parseFloat(
            ((basketItemTotal / 100) * examplePercOffOffer.config.percentageOff!).toFixed(2),
        );
        expect(result.totalDiscount).toBe(expectedResult);
    });

    // apply offer: applies random percentage value
    it('random perc off applies expected discount', () => {
        const basketItemTotal = 4.55;
        const userBasket: Basket = {
            products: [
                {
                    qty: 1,
                    sku: 'SRD123',
                    itemTotal: basketItemTotal,
                },
            ],
        };
        // Test random discount value
        const randomPerc = Math.floor(Math.random() * 100);
        const updatePercOffOffer: SpecialOffer = { ...examplePercOffOffer, config: { percentageOff: randomPerc } };
        const result = applyOffers([updatePercOffOffer], userBasket);
        const expectedResult = parseFloat(((basketItemTotal / 100) * randomPerc).toFixed(2));
        expect(result.totalDiscount).toBe(expectedResult);
    });

    // apply offer: buy two shampoo get cheapest free
    it('group product offer returns expected discount', () => {
        const offers: SpecialOffer[] = [
            {
                offerName: 'Buy two shampoo get cheapest free',
                offerType: 'buyNofXGetCheapestFree',
                config: {
                    groupProductOffer: true,
                    buyMinQty: 3,
                },
                productSKUs: ['SHAMSM', 'SHAMMD', 'SHAMLG'],
            },
        ];
        const userBasket: Basket = {
            products: [
                {
                    qty: 2,
                    sku: 'SHAMSM',
                    individualItemPrice: 2.0,
                },
                {
                    qty: 1,
                    sku: 'SHAMMD',
                    individualItemPrice: 2.5,
                },
            ],
        };
        const result = applyOffers(offers, userBasket);
        expect(result.totalDiscount).toStrictEqual(2);
        expect(result.offersApplied).toStrictEqual(['Buy two shampoo get cheapest free DISCOUNT: 2']);
    });
});

describe('offerService: misconfigured offers: ', () => {
    it('misconfigured buy X get X free offer returns 0 discount', () => {
        const misconfiguredOffer = { ...exampleProductOffer, config: { ...exampleProductOffer.config, buyMinQty: 1 } };
        const productPrice = 23.99;
        const userBasket: Basket = {
            products: [
                {
                    qty: 2,
                    sku: 'BEANS',
                    individualItemPrice: productPrice,
                },
            ],
        };
        const result = applyOffers([misconfiguredOffer], userBasket);
        expect(result.totalDiscount).toBe(0);
    });

    it('misconfigured group product offer returns 0 discount', () => {
        const misconfiguredOffer: SpecialOffer = {
            ...exampleGroupProductOffer,
            config: { ...exampleGroupProductOffer.config, buyMinQty: 0 },
        };
        const userBasket: Basket = {
            products: [
                {
                    qty: 2,
                    sku: 'SHAMSM',
                },
                {
                    qty: 1,
                    sku: 'SHAMMD',
                },
            ],
        };
        const result = applyOffers([misconfiguredOffer], userBasket);
        expect(result).toStrictEqual({ totalDiscount: 0 });
    });

    it('misconfigured offer without groupProductOffer returns 0 discount', () => {
        const misconfiguredOffer: SpecialOffer = {
            offerName: 'Buy two shampoo get cheapest free',
            offerType: 'buyNofXGetCheapestFree',
            config: {
                buyMinQty: 3,
            },
            productSKUs: ['SHAMSM', 'SHAMMD', 'SHAMLG'],
        };
        const userBasket: Basket = {
            products: [
                {
                    qty: 2,
                    sku: 'SHAMSM',
                },
                {
                    qty: 1,
                    sku: 'SHAMMD',
                },
            ],
        };
        const result = applyOffers([misconfiguredOffer], userBasket);
        expect(result).toStrictEqual({ totalDiscount: 0 });
    });

    it('buy amount get amount free basket product does not meet minimum requirements', () => {
        const productPrice = 23.99;
        const userBasket: Basket = {
            products: [
                {
                    qty: 1,
                    sku: 'BEANS',
                    individualItemPrice: productPrice,
                },
            ],
        };
        const result = applyOffers([exampleProductOffer], userBasket);
        expect(result.totalDiscount).toBe(0);
    });
});
