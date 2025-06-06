
import React from 'react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className }) => {
  if (!message) return null;

  return (
    <div className={`p-4 bg-red-800 border border-red-600 text-red-200 rounded-md ${className || ''}`}>
      <p className="font-semibold">Error</p>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default ErrorMessage;
