import { SpecialOffer } from '../../typings';

const exampleOffers: SpecialOffer[] = [
    {
        offerName: 'Sardines at 25% off',
        offerType: 'percentageOffProduct',
        config: { percentageOff: 25 },
        productSKUs: ['SRD123'],
    },
    {
        offerName: 'Buy 2 get 1 free',
        offerType: 'buyXgetXfree',
        config: { buyMinQty: 3, freeQty: 1 },
        productSKUs: ['BEANS', 'SRD123'],
    },
    {
        offerName: 'Buy 3 Shampoo, get the cheapest free',
        offerType: 'buyNofXGetCheapestFree',
        config: { buyMinQty: 3, groupProductOffer: true },
        productSKUs: ['SHAMSM', 'SHAMMD', 'SHAMLG'],
    },
];

export default exampleOffers;
