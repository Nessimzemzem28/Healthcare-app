import React, { useEffect, useState, useRef } from 'react';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchMedicalRecordsCountByDiagnosisPerMonth, fetchMedicalRecordsCountByVisitTypePerMonth } from '../../utils/api';
import { FaChartBar, FaCalendarAlt, FaFileExport } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { CSVLink } from 'react-csv';

const processChartData = (data, selectedMonth) => {
  const diagnoses = Array.from(new Set(data.map(record => record.diagnosis)));
  const filteredData = data.filter(record => record.month === selectedMonth);

  const colorPalette = [
    "#1E3A8A", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", 
    "#BFDBFE", "#60A5FA", "#3B82F6", "#2563EB", "#1E3A8A"
  ];

  return diagnoses.map((diagnosis, index) => {
    const record = filteredData.find(r => r.diagnosis === diagnosis);
    return {
      name: diagnosis,
      value: record ? record.count : 0,
      color: colorPalette[index % colorPalette.length],
    };
  });
};

const processVisitTypeChartData = (data, selectedMonth) => {
  const visitTypes = Array.from(new Set(data.map(record => record.visitType)));
  const filteredData = data.filter(record => record.month === selectedMonth);

  const colorPalette = [
    "#F87171", "#FB923C", "#F59E0B", "#FBBF24", "#FDE68A",
    "#D97706", "#B45309", "#92400E", "#78350F", "#4B5563"
  ];

  return visitTypes.map((visitType, index) => {
    const record = filteredData.find(r => r.visitType === visitType);
    return {
      name: visitType,
      value: record ? record.count : 0,
      color: colorPalette[index % colorPalette.length],
    };
  });
};

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [visitTypeChartData, setVisitTypeChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [months, setMonths] = useState([]);
  const [chartTitle, setChartTitle] = useState('');
  const diagnosisChartRef = useRef();
  const visitTypeChartRef = useRef();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const diagnosisData = await fetchMedicalRecordsCountByDiagnosisPerMonth();
        const visitTypeData = await fetchMedicalRecordsCountByVisitTypePerMonth();
        const months = Array.from(new Set(diagnosisData.map(record => record.month)));

        setMonths(months);

        if (months.length > 0) {
          const initialMonth = months[0];
          setSelectedMonth(initialMonth);

          const initialDiagnosisData = processChartData(diagnosisData, initialMonth);
          setChartData(initialDiagnosisData);

          const initialVisitTypeData = processVisitTypeChartData(visitTypeData, initialMonth);
          setVisitTypeChartData(initialVisitTypeData);

          setChartTitle(`${new Date(`${initialMonth}-01`).toLocaleString('default', { month: 'long' })} ${new Date(`${initialMonth}-01`).getFullYear()}`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setTimeout(() => setLoading(false), 1000); // 1 second delay
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataForMonth = async () => {
      setLoading(true);
      try {
        const diagnosisData = await fetchMedicalRecordsCountByDiagnosisPerMonth();
        const visitTypeData = await fetchMedicalRecordsCountByVisitTypePerMonth();

        const processedDiagnosisData = processChartData(diagnosisData, selectedMonth);
        setChartData(processedDiagnosisData);

        const processedVisitTypeData = processVisitTypeChartData(visitTypeData, selectedMonth);
        setVisitTypeChartData(processedVisitTypeData);

        setChartTitle(`${new Date(`${selectedMonth}-01`).toLocaleString('default', { month: 'long' })} ${new Date(`${selectedMonth}-01`).getFullYear()}`);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setTimeout(() => setLoading(false), 1000); // 1 second delay
      }
    };

    if (selectedMonth) {
      fetchDataForMonth();
    }
  }, [selectedMonth]);

  const captureAndExportPDF = () => {
    const chartNodes = [
      diagnosisChartRef.current,
      visitTypeChartRef.current
    ];
  
    Promise.all(chartNodes.map(node => 
      domtoimage.toPng(node, { 
        quality: 1, 
        width: 600,  
        height: 300  
      })
    ))
      .then(images => {
        const doc = new jsPDF('landscape', 'mm', 'a4'); 
        const imgWidth = 180;  
        const imgHeight = 90;  
  
        // Diagnosis Chart
        doc.setFontSize(18);
        doc.text('Records Count by Diagnosis', 105, 10, { align: 'center' });
        doc.setFontSize(10);
        doc.text('This chart displays the count of medical records by diagnosis for the selected month. Each segment represents a different diagnosis.', 10, 20, { align: 'left' });
        doc.addImage(images[0], 'PNG', 10, 30, imgWidth, imgHeight);
  
        const diagnosisLegendData = (chartData || []).map(entry => ({
          name: entry.name || 'Unknown',
          value: entry.value || 0
        }));
  
        doc.setFontSize(10);
        doc.text('Legend:', 10, 130);
        doc.autoTable({
          startY: 140,
          head: [['Diagnosis', 'Count']],
          body: diagnosisLegendData.map(entry => [
            entry.name,
            entry.value.toString()
          ]),
          theme: 'grid',
          styles: { fontSize: 8 },
          columnStyles: {
            1: { cellWidth: 30 } // Further adjusted column width
          }
        });
  
        doc.addPage();
  
        // Visit Type Chart
        doc.setFontSize(18);
        doc.text('Records Count by Visit Type', 105, 10, { align: 'center' });
        doc.setFontSize(10);
        doc.text('This chart displays the count of medical records by visit type for the selected month. Each segment represents a different visit type.', 10, 20, { align: 'left' });
        doc.addImage(images[1], 'PNG', 10, 30, imgWidth, imgHeight);
  
        const visitTypeLegendData = (visitTypeChartData || []).map(entry => ({
          name: entry.name || 'Unknown',
          value: entry.value || 0
        }));
  
        doc.setFontSize(10);
        doc.text('Legend:', 10, 130);
        doc.autoTable({
          startY: 140,
          head: [['Visit Type', 'Count']],
          body: visitTypeLegendData.map(entry => [
            entry.name,
            entry.value.toString()
          ]),
          theme: 'grid',
          styles: { fontSize: 8 },
          columnStyles: {
            1: { cellWidth: 30 } // Further adjusted column width
          }
        });
  
        doc.save(`medical_records_${selectedMonth}.pdf`);
      })
      .catch(error => {
        console.error('Error generating PDF:', error);
      });
  };
  

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-3xl font-extrabold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-900 to-black">
          <FaChartBar className="inline mr-2 text-3xl" />
          Medical Records Statistics
        </h1>
        <Skeleton height={300} />
      </div>
    );
  }

  const totalDiagnosisRecords = chartData.reduce((sum, entry) => sum + entry.value, 0);
  const totalVisitTypeRecords = visitTypeChartData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="p-4">
      {/* Page Title */}
      <h1 className="text-3xl font-extrabold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-900 to-black">
        <FaChartBar className="inline mr-2 text-3xl" />
        Medical Records Statistics
      </h1>

      {/* Month Selection */}
      <div className="mb-4 flex items-center justify-center">
        <div className="bg-blue-100 p-2 rounded-lg shadow-md flex items-center space-x-4">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-500" />
            <label htmlFor="month-select" className="font-medium">Select Month:</label>
          </div>
          <select
            id="month-select"
            className="px-4 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          >
            {months.map((month, index) => (
              <option key={index} value={month}>
                {new Date(`${month}-01`).toLocaleString('default', { month: 'long' })} {new Date(`${month}-01`).getFullYear()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Diagnosis Chart */}
        <div ref={diagnosisChartRef} className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-center mb-4">{chartTitle} - Records Count by Diagnosis</h2>
          {totalDiagnosisRecords === null ? (
            <div className="flex justify-center items-center text-center h-48">
              <Skeleton height={300} width="100%" />
            </div>
          ) : totalDiagnosisRecords === 0 ? (
            <div className="flex justify-center items-center text-center h-48">
              <p className="text-gray-500">No data available for the selected month.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="left" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Visit Type Chart */}
        <div ref={visitTypeChartRef} className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-center mb-4">{chartTitle} - Records Count by Visit Type</h2>
          {totalVisitTypeRecords === null ? (
            <div className="flex justify-center items-center text-center h-48">
              <Skeleton height={300} width="100%" />
            </div>
          ) : totalVisitTypeRecords === 0 ? (
            <div className="flex justify-center items-center text-center h-48">
              <p className="text-gray-500">No data available for the selected month.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={visitTypeChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {visitTypeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="left" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={captureAndExportPDF}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaFileExport className="mr-2" />
          Export as PDF
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
