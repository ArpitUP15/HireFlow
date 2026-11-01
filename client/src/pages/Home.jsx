import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  FileSearch,
  CalendarDays,
  GitBranch,
  ShieldCheck,
  UserRound,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import { useOrganization } from "../context/useOrganization";
import { submitContactMessage } from "../services/publicService";
import ThemeToggle from "../components/common/ThemeToggle";
import NotificationBell from "../components/common/NotificationBell";
import hireFlowWordmark from "../assets/hireflow-symbol.png";
import LiveHiringStats from "../components/common/LiveHiringStats";
const features = [
  [
    BriefcaseBusiness,
    "Jobs and applications",
    "Publish openings, review applications and track each candidate through the recruitment pipeline.",
  ],
  [
    FileSearch,
    "Resume screening",
    "Compare resume text against job requirements with AI suggestions that support a human review.",
  ],
  [
    UserRound,
    "Candidate workspace",
    "Create a profile, upload a resume, search available jobs and follow your application history.",
  ],
  [
    CalendarDays,
    "Interviews and feedback",
    "Schedule interviews, assign interviewers and record feedback with a structured scorecard.",
  ],
  [
    GitBranch,
    "Recruitment pipeline",
    "Move applications through applied, screening, shortlisted, interview, selected and rejected stages.",
  ],
  [
    ShieldCheck,
    "Organization access",
    "Manage team membership and permissions within separate organization workspaces.",
  ],
];
export default function Home() {
  const { user, logout } = useAuth();
  const { organization } = useOrganization();
  const navigate = useNavigate();
  const page = useRef(null);

  const signOut = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch {
      // ignore for landing page navigation fallback
    }
  };
  useEffect(() => {
    const applyNavState = () => {
      const scrolled = window.scrollY > 10;
      document
        .querySelectorAll(".workspace-navbar")
        .forEach((nav) => nav.classList.toggle("is-scrolled", scrolled));
    };

    applyNavState();
    window.addEventListener("scroll", applyNavState, { passive: true });

    return () => window.removeEventListener("scroll", applyNavState);
  }, []);

  useEffect(() => {
    if (
      !window.IntersectionObserver ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    page.current
      .querySelectorAll(
        "main > section:not(.home-hero), .home-features article",
      )
      .forEach((el) => {
        el.classList.add("scroll-reveal");
        observer.observe(el);
      });
    return () => observer.disconnect();
  }, []);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const contact = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSaving(true);
    try {
      await submitContactMessage(Object.fromEntries(new FormData(form)));
      setMessage("Your message has been received.");
      form.reset();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not send your message. Please retry.",
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="min-h-screen landing-page" ref={page}>
      <header className="workspace-navbar">
        <Link
          to="/"
          aria-label="HireFlow home"
          className="relative flex h-1 w-20 shrink-0 items-center justify-center gap-2 overflow-visible"
        >
          <img
            src={hireFlowWordmark}
            alt="HireFlow"
            className="h-12 w-auto max-w-none object-contain pl-9"
          />
          <p className="brand-name">HireFlow</p>
        </Link>
        <nav
          className="portal-actions"
          style={{ gap: "20px", alignItems: "center" }}
        >
          <a href="#features">Features</a>
          <a href="#faq">FAQ's</a>
          <a href="#contact">Contact</a>

          {user && (
            <NotificationBell
              canLoadNotifications={
                Boolean(organization) || user.role === "candidate"
              }
            />
          )}
          <ThemeToggle />
          {user ? (
            <>
              <Link
                to="/dashboard"
                aria-label={user.firstName || "User profile"}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-background"
                title={user.firstName || "User"}
              >
                {(user.firstName || "U").charAt(0).toUpperCase()}
              </Link>
              <button
                type="button"
                aria-label="Sign out"
                title="Sign out"
                onClick={signOut}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-transparent text-text transition-opacity hover:bg-primary/5"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Sign in</Link>
              <Link className="portal-button" to="/register">
                Create account
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="portal-page">
        <section className="home-hero">
          <p className="eyebrow">RECRUITMENT AND HR MANAGEMENT</p>
          <h1>
            <span className="hero-line">Manage hiring from job posting</span>{" "}
            <span className="hero-line hero-line-delayed">
              to final decision.
            </span>
          </h1>
          <p>
            HireFlow brings job applications, resume screening, interviews and
            team workflows into one workspace. Candidates can find openings and
            track their progress in a dedicated portal.
          </p>
          <div className="portal-actions">
            <Link
              to={user ? "/dashboard" : "/register"}
              className="portal-button"
            >
              {user ? "Open dashboard" : "Create your workspace"}
            </Link>
            <a href="#features" className="portal-button secondary">
              Explore features
            </a>
          </div>
        </section>
        <LiveHiringStats />
        <section id="features">
          <p className="eyebrow">THE HIRING WORKFLOW</p>
          <h2>A clear record of every application</h2>
          <div className="home-features">
            {features.map(([Icon, title, description]) => (
              <article className="portal-card" key={title}>
                <Icon size={26} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="faq" className="home-faq faq-shell">
          <h2>FAQ</h2>
          <div className="faq-list">
            {[
              [
                "Do you have any questions for us?",
                "Candidates have a dashboard with their application history, a searchable job portal and a private profile with resume upload.",
              ],
              [
                "How does AI screening work?",
                "A recruiter requests a comparison of resume text and job requirements. Groq returns documented matches, missing evidence and supporting suggestions. The recruiter makes the decision.",
              ],
              [
                "Can teams share a workspace?",
                "Recruiters create an organization and invite members with roles and permissions for recruitment tasks.",
              ],
            ].map(([q, a]) => (
              <details key={q} className="faq-item">
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section id="contact" className="portal-profile-layout contact-layout">
          <div className="contact-info-panel">
            <p className="eyebrow">CONTACT</p>
            <h2 className="contact-heading">Contact Us</h2>
            <p className="contact-copy">
              Need help? Reach out and we&apos;ll get back to you quickly.
            </p>
          </div>
          <form className="portal-card contact-form" onSubmit={contact}>
            <div className="portal-form-grid contact-form-grid">
              <label>
                Name
                <input name="name" required maxLength={100} />
              </label>
              <label>
                Email
                <input name="email" type="email" required maxLength={254} />
              </label>
              <label className="full-width">
                Subject
                <input name="subject" required maxLength={200} />
              </label>
              <label className="full-width">
                Message
                <textarea name="message" required rows={6} maxLength={5000} />
              </label>
            </div>
            <button disabled={saving} className="portal-button contact-submit">
              {saving ? "Sending..." : "Send message"}
            </button>
            {message && <p role="status">{message}</p>}
          </form>
        </section>
      </main>
      <footer className="site-footer">
        <div className="site-footer__brand">
          <img src={hireFlowWordmark} alt="HireFlow" className="site-footer__logo" />
          <span>HireFlow</span>
        </div>
        <div className="site-footer__links">
          <Link to="/privacy">Privacy policy</Link>
          <Link to="/terms">Terms and conditions</Link>
        </div>
      </footer>
    </div>
  );
}
