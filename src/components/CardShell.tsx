import {type ComponentPropsWithoutRef} from 'react';

interface CardShellProps extends ComponentPropsWithoutRef<'div'> {
  /** Background colour class override */
  bg?: string;
  /** Whether the card is currently selected (affects border style) */
  selected?: boolean;
}

export function CardShell({selected, className, children, ...rest}: CardShellProps) {
  const border = selected !== undefined
    ? selected
      ? 'border-2 border-indigo-600 [box-shadow:0px_0px_20px_rgba(79,70,229,0.4),3px_3px_8px_rgba(0,0,0,0.15)]'
      : 'border border-indigo-600 [box-shadow:3px_3px_8px_rgba(0,0,0,0.15),-1px_-1px_4px_rgba(255,255,255,0.8)]'
    : 'border-2 border-indigo-600 [box-shadow:0px_0px_20px_rgba(79,70,229,0.4),3px_3px_8px_rgba(0,0,0,0.15)]';

  return (
    <div
      className={[
        'aspect-2.5/3.5 rounded-lg flex items-center justify-center font-bold overflow-hidden relative select-none',
        border,
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}

