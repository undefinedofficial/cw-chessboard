import { provide as he, inject as me, openBlock as k, createElementBlock as T, createElementVNode as y, renderSlot as X, defineComponent as I, shallowRef as fe, useTemplateRef as ve, watch as ye, onMounted as ge, createBlock as G, withCtx as V, normalizeClass as Y, mergeProps as we, toHandlers as xe, Fragment as H, renderList as O, unref as F, toDisplayString as le, computed as N, Transition as _e, withModifiers as Ce, normalizeStyle as de, createCommentVNode as Pe, useId as qe, normalizeProps as re, guardReactiveProps as se } from "vue";
function be(n) {
  return [(r) => he(n, r), () => {
    const r = me(n);
    if (r === void 0) throw new Error(`Provider "${n}" not found.`);
    return r;
  }];
}
const [ke, ae] = be("chessboard-context"), pe = (n, o) => {
  const i = n.__vccOpts || n;
  for (const [r, f] of o)
    i[r] = f;
  return i;
}, Se = {}, $e = { class: "cw-aspect" }, Le = { class: "cw-aspect-inner" };
function Me(n, o) {
  return k(), T("div", $e, [
    y("div", Le, [
      X(n.$slots, "default")
    ])
  ]);
}
const Ee = /* @__PURE__ */ pe(Se, [["render", Me]]), Te = (n) => {
  const o = [], i = n.split(" ")[0].split("/");
  if (i.length !== 8) throw new Error("Invalid fen string");
  for (let r = 0; r < 8; r++) {
    let f = 0;
    for (let s = 0; s < i[r].length; s++) {
      const l = i[r][s];
      f = parseInt(l), Number.isNaN(f) ? o.push(l) : o.push(...Array(f).fill(null));
    }
  }
  return o;
}, R = (n) => ({
  x: n % 8,
  y: Math.floor(n / 8)
}), Ae = ({ x: n, y: o }) => 8 * o + n, E = ({ x: n, y: o }, i) => i === "b" ? { x: 7 - n, y: 7 - o } : { x: n, y: o }, Be = ({
  x: n,
  y: o,
  height: i,
  width: r
}) => ({
  x: Math.floor(n / (r / 8)),
  y: Math.floor(o / (i / 8))
}), oe = (n, o) => E(Be(n), o), b = ({ x: n, y: o }) => String.fromCharCode(n + 97) + (8 - o), U = (n) => ({
  x: n.charCodeAt(0) - 97,
  y: 8 - parseInt(n[1])
}), ce = ({ x: n, y: o }, i) => n === i.x && o === i.y, W = ({ x: n, y: o }) => n > -1 && n < 8 && o > -1 && o < 8, De = (n, o) => n % 2 === 0 && o % 2 === 0 || n % 2 !== 0 && o % 2 !== 0;
function Re(n) {
  const o = n.toLowerCase();
  return (o === n ? "b" : "w") + o;
}
class ze {
  isRunning;
  tasks;
  /**
   * check if queue is running
   */
  get IsRunning() {
    return this.isRunning;
  }
  /**
   * number of tasks in queue
   */
  get Size() {
    return this.tasks.length;
  }
  constructor() {
    this.isRunning = !1, this.tasks = [];
  }
  /**
   * Add task to queue return promise that will be resolved when task is finished
   */
  addTask(o) {
    return new Promise((i, r) => {
      this.tasks.push(() => o().then(i).catch(r)), this.run();
    });
  }
  /**
   * run tasks in queue
   */
  async run() {
    if (!this.isRunning) {
      for (this.isRunning = !0; this.tasks.length; ) await this.tasks.shift()();
      this.isRunning = !1;
    }
  }
  /**
   * terminate all tasks
   */
  clear() {
    this.tasks.length = 0, this.isRunning = !1;
  }
}
function Ie(n, o) {
  const i = n % 8, r = Math.floor(n / 8), f = o % 8, s = Math.floor(o / 8);
  return Math.max(Math.abs(s - r), Math.abs(f - i));
}
const Ne = (n, o) => {
  const i = [], r = [];
  for (let s = 0; s < 64; s++) {
    const l = n[s], c = o[s];
    c !== l && (c && i.push({ piece: c, index: s }), l && r.push({ piece: l, index: s }));
  }
  const f = [];
  return i.forEach((s) => {
    let l = 8, c = null;
    if (r.forEach((q) => {
      if (s.piece !== q.piece) return;
      const S = Ie(s.index, q.index);
      S < l && (c = q, l = S);
    }), c == null) {
      f.push({
        type: 0,
        piece: s.piece,
        atIndex: s.index
      });
      return;
    }
    r.splice(r.indexOf(c), 1), f.push({
      type: 2,
      piece: s.piece,
      atIndex: c.index,
      toIndex: s.index
    });
  }), f.push(
    ...r.map(({ piece: s, index: l }) => ({
      type: 1,
      piece: s,
      atIndex: l
    }))
  ), f;
};
function Fe({
  onOrientationChange: n,
  onChange: o
}) {
  let i = null, r = "", f = 200, s = "w", l = [], c = "all";
  const q = (d) => {
    const w = l[d];
    if (!w) return null;
    const p = w.toLowerCase();
    return { name: p, color: p === w ? "b" : "w" };
  }, S = (d) => q(Ae(d));
  function u(d, w, p) {
    const t = document.createElement("div"), a = E(d, p), e = Re(w), v = e[0], g = b(d);
    return t.setAttribute("data-square", g), t.classList.add("piece"), (c === "all" || c === v) && (t.setAttribute("data-color", v), t.setAttribute("data-piece", e), t.classList.add(e), t.style.transform = `translate3d(${a.x * 100}%,${a.y * 100}%,0px)`), t;
  }
  function h(d, w) {
    const p = w.toLowerCase(), t = b(d), a = (p === w ? "b" : "w") + p;
    return i?.querySelector(
      `[data-piece="${a}"][data-square="${t}"]`
    );
  }
  let $ = !1;
  function _(d, w, p = !1) {
    if (!i) return console.warn("container is null");
    if (!($ && !p)) {
      i.replaceChildren();
      for (let t = 0; t < d.length; t++) {
        const a = d[t];
        a && i.appendChild(
          u(R(t), a, w)
        );
      }
      l = d, $ = !0;
    }
  }
  function P(d, w, p) {
    const t = Ne(d, w), a = [];
    return t.forEach((e) => {
      const v = R(e.atIndex);
      switch (e.type) {
        case 2: {
          const D = h(v, e.piece);
          if (!D) return;
          i.appendChild(D);
          const M = E(
            R(e.atIndex),
            p
          ), C = E(
            R(e.toIndex),
            p
          );
          a.push({
            type: e.type,
            element: D,
            atPoint: { x: M.x * 100, y: M.y * 100 },
            toPoint: { x: C.x * 100, y: C.y * 100 }
          });
          break;
        }
        case 0:
          const g = u(v, e.piece, p);
          g.style.opacity = "0", i.appendChild(g);
          const L = E(
            R(e.atIndex),
            p
          );
          a.push({
            type: e.type,
            element: g,
            atPoint: { x: L.x * 100, y: L.y * 100 }
          });
          break;
        case 1:
          const z = h(v, e.piece);
          if (!z) return;
          a.push({
            type: e.type,
            element: z
          });
          break;
      }
    }), o && o(
      t.map(
        ({ piece: e, type: v, atIndex: g, toIndex: L }) => v === 2 ? {
          piece: e,
          from: b(R(g)),
          to: b(R(L))
        } : { piece: e, from: b(R(g)) }
      )
    ), a;
  }
  const m = new ze();
  function A(d, w, p, t) {
    return new Promise((a) => {
      if (document.visibilityState !== "visible" || !i)
        return a();
      const e = P(
        d,
        w,
        t
      );
      let v = null, g;
      function L(z) {
        if (!m.IsRunning || document.hidden) return a();
        $ = !1, g || (g = z);
        const D = z - g;
        if (D > p) {
          v && (cancelAnimationFrame(v), v = null);
          for (const x of e)
            x.element.style.zIndex = "5", x.type === 1 && x.element.parentNode && i.removeChild(x.element);
          a();
          return;
        }
        v = requestAnimationFrame(L);
        const M = Math.min(1, D / p);
        let C = M < 0.5 ? 2 * M * M : -1 + (4 - 2 * M) * M;
        (isNaN(C) || C > 0.99) && (C = 1), e.forEach((x) => {
          switch (x.element.classList.toggle("moving", !0), x.type) {
            case 2: {
              const ee = x.atPoint.x + (x.toPoint.x - x.atPoint.x) * C, te = x.atPoint.y + (x.toPoint.y - x.atPoint.y) * C;
              x.element.style.transform = `translate3d(${ee}%,${te}%,0px)`;
              break;
            }
            case 0:
              x.element.style.opacity = (Math.round(C * 100) / 100).toString();
              break;
            case 1:
              x.element.style.opacity = (Math.round((1 - C) * 100) / 100).toString();
              break;
          }
          x.element.classList.toggle("moving", !1);
        });
      }
      v = requestAnimationFrame(L);
    });
  }
  function j() {
    m.clear();
  }
  function Q(d) {
    i = d;
  }
  async function Z(d, w = !1) {
    if (d === r) return;
    r = d;
    const p = Te(r);
    let t = w ? f : 0;
    return m.Size > 0 && (t = t / (1 + Math.pow(m.Size / 5, 2))), m.addTask(
      () => A([...l], p, t, s).then(
        () => _(p, s, !0)
      )
    );
  }
  async function J(d, w = !1) {
    if (d === s) return;
    s = d;
    let p = w ? f : 0;
    m.Size > 0 && (p = p / (1 + Math.pow(m.Size / 5, 2)));
    const t = m.addTask(
      () => A(new Array(...l), [], p, s)
    ), a = m.addTask(
      () => A([], new Array(...l), p, s).then(
        () => _(l, s, !0)
      )
    );
    return Promise.all([
      t.then(() => n?.(s)),
      a
    ]);
  }
  function B(d) {
    f = d;
  }
  async function K(d, w = !1) {
    if (c === d) return;
    let p = w ? f : 0;
    m.Size > 0 && (p = p / (1 + Math.pow(m.Size / 5, 2)));
    let t = c === "none" ? new Array(64).fill(null) : [...l], a;
    return d === "all" ? (t = new Array(64).fill(null), a = [...l]) : d === "none" ? a = new Array(64).fill(null) : d === "w" ? a = l.map(
      (e) => e?.toUpperCase() === e ? e : null
    ) : d === "b" && (a = l.map(
      (e) => e?.toLowerCase() === e ? e : null
    )), c = d, m.addTask(
      () => A(t, a, p, s).then(
        () => _(l, s, !0)
      )
    );
  }
  return {
    getPieceByIndex: q,
    getPieceByPoint: S,
    setFen: Z,
    setDuration: B,
    setOrientation: J,
    setContainer: Q,
    setVisibility: K,
    terminate: j
  };
}
const He = { class: "cw-inner" }, Oe = { class: "cw-grid" }, Xe = ["data-square", "data-square-color"], Ye = {
  class: "coords file",
  role: "presentation",
  "aria-hidden": "true"
}, Ge = {
  class: "coords rank",
  role: "presentation",
  "aria-hidden": "true"
}, ue = 50, Ke = /* @__PURE__ */ I({
  __name: "Chessboard",
  props: {
    fen: {},
    orientation: { default: "w" },
    duration: { default: 300 },
    coordinatesDir: {},
    coordinates: { default: "outside" },
    interactive: { type: Boolean },
    visibility: { default: "all" },
    mode: { default: "auto" },
    turn: { default: "all" },
    alignPiece: { type: Boolean }
  },
  emits: ["ready", "moves", "beforemove", "aftermove", "cancelmove", "entersquare", "leavesquare", "oversquare", "outsquare"],
  setup(n, { expose: o, emit: i }) {
    const r = n, f = i, s = fe(r.orientation), l = ve("piecesContainer"), c = Fe({
      onChange(t) {
        f("moves", t);
      },
      onOrientationChange(t) {
        s.value = t;
      }
    });
    ye(
      r,
      async ({ fen: t, orientation: a, duration: e, visibility: v }) => {
        t && c.setFen(t, !0), c.setOrientation(a, !0), c.setVisibility(v, !0), c.setDuration(e);
      },
      { deep: !0 }
    ), ke({
      orientation: s,
      pieces: c
    }), ge(() => {
      c.setContainer(l.value), c.setDuration(r.duration), r.fen && c.setFen(r.fen), c.setOrientation(r.orientation), c.setVisibility(r.visibility), f("ready", c);
    });
    const q = (t) => l.value?.querySelector(
      `.piece[data-square=${t}]`
    );
    let S, u, h, $, _, P, m, A;
    function j(t) {
      if (!t.isPrimary || A) return;
      const a = p(t), e = oe(a, s.value);
      if (!W(e)) return;
      if (u && ce(u, e)) {
        B(), t.preventDefault();
        return;
      }
      const v = b(e), g = c.getPieceByPoint(e);
      !g || !K(g?.color) || (g.color === u?.color && B(!1), !(u && g.color !== u?.color) && ($ = !0, f("beforemove", v, g.name, (L) => {
        L && (u = {
          x: e.x,
          y: e.y,
          ...g
        }, w(u), t.currentTarget?.setPointerCapture(t.pointerId));
      })));
    }
    function Q(t) {
      if (!t.isPrimary || A) return;
      const a = p(t), e = oe(a, s.value);
      if (W(e)) {
        const C = b(e);
        S !== C && (f("oversquare", C), S && f("outsquare", S), S = C);
      }
      if (!u || !$ || d()) return;
      const v = a.width / 8, g = a.height / 8, L = a.x - v / 2, z = a.y - g / 2, D = b(u), M = _;
      if (!M) {
        const C = u.x * v, x = u.y * g, ee = Math.abs(L - C), te = Math.abs(z - x);
        if (_ = ee > ue || te > ue, M !== _)
          if (_) {
            const ne = q(D);
            if (!ne) throw new Error("Piece not found");
            P = ne, m = ne.cloneNode(), m.classList.add("moving", "dragging"), P?.classList.toggle("secondary", !0), l.value?.appendChild(m);
          } else
            P?.classList.remove("secondary"), P = void 0, m?.remove(), m = void 0;
      }
      if (_ && !d() && m && P) {
        const { width: C, height: x } = P.getBoundingClientRect();
        m.style.transform = `translate3d(${a.x - C / 2}px, ${a.y - x / 2}px, 0) scale(var(--cw-p-piece-drag-scale))`;
      }
      W(e) && (r.alignPiece && m && (m.style.transform = `translate3d(${e.x * 100}%, ${e.y * 100}%, 0) scale(var(--cw-p-piece-drag-scale))`), w(e));
    }
    function Z(t) {
      if (!t.isPrimary || A) return;
      if ($ = !1, d()) return B();
      const a = p(t), e = oe(a, s.value);
      if (!W(e)) return B();
      P && (P?.classList.remove("secondary"), P = void 0), m && (m.remove(), m = void 0), !(!u || c.getPieceByPoint(e)?.color === u.color) && f(
        "aftermove",
        b(u),
        b(e),
        _ ? "drag" : "click",
        (g) => B(!g)
      );
    }
    function J(t) {
      B(!0);
    }
    function B(t = !0) {
      if (!u) return;
      const a = b(u);
      t && f("cancelmove", a), h = null, u = null, _ = !1, $ = !1, P && (P?.classList.remove("secondary"), P = void 0), m && (m.remove(), m = void 0);
    }
    function K(t) {
      return r.turn === "all" || r.turn === t;
    }
    function d() {
      return r.mode === "auto" ? !1 : r.mode === "press" && _ || r.mode === "move" && !_;
    }
    function w(t) {
      h && ce(h, t) || (h && f("leavesquare", b(h)), f("entersquare", b(t)), h = t);
    }
    function p(t) {
      const a = t.currentTarget.getBoundingClientRect(), e = t.clientX - a.left, v = t.clientY - a.top;
      return { x: e, y: v, width: a.width, height: a.height };
    }
    return o({ pieces: c }), (t, a) => (k(), G(Ee, null, {
      default: V(() => [
        y("div", {
          class: Y(["cw-wrapper", [n.coordinates, { interactive: n.interactive }]])
        }, [
          y("div", He, [
            X(t.$slots, "before"),
            y("div", we({ class: "cw-chessboard" }, xe(
              n.interactive ? {
                pointerdown: j,
                pointermove: Q,
                pointerup: Z,
                pointercancel: J,
                contextmenu: (e) => e.preventDefault()
              } : {},
              !0
            )), [
              y("table", Oe, [
                (k(), T(H, null, O(8, (e) => y("tr", {
                  key: e,
                  role: "row"
                }, [
                  (k(), T(H, null, O(8, (v) => y("td", {
                    key: v,
                    role: "cell",
                    "data-square": F(b)(F(E)({ x: v - 1, y: e - 1 }, s.value)),
                    "data-square-color": F(De)(v - 1, e - 1) ? "white" : "black"
                  }, null, 8, Xe)), 64))
                ])), 64))
              ]),
              X(t.$slots, "default"),
              y("div", {
                ref_key: "piecesContainer",
                ref: l,
                class: "pieces",
                style: { display: "contents" }
              }, null, 512)
            ], 16),
            X(t.$slots, "after")
          ]),
          y("div", Ye, [
            (k(), T(H, null, O(8, (e) => y("div", {
              key: e,
              class: Y(["coord", e % 2 === 0 ? "light" : "dark"])
            }, le(String.fromCharCode((s.value === "w" ? e - 1 : 8 - e) + 97)), 3)), 64))
          ]),
          y("div", Ge, [
            (k(), T(H, null, O(8, (e) => y("div", {
              key: e,
              class: Y(["coord", e % 2 === 0 ? "dark" : "light"])
            }, le(s.value === "w" ? 9 - e : e), 3)), 64))
          ])
        ], 2)
      ]),
      _: 3
    }));
  }
}), Ve = {
  key: 0,
  class: "promotion-dialog"
}, We = ["onPointerdown"], Ue = /* @__PURE__ */ I({
  __name: "PromotionDialog",
  props: {
    color: {}
  },
  setup(n, { expose: o }) {
    const i = n, r = ["q", "r", "b", "n"], { orientation: f } = ae(), s = N(() => i.color || f.value), l = fe();
    let c, q;
    return o({ require: (h) => new Promise(($, _) => {
      if (l.value) return q();
      l.value = E(U(h), f.value), c = $, q = _;
    }).finally(() => {
      l.value = null;
    }), abort: () => q?.() }), (h, $) => (k(), G(_e, { name: "promotion-dialog" }, {
      default: V(() => [
        l.value ? (k(), T("div", Ve, [
          (k(), T(H, null, O(r, (_, P) => y("button", {
            key: P,
            class: "promotion-piece",
            style: de({ transform: `translate(${l.value.x * 100}%, ${P * 100}%)` }),
            onPointerdown: Ce((m) => F(c)(_), ["stop"])
          }, [
            y("div", {
              class: Y(["piece", s.value + _])
            }, null, 2)
          ], 44, We)), 64))
        ])) : Pe("", !0)
      ]),
      _: 1
    }));
  }
}), et = /* @__PURE__ */ pe(Ue, [["__scopeId", "data-v-67145245"]]), ie = /* @__PURE__ */ I({
  __name: "ChessboardSquare",
  props: {
    square: {},
    above: { type: Boolean }
  },
  setup(n) {
    const o = n, { orientation: i } = ae(), r = N(() => {
      const { x: f, y: s } = E(U(o.square), i.value);
      return `transform: translate3d(${f * 100}%, ${s * 100}%, 0);`;
    });
    return (f, s) => (k(), T("div", {
      class: Y(["cw-chessboard-square", { above: n.above }]),
      style: de(r.value)
    }, [
      X(f.$slots, "default")
    ], 6));
  }
}), je = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 1024 1024",
  version: "1.1",
  class: "marker-arrow"
}, Qe = ["id"], Ze = ["x1", "y1", "x2", "y2", "marker-end", "stroke-width"], tt = /* @__PURE__ */ I({
  __name: "ChessboardArrow",
  props: {
    square: {},
    toSquare: {},
    size: { default: 7 },
    offset: { default: 24 }
  },
  setup(n) {
    const o = n, i = ({ x: u, y: h }) => ({
      x: u * 128,
      y: h * 128
    }), r = ({ x: u, y: h }) => ({
      x: u + 64,
      y: h + 64
    }), f = qe(), { orientation: s } = ae(), l = N(
      () => r(
        i(
          E(U(o.square), s.value)
        )
      )
    ), c = N(
      () => r(
        i(
          E(U(o.toSquare), s.value)
        )
      )
    ), q = N(() => {
      let { x: u, y: h } = l.value;
      return o.offset && (u < c.value.x ? u += o.offset : u > c.value.x && (u -= o.offset), h < c.value.y ? h += o.offset : h > c.value.y && (h -= o.offset)), { x: u, y: h };
    }), S = N(() => {
      let { x: u, y: h } = c.value;
      return o.offset && (u < l.value.x ? u += o.offset : u > l.value.x && (u -= o.offset), h < l.value.y ? h += o.offset : h > l.value.y && (h -= o.offset)), { x: u, y: h };
    });
    return (u, h) => (k(), T("svg", je, [
      y("defs", null, [
        y("marker", {
          id: F(f),
          class: "arrow-head",
          refX: "19",
          refY: "20",
          markerHeight: "5",
          markerWidth: "5",
          viewBox: "0 0 40 40",
          orient: "auto"
        }, [...h[0] || (h[0] = [
          y("g", {
            id: "strict-marker-arrow",
            transform: "matrix(5.1931792,0,0,5.1931792,3.5980168,-0.83225447)"
          }, [
            y("path", {
              d: "M 0.535156,0.398438 C 0.398438,0.507812 0.316406,0.671875 0.3125,0.847656 0.316406,1.02344 0.398438,1.1875 0.535156,1.29688 L 3.01172,3.35938 3.72266,4.01563 3.01172,4.64453 0.535156,6.67969 C 0.394531,6.79297 0.3125,6.96094 0.3125,7.13672 c 0,0.17578 0.082031,0.34375 0.222656,0.45703 0.328125,0.25781 0.792974,0.25781 1.117184,0 L 5.45703,4.46094 C 5.59766,4.34766 5.68359,4.17969 5.69141,4 5.69141,3.82031 5.60547,3.65234 5.45703,3.54297 L 1.64453,0.394531 C 1.31641,0.148438 0.859375,0.148438 0.535156,0.398438 Z m 0,0",
              stroke: "none",
              "stroke-width": "0",
              fill: "currentColor"
            })
          ], -1)
        ])], 8, Qe)
      ]),
      y("line", {
        class: "arrow-line",
        x1: q.value.x,
        y1: q.value.y,
        x2: S.value.x,
        y2: S.value.y,
        "marker-end": `url(#${F(f)})`,
        stroke: "currentColor",
        "stroke-width": n.size,
        "stroke-linecap": "round"
      }, null, 8, Ze)
    ]));
  }
}), nt = /* @__PURE__ */ I({
  __name: "ChessboardFrame",
  props: {
    square: {},
    above: { type: Boolean }
  },
  setup(n) {
    const o = n;
    return (i, r) => (k(), G(ie, re(se(o)), {
      default: V(() => [...r[0] || (r[0] = [
        y("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 40 40",
          version: "1.1"
        }, [
          y("g", {
            id: "strict-marker-frame",
            transform: "translate(2, 2)",
            fill: "#000000",
            "fill-opacity": "0",
            "stroke-width": "2",
            stroke: "currentColor"
          }, [
            y("path", { d: "M2.66453526e-15,10.5882353 L2.66453526e-15,2.11764706 C2.66453526e-15,1.41176471 0.176470588,0.882352941 0.529411765,0.529411765 C0.882352941,0.176470588 1.41176471,-2.84217094e-14 2.11764706,-2.84217094e-14 L10.5882353,-2.84217094e-14" }),
            y("path", {
              d: "M25.4117647,36 L25.4117647,27.5294118 C25.4117647,26.8235294 25.5882353,26.2941176 25.9411765,25.9411765 C26.2941176,25.5882353 26.8235294,25.4117647 27.5294118,25.4117647 L36,25.4117647",
              transform: "translate(30.705882, 30.705882) rotate(-180.000000) translate(-30.705882, -30.705882) "
            }),
            y("path", {
              d: "M0,36 L0,27.5294118 C0,26.8235294 0.176470588,26.2941176 0.529411765,25.9411765 C0.882352941,25.5882353 1.41176471,25.4117647 2.11764706,25.4117647 L10.5882353,25.4117647",
              transform: "translate(5.294118, 30.705882) rotate(-90.000000) translate(-5.294118, -30.705882) "
            }),
            y("path", {
              d: "M25.4117647,10.5882353 L25.4117647,2.11764706 C25.4117647,1.41176471 25.5882353,0.882352941 25.9411765,0.529411765 C26.2941176,0.176470588 26.8235294,0 27.5294118,0 L36,0",
              transform: "translate(30.705882, 5.294118) rotate(-270.000000) translate(-30.705882, -5.294118) "
            })
          ])
        ], -1)
      ])]),
      _: 1
    }, 16));
  }
}), ot = /* @__PURE__ */ I({
  __name: "ChessboardDot",
  props: {
    square: {},
    above: { type: Boolean }
  },
  setup(n) {
    const o = n;
    return (i, r) => (k(), G(ie, re(se(o)), {
      default: V(() => [...r[0] || (r[0] = [
        y("div", { class: "cw-chessboard-dot" }, null, -1)
      ])]),
      _: 1
    }, 16));
  }
}), rt = /* @__PURE__ */ I({
  __name: "ChessboardCircle",
  props: {
    square: {},
    above: { type: Boolean }
  },
  setup(n) {
    const o = n;
    return (i, r) => (k(), G(ie, re(se(o)), {
      default: V(() => [...r[0] || (r[0] = [
        y("div", { class: "cw-chessboard-circle" }, null, -1)
      ])]),
      _: 1
    }, 16));
  }
});
export {
  Ke as Chessboard,
  tt as ChessboardArrow,
  rt as ChessboardCircle,
  ot as ChessboardDot,
  nt as ChessboardFrame,
  ie as ChessboardSquare,
  et as PromotionDialog,
  ae as useContext
};
