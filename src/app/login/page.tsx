import LoginForm from "@/components/LoginForm";

export default function Login() {
  return (
    <main id="main">
      <section className="panel narrow">
        <p className="eyebrow">Private workspace</p>
        <h1>Sign in to build.</h1>
        <p>The public portfolio works now. Authentication will be built during class with the instructor. Setting credentials alone does not unlock this workspace.</p>
        <LoginForm />
      </section>
    </main>
  );
}
