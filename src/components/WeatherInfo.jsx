// src/components/WeatherInfo.jsx

const WeatherInfo = ({ icon, label, value }) => {
  return (
    <article className='rounded-2xl border border-white/5 bg-[#17286B]/55 p-4 shadow-lg shadow-black/10'>
      <div className='flex items-center gap-2 text-indigo-100'>
        {typeof icon === 'string' ? (
          <span className='text-2xl'>{icon}</span>
        ) : (
          <span className='text-cyan-200'>{icon}</span>
        )}

        <span className='text-sm font-medium'>{label}</span>
      </div>

      <p className='mt-3 text-2xl font-extrabold text-white'>{value}</p>
    </article>
  );
};

export default WeatherInfo;
