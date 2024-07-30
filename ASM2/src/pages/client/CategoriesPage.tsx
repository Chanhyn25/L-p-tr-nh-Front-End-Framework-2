import React from "react";

const CategoriesPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Categories</h1>
      <ul className="space-y-2">
        <li className="border-b pb-2">
          <a href="#" className="text-blue-500 hover:underline">
            Category 1
          </a>
        </li>
        <li className="border-b pb-2">
          <a href="#" className="text-blue-500 hover:underline">
            Category 2
          </a>
        </li>
        <li>
          <a href="#" className="text-blue-500 hover:underline">
            Category 3
          </a>
        </li>
      </ul>
    </div>
  );
};

export default CategoriesPage;
