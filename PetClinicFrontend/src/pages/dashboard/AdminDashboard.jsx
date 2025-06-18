import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  getAllVisits,
} from "@/services/api";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const [owners, setOwners] = useState([]);
  const [pets, setPets] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const loadData = async () => {
    setLoading(true);
    try {
      const [ownersRes, petsRes, visitsRes] = await Promise.all([
        getAllOwners(),
        getAllPets(),
        getAllVisits(),
      ]);

      setOwners(Array.isArray(ownersRes.data) ? ownersRes.data : []);
      setPets(Array.isArray(petsRes.data) ? petsRes.data : []);
      setVisits(Array.isArray(visitsRes.data) ? visitsRes.data : []);
    } catch (error) {
      console.error("❌ Error fetching admin dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [location.state?.refresh]);

  const monthOrder = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const chartData = visits
    .reduce((acc, visit) => {
      const date = new Date(visit.visitDate);
      const month = date.toLocaleString("default", { month: "short" });

      const existing = acc.find((item) => item.name === month);
      if (existing) {
        existing.appointments += 1;
      } else {
        acc.push({ name: month, appointments: 1 });
      }
      return acc;
    }, [])
    .sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <Button
          onClick={loadData}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          🔁 Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Owners"
          count={owners.length}
          loading={loading}
          className="bg-green-100 text-green-900"
        />
        <StatCard
          title="Total Pets"
          count={pets.length}
          loading={loading}
          className="bg-gray-100 text-gray-800"
        />
        <StatCard
          title="Appointments"
          count={visits.length}
          loading={loading}
          className="bg-black text-white"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Monthly Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="appointments"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-500 text-center">
                No appointment data to display.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Pet Category Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Coming soon: Visual breakdown of species or breed types.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ title, count, loading, className }) => (
  <Card className={`${className} shadow hover:shadow-lg transition duration-200`}>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-4xl font-bold animate-fadeIn">
        {loading ? "--" : count}
      </p>
    </CardContent>
  </Card>
);

export default AdminDashboard;
