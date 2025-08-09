import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string,subject:string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587  ,
    secure: config.node_Env === 'production',
    auth: {
      user: 'sumonsuhanurrohoman@gmail.com',
      pass: 'lzaj rqsg nlvs dsby',
    },
  });

  await transporter.sendMail({
    from: 'sumonsuhanurrohoman@gmail.com', 
    to, 
    subject,
    text: '', 
    html, 
  });
};