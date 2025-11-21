export async function checkServerStatus() {
    try {
      // Replace with your backend health endpoint
      const res = await fetch("http://localhost:3000/status", { method: "GET" });
  
      if (!res.ok) throw new Error("Server not available");
  
      return true; // server is UP
    } catch (err) {
        console.error(err);
      return false; // server is DOWN
    }
  }
  