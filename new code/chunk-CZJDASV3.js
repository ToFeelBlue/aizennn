import {$ as X2, A as u, B as o4, C as f4, D as t2, E as j, Ea as K2, F as m4, Fa as J2, G as d4, Ga as Z2, H as b2, Ha as N4, I as N, Ia as c1, J as w, K as S2, M as h2, N as M2, O as y, P as p, Q as z, R as S, S as a2, T as e2, V as q, W as p4, X as D, Y as L, Z as u4, _ as z4, a as j2, aa as Y2, b as q2, ba as Q2, c as e4, d as T2, da as y2, e as c2, ea as G, f as l4, fa as C, g as D2, ga as T, h as i4, ha as o2, i as G2, ia as v4, j as r4, ja as h4, k as n4, ka as M4, l as O, la as g4, m as s4, n as _, na as V, oa as f2, p as E, pa as N2, q as B, qa as L4, r as z2, ra as C4, s as s2, sa as x4, t as b, ta as b4, u as v2, v as V2, va as S4, w as t4, wa as w2, x as $2, y as R, ya as y4} from "./chunk-WEWYQZWU.js";
var w4 = ( () => {
    class a {
        constructor() {
            this.rendererFactory = _(o4),
            this.renderer = this.rendererFactory.createRenderer(null, null),
            this.defaultConfig = {
                rotateX: 0,
                rotateY: 0,
                scale: 1.05,
                perspective: 1e3,
                transition: "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
                shadowIntensity: .3,
                maxRotation: 15
            }
        }
        initCard3DEffect(c, e) {
            if (window.innerWidth <= 768)
                return;
            let i = j2(j2({}, this.defaultConfig), e)
              , r = c.nativeElement;
            this.setupInitialStyles(r, i),
            this.addEventListeners(r, i)
        }
        setupInitialStyles(c, e) {
            this.renderer.setStyle(c, "transform-style", "preserve-3d"),
            this.renderer.setStyle(c, "perspective", `${e.perspective}px`),
            this.renderer.setStyle(c, "transition", `transform ${e.transition}`),
            this.renderer.setStyle(c, "will-change", "transform")
        }
        addEventListeners(c, e) {
            this.renderer.listen(c, "mouseenter", () => {
                this.onMouseEnter(c, e)
            }
            ),
            this.renderer.listen(c, "mousemove", i => {
                this.onMouseMove(c, i, e)
            }
            ),
            this.renderer.listen(c, "mouseleave", () => {
                this.onMouseLeave(c, e)
            }
            ),
            this.renderer.listen(c, "touchstart", i => {
                this.onTouchStart(c, i, e)
            }
            ),
            this.renderer.listen(c, "touchmove", i => {
                this.onTouchMove(c, i, e)
            }
            ),
            this.renderer.listen(c, "touchend", () => {
                this.onTouchEnd(c, e)
            }
            )
        }
        onMouseEnter(c, e) {
            this.renderer.setStyle(c, "transition", "transform 0.2s ease-out"),
            this.renderer.setStyle(c, "perspective", `${e.perspective}px`)
        }
        onMouseMove(c, e, i) {
            let r = c.getBoundingClientRect()
              , n = r.left + r.width / 2
              , s = r.top + r.height / 2
              , t = e.clientX - n
              , o = e.clientY - s
              , f = t / (r.width / 2) * i.maxRotation
              , d = -(o / (r.height / 2)) * i.maxRotation
              , v = `
      perspective(${i.perspective}px)
      rotateX(${d}deg)
      rotateY(${f}deg)
      scale(${i.scale})
    `;
            this.renderer.setStyle(c, "transform", v),
            this.applyChildrenEffects(c, d, f)
        }
        onMouseLeave(c, e) {
            this.renderer.setStyle(c, "transition", "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)"),
            this.renderer.setStyle(c, "transform", `perspective(${e.perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`),
            this.resetChildrenEffects(c)
        }
        onTouchStart(c, e, i) {
            window.innerWidth <= 768 || (e.preventDefault(),
            this.renderer.setStyle(c, "transition", "transform 0.2s ease-out"),
            this.renderer.setStyle(c, "perspective", `${i.perspective}px`))
        }
        onTouchMove(c, e, i) {
            if (window.innerWidth <= 768)
                return;
            e.preventDefault();
            let r = e.touches[0];
            if (!r)
                return;
            let n = c.getBoundingClientRect()
              , s = n.left + n.width / 2
              , t = n.top + n.height / 2
              , o = r.clientX - s
              , f = r.clientY - t
              , d = o / (n.width / 2) * i.maxRotation
              , v = -(f / (n.height / 2)) * i.maxRotation
              , h = `
      perspective(${i.perspective}px)
      rotateX(${v}deg)
      rotateY(${d}deg)
      scale(${i.scale})
    `;
            this.renderer.setStyle(c, "transform", h),
            this.applyChildrenEffects(c, v, d)
        }
        onTouchEnd(c, e) {
            this.renderer.setStyle(c, "transition", "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)"),
            this.renderer.setStyle(c, "transform", `perspective(${e.perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`),
            this.resetChildrenEffects(c)
        }
        applyChildrenEffects(c, e, i) {
            c.querySelectorAll("[data-offset]").forEach(s => {
                let t = parseFloat(s.getAttribute("data-offset") || "1")
                  , o = e * t
                  , f = i * t
                  , d = `
        translateZ(${t * 10}px)
        rotateX(${o}deg)
        rotateY(${f}deg)
      `;
                this.renderer.setStyle(s, "transform", d),
                this.renderer.setStyle(s, "transition", "transform 0.15s ease-out")
            }
            ),
            c.querySelectorAll("[data-opacity]").forEach(s => {
                let t = s.getAttribute("data-opacity")?.split(";") || ["0.9", "1"]
                  , o = parseFloat(t[0])
                  , f = parseFloat(t[1])
                  , d = (Math.abs(e) + Math.abs(i)) / 30
                  , v = o + (f - o) * Math.min(d, 1);
                this.renderer.setStyle(s, "opacity", v.toString()),
                this.renderer.setStyle(s, "transition", "opacity 0.15s ease-out")
            }
            )
        }
        resetChildrenEffects(c) {
            c.querySelectorAll("[data-offset]").forEach(r => {
                this.renderer.setStyle(r, "transform", "translateZ(0px) rotateX(0deg) rotateY(0deg)"),
                this.renderer.setStyle(r, "transition", "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)")
            }
            ),
            c.querySelectorAll("[data-opacity]").forEach(r => {
                let n = r.getAttribute("data-opacity")?.split(";") || ["0.9", "1"]
                  , s = parseFloat(n[0]);
                this.renderer.setStyle(r, "opacity", s.toString()),
                this.renderer.setStyle(r, "transition", "opacity 0.4s cubic-bezier(0.23, 1, 0.32, 1)")
            }
            )
        }
        destroyCard3DEffect(c) {
            let e = c.nativeElement;
            this.renderer.removeStyle(e, "transform"),
            this.renderer.removeStyle(e, "transition"),
            this.renderer.removeStyle(e, "box-shadow")
        }
        static{this.\u0275fac = function(e) {
            return new (e || a)
        }
        }static{this.\u0275prov = O({
            token: a,
            factory: a.\u0275fac,
            providedIn: "root"
        })
        }
    }
    return a
}
)();
var l2 = {
    production: !0,
    discordId: "203574366745657345",
    apiUrl: "https://redroseapi.vercel.app/v1/",
    webSocketUrl: "wss://api.lanyard.rest/socket"
};
function w1(a, l) {
    (l == null || l > a.length) && (l = a.length);
    for (var c = 0, e = Array(l); c < l; c++)
        e[c] = a[c];
    return e
}
function _0(a) {
    if (Array.isArray(a))
        return a
}
function T0(a) {
    if (Array.isArray(a))
        return w1(a)
}
function D0(a, l) {
    if (!(a instanceof l))
        throw new TypeError("Cannot call a class as a function")
}
function k4(a, l) {
    for (var c = 0; c < l.length; c++) {
        var e = l[c];
        e.enumerable = e.enumerable || !1,
        e.configurable = !0,
        "value"in e && (e.writable = !0),
        Object.defineProperty(a, n3(e.key), e)
    }
}
function F0(a, l, c) {
    return l && k4(a.prototype, l),
    c && k4(a, c),
    Object.defineProperty(a, "prototype", {
        writable: !1
    }),
    a
}
function l1(a, l) {
    var c = typeof Symbol < "u" && a[Symbol.iterator] || a["@@iterator"];
    if (!c) {
        if (Array.isArray(a) || (c = W1(a)) || l && a && typeof a.length == "number") {
            c && (a = c);
            var e = 0
              , i = function() {};
            return {
                s: i,
                n: function() {
                    return e >= a.length ? {
                        done: !0
                    } : {
                        done: !1,
                        value: a[e++]
                    }
                },
                e: function(t) {
                    throw t
                },
                f: i
            }
        }
        throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)
    }
    var r, n = !0, s = !1;
    return {
        s: function() {
            c = c.call(a)
        },
        n: function() {
            var t = c.next();
            return n = t.done,
            t
        },
        e: function(t) {
            s = !0,
            r = t
        },
        f: function() {
            try {
                n || c.return == null || c.return()
            } finally {
                if (s)
                    throw r
            }
        }
    }
}
function x(a, l, c) {
    return (l = n3(l))in a ? Object.defineProperty(a, l, {
        value: c,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[l] = c,
    a
}
function E0(a) {
    if (typeof Symbol < "u" && a[Symbol.iterator] != null || a["@@iterator"] != null)
        return Array.from(a)
}
function B0(a, l) {
    var c = a == null ? null : typeof Symbol < "u" && a[Symbol.iterator] || a["@@iterator"];
    if (c != null) {
        var e, i, r, n, s = [], t = !0, o = !1;
        try {
            if (r = (c = c.call(a)).next,
            l === 0) {
                if (Object(c) !== c)
                    return;
                t = !1
            } else
                for (; !(t = (e = r.call(c)).done) && (s.push(e.value),
                s.length !== l); t = !0)
                    ;
        } catch (f) {
            o = !0,
            i = f
        } finally {
            try {
                if (!t && c.return != null && (n = c.return(),
                Object(n) !== n))
                    return
            } finally {
                if (o)
                    throw i
            }
        }
        return s
    }
}
function R0() {
    throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)
}
function I0() {
    throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)
}
function A4(a, l) {
    var c = Object.keys(a);
    if (Object.getOwnPropertySymbols) {
        var e = Object.getOwnPropertySymbols(a);
        l && (e = e.filter(function(i) {
            return Object.getOwnPropertyDescriptor(a, i).enumerable
        })),
        c.push.apply(c, e)
    }
    return c
}
function m(a) {
    for (var l = 1; l < arguments.length; l++) {
        var c = arguments[l] != null ? arguments[l] : {};
        l % 2 ? A4(Object(c), !0).forEach(function(e) {
            x(a, e, c[e])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(a, Object.getOwnPropertyDescriptors(c)) : A4(Object(c)).forEach(function(e) {
            Object.defineProperty(a, e, Object.getOwnPropertyDescriptor(c, e))
        })
    }
    return a
}
function o1(a, l) {
    return _0(a) || B0(a, l) || W1(a, l) || R0()
}
function X(a) {
    return T0(a) || E0(a) || W1(a) || I0()
}
function H0(a, l) {
    if (typeof a != "object" || !a)
        return a;
    var c = a[Symbol.toPrimitive];
    if (c !== void 0) {
        var e = c.call(a, l || "default");
        if (typeof e != "object")
            return e;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (l === "string" ? String : Number)(a)
}
function n3(a) {
    var l = H0(a, "string");
    return typeof l == "symbol" ? l : l + ""
}
function n1(a) {
    "@babel/helpers - typeof";
    return n1 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(l) {
        return typeof l
    }
    : function(l) {
        return l && typeof Symbol == "function" && l.constructor === Symbol && l !== Symbol.prototype ? "symbol" : typeof l
    }
    ,
    n1(a)
}
function W1(a, l) {
    if (a) {
        if (typeof a == "string")
            return w1(a, l);
        var c = {}.toString.call(a).slice(8, -1);
        return c === "Object" && a.constructor && (c = a.constructor.name),
        c === "Map" || c === "Set" ? Array.from(a) : c === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c) ? w1(a, l) : void 0
    }
}
var P4 = function() {}
  , j1 = {}
  , s3 = {}
  , t3 = null
  , o3 = {
    mark: P4,
    measure: P4
};
try {
    typeof window < "u" && (j1 = window),
    typeof document < "u" && (s3 = document),
    typeof MutationObserver < "u" && (t3 = MutationObserver),
    typeof performance < "u" && (o3 = performance)
} catch {}
var O0 = j1.navigator || {}, _4 = O0.userAgent, T4 = _4 === void 0 ? "" : _4, d2 = j1, A = s3, D4 = t3, a1 = o3, k9 = !!d2.document, n2 = !!A.documentElement && !!A.head && typeof A.addEventListener == "function" && typeof A.createElement == "function", f3 = ~T4.indexOf("MSIE") || ~T4.indexOf("Trident/"), L1, U0 = /fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/, W0 = /Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Whiteboard)?.*/i, m3 = {
    classic: {
        fa: "solid",
        fas: "solid",
        "fa-solid": "solid",
        far: "regular",
        "fa-regular": "regular",
        fal: "light",
        "fa-light": "light",
        fat: "thin",
        "fa-thin": "thin",
        fab: "brands",
        "fa-brands": "brands"
    },
    duotone: {
        fa: "solid",
        fad: "solid",
        "fa-solid": "solid",
        "fa-duotone": "solid",
        fadr: "regular",
        "fa-regular": "regular",
        fadl: "light",
        "fa-light": "light",
        fadt: "thin",
        "fa-thin": "thin"
    },
    sharp: {
        fa: "solid",
        fass: "solid",
        "fa-solid": "solid",
        fasr: "regular",
        "fa-regular": "regular",
        fasl: "light",
        "fa-light": "light",
        fast: "thin",
        "fa-thin": "thin"
    },
    "sharp-duotone": {
        fa: "solid",
        fasds: "solid",
        "fa-solid": "solid",
        fasdr: "regular",
        "fa-regular": "regular",
        fasdl: "light",
        "fa-light": "light",
        fasdt: "thin",
        "fa-thin": "thin"
    },
    slab: {
        "fa-regular": "regular",
        faslr: "regular"
    },
    "slab-press": {
        "fa-regular": "regular",
        faslpr: "regular"
    },
    thumbprint: {
        "fa-light": "light",
        fatl: "light"
    },
    whiteboard: {
        "fa-semibold": "semibold",
        fawsb: "semibold"
    },
    notdog: {
        "fa-solid": "solid",
        fans: "solid"
    },
    "notdog-duo": {
        "fa-solid": "solid",
        fands: "solid"
    },
    etch: {
        "fa-solid": "solid",
        faes: "solid"
    },
    jelly: {
        "fa-regular": "regular",
        fajr: "regular"
    },
    "jelly-fill": {
        "fa-regular": "regular",
        fajfr: "regular"
    },
    "jelly-duo": {
        "fa-regular": "regular",
        fajdr: "regular"
    },
    chisel: {
        "fa-regular": "regular",
        facr: "regular"
    },
    utility: {
        "fa-semibold": "semibold",
        fausb: "semibold"
    },
    "utility-duo": {
        "fa-semibold": "semibold",
        faudsb: "semibold"
    },
    "utility-fill": {
        "fa-semibold": "semibold",
        faufsb: "semibold"
    }
}, j0 = {
    GROUP: "duotone-group",
    SWAP_OPACITY: "swap-opacity",
    PRIMARY: "primary",
    SECONDARY: "secondary"
}, d3 = ["fa-classic", "fa-duotone", "fa-sharp", "fa-sharp-duotone", "fa-thumbprint", "fa-whiteboard", "fa-notdog", "fa-notdog-duo", "fa-chisel", "fa-etch", "fa-jelly", "fa-jelly-fill", "fa-jelly-duo", "fa-slab", "fa-slab-press", "fa-utility", "fa-utility-duo", "fa-utility-fill"], I = "classic", I2 = "duotone", p3 = "sharp", u3 = "sharp-duotone", z3 = "chisel", v3 = "etch", h3 = "jelly", M3 = "jelly-duo", g3 = "jelly-fill", L3 = "notdog", C3 = "notdog-duo", x3 = "slab", b3 = "slab-press", S3 = "thumbprint", y3 = "utility", N3 = "utility-duo", w3 = "utility-fill", k3 = "whiteboard", q0 = "Classic", G0 = "Duotone", V0 = "Sharp", $0 = "Sharp Duotone", X0 = "Chisel", Y0 = "Etch", Q0 = "Jelly", K0 = "Jelly Duo", J0 = "Jelly Fill", Z0 = "Notdog", c6 = "Notdog Duo", a6 = "Slab", e6 = "Slab Press", l6 = "Thumbprint", i6 = "Utility", r6 = "Utility Duo", n6 = "Utility Fill", s6 = "Whiteboard", A3 = [I, I2, p3, u3, z3, v3, h3, M3, g3, L3, C3, x3, b3, S3, y3, N3, w3, k3], A9 = (L1 = {},
x(x(x(x(x(x(x(x(x(x(L1, I, q0), I2, G0), p3, V0), u3, $0), z3, X0), v3, Y0), h3, Q0), M3, K0), g3, J0), L3, Z0),
x(x(x(x(x(x(x(x(L1, C3, c6), x3, a6), b3, e6), S3, l6), y3, i6), N3, r6), w3, n6), k3, s6)), t6 = {
    classic: {
        900: "fas",
        400: "far",
        normal: "far",
        300: "fal",
        100: "fat"
    },
    duotone: {
        900: "fad",
        400: "fadr",
        300: "fadl",
        100: "fadt"
    },
    sharp: {
        900: "fass",
        400: "fasr",
        300: "fasl",
        100: "fast"
    },
    "sharp-duotone": {
        900: "fasds",
        400: "fasdr",
        300: "fasdl",
        100: "fasdt"
    },
    slab: {
        400: "faslr"
    },
    "slab-press": {
        400: "faslpr"
    },
    whiteboard: {
        600: "fawsb"
    },
    thumbprint: {
        300: "fatl"
    },
    notdog: {
        900: "fans"
    },
    "notdog-duo": {
        900: "fands"
    },
    etch: {
        900: "faes"
    },
    chisel: {
        400: "facr"
    },
    jelly: {
        400: "fajr"
    },
    "jelly-fill": {
        400: "fajfr"
    },
    "jelly-duo": {
        400: "fajdr"
    },
    utility: {
        600: "fausb"
    },
    "utility-duo": {
        600: "faudsb"
    },
    "utility-fill": {
        600: "faufsb"
    }
}, o6 = {
    "Font Awesome 7 Free": {
        900: "fas",
        400: "far"
    },
    "Font Awesome 7 Pro": {
        900: "fas",
        400: "far",
        normal: "far",
        300: "fal",
        100: "fat"
    },
    "Font Awesome 7 Brands": {
        400: "fab",
        normal: "fab"
    },
    "Font Awesome 7 Duotone": {
        900: "fad",
        400: "fadr",
        normal: "fadr",
        300: "fadl",
        100: "fadt"
    },
    "Font Awesome 7 Sharp": {
        900: "fass",
        400: "fasr",
        normal: "fasr",
        300: "fasl",
        100: "fast"
    },
    "Font Awesome 7 Sharp Duotone": {
        900: "fasds",
        400: "fasdr",
        normal: "fasdr",
        300: "fasdl",
        100: "fasdt"
    },
    "Font Awesome 7 Jelly": {
        400: "fajr",
        normal: "fajr"
    },
    "Font Awesome 7 Jelly Fill": {
        400: "fajfr",
        normal: "fajfr"
    },
    "Font Awesome 7 Jelly Duo": {
        400: "fajdr",
        normal: "fajdr"
    },
    "Font Awesome 7 Slab": {
        400: "faslr",
        normal: "faslr"
    },
    "Font Awesome 7 Slab Press": {
        400: "faslpr",
        normal: "faslpr"
    },
    "Font Awesome 7 Thumbprint": {
        300: "fatl",
        normal: "fatl"
    },
    "Font Awesome 7 Notdog": {
        900: "fans",
        normal: "fans"
    },
    "Font Awesome 7 Notdog Duo": {
        900: "fands",
        normal: "fands"
    },
    "Font Awesome 7 Etch": {
        900: "faes",
        normal: "faes"
    },
    "Font Awesome 7 Chisel": {
        400: "facr",
        normal: "facr"
    },
    "Font Awesome 7 Whiteboard": {
        600: "fawsb",
        normal: "fawsb"
    },
    "Font Awesome 7 Utility": {
        600: "fausb",
        normal: "fausb"
    },
    "Font Awesome 7 Utility Duo": {
        600: "faudsb",
        normal: "faudsb"
    },
    "Font Awesome 7 Utility Fill": {
        600: "faufsb",
        normal: "faufsb"
    }
}, f6 = new Map([["classic", {
    defaultShortPrefixId: "fas",
    defaultStyleId: "solid",
    styleIds: ["solid", "regular", "light", "thin", "brands"],
    futureStyleIds: [],
    defaultFontWeight: 900
}], ["duotone", {
    defaultShortPrefixId: "fad",
    defaultStyleId: "solid",
    styleIds: ["solid", "regular", "light", "thin"],
    futureStyleIds: [],
    defaultFontWeight: 900
}], ["sharp", {
    defaultShortPrefixId: "fass",
    defaultStyleId: "solid",
    styleIds: ["solid", "regular", "light", "thin"],
    futureStyleIds: [],
    defaultFontWeight: 900
}], ["sharp-duotone", {
    defaultShortPrefixId: "fasds",
    defaultStyleId: "solid",
    styleIds: ["solid", "regular", "light", "thin"],
    futureStyleIds: [],
    defaultFontWeight: 900
}], ["chisel", {
    defaultShortPrefixId: "facr",
    defaultStyleId: "regular",
    styleIds: ["regular"],
    futureStyleIds: [],
    defaultFontWeight: 400
}], ["etch", {
    defaultShortPrefixId: "faes",
    defaultStyleId: "solid",
    styleIds: ["solid"],
    futureStyleIds: [],
    defaultFontWeight: 900
}], ["jelly", {
    defaultShortPrefixId: "fajr",
    defaultStyleId: "regular",
    styleIds: ["regular"],
    futureStyleIds: [],
    defaultFontWeight: 400
}], ["jelly-duo", {
    defaultShortPrefixId: "fajdr",
    defaultStyleId: "regular",
    styleIds: ["regular"],
    futureStyleIds: [],
    defaultFontWeight: 400
}], ["jelly-fill", {
    defaultShortPrefixId: "fajfr",
    defaultStyleId: "regular",
    styleIds: ["regular"],
    futureStyleIds: [],
    defaultFontWeight: 400
}], ["notdog", {
    defaultShortPrefixId: "fans",
    defaultStyleId: "solid",
    styleIds: ["solid"],
    futureStyleIds: [],
    defaultFontWeight: 900
}], ["notdog-duo", {
    defaultShortPrefixId: "fands",
    defaultStyleId: "solid",
    styleIds: ["solid"],
    futureStyleIds: [],
    defaultFontWeight: 900
}], ["slab", {
    defaultShortPrefixId: "faslr",
    defaultStyleId: "regular",
    styleIds: ["regular"],
    futureStyleIds: [],
    defaultFontWeight: 400
}], ["slab-press", {
    defaultShortPrefixId: "faslpr",
    defaultStyleId: "regular",
    styleIds: ["regular"],
    futureStyleIds: [],
    defaultFontWeight: 400
}], ["thumbprint", {
    defaultShortPrefixId: "fatl",
    defaultStyleId: "light",
    styleIds: ["light"],
    futureStyleIds: [],
    defaultFontWeight: 300
}], ["utility", {
    defaultShortPrefixId: "fausb",
    defaultStyleId: "semibold",
    styleIds: ["semibold"],
    futureStyleIds: [],
    defaultFontWeight: 600
}], ["utility-duo", {
    defaultShortPrefixId: "faudsb",
    defaultStyleId: "semibold",
    styleIds: ["semibold"],
    futureStyleIds: [],
    defaultFontWeight: 600
}], ["utility-fill", {
    defaultShortPrefixId: "faufsb",
    defaultStyleId: "semibold",
    styleIds: ["semibold"],
    futureStyleIds: [],
    defaultFontWeight: 600
}], ["whiteboard", {
    defaultShortPrefixId: "fawsb",
    defaultStyleId: "semibold",
    styleIds: ["semibold"],
    futureStyleIds: [],
    defaultFontWeight: 600
}]]), m6 = {
    chisel: {
        regular: "facr"
    },
    classic: {
        brands: "fab",
        light: "fal",
        regular: "far",
        solid: "fas",
        thin: "fat"
    },
    duotone: {
        light: "fadl",
        regular: "fadr",
        solid: "fad",
        thin: "fadt"
    },
    etch: {
        solid: "faes"
    },
    jelly: {
        regular: "fajr"
    },
    "jelly-duo": {
        regular: "fajdr"
    },
    "jelly-fill": {
        regular: "fajfr"
    },
    notdog: {
        solid: "fans"
    },
    "notdog-duo": {
        solid: "fands"
    },
    sharp: {
        light: "fasl",
        regular: "fasr",
        solid: "fass",
        thin: "fast"
    },
    "sharp-duotone": {
        light: "fasdl",
        regular: "fasdr",
        solid: "fasds",
        thin: "fasdt"
    },
    slab: {
        regular: "faslr"
    },
    "slab-press": {
        regular: "faslpr"
    },
    thumbprint: {
        light: "fatl"
    },
    utility: {
        semibold: "fausb"
    },
    "utility-duo": {
        semibold: "faudsb"
    },
    "utility-fill": {
        semibold: "faufsb"
    },
    whiteboard: {
        semibold: "fawsb"
    }
}, P3 = ["fak", "fa-kit", "fakd", "fa-kit-duotone"], F4 = {
    kit: {
        fak: "kit",
        "fa-kit": "kit"
    },
    "kit-duotone": {
        fakd: "kit-duotone",
        "fa-kit-duotone": "kit-duotone"
    }
}, d6 = ["kit"], p6 = "kit", u6 = "kit-duotone", z6 = "Kit", v6 = "Kit Duotone", P9 = x(x({}, p6, z6), u6, v6), h6 = {
    kit: {
        "fa-kit": "fak"
    },
    "kit-duotone": {
        "fa-kit-duotone": "fakd"
    }
}, M6 = {
    "Font Awesome Kit": {
        400: "fak",
        normal: "fak"
    },
    "Font Awesome Kit Duotone": {
        400: "fakd",
        normal: "fakd"
    }
}, g6 = {
    kit: {
        fak: "fa-kit"
    },
    "kit-duotone": {
        fakd: "fa-kit-duotone"
    }
}, E4 = {
    kit: {
        kit: "fak"
    },
    "kit-duotone": {
        "kit-duotone": "fakd"
    }
}, C1, e1 = {
    GROUP: "duotone-group",
    SWAP_OPACITY: "swap-opacity",
    PRIMARY: "primary",
    SECONDARY: "secondary"
}, L6 = ["fa-classic", "fa-duotone", "fa-sharp", "fa-sharp-duotone", "fa-thumbprint", "fa-whiteboard", "fa-notdog", "fa-notdog-duo", "fa-chisel", "fa-etch", "fa-jelly", "fa-jelly-fill", "fa-jelly-duo", "fa-slab", "fa-slab-press", "fa-utility", "fa-utility-duo", "fa-utility-fill"], C6 = "classic", x6 = "duotone", b6 = "sharp", S6 = "sharp-duotone", y6 = "chisel", N6 = "etch", w6 = "jelly", k6 = "jelly-duo", A6 = "jelly-fill", P6 = "notdog", _6 = "notdog-duo", T6 = "slab", D6 = "slab-press", F6 = "thumbprint", E6 = "utility", B6 = "utility-duo", R6 = "utility-fill", I6 = "whiteboard", H6 = "Classic", O6 = "Duotone", U6 = "Sharp", W6 = "Sharp Duotone", j6 = "Chisel", q6 = "Etch", G6 = "Jelly", V6 = "Jelly Duo", $6 = "Jelly Fill", X6 = "Notdog", Y6 = "Notdog Duo", Q6 = "Slab", K6 = "Slab Press", J6 = "Thumbprint", Z6 = "Utility", c8 = "Utility Duo", a8 = "Utility Fill", e8 = "Whiteboard", _9 = (C1 = {},
x(x(x(x(x(x(x(x(x(x(C1, C6, H6), x6, O6), b6, U6), S6, W6), y6, j6), N6, q6), w6, G6), k6, V6), A6, $6), P6, X6),
x(x(x(x(x(x(x(x(C1, _6, Y6), T6, Q6), D6, K6), F6, J6), E6, Z6), B6, c8), R6, a8), I6, e8)), l8 = "kit", i8 = "kit-duotone", r8 = "Kit", n8 = "Kit Duotone", T9 = x(x({}, l8, r8), i8, n8), s8 = {
    classic: {
        "fa-brands": "fab",
        "fa-duotone": "fad",
        "fa-light": "fal",
        "fa-regular": "far",
        "fa-solid": "fas",
        "fa-thin": "fat"
    },
    duotone: {
        "fa-regular": "fadr",
        "fa-light": "fadl",
        "fa-thin": "fadt"
    },
    sharp: {
        "fa-solid": "fass",
        "fa-regular": "fasr",
        "fa-light": "fasl",
        "fa-thin": "fast"
    },
    "sharp-duotone": {
        "fa-solid": "fasds",
        "fa-regular": "fasdr",
        "fa-light": "fasdl",
        "fa-thin": "fasdt"
    },
    slab: {
        "fa-regular": "faslr"
    },
    "slab-press": {
        "fa-regular": "faslpr"
    },
    whiteboard: {
        "fa-semibold": "fawsb"
    },
    thumbprint: {
        "fa-light": "fatl"
    },
    notdog: {
        "fa-solid": "fans"
    },
    "notdog-duo": {
        "fa-solid": "fands"
    },
    etch: {
        "fa-solid": "faes"
    },
    jelly: {
        "fa-regular": "fajr"
    },
    "jelly-fill": {
        "fa-regular": "fajfr"
    },
    "jelly-duo": {
        "fa-regular": "fajdr"
    },
    chisel: {
        "fa-regular": "facr"
    },
    utility: {
        "fa-semibold": "fausb"
    },
    "utility-duo": {
        "fa-semibold": "faudsb"
    },
    "utility-fill": {
        "fa-semibold": "faufsb"
    }
}, t8 = {
    classic: ["fas", "far", "fal", "fat", "fad"],
    duotone: ["fadr", "fadl", "fadt"],
    sharp: ["fass", "fasr", "fasl", "fast"],
    "sharp-duotone": ["fasds", "fasdr", "fasdl", "fasdt"],
    slab: ["faslr"],
    "slab-press": ["faslpr"],
    whiteboard: ["fawsb"],
    thumbprint: ["fatl"],
    notdog: ["fans"],
    "notdog-duo": ["fands"],
    etch: ["faes"],
    jelly: ["fajr"],
    "jelly-fill": ["fajfr"],
    "jelly-duo": ["fajdr"],
    chisel: ["facr"],
    utility: ["fausb"],
    "utility-duo": ["faudsb"],
    "utility-fill": ["faufsb"]
}, k1 = {
    classic: {
        fab: "fa-brands",
        fad: "fa-duotone",
        fal: "fa-light",
        far: "fa-regular",
        fas: "fa-solid",
        fat: "fa-thin"
    },
    duotone: {
        fadr: "fa-regular",
        fadl: "fa-light",
        fadt: "fa-thin"
    },
    sharp: {
        fass: "fa-solid",
        fasr: "fa-regular",
        fasl: "fa-light",
        fast: "fa-thin"
    },
    "sharp-duotone": {
        fasds: "fa-solid",
        fasdr: "fa-regular",
        fasdl: "fa-light",
        fasdt: "fa-thin"
    },
    slab: {
        faslr: "fa-regular"
    },
    "slab-press": {
        faslpr: "fa-regular"
    },
    whiteboard: {
        fawsb: "fa-semibold"
    },
    thumbprint: {
        fatl: "fa-light"
    },
    notdog: {
        fans: "fa-solid"
    },
    "notdog-duo": {
        fands: "fa-solid"
    },
    etch: {
        faes: "fa-solid"
    },
    jelly: {
        fajr: "fa-regular"
    },
    "jelly-fill": {
        fajfr: "fa-regular"
    },
    "jelly-duo": {
        fajdr: "fa-regular"
    },
    chisel: {
        facr: "fa-regular"
    },
    utility: {
        fausb: "fa-semibold"
    },
    "utility-duo": {
        faudsb: "fa-semibold"
    },
    "utility-fill": {
        faufsb: "fa-semibold"
    }
}, o8 = ["fa-solid", "fa-regular", "fa-light", "fa-thin", "fa-duotone", "fa-brands", "fa-semibold"], _3 = ["fa", "fas", "far", "fal", "fat", "fad", "fadr", "fadl", "fadt", "fab", "fass", "fasr", "fasl", "fast", "fasds", "fasdr", "fasdl", "fasdt", "faslr", "faslpr", "fawsb", "fatl", "fans", "fands", "faes", "fajr", "fajfr", "fajdr", "facr", "fausb", "faudsb", "faufsb"].concat(L6, o8), f8 = ["solid", "regular", "light", "thin", "duotone", "brands", "semibold"], T3 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], m8 = T3.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), d8 = ["aw", "fw", "pull-left", "pull-right"], p8 = [].concat(X(Object.keys(t8)), f8, d8, ["2xs", "xs", "sm", "lg", "xl", "2xl", "beat", "border", "fade", "beat-fade", "bounce", "flip-both", "flip-horizontal", "flip-vertical", "flip", "inverse", "layers", "layers-bottom-left", "layers-bottom-right", "layers-counter", "layers-text", "layers-top-left", "layers-top-right", "li", "pull-end", "pull-start", "pulse", "rotate-180", "rotate-270", "rotate-90", "rotate-by", "shake", "spin-pulse", "spin-reverse", "spin", "stack-1x", "stack-2x", "stack", "ul", "width-auto", "width-fixed", e1.GROUP, e1.SWAP_OPACITY, e1.PRIMARY, e1.SECONDARY]).concat(T3.map(function(a) {
    return "".concat(a, "x")
})).concat(m8.map(function(a) {
    return "w-".concat(a)
})), u8 = {
    "Font Awesome 5 Free": {
        900: "fas",
        400: "far"
    },
    "Font Awesome 5 Pro": {
        900: "fas",
        400: "far",
        normal: "far",
        300: "fal"
    },
    "Font Awesome 5 Brands": {
        400: "fab",
        normal: "fab"
    },
    "Font Awesome 5 Duotone": {
        900: "fad"
    }
}, i2 = "___FONT_AWESOME___", A1 = 16, D3 = "fa", F3 = "svg-inline--fa", L2 = "data-fa-i2svg", P1 = "data-fa-pseudo-element", z8 = "data-fa-pseudo-element-pending", q1 = "data-prefix", G1 = "data-icon", B4 = "fontawesome-i2svg", v8 = "async", h8 = ["HTML", "HEAD", "STYLE", "SCRIPT"], E3 = ["::before", "::after", ":before", ":after"], B3 = (function() {
    try {
        return !0
    } catch {
        return !1
    }
}
)();
function H2(a) {
    return new Proxy(a,{
        get: function(c, e) {
            return e in c ? c[e] : c[I]
        }
    })
}
var R3 = m({}, m3);
R3[I] = m(m(m(m({}, {
    "fa-duotone": "duotone"
}), m3[I]), F4.kit), F4["kit-duotone"]);
var M8 = H2(R3)
  , _1 = m({}, m6);
_1[I] = m(m(m(m({}, {
    duotone: "fad"
}), _1[I]), E4.kit), E4["kit-duotone"]);
var R4 = H2(_1)
  , T1 = m({}, k1);
T1[I] = m(m({}, T1[I]), g6.kit);
var V1 = H2(T1)
  , D1 = m({}, s8);
D1[I] = m(m({}, D1[I]), h6.kit);
var D9 = H2(D1)
  , g8 = U0
  , I3 = "fa-layers-text"
  , L8 = W0
  , C8 = m({}, t6)
  , F9 = H2(C8)
  , x8 = ["class", "data-prefix", "data-icon", "data-fa-transform", "data-fa-mask"]
  , x1 = j0
  , b8 = [].concat(X(d6), X(p8))
  , E2 = d2.FontAwesomeConfig || {};
function S8(a) {
    var l = A.querySelector("script[" + a + "]");
    if (l)
        return l.getAttribute(a)
}
function y8(a) {
    return a === "" ? !0 : a === "false" ? !1 : a === "true" ? !0 : a
}
A && typeof A.querySelector == "function" && (I4 = [["data-family-prefix", "familyPrefix"], ["data-css-prefix", "cssPrefix"], ["data-family-default", "familyDefault"], ["data-style-default", "styleDefault"], ["data-replacement-class", "replacementClass"], ["data-auto-replace-svg", "autoReplaceSvg"], ["data-auto-add-css", "autoAddCss"], ["data-search-pseudo-elements", "searchPseudoElements"], ["data-search-pseudo-elements-warnings", "searchPseudoElementsWarnings"], ["data-search-pseudo-elements-full-scan", "searchPseudoElementsFullScan"], ["data-observe-mutations", "observeMutations"], ["data-mutate-approach", "mutateApproach"], ["data-keep-original-source", "keepOriginalSource"], ["data-measure-performance", "measurePerformance"], ["data-show-missing-icons", "showMissingIcons"]],
I4.forEach(function(a) {
    var l = o1(a, 2)
      , c = l[0]
      , e = l[1]
      , i = y8(S8(c));
    i != null && (E2[e] = i)
}));
var I4, H3 = {
    styleDefault: "solid",
    familyDefault: I,
    cssPrefix: D3,
    replacementClass: F3,
    autoReplaceSvg: !0,
    autoAddCss: !0,
    searchPseudoElements: !1,
    searchPseudoElementsWarnings: !0,
    searchPseudoElementsFullScan: !1,
    observeMutations: !0,
    mutateApproach: "async",
    keepOriginalSource: !0,
    measurePerformance: !1,
    showMissingIcons: !0
};
E2.familyPrefix && (E2.cssPrefix = E2.familyPrefix);
var P2 = m(m({}, H3), E2);
P2.autoReplaceSvg || (P2.observeMutations = !1);
var M = {};
Object.keys(H3).forEach(function(a) {
    Object.defineProperty(M, a, {
        enumerable: !0,
        set: function(c) {
            P2[a] = c,
            B2.forEach(function(e) {
                return e(M)
            })
        },
        get: function() {
            return P2[a]
        }
    })
});
Object.defineProperty(M, "familyPrefix", {
    enumerable: !0,
    set: function(l) {
        P2.cssPrefix = l,
        B2.forEach(function(c) {
            return c(M)
        })
    },
    get: function() {
        return P2.cssPrefix
    }
});
d2.FontAwesomeConfig = M;
var B2 = [];
function N8(a) {
    return B2.push(a),
    function() {
        B2.splice(B2.indexOf(a), 1)
    }
}
var m2 = A1
  , K = {
    size: 16,
    x: 0,
    y: 0,
    rotate: 0,
    flipX: !1,
    flipY: !1
};
function w8(a) {
    if (!(!a || !n2)) {
        var l = A.createElement("style");
        l.setAttribute("type", "text/css"),
        l.innerHTML = a;
        for (var c = A.head.childNodes, e = null, i = c.length - 1; i > -1; i--) {
            var r = c[i]
              , n = (r.tagName || "").toUpperCase();
            ["STYLE", "LINK"].indexOf(n) > -1 && (e = r)
        }
        return A.head.insertBefore(l, e),
        a
    }
}
var k8 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function H4() {
    for (var a = 12, l = ""; a-- > 0; )
        l += k8[Math.random() * 62 | 0];
    return l
}
function _2(a) {
    for (var l = [], c = (a || []).length >>> 0; c--; )
        l[c] = a[c];
    return l
}
function $1(a) {
    return a.classList ? _2(a.classList) : (a.getAttribute("class") || "").split(" ").filter(function(l) {
        return l
    })
}
function O3(a) {
    return "".concat(a).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
function A8(a) {
    return Object.keys(a || {}).reduce(function(l, c) {
        return l + "".concat(c, '="').concat(O3(a[c]), '" ')
    }, "").trim()
}
function f1(a) {
    return Object.keys(a || {}).reduce(function(l, c) {
        return l + "".concat(c, ": ").concat(a[c].trim(), ";")
    }, "")
}
function X1(a) {
    return a.size !== K.size || a.x !== K.x || a.y !== K.y || a.rotate !== K.rotate || a.flipX || a.flipY
}
function P8(a) {
    var l = a.transform
      , c = a.containerWidth
      , e = a.iconWidth
      , i = {
        transform: "translate(".concat(c / 2, " 256)")
    }
      , r = "translate(".concat(l.x * 32, ", ").concat(l.y * 32, ") ")
      , n = "scale(".concat(l.size / 16 * (l.flipX ? -1 : 1), ", ").concat(l.size / 16 * (l.flipY ? -1 : 1), ") ")
      , s = "rotate(".concat(l.rotate, " 0 0)")
      , t = {
        transform: "".concat(r, " ").concat(n, " ").concat(s)
    }
      , o = {
        transform: "translate(".concat(e / 2 * -1, " -256)")
    };
    return {
        outer: i,
        inner: t,
        path: o
    }
}
function _8(a) {
    var l = a.transform
      , c = a.width
      , e = c === void 0 ? A1 : c
      , i = a.height
      , r = i === void 0 ? A1 : i
      , n = a.startCentered
      , s = n === void 0 ? !1 : n
      , t = "";
    return s && f3 ? t += "translate(".concat(l.x / m2 - e / 2, "em, ").concat(l.y / m2 - r / 2, "em) ") : s ? t += "translate(calc(-50% + ".concat(l.x / m2, "em), calc(-50% + ").concat(l.y / m2, "em)) ") : t += "translate(".concat(l.x / m2, "em, ").concat(l.y / m2, "em) "),
    t += "scale(".concat(l.size / m2 * (l.flipX ? -1 : 1), ", ").concat(l.size / m2 * (l.flipY ? -1 : 1), ") "),
    t += "rotate(".concat(l.rotate, "deg) "),
    t
}
var T8 = `:root, :host {
  --fa-font-solid: normal 900 1em/1 "Font Awesome 7 Free";
  --fa-font-regular: normal 400 1em/1 "Font Awesome 7 Free";
  --fa-font-light: normal 300 1em/1 "Font Awesome 7 Pro";
  --fa-font-thin: normal 100 1em/1 "Font Awesome 7 Pro";
  --fa-font-duotone: normal 900 1em/1 "Font Awesome 7 Duotone";
  --fa-font-duotone-regular: normal 400 1em/1 "Font Awesome 7 Duotone";
  --fa-font-duotone-light: normal 300 1em/1 "Font Awesome 7 Duotone";
  --fa-font-duotone-thin: normal 100 1em/1 "Font Awesome 7 Duotone";
  --fa-font-brands: normal 400 1em/1 "Font Awesome 7 Brands";
  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 7 Sharp";
  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 7 Sharp";
  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 7 Sharp";
  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 7 Sharp";
  --fa-font-sharp-duotone-solid: normal 900 1em/1 "Font Awesome 7 Sharp Duotone";
  --fa-font-sharp-duotone-regular: normal 400 1em/1 "Font Awesome 7 Sharp Duotone";
  --fa-font-sharp-duotone-light: normal 300 1em/1 "Font Awesome 7 Sharp Duotone";
  --fa-font-sharp-duotone-thin: normal 100 1em/1 "Font Awesome 7 Sharp Duotone";
  --fa-font-slab-regular: normal 400 1em/1 "Font Awesome 7 Slab";
  --fa-font-slab-press-regular: normal 400 1em/1 "Font Awesome 7 Slab Press";
  --fa-font-whiteboard-semibold: normal 600 1em/1 "Font Awesome 7 Whiteboard";
  --fa-font-thumbprint-light: normal 300 1em/1 "Font Awesome 7 Thumbprint";
  --fa-font-notdog-solid: normal 900 1em/1 "Font Awesome 7 Notdog";
  --fa-font-notdog-duo-solid: normal 900 1em/1 "Font Awesome 7 Notdog Duo";
  --fa-font-etch-solid: normal 900 1em/1 "Font Awesome 7 Etch";
  --fa-font-jelly-regular: normal 400 1em/1 "Font Awesome 7 Jelly";
  --fa-font-jelly-fill-regular: normal 400 1em/1 "Font Awesome 7 Jelly Fill";
  --fa-font-jelly-duo-regular: normal 400 1em/1 "Font Awesome 7 Jelly Duo";
  --fa-font-chisel-regular: normal 400 1em/1 "Font Awesome 7 Chisel";
  --fa-font-utility-semibold: normal 600 1em/1 "Font Awesome 7 Utility";
  --fa-font-utility-duo-semibold: normal 600 1em/1 "Font Awesome 7 Utility Duo";
  --fa-font-utility-fill-semibold: normal 600 1em/1 "Font Awesome 7 Utility Fill";
}

.svg-inline--fa {
  box-sizing: content-box;
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285714em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left,
.svg-inline--fa .fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-pull-right,
.svg-inline--fa .fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  inset-block-start: 0.25em; /* syncing vertical alignment with Web Font rendering */
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.fa-layers .svg-inline--fa {
  inset: 0;
  margin: auto;
  position: absolute;
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: calc(10 / 16 * 1em); /* converts a 10px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 10 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 10 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xs {
  font-size: calc(12 / 16 * 1em); /* converts a 12px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 12 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 12 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-sm {
  font-size: calc(14 / 16 * 1em); /* converts a 14px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 14 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 14 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-lg {
  font-size: calc(20 / 16 * 1em); /* converts a 20px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 20 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 20 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xl {
  font-size: calc(24 / 16 * 1em); /* converts a 24px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 24 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 24 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-2xl {
  font-size: calc(32 / 16 * 1em); /* converts a 32px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 32 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 32 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-width-auto {
  --fa-width: auto;
}

.fa-fw,
.fa-width-fixed {
  --fa-width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-inline-start: var(--fa-li-margin, 2.5em);
  padding-inline-start: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

/* Heads Up: Bordered Icons will not be supported in the future!
  - This feature will be deprecated in the next major release of Font Awesome (v8)!
  - You may continue to use it in this version *v7), but it will not be supported in Font Awesome v8.
*/
/* Notes:
* --@{v.$css-prefix}-border-width = 1/16 by default (to render as ~1px based on a 16px default font-size)
* --@{v.$css-prefix}-border-padding =
  ** 3/16 for vertical padding (to give ~2px of vertical whitespace around an icon considering it's vertical alignment)
  ** 4/16 for horizontal padding (to give ~4px of horizontal whitespace around an icon)
*/
.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.0625em);
  box-sizing: var(--fa-border-box-sizing, content-box);
  padding: var(--fa-border-padding, 0.1875em 0.25em);
}

.fa-pull-left,
.fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right,
.fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
  .fa-bounce,
  .fa-fade,
  .fa-beat-fade,
  .fa-flip,
  .fa-pulse,
  .fa-shake,
  .fa-spin,
  .fa-spin-pulse {
    animation: none !important;
    transition: none !important;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.svg-inline--fa.fa-inverse {
  fill: var(--fa-inverse, #fff);
}

.fa-stack {
  display: inline-block;
  height: 2em;
  line-height: 2em;
  position: relative;
  vertical-align: middle;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.svg-inline--fa.fa-stack-1x {
  --fa-width: 1.25em;
  height: 1em;
  width: var(--fa-width);
}
.svg-inline--fa.fa-stack-2x {
  --fa-width: 2.5em;
  height: 2em;
  width: var(--fa-width);
}

.fa-stack-1x,
.fa-stack-2x {
  inset: 0;
  margin: auto;
  position: absolute;
  z-index: var(--fa-stack-z-index, auto);
}`;
function U3() {
    var a = D3
      , l = F3
      , c = M.cssPrefix
      , e = M.replacementClass
      , i = T8;
    if (c !== a || e !== l) {
        var r = new RegExp("\\.".concat(a, "\\-"),"g")
          , n = new RegExp("\\--".concat(a, "\\-"),"g")
          , s = new RegExp("\\.".concat(l),"g");
        i = i.replace(r, ".".concat(c, "-")).replace(n, "--".concat(c, "-")).replace(s, ".".concat(e))
    }
    return i
}
var O4 = !1;
function b1() {
    M.autoAddCss && !O4 && (w8(U3()),
    O4 = !0)
}
var D8 = {
    mixout: function() {
        return {
            dom: {
                css: U3,
                insertCss: b1
            }
        }
    },
    hooks: function() {
        return {
            beforeDOMElementCreation: function() {
                b1()
            },
            beforeI2svg: function() {
                b1()
            }
        }
    }
}
  , r2 = d2 || {};
r2[i2] || (r2[i2] = {});
r2[i2].styles || (r2[i2].styles = {});
r2[i2].hooks || (r2[i2].hooks = {});
r2[i2].shims || (r2[i2].shims = []);
var $ = r2[i2]
  , W3 = []
  , j3 = function() {
    A.removeEventListener("DOMContentLoaded", j3),
    s1 = 1,
    W3.map(function(l) {
        return l()
    })
}
  , s1 = !1;
n2 && (s1 = (A.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(A.readyState),
s1 || A.addEventListener("DOMContentLoaded", j3));
function F8(a) {
    n2 && (s1 ? setTimeout(a, 0) : W3.push(a))
}
function O2(a) {
    var l = a.tag
      , c = a.attributes
      , e = c === void 0 ? {} : c
      , i = a.children
      , r = i === void 0 ? [] : i;
    return typeof a == "string" ? O3(a) : "<".concat(l, " ").concat(A8(e), ">").concat(r.map(O2).join(""), "</").concat(l, ">")
}
function U4(a, l, c) {
    if (a && a[l] && a[l][c])
        return {
            prefix: l,
            iconName: c,
            icon: a[l][c]
        }
}
var E8 = function(l, c) {
    return function(e, i, r, n) {
        return l.call(c, e, i, r, n)
    }
}
  , S1 = function(l, c, e, i) {
    var r = Object.keys(l), n = r.length, s = i !== void 0 ? E8(c, i) : c, t, o, f;
    for (e === void 0 ? (t = 1,
    f = l[r[0]]) : (t = 0,
    f = e); t < n; t++)
        o = r[t],
        f = s(f, l[o], o, l);
    return f
};
function q3(a) {
    return X(a).length !== 1 ? null : a.codePointAt(0).toString(16)
}
function W4(a) {
    return Object.keys(a).reduce(function(l, c) {
        var e = a[c]
          , i = !!e.icon;
        return i ? l[e.iconName] = e.icon : l[c] = e,
        l
    }, {})
}
function F1(a, l) {
    var c = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}
      , e = c.skipHooks
      , i = e === void 0 ? !1 : e
      , r = W4(l);
    typeof $.hooks.addPack == "function" && !i ? $.hooks.addPack(a, W4(l)) : $.styles[a] = m(m({}, $.styles[a] || {}), r),
    a === "fas" && F1("fa", l)
}
var R2 = $.styles
  , B8 = $.shims
  , G3 = Object.keys(V1)
  , R8 = G3.reduce(function(a, l) {
    return a[l] = Object.keys(V1[l]),
    a
}, {})
  , Y1 = null
  , V3 = {}
  , $3 = {}
  , X3 = {}
  , Y3 = {}
  , Q3 = {};
function I8(a) {
    return ~b8.indexOf(a)
}
function H8(a, l) {
    var c = l.split("-")
      , e = c[0]
      , i = c.slice(1).join("-");
    return e === a && i !== "" && !I8(i) ? i : null
}
var K3 = function() {
    var l = function(r) {
        return S1(R2, function(n, s, t) {
            return n[t] = S1(s, r, {}),
            n
        }, {})
    };
    V3 = l(function(i, r, n) {
        if (r[3] && (i[r[3]] = n),
        r[2]) {
            var s = r[2].filter(function(t) {
                return typeof t == "number"
            });
            s.forEach(function(t) {
                i[t.toString(16)] = n
            })
        }
        return i
    }),
    $3 = l(function(i, r, n) {
        if (i[n] = n,
        r[2]) {
            var s = r[2].filter(function(t) {
                return typeof t == "string"
            });
            s.forEach(function(t) {
                i[t] = n
            })
        }
        return i
    }),
    Q3 = l(function(i, r, n) {
        var s = r[2];
        return i[n] = n,
        s.forEach(function(t) {
            i[t] = n
        }),
        i
    });
    var c = "far"in R2 || M.autoFetchSvg
      , e = S1(B8, function(i, r) {
        var n = r[0]
          , s = r[1]
          , t = r[2];
        return s === "far" && !c && (s = "fas"),
        typeof n == "string" && (i.names[n] = {
            prefix: s,
            iconName: t
        }),
        typeof n == "number" && (i.unicodes[n.toString(16)] = {
            prefix: s,
            iconName: t
        }),
        i
    }, {
        names: {},
        unicodes: {}
    });
    X3 = e.names,
    Y3 = e.unicodes,
    Y1 = m1(M.styleDefault, {
        family: M.familyDefault
    })
};
N8(function(a) {
    Y1 = m1(a.styleDefault, {
        family: M.familyDefault
    })
});
K3();
function Q1(a, l) {
    return (V3[a] || {})[l]
}
function O8(a, l) {
    return ($3[a] || {})[l]
}
function g2(a, l) {
    return (Q3[a] || {})[l]
}
function J3(a) {
    return X3[a] || {
        prefix: null,
        iconName: null
    }
}
function U8(a) {
    var l = Y3[a]
      , c = Q1("fas", a);
    return l || (c ? {
        prefix: "fas",
        iconName: c
    } : null) || {
        prefix: null,
        iconName: null
    }
}
function p2() {
    return Y1
}
var Z3 = function() {
    return {
        prefix: null,
        iconName: null,
        rest: []
    }
};
function W8(a) {
    var l = I
      , c = G3.reduce(function(e, i) {
        return e[i] = "".concat(M.cssPrefix, "-").concat(i),
        e
    }, {});
    return A3.forEach(function(e) {
        (a.includes(c[e]) || a.some(function(i) {
            return R8[e].includes(i)
        })) && (l = e)
    }),
    l
}
function m1(a) {
    var l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}
      , c = l.family
      , e = c === void 0 ? I : c
      , i = M8[e][a];
    if (e === I2 && !a)
        return "fad";
    var r = R4[e][a] || R4[e][i]
      , n = a in $.styles ? a : null
      , s = r || n || null;
    return s
}
function j8(a) {
    var l = []
      , c = null;
    return a.forEach(function(e) {
        var i = H8(M.cssPrefix, e);
        i ? c = i : e && l.push(e)
    }),
    {
        iconName: c,
        rest: l
    }
}
function j4(a) {
    return a.sort().filter(function(l, c, e) {
        return e.indexOf(l) === c
    })
}
var q4 = _3.concat(P3);
function d1(a) {
    var l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}
      , c = l.skipLookups
      , e = c === void 0 ? !1 : c
      , i = null
      , r = j4(a.filter(function(h) {
        return q4.includes(h)
    }))
      , n = j4(a.filter(function(h) {
        return !q4.includes(h)
    }))
      , s = r.filter(function(h) {
        return i = h,
        !d3.includes(h)
    })
      , t = o1(s, 1)
      , o = t[0]
      , f = o === void 0 ? null : o
      , d = W8(r)
      , v = m(m({}, j8(n)), {}, {
        prefix: m1(f, {
            family: d
        })
    });
    return m(m(m({}, v), $8({
        values: a,
        family: d,
        styles: R2,
        config: M,
        canonical: v,
        givenPrefix: i
    })), q8(e, i, v))
}
function q8(a, l, c) {
    var e = c.prefix
      , i = c.iconName;
    if (a || !e || !i)
        return {
            prefix: e,
            iconName: i
        };
    var r = l === "fa" ? J3(i) : {}
      , n = g2(e, i);
    return i = r.iconName || n || i,
    e = r.prefix || e,
    e === "far" && !R2.far && R2.fas && !M.autoFetchSvg && (e = "fas"),
    {
        prefix: e,
        iconName: i
    }
}
var G8 = A3.filter(function(a) {
    return a !== I || a !== I2
})
  , V8 = Object.keys(k1).filter(function(a) {
    return a !== I
}).map(function(a) {
    return Object.keys(k1[a])
}).flat();
function $8(a) {
    var l = a.values
      , c = a.family
      , e = a.canonical
      , i = a.givenPrefix
      , r = i === void 0 ? "" : i
      , n = a.styles
      , s = n === void 0 ? {} : n
      , t = a.config
      , o = t === void 0 ? {} : t
      , f = c === I2
      , d = l.includes("fa-duotone") || l.includes("fad")
      , v = o.familyDefault === "duotone"
      , h = e.prefix === "fad" || e.prefix === "fa-duotone";
    if (!f && (d || v || h) && (e.prefix = "fad"),
    (l.includes("fa-brands") || l.includes("fab")) && (e.prefix = "fab"),
    !e.prefix && G8.includes(c)) {
        var g = Object.keys(s).find(function(F) {
            return V8.includes(F)
        });
        if (g || o.autoFetchSvg) {
            var k = f6.get(c).defaultShortPrefixId;
            e.prefix = k,
            e.iconName = g2(e.prefix, e.iconName) || e.iconName
        }
    }
    return (e.prefix === "fa" || r === "fa") && (e.prefix = p2() || "fas"),
    e
}
var X8 = (function() {
    function a() {
        D0(this, a),
        this.definitions = {}
    }
    return F0(a, [{
        key: "add",
        value: function() {
            for (var c = this, e = arguments.length, i = new Array(e), r = 0; r < e; r++)
                i[r] = arguments[r];
            var n = i.reduce(this._pullDefinitions, {});
            Object.keys(n).forEach(function(s) {
                c.definitions[s] = m(m({}, c.definitions[s] || {}), n[s]),
                F1(s, n[s]);
                var t = V1[I][s];
                t && F1(t, n[s]),
                K3()
            })
        }
    }, {
        key: "reset",
        value: function() {
            this.definitions = {}
        }
    }, {
        key: "_pullDefinitions",
        value: function(c, e) {
            var i = e.prefix && e.iconName && e.icon ? {
                0: e
            } : e;
            return Object.keys(i).map(function(r) {
                var n = i[r]
                  , s = n.prefix
                  , t = n.iconName
                  , o = n.icon
                  , f = o[2];
                c[s] || (c[s] = {}),
                f.length > 0 && f.forEach(function(d) {
                    typeof d == "string" && (c[s][d] = o)
                }),
                c[s][t] = o
            }),
            c
        }
    }])
}
)()
  , G4 = []
  , k2 = {}
  , A2 = {}
  , Y8 = Object.keys(A2);
function Q8(a, l) {
    var c = l.mixoutsTo;
    return G4 = a,
    k2 = {},
    Object.keys(A2).forEach(function(e) {
        Y8.indexOf(e) === -1 && delete A2[e]
    }),
    G4.forEach(function(e) {
        var i = e.mixout ? e.mixout() : {};
        if (Object.keys(i).forEach(function(n) {
            typeof i[n] == "function" && (c[n] = i[n]),
            n1(i[n]) === "object" && Object.keys(i[n]).forEach(function(s) {
                c[n] || (c[n] = {}),
                c[n][s] = i[n][s]
            })
        }),
        e.hooks) {
            var r = e.hooks();
            Object.keys(r).forEach(function(n) {
                k2[n] || (k2[n] = []),
                k2[n].push(r[n])
            })
        }
        e.provides && e.provides(A2)
    }),
    c
}
function E1(a, l) {
    for (var c = arguments.length, e = new Array(c > 2 ? c - 2 : 0), i = 2; i < c; i++)
        e[i - 2] = arguments[i];
    var r = k2[a] || [];
    return r.forEach(function(n) {
        l = n.apply(null, [l].concat(e))
    }),
    l
}
function C2(a) {
    for (var l = arguments.length, c = new Array(l > 1 ? l - 1 : 0), e = 1; e < l; e++)
        c[e - 1] = arguments[e];
    var i = k2[a] || [];
    i.forEach(function(r) {
        r.apply(null, c)
    })
}
function u2() {
    var a = arguments[0]
      , l = Array.prototype.slice.call(arguments, 1);
    return A2[a] ? A2[a].apply(null, l) : void 0
}
function B1(a) {
    a.prefix === "fa" && (a.prefix = "fas");
    var l = a.iconName
      , c = a.prefix || p2();
    if (l)
        return l = g2(c, l) || l,
        U4(c0.definitions, c, l) || U4($.styles, c, l)
}
var c0 = new X8
  , K8 = function() {
    M.autoReplaceSvg = !1,
    M.observeMutations = !1,
    C2("noAuto")
}
  , J8 = {
    i2svg: function() {
        var l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        return n2 ? (C2("beforeI2svg", l),
        u2("pseudoElements2svg", l),
        u2("i2svg", l)) : Promise.reject(new Error("Operation requires a DOM of some kind."))
    },
    watch: function() {
        var l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}
          , c = l.autoReplaceSvgRoot;
        M.autoReplaceSvg === !1 && (M.autoReplaceSvg = !0),
        M.observeMutations = !0,
        F8(function() {
            c5({
                autoReplaceSvgRoot: c
            }),
            C2("watch", l)
        })
    }
}
  , Z8 = {
    icon: function(l) {
        if (l === null)
            return null;
        if (n1(l) === "object" && l.prefix && l.iconName)
            return {
                prefix: l.prefix,
                iconName: g2(l.prefix, l.iconName) || l.iconName
            };
        if (Array.isArray(l) && l.length === 2) {
            var c = l[1].indexOf("fa-") === 0 ? l[1].slice(3) : l[1]
              , e = m1(l[0]);
            return {
                prefix: e,
                iconName: g2(e, c) || c
            }
        }
        if (typeof l == "string" && (l.indexOf("".concat(M.cssPrefix, "-")) > -1 || l.match(g8))) {
            var i = d1(l.split(" "), {
                skipLookups: !0
            });
            return {
                prefix: i.prefix || p2(),
                iconName: g2(i.prefix, i.iconName) || i.iconName
            }
        }
        if (typeof l == "string") {
            var r = p2();
            return {
                prefix: r,
                iconName: g2(r, l) || l
            }
        }
    }
}
  , U = {
    noAuto: K8,
    config: M,
    dom: J8,
    parse: Z8,
    library: c0,
    findIconDefinition: B1,
    toHtml: O2
}
  , c5 = function() {
    var l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}
      , c = l.autoReplaceSvgRoot
      , e = c === void 0 ? A : c;
    (Object.keys($.styles).length > 0 || M.autoFetchSvg) && n2 && M.autoReplaceSvg && U.dom.i2svg({
        node: e
    })
};
function p1(a, l) {
    return Object.defineProperty(a, "abstract", {
        get: l
    }),
    Object.defineProperty(a, "html", {
        get: function() {
            return a.abstract.map(function(e) {
                return O2(e)
            })
        }
    }),
    Object.defineProperty(a, "node", {
        get: function() {
            if (n2) {
                var e = A.createElement("div");
                return e.innerHTML = a.html,
                e.children
            }
        }
    }),
    a
}
function a5(a) {
    var l = a.children
      , c = a.main
      , e = a.mask
      , i = a.attributes
      , r = a.styles
      , n = a.transform;
    if (X1(n) && c.found && !e.found) {
        var s = c.width
          , t = c.height
          , o = {
            x: s / t / 2,
            y: .5
        };
        i.style = f1(m(m({}, r), {}, {
            "transform-origin": "".concat(o.x + n.x / 16, "em ").concat(o.y + n.y / 16, "em")
        }))
    }
    return [{
        tag: "svg",
        attributes: i,
        children: l
    }]
}
function e5(a) {
    var l = a.prefix
      , c = a.iconName
      , e = a.children
      , i = a.attributes
      , r = a.symbol
      , n = r === !0 ? "".concat(l, "-").concat(M.cssPrefix, "-").concat(c) : r;
    return [{
        tag: "svg",
        attributes: {
            style: "display: none;"
        },
        children: [{
            tag: "symbol",
            attributes: m(m({}, i), {}, {
                id: n
            }),
            children: e
        }]
    }]
}
function l5(a) {
    var l = ["aria-label", "aria-labelledby", "title", "role"];
    return l.some(function(c) {
        return c in a
    })
}
function K1(a) {
    var l = a.icons
      , c = l.main
      , e = l.mask
      , i = a.prefix
      , r = a.iconName
      , n = a.transform
      , s = a.symbol
      , t = a.maskId
      , o = a.extra
      , f = a.watchable
      , d = f === void 0 ? !1 : f
      , v = e.found ? e : c
      , h = v.width
      , g = v.height
      , k = [M.replacementClass, r ? "".concat(M.cssPrefix, "-").concat(r) : ""].filter(function(Z) {
        return o.classes.indexOf(Z) === -1
    }).filter(function(Z) {
        return Z !== "" || !!Z
    }).concat(o.classes).join(" ")
      , F = {
        children: [],
        attributes: m(m({}, o.attributes), {}, {
            "data-prefix": i,
            "data-icon": r,
            class: k,
            role: o.attributes.role || "img",
            viewBox: "0 0 ".concat(h, " ").concat(g)
        })
    };
    !l5(o.attributes) && !o.attributes["aria-hidden"] && (F.attributes["aria-hidden"] = "true"),
    d && (F.attributes[L2] = "");
    var P = m(m({}, F), {}, {
        prefix: i,
        iconName: r,
        main: c,
        mask: e,
        maskId: t,
        transform: n,
        symbol: s,
        styles: m({}, o.styles)
    })
      , H = e.found && c.found ? u2("generateAbstractMask", P) || {
        children: [],
        attributes: {}
    } : u2("generateAbstractIcon", P) || {
        children: [],
        attributes: {}
    }
      , W = H.children
      , x2 = H.attributes;
    return P.children = W,
    P.attributes = x2,
    s ? e5(P) : a5(P)
}
function V4(a) {
    var l = a.content
      , c = a.width
      , e = a.height
      , i = a.transform
      , r = a.extra
      , n = a.watchable
      , s = n === void 0 ? !1 : n
      , t = m(m({}, r.attributes), {}, {
        class: r.classes.join(" ")
    });
    s && (t[L2] = "");
    var o = m({}, r.styles);
    X1(i) && (o.transform = _8({
        transform: i,
        startCentered: !0,
        width: c,
        height: e
    }),
    o["-webkit-transform"] = o.transform);
    var f = f1(o);
    f.length > 0 && (t.style = f);
    var d = [];
    return d.push({
        tag: "span",
        attributes: t,
        children: [l]
    }),
    d
}
function i5(a) {
    var l = a.content
      , c = a.extra
      , e = m(m({}, c.attributes), {}, {
        class: c.classes.join(" ")
    })
      , i = f1(c.styles);
    i.length > 0 && (e.style = i);
    var r = [];
    return r.push({
        tag: "span",
        attributes: e,
        children: [l]
    }),
    r
}
var y1 = $.styles;
function R1(a) {
    var l = a[0]
      , c = a[1]
      , e = a.slice(4)
      , i = o1(e, 1)
      , r = i[0]
      , n = null;
    return Array.isArray(r) ? n = {
        tag: "g",
        attributes: {
            class: "".concat(M.cssPrefix, "-").concat(x1.GROUP)
        },
        children: [{
            tag: "path",
            attributes: {
                class: "".concat(M.cssPrefix, "-").concat(x1.SECONDARY),
                fill: "currentColor",
                d: r[0]
            }
        }, {
            tag: "path",
            attributes: {
                class: "".concat(M.cssPrefix, "-").concat(x1.PRIMARY),
                fill: "currentColor",
                d: r[1]
            }
        }]
    } : n = {
        tag: "path",
        attributes: {
            fill: "currentColor",
            d: r
        }
    },
    {
        found: !0,
        width: l,
        height: c,
        icon: n
    }
}
var r5 = {
    found: !1,
    width: 512,
    height: 512
};
function n5(a, l) {
    !B3 && !M.showMissingIcons && a && console.error('Icon with name "'.concat(a, '" and prefix "').concat(l, '" is missing.'))
}
function I1(a, l) {
    var c = l;
    return l === "fa" && M.styleDefault !== null && (l = p2()),
    new Promise(function(e, i) {
        if (c === "fa") {
            var r = J3(a) || {};
            a = r.iconName || a,
            l = r.prefix || l
        }
        if (a && l && y1[l] && y1[l][a]) {
            var n = y1[l][a];
            return e(R1(n))
        }
        n5(a, l),
        e(m(m({}, r5), {}, {
            icon: M.showMissingIcons && a ? u2("missingIconAbstract") || {} : {}
        }))
    }
    )
}
var $4 = function() {}
  , H1 = M.measurePerformance && a1 && a1.mark && a1.measure ? a1 : {
    mark: $4,
    measure: $4
}
  , F2 = 'FA "7.1.0"'
  , s5 = function(l) {
    return H1.mark("".concat(F2, " ").concat(l, " begins")),
    function() {
        return a0(l)
    }
}
  , a0 = function(l) {
    H1.mark("".concat(F2, " ").concat(l, " ends")),
    H1.measure("".concat(F2, " ").concat(l), "".concat(F2, " ").concat(l, " begins"), "".concat(F2, " ").concat(l, " ends"))
}
  , J1 = {
    begin: s5,
    end: a0
}
  , i1 = function() {};
function X4(a) {
    var l = a.getAttribute ? a.getAttribute(L2) : null;
    return typeof l == "string"
}
function t5(a) {
    var l = a.getAttribute ? a.getAttribute(q1) : null
      , c = a.getAttribute ? a.getAttribute(G1) : null;
    return l && c
}
function o5(a) {
    return a && a.classList && a.classList.contains && a.classList.contains(M.replacementClass)
}
function f5() {
    if (M.autoReplaceSvg === !0)
        return r1.replace;
    var a = r1[M.autoReplaceSvg];
    return a || r1.replace
}
function m5(a) {
    return A.createElementNS("http://www.w3.org/2000/svg", a)
}
function d5(a) {
    return A.createElement(a)
}
function e0(a) {
    var l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}
      , c = l.ceFn
      , e = c === void 0 ? a.tag === "svg" ? m5 : d5 : c;
    if (typeof a == "string")
        return A.createTextNode(a);
    var i = e(a.tag);
    Object.keys(a.attributes || []).forEach(function(n) {
        i.setAttribute(n, a.attributes[n])
    });
    var r = a.children || [];
    return r.forEach(function(n) {
        i.appendChild(e0(n, {
            ceFn: e
        }))
    }),
    i
}
function p5(a) {
    var l = " ".concat(a.outerHTML, " ");
    return l = "".concat(l, "Font Awesome fontawesome.com "),
    l
}
var r1 = {
    replace: function(l) {
        var c = l[0];
        if (c.parentNode)
            if (l[1].forEach(function(i) {
                c.parentNode.insertBefore(e0(i), c)
            }),
            c.getAttribute(L2) === null && M.keepOriginalSource) {
                var e = A.createComment(p5(c));
                c.parentNode.replaceChild(e, c)
            } else
                c.remove()
    },
    nest: function(l) {
        var c = l[0]
          , e = l[1];
        if (~$1(c).indexOf(M.replacementClass))
            return r1.replace(l);
        var i = new RegExp("".concat(M.cssPrefix, "-.*"));
        if (delete e[0].attributes.id,
        e[0].attributes.class) {
            var r = e[0].attributes.class.split(" ").reduce(function(s, t) {
                return t === M.replacementClass || t.match(i) ? s.toSvg.push(t) : s.toNode.push(t),
                s
            }, {
                toNode: [],
                toSvg: []
            });
            e[0].attributes.class = r.toSvg.join(" "),
            r.toNode.length === 0 ? c.removeAttribute("class") : c.setAttribute("class", r.toNode.join(" "))
        }
        var n = e.map(function(s) {
            return O2(s)
        }).join(`
`);
        c.setAttribute(L2, ""),
        c.innerHTML = n
    }
};
function Y4(a) {
    a()
}
function l0(a, l) {
    var c = typeof l == "function" ? l : i1;
    if (a.length === 0)
        c();
    else {
        var e = Y4;
        M.mutateApproach === v8 && (e = d2.requestAnimationFrame || Y4),
        e(function() {
            var i = f5()
              , r = J1.begin("mutate");
            a.map(i),
            r(),
            c()
        })
    }
}
var Z1 = !1;
function i0() {
    Z1 = !0
}
function O1() {
    Z1 = !1
}
var t1 = null;
function Q4(a) {
    if (D4 && M.observeMutations) {
        var l = a.treeCallback
          , c = l === void 0 ? i1 : l
          , e = a.nodeCallback
          , i = e === void 0 ? i1 : e
          , r = a.pseudoElementsCallback
          , n = r === void 0 ? i1 : r
          , s = a.observeMutationsRoot
          , t = s === void 0 ? A : s;
        t1 = new D4(function(o) {
            if (!Z1) {
                var f = p2();
                _2(o).forEach(function(d) {
                    if (d.type === "childList" && d.addedNodes.length > 0 && !X4(d.addedNodes[0]) && (M.searchPseudoElements && n(d.target),
                    c(d.target)),
                    d.type === "attributes" && d.target.parentNode && M.searchPseudoElements && n([d.target], !0),
                    d.type === "attributes" && X4(d.target) && ~x8.indexOf(d.attributeName))
                        if (d.attributeName === "class" && t5(d.target)) {
                            var v = d1($1(d.target))
                              , h = v.prefix
                              , g = v.iconName;
                            d.target.setAttribute(q1, h || f),
                            g && d.target.setAttribute(G1, g)
                        } else
                            o5(d.target) && i(d.target)
                })
            }
        }
        ),
        n2 && t1.observe(t, {
            childList: !0,
            attributes: !0,
            characterData: !0,
            subtree: !0
        })
    }
}
function u5() {
    t1 && t1.disconnect()
}
function z5(a) {
    var l = a.getAttribute("style")
      , c = [];
    return l && (c = l.split(";").reduce(function(e, i) {
        var r = i.split(":")
          , n = r[0]
          , s = r.slice(1);
        return n && s.length > 0 && (e[n] = s.join(":").trim()),
        e
    }, {})),
    c
}
function v5(a) {
    var l = a.getAttribute("data-prefix")
      , c = a.getAttribute("data-icon")
      , e = a.innerText !== void 0 ? a.innerText.trim() : ""
      , i = d1($1(a));
    return i.prefix || (i.prefix = p2()),
    l && c && (i.prefix = l,
    i.iconName = c),
    i.iconName && i.prefix || (i.prefix && e.length > 0 && (i.iconName = O8(i.prefix, a.innerText) || Q1(i.prefix, q3(a.innerText))),
    !i.iconName && M.autoFetchSvg && a.firstChild && a.firstChild.nodeType === Node.TEXT_NODE && (i.iconName = a.firstChild.data)),
    i
}
function h5(a) {
    var l = _2(a.attributes).reduce(function(c, e) {
        return c.name !== "class" && c.name !== "style" && (c[e.name] = e.value),
        c
    }, {});
    return l
}
function M5() {
    return {
        iconName: null,
        prefix: null,
        transform: K,
        symbol: !1,
        mask: {
            iconName: null,
            prefix: null,
            rest: []
        },
        maskId: null,
        extra: {
            classes: [],
            styles: {},
            attributes: {}
        }
    }
}
function K4(a) {
    var l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
        styleParser: !0
    }
      , c = v5(a)
      , e = c.iconName
      , i = c.prefix
      , r = c.rest
      , n = h5(a)
      , s = E1("parseNodeAttributes", {}, a)
      , t = l.styleParser ? z5(a) : [];
    return m({
        iconName: e,
        prefix: i,
        transform: K,
        mask: {
            iconName: null,
            prefix: null,
            rest: []
        },
        maskId: null,
        symbol: !1,
        extra: {
            classes: r,
            styles: t,
            attributes: n
        }
    }, s)
}
var g5 = $.styles;
function r0(a) {
    var l = M.autoReplaceSvg === "nest" ? K4(a, {
        styleParser: !1
    }) : K4(a);
    return ~l.extra.classes.indexOf(I3) ? u2("generateLayersText", a, l) : u2("generateSvgReplacementMutation", a, l)
}
function L5() {
    return [].concat(X(P3), X(_3))
}
function J4(a) {
    var l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    if (!n2)
        return Promise.resolve();
    var c = A.documentElement.classList
      , e = function(d) {
        return c.add("".concat(B4, "-").concat(d))
    }
      , i = function(d) {
        return c.remove("".concat(B4, "-").concat(d))
    }
      , r = M.autoFetchSvg ? L5() : d3.concat(Object.keys(g5));
    r.includes("fa") || r.push("fa");
    var n = [".".concat(I3, ":not([").concat(L2, "])")].concat(r.map(function(f) {
        return ".".concat(f, ":not([").concat(L2, "])")
    })).join(", ");
    if (n.length === 0)
        return Promise.resolve();
    var s = [];
    try {
        s = _2(a.querySelectorAll(n))
    } catch {}
    if (s.length > 0)
        e("pending"),
        i("complete");
    else
        return Promise.resolve();
    var t = J1.begin("onTree")
      , o = s.reduce(function(f, d) {
        try {
            var v = r0(d);
            v && f.push(v)
        } catch (h) {
            B3 || h.name === "MissingIcon" && console.error(h)
        }
        return f
    }, []);
    return new Promise(function(f, d) {
        Promise.all(o).then(function(v) {
            l0(v, function() {
                e("active"),
                e("complete"),
                i("pending"),
                typeof l == "function" && l(),
                t(),
                f()
            })
        }).catch(function(v) {
            t(),
            d(v)
        })
    }
    )
}
function C5(a) {
    var l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    r0(a).then(function(c) {
        c && l0([c], l)
    })
}
function x5(a) {
    return function(l) {
        var c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}
          , e = (l || {}).icon ? l : B1(l || {})
          , i = c.mask;
        return i && (i = (i || {}).icon ? i : B1(i || {})),
        a(e, m(m({}, c), {}, {
            mask: i
        }))
    }
}
var b5 = function(l) {
    var c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}
      , e = c.transform
      , i = e === void 0 ? K : e
      , r = c.symbol
      , n = r === void 0 ? !1 : r
      , s = c.mask
      , t = s === void 0 ? null : s
      , o = c.maskId
      , f = o === void 0 ? null : o
      , d = c.classes
      , v = d === void 0 ? [] : d
      , h = c.attributes
      , g = h === void 0 ? {} : h
      , k = c.styles
      , F = k === void 0 ? {} : k;
    if (l) {
        var P = l.prefix
          , H = l.iconName
          , W = l.icon;
        return p1(m({
            type: "icon"
        }, l), function() {
            return C2("beforeDOMElementCreation", {
                iconDefinition: l,
                params: c
            }),
            K1({
                icons: {
                    main: R1(W),
                    mask: t ? R1(t.icon) : {
                        found: !1,
                        width: null,
                        height: null,
                        icon: {}
                    }
                },
                prefix: P,
                iconName: H,
                transform: m(m({}, K), i),
                symbol: n,
                maskId: f,
                extra: {
                    attributes: g,
                    styles: F,
                    classes: v
                }
            })
        })
    }
}
  , S5 = {
    mixout: function() {
        return {
            icon: x5(b5)
        }
    },
    hooks: function() {
        return {
            mutationObserverCallbacks: function(c) {
                return c.treeCallback = J4,
                c.nodeCallback = C5,
                c
            }
        }
    },
    provides: function(l) {
        l.i2svg = function(c) {
            var e = c.node
              , i = e === void 0 ? A : e
              , r = c.callback
              , n = r === void 0 ? function() {}
            : r;
            return J4(i, n)
        }
        ,
        l.generateSvgReplacementMutation = function(c, e) {
            var i = e.iconName
              , r = e.prefix
              , n = e.transform
              , s = e.symbol
              , t = e.mask
              , o = e.maskId
              , f = e.extra;
            return new Promise(function(d, v) {
                Promise.all([I1(i, r), t.iconName ? I1(t.iconName, t.prefix) : Promise.resolve({
                    found: !1,
                    width: 512,
                    height: 512,
                    icon: {}
                })]).then(function(h) {
                    var g = o1(h, 2)
                      , k = g[0]
                      , F = g[1];
                    d([c, K1({
                        icons: {
                            main: k,
                            mask: F
                        },
                        prefix: r,
                        iconName: i,
                        transform: n,
                        symbol: s,
                        maskId: o,
                        extra: f,
                        watchable: !0
                    })])
                }).catch(v)
            }
            )
        }
        ,
        l.generateAbstractIcon = function(c) {
            var e = c.children
              , i = c.attributes
              , r = c.main
              , n = c.transform
              , s = c.styles
              , t = f1(s);
            t.length > 0 && (i.style = t);
            var o;
            return X1(n) && (o = u2("generateAbstractTransformGrouping", {
                main: r,
                transform: n,
                containerWidth: r.width,
                iconWidth: r.width
            })),
            e.push(o || r.icon),
            {
                children: e,
                attributes: i
            }
        }
    }
}
  , y5 = {
    mixout: function() {
        return {
            layer: function(c) {
                var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}
                  , i = e.classes
                  , r = i === void 0 ? [] : i;
                return p1({
                    type: "layer"
                }, function() {
                    C2("beforeDOMElementCreation", {
                        assembler: c,
                        params: e
                    });
                    var n = [];
                    return c(function(s) {
                        Array.isArray(s) ? s.map(function(t) {
                            n = n.concat(t.abstract)
                        }) : n = n.concat(s.abstract)
                    }),
                    [{
                        tag: "span",
                        attributes: {
                            class: ["".concat(M.cssPrefix, "-layers")].concat(X(r)).join(" ")
                        },
                        children: n
                    }]
                })
            }
        }
    }
}
  , N5 = {
    mixout: function() {
        return {
            counter: function(c) {
                var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}
                  , i = e.title
                  , r = i === void 0 ? null : i
                  , n = e.classes
                  , s = n === void 0 ? [] : n
                  , t = e.attributes
                  , o = t === void 0 ? {} : t
                  , f = e.styles
                  , d = f === void 0 ? {} : f;
                return p1({
                    type: "counter",
                    content: c
                }, function() {
                    return C2("beforeDOMElementCreation", {
                        content: c,
                        params: e
                    }),
                    i5({
                        content: c.toString(),
                        title: r,
                        extra: {
                            attributes: o,
                            styles: d,
                            classes: ["".concat(M.cssPrefix, "-layers-counter")].concat(X(s))
                        }
                    })
                })
            }
        }
    }
}
  , w5 = {
    mixout: function() {
        return {
            text: function(c) {
                var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}
                  , i = e.transform
                  , r = i === void 0 ? K : i
                  , n = e.classes
                  , s = n === void 0 ? [] : n
                  , t = e.attributes
                  , o = t === void 0 ? {} : t
                  , f = e.styles
                  , d = f === void 0 ? {} : f;
                return p1({
                    type: "text",
                    content: c
                }, function() {
                    return C2("beforeDOMElementCreation", {
                        content: c,
                        params: e
                    }),
                    V4({
                        content: c,
                        transform: m(m({}, K), r),
                        extra: {
                            attributes: o,
                            styles: d,
                            classes: ["".concat(M.cssPrefix, "-layers-text")].concat(X(s))
                        }
                    })
                })
            }
        }
    },
    provides: function(l) {
        l.generateLayersText = function(c, e) {
            var i = e.transform
              , r = e.extra
              , n = null
              , s = null;
            if (f3) {
                var t = parseInt(getComputedStyle(c).fontSize, 10)
                  , o = c.getBoundingClientRect();
                n = o.width / t,
                s = o.height / t
            }
            return Promise.resolve([c, V4({
                content: c.innerHTML,
                width: n,
                height: s,
                transform: i,
                extra: r,
                watchable: !0
            })])
        }
    }
}
  , n0 = new RegExp('"',"ug")
  , Z4 = [1105920, 1112319]
  , c3 = m(m(m(m({}, {
    FontAwesome: {
        normal: "fas",
        400: "fas"
    }
}), o6), u8), M6)
  , U1 = Object.keys(c3).reduce(function(a, l) {
    return a[l.toLowerCase()] = c3[l],
    a
}, {})
  , k5 = Object.keys(U1).reduce(function(a, l) {
    var c = U1[l];
    return a[l] = c[900] || X(Object.entries(c))[0][1],
    a
}, {});
function A5(a) {
    var l = a.replace(n0, "");
    return q3(X(l)[0] || "")
}
function P5(a) {
    var l = a.getPropertyValue("font-feature-settings").includes("ss01")
      , c = a.getPropertyValue("content")
      , e = c.replace(n0, "")
      , i = e.codePointAt(0)
      , r = i >= Z4[0] && i <= Z4[1]
      , n = e.length === 2 ? e[0] === e[1] : !1;
    return r || n || l
}
function _5(a, l) {
    var c = a.replace(/^['"]|['"]$/g, "").toLowerCase()
      , e = parseInt(l)
      , i = isNaN(e) ? "normal" : e;
    return (U1[c] || {})[i] || k5[c]
}
function a3(a, l) {
    var c = "".concat(z8).concat(l.replace(":", "-"));
    return new Promise(function(e, i) {
        if (a.getAttribute(c) !== null)
            return e();
        var r = _2(a.children)
          , n = r.filter(function(M1) {
            return M1.getAttribute(P1) === l
        })[0]
          , s = d2.getComputedStyle(a, l)
          , t = s.getPropertyValue("font-family")
          , o = t.match(L8)
          , f = s.getPropertyValue("font-weight")
          , d = s.getPropertyValue("content");
        if (n && !o)
            return a.removeChild(n),
            e();
        if (o && d !== "none" && d !== "") {
            var v = s.getPropertyValue("content")
              , h = _5(t, f)
              , g = A5(v)
              , k = o[0].startsWith("FontAwesome")
              , F = P5(s)
              , P = Q1(h, g)
              , H = P;
            if (k) {
                var W = U8(g);
                W.iconName && W.prefix && (P = W.iconName,
                h = W.prefix)
            }
            if (P && !F && (!n || n.getAttribute(q1) !== h || n.getAttribute(G1) !== H)) {
                a.setAttribute(c, H),
                n && a.removeChild(n);
                var x2 = M5()
                  , Z = x2.extra;
                Z.attributes[P1] = l,
                I1(P, h).then(function(M1) {
                    var A0 = K1(m(m({}, x2), {}, {
                        icons: {
                            main: M1,
                            mask: Z3()
                        },
                        prefix: h,
                        iconName: H,
                        extra: Z,
                        watchable: !0
                    }))
                      , g1 = A.createElementNS("http://www.w3.org/2000/svg", "svg");
                    l === "::before" ? a.insertBefore(g1, a.firstChild) : a.appendChild(g1),
                    g1.outerHTML = A0.map(function(P0) {
                        return O2(P0)
                    }).join(`
`),
                    a.removeAttribute(c),
                    e()
                }).catch(i)
            } else
                e()
        } else
            e()
    }
    )
}
function T5(a) {
    return Promise.all([a3(a, "::before"), a3(a, "::after")])
}
function D5(a) {
    return a.parentNode !== document.head && !~h8.indexOf(a.tagName.toUpperCase()) && !a.getAttribute(P1) && (!a.parentNode || a.parentNode.tagName !== "svg")
}
var F5 = function(l) {
    return !!l && E3.some(function(c) {
        return l.includes(c)
    })
}
  , E5 = function(l) {
    if (!l)
        return [];
    var c = new Set
      , e = l.split(/,(?![^()]*\))/).map(function(t) {
        return t.trim()
    });
    e = e.flatMap(function(t) {
        return t.includes("(") ? t : t.split(",").map(function(o) {
            return o.trim()
        })
    });
    var i = l1(e), r;
    try {
        for (i.s(); !(r = i.n()).done; ) {
            var n = r.value;
            if (F5(n)) {
                var s = E3.reduce(function(t, o) {
                    return t.replace(o, "")
                }, n);
                s !== "" && s !== "*" && c.add(s)
            }
        }
    } catch (t) {
        i.e(t)
    } finally {
        i.f()
    }
    return c
};
function e3(a) {
    var l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    if (n2) {
        var c;
        if (l)
            c = a;
        else if (M.searchPseudoElementsFullScan)
            c = a.querySelectorAll("*");
        else {
            var e = new Set, i = l1(document.styleSheets), r;
            try {
                for (i.s(); !(r = i.n()).done; ) {
                    var n = r.value;
                    try {
                        var s = l1(n.cssRules), t;
                        try {
                            for (s.s(); !(t = s.n()).done; ) {
                                var o = t.value, f = E5(o.selectorText), d = l1(f), v;
                                try {
                                    for (d.s(); !(v = d.n()).done; ) {
                                        var h = v.value;
                                        e.add(h)
                                    }
                                } catch (k) {
                                    d.e(k)
                                } finally {
                                    d.f()
                                }
                            }
                        } catch (k) {
                            s.e(k)
                        } finally {
                            s.f()
                        }
                    } catch (k) {
                        M.searchPseudoElementsWarnings && console.warn("Font Awesome: cannot parse stylesheet: ".concat(n.href, " (").concat(k.message, `)
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`))
                    }
                }
            } catch (k) {
                i.e(k)
            } finally {
                i.f()
            }
            if (!e.size)
                return;
            var g = Array.from(e).join(", ");
            try {
                c = a.querySelectorAll(g)
            } catch {}
        }
        return new Promise(function(k, F) {
            var P = _2(c).filter(D5).map(T5)
              , H = J1.begin("searchPseudoElements");
            i0(),
            Promise.all(P).then(function() {
                H(),
                O1(),
                k()
            }).catch(function() {
                H(),
                O1(),
                F()
            })
        }
        )
    }
}
var B5 = {
    hooks: function() {
        return {
            mutationObserverCallbacks: function(c) {
                return c.pseudoElementsCallback = e3,
                c
            }
        }
    },
    provides: function(l) {
        l.pseudoElements2svg = function(c) {
            var e = c.node
              , i = e === void 0 ? A : e;
            M.searchPseudoElements && e3(i)
        }
    }
}
  , l3 = !1
  , R5 = {
    mixout: function() {
        return {
            dom: {
                unwatch: function() {
                    i0(),
                    l3 = !0
                }
            }
        }
    },
    hooks: function() {
        return {
            bootstrap: function() {
                Q4(E1("mutationObserverCallbacks", {}))
            },
            noAuto: function() {
                u5()
            },
            watch: function(c) {
                var e = c.observeMutationsRoot;
                l3 ? O1() : Q4(E1("mutationObserverCallbacks", {
                    observeMutationsRoot: e
                }))
            }
        }
    }
}
  , i3 = function(l) {
    var c = {
        size: 16,
        x: 0,
        y: 0,
        flipX: !1,
        flipY: !1,
        rotate: 0
    };
    return l.toLowerCase().split(" ").reduce(function(e, i) {
        var r = i.toLowerCase().split("-")
          , n = r[0]
          , s = r.slice(1).join("-");
        if (n && s === "h")
            return e.flipX = !0,
            e;
        if (n && s === "v")
            return e.flipY = !0,
            e;
        if (s = parseFloat(s),
        isNaN(s))
            return e;
        switch (n) {
        case "grow":
            e.size = e.size + s;
            break;
        case "shrink":
            e.size = e.size - s;
            break;
        case "left":
            e.x = e.x - s;
            break;
        case "right":
            e.x = e.x + s;
            break;
        case "up":
            e.y = e.y - s;
            break;
        case "down":
            e.y = e.y + s;
            break;
        case "rotate":
            e.rotate = e.rotate + s;
            break
        }
        return e
    }, c)
}
  , I5 = {
    mixout: function() {
        return {
            parse: {
                transform: function(c) {
                    return i3(c)
                }
            }
        }
    },
    hooks: function() {
        return {
            parseNodeAttributes: function(c, e) {
                var i = e.getAttribute("data-fa-transform");
                return i && (c.transform = i3(i)),
                c
            }
        }
    },
    provides: function(l) {
        l.generateAbstractTransformGrouping = function(c) {
            var e = c.main
              , i = c.transform
              , r = c.containerWidth
              , n = c.iconWidth
              , s = {
                transform: "translate(".concat(r / 2, " 256)")
            }
              , t = "translate(".concat(i.x * 32, ", ").concat(i.y * 32, ") ")
              , o = "scale(".concat(i.size / 16 * (i.flipX ? -1 : 1), ", ").concat(i.size / 16 * (i.flipY ? -1 : 1), ") ")
              , f = "rotate(".concat(i.rotate, " 0 0)")
              , d = {
                transform: "".concat(t, " ").concat(o, " ").concat(f)
            }
              , v = {
                transform: "translate(".concat(n / 2 * -1, " -256)")
            }
              , h = {
                outer: s,
                inner: d,
                path: v
            };
            return {
                tag: "g",
                attributes: m({}, h.outer),
                children: [{
                    tag: "g",
                    attributes: m({}, h.inner),
                    children: [{
                        tag: e.icon.tag,
                        children: e.icon.children,
                        attributes: m(m({}, e.icon.attributes), h.path)
                    }]
                }]
            }
        }
    }
}
  , N1 = {
    x: 0,
    y: 0,
    width: "100%",
    height: "100%"
};
function r3(a) {
    var l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
    return a.attributes && (a.attributes.fill || l) && (a.attributes.fill = "black"),
    a
}
function H5(a) {
    return a.tag === "g" ? a.children : [a]
}
var O5 = {
    hooks: function() {
        return {
            parseNodeAttributes: function(c, e) {
                var i = e.getAttribute("data-fa-mask")
                  , r = i ? d1(i.split(" ").map(function(n) {
                    return n.trim()
                })) : Z3();
                return r.prefix || (r.prefix = p2()),
                c.mask = r,
                c.maskId = e.getAttribute("data-fa-mask-id"),
                c
            }
        }
    },
    provides: function(l) {
        l.generateAbstractMask = function(c) {
            var e = c.children
              , i = c.attributes
              , r = c.main
              , n = c.mask
              , s = c.maskId
              , t = c.transform
              , o = r.width
              , f = r.icon
              , d = n.width
              , v = n.icon
              , h = P8({
                transform: t,
                containerWidth: d,
                iconWidth: o
            })
              , g = {
                tag: "rect",
                attributes: m(m({}, N1), {}, {
                    fill: "white"
                })
            }
              , k = f.children ? {
                children: f.children.map(r3)
            } : {}
              , F = {
                tag: "g",
                attributes: m({}, h.inner),
                children: [r3(m({
                    tag: f.tag,
                    attributes: m(m({}, f.attributes), h.path)
                }, k))]
            }
              , P = {
                tag: "g",
                attributes: m({}, h.outer),
                children: [F]
            }
              , H = "mask-".concat(s || H4())
              , W = "clip-".concat(s || H4())
              , x2 = {
                tag: "mask",
                attributes: m(m({}, N1), {}, {
                    id: H,
                    maskUnits: "userSpaceOnUse",
                    maskContentUnits: "userSpaceOnUse"
                }),
                children: [g, P]
            }
              , Z = {
                tag: "defs",
                children: [{
                    tag: "clipPath",
                    attributes: {
                        id: W
                    },
                    children: H5(v)
                }, x2]
            };
            return e.push(Z, {
                tag: "rect",
                attributes: m({
                    fill: "currentColor",
                    "clip-path": "url(#".concat(W, ")"),
                    mask: "url(#".concat(H, ")")
                }, N1)
            }),
            {
                children: e,
                attributes: i
            }
        }
    }
}
  , U5 = {
    provides: function(l) {
        var c = !1;
        d2.matchMedia && (c = d2.matchMedia("(prefers-reduced-motion: reduce)").matches),
        l.missingIconAbstract = function() {
            var e = []
              , i = {
                fill: "currentColor"
            }
              , r = {
                attributeType: "XML",
                repeatCount: "indefinite",
                dur: "2s"
            };
            e.push({
                tag: "path",
                attributes: m(m({}, i), {}, {
                    d: "M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"
                })
            });
            var n = m(m({}, r), {}, {
                attributeName: "opacity"
            })
              , s = {
                tag: "circle",
                attributes: m(m({}, i), {}, {
                    cx: "256",
                    cy: "364",
                    r: "28"
                }),
                children: []
            };
            return c || s.children.push({
                tag: "animate",
                attributes: m(m({}, r), {}, {
                    attributeName: "r",
                    values: "28;14;28;28;14;28;"
                })
            }, {
                tag: "animate",
                attributes: m(m({}, n), {}, {
                    values: "1;0;1;1;0;1;"
                })
            }),
            e.push(s),
            e.push({
                tag: "path",
                attributes: m(m({}, i), {}, {
                    opacity: "1",
                    d: "M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"
                }),
                children: c ? [] : [{
                    tag: "animate",
                    attributes: m(m({}, n), {}, {
                        values: "1;0;0;0;0;1;"
                    })
                }]
            }),
            c || e.push({
                tag: "path",
                attributes: m(m({}, i), {}, {
                    opacity: "0",
                    d: "M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"
                }),
                children: [{
                    tag: "animate",
                    attributes: m(m({}, n), {}, {
                        values: "0;0;1;1;0;0;"
                    })
                }]
            }),
            {
                tag: "g",
                attributes: {
                    class: "missing"
                },
                children: e
            }
        }
    }
}
  , W5 = {
    hooks: function() {
        return {
            parseNodeAttributes: function(c, e) {
                var i = e.getAttribute("data-fa-symbol")
                  , r = i === null ? !1 : i === "" ? !0 : i;
                return c.symbol = r,
                c
            }
        }
    }
}
  , j5 = [D8, S5, y5, N5, w5, B5, R5, I5, O5, U5, W5];
Q8(j5, {
    mixoutsTo: U
});
var E9 = U.noAuto
  , B9 = U.config
  , R9 = U.library
  , I9 = U.dom
  , s0 = U.parse
  , H9 = U.findIconDefinition
  , O9 = U.toHtml
  , t0 = U.icon
  , U9 = U.layer
  , q5 = U.text
  , G5 = U.counter;
var V5 = ["*"]
  , $5 = a => {
    throw new Error(`Could not find icon with iconName=${a.iconName} and prefix=${a.prefix} in the icon library.`)
}
  , X5 = () => {
    throw new Error("Property `icon` is required for `fa-icon`/`fa-duotone-icon` components.")
}
  , Y5 = a => {
    let l = {
        [`fa-${a.animation}`]: a.animation != null && !a.animation.startsWith("spin"),
        "fa-spin": a.animation === "spin" || a.animation === "spin-reverse",
        "fa-spin-pulse": a.animation === "spin-pulse" || a.animation === "spin-pulse-reverse",
        "fa-spin-reverse": a.animation === "spin-reverse" || a.animation === "spin-pulse-reverse",
        "fa-pulse": a.animation === "spin-pulse" || a.animation === "spin-pulse-reverse",
        "fa-fw": a.fixedWidth,
        "fa-border": a.border,
        "fa-inverse": a.inverse,
        "fa-layers-counter": a.counter,
        "fa-flip-horizontal": a.flip === "horizontal" || a.flip === "both",
        "fa-flip-vertical": a.flip === "vertical" || a.flip === "both",
        [`fa-${a.size}`]: a.size !== null,
        [`fa-rotate-${a.rotate}`]: a.rotate !== null,
        [`fa-pull-${a.pull}`]: a.pull !== null,
        [`fa-stack-${a.stackItemSize}`]: a.stackItemSize != null
    };
    return Object.keys(l).map(c => l[c] ? c : null).filter(c => c)
}
  , Q5 = a => a.prefix !== void 0 && a.iconName !== void 0
  , K5 = (a, l) => Q5(a) ? a : typeof a == "string" ? {
    prefix: l,
    iconName: a
} : {
    prefix: a[0],
    iconName: a[1]
}
  , J5 = ( () => {
    class a {
        constructor() {
            this.defaultPrefix = "fas",
            this.fallbackIcon = null
        }
        static{this.\u0275fac = function(e) {
            return new (e || a)
        }
        }static{this.\u0275prov = O({
            token: a,
            factory: a.\u0275fac,
            providedIn: "root"
        })
        }
    }
    return a
}
)()
  , Z5 = ( () => {
    class a {
        constructor() {
            this.definitions = {}
        }
        addIcons(...c) {
            for (let e of c) {
                e.prefix in this.definitions || (this.definitions[e.prefix] = {}),
                this.definitions[e.prefix][e.iconName] = e;
                for (let i of e.icon[2])
                    typeof i == "string" && (this.definitions[e.prefix][i] = e)
            }
        }
        addIconPacks(...c) {
            for (let e of c) {
                let i = Object.keys(e).map(r => e[r]);
                this.addIcons(...i)
            }
        }
        getIconDefinition(c, e) {
            return c in this.definitions && e in this.definitions[c] ? this.definitions[c][e] : null
        }
        static{this.\u0275fac = function(e) {
            return new (e || a)
        }
        }static{this.\u0275prov = O({
            token: a,
            factory: a.\u0275fac,
            providedIn: "root"
        })
        }
    }
    return a
}
)()
  , c7 = ( () => {
    class a {
        constructor() {
            this.stackItemSize = "1x"
        }
        ngOnChanges(c) {
            if ("size"in c)
                throw new Error('fa-icon is not allowed to customize size when used inside fa-stack. Set size on the enclosing fa-stack instead: <fa-stack size="4x">...</fa-stack>.')
        }
        static{this.\u0275fac = function(e) {
            return new (e || a)
        }
        }static{this.\u0275dir = d4({
            type: a,
            selectors: [["fa-icon", "stackItemSize", ""], ["fa-duotone-icon", "stackItemSize", ""]],
            inputs: {
                stackItemSize: "stackItemSize",
                size: "size"
            },
            features: [V2]
        })
        }
    }
    return a
}
)()
  , a7 = ( () => {
    class a {
        constructor(c, e) {
            this.renderer = c,
            this.elementRef = e
        }
        ngOnInit() {
            this.renderer.addClass(this.elementRef.nativeElement, "fa-stack")
        }
        ngOnChanges(c) {
            "size"in c && (c.size.currentValue != null && this.renderer.addClass(this.elementRef.nativeElement, `fa-${c.size.currentValue}`),
            c.size.previousValue != null && this.renderer.removeClass(this.elementRef.nativeElement, `fa-${c.size.previousValue}`))
        }
        static{this.\u0275fac = function(e) {
            return new (e || a)(t2(f4),t2(t4))
        }
        }static{this.\u0275cmp = j({
            type: a,
            selectors: [["fa-stack"]],
            inputs: {
                size: "size"
            },
            features: [V2],
            ngContentSelectors: V5,
            decls: 1,
            vars: 0,
            template: function(e, i) {
                e & 1 && (u4(),
                z4(0))
            },
            encapsulation: 2
        })
        }
    }
    return a
}
)()
  , u1 = ( () => {
    class a {
        set spin(c) {
            this.animation = c ? "spin" : void 0
        }
        set pulse(c) {
            this.animation = c ? "spin-pulse" : void 0
        }
        constructor(c, e, i, r, n) {
            this.sanitizer = c,
            this.config = e,
            this.iconLibrary = i,
            this.stackItem = r,
            this.classes = [],
            n != null && r == null && console.error('FontAwesome: fa-icon and fa-duotone-icon elements must specify stackItemSize attribute when wrapped into fa-stack. Example: <fa-icon stackItemSize="2x"></fa-icon>.')
        }
        ngOnChanges(c) {
            if (this.icon == null && this.config.fallbackIcon == null) {
                X5();
                return
            }
            if (c) {
                let e = this.icon != null ? this.icon : this.config.fallbackIcon
                  , i = this.findIconDefinition(e);
                if (i != null) {
                    let r = this.buildParams();
                    this.renderIcon(i, r)
                }
            }
        }
        render() {
            this.ngOnChanges({})
        }
        findIconDefinition(c) {
            let e = K5(c, this.config.defaultPrefix);
            if ("icon"in e)
                return e;
            let i = this.iconLibrary.getIconDefinition(e.prefix, e.iconName);
            return i ?? ($5(e),
            null)
        }
        buildParams() {
            let c = {
                flip: this.flip,
                animation: this.animation,
                border: this.border,
                inverse: this.inverse,
                size: this.size || null,
                pull: this.pull || null,
                rotate: this.rotate || null,
                fixedWidth: typeof this.fixedWidth == "boolean" ? this.fixedWidth : this.config.fixedWidth,
                stackItemSize: this.stackItem != null ? this.stackItem.stackItemSize : null
            }
              , e = typeof this.transform == "string" ? s0.transform(this.transform) : this.transform;
            return {
                title: this.title,
                transform: e,
                classes: [...Y5(c), ...this.classes],
                mask: this.mask != null ? this.findIconDefinition(this.mask) : null,
                styles: this.styles != null ? this.styles : {},
                symbol: this.symbol,
                attributes: {
                    role: this.a11yRole
                }
            }
        }
        renderIcon(c, e) {
            let i = t0(c, e);
            this.renderedIconHTML = this.sanitizer.bypassSecurityTrustHtml(i.html.join(`
`))
        }
        static{this.\u0275fac = function(e) {
            return new (e || a)(t2(y4),t2(J5),t2(Z5),t2(c7, 8),t2(a7, 8))
        }
        }static{this.\u0275cmp = j({
            type: a,
            selectors: [["fa-icon"]],
            hostAttrs: [1, "ng-fa-icon"],
            hostVars: 2,
            hostBindings: function(e, i) {
                e & 2 && (p4("innerHTML", i.renderedIconHTML, $2),
                b2("title", i.title))
            },
            inputs: {
                icon: "icon",
                title: "title",
                animation: "animation",
                spin: "spin",
                pulse: "pulse",
                mask: "mask",
                styles: "styles",
                flip: "flip",
                size: "size",
                pull: "pull",
                border: "border",
                inverse: "inverse",
                symbol: "symbol",
                rotate: "rotate",
                fixedWidth: "fixedWidth",
                classes: "classes",
                transform: "transform",
                a11yRole: "a11yRole"
            },
            features: [V2],
            decls: 0,
            vars: 0,
            template: function(e, i) {},
            encapsulation: 2
        })
        }
    }
    return a
}
)();
var z1 = ( () => {
    class a {
        static{this.\u0275fac = function(e) {
            return new (e || a)
        }
        }static{this.\u0275mod = m4({
            type: a
        })
        }static{this.\u0275inj = s4({})
        }
    }
    return a
}
)();
var e7 = {
    prefix: "fas",
    iconName: "rotate",
    icon: [512, 512, [128260, "sync-alt"], "f2f1", "M480.1 192l7.9 0c13.3 0 24-10.7 24-24l0-144c0-9.7-5.8-18.5-14.8-22.2S477.9 .2 471 7L419.3 58.8C375 22.1 318 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1C79.2 135.5 159.3 64 256 64 300.4 64 341.2 79 373.7 104.3L327 151c-6.9 6.9-8.9 17.2-5.2 26.2S334.3 192 344 192l136.1 0zm29.4 100.5c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-44.4 0-85.2-15-117.7-40.3L185 361c6.9-6.9 8.9-17.2 5.2-26.2S177.7 320 168 320L24 320c-13.3 0-24 10.7-24 24L0 488c0 9.7 5.8 18.5 14.8 22.2S34.1 511.8 41 505l51.8-51.8C137 489.9 194 512 256 512 385 512 491.7 416.6 509.4 292.5z"]
}
  , $9 = e7;
var l7 = {
    prefix: "fas",
    iconName: "magnifying-glass",
    icon: [512, 512, [128269, "search"], "f002", "M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"]
}
  , f0 = l7;
var X9 = {
    prefix: "fas",
    iconName: "rocket",
    icon: [512, 512, [], "f135", "M128 320L24.5 320c-24.9 0-40.2-27.1-27.4-48.5L50 183.3C58.7 168.8 74.3 160 91.2 160l95 0c76.1-128.9 189.6-135.4 265.5-124.3 12.8 1.9 22.8 11.9 24.6 24.6 11.1 75.9 4.6 189.4-124.3 265.5l0 95c0 16.9-8.8 32.5-23.3 41.2l-88.2 52.9c-21.3 12.8-48.5-2.6-48.5-27.4L192 384c0-35.3-28.7-64-64-64l-.1 0zM400 160a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"]
};
var Y9 = {
    prefix: "fas",
    iconName: "code",
    icon: [576, 512, [], "f121", "M360.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm64.6 136.1c-12.5 12.5-12.5 32.8 0 45.3l73.4 73.4-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0zm-274.7 0c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 150.6 182.6c12.5-12.5 12.5-32.8 0-45.3z"]
};
var Q9 = {
    prefix: "fas",
    iconName: "terminal",
    icon: [512, 512, [], "f120", "M9.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L146.7 256 9.4 118.6zM224 384l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"]
};
var K9 = {
    prefix: "fas",
    iconName: "circle",
    icon: [512, 512, [128308, 128309, 128992, 128993, 128994, 128995, 128996, 9679, 9898, 9899, 11044, 61708, 61915], "f111", "M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z"]
};
var i7 = {
    prefix: "fas",
    iconName: "circle-exclamation",
    icon: [512, 512, ["exclamation-circle"], "f06a", "M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zm0-192a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.6 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z"]
}
  , m0 = i7;
var J9 = {
    prefix: "fas",
    iconName: "fingerprint",
    icon: [512, 512, [], "f577", "M48 256c0-114.9 93.1-208 208-208 63.1 0 119.6 28.1 157.8 72.5 8.6 10.1 23.8 11.2 33.8 2.6s11.2-23.8 2.6-33.8C403.3 34.6 333.7 0 256 0 114.6 0 0 114.6 0 256l0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40zm458.5-52.9c-2.7-13-15.5-21.3-28.4-18.5s-21.3 15.5-18.5 28.4c2.9 13.9 4.5 28.3 4.5 43.1l0 40c0 13.3 10.7 24 24 24s24-10.7 24-24l0-40c0-18.1-1.9-35.8-5.5-52.9zM256 80c-19 0-37.4 3-54.5 8.6-15.2 5-18.7 23.7-8.3 35.9 7.1 8.3 18.8 10.8 29.4 7.9 10.6-2.9 21.8-4.4 33.4-4.4 70.7 0 128 57.3 128 128l0 24.9c0 25.2-1.5 50.3-4.4 75.3-1.7 14.6 9.4 27.8 24.2 27.8 11.8 0 21.9-8.6 23.3-20.3 3.3-27.4 5-55 5-82.7l0-24.9c0-97.2-78.8-176-176-176zM150.7 148.7c-9.1-10.6-25.3-11.4-33.9-.4-23.1 29.8-36.8 67.1-36.8 107.7l0 24.9c0 24.2-2.6 48.4-7.8 71.9-3.4 15.6 7.9 31.1 23.9 31.1 10.5 0 19.9-7 22.2-17.3 6.4-28.1 9.7-56.8 9.7-85.8l0-24.9c0-27.2 8.5-52.4 22.9-73.1 7.2-10.4 8-24.6-.2-34.2zM256 160c-53 0-96 43-96 96l0 24.9c0 35.9-4.6 71.5-13.8 106.1-3.8 14.3 6.7 29 21.5 29 9.5 0 17.9-6.2 20.4-15.4 10.5-39 15.9-79.2 15.9-119.7l0-24.9c0-28.7 23.3-52 52-52s52 23.3 52 52l0 24.9c0 36.3-3.5 72.4-10.4 107.9-2.7 13.9 7.7 27.2 21.8 27.2 10.2 0 19-7 21-17 7.7-38.8 11.6-78.3 11.6-118.1l0-24.9c0-53-43-96-96-96zm24 96c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 24.9c0 59.9-11 119.3-32.5 175.2l-5.9 15.3c-4.8 12.4 1.4 26.3 13.8 31s26.3-1.4 31-13.8l5.9-15.3C267.9 411.9 280 346.7 280 280.9l0-24.9z"]
};
var r7 = {
    prefix: "fas",
    iconName: "volume-xmark",
    icon: [576, 512, ["volume-mute", "volume-times"], "f6a9", "M48 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L96 160 48 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48zM367 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"]
}
  , Z9 = r7;
var n7 = {
    prefix: "fas",
    iconName: "xmark",
    icon: [384, 512, [128473, 10005, 10006, 10060, 215, "close", "multiply", "remove", "times"], "f00d", "M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"]
};
var d0 = n7;
var cc = {
    prefix: "fas",
    iconName: "user-astronaut",
    icon: [448, 512, [], "f4fb", "M224 336c74.6 0 138.4-46.4 164-112l4 0c13.3 0 24-10.7 24-24l0-80c0-13.3-10.7-24-24-24l-4 0C362.4 30.4 298.6-16 224-16S85.6 30.4 60 96l-4 0c-13.3 0-24 10.7-24 24l0 80c0 13.3 10.7 24 24 24l4 0c25.6 65.6 89.4 112 164 112zM208 80l32 0c53 0 96 43 96 96s-43 96-96 96l-32 0c-53 0-96-43-96-96s43-96 96-96zM16 484.6C16 499.7 28.3 512 43.4 512l52.6 0 0-48c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32l0 48 52.6 0c15.1 0 27.4-12.3 27.4-27.4 0-59.8-31.9-112.2-79.6-141-36.4 25.5-80.6 40.4-128.4 40.4s-92-14.9-128.4-40.4C47.9 372.4 16 424.8 16 484.6zM183.3 141.5c-.9-3.3-3.9-5.5-7.3-5.5s-6.4 2.2-7.3 5.5l-6 21.2-21.2 6c-3.3 .9-5.5 3.9-5.5 7.3s2.2 6.4 5.5 7.3l21.2 6 6 21.2c.9 3.3 3.9 5.5 7.3 5.5s6.4-2.2 7.3-5.5l6-21.2 21.2-6c3.3-.9 5.5-3.9 5.5-7.3s-2.2-6.4-5.5-7.3l-21.2-6-6-21.2zM152 488l0 24 48 0 0-24c0-13.3-10.7-24-24-24s-24 10.7-24 24zm120-24c-13.3 0-24 10.7-24 24l0 24 48 0 0-24c0-13.3-10.7-24-24-24z"]
};
var s7 = {
    prefix: "fas",
    iconName: "volume-high",
    icon: [640, 512, [128266, "volume-up"], "f028", "M533.6 32.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C557.5 113.8 592 180.8 592 256s-34.5 142.2-88.7 186.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C598.5 426.7 640 346.2 640 256S598.5 85.2 533.6 32.5zM473.1 107c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C475.3 170.7 496 210.9 496 256s-20.7 85.3-53.2 111.8c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5c43.2-35.2 70.9-88.9 70.9-149s-27.7-113.8-70.9-149zm-60.5 74.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C393.1 227.6 400 241 400 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C434.1 312.9 448 286.1 448 256s-13.9-56.9-35.4-74.5zM80 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L128 160 80 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48z"]
}
  , ac = s7;
var t7 = {
    prefix: "fas",
    iconName: "shield-halved",
    icon: [512, 512, ["shield-alt"], "f3ed", "M256 0c4.6 0 9.2 1 13.4 2.9L457.8 82.8c22 9.3 38.4 31 38.3 57.2-.5 99.2-41.3 280.7-213.6 363.2-16.7 8-36.1 8-52.8 0-172.4-82.5-213.1-264-213.6-363.2-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.9 1 251.4 0 256 0zm0 66.8l0 378.1c138-66.8 175.1-214.8 176-303.4l-176-74.6 0 0z"]
}
  , ec = t7;
var lc = {
    prefix: "fas",
    iconName: "bolt",
    icon: [448, 512, [9889, "zap"], "f0e7", "M338.8-9.9c11.9 8.6 16.3 24.2 10.9 37.8L271.3 224 416 224c13.5 0 25.5 8.4 30.1 21.1s.7 26.9-9.6 35.5l-288 240c-11.3 9.4-27.4 9.9-39.3 1.3s-16.3-24.2-10.9-37.8L176.7 288 32 288c-13.5 0-25.5-8.4-30.1-21.1s-.7-26.9 9.6-35.5l288-240c11.3-9.4 27.4-9.9 39.3-1.3z"]
};
var p0 = {
    prefix: "fas",
    iconName: "hashtag",
    icon: [512, 512, [62098], "23", "M214.7 .7c17.3 3.7 28.3 20.7 24.6 38l-19.1 89.3 126.5 0 22-102.7C372.4 8 389.4-3 406.7 .7s28.3 20.7 24.6 38L412.2 128 480 128c17.7 0 32 14.3 32 32s-14.3 32-32 32l-81.6 0-27.4 128 67.8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-81.6 0-22 102.7c-3.7 17.3-20.7 28.3-38 24.6s-28.3-20.7-24.6-38l19.1-89.3-126.5 0-22 102.7c-3.7 17.3-20.7 28.3-38 24.6s-28.3-20.7-24.6-38L99.8 384 32 384c-17.7 0-32-14.3-32-32s14.3-32 32-32l81.6 0 27.4-128-67.8 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l81.6 0 22-102.7C180.4 8 197.4-3 214.7 .7zM206.4 192l-27.4 128 126.5 0 27.4-128-126.5 0z"]
};
var u0 = {
    prefix: "fas",
    iconName: "gamepad",
    icon: [640, 512, [], "f11b", "M448 64c106 0 192 86 192 192S554 448 448 448l-256 0C86 448 0 362 0 256S86 64 192 64l256 0zM192 176c-13.3 0-24 10.7-24 24l0 32-32 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l32 0 0 32c0 13.3 10.7 24 24 24s24-10.7 24-24l0-32 32 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-32 0 0-32c0-13.3-10.7-24-24-24zm240 96a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm64-96a32 32 0 1 0 0 64 32 32 0 1 0 0-64z"]
};
var o7 = {
    prefix: "fas",
    iconName: "circle-info",
    icon: [512, 512, ["info-circle"], "f05a", "M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM224 160a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm-8 64l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"]
}
  , z0 = o7;
function Y(a) {
    a || (a = _(s2));
    let l = new e4(c => {
        if (a.destroyed) {
            c.next();
            return
        }
        return a.onDestroy(c.next.bind(c))
    }
    );
    return c => c.pipe(n4(l))
}
var v1 = ( () => {
    class a {
        constructor() {
            this.webSocketUrl = l2.webSocketUrl,
            this.dataInitial = {
                op: 2,
                d: {
                    subscribe_to_id: l2.discordId
                }
            },
            this.heartbeat_interval = 3e4,
            this.reconnectAttempts = 0,
            this.maxReconnectAttempts = 5,
            this.baseReconnectDelay = 1e3,
            this.lanyardDataSignal = b(null)
        }
        destroy() {
            this.cleanup()
        }
        setInitialData(c) {
            this.dataInitial.d.subscribe_to_id = c
        }
        setupWebSocket() {
            this.cleanup(),
            this.socket = new WebSocket(this.webSocketUrl),
            this.socket.onopen = () => {
                this.reconnectAttempts = 0,
                this.socket?.send(JSON.stringify(this.dataInitial)),
                this.heartbeat = setInterval( () => {
                    this.socket?.readyState === WebSocket.OPEN && this.socket.send(JSON.stringify({
                        op: 3
                    }))
                }
                , this.heartbeat_interval)
            }
            ,
            this.socket.onmessage = c => {
                try {
                    let e = JSON.parse(c.data);
                    e.d?.heartbeat_interval && (this.heartbeat_interval = e.d.heartbeat_interval),
                    (e.t === "INIT_STATE" || e.t === "PRESENCE_UPDATE") && this.setLanyardData(e)
                } catch (e) {
                    console.error("Error parsing WebSocket message:", e)
                }
            }
            ,
            this.socket.onerror = c => {
                console.error("WebSocket error:", c)
            }
            ,
            this.socket.onclose = c => {
                this.cleanup(),
                !c.wasClean && this.reconnectAttempts < this.maxReconnectAttempts && this.reconnectWithBackoff()
            }
        }
        reconnectWithBackoff() {
            let c = this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts);
            this.reconnectAttempts++,
            setTimeout( () => {
                this.reconnectAttempts <= this.maxReconnectAttempts && this.setupWebSocket()
            }
            , c)
        }
        cleanup() {
            this.heartbeat && (clearInterval(this.heartbeat),
            this.heartbeat = null),
            this.socket && (this.socket.close(),
            this.socket = void 0)
        }
        setLanyardData(c) {
            this.lanyardDataSignal.set(c)
        }
        getLanyardData() {
            return this.lanyardDataSignal.asReadonly()
        }
        disconnect() {
            this.reconnectAttempts = this.maxReconnectAttempts,
            this.cleanup()
        }
        static{this.\u0275fac = function(e) {
            return new (e || a)
        }
        }static{this.\u0275prov = O({
            token: a,
            factory: a.\u0275fac,
            providedIn: "root"
        })
        }
    }
    return a
}
)();
var v0 = ( () => {
    class a {
        getElapsedTime(c) {
            return D2(0, 1e3).pipe(c2( () => this.calculateElapsedTime(c)), c2(e => this.formatTime(e)))
        }
        calculateElapsedTime(c) {
            let e = Math.floor((Date.now() - c) / 1e3);
            return Math.max(0, e)
        }
        getTotalDuration(c, e) {
            let i = Math.floor((e - c) / 1e3);
            return this.formatTime(i)
        }
        getProgressPercentage(c, e) {
            return D2(0, 1e3).pipe(c2( () => {
                let i = e - c
                  , n = (Date.now() - c) / i * 100;
                return Math.min(100, Math.max(0, n))
            }
            ))
        }
        formatTime(c) {
            let e = s => s.toString().padStart(2, "0")
              , i = Math.floor(c / 3600)
              , r = Math.floor(c % 3600 / 60)
              , n = c % 60;
            return i > 0 ? `${i}:${e(r)}:${e(n)}` : `${r}:${e(n)}`
        }
        static{this.\u0275fac = function(e) {
            return new (e || a)
        }
        }static{this.\u0275prov = O({
            token: a,
            factory: a.\u0275fac,
            providedIn: "root"
        })
        }
    }
    return a
}
)();
var h0 = ( () => {
    class a {
        constructor() {
            this.http = _(w2),
            this.apiUrl = "https://lrclib.net/api/get"
        }
        getLyrics(c, e, i, r) {
            let n = new S4().set("track_name", c).set("artist_name", e).set("album_name", i).set("duration", r.toString());
            return this.http.get(this.apiUrl, {
                params: n
            }).pipe(c2(s => s.syncedLyrics ? this.parseSyncedLyrics(s.syncedLyrics) : s.plainLyrics ? s.plainLyrics.split(`
`).map(t => ({
                time: 0,
                text: t
            })) : []), G2(s => (console.error("Error fetching lyrics:", s),
            T2([]))))
        }
        parseSyncedLyrics(c) {
            let e = c.split(`
`)
              , i = []
              , r = /^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;
            for (let n of e) {
                let s = n.match(r);
                if (s) {
                    let t = parseInt(s[1], 10)
                      , o = parseInt(s[2], 10)
                      , f = parseInt(s[3].padEnd(3, "0"), 10)
                      , d = t * 60 * 1e3 + o * 1e3 + f
                      , v = s[4].trim();
                    v && i.push({
                        time: d,
                        text: v
                    })
                }
            }
            return i
        }
        static{this.\u0275fac = function(e) {
            return new (e || a)
        }
        }static{this.\u0275prov = O({
            token: a,
            factory: a.\u0275fac,
            providedIn: "root"
        })
        }
    }
    return a
}
)();
function f7(a) {
    var l = a.toString(16);
    return l.length === 1 ? "0" + l : l
}
function M0(a) {
    return "#" + a.map(f7).join("")
}
function m7(a) {
    var l = (a[0] * 299 + a[1] * 587 + a[2] * 114) / 1e3;
    return l < 128
}
function d7(a) {
    return a ? p7(a) ? a : [a] : []
}
function p7(a) {
    return Array.isArray(a[0])
}
function a4(a, l, c) {
    for (var e = 0; e < c.length; e++)
        if (u7(a, l, c[e]))
            return !0;
    return !1
}
function u7(a, l, c) {
    switch (c.length) {
    case 3:
        if (z7(a, l, c))
            return !0;
        break;
    case 4:
        if (v7(a, l, c))
            return !0;
        break;
    case 5:
        if (h7(a, l, c))
            return !0;
        break;
    default:
        return !1
    }
}
function z7(a, l, c) {
    return a[l + 3] !== 255 || a[l] === c[0] && a[l + 1] === c[1] && a[l + 2] === c[2]
}
function v7(a, l, c) {
    return a[l + 3] && c[3] ? a[l] === c[0] && a[l + 1] === c[1] && a[l + 2] === c[2] && a[l + 3] === c[3] : a[l + 3] === c[3]
}
function h1(a, l, c) {
    return a >= l - c && a <= l + c
}
function h7(a, l, c) {
    var e = c[0]
      , i = c[1]
      , r = c[2]
      , n = c[3]
      , s = c[4]
      , t = a[l + 3]
      , o = h1(t, n, s);
    return n ? !!(!t && o || h1(a[l], e, s) && h1(a[l + 1], i, s) && h1(a[l + 2], r, s) && o) : o
}
var M7 = 24;
function g7(a, l, c) {
    for (var e = {}, i = c.dominantDivider || M7, r = c.ignoredColor, n = c.step, s = [0, 0, 0, 0, 0], t = 0; t < l; t += n) {
        var o = a[t]
          , f = a[t + 1]
          , d = a[t + 2]
          , v = a[t + 3];
        if (!(r && a4(a, t, r))) {
            var h = Math.round(o / i) + "," + Math.round(f / i) + "," + Math.round(d / i);
            e[h] ? e[h] = [e[h][0] + o * v, e[h][1] + f * v, e[h][2] + d * v, e[h][3] + v, e[h][4] + 1] : e[h] = [o * v, f * v, d * v, v, 1],
            s[4] < e[h][4] && (s = e[h])
        }
    }
    var g = s[0]
      , k = s[1]
      , F = s[2]
      , P = s[3]
      , H = s[4];
    return P ? [Math.round(g / P), Math.round(k / P), Math.round(F / P), Math.round(P / H)] : c.defaultColor
}
function L7(a, l, c) {
    for (var e = 0, i = 0, r = 0, n = 0, s = 0, t = c.ignoredColor, o = c.step, f = 0; f < l; f += o) {
        var d = a[f + 3]
          , v = a[f] * d
          , h = a[f + 1] * d
          , g = a[f + 2] * d;
        t && a4(a, f, t) || (e += v,
        i += h,
        r += g,
        n += d,
        s++)
    }
    return n ? [Math.round(e / n), Math.round(i / n), Math.round(r / n), Math.round(n / s)] : c.defaultColor
}
function C7(a, l, c) {
    for (var e = 0, i = 0, r = 0, n = 0, s = 0, t = c.ignoredColor, o = c.step, f = 0; f < l; f += o) {
        var d = a[f]
          , v = a[f + 1]
          , h = a[f + 2]
          , g = a[f + 3];
        t && a4(a, f, t) || (e += d * d * g,
        i += v * v * g,
        r += h * h * g,
        n += g,
        s++)
    }
    return n ? [Math.round(Math.sqrt(e / n)), Math.round(Math.sqrt(i / n)), Math.round(Math.sqrt(r / n)), Math.round(n / s)] : c.defaultColor
}
function g0(a) {
    return W2(a, "defaultColor", [0, 0, 0, 0])
}
function W2(a, l, c) {
    return a[l] === void 0 ? c : a[l]
}
var L0 = 10
  , c4 = 100;
function x7(a) {
    return a.search(/\.svg(\?|$)/i) !== -1
}
function b7(a) {
    if (x0(a)) {
        var l = a.naturalWidth
          , c = a.naturalHeight;
        return !a.naturalWidth && x7(a.src) && (l = c = c4),
        {
            width: l,
            height: c
        }
    }
    return y7(a) ? {
        width: a.videoWidth,
        height: a.videoHeight
    } : S0(a) ? {
        width: a.codedWidth,
        height: a.codedHeight
    } : {
        width: a.width,
        height: a.height
    }
}
function C0(a) {
    return N7(a) ? "canvas" : S7(a) ? "offscreencanvas" : S0(a) ? "videoframe" : w7(a) ? "imagebitmap" : a.src
}
function x0(a) {
    return typeof HTMLImageElement < "u" && a instanceof HTMLImageElement
}
var b0 = typeof OffscreenCanvas < "u";
function S7(a) {
    return b0 && a instanceof OffscreenCanvas
}
function y7(a) {
    return typeof HTMLVideoElement < "u" && a instanceof HTMLVideoElement
}
function S0(a) {
    return typeof VideoFrame < "u" && a instanceof VideoFrame
}
function N7(a) {
    return typeof HTMLCanvasElement < "u" && a instanceof HTMLCanvasElement
}
function w7(a) {
    return typeof ImageBitmap < "u" && a instanceof ImageBitmap
}
function k7(a, l) {
    var c = W2(l, "left", 0)
      , e = W2(l, "top", 0)
      , i = W2(l, "width", a.width)
      , r = W2(l, "height", a.height)
      , n = i
      , s = r;
    if (l.mode === "precision")
        return {
            srcLeft: c,
            srcTop: e,
            srcWidth: i,
            srcHeight: r,
            destWidth: n,
            destHeight: s
        };
    var t;
    return i > r ? (t = i / r,
    n = c4,
    s = Math.round(n / t)) : (t = r / i,
    s = c4,
    n = Math.round(s / t)),
    (n > i || s > r || n < L0 || s < L0) && (n = i,
    s = r),
    {
        srcLeft: c,
        srcTop: e,
        srcWidth: i,
        srcHeight: r,
        destWidth: n,
        destHeight: s
    }
}
var A7 = typeof window > "u";
function P7() {
    return A7 ? b0 ? new OffscreenCanvas(1,1) : null : document.createElement("canvas")
}
var _7 = "FastAverageColor: ";
function J(a) {
    return Error(_7 + a)
}
function U2(a, l) {
    l || console.error(a)
}
var y0 = (function() {
    function a() {
        this.canvas = null,
        this.ctx = null
    }
    return a.prototype.getColorAsync = function(l, c) {
        if (!l)
            return Promise.reject(J("call .getColorAsync() without resource"));
        if (typeof l == "string") {
            if (typeof Image > "u")
                return Promise.reject(J("resource as string is not supported in this environment"));
            var e = new Image;
            return e.crossOrigin = c && c.crossOrigin || "",
            e.src = l,
            this.bindImageEvents(e, c)
        } else {
            if (x0(l) && !l.complete)
                return this.bindImageEvents(l, c);
            var i = this.getColor(l, c);
            return i.error ? Promise.reject(i.error) : Promise.resolve(i)
        }
    }
    ,
    a.prototype.getColor = function(l, c) {
        c = c || {};
        var e = g0(c);
        if (!l) {
            var i = J("call .getColor() without resource");
            return U2(i, c.silent),
            this.prepareResult(e, i)
        }
        var r = b7(l)
          , n = k7(r, c);
        if (!n.srcWidth || !n.srcHeight || !n.destWidth || !n.destHeight) {
            var i = J('incorrect sizes for resource "'.concat(C0(l), '"'));
            return U2(i, c.silent),
            this.prepareResult(e, i)
        }
        if (!this.canvas && (this.canvas = P7(),
        !this.canvas)) {
            var i = J("OffscreenCanvas is not supported in this browser");
            return U2(i, c.silent),
            this.prepareResult(e, i)
        }
        if (!this.ctx) {
            if (this.ctx = this.canvas.getContext("2d", {
                willReadFrequently: !0
            }),
            !this.ctx) {
                var i = J("Canvas Context 2D is not supported in this browser");
                return U2(i, c.silent),
                this.prepareResult(e)
            }
            this.ctx.imageSmoothingEnabled = !1
        }
        this.canvas.width = n.destWidth,
        this.canvas.height = n.destHeight;
        try {
            this.ctx.clearRect(0, 0, n.destWidth, n.destHeight),
            this.ctx.drawImage(l, n.srcLeft, n.srcTop, n.srcWidth, n.srcHeight, 0, 0, n.destWidth, n.destHeight);
            var s = this.ctx.getImageData(0, 0, n.destWidth, n.destHeight).data;
            return this.prepareResult(this.getColorFromArray4(s, c))
        } catch (t) {
            var i = J("security error (CORS) for resource ".concat(C0(l), `.
Details: https://developer.mozilla.org/en/docs/Web/HTML/CORS_enabled_image`));
            return U2(i, c.silent),
            c.silent || console.error(t),
            this.prepareResult(e, i)
        }
    }
    ,
    a.prototype.getColorFromArray4 = function(l, c) {
        c = c || {};
        var e = 4
          , i = l.length
          , r = g0(c);
        if (i < e)
            return r;
        var n = i - i % e, s = (c.step || 1) * e, t;
        switch (c.algorithm || "sqrt") {
        case "simple":
            t = L7;
            break;
        case "sqrt":
            t = C7;
            break;
        case "dominant":
            t = g7;
            break;
        default:
            throw J("".concat(c.algorithm, " is unknown algorithm"))
        }
        return t(l, n, {
            defaultColor: r,
            ignoredColor: d7(c.ignoredColor),
            step: s,
            dominantDivider: c.dominantDivider
        })
    }
    ,
    a.prototype.prepareResult = function(l, c) {
        var e = l.slice(0, 3)
          , i = [l[0], l[1], l[2], l[3] / 255]
          , r = m7(l);
        return {
            value: [l[0], l[1], l[2], l[3]],
            rgb: "rgb(" + e.join(",") + ")",
            rgba: "rgba(" + i.join(",") + ")",
            hex: M0(e),
            hexa: M0(l),
            isDark: r,
            isLight: !r,
            error: c
        }
    }
    ,
    a.prototype.destroy = function() {
        this.canvas && (this.canvas.width = 1,
        this.canvas.height = 1,
        this.canvas = null),
        this.ctx = null
    }
    ,
    a.prototype.bindImageEvents = function(l, c) {
        var e = this;
        return new Promise(function(i, r) {
            var n = function() {
                o();
                var f = e.getColor(l, c);
                f.error ? r(f.error) : i(f)
            }
              , s = function() {
                o(),
                r(J('Error loading image "'.concat(l.src, '"')))
            }
              , t = function() {
                o(),
                r(J('Image "'.concat(l.src, '" loading aborted')))
            }
              , o = function() {
                l.removeEventListener("load", n),
                l.removeEventListener("error", s),
                l.removeEventListener("abort", t)
            };
            l.addEventListener("load", n),
            l.addEventListener("error", s),
            l.addEventListener("abort", t)
        }
        )
    }
    ,
    a
}
)();
var T7 = ["lyricsContainer"];
function D7(a, l) {
    if (a & 1) {
        let c = q();
        p(0, "div", 15),
        D("click", function() {
            E(c);
            let i = L(2);
            return B(i.cycleActivity())
        })("keydown.enter", function() {
            E(c);
            let i = L(2);
            return B(i.cycleActivity())
        })("keydown.space", function() {
            E(c);
            let i = L(2);
            return B(i.cycleActivity())
        }),
        p(1, "div", 16),
        S(2, "div", 6)(3, "img", 17),
        p(4, "div", 18)(5, "div", 19)(6, "span", 20)(7, "img", 21),
        D("error", function(i) {
            E(c);
            let r = L(2);
            return B(r.handleIconError(i))
        }),
        z(),
        S(8, "fa-icon", 22),
        z(),
        p(9, "span", 23),
        C(10),
        z()()()()()
    }
    if (a & 2) {
        let c = L(2);
        u(3),
        y("src", c.getActivityImage(c.nextActivity()), R),
        u(4),
        y("src", c.getServiceIcon(c.nextActivity()), R)("alt", c.nextActivity().name),
        u(),
        y("icon", c.faGamepad),
        u(2),
        o2("Next: ", c.nextActivity().name)
    }
}
function F7(a, l) {
    a & 1 && (p(0, "div", 6)(1, "div", 24),
    S(2, "div", 25)(3, "div", 25)(4, "div", 25)(5, "div", 25)(6, "div", 25)(7, "div", 25)(8, "div", 25)(9, "div", 25)(10, "div", 25)(11, "div", 25)(12, "div", 25)(13, "div", 25)(14, "div", 25)(15, "div", 25)(16, "div", 25)(17, "div", 25),
    z()())
}
function E7(a, l) {
    a & 1 && (S(0, "img", 26),
    p(1, "span"),
    C(2, "Listening on Spotify"),
    z())
}
function B7(a, l) {
    if (a & 1) {
        let c = q();
        p(0, "span", 20)(1, "img", 27),
        D("error", function(i) {
            E(c);
            let r = L(2);
            return B(r.handleIconError(i))
        }),
        z(),
        S(2, "fa-icon", 28),
        z(),
        p(3, "span"),
        C(4),
        z()
    }
    if (a & 2) {
        let c = L(2);
        u(),
        y("src", c.getServiceIcon(c.currentActivity()), R)("alt", c.currentActivity().name),
        u(),
        y("icon", c.faGamepad),
        u(2),
        o2("Playing ", c.currentActivity().name)
    }
}
function R7(a, l) {
    if (a & 1) {
        let c = q();
        p(0, "button", 29),
        D("click", function(i) {
            E(c);
            let r = L(2);
            return B(r.toggleLyrics(i))
        }),
        z2(),
        p(1, "svg", 30),
        S(2, "path", 31)(3, "circle", 32)(4, "circle", 33),
        z()()
    }
    if (a & 2) {
        let c = L(2);
        G("active", c.showLyrics())
    }
}
function I7(a, l) {
    if (a & 1) {
        let c = q();
        p(0, "a", 34),
        D("click", function(i) {
            return E(c),
            B(i.stopPropagation())
        }),
        z2(),
        p(1, "svg", 30),
        S(2, "path", 35)(3, "polyline", 36)(4, "line", 37),
        z()()
    }
    if (a & 2) {
        let c = L(2);
        y("href", "https://open.spotify.com/track/" + c.currentActivity().sync_id, R)
    }
}
function H7(a, l) {
    if (a & 1 && S(0, "img", 40),
    a & 2) {
        let c = L(3);
        y("src", c.getSmallActivityImage(c.currentActivity()), R)
    }
}
function O7(a, l) {
    if (a & 1 && (p(0, "span", 46),
    C(1),
    z()),
    a & 2) {
        let c, e, i = L(3);
        y("title", (c = i.currentActivity().assets) == null ? null : c.large_text),
        u(),
        o2(" \u2022 ", (e = i.currentActivity().assets) == null ? null : e.large_text)
    }
}
function U7(a, l) {
    if (a & 1 && (p(0, "div", 47)(1, "span", 48),
    C(2),
    z(),
    p(3, "div", 49),
    S(4, "div", 50),
    z(),
    p(5, "span", 48),
    C(6),
    z()()),
    a & 2) {
        let c = L(3);
        u(2),
        T(c.currentTime()),
        u(2),
        y2("width", c.percentage(), "%"),
        u(2),
        T(c.totalDuration())
    }
}
function W7(a, l) {
    if (a & 1 && (p(0, "div", 51)(1, "span", 48),
    C(2),
    z()()),
    a & 2) {
        let c = L(4);
        u(2),
        o2("", c.currentTime(), " elapsed")
    }
}
function j7(a, l) {
    if (a & 1 && N(0, W7, 3, 1, "div", 51),
    a & 2) {
        let c = L(3);
        w(c.currentTime() !== "0:00" ? 0 : -1)
    }
}
function q7(a, l) {
    if (a & 1) {
        let c = q();
        p(0, "div", 12)(1, "div", 38)(2, "img", 39),
        D("error", function(i) {
            E(c);
            let r = L(2);
            return B(r.handleImageError(i))
        }),
        z(),
        N(3, H7, 1, 1, "img", 40),
        z(),
        p(4, "div", 41)(5, "div", 42)(6, "span", 43),
        C(7),
        z()(),
        p(8, "div", 44)(9, "span", 45),
        C(10),
        z(),
        N(11, O7, 2, 2, "span", 46),
        z(),
        N(12, U7, 7, 4, "div", 47)(13, j7, 1, 1),
        z()()
    }
    if (a & 2) {
        let c, e, i = L(2);
        u(2),
        y("src", i.getActivityImage(i.currentActivity()), R),
        u(),
        w(!i.isSpotify() && i.getSmallActivityImage(i.currentActivity()) ? 3 : -1),
        u(3),
        y("title", i.currentActivity().details),
        u(),
        T(i.currentActivity().details || i.currentActivity().name),
        u(2),
        y("title", i.currentActivity().state),
        u(),
        T(i.currentActivity().state),
        u(),
        w((c = i.currentActivity().assets) != null && c.large_text ? 11 : -1),
        u(),
        w((e = i.currentActivity().timestamps) != null && e.end ? 12 : 13)
    }
}
function G7(a, l) {
    a & 1 && (p(0, "div", 52),
    S(1, "div", 55),
    p(2, "span"),
    C(3, "Loading lyrics..."),
    z()())
}
function V7(a, l) {
    a & 1 && (p(0, "div", 53)(1, "span"),
    C(2, "No lyrics found"),
    z()())
}
function $7(a, l) {
    if (a & 1 && (p(0, "p", 58),
    C(1),
    z()),
    a & 2) {
        let c = l.$implicit
          , e = l.$index
          , i = L(4);
        G("active", e === i.currentLineIndex())("past", e < i.currentLineIndex()),
        u(),
        o2(" ", c.text, " ")
    }
}
function X7(a, l) {
    if (a & 1 && (p(0, "div", 54, 0),
    h2(2, $7, 2, 5, "p", 56, S2),
    S(4, "div", 57),
    z()),
    a & 2) {
        let c = L(3);
        u(2),
        M2(c.lyrics())
    }
}
function Y7(a, l) {
    if (a & 1 && (p(0, "div", 13),
    N(1, G7, 4, 0, "div", 52)(2, V7, 3, 0, "div", 53)(3, X7, 5, 0, "div", 54),
    z()),
    a & 2) {
        let c = L(2);
        u(),
        w(c.lyricsLoading() ? 1 : c.lyrics().length === 0 ? 2 : 3)
    }
}
function Q7(a, l) {
    if (a & 1 && S(0, "div", 60),
    a & 2) {
        let c = l.$index
          , e = L(3);
        G("active", c === e.currentIndex())
    }
}
function K7(a, l) {
    if (a & 1 && (p(0, "div", 14),
    h2(1, Q7, 1, 2, "div", 59, S2),
    z()),
    a & 2) {
        let c = L(2);
        u(),
        M2(c.activities())
    }
}
function J7(a, l) {
    if (a & 1) {
        let c = q();
        p(0, "div", 2),
        N(1, D7, 11, 5, "div", 3),
        p(2, "div", 4),
        D("click", function() {
            E(c);
            let i = L();
            return B(i.cycleActivity())
        })("keydown.enter", function() {
            E(c);
            let i = L();
            return B(i.cycleActivity())
        })("keydown.space", function() {
            E(c);
            let i = L();
            return B(i.cycleActivity())
        }),
        p(3, "div", 5),
        N(4, F7, 18, 0, "div", 6),
        p(5, "div", 7)(6, "div", 8),
        N(7, E7, 3, 0)(8, B7, 5, 4),
        p(9, "div", 9),
        N(10, R7, 5, 2, "button", 10),
        N(11, I7, 5, 1, "a", 11),
        z()(),
        N(12, q7, 14, 8, "div", 12)(13, Y7, 4, 1, "div", 13),
        z(),
        N(14, K7, 3, 0, "div", 14),
        z()()()
    }
    if (a & 2) {
        let c = L();
        G("has-multiple", c.activities().length > 1)("mobile-embedded", c.isMobileEmbedded()),
        u(),
        w(c.nextActivity() ? 1 : -1),
        u(),
        y2("--dynamic-bg", c.dynamicBgColor())("--dynamic-accent", c.dynamicAccentColor()),
        G("switching", c.isSwitching()),
        b2("role", c.activities().length > 1 ? "button" : null)("tabindex", c.activities().length > 1 ? 0 : null),
        u(),
        G("spotify-panel", c.isSpotify())("generic-panel", !c.isSpotify()),
        u(),
        w(c.isSpotify() ? 4 : -1),
        u(3),
        w(c.isSpotify() ? 7 : 8),
        u(3),
        w(c.isSpotify() ? 10 : -1),
        u(),
        w(c.isSpotify() && c.currentActivity().sync_id ? 11 : -1),
        u(),
        w(c.showLyrics() ? 13 : 12),
        u(2),
        w(c.activities().length > 1 ? 14 : -1)
    }
}
var N0 = ( () => {
    class a {
        constructor() {
            this.isMobileEmbedded = N2(!1),
            this.visibilityChange = f2(),
            this.lanyardService = _(v1),
            this.timestampsService = _(v0),
            this.lyricsService = _(h0),
            this.destroyRef = _(s2),
            this.faGamepad = u0,
            this.activities = b([]),
            this.currentIndex = b(0),
            this.isSwitching = b(!1),
            this.percentage = b(0),
            this.currentTime = b("0:00"),
            this.totalDuration = b("0:00"),
            this.dynamicBgColor = b("rgba(18, 18, 18, 0.85)"),
            this.dynamicAccentColor = b("#1db954"),
            this.fac = new y0,
            this.currentImageUrl = b(null),
            this.showLyrics = b(!1),
            this.lyrics = b([]),
            this.currentLineIndex = b(-1),
            this.lyricsLoading = b(!1),
            this.lastTrackId = b(null),
            this.lyricsSyncSubscription = new q2,
            this.activitiesSubscription = new q2,
            this.currentActivity = V( () => {
                let c = this.activities()
                  , e = this.currentIndex();
                return c[e] || null
            }
            ),
            this.nextActivity = V( () => {
                let c = this.activities();
                if (c.length < 2)
                    return null;
                let e = (this.currentIndex() + 1) % c.length;
                return c[e]
            }
            ),
            this.isSpotify = V( () => {
                let c = this.currentActivity();
                return !!c && (c.name === "Spotify" || c.id === "spotify:1")
            }
            ),
            v2( () => {
                let c = this.lanyardService.getLanyardData()();
                if (c) {
                    let i = (c?.d?.activities || []).filter(n => n.id !== "custom");
                    this.activities.set(i);
                    let r = i.length > 0;
                    this.visibilityChange.emit(r),
                    (i.length === 0 || this.currentIndex() >= i.length) && this.currentIndex.set(0)
                }
            }
            ),
            v2( () => {
                this.currentActivity(),
                this.processCurrentActivity()
            }
            )
        }
        cycleActivity() {
            this.activities().length < 2 || this.isSwitching() || (this.isSwitching.set(!0),
            setTimeout( () => {
                this.currentIndex.update(c => (c + 1) % this.activities().length),
                this.isSwitching.set(!1),
                this.processCurrentActivity()
            }
            , 300))
        }
        toggleLyrics(c) {
            c.stopPropagation(),
            this.showLyrics.update(e => !e),
            this.showLyrics() && setTimeout( () => this.scrollToActiveLine(), 100)
        }
        processCurrentActivity() {
            this.activitiesSubscription.unsubscribe(),
            this.activitiesSubscription = new q2,
            this.lyricsSyncSubscription.unsubscribe();
            let c = this.currentActivity();
            if (!c) {
                this.percentage.set(0),
                this.currentTime.set("0:00"),
                this.totalDuration.set("0:00"),
                this.lyrics.set([]),
                this.currentLineIndex.set(-1),
                this.lastTrackId.set(null);
                return
            }
            if (this.isSpotify()) {
                this.handleSpotifyLyrics(c);
                let e = this.getActivityImage(c);
                this.updateThemeFromImage(e)
            } else
                this.lastTrackId() && (this.lyrics.set([]),
                this.currentLineIndex.set(-1),
                this.lastTrackId.set(null),
                this.showLyrics.set(!1),
                this.resetTheme());
            if (c.timestamps) {
                let {start: e, end: i} = c.timestamps;
                if (i) {
                    let n = this.timestampsService.getProgressPercentage(e, i).pipe(Y(this.destroyRef)).subscribe(s => {
                        this.percentage.set(s)
                    }
                    );
                    this.activitiesSubscription.add(n),
                    this.totalDuration.set(this.timestampsService.getTotalDuration(e, i))
                } else
                    this.percentage.set(0),
                    this.totalDuration.set("");
                let r = this.timestampsService.getElapsedTime(e).pipe(Y(this.destroyRef)).subscribe(n => {
                    this.currentTime.set(n)
                }
                );
                this.activitiesSubscription.add(r)
            }
        }
        updateThemeFromImage(c) {
            if (!c) {
                this.currentImageUrl.set(null),
                this.resetTheme();
                return
            }
            this.currentImageUrl() !== c && (this.currentImageUrl.set(c),
            this.fac.getColorAsync(c).then(e => {
                if (this.dynamicBgColor.set(`rgba(${e.value[0]}, ${e.value[1]}, ${e.value[2]}, 0.85)`),
                e.isDark) {
                    let i = r => Math.min(255, r + 150);
                    this.dynamicAccentColor.set(`rgb(${i(e.value[0])}, ${i(e.value[1])}, ${i(e.value[2])})`)
                } else
                    this.dynamicBgColor.set(`rgba(${e.value[0] * .3}, ${e.value[1] * .3}, ${e.value[2] * .3}, 0.9)`),
                    this.dynamicAccentColor.set(e.hex)
            }
            ).catch( () => {
                this.dynamicBgColor.set("rgba(18, 18, 18, 0.85)"),
                this.dynamicAccentColor.set("#1db954")
            }
            ))
        }
        resetTheme() {
            this.currentImageUrl.set(null),
            this.dynamicBgColor.set("rgba(18, 18, 18, 0.85)"),
            this.dynamicAccentColor.set("#1db954")
        }
        handleSpotifyLyrics(c) {
            let e = c.sync_id || c.details || "";
            if (this.lastTrackId() !== e) {
                this.lastTrackId.set(e),
                this.lyrics.set([]),
                this.currentLineIndex.set(-1),
                this.lyricsLoading.set(!0);
                let i = c.timestamps?.end ? Math.floor((c.timestamps.end - c.timestamps.start) / 1e3) : 0;
                this.lyricsService.getLyrics(c.details || "", c.state || "", c.assets?.large_text || "", i).pipe(Y(this.destroyRef)).subscribe(r => {
                    this.lyrics.set(r),
                    this.lyricsLoading.set(!1)
                }
                )
            }
            c.timestamps?.start && (this.lyricsSyncSubscription = D2(0, 200).pipe(Y(this.destroyRef)).subscribe( () => {
                if (!this.lyrics().length)
                    return;
                let i = Date.now() - c.timestamps.start;
                this.updateCurrentLine(i)
            }
            ),
            this.activitiesSubscription.add(this.lyricsSyncSubscription))
        }
        updateCurrentLine(c) {
            let e = -1
              , i = this.lyrics();
            for (let r = 0; r < i.length && c >= i[r].time; r++)
                e = r;
            this.currentLineIndex() !== e && (this.currentLineIndex.set(e),
            this.scrollToActiveLine())
        }
        scrollToActiveLine() {
            if (!this.lyricsContainer || this.currentLineIndex() === -1)
                return;
            let c = this.lyricsContainer.nativeElement
              , e = c.children[this.currentLineIndex()];
            if (e) {
                let i = c.clientHeight
                  , r = e.offsetTop
                  , n = e.clientHeight
                  , s = r - i / 2 + n / 2;
                c.scrollTo({
                    top: s,
                    behavior: "smooth"
                })
            }
        }
        getActivityImage(c) {
            return !c || !c.assets ? "" : c.assets.large_image ? c.assets.large_image.startsWith("spotify:") ? `https://i.scdn.co/image/${c.assets.large_image.split(":")[1]}` : c.assets.large_image.startsWith("mp:external/") ? c.assets.large_image.replace("mp:external/", "https://media.discordapp.net/external/") : `https://cdn.discordapp.com/app-assets/${c.application_id}/${c.assets.large_image}.png` : ""
        }
        getSmallActivityImage(c) {
            return !c || !c.assets || !c.assets.small_image ? "" : c.assets.small_image.startsWith("spotify:") ? `https://i.scdn.co/image/${c.assets.small_image.split(":")[1]}` : c.assets.small_image.startsWith("mp:external/") ? c.assets.small_image.replace("mp:external/", "https://media.discordapp.net/external/") : `https://cdn.discordapp.com/app-assets/${c.application_id}/${c.assets.small_image}.png`
        }
        getServiceIcon(c) {
            if (!c || !c.name)
                return "";
            let e = c.name.toLowerCase()
              , i = {
                spotify: "spotify",
                "visual studio code": "github",
                code: "github",
                "battle.net": "battlenet",
                "epic games": "epicgames",
                "league of legends": "leagueoflegends"
            };
            return i[e] ? `assets/images/connections/${i[e]}.svg` : `assets/images/connections/${e.replace(/\s+/g, "")}.svg`
        }
        handleImageError(c) {
            let e = c.target;
            e.src = "assets/images/no-image-found.jpg",
            e.style.display = "none"
        }
        handleIconError(c) {
            let e = c.target;
            e.style.display = "none",
            e.classList.add("icon-error")
        }
        static{this.\u0275fac = function(e) {
            return new (e || a)
        }
        }static{this.\u0275cmp = j({
            type: a,
            selectors: [["app-floating-activity"]],
            viewQuery: function(e, i) {
                if (e & 1 && X2(T7, 5),
                e & 2) {
                    let r;
                    Y2(r = Q2()) && (i.lyricsContainer = r.first)
                }
            },
            inputs: {
                isMobileEmbedded: [1, "isMobileEmbedded"]
            },
            outputs: {
                visibilityChange: "visibilityChange"
            },
            decls: 1,
            vars: 1,
            consts: [["lyricsContainer", ""], [1, "activity-stack", 3, "has-multiple", "mobile-embedded"], [1, "activity-stack"], ["role", "button", "tabindex", "0", 1, "card-back"], [1, "card-front", 3, "click", "keydown.enter", "keydown.space"], [1, "glass-panel"], [1, "visualizer-background"], [1, "content-wrapper"], [1, "header-label"], [1, "actions-container"], ["title", "Toggle Lyrics", 1, "action-btn", "lyrics-btn", 3, "active"], ["target", "_blank", "title", "Open in Spotify", 1, "action-btn", "external-link", 3, "href"], [1, "main-content", "fade-in"], [1, "lyrics-view", "fade-in"], [1, "stack-pagination"], ["role", "button", "tabindex", "0", 1, "card-back", 3, "click", "keydown.enter", "keydown.space"], [1, "glass-panel", "dimmed"], ["alt", "", 1, "back-bg-image", 3, "src"], [1, "peek-content"], [1, "peek-header"], [1, "icon-wrapper"], [1, "mini-icon", "service-icon", 3, "error", "src", "alt"], [1, "mini-icon", "fallback-icon", 3, "icon"], [1, "peek-title"], [1, "bar-group"], [1, "bar"], ["src", "assets/images/connections/spotify.svg", "alt", "Spotify", 1, "spotify-icon-small"], [1, "spotify-icon-small", "service-icon", 3, "error", "src", "alt"], [1, "spotify-icon-small", "fallback-icon", 3, "icon"], ["title", "Toggle Lyrics", 1, "action-btn", "lyrics-btn", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "width", "16", "height", "16", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M9 18V5l12-2v13"], ["cx", "6", "cy", "18", "r", "3"], ["cx", "18", "cy", "16", "r", "3"], ["target", "_blank", "title", "Open in Spotify", 1, "action-btn", "external-link", 3, "click", "href"], ["d", "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"], ["points", "15 3 21 3 21 9"], ["x1", "10", "y1", "14", "x2", "21", "y2", "3"], [1, "album-art-wrapper"], ["alt", "Activity Art", "crossorigin", "anonymous", 1, "album-art", 3, "error", "src"], ["alt", "Small Icon", 1, "small-icon", 3, "src"], [1, "track-info"], [1, "scrolling-text-container"], [1, "track-title", 3, "title"], [1, "track-details"], [1, "track-artist", 3, "title"], [1, "track-album", 3, "title"], [1, "time-container"], [1, "time-text"], [1, "progress-container"], [1, "progress-bar"], [1, "time-container", "elapsed-only"], [1, "lyrics-loading"], [1, "lyrics-empty"], [1, "lyrics-scroll-container"], [1, "spinner"], [1, "lyric-line", 3, "active", "past"], [1, "lyrics-spacer"], [1, "lyric-line"], [1, "dot", 3, "active"], [1, "dot"]],
            template: function(e, i) {
                e & 1 && N(0, J7, 15, 23, "div", 1),
                e & 2 && w(i.currentActivity() ? 0 : -1)
            },
            dependencies: [z1, u1],
            styles: [`.activity-stack{position:fixed;bottom:2rem;left:50%;transform:translate(-50%);z-index:1000;width:420px;max-width:90vw;perspective:1000px;display:flex;flex-direction:column;align-items:center}.activity-stack.animate-slide-up{animation:slideUp .6s cubic-bezier(.22,1,.36,1) forwards}.activity-stack.mobile-embedded{position:relative;bottom:auto;left:auto;transform:none;z-index:1;width:100%;min-width:0;max-width:100%;margin-top:1rem}.activity-stack.mobile-embedded.animate-slide-up{animation:none}.activity-stack.mobile-embedded .card-back{width:100%;transform:scale(.95) translateY(-35px)}.activity-stack.mobile-embedded .card-back:hover{transform:scale(.95) translateY(-45px)}.activity-stack.mobile-embedded .glass-panel{border-radius:12px;background:#0000004d;border:1px solid rgba(255,255,255,.05);box-shadow:none}.activity-stack.mobile-embedded .track-title{font-size:.9rem}.activity-stack.mobile-embedded .album-art-wrapper{width:48px;height:48px}.card-front{position:relative;width:100%;z-index:10;transition:all .4s cubic-bezier(.34,1.56,.64,1);transform-origin:center bottom}.card-front[role=button]{cursor:pointer}@media(hover:hover){.card-front[role=button]:hover{transform:translateY(-4px)}}.card-front[role=button]:active{transform:scale(.98)}.card-front{user-select:none;-webkit-user-select:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent}.card-front.switching{animation:swapOut .4s forwards}.card-back{position:absolute;top:0;left:0;width:100%;height:100%;z-index:5;transform:scale(.92) translateY(-45px);opacity:.9;transition:all .3s ease;cursor:pointer}.card-back:hover{transform:scale(.92) translateY(-55px);z-index:6}.card-back .glass-panel{background:#1e1e1e99;border:1px solid rgba(255,255,255,.05);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:0 -4px 20px #0000004d;height:100%}.card-back .back-bg-image{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;opacity:.15;filter:blur(4px);z-index:0}.card-back .peek-content{position:absolute;top:12px;left:0;width:100%;text-align:center;z-index:2;opacity:.7;display:flex;justify-content:center}.card-back .peek-header{display:flex;align-items:center;gap:8px;background:#0006;padding:4px 12px;border-radius:12px}.card-back .peek-header .mini-icon{width:14px;height:14px;font-size:12px}.card-back .peek-header .icon-wrapper{position:relative;display:inline-flex;align-items:center;justify-content:center}.card-back .peek-header .icon-wrapper .service-icon{display:block}.card-back .peek-header .icon-wrapper .service-icon.icon-error{display:none}.card-back .peek-header .icon-wrapper .fallback-icon{display:none;opacity:.7}.card-back .peek-header .icon-wrapper .service-icon.icon-error~.fallback-icon{display:block}.card-back .peek-header .peek-title{font-size:.75rem;color:#fff;font-weight:500;white-space:nowrap;max-width:200px;overflow:hidden;text-overflow:ellipsis}.glass-panel{pointer-events:auto;display:block;position:relative;padding:1rem;background:var(--dynamic-bg, rgba(18, 18, 18, .85));backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.08);border-radius:20px;box-shadow:0 8px 32px #0006,0 0 0 1px #ffffff0d inset;transition:background .6s ease,box-shadow .6s ease,all .3s ease;overflow:hidden;text-decoration:none}.glass-panel:before{content:"";position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);opacity:.8;z-index:2}.glass-panel.spotify-panel:before{background:linear-gradient(90deg,transparent,rgba(29,185,84,.8),transparent)}.glass-panel.generic-panel:before{background:linear-gradient(90deg,transparent,rgba(114,137,218,.8),transparent)}.visualizer-background{position:absolute;bottom:0;left:0;width:100%;height:100%;display:flex;align-items:flex-end;justify-content:center;z-index:0;opacity:.15;pointer-events:none;overflow:hidden}.visualizer-background:after{content:"";position:absolute;inset:0;background:linear-gradient(to bottom,rgb(18,18,18) 10%,transparent 80%);pointer-events:none}.visualizer-background .bar-group{display:flex;align-items:flex-end;gap:6px;height:100%;width:110%;justify-content:center;filter:drop-shadow(0 0 8px var(--dynamic-accent, rgba(29, 185, 84, .5)));transition:filter .6s ease}.visualizer-background .bar{width:12px;background:var(--dynamic-accent, linear-gradient(to top, #1db954, #1ed760));border-radius:4px 4px 0 0;animation:wave 1.2s ease-in-out infinite alternate;transform-origin:bottom;opacity:.8;transition:background .6s ease}.visualizer-background .bar:nth-child(1){height:30%;animation-delay:-1.2s;animation-duration:1.4s}.visualizer-background .bar:nth-child(2){height:50%;animation-delay:-1s;animation-duration:1.6s}.visualizer-background .bar:nth-child(3){height:75%;animation-delay:-.8s;animation-duration:1.3s}.visualizer-background .bar:nth-child(4){height:40%;animation-delay:-1.4s;animation-duration:1.5s}.visualizer-background .bar:nth-child(5){height:90%;animation-delay:-.6s;animation-duration:1.7s}.visualizer-background .bar:nth-child(6){height:60%;animation-delay:-1.1s;animation-duration:1.4s}.visualizer-background .bar:nth-child(7){height:45%;animation-delay:-.9s;animation-duration:1.6s}.visualizer-background .bar:nth-child(8){height:80%;animation-delay:-.7s;animation-duration:1.3s}.visualizer-background .bar:nth-child(9){height:35%;animation-delay:-1.3s;animation-duration:1.5s}.visualizer-background .bar:nth-child(10){height:65%;animation-delay:-.5s;animation-duration:1.7s}.visualizer-background .bar:nth-child(11){height:95%;animation-delay:-.3s;animation-duration:1.4s}.visualizer-background .bar:nth-child(12){height:55%;animation-delay:-1.5s;animation-duration:1.6s}.visualizer-background .bar:nth-child(13){height:25%;animation-delay:-.4s;animation-duration:1.3s}.visualizer-background .bar:nth-child(14){height:70%;animation-delay:-.2s;animation-duration:1.5s}.visualizer-background .bar:nth-child(15){height:40%;animation-delay:-.8s;animation-duration:1.7s}.visualizer-background .bar:nth-child(16){height:60%;animation-delay:-.6s;animation-duration:1.4s}.content-wrapper{position:relative;z-index:1;display:flex;flex-direction:column;gap:.75rem;min-width:0;max-width:100%;overflow:hidden}.header-label{display:flex;align-items:center;gap:6px;min-width:0}.header-label .spotify-icon-small{width:16px;height:16px;opacity:.9;flex-shrink:0}.header-label .icon-wrapper{position:relative;display:inline-flex;align-items:center;justify-content:center}.header-label .icon-wrapper .service-icon{display:block}.header-label .icon-wrapper .service-icon.icon-error{display:none}.header-label .icon-wrapper .fallback-icon{display:none;opacity:.7}.header-label .icon-wrapper .service-icon.icon-error~.fallback-icon{display:block}.header-label .generic-icon{font-size:1rem;line-height:1;flex-shrink:0}.header-label span{color:#fff;font-size:.7rem;font-weight:700;letter-spacing:.5px;text-transform:uppercase;text-shadow:0 0 10px rgba(255,255,255,.2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}.spotify-panel .header-label span{color:#1db954;text-shadow:0 0 10px rgba(29,185,84,.3)}.generic-panel .header-label span{color:#7289da;text-shadow:0 0 10px rgba(114,137,218,.3)}.header-label .actions-container{margin-left:auto;display:flex;align-items:center;gap:.5rem}.header-label .action-btn{display:flex;align-items:center;justify-content:center;color:#fff6;transition:all .2s;background:transparent;border:none;padding:2px;cursor:pointer}.header-label .action-btn:hover{color:#fff;transform:scale(1.1)}.header-label .action-btn.active{color:#1db954;filter:drop-shadow(0 0 4px rgba(29,185,84,.5))}.main-content{display:flex;align-items:center;gap:1rem;min-width:0;max-width:100%;overflow:hidden}.main-content.fade-in{animation:fadeIn .3s ease forwards}.lyrics-view{height:90px;width:100%;position:relative;display:flex;flex-direction:column;justify-content:center}.lyrics-view.fade-in{animation:fadeIn .3s ease forwards}.lyrics-view .lyrics-loading,.lyrics-view .lyrics-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;height:100%;color:#ffffff80;font-size:.9rem}.lyrics-view .lyrics-loading .spinner,.lyrics-view .lyrics-empty .spinner{width:20px;height:20px;border:2px solid rgba(255,255,255,.1);border-top-color:#1db954;border-radius:50%;animation:spin 1s linear infinite}.lyrics-view .lyrics-scroll-container{height:100%;overflow-y:hidden;display:flex;flex-direction:column;align-items:center;mask-image:linear-gradient(to bottom,transparent,black 20%,black 80%,transparent);-webkit-mask-image:linear-gradient(to bottom,transparent,black 20%,black 80%,transparent);scroll-behavior:smooth}.lyrics-view .lyrics-scroll-container .lyrics-spacer{height:50%;flex-shrink:0}.lyrics-view .lyrics-scroll-container:before{content:"";display:block;height:35%;flex-shrink:0}.lyrics-view .lyric-line{margin:4px 0;text-align:center;color:#fff6;font-size:.9rem;font-weight:500;transition:all .3s ease;cursor:default;line-height:1.4;max-width:90%}.lyrics-view .lyric-line.active{color:#fff;font-size:1.1rem;font-weight:700;text-shadow:0 0 10px rgba(29,185,84,.6);transform:scale(1.05)}.lyrics-view .lyric-line.past{color:#fff3}.album-art-wrapper{position:relative;width:56px;height:56px;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px #0006;flex-shrink:0;background:#121212}.album-art-wrapper .album-art{width:100%;height:100%;object-fit:cover}.album-art-wrapper .small-icon{position:absolute;bottom:-4px;right:-4px;width:24px;height:24px;border-radius:50%;background:#181818;border:2px solid #181818;padding:2px}.track-info{display:flex;flex-direction:column;justify-content:center;flex-grow:1;min-width:0;max-width:100%;gap:3px}.track-info .scrolling-text-container{min-width:0;max-width:100%;overflow:hidden}.track-info .track-title{color:#fff;font-size:1rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:1.2;text-shadow:0 2px 4px rgba(0,0,0,.3);max-width:100%}.track-info .track-details{display:flex;align-items:center;overflow:hidden;white-space:nowrap;max-width:100%}.track-info .track-details .track-artist{color:#ffffffb3;font-size:.85rem;font-weight:400;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-shrink:1;min-width:0}.track-info .track-details .track-album{color:#ffffffb3;font-size:.85rem;font-weight:400;margin-left:4px;opacity:.6;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-shrink:1;min-width:0}.time-container{display:flex;align-items:center;gap:8px;width:100%;margin-top:6px}.time-container.elapsed-only{justify-content:flex-start}.time-container.elapsed-only .time-text{color:#fff;opacity:.6;background:#ffffff1a;padding:2px 6px;border-radius:4px;font-size:.65rem}.time-container .time-text{color:#ffffff80;font-size:.7rem;font-family:monospace;min-width:32px;text-shadow:0 1px 2px rgba(0,0,0,.5)}.time-container .time-text:last-child{text-align:right}.time-container .progress-container{flex-grow:1;height:4px;background:#ffffff1a;border-radius:2px;overflow:hidden;box-shadow:inset 0 1px 2px #0003}.time-container .progress-container .progress-bar{height:100%;background-color:var(--dynamic-accent, #1db954);border-radius:2px;transition:width .3s linear;box-shadow:0 0 8px #1db95466}.stack-pagination{position:absolute;bottom:8px;left:50%;transform:translate(-50%);display:flex;gap:6px;z-index:20}.stack-pagination .dot{width:4px;height:4px;border-radius:50%;background:#fff3;transition:all .3s}.stack-pagination .dot.active{background:#fff;transform:scale(1.5);box-shadow:0 0 8px #ffffff80}@keyframes wave{0%{height:15%}50%{height:60%}to{height:100%}}@keyframes slideUp{0%{opacity:0;transform:translate(-50%,20px)}to{opacity:1;transform:translate(-50%)}}@keyframes swapOut{0%{transform:translateY(0) scale(1);opacity:1}50%{transform:translateY(20px) scale(.95);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}@keyframes fadeIn{0%{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@media(max-width:768px){.activity-stack:not(.mobile-embedded){display:none!important}.activity-stack.mobile-embedded{display:flex!important;position:relative!important;width:100%!important;min-width:0!important}}
`, `app-floating-activity{display:block;width:100%}
`],
            encapsulation: 2
        })
        }
    }
    return a
}
)();
var w0 = ( () => {
    class a {
        constructor() {
            this.http = _(w2),
            this.urlDiscordApi = l2.apiUrl
        }
        getDiscordUser(c) {
            return this.http.get(`${this.urlDiscordApi}user/${c}`)
        }
        static{this.\u0275fac = function(e) {
            return new (e || a)
        }
        }static{this.\u0275prov = O({
            token: a,
            factory: a.\u0275fac,
            providedIn: "root"
        })
        }
    }
    return a
}
)();
var k0 = ( () => {
    class a {
        constructor() {
            this.http = _(w2),
            this.EFFECTS_API_URL = "https://discord.com/api/v9/user-profile-effects",
            this.effectsCache = null
        }
        getAllEffects() {
            return this.effectsCache ? T2(this.effectsCache) : this.http.get(this.EFFECTS_API_URL).pipe(c2(c => (this.effectsCache = c.profile_effect_configs || [],
            this.effectsCache)), G2(c => (console.error("Error fetching profile effects:", c),
            T2([]))))
        }
        getEffectById(c) {
            return this.getAllEffects().pipe(c2(e => e.find(r => r.id === c) || null))
        }
        static{this.\u0275fac = function(e) {
            return new (e || a)
        }
        }static{this.\u0275prov = O({
            token: a,
            factory: a.\u0275fac,
            providedIn: "root"
        })
        }
    }
    return a
}
)();
var c9 = ["cardElement"]
  , a9 = a => ({
    "--accent-color": a
})
  , e9 = (a, l) => l.config.src;
function l9(a, l) {
    if (a & 1 && S(0, "img", 36),
    a & 2) {
        let c, e = l.$implicit, i = L(3);
        y2("z-index", e.config.zIndex || 100)("visibility", e.isVisible ? "visible" : "hidden"),
        y("src", e.config.src, R)("alt", ((c = i.profileEffectConfig()) == null ? null : c.title) || "Profile Effect")
    }
}
function i9(a, l) {
    if (a & 1 && (p(0, "div", 4),
    h2(1, l9, 1, 6, "img", 35, e9),
    z()),
    a & 2) {
        let c = L(2);
        u(),
        M2(c.renderedLayers())
    }
}
function r9(a, l) {
    if (a & 1 && S(0, "img", 11),
    a & 2) {
        let c, e = L(2);
        y("src", "https://cdn.discordapp.com/avatar-decoration-presets/" + ((c = e.userData()) == null || c.user == null || c.user.avatar_decoration_data == null ? null : c.user.avatar_decoration_data.asset) + ".png", R)
    }
}
function n9(a, l) {
    if (a & 1) {
        let c = q();
        p(0, "div", 19)(1, "img", 37),
        D("error", function(i) {
            E(c);
            let r = L(2);
            return B(r.handleImageError(i))
        }),
        z(),
        p(2, "span"),
        C(3),
        z()()
    }
    if (a & 2) {
        let c = L(2);
        u(),
        y("src", c.clanBadgeUrl(), R),
        u(2),
        T(c.clanTag())
    }
}
function s9(a, l) {
    if (a & 1 && (p(0, "span", 38),
    C(1, "\u2022"),
    z(),
    p(2, "span", 39),
    C(3),
    z()),
    a & 2) {
        let c, e = L(2);
        u(3),
        T((c = e.userData()) == null || c.user_profile == null ? null : c.user_profile.pronouns)
    }
}
function t9(a, l) {
    a & 1 && (p(0, "i", 23),
    z2(),
    p(1, "svg", 40),
    S(2, "path", 41),
    z()())
}
function o9(a, l) {
    a & 1 && (p(0, "i", 24),
    z2(),
    p(1, "svg", 40),
    S(2, "path", 42),
    z()())
}
function f9(a, l) {
    a & 1 && (p(0, "i", 25),
    z2(),
    p(1, "svg", 40),
    S(2, "path", 43),
    z()())
}
function m9(a, l) {
    if (a & 1 && (p(0, "a", 27),
    S(1, "img", 44),
    z()),
    a & 2) {
        let c = l.$implicit
          , e = L(2);
        y("href", c.link || "", R)("title", c.description),
        u(),
        y("src", e.apiUrl + "badge/" + c.icon + ".png", R)("alt", c.id)
    }
}
function d9(a, l) {
    if (a & 1) {
        let c = q();
        p(0, "img", 47),
        D("error", function(i) {
            E(c);
            let r = L(4);
            return B(r.handleImageError(i))
        }),
        z()
    }
    if (a & 2) {
        let c = L(4);
        y("src", "https://cdn.discordapp.com/emojis/" + c.custom_status().emoji.id + (c.custom_status().emoji.animated ? ".gif" : ".png") + "?size=24&quality=lossless", R)
    }
}
function p9(a, l) {
    if (a & 1 && (p(0, "span", 46),
    C(1),
    z()),
    a & 2) {
        let c = L(4);
        u(),
        T(c.custom_status().emoji.name)
    }
}
function u9(a, l) {
    if (a & 1 && N(0, d9, 1, 1, "img", 45)(1, p9, 2, 1, "span", 46),
    a & 2) {
        let c = L(3);
        w(c.custom_status().emoji.id ? 0 : c.custom_status().emoji.name ? 1 : -1)
    }
}
function z9(a, l) {
    if (a & 1 && (p(0, "div", 29),
    N(1, u9, 2, 1),
    p(2, "span", 15),
    C(3),
    z()()),
    a & 2) {
        let c = L(2);
        u(),
        w(c.custom_status().emoji ? 1 : -1),
        u(2),
        T(c.custom_status().state)
    }
}
function v9(a, l) {
    if (a & 1 && (p(0, "section", 30)(1, "h3", 48),
    C(2, "About Me"),
    z(),
    S(3, "div", 49),
    z()),
    a & 2) {
        let c = L(2);
        u(3),
        y("innerHTML", c.userBioFormatted(), $2)
    }
}
function h9(a, l) {
    a & 1 && (p(0, "div", 31),
    S(1, "app-floating-activity", 50),
    z()),
    a & 2 && (u(),
    y("isMobileEmbedded", !0))
}
function M9(a, l) {
    if (a & 1 && (p(0, "a", 52),
    S(1, "img", 44),
    z()),
    a & 2) {
        let c = l.$implicit;
        y("href", "#", R)("title", c.name + " (" + c.type + ")"),
        u(),
        y("src", v4("assets/images/connections/", c.type, ".svg"), R)("alt", c.type)
    }
}
function g9(a, l) {
    if (a & 1 && (p(0, "section", 32)(1, "h3", 48),
    C(2, "Connections"),
    z(),
    p(3, "div", 51),
    h2(4, M9, 2, 5, "a", 52, S2),
    z()()),
    a & 2) {
        let c, e = L(2);
        u(4),
        M2((c = e.userData()) == null ? null : c.connected_accounts)
    }
}
function L9(a, l) {
    if (a & 1) {
        let c = q();
        p(0, "div", 2),
        N(1, i9, 3, 0, "div", 4),
        p(2, "div", 5),
        S(3, "div", 6),
        z(),
        p(4, "div", 7)(5, "div", 8)(6, "div", 9)(7, "div", 10),
        N(8, r9, 1, 1, "img", 11),
        S(9, "img", 12),
        z(),
        p(10, "div", 13),
        S(11, "div", 14),
        p(12, "span", 15),
        C(13),
        M4(14, "titlecase"),
        z()()(),
        p(15, "div", 16)(16, "div", 17)(17, "h1", 18),
        C(18),
        z(),
        N(19, n9, 4, 2, "div", 19),
        z(),
        p(20, "div", 20)(21, "span", 21),
        C(22),
        z(),
        N(23, s9, 4, 1),
        p(24, "div", 22),
        N(25, t9, 3, 0, "i", 23),
        N(26, o9, 3, 0, "i", 24),
        N(27, f9, 3, 0, "i", 25),
        z()(),
        p(28, "div", 26),
        h2(29, m9, 2, 4, "a", 27, S2),
        z()()(),
        p(31, "div", 28),
        N(32, z9, 4, 2, "div", 29),
        N(33, v9, 4, 1, "section", 30),
        N(34, h9, 2, 1, "div", 31),
        N(35, g9, 6, 0, "section", 32),
        p(36, "div", 33)(37, "input", 34),
        D("ngModelChange", function(i) {
            E(c);
            let r = L();
            return B(r.message.set(i))
        })("keyup.enter", function() {
            E(c);
            let i = L();
            return B(i.sendMessage())
        }),
        z()()()()()
    }
    if (a & 2) {
        let c, e, i, r, n, s, t, o, f, d, v, h, g = L();
        y("ngStyle", h4(22, a9, g.themesColor()[0] || "#7289da")),
        u(),
        w(g.hasProfileEffect() ? 1 : -1),
        u(),
        y2("background-image", "url(" + g.apiUrl + "banner/" + g.ProfileId() + ")"),
        u(6),
        w(!((c = g.userData()) == null || c.user == null || c.user.avatar_decoration_data == null) && c.user.avatar_decoration_data.asset ? 8 : -1),
        u(),
        y("src", g.apiUrl + "avatar/" + g.ProfileId(), R),
        u(),
        y("ngClass", ((e = g.lanyardData()) == null || e.d == null ? null : e.d.discord_status) || "offline"),
        u(3),
        T(g4(14, 20, ((i = g.lanyardData()) == null || i.d == null ? null : i.d.discord_status) || "offline")),
        u(5),
        o2(" ", ((r = g.userData()) == null || r.user == null ? null : r.user.global_name) || ((r = g.userData()) == null || r.user == null ? null : r.user.username), " "),
        u(),
        w(g.clanTag() && g.clanBadgeUrl() ? 19 : -1),
        u(3),
        T("@" + ((n = g.userData()) == null || n.user == null ? null : n.user.username)),
        u(),
        w(!((s = g.userData()) == null || s.user_profile == null) && s.user_profile.pronouns ? 23 : -1),
        u(2),
        w(!((t = g.lanyardData()) == null || t.d == null) && t.d.active_on_discord_desktop ? 25 : -1),
        u(),
        w(!((o = g.lanyardData()) == null || o.d == null) && o.d.active_on_discord_web ? 26 : -1),
        u(),
        w(!((f = g.lanyardData()) == null || f.d == null) && f.d.active_on_discord_mobile ? 27 : -1),
        u(2),
        M2((d = g.userData()) == null ? null : d.badges),
        u(3),
        w(g.custom_status() && g.custom_status().state ? 32 : -1),
        u(),
        w(((v = g.userData()) == null || v.user_profile == null ? null : v.user_profile.bio.length) > 0 ? 33 : -1),
        u(),
        w(g.isMobile() ? 34 : -1),
        u(),
        w(((h = g.userData()) == null ? null : h.connected_accounts.length) > 0 ? 35 : -1),
        u(2),
        y("ngModel", g.message())
    }
}
function C9(a, l) {
    a & 1 && (p(0, "div", 3),
    S(1, "div", 53),
    p(2, "div", 54),
    S(3, "div", 55),
    z(),
    p(4, "div", 56),
    S(5, "div", 57)(6, "div", 58)(7, "div", 59)(8, "div", 59)(9, "div", 60),
    z()())
}
var ha = ( () => {
    class a {
        constructor() {
            this.ProfileId = N2(l2.discordId),
            this.themeColorsChange = f2(),
            this.nameplateAssetChange = f2(),
            this.discordApiService = _(w0),
            this.lanyardService = _(v1),
            this.card3DService = _(w4),
            this.profileEffectsService = _(k0),
            this.destroyRef = _(s2),
            this.layerTimeouts = [],
            this.boldRegex = /\*\*(.*?)\*\*/g,
            this.italicRegex1 = /\*(.*?)\*/g,
            this.italicRegex2 = /_(.*?)_/g,
            this.underlineRegex = /__(.*?)__/g,
            this.strikeRegex = /~~(.*?)~~/g,
            this.monoRegex = /`([^`]+)`/g,
            this.codeBlockRegex = /```([\s\S]*?)```/g,
            this.linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g,
            this.urlRegex = /(?<!href="")(?<!>)(https?:\/\/[^\s<]+)/g,
            this.blockquoteRegex = /^&gt; ?(.*$)/gm,
            this.blockquoteMergeRegex = /<\/blockquote>\n<blockquote>/g,
            this.emojiRegex = /(&lt;|<)(a?):([a-zA-Z0-9_]+):(\d+)(&gt;|>)/g,
            this.userId = l2.discordId,
            this.apiUrl = l2.apiUrl,
            this.userDataStatus = b(!1),
            this.userData = b(void 0),
            this.userBioFormatted = b(void 0),
            this.themesColor = b([]),
            this.isMobile = b(!1),
            this.message = b(""),
            this.lanyardData = b(null),
            this.profileEffectConfig = b(null),
            this.renderedLayers = b([]),
            this.custom_status = b(null),
            this.statusColor = b("#43b581"),
            this.clanTag = V( () => {
                let c = this.userData();
                return c?.user?.clan?.tag || c?.user?.primary_guild?.tag || null
            }
            ),
            this.clanBadge = V( () => {
                let c = this.userData();
                return c?.user?.clan?.badge || c?.user?.primary_guild?.badge || null
            }
            ),
            this.clanGuildId = V( () => {
                let c = this.userData();
                return c?.user?.clan?.identity_guild_id || c?.user?.primary_guild?.identity_guild_id || null
            }
            ),
            this.clanBadgeUrl = V( () => {
                let c = this.clanBadge()
                  , e = this.clanGuildId();
                return !c || !e ? null : `https://cdn.discordapp.com/clan-badges/${e}/${c}.png?size=32`
            }
            ),
            this.hasProfileEffect = V( () => !!this.profileEffectConfig() && !!this.renderedLayers().length),
            this.profileEffectId = V( () => this.userData()?.user_profile?.profile_effect?.id || null),
            this.checkScreenSize(),
            l4(window, "resize").pipe(r4(150), Y(this.destroyRef)).subscribe( () => this.checkScreenSize()),
            v2( () => {
                this.ProfileId(),
                this.resetProfileData(),
                this.getDiscordUserData(),
                this.getLanyardData()
            }
            ),
            v2( () => {
                let c = this.lanyardService.getLanyardData()();
                if (c) {
                    this.lanyardData.set(c);
                    let e = c.d?.activities?.find(i => i.name === "Custom Status") || null;
                    this.custom_status.set(e),
                    this.updateStatusColor()
                }
            }
            )
        }
        checkScreenSize() {
            this.isMobile.set(window.innerWidth <= 768)
        }
        ngAfterViewInit() {
            this.cardElement && this.card3DService.initCard3DEffect(this.cardElement, {
                maxRotation: 12,
                scale: 1.03,
                perspective: 1200,
                shadowIntensity: .25,
                transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)"
            }),
            this.destroyRef.onDestroy( () => {
                this.layerTimeouts.forEach(c => clearTimeout(c)),
                this.layerTimeouts = [],
                this.cardElement && this.card3DService.destroyCard3DEffect(this.cardElement)
            }
            )
        }
        resetProfileData() {
            this.userDataStatus.set(!1),
            this.userData.set(void 0),
            this.userBioFormatted.set(void 0),
            this.themesColor.set([]),
            this.lanyardData.set(null),
            this.custom_status.set(null),
            this.profileEffectConfig.set(null),
            this.renderedLayers.set([]),
            this.themeColorsChange.emit([]),
            this.nameplateAssetChange.emit(null)
        }
        getDiscordUserData() {
            this.discordApiService.getDiscordUser(this.ProfileId()).pipe(Y(this.destroyRef)).subscribe({
                next: c => {
                    this.userDataStatus.set(!0),
                    this.userData.set(c),
                    this.userBioFormatted.set(this.parseBio(c.user_profile?.bio || ""));
                    let e = c.user_profile?.theme_colors || []
                      , i = e.length === 0 ? ["#5C5C5C", "#5C5C5C"] : e.map(s => "#" + s.toString(16).padStart(6, "0").toUpperCase());
                    this.themesColor.set(i),
                    this.themeColorsChange.emit(i);
                    let r = c.user?.collectibles?.nameplate?.asset || null;
                    this.nameplateAssetChange.emit(r);
                    let n = this.profileEffectId();
                    n && this.loadProfileEffect(n)
                }
                ,
                error: c => {
                    this.userDataStatus.set(!1),
                    console.error("Error fetching Discord user data:", c)
                }
            })
        }
        loadProfileEffect(c) {
            this.profileEffectsService.getEffectById(c).pipe(Y(this.destroyRef)).subscribe({
                next: e => {
                    e && e.effects && (this.profileEffectConfig.set(e),
                    this.initializeProfileEffectLayers(e.effects))
                }
                ,
                error: e => {
                    console.error("Error loading profile effect:", e)
                }
            })
        }
        initializeProfileEffectLayers(c) {
            let i = [...c].sort( (r, n) => (r.start || 0) - (n.start || 0)).map(r => ({
                config: r,
                isVisible: !1
            }));
            this.renderedLayers.set(i),
            i.forEach(r => {
                let n = r.config.start || 0;
                if (n === 0)
                    r.isVisible = !0,
                    this.renderedLayers.update(s => [...s]),
                    this.handleLayerLifecycle(r);
                else {
                    let s = setTimeout( () => {
                        r.isVisible = !0,
                        this.renderedLayers.update(t => [...t]),
                        this.handleLayerLifecycle(r)
                    }
                    , n);
                    this.layerTimeouts.push(s)
                }
            }
            )
        }
        handleLayerLifecycle(c) {
            let e = c.config.duration || 0
              , i = c.config.loopDelay || 0;
            if (c.config.loop) {
                if (i > 0) {
                    let r = !0;
                    this.destroyRef.onDestroy( () => {
                        r = !1
                    }
                    );
                    let n = () => {
                        if (!r)
                            return;
                        let s = setTimeout( () => {
                            if (!r)
                                return;
                            c.isVisible = !1,
                            this.renderedLayers.update(o => [...o]);
                            let t = setTimeout( () => {
                                r && (c.isVisible = !0,
                                this.renderedLayers.update(o => [...o]),
                                n())
                            }
                            , i);
                            this.layerTimeouts.push(t)
                        }
                        , e);
                        this.layerTimeouts.push(s)
                    }
                    ;
                    n()
                }
            } else if (e > 0) {
                let r = setTimeout( () => {
                    c.isVisible = !1,
                    this.renderedLayers.update(n => [...n])
                }
                , e);
                this.layerTimeouts.push(r)
            }
        }
        getLanyardData() {
            this.lanyardService.setInitialData(this.ProfileId()),
            this.lanyardService.setupWebSocket()
        }
        updateStatusColor() {
            let c = this.lanyardData()?.d?.discord_status
              , e = "#747f8d";
            switch (c) {
            case "online":
                e = "#43b581";
                break;
            case "idle":
                e = "#faa61a";
                break;
            case "dnd":
                e = "#f04747";
                break;
            case "streaming":
                e = "#593695";
                break
            }
            this.statusColor.set(e)
        }
        escapeHtml(c) {
            return c.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
        }
        simpleMarkdown(c) {
            if (!c)
                return "";
            let e = this.escapeHtml(c);
            return e = e.replace(this.boldRegex, "<b>$1</b>"),
            e = e.replace(this.italicRegex1, "<i>$1</i>"),
            e = e.replace(this.italicRegex2, "<i>$1</i>"),
            e = e.replace(this.underlineRegex, "<u>$1</u>"),
            e = e.replace(this.strikeRegex, "<s>$1</s>"),
            e = e.replace(this.monoRegex, "<code>$1</code>"),
            e = e.replace(this.codeBlockRegex, "<pre><code>$1</code></pre>"),
            e = e.replace(this.linkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'),
            e = e.replace(this.urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'),
            e = e.replace(this.blockquoteRegex, "<blockquote>$1</blockquote>"),
            e = e.replace(this.blockquoteMergeRegex, "<br>"),
            e = e.replace(/\n/g, "<br>"),
            e
        }
        parseBio(c) {
            if (!c)
                return "";
            let e = this.simpleMarkdown(c);
            return e = e.replace(this.emojiRegex, (i, r, n, s, t) => `<img src="https://cdn.discordapp.com/emojis/${t}.${n === "a" ? "gif" : "png"}" alt=":${s}:" title=":${s}:" class="discord-emoji">`),
            e
        }
        sendMessage() {
            window.open(`https://discord.com/users/${this.userId}`, "_blank"),
            this.message.set("")
        }
        handleImageError(c) {
            let e = c.target;
            e.src = "../../../assets/images/no-image-found.jpg"
        }
        static{this.\u0275fac = function(e) {
            return new (e || a)
        }
        }static{this.\u0275cmp = j({
            type: a,
            selectors: [["app-card-profile"]],
            viewQuery: function(e, i) {
                if (e & 1 && X2(c9, 5),
                e & 2) {
                    let r;
                    Y2(r = Q2()) && (i.cardElement = r.first)
                }
            },
            inputs: {
                ProfileId: [1, "ProfileId"]
            },
            outputs: {
                themeColorsChange: "themeColorsChange",
                nameplateAssetChange: "nameplateAssetChange"
            },
            decls: 4,
            vars: 1,
            consts: [["cardElement", ""], [1, "card-3d-container"], [1, "aesthetic-card", "animate-scale-in", 3, "ngStyle"], [1, "skeleton-card", "animate-scale-in"], [1, "profile-effect-container"], [1, "card-cover"], [1, "cover-overlay"], [1, "card-content"], [1, "header-section"], [1, "avatar-wrapper"], [1, "avatar-container"], ["alt", "Avatar Decoration", 1, "avatar-decoration", 3, "src"], ["alt", "Avatar", 1, "avatar-img", 3, "src"], [1, "status-badge", 3, "ngClass"], [1, "status-dot"], [1, "status-text"], [1, "user-info"], [1, "name-row"], [1, "display-name"], [1, "clan-tag"], [1, "username-row"], [1, "username"], [1, "platform-indicators"], ["title", "Desktop", 1, "platform-icon", "desktop"], ["title", "Web", 1, "platform-icon", "web"], ["title", "Mobile", 1, "platform-icon", "mobile"], [1, "badges-list"], ["target", "_blank", 1, "badge-item", 3, "href", "title"], [1, "scrollable-content"], [1, "custom-status-card"], [1, "section", "bio-section"], [1, "mobile-only-section"], [1, "section", "connections-section"], [1, "message-section"], ["type", "text", "placeholder", "Send a message...", "name", "message", 1, "aesthetic-input", 3, "ngModelChange", "keyup.enter", "ngModel"], ["fetchpriority", "high", 1, "profile-effect-layer", 3, "src", "alt", "z-index", "visibility"], ["fetchpriority", "high", 1, "profile-effect-layer", 3, "src", "alt"], ["alt", "Clan Badge", 1, "clan-badge", 3, "error", "src"], [1, "divider"], [1, "pronouns"], ["viewBox", "0 0 24 24", "fill", "currentColor"], ["d", "M4 2.5c-1.103 0-2 .897-2 2v11c0 1.104.897 2 2 2h7v2H7v2h10v-2h-4v-2h7c1.103 0 2-.896 2-2v-11c0-1.103-.897-2-2-2H4Zm16 2v9H4v-9h16Z"], ["d", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93Zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39Z"], ["d", "M15.5 1h-8A2.5 2.5 0 0 0 5 3.5v17A2.5 2.5 0 0 0 7.5 23h8a2.5 2.5 0 0 0 2.5-2.5v-17A2.5 2.5 0 0 0 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"], ["loading", "lazy", 3, "src", "alt"], ["alt", "Status Emoji", 1, "status-emoji", 3, "src"], [1, "status-emoji-text"], ["alt", "Status Emoji", 1, "status-emoji", 3, "error", "src"], [1, "section-title"], [1, "markdown-content", 3, "innerHTML"], [3, "isMobileEmbedded"], [1, "connections-grid"], [1, "connection-item", 3, "href", "title"], [1, "skeleton-banner"], [1, "skeleton-header"], [1, "skeleton-avatar"], [1, "skeleton-body"], [1, "skeleton-line", "title"], [1, "skeleton-line", "subtitle"], [1, "skeleton-line", "text"], [1, "skeleton-line", "text-short"]],
            template: function(e, i) {
                e & 1 && (p(0, "div", 1, 0),
                N(2, L9, 38, 24, "div", 2)(3, C9, 10, 0, "div", 3),
                z()),
                e & 2 && (u(2),
                w(i.userDataStatus() ? 2 : 3))
            },
            dependencies: [b4, L4, C4, c1, K2, J2, Z2, N0, x4],
            styles: [`.card-3d-container{display:flex;justify-content:center;perspective:1500px;width:100%}@keyframes shimmer{0%{background-position:-468px 0}to{background-position:468px 0}}.skeleton-card{position:relative;width:400px;min-height:500px;background:#141418bf;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.08);border-radius:24px;overflow:hidden;box-shadow:0 20px 40px #0006}.skeleton-card .skeleton-bg,.skeleton-card .skeleton-line,.skeleton-card .skeleton-avatar,.skeleton-card .skeleton-banner{animation:shimmer 1s linear infinite;background:linear-gradient(to right,#2f2f2f 8%,#3a3a3a 18%,#2f2f2f 33%);background-size:800px 104px}.skeleton-card .skeleton-banner{height:160px;width:100%;margin-bottom:60px}.skeleton-card .skeleton-header{padding:0 1.5rem;position:relative;top:-110px;margin-bottom:-90px;display:flex;justify-content:space-between;align-items:flex-end}.skeleton-card .skeleton-avatar{width:100px;height:100px;border-radius:50%;border:4px solid rgb(20,20,24)}.skeleton-card .skeleton-body{padding:2rem 1.5rem 1.5rem;display:flex;flex-direction:column;gap:1rem}.skeleton-card .skeleton-line{height:16px;border-radius:4px}.skeleton-card .skeleton-line.title{height:28px;width:60%;margin-bottom:.5rem}.skeleton-card .skeleton-line.subtitle{height:16px;width:40%}.skeleton-card .skeleton-line.text{width:100%}.skeleton-card .skeleton-line.text-short{width:80%}.aesthetic-card{position:relative;width:400px;background:#141418bf;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.08);border-radius:24px;overflow:hidden;box-shadow:0 20px 40px #0006,0 0 0 1px #ffffff0d inset;color:#fff;font-family:Geist,Inter,system-ui,-apple-system,sans-serif;transform-style:preserve-3d;transition:transform .1s ease-out}.aesthetic-card:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at top right,var(--accent-color),transparent 70%);opacity:.15;pointer-events:none;z-index:0}.profile-effect-container{position:absolute;inset:0;pointer-events:none;z-index:5}.profile-effect-container .profile-effect-layer{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.card-cover{height:160px;background-size:cover;background-position:center;position:relative}.card-cover .cover-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,transparent,rgba(20,20,24,.95))}.card-content{position:relative;z-index:2;padding:0 1.5rem 1.5rem;margin-top:-60px}.header-section{display:flex;flex-direction:column;gap:1rem;margin-bottom:1.5rem}.avatar-wrapper{display:flex;align-items:flex-end;justify-content:space-between;position:relative}.avatar-container{position:relative;width:100px;height:100px;border-radius:50%;background:#1e1e1e}.avatar-container .avatar-img{width:100%;height:100%;border-radius:50%;border:4px solid rgb(20,20,24);position:relative;z-index:2}.avatar-container .avatar-decoration{position:absolute;top:50%;left:50%;width:100%;height:100%;transform:translate(-50%,-50%);z-index:3;pointer-events:none}.status-badge{position:absolute;right:0;display:flex;align-items:center;gap:6px;padding:4px 10px;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border-radius:20px;border:1px solid rgba(255,255,255,.1);font-size:.8rem;font-weight:600;color:#fff;transition:all .3s ease;z-index:4}.status-badge .status-dot{width:8px;height:8px;border-radius:50%;background:currentColor;box-shadow:0 0 8px currentColor}.status-badge.online{border-color:#43b5814d;color:#43b581}.status-badge.online .status-dot{background:#43b581;box-shadow:0 0 8px #43b58199}.status-badge.idle{border-color:#faa61a4d;color:#faa61a}.status-badge.idle .status-dot{background:#faa61a;box-shadow:0 0 8px #faa61a99}.status-badge.dnd{border-color:#f047474d;color:#f04747}.status-badge.dnd .status-dot{background:#f04747;box-shadow:0 0 8px #f0474799}.status-badge.streaming{border-color:#5936954d;color:#593695}.status-badge.streaming .status-dot{background:#593695;box-shadow:0 0 8px #59369599}.status-badge.offline{border-color:#747f8d4d;color:#747f8d}.status-badge.offline .status-dot{background:#747f8d;box-shadow:none;border:2px solid #747f8d;background:transparent}.platform-indicators{display:flex;gap:6px;margin-left:5px;background:transparent;padding:0;border:none;border-radius:0}.platform-indicators .platform-icon{color:#b9bbbe;width:16px;height:16px;display:flex;align-items:center;justify-content:center;opacity:.7;transition:opacity .2s}.platform-indicators .platform-icon svg{width:18px;height:18px}.platform-indicators .platform-icon:hover{opacity:1}.platform-indicators .platform-icon.desktop{color:#d3f258}.platform-indicators .platform-icon.web{color:#00a8fc}.platform-indicators .platform-icon.mobile{color:#3ba55d}.user-info .name-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.user-info .name-row .display-name{font-size:1.5rem;font-weight:700;color:#fff;margin:0;letter-spacing:-.02em}.user-info .name-row .clan-tag{background:#5865f226;border:1px solid rgba(88,101,242,.3);padding:2px 6px;border-radius:6px;display:flex;align-items:center;gap:4px;font-size:.75rem;font-weight:600;color:#dee0fc}.user-info .name-row .clan-tag .clan-badge{width:14px;height:14px}.user-info .username-row{display:flex;align-items:center;gap:6px;color:#b9bbbe;font-size:.95rem}.user-info .username-row .divider{opacity:.5}.user-info .badges-list{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.user-info .badges-list .badge-item{width:22px;height:22px;transition:transform .2s cubic-bezier(.34,1.56,.64,1)}.user-info .badges-list .badge-item img{width:100%;height:100%;object-fit:contain}.user-info .badges-list .badge-item:hover{transform:scale(1.15);filter:drop-shadow(0 0 4px rgba(255,255,255,.3))}.scrollable-content{display:flex;flex-direction:column;gap:1.25rem}.mobile-only-section{width:100%;display:block}.custom-status-card{background:#ffffff08;border:1px solid rgba(255,255,255,.05);padding:10px 14px;border-radius:12px;display:flex;align-items:center;gap:10px;font-size:.9rem;color:#dedede}.custom-status-card .status-emoji{width:20px;height:20px}.custom-status-card .status-text{font-weight:500}.section .section-title{font-size:.75rem;text-transform:uppercase;letter-spacing:.1em;font-weight:700;color:#72767d;margin-bottom:.75rem}.bio-section .markdown-content{font-size:.9rem;line-height:1.6;color:#dcddde}.bio-section .markdown-content a{color:#00aff4;text-decoration:none}.bio-section .markdown-content a:hover{text-decoration:underline}.bio-section .markdown-content .discord-emoji,.bio-section .markdown-content .d-emoji{display:inline-block;width:24px;height:24px;vertical-align:middle;object-fit:contain;margin:0 1px}.bio-section .markdown-content p{margin:0;display:inline}.bio-section .markdown-content blockquote{border-left:4px solid #4f545c;margin:.5rem 0;padding-left:10px;color:#b9bbbe}.connections-grid{display:flex;flex-wrap:wrap;gap:8px}.connections-grid .connection-item{background:#ffffff0d;width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;transition:all .2s ease}.connections-grid .connection-item img{width:20px;height:20px;opacity:.8;transition:opacity .2s}.connections-grid .connection-item:hover{background:#ffffff1a;transform:translateY(-2px)}.connections-grid .connection-item:hover img{opacity:1}.message-section{margin-top:.5rem}.message-section .aesthetic-input{width:100%;background:#0000004d;border:1px solid rgba(255,255,255,.1);color:#fff;padding:10px 14px;border-radius:12px;font-size:.9rem;transition:all .2s ease}.message-section .aesthetic-input:focus{outline:none;background:#00000080;border-color:var(--accent-color);box-shadow:0 0 0 2px rgba(var(--accent-color),.2)}.message-section .aesthetic-input::placeholder{color:#72767d}@keyframes scaleIn{0%{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}.animate-scale-in{animation:scaleIn .5s cubic-bezier(.2,.8,.2,1) forwards}
`],
            encapsulation: 2,
            changeDetection: 0
        })
        }
    }
    return a
}
)();
var ba = ( () => {
    class a {
        constructor() {
            this.destroyRef = _(s2),
            this.hours = b("00"),
            this.minutes = b("00"),
            this.seconds = b("00"),
            this.ampm = b(""),
            this.day = b(""),
            this.fullDate = b(""),
            this.updateTime(),
            i4(1e3).pipe(Y(this.destroyRef)).subscribe( () => this.updateTime())
        }
        updateTime() {
            let c = new Date
              , e = c.getHours()
              , i = c.getMinutes()
              , r = c.getSeconds();
            this.ampm.set(e >= 12 ? "PM" : "AM"),
            e = e % 12,
            e = e || 12,
            this.hours.set(e < 10 ? "0" + e : e.toString()),
            this.minutes.set(i < 10 ? "0" + i : i.toString()),
            this.seconds.set(r < 10 ? "0" + r : r.toString());
            let n = c.toLocaleDateString("en-US", {
                weekday: "long"
            });
            this.day.set(n.charAt(0).toUpperCase() + n.slice(1)),
            this.fullDate.set(c.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric"
            }))
        }
        static{this.\u0275fac = function(e) {
            return new (e || a)
        }
        }static{this.\u0275cmp = j({
            type: a,
            selectors: [["app-clock"]],
            decls: 22,
            vars: 6,
            consts: [[1, "clock-container"], [1, "clock-content"], [1, "time-section"], [1, "main-time"], [1, "digit"], [1, "blink"], [1, "secondary-time"], [1, "seconds"], [1, "ampm"], [1, "date-section"], [1, "day"], [1, "divider"], [1, "date"]],
            template: function(e, i) {
                e & 1 && (a2(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "span", 4),
                C(5),
                e2(),
                a2(6, "span", 5),
                C(7, ":"),
                e2(),
                a2(8, "span", 4),
                C(9),
                e2()(),
                a2(10, "div", 6)(11, "span", 7),
                C(12),
                e2(),
                a2(13, "span", 8),
                C(14),
                e2()()(),
                a2(15, "div", 9)(16, "span", 10),
                C(17),
                e2(),
                a2(18, "span", 11),
                C(19, "\u2022"),
                e2(),
                a2(20, "span", 12),
                C(21),
                e2()()()()),
                e & 2 && (u(5),
                T(i.hours()),
                u(4),
                T(i.minutes()),
                u(3),
                T(i.seconds()),
                u(2),
                T(i.ampm()),
                u(3),
                T(i.day()),
                u(4),
                T(i.fullDate()))
            },
            styles: ["[_nghost-%COMP%]{display:block;width:100%;height:100%}.clock-container[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;width:100%;height:100%;font-family:Roboto,sans-serif;color:#fff;-webkit-user-select:none;user-select:none;cursor:default}.clock-content[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;padding:.5rem;transition:transform .3s ease}.clock-content[_ngcontent-%COMP%]:hover{transform:scale(1.02)}.time-section[_ngcontent-%COMP%]{display:flex;align-items:baseline;line-height:.9;text-shadow:0 4px 12px rgba(0,0,0,.3)}.main-time[_ngcontent-%COMP%]{display:flex;font-size:3.5rem;font-weight:1rem;letter-spacing:-2px}.main-time[_ngcontent-%COMP%]   .digit[_ngcontent-%COMP%]{position:relative;display:inline-block}.main-time[_ngcontent-%COMP%]   .blink[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_blinker 2s linear infinite;opacity:.8;margin:0 .05rem}.secondary-time[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:center;margin-left:.5rem}.secondary-time[_ngcontent-%COMP%]   .seconds[_ngcontent-%COMP%]{font-size:1.1rem;font-weight:300;opacity:.8;line-height:1}.secondary-time[_ngcontent-%COMP%]   .ampm[_ngcontent-%COMP%]{font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:1px;opacity:.6;margin-top:.1rem;line-height:1}.date-section[_ngcontent-%COMP%]{display:flex;align-items:center;margin-top:.25rem;font-size:.8rem;font-weight:400;letter-spacing:1.5px;text-transform:uppercase;opacity:.9;text-shadow:0 2px 4px rgba(0,0,0,.3)}.date-section[_ngcontent-%COMP%]   .day[_ngcontent-%COMP%]{font-weight:600}.date-section[_ngcontent-%COMP%]   .divider[_ngcontent-%COMP%]{margin:0 .5rem;font-size:.8em;opacity:.6}@media(max-width:768px){.main-time[_ngcontent-%COMP%]{font-size:2.5rem}.secondary-time[_ngcontent-%COMP%]{margin-left:.3rem}.secondary-time[_ngcontent-%COMP%]   .seconds[_ngcontent-%COMP%]{font-size:.9rem}.secondary-time[_ngcontent-%COMP%]   .ampm[_ngcontent-%COMP%]{font-size:.6rem}.date-section[_ngcontent-%COMP%]{font-size:.7rem;margin-top:.2rem;flex-wrap:wrap;justify-content:center;gap:.3rem}.date-section[_ngcontent-%COMP%]   .divider[_ngcontent-%COMP%]{display:inline-block}}@keyframes _ngcontent-%COMP%_blinker{0%{opacity:1}50%{opacity:.3}to{opacity:1}}"]
        })
        }
    }
    return a
}
)();
function x9(a, l) {
    if (a & 1 && (p(0, "div", 13),
    S(1, "fa-icon", 5),
    p(2, "span"),
    C(3),
    z()()),
    a & 2) {
        let c = L();
        u(),
        y("icon", c.faExclamationCircle),
        u(2),
        T(c.searchError())
    }
}
var _a = ( () => {
    class a {
        constructor() {
            this.faSearch = f0,
            this.faTimes = d0,
            this.faHashtag = p0,
            this.faExclamationCircle = m0,
            this.faInfoCircle = z0,
            this.isOpen = N2(!1),
            this.close = f2(),
            this.search = f2(),
            this.searchUserId = b(""),
            this.searchError = b("")
        }
        closeModal() {
            this.searchError.set(""),
            this.searchUserId.set(""),
            this.close.emit()
        }
        searchProfile() {
            let c = this.searchUserId().trim();
            if (!c) {
                this.searchError.set("Please enter a Discord User ID");
                return
            }
            if (!/^\d{17,19}$/.test(c)) {
                this.searchError.set("Invalid Discord ID format (must be 17-19 digits)");
                return
            }
            this.search.emit(c),
            this.closeModal()
        }
        handleKeyPress(c) {
            c.key === "Enter" ? this.searchProfile() : c.key === "Escape" && this.closeModal()
        }
        static{this.\u0275fac = function(e) {
            return new (e || a)
        }
        }static{this.\u0275cmp = j({
            type: a,
            selectors: [["app-search-modal"]],
            inputs: {
                isOpen: [1, "isOpen"]
            },
            outputs: {
                close: "close",
                search: "search"
            },
            decls: 38,
            vars: 13,
            consts: [["role", "dialog", "aria-modal", "true", 1, "modal-overlay", 3, "click", "keyup.escape"], ["tabindex", "-1", 1, "modal-container", 3, "click", "keydown"], [1, "modal-header"], [1, "flex", "items-center", "gap-3"], [1, "modal-icon-wrapper"], [3, "icon"], [1, "modal-title"], [1, "modal-subtitle"], [1, "modal-close-btn", 3, "click"], [1, "modal-body"], [1, "search-input-wrapper"], ["type", "text", "placeholder", "Enter Discord User ID (e.g., 1234567890123456789)", "maxlength", "19", "autocomplete", "off", 1, "search-input", 3, "ngModelChange", "keydown", "ngModel"], [1, "input-icon", 3, "icon"], [1, "error-message"], [1, "info-card"], [1, "info-icon"], [1, "info-content"], [1, "info-title"], [1, "info-list"], [1, "modal-footer"], [1, "btn-secondary", 3, "click"], [1, "mr-2", 3, "icon"], [1, "btn-primary", 3, "click"]],
            template: function(e, i) {
                e & 1 && (p(0, "div", 0),
                D("click", function() {
                    return i.closeModal()
                })("keyup.escape", function() {
                    return i.closeModal()
                }),
                p(1, "div", 1),
                D("click", function(n) {
                    return n.stopPropagation()
                })("keydown", function(n) {
                    return n.stopPropagation()
                }),
                p(2, "div", 2)(3, "div", 3)(4, "div", 4),
                S(5, "fa-icon", 5),
                z(),
                p(6, "div")(7, "h2", 6),
                C(8, "Search Discord Profile"),
                z(),
                p(9, "p", 7),
                C(10, "Enter a Discord User ID to view their profile"),
                z()()(),
                p(11, "button", 8),
                D("click", function() {
                    return i.closeModal()
                }),
                S(12, "fa-icon", 5),
                z()(),
                p(13, "div", 9)(14, "div", 10)(15, "input", 11),
                D("ngModelChange", function(n) {
                    return i.searchUserId.set(n)
                })("keydown", function(n) {
                    return i.handleKeyPress(n)
                }),
                z(),
                S(16, "fa-icon", 12),
                z(),
                N(17, x9, 4, 2, "div", 13),
                p(18, "div", 14)(19, "div", 15),
                S(20, "fa-icon", 5),
                z(),
                p(21, "div", 16)(22, "p", 17),
                C(23, "How to find your Discord ID:"),
                z(),
                p(24, "ol", 18)(25, "li"),
                C(26, "Enable Developer Mode in Discord Settings"),
                z(),
                p(27, "li"),
                C(28, "Right-click on a user profile"),
                z(),
                p(29, "li"),
                C(30, 'Click "Copy User ID"'),
                z()()()()(),
                p(31, "div", 19)(32, "button", 20),
                D("click", function() {
                    return i.closeModal()
                }),
                S(33, "fa-icon", 21),
                C(34, " Cancel "),
                z(),
                p(35, "button", 22),
                D("click", function() {
                    return i.searchProfile()
                }),
                S(36, "fa-icon", 21),
                C(37, " Search Profile "),
                z()()()()),
                e & 2 && (G("modal-open", i.isOpen()),
                b2("aria-hidden", !i.isOpen()),
                u(),
                G("modal-show", i.isOpen()),
                u(4),
                y("icon", i.faSearch),
                u(7),
                y("icon", i.faTimes),
                u(3),
                y("ngModel", i.searchUserId()),
                u(),
                y("icon", i.faHashtag),
                u(),
                w(i.searchError() ? 17 : -1),
                u(3),
                y("icon", i.faInfoCircle),
                u(13),
                y("icon", i.faTimes),
                u(3),
                y("icon", i.faSearch))
            },
            dependencies: [c1, K2, J2, N4, Z2, z1, u1],
            styles: ['.modal-overlay[_ngcontent-%COMP%]{position:fixed;inset:0;background:#0000;backdrop-filter:blur(0px);-webkit-backdrop-filter:blur(0px);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1rem;opacity:0;pointer-events:none;transition:all .4s cubic-bezier(.4,0,.2,1)}.modal-overlay.modal-open[_ngcontent-%COMP%]{opacity:1;pointer-events:all;background:#000000b3;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}.modal-container[_ngcontent-%COMP%]{background:#1e1e28f2;backdrop-filter:blur(40px) saturate(180%);-webkit-backdrop-filter:blur(40px) saturate(180%);border:1px solid rgba(255,255,255,.1);border-radius:24px;width:100%;max-width:600px;box-shadow:0 20px 60px #00000080,inset 0 1px #ffffff1a,0 0 80px #8b5cf61a;transform:scale(.9) translateY(20px);opacity:0;transition:all .4s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden}.modal-container[_ngcontent-%COMP%]:before{content:"";position:absolute;top:0;left:-100%;width:100%;height:2px;background:linear-gradient(90deg,transparent,rgba(139,92,246,.8),transparent);animation:_ngcontent-%COMP%_shimmer 3s ease-in-out infinite}.modal-container.modal-show[_ngcontent-%COMP%]{transform:scale(1) translateY(0);opacity:1}@keyframes _ngcontent-%COMP%_shimmer{0%,to{left:-100%}50%{left:100%}}.modal-header[_ngcontent-%COMP%]{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;padding:2rem;border-bottom:1px solid rgba(255,255,255,.08)}.modal-header[_ngcontent-%COMP%] > .flex[_ngcontent-%COMP%]{flex:1;min-width:0}.modal-icon-wrapper[_ngcontent-%COMP%]{width:52px;height:52px;min-width:52px;min-height:52px;display:flex;align-items:center;justify-content:center;background:#8b5cf626;border:1px solid rgba(139,92,246,.4);border-radius:14px;position:relative;flex-shrink:0}.modal-icon-wrapper[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{color:#c4b5fd;font-size:1.5rem;position:relative;z-index:1}.modal-icon-wrapper[_ngcontent-%COMP%]:before{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(139,92,246,.3),transparent);border-radius:14px;opacity:.5;z-index:0}.modal-title[_ngcontent-%COMP%]{font-size:1.5rem;font-weight:700;color:#fff;margin:0;background:linear-gradient(135deg,#fff,#c4b5fde6);background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent}.modal-subtitle[_ngcontent-%COMP%]{font-size:.875rem;color:#fff9;margin:.25rem 0 0}.modal-close-btn[_ngcontent-%COMP%]{width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:#ffffff0d;border:1px solid rgba(255,255,255,.1);border-radius:12px;color:#ffffffb3;cursor:pointer;transition:all .3s;font-size:1.25rem}.modal-close-btn[_ngcontent-%COMP%]:hover{background:#ef444433;border-color:#ef444466;color:#fca5a5;transform:rotate(90deg)}.modal-body[_ngcontent-%COMP%]{padding:2rem}.search-input-wrapper[_ngcontent-%COMP%]{position:relative;margin-bottom:1.5rem}.search-input-wrapper[_ngcontent-%COMP%]   .input-icon[_ngcontent-%COMP%]{position:absolute;left:1.25rem;top:50%;transform:translateY(-50%);color:#8b5cf6b3;font-size:1.125rem;pointer-events:none;transition:all .3s;z-index:2}.search-input[_ngcontent-%COMP%]{width:100%;padding:1rem 1rem 1rem 3.25rem;background:#ffffff0d;border:2px solid rgba(255,255,255,.1);border-radius:16px;color:#fff;font-size:1rem;font-family:Courier New,monospace;transition:all .3s;outline:none;position:relative;z-index:1}.search-input[_ngcontent-%COMP%]::placeholder{color:#fff6;font-size:.875rem}.search-input[_ngcontent-%COMP%]:focus{background:#ffffff14;border-color:#8b5cf699;box-shadow:0 0 0 3px #8b5cf626}.search-input[_ngcontent-%COMP%]:focus ~ .input-icon[_ngcontent-%COMP%]{color:#8b5cf6;transform:translateY(-50%) scale(1.05)}.search-input[_ngcontent-%COMP%]:hover{border-color:#fff3}.error-message[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.75rem;padding:1rem;background:#ef44441a;border:1px solid rgba(239,68,68,.3);border-radius:12px;color:#fca5a5;font-size:.9rem;margin-bottom:1.5rem;animation:_ngcontent-%COMP%_shake .5s}.error-message[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:1.25rem}@keyframes _ngcontent-%COMP%_shake{0%,to{transform:translate(0)}25%{transform:translate(-8px)}75%{transform:translate(8px)}}.info-card[_ngcontent-%COMP%]{display:flex;gap:1rem;padding:1.25rem;background:#3b82f614;border:1px solid rgba(59,130,246,.2);border-radius:16px;align-items:flex-start}.info-card[_ngcontent-%COMP%]   .info-icon[_ngcontent-%COMP%]{width:40px;height:40px;min-width:40px;min-height:40px;display:flex;align-items:center;justify-content:center;background:#3b82f626;border-radius:12px;color:#93c5fd;font-size:1.125rem;flex-shrink:0}.info-card[_ngcontent-%COMP%]   .info-content[_ngcontent-%COMP%]{flex:1;min-width:0}.info-card[_ngcontent-%COMP%]   .info-title[_ngcontent-%COMP%]{font-weight:600;color:#93c5fd;margin:0 0 .625rem;font-size:.9rem;line-height:1.4}.info-card[_ngcontent-%COMP%]   .info-list[_ngcontent-%COMP%]{margin:0;color:#ffffffbf;font-size:.875rem;line-height:1.7}.info-card[_ngcontent-%COMP%]   .info-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{margin-bottom:.5rem;padding-left:.25rem}.info-card[_ngcontent-%COMP%]   .info-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:last-child{margin-bottom:0}.modal-footer[_ngcontent-%COMP%]{display:flex;gap:1rem;padding:1.5rem 2rem;border-top:1px solid rgba(255,255,255,.08);justify-content:flex-end}.btn-secondary[_ngcontent-%COMP%], .btn-primary[_ngcontent-%COMP%]{display:flex;align-items:center;padding:.75rem 1.5rem;border-radius:12px;font-weight:600;font-size:.95rem;cursor:pointer;transition:all .3s;border:none;outline:none}.btn-secondary[_ngcontent-%COMP%]   i[_ngcontent-%COMP%], .btn-primary[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:1rem}.btn-secondary[_ngcontent-%COMP%]{background:#ffffff0d;color:#fffc;border:1px solid rgba(255,255,255,.1)}.btn-secondary[_ngcontent-%COMP%]:hover{background:#ffffff1a;color:#fff;transform:translateY(-2px)}.btn-primary[_ngcontent-%COMP%]{background:linear-gradient(135deg,#8b5cf6e6,#7c3aede6);color:#fff;border:1px solid rgba(139,92,246,.5);box-shadow:0 4px 12px #8b5cf64d}.btn-primary[_ngcontent-%COMP%]:hover{background:linear-gradient(135deg,#8b5cf6,#7c3aed);box-shadow:0 6px 20px #8b5cf666;transform:translateY(-2px)}.btn-primary[_ngcontent-%COMP%]:active{transform:translateY(0)}@media screen and (max-width:640px){.modal-container[_ngcontent-%COMP%]{border-radius:20px}.modal-header[_ngcontent-%COMP%]{padding:1.5rem;flex-direction:column;gap:1rem}.modal-close-btn[_ngcontent-%COMP%]{position:absolute;top:1rem;right:1rem}.modal-body[_ngcontent-%COMP%]{padding:1.5rem}.modal-footer[_ngcontent-%COMP%]{padding:1.25rem 1.5rem;flex-direction:column}.modal-footer[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:100%;justify-content:center}.modal-title[_ngcontent-%COMP%]{font-size:1.25rem}.search-input[_ngcontent-%COMP%]{font-size:.9rem}}'],
            changeDetection: 0
        })
        }
    }
    return a
}
)();
export {w4 as a, l2 as b, u1 as c, z1 as d, $9 as e, f0 as f, X9 as g, Y9 as h, Q9 as i, K9 as j, J9 as k, Z9 as l, cc as m, ac as n, ec as o, lc as p, Y as q, N0 as r, ha as s, ba as t, _a as u};
