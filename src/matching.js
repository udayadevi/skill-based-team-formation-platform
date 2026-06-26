function Matching() {
  const user = JSON.parse(localStorage.getItem("user"));

  const teams = [
    {
      teamName: "MERN Developers",
      requiredSkills: ["React", "Node.js", "MongoDB"],
    },
    {
      teamName: "AI Team",
      requiredSkills: ["Python", "Machine Learning"],
    },
  ];

  return (
    <div>
      <h2>Matching Teams</h2>

      {teams.map((team, index) => {
        const matchedSkills = team.requiredSkills.filter(skill =>
          user?.skills?.includes(skill)
        );

        return (
          <div key={index}>
            <h3>{team.teamName}</h3>
            <p>Matched Skills: {matchedSkills.length}</p>
            <hr />
          </div>
        );
      })}
    </div>
  );
}

export default Matching;