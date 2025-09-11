import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import Home from './home/Home';
import HomeSearch from './home/HomeSearch.js';
import Quote from './quote/Quote.js';
import Header from './components/Header';
import Footer from './components/Footer';
import Sale from './sale/Sale';
import SaleDetail from './sale/SaleDetail';
import Auction from './sale/auction/Auction';
import AuctionDetail from './sale/auction/AuctionDetail';
import PastAuction from './sale/auction/PastAuction.js';

import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import RoleSelect from "./pages/Signup/RoleSelect";
import MyPage from "./pages/MyPage";
import MyPageRedirect from "./components/MyPage/MyPageRedirect.js";
import BuyerWizard from "./pages/SignupWizard/BuyerWizard";
import SellerWizard from "./pages/SignupWizard/SellerWizard";
import { fetchCurrentUser } from './store/store';

import ForgotPassword from "./pages/account/ForgotPassword";

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
import BuyerWinningAuctions from './components/MyPage/BuyerWinningAuctions.js';

import FaqPage from './cs/FaqPage.js';
import InquirePage from './cs/InquirePage.js';
import NoticePage from './cs/Notice.js';

import TestKG from './sale/TestKG.js';
function App() {
  const dispatch = useDispatch();

  // 앱 초기 로딩 시 사용자 정보 확인
  useEffect(() => {
    console.log('App 초기 로딩 - 사용자 정보 확인 시작');
    // 앱 시작 시 Redux 상태 초기화 후 사용자 정보 확인
    dispatch({ type: 'auth/clearAuth' });
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <Routes>
        {/* 메인: 판매 화면 */}
        <Route path="/" element={<Sale />} />
        <Route path="/sale/:kind/:type" element={<Sale />} />
        
        
        {/* 인증/마이페이지 */}
        <Route path="/login" element={<Login />} />
        <Route path="/me" element={<MyPageRedirect />} />

        {/* 로그인 */}
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/oauth/role" element={<RoleSelect />} />

        {/* 회원가입(역할선택 → 폼) */}
        <Route path="/signup">
          <Route index element={<Navigate to="select" replace />} />
          <Route path="select" element={<RoleSelect />} />
          <Route path="buyer" element={<BuyerWizard />} />
          <Route path="seller" element={<SellerWizard />} />
        </Route>



          {/* 회원가입(역할선택 → 폼) */}
          <Route path="/signup">
            <Route index element={<Navigate to="select" replace />} />
            <Route path="select" element={<RoleSelect />} />
            <Route path="buyer" element={<BuyerWizard />} />
            <Route path="seller" element={<SellerWizard />} />
          </Route>


          {/* 마이페이지 라우트 */}
          <Route path="/mypage/:userType/:userId" element={<MyPage />} />

          {/* 판매자 마이페이지 - 로그인 인증 필요 */}
          <Route path="/mypage/seller/:userId" element={
            <ProtectedRoute allowedRoles={['seller', 'admin']}>
              <SellerMainPage />
            </ProtectedRoute>
          } />
          <Route path="/mypage/seller/:userId/edit-info" element={
            <ProtectedRoute allowedRoles={['seller', 'admin']}>
              <EditInfo />
            </ProtectedRoute>
          } />
          <Route path="/mypage/seller/:userId/orders" element={
            <ProtectedRoute allowedRoles={['seller', 'admin']}>
              <OrderList />
            </ProtectedRoute>
          } />
          <Route path="/mypage/seller/:userId/reviews" element={
            <ProtectedRoute allowedRoles={['seller', 'admin']}>
              <Reviews />
            </ProtectedRoute>
          } />
          <Route path="/mypage/seller/:userId/inquiries" element={
            <ProtectedRoute allowedRoles={['seller', 'admin']}>
              <Inquiries />
            </ProtectedRoute>
          } />
          <Route path="/mypage/seller/:userId/product-register" element={
            <ProtectedRoute allowedRoles={['seller', 'admin']}>
              <ProductRegister />
            </ProtectedRoute>
          } />

          {/* 일반 마이페이지 라우트 (구매자용) */}
          <Route path="/mypage/:userType/:userId/edit-info" element={<EditInfo />} />
          <Route path="/mypage/:userType/:userId/orders" element={<OrderList />} />
          <Route path="/mypage/:userType/:userId/reviews" element={<Reviews />} />
          <Route path="/mypage/:userType/:userId/inquiries" element={<Inquiries />} />
          <Route path="/mypage/:userType/:userId/bids" element={<Bids />} />
          <Route path="/mypage/:userId/cart" element={<Cart />} />

          {/* 구매자 마이페이지 라우트 */}
          <Route path="/mypage/buyer/:userId" element={<BuyerMainPage />} />
          <Route path="/mypage/buyer/:userId/profile" element={<BuyerProfile />} />
          <Route path="/mypage/buyer/:userId/orders" element={<BuyerOrders />} />
          <Route path="/mypage/buyer/:userId/reviews" element={<BuyerReviews />} />
          <Route path="/mypage/buyer/:userId/inquiries" element={<BuyerInquiries />} />
          <Route path="/mypage/buyer/:userId/auctions" element={<BuyerAuctions />} />
          <Route path="/mypage/buyer/:userId/cart" element={<BuyerCart />} />
          <Route path="/mypage/buyer/:userId/winning-auctions" element={<BuyerWinningAuctions />} />

          <Route path="/cs/notice" element={<NoticePage />} />
          <Route path="/cs/faq" element={<FaqPage />} />
          <Route path="/cs/inquire" element={<InquirePage />} />

          <Route path="/test/test" element={<TestKG />} />
          {/* 없는 경로는 메인으로 */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
        <Footer />
      </Router>
  );
}

export default App;
