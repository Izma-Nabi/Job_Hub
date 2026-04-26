'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { candidateApi, jobsApi } from '@/lib/api';
import { User, FileText, Briefcase, Calendar, MapPin, DollarSign } from 'lucide-react';

interface CandidateProfile {
  CandidateID: number;
  FullName: string;
  Email: string;
  PhoneNumber: string;
  Skills: string;
}

interface Application {
  ApplicationID: number;
  JobID: number;
  JobTitle: string;
  CompanyName: string;
  Location: string;
  SalaryRange: string;
  Status: string;
  CoverLetter: string;
  ResumeLink: string;
  AppliedAt: string;
}

export default function CandidateDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    skills: '',
  });

  useEffect(() => {
    if (!authLoading && user?.role !== 'candidate') {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'candidate') {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          
          // Fetch profile
          const profileResponse = await candidateApi.getProfile();
          setProfile(profileResponse.data);
          setFormData({
            fullName: profileResponse.data.FullName || '',
            phoneNumber: profileResponse.data.PhoneNumber || '',
            skills: profileResponse.data.Skills || '',
          });

          // Fetch applications
          try {
            const appResponse = await candidateApi.getApplications();
            const appsList = appResponse.data?.applications || [];
            setApplications(Array.isArray(appsList) ? appsList : []);
          } catch (appError) {
            console.log('Could not fetch applications:', appError);
            setApplications([]);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await candidateApi.updateProfile(formData);
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              FullName: formData.fullName,
              PhoneNumber: formData.phoneNumber,
              Skills: formData.skills,
            }
          : null
      );
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome, {profile?.FullName || 'Candidate'}!
          </h1>
          <p className="text-xl text-gray-600">Manage your profile and applications</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-12"
        >
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <User size={28} className="text-indigo-600" />
              Your Profile
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <textarea
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 resize-none"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">Email</p>
                <p className="text-lg text-gray-900">{profile?.Email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">Full Name</p>
                <p className="text-lg text-gray-900">{profile?.FullName || 'Not set'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">Phone Number</p>
                <p className="text-lg text-gray-900">{profile?.PhoneNumber || 'Not set'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">Skills</p>
                <p className="text-lg text-gray-900 whitespace-pre-wrap">{profile?.Skills || 'Not set'}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          <div className="bg-white rounded-xl shadow-lg p-8">
            <Briefcase size={32} className="text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Browse Jobs</h3>
            <p className="text-gray-600 mb-4">Find and apply for positions that match your skills</p>
            <a
              href="/jobs"
              className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Explore Jobs
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <FileText size={32} className="text-purple-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">My Applications</h3>
            <p className="text-gray-600 mb-4">{applications.length} application{applications.length !== 1 ? 's' : ''}</p>
            <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
          </div>
        </motion.div>

        {/* Applications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Your Applications</h2>
          </div>

          {applications.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg mb-4">No applications yet</p>
              <a
                href="/jobs"
                className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                Browse Jobs
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Job Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Company</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.ApplicationID} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{app.JobTitle}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{app.CompanyName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin size={14} />
                          {app.Location}
                        </div>
                      </td>
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
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar size={14} />
                          {new Date(app.AppliedAt).toLocaleDateString()}
                        </div>
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
