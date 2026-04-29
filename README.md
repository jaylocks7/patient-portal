<h1>A patient portal web app built with React + Axios + Express + Firebase.</h1>

<h3>Check it out here: </h3>

https://patient-portal-three-blush.vercel.app/

<h3>Hosted with:</h3>

Vercel (FE) + Railway (BE) + Firebase (DB)

<h3>Four functionalities:</h3>

-view patient list (PatientTable)

-view a patient's details (PatientDetailModal)

-create patients (AddPatientModal)

-delete patients (AddPatientModal)

<h3>Three API routes:</h3>

-GET /patients

-POST /patients

-DELETE /patients/:id

<h3>Data flow:</h3>

-[TO FILL OUT]

<h3>Data Model:</h3>

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


<h3>Implementation notes: </h3>

-pagination is set up for FE but not yet implemented in BE for GET request

-PatientTable lifecycle is managed by useQuery hook (triggers re-fetch upon page load and every successful add and delete)

-useQuery hook utilizes client-side, tab-level cache -> server-side cache is not yet implemented

-FE has input validation (ie zipcode must be a Number and 6 digits and is enforced in the FE) + whitespace trimming for adding patient

-BE has input validation (server/src/middleware/validate)
