import { useEffect, useState } from "react";

import { auth } from "../firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";

import { Navigate } from "react-router-dom";

import "ldrs/ring";

export default function Private({ children }) {
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      const unsub = onAuthStateChanged(auth, (user) => {
        //se tem usuário logado
        if (user) {
          const userData = {
            uid: user.uid,
            email: user.email,
          };

          localStorage.setItem("@detailUser", JSON.stringify(userData));
          setLoading(false);
          setSigned(true);
        } else {
          setLoading(false);
          setSigned(false);
        }
      });
    }

    checkLogin();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-800">
        <l-ring size="60" color="#f24444"></l-ring>
      </div>
    );
  }

  if (!signed) {
    return <Navigate to="/" />;
  }
  return children;
}
