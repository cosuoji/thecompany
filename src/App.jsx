import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout/Layout';
import Footer from './Components/Footer';
import Header from './Components/Header';
import Homepage from './Pages/Homepage';
import About from './Pages/About';
import Shipping from './Pages/Shipping';
import FAQ from './Pages/FAQ';
import Terms from './Pages/Terms';
import Privacy from './Pages/Privacy';
import { Toaster } from 'react-hot-toast';
import PageTransition from './Components/PageTransition'; // Assuming you have this
import "./App.css"
import BackToTop from './Components/BackToTop';
import Contact from './Pages/Contact';

function App() {
  const location = useLocation();

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-grow'>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Homepage /></PageTransition>} />
              <Route path="/about" element={<PageTransition><About /></PageTransition>} />
              <Route path="/shipping" element={<PageTransition><Shipping /></PageTransition>} />
              <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
              <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
              <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
              <Route path='/contact' element={<PageTransition><Contact /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </Layout>
      </main>
      <Footer />
      <BackToTop /> {/* Add this line */}
      <Toaster toastOptions={{
        style: { border: '1px solid #4B371C', padding: '9px', color: '#4B371C' },
        success: { iconTheme: { primary: "#E6DACD", secondary: "#E0E0E0" }},
        error: { iconTheme: { primary: "#E6DACD", secondary: "black" }},
      }} />
    </div>
  );
}

export default App;
