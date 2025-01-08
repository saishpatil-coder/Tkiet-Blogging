import logo from "./logo.svg";
import "./App.css";
import Login from "./components/mainPage/Login";
import Navbar from "./components/mainPage/Navbar";
import Blogs from "./components/blogs/Blogs";
import { BrowserRouter } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter></BrowserRouter>
      <Navbar />
      <Blogs />
      <Login />
    </>
  );
}

export default App;
