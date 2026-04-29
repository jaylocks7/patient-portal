export type PatientStatus = "Inquiry" | "Onboarding" | "Active" | "Churned";

export const PATIENT_STATUSES: PatientStatus[] = [
  "Inquiry",
  "Onboarding",
  "Active",
  "Churned",
];

export interface Address {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Patient {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  status: PatientStatus;
  address: Address;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientBody {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  status: PatientStatus;
  address: Address;
}
