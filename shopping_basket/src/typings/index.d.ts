// Products within Catalogue would include full details
interface Product {
    sku: string;
    price: number;
    title: string;
    // otherInfo?:
}
// Catalogue
interface ProductCatalogue {
    products: Product[];
}

// Products in Basket include just the SKU and QTY
interface BasketProduct {
    sku: string;
    qty: number;
    individualItemPrice?: number;
    itemTotal?: number;
    title?: string;
}
// Basket
interface Basket {
    products: BasketProduct[];
}

// Special Offers
interface SpecialOffer {
    offerName: string;
    offerType: 'percentageOffProduct' | 'buyXgetXfree' | 'buyNofXGetCheapestFree';
    config: {
        groupProductOffer?: boolean;
        percentageOff?: number;
        buyMinQty?: number;
        freeQty?: number;
    };
    productSKUs: string[];
}

// Basket Pricer Result
interface BasketPricerResult {
    totals: {
        subTotal: number;
        discount: number;
        total: number;
    };
    errorMessage?: string;
}

// Offer Service Response
interface OfferServiceResponse {
    offersApplied?: string[];
    totalDiscount: number;
}

// Apply offer
interface ApplyOfferInput {
    basketItem: BasketProduct;
    offer: SpecialOffer;
}

interface ApplyOfferGroupInput {
    basketItems: BasketProduct[];
    offer: SpecialOffer;
}

export {
    ProductCatalogue,
    Product,
    Basket,
    BasketProduct,
    SpecialOffer,
    BasketPricerResult,
    OfferServiceResponse,
    ApplyOfferInput,
    ApplyOfferGroupInput,
};
