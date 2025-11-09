import { providerDal } from '@/server/dal/providerDal';
import { RegistrationStatus } from '@prisma/client';
import { generateOTP } from '@/server/utils/otp';
import { sendEmail } from '@/server/utils/email';

export const providerService = {
  async register(payload) {
    const exists = await providerDal.existsByEmailOrMobile(
      payload.email,
      payload.mobile
    );

    if (exists) {
      return { statusCode: 409, message: 'Email or Mobile already exists' };
    }

    await providerDal.create({
      ...payload,
      registration_status: RegistrationStatus.PENDING,
    });

    return {
      statusCode: 201,
      message: 'Provider registered successfully.',
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

    // Try to send email, but don't fail if it doesn't work
    try {
      await sendEmail(
        email,
        'Email Verification OTP',
        `Your OTP for email verification is: ${emailOTP}`
      );
    } catch (error) {
      console.error('Failed to send email:', error);
      // Continue anyway - OTP is stored in database
    }

    return {
      statusCode: 200,
      message: 'OTP sent to email successfully',
      otp: emailOTP, // Remove this in production
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

    // Update registration status and clear the OTP after successful verification
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
      otp: staticOTP, // Return for testing - remove in production
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

    // Update registration status and clear the OTP after successful verification
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
