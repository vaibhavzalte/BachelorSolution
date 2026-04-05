"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color?: string;
  count?: string;
  href?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  icon,
  color = "bg-primary/10",
  count,
  href = "#",
}) => {
  return (
    <a
      href={href}
      className={`group relative overflow-hidden glass rounded-3xl p-8 hover:shadow-glass hover:-translate-y-2 transition-all duration-500 border border-border-color cursor-pointer flex flex-col gap-6 active:scale-95`}
    >
      <div
        className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 shadow-sm`}
      >
        {icon}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          {count && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/5 text-primary/80 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              {count}
            </span>
          )}
        </div>
        <p className="text-foreground/60 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-auto flex items-center text-sm font-bold text-primary group-hover:text-primary-hover gap-2 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
        Browse Now <ArrowRight className="w-4 h-4" />
      </div>

      {/* Decorative gradient blur */}
      <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/20 transition-all duration-500" />
    </a>
  );
};

export default CategoryCard;
