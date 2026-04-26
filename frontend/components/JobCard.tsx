'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Briefcase, ArrowRight } from 'lucide-react';

interface Job {
  JobID: number;
  Title: string;
  Location: string;
  SalaryRange?: string;
  EmploymentType?: string;
  CompanyName: string;
  Description?: string;
}

interface JobCardProps {
  job: Job;
  index?: number;
}

export default function JobCard({ job, index = 0 }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        delay: index * 0.05,
      }}
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)' }}
      className="h-full"
    >
      <Link href={`/jobs/${job.JobID}`}>
        <div className="p-6 bg-white rounded-xl border border-gray-200 hover:border-indigo-500 transition-all duration-300 cursor-pointer h-full flex flex-col group">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
              {job.Title}
            </h3>
            <p className="text-gray-600 font-medium text-sm">{job.CompanyName}</p>
          </div>

          {/* Description */}
          {job.Description && (
            <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
              {job.Description}
            </p>
          )}

          {/* Details */}
          <div className="space-y-2 mb-4 py-4 border-y border-gray-200">
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin size={16} className="text-indigo-600" />
              <span className="text-sm">{job.Location}</span>
            </div>

            {job.EmploymentType && (
              <div className="flex items-center gap-2 text-gray-700">
                <Briefcase size={16} className="text-purple-600" />
                <span className="text-sm">{job.EmploymentType}</span>
              </div>
            )}

            {job.SalaryRange && (
              <div className="flex items-center gap-2 text-gray-700">
                <DollarSign size={16} className="text-green-600" />
                <span className="text-sm">{job.SalaryRange}</span>
              </div>
            )}
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2 group/btn"
          >
            View Details
            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
}
