// components/AnimalTracking.jsx
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { animalSightings } from '../lib/mockData';
import { MapPin, Clock, Users, Activity, Eye, DoorOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function AnimalTracking({ compact = false }) {
  const recentSightings = animalSightings.filter(s => s.status === 'recent');
  const activeSightings = animalSightings.filter(s => s.status === 'active');

  // Derived stats
  const bigFiveSpecies = ['African Lion', 'African Elephant', 'Leopard', 'Cape Buffalo', 'White Rhinoceros'];
  const bigFiveSightings = animalSightings.filter(s => bigFiveSpecies.includes(s.species));
  const uniqueBigFiveCount = new Set(bigFiveSightings.map(s => s.species)).size;
  const avgConfidence = animalSightings.length > 0
    ? Math.round(animalSightings.reduce((sum, s) => sum + (s.confidence || 0), 0) / animalSightings.length)
    : 0;

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-yellow-600';
    return 'text-orange-600';
  };

  if (compact) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="mb-1">Live Animal Tracking</h4>
              <p className="text-sm text-muted-foreground">{activeSightings.length} active • {recentSightings.length} recent</p>
            </div>
            <Badge className="bg-green-600">Live</Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="mb-1">Live Animal Tracking</h3>
          <p className="text-sm text-muted-foreground">
            Real-time wildlife sightings powered by AI detection and ranger reports
          </p>
        </div>
        <Badge className="bg-green-600">
          <Activity className="h-3 w-3 mr-1" />
          Live
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-1">{activeSightings.length}</div>
            <p className="text-sm text-muted-foreground">Active Sightings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-1">{recentSightings.length}</div>
            <p className="text-sm text-muted-foreground">Last Hour</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-1">{uniqueBigFiveCount}</div>
            <p className="text-sm text-muted-foreground">Big Five Spotted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-1">{avgConfidence}%</div>
            <p className="text-sm text-muted-foreground">Avg. Confidence</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Sightings</TabsTrigger>
          <TabsTrigger value="recent">Recent (Last Hour)</TabsTrigger>
          <TabsTrigger value="bigfive">Big Five</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {animalSightings.length > 0 ? (
            animalSightings.map((sighting) => (
            <Card key={sighting.id} className="overflow-hidden">
              <div className="flex">
                <div className="w-32 h-32 flex-shrink-0">
                  <img
                    src={sighting.image}
                    alt={sighting.species}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="mb-1">{sighting.species}</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {sighting.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DoorOpen className="h-3 w-3" />
                          {sighting.gate}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        sighting.status === 'recent' ? 'default' :
                        sighting.status === 'active' ? 'secondary' : 'outline'
                      }
                    >
                      {sighting.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{sighting.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{sighting.count} {sighting.count === 1 ? 'animal' : 'animals'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className={getConfidenceColor(sighting.confidence)}>
                        {sighting.confidence}% confidence
                      </span>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No sightings available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-3 mt-4">
          {recentSightings.length > 0 ? (
            recentSightings.map((sighting) => (
              <Card key={sighting.id} className="overflow-hidden">
                <div className="flex">
                  <div className="w-32 h-32 flex-shrink-0">
                    <img
                      src={sighting.image}
                      alt={sighting.species}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="mb-1">{sighting.species}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {sighting.location}
                        </div>
                      </div>
                      <Badge>{sighting.status}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{sighting.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{sighting.count} {sighting.count === 1 ? 'animal' : 'animals'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className={getConfidenceColor(sighting.confidence)}>
                          {sighting.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No recent sightings in the last hour</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="bigfive" className="space-y-3 mt-4">
          {bigFiveSightings.length > 0 ? (
            bigFiveSightings.map((sighting) => (
              <Card key={sighting.id} className="overflow-hidden">
                <div className="flex">
                  <div className="w-32 h-32 flex-shrink-0">
                    <img
                      src={sighting.image}
                      alt={sighting.species}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="mb-1">{sighting.species}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {sighting.location}
                        </div>
                      </div>
                      <Badge 
                        variant={
                          sighting.status === 'recent' ? 'default' :
                          sighting.status === 'active' ? 'secondary' : 'outline'
                        }
                      >
                        {sighting.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{sighting.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{sighting.count} {sighting.count === 1 ? 'animal' : 'animals'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className={getConfidenceColor(sighting.confidence)}>
                          {sighting.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No Big Five sightings available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-sm">About Animal Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Our AI-powered tracking system uses camera feeds, ranger reports, and GPS collars to provide real-time
            wildlife location data. This helps visitors maximize their safari experience by knowing where animals
            have been recently spotted. All data is updated every 15 minutes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}