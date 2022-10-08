import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Main from "./components/templates/Main"
import SearchTemplate from "./components/templates/Search"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Main />}></Route>
        <Route path="/search/:keyword" element={<SearchTemplate />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
