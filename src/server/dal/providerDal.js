import  prisma from "@/lib/prisma" 

export const providerDal = {
  async create(data) {
    return prisma.provider.create({ data })
  },

  async findAll() {
    const providers = await prisma.provider.findMany({
      orderBy: { createdAt: 'desc' },
      // Don’t fail if city/state is missing
      include: {
        city: true,   // will be null if cityId is invalid
        state: true,  // will be null if stateId is invalid
      },
    });
     return providers.map(p => ({
      ...p,
      city: p.city || null,
      state: p.state || null,
    }));
  },

  async findById(id) {
    return prisma.provider.findUnique({
      where: { id },
      include: { city: true, state: true },
    })
  },

  async update(id, data) {
    return prisma.provider.update({
      where: { id },
      data,
    })
  },

  async remove(id) {
    return prisma.provider.delete({ where: { id } })
  },

  async existsByEmailOrMobile(email, mobile) {
    return prisma.provider.findFirst({
      where: {
        OR: [{ email }, { mobile }],
      },
      select: { id: true },
    })
  },
}
