import { providerDal } from '@/server/dal/providerDal';
import { RegistrationStatus } from '@prisma/client';
import { generateOTP } from '@/server/utils/otp';
import { sendEmail } from '@/server/utils/email';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const providerService = {
  async register(payload) {
    const { name, username, email, mobile, password } = payload;

    // Check if email, mobile, or username already exists
    const existingByEmail = await providerDal.findByEmail(email);
    const existingByMobile = await providerDal.findByMobile(mobile);
    const existingByUsername = await providerDal.existsByUsername(username);

    if (existingByEmail || existingByMobile || existingByUsername) {
      return { statusCode: 409, message: 'Email, mobile, or username already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await providerDal.create({
      provider_name: name,
      username,
      email,
      mobile,
      password: hashedPassword,
      registration_status: RegistrationStatus.PENDING,
    });

    return {
      statusCode: 201,
      message: 'Provider registered successfully.',
    };
  },

  async login(username, password) {
    const provider = await providerDal.findByUsername(username);

    if (!provider) {
      return { statusCode: 401, message: 'Invalid credentials' };
    }

    const validPassword = await bcrypt.compare(password, provider.password);
    if (!validPassword) {
      return { statusCode: 401, message: 'Invalid credentials' };
    }

    const token = jwt.sign(
      { id: provider.id, username: provider.username, email: provider.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...providerData } = provider;

    return {
      statusCode: 200,
      message: 'Login successful',
      token,
      provider: providerData,
    };
  },

  async list() {
    return providerDal.findAll();
  },

  async sendEmailOTP(email) {
    const provider = await providerDal.findByEmail(email);
    if (!provider) {
      return { statusCode: 404, message: 'Provider not found' };
    }

    const emailOTP = generateOTP();
    await providerDal.update(provider.id, { emailOTP });

    try {
      await sendEmail(
        email,
        'Email Verification OTP',
        `Your OTP for email verification is: ${emailOTP}`
      );
    } catch (error) {
      console.error('Failed to send email:', error);
    }

    return {
      statusCode: 200,
      message: 'OTP sent to email successfully',
      otp: emailOTP,
    };
  },

  async verifyEmailOTP(email, otp) {
    const provider = await providerDal.findByEmail(email);
    if (!provider) {
      return { statusCode: 404, message: 'Provider not found' };
    }

    if (provider.emailOTP !== otp) {
      return { statusCode: 400, message: 'Invalid OTP' };
    }

    await providerDal.update(provider.id, {
      emailOTP: null,
      registration_status: RegistrationStatus.EMAIL_VERIFIED,
    });

    return {
      statusCode: 200,
      message: 'Email verified successfully',
    };
  },

  async sendMobileOTP(mobile) {
    const provider = await providerDal.findByMobile(mobile);
    if (!provider) {
      return { statusCode: 404, message: 'Provider not found' };
    }

    const staticOTP = '123321';
    await providerDal.update(provider.id, { mobileOTP: staticOTP });

    return {
      statusCode: 200,
      message: 'OTP sent to mobile successfully',
      otp: staticOTP,
    };
  },

  async verifyMobileOTP(mobile, otp) {
    const provider = await providerDal.findByMobile(mobile);
    if (!provider) {
      return { statusCode: 404, message: 'Provider not found' };
    }

    if (provider.mobileOTP !== otp) {
      return { statusCode: 400, message: 'Invalid OTP' };
    }

    await providerDal.update(provider.id, {
      mobileOTP: null,
      registration_status: RegistrationStatus.MOBILE_VERIFIED,
    });

    return {
      statusCode: 200,
      message: 'Mobile verified successfully',
    };
  },
};
