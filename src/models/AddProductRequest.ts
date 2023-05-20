class AddProductRequest {
    title: string;
    brand: string;
    price: number;
    description: string;
    stock: number;
    category: string;
    img?: string;

    constructor(title: string,brand: string,price:number, description: string,stock: number,category: string
        ,img?:string){
            this.title=title;
            this.brand=brand;
            this.price=price;
            this.description=description;
            this.category=category;
            this.stock = stock;
            this.img = img;
        }
}

export default AddProductRequest;