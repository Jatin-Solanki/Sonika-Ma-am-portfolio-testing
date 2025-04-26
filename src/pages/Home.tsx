
import React from 'react';
import { useData } from '@/context/DataContext';
import SectionTitle from '@/components/SectionTitle';
import { BookOpen, Bookmark, GraduationCap, Phone, Mail, Globe } from 'lucide-react';

const Home: React.FC = () => {
  const { profile, researchInterests, teachingInterests } = useData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left sidebar with profile info */}
          <div className="md:col-span-1">
            <div className="bg-university-lavender rounded-lg p-6 shadow-md">
              <div className="flex flex-col items-center mb-6">
                <img 
                  src={profile.imageUrl} 
                  alt={profile.name} 
                  className="w-48 h-48 object-cover rounded-md mb-4"
                />
                <h2 className="text-2xl font-bold text-center">{profile.name}</h2>
                <p className="text-gray-600 text-center">{profile.title}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Education
                </h3>
                <p className="mt-1 text-gray-700">{profile.education}</p>
              </div>
              
              <div className="border-t border-gray-300 my-4 pt-4">
                <h3 className="text-lg font-semibold mb-2">Contact Detail</h3>
                <div className="flex items-start mb-2">
                  <Phone className="w-4 h-4 mr-2 mt-1" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-start mb-2">
                  <Mail className="w-4 h-4 mr-2 mt-1" />
                  <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline">
                    {profile.email}
                  </a>
                </div>
                {profile.websiteUrl && (
                  <div className="flex items-start">
                    <Globe className="w-4 h-4 mr-2 mt-1" />
                    <a 
                      href={profile.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Web Profile
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-md mb-8">
              <SectionTitle title="Profile" icon={<BookOpen className="w-5 h-5" />} />
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{profile.about}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <SectionTitle title="Research Interest" icon={<Bookmark className="w-5 h-5" />} />
                <ul className="space-y-2">
                  {researchInterests.map((interest) => (
                    <li key={interest.id} className="flex items-start">
                      <span className="mr-2">→</span>
                      <span>{interest.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <SectionTitle title="Teaching Interest" icon={<GraduationCap className="w-5 h-5" />} />
                <ul className="space-y-2">
                  {teachingInterests.map((interest) => (
                    <li key={interest.id} className="flex items-start">
                      <span className="mr-2">→</span>
                      <span>{interest.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
