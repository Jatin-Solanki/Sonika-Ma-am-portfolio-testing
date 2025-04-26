
import React from 'react';
import { useData } from '@/context/DataContext';
import SectionTitle from '@/components/SectionTitle';
import { Beaker, Users, Microscope } from 'lucide-react';

const Lab: React.FC = () => {
  const { lab } = useData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-6">Lab Page</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 order-2 lg:order-1">
              <SectionTitle title={lab.name} icon={<Beaker className="w-5 h-5" />} />
              <div className="prose max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed">{lab.description}</p>
              </div>
              
              <SectionTitle title="Research Focus" icon={<Microscope className="w-5 h-5" />} />
              <ul className="list-disc pl-5 mb-8 space-y-2">
                {lab.research.map((item, index) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
              
              <SectionTitle title="Lab Members" icon={<Users className="w-5 h-5" />} />
              <ul className="space-y-4">
                {lab.members.map((member, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-university-red text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                      {member.split(' ')[0][0]}{member.split(' ')[1]?.[0]}
                    </div>
                    <div>
                      <p className="font-medium">{member}</p>
                      <p className="text-sm text-gray-600">
                        {member.includes('PI') ? 'Principal Investigator' : 
                         member.includes('Co-PI') ? 'Co-Principal Investigator' : 
                         member.includes('PhD') ? 'PhD Student' : 
                         member.includes('MSc') ? 'Master Student' : 'Laboratory Member'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Laboratory Information</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Location:</h4>
                    <p className="text-gray-700">Room 403, Engineering Building</p>
                    <p className="text-gray-700">Netaji Subhas University Of Technology</p>
                    <p className="text-gray-700">New Delhi, India</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Equipment:</h4>
                    <ul className="list-disc pl-5 text-gray-700">
                      <li>High-performance computing cluster</li>
                      <li>Medical imaging workstations</li>
                      <li>Signal acquisition devices</li>
                      <li>Data analysis software suite</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Lab Hours:</h4>
                    <p className="text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-700">Weekends: By appointment only</p>
                  </div>
                </div>
              </div>
              
              {lab.imageUrl ? (
                <img 
                  src={lab.imageUrl} 
                  alt="Lab" 
                  className="w-full rounded-lg shadow-md mt-6"
                />
              ) : (
                <div className="bg-gray-200 w-full h-64 rounded-lg flex items-center justify-center mt-6">
                  <p className="text-gray-500 italic">Lab image</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lab;
