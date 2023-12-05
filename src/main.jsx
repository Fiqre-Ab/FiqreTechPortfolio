import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App';
import Home from "./component/Home";
import About from "./component/About";
import Works from "./component/Works";
import Contact from "./component/Contact";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      { index: true, element: <Home/> },
      { path: "about", element: <About/> },
      { path: "resume", element: <Works/> },
      { path: "contact", element: <Contact/> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);