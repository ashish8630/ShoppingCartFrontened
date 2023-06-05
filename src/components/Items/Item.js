import React, { useContext, useState, useEffect } from "react";
import "./Item.css";
import ItemContext from "../../Context/ItemContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Item = () => {
  const { userId, updateCartItems, cartItems } = useContext(ItemContext);
  const [itemList, setItemList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("grid");
  const [useEffectReload, setUseEffectReload] = useState(false);

  const navigate = useNavigate();
  const productsPerPage = 10;
  const maxPageButtons = 5;

  useEffect(() => {
    axios.get(`http://localhost:8081/api/items/all`).then((res) => {
      console.log(res);
      setItemList(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:8081/api/carts/user/${userId}`).then((res) => {
      console.log(res);
      updateCartItems(res.data);

    });
  }, [useEffectReload]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = itemList.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );


  const totalPages = Math.ceil(itemList.length / productsPerPage);
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleView = () => {
    setView((prevView) => (prevView === "grid" ? "list" : "grid"));
  };

  const addToCart = (itemId) => {
    console.log(itemId);
    axios
      .post(`http://localhost:8081/api/carts/`, {
        userId: userId,
        itemId: itemId,
        quantity: 1,
      })
      .then((res) => {
        console.log(res);
        setUseEffectReload(!useEffectReload);
      });
  };

  const getPageRange = () => {
    const currentPageIndex = pageNumbers.indexOf(currentPage);
    const halfMaxButtons = Math.floor(maxPageButtons / 2);
    const start =
      currentPageIndex < halfMaxButtons ? 0 : currentPageIndex - halfMaxButtons;
    const end =
      start + maxPageButtons >= pageNumbers.length
        ? pageNumbers.length
        : start + maxPageButtons;
    return pageNumbers.slice(start, end);
  };

  const pageRange = getPageRange();

  const goToCart = () => {
    navigate("/cart", true);
  };

  const checkCart=(id)=>{
    const x=cartItems.find((x) => x.item.itemId === id);
    if(x)
      return true;
    return false;
  }

  return (
    <>
      <div className="total-items">
        <h1>Hurry Up!! Ready, Set, Shop!</h1>
        <div className="view-toggle">
          <button onClick={toggleView}>
            {view === "grid" ? "Switch to List View" : "Switch to Grid View"}
          </button>
        </div>
      </div>
      <div className={`items-container ${view}`}>
        {
          
        currentProducts.map((product) => (
          <div key={product.itemId} className="item">
            <img src={product.imageUrl} alt={product.title} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p>
            {checkCart(product.itemId) ? (
              <button onClick={goToCart}>Go to Cart</button>
            ) : (
              <button onClick={() => addToCart(product.itemId)}>
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>
      {itemList.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => paginate(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {pageRange.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => paginate(pageNumber)}
              className={currentPage === pageNumber ? "active" : ""}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default Item;
