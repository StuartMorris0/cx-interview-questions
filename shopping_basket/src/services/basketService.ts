import { ProductCatalogue, Basket } from '../typings';
import { formatNumber } from '../helpers/utils';

/**
 * updateBasket: used to update the basket with pricing information from catalogue and return the original subtotal
 * Note: Typically this would be a different service and probably all supplied within the basket data
 * @param userBasket user basket object
 * @param catalogue catalogue of products available
 * @returns number: the subtotal value of all line items in basket
 */
const updateBasket = (userBasket: Basket, catalogue: ProductCatalogue): number => {
    let originalSubTotal = 0;
    userBasket.products.forEach((product) => {
        const catProd = catalogue.products.find((catProduct) => catProduct.sku === product.sku);
        // We know the catProd exists due to the checkBasketProducts against catalogue
        if (catProd) {
            const itemsTotal = formatNumber(product.qty * catProd.price);
            originalSubTotal += itemsTotal;
            product.individualItemPrice = catProd.price;
            product.itemTotal = itemsTotal;
            product.title = catProd.title;
        }
    });
    return originalSubTotal;
};

export default updateBasket;
