import { providerDal } from '@/server/dal/providerDal'
import { RegistrationStatus } from '@prisma/client'

export const providerService = {
  async register(payload) {
    const exists = await providerDal.existsByEmailOrMobile(
      payload.email,
      payload.mobile
    )
    if (exists) {
      return { statusCode: 409, message: 'Email or Mobile already exists' }
    }

    await providerDal.create({
      ...payload,
      registration_status: RegistrationStatus.PENDING,
      mobileOTP: Math.floor(100000 + Math.random() * 900000).toString(),
      emailOTP:  Math.floor(100000 + Math.random() * 900000).toString(),
    })

    return { statusCode: 200, message: 'Registered Successfully' }
  },

  async list() {
    return providerDal.findAll()
  },

  async get(id) {
    return providerDal.findById(id)
  },

  async update(id, data) {
    return providerDal.update(id, data)
  },

  async remove(id) {
    return providerDal.remove(id)
  },
}
