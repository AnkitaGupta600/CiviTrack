import React, { useEffect, useState } from "react";
import { getAssignedComplaints, fetchPendingComplaints } from "../../api/complaint/complaintConfig";
import { useUser } from "../../hooks/useUser";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const OfficerHome = () => {
  const { user } = useUser();

  const [assigned, setAssigned] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const assignedData = await getAssignedComplaints();
      const pendingData = await fetchPendingComplaints();

      setAssigned(assignedData?.data || []);
      setPending(pendingData || []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">

      {/* Welcome Section */}
      <div className="bg-blue-600 text-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold">
          👋 Welcome, {user?.username || "Officer"}
        </h1>
        <p className="text-sm mt-1">
          Manage and resolve citizen complaints efficiently.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card className="shadow-md">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">🛠 Assigned Complaints</h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {assigned.length}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">🆕 Pending Complaints</h2>
            <p className="text-3xl font-bold text-yellow-500 mt-2">
              {pending.length}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">📊 Total Workload</h2>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {assigned.length + pending.length}
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 rounded-xl shadow space-y-3">
        <h2 className="text-lg font-semibold">⚡ Quick Actions</h2>

        <div className="flex gap-3 flex-wrap">
          <Button onClick={() => window.location.href = "/officer/pending"}>
            View Pending Complaints
          </Button>

          <Button onClick={() => window.location.href = "/officer/assigned"}>
            View Assigned Complaints
          </Button>

          <Button variant="outline">
            Refresh Data
          </Button>
        </div>
      </div>

    </div>
  );
};

export default OfficerHome;