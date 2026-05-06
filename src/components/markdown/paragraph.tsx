import { ComponentPropsWithoutRef } from 'react';

export default function Paragraph(props: ComponentPropsWithoutRef<'p'>) {
  const { className, style, ...rest } = props;

  return <p {...rest} className='pb-3' />;
}
