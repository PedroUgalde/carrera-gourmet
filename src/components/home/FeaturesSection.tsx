import { Brain, Languages, Users } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Te recomendamos el puesto ideal",
    desc: "Según lo que quieres comer, tu presupuesto y cuántos van contigo.",
    color: "bg-orange-100 text-[#FF6B00]",
  },
  {
    icon: Languages,
    title: "Menú traducido al instante",
    desc: "Suadero, birria, tlacoyo — explicados para turistas que no hablan español.",
    color: "bg-red-100 text-[#D62828]",
  },
  {
    icon: Users,
    title: "Aforo en tiempo real",
    desc: "Ve cuántos lugares quedan y reserva antes de caminar hasta el puesto.",
    color: "bg-amber-100 text-amber-700",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-[#FFF5EB] py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <p className="text-sm font-black uppercase tracking-widest text-[#FF6B00]">
            ¿Cómo funciona?
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-neutral-900 sm:text-4xl">
            Comida callejera, cero complicaciones
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <article
              key={title}
              className="rounded-2xl border-2 border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#FF6B00]/40 hover:shadow-md"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
