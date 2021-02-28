import { ProductCatalogue, Basket, SpecialOffer, BasketPricerResult } from './typings';

import { tableLogData, formatNumber } from './helpers/utils';
import { validateInput } from './helpers/validation';
import checkBasketProducts from './services/catalogueService';
import applyOffers from './services/offer-service/offerService';

import updateBasket from './services/basketService';

// Testing data
import exampleCatalogue from './tests/data/exampleCatalogue';
import { exampleBasket1, exampleBasket2, exampleBasket3 } from './tests/data/exampleBasket';
import exampleOffers from './tests/data/exampleOffers';

// Build tsc CMD/Shift/B
// run in code runner - ctrl/alt/N

const noOffersResponse = (val: number) => {
    return {
        totals: {
            subTotal: val,
            discount: 0,
            total: val,
        },
    };
};

const emptyTotals = { totals: { subTotal: 0, discount: 0, total: 0 } };

const handler = (
    userBasket: Basket,
    catalogue: ProductCatalogue,
    offers: SpecialOffer[] | null,
): BasketPricerResult => {
    try {
        validateInput(userBasket, catalogue, offers);

        tableLogData(userBasket.products, 'BASKET');
        tableLogData(catalogue.products, 'CATALOGUE');
        tableLogData(offers, 'OFFERS');

        checkBasketProducts(userBasket, catalogue);
    } catch (error) {
        return { ...emptyTotals, errorMessage: error.message };
    }

    const currentSubTotal = updateBasket(userBasket, catalogue);
    tableLogData(userBasket.products, 'UPDATED BASKET');

    // If there are no offers we can exit quickly with the original totals
    if (!offers || offers.length < 1) {
        return noOffersResponse(currentSubTotal);
    }

    const { totalDiscount, offersApplied } = applyOffers(offers, userBasket);
    if (totalDiscount > 0) {
        if (offersApplied !== undefined) {
            tableLogData(offersApplied, 'APPLIED OFFERS');
        }
        return {
            totals: {
                subTotal: formatNumber(currentSubTotal),
                discount: formatNumber(totalDiscount),
                total: formatNumber(currentSubTotal - totalDiscount),
            },
        };
    }
    console.log('No matching offers');
    return noOffersResponse(currentSubTotal);
};

export default handler;

// The following calls the handler with example basket, catalogue and offer values.
console.log('----------------RUNNING BASKET EXAMPLE 1----------------------------');
console.log(handler(exampleBasket1, exampleCatalogue, exampleOffers));
console.log('----------------RUNNING BASKET EXAMPLE 2----------------------------');
console.log(handler(exampleBasket2, exampleCatalogue, exampleOffers));
console.log('----------------RUNNING BASKET EXAMPLE 3----------------------------');
console.log(handler(exampleBasket3, exampleCatalogue, exampleOffers));
