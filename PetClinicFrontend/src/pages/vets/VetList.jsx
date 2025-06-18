import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getAllVets, deleteVet } from "@/services/api";
import { Eye, Pencil, Trash2, UserPlus } from "lucide-react";

const VetList = () => {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchVets = async () => {
      try {
        const data = await getAllVets();
        setVets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error fetching vets:", err);
        toast.error("Failed to load vets");
      } finally {
        setLoading(false);
      }
    };

    fetchVets();
  }, []);

  const handleDelete = async (id) => {
    const role = user?.role;
    if (role !== "SUPERADMIN") {
      toast.error("Access Denied. Only SuperAdmin can delete a Vet.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this vet?");
    if (!confirmed) return;

    try {
      await deleteVet(id);
      toast.success("Vet deleted successfully");
      setVets((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error("❌ Failed to delete vet:", err);
      toast.error("Failed to delete vet");
    }
  };

  if (loading) return <p className="text-center p-6 text-lg">Loading vets...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-4 sm:mb-0">Veterinarians</h2>
        <Button
          onClick={() => navigate("/vets/add")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Vet
        </Button>
      </div>

      {vets.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No veterinarians found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vets.map((vet) => (
            <Card key={vet.id} className="border border-gray-200 shadow hover:shadow-md transition duration-300">
              <CardContent className="p-6 space-y-2">
                <h3 className="text-xl font-bold text-gray-800">{vet.name}</h3>
                <p className="text-sm text-gray-600"><strong>Email:</strong> {vet.email}</p>
                <p className="text-sm text-gray-600"><strong>Phone:</strong> {vet.phone}</p>
                <p className="text-sm text-gray-600"><strong>Specialization:</strong> {vet.specialization}</p>

                <div className="flex flex-wrap gap-2 pt-4">
                  <Button
                    onClick={() => navigate(`/vets/${vet.id}`)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Eye size={16} />
                    View
                  </Button>

                  <Button
                    onClick={() => navigate(`/vets/edit/${vet.id}`)}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Pencil size={16} />
                    Edit
                  </Button>

                  {user?.role === "SUPERADMIN" && (
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(vet.id)}
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VetList;
