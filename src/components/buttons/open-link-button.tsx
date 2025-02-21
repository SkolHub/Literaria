import Image from 'next/image';
import arrow from '../../../public/icons/top-right-arrow.svg';

export default ({
	url = '',
	className = ''
}: {
	url?: string;
	className?: string;
}) => {
	return (
		<div>
			<div
				className={`flex items-center justify-center rounded-full bg-white p-4 aspect-square ${className}`}
			>
				<Image className='h-3 rounded-none' src={arrow} alt='Top right arrow' />
			</div>
		</div>
	);
};
