import { auth } from "@clerk/nextjs/server";

const authData = await auth();
const {userId, sessionClaims } = authData;
export const role = (sessionClaims?.metadata as { role?: string })?.role;
export const currentUserId = userId;


export const getAuthUser = async () => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  return { currentUserId: userId, role };
}