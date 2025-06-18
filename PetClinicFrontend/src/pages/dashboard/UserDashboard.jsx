import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { getMyPets, getMyVisits } from "@/services/api";
import { XCircle, Clock3, CheckCircle2 } from "lucide-react";

// 🔖 Badge Renderer
const getStatusBadge = (visit) => {
  switch (visit.status) {
    case "CANCELLED":
      return (
        <span className="inline-flex items-center text-sm gap-1 text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
          <XCircle size={14} /> Cancelled
        </span>
      );
    case "COMPLETED":
      return (
        <span className="inline-flex items-center text-sm gap-1 text-green-700 bg-green-100 px-2 py-1 rounded-full">
          <CheckCircle2 size={14} /> Completed
        </span>
      );
    case "UPCOMING":
    default:
      return (
        <span className="inline-flex items-center text-sm gap-1 text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
          <Clock3 size={14} /> Upcoming
        </span>
      );
  }
};

const UserDashboard = () => {
  const [pets, setPets] = useState([]);
  const [visits, setVisits] = useState([]);
  const [nextVisit, setNextVisit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true);
        const [petsRes, visitsRes] = await Promise.all([
          getMyPets(),
          getMyVisits(),
        ]);

        const petData = petsRes.data || [];
        const visitData = visitsRes.data || [];

        setPets(petData);
        setVisits(visitData);

        const upcomingVisits = visitData
          .filter((v) => v.status === "UPCOMING")
          .sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate));

        setNextVisit(upcomingVisits[0] || null);
      } catch (err) {
        console.error("❌ Failed to fetch user data", err);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

  const upcomingCount = visits.filter((v) => v.status === "UPCOMING").length;
  const pastCount = visits.filter((v) => v.status === "COMPLETED").length;
  const cancelledCount = visits.filter((v) => v.status === "CANCELLED").length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-xl font-bold text-gray-800">User Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="My Pets" value={pets.length} loading={loading} color="green" />
        <StatCard title="Upcoming Appointments" value={upcomingCount} loading={loading} color="blue" />
        <StatCard title="Past Visits" value={pastCount} loading={loading} color="gray" />
        <StatCard title="Cancelled" value={cancelledCount} loading={loading} color="red" />
      </div>

      {/* Next Visit */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Next Visit Info</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-gray-500">Loading next visit...</p>
          ) : nextVisit ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                🗓️ Your next appointment is on{" "}
                <b>{new Date(nextVisit.visitDate).toLocaleDateString()}</b>
                <br />
                with Dr. <b>{nextVisit.vet?.name}</b> for your pet{" "}
                <b>{nextVisit.pet?.name}</b>.
              </p>
              <div>Status: {getStatusBadge(nextVisit)}</div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              You have no upcoming appointments.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// 🟩 Stat Card Component
const StatCard = ({ title, value, loading, color }) => {
  const colorMap = {
    green: "bg-green-100 text-green-900",
    blue: "bg-blue-100 text-blue-900",
    gray: "bg-gray-100 text-gray-900",
    red: "bg-red-100 text-red-900",
  };

  return (
    <Card className={`${colorMap[color]} shadow hover:shadow-lg transition`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{loading ? "--" : value}</p>
      </CardContent>
    </Card>
  );
};

export default UserDashboard;
