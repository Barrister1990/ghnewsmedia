
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Clock, 
  Send, 
  Calendar, 
  Globe, 
  Users, 
  Share2,
  Bell,
  Eye
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PublishingWorkflowProps {
  status: 'draft' | 'published' | 'archived';
  onStatusChange: (status: 'draft' | 'published' | 'archived') => void;
  onSchedulePublish: (date: string) => void;
  seoScore: number;
  contentScore: number;
}

const PublishingWorkflow: React.FC<PublishingWorkflowProps> = ({
  status,
  onStatusChange,
  onSchedulePublish,
  seoScore,
  contentScore
}) => {
  const [scheduledDate, setScheduledDate] = useState('');
  const [showScheduler, setShowScheduler] = useState(false);

  const getStatusColor = (currentStatus: string) => {
    switch (currentStatus) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canPublish = seoScore >= 60 && contentScore >= 60;

  const publishingSteps = [
    {
      id: 'content',
      name: 'Content Quality',
      completed: contentScore >= 60,
      score: contentScore,
      description: 'Content analysis and quality check'
    },
    {
      id: 'seo',
      name: 'SEO Optimization',
      completed: seoScore >= 60,
      score: seoScore,
      description: 'SEO meta tags and optimization'
    },
    {
      id: 'media',
      name: 'Media Assets',
      completed: true, // This would check for featured image
      score: 100,
      description: 'Featured image and media elements'
    },
    {
      id: 'review',
      name: 'Editorial Review',
      completed: status !== 'draft',
      score: status !== 'draft' ? 100 : 0,
      description: 'Editorial review and approval'
    }
  ];

  const handlePublish = () => {
    if (canPublish) {
      onStatusChange('published');
    }
  };

  const handleSchedule = () => {
    if (scheduledDate && canPublish) {
      onSchedulePublish(scheduledDate);
      setShowScheduler(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Publication Status</span>
            <Badge className={getStatusColor(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            {status === 'draft' && (
              <>
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-gray-600">Article is in draft mode</span>
              </>
            )}
            {status === 'published' && (
              <>
                <Globe className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Article is live and public</span>
              </>
            )}
            {status === 'archived' && (
              <>
                <CheckCircle className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Article is archived</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Publishing Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Publishing Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {publishingSteps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.name}
                    </span>
                    <span className={`text-sm font-medium ${
                      step.score >= 80 ? 'text-green-600' : 
                      step.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {step.score}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Publishing Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Publishing Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'draft' && (
            <>
              <Button 
                onClick={handlePublish}
                disabled={!canPublish}
                className="w-full"
                size="lg"
              >
                <Send className="w-4 h-4 mr-2" />
                Publish Now
              </Button>
              
              {!canPublish && (
                <p className="text-sm text-amber-600 text-center">
                  Complete the publishing checklist to enable publishing
                </p>
              )}

              <Separator />

              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => setShowScheduler(!showScheduler)}
                  className="w-full"
                  disabled={!canPublish}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Publication
                </Button>

                {showScheduler && (
                  <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                    <Label htmlFor="scheduleDate">Publication Date & Time</Label>
                    <Input
                      id="scheduleDate"
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    <div className="flex space-x-2">
                      <Button onClick={handleSchedule} size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowScheduler(false)}
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {status === 'published' && (
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => onStatusChange('draft')}
                className="w-full"
              >
                <Clock className="w-4 h-4 mr-2" />
                Move to Draft
              </Button>
              
              <Button
                variant="outline"
                onClick={() => onStatusChange('archived')}
                className="w-full"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Archive Article
              </Button>
            </div>
          )}

          {status === 'archived' && (
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => onStatusChange('draft')}
                className="w-full"
              >
                <Clock className="w-4 h-4 mr-2" />
                Restore to Draft
              </Button>
              
              <Button
                onClick={() => onStatusChange('published')}
                className="w-full"
                disabled={!canPublish}
              >
                <Globe className="w-4 h-4 mr-2" />
                Republish
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Post-Publication */}
      {status === 'published' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Post-Publication</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full">
              <Eye className="w-4 h-4 mr-2" />
              View Live Article
            </Button>
            
            <Button variant="outline" className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Share on Social Media
            </Button>
            
            <Button variant="outline" className="w-full">
              <Bell className="w-4 h-4 mr-2" />
              Send to Newsletter
            </Button>
            
            <Button variant="outline" className="w-full">
              <Users className="w-4 h-4 mr-2" />
              Notify Subscribers
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PublishingWorkflow;
