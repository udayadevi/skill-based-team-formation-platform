import { useState } from "react";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [skills, setSkills] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !mobile || !password || !skills) {
      alert("Please fill all fields");
      return;
    }

    // Basic client-side validation to match backend rules
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    const mobileDigits = mobile.replace(/\D/g, "");
    if (mobileDigits.length !== 10) {
      alert("Mobile number must be exactly 10 digits");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          mobile,
          password,
          skills: skills.split(",").map((skill) => skill.trim()),
        }
      );

      alert("User Registered Successfully!");

      console.log(response.data);

      setName("");
      setEmail("");
      setMobile("");
      setPassword("");
      setSkills("");
    } catch (error) {
      console.error("Registration Error:", error);

      // Prefer detailed validation errors from backend when available
      if (error.response) {
        const data = error.response.data;
        if (data.errors && Array.isArray(data.errors)) {
          const msgs = data.errors.map((e) => e.msg || e.message).join("; ");
          alert(msgs || data.message || "Registration Failed");
        } else {
          alert(data.message || "Registration Failed");
        }
      } else {
        alert("Server Error");
      }
    }
  };

  return (
    <div>
      <h2>Register Page</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Skills (Java, React, Python)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}

export default Register;