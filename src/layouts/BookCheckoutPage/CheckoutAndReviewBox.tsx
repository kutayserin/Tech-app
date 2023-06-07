import { Link } from "react-router-dom";
import ProductModel from "../../models/ProductModel";
import { LeaveAReview } from "../Utils/LeaveAReview";
import { text } from "express";

export const CheckoutAndReviewBox: React.FC<{
 product: ProductModel | undefined, mobile: boolean, currentLoansCount: number, isAuthenticated: any, isCheckedOut: boolean, checkoutProduct: any, isReviewLeft: boolean, submitReview: any
}> = (props) => {


    function getCurrentURL () {
        return window.location.href;
      }
      
      
    const url = getCurrentURL();

    function buttonRender() {
       // somesharedservıce.redırecturl = getCurrentURL();
        if (props.isAuthenticated) {
            if (!props.isCheckedOut && props.currentLoansCount < 5) {
                return (
                    <button onClick={() => props.checkoutProduct()} className="btn btn-success btn-lg">Checkout</button>
                )

            }
            else if (props.isCheckedOut) {
                return (
                    <p>
                        <b>
                            Product checked out. Enjoy!
                        </b>
                    </p>
                )
            }
            else if (!props.isCheckedOut) {
                return (
                    <p className="text-danger">Too many products checked out.</p>
                )
            }
        }
        if(!props.isAuthenticated)
        {
            return (<Link to={'/login'} className="btn btn-success btn-lg">Sign in</Link>)

        }


    }


    function reviewRender() {
        if (props.isAuthenticated && !props.isReviewLeft) {//review bırakılmamış
            return (
               
                <div>
                    <LeaveAReview submitReview = {props.submitReview}/>

                </div>

            )
        }
        else if (props.isAuthenticated && props.isReviewLeft) {//review bırakılmış 
            return (
                <p><b>Thank you for your review!</b></p>
            )
        }
        return (
            <div><hr /><p>Sign in to be able to leave a review.</p></div>
        )

    }

    return (
        <div className={props.mobile ? 'card d-flex mt-5' : 'card col-3 container d-flex mb-5'}>
            <div className="card-body container">

                <div className="mt-3">
                    <p>
                        {/* <b>{props.currentLoansCount}/5 </b> */}
                        <h4><b className="text-danger"><i>{props.product?.price} €</i></b></h4>
                    </p>
                    <hr />
                    {props.product && props.product.stockAvailable && props.product.stockAvailable > 0 ?
                        <h4 className="text-success">Available</h4>
                        :
                        <h4 className="text-danger">Wait List</h4>
                    }
                    <div className="row">
                        <p className="col-6 lead">

                            <b>{props.product?.stock} </b>
                            stock
                        </p>

                        <p className="col-6 lead">

                            <b>{props.product?.stockAvailable} </b>
                            available

                        </p>
                    </div>
                </div>
                {buttonRender()}
                <hr />

                {reviewRender()}

            </div>

        </div>
    );
}