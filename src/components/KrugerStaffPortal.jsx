// src/components/KrugerStaffPortal.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Binoculars, Plus, Edit, Trash2, MapPin, Users, Eye, Activity, AlertCircle, CheckCircle, DoorOpen, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useAnimalSightings } from '../hooks/useAnimalSightings';

export function KrugerStaffPortal() {
  const { 
    sightings, 
    loading, 
    error, 
    createSighting, 
    updateSighting, 
    deleteSighting,
    refetch 
  } = useAnimalSightings();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentSighting, setCurrentSighting] = useState(null);

  // Form states
  const [species, setSpecies] = useState('');
  const [location, setLocation] = useState('');
  const [gate, setGate] = useState('');
  const [count, setCount] = useState('1');
  const [confidence, setConfidence] = useState('90');
  const [status, setStatus] = useState('recent');

  const speciesList = [
    'African Lion',
    'African Elephant',
    'Leopard',
    'Cape Buffalo',
    'White Rhinoceros',
    'Black Rhinoceros',
    'Cheetah',
    'Giraffe',
    'Wild Dogs',
    'Hippopotamus',
    'Hyena',
    'Zebra',
    'Wildebeest',
    'Kudu',
    'Impala'
  ];

  const locations = [
    'Skukuza Rest Camp Area',
    'Lower Sabie River',
    'Timbavati Area',
    'Satara Camp Vicinity',
    'Pretoriuskop Waterhole',
    'Open Plains near Orpen',
    'Northern Kruger',
    'Southern Kruger',
    'Central Kruger',
    'Crocodile Bridge Area',
    'Punda Maria Region',
    'Letaba River'
  ];

  const krugerGates = [
    "Paul Kruger Gate",
    "Numbi Gate",
    "Phabeni Gate",
    "Malelane Gate",
    "Crocodile Bridge",
    "Orpen Gate",
    "Phalaborwa Gate",
    "Punda Maria Gate"
  ];

  const resetForm = () => {
    setSpecies('');
    setLocation('');
    setGate('');
    setCount('1');
    setConfidence('90');
    setStatus('recent');
  };

  const handleAddSighting = async () => {
    if (!species || !location || !gate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createSighting({
        species,
        location,
        gate,
        count: parseInt(count),
        confidence: parseInt(confidence),
        status,
        image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400'
      });

      toast.success(`New sighting of ${species} near ${gate} added successfully`);
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to add sighting: ' + error.message);
    }
  };

  const handleEditSighting = (sighting) => {
    setCurrentSighting(sighting);
    setSpecies(sighting.species);
    setLocation(sighting.location);
    setGate(sighting.gate);
    setCount(sighting.count.toString());
    setConfidence(sighting.confidence.toString());
    setStatus(sighting.status);
    setShowEditDialog(true);
  };

  const handleUpdateSighting = async () => {
    if (!currentSighting) return;

    try {
      await updateSighting(currentSighting.id, {
        species,
        location,
        gate,
        count: parseInt(count),
        confidence: parseInt(confidence),
        status
      });

      toast.success('Sighting updated successfully');
      setShowEditDialog(false);
      setCurrentSighting(null);
      resetForm();
    } catch (error) {
      toast.error('Failed to update sighting: ' + error.message);
    }
  };

  const handleDeleteSighting = async (id) => {
    try {
      await deleteSighting(id);
      toast.success('Sighting removed from system');
    } catch (error) {
      toast.error('Failed to delete sighting: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'recent':
        return 'default';
      case 'active':
        return 'secondary';
      case 'historical':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const recentCount = sightings.filter(s => s.status === 'recent').length;
  const activeCount = sightings.filter(s => s.status === 'active').length;
  const bigFiveCount = sightings.filter(s => 
    ['African Lion', 'African Elephant', 'Leopard', 'Cape Buffalo', 'White Rhinoceros'].includes(s.species)
  ).length;

  if (loading) {
    return (
      <div className="h-full overflow-auto bg-muted/30 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading animal sightings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full overflow-auto bg-muted/30 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-destructive">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={refetch}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-muted/30">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl">Kruger Staff Portal</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage wildlife sightings and tracking data
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={refetch}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Report Sighting
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Report New Animal Sighting</DialogTitle>
                  <DialogDescription>
                    Add a new wildlife sighting to the tracking system
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="species">Species *</Label>
                    <select 
                      id="species"
                      value={species} 
                      onChange={(e) => setSpecies(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select species</option>
                      {speciesList.map((sp) => (
                        <option key={sp} value={sp}>{sp}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <select 
                      id="location"
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select location</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gate">Gate *</Label>
                    <select 
                      id="gate"
                      value={gate} 
                      onChange={(e) => setGate(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select nearest gate</option>
                      {krugerGates.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="count">Animal Count</Label>
                      <Input
                        id="count"
                        type="number"
                        min="1"
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confidence">Confidence %</Label>
                      <Input
                        id="confidence"
                        type="number"
                        min="0"
                        max="100"
                        value={confidence}
                        onChange={(e) => setConfidence(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Sighting Status</Label>
                    <select 
                      id="status"
                      value={status} 
                      onChange={(e) => setStatus(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="recent">Recent (Last Hour)</option>
                      <option value="active">Active (Last 6 Hours)</option>
                      <option value="historical">Historical (Older)</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => {
                      setShowAddDialog(false);
                      resetForm();
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddSighting}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Sighting
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Binoculars className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Sightings</p>
                  <p className="text-xl sm:text-2xl">{sightings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Recent</p>
                  <p className="text-xl sm:text-2xl">{recentCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active</p>
                  <p className="text-xl sm:text-2xl">{activeCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Big Five</p>
                  <p className="text-xl sm:text-2xl">{bigFiveCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sightings Management */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm py-2">
              All ({sightings.length})
            </TabsTrigger>
            <TabsTrigger value="recent" className="text-xs sm:text-sm py-2">
              Recent ({recentCount})
            </TabsTrigger>
            <TabsTrigger value="bigfive" className="text-xs sm:text-sm py-2">
              Big Five ({bigFiveCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">All Sightings</CardTitle>
                <CardDescription className="text-sm">
                  Manage all wildlife sightings in the system
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Species</TableHead>
                        <TableHead className="text-xs sm:text-sm">Location</TableHead>
                        <TableHead className="text-xs sm:text-sm">Gate</TableHead>
                        <TableHead className="text-xs sm:text-sm">Time</TableHead>
                        <TableHead className="text-xs sm:text-sm">Count</TableHead>
                        <TableHead className="text-xs sm:text-sm">Confidence</TableHead>
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sightings.map((sighting) => (
                        <TableRow key={sighting.id}>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                              <Binoculars className="h-4 w-4 text-muted-foreground" />
                              <span>{sighting.species}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="max-w-[150px] truncate">{sighting.location}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex items-center gap-1">
                              <DoorOpen className="h-3 w-3 text-muted-foreground" />
                              <span className="max-w-[120px] truncate">{sighting.gate}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">{sighting.time}</TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              {sighting.count}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3 text-muted-foreground" />
                              {sighting.confidence}%
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(sighting.status)} className="text-xs capitalize">
                              {sighting.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 sm:gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditSighting(sighting)}
                                className="h-8 px-2"
                              >
                                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSighting(sighting.id)}
                                className="h-8 px-2 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Recent Sightings</CardTitle>
                <CardDescription className="text-sm">
                  Sightings from the last hour
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Species</TableHead>
                        <TableHead className="text-xs sm:text-sm">Location</TableHead>
                        <TableHead className="text-xs sm:text-sm">Gate</TableHead>
                        <TableHead className="text-xs sm:text-sm">Time</TableHead>
                        <TableHead className="text-xs sm:text-sm">Count</TableHead>
                        <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sightings.filter(s => s.status === 'recent').map((sighting) => (
                        <TableRow key={sighting.id}>
                          <TableCell className="text-xs sm:text-sm">{sighting.species}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{sighting.location}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{sighting.gate}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{sighting.time}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{sighting.count}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 sm:gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditSighting(sighting)}
                                className="h-8 px-2"
                              >
                                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSighting(sighting.id)}
                                className="h-8 px-2 text-destructive"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bigfive" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Big Five Sightings</CardTitle>
                <CardDescription className="text-sm">
                  Lion, Elephant, Leopard, Buffalo, and Rhinoceros
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Species</TableHead>
                        <TableHead className="text-xs sm:text-sm">Location</TableHead>
                        <TableHead className="text-xs sm:text-sm">Gate</TableHead>
                        <TableHead className="text-xs sm:text-sm">Time</TableHead>
                        <TableHead className="text-xs sm:text-sm">Count</TableHead>
                        <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sightings
                        .filter(s => ['African Lion', 'African Elephant', 'Leopard', 'Cape Buffalo', 'White Rhinoceros'].includes(s.species))
                        .map((sighting) => (
                          <TableRow key={sighting.id}>
                            <TableCell className="text-xs sm:text-sm">{sighting.species}</TableCell>
                            <TableCell className="text-xs sm:text-sm">{sighting.location}</TableCell>
                            <TableCell className="text-xs sm:text-sm">{sighting.gate}</TableCell>
                            <TableCell className="text-xs sm:text-sm">{sighting.time}</TableCell>
                            <TableCell className="text-xs sm:text-sm">{sighting.count}</TableCell>
                            <TableCell>
                              <div className="flex gap-1 sm:gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditSighting(sighting)}
                                  className="h-8 px-2"
                                >
                                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteSighting(sighting.id)}
                                  className="h-8 px-2 text-destructive"
                                >
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Sighting</DialogTitle>
              <DialogDescription>
                Update the animal sighting information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-species">Species</Label>
                <select 
                  id="edit-species"
                  value={species} 
                  onChange={(e) => setSpecies(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {speciesList.map((sp) => (
                    <option key={sp} value={sp}>{sp}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <select 
                  id="edit-location"
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-gate">Gate</Label>
                <select 
                  id="edit-gate"
                  value={gate} 
                  onChange={(e) => setGate(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {krugerGates.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-count">Count</Label>
                  <Input
                    id="edit-count"
                    type="number"
                    min="1"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-confidence">Confidence %</Label>
                  <Input
                    id="edit-confidence"
                    type="number"
                    min="0"
                    max="100"
                    value={confidence}
                    onChange={(e) => setConfidence(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <select 
                  id="edit-status"
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="recent">Recent</option>
                  <option value="active">Active</option>
                  <option value="historical">Historical</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => {
                  setShowEditDialog(false);
                  setCurrentSighting(null);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateSighting}>
                  Update Sighting
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}