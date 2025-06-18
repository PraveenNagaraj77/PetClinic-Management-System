import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getVetById } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vet, setVet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVet = async () => {
      try {
        const vetData = await getVetById(id);
        setVet(vetData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load vet details");
      } finally {
        setLoading(false);
      }
    };

    fetchVet();
  }, [id]);

  if (loading) return <p className="text-center p-6 text-lg">Loading vet details...</p>;
  if (!vet) return <p className="text-center p-6 text-red-500">Vet not found.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <Card className="w-full max-w-2xl shadow-lg border border-gray-200">
        <CardContent className="p-8 sm:p-10 space-y-6">
          <div className="text-center border-b pb-4">
            <h2 className="text-3xl font-bold text-blue-700">Vet Profile</h2>
            <p className="text-sm text-gray-500 mt-1">Detailed information about the vet</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="text-sm font-semibold text-gray-500">Name</p>
              <p className="text-lg">{vet.name}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Email</p>
              <p className="text-lg">{vet.email}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Phone</p>
              <p className="text-lg">{vet.phone}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Specialization</p>
              <p className="text-lg">{vet.specialization}</p>
            </div>
          </div>

          <div className="pt-6">
            <Button
              variant="secondary"
              onClick={() => navigate("/vets")}
              className="w-full sm:w-auto"
            >
              ← Back to Vet List
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VetDetail;
