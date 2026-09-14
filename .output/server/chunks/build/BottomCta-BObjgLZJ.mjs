import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrIncludeBooleanAttr, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

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
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bottom-cta" }, _attrs))} data-v-7dbbfae5><div class="bottom-cta__fade" aria-hidden="true" data-v-7dbbfae5></div><div class="bottom-cta__inner" data-v-7dbbfae5>`);
      ssrRenderSlot(_ctx.$slots, "above", {}, null, _push, _parent);
      _push(`<button type="button"${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""} class="${ssrRenderClass([__props.ghost ? "bottom-cta__btn--ghost" : "bottom-cta__btn--primary", "bottom-cta__btn btn-press"])}" data-v-7dbbfae5><span data-v-7dbbfae5>${ssrInterpolate(__props.label)}</span></button></div></footer>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/BottomCta.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BottomCTA = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7dbbfae5"]]);

export { BottomCTA as B };
//# sourceMappingURL=BottomCta-BObjgLZJ.mjs.map
