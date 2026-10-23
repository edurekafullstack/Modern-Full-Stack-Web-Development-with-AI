import app from '../server/app.js'

export function POST(request) {
  return app.fetch(request)
}