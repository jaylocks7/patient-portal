import axios from "axios";
import type { Patient, CreatePatientBody } from "../types/patient";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000
});

export async function getPatients(): Promise<Patient[]> {
  const res = await api.get<{ data: Patient[] }>("/patients");
  return res.data.data;
}

export async function createPatient(body: CreatePatientBody): Promise<Patient> {
  const res = await api.post<{ data: Patient }>("/patients", body);
  return res.data.data;
}

export async function deletePatient(patientId: string) {
  const res = await api.delete<{}>(`/patients/${patientId}`);
  return res.data;
}
