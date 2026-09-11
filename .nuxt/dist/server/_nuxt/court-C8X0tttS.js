import { defineComponent, computed, mergeProps, useSSRContext, unref } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
import { u as useBookingStore, C as COURTS } from "./booking-S3SdPW5c.js";
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
  __name: "CourtCard",
  __ssrInlineRender: true,
  props: {
    court: {},
    status: {},
    isSelected: { type: Boolean }
  },
  emits: ["select"],
  setup(__props) {
    const props = __props;
    const isFull = computed(() => props.status === "full");
    const badgeText = computed(() => {
      if (props.status === "open") return "Open";
      if (props.status === "low") return "1 left";
      return "Full";
    });
    const badgeClass = computed(() => {
      if (props.status === "open") return "bg-lime-soft text-lime-text";
      if (props.status === "low") return "bg-danger-bg text-danger-text";
      return "bg-[#EFEAE0] text-gray";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["border border-line bg-white rounded-card p-[18px] mb-4 transition-all", [
          __props.isSelected ? "border-lime bg-lime-soft" : "",
          isFull.value ? "opacity-55" : ""
        ]]
      }, _attrs))}><div class="flex justify-between items-start mb-1"><div class="font-display font-semibold text-[19px]">${ssrInterpolate(__props.court.name)}</div><span class="${ssrRenderClass([badgeClass.value, "text-[12.5px] font-semibold px-[11px] py-1 rounded-full"])}">${ssrInterpolate(badgeText.value)}</span></div><div class="text-ink-soft text-[14px] mb-[14px]"> ₱${ssrInterpolate(__props.court.price)} / hour · ${ssrInterpolate(__props.court.type)}</div><button type="button"${ssrIncludeBooleanAttr(isFull.value) ? " disabled" : ""} class="${ssrRenderClass([[
        __props.isSelected ? "bg-ink text-white border-ink" : isFull.value ? "cursor-not-allowed border-line text-gray bg-white" : "border-ink bg-white text-ink hover:bg-ink hover:text-white"
      ], "w-full p-[13px] rounded-[11px] font-semibold text-[15px] cursor-pointer transition-colors border"])}">${ssrInterpolate(__props.isSelected ? "Selected" : isFull.value ? "Full" : "Select court")}</button></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/booking/CourtCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "court",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Pick a court — DINK" });
    const store = useBookingStore();
    if (store.slotIndex === null) {
      navigateTo("/");
    }
    function selectCourt(id) {
      store.setCourt(id);
    }
    function goNext() {
      if (store.courtId !== null) {
        navigateTo("/book/paddles");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col min-h-full" }, _attrs))}><div class="flex-1"><h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-0.5 mt-1.5"> Pick a court </h1><p class="text-ink-soft text-[14.5px] m-0 mb-5 leading-[1.4]">${ssrInterpolate(unref(store).slotRangeLabel)} · ${ssrInterpolate(unref(store).dateLabel)}</p><!--[-->`);
      ssrRenderList(unref(COURTS), (c) => {
        _push(ssrRenderComponent(_sfc_main$1, {
          key: c.id,
          court: c,
          status: unref(store).courtsStatusMap[c.id],
          "is-selected": unref(store).courtId === c.id,
          onSelect: selectCourt
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        label: "Continue",
        disabled: unref(store).courtId === null,
        onClick: goNext
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/book/court.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=court-C8X0tttS.js.map
