import { defineComponent, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderTeleport } from 'vue/server-renderer';
import { _ as _export_sfc, b as useBookingStore } from './server.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CalendarPicker",
  __ssrInlineRender: true,
  emits: ["dateSelected"],
  setup(__props, { emit: __emit }) {
    const store = useBookingStore();
    const dows = ["S", "M", "T", "W", "T", "F", "S"];
    const monthName = computed(
      () => new Date(store.year, store.month, 1).toLocaleDateString("en-US", { month: "long" })
    );
    const firstDow = computed(
      () => new Date(store.year, store.month, 1).getDay()
    );
    const daysInMonth = computed(
      () => new Date(store.year, store.month + 1, 0).getDate()
    );
    const today = new Date(2026, 8, 10);
    function isPast(d) {
      const cellDate = new Date(store.year, store.month, d);
      return cellDate < today;
    }
    function isFullyBooked(d) {
      if (d === store.day) {
        return store.isCurrentDayFullyBooked;
      }
      return false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-c8ce8a35><div class="flex items-center justify-between mb-[14px]" data-v-c8ce8a35><h3 class="font-display text-[18px] font-semibold m-0" data-v-c8ce8a35>${ssrInterpolate(monthName.value)} ${ssrInterpolate(unref(store).year)}</h3><div class="flex gap-1.5" data-v-c8ce8a35><button type="button" aria-label="Previous Month" class="cal-nav-btn" data-v-c8ce8a35> \u2039 </button><button type="button" aria-label="Next Month" class="cal-nav-btn" data-v-c8ce8a35> \u203A </button></div></div><div class="grid grid-cols-7 gap-y-1 gap-x-0.5 mb-2" data-v-c8ce8a35><!--[-->`);
      ssrRenderList(dows, (d) => {
        _push(`<div class="text-center text-[12px] text-gray font-semibold pb-1.5" data-v-c8ce8a35>${ssrInterpolate(d)}</div>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(firstDow.value, (i) => {
        _push(`<div class="text-center py-[9px] text-[14.5px]" data-v-c8ce8a35></div>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(daysInMonth.value, (d) => {
        _push(`<button type="button"${ssrIncludeBooleanAttr(isPast(d)) ? " disabled" : ""} class="${ssrRenderClass([[
          d === unref(store).day ? "cal-day--selected" : isPast(d) ? "cal-day--past" : isFullyBooked(d) ? "cal-day--booked" : "cal-day--available"
        ], "cal-day relative flex flex-col items-center justify-center min-h-[40px] py-1"])}" data-v-c8ce8a35><span class="${ssrRenderClass([d === unref(store).day ? "font-bold" : "", "text-[14px] leading-tight"])}" data-v-c8ce8a35>${ssrInterpolate(d)}</span>`);
        if (isFullyBooked(d) && !isPast(d)) {
          _push(`<span class="${ssrRenderClass([d === unref(store).day ? "bg-[#FF7373] ring-1 ring-white/60" : "bg-[#E5484D]", "w-1.5 h-1.5 rounded-full mt-0.5 shrink-0 transition-all"])}" title="Fully booked" data-v-c8ce8a35></span>`);
        } else {
          _push(`<span class="w-1.5 h-1.5 mt-0.5 shrink-0 opacity-0" aria-hidden="true" data-v-c8ce8a35></span>`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div><div class="flex items-center justify-center mt-1 mb-2.5 text-[11.5px] font-medium text-[var(--ink-soft)]" data-v-c8ce8a35><div class="flex items-center gap-1.5" data-v-c8ce8a35><span class="w-2 h-2 rounded-full bg-[#E5484D] shrink-0" data-v-c8ce8a35></span><span data-v-c8ce8a35>Fully booked</span></div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/booking/CalendarPicker.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const CalendarPicker = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-c8ce8a35"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TimeSlotModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean }
  },
  emits: ["close", "confirm"],
  setup(__props, { emit: __emit }) {
    const store = useBookingStore();
    function isSelected(idx) {
      return store.selectedSlots.includes(idx);
    }
    const confirmButtonText = computed(() => {
      var _a;
      if (store.isCurrentDayFullyBooked) return "Fully Booked \u2014 No Slots";
      const count = store.selectedSlots.length;
      if (count === 0) return "Select time slot(s)";
      if (count === 1) {
        const label = ((_a = store.slots[store.selectedSlots[0]]) == null ? void 0 : _a.label) || "";
        return `Confirm ${label} (1 hr)`;
      }
      return `Confirm ${count} time slots (${count} hrs)`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.show) {
          _push2(`<div class="timeslot-backdrop" data-v-a2ab8f4a><template>`);
          if (__props.show) {
            _push2(`<div class="timeslot-sheet" role="dialog" aria-modal="true" data-v-a2ab8f4a><div class="sheet-handle" data-v-a2ab8f4a></div><div class="sheet-header" data-v-a2ab8f4a><div class="sheet-header-text" data-v-a2ab8f4a><span class="sheet-eyebrow" data-v-a2ab8f4a>${ssrInterpolate(unref(store).fullDateLabel.toUpperCase())}</span><div class="flex items-center gap-2" data-v-a2ab8f4a><h3 class="sheet-title" data-v-a2ab8f4a>${ssrInterpolate(unref(store).isCurrentDayFullyBooked ? "Fully Booked" : "Available Times")}</h3>`);
            if (unref(store).isCurrentDayFullyBooked) {
              _push2(`<span class="px-2 py-0.5 rounded-full bg-[#FEECEB] text-[#E5484D] text-[11px] font-bold tracking-wide uppercase" data-v-a2ab8f4a> Sold out </span>`);
            } else if (unref(store).selectedSlots.length > 0) {
              _push2(`<span class="selected-count-badge" data-v-a2ab8f4a>${ssrInterpolate(unref(store).selectedSlots.length)} selected </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><p class="sheet-subtitle whitespace-nowrap" data-v-a2ab8f4a>${ssrInterpolate(unref(store).isCurrentDayFullyBooked ? "No courts open for this date" : "Hourly slots \xB7 8 AM \u2013 11 PM")}</p></div><button type="button" class="sheet-close-btn" aria-label="Close" data-v-a2ab8f4a> \u2715 </button></div><div class="sheet-toolbar" data-v-a2ab8f4a><span class="${ssrRenderClass([unref(store).isCurrentDayFullyBooked ? "text-[#E5484D] font-semibold" : "text-[var(--ink-soft)]", "text-[12px] font-medium"])}" data-v-a2ab8f4a>${ssrInterpolate(unref(store).isCurrentDayFullyBooked ? "All time slots are full for this day" : unref(store).selectedSlots.length === 0 ? "Tap to select multiple times" : `${unref(store).selectedSlots.length} slot(s) chosen`)}</span>`);
            if (unref(store).selectedSlots.length > 0) {
              _push2(`<button type="button" class="clear-btn" data-v-a2ab8f4a> Clear all </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="sheet-slots no-scrollbar" data-v-a2ab8f4a><!--[-->`);
            ssrRenderList(unref(store).slots, (s, idx) => {
              _push2(`<div class="${ssrRenderClass([[
                isSelected(idx) ? "slot-card--selected" : "",
                s.open === 0 ? "slot-card--disabled" : ""
              ], "slot-card"])}" data-v-a2ab8f4a><div class="flex items-center gap-3" data-v-a2ab8f4a><div class="${ssrRenderClass([isSelected(idx) ? "slot-checkbox--active" : "", "slot-checkbox"])}" data-v-a2ab8f4a>`);
              if (isSelected(idx)) {
                _push2(`<svg class="w-3.5 h-3.5 text-cream" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" data-v-a2ab8f4a><polyline points="20 6 9 17 4 12" data-v-a2ab8f4a></polyline></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><span class="slot-label" data-v-a2ab8f4a>${ssrInterpolate(s.label)}</span></div><span class="${ssrRenderClass([[
                isSelected(idx) ? "slot-badge--selected" : s.open === 0 ? "slot-badge--full" : "slot-badge--open"
              ], "slot-badge"])}" data-v-a2ab8f4a>${ssrInterpolate(s.open === 0 ? "Full" : `${s.open} ${s.open === 1 ? "court open" : "courts open"}`)}</span></div>`);
            });
            _push2(`<!--]--></div><div class="sheet-footer" data-v-a2ab8f4a><button type="button" class="confirm-btn"${ssrIncludeBooleanAttr(unref(store).selectedSlots.length === 0) ? " disabled" : ""} data-v-a2ab8f4a>${ssrInterpolate(confirmButtonText.value)}</button></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</template></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/booking/TimeSlotModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const TimeSlotModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a2ab8f4a"]]);

export { CalendarPicker as C, TimeSlotModal as T };
//# sourceMappingURL=TimeSlotModal-Cyuwq6mp.mjs.map
