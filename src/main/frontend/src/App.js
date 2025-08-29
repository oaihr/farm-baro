import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sale from './sale/Sale.js';
import Header from './components/Header.js';
import Footer from './components/Footer.js';

function App() {
  
  return(
    <Router>
      <Header />
        <Routes>
          <Route path="/" element={<Sale />} />
          <Route path="/sale/:kind/:type" element={<Sale />} />
        </Routes>
      <Footer />  
    </Router>
  )
}

export default App;
