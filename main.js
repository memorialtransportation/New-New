const app = document.getElementById("app");

const routes = {
  "/": renderHome,
  "/about": renderAbout,
  "/services": renderServices,
  "/quote": renderQuote,
  "/contact": renderContact,
  "/employee/login": renderEmployeeLogin,
  "/employee/dashboard": renderEmployeeDashboard,
};

function navLink(path, label) {
  return `<a class="link" href="#${path}">${label}</a>`;
}

function layout(content, { hideLinks = false } = {}) {
  const links = hideLinks
    ? ""
    : `
      <div class="links">
        ${navLink("/", "Home")}
        ${navLink("/services", "Services")}
        ${navLink("/about", "About")}
        ${navLink("/quote", "Request a Quote")}
        ${navLink("/contact", "Contact")}
        <a class="link" href="#/employee/login">Employee Portal</a>
      </div>
    `;

  return `
    <div class="container">
      <div class="nav">
        <div class="brand">
          <span style="display:inline-flex;width:34px;height:34px;border-radius:10px;background:linear-gradient(90deg,var(--accent),var(--accent2));align-items:center;justify-content:center;color:#06102a;font-weight:900;">MT</span>
          <div>
            Memorial Transportation LLC
            <div class="badge">Reliable • On-time • Safety-first</div>
          </div>
        </div>
        ${links}
        <a class="cta" href="#/quote">Get a Quote</a>
      </div>

      ${content}

      <div class="footer card">
        <div>© ${new Date().getFullYear()} Memorial Transportation LLC</div>
        <div class="small">For dispatch & service inquiries: <b>(add your phone/email)</b></div>
      </div>
    </div>
  `;
}

function setPage(html) {
  app.innerHTML = html;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getPath() {
  const hash = location.hash.replace(/^#/, "");
  return hash || "/";
}

function router() {
  const path = getPath();
  const fn = routes[path] || renderNotFound;
  fn();
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);

// ===== API helpers =====
async function api(path, opts = {}) {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error || "REQUEST_FAILED");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// ===== Pages =====
function renderHome() {
  const content = `
    <div class="hero">
      <div class="card pad">
        <h1 class="h1">Modern transportation, delivered with confidence.</h1>
        <p class="p">
          Memorial Transportation LLC provides dependable freight solutions with a focus on safety, clear communication, and on-time delivery.
          We support local, regional, and over-the-road lanes with flexible capacity—including power-only options.
        </p>
        <div class="grid3">
          <div class="kpi">
            <b>Dispatch-friendly</b>
            <div class="small">Fast updates, clean paperwork, proactive ETAs.</div>
          </div>
          <div class="kpi">
            <b>Safety-first</b>
            <div class="small">Compliance-driven culture across drivers & equipment.</div>
          </div>
          <div class="kpi">
            <b>Flexible freight</b>
            <div class="small">Dry van, power-only, short-haul & long-haul.</div>
          </div>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;">
          <a class="cta" href="#/quote">Request a Quote</a>
          <a class="link" style="border:1px solid var(--border);" href="#/services">View Services</a>
        </div>
      </div>

      <div class="card pad">
        <div class="alert">
          <b>Quick access</b>
          <div class="small">Employees: log in to view dashboard tools.</div>
          <div style="margin-top:10px;">
            <a class="cta" href="#/employee/login">Employee Portal</a>
          </div>
        </div>

        <div style="height:12px"></div>

        <div class="alert">
          <b>Operating areas</b>
          <div class="small">Based in the Southeast with lanes across the U.S.</div>
        </div>

        <div style="height:12px"></div>

        <div class="alert">
          <b>What we move</b>
          <div class="small">General freight, retail, and time-sensitive loads.</div>
        </div>
      </div>
    </div>
  `;
  setPage(layout(content));
}

function renderServices() {
  const content = `
    <div class="card pad" style="margin-top:18px;">
      <h2 style="margin:0 0 10px;">Services</h2>
      <p class="p">Solutions designed for shippers, brokers, and partners who value reliability and transparency.</p>

      <table class="table">
        <thead>
          <tr><th>Service</th><th>Best for</th><th>Notes</th></tr>
        </thead>
        <tbody>
          <tr><td>Dry Van</td><td>General freight</td><td>Consistent capacity and clean tracking.</td></tr>
          <tr><td>Power-Only</td><td>Drop & hook / preloaded trailers</td><td>Ideal when you have trailers and need a tractor + driver.</td></tr>
          <tr><td>Regional</td><td>Fast turn freight</td><td>Shorter transit times and predictable coverage.</td></tr>
          <tr><td>OTR</td><td>Nationwide lanes</td><td>Long-haul coverage with dependable communication.</td></tr>
        </tbody>
      </table>
    </div>
  `;
  setPage(layout(content));
}

function renderAbout() {
  const content = `
    <div class="card pad" style="margin-top:18px;">
      <h2 style="margin:0 0 10px;">About Memorial Transportation LLC</h2>
      <p class="p">
        We are a carrier focused on disciplined operations: safe driving practices, accurate documentation, and dependable service.
        Our goal is to be the carrier you can count on—whether you're moving a single shipment or managing recurring lanes.
      </p>
      <div class="grid3">
        <div class="kpi"><b>Safety & compliance</b><div class="small">ELD-ready operations and a compliance-first mindset.</div></div>
        <div class="kpi"><b>Communication</b><div class="small">Proactive updates and quick responses from dispatch.</div></div>
        <div class="kpi"><b>Professional service</b><div class="small">On-time pickup/delivery and clean paperwork.</div></div>
      </div>
    </div>
  `;
  setPage(layout(content));
}

function renderQuote() {
  const content = `
    <div class="hero" style="margin-top:18px;">
      <div class="card pad">
        <h2 style="margin:0 0 10px;">Request a Quote</h2>
        <p class="p">Send basic lane details and we'll follow up quickly.</p>

        <form id="quoteForm" class="row">
          <input class="input" name="company" placeholder="Company / Broker name" required />
          <input class="input" name="contact" placeholder="Your name" required />
          <input class="input" name="email" type="email" placeholder="Email" required />
          <div style="display:grid;grid-template-columns:1fr 1fr; gap:10px;">
            <input class="input" name="origin" placeholder="Origin (city/state)" required />
            <input class="input" name="destination" placeholder="Destination (city/state)" required />
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr; gap:10px;">
            <input class="input" name="pickupDate" placeholder="Pickup date" />
            <input class="input" name="equipment" placeholder="Equipment (dry van / power-only)" />
          </div>
          <textarea class="input" name="notes" rows="4" placeholder="Load details / notes"></textarea>
          <button class="btn" type="submit">Submit Quote Request</button>
          <div id="quoteMsg" class="small"></div>
        </form>
      </div>

      <div class="card pad">
        <div class="alert">
          <b>Tip</b>
          <div class="small">Include weight, commodity, and any appointment times for the fastest response.</div>
        </div>
        <div style="height:12px"></div>
        <div class="alert">
          <b>Power-only loads</b>
          <div class="small">If the trailer is provided by the shipper/broker, select “power-only” in the equipment field.</div>
        </div>
      </div>
    </div>
  `;
  setPage(layout(content));

  const form = document.getElementById("quoteForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    document.getElementById("quoteMsg").textContent =
      "Submitted! (Demo) For a real site, connect this to email or a CRM.";
    form.reset();
    console.log("Quote request (demo):", data);
  });
}

function renderContact() {
  const content = `
    <div class="hero" style="margin-top:18px;">
      <div class="card pad">
        <h2 style="margin:0 0 10px;">Contact</h2>
        <p class="p">Use the info below or send a message.</p>

        <div class="alert">
          <div><b>Company:</b> Memorial Transportation LLC</div>
          <div class="small">Phone: (add phone) • Email: (add email)</div>
        </div>

        <div style="height:12px"></div>

        <form id="contactForm" class="row">
          <input class="input" name="name" placeholder="Your name" required />
          <input class="input" name="email" type="email" placeholder="Your email" required />
          <textarea class="input" name="message" rows="5" placeholder="Message" required></textarea>
          <button class="btn" type="submit">Send Message</button>
          <div id="contactMsg" class="small"></div>
        </form>
      </div>

      <div class="card pad">
        <h3 style="margin:0 0 10px;">Business hours</h3>
        <div class="small">Mon–Fri: 8am–6pm</div>
        <div class="small">Sat: limited availability</div>
        <div class="small">Sun: closed</div>

        <div style="height:12px"></div>

        <div class="alert">
          <b>For load tenders</b>
          <div class="small">Include rate confirmation, pickup number, and pickup/delivery appointment times.</div>
        </div>
      </div>
    </div>
  `;
  setPage(layout(content));

  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    document.getElementById("contactMsg").textContent =
      "Message sent! (Demo) For a real site, connect this to email.";
    form.reset();
    console.log("Contact message (demo):", data);
  });
}

function renderEmployeeLogin() {
  const content = `
    <div class="hero" style="margin-top:18px;">
      <div class="card pad">
        <h2 style="margin:0 0 8px;">Employee Portal</h2>
        <p class="p">Sign in with your credentials.</p>

        <form id="loginForm" class="row">
          <label class="small">Username</label>
          <input class="input" name="username" placeholder="Username" autocomplete="username" required />
          <label class="small">Password</label>
          <input class="input" name="password" type="password" placeholder="Password" autocomplete="current-password" required />
          <button class="btn" type="submit">Log in</button>
          <div id="loginMsg" class="small"></div>
        </form>
      </div>

      <div class="card pad">
        <div class="alert">
          <b>Demo notes</b>
          <div class="small">This portal is for employee tools (dashboard, documents, dispatch notes).</div>
        </div>
        <div style="height:12px"></div>
        <div class="alert">
          <b>Security</b>
          <div class="small">Password is verified server-side and is not stored in plain text.</div>
        </div>
      </div>
    </div>
  `;
  setPage(layout(content, { hideLinks: false }));

  const form = document.getElementById("loginForm");
  const msg = document.getElementById("loginMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Logging in...";
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      await api("/api/login", { method: "POST", body: JSON.stringify(data) });
      msg.textContent = "Success! Redirecting...";
      location.hash = "#/employee/dashboard";
    } catch (err) {
      msg.textContent = "Invalid username or password.";
    }
  });
}

async function renderEmployeeDashboard() {
  // gate
  try {
    const me = await api("/api/me");
    const user = me.user?.username || "employee";

    const content = `
      <div class="card pad" style="margin-top:18px;">
        <h2 style="margin:0 0 8px;">Employee Dashboard</h2>
        <p class="p">Welcome, <b>${user}</b>. (Demo dashboard)</p>

        <div class="grid3">
          <div class="kpi"><b>Dispatch checklist</b><div class="small">Rate con • PU # • appt times • BOL</div></div>
          <div class="kpi"><b>Compliance reminders</b><div class="small">ELD • DVIR • IFTA/IRP docs</div></div>
          <div class="kpi"><b>Quick links</b><div class="small">Docs • Contacts • Load board notes</div></div>
        </div>

        <div style="height:14px"></div>

        <div class="alert">
          <b>Next steps</b>
          <div class="small">Hook this into real data (loads, drivers, documents) when you're ready.</div>
        </div>

        <div style="height:14px; display:flex; gap:10px; flex-wrap:wrap;">
          <button id="logoutBtn" class="btn secondary" style="max-width:220px;">Log out</button>
          <a class="cta" href="#/">Back to site</a>
        </div>
      </div>
    `;
    setPage(layout(content));

    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await api("/api/logout", { method: "POST" });
      location.hash = "#/employee/login";
    });
  } catch (err) {
    location.hash = "#/employee/login";
  }
}

function renderNotFound() {
  const content = `
    <div class="card pad" style="margin-top:18px;">
      <h2 style="margin:0 0 8px;">Page not found</h2>
      <p class="p">That route doesn’t exist. Use the navigation to continue.</p>
      <a class="cta" href="#/">Go Home</a>
    </div>
  `;
  setPage(layout(content));
}
