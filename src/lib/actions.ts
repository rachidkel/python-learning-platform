"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export async function markLessonComplete(lessonId: string, slug: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const userId = session.user.id;

  // 1. Mark lesson as complete
  await prisma.progress.upsert({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
    update: { completed: true, completedAt: new Date() },
    create: { userId, lessonId, completed: true, completedAt: new Date() },
  });

  // 2. Award XP (only if they haven't gotten it for this lesson yet)
  const existingXp = await prisma.xpEvent.findFirst({
    where: {
      userId,
      reason: `LESSON_COMPLETED_${lessonId}`,
    },
  });

  if (!existingXp) {
    await prisma.xpEvent.create({
      data: {
        userId,
        amount: 20, // 20 XP per lesson
        reason: `LESSON_COMPLETED_${lessonId}`,
      },
    });
  }

  revalidatePath(`/lessons/${slug}`);
  revalidatePath("/dashboard");
  return { success: true };
}

// ── This is the function used by the Quiz component ──
export async function awardQuizXp(amount: number, reason: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  await prisma.xpEvent.create({
    data: {
      userId: session.user.id,
      amount,
      reason,
    },
  });
  
  // Refresh the dashboard so the XP badge updates
  revalidatePath("/dashboard");
}