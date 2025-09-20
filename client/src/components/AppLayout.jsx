import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { socket } from '../services/socket';
import { Home, Briefcase, MessageSquare, Bell, LogOut, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { getUnreadNotificationCount, markNotificationsAsRead } from '../services/api';

const AppLayout = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      if (socket.connected) socket.disconnect();
      return;
    }

    socket.connect();
    socket.on('connect', () => {
      console.log(`[Socket] ✅ Global connection established. ID: ${socket.id}`);
      socket.emit('authenticate', user._id);
    });

    const fetchCount = async () => {
      try {
        const { count } = await getUnreadNotificationCount();
        setNotificationCount(count);
      } catch (error) {
        console.error("Could not fetch notification count. Details:", error);
      }
    };
    fetchCount();

    const handleNewNotification = (notification) => {
      setNotificationCount(prev => prev + 1);
      toast.info(notification.message || "You have a new notification!");
    };
    socket.on('newNotification', handleNewNotification);

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
      socket.off('connect');
      socket.off('newNotification', handleNewNotification);
    };
  }, [user]);

  useEffect(() => {
    const markReadOnPageVisit = async () => {
      if (location.pathname === "/notifications" && notificationCount > 0) {
        try {
          await markNotificationsAsRead();
          setNotificationCount(0);
        } catch (error) {
          console.error("Could not mark notifications as read:", error);
        }
      }
    };
    markReadOnPageVisit();
  }, [location.pathname, notificationCount]); 

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm.trim()}`);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
    }`;

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 font-bold text-2xl text-blue-600">
                <NavLink to="/home">FreelancerHub</NavLink>
              </div>
              <form onSubmit={handleSearchSubmit} className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 bg-gray-100 border-transparent rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </form>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-2">
              <NavLink to="/home" className={navLinkClass} end>
                <Home size={20} /><span>Home</span>
              </NavLink>

              {user?.role === 'freelancer' && (
                <NavLink to="/find-work" className={navLinkClass}>
                  <Search size={20} /><span>Find Work</span>
                </NavLink>
              )}

              <NavLink to="/dashboard" className={navLinkClass}>
                <Briefcase size={20} /><span>My Projects</span>
              </NavLink>
              <NavLink to="/messages" className={navLinkClass}>
                <MessageSquare size={20} /><span>Messages</span>
              </NavLink>

              <NavLink to="/notifications" className={navLinkClass}>
                <div className="relative">
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </div>
                <span>Notifications</span>
              </NavLink>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <span className="hidden md:inline font-semibold text-gray-700">
                  {user?.name || "User"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;