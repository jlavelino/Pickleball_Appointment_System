import { defineComponent, mergeProps, useSSRContext, unref } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
import { u as useBookingStore, P as PADDLES } from "./booking-S3SdPW5c.js";
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
  __name: "PaddleStepper",
  __ssrInlineRender: true,
  props: {
    paddle: {},
    quantity: {}
  },
  emits: ["step"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-[14px] py-[14px] border-b border-line last:border-none" }, _attrs))}><div class="w-12 h-12 rounded-[12px] bg-lime flex-shrink-0"></div><div class="flex-1 min-w-0"><div class="font-semibold text-[15.5px] truncate">${ssrInterpolate(__props.paddle.name)}</div><div class="text-gray text-[13.5px] mt-[1px]"> ₱${ssrInterpolate(__props.paddle.price)} / session · ${ssrInterpolate(__props.paddle.stock)} available </div></div><div class="flex items-center gap-3 flex-shrink-0"><button type="button"${ssrIncludeBooleanAttr(__props.quantity <= 0) ? " disabled" : ""} aria-label="Decrease" class="w-[30px] h-[30px] rounded-full border border-line bg-white text-base cursor-pointer text-ink flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-ink transition-colors"> − </button><div class="w-4 text-center font-semibold text-[15px]">${ssrInterpolate(__props.quantity)}</div><button type="button"${ssrIncludeBooleanAttr(__props.quantity >= __props.paddle.stock) ? " disabled" : ""} aria-label="Increase" class="w-[30px] h-[30px] rounded-full border border-line bg-white text-base cursor-pointer text-ink flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-ink transition-colors"> + </button></div></div>`);
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
    useHead({ title: "Paddle rental — DINK" });
    const store = useBookingStore();
    if (store.courtId === null) {
      navigateTo("/book/court");
    }
    function goNext() {
      navigateTo("/book/food");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col min-h-full" }, _attrs))}><div class="flex-1"><h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-0.5 mt-1.5"> Need paddles? </h1><p class="text-ink-soft text-[14.5px] m-0 mb-5 leading-[1.4]"> Optional — skip if you&#39;re bringing your own </p><!--[-->`);
      ssrRenderList(unref(PADDLES), (p) => {
        _push(ssrRenderComponent(_sfc_main$1, {
          key: p.id,
          paddle: p,
          quantity: unref(store).paddleQty[p.id] || 0,
          onStep: (dir) => unref(store).setPaddleQty(p.id, dir)
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        label: unref(store).paddleCount > 0 ? "Continue" : "Skip paddles",
        onClick: goNext
      }, null, _parent));
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
//# sourceMappingURL=paddles-oF3OSOZ3.js.map
