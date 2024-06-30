import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import slidingButtonIcon from "../../public/images/sliding-button-icon.png";

const Index = () => {
  const [position, setPosition] = useState([51.505, -0.09]);

  return (
    <div className="h-screen w-screen relative">
      <MapContainer center={position} zoom={13} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
      <Button className="absolute top-4 left-4 flex items-center space-x-2">
        <img src={slidingButtonIcon} alt="Sliding Button" className="h-6 w-6" />
        <span>Slide</span>
      </Button>
    </div>
  );
};

export default Index;