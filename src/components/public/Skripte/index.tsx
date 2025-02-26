import { BookOpen, Share2, Download, Users, Search, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Counter from './Counter'

export default async function Skripte() {
  const payload = await getPayload({
    config: configPromise,
  })

  const numberOfFiles = await payload.count({
    collection: 'files',
  })

  const features = [
    {
      icon: BookOpen,
      title: 'Kvalitetne skripte',
      description: 'Provereni materijali od studenata za studente',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Download,
      title: 'Brz pristup',
      description: 'Preuzmite sve materijale besplatno',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Users,
      title: 'Rastuća zajednica',
      description: 'Pridruži se i pomozi kolegama',
      color: 'from-amber-500 to-orange-600',
    },
  ]

  return (
    <div className="text-center space-y-8 sm:space-y-12 col-span-1 lg:col-span-1 py-4 sm:py-8 px-4 sm:px-6">
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Sva znanja na jednom mestu</h2>
        <p className="text-text/70 max-w-2xl mx-auto text-base sm:text-lg">
          Pristup kvalitetnim materijalima je ključan za uspeh. Naša platforma okuplja sve
          studentske resurse za efikasnije učenje.
        </p>
      </div>

      <div className="relative">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-secondary to-primary opacity-50 blur-xl"></div>
        <div className="relative bg-background/90 backdrop-blur-md rounded-xl px-4 sm:px-8 py-5 sm:py-6 shadow-xl border border-primary/20 max-w-[280px] sm:max-w-sm mx-auto transform transition-all hover:scale-105 duration-300">
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <span className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-flex items-center">
              <Counter end={numberOfFiles.totalDocs} />+
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">dostupnih skripti</h2>
            <span className="px-3 sm:px-4 py-1 bg-primary/10 text-primary text-xs sm:text-sm rounded-full">
              Broj raste svakog dana
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <h3 className="text-xl sm:text-2xl font-semibold">Olakšaj svoje studiranje</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-4 sm:p-5 rounded-xl border border-primary/10 bg-background/50 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 hover:shadow-lg group"
            >
              <div
                className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full mb-3 sm:mb-4 mx-auto flex items-center justify-center bg-gradient-to-br ${feature.color} text-white`}
              >
                <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h4 className="text-lg sm:text-xl font-medium mb-1 sm:mb-2">{feature.title}</h4>
              <p className="text-sm sm:text-base text-text/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
        <Link
          href="/skripte/upload"
          className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 active:scale-95 relative overflow-hidden"
        >
          <span className="relative z-10">Podeli svoje skripte</span>
          <Share2 className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
          {/* gradient layers remain the same */}
        </Link>

        <Link
          href="/skripte/"
          className="group inline-flex items-center justify-center rounded-xl bg-background border border-primary/30 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-text transition-all duration-300 hover:bg-primary/5 active:scale-95"
        >
          <Search className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          <span>Pretraži skripte</span>
          <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </Link>
      </div>
    </div>
  )
}
