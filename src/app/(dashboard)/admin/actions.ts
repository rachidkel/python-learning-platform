"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

async function verifyAdmin() {
  const session = await auth();
  if (!session?.user?.id) return false;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  return user?.role === "ADMIN";
}

// ─── User Management ───
export async function grantCertificate(userId: string, projectId: string, title: string) {
  if (!(await verifyAdmin())) return { error: "Unauthorized" };

  await prisma.certificate.create({
    data: {
      userId,
      projectId: projectId === "none" ? null : projectId,
      title,
    },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin/certificates");
  return { success: true };
}

export async function changeUserRole(userId: string, role: string) {
  if (!(await verifyAdmin())) return { error: "Unauthorized" };

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  if (!(await verifyAdmin())) return { error: "Unauthorized" };

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
  return { success: true };
}

// ─── Certificate Management ───
export async function revokeCertificate(certificateId: string) {
  if (!(await verifyAdmin())) return { error: "Unauthorized" };

  await prisma.certificate.delete({ where: { id: certificateId } });
  
  revalidatePath("/admin/certificates");
  revalidatePath(`/admin/users`);
  return { success: true };
}

// ─── Course Progress Management ───
export async function markCourseComplete(userId: string, courseSlug: string) {
  if (!(await verifyAdmin())) return { error: "Unauthorized" };

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: { lessons: true },
  });

  if (!course) return { error: "Course not found" };

  // Mark every lesson as complete for this user
  for (const lesson of course.lessons) {
    await prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
      update: { completed: true, completedAt: new Date() },
      create: { userId, lessonId: lesson.id, completed: true, completedAt: new Date() },
    });
  }

  revalidatePath("/admin/users");
  revalidatePath("/dashboard");
  return { success: true };
}

// ─── View User Submissions ───
export async function getUserSubmissions(userId: string) {
  if (!(await verifyAdmin())) return { error: "Unauthorized" };

  const [missions, projects] = await Promise.all([
    prisma.missionSubmission.findMany({
      where: { userId },
      include: { mission: true },
      orderBy: { submittedAt: "desc" },
    }),
    prisma.projectSubmission.findMany({
      where: { userId },
      include: { project: true },
      orderBy: { submittedAt: "desc" },
    })
  ]);

  return { missions, projects };
}