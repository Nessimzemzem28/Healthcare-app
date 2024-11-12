import axios from 'axios';
import dayjs from 'dayjs';

const BASE_URL = 'http://localhost:3000'; 

/**************************************** Patient Controller Functions ****************************************/

// Function to get all the patients
export const getAllPatients = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/patients`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch patients';
      console.error('Failed to fetch patients:', error);
      throw new Error(message);
    }
  };
  
  // Function to get a unique patient by id
  export const getPatientById = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/patients/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch patient';
      console.error('Failed to fetch patient:', error);
      throw new Error(message);
    }
  };
  
  // Function to create a new patient
  export const createPatient = async (patientData) => {
    try {
      const response = await axios.post(`${BASE_URL}/patients`, patientData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create patient';
      console.error('Failed to create patient:', error);
      throw new Error(message);
    }
  };
  
  // Function to update a patient by id
  export const updatePatient = async (id, patientData) => {
    try {
      const response = await axios.put(`${BASE_URL}/patients/${id}`, patientData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update patient';
      console.error('Failed to update patient:', error);
      throw new Error(message);
    }
  };

  // Function to delete a patient by id
  export const deletePatient = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/patients/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete patient';
      console.error('Failed to delete patient:', error);
      throw new Error(message);
    }
  };

  // Function to search patients by full name
  export const searchPatientsByFullName = async (fullName) => {
    try {
      const response = await axios.get(`${BASE_URL}/patients/search/fullname`, {
        params: { fullname: fullName },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search patients by full name:', error);
      throw error.response.data || 'Failed to search patients by full name';
    }
  };

  // Function to search patients by first name
  export const searchPatientsByFirstName = async (firstName) => {
    try {
      const response = await axios.get(`${BASE_URL}/patients/search/firstname`, {
        params: { firstname: firstName },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search patients by first name:', error);
      throw error.response.data || 'Failed to search patients by first name';
    }
  };

  // Function to search patients by last name
  export const searchPatientsByLastName = async (lastName) => {
    try {
      const response = await axios.get(`${BASE_URL}/patients/search/lastname`, {
        params: { lastname: lastName },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search patients by last name:', error);
      throw error.response.data || 'Failed to search patients by last name';
    }
  };

  /**************************************** Appointments Controller Functions ****************************************/

  export const getAppointments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/appointments`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch appointments: ${error.message}`);
    }
  };

  export const getAppointmentById = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/appointments/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch appointment ${id}: ${error.message}`);
    }
  };

  export const createAppointment = async (createAppointmentDto) => {
    try {
      const response = await axios.post(`${BASE_URL}/appointments`, createAppointmentDto);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create appointment: ${error.message}`);
    }
  };

  export const updateAppointment = async (id, updateAppointmentDto) => {
    try {
      const response = await axios.put(`${BASE_URL}/appointments/${id}`, updateAppointmentDto);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update appointment ${id}: ${error.message}`);
    }
  };

  export const deleteAppointment = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/appointments/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete appointment ${id}: ${error.message}`);
    }
  };

  // Function to get All the Appointments in a specific day
  export const getAppointmentsForDay = async (day) => {
    try {
      const response = await axios.get(`${BASE_URL}/appointments/day/${day}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch appointments for day ${day}: ${error.message}`);
    }
  };

  // Function to search and get the nearest Appointment for a specific patient
  export const getNearestAppointmentForPatient = async (patientId) => {
    try {
      const response = await axios.get(`${BASE_URL}/appointments/nearest/${patientId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch nearest appointment for patient ${patientId}: ${error.message}`);
    }
  };

  // Function to get all the details of appointments 
  export const getAppointmentsWithDetails = async () => {
    try {
      const response =  await axios.get(`${BASE_URL}/appointments/details`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch appointments details : ${error.message}`);
    }
  };

  // Function to reschedule an appointment
  export const rescheduleAppointment = async (id, newDate, newStartTime) => {
    try {
      const response = await axios.put(`${BASE_URL}/appointments/${id}/reschedule`, {
        newDate: new Date(newDate).toISOString(),
        newStartTime: new Date(newStartTime).toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      throw error.response?.data || 'Failed to reschedule appointment';
    }
  };

  /**************************************** Medical Record Controller Functions ****************************************/

  // Function to get all medical records
  export const getAllMedicalRecords = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/medical-records`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch medical records';
      console.error('Failed to fetch medical records:', error);
      throw new Error(message);
    }
  };

  // Function to get a medical record by id
  export const getMedicalRecordById = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/medical-records/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch medical record';
      console.error('Failed to fetch medical record:', error);
      throw new Error(message);
    }
  };

  // Function to create a new medical record
  export const createMedicalRecord = async (record) => {
    try {
      // Prepare the data
      const formattedRecord = {
        date: record.date ? dayjs(record.date).toISOString() : undefined, 
        diagnosis: record.diagnosis,
        treatment: record.treatment,
        medication: record.medication || undefined, 
        visitType: record.visitType,
        bloodPressure: record.bloodPressure || undefined, 
        heartRate: record.heartRate !== undefined ? Number(record.heartRate) : undefined, 
        temperature: record.temperature !== undefined ? Number(record.temperature) : undefined, 
        weight: record.weight !== undefined ? Number(record.weight) : undefined, 
        height: record.height !== undefined ? Number(record.height) : undefined, 
        notes: record.notes,
        patientId: record.patientId !== undefined ? Number(record.patientId) : undefined, 
      };
  
      // Send the request
      const response = await fetch(`${BASE_URL}/medical-records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedRecord),
      });
  
      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || 'Failed to create medical record');
      }
  
      return await response.json(); 
    } catch (error) {
      console.error("Error in createMedicalRecord:", error);
      throw error; 
    }
  };

  // Function to update a medical record by id
  export const updateMedicalRecord = async (id, medicalRecordData) => {
    try {
      const response = await axios.put(`${BASE_URL}/medical-records/${id}`, medicalRecordData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update medical record';
      console.error('Failed to update medical record:', error);
      throw new Error(message);
    }
  };

  // Function to delete a medical record by id
  export const deleteMedicalRecord = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/medical-records/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete medical record';
      console.error('Failed to delete medical record:', error);
      throw new Error(message);
    }
  };

  // Function to get medical records by patient id
  export const getMedicalRecordsByPatientId = async (patientId) => {
    try {
      const response = await axios.get(`${BASE_URL}/medical-records/patient/${patientId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch medical records for patient';
      console.error('Failed to fetch medical records for patient:', error);
      throw new Error(message);
    }
  };

  // Generate a PDF of medical records for a patient
  export const downloadMedicalRecordPDF = async (patientId, recordId) => {
    try {
      const response = await axios.get(`${BASE_URL}/medical-records/${patientId}/pdf/${recordId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `medical-record-${recordId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  };
  
  /**************************************** Statistical methods ****************************************/
  export const fetchMedicalRecordsCountByDiagnosisPerMonth = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/medical-records/stats/count-by-diagnosis-per-month`);
      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
      return response.data.map(record => ({
        ...record,
        month: String(record.month),  
        
        ...Object.fromEntries(
          Object.entries(record).map(([key, value]) => [key, isNaN(value) ? value : Number(value)])
        )
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error('Failed to fetch medical records count by diagnosis per month.');
    }
  };
  
  export const fetchMedicalRecordsCountByVisitTypePerMonth = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/medical-records/stats/visit-type-count-per-month`);
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error.response?.data || error.message);
      throw new Error('Failed to fetch medical records count by visit type per month.');
    }
  };
  
