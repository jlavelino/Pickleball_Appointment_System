import { defineComponent, computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate } from "vue/server-renderer";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "HoldTimer",
  __ssrInlineRender: true,
  props: {
    seconds: {}
  },
  setup(__props) {
    const props = __props;
    const formattedTime = computed(() => {
      const m = Math.floor(props.seconds / 60);
      const s = props.seconds % 60;
      return `${m}:${String(s).padStart(2, "0")}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-2 bg-danger-bg text-danger-text px-4 py-[11px] rounded-[12px] text-[13.5px] font-semibold mb-4" }, _attrs))}><div class="w-[7px] h-[7px] rounded-full bg-danger-text flex-shrink-0 animate-pulse"></div><span>Court held for ${ssrInterpolate(formattedTime.value)} more</span></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/HoldTimer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=HoldTimer-Cc_Vy36q.js.map
