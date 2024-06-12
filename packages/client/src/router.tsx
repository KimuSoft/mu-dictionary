import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Search from "./components/pages/Search"
import Main from "./components/pages/Main"

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Main />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
