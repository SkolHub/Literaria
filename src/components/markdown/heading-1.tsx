import { ComponentPropsWithoutRef } from 'react';

export default function Heading1(props: ComponentPropsWithoutRef<'h1'>) {
  const { className, style, ...rest } = props;

  return <h1 {...rest} className='text-base font-medium laptop:text-xs' />;
}
