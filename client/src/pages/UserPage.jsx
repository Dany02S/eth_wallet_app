import { useEffect, useState } from "react";
import { getUser } from "../services/fetching";

function UserPage() {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    getUser(token)
      .then(response => {
        setUser(response);
      })
      .catch(error => {
        setError(error.message);
      });
  }, []);

  return (
    <div className="form-container">
      <h1>Welcome {user?.first_name} {user?.last_name}</h1>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}

export default UserPage;