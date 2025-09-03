import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/MyPage/Header.js';
import Footer from './components/MyPage/Footer.js';

// 메인 페이지 컴포넌트
import Sale from './components/Sale.js';

// 마이페이지 컴포넌트들
import MyPage from './components/MyPage/MyPage.js';
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
  
  return(
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Sale />} />
        <Route path="/sale/:kind/:type" element={<Sale />} />
        
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
      </Routes>
      <Footer />
    </Router>
  )
}

export default App;
