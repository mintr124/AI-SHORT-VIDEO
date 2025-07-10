import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// import { Navbar } from "./components";
import Home from "./pages/Home";
// import YourVideo from "./pages/Video";
import Register from "./pages/Register";
import VideoEditor from "./pages/test";
import Page from "./pages/Page";

function App() {
  return (
    <>
      <Router>
        {/* HEADER - SECTION */}
        {/* <Navbar /> */}

        {/* BODY - SECTION */}

        <Routes>
          {/* Redirect "/" to "/register" */}
          <Route path="/" element={<Register />} />

          {/* Main pages */}
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/create" element={<Home />} />
          <Route path="/homepage" element={<Page />} />
          <Route path="/test" element={<VideoEditor />} />
          {/* <Route path="/your-video" element={<YourVideo />} />  */}
          {/* <Route path="/test" element={<LoginPage />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
