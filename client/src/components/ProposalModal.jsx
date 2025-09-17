// src/components/ProposalModal.jsx
import React, { useState } from 'react';

const ProposalModal = ({ isOpen, onClose, onSubmit }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!coverLetter || !bidAmount) {
      alert('Please fill out all fields.');
      return;
    }
    onSubmit({ coverLetter, bidAmount: Number(bidAmount) });
  };

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      {/* Modal */}
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg z-50">
        <h2 className="text-2xl font-bold mb-4">Submit Your Proposal</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="coverLetter" className="block text-gray-700 font-medium mb-2">
              Cover Letter
            </label>
            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="6"
              placeholder="Explain why you are the best fit for this project..."
              required
            ></textarea>
          </div>
          <div className="mb-6">
            <label htmlFor="bidAmount" className="block text-gray-700 font-medium mb-2">
              Your Bid Amount ($)
            </label>
            <input
              id="bidAmount"
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 500"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProposalModal;