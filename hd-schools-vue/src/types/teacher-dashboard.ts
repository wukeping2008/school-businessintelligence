// 复用后端的类型定义
export interface IUser {
  _id: string;
  username: string;
  email: string;
  role: 'teacher' | 'counselor' | 'admin' | 'parent' | 'student';
  subjects?: string[];
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStudent {
  _id: string;
  basicInfo: {
    name: string;
    grade: string;
    class: string;
    enrollmentDate: Date;
    studentId: string;
  };
  targetUniversities: {
    primary: IUniversity;
    alternatives: IUniversity[];
    lastUpdated: Date;
    updateReason?: string;
  };
  academicStatus: {
    currentGPA: number;
    subjects: ISubject[];
    standardizedTests: ITestScore[];
  };
  relatedTeachers: ITeacherRole[];
  status?: 'normal' | 'attention' | 'risk';
  pathwayProgress?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUniversity {
  id: string;
  name: string;
  country: string;
  ranking?: number;
  major: string;
  requirements: {
    minGPA?: number;
    standardizedTests?: {
      type: string;
      minScore: number;
    }[];
    other?: string[];
  };
}

export interface ISubject {
  name: string;
  level: string;
  currentGrade: string;
  teacher: string;
  credits: number;
}

export interface ITestScore {
  type: 'SAT' | 'ACT' | 'TOEFL' | 'IELTS' | 'AP' | 'A-Level' | 'IB';
  score: number | string;
  date: Date;
  percentile?: number;
}

export interface ITeacherRole {
  teacherId: string;
  role: 'subject_teacher' | 'counselor' | 'homeroom_teacher' | 'coordinator';
  subjects?: string[];
  startDate: Date;
}

export interface IPathway {
  _id: string;
  studentId: string;
  targetUniversity: IUniversity;
  milestones: IMilestone[];
  createdAt: Date;
  lastModified: Date;
  version: number;
  status: 'active' | 'completed' | 'suspended';
  adjustmentHistory: IAdjustment[];
  overallProgress?: number;
}

export interface IMilestone {
  id: string;
  type: 'exam' | 'application' | 'activity' | 'achievement' | 'document';
  category: 'academic' | 'standardized_test' | 'extracurricular' | 'application';
  title: string;
  description: string;
  plannedDate: Date;
  actualDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
  priority: 'critical' | 'high' | 'medium' | 'low';
  progress: number;
  dependencies: string[];
  assignedTo: string[];
  actionItems: IActionItem[];
  attachments: IAttachment[];
  notes?: string;
}

export interface IActionItem {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  dueDate?: Date;
  completed: boolean;
  completedAt?: Date;
  completedBy?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface IAttachment {
  id: string;
  filename: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  type: string;
  size: number;
}

export interface IAdjustment {
  id: string;
  date: Date;
  type: 'target_change' | 'milestone_adjust' | 'timeline_shift';
  description: string;
  reason: string;
  madeBy: string;
  affectedMilestones?: string[];
  previousValue?: any;
  newValue?: any;
}