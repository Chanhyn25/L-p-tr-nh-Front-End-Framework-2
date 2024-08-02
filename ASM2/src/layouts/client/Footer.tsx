import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Royal Sofas. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
