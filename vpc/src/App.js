
import "./App.css";

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SelectionTool from './components/SelectionTool';
import View from "./components/view";
import Detail from "./components/detail";
import Test from "./components/test";

function App() {

  return (
  
    <BrowserRouter>
     
      <Routes>

      <Route>
      <Route path="" element={<SelectionTool />} />
         <Route path="/selectiontool" element={<SelectionTool/>} />
         <Route path="/view" element={<View/>} />
         <Route path="/detail" element={<Detail/>} />
         <Route path="/test" element={<Test/>} />
       </Route>

      </Routes>
      
    
    </BrowserRouter>

  );
}

export default App;
