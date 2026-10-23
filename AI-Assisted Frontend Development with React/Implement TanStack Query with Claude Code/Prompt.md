# TanStack Query Migration Prompt

```text
Plan a migration of our data fetching to TanStack Query. Install @tanstack/react-query and react-error-boundary. In src/main.jsx, create one QueryClient outside any component, with queries set to retry once, and wrap the app in QueryClientProvider. Add a fetchJson(url, { signal }) helper in src/api/fetchJson.js that throws when response.ok is false. Replace the useEffect fetches with two hooks that use TanStack's signal:

- useTrips() in src/hooks/useTrips.js, used by src/pages/TripsPage.jsx
- useDestination({ countryCode, latitude, longitude }) in src/hooks/useDestination.js, which loads the country and the forecast and is used by src/components/TripConditions.jsx

Keep the existing request URLs, including the /restcountries proxy path, and the response fields the components use today. Use useSuspenseQuery. Create a reusable src/components/QueryBoundary.jsx that combines QueryErrorResetBoundary, an ErrorBoundary from react-error-boundary with a Try again button, and a Suspense fallback that shows a loading message. Wrap the trips list and TripConditions in it. Follow CLAUDE.md.
```