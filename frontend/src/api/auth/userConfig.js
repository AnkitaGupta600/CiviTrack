const serverUrl = import.meta.env.VITE_SERVER_URL;
export const registerUser = async (formData) => {
  const response = await fetch(`${serverUrl}/api/users/register`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.message || "Failed to register");
  }

  return await response.json();
};
export const logoutUser = async () => {
  const response = await fetch(`${serverUrl}/api/users/logout`, {
    method: "POST", // Make sure to send a POST request to logout
    credentials: "include", // To ensure cookies are sent with the request
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.message || "Failed to logout");
  }

  return await response.json();
};

export const getUserById = async (userId) => {
  console.log("getUserById called with:", userId, typeof userId);
  const id = userId?._id || userId;
  console.log("Final id being sent:", id);
  const response = await fetch(`${serverUrl}/api/users/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user details");
  }

  return await response.json();
};
