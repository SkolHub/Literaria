export default function Paragraph(props: any) {
  const { className, style, ...rest } = props;

  return <p {...rest} className='pb-3' />;
}
