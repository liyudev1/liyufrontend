import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Register from "./components/Register"
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/LoginPage";
import HomePage from "./components/HomePage";
import ProductDetail from "./components/ProductDetail";
import MyOrder from "./components/MyOrders";
import { CartProvider } from "./components/CartFunc";
import ContactUs from "./components/ContactPage";
import DeliveryLogin from "./components/DeliveryLoginPage";
import DeliveryRegister from "./components/DeliveryRegistration";
import DeliveryHomePage from "./components/DeliveryHomePage";
import ProtectedRouteForDeliveryPerson from "./components/ProtectedRouteForDeliveryPerson";

export function Logout(){
  localStorage.clear()
  return <Navigate to="/login"/>
}

function App() {
  return (
    <CartProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register />} />
            <Route path='/logout' element={<Logout />} /> 
            <Route path="" element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
            <Route path="/product-detail/:product_slug" element={<ProtectedRoute><ProductDetail/></ProtectedRoute>}/>
            <Route path="/my-order" element={<ProtectedRoute><MyOrder/></ProtectedRoute>}/>
            <Route path="/contact" element={<ProtectedRoute><ContactUs/></ProtectedRoute>}/>
            <Route path='/delivery-login' element={<DeliveryLogin/>} />
            <Route path='/delivery-register' element={<DeliveryRegister />} />
            <Route path='/delivery-home' element={<ProtectedRouteForDeliveryPerson><DeliveryHomePage /></ProtectedRouteForDeliveryPerson>} /> 
          </Routes>
        </BrowserRouter>
      </div>
    </CartProvider>
    )
}


export default App
