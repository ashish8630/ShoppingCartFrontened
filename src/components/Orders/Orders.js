import React, { useEffect, useState ,useContext} from 'react'
import "./orders.css"
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import ItemContext from "../../Context/ItemContext";

const Orders = () => {

    const [orderList,setorderList]=useState([]);
    const [useEffectReload, setUseEffectReload] = useState(false);
    const { userId } = useContext(ItemContext);


    useEffect(()=>{
        axios.get(`http://localhost:8081/api/order/`)
        .then((res)=>{
          console.log(res.data)
          setorderList(res.data);
        })
    }, [useEffectReload])

    const handleDelete =(orderId)=>{
      console.log(orderId)
      axios.put(`http://localhost:8081/api/order/cancel/${orderId}`).then((res)=>{
        console.log(res);
        setUseEffectReload(!useEffectReload);
      })
    };

  return (
    <>
    <div className="orderContainer">
      <div className="myOrder">
        <h2>My Orders</h2>
      </div>

      
      {orderList.map((order) => (
  <div key={order.orderId} className="orderContainer">
    <div className="orderHeader">
    <h3>Order Date: 4th June 2023</h3>
    <p>Total Price: ${order.total}</p>
    <MdDelete
      className="delete-icon"
      onClick={() => handleDelete(order.orderId)}
    />
    </div>
    <div className={`items-container list`}>
    {order.carts.map((product) => (
      <div key={product.item.itemId} className="item">
        <img src={product.item.imageUrl} alt={product.item.name} />
        <h4>{product.item.name}</h4>
        <p>Quantity: {product.quantity}</p>
      </div>
    ))}
  </div>
</div>
))}




    </div>
    </>
  )
}

export default Orders