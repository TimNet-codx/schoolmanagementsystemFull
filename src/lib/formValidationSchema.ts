import z from "zod";

// Subject Schema
export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required" }),
  teachers: z.array(z.string()),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

// Class Schema
export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Class name is required" }),
  capacity: z.coerce
    .number()
    .min(1, { message: "Capacity must be at least 1" }),
  gradeId: z.coerce.number().min(1, { message: "Grade must be at least 1" }),
  supervisorId: z.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

// Teacher Schema
export const teacherSchema = z.object({
  id: z.string().optional(),
  // username: z
  //   .string()
  //   .min(3, { message: "Username must be at least 3 characters long!" })
  //   .max(20, { message: "Username must be at most 20 characters long!" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "Username can only contain letters, numbers, - or _",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Password must contain numbers, least one uppercase, and uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  // phone: z.string().min(1, { message: "Phone is required!" }),
  // address: z.string().min(1, { message: "Address is required!" }),
  phone: z.string().optional(),
  address: z.string(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  // img: z.instanceof(File, { message: "Image is required" }),
  img: z.string().optional(),
  subjects: z.array(z.string()).optional(), // store the subject IDs as strings in the subjects array
});

export type TeacherSchema = z.infer<typeof teacherSchema>;
