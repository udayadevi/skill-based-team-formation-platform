import React from "react";
import "../styles/TeamDetailsModal.css";

const TeamDetailsModal = ({ team, onClose, onJoin }) => {
    if (!team) return null;

    const isDefault = team.isDefault;

    const leaderName = isDefault
        ? team.leader
        : `${team.createdBy?.firstName || ""} ${team.createdBy?.lastName || ""}`;

    const leaderEmail = isDefault
        ? team.leaderEmail || "demo@example.com"
        : team.createdBy?.email;

    const skills = isDefault
        ? team.skills || []
        : team.skillsRequired || [];

    const members = isDefault
        ? [
            {
                firstName: leaderName.split(" ")[0],
                lastName: leaderName.split(" ")[1] || "",
                email: leaderEmail,
            },
        ]
        : team.members || [];

    const user = JSON.parse(
        localStorage.getItem("user") ||
        sessionStorage.getItem("user") ||
        "{}"
    );

    const alreadyJoined = members.some(
  (member) => member._id === user._id || member.email === user.email
);

    const totalMembers = team.maxMembers || 4;

    const memberCount = `${members.length}/${totalMembers} Members`;

    const availableSlots = totalMembers - members.length;

    const createdDate = isDefault
        ? new Date(team.createdAt).toLocaleDateString()
        : new Date(team.createdAt).toLocaleDateString();

    const deadline = isDefault
        ? new Date(team.deadline).toLocaleDateString()
        : new Date(team.deadline).toLocaleDateString();

    return (
        <div className="teamModalOverlay" onClick={onClose}>
            <div
                className="teamModal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}

                <div className="modalHeader">
                    <h2>{isDefault ? team.title : team.name}</h2>

                    <button
                        type="button"
                        className="closeBtn"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* PROJECT INFO */}

                <div className="section">

                    <h3>📂 Project Information</h3>

                    <div className="infoGrid">

                        <div className="infoCard">
                            <span>Project Name</span>
                            <h4>{isDefault ? team.project : team.projectName}</h4>
                        </div>

                        <div className="infoCard">
                            <span>Project Category</span>
                            <h4>{team.category || "-"}</h4>
                        </div>

                        <div className="infoCard">
                            <span>Mode</span>
                            <h4>{team.mode || "-"}</h4>
                        </div>

                        <div className="infoCard">
                            <span>Experience Level</span>
                            <h4>{team.experienceLevel || "-"}</h4>
                        </div>

                        <div className="infoCard">
                            <span>Created On</span>
                            <h4>{createdDate}</h4>
                        </div>

                        <div className="infoCard">
                            <span>Deadline</span>
                            <h4>{deadline}</h4>
                        </div>

                        <div className="infoCard">
                            <span>Meeting Platform</span>
                            <h4>{team.meetingPlatform || "-"}</h4>
                        </div>

                        <div className="infoCard">
                            <span>Available Slots</span>
                            <h4>{availableSlots}</h4>
                        </div>

                    </div>

                </div>

                {/* LEADER + STATUS */}

                <div className="twoColumn">

                    <div className="section">

                        <h3>👤 Team Leader</h3>

                        <div className="leaderCard">

                            <h4>{leaderName}</h4>

                            <p>{leaderEmail}</p>

                        </div>

                    </div>

                    <div className="section">

                        <h3>👥 Team Status</h3>

                        <div className="statusCard">
                            <h2>{memberCount}</h2>
                        </div>

                    </div>

                </div>

                {/* DESCRIPTION + SKILLS */}

                <div className="twoColumn">

                    <div className="section">

                        <h3>📝 Description</h3>

                        <div className="descriptionCard">

                            {team.description}

                        </div>

                    </div>

                    <div className="section">

                        <h3>🛠 Required Skills</h3>

                        <div className="skillCard">

                            <div className="skillContainer">

                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="skillBadge"
                                    >
                                        {skill}
                                    </span>
                                ))}

                            </div>

                        </div>

                    </div>

                </div>

                {/* MEMBERS */}

                <div className="section">

                    <h3>👨‍💻 Current Members</h3>

                    <div className="memberList">

                        {members.map((member, index) => (

                            <div
                                className="memberCard"
                                key={index}
                            >

                                <div className="memberAvatar">

                                    {(member.firstName || member.name || "?").charAt(0)}

                                </div>

                                <div className="memberInfo">

                                    <h4>
                                        {member.firstName} {member.lastName}
                                    </h4>

                                    <p>{member.email}</p>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

                {/* FOOTER */}

                <div className="modalFooter">

                    {!isDefault && (

                        <button
                            className="joinTeamBtn"
                            onClick={onJoin}
                            disabled={
                                alreadyJoined ||
                                members.length >= totalMembers
                            }
                        >
                            {alreadyJoined
                                ? "Already Joined"
                                : members.length >= totalMembers
                                    ? "Team Full"
                                    : "Join Team"}
                        </button>

                    )}

                    <button
                        className="closeModalBtn"
                        onClick={onClose}
                    >
                        Close
                    </button>

                </div>

            </div>
        </div>
    );
};

export default TeamDetailsModal;