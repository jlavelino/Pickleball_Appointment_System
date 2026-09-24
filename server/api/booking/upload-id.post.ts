import { defineEventHandler, readBody } from 'h3'
import { useServerSupabase } from '~~/server/utils/supabase'

function getMimeType(ext: string): string {
  switch (ext.toLowerCase()) {
    case 'png': return 'image/png'
    case 'webp': return 'image/webp'
    case 'gif': return 'image/gif'
    case 'svg': return 'image/svg+xml'
    default: return 'image/jpeg'
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { bookingId, bookingRef, photoBase64, filename } = body || {}

  if (!photoBase64 || (!bookingId && !bookingRef)) {
    return { success: false, message: 'Missing photo data or booking identifiers' }
  }

  // Extract extension from filename or fallback to jpg
  const extMatch = (filename || '').match(/\.([a-zA-Z0-9]+)$/)
  const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg'
  const mimeType = getMimeType(ext)
  const safeName = `${bookingRef || bookingId || 'id'}_${Date.now()}.${ext}`

  // Remove data:image/...;base64, prefix if present
  const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64Data, 'base64')

  const supabase = useServerSupabase()
  const storagePath = safeName

  // Upload directly to Supabase Storage 'id-photos' bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('id-photos')
    .upload(storagePath, buffer, {
      contentType: mimeType,
      upsert: true,
    })

  if (uploadError || !uploadData) {
    console.error('[Upload ID] Supabase storage upload failed:', uploadError?.message)
    return { success: false, message: uploadError?.message || 'Storage upload failed' }
  }

  // Get public URL from Supabase
  const { data: pubData } = supabase.storage.from('id-photos').getPublicUrl(storagePath)
  const publicUrl = pubData?.publicUrl || ''

  // Update booking_guests in Supabase database
  if (bookingId && publicUrl) {
    const { error: dbError } = await supabase
      .from('booking_guests')
      .update({ id_photo_url: publicUrl })
      .eq('booking_id', bookingId)

    if (dbError) {
      console.warn('[Upload ID] Warning: could not update booking_guests.id_photo_url:', dbError.message)
    } else {
      console.log(`[Upload ID] Updated booking_guests for booking ${bookingId} with Supabase URL`)
    }
  }

  return {
    success: true,
    url: publicUrl,
    filename: safeName,
    storage: 'supabase',
  }
})
