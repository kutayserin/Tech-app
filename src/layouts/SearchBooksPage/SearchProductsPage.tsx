import React from 'react';
import { useEffect, useState } from 'react';
import ProductModel from '../../models/ProductModel';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import { SearchProduct } from './components/SearchProduct';
import { Pagination } from '../Utils/Pagination';

export const SearchProductsPage = () => {



    const [products, setProducts] = useState<ProductModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(5);
    const [totalAmountOfProducts, setTotalAmountOfProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [categorySelection, setCategorySelection] = useState('Product Category');
  



    useEffect(() => {
        const fetchProducts = async () => {
            const baseUrl: string = "https://localhost:8443/api/products";

            let url: string = ``;

            if (searchUrl === '') {
                url = `${baseUrl}?page=${currentPage - 1}&size=${productsPerPage}`
            }
            else {
                let searchWithPage = searchUrl.replace('<pageNumber>', `${currentPage -1}`)
                url = baseUrl + searchWithPage;
            }
          
            

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.products;

            setTotalAmountOfProducts(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages)

            const loadedProducts: ProductModel[] = [];

            for (const key in responseData) {
                loadedProducts.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    brand: responseData[key].brand,
                    price: responseData[key].price,
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
        fetchProducts().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl]);


    if (isLoading) {
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

    const indexOfLastProduct: number = currentPage * productsPerPage;
    const indexOfFirstProduct: number = indexOfLastProduct - productsPerPage;
    let lastItem = productsPerPage * currentPage
        <= totalAmountOfProducts ? productsPerPage * currentPage : totalAmountOfProducts;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

   

    const searchHandleChange = () => {

        setCurrentPage(1);

        if (search === '') {
            setSearchUrl('');
        }
        else {
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${productsPerPage}`)

        }
        setCategorySelection('Product category');
    }

    const categoryField = (value:string) => {
        setCurrentPage(1);
        if(value.toLowerCase() === 'laptop'
        ||value.toLowerCase() === 'phone'
        ||value.toLowerCase() === 'tv'
        ||value.toLowerCase() === 'earphone'
        )
        {setCategorySelection(value)
            setSearchUrl(`/search/findByCategory?category=${value}&page=<pageNumber>&size=${productsPerPage}`)

        }

        else{
            setCategorySelection('All');
            setSearchUrl(`?page=<pageNumber>&size=${productsPerPage}`)

            
        }
    }


    return (

        <div>
            <div className="container">
                <div>
                    <div className='row mt-5'>
                        <div className='col-6'>

                            <div className='d-flex'>

                                <input className='form-control me-2' type='search' placeholder='Search'
                                    aria-labelledby='Search' onChange={(e) => setSearch(e.target.value)} />

                                <button className='btn btn-outline-success' onClick={searchHandleChange}>
                                    Search
                                </button>
                            </div>


                        </div>
                        <div className='col-4'>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" id='dropdownMenuButton1' type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                   {categorySelection}
                                </button>
                                <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                <li onClick={() => categoryField('All')}>
                                        <a className='dropdown-item' id='1' href="#">
                                            All
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Laptop')}>
                                        <a className='dropdown-item' id='2' href="#">
                                            Laptop
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Phone')}>
                                        <a className='dropdown-item' id='3' href="#">
                                            Phone
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('TV')}>
                                        <a className='dropdown-item' id='4' href="#">
                                            TV
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Earphone')}>
                                        <a className='dropdown-item' id='5' href="#">
                                            Earphone
                                        </a>
                                    </li>

                                </ul>

                            </div>
                        </div>
                        {totalAmountOfProducts > 0 ?
                            <>
                                <div className='mt-3'>
                                    <h5>Number of results: ({totalAmountOfProducts})</h5>

                                </div>
                                <p>
                                    {indexOfFirstProduct + 1} to {lastItem} of {totalAmountOfProducts} items:
                                </p>
                                {
                                    products.map(product =>
                                        <SearchProduct product={product} key={product.id} />
                                    )
                                }
                            </>
                            :
                            <div className='m-5'>
                                <h3>Can't find what you are looking for?</h3>
                                <a type='button' className='btn main-color btn-md px-4 me-md-2 fw-bold text-white' href="#">Library services</a>

                            </div>
                        }

                        {
                            totalPages > 1 &&
                            <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                        }
                    </div>

                </div>


            </div>



        </div>


    );

}