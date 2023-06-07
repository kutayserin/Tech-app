import CartCurrentLoans from "../../models/CartCurrentLoans";

export const LoansModal: React.FC<{cartCurrentLoan: CartCurrentLoans, mobile: boolean, deleteProduct: any, buyProduct: any}> = (props) => (
    <div className="modal fade" id={props.mobile ? `mobilemodal${props.cartCurrentLoan.product.id}` :
        `modal${props.cartCurrentLoan.product.id}`} data-bs-backdrop='static' data-bs-keyboard='false'
        aria-labelledby="staticBackdropLabel" aria-hidden='true' key={props.cartCurrentLoan.product.id}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackropLabel">
                            Loan Options
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss='modal' aria-label="Close">

                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="container">
                            <div className="mt-3">
                                <div className="row">
                                    <div className="col-2">
                                        {props.cartCurrentLoan.product?.img ?
                                     <img src={props.cartCurrentLoan.product?.img} width={56} height={87} alt="Product"/>
                                     :
                                     <img src={require("./../../Images/ProductsImages/default.jpg")} width={56} height={87} alt="Product"/>    
                                    }

                                    </div>
                                    <div className="col-10">
                                        <h6>{props.cartCurrentLoan.product.brand}</h6>
                                        <h4>{props.cartCurrentLoan.product.title}</h4>
                                        
                                    </div>
                                </div>
                                <hr />
                               
                                <div className="list-group mt-3">
                                    <button onClick={() => props.buyProduct(props.cartCurrentLoan.product.id) } data-bs-dismiss='modal' className="list-group-item list-group-item-action" aria-current='true'>
                                                Buy Product
                                    </button>
                                    <button onClick={() => props.deleteProduct(props.cartCurrentLoan.product.id)} data-bs-dismiss='modal' className="list-group-item list-group-item-action" aria-current='false'>
                                                Delete Product
                                    </button>
                                  
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss='modal'>
                                Close
                    </button>

                </div>
                </div>
              

            </div>
    </div>
)