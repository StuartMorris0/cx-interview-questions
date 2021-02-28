# cx-interview-questions

Shopping Basket Pricer functionality by Stuart Morris.

### About this repo

The _Shopping Basket_ question has been answered here in nodeJS written in Typescript.

##### Project setup

Clone the repo and run `npm install` from the root directory (shopping_basket folder).

##### Build

Run `npm run build` to build the typescript project into the `dist` directory.
To run the compiled javascript, you can use `npm run project`.

As the objects for basket/catalogue/offers are large JSON obejcts you can adjust the input within the `handler.ts` file, then build and run the project.
The three basket examples will run automatically with the following, refer to the console logging at the end of the handler file.

##### Tests

Tests are setup with Jest and can be run with `npm run test` or `npm run test:silent` (without console logging).
You can also check coverage with `npm run coverage`.

---

### Object Information

##### Basket

The basket object contains an array of `BasketProduct`'s. The basket product initially contians only the `sku` and `qty` for the products.

```
[
    {"BEANS", 3},
    {"SRD123", 2}
]
```

##### Catalogue

The catalogue object contains an array of `Product`'s. The catalogue product includes the `sku`, `price` and `title`.

```
[
    {"BEANS", 0.99, "Baked Beans"},
    {"SRD123", 1.89, "Sardines"}
]
```

##### Offers

The offers object contains an array of `SpecialOffer`'s. The special offer object includes properties for the offer.

```
    offerName: string; // Name of the offer
    offerType: 'percentageOffProduct' | 'buyXgetXfree' | 'buyNofXGetCheapestFree';
    config: { // configuration options for the offer
        groupProductOffer?: boolean;
        amountOff?: number;
        percentageOff?: number;
        buyMinQty?: number;
        freeQty?: number;
    };
    productSKUs: string[]; // An array of product SKUs that the offer relates to
```

---

### Code Flow

The initial handler takes in the params for the `userBasket`, `catalogue` and `offers`. If the `offers` object is null then the calculated subtotals are returned.

`checkBasketProducts`: This function is used to ensure all SKUs in the basket exist in the catalogue and have a positive price value. If they do not, an error is thrown and returned in the response.

```
{
  totals: { subTotal: 0, discount: 0, total: 0 },
  errorMessage: 'Basket Item does not exist in the catalogue IDONOTEXIST'
}
```

Once all products have been confirmed, we `updateBasket` which updates the basket products with the `individualItemPrice` and `itemTotal` values.

Once the basket is updated, we then check what offers are to be applied.
`applyOffers`: This function first finds all the applicable offers based off the `offer.productSKUs` array. I.e. If the basket contains SKUs that are within the offer configuration, we know the offer _could be_ applicable. We then `validateOfferConfig` which checks the offer has the appropriate configuration for its type.

Once we have all the applicable offers, we loop through each offer and apply any discount if the basket meets the requirements.

Note:
Making the offers applicable to product SKUs make it easier to reuse offers on different products. I.e. buy 2 get 1 free, could have an array of product SKUs that it applies to. The same applies to percentage discounts on products. The offer rule section is designed to be extendable, for example buyXgetXfree is used for buy 2 get 1 free but can easily be changed to buy 5 get 2 free etc.

---

### Logging

There are a lot of console.logs throughout the application currently. Whilst these would not exist in a real-world application, they are useful to see how the data flows.
![Logging](assets/logging.png?raw=true "Examplelogging")
![Logging-2](assets/logging-2.png?raw=true "Examplelogging-2")

---

### Dev Notes

It seems appropriate to mention that offers are associated to basket items via the product SKU.
This means there could be multiple offers for the same product SKU. This would be an implementation decision.
Possible resolutions would be: 1. that scenerio is not possible when the offers are created. 2. you should compare the offers to the products and apply the least/most amount based on a business decision. 3. there might be some form of priority to an offer. 4. you might want to apply all offers, in which case do you apply to original pricing or on top of each other. etc. the list goes on...
