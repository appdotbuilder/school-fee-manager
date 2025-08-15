import { serial, text, pgTable, timestamp, numeric, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define enums
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded']);
export const arrearsTypeEnum = pgEnum('arrears_type', ['tuition', 'transport', 'meal', 'uniform', 'books', 'activity', 'other']);

// Classes table
export const classesTable = pgTable('classes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  level: text('level').notNull(),
  description: text('description'), // Nullable by default
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Students table
export const studentsTable = pgTable('students', {
  id: serial('id').primaryKey(),
  student_id: text('student_id').notNull().unique(), // Unique student identifier
  name: text('name').notNull(),
  class_id: integer('class_id').notNull().references(() => classesTable.id),
  parent_name: text('parent_name'), // Nullable
  parent_phone: text('parent_phone'), // Nullable
  parent_email: text('parent_email'), // Nullable
  address: text('address'), // Nullable
  enrollment_date: timestamp('enrollment_date').notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Payments table
export const paymentsTable = pgTable('payments', {
  id: serial('id').primaryKey(),
  student_id: integer('student_id').notNull().references(() => studentsTable.id),
  payment_reference: text('payment_reference').notNull().unique(), // Unique payment reference
  arrears_type: arrearsTypeEnum('arrears_type').notNull(),
  amount_paid: numeric('amount_paid', { precision: 10, scale: 2 }).notNull(),
  payment_date: timestamp('payment_date').notNull(),
  payment_status: paymentStatusEnum('payment_status').notNull(),
  payment_period: text('payment_period').notNull(), // e.g., "2024-01", "Term 1 2024"
  notes: text('notes'), // Nullable
  receipt_number: text('receipt_number'), // Nullable, generated for completed payments
  created_by: text('created_by').notNull(), // Administrator who recorded the payment
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Define relations
export const classesRelations = relations(classesTable, ({ many }) => ({
  students: many(studentsTable)
}));

export const studentsRelations = relations(studentsTable, ({ one, many }) => ({
  class: one(classesTable, {
    fields: [studentsTable.class_id],
    references: [classesTable.id]
  }),
  payments: many(paymentsTable)
}));

export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
  student: one(studentsTable, {
    fields: [paymentsTable.student_id],
    references: [studentsTable.id]
  })
}));

// TypeScript types for the table schemas
export type SchoolClass = typeof classesTable.$inferSelect;
export type NewSchoolClass = typeof classesTable.$inferInsert;

export type Student = typeof studentsTable.$inferSelect;
export type NewStudent = typeof studentsTable.$inferInsert;

export type Payment = typeof paymentsTable.$inferSelect;
export type NewPayment = typeof paymentsTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  classes: classesTable,
  students: studentsTable,
  payments: paymentsTable
};

export const tableRelations = {
  classesRelations,
  studentsRelations,
  paymentsRelations
};