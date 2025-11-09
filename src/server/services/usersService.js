import * as userDal from "@/server/dal/usersDal";
import bcrypt from "bcryptjs";

export const listUsers = (page, limit) => userDal.getUsers({ page, limit });

export const registerUser = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const { name, ...userData } = user;
  return userDal.createUser({ ...userData, password: hashedPassword });
};

// add update/remove if you need them
export const modifyUser = async (id, data) => {
  // only hash password if it’s being updated
  const updateData = { ...data };
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }
  return userDal.updateUser(id, updateData);
};

