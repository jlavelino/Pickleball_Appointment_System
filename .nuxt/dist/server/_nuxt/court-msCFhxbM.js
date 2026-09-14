import { defineComponent, computed, mergeProps, useSSRContext, unref, withCtx, createVNode } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc, u as useHead, b as useBookingStore, n as navigateTo } from "../server.mjs";
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
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CourtCard",
  __ssrInlineRender: true,
  props: {
    court: {},
    status: {},
    isSelected: { type: Boolean },
    hours: {}
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
      if (props.status === "open") return "badge--open";
      if (props.status === "low") return "badge--low";
      return "badge--full";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["court-card", [
          __props.isSelected ? "court-card--selected" : "",
          isFull.value ? "court-card--full" : ""
        ]]
      }, _attrs))} data-v-49997c57><div class="flex justify-between items-start mb-1" data-v-49997c57><div class="font-display font-semibold text-[19px]" data-v-49997c57>${ssrInterpolate(__props.court.name)}</div><span class="${ssrRenderClass([badgeClass.value, "badge"])}" data-v-49997c57>${ssrInterpolate(badgeText.value)}</span></div><div class="text-[14px] mb-[14px]" style="${ssrRenderStyle({ "color": "var(--ink-soft)" })}" data-v-49997c57><span data-v-49997c57>₱${ssrInterpolate(__props.court.price)} / hour</span>`);
      if (__props.hours && __props.hours > 1) {
        _push(`<span class="font-semibold text-[var(--ink)]" data-v-49997c57> · ₱${ssrInterpolate(__props.court.price * __props.hours)} total (${ssrInterpolate(__props.hours)} hrs) </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button type="button"${ssrIncludeBooleanAttr(isFull.value) ? " disabled" : ""} class="${ssrRenderClass([[
        __props.isSelected ? "court-btn--chosen" : isFull.value ? "court-btn--full" : "court-btn--idle"
      ], "court-btn btn-press"])}" data-v-49997c57>${ssrInterpolate(__props.isSelected ? "✓ Selected" : isFull.value ? "Full" : "Select court")}</button></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/booking/CourtCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const CourtCard = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-49997c57"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "court",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Pick a court — PickleBook" });
    const store = useBookingStore();
    if (store.slotIndex === null && store.selectedSlots.length === 0) {
      navigateTo("/");
    }
    const continueButtonLabel = computed(() => {
      const count = store.courtIds.length;
      if (count === 0) return "Select a court";
      if (count === 1) return `Continue (1 court · ₱${store.courtTotal})`;
      return `Continue (${count} courts · ₱${store.courtTotal})`;
    });
    function selectCourt(id) {
      store.toggleCourt(id);
    }
    function goNext() {
      if (store.courtIds.length > 0) {
        navigateTo("/book/paddles");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col min-h-full" }, _attrs))}><div class="flex-1"><h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-0.5 mt-1.5"> Pick a court </h1><p class="text-ink-soft text-[14.5px] m-0 mb-3 leading-[1.4]">${ssrInterpolate(unref(store).slotRangeLabel)} · ${ssrInterpolate(unref(store).dateLabel)}</p><div class="flex items-center justify-between mb-4 px-1"><span class="text-[12.5px] text-[var(--ink-soft)] font-medium">${ssrInterpolate(unref(store).courtIds.length === 0 ? "Select one or more courts" : `${unref(store).courtIds.length} court${unref(store).courtIds.length > 1 ? "s" : ""} selected`)}</span>`);
      if (unref(store).courtIds.length > 0) {
        _push(`<button type="button" class="text-[12.5px] font-semibold text-[var(--relish-dark)] underline hover:text-[var(--ink)] cursor-pointer"> Clear selection </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><!--[-->`);
      ssrRenderList(unref(store).courts, (c) => {
        _push(ssrRenderComponent(CourtCard, {
          key: c.id,
          court: c,
          status: unref(store).courtsStatusMap[c.id] || "open",
          "is-selected": unref(store).courtIds.map(String).includes(String(c.id)),
          hours: unref(store).slotHours,
          onSelect: selectCourt
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(BottomCTA, {
        label: continueButtonLabel.value,
        disabled: unref(store).courtIds.length === 0,
        onClick: goNext
      }, {
        above: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(PriceTotalBar, {
              show: unref(store).courtIds.length > 0
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(PriceTotalBar, {
                show: unref(store).courtIds.length > 0
              }, null, 8, ["show"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/book/court.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=court-msCFhxbM.js.map
