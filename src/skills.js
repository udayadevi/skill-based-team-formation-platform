function Skills() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <h2>My Skills</h2>

      {user?.skills?.length > 0 ? (
        <ul>
          {user.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      ) : (
        <p>No Skills Added</p>
      )}
    </div>
  );
}

export default Skills;