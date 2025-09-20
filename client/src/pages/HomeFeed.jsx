import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { getAllPosts, getMyConnections } from '../services/api'; 
import PostCard from '../components/PostCard.jsx';
import CreatePost from '../components/CreatePost.jsx';

const HomeFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsData, connectionsData] = await Promise.all([
          getAllPosts(),
          getMyConnections()
        ]);
        setPosts(postsData);
        setConnections(connectionsData); 
      } catch (err) {
        setError('Failed to fetch data for the feed.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
          {connections.length > 0 ? (
            <ul className="space-y-3">
              {connections.map(connection => (
                <li key={connection._id}>
                  <Link to={`/profile/${connection._id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center font-bold text-blue-600">
                      {connection.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{connection.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{connection.role}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">You haven't made any connections yet. Use the search to find and connect with other professionals.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeFeed;