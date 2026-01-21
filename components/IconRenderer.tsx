
import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconRendererProps {
  name?: string;
  size?: number;
  className?: string;
}

const IconRenderer: React.FC<IconRendererProps> = ({ name, size = 24, className }) => {
  if (!name) return null;
  
  const Icon = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  return <Icon size={size} className={className} />;
};

export default IconRenderer;
