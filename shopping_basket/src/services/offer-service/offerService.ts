import { Basket, SpecialOffer, OfferServiceResponse, ApplyOfferInput } from '../../typings';
import { validateOfferConfig } from '../../helpers/validation';
import { tableLogData } from '../../helpers/utils';
import { percentageOffProduct, buyAmountGetAmountFree, buyNofXGetCheapestFree } from './rules';

/**
 * Applies a group product offer to the basket
 * @param userBasket user basket
 * @param offer offer to be applied
 */
const applyGroupProductOffer = (userBasket: Basket, offer: SpecialOffer): number => {
    console.log('---CHECKING GROUP PRODUCT OFFER---');
    let discountAmount: number = 0;
    const filteredProducts = userBasket.products.filter(
        (basketProduct) => offer.productSKUs.indexOf(basketProduct.sku) > -1,
    );
    if (offer.offerType === 'buyNofXGetCheapestFree') {
        discountAmount += buyNofXGetCheapestFree({ basketItems: filteredProducts, offer });
    }
    return discountAmount;
};

/**
 * applyOfferToBasketItem: used to switch on the offerType and apply the relevant offer rules.
 * @param input {basketItem: BasketProduct; offer: SpecialOffer;}
 */
const applyOfferToBasketItem = (input: ApplyOfferInput): number => {
    let discountAmount: number = 0;
    switch (input.offer.offerType) {
        case 'percentageOffProduct':
            discountAmount += percentageOffProduct(input);
            break;

        case 'buyXgetXfree':
            discountAmount += buyAmountGetAmountFree(input);
            break;
        default:
            break;
    }
    return discountAmount;
};

/**
 * findApplicableOffers: finds the offers that are applicable to the items in the basket, based on the product SKUs
 * @param offers All offers available
 * @param userBasket The basket to compare offers to
 */
const findApplicableOffers = (offers: SpecialOffer[], userBasket: Basket): SpecialOffer[] => {
    const applicableOffers: SpecialOffer[] = [];
    offers.forEach((offer) => {
        if (offer.config.groupProductOffer) {
            // offers that apply to multiple products, we check that they have the buyMinQty for any of the productSKUs
            return validateOfferConfig(offer, userBasket) && applicableOffers.push(offer);
        }
        offer.productSKUs.some((targetSKU) => {
            // some allows us to fallout once we know we have one matching product sku in the basket
            if (userBasket.products.some((el) => el.sku === targetSKU)) {
                return validateOfferConfig(offer) && applicableOffers.push(offer);
            }
            return false;
        });
    });
    return applicableOffers;
};

/**
 * applyOffers: used to check which offers are applicable to the basket products and apply them
 * @param offers An array of the SpecialOffer objects
 * @param userBasket The user basket including BasketProduct objects
 */
const applyOffers = (offers: SpecialOffer[], userBasket: Basket): OfferServiceResponse => {
    // Get applicable offers and return no discount if there are none to be applied
    const applicableOffers = findApplicableOffers(offers, userBasket);
    if (applicableOffers.length < 1) {
        return { totalDiscount: 0 };
    }

    tableLogData(applicableOffers, 'APPLICABLE OFFERS');

    let totalDiscount = 0;
    const offersApplied: string[] = [];
    applicableOffers.forEach((offer) => {
        if (offer.config.groupProductOffer) {
            const discountApplied = applyGroupProductOffer(userBasket, offer);
            if (discountApplied > 0) {
                totalDiscount += discountApplied;
                const appliedOfferInfo = `${offer.offerName} DISCOUNT: ${discountApplied}`;
                offersApplied.push(appliedOfferInfo);
            }
        } else {
            offer.productSKUs.forEach((targetSKU) => {
                userBasket.products.forEach((basketItem) => {
                    if (targetSKU === basketItem.sku) {
                        // Found product to apply order to
                        const discountApplied = applyOfferToBasketItem({
                            basketItem,
                            offer,
                        });
                        if (discountApplied > 0) {
                            totalDiscount += discountApplied;
                            const appliedOfferInfo = `${offer.offerName} DISCOUNT: ${discountApplied} applied to ${basketItem.sku}`;
                            offersApplied.push(appliedOfferInfo);
                        }
                    }
                });
            });
        }
    });
    return { totalDiscount, offersApplied };
};

export default applyOffers;
