var ze = Object.defineProperty;
var Ee = (t, o, r) => o in t ? ze(t, o, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[o] = r;
var me = (t, o, r) => (Ee(t, typeof o != "symbol" ? o + "" : o, r), r);
import { defineComponent as Y, computed as k, openBlock as x, createElementBlock as A, normalizeStyle as ne, createElementVNode as S, normalizeClass as M, Fragment as le, renderList as de, toDisplayString as Se, createCommentVNode as pe, ref as J, onMounted as ve, toValue as V, onUnmounted as Le, provide as $e, inject as Te, toRef as ye, watch as Ae, renderSlot as ue, createVNode as Be, createBlock as Z, Transition as De, withCtx as ae, unref as W, withModifiers as Ie, onBeforeUnmount as ke, h as ge } from "vue";
var oe = /* @__PURE__ */ ((t) => (t.NONE = "none", t.FRAME = "marker-frame", t.CIRCLE = "marker-circle", t.DOT = "marker-dot", t.SQUARE = "marker-square", t.ARROW = "arrow", t.TEXT = "marker-text", t))(oe || {});
const Re = /* @__PURE__ */ Y({
  __name: "ChessboardCoords",
  props: {
    orientation: {},
    coordMode: {},
    borderScale: {},
    coordOutside: { type: Boolean }
  },
  setup(t) {
    const o = t, r = k(() => o.coordMode !== "none"), e = k(() => o.coordMode === "right");
    return (l, s) => r.value ? (x(), A("div", {
      key: 0,
      class: "chessboard-coords",
      style: ne({
        margin: l.borderScale
      })
    }, [
      S("div", {
        class: M(["coords numbers", {
          outside: l.coordOutside,
          "coords-right": e.value
        }])
      }, [
        (x(), A(le, null, de(8, (a) => S("span", {
          class: M(["coord", a % 2 !== (e.value ? 1 : 0) ? "white" : "black"])
        }, [
          S("span", null, Se(l.orientation === "w" ? 9 - a : a), 1)
        ], 2)), 64))
      ], 2),
      S("div", {
        class: M(["coords letters", {
          outside: l.coordOutside,
          "coords-right": e.value
        }])
      }, [
        (x(), A(le, null, de(8, (a) => S("span", {
          class: M(["coord", a % 2 === 0 ? "white" : "black"])
        }, [
          S("span", null, Se(String.fromCharCode(l.orientation === "w" ? a + 96 : 105 - a)), 1)
        ], 2)), 64))
      ], 2)
    ], 4)) : pe("", !0);
  }
});
function Oe(t, o) {
  const r = J(0);
  let e;
  function l() {
    const a = V(o);
    a && (e && clearTimeout(e), e = setTimeout(() => {
      const m = V(t);
      if (!m)
        return console.warn("cw-chessboard: no element provided for rescale");
      const { height: n, width: u } = m.getBoundingClientRect();
      if (a === "width") {
        r.value = u;
        return;
      } else if (a === "height") {
        r.value = n;
        return;
      }
      r.value = u < n ? u : n, u === 0 ? r.value = n : n === 0 && (r.value = u);
    }, 10));
  }
  let s;
  return ve(() => {
    if (window.ResizeObserver) {
      const a = new ResizeObserver(l);
      a.observe(V(t)), s = () => a.disconnect();
    } else
      window.addEventListener("resize", l), s = () => window.removeEventListener("resize", l);
    l();
  }), Le(() => s == null ? void 0 : s()), {
    size: r,
    Rescale: l
  };
}
const Ne = (t) => {
  const o = [], r = t.split(" ")[0].split("/");
  if (r.length !== 8)
    throw new Error("Invalid fen string");
  for (let e = 0; e < 8; e++) {
    let l = 0;
    for (let s = 0; s < r[e].length; s++) {
      const a = r[e][s];
      l = parseInt(a), Number.isNaN(l) ? o.push(a) : o.push(...Array(l).fill(null));
    }
  }
  return o;
}, X = (t) => ({
  x: t % 8,
  y: Math.floor(t / 8)
}), be = ({ x: t, y: o }) => 8 * o + t, R = ({ x: t, y: o }, r) => r === "b" ? { x: 7 - t, y: 7 - o } : { x: t, y: o }, _e = ({ x: t, y: o }, { height: r, width: e }) => ({
  x: Math.floor(t / (e / 8)),
  y: Math.floor(o / (r / 8))
}), te = (t, o, r) => R(_e(t, r), o), z = ({ x: t, y: o }) => String.fromCharCode(t + 97) + (8 - o).toString(), fe = (t) => ({
  x: t.charCodeAt(0) - 97,
  y: 8 - parseInt(t[1])
}), we = ({ x: t, y: o }, r) => t === r.x && o === r.y, se = ({ x: t, y: o }) => t > -1 && t < 8 && o > -1 && o < 8, Ce = ({ x: t, y: o }) => ({ x: t * 128, y: o * 128 }), xe = ({ x: t, y: o }) => ({
  x: t + 64,
  y: o + 64
});
class Fe {
  constructor() {
    me(this, "isRunning");
    me(this, "tasks");
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
  addTask(o) {
    return new Promise((r, e) => {
      this.tasks.push(() => o().then(r).catch(e)), this.run();
    });
  }
  /**
   * run tasks in queue
   */
  async run() {
    if (!this.isRunning) {
      for (this.isRunning = !0; this.tasks.length; )
        await this.tasks.shift()();
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
function He(t, o) {
  const r = t % 8, e = Math.floor(t / 8), l = o % 8, s = Math.floor(o / 8);
  return Math.max(Math.abs(s - e), Math.abs(l - r));
}
const Ue = (t, o) => {
  const r = [], e = [];
  for (let s = 0; s < 64; s++) {
    const a = t[s], m = o[s];
    m !== a && (m && r.push({ piece: m, index: s }), a && e.push({ piece: a, index: s }));
  }
  const l = [];
  return r.forEach((s) => {
    let a = 8, m = null;
    if (e.forEach((n) => {
      if (s.piece !== n.piece)
        return;
      const u = He(s.index, n.index);
      u < a && (m = n, a = u);
    }), m == null) {
      l.push({
        type: 0,
        piece: s.piece,
        atIndex: s.index
      });
      return;
    }
    e.splice(e.indexOf(m), 1), l.push({
      type: 2,
      piece: s.piece,
      atIndex: m.index,
      toIndex: s.index
    });
  }), l.push(
    ...e.map(({ piece: s, index: a }) => ({
      type: 1,
      piece: s,
      atIndex: a
    }))
  ), l;
};
function Xe({ onOrientationChange: t, onChange: o, onRenderPiece: r }) {
  let e = null, l = "", s = 200, a = "w", m = !1, n = [], u = "all";
  const _ = (d) => {
    const y = n[d];
    if (!y)
      return null;
    const h = y.toLowerCase();
    return { name: h, color: h === y ? "b" : "w" };
  }, E = (d) => _(be(d));
  function B(d, y, h) {
    const p = document.createElement("piece"), b = R(d, h), v = y.toLowerCase(), C = v === y ? "b" : "w", $ = C + v, I = z(d);
    p.setAttribute("data-square", I), p.setAttribute("data-piece", $), p.setAttribute("data-color", C), p.classList.add("piece", $), p.style.transform = `translate3d(${b.x * 100}%,${b.y * 100}%,0px)`, p.style.zIndex = "5", p.style.opacity = "1", p.style.display = u === "all" || u === C ? "block" : "none";
    const H = r == null ? void 0 : r(I, y, C);
    return H && p.classList.add(H), p;
  }
  function w(d, y) {
    const h = y.toLowerCase(), p = z(d), b = (h === y ? "b" : "w") + h;
    return e == null ? void 0 : e.querySelector(
      `[data-piece="${b}"][data-square="${p}"]`
    );
  }
  function T(d, y, h) {
    const p = w(d, y);
    p ? p.style.opacity = h ? m ? "0.5" : "0" : "1" : console.warn(
      "Invalid value for square piece: ",
      z(d),
      y,
      h ? "on" : "off"
    );
  }
  let O = !1;
  function L(d, y, h = !1) {
    if (!e)
      return console.warn("container is null");
    if (!(O && !h)) {
      e.innerHTML = "";
      for (let p = 0; p < d.length; p++) {
        const b = d[p];
        b && e.appendChild(B(X(p), b, y));
      }
      n = d, O = !0;
    }
  }
  function K(d, y, h) {
    const p = Ue(d, y), b = [];
    return p.forEach((v) => {
      const C = X(v.atIndex);
      switch (v.type) {
        case 2: {
          const ee = w(C, v.piece);
          if (!ee)
            return;
          e.appendChild(ee);
          const re = R(X(v.atIndex), h), U = R(X(v.toIndex), h);
          b.push({
            type: v.type,
            element: ee,
            atPoint: { x: re.x * 100, y: re.y * 100 },
            toPoint: { x: U.x * 100, y: U.y * 100 }
          });
          break;
        }
        case 0:
          const $ = B(C, v.piece, h);
          $.style.opacity = "0", $.style.display = "block", e.appendChild($);
          const I = R(X(v.atIndex), h);
          b.push({
            type: v.type,
            element: $,
            atPoint: { x: I.x * 100, y: I.y * 100 }
          });
          break;
        case 1:
          const H = w(C, v.piece);
          if (!H)
            return;
          b.push({
            type: v.type,
            element: H
          });
          break;
      }
    }), o && o(
      p.map(
        ({ piece: v, type: C, atIndex: $, toIndex: I }) => C === 2 ? {
          piece: v,
          from: z(X($)),
          to: z(X(I))
        } : { piece: v, from: z(X($)) }
      )
    ), b;
  }
  const g = new Fe();
  function i(d, y, h, p) {
    return new Promise((b) => {
      var H;
      if (((H = document.hasFocus) == null ? void 0 : H.call(document)) === !1 || !e)
        return b();
      const v = K(d, y, p);
      let C = null, $;
      function I(ee) {
        if (!g.IsRunning || document.hidden)
          return b();
        O = !1, $ || ($ = ee);
        const re = ee - $;
        if (re > h) {
          C && (cancelAnimationFrame(C), C = null);
          for (const q of v)
            q.element.style.zIndex = "5", q.type === 1 && q.element.parentNode && e.removeChild(q.element);
          b();
          return;
        }
        C = requestAnimationFrame(I);
        const U = Math.min(1, re / h);
        let Q = U < 0.5 ? 2 * U * U : -1 + (4 - 2 * U) * U;
        (isNaN(Q) || Q > 0.99) && (Q = 1), v.forEach((q) => {
          switch (q.element.style.zIndex = "15", q.type) {
            case 2: {
              const qe = q.atPoint.x + (q.toPoint.x - q.atPoint.x) * Q, Me = q.atPoint.y + (q.toPoint.y - q.atPoint.y) * Q;
              q.element.style.transform = `translate3d(${qe}%,${Me}%,0px)`;
              break;
            }
            case 0:
              q.element.style.opacity = (Math.round(Q * 100) / 100).toString();
              break;
            case 1:
              q.element.style.opacity = (Math.round((1 - Q) * 100) / 100).toString();
              break;
          }
        });
      }
      C = requestAnimationFrame(I);
    });
  }
  function c() {
    g.clear();
  }
  function f(d) {
    e = d;
  }
  async function P(d, y, h = !1) {
    const p = new Array(...n), b = be(d);
    if (!p[b])
      return console.warn("no piece on", z(d));
    const v = be(y);
    p[v] = p[b], p[b] = null;
    let C = h ? s : 0;
    return g.Size > 0 && (C = C / (1 + Math.pow(g.Size / 5, 2))), g.addTask(() => i(new Array(...n), p, C, a)).then(() => L(p, a, !0));
  }
  async function D(d, y = !1) {
    if (d === l)
      return;
    l = d;
    const h = Ne(l);
    let p = y ? s : 0;
    return g.Size > 0 && (p = p / (1 + Math.pow(g.Size / 5, 2))), g.addTask(
      () => i([...n], h, p, a).then(
        () => L(h, a, !0)
      )
    );
  }
  async function j(d, y = !1) {
    if (d === a)
      return;
    a = d;
    let h = y ? s : 0;
    g.Size > 0 && (h = h / (1 + Math.pow(g.Size / 5, 2)));
    const p = g.addTask(() => i(new Array(...n), [], h, a)), b = g.addTask(
      () => i([], new Array(...n), h, a).then(
        () => L(n, a, !0)
      )
    );
    return Promise.all([p.then(() => t == null ? void 0 : t(a)), b]);
  }
  function N(d) {
    s = d;
  }
  function F(d) {
    m = d;
  }
  async function G(d, y = !1) {
    if (u === d)
      return;
    let h = y ? s : 0;
    g.Size > 0 && (h = h / (1 + Math.pow(g.Size / 5, 2)));
    let p = u === "none" ? new Array(64).fill(null) : [...n], b;
    return d === "all" ? (p = new Array(64).fill(null), b = [...n]) : d === "none" ? b = new Array(64).fill(null) : d === "w" ? b = n.map((v) => (v == null ? void 0 : v.toUpperCase()) === v ? v : null) : d === "b" && (b = n.map((v) => (v == null ? void 0 : v.toLowerCase()) === v ? v : null)), u = d, g.addTask(
      () => i(p, b, h, a).then(
        () => L(n, a, !0)
      )
    );
  }
  return {
    getPieceByIndex: _,
    getPieceByPoint: E,
    movePiece: P,
    setAlphaPiece: T,
    setFen: D,
    setDuration: N,
    setOrientation: j,
    setIsAlphaPiece: F,
    setContainer: f,
    setVisibility: G,
    terminate: c
  };
}
function Ve(t) {
  return [(e) => $e(t, e), () => {
    const e = Te(t);
    if (e === void 0)
      throw new Error(`Provider "${t}" not found.`);
    return e;
  }];
}
const [We, he] = Ve("chessboard-context"), it = /* @__PURE__ */ Y({
  __name: "Chessboard",
  props: {
    fen: {},
    orientation: { default: "w" },
    duration: { default: 300 },
    borderSize: { default: 12 },
    roundSize: { default: 0 },
    fontSize: { default: 24 },
    coordOutside: { type: Boolean },
    coordMode: { default: "left" },
    alphaPiece: { type: Boolean },
    boardSet: { default: "default" },
    pieceSet: { default: "default" },
    pieceWhiteSet: {},
    pieceBlackSet: {},
    resize: { type: [Boolean, String], default: !0 },
    visibility: { default: "all" },
    onRenderPiece: {}
  },
  emits: ["ready", "moves"],
  setup(t, { expose: o, emit: r }) {
    const e = t, l = r, s = J(), a = () => s.value, m = J(), { size: n, Rescale: u } = Oe(
      k(() => s.value.parentElement),
      ye(e, "resize")
    ), _ = k(() => n.value / 900), E = k(() => e.fontSize * _.value), B = k(() => E.value / 1.5 < e.borderSize), w = k(() => !e.coordOutside || B.value ? `${(e.borderSize * _.value).toFixed(2)}px` : `${((B.value ? e.borderSize : e.fontSize / 1.5) * _.value).toFixed(2)}px`), T = k(() => `${e.roundSize * _.value}px`), O = k(() => ({
      borderRadius: T.value,
      borderWidth: w.value,
      ...B.value ? {} : {
        borderColor: "transparent",
        backgroundColor: "transparent"
      }
    })), L = k(() => `${n.value}px`), K = k(() => `${E.value.toFixed(3)}px`), g = J(e.orientation), i = J(null), c = Xe({
      onChange(f) {
        l("moves", f);
      },
      onOrientationChange(f) {
        g.value = f;
      },
      onRenderPiece: e.onRenderPiece
    });
    return Ae(
      e,
      async ({ fen: f, orientation: P, alphaPiece: D, duration: j, visibility: N }) => {
        f && c.setFen(f, !0), c.setOrientation(P, !0), c.setVisibility(N, !0), c.setIsAlphaPiece(D), c.setDuration(j);
      },
      { deep: !0 }
    ), We({
      container: s,
      chessboard: m,
      orientation: g,
      pieces: c,
      boardSet: ye(e, "boardSet"),
      pieceSet: ye(e, "pieceSet")
    }), ve(() => {
      c.setContainer(i.value), c.setDuration(e.duration), e.fen && c.setFen(e.fen), c.setOrientation(e.orientation), c.setVisibility(e.visibility), c.setIsAlphaPiece(e.alphaPiece), l("ready", c);
    }), o({ getElement: a, boardSize: n, Rescale: u, pieces: c }), (f, P) => (x(), A("div", {
      ref_key: "container",
      ref: s,
      class: M(["cw-chessboard chessboard-theme", f.boardSet]),
      style: ne({
        width: L.value,
        height: L.value,
        fontSize: K.value
      })
    }, [
      ue(f.$slots, "before"),
      S("div", {
        class: "cw-wrapper",
        style: ne(O.value)
      }, [
        S("div", {
          ref_key: "chessboard",
          ref: m,
          class: M(["cw-container", { outside: f.coordOutside, contour: f.borderSize > 0 }]),
          style: ne({ borderRadius: T.value })
        }, [
          ue(f.$slots, "default"),
          S("div", {
            ref_key: "piecesContainer",
            ref: i,
            class: M(["pieces", f.pieceSet])
          }, null, 2)
        ], 6)
      ], 4),
      Be(Re, {
        borderScale: w.value,
        coordMode: f.coordMode,
        orientation: f.orientation,
        coordOutside: f.coordOutside
      }, null, 8, ["borderScale", "coordMode", "orientation", "coordOutside"]),
      ue(f.$slots, "after")
    ], 6));
  }
}), Ye = {
  key: 0,
  class: "promotion-dialog"
}, je = ["onPointerdown", "innerHTML"], lt = /* @__PURE__ */ Y({
  __name: "PromotionDialog",
  props: {
    color: {}
  },
  setup(t, { expose: o }) {
    const r = t, { orientation: e, pieceSet: l } = he(), s = k(() => r.color || e.value), a = J();
    let m, n;
    return o({ require: (E) => new Promise((B, w) => {
      if (a.value)
        return n();
      a.value = R(fe(E), e.value), m = (T) => {
        a.value = null, B(T);
      }, n = w;
    }), abort: () => {
      a.value = null, n();
    } }), (E, B) => (x(), Z(De, { name: "promotion-dialog" }, {
      default: ae(() => [
        a.value ? (x(), A("div", Ye, [
          (x(), A(le, null, de(["q", "r", "b", "n"], (w, T) => S("button", {
            key: T,
            class: M(["promotion-piece", W(l)]),
            style: ne({ transform: `translate(${a.value.x * 100}%, ${T * 100}%)` }),
            onPointerdown: Ie((O) => W(m)(w), ["stop"]),
            innerHTML: `<piece class="${s.value}${w}"></piece>`
          }, null, 46, je)), 64))
        ])) : pe("", !0)
      ]),
      _: 1
    }));
  }
});
function ie(t, { x: o, y: r }) {
  const e = t.getBoundingClientRect();
  return {
    x: o - e.left,
    y: r - e.top,
    width: e.width,
    height: e.height
  };
}
function Ge({ el: t, onStart: o, onMove: r, onEnd: e, onCancel: l }) {
  const s = (u) => {
    if (u.preventDefault(), !u.isPrimary)
      return;
    const _ = ie(V(t), u);
    o(_) && (document.addEventListener("pointermove", a, { capture: !0 }), document.addEventListener("pointerup", m, { capture: !0 }), document.addEventListener("pointercancel", n, { capture: !0 }));
  }, a = (u) => {
    const _ = ie(V(t), u);
    r(_);
  }, m = (u) => {
    document.removeEventListener("pointermove", a, { capture: !0 }), document.removeEventListener("pointerup", m, { capture: !0 }), document.removeEventListener("pointercancel", n, { capture: !0 });
    const _ = ie(V(t), u);
    e(_);
  }, n = (u) => {
    document.removeEventListener("pointermove", a, { capture: !0 }), document.removeEventListener("pointerup", m, { capture: !0 }), document.removeEventListener("pointercancel", n, { capture: !0 }), l();
  };
  return ve(() => {
    const u = V(t);
    if (!u)
      return console.warn("Element not found");
    u.style.touchAction = "none", u.addEventListener("pointerdown", s);
  }), ke(() => {
    const u = V(t);
    if (!u)
      return console.warn("Element not found");
    u.style.touchAction = "auto", u.removeEventListener("pointerdown", s);
  }), {};
}
const Qe = ["innerHTML"], Pe = 32, ct = /* @__PURE__ */ Y({
  __name: "ChessboardControl",
  props: {
    mode: { default: "auto" },
    enableColor: { default: "all" },
    alignPiece: { type: Boolean }
  },
  emits: ["beforeMove", "afterMove", "cancelMove", "enterSquare", "leaveSquare", "dropMove", "dropEnd"],
  setup(t, { emit: o }) {
    const r = t, e = o, { chessboard: l, pieces: s, pieceSet: a, orientation: m } = he();
    let n = null;
    const u = J(null), _ = (i) => r.enableColor === "all" || r.enableColor === i;
    let E = null;
    const B = (i) => {
      E && we(E, i) || (E && e("leaveSquare", z(E)), e("enterSquare", z(i)), E = i);
    };
    let w = !1;
    const T = () => r.mode === "auto" ? !1 : r.mode === "press" && w || r.mode === "move" && !w;
    function O(i, c) {
      s.setAlphaPiece(
        i,
        i.color === "w" ? i.name.toUpperCase() : i.name,
        c
      );
    }
    function L(i, c = !0) {
      c && e("cancelMove", z(i)), O(i, !1), u.value = null, E = null, n = null;
    }
    Ge({
      el: l,
      onStart: (i) => {
        w = !1;
        const c = te(i, m.value, i);
        if (!se(c))
          return !1;
        if (n && we(n, c))
          return L(n), !1;
        const f = s.getPieceByPoint(c);
        return !f || !_(f.color) || e("beforeMove", z(c), (P) => {
          P && (n = {
            x: c.x,
            y: c.y,
            name: f.name,
            color: f.color
          }, B(te(i, m.value, i)));
        }), !0;
      },
      onMove: (i) => {
        if (!n)
          return;
        const c = i.width / 8, f = i.height / 8, P = i.x - c / 2, D = i.y - f / 2, j = w;
        if (!w) {
          const F = n.x * c, G = n.y * f, d = Math.abs(P - F), y = Math.abs(D - G);
          w = d > Pe || y > Pe, j !== w && O(n, w);
        }
        if (w && !T())
          u.value = {
            name: n.name,
            color: n.color,
            x: P,
            y: D
          };
        else {
          const { x: F, y: G } = R(n, m.value), d = F * c, y = G * f;
          u.value = {
            name: n.name,
            color: n.color,
            x: d,
            y
          };
        }
        if (T())
          return;
        if (r.alignPiece && u.value) {
          const F = _e(i, i), G = F.x * c, d = F.y * f;
          u.value.x = G, u.value.y = d;
        }
        const N = te(i, m.value, i);
        se(N) && B(N);
      },
      onEnd: (i) => {
        if (T()) {
          n && L(n);
          return;
        }
        const c = te(i, m.value, i);
        if (!se(c)) {
          console.log("Invalid square", n), n && L(n);
          return;
        }
        if (u.value = null, w && n && we(n, c)) {
          L(n);
          return;
        }
        const f = s.getPieceByPoint(c);
        !n || f && f.color === n.color && !w || e(
          "afterMove",
          z(n),
          z(c),
          async (P) => {
            if (!n)
              return console.warn("Cannot move from square ");
            const D = n;
            L(D, !P), P && await s.movePiece(D, c, !w);
          }
        );
      },
      onCancel: () => {
        n && L(n, !0);
      }
    });
    function K(i) {
      var N;
      const c = i.currentTarget, f = (N = i.dataTransfer) == null ? void 0 : N.getData("text/plain");
      if (!(f != null && f.includes("piece ")))
        return;
      const P = ie(c, i), D = te(P, m.value, P);
      if (!se(D))
        return;
      const j = f.split(" ")[1];
      e("dropEnd", j, z(D));
    }
    function g(i) {
      i.preventDefault();
      const c = i.currentTarget, f = ie(c, i), P = te(f, m.value, f);
      se(P) && e("dropMove", z(P));
    }
    return ve(() => {
      var i, c;
      (i = l.value) == null || i.addEventListener("drop", K), (c = l.value) == null || c.addEventListener("dragover", g);
    }), ke(() => {
      var i, c;
      (i = l.value) == null || i.removeEventListener("drop", K), (c = l.value) == null || c.removeEventListener("dragover", g);
    }), (i, c) => u.value ? (x(), A("div", {
      key: 0,
      class: M(["pieces move-field", W(a)]),
      innerHTML: `<piece class="active ${u.value.color}${u.value.name}" style="transform: translate3d(${u.value.x}px, ${u.value.y}px,0px);z-index: 100"></piece>`
    }, null, 10, Qe)) : pe("", !0);
  }
}), Ze = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 1024 1024",
  version: "1.1",
  class: "marker-arrow"
}, Je = ["id"], Ke = {
  id: "strict-marker-arrow",
  transform: "matrix(5.1931792,0,0,5.1931792,3.5980168,-0.83225447)"
}, et = ["x1", "y1", "x2", "y2", "marker-end", "stroke-width"], tt = /* @__PURE__ */ Y({
  __name: "ChessboardArrow",
  props: {
    square: {},
    toSquare: {},
    color: {},
    size: {}
  },
  setup(t) {
    const o = t, r = k(() => `arrow-${o.color}-${o.size}`), { orientation: e } = he(), l = k(
      () => xe(Ce(R(fe(o.square), e.value)))
    ), s = k(
      () => xe(Ce(R(fe(o.toSquare), e.value)))
    );
    return (a, m) => (x(), A("svg", Ze, [
      S("defs", null, [
        S("marker", {
          id: r.value,
          class: "arrow-head",
          refX: "19",
          refY: "20",
          markerHeight: "5",
          markerWidth: "5",
          viewBox: "0 0 40 40",
          orient: "auto"
        }, [
          S("g", Ke, [
            S("path", {
              d: "M 0.535156,0.398438 C 0.398438,0.507812 0.316406,0.671875 0.3125,0.847656 0.316406,1.02344 0.398438,1.1875 0.535156,1.29688 L 3.01172,3.35938 3.72266,4.01563 3.01172,4.64453 0.535156,6.67969 C 0.394531,6.79297 0.3125,6.96094 0.3125,7.13672 c 0,0.17578 0.082031,0.34375 0.222656,0.45703 0.328125,0.25781 0.792974,0.25781 1.117184,0 L 5.45703,4.46094 C 5.59766,4.34766 5.68359,4.17969 5.69141,4 5.69141,3.82031 5.60547,3.65234 5.45703,3.54297 L 1.64453,0.394531 C 1.31641,0.148438 0.859375,0.148438 0.535156,0.398438 Z m 0,0",
              stroke: "none",
              "stroke-width": "0",
              class: M(a.color)
            }, null, 2)
          ])
        ], 8, Je)
      ]),
      S("line", {
        class: M(["arrow-line", a.color]),
        x1: l.value.x,
        y1: l.value.y,
        x2: s.value.x,
        y2: s.value.y,
        "marker-end": `url(#${r.value})`,
        stroke: "currentColor",
        "stroke-width": a.size * 1.5,
        "stroke-linecap": "round"
      }, null, 10, et)
    ]));
  }
}), ce = /* @__PURE__ */ Y({
  __name: "ChessboardSquare",
  props: {
    square: {},
    above: { type: Boolean }
  },
  setup(t) {
    const o = t, { orientation: r } = he(), e = k(() => {
      const { x: l, y: s } = R(fe(o.square), r.value);
      return `transform: translate(${l * 100}%, ${s * 100}%);`;
    });
    return (l, s) => (x(), A("div", {
      class: M(["cw-chessboard-square", { above: l.above }]),
      style: ne(e.value)
    }, [
      ue(l.$slots, "default")
    ], 6));
  }
}), ot = { class: "markers" }, nt = /* @__PURE__ */ S("g", {
  id: "strict-marker-frame",
  transform: "translate(2, 2)",
  fill: "#000000",
  "fill-opacity": "0",
  "stroke-width": "2"
}, [
  /* @__PURE__ */ S("path", {
    d: "M2.66453526e-15,10.5882353 L2.66453526e-15,2.11764706 C2.66453526e-15,1.41176471 0.176470588,0.882352941 0.529411765,0.529411765 C0.882352941,0.176470588 1.41176471,-2.84217094e-14 2.11764706,-2.84217094e-14 L10.5882353,-2.84217094e-14",
    id: "Path"
  }),
  /* @__PURE__ */ S("path", {
    d: "M25.4117647,36 L25.4117647,27.5294118 C25.4117647,26.8235294 25.5882353,26.2941176 25.9411765,25.9411765 C26.2941176,25.5882353 26.8235294,25.4117647 27.5294118,25.4117647 L36,25.4117647",
    id: "Path",
    transform: "translate(30.705882, 30.705882) rotate(-180.000000) translate(-30.705882, -30.705882) "
  }),
  /* @__PURE__ */ S("path", {
    d: "M0,36 L0,27.5294118 C0,26.8235294 0.176470588,26.2941176 0.529411765,25.9411765 C0.882352941,25.5882353 1.41176471,25.4117647 2.11764706,25.4117647 L10.5882353,25.4117647",
    id: "Path",
    transform: "translate(5.294118, 30.705882) rotate(-90.000000) translate(-5.294118, -30.705882) "
  }),
  /* @__PURE__ */ S("path", {
    d: "M25.4117647,10.5882353 L25.4117647,2.11764706 C25.4117647,1.41176471 25.5882353,0.882352941 25.9411765,0.529411765 C26.2941176,0.176470588 26.8235294,0 27.5294118,0 L36,0",
    id: "Path",
    transform: "translate(30.705882, 5.294118) rotate(-270.000000) translate(-30.705882, -5.294118) "
  })
], -1), rt = [
  nt
], ut = /* @__PURE__ */ Y({
  __name: "ChessboardMarkers",
  props: {
    markers: {}
  },
  setup(t) {
    return (o, r) => (x(), A("div", ot, [
      (x(!0), A(le, null, de(o.markers, (e, l) => (x(), A(le, { key: l }, [
        e.type === W(oe).DOT ? (x(), Z(ce, {
          key: 0,
          class: "marker",
          square: e.square
        }, {
          default: ae(() => [
            S("div", {
              class: M(["marker-dot", e.color || "default"])
            }, null, 2)
          ]),
          _: 2
        }, 1032, ["square"])) : e.type === W(oe).FRAME ? (x(), Z(ce, {
          key: 1,
          class: "marker",
          square: e.square
        }, {
          default: ae(() => [
            (x(), A("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              class: M(["marker-frame", e.color || "default"]),
              viewBox: "0 0 40 40",
              version: "1.1"
            }, rt, 2))
          ]),
          _: 2
        }, 1032, ["square"])) : e.type === W(oe).CIRCLE ? (x(), Z(ce, {
          key: 2,
          class: "marker",
          square: e.square
        }, {
          default: ae(() => [
            S("div", {
              class: M(["marker-circle", e.color || "default"])
            }, null, 2)
          ]),
          _: 2
        }, 1032, ["square"])) : e.type === W(oe).SQUARE ? (x(), Z(ce, {
          key: 3,
          class: "marker",
          square: e.square
        }, {
          default: ae(() => [
            S("div", {
              class: M(["marker-square", e.color || "default"])
            }, null, 2)
          ]),
          _: 2
        }, 1032, ["square"])) : e.type === W(oe).ARROW ? (x(), Z(tt, {
          key: 4,
          class: "marker",
          square: e.square,
          toSquare: e.toSquare,
          color: e.color || "default",
          size: e.size || 7
        }, null, 8, ["square", "toSquare", "color", "size"])) : pe("", !0)
      ], 64))), 128))
    ]));
  }
}), dt = /* @__PURE__ */ Y({
  __name: "ChessboardPiece",
  props: {
    piece: {},
    pieceSet: { default: "default" },
    draggable: { type: Boolean }
  },
  setup(t) {
    const o = t, r = k(
      () => (o.piece.toUpperCase() === o.piece ? "w" : "b") + o.piece.toLowerCase()
    ), e = () => ge(
      "div",
      {
        class: "pieces " + o.pieceSet,
        draggable: o.draggable,
        onDragstart: (l) => {
          var s;
          if (o.draggable)
            return console.log("dragstart"), (s = l.dataTransfer) == null || s.setData("text/plain", "piece " + r.value), !0;
        }
      },
      ge("piece", {
        class: r.value,
        style: "display: block; width: 100%; height: 100%",
        dragable: o.draggable
      })
    );
    return (l, s) => (x(), Z(e));
  }
});
export {
  it as Chessboard,
  ct as ChessboardControl,
  ut as ChessboardMarkers,
  dt as ChessboardPiece,
  ce as ChessboardSquare,
  oe as MARKER,
  lt as PromotionDialog
};
