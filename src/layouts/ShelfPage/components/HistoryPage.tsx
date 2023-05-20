import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import HistoryModel from "../../../models/HistoryModel";
import { error } from "console";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { Pagination } from "../../Utils/Pagination";
import { PaymentPage } from "../../PaymentPage/PaymentPage";

export const HistoryPage = () => {

    const { authState } = useOktaAuth();
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [httpError, setHttpError] = useState(null);


    //Histories
    const [histories, setHistories] = useState<HistoryModel[]>([]);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUserHistory = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8443/api/histories/search/findProductsByUserEmail/?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=5`;
                const requestOptions = {
                    method: 'GET',
                    headers: {

                        'Content-Type': 'application/json'
                    }
                };

                const historyResponse = await fetch(url, requestOptions);

                if (!historyResponse.ok) {
                    throw new Error('Something went wrong!');
                }

                const historyResponseJson = await historyResponse.json();
                console.log(historyResponseJson);

                setHistories(historyResponseJson._embedded.histories);
                setTotalPages(historyResponseJson.page.totalPages);

            }
            setIsLoadingHistory(false);
        }
        fetchUserHistory().catch((error: any) => {
            setIsLoadingHistory(false);
            setHttpError(error.message);
        });


    }, [authState, currentPage]);

    if (isLoadingHistory) {
        return (
            <SpinnerLoading />
        )

    }

    if (httpError) {
        <div className="container m-5">
            <p>
                {httpError}
            </p>
        </div>
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    return (
        <div className="mt-2">
            {histories.length > 0 ?
                <>
                    <h5>Recent History</h5>

                    {histories.map(history => (
                        <div key={history.id}>
                            <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
                                <div className="row g-0">
                                    <div className="col-md-3">
                                        <div className="d-none d-lg-block">
                                            {history.img ?
                                                <img src={history.img} width={230} height={196} alt='Product' />
                                                :
                                                <img src={require('./../../../Images/ProductsImages/default.jpg')} width={123} height={196} alt='Default' />
                                            }
                                        </div>
                                        <div className="d-lg-none d-flex justify-content-center align-items-center">
                                            {history.img ?
                                                <img src={history.img} width={230} height={196} alt='Product' />
                                                :
                                                <img src={require('./../../../Images/ProductsImages/default.jpg')} width={123} height={196} alt='Default' />
                                            }
                                        </div>

                                    </div>
                                    <div className="col-12 d-lg-none d-flex">
                                        <div className="card-body">
                                            <h5 className="card-title">{history.brand}</h5>
                                            <h4>{history.title}</h4>
                                            <p className="card-text">{history.description}</p>
                                            <hr />
                                            <p className="card-text">Checked out on: {history.checkoutDate}</p>
                                            <p className="card-text">Bought on: {history.boughtDate}</p>
                                            <div className="col d-flex d-lg-none justify-content-center align-items-center">
                                                <h4>{history?.price} €</h4>

                                            </div>
                                          
                                            
                                        </div>
                                        
                                    </div>

                                    <div className="col-7 d-none d-lg-block">
                                        <div className="card-body">
                                            <h5 className="card-title">{history.brand}</h5>
                                            <h4>{history.title}</h4>
                                            <p className="card-text">{history.description}</p>
                                            <hr />
                                            <p className="card-text">Checked out on: {history.checkoutDate}</p>
                                            <p className="card-text">Bought on: {history.boughtDate}</p>
                                            <div className="col justify-content-center align-items-center">
                                                <h4>{history?.price} €</h4>

                                            </div>
                                          
                                            
                                        </div>
                                        
                                    </div>
                                    
                                    
                                    
                                    



                                </div>

                            </div>
                            <hr />

                        </div>
                    ))}
                </>
                :
                <>
                    <h3 className="mt-3">Currently no history: </h3>
                    <Link className="btn btn-primary" to={'search'}>
                        Search for new product</Link>
                </>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>


    );
}