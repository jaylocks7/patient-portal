import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPatients, createPatient, deletePatient } from "../api/patients";
import type { CreatePatientBody } from "../types/patient";

const PATIENTS_KEY = ["patients"] as const;

export function usePatients() {
  return useQuery({
    queryKey: PATIENTS_KEY,
    queryFn: getPatients,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreatePatientBody) => createPatient(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_KEY });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patientId: string) => deletePatient(patientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_KEY})
    }
   })

}
