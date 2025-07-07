import { Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout/Layout';
import Footer from './Layout/Footer';
import Homepage from './Pages/Homepage';
import About from './Pages/About';
import Podcast from './Pages/Podcast';
import Shipping from './Pages/Shipping';
import FAQ from './Pages/FAQ';
import Terms from './Pages/Terms';
import Privacy from './Pages/Privacy';
import { Toaster } from 'react-hot-toast';
import PageTransition from './Components/PageTransition'; // Assuming you have this
import "./App.css"
import BackToTop from './Components/BackToTop';
import Contact from './Pages/Contact';
import Blog from './Pages/Blog';
import Store from './Pages/Store';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import { useUserStore } from './store/useUserStore';
import { useEffect } from 'react';
import CreateBlog from './Components/BlogComponents/CreateBlog';
import AdminRoute from './Components/ProtectedRoutes/AdminRoute';
import SingleBlogPost from './Components/BlogComponents/SingleBlog';
import Cart from './Pages/Cart';
import AccountLayout from './Layout/AccountLayout';
import ProfilePage from './Components/ProfileComponents/ProfileComponent';
import AddressesPage from './Components/ProfileComponents/AddressesComponent';
import OrdersPage from './Components/ProfileComponents/OrdersComponent';
import ProtectedRoute from './Components/ProtectedRoutes/ProtectedRoute';
import MagazineListPage from './Pages/Magazine';
import MagazineUploadPage from './Pages/MagazineProductUploadPage';
import MagazineDetail from './Components/MagazineComponents/MagazineDetail';
import CustomCursor from './Components/CursorComponents/CustomCursor';
import CursorErrorBoundary from './Components/CursorComponents/CusorErrorBoundary';
import WishlistPage from './Components/ProfileComponents/WishListComponent';
import ShoeUploadForm from './Pages/ShoeUploadForm';
import ProductOptionsForm from './Pages/ProductOptions';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import ImageKitProvider from './Components/ImageKitProvider';
import ProductPage from './Pages/ProductPage';
import ScrollToTop from './Components/ScrollToTop';
import Lasts from './Pages/Lasts';
import { CurrencyProvider } from './context/CurrencyContext';
import Checkout from './Pages/Checkout';
import CheckoutSuccess from './Components/CheckoutComponents/CheckoutSuccess';
import useDocumentTitle from './hooks/useDocumentTitle';
import CheckoutFailed from './Components/CheckoutComponents/CheckoutFailure';
import SingleOrderPage from './Pages/SingleOrderPage';
import AdminOrdersPage from './Pages/AdminOrdersPage';
import CookieConsentBanner from "./Components/CookieComponents/CookieConsentBanner";
import AnalyticsLoader from './Components/CookieComponents/AnalyticsLoader';
import CookieSettingsPage from './Pages/CookieSettingsPage';
//



function App() {
  const location = useLocation();
  const { user, checkingAuth } = useUserStore();

  useEffect(() => {
    useUserStore.getState().init(); // only checks if there's a token
  }, []);

  useDocumentTitle("Homepage - ")
 
  return (
    <CurrencyProvider>
      <AnalyticsLoader />
      <CookieConsentBanner />
    <ImageKitProvider>
    <div className='min-h-screen flex flex-col'>
      <CursorErrorBoundary>
      <CustomCursor />
      </CursorErrorBoundary>
      <main className='flex-grow'>
        <Layout>
          <ScrollToTop />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Homepage /></PageTransition>} />
              <Route path="/about" element={<PageTransition><About /></PageTransition>} />
              <Route path="/shipping" element={<PageTransition><Shipping /></PageTransition>} />
              <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
              <Route path='/magazine' >
                  <Route index element={<PageTransition><MagazineListPage /></PageTransition>} />
                  <Route path=':issueNumber' element={<PageTransition><MagazineDetail /></PageTransition>} />
              </Route>

              <Route path='/cart' element={
               <ProtectedRoute>
                <PageTransition>
                  <Cart />
                </PageTransition>
                </ProtectedRoute>
              }
              />
              


              <Route 
                  path='/account' 
                  element={
                    <ProtectedRoute>     
                        <AccountLayout />
                    </ProtectedRoute>
                  }
                >
                <Route index element={<Navigate to="profile" replace />} />
                <Route path='profile'  element={<ProfilePage />} />
                <Route path='addresses'  element={<AddressesPage />} />
                <Route path='orders'  element={<OrdersPage />} />
                <Route path="orders/:id" element={<SingleOrderPage/>} />

                <Route path='wishlist'  element={<WishlistPage />} />
              </Route>

              <Route path="/blog">
                  <Route index element={<PageTransition><Blog /></PageTransition>} />
                  <Route path=":slug" element={<PageTransition><SingleBlogPost/></PageTransition>} />
                  
                  <Route path='write' element={<PageTransition>
                    <AdminRoute>
                    <CreateBlog />
                    </AdminRoute>
                    </PageTransition>} />
              </Route>

              <Route path="/store">
                  <Route index element={<PageTransition><Store /></PageTransition>} />   
                  <Route path='addmagazine' element={<AdminRoute><MagazineUploadPage /></AdminRoute>} /> 
                  <Route path='addshoe' element={<AdminRoute><ShoeUploadForm /></AdminRoute>} /> 
                  <Route path='options' element={<AdminRoute><ProductOptionsForm /></AdminRoute>} /> 
                  <Route path='shoes/:slug' element={<ProductPage />} />
               </Route>

               <Route path='/order-dashboard' element={<AdminRoute><AdminOrdersPage /></AdminRoute>}/> 
 
              <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
              <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
              <Route path='/contact' element={<PageTransition><Contact /></PageTransition>} />
              <Route path='/podcast' element={<PageTransition><Podcast /></PageTransition>} />
              <Route path="/lasts" element={<PageTransition><Lasts /></PageTransition>} />
              <Route path="/cookies" element={<PageTransition><CookieSettingsPage/></PageTransition>} />
              <Route path="/lasts" element={<PageTransition><Lasts /></PageTransition>} />
              <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
              <Route path="/checkout-success" element={<PageTransition><CheckoutSuccess/></PageTransition>} />
              <Route path="/checkout-failure" element={<PageTransition><CheckoutFailed/></PageTransition>} />


           <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
            <Route path="/forgot" element={!user ? <ForgotPassword /> : <Navigate to="/" />} />
            <Route path="/reset-password/:token" element={!user ? <ResetPassword /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to={"/"} />} /> 
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
    </ImageKitProvider>
    </CurrencyProvider>
  );
}

export default App;
