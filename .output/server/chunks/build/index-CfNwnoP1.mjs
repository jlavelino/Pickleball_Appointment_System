import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useBookingStore } from './booking-S3SdPW5c.mjs';
import { _ as _sfc_main$1, a as _sfc_main$2 } from './TimeSlotList-nmQKcqJT.mjs';
import { _ as _sfc_main$3 } from './BottomCta-CK2deTJS.mjs';
import { u as useHead, n as navigateTo } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "DINK \u2014 Book a court" });
    const store = useBookingStore();
    function goNext() {
      if (store.slotIndex !== null) {
        store.courtId = null;
        navigateTo("/book/court");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col min-h-full" }, _attrs))}><div class="flex-1"><h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-0.5 mt-1.5"> Book a court </h1><p class="text-ink-soft text-[14.5px] m-0 mb-5 leading-[1.4]"> Cagayan de Oro \xB7 Uptown branch </p>`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        label: "Continue",
        disabled: unref(store).slotIndex === null,
        onClick: goNext
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/book/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CfNwnoP1.mjs.map
