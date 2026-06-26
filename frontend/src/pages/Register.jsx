import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

import "../styles/Register.css";

import logo from "../assets/images/logo.png";
import hero_processed from "../assets/images/MainImage_processed.png";
import Search from "../assets/images/Search.png";
import buildYourTeam from "../assets/images/BuildYourTeam.png";
import achieveGoals from "../assets/images/achieveGoals.png";

import { toast } from "react-toastify";
import { registerUser } from "../services/authService";


export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    gender: "",
    experience: "",
    role: "",
    skills: "",
    github: "",
    linkedin: "",
    portfolio: "",
    bio: ""
  });


  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [termsRead, setTermsRead] = useState(false);

  const validateField = (name, value) => {

    let error = "";

    if (name === "firstName") {
      if (!value) error = "First name is required";
    }

    if (name === "lastName") {
      if (!value) error = "Last name is required";
    }

    if (name === "email") {
      if (!value) error = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value))
        error = "Invalid email";
    }

    if (name === "mobile") {
      if (!value) error = "Mobile is required";
      else if (!/^[0-9]{10}$/.test(value))
        error = "Must be 10 digits";
    }

    if (name === "password") {
      if (!value) error = "Password required";
      else if (value.length < 6)
        error = "Min 6 characters";
    }

    if (name === "confirmPassword") {
      if (!value) error = "Confirm password required";
      else if (value !== form.password)
        error = "Passwords not match";
    }

    if (name === "gender") {
      if (!value) error = "Gender is required";
    }

    if (name === "skills") {
      if (!value) error = "Skills required";
    }

    if (name === "experience") {

      if (!value)

        error = "Experience is required";

    }

    if (name === "role") {

      if (!value)

        error = "Role is required";

    }

    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };


  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    let newErrors = {};

    Object.keys(form).forEach((key) => {
      validateField(key, form[key]);

      if (
        !form[key] &&
        key !== "github" &&
        key !== "linkedin" &&
        key !== "portfolio" &&
        key !== "bio"
      ) {
        newErrors[key] = "Required field";
      }
    });

    setErrors(newErrors);

    if (Object.values(newErrors).some(err => err)) {
      setLoading(false);   // ✅ FIX
      return;
    }

    if (form.password !== form.confirmPassword) {
      setLoading(false);   // ✅ FIX
      return;
    }

    if (!agree) {
      toast.error("Please accept Terms & Conditions");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        role: form.role,
        skills: form.skills.split(",").map(s => s.trim()),
        github: form.github,
        linkedin: form.linkedin,
        portfolio: form.portfolio,
        bio: form.bio,
        gender: form.gender,
        experience: form.experience,
        mobile: form.mobile
      };

      const res = await registerUser(payload);

      toast.success("Registration Successful 🚀");

      navigate("/login");
    }
    catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* HEADER */}
      <header className="register-header">
        <div className="brand">
          <img src={logo} alt="logo" />
          <div>
            <h2>SkillBasedTeam</h2>
            <p>Create • Build • Connect</p>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="register-content">

        {/* LEFT SIDE */}
        <div className="left-panel">

          <div className="left-title">
            <h1>Create Your Account and Start Your Journey</h1>
            <p> Join thousands of students and professionals who are building amazing projects together based on skills and passion.</p>
          </div>

          <div className="hero-box">
            <img src={hero_processed} alt="hero" />
          </div>

          <div className="why-section">
            <h2>Why Join SkillBasedTeam ?</h2>

            <div className="feature-card">
              <img src={Search} alt="" />
              <div>
                <h3>Find Right People</h3>
                <p>Find teammates based on skills.</p>
              </div>
            </div>

            <div className="feature-card">
              <img src={buildYourTeam} alt="" />
              <div>
                <h3>Build Your Team</h3>
                <p>Build strong project team for your project.</p>
              </div>
            </div>

            <div className="feature-card">
              <img src={achieveGoals} alt="" />
              <div>
                <h3>Achieve Goals</h3>
                <p>Collabrate and bring your ideas to life.</p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-panel">

          <form className="form-card" onSubmit={handleSubmit}>

            <h1>Create Your Account</h1>
            <p>Fill your details to get started</p>

            {/* Full Name 1 */}
            <div className="row">
              <div className="field">
                <label>First Name *</label>
                <input name="firstName" onChange={handleChange} />

                {errors.firstName && (
                  <span className="error">{errors.firstName}</span>
                )}
              </div>

              <div className="field">
                <label>Last Name *</label>
                <input name="lastName" onChange={handleChange} />
                {errors.lastName && <span className="error">{errors.lastName}</span>}
              </div>
            </div>

            {/* EMAIL + MOBILE */}
            <div className="row">
              <div className="field">
                <label>Email *</label>
                <input name="email" onChange={handleChange} />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="field">
                <label>Mobile *</label>
                <input name="mobile" onChange={handleChange} />
                {errors.mobile && <span className="error">{errors.mobile}</span>}
              </div>
            </div>

            {/* PASSWORD */}
            <div className="row">

              <div className="field password-field">
                <label>Password *</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                />
                {errors.password && <span className="error">{errors.password}</span>}
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <div className="field password-field">
                <label>Confirm Password *</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  onChange={handleChange}
                />
                {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

            </div>

            {/* EXPERIENCE + ROLE */}
            <div className="row">

              <div className="field">
                <label>Experience *</label>
                <select name="experience" onChange={handleChange}>
                  <option value="">Select</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
                {errors.experience && (
                  <span className="error">
                    {errors.experience}
                  </span>
                )}
              </div>

              <div className="field">
                <label>Preferred Role *</label>
                <select name="role" onChange={handleChange}>
                  <option value="">Select</option>
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>Full Stack Developer</option>
                  <option>AI/ML Engineer</option>
                  <option>DevOps</option>
                  <option>Other</option>
                </select>
                {errors.role && (
                  <span className="error">
                    {errors.role}
                  </span>
                )}
              </div>

            </div>

            {/* SKILLS */}
            <div className="row">

              <div className="field">
                <label>Skills *</label>
                <input
                  name="skills"
                  onChange={handleChange}
                />
                {errors.skills && (
                  <span className="error">{errors.skills}</span>
                )}
              </div>

              <div className="field">
                <label>Gender *</label>
                <select
                  name="gender"
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>

                {errors.gender && (
                  <span className="error">{errors.gender}</span>
                )}
              </div>

            </div>
            <br />

            {/* LINKS */}
            <div className="row">
              <div className="field">
                <label>GitHub</label>
                <input name="github" onChange={handleChange} />
              </div>

              <div className="field">
                <label>LinkedIn</label>
                <input name="linkedin" onChange={handleChange} />
              </div>
            </div>

            {/* PORTFOLIO + BIO */}
            <div className="row">
              <div className="field">
                <label>Portfolio</label>
                <input name="portfolio" onChange={handleChange} />
              </div>

              <div className="field">
                <label>Bio</label>
                <textarea name="bio" onChange={handleChange} />
              </div>
            </div>
            {/* TERMS */}
            <div className="terms">
              <input
                type="checkbox"
                checked={agree}
                disabled={!termsRead}
                onChange={() => setAgree(!agree)}
              />

              <span
                className="terms-link"
                onClick={() => setShowTerms(true)}
              >
                Terms & Conditions
              </span>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="create-btn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* TERMS MODAL */}
            {showTerms && (
              <div className="modal-overlay">
                <div className="terms-modal">

                  <h2>Terms & Conditions</h2>

                  <div className="terms-content">

                    <p>
                      Welcome to SkillBasedTeam. By creating an account, you agree to the
                      following terms:
                    </p>

                    <ol>
                      <li>Provide accurate and truthful information.</li>
                      <li>Do not create fake or duplicate accounts.</li>
                      <li>Respect all members of the platform.</li>
                      <li>Do not upload harmful or illegal content.</li>
                      <li>Your account may be suspended for violating these rules.</li>
                      <li>Your personal information will only be used for platform functionality.</li>
                      <li>We may update these Terms & Conditions from time to time.</li>

                    </ol>

                  </div>

                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => {
                      setTermsRead(true);
                      setShowTerms(false);
                    }}
                  >
                    I Have Read & Close
                  </button>

                </div>
              </div>
            )}

            <div className="login-text">
              Already have an account? <Link to="/login">Login here</Link>
            </div>

          </form>

        </div>

      </div>

      {/* FOOTER */}
      <footer className="register-footer">
        © 2026 SkillBasedTeam | All Rights Reserved
      </footer>

    </div>
  );
}