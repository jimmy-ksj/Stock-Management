import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  Boxes,
  Truck,
  Tags,
  Activity,
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Products",
      value: "0",
      description: "Products in inventory",
      icon: Package,
      trend: "+0%",
      positive: true,
      className: "green",
    },
    {
      title: "Total Users",
      value: "0",
      description: "Registered users",
      icon: Users,
      trend: "+0%",
      positive: true,
      className: "blue",
    },
    {
      title: "Total Sales",
      value: "0 RWF",
      description: "Total sales value",
      icon: ShoppingCart,
      trend: "+0%",
      positive: true,
      className: "purple",
    },
    {
      title: "Stock Value",
      value: "0 RWF",
      description: "Current inventory value",
      icon: TrendingUp,
      trend: "+0%",
      positive: true,
      className: "orange",
    },
  ];

  const quickActions = [
    {
      title: "Add Product",
      description: "Create new inventory item",
      icon: Package,
      path: "/products",
    },
    {
      title: "New Sale",
      description: "Record a new sale",
      icon: ShoppingCart,
      path: "/sales",
    },
    {
      title: "Add Category",
      description: "Organize your products",
      icon: Tags,
      path: "/categories",
    },
    {
      title: "Add Supplier",
      description: "Manage suppliers",
      icon: Truck,
      path: "/suppliers",
    },
  ];

  return (
    <div className="dashboard">

      {/* =====================================================
          INTERNAL CSS
      ===================================================== */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        .dashboard {
          width: 100%;
          min-height: 100vh;
          color: #17231f;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        /* ================= HEADER ================= */

        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .welcome-badge {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 10px;
          border-radius: 999px;
          color: #047857;
          background: #ecfdf5;
          border: 1px solid #d1fae5;
          font-size: 11px;
          font-weight: 700;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 4px rgba(16,185,129,.12);
        }

        .dashboard-title {
          margin: 0;
          color: #13201c;
          font-size: clamp(28px, 3vw, 38px);
          line-height: 1.1;
          font-weight: 850;
          letter-spacing: -1.2px;
        }

        .dashboard-subtitle {
          margin: 0;
          color: #71817c;
          font-size: 14px;
        }

        .header-date {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px 15px;
          border: 1px solid #e5ece9;
          border-radius: 12px;
          background: white;
          color: #64746f;
          font-size: 12px;
          font-weight: 600;
          box-shadow: 0 4px 18px rgba(20,40,35,.04);
        }

        /* ================= STATS ================= */

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 17px;
          margin-bottom: 27px;
        }

        .stat-card {
          position: relative;
          overflow: hidden;
          padding: 20px;
          min-height: 166px;
          border: 1px solid #e7eeeb;
          border-radius: 17px;
          background: white;
          box-shadow: 0 5px 22px rgba(20,40,35,.045);
          transition: .25s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(20,40,35,.09);
        }

        .stat-card::after {
          content: "";
          position: absolute;
          right: -35px;
          bottom: -45px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          opacity: .55;
        }

        .stat-card.green::after {
          background: rgba(16,185,129,.08);
        }

        .stat-card.blue::after {
          background: rgba(59,130,246,.08);
        }

        .stat-card.purple::after {
          background: rgba(139,92,246,.08);
        }

        .stat-card.orange::after {
          background: rgba(245,158,11,.08);
        }

        .stat-top {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-icon {
          width: 43px;
          height: 43px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .green .stat-icon {
          color: #059669;
          background: #ecfdf5;
        }

        .blue .stat-icon {
          color: #2563eb;
          background: #eff6ff;
        }

        .purple .stat-icon {
          color: #7c3aed;
          background: #f5f3ff;
        }

        .orange .stat-icon {
          color: #d97706;
          background: #fffbeb;
        }

        .stat-trend {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 5px 8px;
          border-radius: 7px;
          color: #059669;
          background: #ecfdf5;
          font-size: 10px;
          font-weight: 800;
        }

        .stat-body {
          position: relative;
          z-index: 2;
          margin-top: 20px;
        }

        .stat-title {
          display: block;
          color: #71817c;
          font-size: 11px;
          font-weight: 650;
        }

        .stat-value {
          display: block;
          margin-top: 5px;
          color: #14221e;
          font-size: 25px;
          font-weight: 850;
          letter-spacing: -.7px;
        }

        .stat-description {
          display: block;
          margin-top: 5px;
          color: #9aa8a4;
          font-size: 10px;
        }

        /* ================= MAIN GRID ================= */

        .content-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(300px, .85fr);
          gap: 18px;
        }

        .panel {
          border: 1px solid #e7eeeb;
          border-radius: 17px;
          background: white;
          box-shadow: 0 5px 22px rgba(20,40,35,.045);
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 19px 20px;
          border-bottom: 1px solid #eef2f0;
        }

        .panel-title {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .panel-title-icon {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          color: #059669;
          background: #ecfdf5;
        }

        .panel-title h2 {
          margin: 0;
          color: #17231f;
          font-size: 14px;
          font-weight: 800;
        }

        .panel-title p {
          margin: 3px 0 0;
          color: #9aa8a4;
          font-size: 10px;
        }

        .view-button {
          border: 0;
          background: transparent;
          color: #059669;
          font-size: 11px;
          font-weight: 750;
          cursor: pointer;
        }

        /* ================= CHART ================= */

        .chart-area {
          height: 275px;
          padding: 20px;
        }

        .chart-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 14px;
        }

        .chart-bars {
          height: 190px;
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          gap: 12px;
          padding: 0 12px;
          border-bottom: 1px solid #e9efed;
          background:
            repeating-linear-gradient(
              to bottom,
              transparent 0,
              transparent 46px,
              #f1f5f3 47px
            );
        }

        .bar-group {
          height: 100%;
          flex: 1;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .bar {
          width: min(38px, 70%);
          min-height: 8px;
          border-radius: 8px 8px 2px 2px;
          background:
            linear-gradient(
              180deg,
              #34d399,
              #059669
            );
          box-shadow: 0 5px 15px rgba(16,185,129,.14);
        }

        .chart-labels {
          display: flex;
          justify-content: space-around;
          color: #9aa8a4;
          font-size: 10px;
        }

        /* ================= QUICK ACTIONS ================= */

        .quick-actions {
          display: grid;
          gap: 10px;
          padding: 17px;
        }

        .quick-action {
          display: flex;
          align-items: center;
          gap: 11px;
          width: 100%;
          padding: 11px;
          border: 1px solid #edf1ef;
          border-radius: 12px;
          background: #fbfcfc;
          text-align: left;
          cursor: pointer;
          transition: .2s ease;
        }

        .quick-action:hover {
          transform: translateX(3px);
          border-color: #ccefe1;
          background: #f0fdf8;
        }

        .quick-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 10px;
          color: #059669;
          background: #ecfdf5;
        }

        .quick-info {
          min-width: 0;
          flex: 1;
        }

        .quick-info strong {
          display: block;
          color: #25332e;
          font-size: 11px;
          font-weight: 750;
        }

        .quick-info span {
          display: block;
          margin-top: 3px;
          color: #9aa8a4;
          font-size: 9px;
        }

        .quick-arrow {
          color: #b0bbb7;
        }

        /* ================= ACTIVITY ================= */

        .activity {
          margin-top: 18px;
        }

        .activity-list {
          padding: 8px 20px 16px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 12px 0;
          border-bottom: 1px solid #f0f3f2;
        }

        .activity-item:last-child {
          border-bottom: 0;
        }

        .activity-icon {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          color: #64746f;
          background: #f4f7f6;
        }

        .activity-text {
          flex: 1;
        }

        .activity-text strong {
          display: block;
          color: #33423d;
          font-size: 11px;
        }

        .activity-text span {
          display: block;
          margin-top: 3px;
          color: #a0aba8;
          font-size: 9px;
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 1100px) {
          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .dashboard-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .header-date {
            width: 100%;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-title {
            font-size: 28px;
          }
        }
      `}</style>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="dashboard-header">

        <div className="header-left">

          <span className="welcome-badge">
            <span className="status-dot" />
            System Online
          </span>

          <h1 className="dashboard-title">
            Dashboard
          </h1>

          <p className="dashboard-subtitle">
            Welcome back to your inventory management system.
          </p>

        </div>

        <div className="header-date">
          <Activity size={15} />
          Live Overview
        </div>

      </header>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="stats-grid">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className={`stat-card ${stat.className}`}
            >

              <div className="stat-top">

                <div className="stat-icon">
                  <Icon size={20} />
                </div>

                <span className="stat-trend">
                  {stat.positive ? (
                    <ArrowUpRight size={12} />
                  ) : (
                    <ArrowDownRight size={12} />
                  )}

                  {stat.trend}
                </span>

              </div>

              <div className="stat-body">

                <span className="stat-title">
                  {stat.title}
                </span>

                <strong className="stat-value">
                  {stat.value}
                </strong>

                <small className="stat-description">
                  {stat.description}
                </small>

              </div>

            </div>
          );
        })}

      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="content-grid">

        {/* SALES OVERVIEW */}

        <div className="panel">

          <div className="panel-header">

            <div className="panel-title">

              <div className="panel-title-icon">
                <TrendingUp size={17} />
              </div>

              <div>
                <h2>Sales Overview</h2>
                <p>Sales performance this week</p>
              </div>

            </div>

            <button className="view-button">
              This Week
            </button>

          </div>

          <div className="chart-area">

            <div className="chart-placeholder">

              <div className="chart-bars">

                {[30, 55, 42, 78, 62, 90, 48].map(
                  (height, index) => (
                    <div
                      className="bar-group"
                      key={index}
                    >
                      <div
                        className="bar"
                        style={{
                          height: `${height}%`,
                        }}
                      />
                    </div>
                  )
                )}

              </div>

              <div className="chart-labels">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>

            </div>

          </div>

        </div>

        {/* QUICK ACTIONS */}

        <div className="panel">

          <div className="panel-header">

            <div className="panel-title">

              <div className="panel-title-icon">
                <Plus size={17} />
              </div>

              <div>
                <h2>Quick Actions</h2>
                <p>Manage your inventory</p>
              </div>

            </div>

          </div>

          <div className="quick-actions">

            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.title}
                  className="quick-action"
                  onClick={() =>
                    (window.location.href = action.path)
                  }
                >

                  <div className="quick-icon">
                    <Icon size={18} />
                  </div>

                  <div className="quick-info">
                    <strong>
                      {action.title}
                    </strong>

                    <span>
                      {action.description}
                    </span>
                  </div>

                  <Eye
                    className="quick-arrow"
                    size={15}
                  />

                </button>
              );
            })}

          </div>

        </div>

      </section>

      {/* =====================================================
          RECENT ACTIVITY
      ===================================================== */}

      <section className="panel activity">

        <div className="panel-header">

          <div className="panel-title">

            <div className="panel-title-icon">
              <Activity size={17} />
            </div>

            <div>
              <h2>Recent Activity</h2>
              <p>Latest inventory activities</p>
            </div>

          </div>

          <button className="view-button">
            View All
          </button>

        </div>

        <div className="activity-list">

          <div className="activity-item">

            <div className="activity-icon">
              <Package size={16} />
            </div>

            <div className="activity-text">
              <strong>
                No product activity yet
              </strong>

              <span>
                Product activities will appear here
              </span>
            </div>

          </div>

          <div className="activity-item">

            <div className="activity-icon">
              <ShoppingCart size={16} />
            </div>

            <div className="activity-text">
              <strong>
                No sales recorded
              </strong>

              <span>
                New sales will appear here
              </span>
            </div>

          </div>

          <div className="activity-item">

            <div className="activity-icon">
              <Boxes size={16} />
            </div>

            <div className="activity-text">
              <strong>
                Inventory is ready
              </strong>

              <span>
                Start adding products to your stock
              </span>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}
