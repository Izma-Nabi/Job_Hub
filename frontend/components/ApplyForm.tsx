'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { jobsApi } from '@/lib/api';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ApplyFormProps {
  jobId: number;
  onSuccess?: () => void;
}

export default function ApplyForm({ jobId, onSuccess }: ApplyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    coverLetter: '',
    resumeLink: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await jobsApi.applyJob(jobId, {
        coverLetter: formData.coverLetter,
        resumeLink: formData.resumeLink,
      });

      setSuccess(true);
      setFormData({ coverLetter: '', resumeLink: '' });

      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to submit application'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-6"
      >
        <CheckCircle size={48} className="mx-auto text-green-600 mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
        <p className="text-gray-600">
          Your application has been successfully submitted. The recruiter will review it soon.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply for This Position</h2>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
        >
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 font-medium">{error}</p>
        </motion.div>
      )}

      {/* Resume Link */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <label htmlFor="resumeLink" className="block text-sm font-medium text-gray-700 mb-2">
          Resume Link *
        </label>
        <input
          type="url"
          id="resumeLink"
          name="resumeLink"
          value={formData.resumeLink}
          onChange={handleChange}
          placeholder="https://example.com/resume.pdf"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
        />
        <p className="text-sm text-gray-600 mt-1">Link to your resume or CV</p>
      </motion.div>

      {/* Cover Letter */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
          Cover Letter
        </label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleChange}
          placeholder="Tell the recruiter why you're a great fit for this position..."
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
        />
        <p className="text-sm text-gray-600 mt-1">Optional but recommended</p>
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Submitting...
            </span>
          ) : (
            'Submit Application'
          )}
        </motion.button>
      </motion.div>
    </form>
  );
}
