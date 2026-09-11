import { defineComponent, computed, mergeProps, useSSRContext, unref } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { u as useBookingStore } from "./booking-S3SdPW5c.js";
import { u as useHead, a as useRoute, n as navigateTo } from "../server.mjs";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/hookable/dist/index.mjs";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/unctx/dist/index.mjs";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/defu/dist/defu.mjs";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/ufo/dist/index.mjs";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/klona/dist/index.mjs";
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-center pt-[18px]" }, _attrs))}><div class="w-14 h-14 rounded-full bg-lime flex items-center justify-center mx-auto mb-[22px] text-[24px] text-ink"> ✓ </div><div class="bg-white border border-line rounded-[18px] p-[22px] inline-block mb-[18px] shadow-sm"><div class="grid grid-cols-9 grid-rows-9 gap-1 w-[122px] h-[122px]"><!--[-->`);
      ssrRenderList(qrCells.value, (on, i) => {
        _push(`<div class="${ssrRenderClass([on ? "bg-ink" : "bg-transparent", "rounded-[2px]"])}"></div>`);
      });
      _push(`<!--]--></div></div><div class="text-gray text-[13px] tracking-[0.02em] mb-1 font-mono">${ssrInterpolate(__props.bookingRef)}</div><div class="font-display font-semibold text-[22px] mb-0.5">${ssrInterpolate(__props.courtName)}</div><div class="text-ink-soft text-[14.5px] mb-[22px]">${ssrInterpolate(__props.slotRange)} · ${ssrInterpolate(__props.dateLabel)}</div><div class="bg-white border border-line rounded-card p-[18px] text-left mb-4"><div class="flex justify-between items-center py-[13px] px-1 border-b border-line"><div class="flex items-center gap-2.5"><div class="w-[19px] h-[19px] rounded-full bg-lime-soft text-lime-text flex items-center justify-center text-[11px] font-bold flex-shrink-0"> ✓ </div><div class="font-semibold text-[14.5px]">Payment</div></div><div class="text-ink-soft text-[14px]">Paid · ${ssrInterpolate(__props.payMethod === "gcash" ? "GCash" : "Maya")}</div></div><div class="flex justify-between items-center py-[13px] px-1 border-b border-line"><div class="flex items-center gap-2.5"><div class="w-[19px] h-[19px] rounded-full bg-lime-soft text-lime-text flex items-center justify-center text-[11px] font-bold flex-shrink-0"> ✓ </div><div class="font-semibold text-[14.5px]">Court</div></div><div class="text-ink-soft text-[14px]">Reserved</div></div><div class="flex justify-between items-center py-[13px] px-1 border-b border-line"><div class="flex items-center gap-2.5"><div class="w-[19px] h-[19px] rounded-full bg-lime-soft text-lime-text flex items-center justify-center text-[11px] font-bold flex-shrink-0"> ✓ </div><div class="font-semibold text-[14.5px]">Paddles</div></div><div class="text-ink-soft text-[14px]">${ssrInterpolate(__props.paddleCount > 0 ? `${__props.paddleCount} held` : "None")}</div></div><div class="flex justify-between items-center py-[13px] px-1"><div class="flex items-center gap-2.5"><div class="w-[19px] h-[19px] rounded-full bg-lime-soft text-lime-text flex items-center justify-center text-[11px] font-bold flex-shrink-0"> ✓ </div><div class="font-semibold text-[14.5px]">Food</div></div><div class="text-ink-soft text-[14px]">${ssrInterpolate(__props.foodCount > 0 ? `${__props.foodCount} items, preparing` : "No food ordered")}</div></div></div><button type="button" class="block w-full text-center text-ink-soft text-[13.5px] mt-4 underline cursor-pointer bg-transparent border-none font-sans"> Book another court </button></div>`);
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
        "court-name": unref(store).selectedCourt?.name || "Court 2",
        "slot-range": unref(store).slotRangeLabel || "7:00 – 8:00 PM",
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
//# sourceMappingURL=_bookingId_-BQyr5WTI.js.map
