import React from 'react';
import ProductModel from '../../../models/ProductModel';
import { Link } from 'react-router-dom';

export const ReturnProduct: React.FC<{product: ProductModel}> = (props) => {

    return (

            <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3">
                <div className="text-center">
                    {props.product.img ?
                     <img src={props.product.img} width='260' height='233' alt="product"/>

                    :
                    <img src={require('./../../../Images/ProductsImages/default.jpg')} width='151' height='233' alt="product"/>

                    }
                    
                    <h6 className="mt-2">{props.product.title}</h6>
                    <p>{props.product.brand}</p>
                    <Link className="btn main-color text-white" to={`checkout/${props.product.id}`}>Reserve</Link>

                </div>

            </div>
    );
}