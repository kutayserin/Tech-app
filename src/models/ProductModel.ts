class ProductModel {
    id: number;
    title: string;
    brand?: string;
    price?: number;
    description?: string;
    stock?: number;
    stockAvailable?: number;
    category?: string;
    img?: string;

    constructor(id:number, title:string, brand:string, price:number, description: string, stock:number, 
        stockAvailable:number,category:string, img:string)
        {
            this.id = id;
            this.title = title;
            this.brand = brand;
            this.price = price;
            this.description = description;
            this.stock = stock;
            this.stockAvailable = stockAvailable;
            this.category = category;
            this.img = img
        }

}

export default ProductModel;