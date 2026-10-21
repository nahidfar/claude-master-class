import Link from "next/link";
import profile from "../../data/profile.json";

export default function Home() {
  return (
    <main id="main">
      <section className="hero section">
        <div>
          <p className="eyebrow">Portfolio / {profile.location}</p>
          <h1>{profile.headline}</h1>
          <p className="intro">{profile.pitch}</p>
          <div className="actions">
            <a className="button" href="#projects">Explore my work</a>
            <a className="button secondary" href={`mailto:${profile.contact.email}`}>Get in touch</a>
          </div>
        </div>
        <div className="identity-card">
          <span className="avatar" aria-hidden="true">{profile.initials}</span>
          <h2>{profile.name}</h2>
          <p>Practical projects. Clear communication. Honest learning.</p>
          <span className="badge">A working starting point</span>
        </div>
      </section>

      <section className="section" id="experience">
        <p className="eyebrow">01 / Experience</p>
        <h2>What I have contributed</h2>
        {profile.experience.map((role) => (
          <article className="panel experience" key={`${role.title}-${role.organization}`}>
            <p className="muted">{role.period}</p>
            <div><h3>{role.title}</h3><p className="accent">{role.organization}</p><p>{role.summary}</p></div>
          </article>
        ))}
      </section>

      <section className="section" id="skills">
        <p className="eyebrow">02 / Skills</p>
        <h2>Strengths and next steps</h2>
        <div className="grid three">
          {Object.entries(profile.skills).map(([level, skills]) => (
            <article className="panel" key={level}>
              <h3 className="capitalize">{level}</h3>
              <ul>{skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="projects">
        <p className="eyebrow">03 / Projects</p>
        <h2>Evidence you can discuss</h2>
        <div className="grid">
          {profile.projects.map((project) => (
            <article className="panel project-card" key={project.title}>
              <p className="muted">{project.context}</p>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <p><strong>Evidence:</strong> {project.evidence}</p>
              <div className="tags">{project.tools.map((tool) => <span className="badge" key={tool}>{tool}</span>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="education">
        <p className="eyebrow">04 / Learning</p>
        <h2>Education and development</h2>
        <ul>{profile.education.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="section contact panel" id="contact">
        <p className="eyebrow">05 / Contact</p>
        <h2>Let&apos;s start a conversation.</h2>
        <div className="actions">
          <a className="button" href={`mailto:${profile.contact.email}`}>Email me</a>
          <a className="button secondary" href={profile.contact.linkedin} rel="noreferrer" target="_blank">LinkedIn</a>
        </div>
        <p className="muted">Working on your applications? <Link href="/dashboard">Open the private workspace.</Link></p>
      </section>
    </main>
  );
}
