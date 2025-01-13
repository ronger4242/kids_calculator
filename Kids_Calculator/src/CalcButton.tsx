import React from 'react';
import {motion} from 'framer-motion';

interface CalcButtonProps {
  onClick: () => void;
  type: 'number' | 'operation' | 'function';
  color: string;
  children?: React.ReactNode;
  icon?: JSX.Element;
}

export const CalcButton: React.FC<CalcButtonProps> = ({ onClick, children, color, icon }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`p-2 rounded-lg text-xl font-bold flex items-center justify-center text-white`}
      style={{ backgroundColor: color }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon ? icon : children}
    </motion.button>
  );
};