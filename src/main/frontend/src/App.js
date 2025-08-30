import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.js';
import Footer from './components/Footer.js';

import logo from './logo.svg';
import './App.css';
import Quote from './quote/Quote';


function App() {
  
  return(
    <Router>
      <Header />
        <Routes>
          <Route path="/" element={<Quote />} />
          {/* <Route path="/sale/:kind/:type" element={<Quote />} /> */}
        </Routes>
      <Footer />  
    </Router>
  )
}

export default App;
