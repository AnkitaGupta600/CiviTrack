// pages/Resolved.jsx
import React, { useEffect, useState } from "react";
import { getResolvedComplaints } from "../../api/complaint/complaintConfig";
import ComplaintCardGrid from "../../components/ComplaintCardGrid";
import { Button } from "@/components/ui/button";
import ChatDrawer from "../../components/ChatDrawer";
import { useUser } from "../../hooks/useUser";

const Resolved = () => {
  const [complaints, setComplaints] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getResolvedComplaints();
        setComplaints(data.data || []);
      } catch (err) {
        console.error("Error fetching resolved complaints:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6">Loading resolved complaints...</div>;

  return (
    <>
      <ComplaintCardGrid
        title={`✅ Resolved Complaints (${complaints.length})`}
        complaints={complaints}
        showCount={true}
        showUserDetails={true}
        actionComponent={(complaint) => (
          <Button
            onClick={() => {
              setActiveComplaint(complaint);
              setDrawerOpen(true);
            }}
            variant="outline"
            size="sm"
          >
            View
          </Button>
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

export default Resolved;
