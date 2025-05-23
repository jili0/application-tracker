import mongoose, { Schema } from 'mongoose';
import { IApplication } from '@/types';

const ApplicationSchema = new Schema<IApplication>(
  {
    date: {
      type: String,
      required: false,
      default: ''
    },
    company: {
      type: String,
      required: false,
      default: ''
    },
    position: {
      type: String,
      required: false,
      default: ''
    },
    status: {
      type: String,
      enum: ['answered', 'no-answer', 'rejected'],
      default: 'no-answer'
    },
    remarks: {
      type: String,
      required: false,
      default: ''
    },
    userId: {
      type: String,
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Create model only if it doesn't already exist
const Application = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);

export default Application;