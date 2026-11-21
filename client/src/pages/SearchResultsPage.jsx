import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { searchAll } from '../services/api';
import PostCard from '../components/PostCard';
import {
  Search,
  Users,
  Briefcase,
  FileText,
  ArrowRight,
  Sparkles,
  Banknote,
  X,
  ExternalLink,
  Layers,
  CheckCircle2,
} from 'lucide-react';

const SearchResultsPage = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'people' | 'jobs' | 'posts'
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
    if (!query.trim()) {
      setResults({ jobs: [], people: [], posts: [] });
      setLoading(false);
      return;
    }

    let isMounted = true;
    const performSearch = async () => {
      try {
        setLoading(true);
        const data = await searchAll(query.trim());
        if (isMounted) {
          setResults(data || { jobs: [], people: [], posts: [] });
        }
      } catch (error) {
        console.error("Search request failed:", error);
        if (isMounted) {
          setResults({ jobs: [], people: [], posts: [] });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    performSearch();
    return () => {
      isMounted = false;
    };
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const handleClear = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const peopleCount = results?.people?.length || 0;
  const jobsCount = results?.jobs?.length || 0;
  const postsCount = results?.posts?.length || 0;
  const totalCount = peopleCount + jobsCount + postsCount;

  // ----------------------------------------------------
  // SKELETON LOADING STATE (Clean, Human & Unobtrusive)
  // ----------------------------------------------------
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-4 px-2 sm:px-0">
        {/* Skeleton Top Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="flex gap-2">
            <div className="h-9 bg-gray-200 rounded-lg w-24"></div>
            <div className="h-9 bg-gray-200 rounded-lg w-28"></div>
            <div className="h-9 bg-gray-200 rounded-lg w-28"></div>
            <div className="h-9 bg-gray-200 rounded-lg w-24"></div>
          </div>
        </div>

        {/* Skeleton Cards */}
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm animate-pulse flex items-start gap-4"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-8 flex items-center justify-center gap-2">
          <Sparkles size={16} className="text-blue-500 animate-spin" />
          Searching freelancers, jobs, and community posts...
        </p>
      </div>
    );
  }

  // ----------------------------------------------------
  // EMPTY SEARCH INPUT PROMPT
  // ----------------------------------------------------
  if (!query.trim()) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Search size={36} />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Explore FreelancerHub</h1>
        <p className="text-gray-500 mt-2 max-w-md mx-auto text-base">
          Search for talent by name or skill (e.g. "React", "Design"), find open client projects, or browse community updates.
        </p>
        <form onSubmit={handleSearchSubmit} className="mt-8 max-w-lg mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Type skills, names, job titles..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-xl pl-12 pr-28 py-3.5 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2 rounded-lg transition-colors"
          >
            Search
          </button>
        </form>
      </div>
    );
  }

  // ----------------------------------------------------
  // NO RESULTS FOUND STATE
  // ----------------------------------------------------
  if (totalCount === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Search Bar Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search people, jobs, posts..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-12 py-3 text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </form>
        </div>

        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={30} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">No results found for "{query}"</h2>
          <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm">
            We couldn't find any matches across freelancers, clients, job postings, or social updates.
          </p>

          <div className="mt-8 pt-6 border-t border-gray-100 max-w-md mx-auto text-left">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Search suggestions:</p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Check for typing mistakes or spelling errors.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Try broader keywords like <span className="font-semibold text-gray-800">"developer"</span>, <span className="font-semibold text-gray-800">"frontend"</span>, or <span className="font-semibold text-gray-800">"logo"</span>.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Try searching for specific skill tags like <span className="font-semibold text-gray-800">#react</span> or <span className="font-semibold text-gray-800">#design</span>.
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SUB-COMPONENTS FOR CLEAN PRESENTATION
  // ----------------------------------------------------

  const PersonCard = ({ person }) => (
    <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start gap-3.5 mb-3">
          {person.profilePictureUrl ? (
            <img
              src={person.profilePictureUrl}
              alt={person.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              {person.name?.charAt(0) || 'U'}
            </div>
          )}
          <div className="overflow-hidden">
            <Link
              to={`/profile/${person._id}`}
              className="font-bold text-gray-900 hover:text-blue-600 truncate block text-base"
            >
              {person.name}
            </Link>
            <span
              className={`inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 ${
                person.role === 'freelancer'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {person.role}
            </span>
          </div>
        </div>

        {person.bio && (
          <p className="text-gray-600 text-xs line-clamp-2 mb-3 leading-relaxed">
            {person.bio}
          </p>
        )}

        {/* Skills Chips */}
        {person.skills && person.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {person.skills.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="bg-gray-100 text-gray-700 text-[11px] font-medium px-2 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
            {person.skills.length > 3 && (
              <span className="text-gray-400 text-[11px] font-medium self-center">
                +{person.skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <Link
        to={`/profile/${person._id}`}
        className="mt-2 w-full text-center py-2 px-3 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-700 font-semibold text-xs rounded-lg transition-colors border border-gray-200"
      >
        View Profile
      </Link>
    </div>
  );

  const JobCard = ({ job }) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wide">
              Job Opening
            </span>
            {job.content?.jobBudget && (
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                <Banknote size={13} className="text-emerald-600" />
                Rs. {Number(job.content.jobBudget).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-gray-900 pt-1">
            {job.content?.jobTitle || 'Open Project'}
          </h3>

          <p className="text-gray-600 text-sm line-clamp-3 pt-1 leading-relaxed">
            {job.content?.jobDescription}
          </p>
        </div>

        {job.project && (
          <Link
            to={`/project/${job.project}`}
            className="self-start sm:self-center flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2 px-5 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>View & Apply</span>
            <ExternalLink size={14} />
          </Link>
        )}
      </div>

      {job.author && (
        <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <Link to={`/profile/${job.author._id}`} className="flex items-center gap-2 hover:text-blue-600">
            {job.author.profilePictureUrl ? (
              <img
                src={job.author.profilePictureUrl}
                alt={job.author.name}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                {job.author.name?.charAt(0)}
              </div>
            )}
            <span>Posted by <strong className="font-semibold text-gray-700">{job.author.name}</strong></span>
          </Link>
          <span>{new Date(job.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-2 pb-14">
      {/* Search Header Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
        <form onSubmit={handleSearchSubmit} className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search freelancers, clients, job posts..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-28 py-3 text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Results for <span className="text-blue-600">"{query}"</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Found {totalCount} matching {totalCount === 1 ? 'record' : 'records'} across the platform
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Layers size={14} />
              <span>All</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'all' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {totalCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('people')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'people'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users size={14} />
              <span>People</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'people' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {peopleCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'jobs'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Briefcase size={14} />
              <span>Jobs</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'jobs' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {jobsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('posts')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'posts'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FileText size={14} />
              <span>Posts</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'posts' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {postsCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* TAB: ALL (CURATED SUMMARY ACROSS CATEGORIES) */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'all' && (
        <div className="space-y-10">
          {/* People Section */}
          {peopleCount > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 text-blue-700 rounded-md">
                    <Users size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">People ({peopleCount})</h2>
                </div>
                {peopleCount > 3 && (
                  <button
                    onClick={() => setActiveTab('people')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                  >
                    <span>View all {peopleCount} people</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.people.slice(0, 3).map((person) => (
                  <PersonCard key={person._id} person={person} />
                ))}
              </div>
            </section>
          )}

          {/* Jobs Section */}
          {jobsCount > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 text-blue-700 rounded-md">
                    <Briefcase size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Job Opportunities ({jobsCount})</h2>
                </div>
                {jobsCount > 3 && (
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                  >
                    <span>View all {jobsCount} jobs</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {results.jobs.slice(0, 3).map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            </section>
          )}

          {/* Posts Section */}
          {postsCount > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 text-blue-700 rounded-md">
                    <FileText size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Social & Discussion Posts ({postsCount})</h2>
                </div>
                {postsCount > 3 && (
                  <button
                    onClick={() => setActiveTab('posts')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                  >
                    <span>View all {postsCount} posts</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {results.posts.slice(0, 3).map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* TAB: PEOPLE */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'people' && (
        <div>
          <div className="mb-4 pb-2 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Matching Members ({peopleCount})
            </h2>
          </div>
          {peopleCount === 0 ? (
            <p className="text-gray-500 text-center py-12 bg-white rounded-xl border border-gray-200">
              No users found matching "{query}".
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.people.map((person) => (
                <PersonCard key={person._id} person={person} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* TAB: JOBS */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'jobs' && (
        <div>
          <div className="mb-4 pb-2 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Job Postings & Client Projects ({jobsCount})
            </h2>
          </div>
          {jobsCount === 0 ? (
            <p className="text-gray-500 text-center py-12 bg-white rounded-xl border border-gray-200">
              No jobs or projects found matching "{query}".
            </p>
          ) : (
            <div className="space-y-4">
              {results.jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* TAB: POSTS */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'posts' && (
        <div>
          <div className="mb-4 pb-2 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Community Posts & Updates ({postsCount})
            </h2>
          </div>
          {postsCount === 0 ? (
            <p className="text-gray-500 text-center py-12 bg-white rounded-xl border border-gray-200">
              No posts found matching "{query}".
            </p>
          ) : (
            <div className="space-y-4">
              {results.posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
