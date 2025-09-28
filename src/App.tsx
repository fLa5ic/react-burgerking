import { Routes, Route } from 'react-router-dom';

import './scss/app.scss';

import Header from './components/Header';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ItemPage from './pages/ItemPage';
// import Cart from './pages/Cart';
import Drawer from './components/Drawer';

function App() {
   return (
      <div className="App">
         <Drawer />
         <Header />
         <div className="content">
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/item/:id" element={<ItemPage />} />
               <Route path="*" element={<NotFound />} />
            </Routes>
         </div>
      </div>
   );
}

export default App;
