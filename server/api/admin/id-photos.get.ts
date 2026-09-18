import { defineEventHandler } from 'h3'
import fs from 'node:fs'
import path from 'node:path'

const mapFile = path.resolve(process.cwd(), 'server', 'data', 'id_photos.json')

export default defineEventHandler(async () => {
  try {
    if (fs.existsSync(mapFile)) {
      return { success: true, data: JSON.parse(fs.readFileSync(mapFile, 'utf-8')) }
    }
  } catch (e) {
    console.error('[Admin id-photos] Error reading map:', e)
  }
  return { success: true, data: {} }
})
