import QueryBoundary from '../components/QueryBoundary.jsx'
import TripsSection from '../components/TripsSection.jsx'
import ItineraryGenerator from '../components/ItineraryGenerator.jsx'

function TripsPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">Your trips</h1>
      <QueryBoundary loadingMessage="Loading trips…">
        <TripsSection />
      </QueryBoundary>
      <ItineraryGenerator />
    </section>
  )
}

export default TripsPage