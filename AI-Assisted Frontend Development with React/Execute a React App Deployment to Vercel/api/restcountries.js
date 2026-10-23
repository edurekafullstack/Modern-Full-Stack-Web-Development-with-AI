export async function GET(request) {
  const url = new URL(request.url)
  const pathParts = url.searchParams.getAll('path')
  url.searchParams.delete('path')
  const path = pathParts.length
    ? pathParts.join('/')
    : url.pathname.replace(/^\/(api\/)?restcountries\/?/, '')

  if (!path.startsWith('countries/v5/')) {
    return Response.json({ error: 'Not found.' }, { status: 404 })
  }

  const response = await fetch(`https://api.restcountries.com/${path}${url.search}`, {
    headers: { Authorization: `Bearer ${process.env.RESTCOUNTRIES_API_KEY}` },
  })

  return new Response(response.body, {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  })
}