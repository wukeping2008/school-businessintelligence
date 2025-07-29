export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'teacher' | 'counselor' | 'admin' | 'parent' | 'student';
  subjects?: string[];
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStudent {
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
  progress: number; // 0-100
  dependencies: string[]; // Other milestone IDs
  assignedTo: string[]; // Teacher IDs
  actionItems: IActionItem[];
  attachments: IAttachment[];
  notes?: string;
}

export interface IActionItem {
  id: string;
  title: string;
  description?: string;
  assignedTo: string; // Teacher ID
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

export interface ICollaborationRecord {
  _id: string;
  studentId: string;
  participants: string[]; // Teacher IDs
  type: 'meeting' | 'discussion' | 'decision' | 'update' | 'review';
  title: string;
  content: string;
  decisions?: IDecision[];
  actionItems: IActionItem[];
  timestamp: Date;
  duration?: number; // in minutes
  attachments: IAttachment[];
  tags?: string[];
}

export interface IDecision {
  id: string;
  content: string;
  madeBy: string[];
  timestamp: Date;
  implemented: boolean;
}

export interface INotification {
  _id: string;
  userId: string;
  type: 'milestone_due' | 'milestone_delayed' | 'new_message' | 'pathway_updated' | 'meeting_scheduled' | 'action_assigned';
  title: string;
  message: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  read: boolean;
  readAt?: Date;
  relatedEntity?: {
    type: 'student' | 'milestone' | 'pathway' | 'meeting';
    id: string;
  };
  createdAt: Date;
  expiresAt?: Date;
}

export interface IActivity {
  _id: string;
  userId: string;
  action: string;
  entityType: 'student' | 'pathway' | 'milestone' | 'collaboration';
  entityId: string;
  details?: any;
  timestamp: Date;
  ip?: string;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser & { _id: string };
    }
  }
}