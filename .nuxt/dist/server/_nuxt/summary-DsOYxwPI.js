import { defineComponent, computed, mergeProps, useSSRContext, unref } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { u as useBookingStore, P as PADDLES, A as ALL_FOOD } from "./booking-S3SdPW5c.js";
import { _ as _sfc_main$2 } from "./BottomCta-CK2deTJS.js";
import { u as useHead, n as navigateTo } from "../server.mjs";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/hookable/dist/index.mjs";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/unctx/dist/index.mjs";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/defu/dist/defu.mjs";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/ufo/dist/index.mjs";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/klona/dist/index.mjs";
import "C:/Users/User/OneDrive/Desktop/PICKLE/dink/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "HoldTimer",
  __ssrInlineRender: true,
  props: {
    seconds: {}
  },
  setup(__props) {
    const props = __props;
    const formattedTime = computed(() => {
      const m = Math.floor(props.seconds / 60);
      const s = props.seconds % 60;
      return `${m}:${String(s).padStart(2, "0")}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-2 bg-danger-bg text-danger-text px-4 py-[11px] rounded-[12px] text-[13.5px] font-semibold mb-4" }, _attrs))}><div class="w-[7px] h-[7px] rounded-full bg-danger-text flex-shrink-0 animate-pulse"></div><span>Court held for ${ssrInterpolate(formattedTime.value)} more</span></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/HoldTimer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "summary",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Your booking — DINK" });
    const store = useBookingStore();
    if (store.courtId === null) {
      navigateTo("/book/court");
    }
    const mainPaddleLine = computed(() => {
      const active = PADDLES.filter((p) => store.paddleQty[p.id] > 0).sort((a, b) => b.price * store.paddleQty[b.id] - a.price * store.paddleQty[a.id]);
      if (!active.length) return { main: "", sub: "" };
      const main = `${store.paddleQty[active[0].id]} × ${active[0].name}`;
      const sub = active.slice(1).map((p) => `${store.paddleQty[p.id]} × ${p.name}`).join(", ");
      return { main, sub };
    });
    const mainFoodLine = computed(() => {
      const active = ALL_FOOD.filter((f) => store.foodQty[f.id] > 0).sort((a, b) => b.price * store.foodQty[b.id] - a.price * store.foodQty[a.id]);
      if (!active.length) return { main: "", sub: "" };
      const main = `${store.foodQty[active[0].id]} × ${active[0].name}`;
      const sub = active.slice(1).map((f) => `${store.foodQty[f.id]} × ${f.name}`).join(", ");
      return { main, sub };
    });
    function goNext() {
      navigateTo("/book/payment");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col min-h-full" }, _attrs))}><div class="flex-1"><h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-0.5 mt-1.5"> Your booking </h1><p class="text-ink-soft text-[14.5px] m-0 mb-4 leading-[1.4]"> Everything in one checkout </p>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        seconds: unref(store).holdSeconds
      }, null, _parent));
      _push(`<div class="bg-white border border-line rounded-card p-[18px] mb-4"><div class="font-display font-semibold text-[18px]">${ssrInterpolate(unref(store).selectedCourt?.name)}</div><div class="text-ink-soft text-[14px] mt-0.5">${ssrInterpolate(unref(store).dateLabel)} · ${ssrInterpolate(unref(store).slotRangeLabel)}</div></div><div class="bg-white border border-line rounded-card p-[18px] mb-4"><div class="flex justify-between items-start py-3 border-b border-line"><div><div class="text-[15px]">Court rental</div></div><div class="font-semibold text-[15px]">₱${ssrInterpolate(unref(store).courtTotal)}</div></div>`);
      if (unref(store).paddleCount > 0) {
        _push(`<div class="flex justify-between items-start py-3 border-b border-line"><div><div class="text-[15px]">${ssrInterpolate(mainPaddleLine.value.main)}</div>`);
        if (mainPaddleLine.value.sub) {
          _push(`<div class="text-gray text-[13px] mt-0.5">${ssrInterpolate(mainPaddleLine.value.sub)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="font-semibold text-[15px]">₱${ssrInterpolate(unref(store).paddleTotal)}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(store).foodCount > 0) {
        _push(`<div class="flex justify-between items-start py-3 border-b border-line"><div><div class="text-[15px]">${ssrInterpolate(mainFoodLine.value.main)}</div>`);
        if (mainFoodLine.value.sub) {
          _push(`<div class="text-gray text-[13px] mt-0.5">${ssrInterpolate(mainFoodLine.value.sub)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="font-semibold text-[15px]">₱${ssrInterpolate(unref(store).foodTotal)}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-between items-center pt-3.5 mt-0.5 font-display"><div class="font-semibold text-[17px]">Total</div><div class="font-bold text-[22px]">₱${ssrInterpolate(unref(store).grandTotal)}</div></div></div></div>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        label: "Proceed to payment",
        onClick: goNext
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/book/summary.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=summary-DsOYxwPI.js.map
