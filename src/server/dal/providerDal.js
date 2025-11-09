import  prisma from "@/lib/prisma" 

export const providerDal = {
  async create(data) {
    return prisma.providers.create({ data })
  },

  async findAll() {
    const providers = await prisma.providers.findMany({
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
    return prisma.providers.findUnique({
      where: { id },
      include: { city: true, state: true },
    })
  },

  async update(id, data) {
    return prisma.providers.update({
      where: { id },
      data,
    })
  },

  async remove(id) {
    return prisma.providers.delete({ where: { id } })
  },

  async existsByEmailOrMobile(email, mobile) {
    return prisma.providers.findFirst({
      where: {
        OR: [{ email }, { mobile }],
      },
      select: { id: true },
    })
  },

  async findByEmail(email) {
    return prisma.providers.findUnique({
      where: { email },
    })
  },

  async findByMobile(mobile) {
    return prisma.providers.findUnique({
      where: { mobile },
    })
  },

  async findByUsername(username) {
    return prisma.providers.findUnique({
      where: { username },
    })
  },
}
