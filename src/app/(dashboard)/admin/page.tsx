import { prisma } from "@/src/lib/prisma";
import { Users, Target, Trophy, Zap, FileCode2, Award } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";

export const instant = false;

export default async function AdminOverviewPage() {
  const [
    totalUsers,
    totalXp,
    totalSubmissions,
    totalMissions,
    totalProjects,
    totalCertificates
  ] = await Promise.all([
    prisma.user.count(),
    prisma.xpEvent.aggregate({ _sum: { amount: true } }),
    prisma.missionSubmission.count(),
    prisma.mission.count(),
    prisma.project.count(),
    prisma.certificate.count(),
  ]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={<Users />} label="Total Users" value={totalUsers.toString()} tint="bg-blue-50 text-blue-600" />
        <StatCard icon={<Zap />} label="Total XP Earned" value={(totalXp._sum.amount || 0).toString()} tint="bg-amber-50 text-amber-600" />
        <StatCard icon={<FileCode2 />} label="Code Submissions" value={totalSubmissions.toString()} tint="bg-emerald-50 text-emerald-600" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={<Target />} label="Coding Missions" value={totalMissions.toString()} tint="bg-brand-50 text-brand-600" />
        <StatCard icon={<Trophy />} label="Real-World Projects" value={totalProjects.toString()} tint="bg-purple-50 text-purple-600" />
        <StatCard icon={<Award />} label="Certificates Issued" value={totalCertificates.toString()} tint="bg-rose-50 text-rose-600" />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, tint }: any) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${tint}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-500">{label}</p>
          <p className="text-xl font-bold text-ink-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}