import React, { useState, useEffect } from "react";
import Item from "./components/Items/Item";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Cart from "./components/Cart/Cart";
import Dealer from "./components/Dealer/Dealer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ItemContext from "./Context/ItemContext";
import "./App.css";
import Orders from "./components/Orders/Orders";

const App = () => {
  const { isAuthenciated, userRole,useEffectReload } = useContext(ItemContext);
  const [customerflag, setCustomerflag] = useState(false);
  const [dealerflag, setDealerflag] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    console.log(isAuthenciated);
    if (isAuthenciated) {
      console.log(isAuthenciated)
      console.log(userRole)
      switch (userRole) {
        case "CUSTOMER":
          console.log("first")
          navigate("/", true);
          break;
        case "DEALER":
          navigate("/dealer", true);
          break;
      }
    }
    else{
      navigate("/login", true);
    }
    if (userRole !== "") {
      setCustomerflag(false);
      setDealerflag(false);
      switch (userRole) {
        case "CUSTOMER":
          setCustomerflag(true);
          break;
        case "DEALER":
          setDealerflag(true);
          break;
      }
    }
  }, [useEffectReload]);
  return (
    <>
        {isAuthenciated ?  (
          <>
            {customerflag && (
              <div>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Item />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/orders" element={<Orders />} />
                </Routes>
              </div>
            )}
            {dealerflag && (
              <div>
                <Navbar />
                <Routes>
                  <Route path="/dealer" element={<Dealer />} />
                </Routes>
              </div>
            )}
          </>
        )
      :(
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
          )}
    </>
  );
};
export default App;









