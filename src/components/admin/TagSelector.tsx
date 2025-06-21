
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tagIds: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onChange }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateInput, setShowCreateInput] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast.error('Failed to fetch tags');
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const createTag = async () => {
    if (!newTagName.trim()) return;

    setIsCreating(true);
    try {
      const slug = generateSlug(newTagName);
      const { data, error } = await supabase
        .from('tags')
        .insert({
          name: newTagName.trim(),
          slug
        })
        .select()
        .single();

      if (error) throw error;

      setTags(prev => [...prev, data]);
      onChange([...selectedTags, data.id]);
      setNewTagName('');
      setShowCreateInput(false);
      toast.success('Tag created successfully');
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error('Failed to create tag');
    } finally {
      setIsCreating(false);
    }
  };

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter(id => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  const removeTag = (tagId: string) => {
    onChange(selectedTags.filter(id => id !== tagId));
  };

  const selectedTagObjects = tags.filter(tag => selectedTags.includes(tag.id));
  const availableTags = tags.filter(tag => !selectedTags.includes(tag.id));

  return (
    <div className="space-y-4">
      {/* Selected Tags */}
      {selectedTagObjects.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Selected Tags</label>
          <div className="flex flex-wrap gap-2">
            {selectedTagObjects.map(tag => (
              <Badge key={tag.id} variant="default" className="flex items-center space-x-1">
                <span>{tag.name}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag.id)}
                  className="ml-1 hover:bg-primary-600 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Available Tags */}
      {availableTags.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Available Tags</label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {availableTags.map(tag => (
              <Badge
                key={tag.id}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => toggleTag(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Create New Tag */}
      <div className="space-y-2">
        {!showCreateInput ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCreateInput(true)}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Tag
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Input
              placeholder="Tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createTag()}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={createTag}
              disabled={!newTagName.trim() || isCreating}
              size="sm"
            >
              {isCreating ? 'Creating...' : 'Add'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCreateInput(false);
                setNewTagName('');
              }}
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagSelector;
