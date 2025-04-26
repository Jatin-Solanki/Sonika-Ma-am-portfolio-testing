
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Edit2, X, Check } from 'lucide-react';

type Activity = {
  id: string;
  title: string;
  organization: string;
  description: string;
  startDate: string;
  endDate?: string;
};

type ActivityFormData = Omit<Activity, 'id'>;

const ActivitiesEditor: React.FC = () => {
  const { activities, addActivity, updateActivity, removeActivity } = useData();
  const { toast } = useToast();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const emptyActivity: ActivityFormData = {
    title: '',
    organization: '',
    description: '',
    startDate: '',
    endDate: ''
  };
  
  const [newActivity, setNewActivity] = useState<ActivityFormData>(emptyActivity);
  const [editActivity, setEditActivity] = useState<Activity | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newActivity.title || !newActivity.organization || !newActivity.description || !newActivity.startDate) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    addActivity(newActivity);
    setNewActivity(emptyActivity);
    setIsAdding(false);
    
    toast({
      title: "Activity added",
      description: "Your volunteer activity has been added successfully.",
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editActivity) return;
    
    if (!editActivity.title || !editActivity.organization || !editActivity.description || !editActivity.startDate) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const { id, ...data } = editActivity;
    updateActivity(id, data);
    setEditingId(null);
    setEditActivity(null);
    
    toast({
      title: "Activity updated",
      description: "Your volunteer activity has been updated successfully.",
    });
  };

  const handleRemove = (id: string, title: string) => {
    removeActivity(id);
    
    toast({
      title: "Activity removed",
      description: `"${title}" has been removed from your volunteer activities.`,
    });
  };

  const startEditing = (activity: Activity) => {
    setEditingId(activity.id);
    setEditActivity(activity);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditActivity(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Volunteer Activities</h1>
      
      {!isAdding ? (
        <div className="mb-6">
          <Button 
            onClick={() => setIsAdding(true)}
            className="bg-university-red hover:bg-red-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Activity
          </Button>
        </div>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Volunteer Activity</CardTitle>
            <CardDescription>
              Enter the details of your professional or community service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Title/Role <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Position or role title"
                    required
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="organization">Organization <span className="text-red-500">*</span></Label>
                  <Input
                    id="organization"
                    value={newActivity.organization}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, organization: e.target.value }))}
                    placeholder="Organization or committee name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date <span className="text-red-500">*</span></Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newActivity.startDate}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (leave blank if ongoing)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newActivity.endDate || ''}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="description"
                    value={newActivity.description}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of your role and responsibilities"
                    rows={3}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setNewActivity(emptyActivity);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-university-red hover:bg-red-700"
                >
                  Add Activity
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Your Volunteer Activities</CardTitle>
          <CardDescription>
            Manage your professional and community service activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div 
                  key={activity.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  {editingId === activity.id && editActivity ? (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`edit-title-${activity.id}`}>Title/Role</Label>
                          <Input
                            id={`edit-title-${activity.id}`}
                            value={editActivity.title}
                            onChange={(e) => setEditActivity(prev => prev ? { ...prev, title: e.target.value } : null)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`edit-organization-${activity.id}`}>Organization</Label>
                          <Input
                            id={`edit-organization-${activity.id}`}
                            value={editActivity.organization}
                            onChange={(e) => setEditActivity(prev => prev ? { ...prev, organization: e.target.value } : null)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`edit-startDate-${activity.id}`}>Start Date</Label>
                          <Input
                            id={`edit-startDate-${activity.id}`}
                            type="date"
                            value={editActivity.startDate}
                            onChange={(e) => setEditActivity(prev => prev ? { ...prev, startDate: e.target.value } : null)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`edit-endDate-${activity.id}`}>End Date</Label>
                          <Input
                            id={`edit-endDate-${activity.id}`}
                            type="date"
                            value={editActivity.endDate || ''}
                            onChange={(e) => setEditActivity(prev => prev ? { ...prev, endDate: e.target.value } : null)}
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`edit-description-${activity.id}`}>Description</Label>
                          <Textarea
                            id={`edit-description-${activity.id}`}
                            value={editActivity.description}
                            onChange={(e) => setEditActivity(prev => prev ? { ...prev, description: e.target.value } : null)}
                            rows={3}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelEditing}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-university-red hover:bg-red-700"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold">{activity.title}</h3>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(activity)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(activity.id, activity.title)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-1">{activity.organization}</p>
                      <p className="text-gray-600 mt-1">
                        {new Date(activity.startDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long'
                        })}
                        {activity.endDate 
                          ? ` - ${new Date(activity.endDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long'
                            })}`
                          : ' - Present'
                        }
                      </p>
                      <p className="text-gray-700 mt-2 text-sm">{activity.description}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>You haven't added any volunteer activities yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivitiesEditor;
