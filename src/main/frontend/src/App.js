import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Sale from "./pages/Sale/Sale";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import RoleSelect from "./pages/Signup/RoleSelect";
import MyPage from "./pages/MyPage";
import BuyerWizard from "./pages/SignupWizard/BuyerWizard";
import SellerWizard from "./pages/SignupWizard/SellerWizard";
import SellerApprovals from "./pages/Admin/SellerApprovals";

// 마이페이지 컴포넌트들
import EditInfo from './components/MyPage/EditInfo.js';
import OrderList from './components/MyPage/OrderList.js';
import Reviews from './components/MyPage/Reviews.js';
import Inquiries from './components/MyPage/Inquiries.js';
import Bids from './components/MyPage/Bids.js';
import Cart from './components/MyPage/Cart.js';
import ProductRegister from './components/MyPage/ProductRegister.js';
import SellerMainPage from './components/MyPage/SellerMainPage.js';

// 구매자 마이페이지 컴포넌트들
import BuyerMainPage from './components/MyPage/BuyerMainPage.js';
import BuyerProfile from './components/MyPage/BuyerProfile.js';
import BuyerOrders from './components/MyPage/BuyerOrders.js';
import BuyerReviews from './components/MyPage/BuyerReviews.js';
import BuyerInquiries from './components/MyPage/BuyerInquiries.js';
import BuyerAuctions from './components/MyPage/BuyerAuctions.js';
import BuyerCart from './components/MyPage/BuyerCart.js';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* 메인: 판매 화면 */}
        <Route path="/" element={<Sale />} />
        <Route path="/sale/:kind/:type" element={<Sale />} />
        
        {/* 인증/마이페이지 */}
        <Route path="/login" element={<Login />} />
        <Route path="/me" element={<MyPage />} />

        {/* 회원가입(역할선택 → 폼) */}
        <Route path="/signup">
          <Route index element={<Navigate to="select" replace />} />
          <Route path="select" element={<RoleSelect />} />
          <Route path="buyer" element={<BuyerWizard />} />
          <Route path="seller" element={<SellerWizard />} />
        </Route>

        {/* 관리자승인 */}
        <Route path="/admin/sellers" element={<SellerApprovals/>} />

        {/* 마이페이지 라우트 */}
        <Route path="/mypage/:userType/:userId" element={<MyPage />} />
        <Route path="/mypage/seller/:userId" element={<SellerMainPage />} />
        <Route path="/mypage/:userType/:userId/edit-info" element={<EditInfo />} />
        <Route path="/mypage/:userType/:userId/orders" element={<OrderList />} />
        <Route path="/mypage/:userType/:userId/reviews" element={<Reviews />} />
        <Route path="/mypage/:userType/:userId/inquiries" element={<Inquiries />} />
        <Route path="/mypage/:userType/:userId/bids" element={<Bids />} />
        <Route path="/mypage/:userType/:userId/cart" element={<Cart />} />
        <Route path="/mypage/:userType/:userId/product-register" element={<ProductRegister />} />
        
        {/* 구매자 마이페이지 라우트 */}
        <Route path="/buyer/:userId" element={<BuyerMainPage />} />
        <Route path="/buyer/:userId/profile" element={<BuyerProfile />} />
        <Route path="/buyer/:userId/orders" element={<BuyerOrders />} />
        <Route path="/buyer/:userId/reviews" element={<BuyerReviews />} />
        <Route path="/buyer/:userId/inquiries" element={<BuyerInquiries />} />
        <Route path="/buyer/:userId/auctions" element={<BuyerAuctions />} />
        <Route path="/buyer/:userId/cart" element={<BuyerCart />} />

        {/* 없는 경로는 메인으로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App;
