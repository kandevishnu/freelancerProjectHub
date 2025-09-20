import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getUserProfile,
  sendConnectionRequest,
  getConnectionStatus,
  startConversation,
  getReviewsForUser, 
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard.jsx";
import ReviewList from "../components/ReviewList.jsx"; 
import { UserPlus, Check, Clock } from "lucide-react";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const [profileData, statusData, reviewsData] = await Promise.all([
          getUserProfile(userId),
          getConnectionStatus(userId),
          getReviewsForUser(userId),
        ]);
        setProfile(profileData);
        setConnectionStatus(statusData.status);
        setReviews(reviewsData);
      } catch (err) {
        console.error("Error fetching profile data:", err); 
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [userId]);

  const handleConnect = async () => {
    try {
      await sendConnectionRequest(userId);
      setConnectionStatus("pending");
      toast.success("Connection request sent!");
    } catch (err) {
      toast.error(err.message || "Failed to send request.");
    }
  };

  const handleStartConversation = async () => {
    try {
      const conversation = await startConversation(userId);
      navigate(`/messages/${conversation._id}`);
    } catch (error) {
      toast.error("Failed to start conversation.");
    }
  };

  const renderConnectButton = () => {
    if (connectionStatus === "self" || !currentUser) return null;

    switch (connectionStatus) {
      case "not_connected":
        return (
          <button
            onClick={handleConnect}
            className="mt-4 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <UserPlus size={18} /> Connect
          </button>
        );
      case "pending":
        return (
          <button
            disabled
            className="mt-4 w-full bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <Clock size={18} /> Pending
          </button>
        );
      case "accepted":
        return (
          <button
            disabled
            className="mt-4 w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <Check size={18} /> Connected
          </button>
        );
      default:
        return null;
    }
  };

  if (loading)
    return <div className="text-center p-10">Loading profile...</div>;
  if (error)
    return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!profile) return <div className="text-center p-10">User not found.</div>;

  const { user, posts } = profile;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-4">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center font-bold text-4xl text-blue-600 mb-4">
              {user.name.charAt(0)}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-md text-gray-500 capitalize">{user.role}</p>
            <div className="mt-4 w-full flex flex-col gap-2">
              {renderConnectButton()}
              {connectionStatus !== "self" && (
                <button
                  onClick={handleStartConversation}
                  className="w-full bg-white border border-blue-600 text-blue-600 font-bold py-2 px-4 rounded-lg hover:bg-blue-50"
                >
                  Message
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold text-gray-800">Bio</h3>
            <p className="text-gray-600 text-sm mt-1">
              {user.bio || "No bio provided."}
            </p>
          </div>

          {user.role === "freelancer" && user.skills.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <h3 className="font-semibold text-gray-800">Skills</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="md:col-span-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Reviews ({reviews.length})
          </h2>
          <ReviewList reviews={reviews} />
        </div>
        <h2 className="text-2xl font-bold mb-4">Activity</h2>
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            This user hasn't posted anything yet.
          </div>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default ProfilePage;