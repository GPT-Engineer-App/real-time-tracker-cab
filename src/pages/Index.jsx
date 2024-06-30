import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { MoreVertical } from "lucide-react";
import { Header } from "@/components/ui/header";

const Index = () => {
  const [position, setPosition] = useState([20.5937, 78.9629]); // Default to India's coordinates
  const [country, setCountry] = useState("");
  const [pins, setPins] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);

          // Fetch country based on latitude and longitude
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            setCountry(data.countryName);
            // Check if the coordinates are within India
            if (data.countryName === "India") {
              // Handle any specific edge cases for India here
              console.log("User is in India");
            } else {
              console.log("User is not in India");
            }
          } catch (error) {
            console.error("Error fetching country data:", error);
          }
        },
        (error) => {
          console.error("Error getting user's location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPins((prevPins) => [...prevPins, [lat, lng]]);
      },
    });
    return null;
  };

  return (
    <>
      <Header>
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="flex items-center space-x-2">
              <MoreVertical className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="p-4">
              <h2 className="text-lg font-semibold">Menu</h2>
              <ul className="mt-2 space-y-2">
                <li><a href="#">Option 1</a></li>
                <li><a href="#">Option 2</a></li>
                <li><a href="#">Option 3</a></li>
              </ul>
            </div>
          </DrawerContent>
        </Drawer>
      </Header>
      <div className="h-screen w-screen pt-16 relative"> {/* Added pt-16 for spacing */}
        <MapContainer center={position} zoom={13} className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>
              You are here. <br /> Country: {country}
            </Popup>
          </Marker>
          {pins.map((pin, index) => (
            <Marker key={index} position={pin}>
              <Popup>
                Pinned Location: {pin[0].toFixed(4)}, {pin[1].toFixed(4)}
              </Popup>
            </Marker>
          ))}
          <MapClickHandler />
        </MapContainer>
      </div>
    </>
  );
};

export default Index;