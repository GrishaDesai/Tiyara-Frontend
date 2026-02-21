import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Recommendation from './Screen/Recommendation';
// import AllProduct from './Screen/AllProduct';
// import AllCategories from './Screen/AllCategories';
// import Product from './Screen/Product';
// import BodyShapeForm from './Screen/BodyShapeForm';
// import BodyShapeQuiz from './Screen/BodyShapeQuiz';
// import Home from './Screen/Home';
// import CategoryProducts from './Screen/CategoryProduct';
import './App.css'
import './index.css'
import AllCategories from './pages/AllCategories';
import Demo from './pages/Demo';
import AllProduct from './pages/AllProduct';
import BodyShapeForm from './pages/BodyShapeForm';
import BodyShapeRecommendation from './pages/BodyShapeRecommendation';
import BodyShapeQuiz from './pages/BodyShapeQuiz';
import CategoryProducts from './pages/CategoryProduct';
import Product from './pages/Product';
import Home from './pages/Home';
import ImageRecommender from './pages/ImageRecommender';
import Occasion from './pages/Occasion';
import Price from './pages/Price';
import Recommendation from './pages/Recommendation';
import SkintoneDemo from './pages/SkintoneDemo';
import SkintoneGuide from './pages/SkintoneGuide';
// import BodyShapeRecommendation from './Screen/BodyShapeRecommendation';
// import SkintoneDetection from './Screen/SkintoneDetection';
// import SkintoneDemo from './Screen/SkintoneDemo';
// import Occasion from './Screen/Occasion';
// import Price from './Screen/Price';
// import SkintoneGuide from './Screen/SkintoneGuide';
// import ImageRecommender from './Screen/ImageRecommender'; '

function App() {

  return (
    <BrowserRouter>
      <Routes>
        
        <Route path='/' element={<Home />} />
        <Route path='/category' element={<AllCategories />} />
        <Route path='/cat_product/:category' element={<Product />} />
        <Route path='/category/:category' element={<CategoryProducts />} />
        <Route path='/product' element={<AllProduct />} />
        <Route path='/body-shape/measurements' element={<BodyShapeForm />} />
        <Route path='/body-shape/recommendations' element={<BodyShapeRecommendation />} />
        <Route path='/body-shape-quiz/' element={<BodyShapeQuiz />} />
        <Route path='/image-rec' element={<ImageRecommender />} />
        <Route path='/occasion/:occ_name' element={<Occasion />} />
        <Route path='/price/:price' element={<Price />} />
        <Route path='/recommend/:id' element={<Recommendation />} />
        <Route path='/skintone-demo' element={<SkintoneDemo />} />
        <Route path='/skintone-guide' element={<SkintoneGuide />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
