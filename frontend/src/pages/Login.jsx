```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "admin@gmail.com",
    password: "123456",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    setTimeout(() => {
      // FAKE LOGIN DATA
      const fakeEmail = "admin@gmail.com";
      const fakePassword = "123456";

      if (
        form.email.trim().toLowerCase() === fakeEmail &&
        form.password === fakePassword
      ) {
        const fakeUser = {
          id: 1,
          name: "Admin User",
          email: fakeEmail,
          role: "Administrator",
          avatar: "👨‍💼",
        };

        localStorage.setItem(
          "token",
          "fake-stockpro-token-2026"
        );

        localStorage.setItem(
          "user",
          JSON.stringify(fakeUser)
        );

        navigate("/dashboard");
      } else {
        setError(
          "Invalid email or password. Use the demo account below."
        );
        setLoading(false);
      }
    }, 900);
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Inter, Arial, sans-serif;
          background: #050807;
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 25px;
          position: relative;
          overflow: hidden;

          background:
            radial-gradient(
              circle at 10% 10%,
              rgba(0, 255, 136, .14),
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 90%,
              rgba(0, 190, 255, .10),
              transparent 30%
            ),
            #050807;
        }

        .grid {
          position: absolute;
          inset: 0;
          opacity: .15;

          background-image:
            linear-gradient(
              rgba(255,255,255,.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,.035) 1px,
              transparent 1px
            );

          background-size: 45px 45px;
        }

        .glow {
          position: absolute;
          width: 330px;
          height: 330px;
          border-radius: 50%;
          filter: blur(100px);
          background: rgba(0,255,136,.08);
        }

        .glow-one {
          top: -160px;
          left: -120px;
        }

        .glow-two {
          right: -150px;
          bottom: -150px;
          background: rgba(0,160,255,.08);
        }

        .login-container {
          position: relative;
          z-index: 2;

          width: 100%;
          max-width: 1050px;
          min-height: 620px;

          display: grid;
          grid-template-columns: 1fr 1fr;

          overflow: hidden;

          border-radius: 28px;
          border: 1px solid rgba(255,255,255,.09);

          background: rgba(9,15,12,.80);

          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);

          box-shadow:
            0 30px 90px rgba(0,0,0,.65),
            0 0 60px rgba(0,255,136,.05);
        }

        .brand {
          padding: 65px;
          display: flex;
          justify-content: center;
          flex-direction: column;

          border-right: 1px solid rgba(255,255,255,.07);

          background:
            linear-gradient(
              145deg,
              rgba(0,255,136,.10),
              transparent
            );
        }

        .logo {
          width: 75px;
          height: 75px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 21px;

          font-size: 34px;

          background:
            linear-gradient(
              135deg,
              #00ff88,
              #00bd69
            );

          box-shadow:
            0 0 35px rgba(0,255,136,.3);

          margin-bottom: 30px;
        }

        .brand h1 {
          margin: 0;

          color: white;

          font-size: 48px;
          font-weight: 800;

          letter-spacing: -2px;
        }

        .brand h1 span {
          color: #00ff88;
        }

        .brand-description {
          color: #8c9b94;

          line-height: 1.8;

          max-width: 420px;

          margin: 20px 0 35px;
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 13px;

          color: #c8d2cd;

          font-size: 14px;
        }

        .feature-icon {
          width: 30px;
          height: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          color: #00ff88;

          background: rgba(0,255,136,.08);

          border: 1px solid rgba(0,255,136,.15);
        }

        .login-section {
          display: flex;
          align-items: center;
          justify-content: center;

          padding: 55px;
        }

        .login-card {
          width: 100%;
          max-width: 390px;
        }

        .mobile-logo {
          display: none;
        }

        .title {
          margin: 0 0 8px;

          color: white;

          font-size: 31px;
          font-weight: 800;
        }

        .subtitle {
          margin: 0 0 30px;

          color: #78857f;

          font-size: 14px;
        }

        .error {
          padding: 13px 15px;

          margin-bottom: 20px;

          border-radius: 11px;

          color: #ff9b9b;

          background: rgba(255,50,50,.07);

          border: 1px solid rgba(255,70,70,.2);

          font-size: 13px;
        }

        .input-group {
          margin-bottom: 19px;
        }

        label {
          display: block;

          color: #bac6c0;

          font-size: 13px;
          font-weight: 600;

          margin-bottom: 9px;
        }

        .input-wrapper {
          position: relative;
        }

        .icon {
          position: absolute;

          left: 16px;
          top: 50%;

          transform: translateY(-50%);

          color: #63716a;
        }

        input {
          width: 100%;
          height: 54px;

          padding: 0 48px;

          border-radius: 13px;

          border: 1px solid rgba(255,255,255,.09);

          outline: none;

          color: white;

          background: rgba(255,255,255,.035);

          font-size: 14px;

          transition: .25s;
        }

        input::placeholder {
          color: #526059;
        }

        input:focus {
          border-color: rgba(0,255,136,.55);

          box-shadow:
            0 0 0 3px rgba(0,255,136,.07);
        }

        .toggle {
          position: absolute;

          right: 12px;
          top: 50%;

          transform: translateY(-50%);

          border: none;

          background: transparent;

          color: #68766f;

          cursor: pointer;

          font-size: 17px;
        }

        .toggle:hover {
          color: #00ff88;
        }

        .login-btn {
          width: 100%;
          height: 54px;

          border: none;
          border-radius: 13px;

          cursor: pointer;

          font-weight: 800;

          color: #021109;

          background:
            linear-gradient(
              135deg,
              #00ff88,
              #00cf72
            );

          box-shadow:
            0 12px 30px rgba(0,255,136,.17);

          transition: .25s;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);

          box-shadow:
            0 17px 35px rgba(0,255,136,.27);
        }

        .login-btn:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .btn-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .spinner {
          width: 17px;
          height: 17px;

          border-radius: 50%;

          border: 2px solid rgba(0,0,0,.25);
          border-top-color: #001c0e;

          animation: spin .7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .demo {
          margin-top: 22px;

          padding: 14px;

          text-align: center;

          color: #68766f;

          font-size: 12px;

          border-radius: 11px;

          background: rgba(255,255,255,.025);

          border: 1px solid rgba(255,255,255,.06);
        }

        .demo strong {
          color: #00e37c;
        }

        .fake-badge {
          display: inline-block;

          margin-bottom: 20px;

          padding: 6px 10px;

          border-radius: 20px;

          color: #00ff88;

          background: rgba(0,255,136,.07);

          border: 1px solid rgba(0,255,136,.14);

          font-size: 10px;

          font-weight: 700;

          letter-spacing: 1px;

          text-transform: uppercase;
        }

        .footer {
          margin-top: 24px;

          text-align: center;

          color: #4f5d56;

          font-size: 11px;
        }

        @media(max-width: 850px) {
          .login-container {
            max-width: 500px;
            min-height: auto;
            grid-template-columns: 1fr;
          }

          .brand {
            display: none;
          }

          .login-section {
            padding: 45px 30px;
          }

          .mobile-logo {
            display: flex;

            width: 62px;
            height: 62px;

            align-items: center;
            justify-content: center;

            margin: 0 auto 20px;

            border-radius: 18px;

            font-size: 28px;

            background:
              linear-gradient(
                135deg,
                #00ff88,
                #00b86b
              );

            box-shadow:
              0 0 30px rgba(0,255,136,.25);
          }

          .title,
          .subtitle {
            text-align: center;
          }
        }

        @media(max-width: 480px) {
          .login-page {
            padding: 15px;
          }

          .login-container {
            border-radius: 21px;
          }

          .login-section {
            padding: 38px 22px;
          }

          .title {
            font-size: 27px;
          }
        }
      `}</style>

      <div className="login-page">
        <div className="grid"></div>

        <div className="glow glow-one"></div>
        <div className="glow glow-two"></div>

        <div className="login-container">

          {/* BRAND */}
          <div className="brand">

            <div className="logo">
              📦
            </div>

            <h1>
              Stock<span>Pro</span>
            </h1>

            <p className="brand-description">
              A modern inventory management system
              designed to help you manage your business
              faster, smarter and more efficiently.
            </p>

            <div className="features">

              <div className="feature">
                <div className="feature-icon">✓</div>
                Real-time inventory management
              </div>

              <div className="feature">
                <div className="feature-icon">✓</div>
                Products and suppliers management
              </div>

              <div className="feature">
                <div className="feature-icon">✓</div>
                Secure dashboard access
              </div>

              <div className="feature">
                <div className="feature-icon">✓</div>
                Business performance monitoring
              </div>

            </div>
          </div>

          {/* LOGIN */}
          <div className="login-section">

            <form
              className="login-card"
              onSubmit={handleLogin}
            >

              <div className="mobile-logo">
                📦
              </div>

              <div className="fake-badge">
                Demo Mode
              </div>

              <h2 className="title">
                Welcome back
              </h2>

              <p className="subtitle">
                Sign in to continue to StockPro.
              </p>

              {error && (
                <div className="error">
                  ⚠️ {error}
                </div>
              )}

              <div className="input-group">

                <label>Email Address</label>

                <div className="input-wrapper">

                  <span className="icon">
                    ✉
                  </span>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@gmail.com"
                    autoComplete="email"
                    required
                  />

                </div>
              </div>

              <div className="input-group">

                <label>Password</label>

                <div className="input-wrapper">

                  <span className="icon">
                    🔒
                  </span>

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>

                </div>
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >

                <span className="btn-content">

                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <span>→</span>
                    </>
                  )}

                </span>

              </button>

              <div className="demo">
                Demo Account
                <br />

                <strong>
                  admin@gmail.com
                </strong>

                {" / "}

                <strong>
                  123456
                </strong>
              </div>

              <div className="footer">
                © 2026 StockPro · Demo Inventory System
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}
```
