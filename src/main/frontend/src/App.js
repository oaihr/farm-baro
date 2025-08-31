import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sale from './sale/Sale';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  
  return(
    <Router>
      <Header />
        <Routes>
          <Route path="/" element={<Sale />} />
          <Route path="/sale/:kind/:part" element={<Sale />} />
        </Routes>
      <Footer />  
    </Router>
  )
}

export default App;
