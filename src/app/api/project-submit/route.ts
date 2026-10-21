import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, code } = await req.json();
    const userId = session.user.id;

    // 1. Check if the user already submitted this project successfully
    const existingSubmission = await prisma.projectSubmission.findFirst({
      where: { userId, projectId, passed: true }
    });

    // 2. Save the submission (only if they haven't already passed it)
    if (!existingSubmission) {
      await prisma.projectSubmission.create({
        data: { userId, projectId, code, passed: true },
      });

      // 3. Generate the Certificate in the DB
      const project = await prisma.project.findUnique({ where: { id: projectId } });
      
      await prisma.certificate.create({
        data: {
          userId,
          projectId,
          title: `${project?.title} - Certificate of Completion`,
        },
      });
    }

    revalidatePath("/projects");
    revalidatePath(`/projects/${projectId}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit Error:", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}