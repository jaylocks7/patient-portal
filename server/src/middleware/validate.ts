import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const optionalTrimmed = z
  .string()
  .optional()
  .transform((s) => s?.trim() || undefined);

const requiredTrimmed = (msg: string) => z.string().trim().min(1, msg);

const AddressSchema = z.object({
  street: requiredTrimmed("Street is required"),
  unit: optionalTrimmed,
  city: requiredTrimmed("City is required"),
  state: z.string().trim().length(2, "State must be a 2-letter code"),
  zipCode: z.string().trim().regex(/^\d{5}$/, "Zip code must be 5 digits"),
});

export const PatientSchema = z.object({
  firstName: requiredTrimmed("First name is required"),
  middleName: optionalTrimmed,
  lastName: requiredTrimmed("Last name is required"),
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
