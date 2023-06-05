import React, { useContext, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { GrCart } from "react-icons/gr";
import { Link } from "react-router-dom";
import "./Navbar.css";
import  ItemContext  from "../../Context/ItemContext";

const Navbar = () => {
  const { cartItems ,handleLogout,userRole } = useContext(ItemContext);
  return (
    <>
      {userRole === "CUSTOMER" && (
        <div className="navbar">
          <div className="shop">
            <Link to="/">Shopify</Link>
          </div>
          <div className="cart">
            <Link to="/cart">
              <GrCart className="cart-icon" />
            </Link>
            <span>
              { cartItems.length }
            </span>
          </div>
          <div className="myOrder-button">
          <Link to="/orders" >
              My Orders
            </Link>
          </div>
          <div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}

{userRole === "DEALER" && (
        <div className="navbar">
          <div className="shop">
            <Link to="/dealer">Shopify</Link>
          </div>
          <div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
