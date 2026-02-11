import React, { createContext, ReactNode, useState } from 'react';

interface MobileMenuContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined);

export const MobileMenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <MobileMenuContext.Provider value={{ isOpen, toggle, open, close }}>
      {children}
    </MobileMenuContext.Provider>
  );
};
