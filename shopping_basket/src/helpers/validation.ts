import { ProductCatalogue, Basket, SpecialOffer } from "../typings";

const BASKET_ERROR = "Basket has no products";
const CATALOGUE_ERROR = "Catalogue is misconfigured";
const OFFERS_ERROR = "Offers should be an array";

/**
 * Validate the input for the main handler function
 * @param userBasket basket object
 * @param catalogue catalogue of products
 * @param offers offers available
 */
export const validateInput = (
  userBasket: Basket,
  catalogue: ProductCatalogue,
  offers: SpecialOffer[] | null
) => {
  if (
    !userBasket.products ||
    userBasket.products.length === 0 ||
    !Array.isArray(userBasket.products)
  ) {
    throw new Error(BASKET_ERROR);
  }
  // Check the basket products do not contain multiple with same SKU (increase qty instead)
  // TODO: Probably need to confirm the basket doesn't have duplicate SKUs and merge them, Although its an example, we could probably assume that would never happen... :)
  if (
    !catalogue.products ||
    catalogue.products.length === 0 ||
    catalogue.products.length < userBasket.products.length ||
    !Array.isArray(catalogue.products)
  ) {
    throw new Error(CATALOGUE_ERROR);
  }
  if (offers !== null && !Array.isArray(offers)) {
    throw new Error(OFFERS_ERROR);
  }
  // We could also further the validation to ensure each object matches a specific desired structure. I.e. an Offer has the amountVal key. But for now we can assume the data is as we expect, you'd likely use some middleware to handle validation like this.
};

/**
 * Validate the offer object, ensure it has the required values for the type of offer it is.
 * @param offer offer to be validated
 * @returns boolean: true if the offer is valid
 */
export const validateOfferConfig = (
  offer: SpecialOffer,
  userBasket: Basket | undefined = undefined
): boolean => {
  // This is here just to check an offer is configured as we expect. In an ideal world the offers data would come from a service in which it is only ever formatted correctly.
  if (offer.config.groupProductOffer) {
    switch (offer.offerType) {
      case "buyNofXGetCheapestFree":
        if (
          offer.config.buyMinQty !== undefined &&
          offer.config.buyMinQty > 1 &&
          offer.productSKUs.length > 0 &&
          userBasket !== undefined
        ) {
          const matchingProductsCount = userBasket.products.reduce(
            (counter, basketProduct) =>
              offer.productSKUs.indexOf(basketProduct.sku) > -1
                ? (counter += basketProduct.qty)
                : counter,
            0
          );
          if (matchingProductsCount >= offer.config.buyMinQty!) {
            return true;
          } else {
            return false;
          }
        }
        console.log(
          "MISCONFIGURED OFFER (buyNofXGetCheapestFree), expected a value for config.buyMinQty, productSKUs and Basket"
        );
        console.table(offer);
        return false;
      default:
        return false;
    }
  } else {
    switch (offer.offerType) {
      case "percentageOffProduct":
        if (offer.config.percentageOff && offer.config.percentageOff > 0) {
          return true;
        }
        console.log(
          "MISCONFIGURED OFFER (percentageOffProduct), expected a value for offer.config.percentageOff"
        );
        console.table(offer);
        return false;

      case "buyXgetXfree":
        if (offer.config) {
          if (
            offer.config.buyMinQty !== undefined &&
            offer.config.freeQty !== undefined &&
            offer.config.buyMinQty > offer.config.freeQty
          ) {
            return true;
          }
        }
        console.log(
          "MISCONFIGURED OFFER (buyXgetXfree), check the values for offer.config.buyMinQty and offer.config.freeQty"
        );
        console.table(offer);
        return false;

      default:
        return false;
    }
  }
};
