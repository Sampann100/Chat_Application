import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

function PrivateRoute({ children }) {
  const isLoggedIn = useSelector((state) => state?.userData?.success);
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    if (!isLoggedIn && !toastShown) {
      toast.error("Please login to continue 🚀");
      setToastShown(true);
    }
  }, [isLoggedIn, toastShown]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
