var E1 = Object.defineProperty;
var q1 = (o, r, n) => r in o ? E1(o, r, { enumerable: !0, configurable: !0, writable: !0, value: n }) : o[r] = n;
var h1 = (o, r, n) => q1(o, typeof r != "symbol" ? r + "" : r, n);
import { provide as B1, inject as A1, defineComponent as Z, computed as P, createElementBlock as B, createCommentVNode as m1, openBlock as b, normalizeStyle as t1, createElementVNode as e, normalizeClass as n1, Fragment as v1, renderList as C1, toDisplayString as w1, ref as e1, onMounted as u1, toValue as U, onUnmounted as T1, toRef as Z1, watch as D1, renderSlot as l1, createVNode as R1, createBlock as V, Transition as I1, withCtx as s1, withModifiers as O1, unref as F1, resolveDynamicComponent as M1, onBeforeUnmount as P1, Teleport as H1, h as y1, useId as N1, normalizeProps as j1, guardReactiveProps as W1, mergeProps as _1 } from "vue";
function G1(o) {
  return [(t) => B1(o, t), () => {
    const t = A1(o);
    if (t === void 0) throw new Error(`Provider "${o}" not found.`);
    return t;
  }];
}
const [U1, p1] = G1("chessboard-context"), V1 = /* @__PURE__ */ Z({
  __name: "ChessboardCoords",
  props: {
    orientation: {},
    coordMode: {},
    borderScale: {},
    coordOutside: { type: Boolean }
  },
  setup(o) {
    const r = o, n = P(() => r.coordMode !== "none"), t = P(() => r.coordMode === "right");
    return (l, s) => n.value ? (b(), B("div", {
      key: 0,
      class: "chessboard-coords",
      style: t1({
        margin: l.borderScale
      })
    }, [
      e("div", {
        class: n1(["coords numbers", {
          outside: l.coordOutside,
          "coords-right": t.value
        }])
      }, [
        (b(), B(v1, null, C1(8, (i) => e("span", {
          class: n1(["coord", i % 2 !== (t.value ? 1 : 0) ? "white" : "black"])
        }, [
          e("span", null, w1(l.orientation === "w" ? 9 - i : i), 1)
        ], 2)), 64))
      ], 2),
      e("div", {
        class: n1(["coords letters", {
          outside: l.coordOutside,
          "coords-right": t.value
        }])
      }, [
        (b(), B(v1, null, C1(8, (i) => e("span", {
          class: n1(["coord", i % 2 === 0 ? "white" : "black"])
        }, [
          e("span", null, w1(String.fromCharCode(l.orientation === "w" ? i + 96 : 105 - i)), 1)
        ], 2)), 64))
      ], 2)
    ], 4)) : m1("", !0);
  }
});
function X1(o, r) {
  const n = e1(0);
  let t;
  function l() {
    const i = U(r);
    i && (t && clearTimeout(t), t = setTimeout(() => {
      const k = U(o);
      if (!k) return console.warn("cw-chessboard: no element provided for rescale");
      const { height: d, width: f } = k.getBoundingClientRect();
      if (i === "width") {
        n.value = f;
        return;
      } else if (i === "height") {
        n.value = d;
        return;
      }
      n.value = f < d ? f : d, f === 0 ? n.value = d : d === 0 && (n.value = f);
    }, 10));
  }
  let s;
  return u1(() => {
    if (window.ResizeObserver) {
      const i = new ResizeObserver(l);
      i.observe(U(o)), s = () => i.disconnect();
    } else
      window.addEventListener("resize", l), s = () => window.removeEventListener("resize", l);
    l();
  }), T1(() => s == null ? void 0 : s()), {
    size: n,
    Rescale: l
  };
}
const Y1 = (o) => {
  const r = [], n = o.split(" ")[0].split("/");
  if (n.length !== 8) throw new Error("Invalid fen string");
  for (let t = 0; t < 8; t++) {
    let l = 0;
    for (let s = 0; s < n[t].length; s++) {
      const i = n[t][s];
      l = parseInt(i), Number.isNaN(l) ? r.push(i) : r.push(...Array(l).fill(null));
    }
  }
  return r;
}, G = (o) => ({
  x: o % 8,
  y: Math.floor(o / 8)
}), f1 = ({ x: o, y: r }) => 8 * r + o, O = ({ x: o, y: r }, n) => n === "b" ? { x: 7 - o, y: 7 - r } : { x: o, y: r }, L1 = ({ x: o, y: r }, { height: n, width: t }) => ({
  x: Math.floor(o / (t / 8)),
  y: Math.floor(r / (n / 8))
}), r1 = (o, r, n) => O(L1(o, n), r), $ = ({ x: o, y: r }) => String.fromCharCode(o + 97) + (8 - r).toString(), d1 = (o) => ({
  x: o.charCodeAt(0) - 97,
  y: 8 - parseInt(o[1])
}), S1 = ({ x: o, y: r }, n) => o === n.x && r === n.y, i1 = ({ x: o, y: r }) => o > -1 && o < 8 && r > -1 && r < 8, g1 = ({ x: o, y: r }) => ({ x: o * 128, y: r * 128 }), b1 = ({ x: o, y: r }) => ({
  x: o + 64,
  y: r + 64
});
class Q1 {
  constructor() {
    h1(this, "isRunning");
    h1(this, "tasks");
    this.isRunning = !1, this.tasks = [];
  }
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
  /**
   * Add task to queue return promise that will be resolved when task is finished
   */
  addTask(r) {
    return new Promise((n, t) => {
      this.tasks.push(() => r().then(n).catch(t)), this.run();
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
function J1(o, r) {
  const n = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  n.setAttribute("xmlns", "http://www.w3.org/2000/svg"), n.setAttribute("viewBox", "0 0 40 40"), n.setAttribute("version", "1.1");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "use");
  return t.setAttribute("href", `#${o}-${r}`), t.setAttribute("xlink:href", `#${o}-${r}`), n.appendChild(t), n;
}
function c1(o, { x: r, y: n }) {
  const t = o.getBoundingClientRect();
  return {
    x: r - t.left,
    y: n - t.top,
    width: t.width,
    height: t.height
  };
}
function K1(o, r) {
  const n = o % 8, t = Math.floor(o / 8), l = r % 8, s = Math.floor(r / 8);
  return Math.max(Math.abs(s - t), Math.abs(l - n));
}
const e2 = (o, r) => {
  const n = [], t = [];
  for (let s = 0; s < 64; s++) {
    const i = o[s], k = r[s];
    k !== i && (k && n.push({ piece: k, index: s }), i && t.push({ piece: i, index: s }));
  }
  const l = [];
  return n.forEach((s) => {
    let i = 8, k = null;
    if (t.forEach((d) => {
      if (s.piece !== d.piece) return;
      const f = K1(s.index, d.index);
      f < i && (k = d, i = f);
    }), k == null) {
      l.push({
        type: 0,
        piece: s.piece,
        atIndex: s.index
      });
      return;
    }
    t.splice(t.indexOf(k), 1), l.push({
      type: 2,
      piece: s.piece,
      atIndex: k.index,
      toIndex: s.index
    });
  }), l.push(
    ...t.map(({ piece: s, index: i }) => ({
      type: 1,
      piece: s,
      atIndex: i
    }))
  ), l;
};
function t2({ onOrientationChange: o, onChange: r, onRenderPiece: n }) {
  let t = null, l = "", s = 200, i = "w", k = !1, d = [], f = "all", h = "default", S = "default";
  const H = (u) => {
    const F = d[u];
    if (!F) return null;
    const C = F.toLowerCase();
    return { name: C, color: C === F ? "b" : "w" };
  }, E = (u) => H(f1(u));
  function D(u, F, C) {
    const p = document.createElement("piece"), m = O(u, C), v = F.toLowerCase(), M = v === F ? "b" : "w", z = M + v, I = $(u);
    p.setAttribute("data-square", I), p.setAttribute("data-piece", z), p.setAttribute("data-color", M), p.classList.add("piece", z), p.style.transform = `translate3d(${m.x * 100}%,${m.y * 100}%,0px)`, p.style.zIndex = "5", p.style.opacity = "1", p.style.display = f === "all" || f === M ? "block" : "none", p.appendChild(
      J1(M === "w" ? h : S, z)
    );
    const j = n == null ? void 0 : n(I, F, M);
    return j && p.classList.add(j), p;
  }
  function g(u, F) {
    const C = F.toLowerCase(), p = $(u), m = (C === F ? "b" : "w") + C;
    return t == null ? void 0 : t.querySelector(
      `[data-piece="${m}"][data-square="${p}"]`
    );
  }
  function A(u, F, C) {
    const p = g(u, F);
    p ? p.style.opacity = C ? k ? "0.5" : "0" : "1" : console.warn(
      "Invalid value for square piece: ",
      $(u),
      F,
      C ? "on" : "off"
    );
  }
  let R = !1;
  function q(u, F, C = !1) {
    if (!t) return console.warn("container is null");
    if (!(R && !C)) {
      t.innerHTML = "";
      for (let p = 0; p < u.length; p++) {
        const m = u[p];
        m && t.appendChild(D(G(p), m, F));
      }
      d = u, R = !0;
    }
  }
  function x(u, F, C) {
    const p = e2(u, F), m = [];
    return p.forEach((v) => {
      const M = G(v.atIndex);
      switch (v.type) {
        case 2: {
          const o1 = g(M, v.piece);
          if (!o1) return;
          t.appendChild(o1);
          const a1 = O(G(v.atIndex), C), W = O(G(v.toIndex), C);
          m.push({
            type: v.type,
            element: o1,
            atPoint: { x: a1.x * 100, y: a1.y * 100 },
            toPoint: { x: W.x * 100, y: W.y * 100 }
          });
          break;
        }
        case 0:
          const z = D(M, v.piece, C);
          z.style.opacity = "0", z.style.display = "block", t.appendChild(z);
          const I = O(G(v.atIndex), C);
          m.push({
            type: v.type,
            element: z,
            atPoint: { x: I.x * 100, y: I.y * 100 }
          });
          break;
        case 1:
          const j = g(M, v.piece);
          if (!j) return;
          m.push({
            type: v.type,
            element: j
          });
          break;
      }
    }), r && r(
      p.map(
        ({ piece: v, type: M, atIndex: z, toIndex: I }) => M === 2 ? {
          piece: v,
          from: $(G(z)),
          to: $(G(I))
        } : { piece: v, from: $(G(z)) }
      )
    ), m;
  }
  const w = new Q1();
  function a(u, F, C, p) {
    return new Promise((m) => {
      var j;
      if (((j = document.hasFocus) == null ? void 0 : j.call(document)) === !1 || !t) return m();
      const v = x(u, F, p);
      let M = null, z;
      function I(o1) {
        if (!w.IsRunning || document.hidden) return m();
        R = !1, z || (z = o1);
        const a1 = o1 - z;
        if (a1 > C) {
          M && (cancelAnimationFrame(M), M = null);
          for (const L of v)
            L.element.style.zIndex = "5", L.type === 1 && L.element.parentNode && t.removeChild(L.element);
          m();
          return;
        }
        M = requestAnimationFrame(I);
        const W = Math.min(1, a1 / C);
        let K = W < 0.5 ? 2 * W * W : -1 + (4 - 2 * W) * W;
        (isNaN(K) || K > 0.99) && (K = 1), v.forEach((L) => {
          switch (L.element.style.zIndex = "15", L.type) {
            case 2: {
              const z1 = L.atPoint.x + (L.toPoint.x - L.atPoint.x) * K, $1 = L.atPoint.y + (L.toPoint.y - L.atPoint.y) * K;
              L.element.style.transform = `translate3d(${z1}%,${$1}%,0px)`;
              break;
            }
            case 0:
              L.element.style.opacity = (Math.round(K * 100) / 100).toString();
              break;
            case 1:
              L.element.style.opacity = (Math.round((1 - K) * 100) / 100).toString();
              break;
          }
        });
      }
      M = requestAnimationFrame(I);
    });
  }
  function c() {
    w.clear();
  }
  function y(u) {
    t = u;
  }
  function _(u, F, C = !1) {
    if (u === h && F === S) return;
    h = u, S = F;
    let p = C ? s : 0;
    w.Size > 0 && (p = p / (1 + Math.pow(w.Size / 5, 2)));
    const m = w.addTask(() => a(new Array(...d), [], p, i)), v = w.addTask(
      () => a([], new Array(...d), p, i).then(
        () => q(d, i, !0)
      )
    );
    return Promise.all([m, v]);
  }
  async function T(u, F, C = !1) {
    const p = new Array(...d), m = f1(u);
    if (!p[m]) return console.warn("no piece on", $(u));
    const v = f1(F);
    p[v] = p[m], p[m] = null;
    let M = C ? s : 0;
    return w.Size > 0 && (M = M / (1 + Math.pow(w.Size / 5, 2))), w.addTask(() => a(new Array(...d), p, M, i)).then(() => q(p, i, !0));
  }
  async function X(u, F = !1) {
    if (u === l) return;
    l = u;
    const C = Y1(l);
    let p = F ? s : 0;
    return w.Size > 0 && (p = p / (1 + Math.pow(w.Size / 5, 2))), w.addTask(
      () => a([...d], C, p, i).then(
        () => q(C, i, !0)
      )
    );
  }
  async function Y(u, F = !1) {
    if (u === i) return;
    i = u;
    let C = F ? s : 0;
    w.Size > 0 && (C = C / (1 + Math.pow(w.Size / 5, 2)));
    const p = w.addTask(() => a(new Array(...d), [], C, i)), m = w.addTask(
      () => a([], new Array(...d), C, i).then(
        () => q(d, i, !0)
      )
    );
    return Promise.all([p.then(() => o == null ? void 0 : o(i)), m]);
  }
  function N(u) {
    s = u;
  }
  function Q(u) {
    k = u;
  }
  async function J(u, F = !1) {
    if (f === u) return;
    let C = F ? s : 0;
    w.Size > 0 && (C = C / (1 + Math.pow(w.Size / 5, 2)));
    let p = f === "none" ? new Array(64).fill(null) : [...d], m;
    return u === "all" ? (p = new Array(64).fill(null), m = [...d]) : u === "none" ? m = new Array(64).fill(null) : u === "w" ? m = d.map((v) => (v == null ? void 0 : v.toUpperCase()) === v ? v : null) : u === "b" && (m = d.map((v) => (v == null ? void 0 : v.toLowerCase()) === v ? v : null)), f = u, w.addTask(
      () => a(p, m, C, i).then(
        () => q(d, i, !0)
      )
    );
  }
  return {
    getPieceByIndex: H,
    getPieceByPoint: E,
    movePiece: T,
    setPiecePack: _,
    setAlphaPiece: A,
    setFen: X,
    setDuration: N,
    setOrientation: Y,
    setIsAlphaPiece: Q,
    setContainer: y,
    setVisibility: J,
    terminate: c
  };
}
const o2 = { class: "cw-chessboard-inner" }, g2 = /* @__PURE__ */ Z({
  __name: "Chessboard",
  props: {
    fen: {},
    orientation: { default: "w" },
    duration: { default: 300 },
    borderSize: { default: 12 },
    borderColor: { default: "#692e2b" },
    roundSize: { default: 0 },
    fontSize: { default: 24 },
    coordOutside: { type: Boolean },
    coordMode: { default: "left" },
    coordWhite: { default: "#c5a076" },
    coordBlack: { default: "#ecdab9" },
    alphaPiece: { type: Boolean },
    surface: {},
    resize: { type: [Boolean, String], default: !0 },
    visibility: { default: "all" },
    onRenderPiece: {},
    piecePack: { default: "default" },
    pieceWhitePack: {},
    pieceBlackPack: {}
  },
  emits: ["ready", "moves"],
  setup(o, { expose: r, emit: n }) {
    const t = o, l = n, s = e1(), i = () => s.value, k = e1(), { size: d, Rescale: f } = X1(
      P(() => s.value.parentElement),
      Z1(t, "resize")
    ), h = P(() => d.value / 900), S = P(() => t.fontSize * h.value), H = P(() => S.value < t.borderSize), E = P(() => !t.coordOutside || H.value ? `${(t.borderSize * h.value).toFixed(2)}px` : `${((H.value ? t.borderSize : t.fontSize / 1.5) * h.value).toFixed(2)}px`), D = P(() => `${t.roundSize * h.value}px`), g = P(() => `${d.value}px`), A = P(() => `${S.value.toFixed(3)}px`), R = e1(t.orientation), q = e1(null), x = t2({
      onChange(c) {
        l("moves", c);
      },
      onOrientationChange(c) {
        R.value = c;
      },
      onRenderPiece: t.onRenderPiece
    }), w = P(() => t.pieceWhitePack || t.piecePack), a = P(() => t.pieceBlackPack || t.piecePack);
    return D1(
      t,
      async ({ fen: c, orientation: y, alphaPiece: _, duration: T, visibility: X }) => {
        c && x.setFen(c, !0), x.setOrientation(y, !0), x.setVisibility(X, !0), x.setPiecePack(w.value, a.value, !0), x.setIsAlphaPiece(_), x.setDuration(T);
      },
      { deep: !0 }
    ), U1({
      container: s,
      chessboard: k,
      orientation: R,
      pieces: x,
      pieceWhitePack: w,
      pieceBlackPack: a
    }), u1(() => {
      x.setContainer(q.value), x.setDuration(t.duration), t.fen && x.setFen(t.fen), x.setOrientation(t.orientation), x.setVisibility(t.visibility), x.setIsAlphaPiece(t.alphaPiece), x.setPiecePack(
        t.pieceWhitePack || t.piecePack,
        t.pieceBlackPack || t.piecePack
      ), l("ready", x);
    }), r({ getElement: i, boardSize: d, Rescale: f, pieces: x, fontScale: S }), (c, y) => (b(), B("div", {
      ref_key: "container",
      ref: s,
      class: "cw-chessboard chessboard-theme",
      style: t1({
        width: g.value,
        height: g.value,
        fontSize: A.value,
        "--cw-coords-white": c.coordWhite,
        "--cw-coords-black": c.coordBlack
      })
    }, [
      l1(c.$slots, "before"),
      e("div", {
        class: "cw-wrapper",
        style: t1({ borderRadius: D.value, background: c.borderColor, padding: E.value })
      }, [
        e("div", {
          ref_key: "chessboard",
          ref: k,
          class: n1(["cw-container", { outside: c.coordOutside }]),
          style: t1({ borderRadius: D.value })
        }, [
          e("div", o2, [
            l1(c.$slots, "default"),
            e("div", {
              ref_key: "piecesContainer",
              ref: q,
              class: "pieces"
            }, null, 512)
          ])
        ], 6)
      ], 4),
      R1(V1, {
        borderScale: E.value,
        coordMode: c.coordMode,
        orientation: c.orientation,
        coordOutside: c.coordOutside
      }, null, 8, ["borderScale", "coordMode", "orientation", "coordOutside"]),
      l1(c.$slots, "after")
    ], 4));
  }
}), r2 = {
  class: "cw-chessboard-surface",
  style: {}
}, n2 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
}, s2 = ["fill"], a2 = ["fill"], b2 = /* @__PURE__ */ Z({
  __name: "ChessboardSurface",
  props: {
    white: {},
    black: {}
  },
  setup(o) {
    return (r, n) => (b(), B("div", r2, [
      l1(r.$slots, "default", {}, () => [
        (b(), B("svg", n2, [
          e("path", {
            fill: r.white,
            d: "M0 0h512v512H0z"
          }, null, 8, s2),
          e("path", {
            fill: r.black,
            d: "M255.9.2h-64v64h64zM0 64.17v64h64v-64zM128 .2H64v64h64zm64 255.9v64h64v-64zM0 192.12v64h64v-64zM383.85.2h-64v64h64zm128 0h-64v64h64zM128 256.1H64v64h64zM511.8 448v-64h-64v64zm0-128v-64h-64v64zM383.85 512h64v-64h-64zm128-319.88v-64h-64v64zM128 512h64v-64h-64zM0 512h64v-64H0zm255.9 0h64v-64h-64zM0 320.07v64h64v-64zm319.88-191.92v-64h-64v64zm-64 128h64v-64h-64zm-64 128v64h64v-64zm128-64h64v-64h-64zm0-127.95h64v-64h-64zm0 191.93v64h64v-64zM64 384.05v64h64v-64zm128-255.9v-64h-64v64zm191.92 255.9h64v-64h-64zm-128-191.93v-64h-64v64zm128-127.95v64h64v-64zm-128 255.9v64h64v-64zm-64-127.95H128v64h64zm191.92 64h64v-64h-64zM128 128.15H64v64h64zm0 191.92v64h64v-64z"
          }, null, 8, a2)
        ]))
      ])
    ]));
  }
}), i2 = {
  key: 0,
  class: "promotion-dialog"
}, l2 = ["onPointerdown"], c2 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 40 40",
  version: "1.1"
}, d2 = ["href"], u2 = /* @__PURE__ */ Z({
  __name: "PromotionDialog",
  props: {
    color: {}
  },
  setup(o, { expose: r }) {
    const n = o, { orientation: t, pieceWhitePack: l, pieceBlackPack: s } = p1(), i = P(() => n.color || t.value), k = P(
      () => i.value == "w" ? l.value : s.value
    ), d = e1();
    let f, h;
    return r({ require: (E) => new Promise((D, g) => {
      if (d.value) return h();
      d.value = O(d1(E), t.value), f = (A) => {
        d.value = null, D(A);
      }, h = g;
    }), abort: () => {
      d.value = null, h();
    } }), (E, D) => (b(), V(I1, { name: "promotion-dialog" }, {
      default: s1(() => [
        d.value ? (b(), B("div", i2, [
          (b(), B(v1, null, C1(["q", "r", "b", "n"], (g, A) => e("button", {
            key: A,
            class: "promotion-piece",
            style: t1({ transform: `translate(${d.value.x * 100}%, ${A * 100}%)` }),
            onPointerdown: O1((R) => F1(f)(g), ["stop"])
          }, [
            (b(), V(M1("piece"), null, {
              default: s1(() => [
                (b(), B("svg", c2, [
                  e("use", {
                    href: `#${k.value}-${i.value}${g}`
                  }, null, 8, d2)
                ]))
              ]),
              _: 2
            }, 1024))
          ], 44, l2)), 64))
        ])) : m1("", !0)
      ]),
      _: 1
    }));
  }
}), p2 = (o, r) => {
  const n = o.__vccOpts || o;
  for (const [t, l] of r)
    n[t] = l;
  return n;
}, x2 = /* @__PURE__ */ p2(u2, [["__scopeId", "data-v-2f32fe76"]]);
function h2({ el: o, onStart: r, onMove: n, onEnd: t, onCancel: l }) {
  const s = (f) => {
    if (f.preventDefault(), !f.isPrimary) return;
    const h = c1(U(o), f);
    r(h) && (document.addEventListener("pointermove", i, { capture: !0 }), document.addEventListener("pointerup", k, { capture: !0 }), document.addEventListener("pointercancel", d, { capture: !0 }));
  }, i = (f) => {
    const h = c1(U(o), f);
    n(h);
  }, k = (f) => {
    document.removeEventListener("pointermove", i, { capture: !0 }), document.removeEventListener("pointerup", k, { capture: !0 }), document.removeEventListener("pointercancel", d, { capture: !0 });
    const h = c1(U(o), f);
    t(h);
  }, d = (f) => {
    document.removeEventListener("pointermove", i, { capture: !0 }), document.removeEventListener("pointerup", k, { capture: !0 }), document.removeEventListener("pointercancel", d, { capture: !0 }), l();
  };
  return u1(() => {
    const f = U(o);
    if (!f) return console.warn("Element not found");
    f.style.touchAction = "none", f.addEventListener("pointerdown", s);
  }), P1(() => {
    const f = U(o);
    if (!f) return console.warn("Element not found");
    f.style.touchAction = "auto", f.removeEventListener("pointerdown", s);
  }), {};
}
const f2 = {
  key: 0,
  class: "pieces move-field"
}, v2 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 40 40",
  version: "1.1"
}, C2 = ["href"], x1 = 32, M2 = /* @__PURE__ */ Z({
  __name: "ChessboardControl",
  props: {
    mode: { default: "auto" },
    enableColor: { default: "all" },
    alignPiece: { type: Boolean }
  },
  emits: ["beforeMove", "afterMove", "cancelMove", "enterSquare", "leaveSquare", "dropMove", "dropEnd"],
  setup(o, { emit: r }) {
    const n = o, t = r, { chessboard: l, pieces: s, pieceWhitePack: i, pieceBlackPack: k, orientation: d } = p1(), f = P(
      () => {
        var a;
        return ((a = S.value) == null ? void 0 : a.color) == "w" ? i.value : k.value;
      }
    );
    let h = null;
    const S = e1(null), H = (a) => n.enableColor === "all" || n.enableColor === a;
    let E = null;
    const D = (a) => {
      E && S1(E, a) || (E && t("leaveSquare", $(E)), t("enterSquare", $(a)), E = a);
    };
    let g = !1;
    const A = () => n.mode === "auto" ? !1 : n.mode === "press" && g || n.mode === "move" && !g;
    function R(a, c) {
      s.setAlphaPiece(
        a,
        a.color === "w" ? a.name.toUpperCase() : a.name,
        c
      );
    }
    function q(a, c = !0) {
      c && t("cancelMove", $(a)), R(a, !1), S.value = null, E = null, h = null;
    }
    h2({
      el: l,
      onStart: (a) => {
        g = !1;
        const c = r1(a, d.value, a);
        if (!i1(c)) return !1;
        if (h && S1(h, c))
          return q(h), !1;
        const y = s.getPieceByPoint(c);
        return !y || !H(y.color) || t("beforeMove", $(c), (_) => {
          _ && (h = {
            x: c.x,
            y: c.y,
            name: y.name,
            color: y.color
          }, D(r1(a, d.value, a)));
        }), !0;
      },
      onMove: (a) => {
        if (!h) return;
        const c = a.width / 8, y = a.height / 8, _ = a.x - c / 2, T = a.y - y / 2, X = g;
        if (!g) {
          const N = h.x * c, Q = h.y * y, J = Math.abs(_ - N), u = Math.abs(T - Q);
          g = J > x1 || u > x1, X !== g && R(h, g);
        }
        if (g && !A())
          S.value = {
            name: h.name,
            color: h.color,
            x: _,
            y: T
          };
        else {
          const { x: N, y: Q } = O(h, d.value), J = N * c, u = Q * y;
          S.value = {
            name: h.name,
            color: h.color,
            x: J,
            y: u
          };
        }
        if (A()) return;
        if (n.alignPiece && S.value) {
          const N = L1(a, a), Q = N.x * c, J = N.y * y;
          S.value.x = Q, S.value.y = J;
        }
        const Y = r1(a, d.value, a);
        i1(Y) && D(Y);
      },
      onEnd: (a) => {
        if (A()) {
          h && q(h);
          return;
        }
        const c = r1(a, d.value, a);
        if (!i1(c)) {
          h && q(h);
          return;
        }
        if (S.value = null, !h) return;
        const y = s.getPieceByPoint(c);
        if (y && y.color === h.color) {
          R(h, !1);
          return;
        }
        t(
          "afterMove",
          $(h),
          $(c),
          async (_) => {
            if (!h) return console.warn("Cannot move from square ");
            const T = h;
            q(T, !_), _ && await s.movePiece(T, c, !g);
          }
        );
      },
      onCancel: () => {
        h && q(h, !0);
      }
    });
    function x(a) {
      var Y;
      const c = a.currentTarget, y = (Y = a.dataTransfer) == null ? void 0 : Y.getData("text/plain");
      if (!(y != null && y.includes("piece "))) return;
      const _ = c1(c, a), T = r1(_, d.value, _);
      if (!i1(T)) return;
      const X = y.split(" ")[1];
      t("dropEnd", X, $(T));
    }
    function w(a) {
      a.preventDefault();
      const c = a.currentTarget, y = c1(c, a), _ = r1(y, d.value, y);
      i1(_) && t("dropMove", $(_));
    }
    return u1(() => {
      var a, c;
      (a = l.value) == null || a.addEventListener("drop", x), (c = l.value) == null || c.addEventListener("dragover", w);
    }), P1(() => {
      var a, c;
      (a = l.value) == null || a.removeEventListener("drop", x), (c = l.value) == null || c.removeEventListener("dragover", w);
    }), (a, c) => S.value ? (b(), B("div", f2, [
      (b(), V(M1("piece"), {
        class: "active",
        style: t1({
          transform: `translate3d(${S.value.x}px, ${S.value.y}px, 0px)`,
          zIndex: 100
        })
      }, {
        default: s1(() => [
          (b(), B("svg", v2, [
            e("use", {
              href: `#${f.value}-${S.value.color}${S.value.name}`
            }, null, 8, C2)
          ]))
        ]),
        _: 1
      }, 8, ["style"]))
    ])) : m1("", !0);
  }
}), F2 = {
  style: { display: "none" },
  width: "40px",
  height: "40px",
  viewBox: "0 0 40 40",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg"
}, P2 = /* @__PURE__ */ Z({
  __name: "ChessboardPieces",
  setup(o) {
    return (r, n) => (b(), V(H1, { to: "body" }, [
      (b(), B("svg", F2, n[0] || (n[0] = [
        e("g", {
          id: "default-wk",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          transform: "translate(5.000000, 5.000000)",
          stroke: "#000000",
          "stroke-width": "1.5"
        }, [
          e("line", {
            x1: "15",
            y1: "4.96764706",
            x2: "15",
            y2: "0",
            id: "Shape"
          }),
          e("line", {
            x1: "12.8571429",
            y1: "1.76470588",
            x2: "17.1428571",
            y2: "1.76470588",
            id: "Shape"
          }),
          e("path", {
            d: "M17.5714286,7.5 C17.5714286,7.5 16.7142857,5.29411765 15,5.29411765 C13.2857143,5.29411765 12.4285714,7.5 12.4285714,7.5 C11.1428571,10.1470588 15,16.7647059 15,16.7647059 C15,16.7647059 18.8571429,10.1470588 17.5714286,7.5 Z",
            id: "Shape",
            fill: "#FFFFFF"
          }),
          e("path", {
            d: "M5.57142857,27.3529412 C10.2857143,30.4411765 18.8571429,30.4411765 23.5714286,27.3529412 L23.5714286,21.1764706 C23.5714286,21.1764706 31.2857143,17.2058824 28.7142857,11.9117647 C25.2857143,6.17647059 17.1428571,8.82352941 15,15.4411765 L15,18.5294118 L15,15.4411765 C12,8.82352941 3.85714286,6.17647059 1.28571429,11.9117647 C-1.28571429,17.2058824 5.57142857,20.7352941 5.57142857,20.7352941 L5.57142857,27.3529412 Z",
            id: "Shape",
            fill: "#FFFFFF"
          }),
          e("path", {
            d: "M5.57142857,21.1764706 C10.2857143,18.5294118 18.8571429,18.5294118 23.5714286,21.1764706",
            id: "Shape",
            "fill-opacity": "0",
            fill: "#000000"
          }),
          e("path", {
            d: "M5.57142857,24.2647059 C10.2857143,21.6176471 18.8571429,21.6176471 23.5714286,24.2647059",
            id: "Shape",
            "fill-opacity": "0",
            fill: "#000000",
            "stroke-linecap": "square"
          }),
          e("path", {
            d: "M5.57142857,27.3529412 C10.2857143,24.7058824 18.8571429,24.7058824 23.5714286,27.3529412",
            id: "Shape",
            "fill-opacity": "0",
            fill: "#000000"
          })
        ], -1),
        e("g", {
          id: "default-wq",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          transform: "translate(4.000000, 5.000000)",
          stroke: "#000000",
          "stroke-width": "1.5"
        }, [
          e("path", {
            d: "M3.45945946,6.2 C3.45945946,7.17833299 2.68503308,7.97142857 1.72972973,7.97142857 C0.774426379,7.97142857 0,7.17833299 0,6.2 C0,5.22166701 0.774426379,4.42857143 1.72972973,4.42857143 C2.68503308,4.42857143 3.45945946,5.22166701 3.45945946,6.2 Z",
            id: "Shape",
            fill: "#FFFFFF"
          }),
          e("path", {
            d: "M17.7297297,2.21428571 C17.7297297,3.1926187 16.9553034,3.98571429 16,3.98571429 C15.0446966,3.98571429 14.2702703,3.1926187 14.2702703,2.21428571 C14.2702703,1.23595273 15.0446966,0.442857143 16,0.442857143 C16.9553034,0.442857143 17.7297297,1.23595273 17.7297297,2.21428571 Z",
            id: "Shape",
            fill: "#FFFFFF"
          }),
          e("path", {
            d: "M32,6.2 C32,7.17833299 31.2255736,7.97142857 30.2702703,7.97142857 C29.3149669,7.97142857 28.5405405,7.17833299 28.5405405,6.2 C28.5405405,5.22166701 29.3149669,4.42857143 30.2702703,4.42857143 C31.2255736,4.42857143 32,5.22166701 32,6.2 Z",
            id: "Shape",
            fill: "#FFFFFF"
          }),
          e("path", {
            d: "M10.3783784,3.1 C10.3783784,4.07833299 9.603952,4.87142857 8.64864865,4.87142857 C7.6933453,4.87142857 6.91891892,4.07833299 6.91891892,3.1 C6.91891892,2.12166701 7.6933453,1.32857143 8.64864865,1.32857143 C9.603952,1.32857143 10.3783784,2.12166701 10.3783784,3.1 Z",
            id: "Shape",
            fill: "#FFFFFF"
          }),
          e("path", {
            d: "M25.0810811,3.54285714 C25.0810811,4.52119013 24.3066547,5.31428571 23.3513514,5.31428571 C22.396048,5.31428571 21.6216216,4.52119013 21.6216216,3.54285714 C21.6216216,2.56452416 22.396048,1.77142857 23.3513514,1.77142857 C24.3066547,1.77142857 25.0810811,2.56452416 25.0810811,3.54285714 Z",
            id: "Shape",
            fill: "#FFFFFF"
          }),
          e("path", {
            d: "M4.32432432,18.6 C11.6756757,17.2714286 22.4864865,17.2714286 27.6756757,18.6 L29.4054054,7.97142857 L23.3513514,17.7142857 L23.3513514,5.31428571 L18.5945946,17.2714286 L16,3.98571429 L13.4054054,17.2714286 L8.64864865,4.87142857 L8.64864865,17.7142857 L2.59459459,7.97142857 L4.32432432,18.6 Z",
            id: "Shape",
            fill: "#FFFFFF"
          }),
          e("path", {
            d: "M4.32432432,18.6 C4.32432432,20.3714286 5.62162162,20.3714286 6.48648649,22.1428571 C7.35135135,23.4714286 7.35135135,23.0285714 6.91891892,25.2428571 C5.62162162,26.1285714 5.62162162,27.4571429 5.62162162,27.4571429 C4.32432432,28.7857143 6.05405405,29.6714286 6.05405405,29.6714286 C11.6756757,30.5571429 20.3243243,30.5571429 25.9459459,29.6714286 C25.9459459,29.6714286 27.2432432,28.7857143 25.9459459,27.4571429 C25.9459459,27.4571429 26.3783784,26.1285714 25.0810811,25.2428571 C24.6486486,23.0285714 24.6486486,23.4714286 25.5135135,22.1428571 C26.3783784,20.3714286 27.6756757,20.3714286 27.6756757,18.6 C20.3243243,17.2714286 11.6756757,17.2714286 4.32432432,18.6 Z",
            id: "Shape",
            fill: "#FFFFFF"
          }),
          e("path", {
            d: "M6.48648649,22.1428571 C9.51351351,21.2571429 22.4864865,21.2571429 25.5135135,22.1428571",
            id: "Shape"
          }),
          e("path", {
            d: "M6.91891892,25.2428571 C12.1081081,24.3571429 19.8918919,24.3571429 25.0810811,25.2428571",
            id: "Shape"
          })
        ], -1),
        e("g", {
          id: "default-wb",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          transform: "translate(6.000000, 5.000000)",
          stroke: "#000000",
          "stroke-width": "1.5"
        }, [
          e("g", {
            id: "Group",
            fill: "#FFFFFF"
          }, [
            e("path", {
              d: "M2.54545455,27.3529412 C5.42181818,26.4970588 11.1236364,27.7323529 14,25.5882353 C16.8763636,27.7323529 22.5781818,26.4970588 25.4545455,27.3529412 C25.4545455,27.3529412 26.8545455,27.8294118 28,29.1176471 C27.4230303,29.9735294 26.6,29.9911765 25.4545455,29.5588235 C22.5781818,28.7029412 16.8763636,29.9647059 14,28.6764706 C11.1236364,29.9647059 5.42181818,28.7029412 2.54545455,29.5588235 C1.39660606,29.9911765 0.574424242,29.9735294 0,29.1176471 C1.14884848,27.4058824 2.54545455,27.3529412 2.54545455,27.3529412 Z",
              id: "Shape"
            }),
            e("path", {
              d: "M7.63636364,23.8235294 C9.75757576,26.0294118 18.2424242,26.0294118 20.3636364,23.8235294 C20.7878788,22.5 20.3636364,22.0588235 20.3636364,22.0588235 C20.3636364,19.8529412 18.2424242,18.5294118 18.2424242,18.5294118 C22.9090909,17.2058824 23.3333333,8.38235294 14,4.85294118 C4.66666667,8.38235294 5.09090909,17.2058824 9.75757576,18.5294118 C9.75757576,18.5294118 7.63636364,19.8529412 7.63636364,22.0588235 C7.63636364,22.0588235 7.21212121,22.5 7.63636364,23.8235294 Z",
              id: "Shape"
            }),
            e("path", {
              d: "M16.1212121,2.64705882 C16.1212121,3.86533401 15.1715131,4.85294118 14,4.85294118 C12.8284869,4.85294118 11.8787879,3.86533401 11.8787879,2.64705882 C11.8787879,1.42878364 12.8284869,0.441176471 14,0.441176471 C15.1715131,0.441176471 16.1212121,1.42878364 16.1212121,2.64705882 Z",
              id: "Shape"
            })
          ]),
          e("path", {
            d: "M9.75757576,18.5294118 L18.2424242,18.5294118 M7.63636364,22.0588235 L20.3636364,22.0588235 M14,9.26470588 L14,13.6764706 M11.8787879,11.4705882 L16.1212121,11.4705882",
            id: "Shape"
          })
        ], -1),
        e("g", {
          id: "default-wn",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          transform: "translate(6.000000, 6.000000)",
          stroke: "#000000"
        }, [
          e("path", {
            d: "M13.5757576,2.625 C22.4848485,3.5 27.5757576,9.625 27.1515152,28 L7.63636364,28 C7.63636364,20.125 16.1212121,22.3125 14.4242424,9.625",
            id: "Shape",
            "stroke-width": "1.5",
            fill: "#FFFFFF"
          }),
          e("path", {
            d: "M15.2727273,9.625 C15.5951515,12.17125 10.5636364,16.07375 8.48484848,17.5 C5.93939394,19.25 6.09212121,21.2975 4.24242424,21 C3.35830303,20.1775 5.43878788,18.34 4.24242424,18.375 C3.39393939,18.375 4.40363636,19.45125 3.39393939,20.125 C2.54545455,20.125 -0.00254545455,21 -1.90580876e-06,16.625 C-1.90580876e-06,14.875 5.09090909,6.125 5.09090909,6.125 C5.09090909,6.125 6.69454545,4.4625 6.78787879,3.0625 C6.16848485,2.19275 6.36363636,1.3125 6.36363636,0.4375 C7.21212121,-0.4375 8.90909091,2.625 8.90909091,2.625 L10.6060606,2.625 C10.6060606,2.625 11.2678788,0.882 12.7272727,0 C13.5757576,0 13.5757576,2.625 13.5757576,2.625",
            id: "Shape",
            "stroke-width": "1.5",
            fill: "#FFFFFF"
          }),
          e("path", {
            d: "M2.96969697,16.1875 C2.96969697,16.4291246 2.77975717,16.625 2.54545455,16.625 C2.31115192,16.625 2.12121212,16.4291246 2.12121212,16.1875 C2.12121212,15.9458754 2.31115192,15.75 2.54545455,15.75 C2.77975717,15.75 2.96969697,15.9458754 2.96969697,16.1875 Z",
            id: "Shape",
            "stroke-width": "1.5",
            fill: "#000000"
          }),
          e("path", {
            d: "M7.6363543,7.4375 C7.6363543,8.16235779 7.44641868,8.74997112 7.21212121,8.74997112 C6.97782375,8.74997112 6.78788812,8.16235779 6.78788812,7.4375 C6.78788812,6.71264221 6.97782375,6.12502888 7.21212121,6.12502888 C7.44641868,6.12502888 7.6363543,6.71264221 7.6363543,7.4375 L7.6363543,7.4375 Z",
            id: "Shape",
            "stroke-width": "1.499967",
            fill: "#000000",
            transform: "translate(7.212121, 7.437500) rotate(30.000728) translate(-7.212121, -7.437500) "
          })
        ], -1),
        e("g", {
          id: "default-wr",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          transform: "translate(9.000000, 8.000000)",
          stroke: "#000000",
          "stroke-width": "1.5"
        }, [
          e("polygon", {
            id: "Shape",
            fill: "#FFFFFF",
            points: "0 26 22 26 22 23.4 0 23.4"
          }),
          e("polygon", {
            id: "Shape",
            fill: "#FFFFFF",
            points: "2.44444444 23.4 2.44444444 19.9333333 19.5555556 19.9333333 19.5555556 23.4"
          }),
          e("polyline", {
            id: "Shape",
            fill: "#FFFFFF",
            points: "1.62962963 4.33333333 1.62962963 0 4.88888889 0 4.88888889 1.73333333 8.96296296 1.73333333 8.96296296 0 13.037037 0 13.037037 1.73333333 17.1111111 1.73333333 17.1111111 0 20.3703704 0 20.3703704 4.33333333"
          }),
          e("polyline", {
            id: "Shape",
            fill: "#FFFFFF",
            points: "20.3703704 4.33333333 17.9259259 6.93333333 4.07407407 6.93333333 1.62962963 4.33333333"
          }),
          e("polyline", {
            id: "Shape",
            fill: "#FFFFFF",
            points: "17.9259259 6.93333333 17.9259259 17.7666667 4.07407407 17.7666667 4.07407407 6.93333333"
          }),
          e("polyline", {
            id: "Shape",
            fill: "#FFFFFF",
            points: "17.9259259 17.7666667 19.1481481 19.9333333 2.85185185 19.9333333 4.07407407 17.7666667"
          }),
          e("line", {
            x1: "1.62962963",
            y1: "4.33333333",
            x2: "20.3703704",
            y2: "4.33333333",
            id: "Shape"
          })
        ], -1),
        e("g", {
          id: "default-wp",
          transform: "translate(10.000000, 9.000000)",
          fill: "#FFFFFF",
          stroke: "#000000",
          "stroke-linecap": "round",
          "stroke-width": "1.5"
        }, [
          e("path", {
            d: "M10,0 C8.15833333,0 6.66666667,1.50129032 6.66666667,3.35483871 C6.66666667,4.10129032 6.90833333,4.78903226 7.31666667,5.35096774 C5.69166667,6.29032258 4.58333333,8.04322581 4.58333333,10.0645161 C4.58333333,11.7670968 5.36666667,13.2851613 6.59166667,14.2832258 C4.09166667,15.1722581 0.416666667,18.9380645 0.416666667,25.5806452 L19.5833333,25.5806452 C19.5833333,18.9380645 15.9083333,15.1722581 13.4083333,14.2832258 C14.6333333,13.2851613 15.4166667,11.7670968 15.4166667,10.0645161 C15.4166667,8.04322581 14.3083333,6.29032258 12.6833333,5.35096774 C13.0916667,4.78903226 13.3333333,4.10129032 13.3333333,3.35483871 C13.3333333,1.50129032 11.8416667,0 10,0 Z",
            id: "Shape"
          })
        ], -1),
        e("g", {
          id: "default-bk",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          transform: "translate(5.000000, 5.000000)",
          "stroke-width": "1.5"
        }, [
          e("line", {
            x1: "15",
            y1: "4.96764706",
            x2: "15",
            y2: "0",
            id: "Shape",
            stroke: "#000000"
          }),
          e("path", {
            d: "M15,16.7647059 C15,16.7647059 18.8571429,10.1470588 17.5714286,7.5 C17.5714286,7.5 16.7142857,5.29411765 15,5.29411765 C13.2857143,5.29411765 12.4285714,7.5 12.4285714,7.5 C11.1428571,10.1470588 15,16.7647059 15,16.7647059",
            id: "Shape",
            stroke: "#000000",
            fill: "#000000"
          }),
          e("path", {
            d: "M5.57142857,27.3529412 C10.2857143,30.4411765 18.8571429,30.4411765 23.5714286,27.3529412 L23.5714286,21.1764706 C23.5714286,21.1764706 31.2857143,17.2058824 28.7142857,11.9117647 C25.2857143,6.17647059 17.1428571,8.82352941 15,15.4411765 L15,18.5294118 L15,15.4411765 C12,8.82352941 3.85714286,6.17647059 1.28571429,11.9117647 C-1.28571429,17.2058824 5.57142857,20.7352941 5.57142857,20.7352941 L5.57142857,27.3529412 Z",
            id: "Shape",
            stroke: "#000000",
            fill: "#000000"
          }),
          e("line", {
            x1: "12.8571429",
            y1: "1.76470588",
            x2: "17.1428571",
            y2: "1.76470588",
            id: "Shape",
            stroke: "#000000"
          }),
          e("path", {
            d: "M23.1428571,20.7352941 C23.1428571,20.7352941 30.4285714,17.2058824 28.3114286,12.2205882 C24.9857143,7.05882353 17.1428571,10.5882353 15,16.3235294 L15.0085714,18.1764706 L15,16.3235294 C12.8571429,10.5882353 4.20514286,7.05882353 1.71171429,12.2205882 C-0.428571429,17.2058824 5.87142857,20.1617647 5.87142857,20.1617647",
            id: "Shape",
            stroke: "#FFFFFF"
          }),
          e("path", {
            d: "M5.57142857,21.1764706 C10.2857143,18.5294118 18.8571429,18.5294118 23.5714286,21.1764706 M5.57142857,24.2647059 C10.2857143,21.6176471 18.8571429,21.6176471 23.5714286,24.2647059 M5.57142857,27.3529412 C10.2857143,24.7058824 18.8571429,24.7058824 23.5714286,27.3529412",
            id: "Shape",
            stroke: "#FFFFFF"
          })
        ], -1),
        e("g", {
          id: "default-bq",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          transform: "translate(3.000000, 4.000000)"
        }, [
          e("g", {
            id: "Group",
            fill: "#000000"
          }, [
            e("ellipse", {
              id: "Oval",
              cx: "2.61538462",
              cy: "6.22222222",
              rx: "2.3974359",
              ry: "2.44444444"
            }),
            e("ellipse", {
              id: "Oval",
              cx: "9.58974359",
              cy: "3.55555556",
              rx: "2.3974359",
              ry: "2.44444444"
            }),
            e("ellipse", {
              id: "Oval",
              cx: "17",
              cy: "2.66666667",
              rx: "2.3974359",
              ry: "2.44444444"
            }),
            e("ellipse", {
              id: "Oval",
              cx: "24.4102564",
              cy: "3.55555556",
              rx: "2.3974359",
              ry: "2.44444444"
            }),
            e("ellipse", {
              id: "Oval",
              cx: "31.3846154",
              cy: "6.22222222",
              rx: "2.3974359",
              ry: "2.44444444"
            })
          ]),
          e("path", {
            d: "M5.23076923,18.6666667 C12.6410256,17.3333333 23.5384615,17.3333333 28.7692308,18.6666667 L30.9487179,7.55555556 L24.4102564,17.7777778 L24.1487179,5.24444444 L19.6153846,17.3333333 L17,4.44444444 L14.3846154,17.3333333 L9.85128205,5.24444444 L9.58974359,17.7777778 L3.05128205,7.55555556 L5.23076923,18.6666667 Z",
            id: "crown",
            stroke: "#000000",
            "stroke-width": "1.5",
            fill: "#000000"
          }),
          e("path", {
            d: "M5.23076923,18.6666667 C5.23076923,20.4444444 6.53846154,20.4444444 7.41025641,22.2222222 C8.28205128,23.5555556 8.28205128,23.1111111 7.84615385,25.3333333 C6.53846154,26.2222222 6.53846154,27.5555556 6.53846154,27.5555556 C5.23076923,28.8888889 6.97435897,29.7777778 6.97435897,29.7777778 C12.6410256,30.6666667 21.3589744,30.6666667 27.025641,29.7777778 C27.025641,29.7777778 28.3333333,28.8888889 27.025641,27.5555556 C27.025641,27.5555556 27.4615385,26.2222222 26.1538462,25.3333333 C25.7179487,23.1111111 25.7179487,23.5555556 26.5897436,22.2222222 C27.4615385,20.4444444 28.7692308,20.4444444 28.7692308,18.6666667 C21.3589744,17.3333333 12.6410256,17.3333333 5.23076923,18.6666667 Z",
            id: "Shape",
            stroke: "#000000",
            "stroke-width": "1.5",
            fill: "#000000"
          }),
          e("path", {
            d: "M6.97435897,29.7777778 C13.4672777,32.080866 20.5327223,32.080866 27.025641,29.7777778",
            id: "Shape",
            stroke: "#000000",
            "stroke-width": "1.5"
          }),
          e("path", {
            d: "M6.97435897,21.3333333 C13.4672777,19.0302452 20.5327223,19.0302452 27.025641,21.3333333",
            id: "Shape",
            stroke: "#FFFFFF",
            "stroke-width": "1.5"
          }),
          e("line", {
            x1: "8.28205128",
            y1: "23.5555556",
            x2: "25.7179487",
            y2: "23.5555556",
            id: "Shape",
            stroke: "#FFFFFF",
            "stroke-width": "1.5"
          }),
          e("path", {
            d: "M7.41025641,26.2222222 C13.6372326,28.3241535 20.3627674,28.3241535 26.5897436,26.2222222",
            id: "Shape",
            stroke: "#FFFFFF",
            "stroke-width": "1.5"
          }),
          e("path", {
            d: "M6.53846154,28.8888889 C13.2948481,31.4031829 20.7051519,31.4031829 27.4615385,28.8888889",
            id: "Shape",
            stroke: "#FFFFFF",
            "stroke-width": "1.5"
          })
        ], -1),
        e("g", {
          id: "default-bb",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          transform: "translate(6.000000, 5.000000)",
          "stroke-width": "1.5"
        }, [
          e("g", {
            id: "Group",
            fill: "#000000",
            stroke: "#000000"
          }, [
            e("path", {
              d: "M2.54545455,27.3529412 C5.42181818,26.4970588 11.1236364,27.7323529 14,25.5882353 C16.8763636,27.7323529 22.5781818,26.4970588 25.4545455,27.3529412 C25.4545455,27.3529412 26.8545455,27.8294118 28,29.1176471 C27.4230303,29.9735294 26.6,29.9911765 25.4545455,29.5588235 C22.5781818,28.7029412 16.8763636,29.9647059 14,28.6764706 C11.1236364,29.9647059 5.42181818,28.7029412 2.54545455,29.5588235 C1.39660606,29.9911765 0.574424242,29.9735294 0,29.1176471 C1.14884848,27.4058824 2.54545455,27.3529412 2.54545455,27.3529412 Z",
              id: "Shape"
            }),
            e("path", {
              d: "M7.63636364,23.8235294 C9.75757576,26.0294118 18.2424242,26.0294118 20.3636364,23.8235294 C20.7878788,22.5 20.3636364,22.0588235 20.3636364,22.0588235 C20.3636364,19.8529412 18.2424242,18.5294118 18.2424242,18.5294118 C22.9090909,17.2058824 23.3333333,8.38235294 14,4.85294118 C4.66666667,8.38235294 5.09090909,17.2058824 9.75757576,18.5294118 C9.75757576,18.5294118 7.63636364,19.8529412 7.63636364,22.0588235 C7.63636364,22.0588235 7.21212121,22.5 7.63636364,23.8235294 Z",
              id: "Shape"
            }),
            e("path", {
              d: "M16.1212121,2.64705882 C16.1212121,3.86533401 15.1715131,4.85294118 14,4.85294118 C12.8284869,4.85294118 11.8787879,3.86533401 11.8787879,2.64705882 C11.8787879,1.42878364 12.8284869,0.441176471 14,0.441176471 C15.1715131,0.441176471 16.1212121,1.42878364 16.1212121,2.64705882 Z",
              id: "Shape"
            })
          ]),
          e("path", {
            d: "M9.75757576,18.5294118 L18.2424242,18.5294118 M7.63636364,22.0588235 L20.3636364,22.0588235 M14,9.26470588 L14,13.6764706 M11.8787879,11.4705882 L16.1212121,11.4705882",
            id: "Shape",
            stroke: "#FFFFFF"
          })
        ], -1),
        e("g", {
          id: "default-bn",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          transform: "translate(6.000000, 6.000000)"
        }, [
          e("path", {
            d: "M13.5757576,2.63636364 C22.4848485,3.51515152 27.5757576,9.66666667 27.1515152,28.1212121 L7.63636364,28.1212121 C7.63636364,20.2121212 16.1212121,22.4090909 14.4242424,9.66666667",
            id: "Shape",
            stroke: "#000000",
            "stroke-width": "1.5",
            fill: "#000000"
          }),
          e("path", {
            d: "M15.2727273,9.66666667 C15.5951515,12.2239394 10.5636364,16.1433333 8.48484848,17.5757576 C5.93939394,19.3333333 6.09212121,21.389697 4.24242424,21.0909091 C3.35830303,20.2648485 5.43878788,18.4193939 4.24242424,18.4545455 C3.39393939,18.4545455 4.40363636,19.5354545 3.39393939,20.2121212 C2.54545455,20.2121212 -0.00254545455,21.0909091 -1.90580876e-06,16.6969697 C-1.90580876e-06,14.9393939 5.09090909,6.15151515 5.09090909,6.15151515 C5.09090909,6.15151515 6.69454545,4.48181818 6.78787879,3.07575758 C6.16848485,2.20224242 6.36363636,1.31818182 6.36363636,0.439393939 C7.21212121,-0.439393939 8.90909091,2.63636364 8.90909091,2.63636364 L10.6060606,2.63636364 C10.6060606,2.63636364 11.2678788,0.885818182 12.7272727,0 C13.5757576,0 13.5757576,2.63636364 13.5757576,2.63636364",
            id: "Shape",
            stroke: "#000000",
            "stroke-width": "1.5",
            fill: "#000000"
          }),
          e("path", {
            d: "M2.96969697,16.2575758 C2.96969697,16.5002463 2.77975717,16.6969697 2.54545455,16.6969697 C2.31115192,16.6969697 2.12121212,16.5002463 2.12121212,16.2575758 C2.12121212,16.0149052 2.31115192,15.8181818 2.54545455,15.8181818 C2.77975717,15.8181818 2.96969697,16.0149052 2.96969697,16.2575758 Z",
            id: "Shape",
            stroke: "#FFFFFF",
            "stroke-width": "1.5",
            fill: "#FFFFFF"
          }),
          e("path", {
            d: "M7.6363543,7.46969697 C7.6363543,8.19769267 7.44641868,8.78784979 7.21212121,8.78784979 C6.97782375,8.78784979 6.78788812,8.19769267 6.78788812,7.46969697 C6.78788812,6.74170127 6.97782375,6.15154415 7.21212121,6.15154415 C7.44641868,6.15154415 7.6363543,6.74170127 7.6363543,7.46969697 L7.6363543,7.46969697 Z",
            id: "Shape",
            stroke: "#FFFFFF",
            "stroke-width": "1.499967",
            fill: "#FFFFFF",
            transform: "translate(7.212121, 7.469697) rotate(30.000728) translate(-7.212121, -7.469697) "
          }),
          e("path", {
            d: "M15.7393939,2.98787879 L15.3575758,4.26212121 L15.7818182,4.39393939 C18.4545455,5.27272727 20.5757576,6.58212121 22.4848485,10.3257576 C24.3939394,14.0693939 25.2424242,19.3860606 24.8181818,28.1212121 L24.7757576,28.5606061 L26.6848485,28.5606061 L26.7272727,28.1212121 C27.1515152,19.2806061 25.9806061,13.3136364 23.969697,9.36787879 C21.9587879,5.42212121 19.0569697,3.53272727 16.1721212,3.07575758 L15.7393939,2.98787879 Z",
            id: "Shape",
            fill: "#FFFFFF"
          })
        ], -1),
        e("g", {
          id: "default-br",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          transform: "translate(9.000000, 8.000000)"
        }, [
          e("polygon", {
            id: "Shape",
            stroke: "#000000",
            "stroke-width": "1.5",
            fill: "#000000",
            points: "0 26 22 26 22 23.4 0 23.4"
          }),
          e("polygon", {
            id: "Shape",
            stroke: "#000000",
            "stroke-width": "1.5",
            fill: "#000000",
            points: "2.85185185 19.9333333 4.07407407 17.7666667 17.9259259 17.7666667 19.1481481 19.9333333"
          }),
          e("polygon", {
            id: "Shape",
            stroke: "#000000",
            "stroke-width": "1.5",
            fill: "#000000",
            points: "2.44444444 23.4 2.44444444 19.9333333 19.5555556 19.9333333 19.5555556 23.4"
          }),
          e("polygon", {
            id: "Shape",
            stroke: "#000000",
            "stroke-width": "1.5",
            fill: "#000000",
            points: "4.07407407 17.7666667 4.07407407 6.5 17.9259259 6.5 17.9259259 17.7666667"
          }),
          e("polygon", {
            id: "Shape",
            stroke: "#000000",
            "stroke-width": "1.5",
            fill: "#000000",
            points: "4.07407407 6.5 1.62962963 4.33333333 20.3703704 4.33333333 17.9259259 6.5"
          }),
          e("polygon", {
            id: "Shape",
            stroke: "#000000",
            "stroke-width": "1.5",
            fill: "#000000",
            points: "1.62962963 4.33333333 1.62962963 0 4.88888889 0 4.88888889 1.73333333 8.96296296 1.73333333 8.96296296 0 13.037037 0 13.037037 1.73333333 17.1111111 1.73333333 17.1111111 0 20.3703704 0 20.3703704 4.33333333"
          }),
          e("polyline", {
            id: "Shape",
            stroke: "#FFFFFF",
            points: "2.44444444 22.9666667 19.5555556 22.9666667 19.5555556 22.9666667"
          }),
          e("line", {
            x1: "3.25925926",
            y1: "19.5",
            x2: "18.7407407",
            y2: "19.5",
            id: "Shape",
            stroke: "#FFFFFF"
          }),
          e("line", {
            x1: "4.07407407",
            y1: "17.7666667",
            x2: "17.9259259",
            y2: "17.7666667",
            id: "Shape",
            stroke: "#FFFFFF"
          }),
          e("line", {
            x1: "4.07407407",
            y1: "6.5",
            x2: "17.9259259",
            y2: "6.5",
            id: "Shape",
            stroke: "#FFFFFF"
          }),
          e("line", {
            x1: "1.62962963",
            y1: "4.33333333",
            x2: "20.3703704",
            y2: "4.33333333",
            id: "Shape",
            stroke: "#FFFFFF"
          })
        ], -1),
        e("g", {
          id: "default-bp",
          transform: "translate(10.000000, 8.000000)",
          fill: "#000000",
          stroke: "#000000",
          "stroke-linecap": "round",
          "stroke-width": "1.5"
        }, [
          e("path", {
            d: "M10,0 C8.15833333,0 6.66666667,1.50129032 6.66666667,3.35483871 C6.66666667,4.10129032 6.90833333,4.78903226 7.31666667,5.35096774 C5.69166667,6.29032258 4.58333333,8.04322581 4.58333333,10.0645161 C4.58333333,11.7670968 5.36666667,13.2851613 6.59166667,14.2832258 C4.09166667,15.1722581 0.416666667,18.9380645 0.416666667,25.5806452 L19.5833333,25.5806452 C19.5833333,18.9380645 15.9083333,15.1722581 13.4083333,14.2832258 C14.6333333,13.2851613 15.4166667,11.7670968 15.4166667,10.0645161 C15.4166667,8.04322581 14.3083333,6.29032258 12.6833333,5.35096774 C13.0916667,4.78903226 13.3333333,4.10129032 13.3333333,3.35483871 C13.3333333,1.50129032 11.8416667,0 10,0 Z",
            id: "Shape"
          })
        ], -1)
      ])))
    ]));
  }
}), _2 = /* @__PURE__ */ Z({
  __name: "ChessboardPiece",
  props: {
    piece: {},
    pieceSet: { default: "default" },
    draggable: { type: Boolean }
  },
  setup(o) {
    const r = o, n = P(
      () => (r.piece.toUpperCase() === r.piece ? "w" : "b") + r.piece.toLowerCase()
    ), t = () => y1(
      "div",
      {
        class: "pieces " + r.pieceSet,
        draggable: r.draggable,
        onDragstart: (l) => {
          var s;
          if (r.draggable)
            return (s = l.dataTransfer) == null || s.setData("text/plain", "piece " + n.value), !0;
        }
      },
      y1("piece", {
        class: n.value,
        style: "display: block; width: 100%; height: 100%; background-size:cover",
        dragable: r.draggable
      })
    );
    return (l, s) => (b(), V(t));
  }
}), k1 = /* @__PURE__ */ Z({
  __name: "ChessboardSquare",
  props: {
    square: {},
    above: { type: Boolean }
  },
  setup(o) {
    const r = o, { orientation: n } = p1(), t = P(() => {
      const { x: l, y: s } = O(d1(r.square), n.value);
      return `transform: translate3d(${l * 100}%, ${s * 100}%, 0);`;
    });
    return (l, s) => (b(), B("div", {
      class: n1(["cw-chessboard-square", { above: l.above }]),
      style: t1(t.value)
    }, [
      l1(l.$slots, "default")
    ], 6));
  }
}), m2 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 1024 1024",
  version: "1.1",
  class: "marker-arrow"
}, k2 = ["id"], w2 = ["x1", "y1", "x2", "y2", "marker-end", "stroke-width"], L2 = /* @__PURE__ */ Z({
  __name: "ChessboardArrow",
  props: {
    square: {},
    toSquare: {},
    size: { default: 7 }
  },
  setup(o) {
    const r = o, n = N1(), { orientation: t } = p1(), l = P(
      () => b1(g1(O(d1(r.square), t.value)))
    ), s = P(
      () => b1(g1(O(d1(r.toSquare), t.value)))
    );
    return (i, k) => (b(), B("svg", m2, [
      e("defs", null, [
        e("marker", {
          id: F1(n),
          class: "arrow-head",
          refX: "19",
          refY: "20",
          markerHeight: "5",
          markerWidth: "5",
          viewBox: "0 0 40 40",
          orient: "auto"
        }, k[0] || (k[0] = [
          e("g", {
            id: "strict-marker-arrow",
            transform: "matrix(5.1931792,0,0,5.1931792,3.5980168,-0.83225447)"
          }, [
            e("path", {
              d: "M 0.535156,0.398438 C 0.398438,0.507812 0.316406,0.671875 0.3125,0.847656 0.316406,1.02344 0.398438,1.1875 0.535156,1.29688 L 3.01172,3.35938 3.72266,4.01563 3.01172,4.64453 0.535156,6.67969 C 0.394531,6.79297 0.3125,6.96094 0.3125,7.13672 c 0,0.17578 0.082031,0.34375 0.222656,0.45703 0.328125,0.25781 0.792974,0.25781 1.117184,0 L 5.45703,4.46094 C 5.59766,4.34766 5.68359,4.17969 5.69141,4 5.69141,3.82031 5.60547,3.65234 5.45703,3.54297 L 1.64453,0.394531 C 1.31641,0.148438 0.859375,0.148438 0.535156,0.398438 Z m 0,0",
              stroke: "none",
              "stroke-width": "0",
              fill: "currentColor"
            })
          ], -1)
        ]), 8, k2)
      ]),
      e("line", {
        class: "arrow-line",
        x1: l.value.x,
        y1: l.value.y,
        x2: s.value.x,
        y2: s.value.y,
        "marker-end": `url(#${F1(n)})`,
        stroke: "currentColor",
        "stroke-width": i.size * 1.5,
        "stroke-linecap": "round"
      }, null, 8, w2)
    ]));
  }
}), z2 = /* @__PURE__ */ Z({
  __name: "ChessboardFrame",
  props: {
    square: {},
    above: { type: Boolean }
  },
  setup(o) {
    const r = o;
    return (n, t) => (b(), V(k1, j1(W1(r)), {
      default: s1(() => t[0] || (t[0] = [
        e("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 40 40",
          version: "1.1"
        }, [
          e("g", {
            id: "strict-marker-frame",
            transform: "translate(2, 2)",
            fill: "#000000",
            "fill-opacity": "0",
            "stroke-width": "2",
            stroke: "currentColor"
          }, [
            e("path", { d: "M2.66453526e-15,10.5882353 L2.66453526e-15,2.11764706 C2.66453526e-15,1.41176471 0.176470588,0.882352941 0.529411765,0.529411765 C0.882352941,0.176470588 1.41176471,-2.84217094e-14 2.11764706,-2.84217094e-14 L10.5882353,-2.84217094e-14" }),
            e("path", {
              d: "M25.4117647,36 L25.4117647,27.5294118 C25.4117647,26.8235294 25.5882353,26.2941176 25.9411765,25.9411765 C26.2941176,25.5882353 26.8235294,25.4117647 27.5294118,25.4117647 L36,25.4117647",
              transform: "translate(30.705882, 30.705882) rotate(-180.000000) translate(-30.705882, -30.705882) "
            }),
            e("path", {
              d: "M0,36 L0,27.5294118 C0,26.8235294 0.176470588,26.2941176 0.529411765,25.9411765 C0.882352941,25.5882353 1.41176471,25.4117647 2.11764706,25.4117647 L10.5882353,25.4117647",
              transform: "translate(5.294118, 30.705882) rotate(-90.000000) translate(-5.294118, -30.705882) "
            }),
            e("path", {
              d: "M25.4117647,10.5882353 L25.4117647,2.11764706 C25.4117647,1.41176471 25.5882353,0.882352941 25.9411765,0.529411765 C26.2941176,0.176470588 26.8235294,0 27.5294118,0 L36,0",
              transform: "translate(30.705882, 5.294118) rotate(-270.000000) translate(-30.705882, -5.294118) "
            })
          ])
        ], -1)
      ])),
      _: 1
    }, 16));
  }
}), $2 = /* @__PURE__ */ Z({
  __name: "ChessboardDot",
  props: {
    square: {},
    above: { type: Boolean }
  },
  setup(o) {
    const r = o;
    return (n, t) => (b(), V(k1, _1(r, { class: "cw-chessboard-marker" }), {
      default: s1(() => t[0] || (t[0] = [
        e("div", { class: "cw-chessboard-dot" }, null, -1)
      ])),
      _: 1
    }, 16));
  }
}), E2 = /* @__PURE__ */ Z({
  __name: "ChessboardCircle",
  props: {
    square: {},
    above: { type: Boolean }
  },
  setup(o) {
    const r = o;
    return (n, t) => (b(), V(k1, _1(r, { class: "cw-chessboard-marker" }), {
      default: s1(() => t[0] || (t[0] = [
        e("div", { class: "cw-chessboard-circle" }, null, -1)
      ])),
      _: 1
    }, 16));
  }
});
export {
  g2 as Chessboard,
  L2 as ChessboardArrow,
  E2 as ChessboardCircle,
  M2 as ChessboardControl,
  $2 as ChessboardDot,
  z2 as ChessboardFrame,
  _2 as ChessboardPiece,
  P2 as ChessboardPieces,
  k1 as ChessboardSquare,
  b2 as ChessboardSurface,
  x2 as PromotionDialog,
  p1 as useContext
};
