import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div 
      className={`animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-700/80 ${className}`} 
    />
  );
};

export const NewsCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="mt-4 flex flex-col gap-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-6 w-11/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
};

export const GalleryCardSkeleton: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      <div className="mt-3 flex flex-col gap-1.5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
};
