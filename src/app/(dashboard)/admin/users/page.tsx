import { prisma } from "@/src/lib/prisma";
import { UsersTable } from "./users-table";

export const instant = false;

export default async function AdminUsersPage() {
  const [users, courses] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { xpEvents: true, progress: true },
    }),
    prisma.course.findMany({ select: { id: true, title: true, slug: true } })
  ]);

  return <UsersTable users={users} courses={courses} />;
}