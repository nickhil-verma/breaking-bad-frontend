import React from 'react';
import { useLocation } from 'react-router-dom';

const Stat = () => {
  const location = useLocation();
  const { deviceId, deviceData } = location.state || {};

  return (
    <div className="text-white bg-black min-h-screen p-6">
      <h2 className="text-3xl mb-4 font-bold">Stats for Device: {deviceId}</h2>

      {deviceData ? (
        <pre className="bg-gray-800 p-4 rounded-md">
          {JSON.stringify(deviceData, null, 2)}
        </pre>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Stat;
