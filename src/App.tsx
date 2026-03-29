import { ArrowUpRight, Code2, ExternalLink } from "lucide-react"
import { useWebHaptics } from "web-haptics/react"

import { Button } from "@/components/ui/button"

const rainImages = [
  "/images/rain/1.png",
  "/images/rain/2.png",
  "/images/rain/3.png",
] as const

const featuredProjects = [
  {
    name: "blixt-wallet",
    href: "https://github.com/smolcars/blixt-wallet",
    description:
      "Bitcoin Lightning wallet with a real focus on usability and user experience.",
    meta: "TypeScript · 420 stars",
  },
  {
    name: "noah",
    href: "https://github.com/smolcars/noah",
    description: "A trust-minimized Ark wallet.",
    meta: "TypeScript · 28 stars",
  },
  {
    name: "hunk",
    href: "https://github.com/smolcars/hunk",
    description:
      "A GPUI-based diff viewer and Codex orchestrator for vibe engineering.",
    meta: "Rust · 27 stars",
  },
  {
    name: "react-native-turbo-lnd",
    href: "https://github.com/smolcars/react-native-turbo-lnd",
    description: "A pure C++ TurboModule for lnd.",
    meta: "TypeScript · 6 stars",
  },
  {
    name: "react-native-turbo-sqlite",
    href: "https://github.com/smolcars/react-native-turbo-sqlite",
    description: "A pure C++ TurboModule for SQLite.",
    meta: "C · 15 stars",
  },
  {
    name: "react-native-nitro-ark",
    href: "https://github.com/smolcars/react-native-nitro-ark",
    description: "A pure C++ NitroModule for Ark.",
    meta: "C++ · 8 stars",
  },
] as const

const workAreas = [
  {
    title: "Bitcoin",
    description:
      "Wallets, Lightning, Ark, and the little pieces of infrastructure that make money software feel usable.",
  },
  {
    title: "AI",
    description:
      "Tools and experiments around agents, developer workflows, and the messy practical side of shipping AI products.",
  },
  {
    title: "React Native",
    description:
      "Mobile apps and native modules with a lot of attention on performance, ergonomics, and polish.",
  },
  {
    title: "Rust",
    description:
      "Fast desktop tools, systems code, and the sharp edges of product engineering where Rust pays for itself.",
  },
] as const

const reasons = [
  "Open source by default",
  "Cute on purpose",
  "Built by people who actually ship",
] as const

const brandLetters = "SMOLCARS".split("")
const footerHapticPreset = "soft"

function BrandWordmark({ onInteract }: { onInteract: () => void }) {
  return (
    <div aria-label="Smolcars" className="brand-word" role="img">
      {brandLetters.map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          className={`brand-letter ${index < 4 ? "brand-letter-smol" : "brand-letter-cars"}`}
          onClick={onInteract}
          onMouseEnter={onInteract}
        >
          <span aria-hidden="true" className="brand-letter-outline">
            {letter}
          </span>
          <span aria-hidden="true" className="brand-letter-fill">
            {letter}
          </span>
        </span>
      ))}
    </div>
  )
}

export function App() {
  const { trigger } = useWebHaptics({
    debug: import.meta.env.DEV,
  })

  const triggerFooterHaptics = () => {
    void trigger(footerHapticPreset)
  }

  const triggerGithubHaptics = () => {
    void trigger("medium")
  }

  const triggerXHaptics = () => {
    void trigger("light")
  }

  return (
    <div className="site-shell">
      <div
        aria-hidden="true"
        className="rain-layer"
        data-rain-images={rainImages.join(",")}
      />

      <main className="relative z-10">
        <section className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-18">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="max-w-3xl text-[clamp(2.4rem,5vw,4.85rem)] leading-[0.94] font-semibold tracking-[-0.03em] text-foreground">
                Cute software. Serious engineering.
              </h1>
              <p className="max-w-2xl text-[17px] leading-7 text-foreground">
                We&apos;re an open-source collective building awesome apps and
                libraries around Bitcoin, AI, React Native, Rust, and more.
              </p>
              <p className="max-w-2xl text-[15px] leading-7 text-muted-foreground">
                smolcars is a bunch of people shipping wallets, mobile modules,
                Rust tools, bots, and experiments with a little bee and cat
                energy baked in. 🐝 🐱
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a
                  href="https://github.com/smolcars"
                  onClick={triggerGithubHaptics}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Code2 />
                  View GitHub
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a
                  href="https://x.com/smolcarscom"
                  onClick={triggerXHaptics}
                  rel="noreferrer"
                  target="_blank"
                >
                  Follow on X
                  <ExternalLink />
                </a>
              </Button>
            </div>

            <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-sm text-muted-foreground">
              {reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>

          <figure className="hero-figure self-start">
            <img
              alt="Smolcars artwork"
              className="main-art w-full object-contain"
              src="/images/main.png"
            />
          </figure>
        </section>

        <section
          className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[0.75fr_1.25fr]"
          id="projects"
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Projects from the org
            </h2>
            <p className="max-w-xl text-[15px] leading-7 text-muted-foreground">
              Pulled from the public smolcars GitHub org so the homepage points
              at real things, not made-up product names.
            </p>
          </div>

          <div className="project-list border-t border-border/70">
            {featuredProjects.map((project) => (
              <article key={project.name} className="project-row">
                <a
                  className="project-link grid gap-3 px-5 py-5 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)_auto] md:items-start"
                  href={project.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  <div className="min-w-0">
                    <h3 className="text-[16px] leading-6 font-medium text-foreground">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {project.meta}
                    </p>
                  </div>
                  <p className="max-w-xl text-[15px] leading-7 text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="project-link-arrow justify-self-start pt-1 text-muted-foreground md:justify-self-end">
                    <ArrowUpRight className="size-4" />
                  </div>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section
          className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[0.75fr_1.25fr]"
          id="work"
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              How the collective works
            </h2>
            <p className="max-w-xl text-[15px] leading-7 text-muted-foreground">
              The short version.
            </p>
          </div>

          <div className="work-list border-t border-border/70">
            {workAreas.map((area, index) => (
              <div
                key={area.title}
                className={[
                  "grid gap-3 px-5 py-4 md:grid-cols-[160px_1fr]",
                  index !== workAreas.length - 1 ? "work-row" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="text-sm font-medium text-foreground">
                  {area.title}
                </div>
                <div className="text-sm leading-7 text-muted-foreground">
                  {area.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="brand-footer">
        <BrandWordmark onInteract={triggerFooterHaptics} />
      </footer>
    </div>
  )
}

export default App
