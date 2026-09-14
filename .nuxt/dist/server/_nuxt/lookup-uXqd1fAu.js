import { defineComponent, ref, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { u as useHead, c as useSupabase, _ as _export_sfc } from "../server.mjs";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "lookup",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Check Booking — PickleBook" });
    useSupabase();
    const query = ref("");
    const loading = ref(false);
    const searched = ref(false);
    const error = ref("");
    const results = ref([]);
    function formatDate(dateStr) {
      if (!dateStr) return "—";
      const d = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    }
    function formatTime(timeStr) {
      if (!timeStr) return "—";
      const [h, m] = timeStr.split(":").map(Number);
      const isMidnight = h === 24 || h === 0;
      const period = isMidnight ? "AM" : h >= 12 && h < 24 ? "PM" : "AM";
      const hour = isMidnight ? 12 : h % 12 || 12;
      return `${hour}:${String(m).padStart(2, "0")} ${period}`;
    }
    function statusLabel(status) {
      const map = {
        confirmed: "Confirmed ✓",
        pending_payment: "Pending",
        held: "On hold",
        cancelled: "Cancelled"
      };
      return map[status] ?? status;
    }
    function statusClass(status) {
      const map = {
        confirmed: "status--confirmed",
        pending_payment: "status--pending",
        held: "status--held",
        cancelled: "status--cancelled"
      };
      return map[status] ?? "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col min-h-full" }, _attrs))} data-v-c0cb94d3><div class="flex-1 pb-8" data-v-c0cb94d3><div class="mb-5 mt-1" data-v-c0cb94d3><h1 class="font-display font-semibold text-[26px] m-0 leading-[1.15]" data-v-c0cb94d3> Check your booking </h1><p class="text-[13.5px] text-[var(--ink-soft)] mt-1 mb-0 leading-snug" data-v-c0cb94d3> Search by your reference number or full name </p></div><div class="relative mb-4" data-v-c0cb94d3><div class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[var(--ink-soft)]" data-v-c0cb94d3><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" data-v-c0cb94d3><circle cx="11" cy="11" r="8" data-v-c0cb94d3></circle><path d="M21 21l-4.35-4.35" data-v-c0cb94d3></path></svg></div><input id="lookup-search-input"${ssrRenderAttr("value", query.value)} type="text" placeholder="PB-20260910-12345 or your full name" autocomplete="off" class="lookup-input" data-v-c0cb94d3>`);
      if (query.value) {
        _push(`<button type="button" class="absolute inset-y-0 right-3 flex items-center text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors" aria-label="Clear search" data-v-c0cb94d3><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-v-c0cb94d3><line x1="18" y1="6" x2="6" y2="18" data-v-c0cb94d3></line><line x1="6" y1="6" x2="18" y2="18" data-v-c0cb94d3></line></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button id="lookup-search-btn" type="button" class="lookup-search-btn"${ssrIncludeBooleanAttr(loading.value || !query.value.trim()) ? " disabled" : ""} data-v-c0cb94d3>`);
      if (loading.value) {
        _push(`<svg class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" data-v-c0cb94d3><path d="M21 12a9 9 0 1 1-6.219-8.56" data-v-c0cb94d3></path></svg>`);
      } else {
        _push(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-v-c0cb94d3><circle cx="11" cy="11" r="8" data-v-c0cb94d3></circle><path d="M21 21l-4.35-4.35" data-v-c0cb94d3></path></svg>`);
      }
      _push(` ${ssrInterpolate(loading.value ? "Searching…" : "Search Booking")}</button>`);
      if (error.value) {
        _push(`<div class="mt-4 p-3.5 rounded-2xl bg-[rgba(229,72,77,0.07)] border border-[rgba(229,72,77,0.22)] text-[#8A1F24] text-[13px] font-medium leading-snug" data-v-c0cb94d3> ⚠️ ${ssrInterpolate(error.value)}</div>`);
      } else if (searched.value && results.value.length === 0) {
        _push(`<div class="mt-8 flex flex-col items-center text-center gap-2 py-6" data-v-c0cb94d3><div class="w-14 h-14 rounded-2xl bg-[var(--cream-card)] border border-[var(--line)] flex items-center justify-center text-[var(--ink-soft)] mb-1" data-v-c0cb94d3><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-v-c0cb94d3><circle cx="11" cy="11" r="8" data-v-c0cb94d3></circle><path d="M21 21l-4.35-4.35" data-v-c0cb94d3></path><line x1="8" y1="11" x2="14" y2="11" data-v-c0cb94d3></line></svg></div><p class="font-semibold text-[15px] text-[var(--ink)] m-0" data-v-c0cb94d3>No booking found</p><p class="text-[13px] text-[var(--ink-soft)] m-0 max-w-[220px] leading-snug" data-v-c0cb94d3> Double-check your reference number or try your full name as registered. </p></div>`);
      } else if (results.value.length > 0) {
        _push(`<div class="mt-5 flex flex-col gap-3" data-v-c0cb94d3><p class="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-soft)] m-0 mb-0.5" data-v-c0cb94d3>${ssrInterpolate(results.value.length)} booking${ssrInterpolate(results.value.length !== 1 ? "s" : "")} found </p><!--[-->`);
        ssrRenderList(results.value, (b) => {
          _push(`<div${ssrRenderAttr("id", `result-${b.reference}`)} class="booking-card" data-v-c0cb94d3><div class="flex items-start justify-between gap-2 mb-3" data-v-c0cb94d3><div data-v-c0cb94d3><div class="text-[10.5px] font-bold uppercase tracking-widest text-[var(--ink-soft)] mb-0.5" data-v-c0cb94d3>Reference no.</div><div class="font-display font-bold text-[18px] text-[var(--ink)] tracking-tight" data-v-c0cb94d3>${ssrInterpolate(b.reference)}</div></div><span class="${ssrRenderClass([statusClass(b.status), "status-badge"])}" data-v-c0cb94d3>${ssrInterpolate(statusLabel(b.status))}</span></div><div class="border-t border-[var(--line)]/70 mb-3" data-v-c0cb94d3></div><div class="grid grid-cols-2 gap-y-3 gap-x-3" data-v-c0cb94d3><div class="detail-block" data-v-c0cb94d3><div class="detail-label" data-v-c0cb94d3>Guest name</div><div class="detail-value" data-v-c0cb94d3>${ssrInterpolate(b.guest_name)}</div></div><div class="detail-block" data-v-c0cb94d3><div class="detail-label" data-v-c0cb94d3>Date</div><div class="detail-value" data-v-c0cb94d3>${ssrInterpolate(formatDate(b.booking_date))}</div></div><div class="detail-block" data-v-c0cb94d3><div class="detail-label" data-v-c0cb94d3>Time</div><div class="detail-value" data-v-c0cb94d3>${ssrInterpolate(formatTime(b.start_time))} – ${ssrInterpolate(formatTime(b.end_time))} `);
          if (b.duration_hours) {
            _push(`<span class="text-[11.5px] text-[var(--ink-soft)] font-normal block" data-v-c0cb94d3> (${ssrInterpolate(b.duration_hours)} hr${ssrInterpolate(b.duration_hours > 1 ? "s" : "")}) </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="detail-block" data-v-c0cb94d3><div class="detail-label" data-v-c0cb94d3>Court(s)</div><div class="detail-value" data-v-c0cb94d3>${ssrInterpolate(b.court_names)}</div></div></div>`);
          if (b.players && b.players.length > 0) {
            _push(`<div class="mt-3 pt-2.5 border-t border-[var(--line)]/60" data-v-c0cb94d3><div class="detail-label mb-1" data-v-c0cb94d3>Additional Players</div><div class="flex flex-wrap gap-1.5" data-v-c0cb94d3><!--[-->`);
            ssrRenderList(b.players, (player) => {
              _push(`<span class="px-2.5 py-0.5 rounded-md text-[12px] bg-[var(--cream)] border border-[var(--line)] text-[var(--ink)] font-medium" data-v-c0cb94d3>${ssrInterpolate(player)}</span>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="mt-3.5 pt-3 border-t border-[var(--line)]/70 flex flex-col gap-2.5" data-v-c0cb94d3><div class="text-[11px] font-bold uppercase tracking-wider text-[var(--ink-soft)]" data-v-c0cb94d3> Availed Orders &amp; Breakdown </div><div class="flex justify-between items-start text-[13px]" data-v-c0cb94d3><div data-v-c0cb94d3><div class="font-medium text-[var(--ink)]" data-v-c0cb94d3>Court rental</div><div class="text-[12px] text-[var(--ink-soft)]" data-v-c0cb94d3>${ssrInterpolate(b.court_rentals.length > 0 ? b.court_rentals.length : 1)} ${ssrInterpolate(b.court_rentals.length > 1 ? "courts" : "court")} × ${ssrInterpolate(b.duration_hours)} ${ssrInterpolate(b.duration_hours === 1 ? "hour" : "hours")}</div></div>`);
          if (b.court_total > 0) {
            _push(`<div class="font-semibold text-[13.5px] text-[var(--ink)]" data-v-c0cb94d3> ₱${ssrInterpolate(Number(b.court_total).toLocaleString())}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (b.paddles && b.paddles.length > 0) {
            _push(`<div class="flex justify-between items-start text-[13px] pt-2 border-t border-[var(--line)]/40" data-v-c0cb94d3><div data-v-c0cb94d3><div class="font-medium text-[var(--ink)]" data-v-c0cb94d3>${ssrInterpolate(b.paddles[0].quantity)} × ${ssrInterpolate(b.paddles[0].name)}</div><div class="text-[12px] text-[var(--ink-soft)] mt-0.5" data-v-c0cb94d3>`);
            if (b.paddles.length > 1) {
              _push(`<span data-v-c0cb94d3>${ssrInterpolate(b.paddles.slice(1).map((p) => `${p.quantity} × ${p.name}`).join(", "))} · </span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<span data-v-c0cb94d3>${ssrInterpolate(b.duration_hours)} ${ssrInterpolate(b.duration_hours === 1 ? "hour" : "hours")}</span></div></div><div class="font-semibold text-[13.5px] text-[var(--ink)]" data-v-c0cb94d3> ₱${ssrInterpolate(Number(b.paddle_total).toLocaleString())}</div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (b.food_items && b.food_items.length > 0) {
            _push(`<div class="flex justify-between items-start text-[13px] pt-2 border-t border-[var(--line)]/40" data-v-c0cb94d3><div data-v-c0cb94d3><div class="font-medium text-[var(--ink)]" data-v-c0cb94d3>${ssrInterpolate(b.food_items[0].quantity)} × ${ssrInterpolate(b.food_items[0].name)}</div>`);
            if (b.food_items.length > 1) {
              _push(`<div class="text-[12px] text-[var(--ink-soft)] mt-0.5" data-v-c0cb94d3>${ssrInterpolate(b.food_items.slice(1).map((f) => `${f.quantity} × ${f.name}`).join(", "))}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><div class="font-semibold text-[13.5px] text-[var(--ink)]" data-v-c0cb94d3> ₱${ssrInterpolate(Number(b.food_total).toLocaleString())}</div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="mt-3.5 pt-3 border-t border-[var(--line)] flex items-center justify-between" data-v-c0cb94d3><div data-v-c0cb94d3><div class="text-[12.5px] text-[var(--ink-soft)] font-medium" data-v-c0cb94d3>Total paid</div>`);
          if (b.payment_method) {
            _push(`<div class="text-[11px] text-[var(--ink-soft)] uppercase tracking-wider" data-v-c0cb94d3> via ${ssrInterpolate(b.payment_method)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><span class="font-display font-bold text-[18px] text-[var(--ink)]" data-v-c0cb94d3>${ssrInterpolate(b.total_amount != null ? `₱${Number(b.total_amount).toLocaleString()}` : "—")}</span></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/lookup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const lookup = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c0cb94d3"]]);
export {
  lookup as default
};
//# sourceMappingURL=lookup-uXqd1fAu.js.map
