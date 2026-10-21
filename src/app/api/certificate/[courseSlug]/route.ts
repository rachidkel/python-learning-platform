import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseSlug: string }> }
) {
  const { courseSlug } = await params;
  const session = await auth();
  
  if (!session?.user?.name) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  const userName = session.user.name;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Certificate - ${course?.title}</title>
      <style>
        body { font-family: 'Georgia', serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f8fafc; }
        .certificate { border: 10px solid #16a34a; padding: 50px 80px; background: white; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.1); max-width: 800px; }
        h1 { color: #16a34a; font-size: 40px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 2px; }
        h2 { font-size: 32px; color: #1e293b; margin: 30px 0; }
        p { font-size: 18px; color: #475569; line-height: 1.6; }
        .date { margin-top: 40px; font-size: 14px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="certificate">
        <h1>Certificate of Completion</h1>
        <p>This is to certify that</p>
        <h2>${userName}</h2>
        <p>has successfully completed the course</p>
        <h2>${course?.title}</h2>
        <p>on the PyLearn Platform.</p>
        <div class="date">Issued on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
      <script>window.print();</script>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}