import mongoose, { Schema, Document } from 'mongoose';
import { IStudent } from '../types';

export interface IStudentDocument extends IStudent, Document {}

const UniversitySchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  country: { type: String, required: true },
  ranking: Number,
  major: { type: String, required: true },
  requirements: {
    minGPA: Number,
    standardizedTests: [{
      type: String,
      minScore: Number
    }],
    other: [String]
  }
}, { _id: false });

const SubjectSchema = new Schema({
  name: { type: String, required: true },
  level: { type: String, required: true },
  currentGrade: { type: String, required: true },
  teacher: { type: String, required: true },
  credits: { type: Number, required: true }
}, { _id: false });

const TestScoreSchema = new Schema({
  type: {
    type: String,
    enum: ['SAT', 'ACT', 'TOEFL', 'IELTS', 'AP', 'A-Level', 'IB'],
    required: true
  },
  score: { type: Schema.Types.Mixed, required: true },
  date: { type: Date, required: true },
  percentile: Number
}, { _id: false });

const TeacherRoleSchema = new Schema({
  teacherId: { type: String, required: true },
  role: {
    type: String,
    enum: ['subject_teacher', 'counselor', 'homeroom_teacher', 'coordinator'],
    required: true
  },
  subjects: [String],
  startDate: { type: Date, required: true }
}, { _id: false });

const StudentSchema = new Schema<IStudentDocument>({
  basicInfo: {
    name: { type: String, required: true },
    grade: { type: String, required: true },
    class: { type: String, required: true },
    enrollmentDate: { type: Date, required: true },
    studentId: { type: String, required: true, unique: true }
  },
  targetUniversities: {
    primary: { type: UniversitySchema, required: true },
    alternatives: [UniversitySchema],
    lastUpdated: { type: Date, default: Date.now },
    updateReason: String
  },
  academicStatus: {
    currentGPA: { type: Number, required: true, min: 0, max: 4.0 },
    subjects: [SubjectSchema],
    standardizedTests: [TestScoreSchema]
  },
  relatedTeachers: [TeacherRoleSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
StudentSchema.index({ 'basicInfo.studentId': 1 });
StudentSchema.index({ 'basicInfo.grade': 1, 'basicInfo.class': 1 });
StudentSchema.index({ 'relatedTeachers.teacherId': 1 });

// Virtual for full name
StudentSchema.virtual('fullName').get(function() {
  return this.basicInfo.name;
});

// Methods
StudentSchema.methods.addTeacher = function(teacherRole: any) {
  const existingIndex = this.relatedTeachers.findIndex(
    (t: any) => t.teacherId === teacherRole.teacherId && t.role === teacherRole.role
  );
  
  if (existingIndex === -1) {
    this.relatedTeachers.push(teacherRole);
  } else {
    this.relatedTeachers[existingIndex] = teacherRole;
  }
  
  return this.save();
};

StudentSchema.methods.updateTargetUniversity = function(university: any, reason: string) {
  this.targetUniversities.primary = university;
  this.targetUniversities.lastUpdated = new Date();
  this.targetUniversities.updateReason = reason;
  return this.save();
};

export const Student = mongoose.model<IStudentDocument>('Student', StudentSchema);