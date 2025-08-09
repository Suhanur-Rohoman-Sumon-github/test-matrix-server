import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  node_Env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DB_URL,
 bcrypt_salt_round: process.env.BCRYPT_SALT_ROUNDS,
  defaultPassword: process.env.default_password,

  access_secret_key: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  refresh_secret_key: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,

  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  adminProfilePhoto: process.env.ADMIN_PROFILE_PHOTO,
  adminMobileNumber: process.env.ADMIN_MOBILE_NUMBER,

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  email: {
    senderEmail: process.env.SENDER_EMAIL,
    senderAppPass: process.env.SENDER_APP_PASS,
  },

  stripeSecretKey: process.env.STRIPE_SECRET_KEY,

  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
};
