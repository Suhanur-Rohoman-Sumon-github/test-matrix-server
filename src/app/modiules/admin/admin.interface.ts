import mongoose from 'mongoose';

export type TAdmin = {
  payload: mongoose.Schema.Types.ObjectId;
  name: string;
  id: string;
  email: string;
  password: string;
  phone: number;
  address: string;
  role: 'admin';
  user: mongoose.Types.ObjectId;
};