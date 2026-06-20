import React from 'react';

interface CategoryProps {
  title: string;
}

const Category: React.FC<CategoryProps> = ({ title }) => {
  return (
    <div className="group mb-1 mt-4 flex cursor-pointer items-center px-1 text-[#80848e] hover:text-[#dbdee1]">
      <svg className="mr-0.5 h-3 w-3 transition-transform group-hover:text-[#dbdee1]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
      </svg>
      <span className="text-[11px] font-bold uppercase tracking-wider">{title}</span>
    </div>
  );
};

export default Category;
