import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";



const UserSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    currentStep: { type: Number, enum: [1, 2, 3], default: 1 },

    stepScores: {
      step1: Number,
      step2: Number,
      step3: Number,
    },

    certifications: {
      step1: { type: String, enum: ["Fail", "A1", "A2"] },
      step2: { type: String, enum: ["A2", "B1", "B2"] },
      step3: { type: String, enum: ["B2", "C1", "C2"] },
    },

    canRetakeStep1: { type: Boolean, default: true },

    progressStatus: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
  emailVerified: { type: Boolean, default: false },
  emailVerificationCode: { type: String },
  },
  { timestamps: true }
);

// Auto-calculate logic before save
UserSchema.pre("save", function (next) {
  // Step 1 rules
  if (this.stepScores.step1 !== undefined) {
    const score = this.stepScores.step1;
    if (score < 25) {
      this.certifications.step1 = "Fail";
      this.canRetakeStep1 = false;
      this.currentStep = 1;
    } else if (score < 50) {
      this.certifications.step1 = "A1";
      this.currentStep = 1;
    } else if (score < 75) {
      this.certifications.step1 = "A2";
      this.currentStep = 1;
    } else {
      this.certifications.step1 = "A2";
      this.currentStep = 2;
    }
  }

  // Step 2 rules
  if (this.stepScores.step2 !== undefined) {
    const score = this.stepScores.step2;
    if (score < 25) {
      this.certifications.step2 = "A2";
    } else if (score < 50) {
      this.certifications.step2 = "B1";
    } else if (score < 75) {
      this.certifications.step2 = "B2";
    } else {
      this.certifications.step2 = "B2";
      this.currentStep = 3;
    }
  }

  // Step 3 rules
  if (this.stepScores.step3 !== undefined) {
    const score = this.stepScores.step3;
    if (score < 25) {
      this.certifications.step3 = "B2";
    } else if (score < 50) {
      this.certifications.step3 = "C1";
    } else {
      this.certifications.step3 = "C2";
      this.progressStatus = "completed";
    }
  }

  next();
});

export const userModel = model<TUser>("User", UserSchema);
