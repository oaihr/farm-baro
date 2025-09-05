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
import ForgotPassword from "./pages/account/ForgotPassword";


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

        {/* 로그인 */}
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* 회원가입(역할선택 → 폼) */}
        <Route path="/signup">
          <Route index element={<Navigate to="select" replace />} />
          <Route path="select" element={<RoleSelect />} />
          <Route path="buyer" element={<BuyerWizard />} />
          <Route path="seller" element={<SellerWizard />} />
        </Route>

        {/* 관리자승인 */}
         <Route path="/admin/sellers" element={<SellerApprovals/>} />

        {/* 없는 경로는 메인으로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  )
}
export default App;
