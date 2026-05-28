import React from 'react';
import * as Icons from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = '', size = 20 }) => {
  // Gracefully fallback if icon doesn't exist
  const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
  return <IconComponent className={className} size={size} />;
};
export default IconRenderer;
