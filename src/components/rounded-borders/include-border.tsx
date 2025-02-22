import { Children, cloneElement, isValidElement, ReactNode } from 'react';

export function IncludeBorder({
  children,
  enabled = true
}: {
  children: ReactNode;
  enabled?: boolean;
}) {
  function addExtraProps(child: ReactNode) {
    if (isValidElement(child)) {
      return cloneElement(child, {
        // @ts-ignore
        'rounded-border': enabled ? 'true' : 'false'
      });
    }
    return child;
  }

  return <>{Children.map(children, addExtraProps)}</>;
}
