import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import Home from './pages/Home';
import MainLayout from './layouts/MainLayout';

const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        index: true,
        element: <Home />,
      }
    ],
  },
]);

function Router() {
  return (
    <div>
      <RouterProvider router={router} />,
    </div>
  );
}

export default Router;
