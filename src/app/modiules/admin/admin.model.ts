/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';

import bcrypt from 'bcrypt';
import config from '../../config';
import { TAdmin } from './admin.interface';


const adminSchema = new Schema<TAdmin>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    id: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  {
    timestamps: true,
  },
);

// add hashing password
adminSchema.pre('save', async function (next) {
  // hashing password and save into db
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

//   validate the user is already exists
adminSchema.pre('save', async function (next) {
  const user = this;
  const existingUser = await adminModel.findOne({ email: user.email });
  if (existingUser) {
    const error = new Error('Email already exists');
    return next(error);
  }

  next();
});

//   removing the password after successfully create a user
adminSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.id;
    return ret;
  },
});

export const adminModel = model<TAdmin>('admin', adminSchema);