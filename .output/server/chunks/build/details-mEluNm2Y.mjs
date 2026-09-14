import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { _ as _export_sfc, u as useHead, b as useBookingStore, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$1 } from './HoldTimer-Cc_Vy36q.mjs';
import { B as BottomCTA } from './BottomCta-BObjgLZJ.mjs';
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
import '@supabase/supabase-js';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "details",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Your details \u2014 PickleBook" });
    const store = useBookingStore();
    if (store.courtId === null && store.courtIds.length === 0) {
      navigateTo("/book/court");
    }
    const canProceed = computed(
      () => store.bookerName.trim().length > 0 && store.bookerMobile.trim().length >= 10 && store.bookerFacebook.trim().length > 0 && store.idPhotoName !== null
    );
    function goNext() {
      if (canProceed.value) {
        navigateTo("/book/payment");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col min-h-full" }, _attrs))} data-v-555227cb><div class="flex-1 pb-2" data-v-555227cb><h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-0.5 mt-1.5" data-v-555227cb> Your details </h1><p class="text-ink-soft text-[14px] m-0 mb-5" data-v-555227cb>${ssrInterpolate(unref(store).dateLabel)}</p>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        seconds: unref(store).holdSeconds
      }, null, _parent));
      _push(`<div class="field-group" data-v-555227cb><label class="field-label" for="booker-name" data-v-555227cb>Full name <span class="text-red-500" data-v-555227cb>*</span></label><input id="booker-name"${ssrRenderAttr("value", unref(store).bookerName)} type="text" class="field-input" placeholder="Juan Dela Cruz" autocomplete="name" data-v-555227cb></div><div class="field-group" data-v-555227cb><label class="field-label" for="booker-mobile" data-v-555227cb>Mobile number <span class="text-red-500" data-v-555227cb>*</span></label><input id="booker-mobile"${ssrRenderAttr("value", unref(store).bookerMobile)} type="tel" class="field-input" placeholder="09xx xxx xxxx" autocomplete="tel" inputmode="numeric" data-v-555227cb></div><div class="field-group" data-v-555227cb><label class="field-label" for="booker-fb" data-v-555227cb>Facebook account <span class="text-red-500" data-v-555227cb>*</span></label><input id="booker-fb"${ssrRenderAttr("value", unref(store).bookerFacebook)} type="text" class="field-input" placeholder="Your Facebook name" data-v-555227cb><p class="field-hint" data-v-555227cb>Required. The venue uses this to reach you about your booking.</p></div><div class="field-group" data-v-555227cb><label class="field-label" data-v-555227cb>Who is playing with you</label><!--[-->`);
      ssrRenderList(unref(store).players, (player, idx) => {
        _push(`<div class="flex gap-2 mb-2" data-v-555227cb><input${ssrRenderAttr("value", player.name)} type="text" class="field-input flex-1"${ssrRenderAttr("placeholder", `Player ${idx + 1} name`)} data-v-555227cb><button type="button" class="remove-btn" aria-label="Remove player" data-v-555227cb>\u2715</button></div>`);
      });
      _push(`<!--]--><button type="button" class="add-player-btn" data-v-555227cb> + Add another player </button></div><div class="field-group" data-v-555227cb><label class="field-label" for="booker-id" data-v-555227cb>Valid ID photo <span class="text-red-500" data-v-555227cb>*</span></label><label class="${ssrRenderClass([{ "id-upload-zone--has-file": unref(store).idPhotoName }, "id-upload-zone"])}" for="booker-id" data-v-555227cb>`);
      if (!unref(store).idPhotoName) {
        _push(`<div class="flex flex-col items-center gap-1.5" data-v-555227cb><span class="text-[26px]" data-v-555227cb>\u{1FAAA}</span><span class="text-[13.5px] font-semibold text-[var(--ink)]" data-v-555227cb>Tap to upload your ID</span><span class="text-[12px] text-[var(--ink-soft)]" data-v-555227cb>Photo of any valid government ID</span></div>`);
      } else {
        _push(`<div class="flex items-center gap-3" data-v-555227cb><span class="text-[22px]" data-v-555227cb>\u2705</span><div data-v-555227cb><div class="text-[13.5px] font-semibold text-[var(--ink)]" data-v-555227cb>ID uploaded</div><div class="text-[12px] text-[var(--ink-soft)] truncate max-w-[180px]" data-v-555227cb>${ssrInterpolate(unref(store).idPhotoName)}</div></div><button type="button" class="ml-auto text-[12px] font-semibold text-[var(--relish-dark)] underline" data-v-555227cb>Change</button></div>`);
      }
      _push(`</label><input id="booker-id" type="file" accept="image/*" class="sr-only" data-v-555227cb><p class="field-hint" data-v-555227cb>Required. The gate checks this against your entry pass.</p></div></div>`);
      _push(ssrRenderComponent(BottomCTA, {
        label: "Continue to payment",
        disabled: !canProceed.value,
        onClick: goNext
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/book/details.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const details = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-555227cb"]]);

export { details as default };
//# sourceMappingURL=details-mEluNm2Y.mjs.map
