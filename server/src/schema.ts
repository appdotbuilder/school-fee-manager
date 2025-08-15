import { z } from 'zod';

// Payment status enum
export const paymentStatusEnum = z.enum(['pending', 'completed', 'failed', 'refunded']);
export type PaymentStatus = z.infer<typeof paymentStatusEnum>;

// Arrears type enum
export const arrearsTypeEnum = z.enum(['tuition', 'transport', 'meal', 'uniform', 'books', 'activity', 'other']);
export type ArrearsType = z.infer<typeof arrearsTypeEnum>;

// Class schema
export const classSchema = z.object({
  id: z.number(),
  name: z.string(),
  level: z.string(), // e.g., "Grade 1", "Form 4", etc.
  description: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type SchoolClass = z.infer<typeof classSchema>;

// Student schema
export const studentSchema = z.object({
  id: z.number(),
  student_id: z.string(), // Unique student identifier
  name: z.string(),
  class_id: z.number(),
  parent_name: z.string().nullable(),
  parent_phone: z.string().nullable(),
  parent_email: z.string().email().nullable(),
  address: z.string().nullable(),
  enrollment_date: z.coerce.date(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Student = z.infer<typeof studentSchema>;

// Payment schema
export const paymentSchema = z.object({
  id: z.number(),
  student_id: z.number(),
  payment_reference: z.string(), // Unique payment reference
  arrears_type: arrearsTypeEnum,
  amount_paid: z.number(),
  payment_date: z.coerce.date(),
  payment_status: paymentStatusEnum,
  payment_period: z.string(), // e.g., "2024-01", "Term 1 2024"
  notes: z.string().nullable(),
  receipt_number: z.string().nullable(),
  created_by: z.string(), // Administrator who recorded the payment
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Payment = z.infer<typeof paymentSchema>;

// Input schemas for creating data
export const createClassInputSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  level: z.string().min(1, "Class level is required"),
  description: z.string().nullable()
});

export type CreateClassInput = z.infer<typeof createClassInputSchema>;

export const createStudentInputSchema = z.object({
  student_id: z.string().min(1, "Student ID is required"),
  name: z.string().min(1, "Student name is required"),
  class_id: z.number().positive("Valid class ID is required"),
  parent_name: z.string().nullable(),
  parent_phone: z.string().nullable(),
  parent_email: z.string().email().nullable(),
  address: z.string().nullable(),
  enrollment_date: z.coerce.date()
});

export type CreateStudentInput = z.infer<typeof createStudentInputSchema>;

export const createPaymentInputSchema = z.object({
  student_id: z.number().positive("Valid student ID is required"),
  arrears_type: arrearsTypeEnum,
  amount_paid: z.number().positive("Amount must be positive"),
  payment_date: z.coerce.date(),
  payment_status: paymentStatusEnum,
  payment_period: z.string().min(1, "Payment period is required"),
  notes: z.string().nullable(),
  created_by: z.string().min(1, "Creator is required")
});

export type CreatePaymentInput = z.infer<typeof createPaymentInputSchema>;

// Input schemas for updating data
export const updateClassInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Class name is required").optional(),
  level: z.string().min(1, "Class level is required").optional(),
  description: z.string().nullable().optional()
});

export type UpdateClassInput = z.infer<typeof updateClassInputSchema>;

export const updateStudentInputSchema = z.object({
  id: z.number(),
  student_id: z.string().min(1, "Student ID is required").optional(),
  name: z.string().min(1, "Student name is required").optional(),
  class_id: z.number().positive("Valid class ID is required").optional(),
  parent_name: z.string().nullable().optional(),
  parent_phone: z.string().nullable().optional(),
  parent_email: z.string().email().nullable().optional(),
  address: z.string().nullable().optional(),
  enrollment_date: z.coerce.date().optional(),
  is_active: z.boolean().optional()
});

export type UpdateStudentInput = z.infer<typeof updateStudentInputSchema>;

export const updatePaymentInputSchema = z.object({
  id: z.number(),
  student_id: z.number().positive("Valid student ID is required").optional(),
  arrears_type: arrearsTypeEnum.optional(),
  amount_paid: z.number().positive("Amount must be positive").optional(),
  payment_date: z.coerce.date().optional(),
  payment_status: paymentStatusEnum.optional(),
  payment_period: z.string().min(1, "Payment period is required").optional(),
  notes: z.string().nullable().optional(),
  receipt_number: z.string().nullable().optional()
});

export type UpdatePaymentInput = z.infer<typeof updatePaymentInputSchema>;

// Query input schemas
export const searchPaymentsInputSchema = z.object({
  student_name: z.string().optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  payment_status: paymentStatusEnum.optional(),
  arrears_type: arrearsTypeEnum.optional(),
  class_id: z.number().optional(),
  limit: z.number().int().positive().max(100).default(50),
  offset: z.number().int().nonnegative().default(0)
});

export type SearchPaymentsInput = z.infer<typeof searchPaymentsInputSchema>;

export const studentPaymentHistoryInputSchema = z.object({
  student_id: z.number().positive("Valid student ID is required"),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional()
});

export type StudentPaymentHistoryInput = z.infer<typeof studentPaymentHistoryInputSchema>;

export const monthlyReportInputSchema = z.object({
  year: z.number().int().min(2020).max(2030),
  month: z.number().int().min(1).max(12),
  class_id: z.number().optional(),
  arrears_type: arrearsTypeEnum.optional()
});

export type MonthlyReportInput = z.infer<typeof monthlyReportInputSchema>;

export const receiptInputSchema = z.object({
  payment_id: z.number().positive("Valid payment ID is required")
});

export type ReceiptInput = z.infer<typeof receiptInputSchema>;

// Response schemas
export const monthlyReportSchema = z.object({
  year: z.number(),
  month: z.number(),
  total_amount: z.number(),
  total_payments: z.number(),
  payments_by_type: z.record(arrearsTypeEnum, z.number()),
  payments_by_status: z.record(paymentStatusEnum, z.number())
});

export type MonthlyReport = z.infer<typeof monthlyReportSchema>;

export const receiptSchema = z.object({
  payment_id: z.number(),
  receipt_number: z.string(),
  student_name: z.string(),
  student_id: z.string(),
  class_name: z.string(),
  arrears_type: arrearsTypeEnum,
  amount_paid: z.number(),
  payment_date: z.coerce.date(),
  payment_period: z.string(),
  notes: z.string().nullable(),
  created_by: z.string()
});

export type Receipt = z.infer<typeof receiptSchema>;