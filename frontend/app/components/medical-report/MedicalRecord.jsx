import React, { useState, useEffect } from 'react';
import { getMedicalRecordsByPatientId, createMedicalRecord, deleteMedicalRecord, getPatientById } from '../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HiOutlineCalendar } from 'react-icons/hi';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import AddMedicalRecord from './AddMedicalRecord';
import { FaTemperatureHigh, FaWeight, FaRulerVertical, FaHeartbeat, FaSyringe, FaPills, FaUserMd, FaStethoscope, FaTint } from 'react-icons/fa';
import { PDFDocument, rgb } from 'pdf-lib';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};


const MedicalRecord = ({ patientId }) => {
  const [records, setRecords] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [patient, setPatient] = useState({});
  const [collapsedRecordId, setCollapsedRecordId] = useState(null);
  const [filterType, setFilterType] = useState('date');
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchDiagnosis, setSearchDiagnosis] = useState(''); 
  const [diagnosisOptions] = useState(['All','Hypertension', 'Diabetes', 'Asthma', 'Flu', 'Covid19', 'HeartDisease', 'Headache', 'Allergy', 'Gastroenteritis', 'Migraine']);

  const fetchRecords = async () => {
    try {
      const data = await getMedicalRecordsByPatientId(patientId);
      setRecords(data);
    } catch (error) {
      console.error("Error fetching records: ", error);
    }
  };

  const handleRecordAdded = async () => {
    await fetchRecords(); 
  };

  useEffect(() => {
    fetchRecords(); 
  }, [patientId]);


  useEffect(() => {
    const fetchPatientById = async (patientId) => {
      try {
        const patientData = await getPatientById(patientId);
        setPatient(patientData);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPatientById(patientId);
  }, [patientId]);

  const handleAddRecord = async (values, { setSubmitting }) => {
    try {
      const newRecord = await createMedicalRecord(patientId, values);
      toast.success('Record added successfully');
      setRecords([...records, newRecord]);
      setShowAddModal(false);
    } catch (error) {
      toast.error(error.message || 'Failed to add record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRecord = async () => {
    try {
      await deleteMedicalRecord(recordToDelete);
      toast.success('Record deleted successfully');
      setRecords(records.filter(record => record.id !== recordToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.message || 'Failed to delete record');
    }
  };

  const toggleCollapse = (id) => {
    setCollapsedRecordId(collapsedRecordId === id ? null : id);
  };

  const filteredRecords = records.filter(record => {
    if (filterType === 'date') {
      const recordDate = new Date(record.date).toLocaleDateString('en-GB');
      const searchDate = selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB') : '';
      return searchDate ? recordDate.includes(searchDate) : true;
    } else if (filterType === 'diagnosis') {
      return searchDiagnosis === 'All' || record.diagnosis.toLowerCase().includes(searchDiagnosis.toLowerCase());
    }
    return true;
  });


  const handleDownloadPDF = async (recordId) => {
    try {
      const record = records.find(rec => rec.id === recordId);
      if (!record) {
        toast.error('Record not found');
        return;
      }
  
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const { width, height } = page.getSize();
      const fontSize = 12;
      const titleFontSize = 20;
      const iconSize = 20;
      const margin = 50;
      const lineSpacing = 35; 
  
      
      const iconUrls = {
        date: '/icons/date-icon.png',
        diagnosis: '/icons/diagnosis-icon.png',
        treatment: '/icons/treatment-icon.png',
        medication: '/icons/medication-icon.png',
        visitType: '/icons/visit-type-icon.png',
        bloodPressure: '/icons/blood-pressure-icon.png',
        heartRate: '/icons/heart-rate-icon.png',
        temperature: '/icons/temperature-icon.png',
        weight: '/icons/weight-icon.png',
        height: '/icons/height-icon.png',
        notes: '/icons/notes-icon.png',
      };
  
     
      const icons = await Promise.all(
        Object.keys(iconUrls).map(async (key) => {
          const imageBytes = await fetch(iconUrls[key]).then(res => res.arrayBuffer());
          return { key, image: await pdfDoc.embedPng(imageBytes) };
        })
      );
  
      
      page.drawText(`Medical Record for ${patient.firstName} ${patient.lastName}`, {
        x: margin, 
        y: height - 2 * titleFontSize,
        size: titleFontSize,
        color: rgb(0.141, 0.082, 0.443),
      });
  
      let yPosition = height - 120; 

      const formatDate = (date) => {
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
      };
      
      const drawTextWithIcon = async (text, iconKey, y) => {
        const icon = icons.find(i => i.key === iconKey)?.image;
        if (icon) {
          const iconDims = { width: iconSize, height: iconSize }; 
          page.drawImage(icon, {
            x: margin,
            y: y,
            width: iconDims.width,
            height: iconDims.height,
          });
          page.drawText(text, {
            x: margin + iconDims.width + 10, 
            y: y + iconDims.height / 2 - fontSize / 2, 
            size: fontSize,
            color: rgb(0, 0, 0),
          });
        }
      };
  
      await drawTextWithIcon(`Date: ${formatDate(record.date)}`, 'date', yPosition);
      yPosition -= lineSpacing;  
  
      await drawTextWithIcon(`Diagnosis: ${record.diagnosis}`, 'diagnosis', yPosition);
      yPosition -= lineSpacing;
  
      await drawTextWithIcon(`Treatment: ${record.treatment}`, 'treatment', yPosition);
      yPosition -= lineSpacing;
  
      await drawTextWithIcon(`Medication: ${record.medication}`, 'medication', yPosition);
      yPosition -= lineSpacing;
  
      await drawTextWithIcon(`Visit Type: ${record.visitType}`, 'visitType', yPosition);
      yPosition -= lineSpacing;
  
      await drawTextWithIcon(`Blood Pressure: ${record.bloodPressure}`, 'bloodPressure', yPosition);
      yPosition -= lineSpacing;
  
      await drawTextWithIcon(`Heart Rate: ${record.heartRate}`, 'heartRate', yPosition);
      yPosition -= lineSpacing;
  
      await drawTextWithIcon(`Temperature: ${record.temperature} °C`, 'temperature', yPosition);
      yPosition -= lineSpacing;
  
      await drawTextWithIcon(`Weight: ${record.weight} kg`, 'weight', yPosition);
      yPosition -= lineSpacing;
  
      await drawTextWithIcon(`Height: ${record.height} cm`, 'height', yPosition);
      yPosition -= lineSpacing;
  
      await drawTextWithIcon(`Notes: ${record.notes}`, 'notes', yPosition);
  
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `MedicalRecord_${recordId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error.message);
      toast.error('Failed to download PDF');
    }
  };

  const sortedRecords = filteredRecords.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <>
    <div className="container mx-auto px-4">
      {/* Container for Avatar and Search */}
      <div className="bg-gray-200 p-4 rounded-lg shadow-lg mb-4"> 
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 flex-1">
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#006CA5',
                color: 'white',
                fontSize: '2rem',
              }}
            >
              {patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}
            </Avatar>
            <h1 className="text-xl font-bold text-gray-800">
              {patient.firstName} {patient.lastName}'s Medical Records
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <select
              className="select select-bordered border-gray-300 rounded-md shadow-sm"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setSelectedDate(null);
                setSearchDiagnosis('');
              }}
            >
              <option value="date">Search by Date</option>
              <option value="diagnosis">Search by Diagnosis</option>
            </select>

            {filterType === 'date' ? (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  slotProps={{ textField: { variant: 'outlined' } }}
                />
              </LocalizationProvider>
            ) : (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaStethoscope className="text-gray-500" />
                </div>
                <select
                  className="select select-bordered pl-10"
                  value={searchDiagnosis}
                  onChange={(e) => setSearchDiagnosis(e.target.value)}
                >
                  <option value="" disabled>Select Diagnosis</option>
                  {diagnosisOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              className="btn btn-primary ml-4"
              onClick={() => setShowAddModal(true)}
            >
              Add Record
            </button>
          </div>
        </div>
      </div>
    </div>

    <div className="container mx-auto px-4">
      <Slider {...settings} className="py-4"> 
        {sortedRecords.map(record => (
          <div key={record.id} className="slick-slide px-2"> 
            <div className="card bg-base-100 shadow-lg rounded-lg overflow-hidden border border-gray-200">
              <div className="card-body p-4"> 
                <div className="text-center mb-4"> 
                  <div className="text-xl font-bold mb-2">
                    <HiOutlineCalendar className="inline-block mr-2 text-blue-500" />
                    {new Date(record.date).toLocaleDateString('en-GB')}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2"> 
                  <div className="space-y-2"> 
                    <Tooltip title="Diagnosis details" arrow>
                      <div className="flex items-center">
                        <FaStethoscope className="text-lg text-blue-600" />
                        <div className="ml-2"> 
                          <span className="font-bold text-gray-700">Diagnosis:</span>
                          <p className="text-gray-900">{record.diagnosis}</p>
                        </div>
                      </div>
                    </Tooltip>
                    <Tooltip title="Treatment details" arrow>
                      <div className="flex items-center">
                        <FaSyringe className="text-lg text-green-600" />
                        <div className="ml-2">
                          <span className="font-bold text-gray-700">Treatment:</span>
                          <p className="text-gray-900">{record.treatment}</p>
                        </div>
                      </div>
                    </Tooltip>
                    <Tooltip title="Medication information" arrow>
                      <div className="flex items-center">
                        <FaPills className="text-lg text-blue-600" />
                        <div className="ml-2">
                          <span className="font-bold text-gray-700">Medication:</span>
                          <p className="text-gray-900">{record.medication || 'N/A'}</p>
                        </div>
                      </div>
                    </Tooltip>
                    <Tooltip title="Type of visit" arrow>
                      <div className="flex items-center">
                        <FaUserMd className="text-lg text-yellow-600" />
                        <div className="ml-2">
                          <span className="font-bold text-gray-700">Visit Type:</span>
                          <p className="text-gray-900">{record.visitType}</p>
                        </div>
                      </div>
                    </Tooltip>
                    <Tooltip title="Temperature information" arrow>
                      <div className="flex items-center">
                        <FaTemperatureHigh className="text-lg text-red-600" />
                        <div className="ml-2">
                          <span className="font-bold text-gray-700">Temperature:</span>
                          <p className="text-gray-900">{record.temperature || 'N/A'}</p>
                        </div>
                      </div>
                    </Tooltip>
                  </div>
                  <div className="space-y-2"> 
                    <Tooltip title="Heart rate information">
                      <div className="flex items-center">
                        <FaHeartbeat className="text-lg text-red-600" />
                        <div className="ml-2">
                          <span className="font-bold text-gray-700">Heart Rate:</span>
                          <p className="text-gray-900">{record.heartRate || 'N/A'}</p>
                        </div>
                      </div>
                    </Tooltip>
                    <Tooltip title="Blood pressure information" arrow>
                      <div className="flex items-center">
                        <FaTint className="text-lg text-red-600" />
                        <div className="ml-2">
                          <span className="font-bold text-gray-700">Blood Pressure:</span>
                          <p className="text-gray-900">{record.bloodPressure || 'N/A'}</p>
                        </div>
                      </div>
                    </Tooltip>
                    <Tooltip title="Weight information" arrow>
                      <div className="flex items-center">
                        <FaWeight className="text-lg text-green-600" />
                        <div className="ml-2">
                          <span className="font-bold text-gray-700">Weight:</span>
                          <p className="text-gray-900">{record.weight || 'N/A'}</p>
                        </div>
                      </div>
                    </Tooltip>
                    <Tooltip title="Height information" arrow>
                      <div className="flex items-center">
                        <FaRulerVertical className="text-lg text-orange-600" />
                        <div className="ml-2">
                          <span className="font-bold text-gray-700">Height:</span>
                          <p className="text-gray-900">{record.height || 'N/A'}</p>
                        </div>
                      </div>
                    </Tooltip>
                  </div>
                </div>
                <div className="text-center mt-4 flex justify-center space-x-4"> 
                  <Tooltip title="Delete Record" arrow>
                    <button
                      className="btn btn-secondary flex items-center justify-center w-1/3"
                      onClick={() => {
                        setRecordToDelete(record.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </Tooltip>

                  <Tooltip title="Download PDF" arrow>
                    <button
                      className="btn btn-accent flex items-center justify-center w-1/3"
                      onClick={() => handleDownloadPDF(record.id)}
                    >
                      Download PDF
                    </button>
                  </Tooltip>

                  <button
                    className={`btn ${collapsedRecordId === record.id ? 'btn-active' : 'btn-primary'} flex items-center justify-center w-1/3`}
                    onClick={() => toggleCollapse(record.id)}
                  >
                    {collapsedRecordId === record.id ? 'Collapse' : 'Expand'}
                  </button>
                </div>

                {collapsedRecordId === record.id && (
                  <div className="mt-4 p-4 border-t border-gray-300">
                    <p><span className="font-bold">Notes:</span> {record.notes || 'No notes available'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>


      {/* Add Modal */}
      {showAddModal && (
          <dialog id="add-record-modal" className="modal modal-open">
            <div className="modal-box max-w-full lg:max-w-4xl mx-4 lg:mx-8 max-h-screen overflow-y-auto p-4">
              <h2 className="text-2xl font-bold mb-4 text-center">Add Medical Record</h2>
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setShowAddModal(false)}>✕</button>
              <AddMedicalRecord 
                onSubmit={handleAddRecord} 
                patientId={patientId} 
                onClose={() => setShowAddModal(false)}
                onRecordAdded={handleRecordAdded}
                />
            </div>
          </dialog>
        )}

      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this medical record?</p>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleDeleteRecord}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position='bottom-center'
        theme='colored'
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        progressClassName="toastProgress"
        bodyClassName="toastBody"
      />
    </>
  );
};

export default MedicalRecord;
