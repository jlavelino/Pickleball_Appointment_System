import { d as defineStore } from './server.mjs';

const COURTS = [
  { id: 1, name: "Court 1", price: 300, type: "indoor" },
  { id: 2, name: "Court 2", price: 300, type: "indoor" },
  { id: 3, name: "Court 3", price: 350, type: "covered outdoor" }
];
const PADDLES = [
  { id: "standard", name: "Standard paddle", price: 100, stock: 13 },
  { id: "premium", name: "Premium paddle", price: 150, stock: 6 },
  { id: "pro", name: "Pro paddle", price: 200, stock: 4 }
];
const FOOD_GROUPS = [
  {
    label: "Meals",
    items: [
      { id: "chicken", name: "Chicken sandwich", price: 150, category: "Meals" },
      { id: "burger", name: "Burger", price: 180, category: "Meals" }
    ]
  },
  {
    label: "Snacks & drinks",
    items: [
      { id: "fries", name: "Fries", price: 80, category: "Snacks & drinks" },
      { id: "water", name: "Bottled water", price: 30, category: "Snacks & drinks" }
    ]
  }
];
const ALL_FOOD = FOOD_GROUPS.flatMap((g) => g.items);
function seededVals(day) {
  if (day === 15) return [3, 2, 1];
  const a = day * 13 % 4;
  const b = day * 7 % 4;
  const c = day * 5 % 3;
  return [a, b, c];
}
const useBookingStore = defineStore("booking", {
  state: () => ({
    year: 2026,
    month: 8,
    // September
    day: 15,
    slotIndex: null,
    courtId: null,
    paddleQty: { standard: 0, premium: 0, pro: 0 },
    foodQty: { chicken: 0, burger: 0, fries: 0, water: 0 },
    payMethod: "gcash",
    holdSeconds: 10 * 60,
    bookingRef: null
  }),
  getters: {
    slots: (s) => {
      const vals = seededVals(s.day);
      const labels = ["6:00 PM", "7:00 PM", "8:00 PM"];
      return labels.map((label, i) => ({ label, open: vals[i] }));
    },
    selectedSlot: (s) => {
      if (s.slotIndex === null) return null;
      const vals = seededVals(s.day);
      const labels = ["6:00 PM", "7:00 PM", "8:00 PM"];
      return { label: labels[s.slotIndex], open: vals[s.slotIndex] };
    },
    selectedCourt: (s) => {
      return COURTS.find((c) => c.id === s.courtId) || null;
    },
    courtsStatusMap: (s) => {
      const slot = s.slotIndex !== null ? seededVals(s.day)[s.slotIndex] : 3;
      if (slot >= 3) return { 1: "open", 2: "open", 3: "low" };
      if (slot === 2) return { 1: "open", 2: "open", 3: "full" };
      if (slot === 1) return { 1: "open", 2: "full", 3: "full" };
      return { 1: "full", 2: "full", 3: "full" };
    },
    paddleTotal: (s) => {
      return PADDLES.reduce((sum, p) => sum + p.price * (s.paddleQty[p.id] || 0), 0);
    },
    paddleCount: (s) => {
      return PADDLES.reduce((sum, p) => sum + (s.paddleQty[p.id] || 0), 0);
    },
    foodTotal: (s) => {
      return ALL_FOOD.reduce((sum, f) => sum + f.price * (s.foodQty[f.id] || 0), 0);
    },
    foodCount: (s) => {
      return ALL_FOOD.reduce((sum, f) => sum + (s.foodQty[f.id] || 0), 0);
    },
    courtTotal: (s) => {
      const c = COURTS.find((x) => x.id === s.courtId);
      return c ? c.price : 0;
    },
    grandTotal: (s) => {
      const c = COURTS.find((x) => x.id === s.courtId);
      const courtPrice = c ? c.price : 0;
      const pTotal = PADDLES.reduce((sum, p) => sum + p.price * (s.paddleQty[p.id] || 0), 0);
      const fTotal = ALL_FOOD.reduce((sum, f) => sum + f.price * (s.foodQty[f.id] || 0), 0);
      return courtPrice + pTotal + fTotal;
    },
    dateLabel: (s) => {
      const d = new Date(s.year, s.month, s.day);
      const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
      const monthName = d.toLocaleDateString("en-US", { month: "short" });
      return `${weekday}, ${monthName} ${s.day}`;
    },
    fullDateLabel: (s) => {
      const d = new Date(s.year, s.month, s.day);
      const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
      const monthName = d.toLocaleDateString("en-US", { month: "long" });
      return `${weekday}, ${monthName} ${s.day}`;
    },
    slotRangeLabel: (s) => {
      if (s.slotIndex === null) return "";
      const labels = ["6:00 PM", "7:00 PM", "8:00 PM"];
      const label = labels[s.slotIndex];
      const startHour = parseInt(label);
      const endHour = startHour + 1;
      return `${label} \u2013 ${endHour}:00 PM`;
    }
  },
  actions: {
    setDay(day) {
      this.day = day;
      this.slotIndex = null;
    },
    prevMonth() {
      this.month -= 1;
      if (this.month < 0) {
        this.month = 11;
        this.year -= 1;
      }
      this.day = 1;
      this.slotIndex = null;
    },
    nextMonth() {
      this.month += 1;
      if (this.month > 11) {
        this.month = 0;
        this.year += 1;
      }
      this.day = 1;
      this.slotIndex = null;
    },
    setSlot(idx) {
      this.slotIndex = idx;
    },
    setCourt(id) {
      this.courtId = id;
    },
    setPaddleQty(id, dir) {
      const p = PADDLES.find((x) => x.id === id);
      if (!p) return;
      let next = (this.paddleQty[id] || 0) + dir;
      next = Math.max(0, Math.min(p.stock, next));
      this.paddleQty[id] = next;
    },
    setFoodQty(id, dir) {
      let next = (this.foodQty[id] || 0) + dir;
      next = Math.max(0, Math.min(20, next));
      this.foodQty[id] = next;
    },
    startHold() {
      this.holdSeconds = 10 * 60;
    },
    decrementHold() {
      this.holdSeconds = Math.max(0, this.holdSeconds - 1);
    },
    generateBookingRef() {
      const d = new Date(this.year, this.month, this.day);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const rand = Math.floor(1e4 + Math.random() * 89999);
      this.bookingRef = `PB-${y}${m}${day}-${rand}`;
      return this.bookingRef;
    },
    reset() {
      this.slotIndex = null;
      this.courtId = null;
      this.paddleQty = { standard: 0, premium: 0, pro: 0 };
      this.foodQty = { chicken: 0, burger: 0, fries: 0, water: 0 };
      this.payMethod = "gcash";
      this.holdSeconds = 10 * 60;
      this.bookingRef = null;
    }
  }
});

export { ALL_FOOD as A, COURTS as C, FOOD_GROUPS as F, PADDLES as P, useBookingStore as u };
//# sourceMappingURL=booking-S3SdPW5c.mjs.map
