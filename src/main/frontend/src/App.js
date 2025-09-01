import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Header from './components/Header';
import Footer from './components/Footer';
import Sale from './sale/Sale';
import SaleDetail from './sale/SaleDetail';
import Auction from './sale/Auction';


function App() {
  
  return(
    <Provider store={store}>
      <Router>
        <Header />
          <Routes>
            <Route path="/" element={<Sale />} />
            <Route path="/sale/:kind/:part" element={<Sale />} />
            <Route path="/sale/:saleId" element={<SaleDetail />} />
            <Route path="/auctions/" element={<Auction />} />
          </Routes>
        <Footer />  
      </Router>
    </Provider>
  )
}

export default App;
