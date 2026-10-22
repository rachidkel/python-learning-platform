"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MoreHorizontal, Shield, Award, Trash2, X, Loader2, BookOpen, Code2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { grantCertificate, changeUserRole, deleteUser, markCourseComplete, getUserSubmissions } from "../actions";
import { useRouter } from "next/navigation";

export function UsersTable({ users, courses }: { users: any[], courses: any[] }) {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState<{ missions: any[], projects: any[] } | null>(null);
  const router = useRouter();

  async function handleGrantCert(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const projectId = formData.get("projectId") as string;

    await grantCertificate(selectedUser.id, projectId, title);
    setLoading(false);
    setSelectedUser(null);
    router.refresh();
  }

  async function handleRoleToggle() {
    setLoading(true);
    const newRole = selectedUser.role === "ADMIN" ? "STUDENT" : "ADMIN";
    await changeUserRole(selectedUser.id, newRole);
    setLoading(false);
    setSelectedUser(null);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Are you sure? This will delete the user and ALL their data.")) return;
    setLoading(true);
    await deleteUser(selectedUser.id);
    setLoading(false);
    setSelectedUser(null);
    router.refresh();
  }

  async function handleCompleteCourse(courseSlug: string) {
    setLoading(true);
    await markCourseComplete(selectedUser.id, courseSlug);
    setLoading(false);
    router.refresh();
  }

  async function handleViewSubmissions() {
    setLoading(true);
    const data = await getUserSubmissions(selectedUser.id);
    if ("missions" in data && "projects" in data) {
      setSubmissions(data);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-ink-900">Manage Users</h2>
      </div>

      <div className="rounded-xl border border-ink-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50 text-ink-600 border-b border-ink-200">
            <tr>
              <th className="px-6 py-3 font-semibold">User</th>
              <th className="px-6 py-3 font-semibold">Role</th>
              <th className="px-6 py-3 font-semibold">XP</th>
              <th className="px-6 py-3 font-semibold">Lessons</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {users.map((user) => {
              const xp = user.xpEvents.reduce((sum: number, e: any) => sum + e.amount, 0);
              const lessons = user.progress.filter((p: any) => p.completed).length;

              return (
                <tr key={user.id} className="hover:bg-ink-50/50 transition">
                  <td className="px-6 py-4">
                    <p className="font-medium text-ink-900">{user.name || "Anonymous"}</p>
                    <p className="text-xs text-ink-500">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.role === "ADMIN" ? "bg-rose-100 text-rose-700" : "bg-brand-100 text-brand-700"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-ink-800">{xp} XP</td>
                  <td className="px-6 py-4 text-ink-600">{lessons}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(user); setSubmissions(null); }}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-xl bg-white p-6 shadow-xl relative animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-ink-400 hover:text-ink-900 z-10"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="text-lg font-bold text-ink-900 mb-1">Manage {selectedUser.name}</h3>
            <p className="text-sm text-ink-500 mb-6">{selectedUser.email}</p>

            <div className="grid md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                {/* Grant Certificate Form */}
                <form onSubmit={handleGrantCert} className="p-4 border border-ink-200 rounded-lg bg-ink-50">
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                    <Award className="h-4 w-4 text-brand-600" /> Grant Certificate
                  </h4>
                  <input 
                    type="text" 
                    name="title" 
                    placeholder="Title (e.g. Python Master)"
                    required
                    className="w-full rounded-md border border-ink-300 px-3 py-2 text-sm mb-2"
                  />
                  <select name="projectId" className="w-full rounded-md border border-ink-300 px-3 py-2 text-sm mb-3">
                    <option value="none">General Award</option>
                    <option value="calculator">Build a Calculator</option>
                    <option value="snake-game">Snake Game</option>
                  </select>
                  <Button type="submit" disabled={loading} size="sm" className="w-full">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Certificate"}
                  </Button>
                </form>

                {/* Complete Course Form */}
                <div className="p-4 border border-ink-200 rounded-lg">
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                    <BookOpen className="h-4 w-4 text-brand-600" /> Complete a Course
                  </h4>
                  <select 
                    className="w-full rounded-md border border-ink-300 px-3 py-2 text-sm mb-2"
                    onChange={(e) => handleCompleteCourse(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Select a course to complete...</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.slug}>{c.title}</option>
                    ))}
                  </select>
                </div>

                {/* Role Toggle & Delete */}
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" onClick={handleRoleToggle} disabled={loading}>
                    <Shield className="mr-2 h-4 w-4" /> Make {selectedUser.role === "ADMIN" ? "Student" : "Admin"}
                  </Button>
                  <Button variant="danger" size="sm" onClick={handleDelete} disabled={loading}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete User
                  </Button>
                </div>
              </div>

              {/* View Submissions */}
              <div className="p-4 border border-ink-200 rounded-lg bg-ink-50 flex flex-col h-[400px]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-brand-600" /> Submissions
                  </h4>
                  <Button size="sm" variant="outline" onClick={handleViewSubmissions} disabled={loading}>
                    {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Load"}
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3">
                  {!submissions ? (
                    <p className="text-xs text-ink-500 text-center mt-10">Click "Load" to view user code.</p>
                  ) : (
                    <>
                      {submissions.missions.map(m => (
                        <div key={m.id} className="bg-white p-3 rounded border border-ink-200 text-xs">
                          <p className="font-bold text-ink-800 mb-1">Mission: {m.mission.title}</p>
                          <pre className="bg-ink-900 text-ink-100 p-2 rounded overflow-x-auto">{m.code}</pre>
                        </div>
                      ))}
                      {submissions.projects.map(p => (
                        <div key={p.id} className="bg-white p-3 rounded border border-ink-200 text-xs">
                          <p className="font-bold text-ink-800 mb-1">Project: {p.project.title}</p>
                          <pre className="bg-ink-900 text-ink-100 p-2 rounded overflow-x-auto">{p.code}</pre>
                        </div>
                      ))}
                      {submissions.missions.length === 0 && submissions.projects.length === 0 && (
                        <p className="text-xs text-ink-500 text-center mt-10">No submissions yet.</p>
                      )}
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}