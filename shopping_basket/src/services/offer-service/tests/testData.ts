import { SpecialOffer } from '../../../typings';

export const exampleGroupProductOffer: SpecialOffer = {
    offerName: 'Buy two shampoo get cheapest free',
    offerType: 'buyNofXGetCheapestFree',
    config: {
        groupProductOffer: true,
        buyMinQty: 3,
    },
    productSKUs: ['SHAMSM', 'SHAMMD', 'SHAMLG'],
};

export const exampleProductOffer: SpecialOffer = {
    offerName: 'Buy one get one free',
    offerType: 'buyXgetXfree',
    config: {
        buyMinQty: 2,
        freeQty: 1,
    },
    productSKUs: ['BEANS'],
};

export const examplePercOffOffer: SpecialOffer = {
    offerName: '25 % off sardines',
    offerType: 'percentageOffProduct',
    config: {
        percentageOff: 25,
    },
    productSKUs: ['SRD123'],
};
