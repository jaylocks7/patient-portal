import { Router, Request, Response } from "express";
import { db } from "../firebase/config";
import { validateBody, PatientInput } from "../middleware/validate";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const snapshot = await db
      .collection("patients")
      .orderBy("lastName", "asc")
      .get();

    const patients = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ data: patients });
  } catch (err) {
    console.error("GET /patients error:", err);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
});

router.post("/", validateBody, async (req: Request, res: Response) => {
  try {
    const body = req.body as PatientInput;
    const now = new Date().toISOString();

    const docData = {
      ...body,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await db.collection("patients").add(docData);

    res.status(201).json({ data: { id: docRef.id, ...docData } });
  } catch (err) {
    console.error("POST /patients error:", err);
    res.status(500).json({ error: "Failed to create patient" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {           
    const patientId = req.params.id;                                                                                                       
    if (typeof patientId !== "string" || !patientId) {
      return res.status(400).json({ error: "Missing or invalid patient id" });                                                             
    }                                                                                                                                      
    await db.collection("patients").doc(patientId).delete();
    res.status(204).send();                                                                                                                
  } catch (error) {
    console.error(`Error deleting patient: ${req.params.id}`, error);
    res.status(500).json({ error: "Failed to delete patient" });                                                                           
  }
});

export default router;
