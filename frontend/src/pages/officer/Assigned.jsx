// pages/AssignedComplaints.jsx
import React, { useEffect, useState } from "react";
import { getAssignedComplaints, resolveComplaint } from "../../api/complaint/complaintConfig";
import ComplaintCardGrid from "../../components/ComplaintCardGrid";
import { Button } from "@/components/ui/button";
import ChatDrawer from "../../components/ChatDrawer";
import { useUser } from "../../hooks/useUser";

const AssignedComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAssignedComplaints();
      setComplaints(data.data || []);
    } catch (err) {
      console.error("Error fetching assigned complaints:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResolve = async (complaintId) => {
    try {
      await resolveComplaint(complaintId);
      // Refresh the data after resolving
      await fetchData();
      setDrawerOpen(false);
      setActiveComplaint(null);
    } catch (error) {
      console.error("Error resolving complaint:", error);
    }
  };

  if (loading) return <div className="p-6">Loading active complaints...</div>;

  return (
    <>
      <ComplaintCardGrid
        title={`🛠 Assigned Complaints (${complaints.length})`}
        complaints={complaints}
        showCount={true}
        showUserDetails={true}
        actionComponent={(complaint) => (
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setActiveComplaint(complaint);
                setDrawerOpen(true);
              }}
              variant="outline"
              size="sm"
            >
              Query
            </Button>
            <Button
              onClick={() => handleResolve(complaint._id)}
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              Resolve
            </Button>
          </div>
        )}
      />

      {user && activeComplaint && (
        <ChatDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          complaintId={activeComplaint._id}
          complaintUserId={activeComplaint.userId?._id || activeComplaint.userId}
          complaintOfficerId={activeComplaint.officerId}
        />
      )}
    </>
  );
};

export default AssignedComplaints;
