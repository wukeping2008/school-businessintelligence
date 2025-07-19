import mongoose, { Schema, Document } from 'mongoose';
import { IPathway, IMilestone, IActionItem } from '../types';

export interface IPathwayDocument extends IPathway, Document {}

const ActionItemSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  assignedTo: { type: String, required: true },
  dueDate: Date,
  completed: { type: Boolean, default: false },
  completedAt: Date,
  completedBy: String,
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  }
}, { _id: false });

const AttachmentSchema = new Schema({
  id: { type: String, required: true },
  filename: { type: String, required: true },
  url: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  type: { type: String, required: true },
  size: { type: Number, required: true }
}, { _id: false });

const MilestoneSchema = new Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ['exam', 'application', 'activity', 'achievement', 'document'],
    required: true
  },
  category: {
    type: String,
    enum: ['academic', 'standardized_test', 'extracurricular', 'application'],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  plannedDate: { type: Date, required: true },
  actualDate: Date,
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'delayed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    required: true
  },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  dependencies: [String],
  assignedTo: [String],
  actionItems: [ActionItemSchema],
  attachments: [AttachmentSchema],
  notes: String
}, { _id: false });

const AdjustmentSchema = new Schema({
  id: { type: String, required: true },
  date: { type: Date, default: Date.now },
  type: {
    type: String,
    enum: ['target_change', 'milestone_adjust', 'timeline_shift'],
    required: true
  },
  description: { type: String, required: true },
  reason: { type: String, required: true },
  madeBy: { type: String, required: true },
  affectedMilestones: [String],
  previousValue: Schema.Types.Mixed,
  newValue: Schema.Types.Mixed
}, { _id: false });

const PathwaySchema = new Schema<IPathwayDocument>({
  studentId: { type: String, required: true, ref: 'Student' },
  targetUniversity: {
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
  },
  milestones: [MilestoneSchema],
  status: {
    type: String,
    enum: ['active', 'completed', 'suspended'],
    default: 'active'
  },
  version: { type: Number, default: 1 },
  adjustmentHistory: [AdjustmentSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
PathwaySchema.index({ studentId: 1, status: 1 });
PathwaySchema.index({ 'milestones.status': 1 });
PathwaySchema.index({ 'milestones.plannedDate': 1 });
PathwaySchema.index({ lastModified: -1 });

// Virtual for progress calculation
PathwaySchema.virtual('overallProgress').get(function() {
  if (!this.milestones || this.milestones.length === 0) return 0;
  
  const totalWeight = this.milestones.reduce((sum, m) => {
    const weight = m.priority === 'critical' ? 3 : m.priority === 'high' ? 2 : 1;
    return sum + weight;
  }, 0);
  
  const weightedProgress = this.milestones.reduce((sum, m) => {
    const weight = m.priority === 'critical' ? 3 : m.priority === 'high' ? 2 : 1;
    return sum + (m.progress * weight);
  }, 0);
  
  return Math.round(weightedProgress / totalWeight);
});

// Methods
PathwaySchema.methods.addMilestone = function(milestone: IMilestone) {
  this.milestones.push(milestone);
  this.version += 1;
  return this.save();
};

PathwaySchema.methods.updateMilestone = function(milestoneId: string, updates: Partial<IMilestone>) {
  const milestone = this.milestones.find((m: any) => m.id === milestoneId);
  if (!milestone) {
    throw new Error('Milestone not found');
  }
  
  Object.assign(milestone, updates);
  this.version += 1;
  return this.save();
};

PathwaySchema.methods.addAdjustment = function(adjustment: any) {
  this.adjustmentHistory.push({
    ...adjustment,
    id: new mongoose.Types.ObjectId().toString(),
    date: new Date()
  });
  this.version += 1;
  return this.save();
};

// Pre-save middleware
PathwaySchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

export const Pathway = mongoose.model<IPathwayDocument>('Pathway', PathwaySchema);