import { defineComponent, computed, mergeProps, useSSRContext, unref } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { u as useHead, c as useRoute, b as useBookingStore, n as navigateTo } from "../server.mjs";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/hookable/dist/index.mjs";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/unctx/dist/index.mjs";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/defu/dist/defu.mjs";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/ufo/dist/index.mjs";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/klona/dist/index.mjs";
import "@supabase/supabase-js";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "BookingQr",
  __ssrInlineRender: true,
  props: {
    bookingRef: {},
    courtName: {},
    slotRange: {},
    dateLabel: {},
    payMethod: {},
    paddleCount: {},
    foodCount: {}
  },
  emits: ["restart"],
  setup(__props) {
    const props = __props;
    const qrCells = computed(() => {
      let seed = 0;
      for (let i = 0; i < props.bookingRef.length; i++) {
        seed = seed * 31 + props.bookingRef.charCodeAt(i) >>> 0;
      }
      function rnd() {
        seed = seed * 1103515245 + 12345 >>> 0;
        return (seed >>> 8) % 100;
      }
      const cells = [];
      for (let i = 0; i < 81; i++) {
        cells.push(rnd() < 45);
      }
      return cells;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-center pt-[6px]" }, _attrs))}><div class="relative w-[120px] h-[120px] mx-auto mb-[14px]"><svg width="120" height="120" viewBox="0 0 120 120" fill="none"><path d="M35 60 L15 35" stroke="#38591A" stroke-width="6" stroke-linecap="round"></path><path d="M85 60 L105 35" stroke="#38591A" stroke-width="6" stroke-linecap="round"></path><circle cx="13" cy="32" r="6" fill="#4C7A22"></circle><circle cx="107" cy="32" r="6" fill="#4C7A22"></circle><path d="M20 70 C15 40 35 15 60 15 C90 15 105 35 100 65 C95 95 70 108 45 102 C25 97 22 88 20 70Z" fill="#96C33E" stroke="#38591A" stroke-width="3"></path><circle cx="45" cy="55" r="2.4" fill="#38591A"></circle><circle cx="60" cy="45" r="2.4" fill="#38591A"></circle><circle cx="70" cy="60" r="2.4" fill="#38591A"></circle><circle cx="55" cy="72" r="2.4" fill="#38591A"></circle><circle cx="75" cy="78" r="2.4" fill="#38591A"></circle><rect x="38" y="48" width="16" height="10" rx="4" fill="#223318"></rect><rect x="58" y="46" width="16" height="10" rx="4" fill="#223318"></rect><line x1="54" y1="51" x2="58" y2="49" stroke="#223318" stroke-width="2"></line><path d="M44 78 Q58 90 72 76" stroke="#223318" stroke-width="3" fill="none" stroke-linecap="round"></path></svg><div class="absolute -right-0.5 bottom-0.5 w-[30px] h-[30px] rounded-full bg-lime border-[3px] border-cream flex items-center justify-center text-[14px] text-ink font-bold shadow-xs"> ✓ </div></div><div class="bg-white border border-line rounded-[18px] p-[22px] inline-block mb-[18px] shadow-sm"><div class="grid grid-cols-9 grid-rows-9 gap-1 w-[122px] h-[122px]"><!--[-->`);
      ssrRenderList(qrCells.value, (on, i) => {
        _push(`<div class="${ssrRenderClass([on ? "bg-ink" : "bg-transparent", "rounded-[2px]"])}"></div>`);
      });
      _push(`<!--]--></div></div><div class="text-gray text-[13px] tracking-[0.02em] mb-1 font-mono">${ssrInterpolate(__props.bookingRef)}</div><div class="font-display font-semibold text-[22px] mb-0.5 text-ink">${ssrInterpolate(__props.courtName)}</div><div class="text-ink-soft text-[14.5px] mb-[22px]">${ssrInterpolate(__props.slotRange)} · ${ssrInterpolate(__props.dateLabel)}</div><div class="bg-white border border-line rounded-card p-[18px] text-left mb-4 shadow-xs"><div class="flex justify-between items-center py-[13px] px-1 border-b border-line"><div class="flex items-center gap-2.5"><div class="w-[19px] h-[19px] rounded-full bg-lime-soft text-lime-text flex items-center justify-center text-[11px] font-bold flex-shrink-0"> ✓ </div><div class="font-semibold text-[14.5px]">Payment</div></div><div class="text-ink-soft text-[14px]">Paid · ${ssrInterpolate(__props.payMethod === "gcash" ? "GCash" : "Maya")}</div></div><div class="flex justify-between items-center py-[13px] px-1 border-b border-line"><div class="flex items-center gap-2.5"><div class="w-[19px] h-[19px] rounded-full bg-lime-soft text-lime-text flex items-center justify-center text-[11px] font-bold flex-shrink-0"> ✓ </div><div class="font-semibold text-[14.5px]">Court</div></div><div class="text-ink-soft text-[14px]">Reserved</div></div><div class="flex justify-between items-center py-[13px] px-1 border-b border-line"><div class="flex items-center gap-2.5"><div class="w-[19px] h-[19px] rounded-full bg-lime-soft text-lime-text flex items-center justify-center text-[11px] font-bold flex-shrink-0"> ✓ </div><div class="font-semibold text-[14.5px]">Paddles</div></div><div class="text-ink-soft text-[14px]">${ssrInterpolate(__props.paddleCount > 0 ? `${__props.paddleCount} held` : "None")}</div></div><div class="flex justify-between items-center py-[13px] px-1"><div class="flex items-center gap-2.5"><div class="w-[19px] h-[19px] rounded-full bg-lime-soft text-lime-text flex items-center justify-center text-[11px] font-bold flex-shrink-0"> ✓ </div><div class="font-semibold text-[14.5px]">Food</div></div><div class="text-ink-soft text-[14px]">${ssrInterpolate(__props.foodCount > 0 ? `${__props.foodCount} items, preparing` : "No food ordered")}</div></div></div><button type="button" class="w-full flex items-center justify-center gap-2.5 py-4 px-6 mt-5 rounded-2xl bg-[var(--ink)] text-[var(--cream)] font-bold text-[15px] shadow-[0_4px_16px_-4px_rgba(34,51,24,0.4)] hover:bg-[#2e4a1a] hover:shadow-[0_6px_22px_-4px_rgba(34,51,24,0.5)] active:scale-[0.98] transition-all cursor-pointer group"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:scale-110 duration-150"><path d="M12 5v14M5 12h14"></path></svg><span>Book another court</span></button></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/booking/BookingQr.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[bookingId]",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Booking confirmed — DINK" });
    const route = useRoute();
    const store = useBookingStore();
    const bookingRef = computed(
      () => String(route.params.bookingId || store.bookingRef || "PB-20260915-00124")
    );
    function handleRestart() {
      store.reset();
      navigateTo("/");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col min-h-full" }, _attrs))}><div class="flex-1 pb-6">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        "booking-ref": bookingRef.value,
        "court-name": unref(store).courtNamesLabel || unref(store).selectedCourt?.name || "Court 1",
        "slot-range": unref(store).slotRangeLabel || "8:00 AM – 10:00 AM",
        "date-label": unref(store).dateLabel || "Tue, Sep 15",
        "pay-method": unref(store).payMethod,
        "paddle-count": unref(store).paddleCount,
        "food-count": unref(store).foodCount,
        onRestart: handleRestart
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/book/confirmed/[bookingId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=_bookingId_--wLS27Pu.js.map
