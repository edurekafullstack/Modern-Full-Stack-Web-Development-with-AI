export const suggestedPlaces = Array.from({ length: 500 }, (_, index) => ({
  id: `place-${index}`,
  name: `Lisbon spot ${index + 1}`,
  rating: (index % 50) / 10 + 0.1,
}))