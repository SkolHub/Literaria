export default function ({ logo, title }: { logo: any; title: string }) {
  return (
    <div className='absolute left-[4.4rem] top-[4rem] flex items-center gap-[0.8rem] overflow-hidden rounded-[2rem] bg-white p-4 mobile:left-[1.5rem] mobile:top-[1.5rem] mobile:rounded-[1.25rem] mobile:p-3'>
      <img className='mobile:h-8' src={logo} alt='book' />
      <label className='text-[2.2rem] font-bold mobile:text-[1.5rem]'>
        {title}
      </label>
    </div>
  );
}
