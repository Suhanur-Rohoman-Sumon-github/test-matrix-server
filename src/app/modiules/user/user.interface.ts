export type TUser = {
  name: string;
  email: string;
  password: string;

  currentStep: number;
  stepScores: {
    step1?: number;
    step2?: number;
    step3?: number;
  };
  certifications: {
    step1?: "Fail" | "A1" | "A2";
    step2?: "A2" | "B1" | "B2";
    step3?: "B2" | "C1" | "C2";
  };
  canRetakeStep1: boolean;
  progressStatus: "in-progress" | "completed";
  emailVerified: boolean;
  emailVerificationCode?: string | null;
}