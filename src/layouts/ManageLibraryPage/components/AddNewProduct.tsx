import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import AddProductRequest from "../../../models/AddProductRequest";

export const AddNewProduct = () => {

    const { authState } = useOktaAuth();

    // New Product
    const [title, setTitle] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Category');
    const [stock, setStock] = useState(0);
    const [selectedImage, setSelectedImage] = useState<any>(null);

    // Displays
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    function categoryField(value: string) {
        setCategory(value);
    }

    async function base64ConversionForImages(e: any){
        if (e.target.files[0]){
            getBase64(e.target.files[0]);

        }
    }

    function getBase64(file: any){
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setSelectedImage(reader.result);
        };
        reader.onerror = function (error) {
            console.log('Error', error);
        }
    }

    async function submitNewProduct() {
        const url = `https://localhost:8443/api/admin/secure/add/product`;
        if (authState?.isAuthenticated && title !== '' && brand !== '' && category !== 'Category' && description !== '' && stock >= 0){
            const product: AddProductRequest = new AddProductRequest(title, brand,price,description,stock,category);
            product.img = selectedImage;
            const requestOptions = {
                method: 'POST',
                headers: {

                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            }
            const submitNewProductResponse = await fetch(url,requestOptions);
            if(!submitNewProductResponse.ok){
                throw new Error('Something went wrong!');
            }
            setTitle('');
            setBrand('');
            setCategory('');
            setStock(0);
            setDescription('');
            setSelectedImage(null);
            setDisplayWarning(false);
            setDisplaySuccess(true);

        }
        else{
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    return (
        <div className="container mt-5 mb-5">
            {displaySuccess &&
                <div className="alert alert-success" role="alert">
                    Product added successfully.
                </div>
            }
            {displayWarning &&
                <div className="alert alert-danger" role="alert">
                    All fields must be filled out.
                </div>
            }
            <div className="card">
                <div className="card-header">
                    Add new product
                </div>
                <div className="card-body">
                    <form method="POST">
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Title</label>
                                <input type="text" className="form-control" name="title" required onChange={e => setTitle(e.target.value)} value={title} />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Brand</label>
                                <input type="text" className="form-control" name="brand" required onChange={e => setBrand(e.target.value)} value={brand} />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Price</label>
                                <input type="number" className="form-control" name="price" required onChange={e => setPrice(Number(e.target.value))} value={price} />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Category</label>
                                <button className="form-control btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
                                    data-bs-toggle='dropdown' aria-expanded='false'>{category}</button>
                                <ul id="addNewProductId" className="dropdown-menu" aria-labelledby="dropdownMenuButton1" >
                                    <li><a onClick={() => categoryField('Laptop')} className="dropdown-item">Laptop</a></li>
                                    <li><a onClick={() => categoryField('Phone')} className="dropdown-item">Phone</a></li>
                                    <li><a onClick={() => categoryField('TV')} className="dropdown-item">TV</a></li>
                                    <li><a onClick={() => categoryField('Earphone')} className="dropdown-item">Earphone</a></li>

                                </ul>
                            </div>
                        </div>

                        <div className="col-md-12 mb-3">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" id="exampleFormControlTextarea1" rows={3} required onChange={e => setDescription(e.target.value)} value={description}></textarea>
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Stock</label>
                            <input type="number" className="form-control" name="stock" required onChange={e => setStock(Number(e.target.value))} value={stock} />
                        </div>
                        <input type="file" onChange={e => base64ConversionForImages(e)}/>
                        <div>
                            <button type="button" className="btn btn-primary mt-3" onClick={submitNewProduct}>
                              Add Product
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}