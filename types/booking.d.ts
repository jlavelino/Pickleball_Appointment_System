export interface Court {
  id: string
  name: string
  pricePerHour: number
  type: string
  availability: 'open' | 'low' | 'closed'
}

export interface TimeSlot {
  time: string
  courtsAvailable: number
}

export interface PaddleItem {
  id: string
  name: string
  price: number
  quantity: number
  stock: number
}

export interface FoodItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
}

export type PaymentMethod = 'gcash' | 'maya'

export type BookingStatus = 'holding' | 'paid' | 'expired' | 'cancelled'

export interface BookingHold {
  bookingId: string
  court: Court
  date: string
  startTime: string
  endTime: string
  paddles: PaddleItem[]
  food: FoodItem[]
  holdExpiresAt: string
  totalAmount: number
  paymentMethod?: PaymentMethod
  status: BookingStatus
}
