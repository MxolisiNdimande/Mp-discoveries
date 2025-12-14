// components/AccommodationView.jsx
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { accommodations } from '../lib/accommodationData';
import { Star, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { toast } from 'sonner';

export function AccommodationView({ destinationIds, limit }) {
  let filtered = accommodations;

  if (destinationIds && destinationIds.length > 0) {
    filtered = accommodations.filter(acc =>
      acc.nearDestination.some(dest => destinationIds.includes(dest))
    );
  }

  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  const handleBooking = (name) => {
    toast.success(`Booking inquiry for ${name} initiated`);
  };

  const handleContact = (email) => {
    toast.success(`Opening email to ${email}`);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'hotel':
      case 'resort':
        return '🏨';
      case 'lodge':
        return '🏡';
      case 'guesthouse':
      case 'bnb':
        return '🏠';
      case 'camping':
        return '⛺';
      default:
        return '🏨';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {filtered.map((acc) => (
          <Card key={acc.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <img
                src={acc.imageUrl}
                alt={acc.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <Badge className="bg-white/90 text-foreground text-xs sm:text-sm">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {acc.rating}
                </Badge>
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  {getTypeIcon(acc.type)} {acc.type}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl mb-1">{acc.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    {acc.location}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{acc.description}</p>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {acc.amenities.slice(0, 4).map((amenity, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {acc.amenities.length > 4 && (
                    <Badge variant="outline" className="text-xs">+{acc.amenities.length - 4} more</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="text-base sm:text-lg">{acc.pricePerNight}</p>
                    <p className="text-xs text-muted-foreground">per night</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleContact(acc.contact.email)}
                      className="text-xs sm:text-sm"
                    >
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Contact</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleBooking(acc.name)}
                      className="text-xs sm:text-sm"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span className="truncate">{acc.contact.phone}</span>
                  </div>
                  {acc.contact.website && (
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      <span className="truncate">{acc.contact.website}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="p-8 sm:p-12 text-center">
            <h3 className="text-lg sm:text-xl mb-2">No Accommodation Found</h3>
            <p className="text-sm text-muted-foreground">
              Try exploring different destinations or check back later for more options.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}