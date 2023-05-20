import { useEffect, useState } from "react";
import ProductModel from "../../../models/ProductModel";
import { useOktaAuth } from "@okta/okta-react";

export const ChangeQuantityOfProduct: React.FC<{product: ProductModel, deleteProduct: any}> = (props,key) => {

    const {authState} = useOktaAuth();
    const[quantity,setQuantity] = useState<number>(0);
    const[remaining, setRemaining] = useState<number>(0);

    useEffect(() => {
        const fetchProductInState = () => {
            props.product.stock ? setQuantity(props.product.stock) : setQuantity(0);
            props.product.stockAvailable ? setRemaining(props.product.stockAvailable) : setRemaining(0);


        };
        fetchProductInState();
    },[])

    async function increaseQuantity() {
        const url = `http://localhost:8443/api/admin/secure/increase/product/quantity/?productId=${props.product?.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {

                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
         
        };
        const quantityUpdateResponse = await fetch(url,requestOptions);
        if(!quantityUpdateResponse.ok){
            throw new Error('Something went wrong!');
        }
        setQuantity(quantity + 1);
        setRemaining(remaining + 1);
    }

    

    async function decreaseQuantity() {
        const url = `http://localhost:8443/api/admin/secure/decrease/product/quantity/?productId=${props.product?.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {

                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
         
        };
        const quantityUpdateResponse = await fetch(url,requestOptions);
        if(!quantityUpdateResponse.ok){
            throw new Error('Something went wrong!');
        }
        setQuantity(quantity - 1);
        setRemaining(remaining - 1);
    }

    async function deleteProduct(){
        const url = `http://localhost:8443/api/admin/secure/delete/product/?productId=${props.product?.id}`;
        const requestOptions = {
            method: 'DELETE',
            headers: {

                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
         
        };
        const updateResponse = await fetch(url,requestOptions);
        if(!updateResponse.ok){
            throw new Error('Something went wrong!');
        }
        props.deleteProduct();
        
    }

  

    return(
        <div className="card mt-3 shadow mb-3 bg-body rounded">
            <div className="row g-0">
                <div className="col-md-2">
                    <div className="d-none d-lg-block m-3">
                        {props.product.img ?
                        <img src={props.product.img} width={123} height={196} alt="Product"/>
                        :
                        <img src=
                        {require('./../../../Images/ProductsImages/default.jpg')} width={123} height={196} alt="Product"/>

                        }
                    </div>
                    <div className="d-lg-none d-lex justify-content-center align-items-center m-3">
                    {props.product.img ?
                        <img src={props.product.img} width={123} height={196} alt="Product"/>
                        :
                        <img src=
                        {require('./../../../Images/ProductsImages/default.jpg')} width={123} height={196} alt="Product"/>

                        }
                    </div>

                </div>
                <div className="col-md-6">
                        <div className="card-body">
                            <h5 className="card-title">
                                {props.product.brand}
                            </h5>
                            <h4>{props.product.title}</h4>
                            <p className="card-text">{props.product.description}</p>
                        </div>
                </div>
                <div className="mt-3 col-md-4">
                        <div className="d-flex justify-content-center align-items-center">
                            <p>Total Quantity: <b>{quantity}</b></p>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <p>Products Remaining: <b>{remaining}</b></p>

                        </div>
                </div>
                <div className="mt-3 col-md-1">
                        <div className="d-flex justify-content-start">
                            <button onClick={deleteProduct} className="m-1 btn btn-md btn-danger">
                                Delete
                            </button>
                        </div>
                </div>
                <button onClick={increaseQuantity} className="m-1 btn btn-md main-color text-white">Add Quantity</button>
                <button onClick={decreaseQuantity} className="m-1 btn btn-md btn-warning">Decrease Quantity</button>
            </div>

        </div>
    );
}