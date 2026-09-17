import { defineEventHandler, readBody } from 'h3'
import fs from 'node:fs'
import path from 'node:path'

const uploadsDir = path.resolve(process.cwd(), 'server', 'data', 'id_photos')
const mapFile = path.resolve(process.cwd(), 'server', 'data', 'id_photos.json')

function getMap(): Record<string, string> {
  try {
    if (fs.existsSync(mapFile)) {
      return JSON.parse(fs.readFileSync(mapFile, 'utf-8'))
    }
  } catch {}
  return {}
}

function saveMap(map: Record<string, string>) {
  try {
    const dir = path.dirname(mapFile)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(mapFile, JSON.stringify(map, null, 2), 'utf-8')
  } catch (e) {
    console.error('[Upload ID] Error saving id map:', e)
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { bookingId, bookingRef, photoBase64, filename } = body || {}

  if (!photoBase64 || (!bookingId && !bookingRef)) {
    return { success: false, message: 'Missing photo data or booking identifiers' }
  }

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }

  // Extract extension from filename or fallback to jpg
  const extMatch = (filename || '').match(/\.([a-zA-Z0-9]+)$/)
  const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg'
  const safeName = `${bookingRef || bookingId || 'id'}_${Date.now()}.${ext}`
  const filePath = path.resolve(uploadsDir, safeName)

  // Remove data:image/...;base64, prefix if present
  const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64Data, 'base64')
  fs.writeFileSync(filePath, buffer)

  const url = `/api/booking/id-photo/${safeName}`

  const map = getMap()
  if (bookingId) map[bookingId] = url
  if (bookingRef) map[bookingRef] = url
  saveMap(map)

  return { success: true, url, filename: safeName }
})
