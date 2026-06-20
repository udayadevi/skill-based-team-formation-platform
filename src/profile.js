import { useState } from "react";
import axios from "axios";

function Profile() {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(currentUser?.name || "");
  const [mobile, setMobile] = useState(currentUser?.mobile || "");
  const [skills, setSkills] = useState(
    currentUser?.skills?.join(", ") || ""
  );

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "/api/users/update-profile",
        {
          name,
          mobile,
          skills: skills.split(",").map(skill => skill.trim())
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Profile Updated Successfully");

    } catch (error) {
      console.error(error);
      alert("Profile Update Failed");
    }
  };

  return (
    <div>
      <h2>Profile Page</h2>

      <label>Name:</label>
      <br />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <label>Mobile:</label>
      <br />
      <input
        type="text"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />

      <br />
      <br />

      <label>Skills:</label>
      <br />
      <input
        type="text"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder="Java, React, Python"
      />

      <br />
      <br />

      <button onClick={handleUpdate}>
        Update Profile
      </button>
    </div>
  );
}

export default Profile;