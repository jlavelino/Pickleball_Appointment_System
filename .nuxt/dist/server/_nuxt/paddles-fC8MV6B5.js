import { defineComponent, mergeProps, useSSRContext, unref, withCtx, createVNode } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
import { u as useHead, b as useBookingStore, n as navigateTo } from "../server.mjs";
import { B as BottomCTA } from "./BottomCta-BObjgLZJ.js";
import { P as PriceTotalBar } from "./PriceTotalBar-CzSQTnWD.js";
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
const _imports_0 = "" + __buildAssetsURL("pickle_paddle.BUOTV-cu.png");
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PaddleStepper",
  __ssrInlineRender: true,
  props: {
    paddle: {},
    quantity: {},
    hours: {}
  },
  emits: ["step"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-[14px] py-[14px] border-b border-line last:border-none" }, _attrs))}><div class="w-12 h-12 rounded-[14px] bg-[#F1F0D9] border border-[var(--line)] flex-shrink-0 flex items-center justify-center overflow-hidden p-0.5 shadow-xs"><img${ssrRenderAttr("src", _imports_0)}${ssrRenderAttr("alt", __props.paddle.name)} class="w-full h-full object-contain"></div><div class="flex-1 min-w-0"><div class="font-semibold text-[15.5px] truncate text-ink">${ssrInterpolate(__props.paddle.name)}</div><div class="text-gray text-[13.5px] mt-[1px]"> ₱${ssrInterpolate(__props.paddle.price)} / hour · ${ssrInterpolate(__props.paddle.stock)} available `);
      if (__props.hours && __props.hours > 1) {
        _push(`<span class="font-medium text-[var(--ink)]"> · ₱${ssrInterpolate(__props.paddle.price * __props.hours)} (${ssrInterpolate(__props.hours)} hrs) </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="flex items-center gap-3 flex-shrink-0"><button type="button"${ssrIncludeBooleanAttr(__props.quantity <= 0) ? " disabled" : ""} aria-label="Decrease" class="w-[30px] h-[30px] rounded-full border border-line bg-white text-base cursor-pointer text-ink flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-ink transition-colors shadow-xs"> − </button><div class="w-4 text-center font-semibold text-[15px] text-ink">${ssrInterpolate(__props.quantity)}</div><button type="button"${ssrIncludeBooleanAttr(__props.quantity >= __props.paddle.stock) ? " disabled" : ""} aria-label="Increase" class="w-[30px] h-[30px] rounded-full border border-line bg-white text-base cursor-pointer text-ink flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-ink transition-colors shadow-xs"> + </button></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/booking/PaddleStepper.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "paddles",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Paddle rental — PickleBook" });
    const store = useBookingStore();
    if (store.courtId === null && store.courtIds.length === 0) {
      navigateTo("/book/court");
    }
    function goNext() {
      navigateTo("/book/food");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col min-h-full" }, _attrs))}><div class="flex-1"><h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-0.5 mt-1.5"> Need paddles? </h1><p class="text-ink-soft text-[14.5px] m-0 mb-5 leading-[1.4]"> Optional — skip if you&#39;re bringing your own </p><!--[-->`);
      ssrRenderList(unref(store).paddles, (p) => {
        _push(ssrRenderComponent(_sfc_main$1, {
          key: p.id,
          paddle: p,
          quantity: unref(store).paddleQty[p.id] || 0,
          hours: unref(store).slotHours,
          onStep: (dir) => unref(store).setPaddleQty(p.id, dir)
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(BottomCTA, {
        label: unref(store).paddleCount > 0 ? "Continue" : "Skip paddles",
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/book/paddles.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=paddles-fC8MV6B5.js.map
