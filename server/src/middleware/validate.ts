import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const AddressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "State must be a 2-letter code"),
  zipCode: z.string().regex(/^\d{5}$/, "Zip code must be 5 digits"),
});

export const PatientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format"),
  status: z.enum(["Inquiry", "Onboarding", "Active", "Churned"], {
    error: "Status must be Inquiry, Onboarding, Active, or Churned",
  }),
  address: AddressSchema,
});

export type PatientInput = z.infer<typeof PatientSchema>;

export function validateBody(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const result = PatientSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    res.status(400).json({ errors });
    return;
  }
  req.body = result.data;
  next();
}
