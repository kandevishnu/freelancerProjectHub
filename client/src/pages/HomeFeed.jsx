import React, { useState, useEffect } from 'react';
import { getAllPosts } from '../services/api';
import PostCard from '../components/PostCard.jsx';
import CreatePost from '../components/CreatePost.jsx';

const HomeFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getAllPosts();
        setPosts(data);
      } catch (err) {
        setError('Failed to fetch the feed.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  if (loading) return <div className="text-center p-10">Loading feed...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        <CreatePost onPostCreated={handleNewPost} />
        {posts.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">The feed is empty. Be the first to post!</p>
        ) : (
            posts.map(post => <PostCard key={post._id} post={post} />)
        )}
      </div>

      <div className="hidden lg:block lg:col-span-4">
        <div className="bg-white rounded-lg shadow-md p-5 sticky top-24">
            <h3 className="font-bold text-lg mb-4">My Network</h3>
            <p className="text-sm text-gray-500">Connect with other professionals. Coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default HomeFeed;
