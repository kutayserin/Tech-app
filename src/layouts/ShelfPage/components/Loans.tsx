import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { error } from "console";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { LoansModal } from "./LoansModal";
import CartCurrentLoans from "../../../models/CartCurrentLoans";
import { PaymentPage } from "../../PaymentPage/PaymentPage";

export const Loans = () => {

    const { authState } = useOktaAuth();
    const [httpError, setHttpError] = useState(null);

    // Current Loans
    const [cartCurrentLoans, setCartCurrentLoans] = useState<CartCurrentLoans[]>([]);
    const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);
    const [checkout, setCheckout] = useState(false);

    useEffect(() => {
        const fetchUserCurrentLoans = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8443/api/products/secure/currentloans`;
                const requestOptions = {
                    method: 'GET',
                    headers: {

                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'

                    }
                };
                const cartCurrentLoansRespone = await fetch(url, requestOptions);
                if (!cartCurrentLoansRespone.ok) {
                    throw new Error("Something went wrong!");
                }
                const cartCurrentLoansResponeJson = await cartCurrentLoansRespone.json();
                setCartCurrentLoans(cartCurrentLoansResponeJson);
            }
            setIsLoadingUserLoans(false);
        }
        fetchUserCurrentLoans().catch((error: any) => {
            setIsLoadingUserLoans(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [authState, checkout]);


    if (isLoadingUserLoans) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {

        return (
            <div className="container m-5">
                <p>{httpError}</p>

            </div>
        )
    }

    async function deleteProduct(productId: number) {
        const url = `http://localhost:8443/api/products/secure/delete/product/?productId=${productId}`;
        const requestOptions = {
            method: 'DELETE',
            headers: {

                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }

        };
        const returnResponse = await fetch(url, requestOptions);
        console.log(returnResponse);
        if (!returnResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setCheckout(!checkout);
    }

    async function buyProduct(productId: number) {
        const url = `http://localhost:8443/api/products/secure/buy/?productId=${productId}`;
        const requestOptions = {
            method: 'PUT',
            headers: {

                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }

        };
        const returnResponse = await fetch(url, requestOptions);
        if (!returnResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setCheckout(!checkout);
    }

    // async function renewLoan(productId: number) {
    //     const url = `http://localhost:8443/api/products/secure/renew/loan/?productId=${productId}`;
    //     const requestOptions = {
    //         method: 'PUT',
    //         headers: {
    //             Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
    //             'Content-Type': 'application/json'
    //         }

    //     };
    //     const returnResponse = await fetch(url, requestOptions);
    //     if (!returnResponse.ok) {
    //         throw new Error('Something went wrong!');
    //     }
    //     setCheckout(!checkout);
    // }



    return (
        <div>
            {/* Desktop */}

            <div className="d-none d-lg-block mt-2">
                {cartCurrentLoans.length > 0 ?
                    <>
                        <h5>Current Loans: </h5>

                        {cartCurrentLoans.map(cartCurrentLoan => (
                            <div key={cartCurrentLoan.product.id}>
                                <div className="row mt-3 mb-3">
                                    <div className="col-3 col-md-3 container">
                                        {cartCurrentLoan.product?.img ?
                                            <img src={cartCurrentLoan.product?.img} width={400} height={349} alt="Product" />
                                            :
                                            <img src={require('./../../../Images/ProductsImages/default.jpg')} width={226} height={349} alt="Product" />

                                        }

                                    </div>

                                    <div className="col-3 col-md-3 m-5 container ">
                                        <div className="row m-5">
                                            <b>{cartCurrentLoan.product?.brand}</b>
                                            <p>{cartCurrentLoan.product?.title}</p>
                                            <h6><b><i>{cartCurrentLoan.product.price} €</i></b></h6>
                                        </div>

                                    </div>



                                    <div className="card col-3 col-md-3 container d-flex">
                                        <div className="card-body">
                                            <div className="mt-3">
                                                <h4>Loan Options</h4>
                                                {cartCurrentLoan.product.stockAvailable! > 30 &&
                                                    <p className="text-secondary">
                                                         {cartCurrentLoan.product.stockAvailable} product left.
                                                    </p>
                                                }
                                                {cartCurrentLoan.product.stockAvailable === 0 &&
                                                    <b><p className="text-danger">
                                                        This is the last product!
                                                    </p></b>
                                                }
                                                {cartCurrentLoan.product.stockAvailable! <= 30 &&
                                                    <p className="text-danger">
                                                        Only {cartCurrentLoan.product.stockAvailable} product left!
                                                    </p>
                                                }
                                                <div className="list-group mt-3">
                                                    <button className="list-group-item list-group-item-action" aria-current='true' data-bs-toggle='modal' data-bs-target={`#modal${cartCurrentLoan.product.id}`}>
                                                        Manage Loan
                                                    </button>
                                                    <Link to={'search'} className="list-group-item list-group-item-action">
                                                        Search more products?
                                                    </Link>
                                                </div>
                                            </div>
                                            <hr />
                                            <p className="mt-3">
                                                Help others find their adventure by reviewing your loan.
                                            </p>
                                            <Link className="btn btn-primary" to={`/checkout/${cartCurrentLoan.product.id}`}>
                                                Leave a review
                                            </Link>
                                        </div>
                                    </div>
                                    

                                </div>
                                <hr />
                                <LoansModal cartCurrentLoan={cartCurrentLoan} mobile={false} deleteProduct={deleteProduct} buyProduct={buyProduct} />
                            </div>
                            
                        ))}
                    </> :

                    <>
                        <h3 className="mt-3">
                            Currently no loans.
                        </h3>
                        <Link className="btn btn-primary" to={'search'}>
                            Search for a new product
                        </Link>
                        
                    </>

                }
                

            </div>

            {/* Mobile */}
            <div className="container d-lg-none mt-2">
                {cartCurrentLoans.length > 0 ?
                    <>
                        <h5 className="mb-3">Current Loans: </h5>

                        {cartCurrentLoans.map(cartCurrentLoan => (
                            <div key={cartCurrentLoan.product.id}>

                                <div className="d-flex justify-content-center ailgn-items-center">
                                    {cartCurrentLoan.product?.img ?
                                        <img src={cartCurrentLoan.product?.img} width={390} height={349} alt="Product" />
                                        :
                                        <img src={require('./../../../Images/ProductsImages/default.jpg')} width={390} height={349} alt="Product" />

                                    }
                                </div>
                                <b>{cartCurrentLoan.product?.brand}</b>
                                <p>{cartCurrentLoan.product?.title}</p>
                                <h6><b><i>{cartCurrentLoan.product.price} €</i></b></h6>
                                <div className="card d-flex mt-5 mb-3">
                                    <div className="card-body container">
                                        <div className="mt-3">
                                            <h4>Loan Options</h4>
                                            {cartCurrentLoan.productLeft > 30 &&
                                                    <p className="text-secondary">
                                                         {cartCurrentLoan.productLeft} product left.
                                                    </p>
                                                }
                                                {cartCurrentLoan.productLeft === 0 &&
                                                    <p className="text-danger">
                                                        This is the last product!
                                                    </p>
                                                }
                                                {cartCurrentLoan.productLeft <= 30 &&
                                                    <p className="text-danger">
                                                        Only {cartCurrentLoan.productLeft} product left!
                                                    </p>
                                                }
                                            <div className="list-group mt-3">
                                                <button className="list-group-item list-group-item-action" aria-current='true' data-bs-toggle='modal' data-bs-target={`#mobilemodal${cartCurrentLoan.product.id}`}>
                                                    Manage Loan
                                                </button>
                                                <Link to={'search'} className="list-group-item list-group-item-action">
                                                    Search more products?
                                                </Link>
                                            </div>
                                        </div>
                                        <hr />
                                        <p className="mt-3">
                                            Help others find their adventure by reviewing your loan.
                                        </p>
                                        <Link className="btn btn-primary" to={`/checkout/${cartCurrentLoan.product.id}`}>
                                            Leave a review
                                        </Link>
                                    </div>
                                </div>


                                <hr />
                                <LoansModal cartCurrentLoan={cartCurrentLoan} mobile={true} deleteProduct={deleteProduct} buyProduct={buyProduct} />

                            </div>
                        ))}
                    </> :

                    <>
                        <h3 className="mt-3">
                            Currently no loans.
                        </h3>
                        <Link className="btn btn-primary" to={'search'}>
                            Search for a new product
                        </Link>
                    </>

                }

            </div>

        </div>

    );
}
