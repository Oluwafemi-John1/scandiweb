import React from 'react'
import './App.scss';
import {Routes,Route} from 'react-router-dom';
import ProductList from './containers/ProductList/ProductList'; 
import ProductAdd from './containers/ProductAdd/ProductAdd'; 
const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path='/' element={<ProductList/>} />
        <Route path='/addproduct' element={<ProductAdd/>} />
      </Routes>
    </div>
  )
}

export default App