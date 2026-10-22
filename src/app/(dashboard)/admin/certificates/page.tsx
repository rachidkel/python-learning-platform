import { prisma } from "@/src/lib/prisma";
import { format } from "date-fns";
import { Award, User, Trash2 } from "lucide-react";
import { RevokeButton } from "./revoke-button";

export const instant = false;

export default async function AdminCertificatesPage() {
  const certificates = await prisma.certificate.findMany({
    include: {
      user: true,
      project: true,
    },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-ink-900">All Certificates Issued</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert) => (
          <div key={cert.id} className="rounded-xl border border-ink-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <Award className="h-5 w-5" />
              </div>
              <RevokeButton certificateId={cert.id} />
            </div>
            <h3 className="font-bold text-ink-900 mb-1">{cert.title}</h3>
            <p className="text-sm text-ink-500 mb-4">{cert.project?.title || "General Course"}</p>
            <div className="flex items-center justify-between text-xs text-ink-400 border-t border-ink-100 pt-3">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" /> {cert.user.name || cert.user.email}
              </span>
              <span>{format(cert.issuedAt, "MMM d, yyyy")}</span>
            </div>
          </div>
        ))}

        {certificates.length === 0 && (
          <div className="col-span-full p-12 text-center text-ink-500 border border-dashed border-ink-300 rounded-xl">
            No certificates have been issued yet.
          </div>
        )}
      </div>
    </div>
  );
}