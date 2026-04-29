import admin from "firebase-admin";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const serviceAccountPath = path.resolve(
  __dirname,
  "../../src/firebase/service-account.json"
);

if (!admin.apps.length) {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  } else {
    throw new Error(
      "Missing service-account.json. Follow the Firebase setup steps in .env.example."
    );
  }
}

export const db = admin.firestore();
