
function Home() {
  return (
    <div className="home">
      <header className="navbar">
        <h2>🏠 Property Management System</h2>

        <nav>
          <a href="/">Home</a>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </nav>
      </header>

      <section className="hero">
        <h1>Find Your Perfect Property 🏡</h1>

        <p>
          Find a home. List a property. Connect easily.
        </p>

        <div className="hero-buttons">
          <a href="/login">Explore Properties</a>
          <a href="/register">Get Started</a>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose Us?</h2>

        <div className="feature-cards">
          <div className="feature-card">
            <h3>🔎 Easy Search</h3>
            <p>Find properties based on your requirements.</p>
          </div>

          <div className="feature-card">
            <h3>🏠 List Property</h3>
            <p>Owners can easily list and manage properties.</p>
          </div>

          <div className="feature-card">
            <h3>🛡️ Verified Listings</h3>
            <p>Admins review and approve property listings.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <h3>Property Management System</h3>
        <p>Find • List • Connect</p>
        <p>© 2026 Property Management System</p>
      </footer>
    </div>
  );
}

export default Home;
