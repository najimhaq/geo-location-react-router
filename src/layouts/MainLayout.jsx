import { Outlet } from 'react-router';

const MainLayout = () => {
  return (
    <>
      <div className='flex justify-center min-h-screen bg-gray-900'>
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
