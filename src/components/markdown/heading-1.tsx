export default function Heading1(props: any) {
  const { className, style, ...rest } = props;

  return <h1 {...rest} className='text-red-500' />;
}
