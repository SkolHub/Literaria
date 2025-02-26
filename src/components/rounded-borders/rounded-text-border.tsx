import { HTMLProps } from 'react';
import { IncludeBorder } from './include-border';

export function RoundedTextBorder({
  ...props
}: HTMLProps<HTMLDivElement> & {}) {
  return (
    <div {...props}>
      <IncludeBorder>
        <span text-rounded-border='' rounded-border='true'>
          {props.children}
        </span>
      </IncludeBorder>
    </div>
  );
}
