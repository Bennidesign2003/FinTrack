import Link from 'next/link'

export default function About() {
  return (
    <main className="container py-16">
      <h1 className="text-3xl font-semibold mb-4">About</h1>
      <p className="mb-6">Diese Demo zeigt eine einfache Next.js-Integration für das Buchhaltungsprojekt.</p>
      <Link href="/" className="text-blue-600 underline">
        Zurück zur Startseite
      </Link>
    </main>
  )
}