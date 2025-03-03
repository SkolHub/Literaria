export default ({ logo, title }: { logo: any; title: string }) => {
	return (
		<div className='bg-white flex items-center gap-[0.8rem] overflow-hidden absolute p-4 mobile:p-3 rounded-[2rem] left-[4.4rem] mobile:left-[1.5rem] top-[4rem] mobile:top-[1.5rem] mobile:rounded-[1.25rem]'>
			<img className='mobile:h-8' src={logo} alt='book' />
			<label className='text-[2.2rem] mobile:text-[1.5rem] font-bold'>{title}</label>
		</div>
	);
};
