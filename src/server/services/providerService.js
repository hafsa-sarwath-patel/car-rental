import { providerDal } from '@/server/dal/providerDal';
import { RegistrationStatus } from '@prisma/client';

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
};
