"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export async function markLessonComplete(lessonId: string, slug: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const userId = session.user.id;

  await prisma.progress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { completed: true, completedAt: new Date() },
    create: { userId, lessonId, completed: true, completedAt: new Date() },
  });

  const existingXp = await prisma.xpEvent.findFirst({
    where: { userId, reason: `LESSON_COMPLETED_${lessonId}` },
  });

  if (!existingXp) {
    await prisma.xpEvent.create({
      data: { userId, amount: 20, reason: `LESSON_COMPLETED_${lessonId}` },
    });
  }

  revalidatePath(`/lessons/${slug}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function completeMission(missionId: string, xpReward: number, code: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const userId = session.user.id;

  await prisma.missionSubmission.create({
    data: { userId, missionId, code, passed: true },
  });

  const existingXp = await prisma.xpEvent.findFirst({
    where: { userId, reason: `MISSION_${missionId}` },
  });

  if (!existingXp) {
    await prisma.xpEvent.create({
      data: { userId, amount: xpReward, reason: `MISSION_${missionId}` },
    });
  }

  revalidatePath("/missions");
  revalidatePath("/dashboard");
  return { success: true, isFirstTime: !existingXp };
}

export async function completeQuiz(
  quizId: string,
  score: number,
  total: number,
  xpReward: number,
  wrongQuestionIds: string[] = []
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const userId = session.user.id;

  await prisma.quizAttempt.create({
    data: { userId, quizId, score, total, answers: "{}" },
  });

  const existingXp = await prisma.xpEvent.findFirst({
    where: { userId, reason: `QUIZ_PASSED_${quizId}` },
  });

  if (!existingXp) {
    await prisma.xpEvent.create({
      data: { userId, amount: xpReward, reason: `QUIZ_PASSED_${quizId}` },
    });
  }

  // Add wrong questions to Smart Revision
  for (const questionId of wrongQuestionIds) {
    await prisma.revisionItem.upsert({
      where: { userId_questionId: { userId, questionId } },
      update: { nextReviewAt: new Date() },
      create: {
        userId,
        questionId,
        nextReviewAt: new Date(),
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/revision");
  return { success: true, isFirstTime: !existingXp };
}