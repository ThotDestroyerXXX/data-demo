import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DetailPage from "./detail/page.tsx";
import AddPage from "./add/page.tsx";
import EditPage from "./edit/page.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='data'>
          <Route path=':id' element={<DetailPage />} />
          <Route path='add' element={<AddPage />} />
          <Route path=':id/edit' element={<EditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
