import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  deleteField,
  onSnapshot,
  query,
  where,
  writeBatch,
  getDocs
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';

type ProfileData = {
  name: string;
  title: string;
  university: string;
  education: string;
  imageUrl: string;
  phone: string;
  email: string;
  websiteUrl: string;
  about: string;
};

type ResearchInterest = {
  id: string;
  title: string;
};

type TeachingInterest = {
  id: string;
  title: string;
};

type Publication = {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  url?: string;
};

type Talk = {
  id: string;
  title: string;
  venue: string;
  date: string;
  description?: string;
};

type Activity = {
  id: string;
  title: string;
  organization: string;
  description: string;
  startDate: string;
  endDate?: string;
};

type Lab = {
  id: string;
  name: string;
  description: string;
  research: string[];
  members: string[];
  imageUrl?: string;
};

type DataContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  profile: ProfileData;
  researchInterests: ResearchInterest[];
  teachingInterests: TeachingInterest[];
  publications: Publication[];
  talks: Talk[];
  activities: Activity[];
  lab: Lab;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
  addResearchInterest: (interest: string) => Promise<void>;
  removeResearchInterest: (id: string) => Promise<void>;
  addTeachingInterest: (interest: string) => Promise<void>;
  removeTeachingInterest: (id: string) => Promise<void>;
  addPublication: (pub: Omit<Publication, 'id'>) => Promise<void>;
  updatePublication: (id: string, pub: Partial<Publication>) => Promise<void>;
  removePublication: (id: string) => Promise<void>;
  addTalk: (talk: Omit<Talk, 'id'>) => Promise<void>;
  updateTalk: (id: string, talk: Partial<Talk>) => Promise<void>;
  removeTalk: (id: string) => Promise<void>;
  addActivity: (activity: Omit<Activity, 'id'>) => Promise<void>;
  updateActivity: (id: string, activity: Partial<Activity>) => Promise<void>;
  removeActivity: (id: string) => Promise<void>;
  updateLab: (data: Partial<Lab>) => Promise<void>;
  addLabMember: (member: string) => Promise<void>;
  removeLabMember: (member: string) => Promise<void>;
  addLabResearch: (research: string) => Promise<void>;
  removeLabResearch: (research: string) => Promise<void>;
  isLoading: boolean;
};

const defaultProfile: ProfileData = {
  name: "Dr. Jatin Solanki",
  title: "Professor(BioTech)",
  university: "Netaji Subhas University Of Technology, New Delhi",
  education: "B.Tech, Netaji Subhas University Of Technology, New Delhi",
  imageUrl: "/lovable-uploads/364be3b8-6bc1-4ee5-a264-514d4d6f44a9.png",
  phone: "1102-23449",
  email: "jatinsolanki@gmail.com",
  websiteUrl: "",
  about: "The About Me or Profile section of your portfolio is a short summary about yourself in relation to the type of role you are applying for. In the sample portfolio, the student has highlighted their program, the projects they've worked on and their specific area of interest in their field."
};

const defaultResearchInterests: ResearchInterest[] = [
  { id: '1', title: 'Sparse Recovery' },
  { id: '2', title: 'Low-rank matrix completion' },
  { id: '3', title: 'Medical Imaging' },
  { id: '4', title: 'Biomedical Signal Processing' },
  { id: '5', title: 'Collaborative Filtering' },
  { id: '6', title: 'Bio Technology' },
  { id: '7', title: 'Gene Cloning' }
];

const defaultTeachingInterests: TeachingInterest[] = [
  { id: '1', title: 'Data Structure & Algorithm' },
  { id: '2', title: 'Web Development' },
  { id: '3', title: 'Dna Sequencing' },
  { id: '4', title: 'Dna Alignment' }
];

const defaultPublications: Publication[] = [
  { 
    id: '1', 
    title: 'Advances in Biomedical Signal Processing Techniques', 
    authors: 'Solanki J., Kumar A., Patel S.',
    journal: 'IEEE Transactions on Biomedical Engineering',
    year: '2023'
  },
  { 
    id: '2', 
    title: 'Applications of Matrix Completion in Genomic Data Analysis', 
    authors: 'Solanki J., Singh R.',
    journal: 'Computational Biology Journal',
    year: '2022'
  }
];

const defaultTalks: Talk[] = [
  {
    id: '1',
    title: 'Latest Trends in Biomedical Signal Processing',
    venue: 'International Conference on Biomedical Engineering, Singapore',
    date: '2023-06-15',
    description: 'Invited talk on recent advancements in biomedical signal processing'
  }
];

const defaultActivities: Activity[] = [
  {
    id: '1',
    title: 'Faculty Advisor',
    organization: 'Biotech Student Association',
    description: 'Mentoring students in research and academic activities',
    startDate: '2020-01-01'
  }
];

const defaultLab: Lab = {
  id: '1',
  name: 'Biomedical Signal Processing Lab',
  description: 'Our lab focuses on developing advanced techniques for processing biomedical signals and images.',
  research: ['Signal processing algorithms', 'Medical image analysis', 'AI applications in healthcare'],
  members: ['Dr. Jatin Solanki (PI)', 'Dr. Ananya Sharma (Co-PI)', 'Rahul Kumar (PhD student)', 'Priya Singh (PhD student)']
};

const COLLECTIONS = {
  PROFILE: 'profile',
  RESEARCH_INTERESTS: 'researchInterests',
  TEACHING_INTERESTS: 'teachingInterests',
  PUBLICATIONS: 'publications',
  TALKS: 'talks',
  ACTIVITIES: 'activities',
  LAB: 'lab',
  AUTH: 'authentication'
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [researchInterests, setResearchInterests] = useState<ResearchInterest[]>(defaultResearchInterests);
  const [teachingInterests, setTeachingInterests] = useState<TeachingInterest[]>(defaultTeachingInterests);
  const [publications, setPublications] = useState<Publication[]>(defaultPublications);
  const [talks, setTalks] = useState<Talk[]>(defaultTalks);
  const [activities, setActivities] = useState<Activity[]>(defaultActivities);
  const [lab, setLab] = useState<Lab>(defaultLab);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      console.log("Auth state changed, user:", user?.email);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log('Initializing data from Firestore...');
        
        const checkAndInitialize = async () => {
          try {
            const profileDoc = await getDoc(doc(db, COLLECTIONS.PROFILE, 'main'));
            if (!profileDoc.exists()) {
              console.log('No profile found, initializing with defaults');
              await setDoc(doc(db, COLLECTIONS.PROFILE, 'main'), defaultProfile);
            }
            
            const researchDoc = await getDoc(doc(db, COLLECTIONS.RESEARCH_INTERESTS, 'list'));
            if (!researchDoc.exists()) {
              console.log('No research interests found, initializing with defaults');
              await setDoc(doc(db, COLLECTIONS.RESEARCH_INTERESTS, 'list'), { items: defaultResearchInterests });
            }
            
            const teachingDoc = await getDoc(doc(db, COLLECTIONS.TEACHING_INTERESTS, 'list'));
            if (!teachingDoc.exists()) {
              console.log('No teaching interests found, initializing with defaults');
              await setDoc(doc(db, COLLECTIONS.TEACHING_INTERESTS, 'list'), { items: defaultTeachingInterests });
            }
            
            const publicationsDoc = await getDoc(doc(db, COLLECTIONS.PUBLICATIONS, 'list'));
            if (!publicationsDoc.exists()) {
              console.log('No publications found, initializing with defaults');
              await setDoc(doc(db, COLLECTIONS.PUBLICATIONS, 'list'), { items: defaultPublications });
            }
            
            const talksDoc = await getDoc(doc(db, COLLECTIONS.TALKS, 'list'));
            if (!talksDoc.exists()) {
              console.log('No talks found, initializing with defaults');
              await setDoc(doc(db, COLLECTIONS.TALKS, 'list'), { items: defaultTalks });
            }
            
            const activitiesDoc = await getDoc(doc(db, COLLECTIONS.ACTIVITIES, 'list'));
            if (!activitiesDoc.exists()) {
              console.log('No activities found, initializing with defaults');
              await setDoc(doc(db, COLLECTIONS.ACTIVITIES, 'list'), { items: defaultActivities });
            }
            
            const labDoc = await getDoc(doc(db, COLLECTIONS.LAB, 'main'));
            if (!labDoc.exists()) {
              console.log('No lab data found, initializing with defaults');
              await setDoc(doc(db, COLLECTIONS.LAB, 'main'), defaultLab);
            }
            
            console.log('Default data initialization completed');
          } catch (error) {
            console.error('Error initializing default data:', error);
          }
        };
        
        await checkAndInitialize();
        
        const unsubscribeProfile = onSnapshot(doc(db, COLLECTIONS.PROFILE, 'main'), (snapshot) => {
          if (snapshot.exists()) {
            console.log('Profile data loaded from Firestore');
            setProfile(snapshot.data() as ProfileData);
          }
        }, (error) => {
          console.error('Error listening to profile:', error);
        });
        
        const unsubscribeResearch = onSnapshot(doc(db, COLLECTIONS.RESEARCH_INTERESTS, 'list'), (snapshot) => {
          if (snapshot.exists() && snapshot.data().items) {
            console.log('Research interests loaded from Firestore');
            setResearchInterests(snapshot.data().items);
          }
        }, (error) => {
          console.error('Error listening to research interests:', error);
        });
        
        const unsubscribeTeaching = onSnapshot(doc(db, COLLECTIONS.TEACHING_INTERESTS, 'list'), (snapshot) => {
          if (snapshot.exists() && snapshot.data().items) {
            console.log('Teaching interests loaded from Firestore');
            setTeachingInterests(snapshot.data().items);
          }
        }, (error) => {
          console.error('Error listening to teaching interests:', error);
        });
        
        const unsubscribePublications = onSnapshot(doc(db, COLLECTIONS.PUBLICATIONS, 'list'), (snapshot) => {
          if (snapshot.exists() && snapshot.data().items) {
            console.log('Publications loaded from Firestore');
            setPublications(snapshot.data().items);
          }
        }, (error) => {
          console.error('Error listening to publications:', error);
        });
        
        const unsubscribeTalks = onSnapshot(doc(db, COLLECTIONS.TALKS, 'list'), (snapshot) => {
          if (snapshot.exists() && snapshot.data().items) {
            console.log('Talks loaded from Firestore');
            setTalks(snapshot.data().items);
          }
        }, (error) => {
          console.error('Error listening to talks:', error);
        });
        
        const unsubscribeActivities = onSnapshot(doc(db, COLLECTIONS.ACTIVITIES, 'list'), (snapshot) => {
          if (snapshot.exists() && snapshot.data().items) {
            console.log('Activities loaded from Firestore');
            setActivities(snapshot.data().items);
          }
        }, (error) => {
          console.error('Error listening to activities:', error);
        });
        
        const unsubscribeLab = onSnapshot(doc(db, COLLECTIONS.LAB, 'main'), (snapshot) => {
          if (snapshot.exists()) {
            console.log('Lab data loaded from Firestore');
            setLab(snapshot.data() as Lab);
          }
        }, (error) => {
          console.error('Error listening to lab data:', error);
        });
        
        return () => {
          unsubscribeProfile();
          unsubscribeResearch();
          unsubscribeTeaching();
          unsubscribePublications();
          unsubscribeTalks();
          unsubscribeActivities();
          unsubscribeLab();
        };
      } catch (error) {
        console.error('Error setting up Firestore listeners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      return auth.currentUser !== null;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (data: Partial<ProfileData>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to update profile');
      }
      
      const updatedProfile = { ...profile, ...data };
      
      await updateDoc(doc(db, COLLECTIONS.PROFILE, 'main'), data);
      console.log('Profile updated in Firestore');
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    }
  };

  const addResearchInterest = async (interest: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to add research interests');
      }
      
      const newInterest = { id: Date.now().toString(), title: interest };
      const updatedInterests = [...researchInterests, newInterest];
      
      await setDoc(doc(db, COLLECTIONS.RESEARCH_INTERESTS, 'list'), {
        items: updatedInterests
      });
      console.log('Research interest added to Firestore');
      
      toast({
        title: "Research interest added",
        description: "Your research interest has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding research interest:', error);
      toast({
        title: "Addition failed",
        description: "There was an error adding your research interest.",
        variant: "destructive",
      });
    }
  };

  const removeResearchInterest = async (id: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to remove research interests');
      }
      
      const updatedInterests = researchInterests.filter(interest => interest.id !== id);
      
      await setDoc(doc(db, COLLECTIONS.RESEARCH_INTERESTS, 'list'), {
        items: updatedInterests
      });
      console.log('Research interest removed from Firestore');
      
      toast({
        title: "Research interest removed",
        description: "Your research interest has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing research interest:', error);
      toast({
        title: "Removal failed",
        description: "There was an error removing your research interest.",
        variant: "destructive",
      });
    }
  };

  const addTeachingInterest = async (interest: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to add teaching interests');
      }
      
      const newInterest = { id: Date.now().toString(), title: interest };
      const updatedInterests = [...teachingInterests, newInterest];
      
      await setDoc(doc(db, COLLECTIONS.TEACHING_INTERESTS, 'list'), {
        items: updatedInterests
      });
      console.log('Teaching interest added to Firestore');
      
      toast({
        title: "Teaching interest added",
        description: "Your teaching interest has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding teaching interest:', error);
      toast({
        title: "Addition failed",
        description: "There was an error adding your teaching interest.",
        variant: "destructive",
      });
    }
  };

  const removeTeachingInterest = async (id: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to remove teaching interests');
      }
      
      const updatedInterests = teachingInterests.filter(interest => interest.id !== id);
      
      await setDoc(doc(db, COLLECTIONS.TEACHING_INTERESTS, 'list'), {
        items: updatedInterests
      });
      console.log('Teaching interest removed from Firestore');
      
      toast({
        title: "Teaching interest removed",
        description: "Your teaching interest has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing teaching interest:', error);
      toast({
        title: "Removal failed",
        description: "There was an error removing your teaching interest.",
        variant: "destructive",
      });
    }
  };

  const addPublication = async (pub: Omit<Publication, 'id'>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to add publications');
      }
      
      const newPublication = { id: Date.now().toString(), ...pub };
      const updatedPublications = [...publications, newPublication];
      
      await setDoc(doc(db, COLLECTIONS.PUBLICATIONS, 'list'), {
        items: updatedPublications
      });
      console.log('Publication added to Firestore');
      
      toast({
        title: "Publication added",
        description: "Your publication has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding publication:', error);
      toast({
        title: "Addition failed",
        description: "There was an error adding your publication.",
        variant: "destructive",
      });
    }
  };

  const updatePublication = async (id: string, pub: Partial<Publication>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to update publications');
      }
      
      const updatedPublications = publications.map(item => 
        item.id === id ? { ...item, ...pub } : item
      );
      
      await setDoc(doc(db, COLLECTIONS.PUBLICATIONS, 'list'), {
        items: updatedPublications
      });
      console.log('Publication updated in Firestore');
      
      toast({
        title: "Publication updated",
        description: "Your publication has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating publication:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your publication.",
        variant: "destructive",
      });
    }
  };

  const removePublication = async (id: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to remove publications');
      }
      
      const updatedPublications = publications.filter(pub => pub.id !== id);
      
      await setDoc(doc(db, COLLECTIONS.PUBLICATIONS, 'list'), {
        items: updatedPublications
      });
      console.log('Publication removed from Firestore');
      
      toast({
        title: "Publication removed",
        description: "Your publication has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing publication:', error);
      toast({
        title: "Removal failed",
        description: "There was an error removing your publication.",
        variant: "destructive",
      });
    }
  };

  const addTalk = async (talk: Omit<Talk, 'id'>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to add talks');
      }
      
      const newTalk = { id: Date.now().toString(), ...talk };
      const updatedTalks = [...talks, newTalk];
      
      await setDoc(doc(db, COLLECTIONS.TALKS, 'list'), {
        items: updatedTalks
      });
      console.log('Talk added to Firestore');
      
      toast({
        title: "Talk added",
        description: "Your talk has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding talk:', error);
      toast({
        title: "Addition failed",
        description: "There was an error adding your talk.",
        variant: "destructive",
      });
    }
  };

  const updateTalk = async (id: string, talk: Partial<Talk>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to update talks');
      }
      
      const updatedTalks = talks.map(item => 
        item.id === id ? { ...item, ...talk } : item
      );
      
      await setDoc(doc(db, COLLECTIONS.TALKS, 'list'), {
        items: updatedTalks
      });
      console.log('Talk updated in Firestore');
      
      toast({
        title: "Talk updated",
        description: "Your talk has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating talk:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your talk.",
        variant: "destructive",
      });
    }
  };

  const removeTalk = async (id: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to remove talks');
      }
      
      const updatedTalks = talks.filter(talk => talk.id !== id);
      
      await setDoc(doc(db, COLLECTIONS.TALKS, 'list'), {
        items: updatedTalks
      });
      console.log('Talk removed from Firestore');
      
      toast({
        title: "Talk removed",
        description: "Your talk has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing talk:', error);
      toast({
        title: "Removal failed",
        description: "There was an error removing your talk.",
        variant: "destructive",
      });
    }
  };

  const addActivity = async (activity: Omit<Activity, 'id'>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to add activities');
      }
      
      const newActivity = { id: Date.now().toString(), ...activity };
      const updatedActivities = [...activities, newActivity];
      
      await setDoc(doc(db, COLLECTIONS.ACTIVITIES, 'list'), {
        items: updatedActivities
      });
      console.log('Activity added to Firestore');
      
      toast({
        title: "Activity added",
        description: "Your activity has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding activity:', error);
      toast({
        title: "Addition failed",
        description: "There was an error adding your activity.",
        variant: "destructive",
      });
    }
  };

  const updateActivity = async (id: string, activity: Partial<Activity>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to update activities');
      }
      
      const updatedActivities = activities.map(item => 
        item.id === id ? { ...item, ...activity } : item
      );
      
      await setDoc(doc(db, COLLECTIONS.ACTIVITIES, 'list'), {
        items: updatedActivities
      });
      console.log('Activity updated in Firestore');
      
      toast({
        title: "Activity updated",
        description: "Your activity has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating activity:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your activity.",
        variant: "destructive",
      });
    }
  };

  const removeActivity = async (id: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to remove activities');
      }
      
      const updatedActivities = activities.filter(activity => activity.id !== id);
      
      await setDoc(doc(db, COLLECTIONS.ACTIVITIES, 'list'), {
        items: updatedActivities
      });
      console.log('Activity removed from Firestore');
      
      toast({
        title: "Activity removed",
        description: "Your activity has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing activity:', error);
      toast({
        title: "Removal failed",
        description: "There was an error removing your activity.",
        variant: "destructive",
      });
    }
  };

  const updateLab = async (data: Partial<Lab>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to update lab information');
      }
      
      console.log('Updating lab with data:', data);
      
      await updateDoc(doc(db, COLLECTIONS.LAB, 'main'), data);
      console.log('Lab updated in Firestore');
      
      toast({
        title: "Lab updated",
        description: "Your lab information has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating lab:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your lab information.",
        variant: "destructive",
      });
    }
  };

  const addLabMember = async (member: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to add lab members');
      }
      
      console.log('Adding lab member:', member);
      
      if (lab.members.includes(member)) {
        toast({
          title: "Member already exists",
          description: "This lab member is already in the list.",
          variant: "destructive",
        });
        return;
      }
      
      const updatedMembers = [...lab.members, member];
      
      await updateDoc(doc(db, COLLECTIONS.LAB, 'main'), {
        members: updatedMembers
      });
      
      console.log('Lab member added to Firestore with updated members:', updatedMembers);
      
      setLab(prevLab => ({
        ...prevLab,
        members: updatedMembers
      }));
      
      toast({
        title: "Lab member added",
        description: "The lab member has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding lab member:', error);
      toast({
        title: "Addition failed",
        description: "There was an error adding the lab member.",
        variant: "destructive",
      });
    }
  };

  const removeLabMember = async (member: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to remove lab members');
      }
      
      console.log('Removing lab member:', member);
      
      const updatedMembers = lab.members.filter(m => m !== member);
      
      await updateDoc(doc(db, COLLECTIONS.LAB, 'main'), {
        members: updatedMembers
      });
      
      console.log('Lab member removed from Firestore');
      
      setLab(prevLab => ({
        ...prevLab,
        members: updatedMembers
      }));
      
      toast({
        title: "Lab member removed",
        description: "The lab member has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing lab member:', error);
      toast({
        title: "Removal failed",
        description: "There was an error removing the lab member.",
        variant: "destructive",
      });
    }
  };

  const addLabResearch = async (research: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to add research areas');
      }
      
      console.log('Adding research area:', research);
      
      if (lab.research.includes(research)) {
        toast({
          title: "Research area already exists",
          description: "This research area is already in the list.",
          variant: "destructive",
        });
        return;
      }
      
      const updatedResearch = [...lab.research, research];
      
      await updateDoc(doc(db, COLLECTIONS.LAB, 'main'), {
        research: updatedResearch
      });
      
      console.log('Research area added to Firestore with updated research:', updatedResearch);
      
      setLab(prevLab => ({
        ...prevLab,
        research: updatedResearch
      }));
      
      toast({
        title: "Research area added",
        description: "The research area has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding research area:', error);
      toast({
        title: "Addition failed",
        description: "There was an error adding the research area.",
        variant: "destructive",
      });
    }
  };

  const removeLabResearch = async (research: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to remove research areas');
      }
      
      console.log('Removing research area:', research);
      
      const updatedResearch = lab.research.filter(r => r !== research);
      
      await updateDoc(doc(db, COLLECTIONS.LAB, 'main'), {
        research: updatedResearch
      });
      
      console.log('Research area removed from Firestore');
      
      setLab(prevLab => ({
        ...prevLab,
        research: updatedResearch
      }));
      
      toast({
        title: "Research area removed",
        description: "The research area has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing research area:', error);
      toast({
        title: "Removal failed",
        description: "There was an error removing the research area.",
        variant: "destructive",
      });
    }
  };

  return (
    <DataContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        profile,
        researchInterests,
        teachingInterests,
        publications,
        talks,
        activities,
        lab,
        updateProfile,
        addResearchInterest,
        removeResearchInterest,
        addTeachingInterest,
        removeTeachingInterest,
        addPublication,
        updatePublication,
        removePublication,
        addTalk,
        updateTalk,
        removeTalk,
        addActivity,
        updateActivity,
        removeActivity,
        updateLab,
        addLabMember,
        removeLabMember,
        addLabResearch,
        removeLabResearch,
        isLoading
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
