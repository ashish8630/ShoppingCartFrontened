import React, { useState, useEffect } from "react";
import { Products } from "../Products";
import "./Cart.css";
import { useContext } from "react";
import ItemContext from "../../Context/ItemContext";
import { MdDelete } from "react-icons/md";
import axios from "axios";

const Cart = () => {
  const { cartItems, userId, updateCartItems } = useContext(ItemContext);
  const [cartId, setcartId] = useState();
  const [userAddress, setUserAddress] = useState([]);
  const [addressInstance, setaddressInstance] = useState(null);
  const [isCheckoutPopup, setIsCheckoutPopup] = useState(false);
  const [isAddressPopup, setIsAddressPopup] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [alternatePhoneNumber, setAlternatePhoneNumber] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [landMark, setLandMark] = useState("");
  const [pincode, setPincode] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [useEffectReload, setUseEffectReload] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8081/api/carts/user/${userId}`).then((res) => {
      console.log(res);
      updateCartItems(res.data);
    });
  }, [useEffectReload]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const emptyStates=()=>{
    setFullName("");
    setPhoneNumber("");
    setAlternatePhoneNumber("");
    setHouseNo("");
    setLandMark("");
    setPincode("");
    setFullAddress("");
  }

  const handlePlaceOrder=()=>{
    console.log(cartItems,addressInstance,userId)
    const cartids=[];
    cartItems.forEach(item => {
      cartids.push(item.cartId);
    });

    console.log(cartids)

    axios
      .post(`http://localhost:8081/api/order/`, {
        userId:userId,
        cartId:cartids,
        addressId:addressInstance.addressId
      })
      .then((res) => {
        console.log(res);
        setUseEffectReload(!useEffectReload);
        setaddressInstance(null);
        setIsAddressPopup(false);
        setIsCheckoutPopup(false);
      });
  }

  const handleAddAddress=()=>{
    const obj={
      fullName:fullName,
      phoneNumber:phoneNumber,
      alternatePhoneNumber:alternatePhoneNumber,
      houseNo:houseNo,
      landMark:landMark,
      pincode:pincode,
      fullAddress:fullAddress
    }
    console.log(obj);

    axios
      .post(`http://localhost:8081/api/address/`, {
        fullName:fullName,
        phoneNumber:phoneNumber,
        alternatePhoneNumber:alternatePhoneNumber,
        houseNo:houseNo,
        landMark:landMark,
        pincode:pincode,
        fullAddress:fullAddress,
        userId:userId,
      })
      .then((res) => {
        console.log(res);
        emptyStates();
        axios.get(`http://localhost:8081/api/address/user/${userId}`)
        .then((res)=>{
          console.log(res.data)
          setUserAddress(res.data);
        })
      });

    handleClose();
  }

  const handleCheckout = (cartId) => {
    axios.get(`http://localhost:8081/api/address/user/${userId}`)
    .then((res)=>{
      console.log(res.data)
      setUserAddress(res.data);
      setIsAddressPopup(true);
      setIsCheckoutPopup(false);
    })
  };

  const handleAddressPopup=(cartId)=>{
    setIsAddressPopup(false);
    setIsCheckoutPopup(true);
  }

  const handleDelete = (cartId) =>{
    axios.put(`http://localhost:8081/api/carts/disable/${cartId}`).then((res) => {
      console.log(res);
      setUseEffectReload(!useEffectReload);
    });
  };

  const handleDeleteAddress = (addressId) =>{
    axios.delete(`http://localhost:8081/api/address/${addressId}`).then((res)=>{
      console.log(res);
      setIsAddressPopup(false);
    })

  };

  const decreaseQuantity = (cartId,quantity) =>{
    if(quantity>1){
      let n = quantity-1;
      axios.put(`http://localhost:8081/api/carts/id/${cartId}/quantity/${n}`).then((res) => {
        console.log(res);
        setUseEffectReload(!useEffectReload);
      });

    }else{
      axios.put(`http://localhost:8081/api/carts/disable/${cartId}`).then((res) => {
        console.log(res);
        setUseEffectReload(!useEffectReload);
      });
    }
  };

  const increaseQuantity = (cartId,quantity) =>{
    let x=quantity+1;
    axios.put(`http://localhost:8081/api/carts/id/${cartId}/quantity/${x}`).then((res) => {
      console.log(res);
      setUseEffectReload(!useEffectReload);
    });
  };

  const handleClose = () => {
    setIsCheckoutPopup(false);
    setIsAddressPopup(false);
  };

  let totalPrice = 0;

  return (
    <div className="cartContainer">
      <div className="myCart">
        <h2>My Cart</h2>
        {cartItems.length > 0 && (
          <p>
            &nbsp;&nbsp;(you have{" "}
            <span className="total-items-count">{cartItems.length}</span> items
            in your cart)
          </p>
        )}
      </div>

      {cartItems.map((product) => {
        const itemTotalPrice = product.item.price * product.quantity;
        totalPrice += itemTotalPrice;
        return (
          <div key={product.item.itemId} className="items">
            <img src={product.item.imageUrl} />
            <h3>{product.item.name}</h3>
            <p>{product.item.description}</p>
            <p>${product.item.price * product.quantity}</p>
            <div className="countHandler">
          <button onClick={() => decreaseQuantity(product.cartId,product.quantity)}>-</button>
          <input value={product.quantity} />
          <button onClick={() => increaseQuantity(product.cartId,product.quantity)}>+</button>
          <MdDelete
                  className="delete-icon"
                  onClick={() => handleDelete(product.cartId)}
                />
        </div>
          </div>
        );
      })}
      {totalPrice > 0 && (
        <div className="total">
          <h3>Total:{totalPrice}</h3>
          <button
            onClick={() => handleCheckout(cartId)}
            className="logout-button"
          >
            checkout
          </button>
        </div>
      )}

      {isAddressPopup && <>
      <div className="popupContainer">
        <div className="popup-box">
        <div className="popupHeader">
          <h3>SELECT ADDRESS</h3>
          <button className="closeButton1" onClick={handleClose}>
                  X
          </button>
          </div>
          {userAddress.map((addr)=><div className="addressContainer">
            <span><input onClick={()=>setaddressInstance(addr)} type="radio" name="address"/></span>
            <div>
            <MdDelete
                  className="delete-icon1"
                  onClick={() => handleDeleteAddress(addr.addressId)}
                />
              <h2>{addr.fullName}</h2>
              <p>{addr.fullAddress}</p>
              <p>Mobile: <b>{addr.phoneNumber}</b></p>

            </div>

          </div>)}
          <div className="addAddress" onClick={()=>handleAddressPopup()}>Add New Address</div>
          {
            addressInstance && <div className="placeBtn" onClick={()=>handlePlaceOrder()}>Place Order</div>
          }
          
        </div>
      </div>
      </>}

      {isCheckoutPopup && (
        <>
          <div className="popupContainer" >
            <div className="popup-boxd">
              <div className="popupHeader">
                <h2>Enter Your Details</h2>
                <button className="closeButton" onClick={handleClose}>
                  X
                </button>
              </div>
              <form className="detail-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="fullName">Full Name:</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="phoneNumber">Phone Number:</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="alternatePhoneNumber">
                    Alternate Phone Number:
                  </label>
                  <input
                    type="tel"
                    id="alternatePhoneNumber"
                    name="alternatePhoneNumber"
                    value={alternatePhoneNumber}
                    onChange={(e) => setAlternatePhoneNumber(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="houseNo">House No:</label>
                  <input
                    type="text"
                    id="houseNo"
                    name="houseNo"
                    value={houseNo}
                    onChange={(e) => setHouseNo(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="landMark">Landmark:</label>
                  <input
                    type="text"
                    id="landMark"
                    name="landMark"
                    value={landMark}
                    onChange={(e) => setLandMark(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="pincode">Pincode:</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="fullAddress">Full Address:</label>
                  <textarea
                    id="fullAddress"
                    name="fullAddress"
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button type="submit" onClick={()=>handleAddAddress()}>Add Address</button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
