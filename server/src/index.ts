import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import all schemas
import {
  createClassInputSchema,
  updateClassInputSchema,
  createStudentInputSchema,
  updateStudentInputSchema,
  createPaymentInputSchema,
  updatePaymentInputSchema,
  searchPaymentsInputSchema,
  studentPaymentHistoryInputSchema,
  monthlyReportInputSchema,
  receiptInputSchema
} from './schema';

// Import all handlers
import { createClass } from './handlers/create_class';
import { getClasses } from './handlers/get_classes';
import { updateClass } from './handlers/update_class';
import { deleteClass } from './handlers/delete_class';
import { createStudent } from './handlers/create_student';
import { getStudents } from './handlers/get_students';
import { getStudentById } from './handlers/get_student_by_id';
import { updateStudent } from './handlers/update_student';
import { deleteStudent } from './handlers/delete_student';
import { createPayment } from './handlers/create_payment';
import { getPayments } from './handlers/get_payments';
import { searchPayments } from './handlers/search_payments';
import { getStudentPaymentHistory } from './handlers/get_student_payment_history';
import { updatePayment } from './handlers/update_payment';
import { deletePayment } from './handlers/delete_payment';
import { getMonthlyReport } from './handlers/get_monthly_report';
import { getPaymentReceipt } from './handlers/get_payment_receipt';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Class management routes
  createClass: publicProcedure
    .input(createClassInputSchema)
    .mutation(({ input }) => createClass(input)),

  getClasses: publicProcedure
    .query(() => getClasses()),

  updateClass: publicProcedure
    .input(updateClassInputSchema)
    .mutation(({ input }) => updateClass(input)),

  deleteClass: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteClass(input.id)),

  // Student management routes
  createStudent: publicProcedure
    .input(createStudentInputSchema)
    .mutation(({ input }) => createStudent(input)),

  getStudents: publicProcedure
    .query(() => getStudents()),

  getStudentById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getStudentById(input.id)),

  updateStudent: publicProcedure
    .input(updateStudentInputSchema)
    .mutation(({ input }) => updateStudent(input)),

  deleteStudent: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteStudent(input.id)),

  // Payment management routes
  createPayment: publicProcedure
    .input(createPaymentInputSchema)
    .mutation(({ input }) => createPayment(input)),

  getPayments: publicProcedure
    .query(() => getPayments()),

  searchPayments: publicProcedure
    .input(searchPaymentsInputSchema)
    .query(({ input }) => searchPayments(input)),

  getStudentPaymentHistory: publicProcedure
    .input(studentPaymentHistoryInputSchema)
    .query(({ input }) => getStudentPaymentHistory(input)),

  updatePayment: publicProcedure
    .input(updatePaymentInputSchema)
    .mutation(({ input }) => updatePayment(input)),

  deletePayment: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deletePayment(input.id)),

  // Reporting routes
  getMonthlyReport: publicProcedure
    .input(monthlyReportInputSchema)
    .query(({ input }) => getMonthlyReport(input)),

  getPaymentReceipt: publicProcedure
    .input(receiptInputSchema)
    .query(({ input }) => getPaymentReceipt(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();