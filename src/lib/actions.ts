"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export async function markLessonComplete(lessonId: string, slug: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  await prisma.progress.update({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId,
      },
    },
    data: { completed: true, completedAt: new Date() },
  });

  revalidatePath(`/lessons/${slug}`);
  return { success: true };
}