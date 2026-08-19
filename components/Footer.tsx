export default function Footer() {
  return (
    <footer className="mt-auto border-t border-chalk/10 bg-[#132019] text-chalk">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <p className="font-display text-lg italic">Mentara</p>
        <p className="max-w-md text-sm text-chalk-dim">
          A demo-grade tutoring agent built to show the real pattern: diagnose
          the gap, teach it Socratically, then measure whether it actually
          closed — not just whether the chat felt nice.
        </p>
        <a
          href="https://github.com/Muhammad-Subhan034/mentara-tutoring-agent"
          className="font-mono text-[12px] uppercase tracking-wide text-chalk-dim underline decoration-chalk/30 underline-offset-4 hover:text-chalk"
        >
          Source on GitHub
        </a>
      </div>
    </footer>
  );
}
