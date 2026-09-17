import { defineEventHandler, readBody } from 'h3'
import fs from 'node:fs'
import path from 'node:path'

interface FacilityState {
  courts: Record<string, 'active' | 'maintenance'>
  paddles: Record<string, number>
  foodItems: Record<string, boolean>
}

const dataDir = path.resolve(process.cwd(), 'server', 'data')
const dataFile = path.resolve(dataDir, 'facility.json')

function getFacilityData(): FacilityState {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, 'utf-8')
      return JSON.parse(raw)
    }
  } catch (err) {
    console.error('[Facility API] Error reading facility data:', err)
  }
  return {
    courts: {},
    paddles: {},
    foodItems: {},
  }
}

function saveFacilityData(data: FacilityState) {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.error('[Facility API] Error saving facility data:', err)
  }
}

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    return {
      success: true,
      data: getFacilityData(),
    }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const current = getFacilityData()

    if (body.type === 'court' && body.id && body.status) {
      current.courts[body.id] = body.status
    } else if (body.type === 'paddle' && body.id && typeof body.quantity === 'number') {
      current.paddles[body.id] = body.quantity
    } else if (body.type === 'food' && body.id && typeof body.is_available === 'boolean') {
      current.foodItems[body.id] = body.is_available
    }

    saveFacilityData(current)

    return {
      success: true,
      data: current,
    }
  }

  return { success: false, message: 'Method not supported' }
})
