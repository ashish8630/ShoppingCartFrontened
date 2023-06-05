import React, { useState ,useContext} from "react";
import "./Login.css";
import axios from 'axios';
import  ItemContext  from "../../Context/ItemContext";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showDealerForm, setShowDealerForm] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [name,setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const {isAuthenciated,updateIsAuthenciated,updateUserRole,userRole,updateUserName,updateUserId} = useContext(ItemContext);


  const handleSubmit = (e) => {
    e.preventDefault();

    
      axios.post(`http://localhost:8081/api/user/login`,{
        "email":email,
        "password":password
          })
          .then((res)=>{
            console.log(res);
          if(res.data.role != null){
              console.log(res.data.role);
              updateIsAuthenciated(true);
              updateUserRole(res.data.role);
              updateUserName(res.data.name);
              updateUserId(res.data.userId);
              console.log(isAuthenciated)   
              }     else {
                alert("Invalid UserName or Password ");
              }

          });
  
  };

  const handleRegister = () => {
    setShowRegisterForm(true);
  };

  const handleCustomerRegisterSubmit = (e) => {
    e.preventDefault();
    // Register logic
    if (registerPassword === confirmPassword) {
    axios.post(`http://localhost:8081/api/user/CUSTOMER`,{
      "name":name,
      "email":registerEmail,
      "password":registerPassword
        })
        .then((res)=>{
          console.log(res);
          setShowRegisterForm(false);
        });
      }else {
        alert("Password Mismatch");
      }

  };

  const handleDealerRegisterSubmit = (e) => {
    e.preventDefault();
    if (registerPassword === confirmPassword) {
    axios.post(`http://localhost:8081/api/user/DEALER`,{
      "name":name,
      "email":registerEmail,
      "password":registerPassword
        })
        .then((res)=>{
          console.log(res);
          setShowDealerForm(false);

        });
      }else {
        alert("Password Mismatch");
      }

  };

  

  const handleClose = () => {
    setShowRegisterForm(false);
    setShowDealerForm(false);
  };

  return (
    <div className="Container">
      <div className="sellerContainer">
        <button className="sellerButton" onClick={()=>setShowDealerForm(true)}>Become a Seller</button>
        <h1>Welcome to Shopify</h1>
      </div>
      
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="buttonContainer">
          <button type="submit">Login</button>
          <button type="button" onClick={handleRegister}>
            SignUp
          </button>
        </div>
      </form>


      {showRegisterForm && (
        <div className="popupContainer">
          <div className="popup-boxd">
            <div className="popupHeader">
              <h2>Register</h2>
              <button className="closeButton" onClick={handleClose}>
                X
              </button>
            </div>
            <form className="register-form" onSubmit={handleCustomerRegisterSubmit}>
              <input
                type="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      )}

{showDealerForm && (
        <div className="popupContainer">
          <div className="popup-boxd">
            <div className="popupHeader">
              <h2>Become a Seller</h2>
              <button className="closeButton" onClick={handleClose}>
                X
              </button>
            </div>
            <form className="register-form" onSubmit={handleDealerRegisterSubmit}>
              <input
                type="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;
