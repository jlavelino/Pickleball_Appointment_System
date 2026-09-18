import { defineEventHandler, getRouterParam, createError, setHeader } from 'h3'
import fs from 'node:fs'
import path from 'node:path'
import { useServerSupabase } from '~~/server/utils/supabase'

const uploadsDir = path.resolve(process.cwd(), 'server', 'data', 'id_photos')

export default defineEventHandler(async (event) => {
  const filename = getRouterParam(event, 'filename')
  if (!filename) {
    throw createError({ statusCode: 400, message: 'Filename required' })
  }

  // sanitize filename to avoid directory traversal
  const safeFilename = path.basename(filename)
  const filePath = path.resolve(uploadsDir, safeFilename)

  const ext = path.extname(safeFilename).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  }
  const contentType = mimeTypes[ext] || 'image/jpeg'

  // 1. If cached on local disk, serve directly
  if (fs.existsSync(filePath)) {
    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Cache-Control', 'public, max-age=86400')
    return fs.readFileSync(filePath)
  }

  // 2. Try fetching from Supabase Storage 'id-photos' bucket
  try {
    const supabase = useServerSupabase()
    const { data: blob, error } = await supabase.storage
      .from('id-photos')
      .download(safeFilename)

    if (blob && !error) {
      const arrayBuffer = await blob.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Cache locally for fast subsequent requests
      try {
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
        fs.writeFileSync(filePath, buffer)
      } catch {}

      setHeader(event, 'Content-Type', contentType)
      setHeader(event, 'Cache-Control', 'public, max-age=86400')
      return buffer
    }
  } catch (err) {
    console.warn(`[ID Photo Proxy] Error fetching ${safeFilename} from Supabase:`, err)
  }

  throw createError({ statusCode: 404, message: 'Photo not found' })
})
