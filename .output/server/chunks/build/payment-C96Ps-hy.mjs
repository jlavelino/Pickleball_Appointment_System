import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { u as useHead, b as useBookingStore, n as navigateTo } from './server.mjs';
import { B as BottomCTA } from './BottomCta-BObjgLZJ.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import '@supabase/supabase-js';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PaymentMethodCard",
  __ssrInlineRender: true,
  props: {
    method: {},
    selected: { type: Boolean }
  },
  emits: ["select"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["flex items-center gap-[14px] border-[1.5px] rounded-card p-4 mb-3 cursor-pointer transition-all", __props.selected ? "border-ink bg-[--cream-card] shadow-[0_4px_16px_-4px_rgba(34,51,24,0.2)]" : "border-[--line] bg-[--cream-card] hover:border-[--ink-soft] hover:shadow-[0_2px_10px_-4px_rgba(34,51,24,0.12)]"]
      }, _attrs))}><div class="${ssrRenderClass([__props.method === "gcash" ? "bg-[#0072CE]" : "bg-[#1AA45A]", "w-[42px] h-[42px] rounded-[11px] flex items-center justify-center text-white font-bold text-[17px] flex-shrink-0"])}">${ssrInterpolate(__props.method === "gcash" ? "G" : "M")}</div><div><div class="font-semibold text-[15.5px]">${ssrInterpolate(__props.method === "gcash" ? "GCash" : "Maya")}</div><div class="text-gray text-[13px] mt-[1px]"> Pay securely via ${ssrInterpolate(__props.method === "gcash" ? "GCash" : "Maya")}</div></div><div class="${ssrRenderClass([__props.selected ? "border-ink" : "border-line", "ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"])}">`);
      if (__props.selected) {
        _push(`<div class="w-2.5 h-2.5 rounded-full bg-ink"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/booking/PaymentMethodCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "payment",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Pay for your booking \u2014 DINK" });
    const store = useBookingStore();
    if (store.courtId === null && store.courtIds.length === 0) {
      navigateTo("/book/court");
    }
    const paying = ref(false);
    const errorMessage = ref(null);
    async function pay() {
      paying.value = true;
      errorMessage.value = null;
      try {
        const ref2 = await store.submitBookingToSupabase();
        navigateTo(`/book/confirmed/${ref2}`);
      } catch (err) {
        console.error("Booking submission failed:", err);
        errorMessage.value = err.message || "Payment or booking hold failed. Please try again.";
      } finally {
        paying.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col min-h-full" }, _attrs))}><div class="flex-1"><h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-0.5 mt-1.5"> Pay for your booking </h1><p class="text-ink-soft text-[14.5px] m-0 mb-5 leading-[1.4]"> Choose how you&#39;d like to pay </p>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        method: "gcash",
        selected: unref(store).payMethod === "gcash",
        onSelect: ($event) => unref(store).payMethod = "gcash"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        method: "maya",
        selected: unref(store).payMethod === "maya",
        onSelect: ($event) => unref(store).payMethod = "maya"
      }, null, _parent));
      if (errorMessage.value) {
        _push(`<div class="mt-4 p-3.5 rounded-xl bg-[#FEECEB] border border-[#FDB8B4] text-[#CE2C31] text-[13.5px] leading-snug flex items-start gap-2.5"><span class="text-[16px] leading-none">\u26A0\uFE0F</span><div class="flex-1 font-medium">${ssrInterpolate(errorMessage.value)}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(BottomCTA, {
        label: paying.value ? "Processing\u2026" : `Pay \u20B1${unref(store).grandTotal}`,
        disabled: paying.value,
        onClick: pay
      }, {
        above: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-between items-baseline mb-2 text-ink-soft text-[14px]"${_scopeId}><span${_scopeId}>Total due</span><span class="text-ink font-bold text-[19px] font-display"${_scopeId}>\u20B1${ssrInterpolate(unref(store).grandTotal)}</span></div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-between items-baseline mb-2 text-ink-soft text-[14px]" }, [
                createVNode("span", null, "Total due"),
                createVNode("span", { class: "text-ink font-bold text-[19px] font-display" }, "\u20B1" + toDisplayString(unref(store).grandTotal), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/book/payment.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=payment-C96Ps-hy.mjs.map
