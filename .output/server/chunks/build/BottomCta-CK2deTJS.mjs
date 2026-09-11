import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrIncludeBooleanAttr, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BottomCta",
  __ssrInlineRender: true,
  props: {
    label: {},
    disabled: { type: Boolean },
    ghost: { type: Boolean }
  },
  emits: ["click"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "p-[14px_22px_22px_22px]" }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "above", {}, null, _push, _parent);
      _push(`<button type="button"${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""} class="${ssrRenderClass([[
        __props.ghost ? "bg-transparent border border-ink text-ink hover:bg-ink/5" : "bg-orange text-white hover:bg-orange-dark disabled:opacity-40 disabled:cursor-not-allowed"
      ], "w-full rounded-[14px] p-[16px_18px] font-semibold text-base cursor-pointer transition-all active:scale-[0.98] border-none"])}">${ssrInterpolate(__props.label)}</button></footer>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/BottomCta.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=BottomCta-CK2deTJS.mjs.map
