import dateFormatter from '@/lib/formatters/dateFormatter';

export default ({
	time,
	className = ''
}: {
	time: Date;
	className?: string;
}) => {
	return (
		<div
			className={`bg-white rounded-full flex items-center justify-center py-1 px-4 ${className}`}
		>
			<label className='font-semibold text-base'>
				{dateFormatter(new Date(time))}
			</label>
		</div>
	);
};
