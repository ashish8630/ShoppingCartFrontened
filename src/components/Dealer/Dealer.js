import React, { useState, useContext, useEffect } from "react";
import { Products } from "../Products";
import "./Dealer.css";
import ItemContext from "../../Context/ItemContext";
import { MdDelete } from "react-icons/md";
import axios from "axios";

const Dealer = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [products, setProducts] = useState([]);
  const [categoryId,setCategoryId] = useState();
  const [categoryList,setCategoryList] = useState([]);
  const { userId } = useContext(ItemContext);
  const [useEffectReload, setUseEffectReload] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8081/api/items/user/${userId}`).then((res) => {
      console.log(res);
      setProducts(res.data);
    });

    axios.get(`http://localhost:8081/api/category/`).then((res) => {
      console.log(res);
      setCategoryList(res.data);
    });

  }, [useEffectReload]);

  const handleAddButtonClick = () => {
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:8081/api/items/?image=${imageFile}`, {
        name: name,
        description: description,
        price: price,
        stockQuantity: stockQuantity,
        userId: userId,
        categoryId: categoryId
      })
      .then((res) => {
        console.log(res);
        setUseEffectReload(!useEffectReload);
      });
    setName("");
    setImageFile(null);
    setDescription("");
    setPrice(0);
    setStockQuantity(0);
    setShowForm(false);
  };

  const handleClose = () => {
    setShowForm(false);
  };

  const handleDelete = (id) => {
    console.log(id);
    axios.delete(`http://localhost:8081/api/items/${id}`).then((res) => {
      console.log(res);
      setUseEffectReload(!useEffectReload);
    });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dealerContainer">
      <div className="searchContainer">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products"
        />
        {!showForm && (
          <button className="addProduct" onClick={handleAddButtonClick}>
            Add Product
          </button>
        )}
      </div>
      {showForm && (
        <>
          <div className="popupContainer">
            <div className="popup-boxd">
              <div className="popupHeader">
                <h2>Add Product</h2>
                <button className="closeButton" onClick={handleClose}>
                  X
                </button>
              </div>
              <form className="register-forms" onSubmit={handleSubmit}>
                <div className="input-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                {/* <div className="input-group">
                  <label>Image URL:</label>
                  <input
                    type="text"
                    value={imageURL}
                    onChange={(e) => setImageURL(e.target.value)}
                  />
                </div> */}
                
                <div className="input-group">
                  <label>Image:</label>
                  <input
        type="file"
        name="image"
        onChange={(e)=>setImageFile(e.target.value)}
      />
                </div>
                <div className="input-group">
                  <label>Category:</label>
                  <select
                    onClick={(e) => setCategoryId(e.target.value)} required={true}
                  >
                    <option value="">Select category</option>
                    {categoryList.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Description:</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Price:</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label>Stock Quantity:</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(parseInt(e.target.value))}
                  />
                </div>
                <div className="submit-button">
                  <button type="submit">Add</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
      {filteredProducts.length > 0 && (
        <div className="myProducts">
          <h2>My Product</h2>
          <div className="productList">
            {filteredProducts.map((product, index) => (
              <div key={product.id} className="items">
                <img src="{product.imageURL}" alt="alt" />
                <h3>{product.name}</h3>
                <h3>{product.description}</h3>
                <p>{product.stockQuantity}</p>
                <p>${product.price}</p>
                <MdDelete
                  className="delete-icon"
                  onClick={() => handleDelete(product.itemId)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dealer;
