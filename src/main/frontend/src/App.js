import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sale from './sale/Sale';
import SaleDetail from './sale/SaleDetail';


function App() {
  
  return(
    <Router>
      <Header />
        <Routes>
          <Route path="/" element={<Sale />} />
          <Route path="/sale/:kind/:part" element={<Sale />} />
          <Route path="/sale/:saleId" element={<SaleDetail />} />
        </Routes>
      <Footer />  
    </Router>
  )
}

export default App;
