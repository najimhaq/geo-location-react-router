import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import Home from './pages/Home';
import MainLayout from './layouts/MainLayout';
import Weather from './pages/Weather';

const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/weather',
        element: <Weather />,
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
