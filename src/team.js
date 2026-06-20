function Teams() {
  const teams = [
    {
      teamName: "MERN Developers",
      requiredSkills: ["React", "Node.js", "MongoDB"],
    },
    {
      teamName: "AI/ML Team",
      requiredSkills: ["Python", "Machine Learning"],
    },
  ];

  return (
    <div>
      <h2>Teams</h2>

      {teams.map((team, index) => (
        <div key={index}>
          <h3>{team.teamName}</h3>

          <p>
            Skills: {team.requiredSkills.join(", ")}
          </p>

          <button>Join Team</button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default Teams;