
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Edit2, X, Check } from 'lucide-react';

type Publication = {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  url?: string;
};

type PublicationFormData = Omit<Publication, 'id'>;

const PublicationsEditor: React.FC = () => {
  const { publications, addPublication, updatePublication, removePublication } = useData();
  const { toast } = useToast();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const emptyPublication: PublicationFormData = {
    title: '',
    authors: '',
    journal: '',
    year: '',
    url: ''
  };
  
  const [newPublication, setNewPublication] = useState<PublicationFormData>(emptyPublication);
  const [editPublication, setEditPublication] = useState<Publication | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPublication.title || !newPublication.authors || !newPublication.journal || !newPublication.year) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    addPublication(newPublication);
    setNewPublication(emptyPublication);
    setIsAdding(false);
    
    toast({
      title: "Publication added",
      description: "Your publication has been added successfully.",
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editPublication) return;
    
    if (!editPublication.title || !editPublication.authors || !editPublication.journal || !editPublication.year) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const { id, ...data } = editPublication;
    updatePublication(id, data);
    setEditingId(null);
    setEditPublication(null);
    
    toast({
      title: "Publication updated",
      description: "Your publication has been updated successfully.",
    });
  };

  const handleRemove = (id: string, title: string) => {
    removePublication(id);
    
    toast({
      title: "Publication removed",
      description: `"${title}" has been removed from your publications.`,
    });
  };

  const startEditing = (publication: Publication) => {
    setEditingId(publication.id);
    setEditPublication(publication);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditPublication(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Publications</h1>
      
      {!isAdding ? (
        <div className="mb-6">
          <Button 
            onClick={() => setIsAdding(true)}
            className="bg-university-red hover:bg-red-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Publication
          </Button>
        </div>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Publication</CardTitle>
            <CardDescription>
              Enter the details of your new publication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    value={newPublication.title}
                    onChange={(e) => setNewPublication(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Publication title"
                    required
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="authors">Authors <span className="text-red-500">*</span></Label>
                  <Input
                    id="authors"
                    value={newPublication.authors}
                    onChange={(e) => setNewPublication(prev => ({ ...prev, authors: e.target.value }))}
                    placeholder="Authors (e.g., Smith J., Johnson A.)"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="journal">Journal/Conference <span className="text-red-500">*</span></Label>
                  <Input
                    id="journal"
                    value={newPublication.journal}
                    onChange={(e) => setNewPublication(prev => ({ ...prev, journal: e.target.value }))}
                    placeholder="Journal or conference name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Year <span className="text-red-500">*</span></Label>
                  <Input
                    id="year"
                    value={newPublication.year}
                    onChange={(e) => setNewPublication(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="Publication year"
                    required
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="url">URL (optional)</Label>
                  <Input
                    id="url"
                    type="url"
                    value={newPublication.url}
                    onChange={(e) => setNewPublication(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://doi.org/example"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setNewPublication(emptyPublication);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-university-red hover:bg-red-700"
                >
                  Add Publication
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Your Publications</CardTitle>
          <CardDescription>
            Manage your research publications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {publications.length > 0 ? (
            <div className="space-y-4">
              {publications.map((publication) => (
                <div 
                  key={publication.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  {editingId === publication.id && editPublication ? (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`edit-title-${publication.id}`}>Title</Label>
                          <Input
                            id={`edit-title-${publication.id}`}
                            value={editPublication.title}
                            onChange={(e) => setEditPublication(prev => prev ? { ...prev, title: e.target.value } : null)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`edit-authors-${publication.id}`}>Authors</Label>
                          <Input
                            id={`edit-authors-${publication.id}`}
                            value={editPublication.authors}
                            onChange={(e) => setEditPublication(prev => prev ? { ...prev, authors: e.target.value } : null)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`edit-journal-${publication.id}`}>Journal/Conference</Label>
                          <Input
                            id={`edit-journal-${publication.id}`}
                            value={editPublication.journal}
                            onChange={(e) => setEditPublication(prev => prev ? { ...prev, journal: e.target.value } : null)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`edit-year-${publication.id}`}>Year</Label>
                          <Input
                            id={`edit-year-${publication.id}`}
                            value={editPublication.year}
                            onChange={(e) => setEditPublication(prev => prev ? { ...prev, year: e.target.value } : null)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`edit-url-${publication.id}`}>URL (optional)</Label>
                          <Input
                            id={`edit-url-${publication.id}`}
                            type="url"
                            value={editPublication.url || ''}
                            onChange={(e) => setEditPublication(prev => prev ? { ...prev, url: e.target.value } : null)}
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
                        <h3 className="text-lg font-semibold">{publication.title}</h3>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(publication)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(publication.id, publication.title)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
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
                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                          >
                            View Publication
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>You haven't added any publications yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicationsEditor;
