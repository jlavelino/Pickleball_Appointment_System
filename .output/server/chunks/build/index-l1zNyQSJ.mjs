import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useHead, b as useBookingStore, n as navigateTo } from './server.mjs';
import { C as CalendarPicker, T as TimeSlotModal } from './TimeSlotModal-Cyuwq6mp.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "PickleBook \u2014 Book a court" });
    const store = useBookingStore();
    const showModal = ref(false);
    const hasSelectedTimes = computed(() => {
      return store.selectedSlots.length > 0 || store.slotIndex !== null;
    });
    const continueLabel = computed(() => {
      const count = store.selectedSlots.length;
      if (count <= 1) return "Continue";
      return `Continue (${count} hours)`;
    });
    function openModal() {
      showModal.value = true;
    }
    function closeModal() {
      showModal.value = false;
    }
    function goNext() {
      if (hasSelectedTimes.value) {
        store.courtId = null;
        navigateTo("/book/court");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col min-h-full" }, _attrs))}><div class="flex-1"><h1 class="font-display font-semibold text-[28px] m-0 leading-[1.15] mb-0.5 mt-1.5"> Book a court </h1>`);
      _push(ssrRenderComponent(CalendarPicker, { onDateSelected: openModal }, null, _parent));
      if (hasSelectedTimes.value) {
        _push(`<div class="mt-3 p-4 rounded-2xl bg-[var(--cream-card)] border border-[var(--line)] shadow-sm cursor-pointer hover:border-[var(--ink-soft)] transition-all"><div class="flex items-center gap-2 mb-1.5"><span class="w-5 h-5 rounded-full bg-[var(--ink)] text-[var(--cream)] flex items-center justify-center font-bold text-[11px] shrink-0"> \u2713 </span><span class="text-[12px] font-bold uppercase tracking-wider text-[var(--ink-soft)]">${ssrInterpolate(unref(store).fullDateLabel)}</span></div><div class="text-[17px] font-semibold text-[var(--ink)] leading-snug">${ssrInterpolate(unref(store).slotRangeLabel)}</div><div class="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[var(--line)]/60"><div class="flex flex-wrap gap-1.5 items-center"><!--[-->`);
        ssrRenderList(unref(store).selectedSlotsList, (slot) => {
          _push(`<span class="px-2.5 py-1 rounded-lg text-[12px] font-medium bg-[var(--cream)] border border-[var(--line)] text-[var(--ink)]">${ssrInterpolate(slot.label)}</span>`);
        });
        _push(`<!--]--></div><button type="button" class="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--sold)] text-[var(--relish-dark)] text-[12px] font-semibold transition-all hover:bg-[var(--relish-dark)] hover:text-white active:scale-95 ml-auto"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Edit times </button></div></div>`);
      } else if (unref(store).isCurrentDayFullyBooked) {
        _push(`<div class="mt-3 p-3.5 rounded-2xl bg-[rgba(229,72,77,0.07)] border border-[rgba(229,72,77,0.22)] shadow-xs flex items-center justify-between gap-3 cursor-pointer hover:border-[#E5484D] transition-all"><div class="flex items-center gap-2.5 min-w-0"><div class="w-8 h-8 rounded-xl bg-[#FEECEB] flex items-center justify-center text-[#E5484D] shrink-0 font-bold text-[13px]"> \u2715 </div><div class="min-w-0"><div class="text-[14px] font-semibold text-[#8A1F24] leading-snug whitespace-nowrap"> Fully booked </div><div class="text-[12px] text-[#A6363B] font-medium mt-0.5 whitespace-nowrap"> No courts available </div></div></div><button type="button" class="shrink-0 whitespace-nowrap inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#E5484D] text-white text-[12px] font-semibold opacity-95 active:scale-95 shadow-xs"> View times </button></div>`);
      } else {
        _push(`<div class="mt-3 p-3.5 rounded-2xl bg-[var(--cream-card)] border border-[var(--line)] shadow-xs flex items-center justify-between gap-3 cursor-pointer hover:border-[var(--relish)] transition-all group"><div class="flex items-center gap-3 min-w-0"><div class="w-9 h-9 rounded-xl bg-[var(--sold)] flex items-center justify-center text-[var(--relish-dark)] shrink-0 group-hover:bg-[var(--relish-dark)] group-hover:text-white transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div><div class="min-w-0"><div class="text-[14px] font-semibold text-[var(--ink)] leading-snug whitespace-nowrap"> Select court time </div><div class="text-[12px] text-[var(--ink-soft)] font-medium mt-0.5 whitespace-nowrap"> Daily \xB7 8 AM \u2013 11 PM </div></div></div><button type="button" class="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--relish)] text-white text-[12px] font-semibold transition-all group-hover:opacity-90 active:scale-95 shadow-xs"><span>Select</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button></div>`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(BottomCTA, {
        label: continueLabel.value,
        disabled: !hasSelectedTimes.value,
        onClick: goNext
      }, null, _parent));
      _push(ssrRenderComponent(TimeSlotModal, {
        show: showModal.value,
        onClose: closeModal,
        onConfirm: closeModal
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
//# sourceMappingURL=index-l1zNyQSJ.mjs.map
