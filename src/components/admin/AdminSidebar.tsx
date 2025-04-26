
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  UserCircle, 
  BookOpen, 
  Bookmark, 
  Mic, 
  HeartHandshake,
  Beaker,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useData();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/admin/profile', label: 'Profile', icon: <UserCircle className="w-5 h-5" /> },
    { path: '/admin/research', label: 'Research Interests', icon: <Bookmark className="w-5 h-5" /> },
    { path: '/admin/teaching', label: 'Teaching Interests', icon: <BookOpen className="w-5 h-5" /> },
    { path: '/admin/publications', label: 'Publications', icon: <BookOpen className="w-5 h-5" /> },
    { path: '/admin/talks', label: 'Invited Talks', icon: <Mic className="w-5 h-5" /> },
    { path: '/admin/activities', label: 'Volunteer Activities', icon: <HeartHandshake className="w-5 h-5" /> },
    { path: '/admin/lab', label: 'Lab Information', icon: <Beaker className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4 hidden md:block">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <p className="text-gray-400 text-sm">Manage your portfolio</p>
      </div>

      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-700 mt-8">
        <Link to="/" className="text-gray-400 hover:text-white flex items-center px-4 py-2 mb-4">
          <span>← View Public Site</span>
        </Link>
        
        <Button
          variant="destructive"
          className="w-full flex items-center justify-center"
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
