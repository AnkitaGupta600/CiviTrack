// Importing necessary functions
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { fetchPendingComplaints } from "../../api/complaint/complaintConfig";
// Import the acceptComplaint function
import { acceptComplaint } from "../../api/complaint/complaintConfig";
import UserDetailsModal from "../../components/UserDetailsModal"; // Update this path based on your folder structure

const NewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch pending complaints from the API
  const getComplaints = async () => {
    setLoading(true);
    const data = await fetchPendingComplaints();
    console.log("Pending complaints:", data);
    setComplaints(data);
    setLoading(false);
  };

  useEffect(() => {
    getComplaints();
  }, []);

  const handleAcceptComplaint = (id) => {
    // Call the imported acceptComplaint function
    acceptComplaint(id)
      .then(() => {
        getComplaints(); // Refresh complaints after accepting
      })
      .catch((error) => {
        console.error("Error accepting complaint:", error);
      });
  };

  if (loading) {
    return <div className="p-6">Loading complaints...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">🆕 New Pending Complaints</h2>

      {complaints.length === 0 ? (
        <p>No pending complaints found.</p>
      ) : (
        <Table>
          <TableCaption>
            Below are the complaints waiting to be accepted.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Citizen</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint._id}>
                <TableCell>{complaint.title}</TableCell>
                <TableCell>{complaint.category}</TableCell>
                <TableCell>{complaint.urgency}</TableCell>
                <TableCell>
                  {new Date(complaint.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{`${complaint.address}`}</TableCell>
                <TableCell>
                  <button
                    onClick={() => {
                      setSelectedUserId(complaint.userId?._id || complaint.userId);
                      setModalOpen(true);
                    }}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-full transition inline-flex"
                    title="View citizen details"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </button>
                </TableCell>
                <TableCell className="text-right">
                  <Button onClick={() => handleAcceptComplaint(complaint._id)}>
                    Accept
                  </Button>
                  <Button
                    className="ml-1 bg-stone-300 text-black border-0.5 hover:bg-stone-400"
                    onClick={() => console.log("Detail clicked")}
                  >
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <UserDetailsModal
        userId={selectedUserId}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedUserId(null);
        }}
      />
    </div>
  );
};

export default NewComplaints;
