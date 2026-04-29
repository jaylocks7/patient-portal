A patient portal web app built with React + Axios + Express + Firebase.

Check it out here:
https://patient-portal-three-blush.vercel.app/

Hosted with:
Vercel (FE) + Railway (BE) + Firebase (DB)

Four functionalities:
-view patient list (PatientTable)
-view a patient's details (PatientDetailModal)
-create patients (AddPatientModal)
-delete patients (AddPatientModal)

Three API routes:
-GET /patients
-POST /patients
-DELETE /patients/:id

Data flow:
-[TO FILL OUT]

Data Model:
Patient is
-firstName
-middleName?
-lastName
-Date of Birth
-Status (Onboarded, Inquiry, Churned, Active)
-Street
-Apt/Unit?
-City
-State
-Zipcode

Implementation notes:
-pagination is set up for FE but not yet implemented in BE for GET request
-PatientTable lifecycle is managed by useQuery hook (triggers re-fetch upon page load and every successful add and delete)
-useQuery hook utilizes client-side, tab-level cache -> server-side cache is not yet implemented
-FE has input validation (ie zipcode must be a Number and 6 digits and is enforced in the FE) + whitespace trimming for adding patient
-BE has input validation (server/src/middleware/validate)
