import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createPost } from '../services/api';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      return toast.error("Post content cannot be empty.");
    }

    setIsSubmitting(true);
    try {
      const postData = {
        postType: 'text',
        content: { text },
      };
      const newPost = await createPost(postData);
      toast.success("Post created successfully!");
      setText(''); 
      onPostCreated(newPost);
    } catch (err) {
      toast.error(err.message || "Failed to create post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 mb-5">
      <div className="flex items-start gap-3 sm:gap-4">
        {user?.profilePictureUrl ? (
          <img src={user.profilePictureUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-gray-200" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm flex-shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="w-full">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none text-sm leading-relaxed"
            rows="3"
            placeholder="Share an update, question, or thought with your network..."
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 text-sm cursor-pointer"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;