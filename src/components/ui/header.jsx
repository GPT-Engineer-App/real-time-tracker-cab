import React from "react";

export const Header = ({ children }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 p-4 flex justify-between items-center">
      {children}
    </header>
  );
};