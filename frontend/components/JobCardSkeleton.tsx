'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function JobCardSkeleton() {
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 h-full">
      <motion.div
        className="space-y-4"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>

        {/* Company skeleton */}
        <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded-lg w-full"></div>
          <div className="h-3 bg-gray-200 rounded-lg w-5/6"></div>
        </div>

        {/* Details skeleton */}
        <div className="py-4 border-y border-gray-200 space-y-2">
          <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
        </div>

        {/* Button skeleton */}
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
      </motion.div>
    </div>
  );
}
