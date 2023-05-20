import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import { AdminMessages } from "./components/AdminMessages";
import { AddNewProduct } from "./components/AddNewProduct";
import { ChangeQuantityOfProducts } from "./components/ChangeQuantityOfProducts";
import { ChangeQuantityOfProduct } from "./components/ChangeQuantityOfProduct";

export const ManageServicePage = () => {

    const {authState} = useOktaAuth();

    const [changeQuantitiyOfProductsClick, setChangeQuantityOfProductsClick] = useState(false);
    const [messagesClick, setMessagesClick] = useState(false);

    function addProductClickFunction() {
        setChangeQuantityOfProductsClick(false);
        setMessagesClick(false);
    }
    function changeQuantityOfProductsClickFunction() {
        setChangeQuantityOfProductsClick(true);
        setMessagesClick(false);
    }
    function messagesClickFunction() {
        setChangeQuantityOfProductsClick(false);
        setMessagesClick(true);
    }

    if (authState?.accessToken?.claims.userType === undefined){
        return <Redirect to='/home'/>
    }

    return (
        <div className="container">
            <div className="mt-5">
                <h3>Manage Library</h3>
            </div>
            <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <button onClick={addProductClickFunction} className="nav-link active" id="nav-add-product-tab" data-bs-toggle='tab'
                    data-bs-target='#nav-add-product' type="button" role="tab" aria-controls="nav-add-product"
                    aria-selected='false'>
                        Add new product
                    </button>
                   <button onClick={changeQuantityOfProductsClickFunction} className="nav-link" id="nav-quantity-tab" data-bs-toggle='tab'
                    data-bs-target='#nav-quantity' type="button" role="tab" aria-controls="nav-quantity"
                    aria-selected='true'>
                        Change quantity
                    </button>
                    <button onClick={messagesClickFunction} className="nav-link" id="nav-messages-tab" data-bs-toggle='tab'
                    data-bs-target='#nav-messages' type="button" role="tab" aria-controls="nav-messages"
                    aria-selected='false'>
                        Messages
                    </button>
                </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
                <div className="tab-pane fade show active" id="nav-add-product" role="tabpanel" aria-labelledby="nav-add-product-tab">
                   <AddNewProduct/>
                </div>
                <div className="tab-pane fade" id="nav-quantity" role="tabpanel" aria-labelledby="nav-quantity-tab">
                    {changeQuantitiyOfProductsClick ? <ChangeQuantityOfProducts/> : <></>}
                </div>
                <div className="tab-pane fade show active" id="nav-messages" role="tabpanel" aria-labelledby="nav-messages-tab">
                {messagesClick ? <AdminMessages/> : <></>}
                </div>

            </div>

        </div>
    );
}