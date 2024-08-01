import React from "react";

const CartPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      <p className="text-lg">Your cart is currently empty.</p>
      {/* Add cart items and functionality here */}
    </div>
  );
};

export default CartPage;
