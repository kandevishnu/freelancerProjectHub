import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Briefcase, 
  Banknote 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { likePost, addComment } from "../services/api";
import { socket } from "../services/socket";
import { formatDistanceToNow } from "date-fns";

const renderWithHashtags = (text) => {
  if (!text) return null;
  const parts = text.split(/(#\w+)/g);
  return parts.map((part, index) => {
    if (part.startsWith('#')) {
      const tag = part.substring(1);
      return (
        <Link key={index} to={`/search?q=${tag}`} className="text-blue-600 hover:underline">
          {part}
        </Link>
      );
    }
    return part;
  });
};

const formatTimestamp = (timestamp) => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};

// Extracts a clean overview summary from markdown description
const getJobSummary = (text) => {
  if (!text) return '';
  const cutIdx = text.search(/(\*\*Key Features|\b###)/i);
  if (cutIdx !== -1) {
    const trimmed = text.slice(0, cutIdx).trim();
    if (trimmed.length > 20) return trimmed;
  }
  return text.replace(/###?\s+[^\n]+/g, '').replace(/[*#]/g, '').trim();
};

// Extracts tech stack tags from the description
const extractTechTags = (text) => {
  if (!text) return [];
  const techMatch = text.match(/### Preferred Technology Stack([\s\S]*?)(?:###|$)/i);
  const tags = [];
  if (techMatch) {
    const lines = techMatch[1].split(/(?:\r?\n|\s+-\s+)/).map((l) => l.trim()).filter(Boolean);
    lines.forEach((l) => {
      const clean = l.replace(/^[-*•]\s*/, '').trim();
      const colon = clean.indexOf(':');
      const val = colon !== -1 ? clean.slice(colon + 1).trim() : clean;
      val.split(/[\/,]/).map((t) => t.trim()).filter(Boolean).forEach((t) => {
        if (t && !tags.includes(t)) tags.push(t);
      });
    });
  }
  return tags;
};

const PostCard = ({ post }) => {
  const { author, content, postType, createdAt, _id, project } = post;
  const { user } = useAuth();

  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(2);

  const isJob = postType === "job";
  const techTags = isJob ? extractTechTags(content?.jobDescription) : [];
  const jobSummary = isJob ? getJobSummary(content?.jobDescription) : '';

  useEffect(() => {
    setIsLiked(likes.includes(user?._id));
  }, [likes, user?._id]);

  useEffect(() => {
    const handleLikeUpdate = ({ postId, likes: updatedLikes }) => {
      if (postId === _id) setLikes(updatedLikes);
    };
    const handleCommentUpdate = ({ postId, comment: newComment }) => {
      if (postId === _id) {
        setComments((prevComments) => [newComment, ...prevComments]);
        setVisibleCommentsCount((prevCount) => prevCount + 1);
      }
    };

    socket.on("postLikeUpdate", handleLikeUpdate);
    socket.on("postCommentUpdate", handleCommentUpdate);

    return () => {
      socket.off("postLikeUpdate", handleLikeUpdate);
      socket.off("postCommentUpdate", handleCommentUpdate);
    };
  }, [_id]);

  const handleLike = async () => {
    const originalLikes = likes;
    const newLikes = isLiked
      ? likes.filter((id) => id !== user._id)
      : [...likes, user._id];

    setIsLiked(!isLiked);
    setLikes(newLikes);

    try {
      await likePost(_id);
    } catch (error) {
      console.error("Failed to update like status:", error);
      setIsLiked(!isLiked);
      setLikes(originalLikes);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await addComment(_id, { text: newComment });
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  const renderContent = () => {
    switch (postType) {
      case "job":
        return (
          <div className="mt-3 p-4 bg-gray-50/80 rounded-lg border border-gray-200/80">
            <div>
              <Link
                to={project ? `/project/${project}` : '#'}
                className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors block leading-snug"
              >
                {content.jobTitle}
              </Link>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                {content.jobBudget && (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-sm">
                    <Banknote size={15} className="text-emerald-600" />
                    Rs. {Number(content.jobBudget || 0).toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-gray-400">•</span>
                <span className="text-xs text-gray-600 font-medium">
                  Fixed-Price Project
                </span>
              </div>
            </div>

            {jobSummary && (
              <p className="mt-2.5 text-gray-600 text-sm leading-relaxed line-clamp-3">
                {jobSummary}
              </p>
            )}

            {techTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-gray-200/60">
                {techTags.slice(0, 5).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-white text-gray-700 border border-gray-200 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {techTags.length > 5 && (
                  <span className="px-1.5 py-0.5 text-gray-500 text-xs">
                    +{techTags.length - 5}
                  </span>
                )}
              </div>
            )}

            {project && (
              <div className="mt-3.5 pt-3 border-t border-gray-200/60 flex items-center justify-between">
                <Link
                  to={`/project/${project}`}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-2 px-3.5 rounded-lg transition-colors"
                >
                  <Briefcase size={14} />
                  <span>View Job & Apply</span>
                </Link>
                <span className="text-xs text-gray-400">Open for proposals</span>
              </div>
            )}
          </div>
        );
      case "showcase":
        return (
          <div className="mt-2">
            <p className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap">
              {renderWithHashtags(content.text)}
            </p>
            {content.imageUrl && (
              <img
                src={content.imageUrl}
                alt="Showcase"
                className="mt-3 rounded-lg w-full object-cover border border-gray-200 max-h-96"
              />
            )}
          </div>
        );
      case "text":
      default:
        return (
          <p className="mt-2 text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap">
            {renderWithHashtags(content.text)}
          </p>
        );
    }
  };

  const handleLoadMoreComments = () => {
    setVisibleCommentsCount(comments.length);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors p-5 mb-4">
      {/* Author header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {author ? (
            <Link to={`/profile/${author._id}`} className="flex items-center group">
              {author.profilePictureUrl ? (
                <img
                  src={author.profilePictureUrl}
                  alt={author.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm group-hover:ring-1 ring-blue-500 transition-all">
                  {author.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="ml-3">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-sm text-gray-900 group-hover:underline">
                    {author.name}
                  </p>
                  {isJob && (
                    <span className="text-[10px] font-medium text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                      Client
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatTimestamp(createdAt)}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-sm">
                ?
              </div>
              <div className="ml-3">
                <p className="font-semibold text-sm text-gray-600">Former Member</p>
                <p className="text-xs text-gray-400">{formatTimestamp(createdAt)}</p>
              </div>
            </div>
          )}
        </div>

        {isJob && (
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
            Job Opening
          </span>
        )}
      </div>

      {/* Main Content */}
      <div className="mb-3">{renderContent()}</div>

      {/* Engagement bar */}
      <div className="border-t border-gray-100 pt-2 flex justify-around text-gray-600 text-xs font-medium">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 hover:bg-gray-50 p-2 rounded-lg w-full justify-center transition-colors cursor-pointer ${
            isLiked ? "text-blue-600 font-semibold" : "text-gray-600"
          }`}
        >
          <ThumbsUp size={16} className={isLiked ? "fill-current" : ""} />
          {likes.length > 0 && <span>{likes.length}</span>}
          <span>{likes.length === 1 ? "Like" : "Likes"}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 hover:bg-gray-50 p-2 rounded-lg w-full justify-center transition-colors cursor-pointer"
        >
          <MessageCircle size={16} />
          {comments.length > 0 && <span>{comments.length}</span>}
          <span>{comments.length === 1 ? "Comment" : "Comments"}</span>
        </button>
        <button className="flex items-center gap-1.5 hover:bg-gray-50 p-2 rounded-lg w-full justify-center transition-colors cursor-pointer">
          <Share2 size={16} />
          <span>Share</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="border-t border-gray-100 mt-2.5 pt-3">
          <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-3">
            {user?.profilePictureUrl ? (
              <img src={user.profilePictureUrl} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xs flex-shrink-0">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-grow px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium text-xs transition-colors cursor-pointer"
            >
              Post
            </button>
          </form>
          <div className="space-y-2">
            {comments.slice(0, visibleCommentsCount).map((comment) => (
              <div key={comment._id} className="flex items-start gap-2">
                {comment.author?.profilePictureUrl ? (
                  <img src={comment.author.profilePictureUrl} alt={comment.author.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex-shrink-0 items-center justify-center flex font-bold text-gray-500 text-[10px]">
                    {comment.author?.name?.charAt(0) || "?"}
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg px-3 py-1.5 flex-grow text-xs border border-gray-100">
                  <div className="flex justify-between items-baseline">
                    <p className="font-semibold text-gray-900 text-xs">
                      {comment.author?.name || "Unknown User"}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {formatTimestamp(comment.createdAt)}
                    </p>
                  </div>
                  <p className="text-gray-700 mt-0.5">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
          {comments.length > visibleCommentsCount && (
            <button
              onClick={handleLoadMoreComments}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 mt-2 cursor-pointer"
            >
              View all {comments.length} comments
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
