'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { jobsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { MapPin, DollarSign, Briefcase, Calendar, Building2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ApplyForm from '@/components/ApplyForm';

interface JobDetail {
  id: number;
  CompanyID: number;
  Title: string;
  Description: string;
  Requirements: string;
  Location: string;
  SalaryRange?: string;
  EmploymentType?: string;
  Deadline?: string;
  PostedAt?: string;
  IsActive: number;
}

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.id as string;
  const { user } = useAuth();

  const [job, setJob] = useState<JobDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true);
        const response = await jobsApi.getJobById(parseInt(jobId));
        setJob(response.data.job);
        setError(null);
      } catch (err: any) {
        setError('Failed to load job details');
        console.error('Error fetching job:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{error || 'Job not found'}</h2>
          <Link href="/jobs" className="text-indigo-600 hover:text-indigo-700 font-medium">
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/jobs"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium gap-2"
          >
            <ArrowLeft size={20} />
            Back to Jobs
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
            <h1 className="text-4xl font-bold mb-4">{job.Title}</h1>
            <div className="flex flex-wrap gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Building2 size={20} />
                <span>Company ID: {job.CompanyID}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                <span>{job.Location}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-gray-200">
              {job.EmploymentType && (
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Employment Type</p>
                  <p className="text-lg font-bold text-gray-900">{job.EmploymentType}</p>
                </div>
              )}
              {job.SalaryRange && (
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Salary Range</p>
                  <p className="text-lg font-bold text-green-600">{job.SalaryRange}</p>
                </div>
              )}
              {job.Deadline && (
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Deadline</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(job.Deadline).toLocaleDateString()}
                  </p>
                </div>
              )}
              {job.PostedAt && (
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Posted</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(job.PostedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Job</h2>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {job.Description}
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {job.Requirements}
              </div>
            </div>

            {/* Apply Section */}
            {user?.role === 'candidate' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8"
              >
                {showApplyForm ? (
                  <ApplyForm
                    jobId={parseInt(jobId)}
                    onSuccess={() => {
                      setShowApplyForm(false);
                      alert('Applied successfully!');
                    }}
                  />
                ) : (
                  <button
                    onClick={() => setShowApplyForm(true)}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all"
                  >
                    Apply for This Job
                  </button>
                )}
              </motion.div>
            ) : user?.role === 'company' || user?.role === 'admin' ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
                <p className="text-blue-900 font-medium">
                  As a {user.role}, you can view applications in your dashboard.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 text-center"
              >
                <p className="text-gray-700 mb-4">
                  Sign in as a candidate to apply for this job
                </p>
                <Link
                  href="/login"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                >
                  Sign In
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
