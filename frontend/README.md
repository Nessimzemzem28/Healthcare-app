# Healthcare Frontend Application

**Note:** For an overview of the entire project, including overall architecture, features, and a list of all technologies used, please see the main [README.md](../README.md) in the root directory.

This project is the frontend part of a healthcare application built with Next.js. It provides an interface for managing appointments, medical records, and patient information. The frontend communicates with the backend API (NestJS) using Axios for data fetching.

## Project Structure

```plaintext
frontend/
├── appointments/
│   ├── page.jsx                # Page for viewing and managing appointments
├── components/
│   ├── appointment/
│   │   ├── AppointmentCalendar.jsx  # Calendar view for scheduling and viewing appointments
│   │   └── AppointmentForm.jsx      # Form for creating or updating an appointment
│   ├── dashboard/
│   │   └── Dashboard.jsx            # Main dashboard view with statistics and summaries
│   ├── medical-report/
│   │   ├── AddMedicalRecord.jsx     # Form for adding a new medical record
│   │   └── MedicalRecord.jsx        # Component to display a medical record
│   ├── patient/
│   │   ├── Modal.jsx                # Reusable modal component for various actions
│   │   ├── PatientForm.jsx          # Form for creating or updating patient information
│   │   └── PatientList.jsx          # List of patients with details
│   └── Header.jsx                   # Header component for navigation
├── dashboard/
│   ├── page.jsx                # Main page for the dashboard
├── medical-reports/
│   └── [patientId]/
│       └── page.jsx            # Page for viewing medical reports by patient ID
├── utils/
│   └── api.js                  # API utility for connecting with the NestJS backend
├── favicon.ico                 # Favicon for the application
├── globals.css                 # Global CSS for styling the application
├── layout.js                   # Layout component for consistent styling and structure
└── page.js                     # Main entry point for the Next.js application
```

## Description of the structure 

- `appointments/page.jsx`: The main page for managing appointments, with a list view and management options.

- `components/appointment/AppointmentCalendar.jsx`: Displays a calendar for scheduling and viewing appointments. Integrates with the backend to fetch appointment data.

- `components/appointment/AppointmentForm.jsx`: A form component for creating or updating appointments, with input validation.

- `components/dashboard/Dashboard.jsx`: The main dashboard displaying key statistics and summaries for healthcare operations.

- `components/medical-report/AddMedicalRecord.jsx`: A form component for adding a new medical record associated with a patient.

- `components/medical-report/MedicalRecord.jsx`: Component for displaying medical record details.

- `components/patient/Modal.jsx`: A reusable modal component for various actions, such as editing or deleting patient data.

- `components/patient/PatientForm.jsx`: A form for creating or updating patient details with validation.

- `components/patient/PatientList.jsx`: Lists all patients, displaying essential information for each.

- `utils/api.js`: Contains Axios configurations and functions to interact with the NestJS backend API, such as fetching or submitting data for appointments, medical records, and patients.

- `globals.css`: Global styles for the entire application.

- `layout.js`: Layout component providing a consistent structure for all pages.


## Installation 

1. **Clone the repository:**

    ```bash
        git clone <repository-url>
        cd frontend
    ```

2. **Install dependencies:**

    ```bash
       npm install
    ```

3. **Set up environment variables:**

    - Create a `.env.local` file in the root directory.
    - Add the backend API URL:
         ```plaintext
      NEXT_PUBLIC_API_URL=http://localhost:<backend_port>
    ```

4. **Configure Axios:**
    - The `api.js` file in `utils/` uses Axios for HTTP requests to the backend. It reads the base URL from the environment variable `NEXT_PUBLIC_API_URL`.


## Running the Application 

### Development 

To start the application in development mode with hot-reloading:

    ```bash
        npm run dev
    ```
The app will be accessible at `http://localhost:3000` by default.

### Production 

To build and start the application in production mode:

    ```bash
        npm run build
        npm run start
    ```

### Features

- **🗓️ Appointment Management**: Schedule, view, and manage appointments with a calendar and list view.
- **👤 Patient Management**: Create, update, and view patient information in a user-friendly interface.
- **📋 Medical Records**: Add and view medical records for each patient.
- **📊 Dashboard**: View key statistics and summaries to support healthcare operations.
