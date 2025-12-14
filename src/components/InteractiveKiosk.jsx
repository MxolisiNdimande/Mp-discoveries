import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { destinations } from '../lib/mockData';
import { MapPin, Star, Calendar, ArrowLeft, Mail, QrCode, Route, Heart, Share2, X, Binoculars, Hotel, DollarSign, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AnimalTracking } from './AnimalTracking';
import { AccommodationView } from './AccommodationView';
import { LanguageSelector } from './LanguageSelector';

export function InteractiveKiosk({ language = 'en', onLanguageChange }) {
  const [view, setView] = useState('home');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState([]);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [email, setEmail] = useState('');

  const destination = destinations.find(d => d.id === selectedDestination);

  const handleDestinationClick = (id) => {
    setSelectedDestination(id);
    setView('destination');
  };

  const handleBack = () => {
    if (view === 'destination') {
      setView('home');
      setSelectedDestination(null);
    } else if (view === 'route') {
      setView('home');
      setSelectedRoute([]);
    }
  };

  const handleAddToRoute = () => {
    if (selectedDestination && !selectedRoute.includes(selectedDestination)) {
      setSelectedRoute([...selectedRoute, selectedDestination]);
      toast.success('Added to your route');
    }
  };

  const handleSendEmail = () => {
    if (email) {
      toast.success('Route sent to ' + email);
      setShowEmailDialog(false);
      setEmail('');
    }
  };

  const handleGenerateQR = () => {
    toast.success('QR code generated successfully');
    setShowQRDialog(true);
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-10">
        <div className="px-4 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {view !== 'home' ? (
            <Button variant="ghost" onClick={handleBack} size="sm" className="w-fit">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg truncate">Gateway Discoveries</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Discover Mpumalanga</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2 flex-wrap">
            {onLanguageChange && (
              <LanguageSelector 
                currentLanguage={language}
                onLanguageChange={onLanguageChange}
                size="sm"
              />
            )}
            {selectedRoute.length > 0 && (
              <Button onClick={() => setView('route')} variant="outline" size="sm" className="text-xs sm:text-sm">
                <Route className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">My Route</span> ({selectedRoute.length})
              </Button>
            )}
            <div className="text-xs sm:text-sm text-muted-foreground">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 sm:pt-24 pb-4 sm:pb-8 px-4 sm:px-8 h-full overflow-auto">
        {view === 'home' && (
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl mb-2">Discover Mpumalanga</h1>
              <p className="text-sm sm:text-base text-muted-foreground px-4">
                Touch any destination to explore activities, accommodation, and travel information
              </p>
            </div>

            {/* Destination Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {destinations.map((dest) => (
                <Card 
                  key={dest.id}
                  className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => handleDestinationClick(dest.id)}
                >
                  <div className="aspect-video relative">
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-foreground">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {dest.rating}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-1">{dest.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{dest.country}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{dest.category}</Badge>
                      <div className="text-sm text-muted-foreground">
                        {dest.avgCost}
                      </div>
                    </div>
                    {dest.hasAnimalTracking && (
                      <div className="mt-2 pt-2 border-t">
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <Binoculars className="h-3 w-3" />
                          Live Animal Tracking
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {view === 'destination' && destination && (
          <div className="max-w-5xl mx-auto">
            <Card className="overflow-hidden">
              {/* Hero Image */}
              <div className="h-80 relative">
                <img
                  src={destination.imageUrl}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h1 className="mb-2">{destination.name}</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {destination.country}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {destination.rating} Rating
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-4 sm:p-8">
                <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
                  <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                    <TabsList className={`grid w-full ${destination.hasAnimalTracking ? 'grid-cols-5' : 'grid-cols-4'} min-w-max`}>
                      <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-4">Overview</TabsTrigger>
                      <TabsTrigger value="activities" className="text-xs sm:text-sm px-2 sm:px-4">Activities</TabsTrigger>
                      <TabsTrigger value="details" className="text-xs sm:text-sm px-2 sm:px-4">Travel Info</TabsTrigger>
                      <TabsTrigger value="accommodation" className="text-xs sm:text-sm px-2 sm:px-4">
                        <Hotel className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Accommodation</span>
                        <span className="sm:hidden">Stay</span>
                      </TabsTrigger>
                      {destination.hasAnimalTracking && (
                        <TabsTrigger value="tracking" className="text-xs sm:text-sm px-2 sm:px-4">
                          <Binoculars className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Live Tracking</span>
                          <span className="sm:hidden">Track</span>
                        </TabsTrigger>
                      )}
                    </TabsList>
                  </div>

                  <TabsContent value="overview" className="space-y-6">
                    <div>
                      <h3 className="mb-3">About this destination</h3>
                      <p className="text-muted-foreground">{destination.description}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Calendar className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-1">Best Time</p>
                          <p>{destination.bestTime}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <DollarSign className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-1">Avg. Cost</p>
                          <p>{destination.avgCost}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Badge className="mb-2">{destination.category}</Badge>
                          <p className="text-sm text-muted-foreground">Category</p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="activities">
                    <div>
                      <h3 className="mb-4">Popular Activities</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {destination.activities.map((activity, idx) => (
                          <Card key={idx}>
                            <CardContent className="p-4 flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Info className="h-5 w-5 text-blue-600" />
                              </div>
                              <span>{activity}</span>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="details">
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="mb-2">Climate & Weather</h4>
                          <p className="text-muted-foreground">
                            Best visited during {destination.bestTime} when the weather is most favorable for outdoor activities.
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="mb-2">Budget Planning</h4>
                          <p className="text-muted-foreground">
                            Average daily cost including accommodation, meals, and activities: {destination.avgCost}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="mb-2">Getting There</h4>
                          <p className="text-muted-foreground">
                            Accessible by international flights with excellent transport infrastructure and tour options.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="accommodation">
                    <div>
                      <h3 className="mb-4 text-lg sm:text-xl">Nearby Accommodation</h3>
                      <AccommodationView destinationIds={[destination.id]} />
                    </div>
                  </TabsContent>

                  {destination.hasAnimalTracking && (
                    <TabsContent value="tracking">
                      <AnimalTracking />
                    </TabsContent>
                  )}
                </Tabs>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-8">
                  <Button className="flex-1" onClick={handleAddToRoute} size="sm">
                    <Route className="mr-2 h-4 w-4" />
                    Add to Route
                  </Button>
                  <Button variant="outline" onClick={() => setShowEmailDialog(true)} size="sm" className="flex-1 sm:flex-initial">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Info
                  </Button>
                  <Button variant="outline" onClick={handleGenerateQR} size="sm" className="flex-1 sm:flex-initial">
                    <QrCode className="mr-2 h-4 w-4" />
                    Get QR Code
                  </Button>
                  <div className="hidden sm:flex gap-2">
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {view === 'route' && (
          <div className="max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <h2 className="mb-6">Your Travel Route</h2>
                
                {selectedRoute.length === 0 ? (
                  <div className="text-center py-12">
                    <Route className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="mb-2">No destinations added yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start exploring and add destinations to create your perfect journey
                    </p>
                    <Button onClick={() => setView('home')}>
                      Explore Destinations
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-8">
                      {selectedRoute.map((destId, idx) => {
                        const dest = destinations.find(d => d.id === destId);
                        if (!dest) return null;
                        
                        return (
                          <Card key={destId}>
                            <CardContent className="p-4 flex items-center gap-4">
                              <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                {idx + 1}
                              </div>
                              <img
                                src={dest.imageUrl}
                                alt={dest.name}
                                className="h-16 w-24 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4>{dest.name}</h4>
                                <p className="text-sm text-muted-foreground">{dest.country} • {dest.category}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedRoute(selectedRoute.filter(id => id !== destId))}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1" onClick={() => setShowEmailDialog(true)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email My Route
                      </Button>
                      <Button variant="outline" onClick={handleGenerateQR}>
                        <QrCode className="mr-2 h-4 w-4" />
                        Generate QR Code
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send to Email</DialogTitle>
            <DialogDescription>
              We'll send you detailed information about {view === 'route' ? 'your route' : 'this destination'} including maps, booking links, and travel tips.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendEmail}>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogDescription>
              Scan this code with your phone to access this information on the go
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="bg-white p-8 rounded-lg border-4 border-foreground mx-auto w-fit">
              <div className="w-48 h-48 bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center">
                <QrCode className="h-32 w-32 text-white" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}