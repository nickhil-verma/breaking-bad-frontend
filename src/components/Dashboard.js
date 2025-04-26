import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'react-toastify/dist/ReactToastify.css';
import Appointment from './Appointment';

const GEMINI_API_KEY = process.env.YOUR_API_KEY;

const playAlertSound = () => {
  const audio = new Audio('/alert.mp3');
  audio.play().catch((e) => console.error('Audio play failed:', e));
};

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [deviceData, setDeviceData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [lastSeen, setLastSeen] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [alertValues, setAlertValues] = useState({ o2: null, hr: null });
  const [geminiResponse, setGeminiResponse] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    const name = Cookies.get('name');
    if (!token) navigate('/login');
    else setUserName(name || '');
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (uniqueId && uniqueId.length === 10) {
        fetchLatestDeviceData();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [uniqueId]);

  const parseToGraphData = (input, label) => {
    if (!input) return [];
    const values = Array.isArray(input)
      ? input
      : typeof input === 'string'
      ? input.split(',')
      : [];
    return values.slice(-10).map((val, index) => ({
      name: `${label} ${index + 1}`,
      value: parseFloat(val)
    }));
  };

  const getGeminiInference = async () => {
    if (!deviceData) return;

    const prompt = `
You are a medical AI. Analyze the following patient device data and provide a brief medical insight:
- O2 Levels: ${deviceData.o2}
- Heart Rate: ${deviceData.heartRateECG}
- Temperature: ${deviceData.temperature}
- ECG Peaks: ${deviceData.ecgPeak}

Respond in 3-4 lines in simple language for a doctor. Point out anything abnormal or concerning.`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ]
          })
        }
      );

      const result = await res.json();
      const reply =
        result?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No response from Gemini';
      setGeminiResponse(reply);
    } catch (error) {
      console.error('Gemini AI error:', error);
      setGeminiResponse('Failed to fetch AI response.');
    }
  };

  const fetchDeviceData = async () => {
    if (!uniqueId || uniqueId.length !== 10) {
      toast.error('Please enter a valid 10-digit Unique ID');
      return;
    }

    try {
      const response = await fetch(`https://breakin-badmicroservices.vercel.app/api/${uniqueId}`);
      const data = await response.json();

      if (response.ok && data.data) {
        setDeviceData(data.data);
        setNotFound(false);

        const updatedAt = new Date(data.data.updatedAt);
        const now = new Date();
        const diffMs = now - updatedAt;
        const minutes = Math.floor(diffMs / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        let timeAgo = '';
        if (days > 0) {
          const remainingHours = hours % 24;
          timeAgo = `Device was last online ${days} day${days > 1 ? 's' : ''} and ${remainingHours} hour${remainingHours !== 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
          const remainingMinutes = minutes % 60;
          timeAgo = `Device was last online ${hours} hour${hours > 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
          timeAgo = `Device was last online ${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        } else {
          timeAgo = 'Device was just online';
        }

        setLastSeen(timeAgo);
        await getGeminiInference();
      } else {
        setDeviceData(null);
        setNotFound(true);
        toast.error('Device does not exist');
      }
    } catch (error) {
      setDeviceData(null);
      setNotFound(true);
      toast.error('Error fetching device data');
    }
  };

  const fetchLatestDeviceData = async () => {
    try {
      const response = await fetch(`https://breakin-badmicroservices.vercel.app/api/${uniqueId}`);
      const data = await response.json();

      if (response.ok && data.data) {
        setDeviceData(data.data);

        const o2Data = parseToGraphData(data.data.o2, 'O2');
        const hrData = parseToGraphData(data.data.heartRateECG, 'HR');
        const latestO2 = o2Data.at(-1)?.value;
        const latestHR = hrData.at(-1)?.value;

        if ((latestO2 < 90 || latestHR < 50) && !showPopup) {
          playAlertSound();
          setAlertValues({ o2: latestO2, hr: latestHR });
          setShowPopup(true);
        }
      }
    } catch (error) {
      console.error('Auto-refresh error:', error);
    }
  };

  const generatePDFReport = async () => {
    const input = document.getElementById('report-section');
    if (!input) return;

    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.setFontSize(18);
      pdf.text('Medical Report', pdfWidth / 2, 20, { align: 'center' });

      const imgProps = pdf.getImageProperties(imgData);
      const contentHeight = pdfHeight - 30;
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      const yOffset = 25;
      const finalHeight = Math.min(imgHeight, contentHeight);

      pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, finalHeight);
      pdf.save(`Health_Report_${uniqueId}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      toast.error('Failed to generate PDF');
    }
  };

  const o2Data = parseToGraphData(deviceData?.o2, 'O2');
  const heartRateData = parseToGraphData(deviceData?.heartRateECG, 'HR');
  const temperatureData = parseToGraphData(deviceData?.temperature, 'Temp');
  const ecgPeaksData = parseToGraphData(deviceData?.ecgPeak, 'ECG Peak');

  const renderChartCard = (title, data, color) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="backdrop-blur-md bg-white/10 border border-white/20 shadow-lg rounded-2xl p-4 w-full sm:w-[90%] md:w-[45%] lg:w-[30%] flex flex-col"
    >
      <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="name" stroke="#ccc" hide />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome, {userName} 👋</h1>

      {!deviceData && (
        <>
          <input
            type="text"
            value={uniqueId}
            onChange={(e) => setUniqueId(e.target.value)}
            placeholder="Enter 10-digit Unique ID"
            className="px-4 py-2 rounded-md text-black mb-4 w-64 outline-none"
          />
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={fetchDeviceData}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold"
            >
              Scan Device
            </button>
            <button
              onClick={fetchDeviceData}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold"
            >
              Add Device
            </button>
          </div>
        </>
      )}

      {deviceData && (
        <>
          <motion.div
            id="report-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full mt-6 flex flex-wrap gap-6 justify-center items-stretch"
          >
            {renderChartCard('O₂ Level (%)', o2Data, '#60A5FA')}
            {renderChartCard('Heart Rate (BPM)', heartRateData, '#F87171')}
            {renderChartCard('Temperature (°C)', temperatureData, '#34D399')}
            {renderChartCard('ECG Peaks', ecgPeaksData, '#FBBF24')}
          </motion.div>
          <Appointment />
          <div className="flex gap-4 mt-6 flex-wrap justify-center">
            <button
              onClick={generatePDFReport}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold"
            >
              📄 Export Report
            </button>
            <button
              onClick={getGeminiInference}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-semibold"
            >
              🔁 Refresh AI Insight
            </button>
          </div>

          {lastSeen && <p className="text-sm text-gray-400 mt-4">{lastSeen}</p>}

          {geminiResponse && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mt-6 bg-white/10 border border-white/20 p-4 rounded-xl max-w-2xl text-white text-sm"
            >
              <h3 className="text-lg font-semibold mb-2">🧠 AI Medical Insight:</h3>
              <p>{geminiResponse}</p>
            </motion.div>
          )}
        </>
      )}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="bg-red-600 text-white p-6 rounded-xl shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-2">🚨 Critical Health Alert!</h2>
            <p className="mb-2">O₂ Level: {alertValues.o2}</p>
            <p className="mb-4">Heart Rate: {alertValues.hr}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {notFound && (
        <p className="text-red-500 mt-4">Device does not exist</p>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Dashboard;
