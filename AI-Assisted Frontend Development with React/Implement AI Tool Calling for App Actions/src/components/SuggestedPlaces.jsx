import { suggestedPlaces } from '../data/suggestedPlaces.js'

function scorePlace(place) {
  // Stands in for genuinely expensive work, such as ranking or layout calculations
  let score = 0
  for (let i = 0; i < 40000; i++) {
    score += Math.sqrt(i * place.rating)
  }
  return score
}

function SuggestedPlaces() {
  const ranked = suggestedPlaces
    .map((place) => ({ ...place, score: scorePlace(place) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Suggested places</h2>
      <ol className="mt-3 space-y-1 text-sm">
        {ranked.map((place) => (
          <li key={place.id}>{place.name}</li>
        ))}
      </ol>
    </section>
  )
}

export default SuggestedPlaces