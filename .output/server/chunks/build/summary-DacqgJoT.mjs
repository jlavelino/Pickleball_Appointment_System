import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useHead, b as useBookingStore, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$1 } from './HoldTimer-Cc_Vy36q.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "summary",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Your booking \u2014 PickleBook" });
    const store = useBookingStore();
    if (store.courtId === null && store.courtIds.length === 0) {
      navigateTo("/book/court");
    }
    const mainPaddleLine = computed(() => {
      const active = store.paddles.filter((p) => (store.paddleQty[p.id] || 0) > 0).sort((a, b) => b.price * (store.paddleQty[b.id] || 0) - a.price * (store.paddleQty[a.id] || 0));
      if (!active.length) return { main: "", sub: "" };
      const main = `${store.paddleQty[active[0].id]} \xD7 ${active[0].name}`;
      const sub = active.slice(1).map((p) => `${store.paddleQty[p.id]} \xD7 ${p.name}`).join(", ");
      return { main, sub };
    });
    const mainFoodLine = computed(() => {
      const active = store.allFood.filter((f) => (store.foodQty[f.id] || 0) > 0).sort((a, b) => b.price * (store.foodQty[b.id] || 0) - a.price * (store.foodQty[a.id] || 0));
      if (!active.length) return { main: "", sub: "" };
      const main = `${store.foodQty[active[0].id]} \xD7 ${active[0].name}`;
      const sub = active.slice(1).map((f) => `${store.foodQty[f.id]} \xD7 ${f.name}`).join(", ");
      return { main, sub };
    });
    function goNext() {
      navigateTo("/book/details");
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col min-h-full" }, _attrs))}><div class="flex-1"><h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-0.5 mt-1.5"> Your booking </h1><p class="text-ink-soft text-[14.5px] m-0 mb-4 leading-[1.4]"> Everything in one checkout </p>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        seconds: unref(store).holdSeconds
      }, null, _parent));
      _push(`<div class="bg-[--cream-card] border border-[--line] rounded-card p-[18px] mb-4 shadow-[0_2px_12px_-4px_rgba(34,51,24,0.1)]"><div class="font-display font-semibold text-[19px]">${ssrInterpolate(unref(store).courtNamesLabel || ((_a = unref(store).selectedCourt) == null ? void 0 : _a.name))}</div><div class="text-ink-soft text-[14px] mt-0.5">${ssrInterpolate(unref(store).dateLabel)} \xB7 ${ssrInterpolate(unref(store).slotRangeLabel)}</div>`);
      if (unref(store).courtIds.length > 1) {
        _push(`<div class="flex flex-wrap gap-1.5 mt-2.5"><!--[-->`);
        ssrRenderList(unref(store).selectedCourts, (c) => {
          _push(`<span class="px-2.5 py-1 rounded-lg text-[12px] font-semibold bg-[var(--cream)] text-[var(--ink)] border border-[var(--line)]">${ssrInterpolate(c.name)} \xB7 \u20B1${ssrInterpolate(c.price)}/hr </span>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="bg-[--cream-card] border border-[--line] rounded-card p-[18px] mb-4 shadow-[0_2px_12px_-4px_rgba(34,51,24,0.1)]"><div class="flex justify-between items-start py-3 border-b border-line"><div><div class="text-[15px] font-medium">Court rental</div><div class="text-gray text-[13px] mt-0.5">${ssrInterpolate(unref(store).courtIds.length > 0 ? unref(store).courtIds.length : 1)} ${ssrInterpolate(unref(store).courtIds.length > 1 ? "courts" : "court")} \xD7 ${ssrInterpolate(unref(store).slotHours)} ${ssrInterpolate(unref(store).slotHours === 1 ? "hour" : "hours")}</div></div><div class="font-semibold text-[15px]">\u20B1${ssrInterpolate(unref(store).courtTotal)}</div></div>`);
      if (unref(store).paddleCount > 0) {
        _push(`<div class="flex justify-between items-start py-3 border-b border-line"><div><div class="text-[15px] font-medium">${ssrInterpolate(mainPaddleLine.value.main)}</div><div class="text-gray text-[13px] mt-0.5">`);
        if (mainPaddleLine.value.sub) {
          _push(`<span>${ssrInterpolate(mainPaddleLine.value.sub)} \xB7 </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span>${ssrInterpolate(unref(store).slotHours)} ${ssrInterpolate(unref(store).slotHours === 1 ? "hour" : "hours")}</span></div></div><div class="font-semibold text-[15px]">\u20B1${ssrInterpolate(unref(store).paddleTotal)}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(store).foodCount > 0) {
        _push(`<div class="flex justify-between items-start py-3 border-b border-line"><div><div class="text-[15px] font-medium">${ssrInterpolate(mainFoodLine.value.main)}</div>`);
        if (mainFoodLine.value.sub) {
          _push(`<div class="text-gray text-[13px] mt-0.5">${ssrInterpolate(mainFoodLine.value.sub)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="font-semibold text-[15px]">\u20B1${ssrInterpolate(unref(store).foodTotal)}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-between items-center pt-3.5 mt-0.5 font-display"><div class="font-semibold text-[17px]">Total</div><div class="font-bold text-[22px]">\u20B1${ssrInterpolate(unref(store).grandTotal)}</div></div></div></div>`);
      _push(ssrRenderComponent(BottomCTA, {
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

export { _sfc_main as default };
//# sourceMappingURL=summary-DacqgJoT.mjs.map
