// AlertMessage.tsx
import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const AlertMessage: React.FC<any> = ({ type, message, onClose }) => {
  const bgColor = type === 'error' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200';
  const textColor = type === 'error' ? 'text-red-800' : 'text-green-800';
  const iconColor = type === 'error' ? 'text-red-400' : 'text-green-400';
  const Icon = type === 'error' ? AlertTriangle : CheckCircle;

  return (
    <div className={`${bgColor} border rounded-lg p-4 mb-4`}>
      <div className="flex items-center">
        <Icon className={`${iconColor} mr-2`} size={20} />
        <span className={`${textColor} font-medium`}>{message}</span>
        <button
          onClick={onClose}
          className={`ml-auto ${textColor} hover:opacity-75`}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default AlertMessage;