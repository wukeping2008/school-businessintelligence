import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['teacher', 'counselor', 'admin', 'parent', 'student'],
    required: true
  },
  subjects: [String],
  permissions: [{
    type: String,
    enum: [
      'view_all_students',
      'edit_all_students',
      'view_assigned_students',
      'edit_assigned_students',
      'manage_pathways',
      'manage_milestones',
      'create_collaborations',
      'view_reports',
      'manage_users',
      'system_admin'
    ]
  }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      const { password, ...result } = ret;
      return result;
    }
  }
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ role: 1 });

// Pre-save middleware for password hashing
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Set default permissions based on role
UserSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('role')) {
    switch (this.role) {
      case 'admin':
        this.permissions = [
          'view_all_students',
          'edit_all_students',
          'manage_pathways',
          'manage_milestones',
          'create_collaborations',
          'view_reports',
          'manage_users',
          'system_admin'
        ];
        break;
      case 'counselor':
        this.permissions = [
          'view_all_students',
          'edit_all_students',
          'manage_pathways',
          'manage_milestones',
          'create_collaborations',
          'view_reports'
        ];
        break;
      case 'teacher':
        this.permissions = [
          'view_assigned_students',
          'edit_assigned_students',
          'manage_milestones',
          'create_collaborations'
        ];
        break;
      case 'parent':
        this.permissions = [
          'view_assigned_students'
        ];
        break;
      case 'student':
        this.permissions = [
          'view_assigned_students'
        ];
        break;
    }
  }
  next();
});

// Methods
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

UserSchema.methods.hasPermission = function(permission: string): boolean {
  return this.permissions.includes(permission) || this.permissions.includes('system_admin');
};

// Virtual for display name
UserSchema.virtual('displayName').get(function() {
  return this.username;
});

export const User = mongoose.model<IUserDocument>('User', UserSchema);