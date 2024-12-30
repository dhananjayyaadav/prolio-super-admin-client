import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

const INDIA_BOUNDS = [
  [6.4626999, 68.1097],
  [35.513327, 97.39535889],
];
const INDIA_CENTER = [20.5937, 78.9629];

const MemoisedTileLayer = React.memo(() => (
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  />
));

const UserGeolocationMap = () => {
  const [visitorData, setVisitorData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const apiURL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");

  const fetchVisitorData = useCallback(async () => {
    try {
      const response = await axios.get(`${apiURL}/visitor/getVisitor-company`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success) {
        setVisitorData(response.data.data);
      } else {
        throw new Error("Failed to fetch visitor data");
      }
    } catch (error) {
      setError(error.message || "An error occurred while fetching data");
      console.error("Error fetching visitor data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [apiURL, token]);

  useEffect(() => {
    fetchVisitorData();
  }, [fetchVisitorData]);

  const markers = useMemo(() => {
    return visitorData.map(({ _id, location }) => {
      const position = [
        location.coordinates.latitude,
        location.coordinates.longitude,
      ];
      return (
        <Marker key={_id} position={position} icon={customIcon}>
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-semibold text-blue-800 mb-2">
                {location.state}
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">City:</span> {location.city}
                </p>
              </div>
            </div>
          </Popup>
        </Marker>
      );
    });
  }, [visitorData]);

  const stats = useMemo(() => {
    const uniqueStates = new Set();
    const uniqueCities = new Set();
    let totalVisits = 0;

    visitorData.forEach((visitor) => {
      if (visitor.location) {
        uniqueStates.add(visitor.location.state);
        uniqueCities.add(`${visitor.location.state}-${visitor.location.city}`);
        totalVisits += 1;
      }
    });

    return {
      totalStates: uniqueStates.size,
      totalCities: uniqueCities.size,
      totalVisits,
    };
  }, [visitorData]);

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <h2 className="text-red-800 font-semibold mb-2">Error Loading Map</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">
          Company Visitor Locations
        </h1>

        <div className="grid grid-cols-3 gap-4 mt-3 mb-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <p className="text-sm text-blue-600">Total States</p>
            <p className="text-xl font-bold text-blue-800">
              {stats.totalStates}
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <p className="text-sm text-green-600">Total Cities</p>
            <p className="text-xl font-bold text-green-800">
              {stats.totalCities}
            </p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <p className="text-sm text-purple-600">Total Visits</p>
            <p className="text-xl font-bold text-purple-800">
              {stats.totalVisits}
            </p>
          </div>
        </div>
      </div>

      <div className="relative h-[400px]">
        {isLoading ? (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-gray-600">Loading map data...</p>
            </div>
          </div>
        ) : (
          <MapContainer
            center={INDIA_CENTER}
            zoom={5}
            className="h-full w-full"
            zoomControl={true}
            scrollWheelZoom={false}
            maxBounds={INDIA_BOUNDS}
            minZoom={4}
          >
            <MemoisedTileLayer />
            {markers}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default React.memo(UserGeolocationMap);
