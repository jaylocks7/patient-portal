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
    const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;          
    if (b64) {                                                     
      const serviceAccount = JSON.parse(
        Buffer.from(b64, "base64").toString("utf8")                
      );          
      admin.initializeApp({                                        
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,                
      });
    } else if (fs.existsSync(serviceAccountPath)) {                
      // local dev fallback — keep file-based loading              
      const serviceAccount =
  JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));         
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),         
        projectId: process.env.FIREBASE_PROJECT_ID,
      });                                                          
    } else {
      throw new Error("Missing Firebase credentials");             
    }                                                              
  }

export const db = admin.firestore();
