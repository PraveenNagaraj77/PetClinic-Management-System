import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getAllOwners,
  getAllPets,
  getAllVets,
  getAllVisits,
} from "@/services/api";
import moment from "moment";

const SuperAdminDashboard = () => {
  const [totalOwners, setTotalOwners] = useState(0);
  const [totalPets, setTotalPets] = useState(0);
  const [totalVets, setTotalVets] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [recentVisits, setRecentVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [ownersRes, petsRes, vetsRes, visitsRes] = await Promise.all([
        getAllOwners(),
        getAllPets(),
        getAllVets(),
        getAllVisits(),
      ]);

      const owners = Array.isArray(ownersRes?.data) ? ownersRes.data : [];
      const pets = Array.isArray(petsRes?.data) ? petsRes.data : [];
      const vets = Array.isArray(vetsRes?.data) ? vetsRes.data : [];
      const visits = Array.isArray(visitsRes?.data) ? visitsRes.data : [];

      setTotalOwners(owners.length);
      setTotalPets(pets.length);
      setTotalVets(vets.length);
      setTotalVisits(visits.length);

      const sortedVisits = [...visits]
        .sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate))
        .slice(0, 5);

      setRecentVisits(sortedVisits);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const chartData = [
    { name: "Owners", count: totalOwners },
    { name: "Pets", count: totalPets },
    { name: "Vets", count: totalVets },
    { name: "Visits", count: totalVisits },
  ];

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">Loading Dashboard...</p>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Super Admin Dashboard</h1>
        <Button
          onClick={loadDashboardData}
          className="bg-sky-600 text-white hover:bg-sky-700"
        >
          🔁 Refresh
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Owners" value={totalOwners} className="bg-indigo-100 text-indigo-900" />
        <StatCard title="Total Pets" value={totalPets} className="bg-blue-100 text-blue-900" />
        <StatCard title="Total Vets" value={totalVets} className="bg-yellow-100 text-yellow-900" />
        <StatCard title="Total Visits" value={totalVisits} className="bg-red-100 text-red-900" />
      </div>

      {/* Chart */}
      <Card className="shadow-md hover:shadow-lg transition">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Clinic Data Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.every(item => item.count === 0) ? (
            <p className="text-center text-sm text-gray-500">
              No data available for chart.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Recent Visits */}
      <Card className="shadow-md hover:shadow-lg transition">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Visits</CardTitle>
        </CardHeader>
        <CardContent>
          {recentVisits.length === 0 ? (
            <p className="text-gray-500">No recent visits found.</p>
          ) : (
            <ul className="space-y-4">
              {recentVisits.map((visit) => {
                const isToday = moment(visit.visitDate).isSame(moment(), 'day');
                return (
                  <li
                    key={visit.id}
                    className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <p className="text-base font-semibold text-gray-800">
                      📝 {visit.description || "No description"}
                    </p>
                    <p className="text-sm text-gray-600">
                      🐶 Pet:{" "}
                      <span className="font-medium">
                        {visit.pet?.name || "Unknown Pet"}
                      </span>{" "}
                      ({visit.pet?.breed || "Unknown Breed"})
                    </p>
                    <p className="text-sm text-gray-600">
                      🧑‍⚕️ Vet:{" "}
                      <span className="font-medium">
                        {visit.vet?.name || "Unknown Vet"}
                      </span>{" "}
                      ({visit.vet?.specialization || "N/A"})
                    </p>
                    <p className={`text-sm ${isToday ? "text-green-600 font-semibold" : "text-gray-500"}`}>
                      📅 Date:{" "}
                      {visit.visitDate
                        ? moment(visit.visitDate).format("DD MMM YYYY")
                        : "N/A"}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard = ({ title, value, className }) => (
  <Card className={`${className} shadow hover:shadow-lg transition`}>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-4xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

export default SuperAdminDashboard;
