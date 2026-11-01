import { Link } from "react-router-dom";
export default function Legal({ type }) {
  const privacy = type === "privacy";
  return (
    <main className="portal-page legal-page">
      <Link to="/">HireFlow</Link>
      <h1>{privacy ? "Privacy policy" : "Terms and conditions"}</h1>
      <p>Last updated: 24 October 2026</p>
      {privacy ? (
        <>
          <h2>Information processed</h2>
          <p>
            HireFlow stores account names, email addresses, password hashes,
            candidate profile details, uploaded resumes, job applications and
            recruitment records. Authentication uses an HTTP-only cookie. Theme
            preference and the selected recruiter organization are stored in
            your browser.
          </p>
          <h2>Recruitment and resume screening</h2>
          <p>
            When you apply, your profile and submitted resume are shared with
            the hiring organization. Recruiters may request AI screening. Resume
            text and the job description are then sent to the AI provider
            configured by the platform operator. AI results assist a human
            review.
          </p>
          <h2>Access, retention and requests</h2>
          <p>
            Candidates access their own profile and application history.
            Organization members access records permitted by their roles.
            Contact the platform operator through the contact form to request
            correction, export or deletion of your information. The operator
            must state its contact details, retention period, hosting location
            and AI provider before public launch.
          </p>
        </>
      ) : (
        <>
          <h2>Accounts and applications</h2>
          <p>
            Provide accurate account and application information. Keep your
            login credentials private. Upload only documents you are entitled to
            share. Recruiters are responsible for accurate job listings and
            lawful handling of candidate information.
          </p>
          <h2>Recruitment decisions</h2>
          <p>
            HireFlow supports job applications and HR workflows. Submitting an
            application does not guarantee an interview or employment. AI
            screening is advisory. Hiring organizations remain responsible for
            reviewing evidence and making decisions.
          </p>
          <h2>Acceptable use and support</h2>
          <p>
            Do not attempt to access another account, misuse personal
            information or disrupt the service. Contact the operator through the
            contact form for assistance. The operator must publish its identity,
            support contact and applicable jurisdiction before public launch.
          </p>
        </>
      )}
      <p>
        <Link to={privacy ? "/terms" : "/privacy"}>
          {privacy ? "Terms and conditions" : "Privacy policy"}
        </Link>
      </p>
    </main>
  );
}
