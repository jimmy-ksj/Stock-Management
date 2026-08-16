export default function Dashboard() {
  return (
    <div className="dashboard-page">

      <div className="page-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Welcome back to your inventory.
          </p>
        </div>
      </div>

      <div className="overview-header">
        <h2>Overview</h2>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <span>Total Items</span>
          <strong>0</strong>
          <small>Items in stock</small>
        </div>

        <div className="stat-card">
          <span>Total Users</span>
          <strong>0</strong>
          <small>Registered users</small>
        </div>

        <div className="stat-card">
          <span>Total Sales</span>
          <strong>0 RWF</strong>
          <small>Total sales value</small>
        </div>

      </div>

    </div>
  );
}
