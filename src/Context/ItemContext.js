import React, { createContext } from 'react';
import  { useState ,useEffect} from "react";
import { Products } from '../components/Products';
import axios from 'axios';

const ItemContext = createContext(null);

export const ItemContextProvider = (props) => {

//   const getDefaultCart = () => {
//     let cart = {};
//     for (let i = 1;i<itemList.length +1;i++){
//         cart[i]=0;
//     }
//     return cart;
// }

  const [cartItems, setCartItems] = useState([]);
  const [isAuthenciated, setIsAuthenciated] = useState(false);
  const [userRole,setUserRole]=useState("");
  const [userName,setUserName]=useState("");
  const [userId,setUserId]=useState("");
  const [useEffectReload,setUseEffectReload]=useState(true)

  const updateUserRole=(e)=>setUserRole(e);
  const updateUserName=(e)=>setUserName(e);
  const updateUserId=(e)=>setUserId(e);
  const updateCartItems=(e)=>setCartItems(e);
  const updateIsAuthenciated =(e)=>{setIsAuthenciated(e) ;setUseEffectReload(!useEffectReload)};



  const handleLogout =()=>{
    setIsAuthenciated(false);
    setUseEffectReload(!useEffectReload)
  }

  // const addToCart =(itemId) =>{
  //   axios.post(`http://localhost:8081/api/carts/`).then((res) => {
  //     console.log(res);
  //     setCartItems(res.data);
  //   });
  // }

  // const removeFromCart =(itemId) =>{
  //   setCartItems((prev) => ({...prev, [itemId]:prev[itemId] - 1}));
  // }

  const contextValue = {
    cartItems,
     isAuthenciated,
     handleLogout,
     updateIsAuthenciated,
     updateUserRole,
     userRole,
     useEffectReload,
     updateUserId,
     userId,
     updateUserName,
     userName,
     updateCartItems
  }

//   console.log(cartItems);
  return (
    <ItemContext.Provider
        value={contextValue}    
    >
        {props.children}
    </ItemContext.Provider>
  )
}

export default ItemContext