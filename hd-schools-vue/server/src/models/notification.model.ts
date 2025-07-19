import mongoose, { Schema, Document } from 'mongoose';
import { INotification } from '../types';

export interface INotificationDocument extends INotification, Document {}

const NotificationSchema = new Schema<INotificationDocument>({
  userId: { type: String, required: true, ref: 'User' },
  type: {
    type: String,
    enum: [
      'milestone_due',
      'milestone_delayed',
      'new_message',
      'pathway_updated',
      'meeting_scheduled',
      'action_assigned'
    ],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  priority: {
    type: String,
    enum: ['urgent', 'high', 'normal', 'low'],
    default: 'normal'
  },
  read: { type: Boolean, default: false },
  readAt: Date,
  relatedEntity: {
    type: {
      type: String,
      enum: ['student', 'milestone', 'pathway', 'meeting']
    },
    id: String
  },
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
NotificationSchema.index({ priority: 1, createdAt: -1 });

// Methods
NotificationSchema.methods.markAsRead = function() {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

// Static methods
NotificationSchema.statics.createMilestoneNotification = function(
  userId: string,
  milestone: any,
  type: 'milestone_due' | 'milestone_delayed'
) {
  const priority = milestone.priority === 'critical' ? 'urgent' : 
                   milestone.priority === 'high' ? 'high' : 'normal';
  
  return this.create({
    userId,
    type,
    title: type === 'milestone_due' ? 
      `里程碑即将到期: ${milestone.title}` : 
      `里程碑已延期: ${milestone.title}`,
    message: type === 'milestone_due' ?
      `里程碑"${milestone.title}"将于${milestone.plannedDate.toLocaleDateString()}到期，请及时处理。` :
      `里程碑"${milestone.title}"已延期，请关注并调整计划。`,
    priority,
    relatedEntity: {
      type: 'milestone',
      id: milestone.id
    }
  });
};

NotificationSchema.statics.getUnreadCount = async function(userId: string) {
  return this.countDocuments({ userId, read: false });
};

export const Notification = mongoose.model<INotificationDocument>('Notification', NotificationSchema);