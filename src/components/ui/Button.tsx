import type { ButtonHTMLAttributes } from 'react';

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = '', ...rest } = props;
  return (
    <button
      className={`px-4 py-2 rounded-md bg-primary/90 hover:bg-primary text-fg shadow-md transition ${className}`}
      {...rest}
    />
  );
}