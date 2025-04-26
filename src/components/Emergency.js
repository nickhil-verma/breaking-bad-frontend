import { useEffect, useState } from 'react';

const cdsimer = { name: "Dr Chandramma Dayananda Sagar institute of Medical Education and Research ಸಿ.ಡಿ.ಸೈಮರ್ CDSIMER", lat: 12.660789, lng: 77.450055 }; // example coords
//12.660789, 77.450055


const hospitals = [
  { name: "City Hospital", lat: 12.962, lng: 77.637 },
  { name: "Green Life", lat: 12.975, lng: 77.614 },
  { name: "MediCare", lat: 12.948, lng: 77.620 },
];

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
}

export default function Emergency() {
  const [userLocation, setUserLocation] = useState(null);
  const [sortedHospitals, setSortedHospitals] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setUserLocation({ lat: latitude, lng: longitude });

      const otherHospitals = hospitals.map((h) => ({
        ...h,
        distance: getDistance(latitude, longitude, h.lat, h.lng),
      }));

      const cdsimerWithDistance = {
        ...cdsimer,
        distance: getDistance(latitude, longitude, cdsimer.lat, cdsimer.lng),
      };

      otherHospitals.sort((a, b) => a.distance - b.distance);

      setSortedHospitals([cdsimerWithDistance, ...otherHospitals]);
    });
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-gray-100">
        <a
  href="tel:108"
  className="inline-block mb-6 px-6 py-3 bg-red-600 text-white font-semibold rounded-full shadow-lg animate-pulse hover:bg-red-700 transition"
>
  🚑 Book Ambulance
</a>

      <h2 className="text-2xl font-bold mb-4">Nearest Hospitals</h2>

      {!userLocation && <p>Getting your location...</p>}

      {userLocation && sortedHospitals.length > 0 && (
        <ul className="space-y-4">
          {sortedHospitals.map((hospital, index) => (
            <li
              key={index}
              className="border border-gray-700 p-4 rounded-xl shadow-md bg-gray-800 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{hospital.name}</h3>
                <p className="text-sm text-gray-400">
                  {(hospital.distance / 1000).toFixed(2)} km away
                </p>
              </div>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${hospital.lat},${hospital.lng}&travelmode=driving`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Get Directions
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
