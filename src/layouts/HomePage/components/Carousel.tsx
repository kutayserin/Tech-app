import { ReturnProduct } from "./ReturnProduct";
import {useEffect, useState} from 'react'; 
import ProductModel from "../../../models/ProductModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";


export const Carousel = () => {

    const [products, setProducts] = useState<ProductModel[]> ([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    useEffect(() => {
            const fetchProducts = async () => {
                const baseUrl: string = "https://localhost:8443/api/products";

                const url: string = `${baseUrl}?page=0&size=9`;

                const response = await fetch(url);

                if (!response.ok){
                    throw new Error('Something went wrong!');
                }

                const responseJson = await response.json();

                const responseData = responseJson._embedded.products;

                const loadedProducts: ProductModel[] = [];

                for(const key in responseData){
                    loadedProducts.push({
                        id: responseData[key].id,
                        title: responseData[key].title,
                        brand: responseData[key].brand,
                        description: responseData[key].description,
                        stock: responseData[key].stock,
                        stockAvailable: responseData[key].stockAvailable,
                        category: responseData[key].category,
                        img: responseData[key].img
                    });
                }

                setProducts(loadedProducts);
                setIsLoading(false);

            };
            fetchProducts().catch((error:any) => {
                setIsLoading(false);
                setHttpError(error.message);
            })
    }, []);


    if(isLoading){
        return (

           <SpinnerLoading/>
        )
    }

    if(httpError){
        return(
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }


    return (
        <div className="container mt-5" style={{ height: 550 }}>
            <div className="homepage-carousel-title">
                <h3>Find your next best product.</h3>


            </div>
            <div id='carouselExampleControls' className="carousel slide carousel-dark mt-5 d-3 d-md-block d-none" data-bs-interval='false'>
                {/* Desktop */}
                <div className="carousel-inner">
                    <div className="carousel-item active">
                    <div className="row d-flex justify-content-center align-items-center">

                      {products.slice(0,3).map(product=>(
                        <ReturnProduct product = {product} key = {product.id}/>
                      ))}

                        </div>
                    </div>
                    <div className="carousel-item ">
                    <div className="row d-flex justify-content-center align-items-center">

                    {products.slice(3,6).map(product=>(
                        <ReturnProduct product = {product} key = {product.id}/>
                      ))}
                    </div>
                    </div>
                    <div className="carousel-item">
                    <div className="row d-flex justify-content-center align-items-center">

                    {products.slice(6,9).map(product=>(
                        <ReturnProduct product = {product} key = {product.id}/>
                      ))}

                    </div>
                    </div>
                </div>

                <button className="carousel-control-prev" type="button" data-bs-target='#carouselExampleControls' data-bs-slide='prev'>

                    <span className="carousel-control-prev-icon" aria-hidden='true' ></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target='#carouselExampleControls' data-bs-slide='next'>

                    <span className="carousel-control-next-icon" aria-hidden='true' ></span>
                    <span className="visually-hidden">Next</span>
                </button>


            </div>

            {/* Mobile */}

            <div className="d-md-none d-xs-block mt-3">
                <div className="row d-flex justify-content-center align-items-center">
                    <ReturnProduct product={products[3]} key={products[3].id}/>
                </div>
            </div>

            <div className="homepage-carousel-title mt-3">
                <Link className="btn btn-outline-secondary btn-lg" to={"/search"}>View More</Link>
            </div>

        
        </div>
   


    );
}