import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className='min-h-screen overflow-x-hidden bg-[#07152f] text-white lg:h-screen lg:overflow-hidden'>
      <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.32),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.35),_transparent_46%),linear-gradient(135deg,_#102b77_0%,_#2b318c_48%,_#661d97_100%)] lg:h-full'>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
