import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App';
import Home from "./pages/Home";
import About from "./pages/About";
import Works from "./pages/Work";
import Contact from "./pages/Contact";
import Resume from "./pages/Resume";
import Error from "./pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
     errorElement: <Error/>,
    children: [
      { index: true, element: <Home/> },
      { path: "about", element: <About/> },
      { path: "portfolio", element: <Works/> },
      { path: "resume", element: <Resume/> },
      { path: "contact", element: <Contact/> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);