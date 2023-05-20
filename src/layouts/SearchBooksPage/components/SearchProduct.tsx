import { Link } from "react-router-dom";
import ProductModel from "../../../models/ProductModel";

export const SearchProduct: React.FC<{ product: ProductModel }> = (props) => {

    return (
        <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">

            <div className="row g-0">

                <div className="col-md-3">


                    <div className="d-none d-lg-block">

                        {props.product.img
                            ?
                            <img src={props.product.img}
                                width={230}
                                height={196}
                                alt="Product"
                            />
                            :
                            <img src={require("../../../Images/ProductsImages/default.jpg")}
                                width={123}
                                height={196}
                                alt="Product"
                            />

                        }

                    </div>
                    <div className="d-lg-none d-flex justify-content-center align-items-center">

                        {props.product.img
                            ?
                            <img src={props.product.img}
                                width={230}
                                height={196}
                                alt="Product"
                            />
                            :
                            <img src={require("../../../Images/ProductsImages/default.jpg")}
                                width={123}
                                height={196}
                                alt="Product"
                            />

                        }

                    </div>

                </div>

                <div className="col-md-5">

                    <div className="card-body">
                        <h5 className="card-title">
                            {props.product.brand}
                        </h5>
                        <h4>
                            {props.product.title}

                        </h4>
                        <p className="card-text">
                            {props.product.description}
                        </p>

                    </div>

                </div>
                <div className="col-md-4 d-flex justify-content-center align-items-center">
                    <div>

                        <h6 className="m-4"><b className="text-danger"><i>{props.product?.price} €</i></b></h6>
                       


                        <Link className="btn btn-md main-color text-white" to={`/checkout/${props.product.id}`}>
                            View Details
                        </Link>



                    </div>
                </div>

            </div>

        </div>
    );
}