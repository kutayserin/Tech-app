import { useEffect, useState } from "react";
import ProductModel from "../../models/ProductModel";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { error } from "console";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../models/ReviewRequest";

export const ProductCheckoutPage = () => {

    const {authState} = useOktaAuth();

    const [product, setProduct] = useState<ProductModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review State
    const [reviews,setReviews] = useState<ReviewModel[]>([])
    const [totalStars, setTotalStarts] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);


    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);


    // Loans Count State
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    // Is checked out?
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingProductCheckedout, setIsLoadingProductCheckedout] = useState(true);

    // Payment
    const [displayError, setDisplayError] = useState(false);

    // localhost:3000/checkout/<productId>
    //       1          2          3
    const productId = (window.location.pathname).split('/')[2];
    //console.log(productId);

    useEffect(() => {
        const fetchProduct = async () => {
            const baseUrl: string = `https://localhost:8443/api/products/${productId}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const loadedProduct: ProductModel = {
                id: responseJson.id,
                title: responseJson.title,
                brand: responseJson.brand,
                price: responseJson.price,
                description: responseJson.description,
                stock: responseJson.stock,
                stockAvailable: responseJson.stockAvailable,
                category: responseJson.category,
                img: responseJson.img
            };

            setProduct(loadedProduct);
            setIsLoading(false);

        };
        fetchProduct().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [isCheckedOut]);


    useEffect(() => {
        const fetchProductReviews = async () => {
            const reviewUrl: string = `https://localhost:8443/api/reviews/search/findByProductId?productId=${productId}`;

            const responseReviews = await fetch(reviewUrl);

            if(!responseReviews.ok){
                throw new Error('Something went wrong!');
            }

            const responseJsonReviews = await responseReviews.json();
            console.log(responseJsonReviews);

            const responseData = responseJsonReviews._embedded.reviews;

            const loadedReviews: ReviewModel[] = [];

            let weightedStarReviews: number = 0;

            for(const key in responseData){
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    product_id: responseData[key].productId,
                    reviewDescription: responseData[key].reviewDescription
                });
                weightedStarReviews = weightedStarReviews + responseData[key].rating;
                
            }

            if(loadedReviews) {
                console.log(weightedStarReviews);
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2 ) /2).toFixed(1); //rounded number nearest to .5
                setTotalStarts(Number(round));
                
            }

            setReviews(loadedReviews);
            console.log(loadedReviews);
            setIsLoadingReview(false);


        };

        fetchProductReviews().catch((error:any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
    }, [isReviewLeft]);

    useEffect(() => {

        const fetchUserReviewProduct = async () => {
            if(authState && authState.isAuthenticated){
                const url = `https://localhost:8443/api/reviews/secure/user/product/?productId=${productId}`;

                const requestOptions = {
                    method: 'GET',
                    headers:{
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json',

                    }
                };
                const userReviewResponse = await fetch(url,requestOptions);

                if(!userReviewResponse.ok){
                    throw new Error('Something went wrong!');
                }
                const userReviewResponseJson = await userReviewResponse.json();
                setIsReviewLeft(userReviewResponseJson);

            }
            setIsLoadingUserReview(false);
        }
        fetchUserReviewProduct().catch((error:any) => {
            setIsLoadingUserReview(false);
            setHttpError(error.message);
        })

    }, [authState])

    useEffect(()=> {

        const fetchUserCurrentLoansCount = async () => {

            if(authState && authState.isAuthenticated){
               
                const url = `https://localhost:8443/api/products/secure/currentloans/count`;
                const requestOptions = {
                    method: 'GET',
                    headers: {

                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const currentLoansCountResponse = await fetch(url, requestOptions);
                if(!currentLoansCountResponse.ok){
                    throw new Error('Something went wrong!');
                }

                const currentLoansCountResponseJson = await currentLoansCountResponse.json();
                setCurrentLoansCount(currentLoansCountResponseJson);

            }  
            setIsLoadingCurrentLoansCount(false);

        }
        fetchUserCurrentLoansCount().catch((error: any) =>
        {
            setIsLoadingCurrentLoansCount(false);
            setHttpError(error.message);
        }
       
        );

    }, [authState, isCheckedOut]);


    useEffect(()=> {
        const fetchUserCheckedoutProduct = async () => {
            if(authState && authState.isAuthenticated){
                const url = `https://localhost:8443/api/products/secure/ischeckedout/byuser/?productId=${productId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {

                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
    
                };
                const productCheckedOut = await fetch(url, requestOptions);

                if(!productCheckedOut.ok){
                    throw new Error("Something went wrong!");
                }

                const productCheckedOutResponseJson = await productCheckedOut.json();

                setIsCheckedOut(productCheckedOutResponseJson);
                
            }
            setIsLoadingProductCheckedout(false);
        }
        fetchUserCheckedoutProduct().catch((error:any) =>
        {
            setIsLoadingProductCheckedout(false);
            setHttpError(error.message);
        })
    }, [authState])
    

    if(isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingProductCheckedout || isLoadingUserReview){
        return(
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

    async function checkoutProduct(){
        const url = `https://localhost:8443/api/products/secure/checkout/?productId=${productId}`;
        const requestOptions = {
            method: 'PUT',
            headers: {

                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const checkoutResponse = await fetch(url, requestOptions);
        if(!checkoutResponse.ok){
            setDisplayError(true);
            throw new Error('Something went wrong!');

        }
        setDisplayError(false);
        setIsCheckedOut(true);
    }

    async function submitReview(starInput:number, reviewDescription:string) {

        let productId: number = 0;
        if(product?.id){
            productId = product.id;
        }

        const reviewRequestModel = new ReviewRequestModel(starInput, productId, reviewDescription);
        const url = `https://localhost:8443/api/reviews/secure`;

        const requestOptions = {
            method: 'POST',
            headers:  {

                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'

            },
            body: JSON.stringify(reviewRequestModel)
        };
        const returnResponse = await fetch(url,requestOptions);
        if(!returnResponse.ok){
            throw new Error('Something went wrong!');
        }
        setIsReviewLeft(true);
    }


    return (

        <div>

            <div className="container d-none d-lg-block">
                {displayError && <div role="alert" className="alert alert-danger mt-3">
                    Please continue with your interrupted purchase.
                    </div>}
                   
                
                <div className="row mt-5">
                    <div className="col-sm-3 col-md-3">
                        {product?.img
                            ?
                            <img src={product?.img} width='350' height='349' alt='Product' />
                            :
                            <img src={require('./../../Images/ProductsImages/default.jpg')} width='226' height='349' alt='Product' />
                        }
                    </div>
                    <div className="col-4 col-md-4 container">
                        <div className="ml-2">

                            <h2>{product?.title}</h2>
                            <h5 className="text-primary">{product?.brand}</h5>
                            <p className="lead">{product?.description}</p>
                            <StarsReview rating={totalStars} size={32}/>
                        </div>

                    </div>
                    <CheckoutAndReviewBox product={product} mobile={false} currentLoansCount={currentLoansCount} isAuthenticated={authState?.isAuthenticated} isCheckedOut= {isCheckedOut} checkoutProduct={checkoutProduct} isReviewLeft = {isReviewLeft} submitReview={submitReview}/>
                </div>
                <hr />
                <LatestReviews reviews={reviews} product_id={product?.id} mobile= {false}/>
            </div>
            <div className="container d-lg-none mt-5">

            {displayError && <div role="alert" className="alert alert-danger mt-3">
                    Please continue with your interrupted purchase.
                    </div>}

                <div className="d-flex justify-content-center align-items-center">
                    {product?.img
                        ?
                        <img src={product?.img} width='350' height='349' alt='Product' />
                        :
                        <img src={require('./../../Images/ProductsImages/default.jpg')} width='226' height='349' alt='Product' />
                    }
                </div>

                <div className="mt-4">
                    <div className="ml-2">
                        <h2>{product?.title}</h2>
                        <h5 className="text-primary">{product?.brand}</h5>
                        <p className="lead">{product?.description}</p>
                        <StarsReview rating={totalStars} size={32}/>

                    </div>

                </div>
                <CheckoutAndReviewBox product={product} mobile={true} currentLoansCount={currentLoansCount} isAuthenticated={authState?.isAuthenticated} isCheckedOut= {isCheckedOut} checkoutProduct={checkoutProduct} isReviewLeft = {isReviewLeft} submitReview={submitReview}/>
                <hr />
                <LatestReviews reviews={reviews} product_id={product?.id} mobile= {true}/>

            </div>

        </div>

    );

}   