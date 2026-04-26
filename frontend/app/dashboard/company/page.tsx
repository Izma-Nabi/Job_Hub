'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { jobsApi } from '@/lib/api';
import { Plus, Briefcase, Users } from 'lucide-react';
import Link from 'next/link';

interface Job {
  JobID: number;
  Title: string;
  Location: string;
  SalaryRange?: string;
  EmploymentType?: string;
  IsActive: number;
}

interface Application {
  ApplicationID: number;
  CoverLetter: string;
  ResumeLink: string;
  Status: string;
  AppliedAt: string;
}

export default function CompanyDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewJobForm, setShowNewJobForm] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salaryRange: '',
    employmentType: 'Full-time',
    deadline: '',
  });

  useEffect(() => {
    if (!authLoading && user?.role !== 'company') {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'company') {
      const fetchJobsAndApplications = async () => {
        try {
          setIsLoading(true);
          // Fetch jobs
          const jobsResponse = await jobsApi.getJobsByCompany(user.id);
          const jobsList = jobsResponse.data?.jobs || [];
          setJobs(Array.isArray(jobsList) ? jobsList : []);

          // Fetch applications for all jobs
          try {
            let allApplications: Application[] = [];
            for (const job of jobsList) {
              const appResponse = await jobsApi.getApplications(job.JobID);
              const appList = appResponse.data?.applications || appResponse.data || [];
              allApplications = [...allApplications, ...appList];
            }
            setApplications(Array.isArray(allApplications) ? allApplications : []);
          } catch (appError) {
            console.log('Could not fetch applications:', appError);
            setApplications([]);
          }
        } catch (error) {
          console.error('Error fetching jobs:', error);
          setJobs([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchJobsAndApplications();
    }
  }, [user]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await jobsApi.createJob(newJob);
      setNewJob({
        title: '',
        description: '',
        requirements: '',
        location: '',
        salaryRange: '',
        employmentType: 'Full-time',
        deadline: '',
      });
      setShowNewJobForm(false);
      alert('Job created successfully!');

      // Refresh jobs list
      const response = await jobsApi.getJobsByCompany(user!.id);
      const jobsList = response.data?.jobs || [];
      setJobs(Array.isArray(jobsList) ? jobsList : []);
    } catch (error) {
      alert('Failed to create job');
      console.error('Error:', error);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome, {user?.companyName}!
              </h1>
              <p className="text-xl text-gray-600">Manage your job postings and applications</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewJobForm(!showNewJobForm)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
            >
              <Plus size={20} />
              Post a Job
            </motion.button>
          </div>
        </motion.div>

        {/* New Job Form */}
        {showNewJobForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Job Posting</h2>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  placeholder="e.g., Senior React Developer"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  placeholder="Describe the role and responsibilities..."
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements *</label>
                <textarea
                  value={newJob.requirements}
                  onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                  placeholder="List the required skills and qualifications..."
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    placeholder="e.g., San Francisco, CA"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={newJob.salaryRange}
                    onChange={(e) => setNewJob({ ...newJob, salaryRange: e.target.value })}
                    placeholder="e.g., $100k - $150k"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                  <select
                    value={newJob.employmentType}
                    onChange={(e) => setNewJob({ ...newJob, employmentType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={newJob.deadline}
                    onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Post Job
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewJobForm(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white rounded-xl shadow-lg p-8">
            <Briefcase size={32} className="text-indigo-600 mb-4" />
            <p className="text-gray-600 text-sm font-medium mb-1">Active Job Postings</p>
            <p className="text-4xl font-bold text-gray-900">{Array.isArray(jobs) ? jobs.filter((j) => j.IsActive).length : 0}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <Users size={32} className="text-purple-600 mb-4" />
            <p className="text-gray-600 text-sm font-medium mb-1">Total Postings</p>
            <p className="text-4xl font-bold text-gray-900">{Array.isArray(jobs) ? jobs.length : 0}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <Briefcase size={32} className="text-green-600 mb-4" />
            <p className="text-gray-600 text-sm font-medium mb-1">Total Applications</p>
            <p className="text-4xl font-bold text-gray-900">{applications.length}</p>
          </div>
        </motion.div>

        {/* Job Listings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Your Job Postings</h2>
          </div>

          {jobs.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">No job postings yet</p>
              <button
                onClick={() => setShowNewJobForm(true)}
                className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.JobID} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{job.Title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{job.Location}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{job.EmploymentType}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            job.IsActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {job.IsActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/jobs/${job.JobID}`}
                          className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Applications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden mt-12"
        >
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Candidate Applications</h2>
          </div>

          {applications.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">No applications received yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Resume</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Applied Date</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.ApplicationID} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            app.Status === 'Approved'
                              ? 'bg-green-100 text-green-800'
                              : app.Status === 'Rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {app.Status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {app.ResumeLink ? (
                          <a
                            href={app.ResumeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                          >
                            View Resume
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">No resume</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(app.AppliedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
