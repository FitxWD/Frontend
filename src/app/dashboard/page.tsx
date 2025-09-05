import RequireAuth from "@/components/RequireAuth";
import Logout from "@/components/Logout";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <div className="p-6">Welcome to your dashboard.</div>
      <Logout />
    </RequireAuth>
  );
}