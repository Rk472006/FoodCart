import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import axios from "axios";

export default function ProtectedAdminRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return setIsAdmin(false);

      try {
        const res = await axios.get(`${import.meta.env.VITE_EXPRESS_API}/api/user/${user.uid}`);
        setIsAdmin(res.data.isAdmin);
      } catch (error) {
        console.error("Admin check failed:", error);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isAdmin === null) return <div>Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}
