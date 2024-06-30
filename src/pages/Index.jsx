import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import slidingButtonIcon from "../../public/images/sliding-button-icon.png";

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
    <div className="h-screen w-screen relative">
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
      <Button className="absolute top-4 left-4 flex items-center space-x-2">
        <img src={slidingButtonIcon} alt="Sliding Button" className="h-6 w-6" />
        <span>Slide</span>
      </Button>
    </div>
  );
};

export default Index;