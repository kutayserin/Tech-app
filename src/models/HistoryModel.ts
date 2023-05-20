class HistoryModel {
    id:number;
    userEmail: string;
    checkoutDate: string;
    boughtDate: string;
    title: string;
    brand: string;
    price: number;
    description:string;
    img: string;

    constructor(id: number, userEmail: string, checkoutDate: string,
        boughtDate: string, title:string,  brand: string, price:number, description: string,
        img: string
        ) {
        this.id = id;
        this.userEmail = userEmail;
        this.checkoutDate = checkoutDate;
        this.boughtDate = boughtDate;
        this.title = title;
        this.brand = brand;
        this.price = price;
        this.description = description;
        this.img = img;
    }
    
    
}  
export default HistoryModel;