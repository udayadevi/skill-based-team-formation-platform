import Layout from "../components/Layout.jsx";

function Dashboard() {
  return (
    <Layout>
      <div className="dashboard">
        <h1>Welcome to Dashboard 🚀</h1>

        <div className="cards">
          <div className="card-box">Projects: 5</div>
          <div className="card-box">Teams: 3</div>
          <div className="card-box">Skills Matched: 12</div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;