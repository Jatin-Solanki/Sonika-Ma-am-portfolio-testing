
import React from 'react';
import { useData } from '@/context/DataContext';
import SectionTitle from '@/components/SectionTitle';
import { BookOpen, FileText, ExternalLink } from 'lucide-react';

const Publications: React.FC = () => {
  const { publications } = useData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-6">Publication</h1>
          
          <SectionTitle title="Research Publications" icon={<BookOpen className="w-5 h-5" />} />
          
          <div className="space-y-6 mt-6">
            {publications.map((publication) => (
              <div 
                key={publication.id} 
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start">
                  <FileText className="w-5 h-5 mr-3 text-university-red flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold">{publication.title}</h3>
                    <p className="text-gray-700 mt-1">{publication.authors}</p>
                    <p className="text-gray-600 italic mt-1">
                      {publication.journal}, {publication.year}
                    </p>
                    {publication.url && (
                      <div className="mt-2">
                        <a 
                          href={publication.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                          <span>View Publication</span>
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {publications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No publications available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Publications;
