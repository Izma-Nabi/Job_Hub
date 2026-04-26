'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import JobCard from '@/components/JobCard';
import JobCardSkeleton from '@/components/JobCardSkeleton';
import { jobsApi } from '@/lib/api';
import { Search, MapPin, Briefcase } from 'lucide-react';

interface Job {
  JobID: number;
  Title: string;
  Location: string;
  SalaryRange?: string;
  EmploymentType?: string;
  CompanyName: string;
  Description?: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await jobsApi.getAllJobs();
        const jobsData = response.data.jobs || [];
        setJobs(jobsData);
        setFilteredJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs
  useEffect(() => {
    let filtered = jobs.filter((job) => {
      const matchSearch =
        job.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.CompanyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.Description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchLocation = !selectedLocation || job.Location.includes(selectedLocation);
      const matchType = !selectedType || job.EmploymentType?.includes(selectedType);

      return matchSearch && matchLocation && matchType;
    });

    setFilteredJobs(filtered);
  }, [searchTerm, selectedLocation, selectedType, jobs]);

  // Get unique values for filters
  const locations = Array.from(new Set(jobs.map((job) => job.Location))).filter(Boolean);
  const employmentTypes = Array.from(new Set(jobs.map((job) => job.EmploymentType))).filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Job Opportunities</h1>
          <p className="text-xl text-gray-600">Find your perfect role among {jobs.length} available positions</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-12"
        >
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search jobs by title, company, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-2" />
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 transition-all"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Employment Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase size={16} className="inline mr-2" />
                Employment Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 transition-all"
              >
                <option value="">All Types</option>
                {employmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || selectedLocation || selectedType) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    Search: {searchTerm}
                  </span>
                )}
                {selectedLocation && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    Location: {selectedLocation}
                  </span>
                )}
                {selectedType && (
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                    Type: {selectedType}
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedLocation('');
                    setSelectedType('');
                  }}
                  className="px-3 py-1 text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            Showing <span className="font-bold text-gray-900">{filteredJobs.length}</span> of{' '}
            <span className="font-bold text-gray-900">{jobs.length}</span> jobs
          </p>
        </motion.div>

        {/* Jobs Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Briefcase size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Jobs Found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, index) => (
              <JobCard key={job.JobID} job={job} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
