"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { CITY_COORDS, type City } from "@/lib/types/database";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LocationPickerProps {
  city: City;
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
}

function MapFlyTo({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([latitude, longitude], Math.max(map.getZoom(), 15), {
      duration: 0.8,
    });
  }, [latitude, longitude, map]);

  return null;
}

function DraggableMarker({
  position,
  onChange,
}: {
  position: [number, number];
  onChange: (lat: number, lng: number) => void;
}) {
  const [pos, setPos] = useState(position);

  useEffect(() => {
    setPos(position);
  }, [position]);

  useMapEvents({
    click(e) {
      setPos([e.latlng.lat, e.latlng.lng]);
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      position={pos}
      draggable
      icon={defaultIcon}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const { lat, lng } = marker.getLatLng();
          setPos([lat, lng]);
          onChange(lat, lng);
        },
      }}
    />
  );
}

export function LocationPicker({
  city,
  latitude,
  longitude,
  onChange,
}: LocationPickerProps) {
  const center = CITY_COORDS[city];
  const lat = latitude || center.lat;
  const lng = longitude || center.lng;

  return (
    <div className="h-64 w-full overflow-hidden rounded-lg border">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFlyTo latitude={lat} longitude={lng} />
        <DraggableMarker position={[lat, lng]} onChange={onChange} />
      </MapContainer>
    </div>
  );
}
