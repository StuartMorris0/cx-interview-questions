import { ApplyOfferGroupInput, ApplyOfferInput } from '../../typings';

export const percentageOffProduct = ({ basketItem, offer }: ApplyOfferInput): number => {
    // Applying the perc off to the itemTotal price which is an already calculated value of qty * individual price
    return parseFloat(((basketItem.itemTotal! / 100) * offer.config.percentageOff!).toFixed(2));
};

export const buyAmountGetAmountFree = ({ basketItem, offer }: ApplyOfferInput): number => {
    if (basketItem.qty < offer.config.buyMinQty!) {
        console.log(`Basket Item ${basketItem.sku} did not meet the minimum qty for offer: ${offer.offerName}`);
        return 0;
    }
    // Need to check how many times the minimum required goes into quantity. This covers if the offer is buy2/1free and they have 6 in the basket.
    const roundQty = Math.floor(basketItem.qty / offer.config.buyMinQty!);
    return offer.config.freeQty! * roundQty * basketItem.individualItemPrice!;
};

export const buyNofXGetCheapestFree = ({ basketItems, offer }: ApplyOfferGroupInput): number => {
    let discountAmount: number = 0;
    const orderedArray = basketItems.sort((a, b) => (a.individualItemPrice! < b.individualItemPrice! ? 1 : -1));
    let accumulativeCount = 0;
    orderedArray.forEach((product) => {
        for (let index = 0; index < product.qty; index += 1) {
            // run on each individual product qty item
            accumulativeCount += 1;
            const minRequirement = Math.floor(accumulativeCount / offer.config.buyMinQty!);
            if (minRequirement === 1) {
                // met the requirement lets add this to discountTotal and adjust the accumulativeCount
                console.log(
                    `${offer.offerName}: Minimum qty has been met: ${product.sku} - ${product.title} - adding ${product.individualItemPrice} to the discount total`,
                );
                discountAmount += product.individualItemPrice ? product.individualItemPrice : 0;
                accumulativeCount -= offer.config.buyMinQty!;
            } else {
                console.log(
                    `${offer.offerName} - Minimum qty not currently met: currentCount:${accumulativeCount} minReq: ${offer.config.buyMinQty}`,
                );
            }
        }
    });
    console.log(`returning discountAmount: ${discountAmount}`);
    return discountAmount;
};
