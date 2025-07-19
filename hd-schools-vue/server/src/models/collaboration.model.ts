import mongoose, { Schema, Document } from 'mongoose';
import { ICollaborationRecord } from '../types';

export interface ICollaborationDocument extends ICollaborationRecord, Document {}

const DecisionSchema = new Schema({
  id: { type: String, required: true },
  content: { type: String, required: true },
  madeBy: [{ type: String, required: true }],
  timestamp: { type: Date, default: Date.now },
  implemented: { type: Boolean, default: false }
}, { _id: false });

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

const CollaborationSchema = new Schema<ICollaborationDocument>({
  studentId: { type: String, required: true, ref: 'Student' },
  participants: [{ type: String, required: true, ref: 'User' }],
  type: {
    type: String,
    enum: ['meeting', 'discussion', 'decision', 'update', 'review'],
    required: true
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  decisions: [DecisionSchema],
  actionItems: [ActionItemSchema],
  timestamp: { type: Date, default: Date.now },
  duration: Number, // in minutes
  attachments: [AttachmentSchema],
  tags: [String]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
CollaborationSchema.index({ studentId: 1, timestamp: -1 });
CollaborationSchema.index({ participants: 1 });
CollaborationSchema.index({ type: 1 });
CollaborationSchema.index({ tags: 1 });
CollaborationSchema.index({ timestamp: -1 });

// Virtual for meeting date formatting
CollaborationSchema.virtual('formattedDate').get(function() {
  return this.timestamp.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Methods
CollaborationSchema.methods.addDecision = function(decision: any) {
  this.decisions.push({
    ...decision,
    id: new mongoose.Types.ObjectId().toString(),
    timestamp: new Date()
  });
  return this.save();
};

CollaborationSchema.methods.addActionItem = function(actionItem: any) {
  this.actionItems.push({
    ...actionItem,
    id: new mongoose.Types.ObjectId().toString()
  });
  return this.save();
};

CollaborationSchema.methods.completeActionItem = function(actionItemId: string, completedBy: string) {
  const item = this.actionItems.find((item: any) => item.id === actionItemId);
  if (item) {
    item.completed = true;
    item.completedAt = new Date();
    item.completedBy = completedBy;
    return this.save();
  }
  throw new Error('Action item not found');
};

export const Collaboration = mongoose.model<ICollaborationDocument>('Collaboration', CollaborationSchema);