'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { BarChart3, Users, Briefcase, Shield } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user?.role !== 'admin') {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-xl text-gray-600">Monitor and manage the platform</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            {
              icon: <Users size={32} />,
              label: 'Total Users',
              value: '2,345',
              color: 'text-blue-600',
              bgColor: 'bg-blue-50',
            },
            {
              icon: <Briefcase size={32} />,
              label: 'Active Jobs',
              value: '847',
              color: 'text-purple-600',
              bgColor: 'bg-purple-50',
            },
            {
              icon: <BarChart3 size={32} />,
              label: 'Applications',
              value: '12,543',
              color: 'text-green-600',
              bgColor: 'bg-green-50',
            },
            {
              icon: <Shield size={32} />,
              label: 'Verified Companies',
              value: '234',
              color: 'text-indigo-600',
              bgColor: 'bg-indigo-50',
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-xl p-8 border border-gray-200`}
            >
              <div className={`${stat.color} mb-4`}>{stat.icon}</div>
              <p className="text-gray-600 text-sm font-medium mb-2">{stat.label}</p>
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Admin Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              title: 'Users Management',
              description: 'Manage user accounts and permissions',
              icon: Users,
            },
            {
              title: 'Company Verification',
              description: 'Verify and manage company accounts',
              icon: Shield,
            },
            {
              title: 'Jobs Moderation',
              description: 'Review and approve job postings',
              icon: Briefcase,
            },
            {
              title: 'Analytics',
              description: 'View platform analytics and reports',
              icon: BarChart3,
            },
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:border-indigo-500 transition-all cursor-pointer group"
              >
                <Icon size={32} className="text-indigo-600 mb-4 group-hover:text-purple-600 transition-colors" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
                <div className="mt-4">
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                    Access
                    <span>→</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              'New job posting from TechCorp Inc.',
              'User registration: john.doe@example.com',
              'Company verification request from StartupXYZ',
              'Job application from candidate #1234',
              'System maintenance completed',
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <p className="text-gray-700">{activity}</p>
                <span className="ml-auto text-sm text-gray-500">
                  {Math.floor(Math.random() * 24) + 1}h ago
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
