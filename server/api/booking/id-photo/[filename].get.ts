import { defineEventHandler, getRouterParam, createError, setHeader } from 'h3'
import fs from 'node:fs'
import path from 'node:path'

const uploadsDir = path.resolve(process.cwd(), 'server', 'data', 'id_photos')

export default defineEventHandler(async (event) => {
  const filename = getRouterParam(event, 'filename')
  if (!filename) {
    throw createError({ statusCode: 400, message: 'Filename required' })
  }

  // sanitize filename to avoid directory traversal
  const safeFilename = path.basename(filename)
  const filePath = path.resolve(uploadsDir, safeFilename)

  if (!fs.existsSync(filePath)) {
    throw createError({ statusCode: 404, message: 'Photo not found' })
  }

  const ext = path.extname(safeFilename).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  }

  setHeader(event, 'Content-Type', mimeTypes[ext] || 'image/jpeg')
  setHeader(event, 'Cache-Control', 'public, max-age=86400')

  return fs.readFileSync(filePath)
})
