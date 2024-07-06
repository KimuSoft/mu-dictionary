import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Search from "./components/pages/Search"
import Main from "./components/pages/Main"
import LongWordSearch from "./components/pages/LongWordSearch"

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Main />} />
        <Route path="/search" element={<Search />} />
        <Route path="/long-word" element={<LongWordSearch />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
