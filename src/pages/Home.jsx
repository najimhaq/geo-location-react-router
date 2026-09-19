import { useState } from 'react';
import LocationModal from '../components/LocationModal';

const Home = () => {
  const [click, setClick] = useState(false);

  return (
    <>
      <div className='my-2'>
        <h3 className='text-3xl text-fuchsia-200 font-bold text-center mt-10'>
          NextLevel
        </h3>
        <h1 className='text-6xl text-fuchsia-500 font-bold text-center '>
          {' '}
          Weather App
        </h1>
        <p className='text-lg text-fuchsia-200 font-semibold text-center mt-5'>
          Check the weather of your city and get the latest updates on
          temperature, humidity, and more!
        </p>
        {/* Button */}
        <div>
          <button
            type='button'
            onClick={() => setClick(true)}
            className='bg-fuchsia-500 text-white font-bold py-2 px-4 rounded hover:bg-fuchsia-600 flex items-center justify-center mt-5 mx-auto cursor-pointer hover:shadow-lg hover:scale-105 transition-transform duration-300'
          >
            Get Weather
          </button>
        </div>
        {/* Modal */}
        <div>{click && <LocationModal onClose={() => setClick(false)} />}</div>
      </div>
    </>
  );
};

export default Home;
