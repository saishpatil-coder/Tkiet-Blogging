import "./App.css";
import Login from "./components/mainPage/Login";
import Navbar from "./components/mainPage/Navbar";
import Blogs from "./components/blogs/Blogs";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./components/mainPage/SignUp";
import { AuthProvider } from "./contexts/AuthContext";
function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Blogs />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
