import { ProductCatalogue, Basket } from '../typings';

/**
 * The checkBasketProducts function is used to ensure the basket products exist in the catalogue. It also checks the catalogue product price is not negative.
 * @param userBasket The Basket object for the user, containing the sku/qty
 * @param catalogue The ProductCatalogue object containing all available products
 */
const checkBasketProducts = (userBasket: Basket, catalogue: ProductCatalogue): void => {
    userBasket.products.forEach((basketProduct) => {
        const result = catalogue.products.find((catProduct) => basketProduct.sku === catProduct.sku);
        if (result == null) {
            throw new Error(`Basket Item does not exist in the catalogue ${basketProduct.sku}`);
        } else if (result.price < 0) {
            throw new Error(`Incorrectly priced item found: ${result.title}`);
        }
    });
};

export default checkBasketProducts;
