import { defineComponent, computed, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderClass } from "vue/server-renderer";
import { u as useBookingStore } from "./booking-S3SdPW5c.js";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CalendarPicker",
  __ssrInlineRender: true,
  setup(__props) {
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
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-[14px]"><h3 class="font-display text-[18px] font-semibold m-0">${ssrInterpolate(monthName.value)} ${ssrInterpolate(unref(store).year)}</h3><div class="flex gap-1.5"><button type="button" aria-label="Previous Month" class="w-7 h-7 rounded-lg border border-line bg-white cursor-pointer text-[13px] text-ink flex items-center justify-center hover:bg-cream/50"> ‹ </button><button type="button" aria-label="Next Month" class="w-7 h-7 rounded-lg border border-line bg-white cursor-pointer text-[13px] text-ink flex items-center justify-center hover:bg-cream/50"> › </button></div></div><div class="grid grid-cols-7 gap-y-1 gap-x-0.5 mb-[22px]"><!--[-->`);
      ssrRenderList(dows, (d) => {
        _push(`<div class="text-center text-[12px] text-gray font-semibold pb-1.5">${ssrInterpolate(d)}</div>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(firstDow.value, (i) => {
        _push(`<div class="text-center py-[9px] text-[14.5px]"></div>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(daysInMonth.value, (d) => {
        _push(`<button type="button"${ssrIncludeBooleanAttr(isPast(d)) ? " disabled" : ""} class="${ssrRenderClass([[
          d === unref(store).day ? "bg-ink text-white font-semibold" : isPast(d) ? "text-[#C9C4B3] cursor-not-allowed bg-transparent" : "text-ink bg-transparent hover:bg-white"
        ], "text-center py-[9px] rounded-[10px] text-[14.5px] cursor-pointer transition-colors border-none"])}">${ssrInterpolate(d)}</button>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/booking/CalendarPicker.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TimeSlotList",
  __ssrInlineRender: true,
  setup(__props) {
    const store = useBookingStore();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="text-[12.5px] tracking-[0.03em] text-gray font-semibold mb-2.5">${ssrInterpolate(unref(store).fullDateLabel.toUpperCase())} · AVAILABLE TIMES </div><!--[-->`);
      ssrRenderList(unref(store).slots, (s, idx) => {
        _push(`<div class="${ssrRenderClass([[
          unref(store).slotIndex === idx ? "bg-ink text-white border-ink" : s.open === 0 ? "opacity-45 cursor-not-allowed bg-white border-line" : "cursor-pointer bg-white border-line hover:border-ink/50"
        ], "flex items-center justify-between p-[16px_18px] rounded-[14px] border mb-2.5 transition-all"])}"><span class="text-[15.5px] font-medium">${ssrInterpolate(s.label)}</span><span class="${ssrRenderClass([unref(store).slotIndex === idx ? "text-[#D9DCE8]" : "text-gray", "text-[14px]"])}">${ssrInterpolate(s.open === 0 ? "Full" : `${s.open} ${s.open === 1 ? "court open" : "courts open"}`)}</span></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/booking/TimeSlotList.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main$1 as _,
  _sfc_main as a
};
//# sourceMappingURL=TimeSlotList-nmQKcqJT.js.map
