import { useEffect, useState } from "react";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("/api/users")
      .then((res) => {
        console.log("DATA FROM API:", res.data);
        setUsers(res.data);
      })
      .catch((err) => {
        console.log("ERROR:", err);
      });
  }, []);

  return (
    <div>
      {users.map((user) => (
        <div key={user._id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <p>{user.skills?.join(", ")}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Users;