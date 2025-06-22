import cloudinary from "../lib/cloudinary.js";
import Report from "../models/report.model.js";
import axios from "axios";
import fs from "fs";
import os from "os";
import path from "path";
import { spawn } from "child_process";

// Perplexity API Config
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";

async function queryPerplexity(prompt) {
  try {
    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: "sonar", // or pplx-70b-online
        messages: [
          { role: "system", content: "Be precise and concise." },
          { role: "user", content: prompt },
        ],
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("🛑 Perplexity API Error:", err.response?.data || err.message);
    throw new Error("Failed to get AI analysis");
  }
}

export const getReport = async (req, res) => {
  console.log("👀 getReport called, req.auth=", req.auth);
  try {
    const userId = req.auth.userId;
    const reports = await Report.find({ userId });
    return res.status(200).json(reports);
  } catch (err) {
    console.error("❌ Error in getReport:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const postReport = async (req, res) => {
  try {
    console.log("🚀 Entered postReport API call");

    const userId = req.auth.userId;
    let { minimum, maximum, age, gender, area } = req.body;

    // Normalize input
    minimum = parseFloat(minimum);
    maximum = parseFloat(maximum);
    age = parseFloat(age);
    gender = gender.toLowerCase() === "male" ? 1 : gender.toLowerCase() === "female" ? 0 : null;

    // Validate
    if (!req.file || !req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "Valid image is required" });
    }
    if (
      isNaN(minimum) || isNaN(maximum) || isNaN(age) ||
      gender === null || !area || typeof area !== "string"
    ) {
      return res.status(400).json({ message: "All fields are required and must be valid" });
    }

    // Normalize for model input
    const args = [
      ((minimum - 2.709551) / 1.4066056).toString(),
      ((maximum - 4.175779) / 2.1338408).toString(),
      ((age - 58.300095) / 14.284759).toString(),
      gender.toString(),
      area,
    ];

    // Save image temporarily
    const tmpPath = path.join(os.tmpdir(), `lesion-${Date.now()}.jpg`);
    fs.writeFileSync(tmpPath, req.file.buffer);
    args.push(tmpPath);

    const scriptPath = path.join(process.cwd(), "script.py");

    console.log("🔍 Running Python script...");
    const probability = await new Promise((resolve, reject) => {
      const python = spawn(
        path.join(process.cwd(), ".venv/bin/python3"),
        [scriptPath, ...args]
      );

      let output = "";
      let errorOutput = "";

      python.stdout.on("data", (data) => {
        output += data.toString();
      });

      python.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      python.on("close", (code) => {
        fs.unlinkSync(tmpPath); // Clean temp

        if (code !== 0 || !output.trim()) {
          console.error("❌ Python error:", errorOutput || "No output");
          return reject(new Error("Python script failed"));
        }

        const prob = parseFloat(output.trim());
        if (isNaN(prob)) {
          console.error("⚠️ Python output is not a number:", output);
          return reject(new Error("Invalid analysis result"));
        }

        resolve(prob);
      });
    });

    // Prompt for Perplexity AI
    const prompt = `
Explain this skin lesion case in simple, non-medical terms for a patient:

**Patient Details:**
- Age/Gender: ${age}-year-old ${gender === 1 ? "male" : "female"}
- Spot Size: ${maximum}mm (largest) × ${minimum}mm (smallest)
- Location: ${area}
- Cancer Risk: ${probability.toFixed(2)}% (estimated by our AI system)

**Answer these clearly:**
1. **How serious is this?** (Use: Mild/Moderate/High Risk + plain explanation)
2. **What should we do next?** (Simple steps like ‘see a specialist,’ ‘get a biopsy,’ etc.)
3. **How urgent is this?** (Use: ‘Watch,’ ‘Check soon,’ or ‘Act now’)
4. **What signs should the patient watch for?** (e.g., color change, itching)

Write like you’re calming a worried person—no jargon. Keep it under 300 tokens.
    `;

    const analysis = await queryPerplexity(prompt);

    // Upload image to Cloudinary
    const imageURL = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      stream.end(req.file.buffer);
    });

    // Create report
    const newReport = new Report({
      minimum,
      maximum,
      age,
      gender,
      area,
      image: imageURL,
      probability,
      analysis,
      userId,
    });

    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    console.error("❌ Error in postReport:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
