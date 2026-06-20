function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged Out Successfully");

    window.location.reload();
  };

  if (!user) {
    return (
      <div>
        <h2>Please Login First</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>Dashboard</h2>

      <h3>Welcome {user.name}</h3>

      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <p>
        <strong>Mobile:</strong> {user.mobile || "Not Added"}
      </p>

      <p>
        <strong>Total Skills:</strong>{" "}
        {user.skills?.length || 0}
      </p>

      <h3>Skills</h3>

      {user.skills?.length > 0 ? (
        <ul>
          {user.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      ) : (
        <p>No Skills Added</p>
      )}

      <br />

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;