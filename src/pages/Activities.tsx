
import React from 'react';
import { useData } from '@/context/DataContext';
import SectionTitle from '@/components/SectionTitle';
import { HeartHandshake, Calendar, Building } from 'lucide-react';

const Activities: React.FC = () => {
  const { activities } = useData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-6">Volunteer Activities</h1>
          
          <SectionTitle title="Professional & Community Services" icon={<HeartHandshake className="w-5 h-5" />} />
          
          <div className="space-y-8 mt-6">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-xl font-semibold text-university-dark">{activity.title}</h3>
                
                <div className="flex items-center text-gray-600 mt-2">
                  <Building className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{activity.organization}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mt-1">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span>
                    {activity.startDate}
                    {activity.endDate ? ` - ${activity.endDate}` : ' - Present'}
                  </span>
                </div>
                
                <p className="mt-3 text-gray-700">{activity.description}</p>
              </div>
            ))}
          </div>
          
          {activities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No volunteer activities available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Activities;
