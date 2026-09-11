import { defineComponent, mergeProps, useSSRContext, unref } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
import { u as useBookingStore, F as FOOD_GROUPS } from "./booking-S3SdPW5c.js";
import { _ as _sfc_main$2 } from "./BottomCta-CK2deTJS.js";
import { u as useHead, n as navigateTo } from "../server.mjs";
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
  __name: "FoodItemRow",
  __ssrInlineRender: true,
  props: {
    food: {},
    quantity: {}
  },
  emits: ["step"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-[14px] py-[14px] border-b border-line last:border-none" }, _attrs))}><div class="w-12 h-12 rounded-[12px] bg-[#EFC98B] flex-shrink-0"></div><div class="flex-1 min-w-0"><div class="font-semibold text-[15.5px] truncate">${ssrInterpolate(__props.food.name)}</div><div class="text-gray text-[13.5px] mt-[1px]"> ₱${ssrInterpolate(__props.food.price)}</div></div><div class="flex items-center gap-3 flex-shrink-0"><button type="button"${ssrIncludeBooleanAttr(__props.quantity <= 0) ? " disabled" : ""} aria-label="Decrease" class="w-[30px] h-[30px] rounded-full border border-line bg-white text-base cursor-pointer text-ink flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-ink transition-colors"> − </button><div class="w-4 text-center font-semibold text-[15px]">${ssrInterpolate(__props.quantity)}</div><button type="button"${ssrIncludeBooleanAttr(__props.quantity >= 20) ? " disabled" : ""} aria-label="Increase" class="w-[30px] h-[30px] rounded-full border border-line bg-white text-base cursor-pointer text-ink flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-ink transition-colors"> + </button></div></div>`);
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
    useHead({ title: "Pre-order food — DINK" });
    const store = useBookingStore();
    if (store.courtId === null) {
      navigateTo("/book/court");
    }
    function goNext() {
      store.startHold();
      navigateTo("/book/summary");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col min-h-full" }, _attrs))}><div class="flex-1"><h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-0.5 mt-1.5"> Pre-order food </h1><p class="text-ink-soft text-[14.5px] m-0 mb-5 leading-[1.4]"> Ready by your ${ssrInterpolate(unref(store).selectedSlot?.label || "7:00 PM")} session </p><!--[-->`);
      ssrRenderList(unref(FOOD_GROUPS), (g) => {
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
      _push(ssrRenderComponent(_sfc_main$2, {
        label: unref(store).foodCount > 0 ? "Review order" : "Add food, or skip",
        onClick: goNext
      }, null, _parent));
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
export {
  _sfc_main as default
};
//# sourceMappingURL=food-BlHr4aKj.js.map
