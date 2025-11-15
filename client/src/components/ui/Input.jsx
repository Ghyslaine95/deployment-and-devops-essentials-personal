import React from 'react';

export const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors';
  
  const stateClasses = error 
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
    : 'border-gray-300';

  const classes = `${baseClasses} ${stateClasses} ${
    disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'bg-white'
  } ${className}`;

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={classes}
      {...props}
    />
  );
};