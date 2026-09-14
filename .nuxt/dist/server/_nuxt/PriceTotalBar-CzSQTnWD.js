import { defineComponent, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate } from "vue/server-renderer";
import { b as useBookingStore, _ as _export_sfc } from "../server.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PriceTotalBar",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean }
  },
  setup(__props) {
    const store = useBookingStore();
    const breakdownText = computed(() => {
      const parts = [];
      const courtCount = store.courtIds.length > 0 ? store.courtIds.length : store.courtId !== null ? 1 : 0;
      const hours = store.slotHours;
      if (courtCount > 0 && hours > 0) {
        parts.push(`${courtCount} court${courtCount > 1 ? "s" : ""} × ${hours} hr${hours > 1 ? "s" : ""}`);
      }
      if (store.paddleCount > 0) {
        if (hours > 1) {
          parts.push(`${store.paddleCount} paddle${store.paddleCount > 1 ? "s" : ""} × ${hours} hrs`);
        } else {
          parts.push(`${store.paddleCount} paddle${store.paddleCount > 1 ? "s" : ""}`);
        }
      }
      if (store.foodCount > 0) {
        parts.push(`${store.foodCount} food item${store.foodCount > 1 ? "s" : ""}`);
      }
      return parts.length ? parts.join(" · ") : "Select courts & times";
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "price-bar" }, _attrs))} data-v-054fe87d><div class="price-bar__left" data-v-054fe87d><span class="price-bar__label" data-v-054fe87d>Running total</span><span class="price-bar__breakdown" data-v-054fe87d>${ssrInterpolate(breakdownText.value)}</span></div><div class="price-bar__right" data-v-054fe87d><span class="price-bar__currency" data-v-054fe87d>₱</span><span class="price-bar__amount" data-v-054fe87d>${ssrInterpolate(unref(store).grandTotal.toLocaleString())}</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/PriceTotalBar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PriceTotalBar = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-054fe87d"]]);
export {
  PriceTotalBar as P
};
//# sourceMappingURL=PriceTotalBar-CzSQTnWD.js.map
