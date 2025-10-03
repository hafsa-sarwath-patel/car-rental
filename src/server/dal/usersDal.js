import prisma from "@/lib/prisma";

export const getUsers = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { name: "asc" },
    }),
    prisma.user.count(),
  ]);
  return { data, total };
};

export const createUser = async (payload) => {
  return prisma.user.create({ data: payload });
};

// if you have update/delete routes later:
export const updateUser = async (id, data) =>
  prisma.user.update({ where: { id }, data });

export const deleteUser = async (id) =>
  prisma.user.delete({ where: { id } });
