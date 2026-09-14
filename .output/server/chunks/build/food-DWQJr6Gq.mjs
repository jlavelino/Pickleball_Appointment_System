import { defineComponent, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useHead, b as useBookingStore, n as navigateTo } from './server.mjs';
import { B as BottomCTA } from './BottomCta-BObjgLZJ.mjs';
import { P as PriceTotalBar } from './PriceTotalBar-CzSQTnWD.mjs';
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
  __name: "FoodItemRow",
  __ssrInlineRender: true,
  props: {
    food: {},
    quantity: {}
  },
  emits: ["step"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-[14px] py-[14px] border-b border-line last:border-none" }, _attrs))}><div class="w-12 h-12 rounded-[12px] bg-sold flex-shrink-0 flex items-center justify-center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 2v7a1.2 1.2 0 002.4 0V2M9.2 2v7M11.4 2v7a3 3 0 01-3 3v10" stroke="#C97A1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17 2c-1.8 0-2.6 2-2.6 4.5S15.2 12 17 12v10" stroke="#C97A1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></div><div class="flex-1 min-w-0"><div class="font-semibold text-[15.5px] truncate text-ink">${ssrInterpolate(__props.food.name)}</div><div class="text-gray text-[13.5px] mt-[1px]"> \u20B1${ssrInterpolate(__props.food.price)}</div></div><div class="flex items-center gap-3 flex-shrink-0"><button type="button"${ssrIncludeBooleanAttr(__props.quantity <= 0) ? " disabled" : ""} aria-label="Decrease" class="w-[30px] h-[30px] rounded-full border border-line bg-white text-base cursor-pointer text-ink flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-ink transition-colors shadow-xs"> \u2212 </button><div class="w-4 text-center font-semibold text-[15px] text-ink">${ssrInterpolate(__props.quantity)}</div><button type="button"${ssrIncludeBooleanAttr(__props.quantity >= 20) ? " disabled" : ""} aria-label="Increase" class="w-[30px] h-[30px] rounded-full border border-line bg-white text-base cursor-pointer text-ink flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-ink transition-colors shadow-xs"> + </button></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/booking/FoodItemRow.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "food",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Pre-order food \u2014 PickleBook" });
    const store = useBookingStore();
    if (store.courtId === null && store.courtIds.length === 0) {
      navigateTo("/book/court");
    }
    function goNext() {
      store.startHold();
      navigateTo("/book/summary");
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col min-h-full" }, _attrs))}><div class="flex-1"><h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-0.5 mt-1.5"> Pre-order food </h1><p class="text-ink-soft text-[14.5px] m-0 mb-5 leading-[1.4]"> Ready by your ${ssrInterpolate(((_a = unref(store).selectedSlot) == null ? void 0 : _a.label) || "8:00 AM")} session </p><!--[-->`);
      ssrRenderList(unref(store).foodGroups, (g) => {
        _push(`<!--[--><div class="text-[12.5px] tracking-[0.04em] uppercase text-gray font-bold mt-[18px] mb-1 first:mt-0">${ssrInterpolate(g.label)}</div><!--[-->`);
        ssrRenderList(g.items, (f) => {
          _push(ssrRenderComponent(_sfc_main$1, {
            key: f.id,
            food: f,
            quantity: unref(store).foodQty[f.id] || 0,
            onStep: (dir) => unref(store).setFoodQty(f.id, dir)
          }, null, _parent));
        });
        _push(`<!--]--><!--]-->`);
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(BottomCTA, {
        label: unref(store).foodCount > 0 ? "Review order" : "Add food, or skip",
        onClick: goNext
      }, {
        above: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(PriceTotalBar, { show: true }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(PriceTotalBar, { show: true })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/book/food.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=food-DWQJr6Gq.mjs.map
