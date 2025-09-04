import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './home/Home';
import HomeSearch from './home/HomeSearch.js';
import Quote from './quote/Quote.js';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Header from './components/Header';
import Footer from './components/Footer';
import Sale from './sale/Sale';
import SaleDetail from './sale/SaleDetail';
import Auction from './sale/auction/Auction';
import AuctionDetail from './sale/auction/AuctionDetail';



function App() {
  
  return(
    <Provider store={store}>
      <Router>
        <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home/search" element={<HomeSearch />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/sale/:kind/:part" element={<Sale />} />
            <Route path="/sale/:saleId" element={<SaleDetail />} />
            <Route path="/auctions/" element={<Auction />} />
            <Route path="/auction/:auctionId" element={<AuctionDetail />} />
          </Routes>
        <Footer />  
      </Router>
    </Provider>
  )
}

export default App;
