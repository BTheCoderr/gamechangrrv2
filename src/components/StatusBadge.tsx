import { Lead } from '@/types';

interface StatusBadgeProps {
  status: Lead['status'];
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };
  
  // Status-specific styling
  let bgColor = '';
  let textColor = '';
  
  switch (status) {
    case 'new':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'contacted':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'follow-up':
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-800';
      break;
    case 'booked':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'converted':
      bgColor = 'bg-cyan-100';
      textColor = 'text-cyan-800';
      break;
    case 'not-interested':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }
  
  // Format text for display
  const displayText = status.replace('-', ' ');
  
  return (
    <span 
      className={`rounded-full font-medium ${sizeClasses[size]} ${bgColor} ${textColor}`}
    >
      {displayText}
    </span>
  );
} 