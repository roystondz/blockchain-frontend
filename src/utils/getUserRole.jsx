// src/utils/getUserRole.js

const getUserRole = (userId) => {
  if (!userId) return null;
  if (userId.startsWith("ADMIN")) return "admin";
  if (userId.startsWith("HOSP")) return "hospital";
  if (userId.startsWith("DOC")) return "doctor";
  if (userId.startsWith("PAT")) return "patient";
  return null;
};

export default getUserRole;
