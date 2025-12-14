import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { destinations, campaigns, users } from '../lib/mockData';
import { Upload, Plus, Edit, Trash2, Calendar, Users as UsersIcon, Image, Video, FileText, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

export function CMSPortal({ onLogout }) {
  const [activeDestinations] = useState(destinations);
  const [activeCampaigns] = useState(campaigns);
  const [systemUsers] = useState(users);

  const handleUpload = () => {
    toast.success('File uploaded successfully');
  };

  const handleSave = () => {
    toast.success('Changes saved successfully');
  };

  const handleDelete = () => {
    toast.success('Item deleted successfully');
  };

  return (
    <div className="h-full overflow-auto bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1>Mpumalanga Tourism CMS</h1>
            <p className="text-muted-foreground">Manage Mpumalanga destinations, campaigns, and tourism content</p>
          </div>
          <div className="flex items-center gap-4">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New
            </Button>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="hidden sm:inline">Administrator</span>
              <Button variant="ghost" onClick={() => onLogout && onLogout()}>
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Destinations</CardDescription>
              <CardTitle>{activeDestinations.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Campaigns</CardDescription>
              <CardTitle>{activeCampaigns.filter(c => c.status === 'active').length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Users</CardDescription>
              <CardTitle>{systemUsers.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Media Files</CardDescription>
              <CardTitle>234</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="destinations" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="media">Media Library</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Destinations Tab */}
          <TabsContent value="destinations" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Destination Management</CardTitle>
                    <CardDescription>Manage tourism destinations and their content</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Destination
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New Destination</DialogTitle>
                        <DialogDescription>Create a new tourism destination</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Destination Name</Label>
                            <Input placeholder="e.g., Cape Town" />
                          </div>
                          <div className="space-y-2">
                            <Label>Country</Label>
                            <Input placeholder="e.g., South Africa" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <textarea 
                            placeholder="Describe the destination..." 
                            rows={4}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Category</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                              <option value="">Select category</option>
                              <option value="city">City & Culture</option>
                              <option value="nature">Nature & Wildlife</option>
                              <option value="beach">Beach & Coastal</option>
                              <option value="adventure">Adventure & Sports</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label>Average Cost/Day</Label>
                            <Input placeholder="e.g., $100-150" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Cover Image</Label>
                          <div className="border-2 border-dashed rounded-lg p-8 text-center">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-muted-foreground">Click to upload or drag and drop</p>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline">Cancel</Button>
                          <Button onClick={handleSave}>Create Destination</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeDestinations.map((dest) => (
                      <TableRow key={dest.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={dest.imageUrl}
                              alt={dest.name}
                              className="h-10 w-16 object-cover rounded"
                            />
                            <span>{dest.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{dest.country}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{dest.category}</Badge>
                        </TableCell>
                        <TableCell>{dest.views.toLocaleString()}</TableCell>
                        <TableCell>⭐ {dest.rating}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleDelete}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Campaign Management</CardTitle>
                    <CardDescription>Create and manage advertising campaigns</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Campaign
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Campaign</DialogTitle>
                        <DialogDescription>Set up a new advertising campaign</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Campaign Name</Label>
                          <Input placeholder="e.g., Summer Cape Town Promotion" />
                        </div>
                        <div className="space-y-2">
                          <Label>Advertiser</Label>
                          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                            <option value="">Select advertiser</option>
                            {systemUsers.filter(u => u.role === 'Advertiser').map((user) => (
                              <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input type="date" />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input type="date" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Target Destinations</Label>
                          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                            <option value="">Select destinations</option>
                            {activeDestinations.map((dest) => (
                              <option key={dest.id} value={dest.id}>{dest.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Budget (USD)</Label>
                          <Input type="number" placeholder="e.g., 15000" />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline">Cancel</Button>
                          <Button onClick={handleSave}>Create Campaign</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign Name</TableHead>
                      <TableHead>Advertiser</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell>{campaign.name}</TableCell>
                        <TableCell>{campaign.advertiser}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            campaign.status === 'active' ? 'default' :
                            campaign.status === 'scheduled' ? 'secondary' :
                            campaign.status === 'paused' ? 'outline' : 'secondary'
                          }>
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{campaign.impressions.toLocaleString()} impressions</div>
                            <div className="text-muted-foreground">{campaign.clicks.toLocaleString()} clicks</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Library Tab */}
          <TabsContent value="media" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Media Library</CardTitle>
                    <CardDescription>Upload and manage images, videos, and documents</CardDescription>
                  </div>
                  <Button onClick={handleUpload}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Files
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {activeDestinations.slice(0, 8).map((dest) => (
                    <Card key={dest.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img
                          src={dest.imageUrl}
                          alt={dest.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-3">
                        <p className="truncate">{dest.name}.jpg</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Image className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">2.4 MB</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Card className="overflow-hidden border-dashed">
                    <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                      <Video className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Video Files</p>
                      <p className="text-sm text-muted-foreground">12 files</p>
                    </CardContent>
                  </Card>
                  <Card className="overflow-hidden border-dashed">
                    <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                      <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Documents</p>
                      <p className="text-sm text-muted-foreground">8 files</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage system users and permissions</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>Create a new user account</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Full Name</Label>
                          <Input placeholder="e.g., John Smith" />
                        </div>
                        <div className="space-y-2">
                          <Label>Email Address</Label>
                          <Input type="email" placeholder="email@example.com" />
                        </div>
                        <div className="space-y-2">
                          <Label>Role</Label>
                          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                            <option value="">Select role</option>
                            <option value="admin">Administrator</option>
                            <option value="advertiser">Advertiser</option>
                          </select>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline">Cancel</Button>
                          <Button onClick={handleSave}>Create User</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <UsersIcon className="h-4 w-4" />
                            </div>
                            {user.name}
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'Administrator' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleDelete}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}