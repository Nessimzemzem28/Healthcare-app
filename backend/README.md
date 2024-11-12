# Healthcare Backend API

This project is a healthcare backend application built with NestJS. It provides RESTful API services for managing patients, medical records, and appointments. The application is structured to ensure modularity and scalability, with each major domain (Appointment, Medical Record, Patient) having its own module, controller, and service.

## Project Structure

```plaintext
backend/
├── prisma/
│   ├── migrations/           # Database migration files
│   └── schema.prisma         # Prisma schema definition
└── src/
    ├── appointment/
    │   ├── appointment.controller.ts  # Appointment-related endpoints
    │   ├── appointment.module.ts      # Appointment module definition
    │   └── appointment.service.ts     # Appointment business logic
    ├── medical-record/
    │   ├── medical-record.controller.ts  # Medical Record-related endpoints
    │   ├── medical-record.module.ts      # Medical Record module definition
    │   └── medical-record.service.ts     # Medical Record business logic
    ├── patient/
    │   ├── patient.controller.ts        # Patient-related endpoints
    │   ├── patient.module.ts            # Patient module definition
    │   └── patient.service.ts           # Patient business logic
    ├── app.module.ts          # Root module that imports other modules
    └── main.ts                # Entry point of the application
```

## Description of the structure
- `prisma/schema.prisma`: Defines the data model for the application using Prisma ORM, which simplifies database interactions.

- `src/appointment/`: Contains files for the `Appointment` module, including :
  - `appointment.controller.ts` (API endpoints)
  - `appointment.module.ts` (module setup)
  - `appointment.service.ts` (business logic for appointments)

- `src/medical-record/`: Contains files for the Medical Record module, including :
  - `medical-record.controller.ts` (API endpoints)
  - `medical-record.module.ts` (module setup)
  - `medical-record.service.ts` (business logic for medical records)

- `src/patient/`: Contains files for the Patient module, including : 
  - `patient.controller.ts` (API endpoints) 
  - `patient.module.ts` (module setup), 
  - `patient.service.ts` (business logic for patients).

- `app.module.ts`: The root module of the application that imports and sets up the other modules.

- `main.ts`: The entry point of the application, where the NestJS framework is initialized and the server is started.


## Installation

  1. **Clone the repository:** 
    ```bash
    git clone <repository-url>
    cd backend
    ```

  2. **Install dependencies:**
    ```bash
    npm install
    ```

  3. **Set up environment variables:**
    - Create a `.env` file in the root directory.
    - Configure the necessary environment variables, such as database connection details for Prisma.

  4. **Generate Prisma client:**
    ```bash
    npx prisma generate
    ```

  5. **Run Prisma migrations:**
    ```bash
    npx prisma migrate dev
    ```

## Running the Application

### Development
To start the application in development mode with hot-reloading:

 ```bash
    npm run start:dev
  ```

### Production
To build and start the application in production mode:

 ```bash
    npm run build
    npm run start:prod
  ```

### Testing 
To run tests:
 ```bash
   npm run test
  ```