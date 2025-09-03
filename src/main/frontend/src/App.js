import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.js';
import Footer from './components/Footer.js';

import './App.css';
import Home from './home/Home';
import HomeSearch from './home/HomeSearch.js';
import Quote from './quote/Quote.js';

function App() {

    return(
    <Router>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home/search" element={<HomeSearch />} />
          <Route path="/quote" element={<Quote />} />
        </Routes>
      <Footer />  
    </Router>
  )
}

export default App;
