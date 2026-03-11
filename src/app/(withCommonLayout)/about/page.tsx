import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const stats = [
  { value: "500+", label: "Active tutors across Bangladesh" },
  { value: "1,200+", label: "Student requests matched carefully" },
  { value: "24 hrs", label: "Average response time for new leads" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Verified trust",
    description:
      "Profiles, experience, and subject preferences are organized clearly so families can decide with confidence.",
  },
  {
    icon: BookOpen,
    title: "Focused matching",
    description:
      "We connect students with tutors by class, subject, budget, and location instead of forcing a generic search.",
  },
  {
    icon: Users,
    title: "Human support",
    description:
      "Parents, students, and tutors all need clarity. The platform is designed to keep that process simple.",
  },
];

const steps = [
  {
    number: "01",
    title: "Post or explore",
    description:
      "Students can browse learning resources and tutors can build a profile that explains their strengths properly.",
  },
  {
    number: "02",
    title: "Match with context",
    description:
      "Subject needs, class level, district, and preferred budget help narrow the right tutor-student fit.",
  },
  {
    number: "03",
    title: "Start with confidence",
    description:
      "Once both sides align, the process moves faster because the expectations are already visible from the start.",
  },
];

export default function AboutPage() {
  return (
    <section className="bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_8%,white)_0%,#fffdf8_35%,#ffffff_100%)] py-10 sm:py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              About TR Tuition
            </span>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-3xl font-black leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                A sharper way to connect students with the right tutors.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                TR Tuition is built to reduce the usual confusion around private tuition. We make tutor discovery,
                subject-based matching, and local learning support feel structured, credible, and easy to act on.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
                  <p className="text-2xl font-black text-primary">{stat.value}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Explore Resources
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-primary/25 px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
              >
                Contact Our Team
              </Link>
            </div>
          </div>

          <div className="relative rounded-[28px] bg-[radial-gradient(circle_at_top,color-mix(in_srgb,var(--primary)_28%,white),transparent_35%),linear-gradient(135deg,color-mix(in_srgb,var(--primary)_92%,black),color-mix(in_srgb,var(--primary)_72%,#111827)_55%,color-mix(in_srgb,var(--primary)_58%,#334155))] p-6 text-white sm:p-8">
            <div className="absolute right-5 top-5 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-6 left-6 h-16 w-16 rounded-full bg-primary/30 blur-2xl" />

            <div className="relative space-y-5">
              <div className="inline-flex rounded-full border border-white/15 bg-white/10 p-3">
                <GraduationCap className="h-7 w-7" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/30">Why this exists</p>
                <p className="mt-3 text-lg font-semibold leading-8 text-white">
                  Quality tuition decisions should not depend on scattered Facebook posts, random phone numbers, or
                  unclear tutor profiles.
                </p>
              </div>

              <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 text-primary/40" />
                  <p className="text-sm leading-6 text-slate-200">
                    Organized tutor information with class and subject relevance.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-primary/40" />
                  <p className="text-sm leading-6 text-slate-200">
                    Local matching that respects district and area-specific needs.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-5 w-5 text-primary/40" />
                  <p className="text-sm leading-6 text-slate-200">
                    A smoother experience for both tutors and families.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] border border-primary/15 bg-primary/5 p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Our mission</p>
            <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">
              Build a dependable tuition ecosystem, not just another listing page.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              We want students to find support faster, tutors to present themselves better, and guardians to make
              decisions with less friction. The product is designed around trust, clarity, and practical matching.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {values.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="inline-flex rounded-2xl bg-primary p-3 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[32px] border border-primary/20 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_94%,black),color-mix(in_srgb,var(--primary)_80%,#1f2937),color-mix(in_srgb,var(--primary)_65%,#475569))] p-6 text-white shadow-[0_20px_70px_rgba(15,23,42,0.14)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/30">How it works</p>
              <h2 className="mt-3 text-2xl font-black sm:text-3xl">A simple flow with less guesswork.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-300">
              Every step is meant to reduce back-and-forth, improve trust, and make the tuition process easier to
              understand for everyone involved.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-black text-primary/30">{step.number}</p>
                <h3 className="mt-3 text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff,#f8fafc)] p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Ready to begin</p>
              <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">
                Start exploring and find the support that fits.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Whether you are searching for a tutor, comparing learning options, or preparing your profile, the
                platform is built to make that next step clearer.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/registration"
                className="inline-flex items-center justify-center rounded-full border border-primary bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Join Now
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-primary/25 px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
              >
                Talk to Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
