import ProductModel from "./ProductModel";

class CartCurrentLoans {
    product: ProductModel;
    productLeft: number;

    constructor(product: ProductModel, productLeft: number){
        this.product = product;
        this.productLeft = productLeft;
    }
}
export default CartCurrentLoans;