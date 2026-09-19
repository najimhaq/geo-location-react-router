import { CloudSun, MapPin, Search, Sparkles, Wind } from 'lucide-react';
import { useState } from 'react';
import LocationModal from '../components/LocationModal';

const Home = () => {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  return (
    <main className='relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:h-screen lg:py-6'>
      <div className='pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl' />
      <div className='pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl' />

      <section className='relative z-10 mx-auto w-full max-w-4xl text-center'>
        <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-blue-100 shadow-lg backdrop-blur-md sm:text-sm'>
          <Sparkles size={16} className='text-yellow-300' />
          Smart local weather updates
        </div>

        <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/25 bg-white/15 shadow-2xl backdrop-blur-md sm:h-28 sm:w-28'>
          <CloudSun
            size={48}
            strokeWidth={1.8}
            className='text-yellow-300 sm:h-16 sm:w-16'
          />
        </div>

        <p className='mt-6 text-sm font-bold tracking-[0.25em] text-fuchsia-200 uppercase sm:mt-8 sm:text-lg'>
          NextLevel
        </p>

        <h1 className='mt-2 bg-gradient-to-r from-white via-blue-100 to-fuchsia-200 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-6xl lg:text-7xl'>
          Weather App
        </h1>

        <p className='mx-auto mt-5 max-w-2xl text-sm leading-6 text-blue-100 sm:mt-6 sm:text-xl sm:leading-8'>
          Search any city or use your current location to see live temperature,
          humidity, wind speed, and a 7-day forecast.
        </p>

        <button
          type='button'
          onClick={() => setIsLocationModalOpen(true)}
          className='group mx-auto mt-7 inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 to-fuchsia-600 px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_32px_rgba(168,85,247,0.38)] transition duration-300 hover:-translate-y-1 hover:from-blue-400 hover:to-fuchsia-500 hover:shadow-[0_18px_38px_rgba(168,85,247,0.52)] focus:outline-none focus:ring-4 focus:ring-fuchsia-300/40 sm:mt-9 sm:px-7 sm:py-4 sm:text-base'
        >
          <Search
            size={20}
            className='transition-transform duration-300 group-hover:scale-110'
          />
          Find Your Weather
        </button>

        <div className='mx-auto mt-10 grid max-w-3xl gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4'>
          <FeatureCard
            icon={<MapPin size={21} />}
            title='Any city'
            text='Search weather around the world'
          />

          <FeatureCard
            icon={<CloudSun size={21} />}
            title='Live conditions'
            text='See current sky and temperature'
          />

          <FeatureCard
            icon={<Wind size={21} />}
            title='7-day forecast'
            text='Plan your week with confidence'
          />
        </div>
      </section>

      {isLocationModalOpen && (
        <LocationModal onClose={() => setIsLocationModalOpen(false)} />
      )}
    </main>
  );
};

const FeatureCard = ({ icon, title, text }) => {
  return (
    <article className='rounded-2xl border border-white/10 bg-white/[0.09] p-4 text-left shadow-lg backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/[0.14] sm:p-5'>
      <div className='mb-3 inline-flex rounded-xl bg-blue-400/20 p-2.5 text-blue-100'>
        {icon}
      </div>

      <h2 className='font-bold text-white'>{title}</h2>
      <p className='mt-1 text-sm leading-6 text-blue-100/80'>{text}</p>
    </article>
  );
};

export default Home;
