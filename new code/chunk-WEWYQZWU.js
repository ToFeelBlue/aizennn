var qv = Object.defineProperty
  , Zv = Object.defineProperties;
var Yv = Object.getOwnPropertyDescriptors;
var bf = Object.getOwnPropertySymbols;
var Qv = Object.prototype.hasOwnProperty
  , Kv = Object.prototype.propertyIsEnumerable;
var Mf = (e, t, n) => t in e ? qv(e, t, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: n
}) : e[t] = n
  , g = (e, t) => {
    for (var n in t ||= {})
        Qv.call(t, n) && Mf(e, n, t[n]);
    if (bf)
        for (var n of bf(t))
            Kv.call(t, n) && Mf(e, n, t[n]);
    return e
}
  , R = (e, t) => Zv(e, Yv(t));
function b(e) {
    return typeof e == "function"
}
function Kn(e) {
    let n = e(r => {
        Error.call(r),
        r.stack = new Error().stack
    }
    );
    return n.prototype = Object.create(Error.prototype),
    n.prototype.constructor = n,
    n
}
var mi = Kn(e => function(n) {
    e(this),
    this.message = n ? `${n.length} errors occurred during unsubscription:
${n.map( (r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}` : "",
    this.name = "UnsubscriptionError",
    this.errors = n
}
);
function an(e, t) {
    if (e) {
        let n = e.indexOf(t);
        0 <= n && e.splice(n, 1)
    }
}
var K = class e {
    constructor(t) {
        this.initialTeardown = t,
        this.closed = !1,
        this._parentage = null,
        this._finalizers = null
    }
    unsubscribe() {
        let t;
        if (!this.closed) {
            this.closed = !0;
            let {_parentage: n} = this;
            if (n)
                if (this._parentage = null,
                Array.isArray(n))
                    for (let i of n)
                        i.remove(this);
                else
                    n.remove(this);
            let {initialTeardown: r} = this;
            if (b(r))
                try {
                    r()
                } catch (i) {
                    t = i instanceof mi ? i.errors : [i]
                }
            let {_finalizers: o} = this;
            if (o) {
                this._finalizers = null;
                for (let i of o)
                    try {
                        Tf(i)
                    } catch (s) {
                        t = t ?? [],
                        s instanceof mi ? t = [...t, ...s.errors] : t.push(s)
                    }
            }
            if (t)
                throw new mi(t)
        }
    }
    add(t) {
        var n;
        if (t && t !== this)
            if (this.closed)
                Tf(t);
            else {
                if (t instanceof e) {
                    if (t.closed || t._hasParent(this))
                        return;
                    t._addParent(this)
                }
                (this._finalizers = (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t)
            }
    }
    _hasParent(t) {
        let {_parentage: n} = this;
        return n === t || Array.isArray(n) && n.includes(t)
    }
    _addParent(t) {
        let {_parentage: n} = this;
        this._parentage = Array.isArray(n) ? (n.push(t),
        n) : n ? [n, t] : t
    }
    _removeParent(t) {
        let {_parentage: n} = this;
        n === t ? this._parentage = null : Array.isArray(n) && an(n, t)
    }
    remove(t) {
        let {_finalizers: n} = this;
        n && an(n, t),
        t instanceof e && t._removeParent(this)
    }
}
;
K.EMPTY = ( () => {
    let e = new K;
    return e.closed = !0,
    e
}
)();
var ic = K.EMPTY;
function yi(e) {
    return e instanceof K || e && "closed"in e && b(e.remove) && b(e.add) && b(e.unsubscribe)
}
function Tf(e) {
    b(e) ? e() : e.unsubscribe()
}
var vi = class extends K {
    constructor(t, n) {
        super()
    }
    schedule(t, n=0) {
        return this
    }
}
;
var Zr = {
    setInterval(e, t, ...n) {
        let {delegate: r} = Zr;
        return r?.setInterval ? r.setInterval(e, t, ...n) : setInterval(e, t, ...n)
    },
    clearInterval(e) {
        let {delegate: t} = Zr;
        return (t?.clearInterval || clearInterval)(e)
    },
    delegate: void 0
};
var Di = class extends vi {
    constructor(t, n) {
        super(t, n),
        this.scheduler = t,
        this.work = n,
        this.pending = !1
    }
    schedule(t, n=0) {
        var r;
        if (this.closed)
            return this;
        this.state = t;
        let o = this.id
          , i = this.scheduler;
        return o != null && (this.id = this.recycleAsyncId(i, o, n)),
        this.pending = !0,
        this.delay = n,
        this.id = (r = this.id) !== null && r !== void 0 ? r : this.requestAsyncId(i, this.id, n),
        this
    }
    requestAsyncId(t, n, r=0) {
        return Zr.setInterval(t.flush.bind(t, this), r)
    }
    recycleAsyncId(t, n, r=0) {
        if (r != null && this.delay === r && this.pending === !1)
            return n;
        n != null && Zr.clearInterval(n)
    }
    execute(t, n) {
        if (this.closed)
            return new Error("executing a cancelled action");
        this.pending = !1;
        let r = this._execute(t, n);
        if (r)
            return r;
        this.pending === !1 && this.id != null && (this.id = this.recycleAsyncId(this.scheduler, this.id, null))
    }
    _execute(t, n) {
        let r = !1, o;
        try {
            this.work(t)
        } catch (i) {
            r = !0,
            o = i || new Error("Scheduled action threw falsy error")
        }
        if (r)
            return this.unsubscribe(),
            o
    }
    unsubscribe() {
        if (!this.closed) {
            let {id: t, scheduler: n} = this
              , {actions: r} = n;
            this.work = this.state = this.scheduler = null,
            this.pending = !1,
            an(r, this),
            t != null && (this.id = this.recycleAsyncId(n, t, null)),
            this.delay = null,
            super.unsubscribe()
        }
    }
}
;
var sc = {
    now() {
        return (sc.delegate || Date).now()
    },
    delegate: void 0
};
var Jn = class e {
    constructor(t, n=e.now) {
        this.schedulerActionCtor = t,
        this.now = n
    }
    schedule(t, n=0, r) {
        return new this.schedulerActionCtor(this,t).schedule(r, n)
    }
}
;
Jn.now = sc.now;
var Ei = class extends Jn {
    constructor(t, n=Jn.now) {
        super(t, n),
        this.actions = [],
        this._active = !1
    }
    flush(t) {
        let {actions: n} = this;
        if (this._active) {
            n.push(t);
            return
        }
        let r;
        this._active = !0;
        do
            if (r = t.execute(t.state, t.delay))
                break;
        while (t = n.shift());
        if (this._active = !1,
        r) {
            for (; t = n.shift(); )
                t.unsubscribe();
            throw r
        }
    }
}
;
var Yr = new Ei(Di)
  , Sf = Yr;
var Ve = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: void 0,
    useDeprecatedSynchronousErrorHandling: !1,
    useDeprecatedNextContext: !1
};
var Xn = {
    setTimeout(e, t, ...n) {
        let {delegate: r} = Xn;
        return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n)
    },
    clearTimeout(e) {
        let {delegate: t} = Xn;
        return (t?.clearTimeout || clearTimeout)(e)
    },
    delegate: void 0
};
function Ci(e) {
    Xn.setTimeout( () => {
        let {onUnhandledError: t} = Ve;
        if (t)
            t(e);
        else
            throw e
    }
    )
}
function Qr() {}
var Af = ac("C", void 0, void 0);
function Nf(e) {
    return ac("E", void 0, e)
}
function Rf(e) {
    return ac("N", e, void 0)
}
function ac(e, t, n) {
    return {
        kind: e,
        value: t,
        error: n
    }
}
var cn = null;
function er(e) {
    if (Ve.useDeprecatedSynchronousErrorHandling) {
        let t = !cn;
        if (t && (cn = {
            errorThrown: !1,
            error: null
        }),
        e(),
        t) {
            let {errorThrown: n, error: r} = cn;
            if (cn = null,
            n)
                throw r
        }
    } else
        e()
}
function xf(e) {
    Ve.useDeprecatedSynchronousErrorHandling && cn && (cn.errorThrown = !0,
    cn.error = e)
}
var un = class extends K {
    constructor(t) {
        super(),
        this.isStopped = !1,
        t ? (this.destination = t,
        yi(t) && t.add(this)) : this.destination = eD
    }
    static create(t, n, r) {
        return new tr(t,n,r)
    }
    next(t) {
        this.isStopped ? uc(Rf(t), this) : this._next(t)
    }
    error(t) {
        this.isStopped ? uc(Nf(t), this) : (this.isStopped = !0,
        this._error(t))
    }
    complete() {
        this.isStopped ? uc(Af, this) : (this.isStopped = !0,
        this._complete())
    }
    unsubscribe() {
        this.closed || (this.isStopped = !0,
        super.unsubscribe(),
        this.destination = null)
    }
    _next(t) {
        this.destination.next(t)
    }
    _error(t) {
        try {
            this.destination.error(t)
        } finally {
            this.unsubscribe()
        }
    }
    _complete() {
        try {
            this.destination.complete()
        } finally {
            this.unsubscribe()
        }
    }
}
  , Jv = Function.prototype.bind;
function cc(e, t) {
    return Jv.call(e, t)
}
var lc = class {
    constructor(t) {
        this.partialObserver = t
    }
    next(t) {
        let {partialObserver: n} = this;
        if (n.next)
            try {
                n.next(t)
            } catch (r) {
                Ii(r)
            }
    }
    error(t) {
        let {partialObserver: n} = this;
        if (n.error)
            try {
                n.error(t)
            } catch (r) {
                Ii(r)
            }
        else
            Ii(t)
    }
    complete() {
        let {partialObserver: t} = this;
        if (t.complete)
            try {
                t.complete()
            } catch (n) {
                Ii(n)
            }
    }
}
  , tr = class extends un {
    constructor(t, n, r) {
        super();
        let o;
        if (b(t) || !t)
            o = {
                next: t ?? void 0,
                error: n ?? void 0,
                complete: r ?? void 0
            };
        else {
            let i;
            this && Ve.useDeprecatedNextContext ? (i = Object.create(t),
            i.unsubscribe = () => this.unsubscribe(),
            o = {
                next: t.next && cc(t.next, i),
                error: t.error && cc(t.error, i),
                complete: t.complete && cc(t.complete, i)
            }) : o = t
        }
        this.destination = new lc(o)
    }
}
;
function Ii(e) {
    Ve.useDeprecatedSynchronousErrorHandling ? xf(e) : Ci(e)
}
function Xv(e) {
    throw e
}
function uc(e, t) {
    let {onStoppedNotification: n} = Ve;
    n && Xn.setTimeout( () => n(e, t))
}
var eD = {
    closed: !0,
    next: Qr,
    error: Xv,
    complete: Qr
};
var nr = typeof Symbol == "function" && Symbol.observable || "@@observable";
function Be(e) {
    return e
}
function dc(...e) {
    return fc(e)
}
function fc(e) {
    return e.length === 0 ? Be : e.length === 1 ? e[0] : function(n) {
        return e.reduce( (r, o) => o(r), n)
    }
}
var O = ( () => {
    class e {
        constructor(n) {
            n && (this._subscribe = n)
        }
        lift(n) {
            let r = new e;
            return r.source = this,
            r.operator = n,
            r
        }
        subscribe(n, r, o) {
            let i = nD(n) ? n : new tr(n,r,o);
            return er( () => {
                let {operator: s, source: a} = this;
                i.add(s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i))
            }
            ),
            i
        }
        _trySubscribe(n) {
            try {
                return this._subscribe(n)
            } catch (r) {
                n.error(r)
            }
        }
        forEach(n, r) {
            return r = Of(r),
            new r( (o, i) => {
                let s = new tr({
                    next: a => {
                        try {
                            n(a)
                        } catch (c) {
                            i(c),
                            s.unsubscribe()
                        }
                    }
                    ,
                    error: i,
                    complete: o
                });
                this.subscribe(s)
            }
            )
        }
        _subscribe(n) {
            var r;
            return (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(n)
        }
        [nr]() {
            return this
        }
        pipe(...n) {
            return fc(n)(this)
        }
        toPromise(n) {
            return n = Of(n),
            new n( (r, o) => {
                let i;
                this.subscribe(s => i = s, s => o(s), () => r(i))
            }
            )
        }
    }
    return e.create = t => new e(t),
    e
}
)();
function Of(e) {
    var t;
    return (t = e ?? Ve.Promise) !== null && t !== void 0 ? t : Promise
}
function tD(e) {
    return e && b(e.next) && b(e.error) && b(e.complete)
}
function nD(e) {
    return e && e instanceof un || tD(e) && yi(e)
}
function wi(e) {
    return e && b(e.schedule)
}
function Ff(e) {
    return e instanceof Date && !isNaN(e)
}
function hc(e=0, t, n=Sf) {
    let r = -1;
    return t != null && (wi(t) ? n = t : r = t),
    new O(o => {
        let i = Ff(e) ? +e - n.now() : e;
        i < 0 && (i = 0);
        let s = 0;
        return n.schedule(function() {
            o.closed || (o.next(s++),
            0 <= r ? this.schedule(void 0, r) : o.complete())
        }, i)
    }
    )
}
function rD(e=0, t=Yr) {
    return e < 0 && (e = 0),
    hc(e, e, t)
}
function oD(e) {
    return b(e?.lift)
}
function k(e) {
    return t => {
        if (oD(t))
            return t.lift(function(n) {
                try {
                    return e(n, this)
                } catch (r) {
                    this.error(r)
                }
            });
        throw new TypeError("Unable to lift unknown Observable type")
    }
}
function P(e, t, n, r, o) {
    return new pc(e,t,n,r,o)
}
var pc = class extends un {
    constructor(t, n, r, o, i, s) {
        super(t),
        this.onFinalize = i,
        this.shouldUnsubscribe = s,
        this._next = n ? function(a) {
            try {
                n(a)
            } catch (c) {
                t.error(c)
            }
        }
        : super._next,
        this._error = o ? function(a) {
            try {
                o(a)
            } catch (c) {
                t.error(c)
            } finally {
                this.unsubscribe()
            }
        }
        : super._error,
        this._complete = r ? function() {
            try {
                r()
            } catch (a) {
                t.error(a)
            } finally {
                this.unsubscribe()
            }
        }
        : super._complete
    }
    unsubscribe() {
        var t;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            let {closed: n} = this;
            super.unsubscribe(),
            !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this))
        }
    }
}
;
var kf = Kn(e => function() {
    e(this),
    this.name = "ObjectUnsubscribedError",
    this.message = "object unsubscribed"
}
);
var J = ( () => {
    class e extends O {
        constructor() {
            super(),
            this.closed = !1,
            this.currentObservers = null,
            this.observers = [],
            this.isStopped = !1,
            this.hasError = !1,
            this.thrownError = null
        }
        lift(n) {
            let r = new _i(this,this);
            return r.operator = n,
            r
        }
        _throwIfClosed() {
            if (this.closed)
                throw new kf
        }
        next(n) {
            er( () => {
                if (this._throwIfClosed(),
                !this.isStopped) {
                    this.currentObservers || (this.currentObservers = Array.from(this.observers));
                    for (let r of this.currentObservers)
                        r.next(n)
                }
            }
            )
        }
        error(n) {
            er( () => {
                if (this._throwIfClosed(),
                !this.isStopped) {
                    this.hasError = this.isStopped = !0,
                    this.thrownError = n;
                    let {observers: r} = this;
                    for (; r.length; )
                        r.shift().error(n)
                }
            }
            )
        }
        complete() {
            er( () => {
                if (this._throwIfClosed(),
                !this.isStopped) {
                    this.isStopped = !0;
                    let {observers: n} = this;
                    for (; n.length; )
                        n.shift().complete()
                }
            }
            )
        }
        unsubscribe() {
            this.isStopped = this.closed = !0,
            this.observers = this.currentObservers = null
        }
        get observed() {
            var n;
            return ((n = this.observers) === null || n === void 0 ? void 0 : n.length) > 0
        }
        _trySubscribe(n) {
            return this._throwIfClosed(),
            super._trySubscribe(n)
        }
        _subscribe(n) {
            return this._throwIfClosed(),
            this._checkFinalizedStatuses(n),
            this._innerSubscribe(n)
        }
        _innerSubscribe(n) {
            let {hasError: r, isStopped: o, observers: i} = this;
            return r || o ? ic : (this.currentObservers = null,
            i.push(n),
            new K( () => {
                this.currentObservers = null,
                an(i, n)
            }
            ))
        }
        _checkFinalizedStatuses(n) {
            let {hasError: r, thrownError: o, isStopped: i} = this;
            r ? n.error(o) : i && n.complete()
        }
        asObservable() {
            let n = new O;
            return n.source = this,
            n
        }
    }
    return e.create = (t, n) => new _i(t,n),
    e
}
)()
  , _i = class extends J {
    constructor(t, n) {
        super(),
        this.destination = t,
        this.source = n
    }
    next(t) {
        var n, r;
        (r = (n = this.destination) === null || n === void 0 ? void 0 : n.next) === null || r === void 0 || r.call(n, t)
    }
    error(t) {
        var n, r;
        (r = (n = this.destination) === null || n === void 0 ? void 0 : n.error) === null || r === void 0 || r.call(n, t)
    }
    complete() {
        var t, n;
        (n = (t = this.destination) === null || t === void 0 ? void 0 : t.complete) === null || n === void 0 || n.call(t)
    }
    _subscribe(t) {
        var n, r;
        return (r = (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(t)) !== null && r !== void 0 ? r : ic
    }
}
;
var ae = class extends J {
    constructor(t) {
        super(),
        this._value = t
    }
    get value() {
        return this.getValue()
    }
    _subscribe(t) {
        let n = super._subscribe(t);
        return !n.closed && t.next(this._value),
        n
    }
    getValue() {
        let {hasError: t, thrownError: n, _value: r} = this;
        if (t)
            throw n;
        return this._throwIfClosed(),
        r
    }
    next(t) {
        super.next(this._value = t)
    }
}
;
var ce = new O(e => e.complete());
function Pf(e) {
    return e[e.length - 1]
}
function bi(e) {
    return b(Pf(e)) ? e.pop() : void 0
}
function kt(e) {
    return wi(Pf(e)) ? e.pop() : void 0
}
function jf(e, t, n, r) {
    function o(i) {
        return i instanceof n ? i : new n(function(s) {
            s(i)
        }
        )
    }
    return new (n || (n = Promise))(function(i, s) {
        function a(l) {
            try {
                u(r.next(l))
            } catch (d) {
                s(d)
            }
        }
        function c(l) {
            try {
                u(r.throw(l))
            } catch (d) {
                s(d)
            }
        }
        function u(l) {
            l.done ? i(l.value) : o(l.value).then(a, c)
        }
        u((r = r.apply(e, t || [])).next())
    }
    )
}
function Lf(e) {
    var t = typeof Symbol == "function" && Symbol.iterator
      , n = t && e[t]
      , r = 0;
    if (n)
        return n.call(e);
    if (e && typeof e.length == "number")
        return {
            next: function() {
                return e && r >= e.length && (e = void 0),
                {
                    value: e && e[r++],
                    done: !e
                }
            }
        };
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.")
}
function ln(e) {
    return this instanceof ln ? (this.v = e,
    this) : new ln(e)
}
function Vf(e, t, n) {
    if (!Symbol.asyncIterator)
        throw new TypeError("Symbol.asyncIterator is not defined.");
    var r = n.apply(e, t || []), o, i = [];
    return o = Object.create((typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype),
    a("next"),
    a("throw"),
    a("return", s),
    o[Symbol.asyncIterator] = function() {
        return this
    }
    ,
    o;
    function s(f) {
        return function(m) {
            return Promise.resolve(m).then(f, d)
        }
    }
    function a(f, m) {
        r[f] && (o[f] = function(w) {
            return new Promise(function(E, C) {
                i.push([f, w, E, C]) > 1 || c(f, w)
            }
            )
        }
        ,
        m && (o[f] = m(o[f])))
    }
    function c(f, m) {
        try {
            u(r[f](m))
        } catch (w) {
            h(i[0][3], w)
        }
    }
    function u(f) {
        f.value instanceof ln ? Promise.resolve(f.value.v).then(l, d) : h(i[0][2], f)
    }
    function l(f) {
        c("next", f)
    }
    function d(f) {
        c("throw", f)
    }
    function h(f, m) {
        f(m),
        i.shift(),
        i.length && c(i[0][0], i[0][1])
    }
}
function Bf(e) {
    if (!Symbol.asyncIterator)
        throw new TypeError("Symbol.asyncIterator is not defined.");
    var t = e[Symbol.asyncIterator], n;
    return t ? t.call(e) : (e = typeof Lf == "function" ? Lf(e) : e[Symbol.iterator](),
    n = {},
    r("next"),
    r("throw"),
    r("return"),
    n[Symbol.asyncIterator] = function() {
        return this
    }
    ,
    n);
    function r(i) {
        n[i] = e[i] && function(s) {
            return new Promise(function(a, c) {
                s = e[i](s),
                o(a, c, s.done, s.value)
            }
            )
        }
    }
    function o(i, s, a, c) {
        Promise.resolve(c).then(function(u) {
            i({
                value: u,
                done: a
            })
        }, s)
    }
}
var rr = e => e && typeof e.length == "number" && typeof e != "function";
function Mi(e) {
    return b(e?.then)
}
function Ti(e) {
    return b(e[nr])
}
function Si(e) {
    return Symbol.asyncIterator && b(e?.[Symbol.asyncIterator])
}
function Ai(e) {
    return new TypeError(`You provided ${e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`)
}
function iD() {
    return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator
}
var Ni = iD();
function Ri(e) {
    return b(e?.[Ni])
}
function xi(e) {
    return Vf(this, arguments, function*() {
        let n = e.getReader();
        try {
            for (; ; ) {
                let {value: r, done: o} = yield ln(n.read());
                if (o)
                    return yield ln(void 0);
                yield yield ln(r)
            }
        } finally {
            n.releaseLock()
        }
    })
}
function Oi(e) {
    return b(e?.getReader)
}
function q(e) {
    if (e instanceof O)
        return e;
    if (e != null) {
        if (Ti(e))
            return sD(e);
        if (rr(e))
            return aD(e);
        if (Mi(e))
            return cD(e);
        if (Si(e))
            return Uf(e);
        if (Ri(e))
            return uD(e);
        if (Oi(e))
            return lD(e)
    }
    throw Ai(e)
}
function sD(e) {
    return new O(t => {
        let n = e[nr]();
        if (b(n.subscribe))
            return n.subscribe(t);
        throw new TypeError("Provided object does not correctly implement Symbol.observable")
    }
    )
}
function aD(e) {
    return new O(t => {
        for (let n = 0; n < e.length && !t.closed; n++)
            t.next(e[n]);
        t.complete()
    }
    )
}
function cD(e) {
    return new O(t => {
        e.then(n => {
            t.closed || (t.next(n),
            t.complete())
        }
        , n => t.error(n)).then(null, Ci)
    }
    )
}
function uD(e) {
    return new O(t => {
        for (let n of e)
            if (t.next(n),
            t.closed)
                return;
        t.complete()
    }
    )
}
function Uf(e) {
    return new O(t => {
        dD(e, t).catch(n => t.error(n))
    }
    )
}
function lD(e) {
    return Uf(xi(e))
}
function dD(e, t) {
    var n, r, o, i;
    return jf(this, void 0, void 0, function*() {
        try {
            for (n = Bf(e); r = yield n.next(),
            !r.done; ) {
                let s = r.value;
                if (t.next(s),
                t.closed)
                    return
            }
        } catch (s) {
            o = {
                error: s
            }
        } finally {
            try {
                r && !r.done && (i = n.return) && (yield i.call(n))
            } finally {
                if (o)
                    throw o.error
            }
        }
        t.complete()
    })
}
function ve(e, t, n, r=0, o=!1) {
    let i = t.schedule(function() {
        n(),
        o ? e.add(this.schedule(null, r)) : this.unsubscribe()
    }, r);
    if (e.add(i),
    !o)
        return i
}
function Fi(e, t=0) {
    return k( (n, r) => {
        n.subscribe(P(r, o => ve(r, e, () => r.next(o), t), () => ve(r, e, () => r.complete(), t), o => ve(r, e, () => r.error(o), t)))
    }
    )
}
function ki(e, t=0) {
    return k( (n, r) => {
        r.add(e.schedule( () => n.subscribe(r), t))
    }
    )
}
function Hf(e, t) {
    return q(e).pipe(ki(t), Fi(t))
}
function $f(e, t) {
    return q(e).pipe(ki(t), Fi(t))
}
function zf(e, t) {
    return new O(n => {
        let r = 0;
        return t.schedule(function() {
            r === e.length ? n.complete() : (n.next(e[r++]),
            n.closed || this.schedule())
        })
    }
    )
}
function Gf(e, t) {
    return new O(n => {
        let r;
        return ve(n, t, () => {
            r = e[Ni](),
            ve(n, t, () => {
                let o, i;
                try {
                    ({value: o, done: i} = r.next())
                } catch (s) {
                    n.error(s);
                    return
                }
                i ? n.complete() : n.next(o)
            }
            , 0, !0)
        }
        ),
        () => b(r?.return) && r.return()
    }
    )
}
function Pi(e, t) {
    if (!e)
        throw new Error("Iterable cannot be null");
    return new O(n => {
        ve(n, t, () => {
            let r = e[Symbol.asyncIterator]();
            ve(n, t, () => {
                r.next().then(o => {
                    o.done ? n.complete() : n.next(o.value)
                }
                )
            }
            , 0, !0)
        }
        )
    }
    )
}
function Wf(e, t) {
    return Pi(xi(e), t)
}
function qf(e, t) {
    if (e != null) {
        if (Ti(e))
            return Hf(e, t);
        if (rr(e))
            return zf(e, t);
        if (Mi(e))
            return $f(e, t);
        if (Si(e))
            return Pi(e, t);
        if (Ri(e))
            return Gf(e, t);
        if (Oi(e))
            return Wf(e, t)
    }
    throw Ai(e)
}
function z(e, t) {
    return t ? qf(e, t) : q(e)
}
function A(...e) {
    let t = kt(e);
    return z(e, t)
}
function gc(e, t) {
    let n = b(e) ? e : () => e
      , r = o => o.error(n());
    return new O(t ? o => t.schedule(r, 0, o) : r)
}
function Li(e) {
    return !!e && (e instanceof O || b(e.lift) && b(e.subscribe))
}
var dn = Kn(e => function() {
    e(this),
    this.name = "EmptyError",
    this.message = "no elements in sequence"
}
);
function j(e, t) {
    return k( (n, r) => {
        let o = 0;
        n.subscribe(P(r, i => {
            r.next(e.call(t, i, o++))
        }
        ))
    }
    )
}
var {isArray: fD} = Array;
function hD(e, t) {
    return fD(t) ? e(...t) : e(t)
}
function or(e) {
    return j(t => hD(e, t))
}
var {isArray: pD} = Array
  , {getPrototypeOf: gD, prototype: mD, keys: yD} = Object;
function ji(e) {
    if (e.length === 1) {
        let t = e[0];
        if (pD(t))
            return {
                args: t,
                keys: null
            };
        if (vD(t)) {
            let n = yD(t);
            return {
                args: n.map(r => t[r]),
                keys: n
            }
        }
    }
    return {
        args: e,
        keys: null
    }
}
function vD(e) {
    return e && typeof e == "object" && gD(e) === mD
}
function Vi(e, t) {
    return e.reduce( (n, r, o) => (n[r] = t[o],
    n), {})
}
function Bi(...e) {
    let t = kt(e)
      , n = bi(e)
      , {args: r, keys: o} = ji(e);
    if (r.length === 0)
        return z([], t);
    let i = new O(DD(r, t, o ? s => Vi(o, s) : Be));
    return n ? i.pipe(or(n)) : i
}
function DD(e, t, n=Be) {
    return r => {
        Zf(t, () => {
            let {length: o} = e
              , i = new Array(o)
              , s = o
              , a = o;
            for (let c = 0; c < o; c++)
                Zf(t, () => {
                    let u = z(e[c], t)
                      , l = !1;
                    u.subscribe(P(r, d => {
                        i[c] = d,
                        l || (l = !0,
                        a--),
                        a || r.next(n(i.slice()))
                    }
                    , () => {
                        --s || r.complete()
                    }
                    ))
                }
                , r)
        }
        , r)
    }
}
function Zf(e, t, n) {
    e ? ve(n, e, t) : t()
}
function Yf(e, t, n, r, o, i, s, a) {
    let c = []
      , u = 0
      , l = 0
      , d = !1
      , h = () => {
        d && !c.length && !u && t.complete()
    }
      , f = w => u < r ? m(w) : c.push(w)
      , m = w => {
        i && t.next(w),
        u++;
        let E = !1;
        q(n(w, l++)).subscribe(P(t, C => {
            o?.(C),
            i ? f(C) : t.next(C)
        }
        , () => {
            E = !0
        }
        , void 0, () => {
            if (E)
                try {
                    for (u--; c.length && u < r; ) {
                        let C = c.shift();
                        s ? ve(t, s, () => m(C)) : m(C)
                    }
                    h()
                } catch (C) {
                    t.error(C)
                }
        }
        ))
    }
    ;
    return e.subscribe(P(t, f, () => {
        d = !0,
        h()
    }
    )),
    () => {
        a?.()
    }
}
function X(e, t, n=1 / 0) {
    return b(t) ? X( (r, o) => j( (i, s) => t(r, i, o, s))(q(e(r, o))), n) : (typeof t == "number" && (n = t),
    k( (r, o) => Yf(r, o, e, n)))
}
function ir(e=1 / 0) {
    return X(Be, e)
}
function Qf() {
    return ir(1)
}
function sr(...e) {
    return Qf()(z(e, kt(e)))
}
function Kr(e) {
    return new O(t => {
        q(e()).subscribe(t)
    }
    )
}
function mc(...e) {
    let t = bi(e)
      , {args: n, keys: r} = ji(e)
      , o = new O(i => {
        let {length: s} = n;
        if (!s) {
            i.complete();
            return
        }
        let a = new Array(s)
          , c = s
          , u = s;
        for (let l = 0; l < s; l++) {
            let d = !1;
            q(n[l]).subscribe(P(i, h => {
                d || (d = !0,
                u--),
                a[l] = h
            }
            , () => c--, void 0, () => {
                (!c || !d) && (u || i.next(r ? Vi(r, a) : a),
                i.complete())
            }
            ))
        }
    }
    );
    return t ? o.pipe(or(t)) : o
}
var ED = ["addListener", "removeListener"]
  , CD = ["addEventListener", "removeEventListener"]
  , ID = ["on", "off"];
function yc(e, t, n, r) {
    if (b(n) && (r = n,
    n = void 0),
    r)
        return yc(e, t, n).pipe(or(r));
    let[o,i] = bD(e) ? CD.map(s => a => e[s](t, a, n)) : wD(e) ? ED.map(Kf(e, t)) : _D(e) ? ID.map(Kf(e, t)) : [];
    if (!o && rr(e))
        return X(s => yc(s, t, n))(q(e));
    if (!o)
        throw new TypeError("Invalid event target");
    return new O(s => {
        let a = (...c) => s.next(1 < c.length ? c : c[0]);
        return o(a),
        () => i(a)
    }
    )
}
function Kf(e, t) {
    return n => r => e[n](t, r)
}
function wD(e) {
    return b(e.addListener) && b(e.removeListener)
}
function _D(e) {
    return b(e.on) && b(e.off)
}
function bD(e) {
    return b(e.addEventListener) && b(e.removeEventListener)
}
function Ie(e, t) {
    return k( (n, r) => {
        let o = 0;
        n.subscribe(P(r, i => e.call(t, i, o++) && r.next(i)))
    }
    )
}
function fn(e) {
    return k( (t, n) => {
        let r = null, o = !1, i;
        r = t.subscribe(P(n, void 0, void 0, s => {
            i = q(e(s, fn(e)(t))),
            r ? (r.unsubscribe(),
            r = null,
            i.subscribe(n)) : o = !0
        }
        )),
        o && (r.unsubscribe(),
        r = null,
        i.subscribe(n))
    }
    )
}
function Pt(e, t) {
    return b(t) ? X(e, t, 1) : X(e, 1)
}
function MD(e, t=Yr) {
    return k( (n, r) => {
        let o = null
          , i = null
          , s = null
          , a = () => {
            if (o) {
                o.unsubscribe(),
                o = null;
                let u = i;
                i = null,
                r.next(u)
            }
        }
        ;
        function c() {
            let u = s + e
              , l = t.now();
            if (l < u) {
                o = this.schedule(void 0, u - l),
                r.add(o);
                return
            }
            a()
        }
        n.subscribe(P(r, u => {
            i = u,
            s = t.now(),
            o || (o = t.schedule(c, e),
            r.add(o))
        }
        , () => {
            a(),
            r.complete()
        }
        , void 0, () => {
            i = o = null
        }
        ))
    }
    )
}
function Jf(e) {
    return k( (t, n) => {
        let r = !1;
        t.subscribe(P(n, o => {
            r = !0,
            n.next(o)
        }
        , () => {
            r || n.next(e),
            n.complete()
        }
        ))
    }
    )
}
function pt(e) {
    return e <= 0 ? () => ce : k( (t, n) => {
        let r = 0;
        t.subscribe(P(n, o => {
            ++r <= e && (n.next(o),
            e <= r && n.complete())
        }
        ))
    }
    )
}
function Xf(e=TD) {
    return k( (t, n) => {
        let r = !1;
        t.subscribe(P(n, o => {
            r = !0,
            n.next(o)
        }
        , () => r ? n.complete() : n.error(e())))
    }
    )
}
function TD() {
    return new dn
}
function Jr(e) {
    return k( (t, n) => {
        try {
            t.subscribe(n)
        } finally {
            n.add(e)
        }
    }
    )
}
function gt(e, t) {
    let n = arguments.length >= 2;
    return r => r.pipe(e ? Ie( (o, i) => e(o, i, r)) : Be, pt(1), n ? Jf(t) : Xf( () => new dn))
}
function Ui(e) {
    return e <= 0 ? () => ce : k( (t, n) => {
        let r = [];
        t.subscribe(P(n, o => {
            r.push(o),
            e < r.length && r.shift()
        }
        , () => {
            for (let o of r)
                n.next(o);
            n.complete()
        }
        , void 0, () => {
            r = null
        }
        ))
    }
    )
}
function vc(...e) {
    let t = kt(e);
    return k( (n, r) => {
        (t ? sr(e, n, t) : sr(e, n)).subscribe(r)
    }
    )
}
function Ne(e, t) {
    return k( (n, r) => {
        let o = null
          , i = 0
          , s = !1
          , a = () => s && !o && r.complete();
        n.subscribe(P(r, c => {
            o?.unsubscribe();
            let u = 0
              , l = i++;
            q(e(c, l)).subscribe(o = P(r, d => r.next(t ? t(c, d, l, u++) : d), () => {
                o = null,
                a()
            }
            ))
        }
        , () => {
            s = !0,
            a()
        }
        ))
    }
    )
}
function Xr(e) {
    return k( (t, n) => {
        q(e).subscribe(P(n, () => n.complete(), Qr)),
        !n.closed && t.subscribe(n)
    }
    )
}
function nt(e, t, n) {
    let r = b(e) || t || n ? {
        next: e,
        error: t,
        complete: n
    } : e;
    return r ? k( (o, i) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let a = !0;
        o.subscribe(P(i, c => {
            var u;
            (u = r.next) === null || u === void 0 || u.call(r, c),
            i.next(c)
        }
        , () => {
            var c;
            a = !1,
            (c = r.complete) === null || c === void 0 || c.call(r),
            i.complete()
        }
        , c => {
            var u;
            a = !1,
            (u = r.error) === null || u === void 0 || u.call(r, c),
            i.error(c)
        }
        , () => {
            var c, u;
            a && ((c = r.unsubscribe) === null || c === void 0 || c.call(r)),
            (u = r.finalize) === null || u === void 0 || u.call(r)
        }
        ))
    }
    ) : Be
}
var de = null
  , Hi = !1
  , Ic = 1
  , SD = null
  , De = Symbol("SIGNAL");
function _(e) {
    let t = de;
    return de = e,
    t
}
function zi() {
    return de
}
var ar = {
    version: 0,
    lastCleanEpoch: 0,
    dirty: !1,
    producers: void 0,
    producersTail: void 0,
    consumers: void 0,
    consumersTail: void 0,
    recomputing: !1,
    consumerAllowSignalWrites: !1,
    consumerIsAlwaysLive: !1,
    kind: "unknown",
    producerMustRecompute: () => !1,
    producerRecomputeValue: () => {}
    ,
    consumerMarkedDirty: () => {}
    ,
    consumerOnSignalRead: () => {}
};
function eo(e) {
    if (Hi)
        throw new Error("");
    if (de === null)
        return;
    de.consumerOnSignalRead(e);
    let t = de.producersTail;
    if (t !== void 0 && t.producer === e)
        return;
    let n, r = de.recomputing;
    if (r && (n = t !== void 0 ? t.nextProducer : de.producers,
    n !== void 0 && n.producer === e)) {
        de.producersTail = n,
        n.lastReadVersion = e.version;
        return
    }
    let o = e.consumersTail;
    if (o !== void 0 && o.consumer === de && (!r || ND(o, de)))
        return;
    let i = ur(de)
      , s = {
        producer: e,
        consumer: de,
        nextProducer: n,
        prevConsumer: o,
        lastReadVersion: e.version,
        nextConsumer: void 0
    };
    de.producersTail = s,
    t !== void 0 ? t.nextProducer = s : de.producers = s,
    i && rh(e, s)
}
function eh() {
    Ic++
}
function wc(e) {
    if (!(ur(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === Ic)) {
        if (!e.producerMustRecompute(e) && !no(e)) {
            Cc(e);
            return
        }
        e.producerRecomputeValue(e),
        Cc(e)
    }
}
function _c(e) {
    if (e.consumers === void 0)
        return;
    let t = Hi;
    Hi = !0;
    try {
        for (let n = e.consumers; n !== void 0; n = n.nextConsumer) {
            let r = n.consumer;
            r.dirty || AD(r)
        }
    } finally {
        Hi = t
    }
}
function bc() {
    return de?.consumerAllowSignalWrites !== !1
}
function AD(e) {
    e.dirty = !0,
    _c(e),
    e.consumerMarkedDirty?.(e)
}
function Cc(e) {
    e.dirty = !1,
    e.lastCleanEpoch = Ic
}
function cr(e) {
    return e && th(e),
    _(e)
}
function th(e) {
    e.producersTail = void 0,
    e.recomputing = !0
}
function to(e, t) {
    _(t),
    e && nh(e)
}
function nh(e) {
    e.recomputing = !1;
    let t = e.producersTail
      , n = t !== void 0 ? t.nextProducer : e.producers;
    if (n !== void 0) {
        if (ur(e))
            do
                n = Mc(n);
            while (n !== void 0);
        t !== void 0 ? t.nextProducer = void 0 : e.producers = void 0
    }
}
function no(e) {
    for (let t = e.producers; t !== void 0; t = t.nextProducer) {
        let n = t.producer
          , r = t.lastReadVersion;
        if (r !== n.version || (wc(n),
        r !== n.version))
            return !0
    }
    return !1
}
function hn(e) {
    if (ur(e)) {
        let t = e.producers;
        for (; t !== void 0; )
            t = Mc(t)
    }
    e.producers = void 0,
    e.producersTail = void 0,
    e.consumers = void 0,
    e.consumersTail = void 0
}
function rh(e, t) {
    let n = e.consumersTail
      , r = ur(e);
    if (n !== void 0 ? (t.nextConsumer = n.nextConsumer,
    n.nextConsumer = t) : (t.nextConsumer = void 0,
    e.consumers = t),
    t.prevConsumer = n,
    e.consumersTail = t,
    !r)
        for (let o = e.producers; o !== void 0; o = o.nextProducer)
            rh(o.producer, o)
}
function Mc(e) {
    let t = e.producer
      , n = e.nextProducer
      , r = e.nextConsumer
      , o = e.prevConsumer;
    if (e.nextConsumer = void 0,
    e.prevConsumer = void 0,
    r !== void 0 ? r.prevConsumer = o : t.consumersTail = o,
    o !== void 0)
        o.nextConsumer = r;
    else if (t.consumers = r,
    !ur(t)) {
        let i = t.producers;
        for (; i !== void 0; )
            i = Mc(i)
    }
    return n
}
function ur(e) {
    return e.consumerIsAlwaysLive || e.consumers !== void 0
}
function Tc(e) {
    SD?.(e)
}
function ND(e, t) {
    let n = t.producersTail;
    if (n !== void 0) {
        let r = t.producers;
        do {
            if (r === e)
                return !0;
            if (r === n)
                break;
            r = r.nextProducer
        } while (r !== void 0)
    }
    return !1
}
function Sc(e, t) {
    return Object.is(e, t)
}
function Gi(e, t) {
    let n = Object.create(RD);
    n.computation = e,
    t !== void 0 && (n.equal = t);
    let r = () => {
        if (wc(n),
        eo(n),
        n.value === $i)
            throw n.error;
        return n.value
    }
    ;
    return r[De] = n,
    Tc(n),
    r
}
var Dc = Symbol("UNSET")
  , Ec = Symbol("COMPUTING")
  , $i = Symbol("ERRORED")
  , RD = R(g({}, ar), {
    value: Dc,
    dirty: !0,
    error: null,
    equal: Sc,
    kind: "computed",
    producerMustRecompute(e) {
        return e.value === Dc || e.value === Ec
    },
    producerRecomputeValue(e) {
        if (e.value === Ec)
            throw new Error("");
        let t = e.value;
        e.value = Ec;
        let n = cr(e), r, o = !1;
        try {
            r = e.computation(),
            _(null),
            o = t !== Dc && t !== $i && r !== $i && e.equal(t, r)
        } catch (i) {
            r = $i,
            e.error = i
        } finally {
            to(e, n)
        }
        if (o) {
            e.value = t;
            return
        }
        e.value = r,
        e.version++
    }
});
function xD() {
    throw new Error
}
var oh = xD;
function ih(e) {
    oh(e)
}
function Ac(e) {
    oh = e
}
var OD = null;
function Nc(e, t) {
    let n = Object.create(Wi);
    n.value = e,
    t !== void 0 && (n.equal = t);
    let r = () => sh(n);
    return r[De] = n,
    Tc(n),
    [r, s => ro(n, s), s => ah(n, s)]
}
function sh(e) {
    return eo(e),
    e.value
}
function ro(e, t) {
    bc() || ih(e),
    e.equal(e.value, t) || (e.value = t,
    FD(e))
}
function ah(e, t) {
    bc() || ih(e),
    ro(e, t(e.value))
}
var Wi = R(g({}, ar), {
    equal: Sc,
    value: void 0,
    kind: "signal"
});
function FD(e) {
    e.version++,
    eh(),
    _c(e),
    OD?.(e)
}
function Rc(e) {
    let t = _(null);
    try {
        return e()
    } finally {
        _(t)
    }
}
var xc = R(g({}, ar), {
    consumerIsAlwaysLive: !0,
    consumerAllowSignalWrites: !0,
    dirty: !0,
    kind: "effect"
});
function Oc(e) {
    if (e.dirty = !1,
    e.version > 0 && !no(e))
        return;
    e.version++;
    let t = cr(e);
    try {
        e.cleanup(),
        e.fn()
    } finally {
        to(e, t)
    }
}
var Fc;
function qi() {
    return Fc
}
function rt(e) {
    let t = Fc;
    return Fc = e,
    t
}
var ch = Symbol("NotFound");
function lr(e) {
    return e === ch || e?.name === "\u0275NotFound"
}
var es = "https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss"
  , y = class extends Error {
    code;
    constructor(t, n) {
        super(xe(t, n)),
        this.code = t
    }
}
;
function kD(e) {
    return `NG0${Math.abs(e)}`
}
function xe(e, t) {
    return `${kD(e)}${t ? ": " + t : ""}`
}
var Bt = globalThis;
function V(e) {
    for (let t in e)
        if (e[t] === V)
            return t;
    throw Error("")
}
function hh(e, t) {
    for (let n in t)
        t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n])
}
function yt(e) {
    if (typeof e == "string")
        return e;
    if (Array.isArray(e))
        return `[${e.map(yt).join(", ")}]`;
    if (e == null)
        return "" + e;
    let t = e.overriddenName || e.name;
    if (t)
        return `${t}`;
    let n = e.toString();
    if (n == null)
        return "" + n;
    let r = n.indexOf(`
`);
    return r >= 0 ? n.slice(0, r) : n
}
function qc(e, t) {
    return e ? t ? `${e} ${t}` : e : t || ""
}
var PD = V({
    __forward_ref__: V
});
function Ut(e) {
    return e.__forward_ref__ = Ut,
    e.toString = function() {
        return yt(this())
    }
    ,
    e
}
function ue(e) {
    return Zc(e) ? e() : e
}
function Zc(e) {
    return typeof e == "function" && e.hasOwnProperty(PD) && e.__forward_ref__ === Ut
}
function D(e) {
    return {
        token: e.token,
        providedIn: e.providedIn || null,
        factory: e.factory,
        value: void 0
    }
}
function _e(e) {
    return {
        providers: e.providers || [],
        imports: e.imports || []
    }
}
function lo(e) {
    return LD(e, ts)
}
function Yc(e) {
    return lo(e) !== null
}
function LD(e, t) {
    return e.hasOwnProperty(t) && e[t] || null
}
function jD(e) {
    let t = e?.[ts] ?? null;
    return t || null
}
function Pc(e) {
    return e && e.hasOwnProperty(Yi) ? e[Yi] : null
}
var ts = V({
    \u0275prov: V
})
  , Yi = V({
    \u0275inj: V
})
  , v = class {
    _desc;
    ngMetadataName = "InjectionToken";
    \u0275prov;
    constructor(t, n) {
        this._desc = t,
        this.\u0275prov = void 0,
        typeof n == "number" ? this.__NG_ELEMENT_ID__ = n : n !== void 0 && (this.\u0275prov = D({
            token: this,
            providedIn: n.providedIn || "root",
            factory: n.factory
        }))
    }
    get multi() {
        return this
    }
    toString() {
        return `InjectionToken ${this._desc}`
    }
}
;
function Qc(e) {
    return e && !!e.\u0275providers
}
var Kc = V({
    \u0275cmp: V
})
  , Jc = V({
    \u0275dir: V
})
  , Xc = V({
    \u0275pipe: V
})
  , eu = V({
    \u0275mod: V
})
  , io = V({
    \u0275fac: V
})
  , vn = V({
    __NG_ELEMENT_ID__: V
})
  , uh = V({
    __NG_ENV_ID__: V
});
function tu(e) {
    return ns(e, "@NgModule"),
    e[eu] || null
}
function Dt(e) {
    return ns(e, "@Component"),
    e[Kc] || null
}
function nu(e) {
    return ns(e, "@Directive"),
    e[Jc] || null
}
function ph(e) {
    return ns(e, "@Pipe"),
    e[Xc] || null
}
function ns(e, t) {
    if (e == null)
        throw new y(-919,!1)
}
function fr(e) {
    return typeof e == "string" ? e : e == null ? "" : String(e)
}
function gh(e) {
    return typeof e == "function" ? e.name || e.toString() : typeof e == "object" && e != null && typeof e.type == "function" ? e.type.name || e.type.toString() : fr(e)
}
var mh = V({
    ngErrorCode: V
})
  , VD = V({
    ngErrorMessage: V
})
  , BD = V({
    ngTokenPath: V
});
function ru(e, t) {
    return yh("", -200, t)
}
function rs(e, t) {
    throw new y(-201,!1)
}
function yh(e, t, n) {
    let r = new y(t,e);
    return r[mh] = t,
    r[VD] = e,
    n && (r[BD] = n),
    r
}
function UD(e) {
    return e[mh]
}
var Lc;
function vh() {
    return Lc
}
function pe(e) {
    let t = Lc;
    return Lc = e,
    t
}
function ou(e, t, n) {
    let r = lo(e);
    if (r && r.providedIn == "root")
        return r.value === void 0 ? r.value = r.factory() : r.value;
    if (n & 8)
        return null;
    if (t !== void 0)
        return t;
    rs(e, "")
}
var HD = {}
  , pn = HD
  , $D = "__NG_DI_FLAG__"
  , jc = class {
    injector;
    constructor(t) {
        this.injector = t
    }
    retrieve(t, n) {
        let r = gn(n) || 0;
        try {
            return this.injector.get(t, r & 8 ? null : pn, r)
        } catch (o) {
            if (lr(o))
                return o;
            throw o
        }
    }
}
;
function zD(e, t=0) {
    let n = qi();
    if (n === void 0)
        throw new y(-203,!1);
    if (n === null)
        return ou(e, void 0, t);
    {
        let r = GD(t)
          , o = n.retrieve(e, r);
        if (lr(o)) {
            if (r.optional)
                return null;
            throw o
        }
        return o
    }
}
function I(e, t=0) {
    return (vh() || zD)(ue(e), t)
}
function p(e, t) {
    return I(e, gn(t))
}
function gn(e) {
    return typeof e > "u" || typeof e == "number" ? e : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4)
}
function GD(e) {
    return {
        optional: !!(e & 8),
        host: !!(e & 1),
        self: !!(e & 2),
        skipSelf: !!(e & 4)
    }
}
function Vc(e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
        let r = ue(e[n]);
        if (Array.isArray(r)) {
            if (r.length === 0)
                throw new y(900,!1);
            let o, i = 0;
            for (let s = 0; s < r.length; s++) {
                let a = r[s]
                  , c = WD(a);
                typeof c == "number" ? c === -1 ? o = a.token : i |= c : o = a
            }
            t.push(I(o, i))
        } else
            t.push(I(r))
    }
    return t
}
function WD(e) {
    return e[$D]
}
function Lt(e, t) {
    let n = e.hasOwnProperty(io);
    return n ? e[io] : null
}
function Dh(e, t, n) {
    if (e.length !== t.length)
        return !1;
    for (let r = 0; r < e.length; r++) {
        let o = e[r]
          , i = t[r];
        if (n && (o = n(o),
        i = n(i)),
        i !== o)
            return !1
    }
    return !0
}
function Eh(e) {
    return e.flat(Number.POSITIVE_INFINITY)
}
function os(e, t) {
    e.forEach(n => Array.isArray(n) ? os(n, t) : t(n))
}
function iu(e, t, n) {
    t >= e.length ? e.push(n) : e.splice(t, 0, n)
}
function fo(e, t) {
    return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0]
}
function Ch(e, t) {
    let n = [];
    for (let r = 0; r < e; r++)
        n.push(t);
    return n
}
function Ih(e, t, n, r) {
    let o = e.length;
    if (o == t)
        e.push(n, r);
    else if (o === 1)
        e.push(r, e[0]),
        e[0] = n;
    else {
        for (o--,
        e.push(e[o - 1], e[o]); o > t; ) {
            let i = o - 2;
            e[o] = e[i],
            o--
        }
        e[t] = n,
        e[t + 1] = r
    }
}
function wh(e, t, n) {
    let r = hr(e, t);
    return r >= 0 ? e[r | 1] = n : (r = ~r,
    Ih(e, r, t, n)),
    r
}
function is(e, t) {
    let n = hr(e, t);
    if (n >= 0)
        return e[n | 1]
}
function hr(e, t) {
    return qD(e, t, 1)
}
function qD(e, t, n) {
    let r = 0
      , o = e.length >> n;
    for (; o !== r; ) {
        let i = r + (o - r >> 1)
          , s = e[i << n];
        if (t === s)
            return i << n;
        s > t ? o = i : r = i + 1
    }
    return ~(o << n)
}
var Ht = {}
  , we = []
  , Dn = new v("")
  , su = new v("",-1)
  , au = new v("")
  , so = class {
    get(t, n=pn) {
        if (n === pn) {
            let o = yh("", -201);
            throw o.name = "\u0275NotFound",
            o
        }
        return n
    }
}
;
function Et(e) {
    return {
        \u0275providers: e
    }
}
function _h(...e) {
    return {
        \u0275providers: cu(!0, e),
        \u0275fromNgModule: !0
    }
}
function cu(e, ...t) {
    let n = [], r = new Set, o, i = s => {
        n.push(s)
    }
    ;
    return os(t, s => {
        let a = s;
        Qi(a, i, [], r) && (o ||= [],
        o.push(a))
    }
    ),
    o !== void 0 && bh(o, i),
    n
}
function bh(e, t) {
    for (let n = 0; n < e.length; n++) {
        let {ngModule: r, providers: o} = e[n];
        uu(o, i => {
            t(i, r)
        }
        )
    }
}
function Qi(e, t, n, r) {
    if (e = ue(e),
    !e)
        return !1;
    let o = null
      , i = Pc(e)
      , s = !i && Dt(e);
    if (!i && !s) {
        let c = e.ngModule;
        if (i = Pc(c),
        i)
            o = c;
        else
            return !1
    } else {
        if (s && !s.standalone)
            return !1;
        o = e
    }
    let a = r.has(o);
    if (s) {
        if (a)
            return !1;
        if (r.add(o),
        s.dependencies) {
            let c = typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
            for (let u of c)
                Qi(u, t, n, r)
        }
    } else if (i) {
        if (i.imports != null && !a) {
            r.add(o);
            let u;
            os(i.imports, l => {
                Qi(l, t, n, r) && (u ||= [],
                u.push(l))
            }
            ),
            u !== void 0 && bh(u, t)
        }
        if (!a) {
            let u = Lt(o) || ( () => new o);
            t({
                provide: o,
                useFactory: u,
                deps: we
            }, o),
            t({
                provide: au,
                useValue: o,
                multi: !0
            }, o),
            t({
                provide: Dn,
                useValue: () => I(o),
                multi: !0
            }, o)
        }
        let c = i.providers;
        if (c != null && !a) {
            let u = e;
            uu(c, l => {
                t(l, u)
            }
            )
        }
    } else
        return !1;
    return o !== e && e.providers !== void 0
}
function uu(e, t) {
    for (let n of e)
        Qc(n) && (n = n.\u0275providers),
        Array.isArray(n) ? uu(n, t) : t(n)
}
var ZD = V({
    provide: String,
    useValue: V
});
function Mh(e) {
    return e !== null && typeof e == "object" && ZD in e
}
function YD(e) {
    return !!(e && e.useExisting)
}
function QD(e) {
    return !!(e && e.useFactory)
}
function mn(e) {
    return typeof e == "function"
}
function Th(e) {
    return !!e.useClass
}
var ho = new v(""), Zi = {}, lh = {}, kc;
function po() {
    return kc === void 0 && (kc = new so),
    kc
}
var H = class {
}
  , yn = class extends H {
    parent;
    source;
    scopes;
    records = new Map;
    _ngOnDestroyHooks = new Set;
    _onDestroyHooks = [];
    get destroyed() {
        return this._destroyed
    }
    _destroyed = !1;
    injectorDefTypes;
    constructor(t, n, r, o) {
        super(),
        this.parent = n,
        this.source = r,
        this.scopes = o,
        Uc(t, s => this.processProvider(s)),
        this.records.set(su, dr(void 0, this)),
        o.has("environment") && this.records.set(H, dr(void 0, this));
        let i = this.records.get(ho);
        i != null && typeof i.value == "string" && this.scopes.add(i.value),
        this.injectorDefTypes = new Set(this.get(au, we, {
            self: !0
        }))
    }
    retrieve(t, n) {
        let r = gn(n) || 0;
        try {
            return this.get(t, pn, r)
        } catch (o) {
            if (lr(o))
                return o;
            throw o
        }
    }
    destroy() {
        oo(this),
        this._destroyed = !0;
        let t = _(null);
        try {
            for (let r of this._ngOnDestroyHooks)
                r.ngOnDestroy();
            let n = this._onDestroyHooks;
            this._onDestroyHooks = [];
            for (let r of n)
                r()
        } finally {
            this.records.clear(),
            this._ngOnDestroyHooks.clear(),
            this.injectorDefTypes.clear(),
            _(t)
        }
    }
    onDestroy(t) {
        return oo(this),
        this._onDestroyHooks.push(t),
        () => this.removeOnDestroy(t)
    }
    runInContext(t) {
        oo(this);
        let n = rt(this), r = pe(void 0), o;
        try {
            return t()
        } finally {
            rt(n),
            pe(r)
        }
    }
    get(t, n=pn, r) {
        if (oo(this),
        t.hasOwnProperty(uh))
            return t[uh](this);
        let o = gn(r), i, s = rt(this), a = pe(void 0);
        try {
            if (!(o & 4)) {
                let u = this.records.get(t);
                if (u === void 0) {
                    let l = tE(t) && lo(t);
                    l && this.injectableDefInScope(l) ? u = dr(Bc(t), Zi) : u = null,
                    this.records.set(t, u)
                }
                if (u != null)
                    return this.hydrate(t, u, o)
            }
            let c = o & 2 ? po() : this.parent;
            return n = o & 8 && n === pn ? null : n,
            c.get(t, n)
        } catch (c) {
            let u = UD(c);
            throw u === -200 || u === -201 ? new y(u,null) : c
        } finally {
            pe(a),
            rt(s)
        }
    }
    resolveInjectorInitializers() {
        let t = _(null), n = rt(this), r = pe(void 0), o;
        try {
            let i = this.get(Dn, we, {
                self: !0
            });
            for (let s of i)
                s()
        } finally {
            rt(n),
            pe(r),
            _(t)
        }
    }
    toString() {
        let t = []
          , n = this.records;
        for (let r of n.keys())
            t.push(yt(r));
        return `R3Injector[${t.join(", ")}]`
    }
    processProvider(t) {
        t = ue(t);
        let n = mn(t) ? t : ue(t && t.provide)
          , r = JD(t);
        if (!mn(t) && t.multi === !0) {
            let o = this.records.get(n);
            o || (o = dr(void 0, Zi, !0),
            o.factory = () => Vc(o.multi),
            this.records.set(n, o)),
            n = t,
            o.multi.push(t)
        }
        this.records.set(n, r)
    }
    hydrate(t, n, r) {
        let o = _(null);
        try {
            if (n.value === lh)
                throw ru(yt(t));
            return n.value === Zi && (n.value = lh,
            n.value = n.factory(void 0, r)),
            typeof n.value == "object" && n.value && eE(n.value) && this._ngOnDestroyHooks.add(n.value),
            n.value
        } finally {
            _(o)
        }
    }
    injectableDefInScope(t) {
        if (!t.providedIn)
            return !1;
        let n = ue(t.providedIn);
        return typeof n == "string" ? n === "any" || this.scopes.has(n) : this.injectorDefTypes.has(n)
    }
    removeOnDestroy(t) {
        let n = this._onDestroyHooks.indexOf(t);
        n !== -1 && this._onDestroyHooks.splice(n, 1)
    }
}
;
function Bc(e) {
    let t = lo(e)
      , n = t !== null ? t.factory : Lt(e);
    if (n !== null)
        return n;
    if (e instanceof v)
        throw new y(204,!1);
    if (e instanceof Function)
        return KD(e);
    throw new y(204,!1)
}
function KD(e) {
    if (e.length > 0)
        throw new y(204,!1);
    let n = jD(e);
    return n !== null ? () => n.factory(e) : () => new e
}
function JD(e) {
    if (Mh(e))
        return dr(void 0, e.useValue);
    {
        let t = lu(e);
        return dr(t, Zi)
    }
}
function lu(e, t, n) {
    let r;
    if (mn(e)) {
        let o = ue(e);
        return Lt(o) || Bc(o)
    } else if (Mh(e))
        r = () => ue(e.useValue);
    else if (QD(e))
        r = () => e.useFactory(...Vc(e.deps || []));
    else if (YD(e))
        r = (o, i) => I(ue(e.useExisting), i !== void 0 && i & 8 ? 8 : void 0);
    else {
        let o = ue(e && (e.useClass || e.provide));
        if (XD(e))
            r = () => new o(...Vc(e.deps));
        else
            return Lt(o) || Bc(o)
    }
    return r
}
function oo(e) {
    if (e.destroyed)
        throw new y(205,!1)
}
function dr(e, t, n=!1) {
    return {
        factory: e,
        value: t,
        multi: n ? [] : void 0
    }
}
function XD(e) {
    return !!e.deps
}
function eE(e) {
    return e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
}
function tE(e) {
    return typeof e == "function" || typeof e == "object" && e.ngMetadataName === "InjectionToken"
}
function Uc(e, t) {
    for (let n of e)
        Array.isArray(n) ? Uc(n, t) : n && Qc(n) ? Uc(n.\u0275providers, t) : t(n)
}
function ne(e, t) {
    let n;
    e instanceof yn ? (oo(e),
    n = e) : n = new jc(e);
    let r, o = rt(n), i = pe(void 0);
    try {
        return t()
    } finally {
        rt(o),
        pe(i)
    }
}
function Sh() {
    return vh() !== void 0 || qi() != null
}
var Ue = 0
  , M = 1
  , T = 2
  , te = 3
  , Oe = 4
  , ge = 5
  , En = 6
  , pr = 7
  , Q = 8
  , Ct = 9
  , ot = 10
  , G = 11
  , gr = 12
  , du = 13
  , Cn = 14
  , me = 15
  , $t = 16
  , In = 17
  , it = 18
  , It = 19
  , fu = 20
  , mt = 21
  , ss = 22
  , jt = 23
  , be = 24
  , wn = 25
  , _n = 26
  , Z = 27
  , Ah = 1
  , hu = 6
  , zt = 7
  , go = 8
  , bn = 9
  , Y = 10;
function st(e) {
    return Array.isArray(e) && typeof e[Ah] == "object"
}
function He(e) {
    return Array.isArray(e) && e[Ah] === !0
}
function pu(e) {
    return (e.flags & 4) !== 0
}
function Gt(e) {
    return e.componentOffset > -1
}
function as(e) {
    return (e.flags & 1) === 1
}
function at(e) {
    return !!e.template
}
function mr(e) {
    return (e[T] & 512) !== 0
}
function Mn(e) {
    return (e[T] & 256) === 256
}
var gu = "svg"
  , Nh = "math";
function Fe(e) {
    for (; Array.isArray(e); )
        e = e[Ue];
    return e
}
function mu(e, t) {
    return Fe(t[e])
}
function $e(e, t) {
    return Fe(t[e.index])
}
function mo(e, t) {
    return e.data[t]
}
function yu(e, t) {
    return e[t]
}
function vu(e, t, n, r) {
    n >= e.data.length && (e.data[n] = null,
    e.blueprint[n] = null),
    t[n] = r
}
function ke(e, t) {
    let n = t[e];
    return st(n) ? n : n[Ue]
}
function Rh(e) {
    return (e[T] & 4) === 4
}
function cs(e) {
    return (e[T] & 128) === 128
}
function xh(e) {
    return He(e[te])
}
function ct(e, t) {
    return t == null ? null : e[t]
}
function Du(e) {
    e[In] = 0
}
function Eu(e) {
    e[T] & 1024 || (e[T] |= 1024,
    cs(e) && Tn(e))
}
function Oh(e, t) {
    for (; e > 0; )
        t = t[Cn],
        e--;
    return t
}
function yo(e) {
    return !!(e[T] & 9216 || e[be]?.dirty)
}
function us(e) {
    e[ot].changeDetectionScheduler?.notify(8),
    e[T] & 64 && (e[T] |= 1024),
    yo(e) && Tn(e)
}
function Tn(e) {
    e[ot].changeDetectionScheduler?.notify(0);
    let t = Vt(e);
    for (; t !== null && !(t[T] & 8192 || (t[T] |= 8192,
    !cs(t))); )
        t = Vt(t)
}
function Cu(e, t) {
    if (Mn(e))
        throw new y(911,!1);
    e[mt] === null && (e[mt] = []),
    e[mt].push(t)
}
function Fh(e, t) {
    if (e[mt] === null)
        return;
    let n = e[mt].indexOf(t);
    n !== -1 && e[mt].splice(n, 1)
}
function Vt(e) {
    let t = e[te];
    return He(t) ? t[te] : t
}
function Iu(e) {
    return e[pr] ??= []
}
function wu(e) {
    return e.cleanup ??= []
}
function kh(e, t, n, r) {
    let o = Iu(t);
    o.push(n),
    e.firstCreatePass && wu(e).push(r, o.length - 1)
}
var x = {
    lFrame: Qh(null),
    bindingsEnabled: !0,
    skipHydrationRootTNode: null
};
var Hc = !1;
function Ph() {
    return x.lFrame.elementDepthCount
}
function Lh() {
    x.lFrame.elementDepthCount++
}
function _u() {
    x.lFrame.elementDepthCount--
}
function jh() {
    return x.bindingsEnabled
}
function bu() {
    return x.skipHydrationRootTNode !== null
}
function Mu(e) {
    return x.skipHydrationRootTNode === e
}
function Tu() {
    x.skipHydrationRootTNode = null
}
function N() {
    return x.lFrame.lView
}
function se() {
    return x.lFrame.tView
}
function Vh(e) {
    return x.lFrame.contextLView = e,
    e[Q]
}
function Bh(e) {
    return x.lFrame.contextLView = null,
    e
}
function Ee() {
    let e = Su();
    for (; e !== null && e.type === 64; )
        e = e.parent;
    return e
}
function Su() {
    return x.lFrame.currentTNode
}
function Uh() {
    let e = x.lFrame
      , t = e.currentTNode;
    return e.isParent ? t : t.parent
}
function yr(e, t) {
    let n = x.lFrame;
    n.currentTNode = e,
    n.isParent = t
}
function Au() {
    return x.lFrame.isParent
}
function Nu() {
    x.lFrame.isParent = !1
}
function Hh() {
    return x.lFrame.contextLView
}
function Ru() {
    return Hc
}
function ao(e) {
    let t = Hc;
    return Hc = e,
    t
}
function xu() {
    let e = x.lFrame
      , t = e.bindingRootIndex;
    return t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex),
    t
}
function $h(e) {
    return x.lFrame.bindingIndex = e
}
function Sn() {
    return x.lFrame.bindingIndex++
}
function zh(e) {
    let t = x.lFrame
      , n = t.bindingIndex;
    return t.bindingIndex = t.bindingIndex + e,
    n
}
function Gh() {
    return x.lFrame.inI18n
}
function Wh(e, t) {
    let n = x.lFrame;
    n.bindingIndex = n.bindingRootIndex = e,
    ls(t)
}
function qh() {
    return x.lFrame.currentDirectiveIndex
}
function ls(e) {
    x.lFrame.currentDirectiveIndex = e
}
function Zh(e) {
    let t = x.lFrame.currentDirectiveIndex;
    return t === -1 ? null : e[t]
}
function Ou() {
    return x.lFrame.currentQueryIndex
}
function ds(e) {
    x.lFrame.currentQueryIndex = e
}
function nE(e) {
    let t = e[M];
    return t.type === 2 ? t.declTNode : t.type === 1 ? e[ge] : null
}
function Fu(e, t, n) {
    if (n & 4) {
        let o = t
          , i = e;
        for (; o = o.parent,
        o === null && !(n & 1); )
            if (o = nE(i),
            o === null || (i = i[Cn],
            o.type & 10))
                break;
        if (o === null)
            return !1;
        t = o,
        e = i
    }
    let r = x.lFrame = Yh();
    return r.currentTNode = t,
    r.lView = e,
    !0
}
function fs(e) {
    let t = Yh()
      , n = e[M];
    x.lFrame = t,
    t.currentTNode = n.firstChild,
    t.lView = e,
    t.tView = n,
    t.contextLView = e,
    t.bindingIndex = n.bindingStartIndex,
    t.inI18n = !1
}
function Yh() {
    let e = x.lFrame
      , t = e === null ? null : e.child;
    return t === null ? Qh(e) : t
}
function Qh(e) {
    let t = {
        currentTNode: null,
        isParent: !0,
        lView: null,
        tView: null,
        selectedIndex: -1,
        contextLView: null,
        elementDepthCount: 0,
        currentNamespace: null,
        currentDirectiveIndex: -1,
        bindingRootIndex: -1,
        bindingIndex: -1,
        currentQueryIndex: 0,
        parent: e,
        child: null,
        inI18n: !1
    };
    return e !== null && (e.child = t),
    t
}
function Kh() {
    let e = x.lFrame;
    return x.lFrame = e.parent,
    e.currentTNode = null,
    e.lView = null,
    e
}
var ku = Kh;
function hs() {
    let e = Kh();
    e.isParent = !0,
    e.tView = null,
    e.selectedIndex = -1,
    e.contextLView = null,
    e.elementDepthCount = 0,
    e.currentDirectiveIndex = -1,
    e.currentNamespace = null,
    e.bindingRootIndex = -1,
    e.bindingIndex = -1,
    e.currentQueryIndex = 0
}
function Jh(e) {
    return (x.lFrame.contextLView = Oh(e, x.lFrame.contextLView))[Q]
}
function Wt() {
    return x.lFrame.selectedIndex
}
function qt(e) {
    x.lFrame.selectedIndex = e
}
function ps() {
    let e = x.lFrame;
    return mo(e.tView, e.selectedIndex)
}
function Xh() {
    x.lFrame.currentNamespace = gu
}
function ep() {
    return x.lFrame.currentNamespace
}
var tp = !0;
function gs() {
    return tp
}
function ms(e) {
    tp = e
}
function $c(e, t=null, n=null, r) {
    let o = Pu(e, t, n, r);
    return o.resolveInjectorInitializers(),
    o
}
function Pu(e, t=null, n=null, r, o=new Set) {
    let i = [n || we, _h(e)];
    return r = r || (typeof e == "object" ? void 0 : yt(e)),
    new yn(i,t || po(),r || null,o)
}
var le = class e {
    static THROW_IF_NOT_FOUND = pn;
    static NULL = new so;
    static create(t, n) {
        if (Array.isArray(t))
            return $c({
                name: ""
            }, n, t, "");
        {
            let r = t.name ?? "";
            return $c({
                name: r
            }, t.parent, t.providers, r)
        }
    }
    static \u0275prov = D({
        token: e,
        providedIn: "any",
        factory: () => I(su)
    });
    static __NG_ELEMENT_ID__ = -1
}
  , $ = new v("")
  , Ce = ( () => {
    class e {
        static __NG_ELEMENT_ID__ = rE;
        static __NG_ENV_ID__ = n => n
    }
    return e
}
)()
  , Ki = class extends Ce {
    _lView;
    constructor(t) {
        super(),
        this._lView = t
    }
    get destroyed() {
        return Mn(this._lView)
    }
    onDestroy(t) {
        let n = this._lView;
        return Cu(n, t),
        () => Fh(n, t)
    }
}
;
function rE() {
    return new Ki(N())
}
var np = !1
  , rp = new v("")
  , wt = ( () => {
    class e {
        taskId = 0;
        pendingTasks = new Set;
        destroyed = !1;
        pendingTask = new ae(!1);
        debugTaskTracker = p(rp, {
            optional: !0
        });
        get hasPendingTasks() {
            return this.destroyed ? !1 : this.pendingTask.value
        }
        get hasPendingTasksObservable() {
            return this.destroyed ? new O(n => {
                n.next(!1),
                n.complete()
            }
            ) : this.pendingTask
        }
        add() {
            !this.hasPendingTasks && !this.destroyed && this.pendingTask.next(!0);
            let n = this.taskId++;
            return this.pendingTasks.add(n),
            this.debugTaskTracker?.add(n),
            n
        }
        has(n) {
            return this.pendingTasks.has(n)
        }
        remove(n) {
            this.pendingTasks.delete(n),
            this.debugTaskTracker?.remove(n),
            this.pendingTasks.size === 0 && this.hasPendingTasks && this.pendingTask.next(!1)
        }
        ngOnDestroy() {
            this.pendingTasks.clear(),
            this.hasPendingTasks && this.pendingTask.next(!1),
            this.destroyed = !0,
            this.pendingTask.unsubscribe()
        }
        static \u0275prov = D({
            token: e,
            providedIn: "root",
            factory: () => new e
        })
    }
    return e
}
)()
  , zc = class extends J {
    __isAsync;
    destroyRef = void 0;
    pendingTasks = void 0;
    constructor(t=!1) {
        super(),
        this.__isAsync = t,
        Sh() && (this.destroyRef = p(Ce, {
            optional: !0
        }) ?? void 0,
        this.pendingTasks = p(wt, {
            optional: !0
        }) ?? void 0)
    }
    emit(t) {
        let n = _(null);
        try {
            super.next(t)
        } finally {
            _(n)
        }
    }
    subscribe(t, n, r) {
        let o = t
          , i = n || ( () => null)
          , s = r;
        if (t && typeof t == "object") {
            let c = t;
            o = c.next?.bind(c),
            i = c.error?.bind(c),
            s = c.complete?.bind(c)
        }
        this.__isAsync && (i = this.wrapInTimeout(i),
        o && (o = this.wrapInTimeout(o)),
        s && (s = this.wrapInTimeout(s)));
        let a = super.subscribe({
            next: o,
            error: i,
            complete: s
        });
        return t instanceof K && t.add(a),
        a
    }
    wrapInTimeout(t) {
        return n => {
            let r = this.pendingTasks?.add();
            setTimeout( () => {
                try {
                    t(n)
                } finally {
                    r !== void 0 && this.pendingTasks?.remove(r)
                }
            }
            )
        }
    }
}
  , ee = zc;
function Ji(...e) {}
function Lu(e) {
    let t, n;
    function r() {
        e = Ji;
        try {
            n !== void 0 && typeof cancelAnimationFrame == "function" && cancelAnimationFrame(n),
            t !== void 0 && clearTimeout(t)
        } catch {}
    }
    return t = setTimeout( () => {
        e(),
        r()
    }
    ),
    typeof requestAnimationFrame == "function" && (n = requestAnimationFrame( () => {
        e(),
        r()
    }
    )),
    () => r()
}
function op(e) {
    return queueMicrotask( () => e()),
    () => {
        e = Ji
    }
}
var ju = "isAngularZone"
  , co = ju + "_ID"
  , oE = 0
  , fe = class e {
    hasPendingMacrotasks = !1;
    hasPendingMicrotasks = !1;
    isStable = !0;
    onUnstable = new ee(!1);
    onMicrotaskEmpty = new ee(!1);
    onStable = new ee(!1);
    onError = new ee(!1);
    constructor(t) {
        let {enableLongStackTrace: n=!1, shouldCoalesceEventChangeDetection: r=!1, shouldCoalesceRunChangeDetection: o=!1, scheduleInRootZone: i=np} = t;
        if (typeof Zone > "u")
            throw new y(908,!1);
        Zone.assertZonePatched();
        let s = this;
        s._nesting = 0,
        s._outer = s._inner = Zone.current,
        Zone.TaskTrackingZoneSpec && (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec)),
        n && Zone.longStackTraceZoneSpec && (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
        s.shouldCoalesceEventChangeDetection = !o && r,
        s.shouldCoalesceRunChangeDetection = o,
        s.callbackScheduled = !1,
        s.scheduleInRootZone = i,
        aE(s)
    }
    static isInAngularZone() {
        return typeof Zone < "u" && Zone.current.get(ju) === !0
    }
    static assertInAngularZone() {
        if (!e.isInAngularZone())
            throw new y(909,!1)
    }
    static assertNotInAngularZone() {
        if (e.isInAngularZone())
            throw new y(909,!1)
    }
    run(t, n, r) {
        return this._inner.run(t, n, r)
    }
    runTask(t, n, r, o) {
        let i = this._inner
          , s = i.scheduleEventTask("NgZoneEvent: " + o, t, iE, Ji, Ji);
        try {
            return i.runTask(s, n, r)
        } finally {
            i.cancelTask(s)
        }
    }
    runGuarded(t, n, r) {
        return this._inner.runGuarded(t, n, r)
    }
    runOutsideAngular(t) {
        return this._outer.run(t)
    }
}
  , iE = {};
function Vu(e) {
    if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
        try {
            e._nesting++,
            e.onMicrotaskEmpty.emit(null)
        } finally {
            if (e._nesting--,
            !e.hasPendingMicrotasks)
                try {
                    e.runOutsideAngular( () => e.onStable.emit(null))
                } finally {
                    e.isStable = !0
                }
        }
}
function sE(e) {
    if (e.isCheckStableRunning || e.callbackScheduled)
        return;
    e.callbackScheduled = !0;
    function t() {
        Lu( () => {
            e.callbackScheduled = !1,
            Gc(e),
            e.isCheckStableRunning = !0,
            Vu(e),
            e.isCheckStableRunning = !1
        }
        )
    }
    e.scheduleInRootZone ? Zone.root.run( () => {
        t()
    }
    ) : e._outer.run( () => {
        t()
    }
    ),
    Gc(e)
}
function aE(e) {
    let t = () => {
        sE(e)
    }
      , n = oE++;
    e._inner = e._inner.fork({
        name: "angular",
        properties: {
            [ju]: !0,
            [co]: n,
            [co + n]: !0
        },
        onInvokeTask: (r, o, i, s, a, c) => {
            if (cE(c))
                return r.invokeTask(i, s, a, c);
            try {
                return dh(e),
                r.invokeTask(i, s, a, c)
            } finally {
                (e.shouldCoalesceEventChangeDetection && s.type === "eventTask" || e.shouldCoalesceRunChangeDetection) && t(),
                fh(e)
            }
        }
        ,
        onInvoke: (r, o, i, s, a, c, u) => {
            try {
                return dh(e),
                r.invoke(i, s, a, c, u)
            } finally {
                e.shouldCoalesceRunChangeDetection && !e.callbackScheduled && !uE(c) && t(),
                fh(e)
            }
        }
        ,
        onHasTask: (r, o, i, s) => {
            r.hasTask(i, s),
            o === i && (s.change == "microTask" ? (e._hasPendingMicrotasks = s.microTask,
            Gc(e),
            Vu(e)) : s.change == "macroTask" && (e.hasPendingMacrotasks = s.macroTask))
        }
        ,
        onHandleError: (r, o, i, s) => (r.handleError(i, s),
        e.runOutsideAngular( () => e.onError.emit(s)),
        !1)
    })
}
function Gc(e) {
    e._hasPendingMicrotasks || (e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) && e.callbackScheduled === !0 ? e.hasPendingMicrotasks = !0 : e.hasPendingMicrotasks = !1
}
function dh(e) {
    e._nesting++,
    e.isStable && (e.isStable = !1,
    e.onUnstable.emit(null))
}
function fh(e) {
    e._nesting--,
    Vu(e)
}
var uo = class {
    hasPendingMicrotasks = !1;
    hasPendingMacrotasks = !1;
    isStable = !0;
    onUnstable = new ee;
    onMicrotaskEmpty = new ee;
    onStable = new ee;
    onError = new ee;
    run(t, n, r) {
        return t.apply(n, r)
    }
    runGuarded(t, n, r) {
        return t.apply(n, r)
    }
    runOutsideAngular(t) {
        return t()
    }
    runTask(t, n, r, o) {
        return t.apply(n, r)
    }
}
;
function cE(e) {
    return ip(e, "__ignore_ng_zone__")
}
function uE(e) {
    return ip(e, "__scheduler_tick__")
}
function ip(e, t) {
    return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0
}
var Re = class {
    _console = console;
    handleError(t) {
        this._console.error("ERROR", t)
    }
}
  , ze = new v("",{
    factory: () => {
        let e = p(fe), t = p(H), n;
        return r => {
            e.runOutsideAngular( () => {
                t.destroyed && !n ? setTimeout( () => {
                    throw r
                }
                ) : (n ??= t.get(Re),
                n.handleError(r))
            }
            )
        }
    }
})
  , sp = {
    provide: Dn,
    useValue: () => {
        let e = p(Re, {
            optional: !0
        })
    }
    ,
    multi: !0
};
function Ge(e, t) {
    let[n,r,o] = Nc(e, t?.equal)
      , i = n
      , s = i[De];
    return i.set = r,
    i.update = o,
    i.asReadonly = Bu.bind(i),
    i
}
function Bu() {
    let e = this[De];
    if (e.readonlyFn === void 0) {
        let t = () => this();
        t[De] = e,
        e.readonlyFn = t
    }
    return e.readonlyFn
}
var vo = ( () => {
    class e {
        view;
        node;
        constructor(n, r) {
            this.view = n,
            this.node = r
        }
        static __NG_ELEMENT_ID__ = lE
    }
    return e
}
)();
function lE() {
    return new vo(N(),Ee())
}
var vt = class {
}
  , Do = new v("",{
    factory: () => !0
});
var Uu = new v("")
  , Eo = ( () => {
    class e {
        internalPendingTasks = p(wt);
        scheduler = p(vt);
        errorHandler = p(ze);
        add() {
            let n = this.internalPendingTasks.add();
            return () => {
                this.internalPendingTasks.has(n) && (this.scheduler.notify(11),
                this.internalPendingTasks.remove(n))
            }
        }
        run(n) {
            let r = this.add();
            n().catch(this.errorHandler).finally(r)
        }
        static \u0275prov = D({
            token: e,
            providedIn: "root",
            factory: () => new e
        })
    }
    return e
}
)()
  , ys = ( () => {
    class e {
        static \u0275prov = D({
            token: e,
            providedIn: "root",
            factory: () => new Wc
        })
    }
    return e
}
)()
  , Wc = class {
    dirtyEffectCount = 0;
    queues = new Map;
    add(t) {
        this.enqueue(t),
        this.schedule(t)
    }
    schedule(t) {
        t.dirty && this.dirtyEffectCount++
    }
    remove(t) {
        let n = t.zone
          , r = this.queues.get(n);
        r.has(t) && (r.delete(t),
        t.dirty && this.dirtyEffectCount--)
    }
    enqueue(t) {
        let n = t.zone;
        this.queues.has(n) || this.queues.set(n, new Set);
        let r = this.queues.get(n);
        r.has(t) || r.add(t)
    }
    flush() {
        for (; this.dirtyEffectCount > 0; ) {
            let t = !1;
            for (let[n,r] of this.queues)
                n === null ? t ||= this.flushQueue(r) : t ||= n.run( () => this.flushQueue(r));
            t || (this.dirtyEffectCount = 0)
        }
    }
    flushQueue(t) {
        let n = !1;
        for (let r of t)
            r.dirty && (this.dirtyEffectCount--,
            n = !0,
            r.run());
        return n
    }
}
  , Xi = class {
    [De];
    constructor(t) {
        this[De] = t
    }
    destroy() {
        this[De].destroy()
    }
}
;
function ap(e, t) {
    let n = t?.injector ?? p(le), r = t?.manualCleanup !== !0 ? n.get(Ce) : null, o, i = n.get(vo, null, {
        optional: !0
    }), s = n.get(vt);
    return i !== null ? (o = hE(i.view, s, e),
    r instanceof Ki && r._lView === i.view && (r = null)) : o = pE(e, n.get(ys), s),
    o.injector = n,
    r !== null && (o.onDestroyFns = [r.onDestroy( () => o.destroy())]),
    new Xi(o)
}
var cp = R(g({}, xc), {
    cleanupFns: void 0,
    zone: null,
    onDestroyFns: null,
    run() {
        let e = ao(!1);
        try {
            Oc(this)
        } finally {
            ao(e)
        }
    },
    cleanup() {
        if (!this.cleanupFns?.length)
            return;
        let e = _(null);
        try {
            for (; this.cleanupFns.length; )
                this.cleanupFns.pop()()
        } finally {
            this.cleanupFns = [],
            _(e)
        }
    }
})
  , dE = R(g({}, cp), {
    consumerMarkedDirty() {
        this.scheduler.schedule(this),
        this.notifier.notify(12)
    },
    destroy() {
        if (hn(this),
        this.onDestroyFns !== null)
            for (let e of this.onDestroyFns)
                e();
        this.cleanup(),
        this.scheduler.remove(this)
    }
})
  , fE = R(g({}, cp), {
    consumerMarkedDirty() {
        this.view[T] |= 8192,
        Tn(this.view),
        this.notifier.notify(13)
    },
    destroy() {
        if (hn(this),
        this.onDestroyFns !== null)
            for (let e of this.onDestroyFns)
                e();
        this.cleanup(),
        this.view[jt]?.delete(this)
    }
});
function hE(e, t, n) {
    let r = Object.create(fE);
    return r.view = e,
    r.zone = typeof Zone < "u" ? Zone.current : null,
    r.notifier = t,
    r.fn = up(r, n),
    e[jt] ??= new Set,
    e[jt].add(r),
    r.consumerMarkedDirty(r),
    r
}
function pE(e, t, n) {
    let r = Object.create(dE);
    return r.fn = up(r, e),
    r.scheduler = t,
    r.notifier = n,
    r.zone = typeof Zone < "u" ? Zone.current : null,
    r.scheduler.add(r),
    r.notifier.notify(12),
    r
}
function up(e, t) {
    return () => {
        t(n => (e.cleanupFns ??= []).push(n))
    }
}
function re(e) {
    return Rc(e)
}
function Ao(e) {
    return {
        toString: e
    }.toString()
}
function CE(e) {
    return typeof e == "function"
}
function Hp(e, t, n, r) {
    t !== null ? t.applyValueToInputSignal(t, r) : e[n] = r
}
var Ms = class {
    previousValue;
    currentValue;
    firstChange;
    constructor(t, n, r) {
        this.previousValue = t,
        this.currentValue = n,
        this.firstChange = r
    }
    isFirstChange() {
        return this.firstChange
    }
}
  , Yt = ( () => {
    let e = () => $p;
    return e.ngInherit = !0,
    e
}
)();
function $p(e) {
    return e.type.prototype.ngOnChanges && (e.setInput = wE),
    IE
}
function IE() {
    let e = Gp(this)
      , t = e?.current;
    if (t) {
        let n = e.previous;
        if (n === Ht)
            e.previous = t;
        else
            for (let r in t)
                n[r] = t[r];
        e.current = null,
        this.ngOnChanges(t)
    }
}
function wE(e, t, n, r, o) {
    let i = this.declaredInputs[r]
      , s = Gp(e) || _E(e, {
        previous: Ht,
        current: null
    })
      , a = s.current || (s.current = {})
      , c = s.previous
      , u = c[i];
    a[i] = new Ms(u && u.currentValue,n,c === Ht),
    Hp(e, t, o, n)
}
var zp = "__ngSimpleChanges__";
function Gp(e) {
    return e[zp] || null
}
function _E(e, t) {
    return e[zp] = t
}
var lp = [];
var B = function(e, t=null, n) {
    for (let r = 0; r < lp.length; r++) {
        let o = lp[r];
        o(e, t, n)
    }
}
  , F = (function(e) {
    return e[e.TemplateCreateStart = 0] = "TemplateCreateStart",
    e[e.TemplateCreateEnd = 1] = "TemplateCreateEnd",
    e[e.TemplateUpdateStart = 2] = "TemplateUpdateStart",
    e[e.TemplateUpdateEnd = 3] = "TemplateUpdateEnd",
    e[e.LifecycleHookStart = 4] = "LifecycleHookStart",
    e[e.LifecycleHookEnd = 5] = "LifecycleHookEnd",
    e[e.OutputStart = 6] = "OutputStart",
    e[e.OutputEnd = 7] = "OutputEnd",
    e[e.BootstrapApplicationStart = 8] = "BootstrapApplicationStart",
    e[e.BootstrapApplicationEnd = 9] = "BootstrapApplicationEnd",
    e[e.BootstrapComponentStart = 10] = "BootstrapComponentStart",
    e[e.BootstrapComponentEnd = 11] = "BootstrapComponentEnd",
    e[e.ChangeDetectionStart = 12] = "ChangeDetectionStart",
    e[e.ChangeDetectionEnd = 13] = "ChangeDetectionEnd",
    e[e.ChangeDetectionSyncStart = 14] = "ChangeDetectionSyncStart",
    e[e.ChangeDetectionSyncEnd = 15] = "ChangeDetectionSyncEnd",
    e[e.AfterRenderHooksStart = 16] = "AfterRenderHooksStart",
    e[e.AfterRenderHooksEnd = 17] = "AfterRenderHooksEnd",
    e[e.ComponentStart = 18] = "ComponentStart",
    e[e.ComponentEnd = 19] = "ComponentEnd",
    e[e.DeferBlockStateStart = 20] = "DeferBlockStateStart",
    e[e.DeferBlockStateEnd = 21] = "DeferBlockStateEnd",
    e[e.DynamicComponentStart = 22] = "DynamicComponentStart",
    e[e.DynamicComponentEnd = 23] = "DynamicComponentEnd",
    e[e.HostBindingsUpdateStart = 24] = "HostBindingsUpdateStart",
    e[e.HostBindingsUpdateEnd = 25] = "HostBindingsUpdateEnd",
    e
}
)(F || {});
function bE(e, t, n) {
    let {ngOnChanges: r, ngOnInit: o, ngDoCheck: i} = t.type.prototype;
    if (r) {
        let s = $p(t);
        (n.preOrderHooks ??= []).push(e, s),
        (n.preOrderCheckHooks ??= []).push(e, s)
    }
    o && (n.preOrderHooks ??= []).push(0 - e, o),
    i && ((n.preOrderHooks ??= []).push(e, i),
    (n.preOrderCheckHooks ??= []).push(e, i))
}
function ME(e, t) {
    for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
        let i = e.data[n].type.prototype
          , {ngAfterContentInit: s, ngAfterContentChecked: a, ngAfterViewInit: c, ngAfterViewChecked: u, ngOnDestroy: l} = i;
        s && (e.contentHooks ??= []).push(-n, s),
        a && ((e.contentHooks ??= []).push(n, a),
        (e.contentCheckHooks ??= []).push(n, a)),
        c && (e.viewHooks ??= []).push(-n, c),
        u && ((e.viewHooks ??= []).push(n, u),
        (e.viewCheckHooks ??= []).push(n, u)),
        l != null && (e.destroyHooks ??= []).push(n, l)
    }
}
function Is(e, t, n) {
    Wp(e, t, 3, n)
}
function ws(e, t, n, r) {
    (e[T] & 3) === n && Wp(e, t, n, r)
}
function Hu(e, t) {
    let n = e[T];
    (n & 3) === t && (n &= 16383,
    n += 1,
    e[T] = n)
}
function Wp(e, t, n, r) {
    let o = r !== void 0 ? e[In] & 65535 : 0
      , i = r ?? -1
      , s = t.length - 1
      , a = 0;
    for (let c = o; c < s; c++)
        if (typeof t[c + 1] == "number") {
            if (a = t[c],
            r != null && a >= r)
                break
        } else
            t[c] < 0 && (e[In] += 65536),
            (a < i || i == -1) && (TE(e, n, t, c),
            e[In] = (e[In] & 4294901760) + c + 2),
            c++
}
function dp(e, t) {
    B(F.LifecycleHookStart, e, t);
    let n = _(null);
    try {
        t.call(e)
    } finally {
        _(n),
        B(F.LifecycleHookEnd, e, t)
    }
}
function TE(e, t, n, r) {
    let o = n[r] < 0
      , i = n[r + 1]
      , s = o ? -n[r] : n[r]
      , a = e[s];
    o ? e[T] >> 14 < e[In] >> 16 && (e[T] & 3) === t && (e[T] += 16384,
    dp(a, i)) : dp(a, i)
}
var Dr = -1
  , Nn = class {
    factory;
    name;
    injectImpl;
    resolving = !1;
    canSeeViewProviders;
    multi;
    componentProviders;
    index;
    providerFactory;
    constructor(t, n, r, o) {
        this.factory = t,
        this.name = o,
        this.canSeeViewProviders = n,
        this.injectImpl = r
    }
}
;
function SE(e) {
    return (e.flags & 8) !== 0
}
function AE(e) {
    return (e.flags & 16) !== 0
}
function NE(e, t, n) {
    let r = 0;
    for (; r < n.length; ) {
        let o = n[r];
        if (typeof o == "number") {
            if (o !== 0)
                break;
            r++;
            let i = n[r++]
              , s = n[r++]
              , a = n[r++];
            e.setAttribute(t, s, a, i)
        } else {
            let i = o
              , s = n[++r];
            xE(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s),
            r++
        }
    }
    return r
}
function RE(e) {
    return e === 3 || e === 4 || e === 6
}
function xE(e) {
    return e.charCodeAt(0) === 64
}
function Er(e, t) {
    if (!(t === null || t.length === 0))
        if (e === null || e.length === 0)
            e = t.slice();
        else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
                let o = t[r];
                typeof o == "number" ? n = o : n === 0 || (n === -1 || n === 2 ? fp(e, n, o, null, t[++r]) : fp(e, n, o, null, null))
            }
        }
    return e
}
function fp(e, t, n, r, o) {
    let i = 0
      , s = e.length;
    if (t === -1)
        s = -1;
    else
        for (; i < e.length; ) {
            let a = e[i++];
            if (typeof a == "number") {
                if (a === t) {
                    s = -1;
                    break
                } else if (a > t) {
                    s = i - 1;
                    break
                }
            }
        }
    for (; i < e.length; ) {
        let a = e[i];
        if (typeof a == "number")
            break;
        if (a === n) {
            o !== null && (e[i + 1] = o);
            return
        }
        i++,
        o !== null && i++
    }
    s !== -1 && (e.splice(s, 0, t),
    i = s + 1),
    e.splice(i++, 0, n),
    o !== null && e.splice(i++, 0, o)
}
function qp(e) {
    return e !== Dr
}
function Ts(e) {
    return e & 32767
}
function OE(e) {
    return e >> 16
}
function Ss(e, t) {
    let n = OE(e)
      , r = t;
    for (; n > 0; )
        r = r[Cn],
        n--;
    return r
}
var Xu = !0;
function As(e) {
    let t = Xu;
    return Xu = e,
    t
}
var FE = 256
  , Zp = FE - 1
  , Yp = 5
  , kE = 0
  , ut = {};
function PE(e, t, n) {
    let r;
    typeof n == "string" ? r = n.charCodeAt(0) || 0 : n.hasOwnProperty(vn) && (r = n[vn]),
    r == null && (r = n[vn] = kE++);
    let o = r & Zp
      , i = 1 << o;
    t.data[e + (o >> Yp)] |= i
}
function Ns(e, t) {
    let n = Qp(e, t);
    if (n !== -1)
        return n;
    let r = t[M];
    r.firstCreatePass && (e.injectorIndex = t.length,
    $u(r.data, e),
    $u(t, null),
    $u(r.blueprint, null));
    let o = Fl(e, t)
      , i = e.injectorIndex;
    if (qp(o)) {
        let s = Ts(o)
          , a = Ss(o, t)
          , c = a[M].data;
        for (let u = 0; u < 8; u++)
            t[i + u] = a[s + u] | c[s + u]
    }
    return t[i + 8] = o,
    i
}
function $u(e, t) {
    e.push(0, 0, 0, 0, 0, 0, 0, 0, t)
}
function Qp(e, t) {
    return e.injectorIndex === -1 || e.parent && e.parent.injectorIndex === e.injectorIndex || t[e.injectorIndex + 8] === null ? -1 : e.injectorIndex
}
function Fl(e, t) {
    if (e.parent && e.parent.injectorIndex !== -1)
        return e.parent.injectorIndex;
    let n = 0
      , r = null
      , o = t;
    for (; o !== null; ) {
        if (r = tg(o),
        r === null)
            return Dr;
        if (n++,
        o = o[Cn],
        r.injectorIndex !== -1)
            return r.injectorIndex | n << 16
    }
    return Dr
}
function el(e, t, n) {
    PE(e, t, n)
}
function Kp(e, t, n) {
    if (n & 8 || e !== void 0)
        return e;
    rs(t, "NodeInjector")
}
function Jp(e, t, n, r) {
    if (n & 8 && r === void 0 && (r = null),
    (n & 3) === 0) {
        let o = e[Ct]
          , i = pe(void 0);
        try {
            return o ? o.get(t, r, n & 8) : ou(t, r, n & 8)
        } finally {
            pe(i)
        }
    }
    return Kp(r, t, n)
}
function Xp(e, t, n, r=0, o) {
    if (e !== null) {
        if (t[T] & 2048 && !(r & 2)) {
            let s = BE(e, t, n, r, ut);
            if (s !== ut)
                return s
        }
        let i = eg(e, t, n, r, ut);
        if (i !== ut)
            return i
    }
    return Jp(t, n, r, o)
}
function eg(e, t, n, r, o) {
    let i = jE(n);
    if (typeof i == "function") {
        if (!Fu(t, e, r))
            return r & 1 ? Kp(o, n, r) : Jp(t, n, r, o);
        try {
            let s;
            if (s = i(r),
            s == null && !(r & 8))
                rs(n);
            else
                return s
        } finally {
            ku()
        }
    } else if (typeof i == "number") {
        let s = null
          , a = Qp(e, t)
          , c = Dr
          , u = r & 1 ? t[me][ge] : null;
        for ((a === -1 || r & 4) && (c = a === -1 ? Fl(e, t) : t[a + 8],
        c === Dr || !pp(r, !1) ? a = -1 : (s = t[M],
        a = Ts(c),
        t = Ss(c, t))); a !== -1; ) {
            let l = t[M];
            if (hp(i, a, l.data)) {
                let d = LE(a, t, n, s, r, u);
                if (d !== ut)
                    return d
            }
            c = t[a + 8],
            c !== Dr && pp(r, t[M].data[a + 8] === u) && hp(i, a, t) ? (s = l,
            a = Ts(c),
            t = Ss(c, t)) : a = -1
        }
    }
    return o
}
function LE(e, t, n, r, o, i) {
    let s = t[M]
      , a = s.data[e + 8]
      , c = r == null ? Gt(a) && Xu : r != s && (a.type & 3) !== 0
      , u = o & 1 && i === a
      , l = _s(a, s, n, c, u);
    return l !== null ? wo(t, s, l, a, o) : ut
}
function _s(e, t, n, r, o) {
    let i = e.providerIndexes
      , s = t.data
      , a = i & 1048575
      , c = e.directiveStart
      , u = e.directiveEnd
      , l = i >> 20
      , d = r ? a : a + l
      , h = o ? a + l : u;
    for (let f = d; f < h; f++) {
        let m = s[f];
        if (f < c && n === m || f >= c && m.type === n)
            return f
    }
    if (o) {
        let f = s[c];
        if (f && at(f) && f.type === n)
            return c
    }
    return null
}
function wo(e, t, n, r, o) {
    let i = e[n]
      , s = t.data;
    if (i instanceof Nn) {
        let a = i;
        if (a.resolving) {
            let f = gh(s[n]);
            throw ru(f)
        }
        let c = As(a.canSeeViewProviders);
        a.resolving = !0;
        let u = s[n].type || s[n], l, d = a.injectImpl ? pe(a.injectImpl) : null, h = Fu(e, r, 0);
        try {
            i = e[n] = a.factory(void 0, o, s, e, r),
            t.firstCreatePass && n >= r.directiveStart && bE(n, s[n], t)
        } finally {
            d !== null && pe(d),
            As(c),
            a.resolving = !1,
            ku()
        }
    }
    return i
}
function jE(e) {
    if (typeof e == "string")
        return e.charCodeAt(0) || 0;
    let t = e.hasOwnProperty(vn) ? e[vn] : void 0;
    return typeof t == "number" ? t >= 0 ? t & Zp : VE : t
}
function hp(e, t, n) {
    let r = 1 << e;
    return !!(n[t + (e >> Yp)] & r)
}
function pp(e, t) {
    return !(e & 2) && !(e & 1 && t)
}
var An = class {
    _tNode;
    _lView;
    constructor(t, n) {
        this._tNode = t,
        this._lView = n
    }
    get(t, n, r) {
        return Xp(this._tNode, this._lView, t, gn(r), n)
    }
}
;
function VE() {
    return new An(Ee(),N())
}
function Pn(e) {
    return Ao( () => {
        let t = e.prototype.constructor
          , n = t[io] || tl(t)
          , r = Object.prototype
          , o = Object.getPrototypeOf(e.prototype).constructor;
        for (; o && o !== r; ) {
            let i = o[io] || tl(o);
            if (i && i !== n)
                return i;
            o = Object.getPrototypeOf(o)
        }
        return i => new i
    }
    )
}
function tl(e) {
    return Zc(e) ? () => {
        let t = tl(ue(e));
        return t && t()
    }
    : Lt(e)
}
function BE(e, t, n, r, o) {
    let i = e
      , s = t;
    for (; i !== null && s !== null && s[T] & 2048 && !mr(s); ) {
        let a = eg(i, s, n, r | 2, ut);
        if (a !== ut)
            return a;
        let c = i.parent;
        if (!c) {
            let u = s[fu];
            if (u) {
                let l = u.get(n, ut, r);
                if (l !== ut)
                    return l
            }
            c = tg(s),
            s = s[Cn]
        }
        i = c
    }
    return o
}
function tg(e) {
    let t = e[M]
      , n = t.type;
    return n === 2 ? t.declTNode : n === 1 ? e[ge] : null
}
function UE() {
    return br(Ee(), N())
}
function br(e, t) {
    return new Me($e(e, t))
}
var Me = ( () => {
    class e {
        nativeElement;
        constructor(n) {
            this.nativeElement = n
        }
        static __NG_ELEMENT_ID__ = UE
    }
    return e
}
)();
function HE(e) {
    return e instanceof Me ? e.nativeElement : e
}
function $E() {
    return this._results[Symbol.iterator]()
}
var Rs = class {
    _emitDistinctChangesOnly;
    dirty = !0;
    _onDirty = void 0;
    _results = [];
    _changesDetected = !1;
    _changes = void 0;
    length = 0;
    first = void 0;
    last = void 0;
    get changes() {
        return this._changes ??= new J
    }
    constructor(t=!1) {
        this._emitDistinctChangesOnly = t
    }
    get(t) {
        return this._results[t]
    }
    map(t) {
        return this._results.map(t)
    }
    filter(t) {
        return this._results.filter(t)
    }
    find(t) {
        return this._results.find(t)
    }
    reduce(t, n) {
        return this._results.reduce(t, n)
    }
    forEach(t) {
        this._results.forEach(t)
    }
    some(t) {
        return this._results.some(t)
    }
    toArray() {
        return this._results.slice()
    }
    toString() {
        return this._results.toString()
    }
    reset(t, n) {
        this.dirty = !1;
        let r = Eh(t);
        (this._changesDetected = !Dh(this._results, r, n)) && (this._results = r,
        this.length = r.length,
        this.last = r[this.length - 1],
        this.first = r[0])
    }
    notifyOnChanges() {
        this._changes !== void 0 && (this._changesDetected || !this._emitDistinctChangesOnly) && this._changes.next(this)
    }
    onDirty(t) {
        this._onDirty = t
    }
    setDirty() {
        this.dirty = !0,
        this._onDirty?.()
    }
    destroy() {
        this._changes !== void 0 && (this._changes.complete(),
        this._changes.unsubscribe())
    }
    [Symbol.iterator] = $E
}
;
function ng(e) {
    return (e.flags & 128) === 128
}
var kl = (function(e) {
    return e[e.OnPush = 0] = "OnPush",
    e[e.Default = 1] = "Default",
    e
}
)(kl || {})
  , rg = new Map
  , zE = 0;
function GE() {
    return zE++
}
function WE(e) {
    rg.set(e[It], e)
}
function nl(e) {
    rg.delete(e[It])
}
var gp = "__ngContext__";
function Cr(e, t) {
    st(t) ? (e[gp] = t[It],
    WE(t)) : e[gp] = t
}
function og(e) {
    return sg(e[gr])
}
function ig(e) {
    return sg(e[Oe])
}
function sg(e) {
    for (; e !== null && !He(e); )
        e = e[Oe];
    return e
}
var rl;
function Pl(e) {
    rl = e
}
function ag() {
    if (rl !== void 0)
        return rl;
    if (typeof document < "u")
        return document;
    throw new y(210,!1)
}
var zs = new v("",{
    factory: () => qE
})
  , qE = "ng";
var Gs = new v("")
  , No = new v("",{
    providedIn: "platform",
    factory: () => "unknown"
});
var Ws = new v("",{
    factory: () => p($).body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") || null
});
var cg = "r";
var ug = "di";
var lg = !1
  , dg = new v("",{
    factory: () => lg
});
var qs = new v("");
var ZE = (e, t, n, r) => {}
;
function YE(e, t, n, r) {
    ZE(e, t, n, r)
}
function Zs(e) {
    return (e.flags & 32) === 32
}
var QE = () => null;
function fg(e, t, n=!1) {
    return QE(e, t, n)
}
function hg(e, t) {
    let n = e.contentQueries;
    if (n !== null) {
        let r = _(null);
        try {
            for (let o = 0; o < n.length; o += 2) {
                let i = n[o]
                  , s = n[o + 1];
                if (s !== -1) {
                    let a = e.data[s];
                    ds(i),
                    a.contentQueries(2, t[s], s)
                }
            }
        } finally {
            _(r)
        }
    }
}
function ol(e, t, n) {
    ds(0);
    let r = _(null);
    try {
        t(e, n)
    } finally {
        _(r)
    }
}
function pg(e, t, n) {
    if (pu(t)) {
        let r = _(null);
        try {
            let o = t.directiveStart
              , i = t.directiveEnd;
            for (let s = o; s < i; s++) {
                let a = e.data[s];
                if (a.contentQueries) {
                    let c = n[s];
                    a.contentQueries(1, c, s)
                }
            }
        } finally {
            _(r)
        }
    }
}
var qe = (function(e) {
    return e[e.Emulated = 0] = "Emulated",
    e[e.None = 2] = "None",
    e[e.ShadowDom = 3] = "ShadowDom",
    e[e.ExperimentalIsolatedShadowDom = 4] = "ExperimentalIsolatedShadowDom",
    e
}
)(qe || {});
var vs;
function KE() {
    if (vs === void 0 && (vs = null,
    Bt.trustedTypes))
        try {
            vs = Bt.trustedTypes.createPolicy("angular", {
                createHTML: e => e,
                createScript: e => e,
                createScriptURL: e => e
            })
        } catch {}
    return vs
}
function Ys(e) {
    return KE()?.createHTML(e) || e
}
var Ds;
function JE() {
    if (Ds === void 0 && (Ds = null,
    Bt.trustedTypes))
        try {
            Ds = Bt.trustedTypes.createPolicy("angular#unsafe-bypass", {
                createHTML: e => e,
                createScript: e => e,
                createScriptURL: e => e
            })
        } catch {}
    return Ds
}
function mp(e) {
    return JE()?.createHTML(e) || e
}
var _t = class {
    changingThisBreaksApplicationSecurity;
    constructor(t) {
        this.changingThisBreaksApplicationSecurity = t
    }
    toString() {
        return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${es})`
    }
}
  , il = class extends _t {
    getTypeName() {
        return "HTML"
    }
}
  , sl = class extends _t {
    getTypeName() {
        return "Style"
    }
}
  , al = class extends _t {
    getTypeName() {
        return "Script"
    }
}
  , cl = class extends _t {
    getTypeName() {
        return "URL"
    }
}
  , ul = class extends _t {
    getTypeName() {
        return "ResourceURL"
    }
}
;
function Ye(e) {
    return e instanceof _t ? e.changingThisBreaksApplicationSecurity : e
}
function bt(e, t) {
    let n = gg(e);
    if (n != null && n !== t) {
        if (n === "ResourceURL" && t === "URL")
            return !0;
        throw new Error(`Required a safe ${t}, got a ${n} (see ${es})`)
    }
    return n === t
}
function gg(e) {
    return e instanceof _t && e.getTypeName() || null
}
function Ll(e) {
    return new il(e)
}
function jl(e) {
    return new sl(e)
}
function Vl(e) {
    return new al(e)
}
function Bl(e) {
    return new cl(e)
}
function Ul(e) {
    return new ul(e)
}
function XE(e) {
    let t = new dl(e);
    return eC() ? new ll(t) : t
}
var ll = class {
    inertDocumentHelper;
    constructor(t) {
        this.inertDocumentHelper = t
    }
    getInertBodyElement(t) {
        t = "<body><remove></remove>" + t;
        try {
            let n = new window.DOMParser().parseFromString(Ys(t), "text/html").body;
            return n === null ? this.inertDocumentHelper.getInertBodyElement(t) : (n.firstChild?.remove(),
            n)
        } catch {
            return null
        }
    }
}
  , dl = class {
    defaultDoc;
    inertDocument;
    constructor(t) {
        this.defaultDoc = t,
        this.inertDocument = this.defaultDoc.implementation.createHTMLDocument("sanitization-inert")
    }
    getInertBodyElement(t) {
        let n = this.inertDocument.createElement("template");
        return n.innerHTML = Ys(t),
        n
    }
}
;
function eC() {
    try {
        return !!new window.DOMParser().parseFromString(Ys(""), "text/html")
    } catch {
        return !1
    }
}
var tC = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function Ro(e) {
    return e = String(e),
    e.match(tC) ? e : "unsafe:" + e
}
function Mt(e) {
    let t = {};
    for (let n of e.split(","))
        t[n] = !0;
    return t
}
function xo(...e) {
    let t = {};
    for (let n of e)
        for (let r in n)
            n.hasOwnProperty(r) && (t[r] = !0);
    return t
}
var mg = Mt("area,br,col,hr,img,wbr")
  , yg = Mt("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr")
  , vg = Mt("rp,rt")
  , nC = xo(vg, yg)
  , rC = xo(yg, Mt("address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul"))
  , oC = xo(vg, Mt("a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video"))
  , yp = xo(mg, rC, oC, nC)
  , Dg = Mt("background,cite,href,itemtype,longdesc,poster,src,xlink:href")
  , iC = Mt("abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width")
  , sC = Mt("aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext")
  , aC = xo(Dg, iC, sC)
  , cC = Mt("script,style,template")
  , fl = class {
    sanitizedSomething = !1;
    buf = [];
    sanitizeChildren(t) {
        let n = t.firstChild
          , r = !0
          , o = [];
        for (; n; ) {
            if (n.nodeType === Node.ELEMENT_NODE ? r = this.startElement(n) : n.nodeType === Node.TEXT_NODE ? this.chars(n.nodeValue) : this.sanitizedSomething = !0,
            r && n.firstChild) {
                o.push(n),
                n = dC(n);
                continue
            }
            for (; n; ) {
                n.nodeType === Node.ELEMENT_NODE && this.endElement(n);
                let i = lC(n);
                if (i) {
                    n = i;
                    break
                }
                n = o.pop()
            }
        }
        return this.buf.join("")
    }
    startElement(t) {
        let n = vp(t).toLowerCase();
        if (!yp.hasOwnProperty(n))
            return this.sanitizedSomething = !0,
            !cC.hasOwnProperty(n);
        this.buf.push("<"),
        this.buf.push(n);
        let r = t.attributes;
        for (let o = 0; o < r.length; o++) {
            let i = r.item(o)
              , s = i.name
              , a = s.toLowerCase();
            if (!aC.hasOwnProperty(a)) {
                this.sanitizedSomething = !0;
                continue
            }
            let c = i.value;
            Dg[a] && (c = Ro(c)),
            this.buf.push(" ", s, '="', Dp(c), '"')
        }
        return this.buf.push(">"),
        !0
    }
    endElement(t) {
        let n = vp(t).toLowerCase();
        yp.hasOwnProperty(n) && !mg.hasOwnProperty(n) && (this.buf.push("</"),
        this.buf.push(n),
        this.buf.push(">"))
    }
    chars(t) {
        this.buf.push(Dp(t))
    }
}
;
function uC(e, t) {
    return (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY) !== Node.DOCUMENT_POSITION_CONTAINED_BY
}
function lC(e) {
    let t = e.nextSibling;
    if (t && e !== t.previousSibling)
        throw Eg(t);
    return t
}
function dC(e) {
    let t = e.firstChild;
    if (t && uC(e, t))
        throw Eg(t);
    return t
}
function vp(e) {
    let t = e.nodeName;
    return typeof t == "string" ? t : "FORM"
}
function Eg(e) {
    return new Error(`Failed to sanitize html because the element is clobbered: ${e.outerHTML}`)
}
var fC = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
  , hC = /([^\#-~ |!])/g;
function Dp(e) {
    return e.replace(/&/g, "&amp;").replace(fC, function(t) {
        let n = t.charCodeAt(0)
          , r = t.charCodeAt(1);
        return "&#" + ((n - 55296) * 1024 + (r - 56320) + 65536) + ";"
    }).replace(hC, function(t) {
        return "&#" + t.charCodeAt(0) + ";"
    }).replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
var Es;
function Qs(e, t) {
    let n = null;
    try {
        Es = Es || XE(e);
        let r = t ? String(t) : "";
        n = Es.getInertBodyElement(r);
        let o = 5
          , i = r;
        do {
            if (o === 0)
                throw new Error("Failed to sanitize html because the input is unstable");
            o--,
            r = i,
            i = n.innerHTML,
            n = Es.getInertBodyElement(r)
        } while (r !== i);
        let a = new fl().sanitizeChildren(Ep(n) || n);
        return Ys(a)
    } finally {
        if (n) {
            let r = Ep(n) || n;
            for (; r.firstChild; )
                r.firstChild.remove()
        }
    }
}
function Ep(e) {
    return "content"in e && pC(e) ? e.content : null
}
function pC(e) {
    return e.nodeType === Node.ELEMENT_NODE && e.nodeName === "TEMPLATE"
}
function gC(e, t) {
    return e.createText(t)
}
function mC(e, t, n) {
    e.setValue(t, n)
}
function Cg(e, t, n) {
    return e.createElement(t, n)
}
function xs(e, t, n, r, o) {
    e.insertBefore(t, n, r, o)
}
function Ig(e, t, n) {
    e.appendChild(t, n)
}
function Cp(e, t, n, r, o) {
    r !== null ? xs(e, t, n, r, o) : Ig(e, t, n)
}
function wg(e, t, n, r) {
    e.removeChild(null, t, n, r)
}
function yC(e, t, n) {
    e.setAttribute(t, "style", n)
}
function vC(e, t, n) {
    n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n)
}
function _g(e, t, n) {
    let {mergedAttrs: r, classes: o, styles: i} = n;
    r !== null && NE(e, t, r),
    o !== null && vC(e, t, o),
    i !== null && yC(e, t, i)
}
var Qe = (function(e) {
    return e[e.NONE = 0] = "NONE",
    e[e.HTML = 1] = "HTML",
    e[e.STYLE = 2] = "STYLE",
    e[e.SCRIPT = 3] = "SCRIPT",
    e[e.URL = 4] = "URL",
    e[e.RESOURCE_URL = 5] = "RESOURCE_URL",
    e
}
)(Qe || {});
function DC(e) {
    let t = bg();
    return t ? mp(t.sanitize(Qe.HTML, e) || "") : bt(e, "HTML") ? mp(Ye(e)) : Qs(ag(), fr(e))
}
function EC(e) {
    let t = bg();
    return t ? t.sanitize(Qe.URL, e) || "" : bt(e, "URL") ? Ye(e) : Ro(fr(e))
}
function bg() {
    let e = N();
    return e && e[ot].sanitizer
}
function CC(e) {
    return e.ownerDocument
}
function Mg(e) {
    return e instanceof Function ? e() : e
}
function IC(e, t, n) {
    let r = e.length;
    for (; ; ) {
        let o = e.indexOf(t, n);
        if (o === -1)
            return o;
        if (o === 0 || e.charCodeAt(o - 1) <= 32) {
            let i = t.length;
            if (o + i === r || e.charCodeAt(o + i) <= 32)
                return o
        }
        n = o + 1
    }
}
var Tg = "ng-template";
function wC(e, t, n, r) {
    let o = 0;
    if (r) {
        for (; o < t.length && typeof t[o] == "string"; o += 2)
            if (t[o] === "class" && IC(t[o + 1].toLowerCase(), n, 0) !== -1)
                return !0
    } else if (Hl(e))
        return !1;
    if (o = t.indexOf(1, o),
    o > -1) {
        let i;
        for (; ++o < t.length && typeof (i = t[o]) == "string"; )
            if (i.toLowerCase() === n)
                return !0
    }
    return !1
}
function Hl(e) {
    return e.type === 4 && e.value !== Tg
}
function _C(e, t, n) {
    let r = e.type === 4 && !n ? Tg : e.value;
    return t === r
}
function bC(e, t, n) {
    let r = 4
      , o = e.attrs
      , i = o !== null ? SC(o) : 0
      , s = !1;
    for (let a = 0; a < t.length; a++) {
        let c = t[a];
        if (typeof c == "number") {
            if (!s && !We(r) && !We(c))
                return !1;
            if (s && We(c))
                continue;
            s = !1,
            r = c | r & 1;
            continue
        }
        if (!s)
            if (r & 4) {
                if (r = 2 | r & 1,
                c !== "" && !_C(e, c, n) || c === "" && t.length === 1) {
                    if (We(r))
                        return !1;
                    s = !0
                }
            } else if (r & 8) {
                if (o === null || !wC(e, o, c, n)) {
                    if (We(r))
                        return !1;
                    s = !0
                }
            } else {
                let u = t[++a]
                  , l = MC(c, o, Hl(e), n);
                if (l === -1) {
                    if (We(r))
                        return !1;
                    s = !0;
                    continue
                }
                if (u !== "") {
                    let d;
                    if (l > i ? d = "" : d = o[l + 1].toLowerCase(),
                    r & 2 && u !== d) {
                        if (We(r))
                            return !1;
                        s = !0
                    }
                }
            }
    }
    return We(r) || s
}
function We(e) {
    return (e & 1) === 0
}
function MC(e, t, n, r) {
    if (t === null)
        return -1;
    let o = 0;
    if (r || !n) {
        let i = !1;
        for (; o < t.length; ) {
            let s = t[o];
            if (s === e)
                return o;
            if (s === 3 || s === 6)
                i = !0;
            else if (s === 1 || s === 2) {
                let a = t[++o];
                for (; typeof a == "string"; )
                    a = t[++o];
                continue
            } else {
                if (s === 4)
                    break;
                if (s === 0) {
                    o += 4;
                    continue
                }
            }
            o += i ? 1 : 2
        }
        return -1
    } else
        return AC(t, e)
}
function Sg(e, t, n=!1) {
    for (let r = 0; r < t.length; r++)
        if (bC(e, t[r], n))
            return !0;
    return !1
}
function TC(e) {
    let t = e.attrs;
    if (t != null) {
        let n = t.indexOf(5);
        if ((n & 1) === 0)
            return t[n + 1]
    }
    return null
}
function SC(e) {
    for (let t = 0; t < e.length; t++) {
        let n = e[t];
        if (RE(n))
            return t
    }
    return e.length
}
function AC(e, t) {
    let n = e.indexOf(4);
    if (n > -1)
        for (n++; n < e.length; ) {
            let r = e[n];
            if (typeof r == "number")
                return -1;
            if (r === t)
                return n;
            n++
        }
    return -1
}
function NC(e, t) {
    e: for (let n = 0; n < t.length; n++) {
        let r = t[n];
        if (e.length === r.length) {
            for (let o = 0; o < e.length; o++)
                if (e[o] !== r[o])
                    continue e;
            return !0
        }
    }
    return !1
}
function Ip(e, t) {
    return e ? ":not(" + t.trim() + ")" : t
}
function RC(e) {
    let t = e[0]
      , n = 1
      , r = 2
      , o = ""
      , i = !1;
    for (; n < e.length; ) {
        let s = e[n];
        if (typeof s == "string")
            if (r & 2) {
                let a = e[++n];
                o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]"
            } else
                r & 8 ? o += "." + s : r & 4 && (o += " " + s);
        else
            o !== "" && !We(s) && (t += Ip(i, o),
            o = ""),
            r = s,
            i = i || !We(r);
        n++
    }
    return o !== "" && (t += Ip(i, o)),
    t
}
function xC(e) {
    return e.map(RC).join(",")
}
function OC(e) {
    let t = []
      , n = []
      , r = 1
      , o = 2;
    for (; r < e.length; ) {
        let i = e[r];
        if (typeof i == "string")
            o === 2 ? i !== "" && t.push(i, e[++r]) : o === 8 && n.push(i);
        else {
            if (!We(o))
                break;
            o = i
        }
        r++
    }
    return n.length && t.push(1, ...n),
    t
}
var lt = {};
function $l(e, t, n, r, o, i, s, a, c, u, l) {
    let d = Z + r
      , h = d + o
      , f = FC(d, h)
      , m = typeof u == "function" ? u() : u;
    return f[M] = {
        type: e,
        blueprint: f,
        template: n,
        queries: null,
        viewQuery: a,
        declTNode: t,
        data: f.slice().fill(null, d),
        bindingStartIndex: d,
        expandoStartIndex: h,
        hostBindingOpCodes: null,
        firstCreatePass: !0,
        firstUpdatePass: !0,
        staticViewQueries: !1,
        staticContentQueries: !1,
        preOrderHooks: null,
        preOrderCheckHooks: null,
        contentHooks: null,
        contentCheckHooks: null,
        viewHooks: null,
        viewCheckHooks: null,
        destroyHooks: null,
        cleanup: null,
        contentQueries: null,
        components: null,
        directiveRegistry: typeof i == "function" ? i() : i,
        pipeRegistry: typeof s == "function" ? s() : s,
        firstChild: null,
        schemas: c,
        consts: m,
        incompleteFirstPass: !1,
        ssrId: l
    }
}
function FC(e, t) {
    let n = [];
    for (let r = 0; r < t; r++)
        n.push(r < e ? null : lt);
    return n
}
function kC(e) {
    let t = e.tView;
    return t === null || t.incompleteFirstPass ? e.tView = $l(1, null, e.template, e.decls, e.vars, e.directiveDefs, e.pipeDefs, e.viewQuery, e.schemas, e.consts, e.id) : t
}
function zl(e, t, n, r, o, i, s, a, c, u, l) {
    let d = t.blueprint.slice();
    return d[Ue] = o,
    d[T] = r | 4 | 128 | 8 | 64 | 1024,
    (u !== null || e && e[T] & 2048) && (d[T] |= 2048),
    Du(d),
    d[te] = d[Cn] = e,
    d[Q] = n,
    d[ot] = s || e && e[ot],
    d[G] = a || e && e[G],
    d[Ct] = c || e && e[Ct] || null,
    d[ge] = i,
    d[It] = GE(),
    d[En] = l,
    d[fu] = u,
    d[me] = t.type == 2 ? e[me] : d,
    d
}
function PC(e, t, n) {
    let r = $e(t, e)
      , o = kC(n)
      , i = e[ot].rendererFactory
      , s = Gl(e, zl(e, o, null, Ag(n), r, t, null, i.createRenderer(r, n), null, null, null));
    return e[t.index] = s
}
function Ag(e) {
    let t = 16;
    return e.signals ? t = 4096 : e.onPush && (t = 64),
    t
}
function Ng(e, t, n, r) {
    if (n === 0)
        return -1;
    let o = t.length;
    for (let i = 0; i < n; i++)
        t.push(r),
        e.blueprint.push(r),
        e.data.push(null);
    return o
}
function Gl(e, t) {
    return e[gr] ? e[du][Oe] = t : e[gr] = t,
    e[du] = t,
    t
}
function LC(e=1) {
    Rg(se(), N(), Wt() + e, !1)
}
function Rg(e, t, n, r) {
    if (!r)
        if ((t[T] & 3) === 3) {
            let i = e.preOrderCheckHooks;
            i !== null && Is(t, i, n)
        } else {
            let i = e.preOrderHooks;
            i !== null && ws(t, i, 0, n)
        }
    qt(n)
}
var Ks = (function(e) {
    return e[e.None = 0] = "None",
    e[e.SignalBased = 1] = "SignalBased",
    e[e.HasDecoratorInputTransform = 2] = "HasDecoratorInputTransform",
    e
}
)(Ks || {});
function hl(e, t, n, r) {
    let o = _(null);
    try {
        let[i,s,a] = e.inputs[n]
          , c = null;
        (s & Ks.SignalBased) !== 0 && (c = t[i][De]),
        c !== null && c.transformFn !== void 0 ? r = c.transformFn(r) : a !== null && (r = a.call(t, r)),
        e.setInput !== null ? e.setInput(t, c, r, n, i) : Hp(t, c, i, r)
    } finally {
        _(o)
    }
}
var Ze = (function(e) {
    return e[e.Important = 1] = "Important",
    e[e.DashCase = 2] = "DashCase",
    e
}
)(Ze || {}), jC;
function Wl(e, t) {
    return jC(e, t)
}
var Rn = new Set
  , Js = (function(e) {
    return e[e.CHANGE_DETECTION = 0] = "CHANGE_DETECTION",
    e[e.AFTER_NEXT_RENDER = 1] = "AFTER_NEXT_RENDER",
    e
}
)(Js || {})
  , Tt = new v("")
  , wp = new Set;
function Ke(e) {
    wp.has(e) || (wp.add(e),
    performance?.mark?.("mark_feature_usage", {
        detail: {
            feature: e
        }
    }))
}
var ql = ( () => {
    class e {
        impl = null;
        execute() {
            this.impl?.execute()
        }
        static \u0275prov = D({
            token: e,
            providedIn: "root",
            factory: () => new e
        })
    }
    return e
}
)()
  , xg = [0, 1, 2, 3]
  , Og = ( () => {
    class e {
        ngZone = p(fe);
        scheduler = p(vt);
        errorHandler = p(Re, {
            optional: !0
        });
        sequences = new Set;
        deferredRegistrations = new Set;
        executing = !1;
        constructor() {
            p(Tt, {
                optional: !0
            })
        }
        execute() {
            let n = this.sequences.size > 0;
            n && B(F.AfterRenderHooksStart),
            this.executing = !0;
            for (let r of xg)
                for (let o of this.sequences)
                    if (!(o.erroredOrDestroyed || !o.hooks[r]))
                        try {
                            o.pipelinedValue = this.ngZone.runOutsideAngular( () => this.maybeTrace( () => {
                                let i = o.hooks[r];
                                return i(o.pipelinedValue)
                            }
                            , o.snapshot))
                        } catch (i) {
                            o.erroredOrDestroyed = !0,
                            this.errorHandler?.handleError(i)
                        }
            this.executing = !1;
            for (let r of this.sequences)
                r.afterRun(),
                r.once && (this.sequences.delete(r),
                r.destroy());
            for (let r of this.deferredRegistrations)
                this.sequences.add(r);
            this.deferredRegistrations.size > 0 && this.scheduler.notify(7),
            this.deferredRegistrations.clear(),
            n && B(F.AfterRenderHooksEnd)
        }
        register(n) {
            let {view: r} = n;
            r !== void 0 ? ((r[wn] ??= []).push(n),
            Tn(r),
            r[T] |= 8192) : this.executing ? this.deferredRegistrations.add(n) : this.addSequence(n)
        }
        addSequence(n) {
            this.sequences.add(n),
            this.scheduler.notify(7)
        }
        unregister(n) {
            this.executing && this.sequences.has(n) ? (n.erroredOrDestroyed = !0,
            n.pipelinedValue = void 0,
            n.once = !0) : (this.sequences.delete(n),
            this.deferredRegistrations.delete(n))
        }
        maybeTrace(n, r) {
            return r ? r.run(Js.AFTER_NEXT_RENDER, n) : n()
        }
        static \u0275prov = D({
            token: e,
            providedIn: "root",
            factory: () => new e
        })
    }
    return e
}
)()
  , Os = class {
    impl;
    hooks;
    view;
    once;
    snapshot;
    erroredOrDestroyed = !1;
    pipelinedValue = void 0;
    unregisterOnDestroy;
    constructor(t, n, r, o, i, s=null) {
        this.impl = t,
        this.hooks = n,
        this.view = r,
        this.once = o,
        this.snapshot = s,
        this.unregisterOnDestroy = i?.onDestroy( () => this.destroy())
    }
    afterRun() {
        this.erroredOrDestroyed = !1,
        this.pipelinedValue = void 0,
        this.snapshot?.dispose(),
        this.snapshot = null
    }
    destroy() {
        this.impl.unregister(this),
        this.unregisterOnDestroy?.();
        let t = this.view?.[wn];
        t && (this.view[wn] = t.filter(n => n !== this))
    }
}
;
function Oo(e, t) {
    let n = t?.injector ?? p(le);
    return Ke("NgAfterNextRender"),
    BC(e, n, t, !0)
}
function VC(e) {
    return e instanceof Function ? [void 0, void 0, e, void 0] : [e.earlyRead, e.write, e.mixedReadWrite, e.read]
}
function BC(e, t, n, r) {
    let o = t.get(ql);
    o.impl ??= t.get(Og);
    let i = t.get(Tt, null, {
        optional: !0
    })
      , s = n?.manualCleanup !== !0 ? t.get(Ce) : null
      , a = t.get(vo, null, {
        optional: !0
    })
      , c = new Os(o.impl,VC(e),a?.view,r,s,i?.snapshot(null));
    return o.impl.register(c),
    c
}
var Fg = new v("",{
    factory: () => ({
        queue: new Set,
        isScheduled: !1,
        scheduler: null,
        injector: p(H)
    })
});
function kg(e, t, n) {
    let r = e.get(Fg);
    if (Array.isArray(t))
        for (let o of t)
            r.queue.add(o),
            n?.detachedLeaveAnimationFns?.push(o);
    else
        r.queue.add(t),
        n?.detachedLeaveAnimationFns?.push(t);
    r.scheduler && r.scheduler(e)
}
function UC(e, t) {
    let n = e.get(Fg);
    if (t.detachedLeaveAnimationFns) {
        for (let r of t.detachedLeaveAnimationFns)
            n.queue.delete(r);
        t.detachedLeaveAnimationFns = void 0
    }
}
function HC(e, t) {
    for (let[n,r] of t)
        kg(e, r.animateFns)
}
function _p(e, t, n, r) {
    let o = e?.[_n]?.enter;
    t !== null && o && o.has(n.index) && HC(r, o)
}
function vr(e, t, n, r, o, i, s, a) {
    if (o != null) {
        let c, u = !1;
        He(o) ? c = o : st(o) && (u = !0,
        o = o[Ue]);
        let l = Fe(o);
        e === 0 && r !== null ? (_p(a, r, i, n),
        s == null ? Ig(t, r, l) : xs(t, r, l, s || null, !0)) : e === 1 && r !== null ? (_p(a, r, i, n),
        xs(t, r, l, s || null, !0)) : e === 2 ? bp(a, i, n, d => {
            wg(t, l, u, d)
        }
        ) : e === 3 && bp(a, i, n, () => {
            t.destroyNode(l)
        }
        ),
        c != null && XC(t, e, n, c, i, r, s)
    }
}
function $C(e, t) {
    Pg(e, t),
    t[Ue] = null,
    t[ge] = null
}
function zC(e, t, n, r, o, i) {
    r[Ue] = o,
    r[ge] = t,
    ea(e, r, n, 1, o, i)
}
function Pg(e, t) {
    t[ot].changeDetectionScheduler?.notify(9),
    ea(e, t, t[G], 2, null, null)
}
function GC(e) {
    let t = e[gr];
    if (!t)
        return zu(e[M], e);
    for (; t; ) {
        let n = null;
        if (st(t))
            n = t[gr];
        else {
            let r = t[Y];
            r && (n = r)
        }
        if (!n) {
            for (; t && !t[Oe] && t !== e; )
                st(t) && zu(t[M], t),
                t = t[te];
            t === null && (t = e),
            st(t) && zu(t[M], t),
            n = t && t[Oe]
        }
        t = n
    }
}
function Zl(e, t) {
    let n = e[bn]
      , r = n.indexOf(t);
    n.splice(r, 1)
}
function Xs(e, t) {
    if (Mn(t))
        return;
    let n = t[G];
    n.destroyNode && ea(e, t, n, 3, null, null),
    GC(t)
}
function zu(e, t) {
    if (Mn(t))
        return;
    let n = _(null);
    try {
        t[T] &= -129,
        t[T] |= 256,
        t[be] && hn(t[be]),
        ZC(e, t),
        qC(e, t),
        t[M].type === 1 && t[G].destroy();
        let r = t[$t];
        if (r !== null && He(t[te])) {
            r !== t[te] && Zl(r, t);
            let o = t[it];
            o !== null && o.detachView(e)
        }
        nl(t)
    } finally {
        _(n)
    }
}
function bp(e, t, n, r) {
    let o = e?.[_n];
    if (o == null || o.leave == null || !o.leave.has(t.index))
        return r(!1);
    e && Rn.add(e[It]),
    kg(n, () => {
        if (o.leave && o.leave.has(t.index)) {
            let s = o.leave.get(t.index)
              , a = [];
            if (s) {
                for (let c = 0; c < s.animateFns.length; c++) {
                    let u = s.animateFns[c]
                      , {promise: l} = u();
                    a.push(l)
                }
                o.detachedLeaveAnimationFns = void 0
            }
            o.running = Promise.allSettled(a),
            WC(e, r)
        } else
            e && Rn.delete(e[It]),
            r(!1)
    }
    , o)
}
function WC(e, t) {
    let n = e[_n]?.running;
    if (n) {
        n.then( () => {
            e[_n].running = void 0,
            Rn.delete(e[It]),
            t(!0)
        }
        );
        return
    }
    t(!1)
}
function qC(e, t) {
    let n = e.cleanup
      , r = t[pr];
    if (n !== null)
        for (let s = 0; s < n.length - 1; s += 2)
            if (typeof n[s] == "string") {
                let a = n[s + 3];
                a >= 0 ? r[a]() : r[-a].unsubscribe(),
                s += 2
            } else {
                let a = r[n[s + 1]];
                n[s].call(a)
            }
    r !== null && (t[pr] = null);
    let o = t[mt];
    if (o !== null) {
        t[mt] = null;
        for (let s = 0; s < o.length; s++) {
            let a = o[s];
            a()
        }
    }
    let i = t[jt];
    if (i !== null) {
        t[jt] = null;
        for (let s of i)
            s.destroy()
    }
}
function ZC(e, t) {
    let n;
    if (e != null && (n = e.destroyHooks) != null)
        for (let r = 0; r < n.length; r += 2) {
            let o = t[n[r]];
            if (!(o instanceof Nn)) {
                let i = n[r + 1];
                if (Array.isArray(i))
                    for (let s = 0; s < i.length; s += 2) {
                        let a = o[i[s]]
                          , c = i[s + 1];
                        B(F.LifecycleHookStart, a, c);
                        try {
                            c.call(a)
                        } finally {
                            B(F.LifecycleHookEnd, a, c)
                        }
                    }
                else {
                    B(F.LifecycleHookStart, o, i);
                    try {
                        i.call(o)
                    } finally {
                        B(F.LifecycleHookEnd, o, i)
                    }
                }
            }
        }
}
function Lg(e, t, n) {
    return YC(e, t.parent, n)
}
function YC(e, t, n) {
    let r = t;
    for (; r !== null && r.type & 168; )
        t = r,
        r = t.parent;
    if (r === null)
        return n[Ue];
    if (Gt(r)) {
        let {encapsulation: o} = e.data[r.directiveStart + r.componentOffset];
        if (o === qe.None || o === qe.Emulated)
            return null
    }
    return $e(r, n)
}
function jg(e, t, n) {
    return KC(e, t, n)
}
function QC(e, t, n) {
    return e.type & 40 ? $e(e, n) : null
}
var KC = QC, Mp;
function Yl(e, t, n, r) {
    let o = Lg(e, r, t)
      , i = t[G]
      , s = r.parent || t[ge]
      , a = jg(s, r, t);
    if (o != null)
        if (Array.isArray(n))
            for (let c = 0; c < n.length; c++)
                Cp(i, o, n[c], a, !1);
        else
            Cp(i, o, n, a, !1);
    Mp !== void 0 && Mp(i, r, t, n, o)
}
function Co(e, t) {
    if (t !== null) {
        let n = t.type;
        if (n & 3)
            return $e(t, e);
        if (n & 4)
            return pl(-1, e[t.index]);
        if (n & 8) {
            let r = t.child;
            if (r !== null)
                return Co(e, r);
            {
                let o = e[t.index];
                return He(o) ? pl(-1, o) : Fe(o)
            }
        } else {
            if (n & 128)
                return Co(e, t.next);
            if (n & 32)
                return Wl(t, e)() || Fe(e[t.index]);
            {
                let r = Vg(e, t);
                if (r !== null) {
                    if (Array.isArray(r))
                        return r[0];
                    let o = Vt(e[me]);
                    return Co(o, r)
                } else
                    return Co(e, t.next)
            }
        }
    }
    return null
}
function Vg(e, t) {
    if (t !== null) {
        let r = e[me][ge]
          , o = t.projection;
        return r.projection[o]
    }
    return null
}
function pl(e, t) {
    let n = Y + e + 1;
    if (n < t.length) {
        let r = t[n]
          , o = r[M].firstChild;
        if (o !== null)
            return Co(r, o)
    }
    return t[zt]
}
function Ql(e, t, n, r, o, i, s) {
    for (; n != null; ) {
        let a = r[Ct];
        if (n.type === 128) {
            n = n.next;
            continue
        }
        let c = r[n.index]
          , u = n.type;
        if (s && t === 0 && (c && Cr(Fe(c), r),
        n.flags |= 2),
        !Zs(n))
            if (u & 8)
                Ql(e, t, n.child, r, o, i, !1),
                vr(t, e, a, o, c, n, i, r);
            else if (u & 32) {
                let l = Wl(n, r), d;
                for (; d = l(); )
                    vr(t, e, a, o, d, n, i, r);
                vr(t, e, a, o, c, n, i, r)
            } else
                u & 16 ? Bg(e, t, r, n, o, i) : vr(t, e, a, o, c, n, i, r);
        n = s ? n.projectionNext : n.next
    }
}
function ea(e, t, n, r, o, i) {
    Ql(n, r, e.firstChild, t, o, i, !1)
}
function JC(e, t, n) {
    let r = t[G]
      , o = Lg(e, n, t)
      , i = n.parent || t[ge]
      , s = jg(i, n, t);
    Bg(r, 0, t, n, o, s)
}
function Bg(e, t, n, r, o, i) {
    let s = n[me]
      , c = s[ge].projection[r.projection];
    if (Array.isArray(c))
        for (let u = 0; u < c.length; u++) {
            let l = c[u];
            vr(t, e, n[Ct], o, l, r, i, n)
        }
    else {
        let u = c
          , l = s[te];
        ng(r) && (u.flags |= 128),
        Ql(e, t, u, l, o, i, !0)
    }
}
function XC(e, t, n, r, o, i, s) {
    let a = r[zt]
      , c = Fe(r);
    a !== c && vr(t, e, n, i, a, o, s);
    for (let u = Y; u < r.length; u++) {
        let l = r[u];
        ea(l[M], l, e, t, i, a)
    }
}
function eI(e, t, n, r, o) {
    if (t)
        o ? e.addClass(n, r) : e.removeClass(n, r);
    else {
        let i = r.indexOf("-") === -1 ? void 0 : Ze.DashCase;
        o == null ? e.removeStyle(n, r, i) : (typeof o == "string" && o.endsWith("!important") && (o = o.slice(0, -10),
        i |= Ze.Important),
        e.setStyle(n, r, o, i))
    }
}
function Ug(e, t, n, r, o) {
    let i = Wt()
      , s = r & 2;
    try {
        qt(-1),
        s && t.length > Z && Rg(e, t, Z, !1);
        let a = s ? F.TemplateUpdateStart : F.TemplateCreateStart;
        B(a, o, n),
        n(r, o)
    } finally {
        qt(i);
        let a = s ? F.TemplateUpdateEnd : F.TemplateCreateEnd;
        B(a, o, n)
    }
}
function Hg(e, t, n) {
    aI(e, t, n),
    (n.flags & 64) === 64 && cI(e, t, n)
}
function Kl(e, t, n=$e) {
    let r = t.localNames;
    if (r !== null) {
        let o = t.index + 1;
        for (let i = 0; i < r.length; i += 2) {
            let s = r[i + 1]
              , a = s === -1 ? n(t, e) : e[s];
            e[o++] = a
        }
    }
}
function tI(e, t, n, r) {
    let i = r.get(dg, lg) || n === qe.ShadowDom || n === qe.ExperimentalIsolatedShadowDom
      , s = e.selectRootElement(t, i);
    return nI(s),
    s
}
function nI(e) {
    rI(e)
}
var rI = () => null;
function oI(e) {
    return e === "class" ? "className" : e === "for" ? "htmlFor" : e === "formaction" ? "formAction" : e === "innerHtml" ? "innerHTML" : e === "readonly" ? "readOnly" : e === "tabindex" ? "tabIndex" : e
}
function iI(e, t, n, r, o, i) {
    let s = t[M];
    if (Jl(e, s, t, n, r)) {
        Gt(e) && sI(t, e.index);
        return
    }
    e.type & 3 && (n = oI(n)),
    $g(e, t, n, r, o, i)
}
function $g(e, t, n, r, o, i) {
    if (e.type & 3) {
        let s = $e(e, t);
        r = i != null ? i(r, e.value || "", n) : r,
        o.setProperty(s, n, r)
    } else
        e.type & 12
}
function sI(e, t) {
    let n = ke(t, e);
    n[T] & 16 || (n[T] |= 64)
}
function aI(e, t, n) {
    let r = n.directiveStart
      , o = n.directiveEnd;
    Gt(n) && PC(t, n, e.data[r + n.componentOffset]),
    e.firstCreatePass || Ns(n, t);
    let i = n.initialInputs;
    for (let s = r; s < o; s++) {
        let a = e.data[s]
          , c = wo(t, e, s, n);
        if (Cr(c, t),
        i !== null && hI(t, s - r, c, a, n, i),
        at(a)) {
            let u = ke(n.index, t);
            u[Q] = wo(t, e, s, n)
        }
    }
}
function cI(e, t, n) {
    let r = n.directiveStart
      , o = n.directiveEnd
      , i = n.index
      , s = qh();
    try {
        qt(i);
        for (let a = r; a < o; a++) {
            let c = e.data[a]
              , u = t[a];
            ls(a),
            (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) && uI(c, u)
        }
    } finally {
        qt(-1),
        ls(s)
    }
}
function uI(e, t) {
    e.hostBindings !== null && e.hostBindings(1, t)
}
function lI(e, t) {
    let n = e.directiveRegistry
      , r = null;
    if (n)
        for (let o = 0; o < n.length; o++) {
            let i = n[o];
            Sg(t, i.selectors, !1) && (r ??= [],
            at(i) ? r.unshift(i) : r.push(i))
        }
    return r
}
function dI(e, t, n, r, o, i) {
    let s = $e(e, t);
    fI(t[G], s, i, e.value, n, r, o)
}
function fI(e, t, n, r, o, i, s) {
    if (i == null)
        e.removeAttribute(t, o, n);
    else {
        let a = s == null ? fr(i) : s(i, r || "", o);
        e.setAttribute(t, o, a, n)
    }
}
function hI(e, t, n, r, o, i) {
    let s = i[t];
    if (s !== null)
        for (let a = 0; a < s.length; a += 2) {
            let c = s[a]
              , u = s[a + 1];
            hl(r, n, c, u)
        }
}
function zg(e, t, n, r, o) {
    let i = Z + n
      , s = t[M]
      , a = o(s, t, e, r, n);
    t[i] = a,
    yr(e, !0);
    let c = e.type === 2;
    return c ? (_g(t[G], a, e),
    (Ph() === 0 || as(e)) && Cr(a, t),
    Lh()) : Cr(a, t),
    gs() && (!c || !Zs(e)) && Yl(s, t, a, e),
    e
}
function Gg(e) {
    let t = e;
    return Au() ? Nu() : (t = t.parent,
    yr(t, !1)),
    t
}
function pI(e, t) {
    let n = e[Ct];
    if (!n)
        return;
    let r;
    try {
        r = n.get(ze, null)
    } catch {
        r = null
    }
    r?.(t)
}
function Jl(e, t, n, r, o) {
    let i = e.inputs?.[r]
      , s = e.hostDirectiveInputs?.[r]
      , a = !1;
    if (s)
        for (let c = 0; c < s.length; c += 2) {
            let u = s[c]
              , l = s[c + 1]
              , d = t.data[u];
            hl(d, n[u], l, o),
            a = !0
        }
    if (i)
        for (let c of i) {
            let u = n[c]
              , l = t.data[c];
            hl(l, u, r, o),
            a = !0
        }
    return a
}
function gI(e, t) {
    let n = ke(t, e)
      , r = n[M];
    mI(r, n);
    let o = n[Ue];
    o !== null && n[En] === null && (n[En] = fg(o, n[Ct])),
    B(F.ComponentStart);
    try {
        Xl(r, n, n[Q])
    } finally {
        B(F.ComponentEnd, n[Q])
    }
}
function mI(e, t) {
    for (let n = t.length; n < e.blueprint.length; n++)
        t.push(e.blueprint[n])
}
function Xl(e, t, n) {
    fs(t);
    try {
        let r = e.viewQuery;
        r !== null && ol(1, r, n);
        let o = e.template;
        o !== null && Ug(e, t, o, 1, n),
        e.firstCreatePass && (e.firstCreatePass = !1),
        t[it]?.finishViewCreation(e),
        e.staticContentQueries && hg(e, t),
        e.staticViewQueries && ol(2, e.viewQuery, n);
        let i = e.components;
        i !== null && yI(t, i)
    } catch (r) {
        throw e.firstCreatePass && (e.incompleteFirstPass = !0,
        e.firstCreatePass = !1),
        r
    } finally {
        t[T] &= -5,
        hs()
    }
}
function yI(e, t) {
    for (let n = 0; n < t.length; n++)
        gI(e, t[n])
}
function Fo(e, t, n, r) {
    let o = _(null);
    try {
        let i = t.tView
          , a = e[T] & 4096 ? 4096 : 16
          , c = zl(e, i, n, a, null, t, null, null, r?.injector ?? null, r?.embeddedViewInjector ?? null, r?.dehydratedView ?? null)
          , u = e[t.index];
        c[$t] = u;
        let l = e[it];
        return l !== null && (c[it] = l.createEmbeddedView(i)),
        Xl(i, c, n),
        c
    } finally {
        _(o)
    }
}
function Ir(e, t) {
    return !t || t.firstChild === null || ng(e)
}
function _o(e, t, n, r, o=!1) {
    for (; n !== null; ) {
        if (n.type === 128) {
            n = o ? n.projectionNext : n.next;
            continue
        }
        let i = t[n.index];
        i !== null && r.push(Fe(i)),
        He(i) && Wg(i, r);
        let s = n.type;
        if (s & 8)
            _o(e, t, n.child, r);
        else if (s & 32) {
            let a = Wl(n, t), c;
            for (; c = a(); )
                r.push(c)
        } else if (s & 16) {
            let a = Vg(t, n);
            if (Array.isArray(a))
                r.push(...a);
            else {
                let c = Vt(t[me]);
                _o(c[M], c, a, r, !0)
            }
        }
        n = o ? n.projectionNext : n.next
    }
    return r
}
function Wg(e, t) {
    for (let n = Y; n < e.length; n++) {
        let r = e[n]
          , o = r[M].firstChild;
        o !== null && _o(r[M], r, o, t)
    }
    e[zt] !== e[Ue] && t.push(e[zt])
}
function qg(e) {
    if (e[wn] !== null) {
        for (let t of e[wn])
            t.impl.addSequence(t);
        e[wn].length = 0
    }
}
var Zg = [];
function vI(e) {
    return e[be] ?? DI(e)
}
function DI(e) {
    let t = Zg.pop() ?? Object.create(CI);
    return t.lView = e,
    t
}
function EI(e) {
    e.lView[be] !== e && (e.lView = null,
    Zg.push(e))
}
var CI = R(g({}, ar), {
    consumerIsAlwaysLive: !0,
    kind: "template",
    consumerMarkedDirty: e => {
        Tn(e.lView)
    }
    ,
    consumerOnSignalRead() {
        this.lView[be] = this
    }
});
function II(e) {
    let t = e[be] ?? Object.create(wI);
    return t.lView = e,
    t
}
var wI = R(g({}, ar), {
    consumerIsAlwaysLive: !0,
    kind: "template",
    consumerMarkedDirty: e => {
        let t = Vt(e.lView);
        for (; t && !Yg(t[M]); )
            t = Vt(t);
        t && Eu(t)
    }
    ,
    consumerOnSignalRead() {
        this.lView[be] = this
    }
});
function Yg(e) {
    return e.type !== 2
}
function Qg(e) {
    if (e[jt] === null)
        return;
    let t = !0;
    for (; t; ) {
        let n = !1;
        for (let r of e[jt])
            r.dirty && (n = !0,
            r.zone === null || Zone.current === r.zone ? r.run() : r.zone.run( () => r.run()));
        t = n && !!(e[T] & 8192)
    }
}
var _I = 100;
function Kg(e, t=0) {
    let r = e[ot].rendererFactory
      , o = !1;
    o || r.begin?.();
    try {
        bI(e, t)
    } finally {
        o || r.end?.()
    }
}
function bI(e, t) {
    let n = Ru();
    try {
        ao(!0),
        gl(e, t);
        let r = 0;
        for (; yo(e); ) {
            if (r === _I)
                throw new y(103,!1);
            r++,
            gl(e, 1)
        }
    } finally {
        ao(n)
    }
}
function MI(e, t, n, r) {
    if (Mn(t))
        return;
    let o = t[T]
      , i = !1
      , s = !1;
    fs(t);
    let a = !0
      , c = null
      , u = null;
    i || (Yg(e) ? (u = vI(t),
    c = cr(u)) : zi() === null ? (a = !1,
    u = II(t),
    c = cr(u)) : t[be] && (hn(t[be]),
    t[be] = null));
    try {
        Du(t),
        $h(e.bindingStartIndex),
        n !== null && Ug(e, t, n, 2, r);
        let l = (o & 3) === 3;
        if (!i)
            if (l) {
                let f = e.preOrderCheckHooks;
                f !== null && Is(t, f, null)
            } else {
                let f = e.preOrderHooks;
                f !== null && ws(t, f, 0, null),
                Hu(t, 0)
            }
        if (s || TI(t),
        Qg(t),
        Jg(t, 0),
        e.contentQueries !== null && hg(e, t),
        !i)
            if (l) {
                let f = e.contentCheckHooks;
                f !== null && Is(t, f)
            } else {
                let f = e.contentHooks;
                f !== null && ws(t, f, 1),
                Hu(t, 1)
            }
        AI(e, t);
        let d = e.components;
        d !== null && em(t, d, 0);
        let h = e.viewQuery;
        if (h !== null && ol(2, h, r),
        !i)
            if (l) {
                let f = e.viewCheckHooks;
                f !== null && Is(t, f)
            } else {
                let f = e.viewHooks;
                f !== null && ws(t, f, 2),
                Hu(t, 2)
            }
        if (e.firstUpdatePass === !0 && (e.firstUpdatePass = !1),
        t[ss]) {
            for (let f of t[ss])
                f();
            t[ss] = null
        }
        i || (qg(t),
        t[T] &= -73)
    } catch (l) {
        throw i || Tn(t),
        l
    } finally {
        u !== null && (to(u, c),
        a && EI(u)),
        hs()
    }
}
function Jg(e, t) {
    for (let n = og(e); n !== null; n = ig(n))
        for (let r = Y; r < n.length; r++) {
            let o = n[r];
            Xg(o, t)
        }
}
function TI(e) {
    for (let t = og(e); t !== null; t = ig(t)) {
        if (!(t[T] & 2))
            continue;
        let n = t[bn];
        for (let r = 0; r < n.length; r++) {
            let o = n[r];
            Eu(o)
        }
    }
}
function SI(e, t, n) {
    B(F.ComponentStart);
    let r = ke(t, e);
    try {
        Xg(r, n)
    } finally {
        B(F.ComponentEnd, r[Q])
    }
}
function Xg(e, t) {
    cs(e) && gl(e, t)
}
function gl(e, t) {
    let r = e[M]
      , o = e[T]
      , i = e[be]
      , s = !!(t === 0 && o & 16);
    if (s ||= !!(o & 64 && t === 0),
    s ||= !!(o & 1024),
    s ||= !!(i?.dirty && no(i)),
    s ||= !1,
    i && (i.dirty = !1),
    e[T] &= -9217,
    s)
        MI(r, e, r.template, e[Q]);
    else if (o & 8192) {
        let a = _(null);
        try {
            Qg(e),
            Jg(e, 1);
            let c = r.components;
            c !== null && em(e, c, 1),
            qg(e)
        } finally {
            _(a)
        }
    }
}
function em(e, t, n) {
    for (let r = 0; r < t.length; r++)
        SI(e, t[r], n)
}
function AI(e, t) {
    let n = e.hostBindingOpCodes;
    if (n !== null)
        try {
            for (let r = 0; r < n.length; r++) {
                let o = n[r];
                if (o < 0)
                    qt(~o);
                else {
                    let i = o
                      , s = n[++r]
                      , a = n[++r];
                    Wh(s, i);
                    let c = t[i];
                    B(F.HostBindingsUpdateStart, c);
                    try {
                        a(2, c)
                    } finally {
                        B(F.HostBindingsUpdateEnd, c)
                    }
                }
            }
        } finally {
            qt(-1)
        }
}
function ed(e, t) {
    let n = Ru() ? 64 : 1088;
    for (e[ot].changeDetectionScheduler?.notify(t); e; ) {
        e[T] |= n;
        let r = Vt(e);
        if (mr(e) && !r)
            return e;
        e = r
    }
    return null
}
function tm(e, t, n, r) {
    return [e, !0, 0, t, null, r, null, n, null, null]
}
function nm(e, t) {
    let n = Y + t;
    if (n < e.length)
        return e[n]
}
function ko(e, t, n, r=!0) {
    let o = t[M];
    if (NI(o, t, e, n),
    r) {
        let s = pl(n, e)
          , a = t[G]
          , c = a.parentNode(e[zt]);
        c !== null && zC(o, e[ge], a, t, c, s)
    }
    let i = t[En];
    i !== null && i.firstChild !== null && (i.firstChild = null)
}
function rm(e, t) {
    let n = bo(e, t);
    return n !== void 0 && Xs(n[M], n),
    n
}
function bo(e, t) {
    if (e.length <= Y)
        return;
    let n = Y + t
      , r = e[n];
    if (r) {
        let o = r[$t];
        o !== null && o !== e && Zl(o, r),
        t > 0 && (e[n - 1][Oe] = r[Oe]);
        let i = fo(e, Y + t);
        $C(r[M], r);
        let s = i[it];
        s !== null && s.detachView(i[M]),
        r[te] = null,
        r[Oe] = null,
        r[T] &= -129
    }
    return r
}
function NI(e, t, n, r) {
    let o = Y + r
      , i = n.length;
    r > 0 && (n[o - 1][Oe] = t),
    r < i - Y ? (t[Oe] = n[o],
    iu(n, Y + r, t)) : (n.push(t),
    t[Oe] = null),
    t[te] = n;
    let s = t[$t];
    s !== null && n !== s && om(s, t);
    let a = t[it];
    a !== null && a.insertView(e),
    us(t),
    t[T] |= 128
}
function om(e, t) {
    let n = e[bn]
      , r = t[te];
    if (st(r))
        e[T] |= 2;
    else {
        let o = r[te][me];
        t[me] !== o && (e[T] |= 2)
    }
    n === null ? e[bn] = [t] : n.push(t)
}
var Zt = class {
    _lView;
    _cdRefInjectingView;
    _appRef = null;
    _attachedToViewContainer = !1;
    exhaustive;
    get rootNodes() {
        let t = this._lView
          , n = t[M];
        return _o(n, t, n.firstChild, [])
    }
    constructor(t, n) {
        this._lView = t,
        this._cdRefInjectingView = n
    }
    get context() {
        return this._lView[Q]
    }
    set context(t) {
        this._lView[Q] = t
    }
    get destroyed() {
        return Mn(this._lView)
    }
    destroy() {
        if (this._appRef)
            this._appRef.detachView(this);
        else if (this._attachedToViewContainer) {
            let t = this._lView[te];
            if (He(t)) {
                let n = t[go]
                  , r = n ? n.indexOf(this) : -1;
                r > -1 && (bo(t, r),
                fo(n, r))
            }
            this._attachedToViewContainer = !1
        }
        Xs(this._lView[M], this._lView)
    }
    onDestroy(t) {
        Cu(this._lView, t)
    }
    markForCheck() {
        ed(this._cdRefInjectingView || this._lView, 4)
    }
    detach() {
        this._lView[T] &= -129
    }
    reattach() {
        us(this._lView),
        this._lView[T] |= 128
    }
    detectChanges() {
        this._lView[T] |= 1024,
        Kg(this._lView)
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
        if (this._appRef)
            throw new y(902,!1);
        this._attachedToViewContainer = !0
    }
    detachFromAppRef() {
        this._appRef = null;
        let t = mr(this._lView)
          , n = this._lView[$t];
        n !== null && !t && Zl(n, this._lView),
        Pg(this._lView[M], this._lView)
    }
    attachToAppRef(t) {
        if (this._attachedToViewContainer)
            throw new y(902,!1);
        this._appRef = t;
        let n = mr(this._lView)
          , r = this._lView[$t];
        r !== null && !n && om(r, this._lView),
        us(this._lView)
    }
}
;
var wr = ( () => {
    class e {
        _declarationLView;
        _declarationTContainer;
        elementRef;
        static __NG_ELEMENT_ID__ = RI;
        constructor(n, r, o) {
            this._declarationLView = n,
            this._declarationTContainer = r,
            this.elementRef = o
        }
        get ssrId() {
            return this._declarationTContainer.tView?.ssrId || null
        }
        createEmbeddedView(n, r) {
            return this.createEmbeddedViewImpl(n, r)
        }
        createEmbeddedViewImpl(n, r, o) {
            let i = Fo(this._declarationLView, this._declarationTContainer, n, {
                embeddedViewInjector: r,
                dehydratedView: o
            });
            return new Zt(i)
        }
    }
    return e
}
)();
function RI() {
    return td(Ee(), N())
}
function td(e, t) {
    return e.type & 4 ? new wr(t,e,br(e, t)) : null
}
function Po(e, t, n, r, o) {
    let i = e.data[t];
    if (i === null)
        i = xI(e, t, n, r, o),
        Gh() && (i.flags |= 32);
    else if (i.type & 64) {
        i.type = n,
        i.value = r,
        i.attrs = o;
        let s = Uh();
        i.injectorIndex = s === null ? -1 : s.injectorIndex
    }
    return yr(i, !0),
    i
}
function xI(e, t, n, r, o) {
    let i = Su()
      , s = Au()
      , a = s ? i : i && i.parent
      , c = e.data[t] = FI(e, a, n, t, r, o);
    return OI(e, c, i, s),
    c
}
function OI(e, t, n, r) {
    e.firstChild === null && (e.firstChild = t),
    n !== null && (r ? n.child == null && t.parent !== null && (n.child = t) : n.next === null && (n.next = t,
    t.prev = n))
}
function FI(e, t, n, r, o, i) {
    let s = t ? t.injectorIndex : -1
      , a = 0;
    return bu() && (a |= 128),
    {
        type: n,
        index: r,
        insertBeforeIndex: null,
        injectorIndex: s,
        directiveStart: -1,
        directiveEnd: -1,
        directiveStylingLast: -1,
        componentOffset: -1,
        fieldIndex: -1,
        customControlIndex: -1,
        propertyBindings: null,
        flags: a,
        providerIndexes: 0,
        value: o,
        attrs: i,
        mergedAttrs: null,
        localNames: null,
        initialInputs: null,
        inputs: null,
        hostDirectiveInputs: null,
        outputs: null,
        hostDirectiveOutputs: null,
        directiveToIndex: null,
        tView: null,
        next: null,
        prev: null,
        projectionNext: null,
        child: null,
        parent: t,
        projection: null,
        styles: null,
        stylesWithoutHost: null,
        residualStyles: void 0,
        classes: null,
        classesWithoutHost: null,
        residualClasses: void 0,
        classBindings: 0,
        styleBindings: 0
    }
}
function kI(e) {
    let t = e[hu] ?? []
      , r = e[te][G]
      , o = [];
    for (let i of t)
        i.data[ug] !== void 0 ? o.push(i) : PI(i, r);
    e[hu] = o
}
function PI(e, t) {
    let n = 0
      , r = e.firstChild;
    if (r) {
        let o = e.data[cg];
        for (; n < o; ) {
            let i = r.nextSibling;
            wg(t, r, !1),
            r = i,
            n++
        }
    }
}
var LI = () => null
  , jI = () => null;
function Fs(e, t) {
    return LI(e, t)
}
function im(e, t, n) {
    return jI(e, t, n)
}
var sm = class {
}
  , ta = class {
}
  , ml = class {
    resolveComponentFactory(t) {
        throw new y(917,!1)
    }
}
  , Lo = class {
    static NULL = new ml
}
  , xn = class {
}
  , St = ( () => {
    class e {
        destroyNode = null;
        static __NG_ELEMENT_ID__ = () => VI()
    }
    return e
}
)();
function VI() {
    let e = N()
      , t = Ee()
      , n = ke(t.index, e);
    return (st(n) ? n : e)[G]
}
var am = ( () => {
    class e {
        static \u0275prov = D({
            token: e,
            providedIn: "root",
            factory: () => null
        })
    }
    return e
}
)();
var bs = {}
  , yl = class {
    injector;
    parentInjector;
    constructor(t, n) {
        this.injector = t,
        this.parentInjector = n
    }
    get(t, n, r) {
        let o = this.injector.get(t, bs, r);
        return o !== bs || n === bs ? o : this.parentInjector.get(t, n, r)
    }
}
;
function ks(e, t, n) {
    let r = n ? e.styles : null
      , o = n ? e.classes : null
      , i = 0;
    if (t !== null)
        for (let s = 0; s < t.length; s++) {
            let a = t[s];
            if (typeof a == "number")
                i = a;
            else if (i == 1)
                o = qc(o, a);
            else if (i == 2) {
                let c = a
                  , u = t[++s];
                r = qc(r, c + ": " + u + ";")
            }
        }
    n ? e.styles = r : e.stylesWithoutHost = r,
    n ? e.classes = o : e.classesWithoutHost = o
}
function U(e, t=0) {
    let n = N();
    if (n === null)
        return I(e, t);
    let r = Ee();
    return Xp(r, n, ue(e), t)
}
function nd() {
    let e = "invalid";
    throw new Error(e)
}
function BI(e, t, n, r, o) {
    let i = r === null ? null : {
        "": -1
    }
      , s = o(e, n);
    if (s !== null) {
        let a = s
          , c = null
          , u = null;
        for (let l of s)
            if (l.resolveHostDirectives !== null) {
                [a,c,u] = l.resolveHostDirectives(s);
                break
            }
        $I(e, t, n, a, i, c, u)
    }
    i !== null && r !== null && UI(n, r, i)
}
function UI(e, t, n) {
    let r = e.localNames = [];
    for (let o = 0; o < t.length; o += 2) {
        let i = n[t[o + 1]];
        if (i == null)
            throw new y(-301,!1);
        r.push(t[o], i)
    }
}
function HI(e, t, n) {
    t.componentOffset = n,
    (e.components ??= []).push(t.index)
}
function $I(e, t, n, r, o, i, s) {
    let a = r.length
      , c = null;
    for (let h = 0; h < a; h++) {
        let f = r[h];
        c === null && at(f) && (c = f,
        HI(e, n, h)),
        el(Ns(n, t), e, f.type)
    }
    YI(n, e.data.length, a),
    c?.viewProvidersResolver && c.viewProvidersResolver(c);
    for (let h = 0; h < a; h++) {
        let f = r[h];
        f.providersResolver && f.providersResolver(f)
    }
    let u = !1
      , l = !1
      , d = Ng(e, t, a, null);
    a > 0 && (n.directiveToIndex = new Map);
    for (let h = 0; h < a; h++) {
        let f = r[h];
        if (n.mergedAttrs = Er(n.mergedAttrs, f.hostAttrs),
        GI(e, n, t, d, f),
        ZI(d, f, o),
        s !== null && s.has(f)) {
            let[w,E] = s.get(f);
            n.directiveToIndex.set(f.type, [d, w + n.directiveStart, E + n.directiveStart])
        } else
            (i === null || !i.has(f)) && n.directiveToIndex.set(f.type, d);
        f.contentQueries !== null && (n.flags |= 4),
        (f.hostBindings !== null || f.hostAttrs !== null || f.hostVars !== 0) && (n.flags |= 64);
        let m = f.type.prototype;
        !u && (m.ngOnChanges || m.ngOnInit || m.ngDoCheck) && ((e.preOrderHooks ??= []).push(n.index),
        u = !0),
        !l && (m.ngOnChanges || m.ngDoCheck) && ((e.preOrderCheckHooks ??= []).push(n.index),
        l = !0),
        d++
    }
    zI(e, n, i)
}
function zI(e, t, n) {
    for (let r = t.directiveStart; r < t.directiveEnd; r++) {
        let o = e.data[r];
        if (n === null || !n.has(o))
            Tp(0, t, o, r),
            Tp(1, t, o, r),
            Ap(t, r, !1);
        else {
            let i = n.get(o);
            Sp(0, t, i, r),
            Sp(1, t, i, r),
            Ap(t, r, !0)
        }
    }
}
function Tp(e, t, n, r) {
    let o = e === 0 ? n.inputs : n.outputs;
    for (let i in o)
        if (o.hasOwnProperty(i)) {
            let s;
            e === 0 ? s = t.inputs ??= {} : s = t.outputs ??= {},
            s[i] ??= [],
            s[i].push(r),
            cm(t, i)
        }
}
function Sp(e, t, n, r) {
    let o = e === 0 ? n.inputs : n.outputs;
    for (let i in o)
        if (o.hasOwnProperty(i)) {
            let s = o[i], a;
            e === 0 ? a = t.hostDirectiveInputs ??= {} : a = t.hostDirectiveOutputs ??= {},
            a[s] ??= [],
            a[s].push(r, i),
            cm(t, s)
        }
}
function cm(e, t) {
    t === "class" ? e.flags |= 8 : t === "style" && (e.flags |= 16)
}
function Ap(e, t, n) {
    let {attrs: r, inputs: o, hostDirectiveInputs: i} = e;
    if (r === null || !n && o === null || n && i === null || Hl(e)) {
        e.initialInputs ??= [],
        e.initialInputs.push(null);
        return
    }
    let s = null
      , a = 0;
    for (; a < r.length; ) {
        let c = r[a];
        if (c === 0) {
            a += 4;
            continue
        } else if (c === 5) {
            a += 2;
            continue
        } else if (typeof c == "number")
            break;
        if (!n && o.hasOwnProperty(c)) {
            let u = o[c];
            for (let l of u)
                if (l === t) {
                    s ??= [],
                    s.push(c, r[a + 1]);
                    break
                }
        } else if (n && i.hasOwnProperty(c)) {
            let u = i[c];
            for (let l = 0; l < u.length; l += 2)
                if (u[l] === t) {
                    s ??= [],
                    s.push(u[l + 1], r[a + 1]);
                    break
                }
        }
        a += 2
    }
    e.initialInputs ??= [],
    e.initialInputs.push(s)
}
function GI(e, t, n, r, o) {
    e.data[r] = o;
    let i = o.factory || (o.factory = Lt(o.type, !0))
      , s = new Nn(i,at(o),U,null);
    e.blueprint[r] = s,
    n[r] = s,
    WI(e, t, r, Ng(e, n, o.hostVars, lt), o)
}
function WI(e, t, n, r, o) {
    let i = o.hostBindings;
    if (i) {
        let s = e.hostBindingOpCodes;
        s === null && (s = e.hostBindingOpCodes = []);
        let a = ~t.index;
        qI(s) != a && s.push(a),
        s.push(n, r, i)
    }
}
function qI(e) {
    let t = e.length;
    for (; t > 0; ) {
        let n = e[--t];
        if (typeof n == "number" && n < 0)
            return n
    }
    return 0
}
function ZI(e, t, n) {
    if (n) {
        if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++)
                n[t.exportAs[r]] = e;
        at(t) && (n[""] = e)
    }
}
function YI(e, t, n) {
    e.flags |= 1,
    e.directiveStart = t,
    e.directiveEnd = t + n,
    e.providerIndexes = t
}
function um(e, t, n, r, o, i, s, a) {
    let c = t[M]
      , u = c.consts
      , l = ct(u, s)
      , d = Po(c, e, n, r, l);
    return i && BI(c, t, d, ct(u, a), o),
    d.mergedAttrs = Er(d.mergedAttrs, d.attrs),
    d.attrs !== null && ks(d, d.attrs, !1),
    d.mergedAttrs !== null && ks(d, d.mergedAttrs, !0),
    c.queries !== null && c.queries.elementStart(c, d),
    d
}
function lm(e, t) {
    ME(e, t),
    pu(t) && e.queries.elementEnd(t)
}
function QI(e, t, n, r, o, i) {
    let s = t.consts
      , a = ct(s, o)
      , c = Po(t, e, n, r, a);
    if (c.mergedAttrs = Er(c.mergedAttrs, c.attrs),
    i != null) {
        let u = ct(s, i);
        c.localNames = [];
        for (let l = 0; l < u.length; l += 2)
            c.localNames.push(u[l], -1)
    }
    return c.attrs !== null && ks(c, c.attrs, !1),
    c.mergedAttrs !== null && ks(c, c.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, c),
    c
}
function rd(e) {
    return e !== null && (typeof e == "function" || typeof e == "object")
}
function KI(e, t, n) {
    return e[t] = n
}
function Qt(e, t, n) {
    if (n === lt)
        return !1;
    let r = e[t];
    return Object.is(r, n) ? !1 : (e[t] = n,
    !0)
}
function Gu(e, t, n) {
    return function r(o) {
        let i = Gt(e) ? ke(e.index, t) : t;
        ed(i, 5);
        let s = t[Q]
          , a = Np(t, s, n, o)
          , c = r.__ngNextListenerFn__;
        for (; c; )
            a = Np(t, s, c, o) && a,
            c = c.__ngNextListenerFn__;
        return a
    }
}
function Np(e, t, n, r) {
    let o = _(null);
    try {
        return B(F.OutputStart, t, n),
        n(r) !== !1
    } catch (i) {
        return pI(e, i),
        !1
    } finally {
        B(F.OutputEnd, t, n),
        _(o)
    }
}
function JI(e, t, n, r, o, i, s, a) {
    let c = as(e)
      , u = !1
      , l = null;
    if (!r && c && (l = ew(t, n, i, e.index)),
    l !== null) {
        let d = l.__ngLastListenerFn__ || l;
        d.__ngNextListenerFn__ = s,
        l.__ngLastListenerFn__ = s,
        u = !0
    } else {
        let d = $e(e, n)
          , h = r ? r(d) : d;
        YE(n, h, i, a);
        let f = o.listen(h, i, a);
        if (!XI(i)) {
            let m = r ? w => r(Fe(w[e.index])) : e.index;
            dm(m, t, n, i, a, f, !1)
        }
    }
    return u
}
function XI(e) {
    return e.startsWith("animation") || e.startsWith("transition")
}
function ew(e, t, n, r) {
    let o = e.cleanup;
    if (o != null)
        for (let i = 0; i < o.length - 1; i += 2) {
            let s = o[i];
            if (s === n && o[i + 1] === r) {
                let a = t[pr]
                  , c = o[i + 2];
                return a && a.length > c ? a[c] : null
            }
            typeof s == "string" && (i += 2)
        }
    return null
}
function dm(e, t, n, r, o, i, s) {
    let a = t.firstCreatePass ? wu(t) : null
      , c = Iu(n)
      , u = c.length;
    c.push(o, i),
    a && a.push(r, e, u, (u + 1) * (s ? -1 : 1))
}
function Rp(e, t, n, r, o, i) {
    let s = t[n]
      , a = t[M]
      , u = a.data[n].outputs[r]
      , d = s[u].subscribe(i);
    dm(e.index, a, t, o, i, d, !0)
}
var vl = Symbol("BINDING");
var Ps = class extends Lo {
    ngModule;
    constructor(t) {
        super(),
        this.ngModule = t
    }
    resolveComponentFactory(t) {
        let n = Dt(t);
        return new On(n,this.ngModule)
    }
}
;
function tw(e) {
    return Object.keys(e).map(t => {
        let[n,r,o] = e[t]
          , i = {
            propName: n,
            templateName: t,
            isSignal: (r & Ks.SignalBased) !== 0
        };
        return o && (i.transform = o),
        i
    }
    )
}
function nw(e) {
    return Object.keys(e).map(t => ({
        propName: e[t],
        templateName: t
    }))
}
function rw(e, t, n) {
    let r = t instanceof H ? t : t?.injector;
    return r && e.getStandaloneInjector !== null && (r = e.getStandaloneInjector(r) || r),
    r ? new yl(n,r) : n
}
function ow(e) {
    let t = e.get(xn, null);
    if (t === null)
        throw new y(407,!1);
    let n = e.get(am, null)
      , r = e.get(vt, null);
    return {
        rendererFactory: t,
        sanitizer: n,
        changeDetectionScheduler: r,
        ngReflect: !1
    }
}
function iw(e, t) {
    let n = fm(e);
    return Cg(t, n, n === "svg" ? gu : n === "math" ? Nh : null)
}
function fm(e) {
    return (e.selectors[0][0] || "div").toLowerCase()
}
var On = class extends ta {
    componentDef;
    ngModule;
    selector;
    componentType;
    ngContentSelectors;
    isBoundToModule;
    cachedInputs = null;
    cachedOutputs = null;
    get inputs() {
        return this.cachedInputs ??= tw(this.componentDef.inputs),
        this.cachedInputs
    }
    get outputs() {
        return this.cachedOutputs ??= nw(this.componentDef.outputs),
        this.cachedOutputs
    }
    constructor(t, n) {
        super(),
        this.componentDef = t,
        this.ngModule = n,
        this.componentType = t.type,
        this.selector = xC(t.selectors),
        this.ngContentSelectors = t.ngContentSelectors ?? [],
        this.isBoundToModule = !!n
    }
    create(t, n, r, o, i, s) {
        B(F.DynamicComponentStart);
        let a = _(null);
        try {
            let c = this.componentDef
              , u = sw(r, c, s, i)
              , l = rw(c, o || this.ngModule, t)
              , d = ow(l)
              , h = d.rendererFactory.createRenderer(null, c)
              , f = r ? tI(h, r, c.encapsulation, l) : iw(c, h)
              , m = s?.some(xp) || i?.some(C => typeof C != "function" && C.bindings.some(xp))
              , w = zl(null, u, null, 512 | Ag(c), null, null, d, h, l, null, fg(f, l, !0));
            w[Z] = f,
            fs(w);
            let E = null;
            try {
                let C = um(Z, w, 2, "#host", () => u.directiveRegistry, !0, 0);
                _g(h, f, C),
                Cr(f, w),
                Hg(u, w, C),
                pg(u, C, w),
                lm(u, C),
                n !== void 0 && cw(C, this.ngContentSelectors, n),
                E = ke(C.index, w),
                w[Q] = E[Q],
                Xl(u, w, null)
            } catch (C) {
                throw E !== null && nl(E),
                nl(w),
                C
            } finally {
                B(F.DynamicComponentEnd),
                hs()
            }
            return new Ls(this.componentType,w,!!m)
        } finally {
            _(a)
        }
    }
}
;
function sw(e, t, n, r) {
    let o = e ? ["ng-version", "21.1.0"] : OC(t.selectors[0])
      , i = null
      , s = null
      , a = 0;
    if (n)
        for (let l of n)
            a += l[vl].requiredVars,
            l.create && (l.targetIdx = 0,
            (i ??= []).push(l)),
            l.update && (l.targetIdx = 0,
            (s ??= []).push(l));
    if (r)
        for (let l = 0; l < r.length; l++) {
            let d = r[l];
            if (typeof d != "function")
                for (let h of d.bindings) {
                    a += h[vl].requiredVars;
                    let f = l + 1;
                    h.create && (h.targetIdx = f,
                    (i ??= []).push(h)),
                    h.update && (h.targetIdx = f,
                    (s ??= []).push(h))
                }
        }
    let c = [t];
    if (r)
        for (let l of r) {
            let d = typeof l == "function" ? l : l.type
              , h = nu(d);
            c.push(h)
        }
    return $l(0, null, aw(i, s), 1, a, c, null, null, null, [o], null)
}
function aw(e, t) {
    return !e && !t ? null : n => {
        if (n & 1 && e)
            for (let r of e)
                r.create();
        if (n & 2 && t)
            for (let r of t)
                r.update()
    }
}
function xp(e) {
    let t = e[vl].kind;
    return t === "input" || t === "twoWay"
}
var Ls = class extends sm {
    _rootLView;
    _hasInputBindings;
    instance;
    hostView;
    changeDetectorRef;
    componentType;
    location;
    previousInputValues = null;
    _tNode;
    constructor(t, n, r) {
        super(),
        this._rootLView = n,
        this._hasInputBindings = r,
        this._tNode = mo(n[M], Z),
        this.location = br(this._tNode, n),
        this.instance = ke(this._tNode.index, n)[Q],
        this.hostView = this.changeDetectorRef = new Zt(n,void 0),
        this.componentType = t
    }
    setInput(t, n) {
        this._hasInputBindings;
        let r = this._tNode;
        if (this.previousInputValues ??= new Map,
        this.previousInputValues.has(t) && Object.is(this.previousInputValues.get(t), n))
            return;
        let o = this._rootLView
          , i = Jl(r, o[M], o, t, n);
        this.previousInputValues.set(t, n);
        let s = ke(r.index, o);
        ed(s, 1)
    }
    get injector() {
        return new An(this._tNode,this._rootLView)
    }
    destroy() {
        this.hostView.destroy()
    }
    onDestroy(t) {
        this.hostView.onDestroy(t)
    }
}
;
function cw(e, t, n) {
    let r = e.projection = [];
    for (let o = 0; o < t.length; o++) {
        let i = n[o];
        r.push(i != null && i.length ? Array.from(i) : null)
    }
}
var Ln = ( () => {
    class e {
        static __NG_ELEMENT_ID__ = uw
    }
    return e
}
)();
function uw() {
    let e = Ee();
    return pm(e, N())
}
var lw = Ln
  , hm = class extends lw {
    _lContainer;
    _hostTNode;
    _hostLView;
    constructor(t, n, r) {
        super(),
        this._lContainer = t,
        this._hostTNode = n,
        this._hostLView = r
    }
    get element() {
        return br(this._hostTNode, this._hostLView)
    }
    get injector() {
        return new An(this._hostTNode,this._hostLView)
    }
    get parentInjector() {
        let t = Fl(this._hostTNode, this._hostLView);
        if (qp(t)) {
            let n = Ss(t, this._hostLView)
              , r = Ts(t)
              , o = n[M].data[r + 8];
            return new An(o,n)
        } else
            return new An(null,this._hostLView)
    }
    clear() {
        for (; this.length > 0; )
            this.remove(this.length - 1)
    }
    get(t) {
        let n = Op(this._lContainer);
        return n !== null && n[t] || null
    }
    get length() {
        return this._lContainer.length - Y
    }
    createEmbeddedView(t, n, r) {
        let o, i;
        typeof r == "number" ? o = r : r != null && (o = r.index,
        i = r.injector);
        let s = Fs(this._lContainer, t.ssrId)
          , a = t.createEmbeddedViewImpl(n || {}, i, s);
        return this.insertImpl(a, o, Ir(this._hostTNode, s)),
        a
    }
    createComponent(t, n, r, o, i, s, a) {
        let c = t && !CE(t), u;
        if (c)
            u = n;
        else {
            let E = n || {};
            u = E.index,
            r = E.injector,
            o = E.projectableNodes,
            i = E.environmentInjector || E.ngModuleRef,
            s = E.directives,
            a = E.bindings
        }
        let l = c ? t : new On(Dt(t))
          , d = r || this.parentInjector;
        if (!i && l.ngModule == null) {
            let C = (c ? d : this.parentInjector).get(H, null);
            C && (i = C)
        }
        let h = Dt(l.componentType ?? {})
          , f = Fs(this._lContainer, h?.id ?? null)
          , m = f?.firstChild ?? null
          , w = l.create(d, o, m, i, s, a);
        return this.insertImpl(w.hostView, u, Ir(this._hostTNode, f)),
        w
    }
    insert(t, n) {
        return this.insertImpl(t, n, !0)
    }
    insertImpl(t, n, r) {
        let o = t._lView;
        if (xh(o)) {
            let a = this.indexOf(t);
            if (a !== -1)
                this.detach(a);
            else {
                let c = o[te]
                  , u = new hm(c,c[ge],c[te]);
                u.detach(u.indexOf(t))
            }
        }
        let i = this._adjustIndex(n)
          , s = this._lContainer;
        return ko(s, o, i, r),
        t.attachToViewContainerRef(),
        iu(Wu(s), i, t),
        t
    }
    move(t, n) {
        return this.insert(t, n)
    }
    indexOf(t) {
        let n = Op(this._lContainer);
        return n !== null ? n.indexOf(t) : -1
    }
    remove(t) {
        let n = this._adjustIndex(t, -1)
          , r = bo(this._lContainer, n);
        r && (fo(Wu(this._lContainer), n),
        Xs(r[M], r))
    }
    detach(t) {
        let n = this._adjustIndex(t, -1)
          , r = bo(this._lContainer, n);
        return r && fo(Wu(this._lContainer), n) != null ? new Zt(r) : null
    }
    _adjustIndex(t, n=0) {
        return t ?? this.length + n
    }
}
;
function Op(e) {
    return e[go]
}
function Wu(e) {
    return e[go] || (e[go] = [])
}
function pm(e, t) {
    let n, r = t[e.index];
    return He(r) ? n = r : (n = tm(r, t, null, e),
    t[e.index] = n,
    Gl(t, n)),
    fw(n, t, e, r),
    new hm(n,e,t)
}
function dw(e, t) {
    let n = e[G]
      , r = n.createComment("")
      , o = $e(t, e)
      , i = n.parentNode(o);
    return xs(n, i, r, n.nextSibling(o), !1),
    r
}
var fw = gw
  , hw = () => !1;
function pw(e, t, n) {
    return hw(e, t, n)
}
function gw(e, t, n, r) {
    if (e[zt])
        return;
    let o;
    n.type & 8 ? o = Fe(r) : o = dw(t, n),
    e[zt] = o
}
var Dl = class e {
    queryList;
    matches = null;
    constructor(t) {
        this.queryList = t
    }
    clone() {
        return new e(this.queryList)
    }
    setDirty() {
        this.queryList.setDirty()
    }
}
  , El = class e {
    queries;
    constructor(t=[]) {
        this.queries = t
    }
    createEmbeddedView(t) {
        let n = t.queries;
        if (n !== null) {
            let r = t.contentQueries !== null ? t.contentQueries[0] : n.length
              , o = [];
            for (let i = 0; i < r; i++) {
                let s = n.getByIndex(i)
                  , a = this.queries[s.indexInDeclarationView];
                o.push(a.clone())
            }
            return new e(o)
        }
        return null
    }
    insertView(t) {
        this.dirtyQueriesWithMatches(t)
    }
    detachView(t) {
        this.dirtyQueriesWithMatches(t)
    }
    finishViewCreation(t) {
        this.dirtyQueriesWithMatches(t)
    }
    dirtyQueriesWithMatches(t) {
        for (let n = 0; n < this.queries.length; n++)
            od(t, n).matches !== null && this.queries[n].setDirty()
    }
}
  , Cl = class {
    flags;
    read;
    predicate;
    constructor(t, n, r=null) {
        this.flags = n,
        this.read = r,
        typeof t == "string" ? this.predicate = ww(t) : this.predicate = t
    }
}
  , Il = class e {
    queries;
    constructor(t=[]) {
        this.queries = t
    }
    elementStart(t, n) {
        for (let r = 0; r < this.queries.length; r++)
            this.queries[r].elementStart(t, n)
    }
    elementEnd(t) {
        for (let n = 0; n < this.queries.length; n++)
            this.queries[n].elementEnd(t)
    }
    embeddedTView(t) {
        let n = null;
        for (let r = 0; r < this.length; r++) {
            let o = n !== null ? n.length : 0
              , i = this.getByIndex(r).embeddedTView(t, o);
            i && (i.indexInDeclarationView = r,
            n !== null ? n.push(i) : n = [i])
        }
        return n !== null ? new e(n) : null
    }
    template(t, n) {
        for (let r = 0; r < this.queries.length; r++)
            this.queries[r].template(t, n)
    }
    getByIndex(t) {
        return this.queries[t]
    }
    get length() {
        return this.queries.length
    }
    track(t) {
        this.queries.push(t)
    }
}
  , wl = class e {
    metadata;
    matches = null;
    indexInDeclarationView = -1;
    crossesNgTemplate = !1;
    _declarationNodeIndex;
    _appliesToNextNode = !0;
    constructor(t, n=-1) {
        this.metadata = t,
        this._declarationNodeIndex = n
    }
    elementStart(t, n) {
        this.isApplyingToNode(n) && this.matchTNode(t, n)
    }
    elementEnd(t) {
        this._declarationNodeIndex === t.index && (this._appliesToNextNode = !1)
    }
    template(t, n) {
        this.elementStart(t, n)
    }
    embeddedTView(t, n) {
        return this.isApplyingToNode(t) ? (this.crossesNgTemplate = !0,
        this.addMatch(-t.index, n),
        new e(this.metadata)) : null
    }
    isApplyingToNode(t) {
        if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
            let n = this._declarationNodeIndex
              , r = t.parent;
            for (; r !== null && r.type & 8 && r.index !== n; )
                r = r.parent;
            return n === (r !== null ? r.index : -1)
        }
        return this._appliesToNextNode
    }
    matchTNode(t, n) {
        let r = this.metadata.predicate;
        if (Array.isArray(r))
            for (let o = 0; o < r.length; o++) {
                let i = r[o];
                this.matchTNodeWithReadOption(t, n, mw(n, i)),
                this.matchTNodeWithReadOption(t, n, _s(n, t, i, !1, !1))
            }
        else
            r === wr ? n.type & 4 && this.matchTNodeWithReadOption(t, n, -1) : this.matchTNodeWithReadOption(t, n, _s(n, t, r, !1, !1))
    }
    matchTNodeWithReadOption(t, n, r) {
        if (r !== null) {
            let o = this.metadata.read;
            if (o !== null)
                if (o === Me || o === Ln || o === wr && n.type & 4)
                    this.addMatch(n.index, -2);
                else {
                    let i = _s(n, t, o, !1, !1);
                    i !== null && this.addMatch(n.index, i)
                }
            else
                this.addMatch(n.index, r)
        }
    }
    addMatch(t, n) {
        this.matches === null ? this.matches = [t, n] : this.matches.push(t, n)
    }
}
;
function mw(e, t) {
    let n = e.localNames;
    if (n !== null) {
        for (let r = 0; r < n.length; r += 2)
            if (n[r] === t)
                return n[r + 1]
    }
    return null
}
function yw(e, t) {
    return e.type & 11 ? br(e, t) : e.type & 4 ? td(e, t) : null
}
function vw(e, t, n, r) {
    return n === -1 ? yw(t, e) : n === -2 ? Dw(e, t, r) : wo(e, e[M], n, t)
}
function Dw(e, t, n) {
    if (n === Me)
        return br(t, e);
    if (n === wr)
        return td(t, e);
    if (n === Ln)
        return pm(t, e)
}
function gm(e, t, n, r) {
    let o = t[it].queries[r];
    if (o.matches === null) {
        let i = e.data
          , s = n.matches
          , a = [];
        for (let c = 0; s !== null && c < s.length; c += 2) {
            let u = s[c];
            if (u < 0)
                a.push(null);
            else {
                let l = i[u];
                a.push(vw(t, l, s[c + 1], n.metadata.read))
            }
        }
        o.matches = a
    }
    return o.matches
}
function _l(e, t, n, r) {
    let o = e.queries.getByIndex(n)
      , i = o.matches;
    if (i !== null) {
        let s = gm(e, t, o, n);
        for (let a = 0; a < i.length; a += 2) {
            let c = i[a];
            if (c > 0)
                r.push(s[a / 2]);
            else {
                let u = i[a + 1]
                  , l = t[-c];
                for (let d = Y; d < l.length; d++) {
                    let h = l[d];
                    h[$t] === h[te] && _l(h[M], h, u, r)
                }
                if (l[bn] !== null) {
                    let d = l[bn];
                    for (let h = 0; h < d.length; h++) {
                        let f = d[h];
                        _l(f[M], f, u, r)
                    }
                }
            }
        }
    }
    return r
}
function Ew(e, t) {
    return e[it].queries[t].queryList
}
function Cw(e, t, n) {
    let r = new Rs((n & 4) === 4);
    return kh(e, t, r, r.destroy),
    (t[it] ??= new El).queries.push(new Dl(r)) - 1
}
function Iw(e, t, n) {
    let r = se();
    return r.firstCreatePass && (_w(r, new Cl(e,t,n), -1),
    (t & 2) === 2 && (r.staticViewQueries = !0)),
    Cw(r, N(), t)
}
function ww(e) {
    return e.split(",").map(t => t.trim())
}
function _w(e, t, n) {
    e.queries === null && (e.queries = new Il),
    e.queries.track(new wl(t,n))
}
function od(e, t) {
    return e.queries.getByIndex(t)
}
function bw(e, t) {
    let n = e[M]
      , r = od(n, t);
    return r.crossesNgTemplate ? _l(n, e, t, []) : gm(n, e, r, t)
}
var Fn = class {
}
  , na = class {
}
;
var js = class extends Fn {
    ngModuleType;
    _parent;
    _bootstrapComponents = [];
    _r3Injector;
    instance;
    destroyCbs = [];
    componentFactoryResolver = new Ps(this);
    constructor(t, n, r, o=!0) {
        super(),
        this.ngModuleType = t,
        this._parent = n;
        let i = tu(t);
        this._bootstrapComponents = Mg(i.bootstrap),
        this._r3Injector = Pu(t, n, [{
            provide: Fn,
            useValue: this
        }, {
            provide: Lo,
            useValue: this.componentFactoryResolver
        }, ...r], yt(t), new Set(["environment"])),
        o && this.resolveInjectorInitializers()
    }
    resolveInjectorInitializers() {
        this._r3Injector.resolveInjectorInitializers(),
        this.instance = this._r3Injector.get(this.ngModuleType)
    }
    get injector() {
        return this._r3Injector
    }
    destroy() {
        let t = this._r3Injector;
        !t.destroyed && t.destroy(),
        this.destroyCbs.forEach(n => n()),
        this.destroyCbs = null
    }
    onDestroy(t) {
        this.destroyCbs.push(t)
    }
}
  , Vs = class extends na {
    moduleType;
    constructor(t) {
        super(),
        this.moduleType = t
    }
    create(t) {
        return new js(this.moduleType,t,[])
    }
}
;
var Mo = class extends Fn {
    injector;
    componentFactoryResolver = new Ps(this);
    instance = null;
    constructor(t) {
        super();
        let n = new yn([...t.providers, {
            provide: Fn,
            useValue: this
        }, {
            provide: Lo,
            useValue: this.componentFactoryResolver
        }],t.parent || po(),t.debugName,new Set(["environment"]));
        this.injector = n,
        t.runEnvironmentInitializers && n.resolveInjectorInitializers()
    }
    destroy() {
        this.injector.destroy()
    }
    onDestroy(t) {
        this.injector.onDestroy(t)
    }
}
;
function Mr(e, t, n=null) {
    return new Mo({
        providers: e,
        parent: t,
        debugName: n,
        runEnvironmentInitializers: !0
    }).injector
}
var Mw = ( () => {
    class e {
        _injector;
        cachedInjectors = new Map;
        constructor(n) {
            this._injector = n
        }
        getOrCreateStandaloneInjector(n) {
            if (!n.standalone)
                return null;
            if (!this.cachedInjectors.has(n)) {
                let r = cu(!1, n.type)
                  , o = r.length > 0 ? Mr([r], this._injector, "") : null;
                this.cachedInjectors.set(n, o)
            }
            return this.cachedInjectors.get(n)
        }
        ngOnDestroy() {
            try {
                for (let n of this.cachedInjectors.values())
                    n !== null && n.destroy()
            } finally {
                this.cachedInjectors.clear()
            }
        }
        static \u0275prov = D({
            token: e,
            providedIn: "environment",
            factory: () => new e(I(H))
        })
    }
    return e
}
)();
function id(e) {
    return Ao( () => {
        let t = mm(e)
          , n = R(g({}, t), {
            decls: e.decls,
            vars: e.vars,
            template: e.template,
            consts: e.consts || null,
            ngContentSelectors: e.ngContentSelectors,
            onPush: e.changeDetection === kl.OnPush,
            directiveDefs: null,
            pipeDefs: null,
            dependencies: t.standalone && e.dependencies || null,
            getStandaloneInjector: t.standalone ? o => o.get(Mw).getOrCreateStandaloneInjector(n) : null,
            getExternalStyles: null,
            signals: e.signals ?? !1,
            data: e.data || {},
            encapsulation: e.encapsulation || qe.Emulated,
            styles: e.styles || we,
            _: null,
            schemas: e.schemas || null,
            tView: null,
            id: ""
        });
        t.standalone && Ke("NgStandalone"),
        ym(n);
        let r = e.dependencies;
        return n.directiveDefs = Fp(r, Tw),
        n.pipeDefs = Fp(r, ph),
        n.id = Nw(n),
        n
    }
    )
}
function Tw(e) {
    return Dt(e) || nu(e)
}
function Pe(e) {
    return Ao( () => ({
        type: e.type,
        bootstrap: e.bootstrap || we,
        declarations: e.declarations || we,
        imports: e.imports || we,
        exports: e.exports || we,
        transitiveCompileScopes: null,
        schemas: e.schemas || null,
        id: e.id || null
    }))
}
function Sw(e, t) {
    if (e == null)
        return Ht;
    let n = {};
    for (let r in e)
        if (e.hasOwnProperty(r)) {
            let o = e[r], i, s, a, c;
            Array.isArray(o) ? (a = o[0],
            i = o[1],
            s = o[2] ?? i,
            c = o[3] || null) : (i = o,
            s = o,
            a = Ks.None,
            c = null),
            n[i] = [r, a, c],
            t[i] = s
        }
    return n
}
function Aw(e) {
    if (e == null)
        return Ht;
    let t = {};
    for (let n in e)
        e.hasOwnProperty(n) && (t[e[n]] = n);
    return t
}
function ye(e) {
    return Ao( () => {
        let t = mm(e);
        return ym(t),
        t
    }
    )
}
function sd(e) {
    return {
        type: e.type,
        name: e.name,
        factory: null,
        pure: e.pure !== !1,
        standalone: e.standalone ?? !0,
        onDestroy: e.type.prototype.ngOnDestroy || null
    }
}
function mm(e) {
    let t = {};
    return {
        type: e.type,
        providersResolver: null,
        viewProvidersResolver: null,
        factory: null,
        hostBindings: e.hostBindings || null,
        hostVars: e.hostVars || 0,
        hostAttrs: e.hostAttrs || null,
        contentQueries: e.contentQueries || null,
        declaredInputs: t,
        inputConfig: e.inputs || Ht,
        exportAs: e.exportAs || null,
        standalone: e.standalone ?? !0,
        signals: e.signals === !0,
        selectors: e.selectors || we,
        viewQuery: e.viewQuery || null,
        features: e.features || null,
        setInput: null,
        resolveHostDirectives: null,
        hostDirectives: null,
        inputs: Sw(e.inputs, t),
        outputs: Aw(e.outputs),
        debugInfo: null
    }
}
function ym(e) {
    e.features?.forEach(t => t(e))
}
function Fp(e, t) {
    return e ? () => {
        let n = typeof e == "function" ? e() : e
          , r = [];
        for (let o of n) {
            let i = t(o);
            i !== null && r.push(i)
        }
        return r
    }
    : null
}
function Nw(e) {
    let t = 0
      , n = typeof e.consts == "function" ? "" : e.consts
      , r = [e.selectors, e.ngContentSelectors, e.hostVars, e.hostAttrs, n, e.vars, e.decls, e.encapsulation, e.standalone, e.signals, e.exportAs, JSON.stringify(e.inputs), JSON.stringify(e.outputs), Object.getOwnPropertyNames(e.type.prototype), !!e.contentQueries, !!e.viewQuery];
    for (let i of r.join("|"))
        t = Math.imul(31, t) + i.charCodeAt(0) << 0;
    return t += 2147483648,
    "c" + t
}
function Rw(e) {
    return Object.getPrototypeOf(e.prototype).constructor
}
function Kt(e) {
    let t = Rw(e.type)
      , n = !0
      , r = [e];
    for (; t; ) {
        let o;
        if (at(e))
            o = t.\u0275cmp || t.\u0275dir;
        else {
            if (t.\u0275cmp)
                throw new y(903,!1);
            o = t.\u0275dir
        }
        if (o) {
            if (n) {
                r.push(o);
                let s = e;
                s.inputs = qu(e.inputs),
                s.declaredInputs = qu(e.declaredInputs),
                s.outputs = qu(e.outputs);
                let a = o.hostBindings;
                a && Pw(e, a);
                let c = o.viewQuery
                  , u = o.contentQueries;
                if (c && Fw(e, c),
                u && kw(e, u),
                xw(e, o),
                hh(e.outputs, o.outputs),
                at(o) && o.data.animation) {
                    let l = e.data;
                    l.animation = (l.animation || []).concat(o.data.animation)
                }
            }
            let i = o.features;
            if (i)
                for (let s = 0; s < i.length; s++) {
                    let a = i[s];
                    a && a.ngInherit && a(e),
                    a === Kt && (n = !1)
                }
        }
        t = Object.getPrototypeOf(t)
    }
    Ow(r)
}
function xw(e, t) {
    for (let n in t.inputs) {
        if (!t.inputs.hasOwnProperty(n) || e.inputs.hasOwnProperty(n))
            continue;
        let r = t.inputs[n];
        r !== void 0 && (e.inputs[n] = r,
        e.declaredInputs[n] = t.declaredInputs[n])
    }
}
function Ow(e) {
    let t = 0
      , n = null;
    for (let r = e.length - 1; r >= 0; r--) {
        let o = e[r];
        o.hostVars = t += o.hostVars,
        o.hostAttrs = Er(o.hostAttrs, n = Er(n, o.hostAttrs))
    }
}
function qu(e) {
    return e === Ht ? {} : e === we ? [] : e
}
function Fw(e, t) {
    let n = e.viewQuery;
    n ? e.viewQuery = (r, o) => {
        t(r, o),
        n(r, o)
    }
    : e.viewQuery = t
}
function kw(e, t) {
    let n = e.contentQueries;
    n ? e.contentQueries = (r, o, i) => {
        t(r, o, i),
        n(r, o, i)
    }
    : e.contentQueries = t
}
function Pw(e, t) {
    let n = e.hostBindings;
    n ? e.hostBindings = (r, o) => {
        t(r, o),
        n(r, o)
    }
    : e.hostBindings = t
}
function Lw(e, t, n, r, o, i, s, a) {
    if (n.firstCreatePass) {
        e.mergedAttrs = Er(e.mergedAttrs, e.attrs);
        let l = e.tView = $l(2, e, o, i, s, n.directiveRegistry, n.pipeRegistry, null, n.schemas, n.consts, null);
        n.queries !== null && (n.queries.template(n, e),
        l.queries = n.queries.embeddedTView(e))
    }
    a && (e.flags |= a),
    yr(e, !1);
    let c = jw(n, t, e, r);
    gs() && Yl(n, t, c, e),
    Cr(c, t);
    let u = tm(c, t, c, e);
    t[r + Z] = u,
    Gl(t, u),
    pw(u, e, t)
}
function To(e, t, n, r, o, i, s, a, c, u, l) {
    let d = n + Z, h;
    if (t.firstCreatePass) {
        if (h = Po(t, d, 4, s || null, a || null),
        u != null) {
            let f = ct(t.consts, u);
            h.localNames = [];
            for (let m = 0; m < f.length; m += 2)
                h.localNames.push(f[m], -1)
        }
    } else
        h = t.data[d];
    return Lw(h, e, t, n, r, o, i, c),
    u != null && Kl(e, h, l),
    h
}
var jw = Vw;
function Vw(e, t, n, r) {
    return ms(!0),
    t[G].createComment("")
}
var ra = ( () => {
    class e {
        log(n) {
            console.log(n)
        }
        warn(n) {
            console.warn(n)
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac,
            providedIn: "platform"
        })
    }
    return e
}
)();
var ad = new v("");
function Jt(e) {
    return !!e && typeof e.then == "function"
}
function cd(e) {
    return !!e && typeof e.subscribe == "function"
}
var ud = new v("");
function oa(e) {
    return Et([{
        provide: ud,
        multi: !0,
        useValue: e
    }])
}
var ld = ( () => {
    class e {
        resolve;
        reject;
        initialized = !1;
        done = !1;
        donePromise = new Promise( (n, r) => {
            this.resolve = n,
            this.reject = r
        }
        );
        appInits = p(ud, {
            optional: !0
        }) ?? [];
        injector = p(le);
        constructor() {}
        runInitializers() {
            if (this.initialized)
                return;
            let n = [];
            for (let o of this.appInits) {
                let i = ne(this.injector, o);
                if (Jt(i))
                    n.push(i);
                else if (cd(i)) {
                    let s = new Promise( (a, c) => {
                        i.subscribe({
                            complete: a,
                            error: c
                        })
                    }
                    );
                    n.push(s)
                }
            }
            let r = () => {
                this.done = !0,
                this.resolve()
            }
            ;
            Promise.all(n).then( () => {
                r()
            }
            ).catch(o => {
                this.reject(o)
            }
            ),
            n.length === 0 && r(),
            this.initialized = !0
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)()
  , jo = new v("");
function vm() {
    Ac( () => {
        let e = "";
        throw new y(600,e)
    }
    )
}
function Dm(e) {
    return e.isBoundToModule
}
var Bw = 10;
var Xt = ( () => {
    class e {
        _runningTick = !1;
        _destroyed = !1;
        _destroyListeners = [];
        _views = [];
        internalErrorHandler = p(ze);
        afterRenderManager = p(ql);
        zonelessEnabled = p(Do);
        rootEffectScheduler = p(ys);
        dirtyFlags = 0;
        tracingSnapshot = null;
        allTestViews = new Set;
        autoDetectTestViews = new Set;
        includeAllTestViews = !1;
        afterTick = new J;
        get allViews() {
            return [...(this.includeAllTestViews ? this.allTestViews : this.autoDetectTestViews).keys(), ...this._views]
        }
        get destroyed() {
            return this._destroyed
        }
        componentTypes = [];
        components = [];
        internalPendingTask = p(wt);
        get isStable() {
            return this.internalPendingTask.hasPendingTasksObservable.pipe(j(n => !n))
        }
        constructor() {
            p(Tt, {
                optional: !0
            })
        }
        whenStable() {
            let n;
            return new Promise(r => {
                n = this.isStable.subscribe({
                    next: o => {
                        o && r()
                    }
                })
            }
            ).finally( () => {
                n.unsubscribe()
            }
            )
        }
        _injector = p(H);
        _rendererFactory = null;
        get injector() {
            return this._injector
        }
        bootstrap(n, r) {
            return this.bootstrapImpl(n, r)
        }
        bootstrapImpl(n, r, o=le.NULL) {
            return this._injector.get(fe).run( () => {
                B(F.BootstrapComponentStart);
                let s = n instanceof ta;
                if (!this._injector.get(ld).done) {
                    let m = "";
                    throw new y(405,m)
                }
                let c;
                s ? c = n : c = this._injector.get(Lo).resolveComponentFactory(n),
                this.componentTypes.push(c.componentType);
                let u = Dm(c) ? void 0 : this._injector.get(Fn)
                  , l = r || c.selector
                  , d = c.create(o, [], l, u)
                  , h = d.location.nativeElement
                  , f = d.injector.get(ad, null);
                return f?.registerApplication(h),
                d.onDestroy( () => {
                    this.detachView(d.hostView),
                    Io(this.components, d),
                    f?.unregisterApplication(h)
                }
                ),
                this._loadComponent(d),
                B(F.BootstrapComponentEnd, d),
                d
            }
            )
        }
        tick() {
            this.zonelessEnabled || (this.dirtyFlags |= 1),
            this._tick()
        }
        _tick() {
            B(F.ChangeDetectionStart),
            this.tracingSnapshot !== null ? this.tracingSnapshot.run(Js.CHANGE_DETECTION, this.tickImpl) : this.tickImpl()
        }
        tickImpl = () => {
            if (this._runningTick)
                throw B(F.ChangeDetectionEnd),
                new y(101,!1);
            let n = _(null);
            try {
                this._runningTick = !0,
                this.synchronize()
            } finally {
                this._runningTick = !1,
                this.tracingSnapshot?.dispose(),
                this.tracingSnapshot = null,
                _(n),
                this.afterTick.next(),
                B(F.ChangeDetectionEnd)
            }
        }
        ;
        synchronize() {
            this._rendererFactory === null && !this._injector.destroyed && (this._rendererFactory = this._injector.get(xn, null, {
                optional: !0
            }));
            let n = 0;
            for (; this.dirtyFlags !== 0 && n++ < Bw; ) {
                B(F.ChangeDetectionSyncStart);
                try {
                    this.synchronizeOnce()
                } finally {
                    B(F.ChangeDetectionSyncEnd)
                }
            }
        }
        synchronizeOnce() {
            this.dirtyFlags & 16 && (this.dirtyFlags &= -17,
            this.rootEffectScheduler.flush());
            let n = !1;
            if (this.dirtyFlags & 7) {
                let r = !!(this.dirtyFlags & 1);
                this.dirtyFlags &= -8,
                this.dirtyFlags |= 8;
                for (let {_lView: o} of this.allViews) {
                    if (!r && !yo(o))
                        continue;
                    let i = r && !this.zonelessEnabled ? 0 : 1;
                    Kg(o, i),
                    n = !0
                }
                if (this.dirtyFlags &= -5,
                this.syncDirtyFlagsWithViews(),
                this.dirtyFlags & 23)
                    return
            }
            n || (this._rendererFactory?.begin?.(),
            this._rendererFactory?.end?.()),
            this.dirtyFlags & 8 && (this.dirtyFlags &= -9,
            this.afterRenderManager.execute()),
            this.syncDirtyFlagsWithViews()
        }
        syncDirtyFlagsWithViews() {
            if (this.allViews.some( ({_lView: n}) => yo(n))) {
                this.dirtyFlags |= 2;
                return
            } else
                this.dirtyFlags &= -8
        }
        attachView(n) {
            let r = n;
            this._views.push(r),
            r.attachToAppRef(this)
        }
        detachView(n) {
            let r = n;
            Io(this._views, r),
            r.detachFromAppRef()
        }
        _loadComponent(n) {
            this.attachView(n.hostView);
            try {
                this.tick()
            } catch (o) {
                this.internalErrorHandler(o)
            }
            this.components.push(n),
            this._injector.get(jo, []).forEach(o => o(n))
        }
        ngOnDestroy() {
            if (!this._destroyed)
                try {
                    this._destroyListeners.forEach(n => n()),
                    this._views.slice().forEach(n => n.destroy())
                } finally {
                    this._destroyed = !0,
                    this._views = [],
                    this._destroyListeners = []
                }
        }
        onDestroy(n) {
            return this._destroyListeners.push(n),
            () => Io(this._destroyListeners, n)
        }
        destroy() {
            if (this._destroyed)
                throw new y(406,!1);
            let n = this._injector;
            n.destroy && !n.destroyed && n.destroy()
        }
        get viewCount() {
            return this._views.length
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)();
function Io(e, t) {
    let n = e.indexOf(t);
    n > -1 && e.splice(n, 1)
}
function Vo(e, t, n, r) {
    let o = N()
      , i = Sn();
    if (Qt(o, i, t)) {
        let s = se()
          , a = ps();
        dI(a, o, e, t, n, r)
    }
    return Vo
}
var ck = typeof document < "u" && typeof document?.documentElement?.getAnimations == "function";
var bl = class {
    destroy(t) {}
    updateValue(t, n) {}
    swap(t, n) {
        let r = Math.min(t, n)
          , o = Math.max(t, n)
          , i = this.detach(o);
        if (o - r > 1) {
            let s = this.detach(r);
            this.attach(r, i),
            this.attach(o, s)
        } else
            this.attach(r, i)
    }
    move(t, n) {
        this.attach(n, this.detach(t))
    }
}
;
function Zu(e, t, n, r, o) {
    return e === n && Object.is(t, r) ? 1 : Object.is(o(e, t), o(n, r)) ? -1 : 0
}
function Uw(e, t, n, r) {
    let o, i, s = 0, a = e.length - 1, c = void 0;
    if (Array.isArray(t)) {
        _(r);
        let u = t.length - 1;
        for (_(null); s <= a && s <= u; ) {
            let l = e.at(s)
              , d = t[s]
              , h = Zu(s, l, s, d, n);
            if (h !== 0) {
                h < 0 && e.updateValue(s, d),
                s++;
                continue
            }
            let f = e.at(a)
              , m = t[u]
              , w = Zu(a, f, u, m, n);
            if (w !== 0) {
                w < 0 && e.updateValue(a, m),
                a--,
                u--;
                continue
            }
            let E = n(s, l)
              , C = n(a, f)
              , W = n(s, d);
            if (Object.is(W, C)) {
                let Ae = n(u, m);
                Object.is(Ae, E) ? (e.swap(s, a),
                e.updateValue(a, m),
                u--,
                a--) : e.move(a, s),
                e.updateValue(s, d),
                s++;
                continue
            }
            if (o ??= new Bs,
            i ??= Pp(e, s, a, n),
            Ml(e, o, s, W))
                e.updateValue(s, d),
                s++,
                a++;
            else if (i.has(W))
                o.set(E, e.detach(s)),
                a--;
            else {
                let Ae = e.create(s, t[s]);
                e.attach(s, Ae),
                s++,
                a++
            }
        }
        for (; s <= u; )
            kp(e, o, n, s, t[s]),
            s++
    } else if (t != null) {
        _(r);
        let u = t[Symbol.iterator]();
        _(null);
        let l = u.next();
        for (; !l.done && s <= a; ) {
            let d = e.at(s)
              , h = l.value
              , f = Zu(s, d, s, h, n);
            if (f !== 0)
                f < 0 && e.updateValue(s, h),
                s++,
                l = u.next();
            else {
                o ??= new Bs,
                i ??= Pp(e, s, a, n);
                let m = n(s, h);
                if (Ml(e, o, s, m))
                    e.updateValue(s, h),
                    s++,
                    a++,
                    l = u.next();
                else if (!i.has(m))
                    e.attach(s, e.create(s, h)),
                    s++,
                    a++,
                    l = u.next();
                else {
                    let w = n(s, d);
                    o.set(w, e.detach(s)),
                    a--
                }
            }
        }
        for (; !l.done; )
            kp(e, o, n, e.length, l.value),
            l = u.next()
    }
    for (; s <= a; )
        e.destroy(e.detach(a--));
    o?.forEach(u => {
        e.destroy(u)
    }
    )
}
function Ml(e, t, n, r) {
    return t !== void 0 && t.has(r) ? (e.attach(n, t.get(r)),
    t.delete(r),
    !0) : !1
}
function kp(e, t, n, r, o) {
    if (Ml(e, t, r, n(r, o)))
        e.updateValue(r, o);
    else {
        let i = e.create(r, o);
        e.attach(r, i)
    }
}
function Pp(e, t, n, r) {
    let o = new Set;
    for (let i = t; i <= n; i++)
        o.add(r(i, e.at(i)));
    return o
}
var Bs = class {
    kvMap = new Map;
    _vMap = void 0;
    has(t) {
        return this.kvMap.has(t)
    }
    delete(t) {
        if (!this.has(t))
            return !1;
        let n = this.kvMap.get(t);
        return this._vMap !== void 0 && this._vMap.has(n) ? (this.kvMap.set(t, this._vMap.get(n)),
        this._vMap.delete(n)) : this.kvMap.delete(t),
        !0
    }
    get(t) {
        return this.kvMap.get(t)
    }
    set(t, n) {
        if (this.kvMap.has(t)) {
            let r = this.kvMap.get(t);
            this._vMap === void 0 && (this._vMap = new Map);
            let o = this._vMap;
            for (; o.has(r); )
                r = o.get(r);
            o.set(r, n)
        } else
            this.kvMap.set(t, n)
    }
    forEach(t) {
        for (let[n,r] of this.kvMap)
            if (t(r, n),
            this._vMap !== void 0) {
                let o = this._vMap;
                for (; o.has(r); )
                    r = o.get(r),
                    t(r, n)
            }
    }
}
;
function Hw(e, t, n, r, o, i, s, a) {
    Ke("NgControlFlow");
    let c = N()
      , u = se()
      , l = ct(u.consts, i);
    return To(c, u, e, t, n, r, o, l, 256, s, a),
    dd
}
function dd(e, t, n, r, o, i, s, a) {
    Ke("NgControlFlow");
    let c = N()
      , u = se()
      , l = ct(u.consts, i);
    return To(c, u, e, t, n, r, o, l, 512, s, a),
    dd
}
function $w(e, t) {
    Ke("NgControlFlow");
    let n = N()
      , r = Sn()
      , o = n[r] !== lt ? n[r] : -1
      , i = o !== -1 ? Us(n, Z + o) : void 0
      , s = 0;
    if (Qt(n, r, e)) {
        let a = _(null);
        try {
            if (i !== void 0 && rm(i, s),
            e !== -1) {
                let c = Z + e
                  , u = Us(n, c)
                  , l = Nl(n[M], c)
                  , d = im(u, l, n)
                  , h = Fo(n, l, t, {
                    dehydratedView: d
                });
                ko(u, h, s, Ir(l, d))
            }
        } finally {
            _(a)
        }
    } else if (i !== void 0) {
        let a = nm(i, s);
        a !== void 0 && (a[Q] = t)
    }
}
var Tl = class {
    lContainer;
    $implicit;
    $index;
    constructor(t, n, r) {
        this.lContainer = t,
        this.$implicit = n,
        this.$index = r
    }
    get $count() {
        return this.lContainer.length - Y
    }
}
;
function zw(e) {
    return e
}
function Gw(e, t) {
    return t
}
var Sl = class {
    hasEmptyBlock;
    trackByFn;
    liveCollection;
    constructor(t, n, r) {
        this.hasEmptyBlock = t,
        this.trackByFn = n,
        this.liveCollection = r
    }
}
;
function Ww(e, t, n, r, o, i, s, a, c, u, l, d, h) {
    Ke("NgControlFlow");
    let f = N()
      , m = se()
      , w = c !== void 0
      , E = N()
      , C = a ? s.bind(E[me][Q]) : s
      , W = new Sl(w,C);
    E[Z + e] = W,
    To(f, m, e + 1, t, n, r, o, ct(m.consts, i), 256),
    w && To(f, m, e + 2, c, u, l, d, ct(m.consts, h), 512)
}
var Al = class extends bl {
    lContainer;
    hostLView;
    templateTNode;
    operationsCounter = void 0;
    needsIndexUpdate = !1;
    constructor(t, n, r) {
        super(),
        this.lContainer = t,
        this.hostLView = n,
        this.templateTNode = r
    }
    get length() {
        return this.lContainer.length - Y
    }
    at(t) {
        return this.getLView(t)[Q].$implicit
    }
    attach(t, n) {
        let r = n[En];
        this.needsIndexUpdate ||= t !== this.length,
        ko(this.lContainer, n, t, Ir(this.templateTNode, r)),
        Zw(this.lContainer, t)
    }
    detach(t) {
        return this.needsIndexUpdate ||= t !== this.length - 1,
        Yw(this.lContainer, t),
        Qw(this.lContainer, t)
    }
    create(t, n) {
        let r = Fs(this.lContainer, this.templateTNode.tView.ssrId);
        return Fo(this.hostLView, this.templateTNode, new Tl(this.lContainer,n,t), {
            dehydratedView: r
        })
    }
    destroy(t) {
        Xs(t[M], t)
    }
    updateValue(t, n) {
        this.getLView(t)[Q].$implicit = n
    }
    reset() {
        this.needsIndexUpdate = !1
    }
    updateIndexes() {
        if (this.needsIndexUpdate)
            for (let t = 0; t < this.length; t++)
                this.getLView(t)[Q].$index = t
    }
    getLView(t) {
        return Kw(this.lContainer, t)
    }
}
;
function qw(e) {
    let t = _(null)
      , n = Wt();
    try {
        let r = N()
          , o = r[M]
          , i = r[n]
          , s = n + 1
          , a = Us(r, s);
        if (i.liveCollection === void 0) {
            let u = Nl(o, s);
            i.liveCollection = new Al(a,r,u)
        } else
            i.liveCollection.reset();
        let c = i.liveCollection;
        if (Uw(c, e, i.trackByFn, t),
        c.updateIndexes(),
        i.hasEmptyBlock) {
            let u = Sn()
              , l = c.length === 0;
            if (Qt(r, u, l)) {
                let d = n + 2
                  , h = Us(r, d);
                if (l) {
                    let f = Nl(o, d)
                      , m = im(h, f, r)
                      , w = Fo(r, f, void 0, {
                        dehydratedView: m
                    });
                    ko(h, w, 0, Ir(f, m))
                } else
                    o.firstUpdatePass && kI(h),
                    rm(h, 0)
            }
        }
    } finally {
        _(t)
    }
}
function Us(e, t) {
    return e[t]
}
function Zw(e, t) {
    if (e.length <= Y)
        return;
    let n = Y + t
      , r = e[n]
      , o = r ? r[_n] : void 0;
    if (r && o && o.detachedLeaveAnimationFns && o.detachedLeaveAnimationFns.length > 0) {
        let i = r[Ct];
        UC(i, o),
        Rn.delete(r[It]),
        o.detachedLeaveAnimationFns = void 0
    }
}
function Yw(e, t) {
    if (e.length <= Y)
        return;
    let n = Y + t
      , r = e[n]
      , o = r ? r[_n] : void 0;
    o && o.leave && o.leave.size > 0 && (o.detachedLeaveAnimationFns = [])
}
function Qw(e, t) {
    return bo(e, t)
}
function Kw(e, t) {
    return nm(e, t)
}
function Nl(e, t) {
    return mo(e, t)
}
function Em(e, t, n) {
    let r = N()
      , o = Sn();
    if (Qt(r, o, t)) {
        let i = se()
          , s = ps();
        iI(s, r, e, t, r[G], n)
    }
    return Em
}
function Lp(e, t, n, r, o) {
    Jl(t, e, n, o ? "class" : "style", r)
}
function fd(e, t, n, r) {
    let o = N()
      , i = o[M]
      , s = e + Z
      , a = i.firstCreatePass ? um(s, o, 2, t, lI, jh(), n, r) : i.data[s];
    if (zg(a, o, e, t, Im),
    as(a)) {
        let c = o[M];
        Hg(c, o, a),
        pg(c, a, o)
    }
    return r != null && Kl(o, a),
    fd
}
function hd() {
    let e = se()
      , t = Ee()
      , n = Gg(t);
    return e.firstCreatePass && lm(e, n),
    Mu(n) && Tu(),
    _u(),
    n.classesWithoutHost != null && SE(n) && Lp(e, n, N(), n.classesWithoutHost, !0),
    n.stylesWithoutHost != null && AE(n) && Lp(e, n, N(), n.stylesWithoutHost, !1),
    hd
}
function ia(e, t, n, r) {
    return fd(e, t, n, r),
    hd(),
    ia
}
function pd(e, t, n, r) {
    let o = N()
      , i = o[M]
      , s = e + Z
      , a = i.firstCreatePass ? QI(s, i, 2, t, n, r) : i.data[s];
    return zg(a, o, e, t, Im),
    r != null && Kl(o, a),
    pd
}
function gd() {
    let e = Ee()
      , t = Gg(e);
    return Mu(t) && Tu(),
    _u(),
    gd
}
function Cm(e, t, n, r) {
    return pd(e, t, n, r),
    gd(),
    Cm
}
var Im = (e, t, n, r, o) => (ms(!0),
Cg(t[G], r, ep()));
function Jw() {
    return N()
}
function wm(e, t, n) {
    let r = N()
      , o = Sn();
    if (Qt(r, o, t)) {
        let i = se()
          , s = ps();
        $g(s, r, e, t, r[G], n)
    }
    return wm
}
var Bo = "en-US";
var Xw = Bo;
function _m(e) {
    typeof e == "string" && (Xw = e.toLowerCase().replace(/_/g, "-"))
}
function Uo(e, t, n) {
    let r = N()
      , o = se()
      , i = Ee();
    return e_(o, r, r[G], i, e, t, n),
    Uo
}
function e_(e, t, n, r, o, i, s) {
    let a = !0
      , c = null;
    if ((r.type & 3 || s) && (c ??= Gu(r, t, i),
    JI(r, e, t, s, n, o, i, c) && (a = !1)),
    a) {
        let u = r.outputs?.[o]
          , l = r.hostDirectiveOutputs?.[o];
        if (l && l.length)
            for (let d = 0; d < l.length; d += 2) {
                let h = l[d]
                  , f = l[d + 1];
                c ??= Gu(r, t, i),
                Rp(r, t, h, f, o, c)
            }
        if (u && u.length)
            for (let d of u)
                c ??= Gu(r, t, i),
                Rp(r, t, d, o, o, c)
    }
}
function t_(e=1) {
    return Jh(e)
}
function n_(e, t) {
    let n = null
      , r = TC(e);
    for (let o = 0; o < t.length; o++) {
        let i = t[o];
        if (i === "*") {
            n = o;
            continue
        }
        if (r === null ? Sg(e, i, !0) : NC(r, i))
            return o
    }
    return n
}
function r_(e) {
    let t = N()[me][ge];
    if (!t.projection) {
        let n = e ? e.length : 1
          , r = t.projection = Ch(n, null)
          , o = r.slice()
          , i = t.child;
        for (; i !== null; ) {
            if (i.type !== 128) {
                let s = e ? n_(i, e) : 0;
                s !== null && (o[s] ? o[s].projectionNext = i : r[s] = i,
                o[s] = i)
            }
            i = i.next
        }
    }
}
function o_(e, t=0, n, r, o, i) {
    let s = N()
      , a = se()
      , c = r ? e + 1 : null;
    c !== null && To(s, a, c, r, o, i, null, n);
    let u = Po(a, Z + e, 16, null, n || null);
    u.projection === null && (u.projection = t),
    Nu();
    let d = !s[En] || bu();
    s[me][ge].projection[u.projection] === null && c !== null ? i_(s, a, c) : d && !Zs(u) && JC(a, s, u)
}
function i_(e, t, n) {
    let r = Z + n
      , o = t.data[r]
      , i = e[r]
      , s = Fs(i, o.tView.ssrId)
      , a = Fo(e, o, void 0, {
        dehydratedView: s
    });
    ko(i, a, 0, Ir(o, s))
}
function bm(e, t, n) {
    return Iw(e, t, n),
    bm
}
function Mm(e) {
    let t = N()
      , n = se()
      , r = Ou();
    ds(r + 1);
    let o = od(n, r);
    if (e.dirty && Rh(t) === ((o.metadata.flags & 2) === 2)) {
        if (o.matches === null)
            e.reset([]);
        else {
            let i = bw(t, r);
            e.reset(i, HE),
            e.notifyOnChanges()
        }
        return !0
    }
    return !1
}
function Tm() {
    return Ew(N(), Ou())
}
function s_(e) {
    let t = Hh();
    return yu(t, Z + e)
}
function Cs(e, t) {
    return e << 17 | t << 2
}
function kn(e) {
    return e >> 17 & 32767
}
function a_(e) {
    return (e & 2) == 2
}
function c_(e, t) {
    return e & 131071 | t << 17
}
function Rl(e) {
    return e | 2
}
function _r(e) {
    return (e & 131068) >> 2
}
function Yu(e, t) {
    return e & -131069 | t << 2
}
function u_(e) {
    return (e & 1) === 1
}
function xl(e) {
    return e | 1
}
function l_(e, t, n, r, o, i) {
    let s = i ? t.classBindings : t.styleBindings
      , a = kn(s)
      , c = _r(s);
    e[r] = n;
    let u = !1, l;
    if (Array.isArray(n)) {
        let d = n;
        l = d[1],
        (l === null || hr(d, l) > 0) && (u = !0)
    } else
        l = n;
    if (o)
        if (c !== 0) {
            let h = kn(e[a + 1]);
            e[r + 1] = Cs(h, a),
            h !== 0 && (e[h + 1] = Yu(e[h + 1], r)),
            e[a + 1] = c_(e[a + 1], r)
        } else
            e[r + 1] = Cs(a, 0),
            a !== 0 && (e[a + 1] = Yu(e[a + 1], r)),
            a = r;
    else
        e[r + 1] = Cs(c, 0),
        a === 0 ? a = r : e[c + 1] = Yu(e[c + 1], r),
        c = r;
    u && (e[r + 1] = Rl(e[r + 1])),
    jp(e, l, r, !0),
    jp(e, l, r, !1),
    d_(t, l, e, r, i),
    s = Cs(a, c),
    i ? t.classBindings = s : t.styleBindings = s
}
function d_(e, t, n, r, o) {
    let i = o ? e.residualClasses : e.residualStyles;
    i != null && typeof t == "string" && hr(i, t) >= 0 && (n[r + 1] = xl(n[r + 1]))
}
function jp(e, t, n, r) {
    let o = e[n + 1]
      , i = t === null
      , s = r ? kn(o) : _r(o)
      , a = !1;
    for (; s !== 0 && (a === !1 || i); ) {
        let c = e[s]
          , u = e[s + 1];
        f_(c, t) && (a = !0,
        e[s + 1] = r ? xl(u) : Rl(u)),
        s = r ? kn(u) : _r(u)
    }
    a && (e[n + 1] = r ? Rl(o) : xl(o))
}
function f_(e, t) {
    return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t ? !0 : Array.isArray(e) && typeof t == "string" ? hr(e, t) >= 0 : !1
}
function Sm(e, t, n) {
    return Am(e, t, n, !1),
    Sm
}
function sa(e, t) {
    return Am(e, t, null, !0),
    sa
}
function Am(e, t, n, r) {
    let o = N()
      , i = se()
      , s = zh(2);
    if (i.firstUpdatePass && p_(i, e, s, r),
    t !== lt && Qt(o, s, t)) {
        let a = i.data[Wt()];
        D_(i, a, o, o[G], e, o[s + 1] = E_(t, n), r, s)
    }
}
function h_(e, t) {
    return t >= e.expandoStartIndex
}
function p_(e, t, n, r) {
    let o = e.data;
    if (o[n + 1] === null) {
        let i = o[Wt()]
          , s = h_(e, n);
        C_(i, r) && t === null && !s && (t = !1),
        t = g_(o, i, t, r),
        l_(o, i, t, n, s, r)
    }
}
function g_(e, t, n, r) {
    let o = Zh(e)
      , i = r ? t.residualClasses : t.residualStyles;
    if (o === null)
        (r ? t.classBindings : t.styleBindings) === 0 && (n = Qu(null, e, t, n, r),
        n = So(n, t.attrs, r),
        i = null);
    else {
        let s = t.directiveStylingLast;
        if (s === -1 || e[s] !== o)
            if (n = Qu(o, e, t, n, r),
            i === null) {
                let c = m_(e, t, r);
                c !== void 0 && Array.isArray(c) && (c = Qu(null, e, t, c[1], r),
                c = So(c, t.attrs, r),
                y_(e, t, r, c))
            } else
                i = v_(e, t, r)
    }
    return i !== void 0 && (r ? t.residualClasses = i : t.residualStyles = i),
    n
}
function m_(e, t, n) {
    let r = n ? t.classBindings : t.styleBindings;
    if (_r(r) !== 0)
        return e[kn(r)]
}
function y_(e, t, n, r) {
    let o = n ? t.classBindings : t.styleBindings;
    e[kn(o)] = r
}
function v_(e, t, n) {
    let r, o = t.directiveEnd;
    for (let i = 1 + t.directiveStylingLast; i < o; i++) {
        let s = e[i].hostAttrs;
        r = So(r, s, n)
    }
    return So(r, t.attrs, n)
}
function Qu(e, t, n, r, o) {
    let i = null
      , s = n.directiveEnd
      , a = n.directiveStylingLast;
    for (a === -1 ? a = n.directiveStart : a++; a < s && (i = t[a],
    r = So(r, i.hostAttrs, o),
    i !== e); )
        a++;
    return e !== null && (n.directiveStylingLast = a),
    r
}
function So(e, t, n) {
    let r = n ? 1 : 2
      , o = -1;
    if (t !== null)
        for (let i = 0; i < t.length; i++) {
            let s = t[i];
            typeof s == "number" ? o = s : o === r && (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]),
            wh(e, s, n ? !0 : t[++i]))
        }
    return e === void 0 ? null : e
}
function D_(e, t, n, r, o, i, s, a) {
    if (!(t.type & 3))
        return;
    let c = e.data
      , u = c[a + 1]
      , l = u_(u) ? Vp(c, t, n, o, _r(u), s) : void 0;
    if (!Hs(l)) {
        Hs(i) || a_(u) && (i = Vp(c, null, n, o, a, s));
        let d = mu(Wt(), n);
        eI(r, s, d, o, i)
    }
}
function Vp(e, t, n, r, o, i) {
    let s = t === null, a;
    for (; o > 0; ) {
        let c = e[o]
          , u = Array.isArray(c)
          , l = u ? c[1] : c
          , d = l === null
          , h = n[o + 1];
        h === lt && (h = d ? we : void 0);
        let f = d ? is(h, r) : l === r ? h : void 0;
        if (u && !Hs(f) && (f = is(c, r)),
        Hs(f) && (a = f,
        s))
            return a;
        let m = e[o + 1];
        o = s ? kn(m) : _r(m)
    }
    if (t !== null) {
        let c = i ? t.residualClasses : t.residualStyles;
        c != null && (a = is(c, r))
    }
    return a
}
function Hs(e) {
    return e !== void 0
}
function E_(e, t) {
    return e == null || e === "" || (typeof t == "string" ? e = e + t : typeof e == "object" && (e = yt(Ye(e)))),
    e
}
function C_(e, t) {
    return (e.flags & (t ? 8 : 16)) !== 0
}
function I_(e, t="") {
    let n = N()
      , r = se()
      , o = e + Z
      , i = r.firstCreatePass ? Po(r, o, 1, t, null) : r.data[o]
      , s = w_(r, n, i, t, e);
    n[o] = s,
    gs() && Yl(r, n, s, i),
    yr(i, !1)
}
var w_ = (e, t, n, r, o) => (ms(!0),
gC(t[G], r));
function Nm(e, t, n, r="") {
    return Qt(e, Sn(), n) ? t + fr(n) + r : lt
}
function Rm(e) {
    return md("", e),
    Rm
}
function md(e, t, n) {
    let r = N()
      , o = Nm(r, e, t, n);
    return o !== lt && __(r, Wt(), o),
    md
}
function __(e, t, n) {
    let r = mu(t, e);
    mC(e[G], r, n)
}
function b_(e, t, n="") {
    return Nm(N(), e, t, n)
}
function Bp(e, t, n) {
    let r = se();
    r.firstCreatePass && xm(t, r.data, r.blueprint, at(e), n)
}
function xm(e, t, n, r, o) {
    if (e = ue(e),
    Array.isArray(e))
        for (let i = 0; i < e.length; i++)
            xm(e[i], t, n, r, o);
    else {
        let i = se()
          , s = N()
          , a = Ee()
          , c = mn(e) ? e : ue(e.provide)
          , u = lu(e)
          , l = a.providerIndexes & 1048575
          , d = a.directiveStart
          , h = a.providerIndexes >> 20;
        if (mn(e) || !e.multi) {
            let f = new Nn(u,o,U,null)
              , m = Ju(c, t, o ? l : l + h, d);
            m === -1 ? (el(Ns(a, s), i, c),
            Ku(i, e, t.length),
            t.push(c),
            a.directiveStart++,
            a.directiveEnd++,
            o && (a.providerIndexes += 1048576),
            n.push(f),
            s.push(f)) : (n[m] = f,
            s[m] = f)
        } else {
            let f = Ju(c, t, l + h, d)
              , m = Ju(c, t, l, l + h)
              , w = f >= 0 && n[f]
              , E = m >= 0 && n[m];
            if (o && !E || !o && !w) {
                el(Ns(a, s), i, c);
                let C = S_(o ? T_ : M_, n.length, o, r, u, e);
                !o && E && (n[m].providerFactory = C),
                Ku(i, e, t.length, 0),
                t.push(c),
                a.directiveStart++,
                a.directiveEnd++,
                o && (a.providerIndexes += 1048576),
                n.push(C),
                s.push(C)
            } else {
                let C = Om(n[o ? m : f], u, !o && r);
                Ku(i, e, f > -1 ? f : m, C)
            }
            !o && r && E && n[m].componentProviders++
        }
    }
}
function Ku(e, t, n, r) {
    let o = mn(t)
      , i = Th(t);
    if (o || i) {
        let c = (i ? ue(t.useClass) : t).prototype.ngOnDestroy;
        if (c) {
            let u = e.destroyHooks || (e.destroyHooks = []);
            if (!o && t.multi) {
                let l = u.indexOf(n);
                l === -1 ? u.push(n, [r, c]) : u[l + 1].push(r, c)
            } else
                u.push(n, c)
        }
    }
}
function Om(e, t, n) {
    return n && e.componentProviders++,
    e.multi.push(t) - 1
}
function Ju(e, t, n, r) {
    for (let o = n; o < r; o++)
        if (t[o] === e)
            return o;
    return -1
}
function M_(e, t, n, r, o) {
    return Ol(this.multi, [])
}
function T_(e, t, n, r, o) {
    let i = this.multi, s;
    if (this.providerFactory) {
        let a = this.providerFactory.componentProviders
          , c = wo(r, r[M], this.providerFactory.index, o);
        s = c.slice(0, a),
        Ol(i, s);
        for (let u = a; u < c.length; u++)
            s.push(c[u])
    } else
        s = [],
        Ol(i, s);
    return s
}
function Ol(e, t) {
    for (let n = 0; n < e.length; n++) {
        let r = e[n];
        t.push(r())
    }
    return t
}
function S_(e, t, n, r, o, i) {
    let s = new Nn(e,n,U,null);
    return s.multi = [],
    s.index = t,
    s.componentProviders = 0,
    Om(s, o, r && !n),
    s
}
function Ho(e, t) {
    return n => {
        n.providersResolver = (r, o) => Bp(r, o ? o(e) : e, !1),
        t && (n.viewProvidersResolver = (r, o) => Bp(r, o ? o(t) : t, !0))
    }
}
function A_(e, t, n) {
    return Fm(N(), xu(), e, t, n)
}
function N_(e, t) {
    let n = e[t];
    return n === lt ? void 0 : n
}
function Fm(e, t, n, r, o, i) {
    let s = t + n;
    return Qt(e, s, o) ? KI(e, s + 1, i ? r.call(i, o) : r(o)) : N_(e, s + 1)
}
function R_(e, t) {
    let n = se(), r, o = e + Z;
    n.firstCreatePass ? (r = x_(t, n.pipeRegistry),
    n.data[o] = r,
    r.onDestroy && (n.destroyHooks ??= []).push(o, r.onDestroy)) : r = n.data[o];
    let i = r.factory || (r.factory = Lt(r.type, !0)), s, a = pe(U);
    try {
        let c = As(!1)
          , u = i();
        return As(c),
        vu(n, N(), o, u),
        u
    } finally {
        pe(a)
    }
}
function x_(e, t) {
    if (t)
        for (let n = t.length - 1; n >= 0; n--) {
            let r = t[n];
            if (e === r.name)
                return r
        }
}
function O_(e, t, n) {
    let r = e + Z
      , o = N()
      , i = yu(o, r);
    return F_(o, r) ? Fm(o, xu(), t, i.transform, n, i) : i.transform(n)
}
function F_(e, t) {
    return e[M].data[t].pure
}
var $s = class {
    ngModuleFactory;
    componentFactories;
    constructor(t, n) {
        this.ngModuleFactory = t,
        this.componentFactories = n
    }
}
  , yd = ( () => {
    class e {
        compileModuleSync(n) {
            return new Vs(n)
        }
        compileModuleAsync(n) {
            return Promise.resolve(this.compileModuleSync(n))
        }
        compileModuleAndAllComponentsSync(n) {
            let r = this.compileModuleSync(n)
              , o = tu(n)
              , i = Mg(o.declarations).reduce( (s, a) => {
                let c = Dt(a);
                return c && s.push(new On(c)),
                s
            }
            , []);
            return new $s(r,i)
        }
        compileModuleAndAllComponentsAsync(n) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(n))
        }
        clearCache() {}
        clearCacheFor(n) {}
        getModuleId(n) {}
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)();
var km = ( () => {
    class e {
        applicationErrorHandler = p(ze);
        appRef = p(Xt);
        taskService = p(wt);
        ngZone = p(fe);
        zonelessEnabled = p(Do);
        tracing = p(Tt, {
            optional: !0
        });
        zoneIsDefined = typeof Zone < "u" && !!Zone.root.run;
        schedulerTickApplyArgs = [{
            data: {
                __scheduler_tick__: !0
            }
        }];
        subscriptions = new K;
        angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(co) : null;
        scheduleInRootZone = !this.zonelessEnabled && this.zoneIsDefined && (p(Uu, {
            optional: !0
        }) ?? !1);
        cancelScheduledCallback = null;
        useMicrotaskScheduler = !1;
        runningTick = !1;
        pendingRenderTaskId = null;
        constructor() {
            this.subscriptions.add(this.appRef.afterTick.subscribe( () => {
                let n = this.taskService.add();
                if (!this.runningTick && (this.cleanup(),
                !this.zonelessEnabled || this.appRef.includeAllTestViews)) {
                    this.taskService.remove(n);
                    return
                }
                this.switchToMicrotaskScheduler(),
                this.taskService.remove(n)
            }
            )),
            this.subscriptions.add(this.ngZone.onUnstable.subscribe( () => {
                this.runningTick || this.cleanup()
            }
            ))
        }
        switchToMicrotaskScheduler() {
            this.ngZone.runOutsideAngular( () => {
                let n = this.taskService.add();
                this.useMicrotaskScheduler = !0,
                queueMicrotask( () => {
                    this.useMicrotaskScheduler = !1,
                    this.taskService.remove(n)
                }
                )
            }
            )
        }
        notify(n) {
            if (!this.zonelessEnabled && n === 5)
                return;
            switch (n) {
            case 0:
                {
                    this.appRef.dirtyFlags |= 2;
                    break
                }
            case 3:
            case 2:
            case 4:
            case 5:
            case 1:
                {
                    this.appRef.dirtyFlags |= 4;
                    break
                }
            case 6:
                {
                    this.appRef.dirtyFlags |= 2;
                    break
                }
            case 12:
                {
                    this.appRef.dirtyFlags |= 16;
                    break
                }
            case 13:
                {
                    this.appRef.dirtyFlags |= 2;
                    break
                }
            case 11:
                break;
            default:
                this.appRef.dirtyFlags |= 8
            }
            if (this.appRef.tracingSnapshot = this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null,
            !this.shouldScheduleTick())
                return;
            let r = this.useMicrotaskScheduler ? op : Lu;
            this.pendingRenderTaskId = this.taskService.add(),
            this.scheduleInRootZone ? this.cancelScheduledCallback = Zone.root.run( () => r( () => this.tick())) : this.cancelScheduledCallback = this.ngZone.runOutsideAngular( () => r( () => this.tick()))
        }
        shouldScheduleTick() {
            return !(this.appRef.destroyed || this.pendingRenderTaskId !== null || this.runningTick || this.appRef._runningTick || !this.zonelessEnabled && this.zoneIsDefined && Zone.current.get(co + this.angularZoneId))
        }
        tick() {
            if (this.runningTick || this.appRef.destroyed)
                return;
            if (this.appRef.dirtyFlags === 0) {
                this.cleanup();
                return
            }
            !this.zonelessEnabled && this.appRef.dirtyFlags & 7 && (this.appRef.dirtyFlags |= 1);
            let n = this.taskService.add();
            try {
                this.ngZone.run( () => {
                    this.runningTick = !0,
                    this.appRef._tick()
                }
                , void 0, this.schedulerTickApplyArgs)
            } catch (r) {
                this.applicationErrorHandler(r)
            } finally {
                this.taskService.remove(n),
                this.cleanup()
            }
        }
        ngOnDestroy() {
            this.subscriptions.unsubscribe(),
            this.cleanup()
        }
        cleanup() {
            if (this.runningTick = !1,
            this.cancelScheduledCallback?.(),
            this.cancelScheduledCallback = null,
            this.pendingRenderTaskId !== null) {
                let n = this.pendingRenderTaskId;
                this.pendingRenderTaskId = null,
                this.taskService.remove(n)
            }
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)();
function k_() {
    return Ke("NgZoneless"),
    Et([...vd(), []])
}
function vd() {
    return [{
        provide: vt,
        useExisting: km
    }, {
        provide: fe,
        useClass: uo
    }, {
        provide: Do,
        useValue: !0
    }]
}
function P_() {
    return typeof $localize < "u" && $localize.locale || Bo
}
var aa = new v("",{
    factory: () => p(aa, {
        optional: !0,
        skipSelf: !0
    }) || P_()
});
var ca = class {
    destroyed = !1;
    listeners = null;
    errorHandler = p(Re, {
        optional: !0
    });
    destroyRef = p(Ce);
    constructor() {
        this.destroyRef.onDestroy( () => {
            this.destroyed = !0,
            this.listeners = null
        }
        )
    }
    subscribe(t) {
        if (this.destroyed)
            throw new y(953,!1);
        return (this.listeners ??= []).push(t),
        {
            unsubscribe: () => {
                let n = this.listeners?.indexOf(t);
                n !== void 0 && n !== -1 && this.listeners?.splice(n, 1)
            }
        }
    }
    emit(t) {
        if (this.destroyed) {
            console.warn(xe(953, !1));
            return
        }
        if (this.listeners === null)
            return;
        let n = _(null);
        try {
            for (let r of this.listeners)
                try {
                    r(t)
                } catch (o) {
                    this.errorHandler?.handleError(o)
                }
        } finally {
            _(n)
        }
    }
}
;
function Tr(e, t) {
    return Gi(e, t?.equal)
}
var Bm = Symbol("InputSignalNode#UNSET")
  , eb = R(g({}, Wi), {
    transformFn: void 0,
    applyValueToInputSignal(e, t) {
        ro(e, t)
    }
});
function Um(e, t) {
    let n = Object.create(eb);
    n.value = e,
    n.transformFn = t?.transform;
    function r() {
        if (eo(n),
        n.value === Bm) {
            let o = null;
            throw new y(-950,o)
        }
        return n.value
    }
    return r[De] = n,
    r
}
function hB(e) {
    return new ca
}
function Pm(e, t) {
    return Um(e, t)
}
function tb(e) {
    return Um(Bm, e)
}
var Hm = (Pm.required = tb,
Pm);
var Dd = new v("")
  , nb = new v("");
function $o(e) {
    return !e.moduleRef
}
function rb(e) {
    let t = $o(e) ? e.r3Injector : e.moduleRef.injector
      , n = t.get(fe);
    return n.run( () => {
        $o(e) ? e.r3Injector.resolveInjectorInitializers() : e.moduleRef.resolveInjectorInitializers();
        let r = t.get(ze), o;
        if (n.runOutsideAngular( () => {
            o = n.onError.subscribe({
                next: r
            })
        }
        ),
        $o(e)) {
            let i = () => t.destroy()
              , s = e.platformInjector.get(Dd);
            s.add(i),
            t.onDestroy( () => {
                o.unsubscribe(),
                s.delete(i)
            }
            )
        } else {
            let i = () => e.moduleRef.destroy()
              , s = e.platformInjector.get(Dd);
            s.add(i),
            e.moduleRef.onDestroy( () => {
                Io(e.allPlatformModules, e.moduleRef),
                o.unsubscribe(),
                s.delete(i)
            }
            )
        }
        return ib(r, n, () => {
            let i = t.get(wt)
              , s = i.add()
              , a = t.get(ld);
            return a.runInitializers(),
            a.donePromise.then( () => {
                let c = t.get(aa, Bo);
                if (_m(c || Bo),
                !t.get(nb, !0))
                    return $o(e) ? t.get(Xt) : (e.allPlatformModules.push(e.moduleRef),
                    e.moduleRef);
                if ($o(e)) {
                    let l = t.get(Xt);
                    return e.rootComponent !== void 0 && l.bootstrap(e.rootComponent),
                    l
                } else
                    return ob?.(e.moduleRef, e.allPlatformModules),
                    e.moduleRef
            }
            ).finally( () => {
                i.remove(s)
            }
            )
        }
        )
    }
    )
}
var ob;
function ib(e, t, n) {
    try {
        let r = n();
        return Jt(r) ? r.catch(o => {
            throw t.runOutsideAngular( () => e(o)),
            o
        }
        ) : r
    } catch (r) {
        throw t.runOutsideAngular( () => e(r)),
        r
    }
}
var ua = null;
function sb(e=[], t) {
    return le.create({
        name: t,
        providers: [{
            provide: ho,
            useValue: "platform"
        }, {
            provide: Dd,
            useValue: new Set([ () => ua = null])
        }, ...e]
    })
}
function ab(e=[]) {
    if (ua)
        return ua;
    let t = sb(e);
    return ua = t,
    vm(),
    cb(t),
    t
}
function cb(e) {
    let t = e.get(Gs, null);
    ne(e, () => {
        t?.forEach(n => n())
    }
    )
}
var ub = 1e4;
var pB = ub - 1e3;
var jn = ( () => {
    class e {
        static __NG_ELEMENT_ID__ = lb
    }
    return e
}
)();
function lb(e) {
    return db(Ee(), N(), (e & 16) === 16)
}
function db(e, t, n) {
    if (Gt(e) && !n) {
        let r = ke(e.index, t);
        return new Zt(r,r)
    } else if (e.type & 175) {
        let r = t[me];
        return new Zt(r,t)
    }
    return null
}
var Ed = class {
    constructor() {}
    supports(t) {
        return t instanceof Map || rd(t)
    }
    create() {
        return new Cd
    }
}
  , Cd = class {
    _records = new Map;
    _mapHead = null;
    _appendAfter = null;
    _previousMapHead = null;
    _changesHead = null;
    _changesTail = null;
    _additionsHead = null;
    _additionsTail = null;
    _removalsHead = null;
    _removalsTail = null;
    get isDirty() {
        return this._additionsHead !== null || this._changesHead !== null || this._removalsHead !== null
    }
    forEachItem(t) {
        let n;
        for (n = this._mapHead; n !== null; n = n._next)
            t(n)
    }
    forEachPreviousItem(t) {
        let n;
        for (n = this._previousMapHead; n !== null; n = n._nextPrevious)
            t(n)
    }
    forEachChangedItem(t) {
        let n;
        for (n = this._changesHead; n !== null; n = n._nextChanged)
            t(n)
    }
    forEachAddedItem(t) {
        let n;
        for (n = this._additionsHead; n !== null; n = n._nextAdded)
            t(n)
    }
    forEachRemovedItem(t) {
        let n;
        for (n = this._removalsHead; n !== null; n = n._nextRemoved)
            t(n)
    }
    diff(t) {
        if (!t)
            t = new Map;
        else if (!(t instanceof Map || rd(t)))
            throw new y(900,!1);
        return this.check(t) ? this : null
    }
    onDestroy() {}
    check(t) {
        this._reset();
        let n = this._mapHead;
        if (this._appendAfter = null,
        this._forEach(t, (r, o) => {
            if (n && n.key === o)
                this._maybeAddToChanges(n, r),
                this._appendAfter = n,
                n = n._next;
            else {
                let i = this._getOrCreateRecordForKey(o, r);
                n = this._insertBeforeOrAppend(n, i)
            }
        }
        ),
        n) {
            n._prev && (n._prev._next = null),
            this._removalsHead = n;
            for (let r = n; r !== null; r = r._nextRemoved)
                r === this._mapHead && (this._mapHead = null),
                this._records.delete(r.key),
                r._nextRemoved = r._next,
                r.previousValue = r.currentValue,
                r.currentValue = null,
                r._prev = null,
                r._next = null
        }
        return this._changesTail && (this._changesTail._nextChanged = null),
        this._additionsTail && (this._additionsTail._nextAdded = null),
        this.isDirty
    }
    _insertBeforeOrAppend(t, n) {
        if (t) {
            let r = t._prev;
            return n._next = t,
            n._prev = r,
            t._prev = n,
            r && (r._next = n),
            t === this._mapHead && (this._mapHead = n),
            this._appendAfter = t,
            t
        }
        return this._appendAfter ? (this._appendAfter._next = n,
        n._prev = this._appendAfter) : this._mapHead = n,
        this._appendAfter = n,
        null
    }
    _getOrCreateRecordForKey(t, n) {
        if (this._records.has(t)) {
            let o = this._records.get(t);
            this._maybeAddToChanges(o, n);
            let i = o._prev
              , s = o._next;
            return i && (i._next = s),
            s && (s._prev = i),
            o._next = null,
            o._prev = null,
            o
        }
        let r = new Id(t);
        return this._records.set(t, r),
        r.currentValue = n,
        this._addToAdditions(r),
        r
    }
    _reset() {
        if (this.isDirty) {
            let t;
            for (this._previousMapHead = this._mapHead,
            t = this._previousMapHead; t !== null; t = t._next)
                t._nextPrevious = t._next;
            for (t = this._changesHead; t !== null; t = t._nextChanged)
                t.previousValue = t.currentValue;
            for (t = this._additionsHead; t != null; t = t._nextAdded)
                t.previousValue = t.currentValue;
            this._changesHead = this._changesTail = null,
            this._additionsHead = this._additionsTail = null,
            this._removalsHead = null
        }
    }
    _maybeAddToChanges(t, n) {
        Object.is(n, t.currentValue) || (t.previousValue = t.currentValue,
        t.currentValue = n,
        this._addToChanges(t))
    }
    _addToAdditions(t) {
        this._additionsHead === null ? this._additionsHead = this._additionsTail = t : (this._additionsTail._nextAdded = t,
        this._additionsTail = t)
    }
    _addToChanges(t) {
        this._changesHead === null ? this._changesHead = this._changesTail = t : (this._changesTail._nextChanged = t,
        this._changesTail = t)
    }
    _forEach(t, n) {
        t instanceof Map ? t.forEach(n) : Object.keys(t).forEach(r => n(t[r], r))
    }
}
  , Id = class {
    key;
    previousValue = null;
    currentValue = null;
    _nextPrevious = null;
    _next = null;
    _prev = null;
    _nextAdded = null;
    _nextRemoved = null;
    _nextChanged = null;
    constructor(t) {
        this.key = t
    }
}
;
function Lm() {
    return new _d([new Ed])
}
var _d = ( () => {
    class e {
        static \u0275prov = D({
            token: e,
            providedIn: "root",
            factory: Lm
        });
        factories;
        constructor(n) {
            this.factories = n
        }
        static create(n, r) {
            if (r) {
                let o = r.factories.slice();
                n = n.concat(o)
            }
            return new e(n)
        }
        static extend(n) {
            return {
                provide: e,
                useFactory: () => {
                    let r = p(e, {
                        optional: !0,
                        skipSelf: !0
                    });
                    return e.create(n, r || Lm())
                }
            }
        }
        find(n) {
            let r = this.factories.find(o => o.supports(n));
            if (r)
                return r;
            throw new y(901,!1)
        }
    }
    return e
}
)();
function $m(e) {
    let {rootComponent: t, appProviders: n, platformProviders: r, platformRef: o} = e;
    B(F.BootstrapApplicationStart);
    try {
        let i = o?.injector ?? ab(r)
          , s = [vd(), sp, ...n || []]
          , a = new Mo({
            providers: s,
            parent: i,
            debugName: "",
            runEnvironmentInitializers: !1
        });
        return rb({
            r3Injector: a.injector,
            platformInjector: i,
            rootComponent: t
        })
    } catch (i) {
        return Promise.reject(i)
    } finally {
        B(F.BootstrapApplicationEnd)
    }
}
function la(e) {
    return typeof e == "boolean" ? e : e != null && e !== "false"
}
function zm(e) {
    let t = Dt(e);
    if (!t)
        return null;
    let n = new On(t);
    return {
        get selector() {
            return n.selector
        },
        get type() {
            return n.componentType
        },
        get inputs() {
            return n.inputs
        },
        get outputs() {
            return n.outputs
        },
        get ngContentSelectors() {
            return n.ngContentSelectors
        },
        get isStandalone() {
            return t.standalone
        },
        get isSignal() {
            return t.signals
        }
    }
}
var Gm = null;
function Le() {
    return Gm
}
function bd(e) {
    Gm ??= e
}
var zo = class {
}
  , At = ( () => {
    class e {
        historyGo(n) {
            throw new Error("")
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: () => p(Wm),
            providedIn: "platform"
        })
    }
    return e
}
)()
  , Md = new v("")
  , Wm = ( () => {
    class e extends At {
        _location;
        _history;
        _doc = p($);
        constructor() {
            super(),
            this._location = window.location,
            this._history = window.history
        }
        getBaseHrefFromDOM() {
            return Le().getBaseHref(this._doc)
        }
        onPopState(n) {
            let r = Le().getGlobalEventTarget(this._doc, "window");
            return r.addEventListener("popstate", n, !1),
            () => r.removeEventListener("popstate", n)
        }
        onHashChange(n) {
            let r = Le().getGlobalEventTarget(this._doc, "window");
            return r.addEventListener("hashchange", n, !1),
            () => r.removeEventListener("hashchange", n)
        }
        get href() {
            return this._location.href
        }
        get protocol() {
            return this._location.protocol
        }
        get hostname() {
            return this._location.hostname
        }
        get port() {
            return this._location.port
        }
        get pathname() {
            return this._location.pathname
        }
        get search() {
            return this._location.search
        }
        get hash() {
            return this._location.hash
        }
        set pathname(n) {
            this._location.pathname = n
        }
        pushState(n, r, o) {
            this._history.pushState(n, r, o)
        }
        replaceState(n, r, o) {
            this._history.replaceState(n, r, o)
        }
        forward() {
            this._history.forward()
        }
        back() {
            this._history.back()
        }
        historyGo(n=0) {
            this._history.go(n)
        }
        getState() {
            return this._history.state
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: () => new e,
            providedIn: "platform"
        })
    }
    return e
}
)();
function da(e, t) {
    return e ? t ? e.endsWith("/") ? t.startsWith("/") ? e + t.slice(1) : e + t : t.startsWith("/") ? e + t : `${e}/${t}` : e : t
}
function qm(e) {
    let t = e.search(/#|\?|$/);
    return e[t - 1] === "/" ? e.slice(0, t - 1) + e.slice(t) : e
}
function Je(e) {
    return e && e[0] !== "?" ? `?${e}` : e
}
var Nt = ( () => {
    class e {
        historyGo(n) {
            throw new Error("")
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: () => p(ha),
            providedIn: "root"
        })
    }
    return e
}
)()
  , fa = new v("")
  , ha = ( () => {
    class e extends Nt {
        _platformLocation;
        _baseHref;
        _removeListenerFns = [];
        constructor(n, r) {
            super(),
            this._platformLocation = n,
            this._baseHref = r ?? this._platformLocation.getBaseHrefFromDOM() ?? p($).location?.origin ?? ""
        }
        ngOnDestroy() {
            for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()()
        }
        onPopState(n) {
            this._removeListenerFns.push(this._platformLocation.onPopState(n), this._platformLocation.onHashChange(n))
        }
        getBaseHref() {
            return this._baseHref
        }
        prepareExternalUrl(n) {
            return da(this._baseHref, n)
        }
        path(n=!1) {
            let r = this._platformLocation.pathname + Je(this._platformLocation.search)
              , o = this._platformLocation.hash;
            return o && n ? `${r}${o}` : r
        }
        pushState(n, r, o, i) {
            let s = this.prepareExternalUrl(o + Je(i));
            this._platformLocation.pushState(n, r, s)
        }
        replaceState(n, r, o, i) {
            let s = this.prepareExternalUrl(o + Je(i));
            this._platformLocation.replaceState(n, r, s)
        }
        forward() {
            this._platformLocation.forward()
        }
        back() {
            this._platformLocation.back()
        }
        getState() {
            return this._platformLocation.getState()
        }
        historyGo(n=0) {
            this._platformLocation.historyGo?.(n)
        }
        static \u0275fac = function(r) {
            return new (r || e)(I(At),I(fa, 8))
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)()
  , en = ( () => {
    class e {
        _subject = new J;
        _basePath;
        _locationStrategy;
        _urlChangeListeners = [];
        _urlChangeSubscription = null;
        constructor(n) {
            this._locationStrategy = n;
            let r = this._locationStrategy.getBaseHref();
            this._basePath = pb(qm(Zm(r))),
            this._locationStrategy.onPopState(o => {
                this._subject.next({
                    url: this.path(!0),
                    pop: !0,
                    state: o.state,
                    type: o.type
                })
            }
            )
        }
        ngOnDestroy() {
            this._urlChangeSubscription?.unsubscribe(),
            this._urlChangeListeners = []
        }
        path(n=!1) {
            return this.normalize(this._locationStrategy.path(n))
        }
        getState() {
            return this._locationStrategy.getState()
        }
        isCurrentPathEqualTo(n, r="") {
            return this.path() == this.normalize(n + Je(r))
        }
        normalize(n) {
            return e.stripTrailingSlash(hb(this._basePath, Zm(n)))
        }
        prepareExternalUrl(n) {
            return n && n[0] !== "/" && (n = "/" + n),
            this._locationStrategy.prepareExternalUrl(n)
        }
        go(n, r="", o=null) {
            this._locationStrategy.pushState(o, "", n, r),
            this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Je(r)), o)
        }
        replaceState(n, r="", o=null) {
            this._locationStrategy.replaceState(o, "", n, r),
            this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Je(r)), o)
        }
        forward() {
            this._locationStrategy.forward()
        }
        back() {
            this._locationStrategy.back()
        }
        historyGo(n=0) {
            this._locationStrategy.historyGo?.(n)
        }
        onUrlChange(n) {
            return this._urlChangeListeners.push(n),
            this._urlChangeSubscription ??= this.subscribe(r => {
                this._notifyUrlChangeListeners(r.url, r.state)
            }
            ),
            () => {
                let r = this._urlChangeListeners.indexOf(n);
                this._urlChangeListeners.splice(r, 1),
                this._urlChangeListeners.length === 0 && (this._urlChangeSubscription?.unsubscribe(),
                this._urlChangeSubscription = null)
            }
        }
        _notifyUrlChangeListeners(n="", r) {
            this._urlChangeListeners.forEach(o => o(n, r))
        }
        subscribe(n, r, o) {
            return this._subject.subscribe({
                next: n,
                error: r ?? void 0,
                complete: o ?? void 0
            })
        }
        static normalizeQueryParams = Je;
        static joinWithSlash = da;
        static stripTrailingSlash = qm;
        static \u0275fac = function(r) {
            return new (r || e)(I(Nt))
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: () => fb(),
            providedIn: "root"
        })
    }
    return e
}
)();
function fb() {
    return new en(I(Nt))
}
function hb(e, t) {
    if (!e || !t.startsWith(e))
        return t;
    let n = t.substring(e.length);
    return n === "" || ["/", ";", "?", "#"].includes(n[0]) ? n : t
}
function Zm(e) {
    return e.replace(/\/index.html$/, "")
}
function pb(e) {
    if (new RegExp("^(https?:)?//").test(e)) {
        let[,n] = e.split(/\/\/[^\/]+/);
        return n
    }
    return e
}
var Sd = ( () => {
    class e extends Nt {
        _platformLocation;
        _baseHref = "";
        _removeListenerFns = [];
        constructor(n, r) {
            super(),
            this._platformLocation = n,
            r != null && (this._baseHref = r)
        }
        ngOnDestroy() {
            for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()()
        }
        onPopState(n) {
            this._removeListenerFns.push(this._platformLocation.onPopState(n), this._platformLocation.onHashChange(n))
        }
        getBaseHref() {
            return this._baseHref
        }
        path(n=!1) {
            let r = this._platformLocation.hash ?? "#";
            return r.length > 0 ? r.substring(1) : r
        }
        prepareExternalUrl(n) {
            let r = da(this._baseHref, n);
            return r.length > 0 ? "#" + r : r
        }
        pushState(n, r, o, i) {
            let s = this.prepareExternalUrl(o + Je(i)) || this._platformLocation.pathname;
            this._platformLocation.pushState(n, r, s)
        }
        replaceState(n, r, o, i) {
            let s = this.prepareExternalUrl(o + Je(i)) || this._platformLocation.pathname;
            this._platformLocation.replaceState(n, r, s)
        }
        forward() {
            this._platformLocation.forward()
        }
        back() {
            this._platformLocation.back()
        }
        getState() {
            return this._platformLocation.getState()
        }
        historyGo(n=0) {
            this._platformLocation.historyGo?.(n)
        }
        static \u0275fac = function(r) {
            return new (r || e)(I(At),I(fa, 8))
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac
        })
    }
    return e
}
)();
var Td = /\s+/
  , Ym = []
  , gb = ( () => {
    class e {
        _ngEl;
        _renderer;
        initialClasses = Ym;
        rawClass;
        stateMap = new Map;
        constructor(n, r) {
            this._ngEl = n,
            this._renderer = r
        }
        set klass(n) {
            this.initialClasses = n != null ? n.trim().split(Td) : Ym
        }
        set ngClass(n) {
            this.rawClass = typeof n == "string" ? n.trim().split(Td) : n
        }
        ngDoCheck() {
            for (let r of this.initialClasses)
                this._updateState(r, !0);
            let n = this.rawClass;
            if (Array.isArray(n) || n instanceof Set)
                for (let r of n)
                    this._updateState(r, !0);
            else if (n != null)
                for (let r of Object.keys(n))
                    this._updateState(r, !!n[r]);
            this._applyStateDiff()
        }
        _updateState(n, r) {
            let o = this.stateMap.get(n);
            o !== void 0 ? (o.enabled !== r && (o.changed = !0,
            o.enabled = r),
            o.touched = !0) : this.stateMap.set(n, {
                enabled: r,
                changed: !0,
                touched: !0
            })
        }
        _applyStateDiff() {
            for (let n of this.stateMap) {
                let r = n[0]
                  , o = n[1];
                o.changed ? (this._toggleClass(r, o.enabled),
                o.changed = !1) : o.touched || (o.enabled && this._toggleClass(r, !1),
                this.stateMap.delete(r)),
                o.touched = !1
            }
        }
        _toggleClass(n, r) {
            n = n.trim(),
            n.length > 0 && n.split(Td).forEach(o => {
                r ? this._renderer.addClass(this._ngEl.nativeElement, o) : this._renderer.removeClass(this._ngEl.nativeElement, o)
            }
            )
        }
        static \u0275fac = function(r) {
            return new (r || e)(U(Me),U(St))
        }
        ;
        static \u0275dir = ye({
            type: e,
            selectors: [["", "ngClass", ""]],
            inputs: {
                klass: [0, "class", "klass"],
                ngClass: "ngClass"
            }
        })
    }
    return e
}
)();
var mb = ( () => {
    class e {
        _ngEl;
        _differs;
        _renderer;
        _ngStyle = null;
        _differ = null;
        constructor(n, r, o) {
            this._ngEl = n,
            this._differs = r,
            this._renderer = o
        }
        set ngStyle(n) {
            this._ngStyle = n,
            !this._differ && n && (this._differ = this._differs.find(n).create())
        }
        ngDoCheck() {
            if (this._differ) {
                let n = this._differ.diff(this._ngStyle);
                n && this._applyChanges(n)
            }
        }
        _setStyle(n, r) {
            let[o,i] = n.split(".")
              , s = o.indexOf("-") === -1 ? void 0 : Ze.DashCase;
            r != null ? this._renderer.setStyle(this._ngEl.nativeElement, o, i ? `${r}${i}` : r, s) : this._renderer.removeStyle(this._ngEl.nativeElement, o, s)
        }
        _applyChanges(n) {
            n.forEachRemovedItem(r => this._setStyle(r.key, null)),
            n.forEachAddedItem(r => this._setStyle(r.key, r.currentValue)),
            n.forEachChangedItem(r => this._setStyle(r.key, r.currentValue))
        }
        static \u0275fac = function(r) {
            return new (r || e)(U(Me),U(_d),U(St))
        }
        ;
        static \u0275dir = ye({
            type: e,
            selectors: [["", "ngStyle", ""]],
            inputs: {
                ngStyle: "ngStyle"
            }
        })
    }
    return e
}
)();
function yb(e, t) {
    return new y(2100,!1)
}
var vb = /(?:[0-9A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])\S*/g
  , Db = ( () => {
    class e {
        transform(n) {
            if (n == null)
                return null;
            if (typeof n != "string")
                throw yb(e, n);
            return n.replace(vb, r => r[0].toUpperCase() + r.slice(1).toLowerCase())
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275pipe = sd({
            name: "titlecase",
            type: e,
            pure: !0
        })
    }
    return e
}
)();
var Qm = ( () => {
    class e {
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275mod = Pe({
            type: e
        });
        static \u0275inj = _e({})
    }
    return e
}
)();
function Go(e, t) {
    t = encodeURIComponent(t);
    for (let n of e.split(";")) {
        let r = n.indexOf("=")
          , [o,i] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
        if (o.trim() === t)
            return decodeURIComponent(i)
    }
    return null
}
var Vn = class {
}
;
var Km = "browser";
var Nd = ( () => {
    class e {
        static \u0275prov = D({
            token: e,
            providedIn: "root",
            factory: () => new Ad(p($),window)
        })
    }
    return e
}
)()
  , Ad = class {
    document;
    window;
    offset = () => [0, 0];
    constructor(t, n) {
        this.document = t,
        this.window = n
    }
    setOffset(t) {
        Array.isArray(t) ? this.offset = () => t : this.offset = t
    }
    getScrollPosition() {
        return [this.window.scrollX, this.window.scrollY]
    }
    scrollToPosition(t, n) {
        this.window.scrollTo(R(g({}, n), {
            left: t[0],
            top: t[1]
        }))
    }
    scrollToAnchor(t, n) {
        let r = Cb(this.document, t);
        r && (this.scrollToElement(r, n),
        r.focus())
    }
    setHistoryScrollRestoration(t) {
        try {
            this.window.history.scrollRestoration = t
        } catch {
            console.warn(xe(2400, !1))
        }
    }
    scrollToElement(t, n) {
        let r = t.getBoundingClientRect()
          , o = r.left + this.window.pageXOffset
          , i = r.top + this.window.pageYOffset
          , s = this.offset();
        this.window.scrollTo(R(g({}, n), {
            left: o - s[0],
            top: i - s[1]
        }))
    }
}
;
function Cb(e, t) {
    let n = e.getElementById(t) || e.getElementsByName(t)[0];
    if (n)
        return n;
    if (typeof e.createTreeWalker == "function" && e.body && typeof e.body.attachShadow == "function") {
        let r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT)
          , o = r.currentNode;
        for (; o; ) {
            let i = o.shadowRoot;
            if (i) {
                let s = i.getElementById(t) || i.querySelector(`[name="${t}"]`);
                if (s)
                    return s
            }
            o = r.nextNode()
        }
    }
    return null
}
var Wo = class {
    _doc;
    constructor(t) {
        this._doc = t
    }
    manager
}
  , pa = ( () => {
    class e extends Wo {
        constructor(n) {
            super(n)
        }
        supports(n) {
            return !0
        }
        addEventListener(n, r, o, i) {
            return n.addEventListener(r, o, i),
            () => this.removeEventListener(n, r, o, i)
        }
        removeEventListener(n, r, o, i) {
            return n.removeEventListener(r, o, i)
        }
        static \u0275fac = function(r) {
            return new (r || e)(I($))
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac
        })
    }
    return e
}
)()
  , ya = new v("")
  , Fd = ( () => {
    class e {
        _zone;
        _plugins;
        _eventNameToPlugin = new Map;
        constructor(n, r) {
            this._zone = r,
            n.forEach(s => {
                s.manager = this
            }
            );
            let o = n.filter(s => !(s instanceof pa));
            this._plugins = o.slice().reverse();
            let i = n.find(s => s instanceof pa);
            i && this._plugins.push(i)
        }
        addEventListener(n, r, o, i) {
            return this._findPluginFor(r).addEventListener(n, r, o, i)
        }
        getZone() {
            return this._zone
        }
        _findPluginFor(n) {
            let r = this._eventNameToPlugin.get(n);
            if (r)
                return r;
            if (r = this._plugins.find(i => i.supports(n)),
            !r)
                throw new y(5101,!1);
            return this._eventNameToPlugin.set(n, r),
            r
        }
        static \u0275fac = function(r) {
            return new (r || e)(I(ya),I(fe))
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac
        })
    }
    return e
}
)()
  , Rd = "ng-app-id";
function Jm(e) {
    for (let t of e)
        t.remove()
}
function Xm(e, t) {
    let n = t.createElement("style");
    return n.textContent = e,
    n
}
function Ib(e, t, n, r) {
    let o = e.head?.querySelectorAll(`style[${Rd}="${t}"],link[${Rd}="${t}"]`);
    if (o)
        for (let i of o)
            i.removeAttribute(Rd),
            i instanceof HTMLLinkElement ? r.set(i.href.slice(i.href.lastIndexOf("/") + 1), {
                usage: 0,
                elements: [i]
            }) : i.textContent && n.set(i.textContent, {
                usage: 0,
                elements: [i]
            })
}
function Od(e, t) {
    let n = t.createElement("link");
    return n.setAttribute("rel", "stylesheet"),
    n.setAttribute("href", e),
    n
}
var kd = ( () => {
    class e {
        doc;
        appId;
        nonce;
        inline = new Map;
        external = new Map;
        hosts = new Set;
        constructor(n, r, o, i={}) {
            this.doc = n,
            this.appId = r,
            this.nonce = o,
            Ib(n, r, this.inline, this.external),
            this.hosts.add(n.head)
        }
        addStyles(n, r) {
            for (let o of n)
                this.addUsage(o, this.inline, Xm);
            r?.forEach(o => this.addUsage(o, this.external, Od))
        }
        removeStyles(n, r) {
            for (let o of n)
                this.removeUsage(o, this.inline);
            r?.forEach(o => this.removeUsage(o, this.external))
        }
        addUsage(n, r, o) {
            let i = r.get(n);
            i ? i.usage++ : r.set(n, {
                usage: 1,
                elements: [...this.hosts].map(s => this.addElement(s, o(n, this.doc)))
            })
        }
        removeUsage(n, r) {
            let o = r.get(n);
            o && (o.usage--,
            o.usage <= 0 && (Jm(o.elements),
            r.delete(n)))
        }
        ngOnDestroy() {
            for (let[,{elements: n}] of [...this.inline, ...this.external])
                Jm(n);
            this.hosts.clear()
        }
        addHost(n) {
            this.hosts.add(n);
            for (let[r,{elements: o}] of this.inline)
                o.push(this.addElement(n, Xm(r, this.doc)));
            for (let[r,{elements: o}] of this.external)
                o.push(this.addElement(n, Od(r, this.doc)))
        }
        removeHost(n) {
            this.hosts.delete(n)
        }
        addElement(n, r) {
            return this.nonce && r.setAttribute("nonce", this.nonce),
            n.appendChild(r)
        }
        static \u0275fac = function(r) {
            return new (r || e)(I($),I(zs),I(Ws, 8),I(No))
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac
        })
    }
    return e
}
)()
  , xd = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/Math/MathML"
}
  , Pd = /%COMP%/g;
var ty = "%COMP%"
  , wb = `_nghost-${ty}`
  , _b = `_ngcontent-${ty}`
  , bb = !0
  , Mb = new v("",{
    factory: () => bb
});
function Tb(e) {
    return _b.replace(Pd, e)
}
function Sb(e) {
    return wb.replace(Pd, e)
}
function ny(e, t) {
    return t.map(n => n.replace(Pd, e))
}
var Ld = ( () => {
    class e {
        eventManager;
        sharedStylesHost;
        appId;
        removeStylesOnCompDestroy;
        doc;
        ngZone;
        nonce;
        tracingService;
        rendererByCompId = new Map;
        defaultRenderer;
        constructor(n, r, o, i, s, a, c=null, u=null) {
            this.eventManager = n,
            this.sharedStylesHost = r,
            this.appId = o,
            this.removeStylesOnCompDestroy = i,
            this.doc = s,
            this.ngZone = a,
            this.nonce = c,
            this.tracingService = u,
            this.defaultRenderer = new qo(n,s,a,this.tracingService)
        }
        createRenderer(n, r) {
            if (!n || !r)
                return this.defaultRenderer;
            let o = this.getOrCreateRenderer(n, r);
            return o instanceof ma ? o.applyToHost(n) : o instanceof Zo && o.applyStyles(),
            o
        }
        getOrCreateRenderer(n, r) {
            let o = this.rendererByCompId
              , i = o.get(r.id);
            if (!i) {
                let s = this.doc
                  , a = this.ngZone
                  , c = this.eventManager
                  , u = this.sharedStylesHost
                  , l = this.removeStylesOnCompDestroy
                  , d = this.tracingService;
                switch (r.encapsulation) {
                case qe.Emulated:
                    i = new ma(c,u,r,this.appId,l,s,a,d);
                    break;
                case qe.ShadowDom:
                    return new ga(c,n,r,s,a,this.nonce,d,u);
                case qe.ExperimentalIsolatedShadowDom:
                    return new ga(c,n,r,s,a,this.nonce,d);
                default:
                    i = new Zo(c,u,r,l,s,a,d);
                    break
                }
                o.set(r.id, i)
            }
            return i
        }
        ngOnDestroy() {
            this.rendererByCompId.clear()
        }
        componentReplaced(n) {
            this.rendererByCompId.delete(n)
        }
        static \u0275fac = function(r) {
            return new (r || e)(I(Fd),I(kd),I(zs),I(Mb),I($),I(fe),I(Ws),I(Tt, 8))
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac
        })
    }
    return e
}
)()
  , qo = class {
    eventManager;
    doc;
    ngZone;
    tracingService;
    data = Object.create(null);
    throwOnSyntheticProps = !0;
    constructor(t, n, r, o) {
        this.eventManager = t,
        this.doc = n,
        this.ngZone = r,
        this.tracingService = o
    }
    destroy() {}
    destroyNode = null;
    createElement(t, n) {
        return n ? this.doc.createElementNS(xd[n] || n, t) : this.doc.createElement(t)
    }
    createComment(t) {
        return this.doc.createComment(t)
    }
    createText(t) {
        return this.doc.createTextNode(t)
    }
    appendChild(t, n) {
        (ey(t) ? t.content : t).appendChild(n)
    }
    insertBefore(t, n, r) {
        t && (ey(t) ? t.content : t).insertBefore(n, r)
    }
    removeChild(t, n) {
        n.remove()
    }
    selectRootElement(t, n) {
        let r = typeof t == "string" ? this.doc.querySelector(t) : t;
        if (!r)
            throw new y(-5104,!1);
        return n || (r.textContent = ""),
        r
    }
    parentNode(t) {
        return t.parentNode
    }
    nextSibling(t) {
        return t.nextSibling
    }
    setAttribute(t, n, r, o) {
        if (o) {
            n = o + ":" + n;
            let i = xd[o];
            i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r)
        } else
            t.setAttribute(n, r)
    }
    removeAttribute(t, n, r) {
        if (r) {
            let o = xd[r];
            o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`)
        } else
            t.removeAttribute(n)
    }
    addClass(t, n) {
        t.classList.add(n)
    }
    removeClass(t, n) {
        t.classList.remove(n)
    }
    setStyle(t, n, r, o) {
        o & (Ze.DashCase | Ze.Important) ? t.style.setProperty(n, r, o & Ze.Important ? "important" : "") : t.style[n] = r
    }
    removeStyle(t, n, r) {
        r & Ze.DashCase ? t.style.removeProperty(n) : t.style[n] = ""
    }
    setProperty(t, n, r) {
        t != null && (t[n] = r)
    }
    setValue(t, n) {
        t.nodeValue = n
    }
    listen(t, n, r, o) {
        if (typeof t == "string" && (t = Le().getGlobalEventTarget(this.doc, t),
        !t))
            throw new y(5102,!1);
        let i = this.decoratePreventDefault(r);
        return this.tracingService?.wrapEventListener && (i = this.tracingService.wrapEventListener(t, n, i)),
        this.eventManager.addEventListener(t, n, i, o)
    }
    decoratePreventDefault(t) {
        return n => {
            if (n === "__ngUnwrap__")
                return t;
            t(n) === !1 && n.preventDefault()
        }
    }
}
;
function ey(e) {
    return e.tagName === "TEMPLATE" && e.content !== void 0
}
var ga = class extends qo {
    hostEl;
    sharedStylesHost;
    shadowRoot;
    constructor(t, n, r, o, i, s, a, c) {
        super(t, o, i, a),
        this.hostEl = n,
        this.sharedStylesHost = c,
        this.shadowRoot = n.attachShadow({
            mode: "open"
        }),
        this.sharedStylesHost && this.sharedStylesHost.addHost(this.shadowRoot);
        let u = r.styles;
        u = ny(r.id, u);
        for (let d of u) {
            let h = document.createElement("style");
            s && h.setAttribute("nonce", s),
            h.textContent = d,
            this.shadowRoot.appendChild(h)
        }
        let l = r.getExternalStyles?.();
        if (l)
            for (let d of l) {
                let h = Od(d, o);
                s && h.setAttribute("nonce", s),
                this.shadowRoot.appendChild(h)
            }
    }
    nodeOrShadowRoot(t) {
        return t === this.hostEl ? this.shadowRoot : t
    }
    appendChild(t, n) {
        return super.appendChild(this.nodeOrShadowRoot(t), n)
    }
    insertBefore(t, n, r) {
        return super.insertBefore(this.nodeOrShadowRoot(t), n, r)
    }
    removeChild(t, n) {
        return super.removeChild(null, n)
    }
    parentNode(t) {
        return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)))
    }
    destroy() {
        this.sharedStylesHost && this.sharedStylesHost.removeHost(this.shadowRoot)
    }
}
  , Zo = class extends qo {
    sharedStylesHost;
    removeStylesOnCompDestroy;
    styles;
    styleUrls;
    constructor(t, n, r, o, i, s, a, c) {
        super(t, i, s, a),
        this.sharedStylesHost = n,
        this.removeStylesOnCompDestroy = o;
        let u = r.styles;
        this.styles = c ? ny(c, u) : u,
        this.styleUrls = r.getExternalStyles?.(c)
    }
    applyStyles() {
        this.sharedStylesHost.addStyles(this.styles, this.styleUrls)
    }
    destroy() {
        this.removeStylesOnCompDestroy && Rn.size === 0 && this.sharedStylesHost.removeStyles(this.styles, this.styleUrls)
    }
}
  , ma = class extends Zo {
    contentAttr;
    hostAttr;
    constructor(t, n, r, o, i, s, a, c) {
        let u = o + "-" + r.id;
        super(t, n, r, i, s, a, c, u),
        this.contentAttr = Tb(u),
        this.hostAttr = Sb(u)
    }
    applyToHost(t) {
        this.applyStyles(),
        this.setAttribute(t, this.hostAttr, "")
    }
    createElement(t, n) {
        let r = super.createElement(t, n);
        return super.setAttribute(r, this.contentAttr, ""),
        r
    }
}
;
var va = class e extends zo {
    supportsDOMEvents = !0;
    static makeCurrent() {
        bd(new e)
    }
    onAndCancel(t, n, r, o) {
        return t.addEventListener(n, r, o),
        () => {
            t.removeEventListener(n, r, o)
        }
    }
    dispatchEvent(t, n) {
        t.dispatchEvent(n)
    }
    remove(t) {
        t.remove()
    }
    createElement(t, n) {
        return n = n || this.getDefaultDocument(),
        n.createElement(t)
    }
    createHtmlDocument() {
        return document.implementation.createHTMLDocument("fakeTitle")
    }
    getDefaultDocument() {
        return document
    }
    isElementNode(t) {
        return t.nodeType === Node.ELEMENT_NODE
    }
    isShadowRoot(t) {
        return t instanceof DocumentFragment
    }
    getGlobalEventTarget(t, n) {
        return n === "window" ? window : n === "document" ? t : n === "body" ? t.body : null
    }
    getBaseHref(t) {
        let n = Ab();
        return n == null ? null : Nb(n)
    }
    resetBaseElement() {
        Yo = null
    }
    getUserAgent() {
        return window.navigator.userAgent
    }
    getCookie(t) {
        return Go(document.cookie, t)
    }
}
  , Yo = null;
function Ab() {
    return Yo = Yo || document.head.querySelector("base"),
    Yo ? Yo.getAttribute("href") : null
}
function Nb(e) {
    return new URL(e,document.baseURI).pathname
}
var Rb = ( () => {
    class e {
        build() {
            return new XMLHttpRequest
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac
        })
    }
    return e
}
)()
  , ry = ["alt", "control", "meta", "shift"]
  , xb = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS"
}
  , Ob = {
    alt: e => e.altKey,
    control: e => e.ctrlKey,
    meta: e => e.metaKey,
    shift: e => e.shiftKey
}
  , oy = ( () => {
    class e extends Wo {
        constructor(n) {
            super(n)
        }
        supports(n) {
            return e.parseEventName(n) != null
        }
        addEventListener(n, r, o, i) {
            let s = e.parseEventName(r)
              , a = e.eventCallback(s.fullKey, o, this.manager.getZone());
            return this.manager.getZone().runOutsideAngular( () => Le().onAndCancel(n, s.domEventName, a, i))
        }
        static parseEventName(n) {
            let r = n.toLowerCase().split(".")
              , o = r.shift();
            if (r.length === 0 || !(o === "keydown" || o === "keyup"))
                return null;
            let i = e._normalizeKey(r.pop())
              , s = ""
              , a = r.indexOf("code");
            if (a > -1 && (r.splice(a, 1),
            s = "code."),
            ry.forEach(u => {
                let l = r.indexOf(u);
                l > -1 && (r.splice(l, 1),
                s += u + ".")
            }
            ),
            s += i,
            r.length != 0 || i.length === 0)
                return null;
            let c = {};
            return c.domEventName = o,
            c.fullKey = s,
            c
        }
        static matchEventFullKeyCode(n, r) {
            let o = xb[n.key] || n.key
              , i = "";
            return r.indexOf("code.") > -1 && (o = n.code,
            i = "code."),
            o == null || !o ? !1 : (o = o.toLowerCase(),
            o === " " ? o = "space" : o === "." && (o = "dot"),
            ry.forEach(s => {
                if (s !== o) {
                    let a = Ob[s];
                    a(n) && (i += s + ".")
                }
            }
            ),
            i += o,
            i === r)
        }
        static eventCallback(n, r, o) {
            return i => {
                e.matchEventFullKeyCode(i, n) && o.runGuarded( () => r(i))
            }
        }
        static _normalizeKey(n) {
            return n === "esc" ? "escape" : n
        }
        static \u0275fac = function(r) {
            return new (r || e)(I($))
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac
        })
    }
    return e
}
)();
async function Fb(e, t, n) {
    let r = g({
        rootComponent: e
    }, kb(t, n));
    return $m(r)
}
function kb(e, t) {
    return {
        platformRef: t?.platformRef,
        appProviders: [...Bb, ...e?.providers ?? []],
        platformProviders: Vb
    }
}
function Pb() {
    va.makeCurrent()
}
function Lb() {
    return new Re
}
function jb() {
    return Pl(document),
    document
}
var Vb = [{
    provide: No,
    useValue: Km
}, {
    provide: Gs,
    useValue: Pb,
    multi: !0
}, {
    provide: $,
    useFactory: jb
}];
var Bb = [{
    provide: ho,
    useValue: "root"
}, {
    provide: Re,
    useFactory: Lb
}, {
    provide: ya,
    useClass: pa,
    multi: !0
}, {
    provide: ya,
    useClass: oy,
    multi: !0
}, Ld, kd, Fd, {
    provide: xn,
    useExisting: Ld
}, {
    provide: Vn,
    useClass: Rb
}, []];
var tn = class e {
    headers;
    normalizedNames = new Map;
    lazyInit;
    lazyUpdate = null;
    constructor(t) {
        t ? typeof t == "string" ? this.lazyInit = () => {
            this.headers = new Map,
            t.split(`
`).forEach(n => {
                let r = n.indexOf(":");
                if (r > 0) {
                    let o = n.slice(0, r)
                      , i = n.slice(r + 1).trim();
                    this.addHeaderEntry(o, i)
                }
            }
            )
        }
        : typeof Headers < "u" && t instanceof Headers ? (this.headers = new Map,
        t.forEach( (n, r) => {
            this.addHeaderEntry(r, n)
        }
        )) : this.lazyInit = () => {
            this.headers = new Map,
            Object.entries(t).forEach( ([n,r]) => {
                this.setHeaderEntries(n, r)
            }
            )
        }
        : this.headers = new Map
    }
    has(t) {
        return this.init(),
        this.headers.has(t.toLowerCase())
    }
    get(t) {
        this.init();
        let n = this.headers.get(t.toLowerCase());
        return n && n.length > 0 ? n[0] : null
    }
    keys() {
        return this.init(),
        Array.from(this.normalizedNames.values())
    }
    getAll(t) {
        return this.init(),
        this.headers.get(t.toLowerCase()) || null
    }
    append(t, n) {
        return this.clone({
            name: t,
            value: n,
            op: "a"
        })
    }
    set(t, n) {
        return this.clone({
            name: t,
            value: n,
            op: "s"
        })
    }
    delete(t, n) {
        return this.clone({
            name: t,
            value: n,
            op: "d"
        })
    }
    maybeSetNormalizedName(t, n) {
        this.normalizedNames.has(n) || this.normalizedNames.set(n, t)
    }
    init() {
        this.lazyInit && (this.lazyInit instanceof e ? this.copyFrom(this.lazyInit) : this.lazyInit(),
        this.lazyInit = null,
        this.lazyUpdate && (this.lazyUpdate.forEach(t => this.applyUpdate(t)),
        this.lazyUpdate = null))
    }
    copyFrom(t) {
        t.init(),
        Array.from(t.headers.keys()).forEach(n => {
            this.headers.set(n, t.headers.get(n)),
            this.normalizedNames.set(n, t.normalizedNames.get(n))
        }
        )
    }
    clone(t) {
        let n = new e;
        return n.lazyInit = this.lazyInit && this.lazyInit instanceof e ? this.lazyInit : this,
        n.lazyUpdate = (this.lazyUpdate || []).concat([t]),
        n
    }
    applyUpdate(t) {
        let n = t.name.toLowerCase();
        switch (t.op) {
        case "a":
        case "s":
            let r = t.value;
            if (typeof r == "string" && (r = [r]),
            r.length === 0)
                return;
            this.maybeSetNormalizedName(t.name, n);
            let o = (t.op === "a" ? this.headers.get(n) : void 0) || [];
            o.push(...r),
            this.headers.set(n, o);
            break;
        case "d":
            let i = t.value;
            if (!i)
                this.headers.delete(n),
                this.normalizedNames.delete(n);
            else {
                let s = this.headers.get(n);
                if (!s)
                    return;
                s = s.filter(a => i.indexOf(a) === -1),
                s.length === 0 ? (this.headers.delete(n),
                this.normalizedNames.delete(n)) : this.headers.set(n, s)
            }
            break
        }
    }
    addHeaderEntry(t, n) {
        let r = t.toLowerCase();
        this.maybeSetNormalizedName(t, r),
        this.headers.has(r) ? this.headers.get(r).push(n) : this.headers.set(r, [n])
    }
    setHeaderEntries(t, n) {
        let r = (Array.isArray(n) ? n : [n]).map(i => i.toString())
          , o = t.toLowerCase();
        this.headers.set(o, r),
        this.maybeSetNormalizedName(t, o)
    }
    forEach(t) {
        this.init(),
        Array.from(this.normalizedNames.keys()).forEach(n => t(this.normalizedNames.get(n), this.headers.get(n)))
    }
}
;
var Ea = class {
    map = new Map;
    set(t, n) {
        return this.map.set(t, n),
        this
    }
    get(t) {
        return this.map.has(t) || this.map.set(t, t.defaultValue()),
        this.map.get(t)
    }
    delete(t) {
        return this.map.delete(t),
        this
    }
    has(t) {
        return this.map.has(t)
    }
    keys() {
        return this.map.keys()
    }
}
  , Ca = class {
    encodeKey(t) {
        return iy(t)
    }
    encodeValue(t) {
        return iy(t)
    }
    decodeKey(t) {
        return decodeURIComponent(t)
    }
    decodeValue(t) {
        return decodeURIComponent(t)
    }
}
;
function Ub(e, t) {
    let n = new Map;
    return e.length > 0 && e.replace(/^\?/, "").split("&").forEach(o => {
        let i = o.indexOf("=")
          , [s,a] = i == -1 ? [t.decodeKey(o), ""] : [t.decodeKey(o.slice(0, i)), t.decodeValue(o.slice(i + 1))]
          , c = n.get(s) || [];
        c.push(a),
        n.set(s, c)
    }
    ),
    n
}
var Hb = /%(\d[a-f0-9])/gi
  , $b = {
    40: "@",
    "3A": ":",
    24: "$",
    "2C": ",",
    "3B": ";",
    "3D": "=",
    "3F": "?",
    "2F": "/"
};
function iy(e) {
    return encodeURIComponent(e).replace(Hb, (t, n) => $b[n] ?? t)
}
function Da(e) {
    return `${e}`
}
var Rt = class e {
    map;
    encoder;
    updates = null;
    cloneFrom = null;
    constructor(t={}) {
        if (this.encoder = t.encoder || new Ca,
        t.fromString) {
            if (t.fromObject)
                throw new y(2805,!1);
            this.map = Ub(t.fromString, this.encoder)
        } else
            t.fromObject ? (this.map = new Map,
            Object.keys(t.fromObject).forEach(n => {
                let r = t.fromObject[n]
                  , o = Array.isArray(r) ? r.map(Da) : [Da(r)];
                this.map.set(n, o)
            }
            )) : this.map = null
    }
    has(t) {
        return this.init(),
        this.map.has(t)
    }
    get(t) {
        this.init();
        let n = this.map.get(t);
        return n ? n[0] : null
    }
    getAll(t) {
        return this.init(),
        this.map.get(t) || null
    }
    keys() {
        return this.init(),
        Array.from(this.map.keys())
    }
    append(t, n) {
        return this.clone({
            param: t,
            value: n,
            op: "a"
        })
    }
    appendAll(t) {
        let n = [];
        return Object.keys(t).forEach(r => {
            let o = t[r];
            Array.isArray(o) ? o.forEach(i => {
                n.push({
                    param: r,
                    value: i,
                    op: "a"
                })
            }
            ) : n.push({
                param: r,
                value: o,
                op: "a"
            })
        }
        ),
        this.clone(n)
    }
    set(t, n) {
        return this.clone({
            param: t,
            value: n,
            op: "s"
        })
    }
    delete(t, n) {
        return this.clone({
            param: t,
            value: n,
            op: "d"
        })
    }
    toString() {
        return this.init(),
        this.keys().map(t => {
            let n = this.encoder.encodeKey(t);
            return this.map.get(t).map(r => n + "=" + this.encoder.encodeValue(r)).join("&")
        }
        ).filter(t => t !== "").join("&")
    }
    clone(t) {
        let n = new e({
            encoder: this.encoder
        });
        return n.cloneFrom = this.cloneFrom || this,
        n.updates = (this.updates || []).concat(t),
        n
    }
    init() {
        this.map === null && (this.map = new Map),
        this.cloneFrom !== null && (this.cloneFrom.init(),
        this.cloneFrom.keys().forEach(t => this.map.set(t, this.cloneFrom.map.get(t))),
        this.updates.forEach(t => {
            switch (t.op) {
            case "a":
            case "s":
                let n = (t.op === "a" ? this.map.get(t.param) : void 0) || [];
                n.push(Da(t.value)),
                this.map.set(t.param, n);
                break;
            case "d":
                if (t.value !== void 0) {
                    let r = this.map.get(t.param) || []
                      , o = r.indexOf(Da(t.value));
                    o !== -1 && r.splice(o, 1),
                    r.length > 0 ? this.map.set(t.param, r) : this.map.delete(t.param)
                } else {
                    this.map.delete(t.param);
                    break
                }
            }
        }
        ),
        this.cloneFrom = this.updates = null)
    }
}
;
function zb(e) {
    switch (e) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "JSONP":
        return !1;
    default:
        return !0
    }
}
function sy(e) {
    return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer
}
function ay(e) {
    return typeof Blob < "u" && e instanceof Blob
}
function cy(e) {
    return typeof FormData < "u" && e instanceof FormData
}
function Gb(e) {
    return typeof URLSearchParams < "u" && e instanceof URLSearchParams
}
var uy = "Content-Type"
  , ly = "Accept"
  , dy = "text/plain"
  , fy = "application/json"
  , Wb = `${fy}, ${dy}, */*`
  , Sr = class e {
    url;
    body = null;
    headers;
    context;
    reportProgress = !1;
    withCredentials = !1;
    credentials;
    keepalive = !1;
    cache;
    priority;
    mode;
    redirect;
    referrer;
    integrity;
    referrerPolicy;
    responseType = "json";
    method;
    params;
    urlWithParams;
    transferCache;
    timeout;
    constructor(t, n, r, o) {
        this.url = n,
        this.method = t.toUpperCase();
        let i;
        if (zb(this.method) || o ? (this.body = r !== void 0 ? r : null,
        i = o) : i = r,
        i) {
            if (this.reportProgress = !!i.reportProgress,
            this.withCredentials = !!i.withCredentials,
            this.keepalive = !!i.keepalive,
            i.responseType && (this.responseType = i.responseType),
            i.headers && (this.headers = i.headers),
            i.context && (this.context = i.context),
            i.params && (this.params = i.params),
            i.priority && (this.priority = i.priority),
            i.cache && (this.cache = i.cache),
            i.credentials && (this.credentials = i.credentials),
            typeof i.timeout == "number") {
                if (i.timeout < 1 || !Number.isInteger(i.timeout))
                    throw new y(2822,"");
                this.timeout = i.timeout
            }
            i.mode && (this.mode = i.mode),
            i.redirect && (this.redirect = i.redirect),
            i.integrity && (this.integrity = i.integrity),
            i.referrer && (this.referrer = i.referrer),
            i.referrerPolicy && (this.referrerPolicy = i.referrerPolicy),
            this.transferCache = i.transferCache
        }
        if (this.headers ??= new tn,
        this.context ??= new Ea,
        !this.params)
            this.params = new Rt,
            this.urlWithParams = n;
        else {
            let s = this.params.toString();
            if (s.length === 0)
                this.urlWithParams = n;
            else {
                let a = n.indexOf("?")
                  , c = a === -1 ? "?" : a < n.length - 1 ? "&" : "";
                this.urlWithParams = n + c + s
            }
        }
    }
    serializeBody() {
        return this.body === null ? null : typeof this.body == "string" || sy(this.body) || ay(this.body) || cy(this.body) || Gb(this.body) ? this.body : this.body instanceof Rt ? this.body.toString() : typeof this.body == "object" || typeof this.body == "boolean" || Array.isArray(this.body) ? JSON.stringify(this.body) : this.body.toString()
    }
    detectContentTypeHeader() {
        return this.body === null || cy(this.body) ? null : ay(this.body) ? this.body.type || null : sy(this.body) ? null : typeof this.body == "string" ? dy : this.body instanceof Rt ? "application/x-www-form-urlencoded;charset=UTF-8" : typeof this.body == "object" || typeof this.body == "number" || typeof this.body == "boolean" ? fy : null
    }
    clone(t={}) {
        let n = t.method || this.method
          , r = t.url || this.url
          , o = t.responseType || this.responseType
          , i = t.keepalive ?? this.keepalive
          , s = t.priority || this.priority
          , a = t.cache || this.cache
          , c = t.mode || this.mode
          , u = t.redirect || this.redirect
          , l = t.credentials || this.credentials
          , d = t.referrer || this.referrer
          , h = t.integrity || this.integrity
          , f = t.referrerPolicy || this.referrerPolicy
          , m = t.transferCache ?? this.transferCache
          , w = t.timeout ?? this.timeout
          , E = t.body !== void 0 ? t.body : this.body
          , C = t.withCredentials ?? this.withCredentials
          , W = t.reportProgress ?? this.reportProgress
          , Ae = t.headers || this.headers
          , ie = t.params || this.params
          , Wr = t.context ?? this.context;
        return t.setHeaders !== void 0 && (Ae = Object.keys(t.setHeaders).reduce( (qr, sn) => qr.set(sn, t.setHeaders[sn]), Ae)),
        t.setParams && (ie = Object.keys(t.setParams).reduce( (qr, sn) => qr.set(sn, t.setParams[sn]), ie)),
        new e(n,r,E,{
            params: ie,
            headers: Ae,
            context: Wr,
            reportProgress: W,
            responseType: o,
            withCredentials: C,
            transferCache: m,
            keepalive: i,
            cache: a,
            priority: s,
            timeout: w,
            mode: c,
            redirect: u,
            credentials: l,
            referrer: d,
            integrity: h,
            referrerPolicy: f
        })
    }
}
  , Bn = (function(e) {
    return e[e.Sent = 0] = "Sent",
    e[e.UploadProgress = 1] = "UploadProgress",
    e[e.ResponseHeader = 2] = "ResponseHeader",
    e[e.DownloadProgress = 3] = "DownloadProgress",
    e[e.Response = 4] = "Response",
    e[e.User = 5] = "User",
    e
}
)(Bn || {})
  , Nr = class {
    headers;
    status;
    statusText;
    url;
    ok;
    type;
    redirected;
    responseType;
    constructor(t, n=200, r="OK") {
        this.headers = t.headers || new tn,
        this.status = t.status !== void 0 ? t.status : n,
        this.statusText = t.statusText || r,
        this.url = t.url || null,
        this.redirected = t.redirected,
        this.responseType = t.responseType,
        this.ok = this.status >= 200 && this.status < 300
    }
}
  , Ia = class e extends Nr {
    constructor(t={}) {
        super(t)
    }
    type = Bn.ResponseHeader;
    clone(t={}) {
        return new e({
            headers: t.headers || this.headers,
            status: t.status !== void 0 ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0
        })
    }
}
  , Qo = class e extends Nr {
    body;
    constructor(t={}) {
        super(t),
        this.body = t.body !== void 0 ? t.body : null
    }
    type = Bn.Response;
    clone(t={}) {
        return new e({
            body: t.body !== void 0 ? t.body : this.body,
            headers: t.headers || this.headers,
            status: t.status !== void 0 ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
            redirected: t.redirected ?? this.redirected,
            responseType: t.responseType ?? this.responseType
        })
    }
}
  , Ar = class extends Nr {
    name = "HttpErrorResponse";
    message;
    error;
    ok = !1;
    constructor(t) {
        super(t, 0, "Unknown Error"),
        this.status >= 200 && this.status < 300 ? this.message = `Http failure during parsing for ${t.url || "(unknown url)"}` : this.message = `Http failure response for ${t.url || "(unknown url)"}: ${t.status} ${t.statusText}`,
        this.error = t.error || null
    }
}
  , qb = 200
  , Zb = 204;
var Yb = new v("");
var Qb = /^\)\]\}',?\n/;
var Vd = ( () => {
    class e {
        xhrFactory;
        tracingService = p(Tt, {
            optional: !0
        });
        constructor(n) {
            this.xhrFactory = n
        }
        maybePropagateTrace(n) {
            return this.tracingService?.propagate ? this.tracingService.propagate(n) : n
        }
        handle(n) {
            if (n.method === "JSONP")
                throw new y(-2800,!1);
            let r = this.xhrFactory;
            return A(null).pipe(Ne( () => new O(i => {
                let s = r.build();
                if (s.open(n.method, n.urlWithParams),
                n.withCredentials && (s.withCredentials = !0),
                n.headers.forEach( (E, C) => s.setRequestHeader(E, C.join(","))),
                n.headers.has(ly) || s.setRequestHeader(ly, Wb),
                !n.headers.has(uy)) {
                    let E = n.detectContentTypeHeader();
                    E !== null && s.setRequestHeader(uy, E)
                }
                if (n.timeout && (s.timeout = n.timeout),
                n.responseType) {
                    let E = n.responseType.toLowerCase();
                    s.responseType = E !== "json" ? E : "text"
                }
                let a = n.serializeBody()
                  , c = null
                  , u = () => {
                    if (c !== null)
                        return c;
                    let E = s.statusText || "OK"
                      , C = new tn(s.getAllResponseHeaders())
                      , W = s.responseURL || n.url;
                    return c = new Ia({
                        headers: C,
                        status: s.status,
                        statusText: E,
                        url: W
                    }),
                    c
                }
                  , l = this.maybePropagateTrace( () => {
                    let {headers: E, status: C, statusText: W, url: Ae} = u()
                      , ie = null;
                    C !== Zb && (ie = typeof s.response > "u" ? s.responseText : s.response),
                    C === 0 && (C = ie ? qb : 0);
                    let Wr = C >= 200 && C < 300;
                    if (n.responseType === "json" && typeof ie == "string") {
                        let qr = ie;
                        ie = ie.replace(Qb, "");
                        try {
                            ie = ie !== "" ? JSON.parse(ie) : null
                        } catch (sn) {
                            ie = qr,
                            Wr && (Wr = !1,
                            ie = {
                                error: sn,
                                text: ie
                            })
                        }
                    }
                    Wr ? (i.next(new Qo({
                        body: ie,
                        headers: E,
                        status: C,
                        statusText: W,
                        url: Ae || void 0
                    })),
                    i.complete()) : i.error(new Ar({
                        error: ie,
                        headers: E,
                        status: C,
                        statusText: W,
                        url: Ae || void 0
                    }))
                }
                )
                  , d = this.maybePropagateTrace(E => {
                    let {url: C} = u()
                      , W = new Ar({
                        error: E,
                        status: s.status || 0,
                        statusText: s.statusText || "Unknown Error",
                        url: C || void 0
                    });
                    i.error(W)
                }
                )
                  , h = d;
                n.timeout && (h = this.maybePropagateTrace(E => {
                    let {url: C} = u()
                      , W = new Ar({
                        error: new DOMException("Request timed out","TimeoutError"),
                        status: s.status || 0,
                        statusText: s.statusText || "Request timeout",
                        url: C || void 0
                    });
                    i.error(W)
                }
                ));
                let f = !1
                  , m = this.maybePropagateTrace(E => {
                    f || (i.next(u()),
                    f = !0);
                    let C = {
                        type: Bn.DownloadProgress,
                        loaded: E.loaded
                    };
                    E.lengthComputable && (C.total = E.total),
                    n.responseType === "text" && s.responseText && (C.partialText = s.responseText),
                    i.next(C)
                }
                )
                  , w = this.maybePropagateTrace(E => {
                    let C = {
                        type: Bn.UploadProgress,
                        loaded: E.loaded
                    };
                    E.lengthComputable && (C.total = E.total),
                    i.next(C)
                }
                );
                return s.addEventListener("load", l),
                s.addEventListener("error", d),
                s.addEventListener("timeout", h),
                s.addEventListener("abort", d),
                n.reportProgress && (s.addEventListener("progress", m),
                a !== null && s.upload && s.upload.addEventListener("progress", w)),
                s.send(a),
                i.next({
                    type: Bn.Sent
                }),
                () => {
                    s.removeEventListener("error", d),
                    s.removeEventListener("abort", d),
                    s.removeEventListener("load", l),
                    s.removeEventListener("timeout", h),
                    n.reportProgress && (s.removeEventListener("progress", m),
                    a !== null && s.upload && s.upload.removeEventListener("progress", w)),
                    s.readyState !== s.DONE && s.abort()
                }
            }
            )))
        }
        static \u0275fac = function(r) {
            return new (r || e)(I(Vn))
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)();
function Kb(e, t) {
    return t(e)
}
function Jb(e, t, n) {
    return (r, o) => ne(n, () => t(r, i => e(i, o)))
}
var hy = new v("",{
    factory: () => []
})
  , py = new v("")
  , gy = new v("",{
    factory: () => !0
});
var Bd = ( () => {
    class e {
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: function(r) {
                let o = null;
                return r ? o = new (r || e) : o = I(Vd),
                o
            },
            providedIn: "root"
        })
    }
    return e
}
)();
var wa = ( () => {
    class e {
        backend;
        injector;
        chain = null;
        pendingTasks = p(Eo);
        contributeToStability = p(gy);
        constructor(n, r) {
            this.backend = n,
            this.injector = r
        }
        handle(n) {
            if (this.chain === null) {
                let r = Array.from(new Set([...this.injector.get(hy), ...this.injector.get(py, [])]));
                this.chain = r.reduceRight( (o, i) => Jb(o, i, this.injector), Kb)
            }
            if (this.contributeToStability) {
                let r = this.pendingTasks.add();
                return this.chain(n, o => this.backend.handle(o)).pipe(Jr(r))
            } else
                return this.chain(n, r => this.backend.handle(r))
        }
        static \u0275fac = function(r) {
            return new (r || e)(I(Bd),I(H))
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)()
  , Ud = ( () => {
    class e {
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: function(r) {
                let o = null;
                return r ? o = new (r || e) : o = I(wa),
                o
            },
            providedIn: "root"
        })
    }
    return e
}
)();
function jd(e, t) {
    return {
        body: t,
        headers: e.headers,
        context: e.context,
        observe: e.observe,
        params: e.params,
        reportProgress: e.reportProgress,
        responseType: e.responseType,
        withCredentials: e.withCredentials,
        credentials: e.credentials,
        transferCache: e.transferCache,
        timeout: e.timeout,
        keepalive: e.keepalive,
        priority: e.priority,
        cache: e.cache,
        mode: e.mode,
        redirect: e.redirect,
        integrity: e.integrity,
        referrer: e.referrer,
        referrerPolicy: e.referrerPolicy
    }
}
var my = ( () => {
    class e {
        handler;
        constructor(n) {
            this.handler = n
        }
        request(n, r, o={}) {
            let i;
            if (n instanceof Sr)
                i = n;
            else {
                let c;
                o.headers instanceof tn ? c = o.headers : c = new tn(o.headers);
                let u;
                o.params && (o.params instanceof Rt ? u = o.params : u = new Rt({
                    fromObject: o.params
                })),
                i = new Sr(n,r,o.body !== void 0 ? o.body : null,{
                    headers: c,
                    context: o.context,
                    params: u,
                    reportProgress: o.reportProgress,
                    responseType: o.responseType || "json",
                    withCredentials: o.withCredentials,
                    transferCache: o.transferCache,
                    keepalive: o.keepalive,
                    priority: o.priority,
                    cache: o.cache,
                    mode: o.mode,
                    redirect: o.redirect,
                    credentials: o.credentials,
                    referrer: o.referrer,
                    referrerPolicy: o.referrerPolicy,
                    integrity: o.integrity,
                    timeout: o.timeout
                })
            }
            let s = A(i).pipe(Pt(c => this.handler.handle(c)));
            if (n instanceof Sr || o.observe === "events")
                return s;
            let a = s.pipe(Ie(c => c instanceof Qo));
            switch (o.observe || "body") {
            case "body":
                switch (i.responseType) {
                case "arraybuffer":
                    return a.pipe(j(c => {
                        if (c.body !== null && !(c.body instanceof ArrayBuffer))
                            throw new y(2806,!1);
                        return c.body
                    }
                    ));
                case "blob":
                    return a.pipe(j(c => {
                        if (c.body !== null && !(c.body instanceof Blob))
                            throw new y(2807,!1);
                        return c.body
                    }
                    ));
                case "text":
                    return a.pipe(j(c => {
                        if (c.body !== null && typeof c.body != "string")
                            throw new y(2808,!1);
                        return c.body
                    }
                    ));
                default:
                    return a.pipe(j(c => c.body))
                }
            case "response":
                return a;
            default:
                throw new y(2809,!1)
            }
        }
        delete(n, r={}) {
            return this.request("DELETE", n, r)
        }
        get(n, r={}) {
            return this.request("GET", n, r)
        }
        head(n, r={}) {
            return this.request("HEAD", n, r)
        }
        jsonp(n, r) {
            return this.request("JSONP", n, {
                params: new Rt().append(r, "JSONP_CALLBACK"),
                observe: "body",
                responseType: "json"
            })
        }
        options(n, r={}) {
            return this.request("OPTIONS", n, r)
        }
        patch(n, r, o={}) {
            return this.request("PATCH", n, jd(o, r))
        }
        post(n, r, o={}) {
            return this.request("POST", n, jd(o, r))
        }
        put(n, r, o={}) {
            return this.request("PUT", n, jd(o, r))
        }
        static \u0275fac = function(r) {
            return new (r || e)(I(Ud))
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)();
var Xb = new v("",{
    factory: () => !0
})
  , eM = "XSRF-TOKEN"
  , tM = new v("",{
    factory: () => eM
})
  , nM = "X-XSRF-TOKEN"
  , rM = new v("",{
    factory: () => nM
})
  , oM = ( () => {
    class e {
        cookieName = p(tM);
        doc = p($);
        lastCookieString = "";
        lastToken = null;
        parseCount = 0;
        getToken() {
            let n = this.doc.cookie || "";
            return n !== this.lastCookieString && (this.parseCount++,
            this.lastToken = Go(n, this.cookieName),
            this.lastCookieString = n),
            this.lastToken
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)()
  , yy = ( () => {
    class e {
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: function(r) {
                let o = null;
                return r ? o = new (r || e) : o = I(oM),
                o
            },
            providedIn: "root"
        })
    }
    return e
}
)();
function iM(e, t) {
    if (!p(Xb) || e.method === "GET" || e.method === "HEAD")
        return t(e);
    try {
        let o = p(At).href
          , {origin: i} = new URL(o)
          , {origin: s} = new URL(e.url,i);
        if (i !== s)
            return t(e)
    } catch {
        return t(e)
    }
    let n = p(yy).getToken()
      , r = p(rM);
    return n != null && !e.headers.has(r) && (e = e.clone({
        headers: e.headers.set(r, n)
    })),
    t(e)
}
function sM(...e) {
    let t = [my, wa, {
        provide: Ud,
        useExisting: wa
    }, {
        provide: Bd,
        useFactory: () => p(Yb, {
            optional: !0
        }) ?? p(Vd)
    }, {
        provide: hy,
        useValue: iM,
        multi: !0
    }];
    for (let n of e)
        t.push(...n.\u0275providers);
    return Et(t)
}
var vy = ( () => {
    class e {
        _doc;
        constructor(n) {
            this._doc = n
        }
        getTitle() {
            return this._doc.title
        }
        setTitle(n) {
            this._doc.title = n || ""
        }
        static \u0275fac = function(r) {
            return new (r || e)(I($))
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)();
var aM = ( () => {
    class e {
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: function(r) {
                let o = null;
                return r ? o = new (r || e) : o = I(cM),
                o
            },
            providedIn: "root"
        })
    }
    return e
}
)()
  , cM = ( () => {
    class e extends aM {
        _doc;
        constructor(n) {
            super(),
            this._doc = n
        }
        sanitize(n, r) {
            if (r == null)
                return null;
            switch (n) {
            case Qe.NONE:
                return r;
            case Qe.HTML:
                return bt(r, "HTML") ? Ye(r) : Qs(this._doc, String(r)).toString();
            case Qe.STYLE:
                return bt(r, "Style") ? Ye(r) : r;
            case Qe.SCRIPT:
                if (bt(r, "Script"))
                    return Ye(r);
                throw new y(5200,!1);
            case Qe.URL:
                return bt(r, "URL") ? Ye(r) : Ro(String(r));
            case Qe.RESOURCE_URL:
                if (bt(r, "ResourceURL"))
                    return Ye(r);
                throw new y(5201,!1);
            default:
                throw new y(5202,!1)
            }
        }
        bypassSecurityTrustHtml(n) {
            return Ll(n)
        }
        bypassSecurityTrustStyle(n) {
            return jl(n)
        }
        bypassSecurityTrustScript(n) {
            return Vl(n)
        }
        bypassSecurityTrustUrl(n) {
            return Bl(n)
        }
        bypassSecurityTrustResourceUrl(n) {
            return Ul(n)
        }
        static \u0275fac = function(r) {
            return new (r || e)(I($))
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)();
var S = "primary"
  , si = Symbol("RouteTitle")
  , Wd = class {
    params;
    constructor(t) {
        this.params = t || {}
    }
    has(t) {
        return Object.prototype.hasOwnProperty.call(this.params, t)
    }
    get(t) {
        if (this.has(t)) {
            let n = this.params[t];
            return Array.isArray(n) ? n[0] : n
        }
        return null
    }
    getAll(t) {
        if (this.has(t)) {
            let n = this.params[t];
            return Array.isArray(n) ? n : [n]
        }
        return []
    }
    get keys() {
        return Object.keys(this.params)
    }
}
;
function $n(e) {
    return new Wd(e)
}
function Hd(e, t, n) {
    for (let r = 0; r < e.length; r++) {
        let o = e[r]
          , i = t[r];
        if (o[0] === ":")
            n[o.substring(1)] = i;
        else if (o !== i.path)
            return !1
    }
    return !0
}
function Sy(e, t, n) {
    let r = n.path.split("/")
      , o = r.indexOf("**");
    if (o === -1) {
        if (r.length > e.length || n.pathMatch === "full" && (t.hasChildren() || r.length < e.length))
            return null;
        let c = {}
          , u = e.slice(0, r.length);
        return Hd(r, u, c) ? {
            consumed: u,
            posParams: c
        } : null
    }
    if (o !== r.lastIndexOf("**"))
        return null;
    let i = r.slice(0, o)
      , s = r.slice(o + 1);
    if (i.length + s.length > e.length || n.pathMatch === "full" && t.hasChildren() && n.path !== "**")
        return null;
    let a = {};
    return !Hd(i, e.slice(0, i.length), a) || !Hd(s, e.slice(e.length - s.length), a) ? null : {
        consumed: e,
        posParams: a
    }
}
function Aa(e) {
    return new Promise( (t, n) => {
        e.pipe(gt()).subscribe({
            next: r => t(r),
            error: r => n(r)
        })
    }
    )
}
function lM(e, t) {
    if (e.length !== t.length)
        return !1;
    for (let n = 0; n < e.length; ++n)
        if (!ft(e[n], t[n]))
            return !1;
    return !0
}
function ft(e, t) {
    let n = e ? qd(e) : void 0
      , r = t ? qd(t) : void 0;
    if (!n || !r || n.length != r.length)
        return !1;
    let o;
    for (let i = 0; i < n.length; i++)
        if (o = n[i],
        !Ay(e[o], t[o]))
            return !1;
    return !0
}
function qd(e) {
    return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)]
}
function Ay(e, t) {
    if (Array.isArray(e) && Array.isArray(t)) {
        if (e.length !== t.length)
            return !1;
        let n = [...e].sort()
          , r = [...t].sort();
        return n.every( (o, i) => r[i] === o)
    } else
        return e === t
}
function dM(e) {
    return e.length > 0 ? e[e.length - 1] : null
}
function Gn(e) {
    return Li(e) ? e : Jt(e) ? z(Promise.resolve(e)) : A(e)
}
function Ny(e) {
    return Li(e) ? Aa(e) : Promise.resolve(e)
}
var fM = {
    exact: xy,
    subset: Oy
}
  , Ry = {
    exact: hM,
    subset: pM,
    ignored: () => !0
};
function Dy(e, t, n) {
    return fM[n.paths](e.root, t.root, n.matrixParams) && Ry[n.queryParams](e.queryParams, t.queryParams) && !(n.fragment === "exact" && e.fragment !== t.fragment)
}
function hM(e, t) {
    return ft(e, t)
}
function xy(e, t, n) {
    if (!Un(e.segments, t.segments) || !Ma(e.segments, t.segments, n) || e.numberOfChildren !== t.numberOfChildren)
        return !1;
    for (let r in t.children)
        if (!e.children[r] || !xy(e.children[r], t.children[r], n))
            return !1;
    return !0
}
function pM(e, t) {
    return Object.keys(t).length <= Object.keys(e).length && Object.keys(t).every(n => Ay(e[n], t[n]))
}
function Oy(e, t, n) {
    return Fy(e, t, t.segments, n)
}
function Fy(e, t, n, r) {
    if (e.segments.length > n.length) {
        let o = e.segments.slice(0, n.length);
        return !(!Un(o, n) || t.hasChildren() || !Ma(o, n, r))
    } else if (e.segments.length === n.length) {
        if (!Un(e.segments, n) || !Ma(e.segments, n, r))
            return !1;
        for (let o in t.children)
            if (!e.children[o] || !Oy(e.children[o], t.children[o], r))
                return !1;
        return !0
    } else {
        let o = n.slice(0, e.segments.length)
          , i = n.slice(e.segments.length);
        return !Un(e.segments, o) || !Ma(e.segments, o, r) || !e.children[S] ? !1 : Fy(e.children[S], t, i, r)
    }
}
function Ma(e, t, n) {
    return t.every( (r, o) => Ry[n](e[o].parameters, r.parameters))
}
var et = class {
    root;
    queryParams;
    fragment;
    _queryParamMap;
    constructor(t=new L([],{}), n={}, r=null) {
        this.root = t,
        this.queryParams = n,
        this.fragment = r
    }
    get queryParamMap() {
        return this._queryParamMap ??= $n(this.queryParams),
        this._queryParamMap
    }
    toString() {
        return yM.serialize(this)
    }
}
  , L = class {
    segments;
    children;
    parent = null;
    constructor(t, n) {
        this.segments = t,
        this.children = n,
        Object.values(n).forEach(r => r.parent = this)
    }
    hasChildren() {
        return this.numberOfChildren > 0
    }
    get numberOfChildren() {
        return Object.keys(this.children).length
    }
    toString() {
        return Ta(this)
    }
}
  , nn = class {
    path;
    parameters;
    _parameterMap;
    constructor(t, n) {
        this.path = t,
        this.parameters = n
    }
    get parameterMap() {
        return this._parameterMap ??= $n(this.parameters),
        this._parameterMap
    }
    toString() {
        return Py(this)
    }
}
;
function gM(e, t) {
    return Un(e, t) && e.every( (n, r) => ft(n.parameters, t[r].parameters))
}
function Un(e, t) {
    return e.length !== t.length ? !1 : e.every( (n, r) => n.path === t[r].path)
}
function mM(e, t) {
    let n = [];
    return Object.entries(e.children).forEach( ([r,o]) => {
        r === S && (n = n.concat(t(o, r)))
    }
    ),
    Object.entries(e.children).forEach( ([r,o]) => {
        r !== S && (n = n.concat(t(o, r)))
    }
    ),
    n
}
var Wn = ( () => {
    class e {
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: () => new Ot,
            providedIn: "root"
        })
    }
    return e
}
)()
  , Ot = class {
    parse(t) {
        let n = new Yd(t);
        return new et(n.parseRootSegment(),n.parseQueryParams(),n.parseFragment())
    }
    serialize(t) {
        let n = `/${Ko(t.root, !0)}`
          , r = EM(t.queryParams)
          , o = typeof t.fragment == "string" ? `#${vM(t.fragment)}` : "";
        return `${n}${r}${o}`
    }
}
  , yM = new Ot;
function Ta(e) {
    return e.segments.map(t => Py(t)).join("/")
}
function Ko(e, t) {
    if (!e.hasChildren())
        return Ta(e);
    if (t) {
        let n = e.children[S] ? Ko(e.children[S], !1) : ""
          , r = [];
        return Object.entries(e.children).forEach( ([o,i]) => {
            o !== S && r.push(`${o}:${Ko(i, !1)}`)
        }
        ),
        r.length > 0 ? `${n}(${r.join("//")})` : n
    } else {
        let n = mM(e, (r, o) => o === S ? [Ko(e.children[S], !1)] : [`${o}:${Ko(r, !1)}`]);
        return Object.keys(e.children).length === 1 && e.children[S] != null ? `${Ta(e)}/${n[0]}` : `${Ta(e)}/(${n.join("//")})`
    }
}
function ky(e) {
    return encodeURIComponent(e).replace(/%40/g, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",")
}
function _a(e) {
    return ky(e).replace(/%3B/gi, ";")
}
function vM(e) {
    return encodeURI(e)
}
function Zd(e) {
    return ky(e).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/%26/gi, "&")
}
function Sa(e) {
    return decodeURIComponent(e)
}
function Ey(e) {
    return Sa(e.replace(/\+/g, "%20"))
}
function Py(e) {
    return `${Zd(e.path)}${DM(e.parameters)}`
}
function DM(e) {
    return Object.entries(e).map( ([t,n]) => `;${Zd(t)}=${Zd(n)}`).join("")
}
function EM(e) {
    let t = Object.entries(e).map( ([n,r]) => Array.isArray(r) ? r.map(o => `${_a(n)}=${_a(o)}`).join("&") : `${_a(n)}=${_a(r)}`).filter(n => n);
    return t.length ? `?${t.join("&")}` : ""
}
var CM = /^[^\/()?;#]+/;
function $d(e) {
    let t = e.match(CM);
    return t ? t[0] : ""
}
var IM = /^[^\/()?;=#]+/;
function wM(e) {
    let t = e.match(IM);
    return t ? t[0] : ""
}
var _M = /^[^=?&#]+/;
function bM(e) {
    let t = e.match(_M);
    return t ? t[0] : ""
}
var MM = /^[^&#]+/;
function TM(e) {
    let t = e.match(MM);
    return t ? t[0] : ""
}
var Yd = class {
    url;
    remaining;
    constructor(t) {
        this.url = t,
        this.remaining = t
    }
    parseRootSegment() {
        return this.consumeOptional("/"),
        this.remaining === "" || this.peekStartsWith("?") || this.peekStartsWith("#") ? new L([],{}) : new L([],this.parseChildren())
    }
    parseQueryParams() {
        let t = {};
        if (this.consumeOptional("?"))
            do
                this.parseQueryParam(t);
            while (this.consumeOptional("&"));
        return t
    }
    parseFragment() {
        return this.consumeOptional("#") ? decodeURIComponent(this.remaining) : null
    }
    parseChildren() {
        if (this.remaining === "")
            return {};
        this.consumeOptional("/");
        let t = [];
        for (this.peekStartsWith("(") || t.push(this.parseSegment()); this.peekStartsWith("/") && !this.peekStartsWith("//") && !this.peekStartsWith("/("); )
            this.capture("/"),
            t.push(this.parseSegment());
        let n = {};
        this.peekStartsWith("/(") && (this.capture("/"),
        n = this.parseParens(!0));
        let r = {};
        return this.peekStartsWith("(") && (r = this.parseParens(!1)),
        (t.length > 0 || Object.keys(n).length > 0) && (r[S] = new L(t,n)),
        r
    }
    parseSegment() {
        let t = $d(this.remaining);
        if (t === "" && this.peekStartsWith(";"))
            throw new y(4009,!1);
        return this.capture(t),
        new nn(Sa(t),this.parseMatrixParams())
    }
    parseMatrixParams() {
        let t = {};
        for (; this.consumeOptional(";"); )
            this.parseParam(t);
        return t
    }
    parseParam(t) {
        let n = wM(this.remaining);
        if (!n)
            return;
        this.capture(n);
        let r = "";
        if (this.consumeOptional("=")) {
            let o = $d(this.remaining);
            o && (r = o,
            this.capture(r))
        }
        t[Sa(n)] = Sa(r)
    }
    parseQueryParam(t) {
        let n = bM(this.remaining);
        if (!n)
            return;
        this.capture(n);
        let r = "";
        if (this.consumeOptional("=")) {
            let s = TM(this.remaining);
            s && (r = s,
            this.capture(r))
        }
        let o = Ey(n)
          , i = Ey(r);
        if (t.hasOwnProperty(o)) {
            let s = t[o];
            Array.isArray(s) || (s = [s],
            t[o] = s),
            s.push(i)
        } else
            t[o] = i
    }
    parseParens(t) {
        let n = {};
        for (this.capture("("); !this.consumeOptional(")") && this.remaining.length > 0; ) {
            let r = $d(this.remaining)
              , o = this.remaining[r.length];
            if (o !== "/" && o !== ")" && o !== ";")
                throw new y(4010,!1);
            let i;
            r.indexOf(":") > -1 ? (i = r.slice(0, r.indexOf(":")),
            this.capture(i),
            this.capture(":")) : t && (i = S);
            let s = this.parseChildren();
            n[i ?? S] = Object.keys(s).length === 1 && s[S] ? s[S] : new L([],s),
            this.consumeOptional("//")
        }
        return n
    }
    peekStartsWith(t) {
        return this.remaining.startsWith(t)
    }
    consumeOptional(t) {
        return this.peekStartsWith(t) ? (this.remaining = this.remaining.substring(t.length),
        !0) : !1
    }
    capture(t) {
        if (!this.consumeOptional(t))
            throw new y(4011,!1)
    }
}
;
function Ly(e) {
    return e.segments.length > 0 ? new L([],{
        [S]: e
    }) : e
}
function jy(e) {
    let t = {};
    for (let[r,o] of Object.entries(e.children)) {
        let i = jy(o);
        if (r === S && i.segments.length === 0 && i.hasChildren())
            for (let[s,a] of Object.entries(i.children))
                t[s] = a;
        else
            (i.segments.length > 0 || i.hasChildren()) && (t[r] = i)
    }
    let n = new L(e.segments,t);
    return SM(n)
}
function SM(e) {
    if (e.numberOfChildren === 1 && e.children[S]) {
        let t = e.children[S];
        return new L(e.segments.concat(t.segments),t.children)
    }
    return e
}
function kr(e) {
    return e instanceof et
}
function Vy(e, t, n=null, r=null, o=new Ot) {
    let i = By(e);
    return Uy(i, t, n, r, o)
}
function By(e) {
    let t;
    function n(i) {
        let s = {};
        for (let c of i.children) {
            let u = n(c);
            s[c.outlet] = u
        }
        let a = new L(i.url,s);
        return i === e && (t = a),
        a
    }
    let r = n(e.root)
      , o = Ly(r);
    return t ?? o
}
function Uy(e, t, n, r, o) {
    let i = e;
    for (; i.parent; )
        i = i.parent;
    if (t.length === 0)
        return zd(i, i, i, n, r, o);
    let s = AM(t);
    if (s.toRoot())
        return zd(i, i, new L([],{}), n, r, o);
    let a = NM(s, i, e)
      , c = a.processChildren ? Xo(a.segmentGroup, a.index, s.commands) : $y(a.segmentGroup, a.index, s.commands);
    return zd(i, a.segmentGroup, c, n, r, o)
}
function Na(e) {
    return typeof e == "object" && e != null && !e.outlets && !e.segmentPath
}
function ti(e) {
    return typeof e == "object" && e != null && e.outlets
}
function Cy(e, t, n) {
    e ||= "\u0275";
    let r = new et;
    return r.queryParams = {
        [e]: t
    },
    n.parse(n.serialize(r)).queryParams[e]
}
function zd(e, t, n, r, o, i) {
    let s = {};
    for (let[u,l] of Object.entries(r ?? {}))
        s[u] = Array.isArray(l) ? l.map(d => Cy(u, d, i)) : Cy(u, l, i);
    let a;
    e === t ? a = n : a = Hy(e, t, n);
    let c = Ly(jy(a));
    return new et(c,s,o)
}
function Hy(e, t, n) {
    let r = {};
    return Object.entries(e.children).forEach( ([o,i]) => {
        i === t ? r[o] = n : r[o] = Hy(i, t, n)
    }
    ),
    new L(e.segments,r)
}
var Ra = class {
    isAbsolute;
    numberOfDoubleDots;
    commands;
    constructor(t, n, r) {
        if (this.isAbsolute = t,
        this.numberOfDoubleDots = n,
        this.commands = r,
        t && r.length > 0 && Na(r[0]))
            throw new y(4003,!1);
        let o = r.find(ti);
        if (o && o !== dM(r))
            throw new y(4004,!1)
    }
    toRoot() {
        return this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    }
}
;
function AM(e) {
    if (typeof e[0] == "string" && e.length === 1 && e[0] === "/")
        return new Ra(!0,0,e);
    let t = 0
      , n = !1
      , r = e.reduce( (o, i, s) => {
        if (typeof i == "object" && i != null) {
            if (i.outlets) {
                let a = {};
                return Object.entries(i.outlets).forEach( ([c,u]) => {
                    a[c] = typeof u == "string" ? u.split("/") : u
                }
                ),
                [...o, {
                    outlets: a
                }]
            }
            if (i.segmentPath)
                return [...o, i.segmentPath]
        }
        return typeof i != "string" ? [...o, i] : s === 0 ? (i.split("/").forEach( (a, c) => {
            c == 0 && a === "." || (c == 0 && a === "" ? n = !0 : a === ".." ? t++ : a != "" && o.push(a))
        }
        ),
        o) : [...o, i]
    }
    , []);
    return new Ra(n,t,r)
}
var xr = class {
    segmentGroup;
    processChildren;
    index;
    constructor(t, n, r) {
        this.segmentGroup = t,
        this.processChildren = n,
        this.index = r
    }
}
;
function NM(e, t, n) {
    if (e.isAbsolute)
        return new xr(t,!0,0);
    if (!n)
        return new xr(t,!1,NaN);
    if (n.parent === null)
        return new xr(n,!0,0);
    let r = Na(e.commands[0]) ? 0 : 1
      , o = n.segments.length - 1 + r;
    return RM(n, o, e.numberOfDoubleDots)
}
function RM(e, t, n) {
    let r = e
      , o = t
      , i = n;
    for (; i > o; ) {
        if (i -= o,
        r = r.parent,
        !r)
            throw new y(4005,!1);
        o = r.segments.length
    }
    return new xr(r,!1,o - i)
}
function xM(e) {
    return ti(e[0]) ? e[0].outlets : {
        [S]: e
    }
}
function $y(e, t, n) {
    if (e ??= new L([],{}),
    e.segments.length === 0 && e.hasChildren())
        return Xo(e, t, n);
    let r = OM(e, t, n)
      , o = n.slice(r.commandIndex);
    if (r.match && r.pathIndex < e.segments.length) {
        let i = new L(e.segments.slice(0, r.pathIndex),{});
        return i.children[S] = new L(e.segments.slice(r.pathIndex),e.children),
        Xo(i, 0, o)
    } else
        return r.match && o.length === 0 ? new L(e.segments,{}) : r.match && !e.hasChildren() ? Qd(e, t, n) : r.match ? Xo(e, 0, o) : Qd(e, t, n)
}
function Xo(e, t, n) {
    if (n.length === 0)
        return new L(e.segments,{});
    {
        let r = xM(n)
          , o = {};
        if (Object.keys(r).some(i => i !== S) && e.children[S] && e.numberOfChildren === 1 && e.children[S].segments.length === 0) {
            let i = Xo(e.children[S], t, n);
            return new L(e.segments,i.children)
        }
        return Object.entries(r).forEach( ([i,s]) => {
            typeof s == "string" && (s = [s]),
            s !== null && (o[i] = $y(e.children[i], t, s))
        }
        ),
        Object.entries(e.children).forEach( ([i,s]) => {
            r[i] === void 0 && (o[i] = s)
        }
        ),
        new L(e.segments,o)
    }
}
function OM(e, t, n) {
    let r = 0
      , o = t
      , i = {
        match: !1,
        pathIndex: 0,
        commandIndex: 0
    };
    for (; o < e.segments.length; ) {
        if (r >= n.length)
            return i;
        let s = e.segments[o]
          , a = n[r];
        if (ti(a))
            break;
        let c = `${a}`
          , u = r < n.length - 1 ? n[r + 1] : null;
        if (o > 0 && c === void 0)
            break;
        if (c && u && typeof u == "object" && u.outlets === void 0) {
            if (!wy(c, u, s))
                return i;
            r += 2
        } else {
            if (!wy(c, {}, s))
                return i;
            r++
        }
        o++
    }
    return {
        match: !0,
        pathIndex: o,
        commandIndex: r
    }
}
function Qd(e, t, n) {
    let r = e.segments.slice(0, t)
      , o = 0;
    for (; o < n.length; ) {
        let i = n[o];
        if (ti(i)) {
            let c = FM(i.outlets);
            return new L(r,c)
        }
        if (o === 0 && Na(n[0])) {
            let c = e.segments[t];
            r.push(new nn(c.path,Iy(n[0]))),
            o++;
            continue
        }
        let s = ti(i) ? i.outlets[S] : `${i}`
          , a = o < n.length - 1 ? n[o + 1] : null;
        s && a && Na(a) ? (r.push(new nn(s,Iy(a))),
        o += 2) : (r.push(new nn(s,{})),
        o++)
    }
    return new L(r,{})
}
function FM(e) {
    let t = {};
    return Object.entries(e).forEach( ([n,r]) => {
        typeof r == "string" && (r = [r]),
        r !== null && (t[n] = Qd(new L([],{}), 0, r))
    }
    ),
    t
}
function Iy(e) {
    let t = {};
    return Object.entries(e).forEach( ([n,r]) => t[n] = `${r}`),
    t
}
function wy(e, t, n) {
    return e == n.path && ft(t, n.parameters)
}
var Or = "imperative"
  , oe = (function(e) {
    return e[e.NavigationStart = 0] = "NavigationStart",
    e[e.NavigationEnd = 1] = "NavigationEnd",
    e[e.NavigationCancel = 2] = "NavigationCancel",
    e[e.NavigationError = 3] = "NavigationError",
    e[e.RoutesRecognized = 4] = "RoutesRecognized",
    e[e.ResolveStart = 5] = "ResolveStart",
    e[e.ResolveEnd = 6] = "ResolveEnd",
    e[e.GuardsCheckStart = 7] = "GuardsCheckStart",
    e[e.GuardsCheckEnd = 8] = "GuardsCheckEnd",
    e[e.RouteConfigLoadStart = 9] = "RouteConfigLoadStart",
    e[e.RouteConfigLoadEnd = 10] = "RouteConfigLoadEnd",
    e[e.ChildActivationStart = 11] = "ChildActivationStart",
    e[e.ChildActivationEnd = 12] = "ChildActivationEnd",
    e[e.ActivationStart = 13] = "ActivationStart",
    e[e.ActivationEnd = 14] = "ActivationEnd",
    e[e.Scroll = 15] = "Scroll",
    e[e.NavigationSkipped = 16] = "NavigationSkipped",
    e
}
)(oe || {})
  , Se = class {
    id;
    url;
    constructor(t, n) {
        this.id = t,
        this.url = n
    }
}
  , rn = class extends Se {
    type = oe.NavigationStart;
    navigationTrigger;
    restoredState;
    constructor(t, n, r="imperative", o=null) {
        super(t, n),
        this.navigationTrigger = r,
        this.restoredState = o
    }
    toString() {
        return `NavigationStart(id: ${this.id}, url: '${this.url}')`
    }
}
  , tt = class extends Se {
    urlAfterRedirects;
    type = oe.NavigationEnd;
    constructor(t, n, r) {
        super(t, n),
        this.urlAfterRedirects = r
    }
    toString() {
        return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`
    }
}
  , he = (function(e) {
    return e[e.Redirect = 0] = "Redirect",
    e[e.SupersededByNewNavigation = 1] = "SupersededByNewNavigation",
    e[e.NoDataFromResolver = 2] = "NoDataFromResolver",
    e[e.GuardRejected = 3] = "GuardRejected",
    e[e.Aborted = 4] = "Aborted",
    e
}
)(he || {})
  , Pr = (function(e) {
    return e[e.IgnoredSameUrlNavigation = 0] = "IgnoredSameUrlNavigation",
    e[e.IgnoredByUrlHandlingStrategy = 1] = "IgnoredByUrlHandlingStrategy",
    e
}
)(Pr || {})
  , je = class extends Se {
    reason;
    code;
    type = oe.NavigationCancel;
    constructor(t, n, r, o) {
        super(t, n),
        this.reason = r,
        this.code = o
    }
    toString() {
        return `NavigationCancel(id: ${this.id}, url: '${this.url}')`
    }
}
;
function zy(e) {
    return e instanceof je && (e.code === he.Redirect || e.code === he.SupersededByNewNavigation)
}
var ht = class extends Se {
    reason;
    code;
    type = oe.NavigationSkipped;
    constructor(t, n, r, o) {
        super(t, n),
        this.reason = r,
        this.code = o
    }
}
  , zn = class extends Se {
    error;
    target;
    type = oe.NavigationError;
    constructor(t, n, r, o) {
        super(t, n),
        this.error = r,
        this.target = o
    }
    toString() {
        return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`
    }
}
  , Lr = class extends Se {
    urlAfterRedirects;
    state;
    type = oe.RoutesRecognized;
    constructor(t, n, r, o) {
        super(t, n),
        this.urlAfterRedirects = r,
        this.state = o
    }
    toString() {
        return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
}
  , xa = class extends Se {
    urlAfterRedirects;
    state;
    type = oe.GuardsCheckStart;
    constructor(t, n, r, o) {
        super(t, n),
        this.urlAfterRedirects = r,
        this.state = o
    }
    toString() {
        return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
}
  , Oa = class extends Se {
    urlAfterRedirects;
    state;
    shouldActivate;
    type = oe.GuardsCheckEnd;
    constructor(t, n, r, o, i) {
        super(t, n),
        this.urlAfterRedirects = r,
        this.state = o,
        this.shouldActivate = i
    }
    toString() {
        return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`
    }
}
  , Fa = class extends Se {
    urlAfterRedirects;
    state;
    type = oe.ResolveStart;
    constructor(t, n, r, o) {
        super(t, n),
        this.urlAfterRedirects = r,
        this.state = o
    }
    toString() {
        return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
}
  , ka = class extends Se {
    urlAfterRedirects;
    state;
    type = oe.ResolveEnd;
    constructor(t, n, r, o) {
        super(t, n),
        this.urlAfterRedirects = r,
        this.state = o
    }
    toString() {
        return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
}
  , Pa = class {
    route;
    type = oe.RouteConfigLoadStart;
    constructor(t) {
        this.route = t
    }
    toString() {
        return `RouteConfigLoadStart(path: ${this.route.path})`
    }
}
  , La = class {
    route;
    type = oe.RouteConfigLoadEnd;
    constructor(t) {
        this.route = t
    }
    toString() {
        return `RouteConfigLoadEnd(path: ${this.route.path})`
    }
}
  , ja = class {
    snapshot;
    type = oe.ChildActivationStart;
    constructor(t) {
        this.snapshot = t
    }
    toString() {
        return `ChildActivationStart(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
    }
}
  , Va = class {
    snapshot;
    type = oe.ChildActivationEnd;
    constructor(t) {
        this.snapshot = t
    }
    toString() {
        return `ChildActivationEnd(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
    }
}
  , Ba = class {
    snapshot;
    type = oe.ActivationStart;
    constructor(t) {
        this.snapshot = t
    }
    toString() {
        return `ActivationStart(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
    }
}
  , Ua = class {
    snapshot;
    type = oe.ActivationEnd;
    constructor(t) {
        this.snapshot = t
    }
    toString() {
        return `ActivationEnd(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
    }
}
  , jr = class {
    routerEvent;
    position;
    anchor;
    scrollBehavior;
    type = oe.Scroll;
    constructor(t, n, r, o) {
        this.routerEvent = t,
        this.position = n,
        this.anchor = r,
        this.scrollBehavior = o
    }
    toString() {
        let t = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
        return `Scroll(anchor: '${this.anchor}', position: '${t}')`
    }
}
  , Vr = class {
}
  , Br = class {
    url;
    navigationBehaviorOptions;
    constructor(t, n) {
        this.url = t,
        this.navigationBehaviorOptions = n
    }
}
;
function kM(e) {
    return !(e instanceof Vr) && !(e instanceof Br)
}
var Ha = class {
    rootInjector;
    outlet = null;
    route = null;
    children;
    attachRef = null;
    get injector() {
        return this.route?.snapshot._environmentInjector ?? this.rootInjector
    }
    constructor(t) {
        this.rootInjector = t,
        this.children = new qn(this.rootInjector)
    }
}
  , qn = ( () => {
    class e {
        rootInjector;
        contexts = new Map;
        constructor(n) {
            this.rootInjector = n
        }
        onChildOutletCreated(n, r) {
            let o = this.getOrCreateContext(n);
            o.outlet = r,
            this.contexts.set(n, o)
        }
        onChildOutletDestroyed(n) {
            let r = this.getContext(n);
            r && (r.outlet = null,
            r.attachRef = null)
        }
        onOutletDeactivated() {
            let n = this.contexts;
            return this.contexts = new Map,
            n
        }
        onOutletReAttached(n) {
            this.contexts = n
        }
        getOrCreateContext(n) {
            let r = this.getContext(n);
            return r || (r = new Ha(this.rootInjector),
            this.contexts.set(n, r)),
            r
        }
        getContext(n) {
            return this.contexts.get(n) || null
        }
        static \u0275fac = function(r) {
            return new (r || e)(I(H))
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)()
  , $a = class {
    _root;
    constructor(t) {
        this._root = t
    }
    get root() {
        return this._root.value
    }
    parent(t) {
        let n = this.pathFromRoot(t);
        return n.length > 1 ? n[n.length - 2] : null
    }
    children(t) {
        let n = Kd(t, this._root);
        return n ? n.children.map(r => r.value) : []
    }
    firstChild(t) {
        let n = Kd(t, this._root);
        return n && n.children.length > 0 ? n.children[0].value : null
    }
    siblings(t) {
        let n = Jd(t, this._root);
        return n.length < 2 ? [] : n[n.length - 2].children.map(o => o.value).filter(o => o !== t)
    }
    pathFromRoot(t) {
        return Jd(t, this._root).map(n => n.value)
    }
}
;
function Kd(e, t) {
    if (e === t.value)
        return t;
    for (let n of t.children) {
        let r = Kd(e, n);
        if (r)
            return r
    }
    return null
}
function Jd(e, t) {
    if (e === t.value)
        return [t];
    for (let n of t.children) {
        let r = Jd(e, n);
        if (r.length)
            return r.unshift(t),
            r
    }
    return []
}
var Te = class {
    value;
    children;
    constructor(t, n) {
        this.value = t,
        this.children = n
    }
    toString() {
        return `TreeNode(${this.value})`
    }
}
;
function Rr(e) {
    let t = {};
    return e && e.children.forEach(n => t[n.value.outlet] = n),
    t
}
var ni = class extends $a {
    snapshot;
    constructor(t, n) {
        super(t),
        this.snapshot = n,
        af(this, t)
    }
    toString() {
        return this.snapshot.toString()
    }
}
;
function Gy(e, t) {
    let n = PM(e, t)
      , r = new ae([new nn("",{})])
      , o = new ae({})
      , i = new ae({})
      , s = new ae({})
      , a = new ae("")
      , c = new Ft(r,o,s,a,i,S,e,n.root);
    return c.snapshot = n.root,
    new ni(new Te(c,[]),n)
}
function PM(e, t) {
    let n = {}
      , r = {}
      , o = {}
      , s = new Hn([],n,o,"",r,S,e,null,{},t);
    return new ri("",new Te(s,[]))
}
var Ft = class {
    urlSubject;
    paramsSubject;
    queryParamsSubject;
    fragmentSubject;
    dataSubject;
    outlet;
    component;
    snapshot;
    _futureSnapshot;
    _routerState;
    _paramMap;
    _queryParamMap;
    title;
    url;
    params;
    queryParams;
    fragment;
    data;
    constructor(t, n, r, o, i, s, a, c) {
        this.urlSubject = t,
        this.paramsSubject = n,
        this.queryParamsSubject = r,
        this.fragmentSubject = o,
        this.dataSubject = i,
        this.outlet = s,
        this.component = a,
        this._futureSnapshot = c,
        this.title = this.dataSubject?.pipe(j(u => u[si])) ?? A(void 0),
        this.url = t,
        this.params = n,
        this.queryParams = r,
        this.fragment = o,
        this.data = i
    }
    get routeConfig() {
        return this._futureSnapshot.routeConfig
    }
    get root() {
        return this._routerState.root
    }
    get parent() {
        return this._routerState.parent(this)
    }
    get firstChild() {
        return this._routerState.firstChild(this)
    }
    get children() {
        return this._routerState.children(this)
    }
    get pathFromRoot() {
        return this._routerState.pathFromRoot(this)
    }
    get paramMap() {
        return this._paramMap ??= this.params.pipe(j(t => $n(t))),
        this._paramMap
    }
    get queryParamMap() {
        return this._queryParamMap ??= this.queryParams.pipe(j(t => $n(t))),
        this._queryParamMap
    }
    toString() {
        return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`
    }
}
;
function za(e, t, n="emptyOnly") {
    let r, {routeConfig: o} = e;
    return t !== null && (n === "always" || o?.path === "" || !t.component && !t.routeConfig?.loadComponent) ? r = {
        params: g(g({}, t.params), e.params),
        data: g(g({}, t.data), e.data),
        resolve: g(g(g(g({}, e.data), t.data), o?.data), e._resolvedData)
    } : r = {
        params: g({}, e.params),
        data: g({}, e.data),
        resolve: g(g({}, e.data), e._resolvedData ?? {})
    },
    o && qy(o) && (r.resolve[si] = o.title),
    r
}
var Hn = class {
    url;
    params;
    queryParams;
    fragment;
    data;
    outlet;
    component;
    routeConfig;
    _resolve;
    _resolvedData;
    _routerState;
    _paramMap;
    _queryParamMap;
    _environmentInjector;
    get title() {
        return this.data?.[si]
    }
    constructor(t, n, r, o, i, s, a, c, u, l) {
        this.url = t,
        this.params = n,
        this.queryParams = r,
        this.fragment = o,
        this.data = i,
        this.outlet = s,
        this.component = a,
        this.routeConfig = c,
        this._resolve = u,
        this._environmentInjector = l
    }
    get root() {
        return this._routerState.root
    }
    get parent() {
        return this._routerState.parent(this)
    }
    get firstChild() {
        return this._routerState.firstChild(this)
    }
    get children() {
        return this._routerState.children(this)
    }
    get pathFromRoot() {
        return this._routerState.pathFromRoot(this)
    }
    get paramMap() {
        return this._paramMap ??= $n(this.params),
        this._paramMap
    }
    get queryParamMap() {
        return this._queryParamMap ??= $n(this.queryParams),
        this._queryParamMap
    }
    toString() {
        let t = this.url.map(r => r.toString()).join("/")
          , n = this.routeConfig ? this.routeConfig.path : "";
        return `Route(url:'${t}', path:'${n}')`
    }
}
  , ri = class extends $a {
    url;
    constructor(t, n) {
        super(n),
        this.url = t,
        af(this, n)
    }
    toString() {
        return Wy(this._root)
    }
}
;
function af(e, t) {
    t.value._routerState = e,
    t.children.forEach(n => af(e, n))
}
function Wy(e) {
    let t = e.children.length > 0 ? ` { ${e.children.map(Wy).join(", ")} } ` : "";
    return `${e.value}${t}`
}
function Gd(e) {
    if (e.snapshot) {
        let t = e.snapshot
          , n = e._futureSnapshot;
        e.snapshot = n,
        ft(t.queryParams, n.queryParams) || e.queryParamsSubject.next(n.queryParams),
        t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment),
        ft(t.params, n.params) || e.paramsSubject.next(n.params),
        lM(t.url, n.url) || e.urlSubject.next(n.url),
        ft(t.data, n.data) || e.dataSubject.next(n.data)
    } else
        e.snapshot = e._futureSnapshot,
        e.dataSubject.next(e._futureSnapshot.data)
}
function Xd(e, t) {
    let n = ft(e.params, t.params) && gM(e.url, t.url)
      , r = !e.parent != !t.parent;
    return n && !r && (!e.parent || Xd(e.parent, t.parent))
}
function qy(e) {
    return typeof e.title == "string" || e.title === null
}
var Zy = new v("")
  , cf = ( () => {
    class e {
        activated = null;
        get activatedComponentRef() {
            return this.activated
        }
        _activatedRoute = null;
        name = S;
        activateEvents = new ee;
        deactivateEvents = new ee;
        attachEvents = new ee;
        detachEvents = new ee;
        routerOutletData = Hm();
        parentContexts = p(qn);
        location = p(Ln);
        changeDetector = p(jn);
        inputBinder = p(ai, {
            optional: !0
        });
        supportsBindingToComponentInputs = !0;
        ngOnChanges(n) {
            if (n.name) {
                let {firstChange: r, previousValue: o} = n.name;
                if (r)
                    return;
                this.isTrackedInParentContexts(o) && (this.deactivate(),
                this.parentContexts.onChildOutletDestroyed(o)),
                this.initializeOutletWithName()
            }
        }
        ngOnDestroy() {
            this.isTrackedInParentContexts(this.name) && this.parentContexts.onChildOutletDestroyed(this.name),
            this.inputBinder?.unsubscribeFromRouteData(this)
        }
        isTrackedInParentContexts(n) {
            return this.parentContexts.getContext(n)?.outlet === this
        }
        ngOnInit() {
            this.initializeOutletWithName()
        }
        initializeOutletWithName() {
            if (this.parentContexts.onChildOutletCreated(this.name, this),
            this.activated)
                return;
            let n = this.parentContexts.getContext(this.name);
            n?.route && (n.attachRef ? this.attach(n.attachRef, n.route) : this.activateWith(n.route, n.injector))
        }
        get isActivated() {
            return !!this.activated
        }
        get component() {
            if (!this.activated)
                throw new y(4012,!1);
            return this.activated.instance
        }
        get activatedRoute() {
            if (!this.activated)
                throw new y(4012,!1);
            return this._activatedRoute
        }
        get activatedRouteData() {
            return this._activatedRoute ? this._activatedRoute.snapshot.data : {}
        }
        detach() {
            if (!this.activated)
                throw new y(4012,!1);
            this.location.detach();
            let n = this.activated;
            return this.activated = null,
            this._activatedRoute = null,
            this.detachEvents.emit(n.instance),
            n
        }
        attach(n, r) {
            this.activated = n,
            this._activatedRoute = r,
            this.location.insert(n.hostView),
            this.inputBinder?.bindActivatedRouteToOutletComponent(this),
            this.attachEvents.emit(n.instance)
        }
        deactivate() {
            if (this.activated) {
                let n = this.component;
                this.activated.destroy(),
                this.activated = null,
                this._activatedRoute = null,
                this.deactivateEvents.emit(n)
            }
        }
        activateWith(n, r) {
            if (this.isActivated)
                throw new y(4013,!1);
            this._activatedRoute = n;
            let o = this.location
              , s = n.snapshot.component
              , a = this.parentContexts.getOrCreateContext(this.name).children
              , c = new ef(n,a,o.injector,this.routerOutletData);
            this.activated = o.createComponent(s, {
                index: o.length,
                injector: c,
                environmentInjector: r
            }),
            this.changeDetector.markForCheck(),
            this.inputBinder?.bindActivatedRouteToOutletComponent(this),
            this.activateEvents.emit(this.activated.instance)
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275dir = ye({
            type: e,
            selectors: [["router-outlet"]],
            inputs: {
                name: "name",
                routerOutletData: [1, "routerOutletData"]
            },
            outputs: {
                activateEvents: "activate",
                deactivateEvents: "deactivate",
                attachEvents: "attach",
                detachEvents: "detach"
            },
            exportAs: ["outlet"],
            features: [Yt]
        })
    }
    return e
}
)()
  , ef = class {
    route;
    childContexts;
    parent;
    outletData;
    constructor(t, n, r, o) {
        this.route = t,
        this.childContexts = n,
        this.parent = r,
        this.outletData = o
    }
    get(t, n) {
        return t === Ft ? this.route : t === qn ? this.childContexts : t === Zy ? this.outletData : this.parent.get(t, n)
    }
}
  , ai = new v("")
  , uf = ( () => {
    class e {
        outletDataSubscriptions = new Map;
        bindActivatedRouteToOutletComponent(n) {
            this.unsubscribeFromRouteData(n),
            this.subscribeToRouteData(n)
        }
        unsubscribeFromRouteData(n) {
            this.outletDataSubscriptions.get(n)?.unsubscribe(),
            this.outletDataSubscriptions.delete(n)
        }
        subscribeToRouteData(n) {
            let {activatedRoute: r} = n
              , o = Bi([r.queryParams, r.params, r.data]).pipe(Ne( ([i,s,a], c) => (a = g(g(g({}, i), s), a),
            c === 0 ? A(a) : Promise.resolve(a)))).subscribe(i => {
                if (!n.isActivated || !n.activatedComponentRef || n.activatedRoute !== r || r.component === null) {
                    this.unsubscribeFromRouteData(n);
                    return
                }
                let s = zm(r.component);
                if (!s) {
                    this.unsubscribeFromRouteData(n);
                    return
                }
                for (let {templateName: a} of s.inputs)
                    n.activatedComponentRef.setInput(a, i[a])
            }
            );
            this.outletDataSubscriptions.set(n, o)
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac
        })
    }
    return e
}
)()
  , lf = ( () => {
    class e {
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275cmp = id({
            type: e,
            selectors: [["ng-component"]],
            exportAs: ["emptyRouterOutlet"],
            decls: 1,
            vars: 0,
            template: function(r, o) {
                r & 1 && ia(0, "router-outlet")
            },
            dependencies: [cf],
            encapsulation: 2
        })
    }
    return e
}
)();
function df(e) {
    let t = e.children && e.children.map(df)
      , n = t ? R(g({}, e), {
        children: t
    }) : g({}, e);
    return !n.component && !n.loadComponent && (t || n.loadChildren) && n.outlet && n.outlet !== S && (n.component = lf),
    n
}
function LM(e, t, n) {
    let r = oi(e, t._root, n ? n._root : void 0);
    return new ni(r,t)
}
function oi(e, t, n) {
    if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
        let r = n.value;
        r._futureSnapshot = t.value;
        let o = jM(e, t, n);
        return new Te(r,o)
    } else {
        if (e.shouldAttach(t.value)) {
            let i = e.retrieve(t.value);
            if (i !== null) {
                let s = i.route;
                return s.value._futureSnapshot = t.value,
                s.children = t.children.map(a => oi(e, a)),
                s
            }
        }
        let r = VM(t.value)
          , o = t.children.map(i => oi(e, i));
        return new Te(r,o)
    }
}
function jM(e, t, n) {
    return t.children.map(r => {
        for (let o of n.children)
            if (e.shouldReuseRoute(r.value, o.value.snapshot))
                return oi(e, r, o);
        return oi(e, r)
    }
    )
}
function VM(e) {
    return new Ft(new ae(e.url),new ae(e.params),new ae(e.queryParams),new ae(e.fragment),new ae(e.data),e.outlet,e.component,e)
}
var Ur = class {
    redirectTo;
    navigationBehaviorOptions;
    constructor(t, n) {
        this.redirectTo = t,
        this.navigationBehaviorOptions = n
    }
}
  , Yy = "ngNavigationCancelingError";
function Ga(e, t) {
    let {redirectTo: n, navigationBehaviorOptions: r} = kr(t) ? {
        redirectTo: t,
        navigationBehaviorOptions: void 0
    } : t
      , o = Qy(!1, he.Redirect);
    return o.url = n,
    o.navigationBehaviorOptions = r,
    o
}
function Qy(e, t) {
    let n = new Error(`NavigationCancelingError: ${e || ""}`);
    return n[Yy] = !0,
    n.cancellationCode = t,
    n
}
function BM(e) {
    return Ky(e) && kr(e.url)
}
function Ky(e) {
    return !!e && e[Yy]
}
var tf = class {
    routeReuseStrategy;
    futureState;
    currState;
    forwardEvent;
    inputBindingEnabled;
    constructor(t, n, r, o, i) {
        this.routeReuseStrategy = t,
        this.futureState = n,
        this.currState = r,
        this.forwardEvent = o,
        this.inputBindingEnabled = i
    }
    activate(t) {
        let n = this.futureState._root
          , r = this.currState ? this.currState._root : null;
        this.deactivateChildRoutes(n, r, t),
        Gd(this.futureState.root),
        this.activateChildRoutes(n, r, t)
    }
    deactivateChildRoutes(t, n, r) {
        let o = Rr(n);
        t.children.forEach(i => {
            let s = i.value.outlet;
            this.deactivateRoutes(i, o[s], r),
            delete o[s]
        }
        ),
        Object.values(o).forEach(i => {
            this.deactivateRouteAndItsChildren(i, r)
        }
        )
    }
    deactivateRoutes(t, n, r) {
        let o = t.value
          , i = n ? n.value : null;
        if (o === i)
            if (o.component) {
                let s = r.getContext(o.outlet);
                s && this.deactivateChildRoutes(t, n, s.children)
            } else
                this.deactivateChildRoutes(t, n, r);
        else
            i && this.deactivateRouteAndItsChildren(n, r)
    }
    deactivateRouteAndItsChildren(t, n) {
        t.value.component && this.routeReuseStrategy.shouldDetach(t.value.snapshot) ? this.detachAndStoreRouteSubtree(t, n) : this.deactivateRouteAndOutlet(t, n)
    }
    detachAndStoreRouteSubtree(t, n) {
        let r = n.getContext(t.value.outlet)
          , o = r && t.value.component ? r.children : n
          , i = Rr(t);
        for (let s of Object.values(i))
            this.deactivateRouteAndItsChildren(s, o);
        if (r && r.outlet) {
            let s = r.outlet.detach()
              , a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(t.value.snapshot, {
                componentRef: s,
                route: t,
                contexts: a
            })
        }
    }
    deactivateRouteAndOutlet(t, n) {
        let r = n.getContext(t.value.outlet)
          , o = r && t.value.component ? r.children : n
          , i = Rr(t);
        for (let s of Object.values(i))
            this.deactivateRouteAndItsChildren(s, o);
        r && (r.outlet && (r.outlet.deactivate(),
        r.children.onOutletDeactivated()),
        r.attachRef = null,
        r.route = null)
    }
    activateChildRoutes(t, n, r) {
        let o = Rr(n);
        t.children.forEach(i => {
            this.activateRoutes(i, o[i.value.outlet], r),
            this.forwardEvent(new Ua(i.value.snapshot))
        }
        ),
        t.children.length && this.forwardEvent(new Va(t.value.snapshot))
    }
    activateRoutes(t, n, r) {
        let o = t.value
          , i = n ? n.value : null;
        if (Gd(o),
        o === i)
            if (o.component) {
                let s = r.getOrCreateContext(o.outlet);
                this.activateChildRoutes(t, n, s.children)
            } else
                this.activateChildRoutes(t, n, r);
        else if (o.component) {
            let s = r.getOrCreateContext(o.outlet);
            if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
                let a = this.routeReuseStrategy.retrieve(o.snapshot);
                this.routeReuseStrategy.store(o.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                s.attachRef = a.componentRef,
                s.route = a.route.value,
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                Gd(a.route.value),
                this.activateChildRoutes(t, null, s.children)
            } else
                s.attachRef = null,
                s.route = o,
                s.outlet && s.outlet.activateWith(o, s.injector),
                this.activateChildRoutes(t, null, s.children)
        } else
            this.activateChildRoutes(t, null, r)
    }
}
  , Wa = class {
    path;
    route;
    constructor(t) {
        this.path = t,
        this.route = this.path[this.path.length - 1]
    }
}
  , Fr = class {
    component;
    route;
    constructor(t, n) {
        this.component = t,
        this.route = n
    }
}
;
function UM(e, t, n) {
    let r = e._root
      , o = t ? t._root : null;
    return Jo(r, o, n, [r.value])
}
function HM(e) {
    let t = e.routeConfig ? e.routeConfig.canActivateChild : null;
    return !t || t.length === 0 ? null : {
        node: e,
        guards: t
    }
}
function $r(e, t) {
    let n = Symbol()
      , r = t.get(e, n);
    return r === n ? typeof e == "function" && !Yc(e) ? e : t.get(e) : r
}
function Jo(e, t, n, r, o={
    canDeactivateChecks: [],
    canActivateChecks: []
}) {
    let i = Rr(t);
    return e.children.forEach(s => {
        $M(s, i[s.value.outlet], n, r.concat([s.value]), o),
        delete i[s.value.outlet]
    }
    ),
    Object.entries(i).forEach( ([s,a]) => ei(a, n.getContext(s), o)),
    o
}
function $M(e, t, n, r, o={
    canDeactivateChecks: [],
    canActivateChecks: []
}) {
    let i = e.value
      , s = t ? t.value : null
      , a = n ? n.getContext(e.value.outlet) : null;
    if (s && i.routeConfig === s.routeConfig) {
        let c = zM(s, i, i.routeConfig.runGuardsAndResolvers);
        c ? o.canActivateChecks.push(new Wa(r)) : (i.data = s.data,
        i._resolvedData = s._resolvedData),
        i.component ? Jo(e, t, a ? a.children : null, r, o) : Jo(e, t, n, r, o),
        c && a && a.outlet && a.outlet.isActivated && o.canDeactivateChecks.push(new Fr(a.outlet.component,s))
    } else
        s && ei(t, a, o),
        o.canActivateChecks.push(new Wa(r)),
        i.component ? Jo(e, null, a ? a.children : null, r, o) : Jo(e, null, n, r, o);
    return o
}
function zM(e, t, n) {
    if (typeof n == "function")
        return ne(t._environmentInjector, () => n(e, t));
    switch (n) {
    case "pathParamsChange":
        return !Un(e.url, t.url);
    case "pathParamsOrQueryParamsChange":
        return !Un(e.url, t.url) || !ft(e.queryParams, t.queryParams);
    case "always":
        return !0;
    case "paramsOrQueryParamsChange":
        return !Xd(e, t) || !ft(e.queryParams, t.queryParams);
    default:
        return !Xd(e, t)
    }
}
function ei(e, t, n) {
    let r = Rr(e)
      , o = e.value;
    Object.entries(r).forEach( ([i,s]) => {
        o.component ? t ? ei(s, t.children.getContext(i), n) : ei(s, null, n) : ei(s, t, n)
    }
    ),
    o.component ? t && t.outlet && t.outlet.isActivated ? n.canDeactivateChecks.push(new Fr(t.outlet.component,o)) : n.canDeactivateChecks.push(new Fr(null,o)) : n.canDeactivateChecks.push(new Fr(null,o))
}
function ci(e) {
    return typeof e == "function"
}
function GM(e) {
    return typeof e == "boolean"
}
function WM(e) {
    return e && ci(e.canLoad)
}
function qM(e) {
    return e && ci(e.canActivate)
}
function ZM(e) {
    return e && ci(e.canActivateChild)
}
function YM(e) {
    return e && ci(e.canDeactivate)
}
function QM(e) {
    return e && ci(e.canMatch)
}
function Jy(e) {
    return e instanceof dn || e?.name === "EmptyError"
}
var ba = Symbol("INITIAL_VALUE");
function Hr() {
    return Ne(e => Bi(e.map(t => t.pipe(pt(1), vc(ba)))).pipe(j(t => {
        for (let n of t)
            if (n !== !0) {
                if (n === ba)
                    return ba;
                if (n === !1 || KM(n))
                    return n
            }
        return !0
    }
    ), Ie(t => t !== ba), pt(1)))
}
function KM(e) {
    return kr(e) || e instanceof Ur
}
function Xy(e) {
    return e.aborted ? A(void 0).pipe(pt(1)) : new O(t => {
        let n = () => {
            t.next(),
            t.complete()
        }
        ;
        return e.addEventListener("abort", n),
        () => e.removeEventListener("abort", n)
    }
    )
}
function ev(e) {
    return Xr(Xy(e))
}
function JM(e) {
    return X(t => {
        let {targetSnapshot: n, currentSnapshot: r, guards: {canActivateChecks: o, canDeactivateChecks: i}} = t;
        return i.length === 0 && o.length === 0 ? A(R(g({}, t), {
            guardsResult: !0
        })) : XM(i, n, r).pipe(X(s => s && GM(s) ? eT(n, o, e) : A(s)), j(s => R(g({}, t), {
            guardsResult: s
        })))
    }
    )
}
function XM(e, t, n) {
    return z(e).pipe(X(r => iT(r.component, r.route, n, t)), gt(r => r !== !0, !0))
}
function eT(e, t, n) {
    return z(t).pipe(Pt(r => sr(nT(r.route.parent, n), tT(r.route, n), oT(e, r.path), rT(e, r.route))), gt(r => r !== !0, !0))
}
function tT(e, t) {
    return e !== null && t && t(new Ba(e)),
    A(!0)
}
function nT(e, t) {
    return e !== null && t && t(new ja(e)),
    A(!0)
}
function rT(e, t) {
    let n = t.routeConfig ? t.routeConfig.canActivate : null;
    if (!n || n.length === 0)
        return A(!0);
    let r = n.map(o => Kr( () => {
        let i = t._environmentInjector
          , s = $r(o, i)
          , a = qM(s) ? s.canActivate(t, e) : ne(i, () => s(t, e));
        return Gn(a).pipe(gt())
    }
    ));
    return A(r).pipe(Hr())
}
function oT(e, t) {
    let n = t[t.length - 1]
      , o = t.slice(0, t.length - 1).reverse().map(i => HM(i)).filter(i => i !== null).map(i => Kr( () => {
        let s = i.guards.map(a => {
            let c = i.node._environmentInjector
              , u = $r(a, c)
              , l = ZM(u) ? u.canActivateChild(n, e) : ne(c, () => u(n, e));
            return Gn(l).pipe(gt())
        }
        );
        return A(s).pipe(Hr())
    }
    ));
    return A(o).pipe(Hr())
}
function iT(e, t, n, r) {
    let o = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
    if (!o || o.length === 0)
        return A(!0);
    let i = o.map(s => {
        let a = t._environmentInjector
          , c = $r(s, a)
          , u = YM(c) ? c.canDeactivate(e, t, n, r) : ne(a, () => c(e, t, n, r));
        return Gn(u).pipe(gt())
    }
    );
    return A(i).pipe(Hr())
}
function sT(e, t, n, r, o) {
    let i = t.canLoad;
    if (i === void 0 || i.length === 0)
        return A(!0);
    let s = i.map(a => {
        let c = $r(a, e)
          , u = WM(c) ? c.canLoad(t, n) : ne(e, () => c(t, n))
          , l = Gn(u);
        return o ? l.pipe(ev(o)) : l
    }
    );
    return A(s).pipe(Hr(), tv(r))
}
function tv(e) {
    return dc(nt(t => {
        if (typeof t != "boolean")
            throw Ga(e, t)
    }
    ), j(t => t === !0))
}
function aT(e, t, n, r, o) {
    let i = t.canMatch;
    if (!i || i.length === 0)
        return A(!0);
    let s = i.map(a => {
        let c = $r(a, e)
          , u = QM(c) ? c.canMatch(t, n) : ne(e, () => c(t, n));
        return Gn(u).pipe(ev(o))
    }
    );
    return A(s).pipe(Hr(), tv(r))
}
var xt = class e extends Error {
    segmentGroup;
    constructor(t) {
        super(),
        this.segmentGroup = t || null,
        Object.setPrototypeOf(this, e.prototype)
    }
}
  , ii = class e extends Error {
    urlTree;
    constructor(t) {
        super(),
        this.urlTree = t,
        Object.setPrototypeOf(this, e.prototype)
    }
}
;
function cT(e) {
    throw new y(4e3,!1)
}
function uT(e) {
    throw Qy(!1, he.GuardRejected)
}
var nf = class {
    urlSerializer;
    urlTree;
    constructor(t, n) {
        this.urlSerializer = t,
        this.urlTree = n
    }
    async lineralizeSegments(t, n) {
        let r = []
          , o = n.root;
        for (; ; ) {
            if (r = r.concat(o.segments),
            o.numberOfChildren === 0)
                return r;
            if (o.numberOfChildren > 1 || !o.children[S])
                throw cT(`${t.redirectTo}`);
            o = o.children[S]
        }
    }
    async applyRedirectCommands(t, n, r, o, i) {
        let s = await lT(n, o, i);
        if (s instanceof et)
            throw new ii(s);
        let a = this.applyRedirectCreateUrlTree(s, this.urlSerializer.parse(s), t, r);
        if (s[0] === "/")
            throw new ii(a);
        return a
    }
    applyRedirectCreateUrlTree(t, n, r, o) {
        let i = this.createSegmentGroup(t, n.root, r, o);
        return new et(i,this.createQueryParams(n.queryParams, this.urlTree.queryParams),n.fragment)
    }
    createQueryParams(t, n) {
        let r = {};
        return Object.entries(t).forEach( ([o,i]) => {
            if (typeof i == "string" && i[0] === ":") {
                let a = i.substring(1);
                r[o] = n[a]
            } else
                r[o] = i
        }
        ),
        r
    }
    createSegmentGroup(t, n, r, o) {
        let i = this.createSegments(t, n.segments, r, o)
          , s = {};
        return Object.entries(n.children).forEach( ([a,c]) => {
            s[a] = this.createSegmentGroup(t, c, r, o)
        }
        ),
        new L(i,s)
    }
    createSegments(t, n, r, o) {
        return n.map(i => i.path[0] === ":" ? this.findPosParam(t, i, o) : this.findOrReturn(i, r))
    }
    findPosParam(t, n, r) {
        let o = r[n.path.substring(1)];
        if (!o)
            throw new y(4001,!1);
        return o
    }
    findOrReturn(t, n) {
        let r = 0;
        for (let o of n) {
            if (o.path === t.path)
                return n.splice(r),
                o;
            r++
        }
        return t
    }
}
;
function lT(e, t, n) {
    if (typeof e == "string")
        return Promise.resolve(e);
    let r = e
      , {queryParams: o, fragment: i, routeConfig: s, url: a, outlet: c, params: u, data: l, title: d, paramMap: h, queryParamMap: f} = t;
    return Aa(Gn(ne(n, () => r({
        params: u,
        data: l,
        queryParams: o,
        fragment: i,
        routeConfig: s,
        url: a,
        outlet: c,
        title: d,
        paramMap: h,
        queryParamMap: f
    }))))
}
function dT(e, t) {
    return e.providers && !e._injector && (e._injector = Mr(e.providers, t, `Route: ${e.path}`)),
    e._injector ?? t
}
function Xe(e) {
    return e.outlet || S
}
function fT(e, t) {
    let n = e.filter(r => Xe(r) === t);
    return n.push(...e.filter(r => Xe(r) !== t)),
    n
}
var rf = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {}
};
function hT(e, t, n, r, o, i) {
    let s = nv(e, t, n);
    return s.matched ? (r = dT(t, r),
    aT(r, t, n, o, i).pipe(j(a => a === !0 ? s : g({}, rf)))) : A(s)
}
function nv(e, t, n) {
    if (t.path === "")
        return t.pathMatch === "full" && (e.hasChildren() || n.length > 0) ? g({}, rf) : {
            matched: !0,
            consumedSegments: [],
            remainingSegments: n,
            parameters: {},
            positionalParamSegments: {}
        };
    let o = (t.matcher || Sy)(n, e, t);
    if (!o)
        return g({}, rf);
    let i = {};
    Object.entries(o.posParams ?? {}).forEach( ([a,c]) => {
        i[a] = c.path
    }
    );
    let s = o.consumed.length > 0 ? g(g({}, i), o.consumed[o.consumed.length - 1].parameters) : i;
    return {
        matched: !0,
        consumedSegments: o.consumed,
        remainingSegments: n.slice(o.consumed.length),
        parameters: s,
        positionalParamSegments: o.posParams ?? {}
    }
}
function _y(e, t, n, r) {
    return n.length > 0 && mT(e, n, r) ? {
        segmentGroup: new L(t,gT(r, new L(n,e.children))),
        slicedSegments: []
    } : n.length === 0 && yT(e, n, r) ? {
        segmentGroup: new L(e.segments,pT(e, n, r, e.children)),
        slicedSegments: n
    } : {
        segmentGroup: new L(e.segments,e.children),
        slicedSegments: n
    }
}
function pT(e, t, n, r) {
    let o = {};
    for (let i of n)
        if (Za(e, t, i) && !r[Xe(i)]) {
            let s = new L([],{});
            o[Xe(i)] = s
        }
    return g(g({}, r), o)
}
function gT(e, t) {
    let n = {};
    n[S] = t;
    for (let r of e)
        if (r.path === "" && Xe(r) !== S) {
            let o = new L([],{});
            n[Xe(r)] = o
        }
    return n
}
function mT(e, t, n) {
    return n.some(r => Za(e, t, r) && Xe(r) !== S)
}
function yT(e, t, n) {
    return n.some(r => Za(e, t, r))
}
function Za(e, t, n) {
    return (e.hasChildren() || t.length > 0) && n.pathMatch === "full" ? !1 : n.path === ""
}
function vT(e, t, n) {
    return t.length === 0 && !e.children[n]
}
var of = class {
}
;
async function DT(e, t, n, r, o, i, s="emptyOnly", a) {
    return new sf(e,t,n,r,o,s,i,a).recognize()
}
var ET = 31
  , sf = class {
    injector;
    configLoader;
    rootComponentType;
    config;
    urlTree;
    paramsInheritanceStrategy;
    urlSerializer;
    abortSignal;
    applyRedirects;
    absoluteRedirectCount = 0;
    allowRedirects = !0;
    constructor(t, n, r, o, i, s, a, c) {
        this.injector = t,
        this.configLoader = n,
        this.rootComponentType = r,
        this.config = o,
        this.urlTree = i,
        this.paramsInheritanceStrategy = s,
        this.urlSerializer = a,
        this.abortSignal = c,
        this.applyRedirects = new nf(this.urlSerializer,this.urlTree)
    }
    noMatchError(t) {
        return new y(4002,`'${t.segmentGroup}'`)
    }
    async recognize() {
        let t = _y(this.urlTree.root, [], [], this.config).segmentGroup
          , {children: n, rootSnapshot: r} = await this.match(t)
          , o = new Te(r,n)
          , i = new ri("",o)
          , s = Vy(r, [], this.urlTree.queryParams, this.urlTree.fragment);
        return s.queryParams = this.urlTree.queryParams,
        i.url = this.urlSerializer.serialize(s),
        {
            state: i,
            tree: s
        }
    }
    async match(t) {
        let n = new Hn([],Object.freeze({}),Object.freeze(g({}, this.urlTree.queryParams)),this.urlTree.fragment,Object.freeze({}),S,this.rootComponentType,null,{},this.injector);
        try {
            return {
                children: await this.processSegmentGroup(this.injector, this.config, t, S, n),
                rootSnapshot: n
            }
        } catch (r) {
            if (r instanceof ii)
                return this.urlTree = r.urlTree,
                this.match(r.urlTree.root);
            throw r instanceof xt ? this.noMatchError(r) : r
        }
    }
    async processSegmentGroup(t, n, r, o, i) {
        if (r.segments.length === 0 && r.hasChildren())
            return this.processChildren(t, n, r, i);
        let s = await this.processSegment(t, n, r, r.segments, o, !0, i);
        return s instanceof Te ? [s] : []
    }
    async processChildren(t, n, r, o) {
        let i = [];
        for (let c of Object.keys(r.children))
            c === "primary" ? i.unshift(c) : i.push(c);
        let s = [];
        for (let c of i) {
            let u = r.children[c]
              , l = fT(n, c)
              , d = await this.processSegmentGroup(t, l, u, c, o);
            s.push(...d)
        }
        let a = rv(s);
        return CT(a),
        a
    }
    async processSegment(t, n, r, o, i, s, a) {
        for (let c of n)
            try {
                return await this.processSegmentAgainstRoute(c._injector ?? t, n, c, r, o, i, s, a)
            } catch (u) {
                if (u instanceof xt || Jy(u))
                    continue;
                throw u
            }
        if (vT(r, o, i))
            return new of;
        throw new xt(r)
    }
    async processSegmentAgainstRoute(t, n, r, o, i, s, a, c) {
        if (Xe(r) !== s && (s === S || !Za(o, i, r)))
            throw new xt(o);
        if (r.redirectTo === void 0)
            return this.matchSegmentAgainstRoute(t, o, r, i, s, c);
        if (this.allowRedirects && a)
            return this.expandSegmentAgainstRouteUsingRedirect(t, o, n, r, i, s, c);
        throw new xt(o)
    }
    async expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s, a) {
        let {matched: c, parameters: u, consumedSegments: l, positionalParamSegments: d, remainingSegments: h} = nv(n, o, i);
        if (!c)
            throw new xt(n);
        typeof o.redirectTo == "string" && o.redirectTo[0] === "/" && (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > ET && (this.allowRedirects = !1));
        let f = new Hn(i,u,Object.freeze(g({}, this.urlTree.queryParams)),this.urlTree.fragment,by(o),Xe(o),o.component ?? o._loadedComponent ?? null,o,My(o),t)
          , m = za(f, a, this.paramsInheritanceStrategy);
        if (f.params = Object.freeze(m.params),
        f.data = Object.freeze(m.data),
        this.abortSignal.aborted)
            throw new Error(this.abortSignal.reason);
        let w = await this.applyRedirects.applyRedirectCommands(l, o.redirectTo, d, f, t)
          , E = await this.applyRedirects.lineralizeSegments(o, w);
        return this.processSegment(t, r, n, E.concat(h), s, !1, a)
    }
    async matchSegmentAgainstRoute(t, n, r, o, i, s) {
        if (this.abortSignal.aborted)
            throw new Error(this.abortSignal.reason);
        let a = await Aa(hT(n, r, o, t, this.urlSerializer, this.abortSignal));
        if (r.path === "**" && (n.children = {}),
        !a?.matched)
            throw new xt(n);
        t = r._injector ?? t;
        let {routes: c} = await this.getChildConfig(t, r, o)
          , u = r._loadedInjector ?? t
          , {parameters: l, consumedSegments: d, remainingSegments: h} = a
          , f = new Hn(d,l,Object.freeze(g({}, this.urlTree.queryParams)),this.urlTree.fragment,by(r),Xe(r),r.component ?? r._loadedComponent ?? null,r,My(r),t)
          , m = za(f, s, this.paramsInheritanceStrategy);
        f.params = Object.freeze(m.params),
        f.data = Object.freeze(m.data);
        let {segmentGroup: w, slicedSegments: E} = _y(n, d, h, c);
        if (E.length === 0 && w.hasChildren()) {
            let Ae = await this.processChildren(u, c, w, f);
            return new Te(f,Ae)
        }
        if (c.length === 0 && E.length === 0)
            return new Te(f,[]);
        let C = Xe(r) === i
          , W = await this.processSegment(u, c, w, E, C ? S : i, !0, f);
        return new Te(f,W instanceof Te ? [W] : [])
    }
    async getChildConfig(t, n, r) {
        if (n.children)
            return {
                routes: n.children,
                injector: t
            };
        if (n.loadChildren) {
            if (n._loadedRoutes !== void 0) {
                let i = n._loadedNgModuleFactory;
                return i && !n._loadedInjector && (n._loadedInjector = i.create(t).injector),
                {
                    routes: n._loadedRoutes,
                    injector: n._loadedInjector
                }
            }
            if (this.abortSignal.aborted)
                throw new Error(this.abortSignal.reason);
            if (await Aa(sT(t, n, r, this.urlSerializer, this.abortSignal))) {
                let i = await this.configLoader.loadChildren(t, n);
                return n._loadedRoutes = i.routes,
                n._loadedInjector = i.injector,
                n._loadedNgModuleFactory = i.factory,
                i
            }
            throw uT(n)
        }
        return {
            routes: [],
            injector: t
        }
    }
}
;
function CT(e) {
    e.sort( (t, n) => t.value.outlet === S ? -1 : n.value.outlet === S ? 1 : t.value.outlet.localeCompare(n.value.outlet))
}
function IT(e) {
    let t = e.value.routeConfig;
    return t && t.path === ""
}
function rv(e) {
    let t = []
      , n = new Set;
    for (let r of e) {
        if (!IT(r)) {
            t.push(r);
            continue
        }
        let o = t.find(i => r.value.routeConfig === i.value.routeConfig);
        o !== void 0 ? (o.children.push(...r.children),
        n.add(o)) : t.push(r)
    }
    for (let r of n) {
        let o = rv(r.children);
        t.push(new Te(r.value,o))
    }
    return t.filter(r => !n.has(r))
}
function by(e) {
    return e.data || {}
}
function My(e) {
    return e.resolve || {}
}
function wT(e, t, n, r, o, i, s) {
    return X(async a => {
        let {state: c, tree: u} = await DT(e, t, n, r, a.extractedUrl, o, i, s);
        return R(g({}, a), {
            targetSnapshot: c,
            urlAfterRedirects: u
        })
    }
    )
}
function _T(e) {
    return X(t => {
        let {targetSnapshot: n, guards: {canActivateChecks: r}} = t;
        if (!r.length)
            return A(t);
        let o = new Set(r.map(a => a.route))
          , i = new Set;
        for (let a of o)
            if (!i.has(a))
                for (let c of ov(a))
                    i.add(c);
        let s = 0;
        return z(i).pipe(Pt(a => o.has(a) ? bT(a, n, e) : (a.data = za(a, a.parent, e).resolve,
        A(void 0))), nt( () => s++), Ui(1), X(a => s === i.size ? A(t) : ce))
    }
    )
}
function ov(e) {
    let t = e.children.map(n => ov(n)).flat();
    return [e, ...t]
}
function bT(e, t, n) {
    let r = e.routeConfig
      , o = e._resolve;
    return r?.title !== void 0 && !qy(r) && (o[si] = r.title),
    Kr( () => (e.data = za(e, e.parent, n).resolve,
    MT(o, e, t).pipe(j(i => (e._resolvedData = i,
    e.data = g(g({}, e.data), i),
    null)))))
}
function MT(e, t, n) {
    let r = qd(e);
    if (r.length === 0)
        return A({});
    let o = {};
    return z(r).pipe(X(i => TT(e[i], t, n).pipe(gt(), nt(s => {
        if (s instanceof Ur)
            throw Ga(new Ot, s);
        o[i] = s
    }
    ))), Ui(1), j( () => o), fn(i => Jy(i) ? ce : gc(i)))
}
function TT(e, t, n) {
    let r = t._environmentInjector
      , o = $r(e, r)
      , i = o.resolve ? o.resolve(t, n) : ne(r, () => o(t, n));
    return Gn(i)
}
function Ty(e) {
    return Ne(t => {
        let n = e(t);
        return n ? z(n).pipe(j( () => t)) : A(t)
    }
    )
}
var ff = ( () => {
    class e {
        buildTitle(n) {
            let r, o = n.root;
            for (; o !== void 0; )
                r = this.getResolvedTitleForRoute(o) ?? r,
                o = o.children.find(i => i.outlet === S);
            return r
        }
        getResolvedTitleForRoute(n) {
            return n.data[si]
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: () => p(iv),
            providedIn: "root"
        })
    }
    return e
}
)()
  , iv = ( () => {
    class e extends ff {
        title;
        constructor(n) {
            super(),
            this.title = n
        }
        updateTitle(n) {
            let r = this.buildTitle(n);
            r !== void 0 && this.title.setTitle(r)
        }
        static \u0275fac = function(r) {
            return new (r || e)(I(vy))
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)()
  , Zn = new v("",{
    factory: () => ({})
})
  , Yn = new v("")
  , Ya = ( () => {
    class e {
        componentLoaders = new WeakMap;
        childrenLoaders = new WeakMap;
        onLoadStartListener;
        onLoadEndListener;
        compiler = p(yd);
        async loadComponent(n, r) {
            if (this.componentLoaders.get(r))
                return this.componentLoaders.get(r);
            if (r._loadedComponent)
                return Promise.resolve(r._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(r);
            let o = (async () => {
                try {
                    let i = await Ny(ne(n, () => r.loadComponent()))
                      , s = await cv(av(i));
                    return this.onLoadEndListener && this.onLoadEndListener(r),
                    r._loadedComponent = s,
                    s
                } finally {
                    this.componentLoaders.delete(r)
                }
            }
            )();
            return this.componentLoaders.set(r, o),
            o
        }
        loadChildren(n, r) {
            if (this.childrenLoaders.get(r))
                return this.childrenLoaders.get(r);
            if (r._loadedRoutes)
                return Promise.resolve({
                    routes: r._loadedRoutes,
                    injector: r._loadedInjector
                });
            this.onLoadStartListener && this.onLoadStartListener(r);
            let o = (async () => {
                try {
                    let i = await sv(r, this.compiler, n, this.onLoadEndListener);
                    return r._loadedRoutes = i.routes,
                    r._loadedInjector = i.injector,
                    r._loadedNgModuleFactory = i.factory,
                    i
                } finally {
                    this.childrenLoaders.delete(r)
                }
            }
            )();
            return this.childrenLoaders.set(r, o),
            o
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)();
async function sv(e, t, n, r) {
    let o = await Ny(ne(n, () => e.loadChildren())), i = await cv(av(o)), s;
    i instanceof na || Array.isArray(i) ? s = i : s = await t.compileModuleAsync(i),
    r && r(e);
    let a, c, u = !1, l;
    return Array.isArray(s) ? (c = s,
    u = !0) : (a = s.create(n).injector,
    l = s,
    c = a.get(Yn, [], {
        optional: !0,
        self: !0
    }).flat()),
    {
        routes: c.map(df),
        injector: a,
        factory: l
    }
}
function ST(e) {
    return e && typeof e == "object" && "default"in e
}
function av(e) {
    return ST(e) ? e.default : e
}
async function cv(e) {
    return e
}
var Qa = ( () => {
    class e {
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: () => p(AT),
            providedIn: "root"
        })
    }
    return e
}
)()
  , AT = ( () => {
    class e {
        shouldProcessUrl(n) {
            return !0
        }
        extract(n) {
            return n
        }
        merge(n, r) {
            return n
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)()
  , hf = new v("")
  , pf = new v("");
function uv(e, t, n) {
    let r = e.get(pf)
      , o = e.get($);
    if (!o.startViewTransition || r.skipNextTransition)
        return r.skipNextTransition = !1,
        new Promise(u => setTimeout(u));
    let i, s = new Promise(u => {
        i = u
    }
    ), a = o.startViewTransition( () => (i(),
    NT(e)));
    a.updateCallbackDone.catch(u => {}
    ),
    a.ready.catch(u => {}
    ),
    a.finished.catch(u => {}
    );
    let {onViewTransitionCreated: c} = r;
    return c && ne(e, () => c({
        transition: a,
        from: t,
        to: n
    })),
    s
}
function NT(e) {
    return new Promise(t => {
        Oo({
            read: () => setTimeout(t)
        }, {
            injector: e
        })
    }
    )
}
var RT = () => {}
  , gf = new v("")
  , Ka = ( () => {
    class e {
        currentNavigation = Ge(null, {
            equal: () => !1
        });
        currentTransition = null;
        lastSuccessfulNavigation = Ge(null);
        events = new J;
        transitionAbortWithErrorSubject = new J;
        configLoader = p(Ya);
        environmentInjector = p(H);
        destroyRef = p(Ce);
        urlSerializer = p(Wn);
        rootContexts = p(qn);
        location = p(en);
        inputBindingEnabled = p(ai, {
            optional: !0
        }) !== null;
        titleStrategy = p(ff);
        options = p(Zn, {
            optional: !0
        }) || {};
        paramsInheritanceStrategy = this.options.paramsInheritanceStrategy || "emptyOnly";
        urlHandlingStrategy = p(Qa);
        createViewTransition = p(hf, {
            optional: !0
        });
        navigationErrorHandler = p(gf, {
            optional: !0
        });
        navigationId = 0;
        get hasRequestedNavigation() {
            return this.navigationId !== 0
        }
        transitions;
        afterPreactivation = () => A(void 0);
        rootComponentType = null;
        destroyed = !1;
        constructor() {
            let n = o => this.events.next(new Pa(o))
              , r = o => this.events.next(new La(o));
            this.configLoader.onLoadEndListener = r,
            this.configLoader.onLoadStartListener = n,
            this.destroyRef.onDestroy( () => {
                this.destroyed = !0
            }
            )
        }
        complete() {
            this.transitions?.complete()
        }
        handleNavigationRequest(n) {
            let r = ++this.navigationId;
            re( () => {
                this.transitions?.next(R(g({}, n), {
                    extractedUrl: this.urlHandlingStrategy.extract(n.rawUrl),
                    targetSnapshot: null,
                    targetRouterState: null,
                    guards: {
                        canActivateChecks: [],
                        canDeactivateChecks: []
                    },
                    guardsResult: null,
                    id: r
                }))
            }
            )
        }
        setupNavigations(n) {
            return this.transitions = new ae(null),
            this.transitions.pipe(Ie(r => r !== null), Ne(r => {
                let o = !1
                  , i = new AbortController
                  , s = () => !o && this.currentTransition?.id === r.id;
                return A(r).pipe(Ne(a => {
                    if (this.navigationId > r.id)
                        return this.cancelNavigationTransition(r, "", he.SupersededByNewNavigation),
                        ce;
                    this.currentTransition = r;
                    let c = this.lastSuccessfulNavigation();
                    this.currentNavigation.set({
                        id: a.id,
                        initialUrl: a.rawUrl,
                        extractedUrl: a.extractedUrl,
                        targetBrowserUrl: typeof a.extras.browserUrl == "string" ? this.urlSerializer.parse(a.extras.browserUrl) : a.extras.browserUrl,
                        trigger: a.source,
                        extras: a.extras,
                        previousNavigation: c ? R(g({}, c), {
                            previousNavigation: null
                        }) : null,
                        abort: () => i.abort()
                    });
                    let u = !n.navigated || this.isUpdatingInternalState() || this.isUpdatedBrowserUrl()
                      , l = a.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                    if (!u && l !== "reload")
                        return this.events.next(new ht(a.id,this.urlSerializer.serialize(a.rawUrl),"",Pr.IgnoredSameUrlNavigation)),
                        a.resolve(!1),
                        ce;
                    if (this.urlHandlingStrategy.shouldProcessUrl(a.rawUrl))
                        return A(a).pipe(Ne(d => (this.events.next(new rn(d.id,this.urlSerializer.serialize(d.extractedUrl),d.source,d.restoredState)),
                        d.id !== this.navigationId ? ce : Promise.resolve(d))), wT(this.environmentInjector, this.configLoader, this.rootComponentType, n.config, this.urlSerializer, this.paramsInheritanceStrategy, i.signal), nt(d => {
                            r.targetSnapshot = d.targetSnapshot,
                            r.urlAfterRedirects = d.urlAfterRedirects,
                            this.currentNavigation.update(f => (f.finalUrl = d.urlAfterRedirects,
                            f));
                            let h = new Lr(d.id,this.urlSerializer.serialize(d.extractedUrl),this.urlSerializer.serialize(d.urlAfterRedirects),d.targetSnapshot);
                            this.events.next(h)
                        }
                        ));
                    if (u && this.urlHandlingStrategy.shouldProcessUrl(a.currentRawUrl)) {
                        let {id: d, extractedUrl: h, source: f, restoredState: m, extras: w} = a
                          , E = new rn(d,this.urlSerializer.serialize(h),f,m);
                        this.events.next(E);
                        let C = Gy(this.rootComponentType, this.environmentInjector).snapshot;
                        return this.currentTransition = r = R(g({}, a), {
                            targetSnapshot: C,
                            urlAfterRedirects: h,
                            extras: R(g({}, w), {
                                skipLocationChange: !1,
                                replaceUrl: !1
                            })
                        }),
                        this.currentNavigation.update(W => (W.finalUrl = h,
                        W)),
                        A(r)
                    } else
                        return this.events.next(new ht(a.id,this.urlSerializer.serialize(a.extractedUrl),"",Pr.IgnoredByUrlHandlingStrategy)),
                        a.resolve(!1),
                        ce
                }
                ), j(a => {
                    let c = new xa(a.id,this.urlSerializer.serialize(a.extractedUrl),this.urlSerializer.serialize(a.urlAfterRedirects),a.targetSnapshot);
                    return this.events.next(c),
                    this.currentTransition = r = R(g({}, a), {
                        guards: UM(a.targetSnapshot, a.currentSnapshot, this.rootContexts)
                    }),
                    r
                }
                ), JM(a => this.events.next(a)), Ne(a => {
                    if (r.guardsResult = a.guardsResult,
                    a.guardsResult && typeof a.guardsResult != "boolean")
                        throw Ga(this.urlSerializer, a.guardsResult);
                    let c = new Oa(a.id,this.urlSerializer.serialize(a.extractedUrl),this.urlSerializer.serialize(a.urlAfterRedirects),a.targetSnapshot,!!a.guardsResult);
                    if (this.events.next(c),
                    !s())
                        return ce;
                    if (!a.guardsResult)
                        return this.cancelNavigationTransition(a, "", he.GuardRejected),
                        ce;
                    if (a.guards.canActivateChecks.length === 0)
                        return A(a);
                    let u = new Fa(a.id,this.urlSerializer.serialize(a.extractedUrl),this.urlSerializer.serialize(a.urlAfterRedirects),a.targetSnapshot);
                    if (this.events.next(u),
                    !s())
                        return ce;
                    let l = !1;
                    return A(a).pipe(_T(this.paramsInheritanceStrategy), nt({
                        next: () => {
                            l = !0;
                            let d = new ka(a.id,this.urlSerializer.serialize(a.extractedUrl),this.urlSerializer.serialize(a.urlAfterRedirects),a.targetSnapshot);
                            this.events.next(d)
                        }
                        ,
                        complete: () => {
                            l || this.cancelNavigationTransition(a, "", he.NoDataFromResolver)
                        }
                    }))
                }
                ), Ty(a => {
                    let c = l => {
                        let d = [];
                        if (l.routeConfig?._loadedComponent)
                            l.component = l.routeConfig?._loadedComponent;
                        else if (l.routeConfig?.loadComponent) {
                            let h = l._environmentInjector;
                            d.push(this.configLoader.loadComponent(h, l.routeConfig).then(f => {
                                l.component = f
                            }
                            ))
                        }
                        for (let h of l.children)
                            d.push(...c(h));
                        return d
                    }
                      , u = c(a.targetSnapshot.root);
                    return u.length === 0 ? A(a) : z(Promise.all(u).then( () => a))
                }
                ), Ty( () => this.afterPreactivation()), Ne( () => {
                    let {currentSnapshot: a, targetSnapshot: c} = r
                      , u = this.createViewTransition?.(this.environmentInjector, a.root, c.root);
                    return u ? z(u).pipe(j( () => r)) : A(r)
                }
                ), pt(1), j(a => {
                    let c = LM(n.routeReuseStrategy, a.targetSnapshot, a.currentRouterState);
                    this.currentTransition = r = a = R(g({}, a), {
                        targetRouterState: c
                    }),
                    this.currentNavigation.update(u => (u.targetRouterState = c,
                    u)),
                    this.events.next(new Vr),
                    s() && (new tf(n.routeReuseStrategy,r.targetRouterState,r.currentRouterState,u => this.events.next(u),this.inputBindingEnabled).activate(this.rootContexts),
                    s() && (o = !0,
                    this.currentNavigation.update(u => (u.abort = RT,
                    u)),
                    this.lastSuccessfulNavigation.set(re(this.currentNavigation)),
                    this.events.next(new tt(a.id,this.urlSerializer.serialize(a.extractedUrl),this.urlSerializer.serialize(a.urlAfterRedirects))),
                    this.titleStrategy?.updateTitle(a.targetRouterState.snapshot),
                    a.resolve(!0)))
                }
                ), Xr(Xy(i.signal).pipe(Ie( () => !o && !r.targetRouterState), nt( () => {
                    this.cancelNavigationTransition(r, i.signal.reason + "", he.Aborted)
                }
                ))), nt({
                    complete: () => {
                        o = !0
                    }
                }), Xr(this.transitionAbortWithErrorSubject.pipe(nt(a => {
                    throw a
                }
                ))), Jr( () => {
                    i.abort(),
                    o || this.cancelNavigationTransition(r, "", he.SupersededByNewNavigation),
                    this.currentTransition?.id === r.id && (this.currentNavigation.set(null),
                    this.currentTransition = null)
                }
                ), fn(a => {
                    if (o = !0,
                    this.destroyed)
                        return r.resolve(!1),
                        ce;
                    if (Ky(a))
                        this.events.next(new je(r.id,this.urlSerializer.serialize(r.extractedUrl),a.message,a.cancellationCode)),
                        BM(a) ? this.events.next(new Br(a.url,a.navigationBehaviorOptions)) : r.resolve(!1);
                    else {
                        let c = new zn(r.id,this.urlSerializer.serialize(r.extractedUrl),a,r.targetSnapshot ?? void 0);
                        try {
                            let u = ne(this.environmentInjector, () => this.navigationErrorHandler?.(c));
                            if (u instanceof Ur) {
                                let {message: l, cancellationCode: d} = Ga(this.urlSerializer, u);
                                this.events.next(new je(r.id,this.urlSerializer.serialize(r.extractedUrl),l,d)),
                                this.events.next(new Br(u.redirectTo,u.navigationBehaviorOptions))
                            } else
                                throw this.events.next(c),
                                a
                        } catch (u) {
                            this.options.resolveNavigationPromiseOnError ? r.resolve(!1) : r.reject(u)
                        }
                    }
                    return ce
                }
                ))
            }
            ))
        }
        cancelNavigationTransition(n, r, o) {
            let i = new je(n.id,this.urlSerializer.serialize(n.extractedUrl),r,o);
            this.events.next(i),
            n.resolve(!1)
        }
        isUpdatingInternalState() {
            return this.currentTransition?.extractedUrl.toString() !== this.currentTransition?.currentUrlTree.toString()
        }
        isUpdatedBrowserUrl() {
            let n = this.urlHandlingStrategy.extract(this.urlSerializer.parse(this.location.path(!0)))
              , r = re(this.currentNavigation)
              , o = r?.targetBrowserUrl ?? r?.extractedUrl;
            return n.toString() !== o?.toString() && !r?.extras.skipLocationChange
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)();
function xT(e) {
    return e !== Or
}
var lv = new v("");
var dv = ( () => {
    class e {
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: () => p(OT),
            providedIn: "root"
        })
    }
    return e
}
)()
  , qa = class {
    shouldDetach(t) {
        return !1
    }
    store(t, n) {}
    shouldAttach(t) {
        return !1
    }
    retrieve(t) {
        return null
    }
    shouldReuseRoute(t, n) {
        return t.routeConfig === n.routeConfig
    }
    shouldDestroyInjector(t) {
        return !0
    }
}
  , OT = ( () => {
    class e extends qa {
        static \u0275fac = ( () => {
            let n;
            return function(o) {
                return (n || (n = Pn(e)))(o || e)
            }
        }
        )();
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)()
  , mf = ( () => {
    class e {
        urlSerializer = p(Wn);
        options = p(Zn, {
            optional: !0
        }) || {};
        canceledNavigationResolution = this.options.canceledNavigationResolution || "replace";
        location = p(en);
        urlHandlingStrategy = p(Qa);
        urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
        currentUrlTree = new et;
        getCurrentUrlTree() {
            return this.currentUrlTree
        }
        rawUrlTree = this.currentUrlTree;
        getRawUrlTree() {
            return this.rawUrlTree
        }
        createBrowserPath({finalUrl: n, initialUrl: r, targetBrowserUrl: o}) {
            let i = n !== void 0 ? this.urlHandlingStrategy.merge(n, r) : r
              , s = o ?? i;
            return s instanceof et ? this.urlSerializer.serialize(s) : s
        }
        commitTransition({targetRouterState: n, finalUrl: r, initialUrl: o}) {
            r && n ? (this.currentUrlTree = r,
            this.rawUrlTree = this.urlHandlingStrategy.merge(r, o),
            this.routerState = n) : this.rawUrlTree = o
        }
        routerState = Gy(null, p(H));
        getRouterState() {
            return this.routerState
        }
        _stateMemento = this.createStateMemento();
        get stateMemento() {
            return this._stateMemento
        }
        updateStateMemento() {
            this._stateMemento = this.createStateMemento()
        }
        createStateMemento() {
            return {
                rawUrlTree: this.rawUrlTree,
                currentUrlTree: this.currentUrlTree,
                routerState: this.routerState
            }
        }
        restoredState() {
            return this.location.getState()
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: () => p(FT),
            providedIn: "root"
        })
    }
    return e
}
)()
  , FT = ( () => {
    class e extends mf {
        currentPageId = 0;
        lastSuccessfulId = -1;
        get browserPageId() {
            return this.canceledNavigationResolution !== "computed" ? this.currentPageId : this.restoredState()?.\u0275routerPageId ?? this.currentPageId
        }
        registerNonRouterCurrentEntryChangeListener(n) {
            return this.location.subscribe(r => {
                r.type === "popstate" && setTimeout( () => {
                    n(r.url, r.state, "popstate")
                }
                )
            }
            )
        }
        handleRouterEvent(n, r) {
            n instanceof rn ? this.updateStateMemento() : n instanceof ht ? this.commitTransition(r) : n instanceof Lr ? this.urlUpdateStrategy === "eager" && (r.extras.skipLocationChange || this.setBrowserUrl(this.createBrowserPath(r), r)) : n instanceof Vr ? (this.commitTransition(r),
            this.urlUpdateStrategy === "deferred" && !r.extras.skipLocationChange && this.setBrowserUrl(this.createBrowserPath(r), r)) : n instanceof je && !zy(n) ? this.restoreHistory(r) : n instanceof zn ? this.restoreHistory(r, !0) : n instanceof tt && (this.lastSuccessfulId = n.id,
            this.currentPageId = this.browserPageId)
        }
        setBrowserUrl(n, {extras: r, id: o}) {
            let {replaceUrl: i, state: s} = r;
            if (this.location.isCurrentPathEqualTo(n) || i) {
                let a = this.browserPageId
                  , c = g(g({}, s), this.generateNgRouterState(o, a));
                this.location.replaceState(n, "", c)
            } else {
                let a = g(g({}, s), this.generateNgRouterState(o, this.browserPageId + 1));
                this.location.go(n, "", a)
            }
        }
        restoreHistory(n, r=!1) {
            if (this.canceledNavigationResolution === "computed") {
                let o = this.browserPageId
                  , i = this.currentPageId - o;
                i !== 0 ? this.location.historyGo(i) : this.getCurrentUrlTree() === n.finalUrl && i === 0 && (this.resetInternalState(n),
                this.resetUrlToCurrentUrlTree())
            } else
                this.canceledNavigationResolution === "replace" && (r && this.resetInternalState(n),
                this.resetUrlToCurrentUrlTree())
        }
        resetInternalState({finalUrl: n}) {
            this.routerState = this.stateMemento.routerState,
            this.currentUrlTree = this.stateMemento.currentUrlTree,
            this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, n ?? this.rawUrlTree)
        }
        resetUrlToCurrentUrlTree() {
            this.location.replaceState(this.urlSerializer.serialize(this.getRawUrlTree()), "", this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId))
        }
        generateNgRouterState(n, r) {
            return this.canceledNavigationResolution === "computed" ? {
                navigationId: n,
                \u0275routerPageId: r
            } : {
                navigationId: n
            }
        }
        static \u0275fac = ( () => {
            let n;
            return function(o) {
                return (n || (n = Pn(e)))(o || e)
            }
        }
        )();
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)();
function Ja(e, t) {
    e.events.pipe(Ie(n => n instanceof tt || n instanceof je || n instanceof zn || n instanceof ht), j(n => n instanceof tt || n instanceof ht ? 0 : (n instanceof je ? n.code === he.Redirect || n.code === he.SupersededByNewNavigation : !1) ? 2 : 1), Ie(n => n !== 2), pt(1)).subscribe( () => {
        t()
    }
    )
}
var fv = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact"
}
  , hv = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset"
}
  , on = ( () => {
    class e {
        get currentUrlTree() {
            return this.stateManager.getCurrentUrlTree()
        }
        get rawUrlTree() {
            return this.stateManager.getRawUrlTree()
        }
        disposed = !1;
        nonRouterCurrentEntryChangeSubscription;
        console = p(ra);
        stateManager = p(mf);
        options = p(Zn, {
            optional: !0
        }) || {};
        pendingTasks = p(wt);
        urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
        navigationTransitions = p(Ka);
        urlSerializer = p(Wn);
        location = p(en);
        urlHandlingStrategy = p(Qa);
        injector = p(H);
        _events = new J;
        get events() {
            return this._events
        }
        get routerState() {
            return this.stateManager.getRouterState()
        }
        navigated = !1;
        routeReuseStrategy = p(dv);
        injectorCleanup = p(lv, {
            optional: !0
        });
        onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore";
        config = p(Yn, {
            optional: !0
        })?.flat() ?? [];
        componentInputBindingEnabled = !!p(ai, {
            optional: !0
        });
        currentNavigation = this.navigationTransitions.currentNavigation.asReadonly();
        constructor() {
            this.resetConfig(this.config),
            this.navigationTransitions.setupNavigations(this).subscribe({
                error: n => {}
            }),
            this.subscribeToNavigationEvents()
        }
        eventsSubscription = new K;
        subscribeToNavigationEvents() {
            let n = this.navigationTransitions.events.subscribe(r => {
                try {
                    let o = this.navigationTransitions.currentTransition
                      , i = re(this.navigationTransitions.currentNavigation);
                    if (o !== null && i !== null) {
                        if (this.stateManager.handleRouterEvent(r, i),
                        r instanceof je && r.code !== he.Redirect && r.code !== he.SupersededByNewNavigation)
                            this.navigated = !0;
                        else if (r instanceof tt)
                            this.navigated = !0,
                            this.injectorCleanup?.(this.routeReuseStrategy, this.routerState, this.config);
                        else if (r instanceof Br) {
                            let s = r.navigationBehaviorOptions
                              , a = this.urlHandlingStrategy.merge(r.url, o.currentRawUrl)
                              , c = g({
                                scroll: o.extras.scroll,
                                browserUrl: o.extras.browserUrl,
                                info: o.extras.info,
                                skipLocationChange: o.extras.skipLocationChange,
                                replaceUrl: o.extras.replaceUrl || this.urlUpdateStrategy === "eager" || xT(o.source)
                            }, s);
                            this.scheduleNavigation(a, Or, null, c, {
                                resolve: o.resolve,
                                reject: o.reject,
                                promise: o.promise
                            })
                        }
                    }
                    kM(r) && this._events.next(r)
                } catch (o) {
                    this.navigationTransitions.transitionAbortWithErrorSubject.next(o)
                }
            }
            );
            this.eventsSubscription.add(n)
        }
        resetRootComponentType(n) {
            this.routerState.root.component = n,
            this.navigationTransitions.rootComponentType = n
        }
        initialNavigation() {
            this.setUpLocationChangeListener(),
            this.navigationTransitions.hasRequestedNavigation || this.navigateToSyncWithBrowser(this.location.path(!0), Or, this.stateManager.restoredState())
        }
        setUpLocationChangeListener() {
            this.nonRouterCurrentEntryChangeSubscription ??= this.stateManager.registerNonRouterCurrentEntryChangeListener( (n, r, o) => {
                this.navigateToSyncWithBrowser(n, o, r)
            }
            )
        }
        navigateToSyncWithBrowser(n, r, o) {
            let i = {
                replaceUrl: !0
            }
              , s = o?.navigationId ? o : null;
            if (o) {
                let c = g({}, o);
                delete c.navigationId,
                delete c.\u0275routerPageId,
                Object.keys(c).length !== 0 && (i.state = c)
            }
            let a = this.parseUrl(n);
            this.scheduleNavigation(a, r, s, i).catch(c => {
                this.disposed || this.injector.get(ze)(c)
            }
            )
        }
        get url() {
            return this.serializeUrl(this.currentUrlTree)
        }
        getCurrentNavigation() {
            return re(this.navigationTransitions.currentNavigation)
        }
        get lastSuccessfulNavigation() {
            return this.navigationTransitions.lastSuccessfulNavigation
        }
        resetConfig(n) {
            this.config = n.map(df),
            this.navigated = !1
        }
        ngOnDestroy() {
            this.dispose()
        }
        dispose() {
            this._events.unsubscribe(),
            this.navigationTransitions.complete(),
            this.nonRouterCurrentEntryChangeSubscription?.unsubscribe(),
            this.nonRouterCurrentEntryChangeSubscription = void 0,
            this.disposed = !0,
            this.eventsSubscription.unsubscribe()
        }
        createUrlTree(n, r={}) {
            let {relativeTo: o, queryParams: i, fragment: s, queryParamsHandling: a, preserveFragment: c} = r
              , u = c ? this.currentUrlTree.fragment : s
              , l = null;
            switch (a ?? this.options.defaultQueryParamsHandling) {
            case "merge":
                l = g(g({}, this.currentUrlTree.queryParams), i);
                break;
            case "preserve":
                l = this.currentUrlTree.queryParams;
                break;
            default:
                l = i || null
            }
            l !== null && (l = this.removeEmptyProps(l));
            let d;
            try {
                let h = o ? o.snapshot : this.routerState.snapshot.root;
                d = By(h)
            } catch {
                (typeof n[0] != "string" || n[0][0] !== "/") && (n = []),
                d = this.currentUrlTree.root
            }
            return Uy(d, n, l, u ?? null, this.urlSerializer)
        }
        navigateByUrl(n, r={
            skipLocationChange: !1
        }) {
            let o = kr(n) ? n : this.parseUrl(n)
              , i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
            return this.scheduleNavigation(i, Or, null, r)
        }
        navigate(n, r={
            skipLocationChange: !1
        }) {
            return kT(n),
            this.navigateByUrl(this.createUrlTree(n, r), r)
        }
        serializeUrl(n) {
            return this.urlSerializer.serialize(n)
        }
        parseUrl(n) {
            try {
                return this.urlSerializer.parse(n)
            } catch {
                return this.console.warn(xe(4018, !1)),
                this.urlSerializer.parse("/")
            }
        }
        isActive(n, r) {
            let o;
            if (r === !0 ? o = g({}, fv) : r === !1 ? o = g({}, hv) : o = r,
            kr(n))
                return Dy(this.currentUrlTree, n, o);
            let i = this.parseUrl(n);
            return Dy(this.currentUrlTree, i, o)
        }
        removeEmptyProps(n) {
            return Object.entries(n).reduce( (r, [o,i]) => (i != null && (r[o] = i),
            r), {})
        }
        scheduleNavigation(n, r, o, i, s) {
            if (this.disposed)
                return Promise.resolve(!1);
            let a, c, u;
            s ? (a = s.resolve,
            c = s.reject,
            u = s.promise) : u = new Promise( (d, h) => {
                a = d,
                c = h
            }
            );
            let l = this.pendingTasks.add();
            return Ja(this, () => {
                queueMicrotask( () => this.pendingTasks.remove(l))
            }
            ),
            this.navigationTransitions.handleNavigationRequest({
                source: r,
                restoredState: o,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.currentUrlTree,
                rawUrl: n,
                extras: i,
                resolve: a,
                reject: c,
                promise: u,
                currentSnapshot: this.routerState.snapshot,
                currentRouterState: this.routerState
            }),
            u.catch(d => Promise.reject(d))
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)();
function kT(e) {
    for (let t = 0; t < e.length; t++)
        if (e[t] == null)
            throw new y(4008,!1)
}
var ui = class {
}
;
var pv = ( () => {
    class e {
        router;
        injector;
        preloadingStrategy;
        loader;
        subscription;
        constructor(n, r, o, i) {
            this.router = n,
            this.injector = r,
            this.preloadingStrategy = o,
            this.loader = i
        }
        setUpPreloading() {
            this.subscription = this.router.events.pipe(Ie(n => n instanceof tt), Pt( () => this.preload())).subscribe( () => {}
            )
        }
        preload() {
            return this.processRoutes(this.injector, this.router.config)
        }
        ngOnDestroy() {
            this.subscription?.unsubscribe()
        }
        processRoutes(n, r) {
            let o = [];
            for (let i of r) {
                i.providers && !i._injector && (i._injector = Mr(i.providers, n, ""));
                let s = i._injector ?? n;
                i._loadedNgModuleFactory && !i._loadedInjector && (i._loadedInjector = i._loadedNgModuleFactory.create(s).injector);
                let a = i._loadedInjector ?? s;
                (i.loadChildren && !i._loadedRoutes && i.canLoad === void 0 || i.loadComponent && !i._loadedComponent) && o.push(this.preloadConfig(s, i)),
                (i.children || i._loadedRoutes) && o.push(this.processRoutes(a, i.children ?? i._loadedRoutes))
            }
            return z(o).pipe(ir())
        }
        preloadConfig(n, r) {
            return this.preloadingStrategy.preload(r, () => {
                if (n.destroyed)
                    return A(null);
                let o;
                r.loadChildren && r.canLoad === void 0 ? o = z(this.loader.loadChildren(n, r)) : o = A(null);
                let i = o.pipe(X(s => s === null ? A(void 0) : (r._loadedRoutes = s.routes,
                r._loadedInjector = s.injector,
                r._loadedNgModuleFactory = s.factory,
                this.processRoutes(s.injector ?? n, s.routes))));
                if (r.loadComponent && !r._loadedComponent) {
                    let s = this.loader.loadComponent(n, r);
                    return z([i, s]).pipe(ir())
                } else
                    return i
            }
            )
        }
        static \u0275fac = function(r) {
            return new (r || e)(I(on),I(H),I(ui),I(Ya))
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
}
)()
  , gv = new v("")
  , LT = ( () => {
    class e {
        options;
        routerEventsSubscription;
        scrollEventsSubscription;
        lastId = 0;
        lastSource = Or;
        restoredId = 0;
        store = {};
        urlSerializer = p(Wn);
        zone = p(fe);
        viewportScroller = p(Nd);
        transitions = p(Ka);
        constructor(n) {
            this.options = n,
            this.options.scrollPositionRestoration ||= "disabled",
            this.options.anchorScrolling ||= "disabled"
        }
        init() {
            this.options.scrollPositionRestoration !== "disabled" && this.viewportScroller.setHistoryScrollRestoration("manual"),
            this.routerEventsSubscription = this.createScrollEvents(),
            this.scrollEventsSubscription = this.consumeScrollEvents()
        }
        createScrollEvents() {
            return this.transitions.events.subscribe(n => {
                n instanceof rn ? (this.store[this.lastId] = this.viewportScroller.getScrollPosition(),
                this.lastSource = n.navigationTrigger,
                this.restoredId = n.restoredState ? n.restoredState.navigationId : 0) : n instanceof tt ? (this.lastId = n.id,
                this.scheduleScrollEvent(n, this.urlSerializer.parse(n.urlAfterRedirects).fragment)) : n instanceof ht && n.code === Pr.IgnoredSameUrlNavigation && (this.lastSource = void 0,
                this.restoredId = 0,
                this.scheduleScrollEvent(n, this.urlSerializer.parse(n.url).fragment))
            }
            )
        }
        consumeScrollEvents() {
            return this.transitions.events.subscribe(n => {
                if (!(n instanceof jr) || n.scrollBehavior === "manual")
                    return;
                let r = {
                    behavior: "instant"
                };
                n.position ? this.options.scrollPositionRestoration === "top" ? this.viewportScroller.scrollToPosition([0, 0], r) : this.options.scrollPositionRestoration === "enabled" && this.viewportScroller.scrollToPosition(n.position, r) : n.anchor && this.options.anchorScrolling === "enabled" ? this.viewportScroller.scrollToAnchor(n.anchor) : this.options.scrollPositionRestoration !== "disabled" && this.viewportScroller.scrollToPosition([0, 0])
            }
            )
        }
        scheduleScrollEvent(n, r) {
            let o = re(this.transitions.currentNavigation)?.extras.scroll;
            this.zone.runOutsideAngular(async () => {
                await new Promise(i => {
                    setTimeout(i),
                    typeof requestAnimationFrame < "u" && requestAnimationFrame(i)
                }
                ),
                this.zone.run( () => {
                    this.transitions.events.next(new jr(n,this.lastSource === "popstate" ? this.store[this.restoredId] : null,r,o))
                }
                )
            }
            )
        }
        ngOnDestroy() {
            this.routerEventsSubscription?.unsubscribe(),
            this.scrollEventsSubscription?.unsubscribe()
        }
        static \u0275fac = function(r) {
            nd()
        }
        ;
        static \u0275prov = D({
            token: e,
            factory: e.\u0275fac
        })
    }
    return e
}
)();
function jT(e, ...t) {
    return Et([{
        provide: Yn,
        multi: !0,
        useValue: e
    }, [], {
        provide: Ft,
        useFactory: mv
    }, {
        provide: jo,
        multi: !0,
        useFactory: yv
    }, t.map(n => n.\u0275providers)])
}
function mv() {
    return p(on).routerState.root
}
function li(e, t) {
    return {
        \u0275kind: e,
        \u0275providers: t
    }
}
function yv() {
    let e = p(le);
    return t => {
        let n = e.get(Xt);
        if (t !== n.components[0])
            return;
        let r = e.get(on)
          , o = e.get(vv);
        e.get(vf) === 1 && r.initialNavigation(),
        e.get(Cv, null, {
            optional: !0
        })?.setUpPreloading(),
        e.get(gv, null, {
            optional: !0
        })?.init(),
        r.resetRootComponentType(n.componentTypes[0]),
        o.closed || (o.next(),
        o.complete(),
        o.unsubscribe())
    }
}
var vv = new v("",{
    factory: () => new J
})
  , vf = new v("",{
    factory: () => 1
});
function Dv() {
    let e = [{
        provide: qs,
        useValue: !0
    }, {
        provide: vf,
        useValue: 0
    }, oa( () => {
        let t = p(le);
        return t.get(Md, Promise.resolve()).then( () => new Promise(r => {
            let o = t.get(on)
              , i = t.get(vv);
            Ja(o, () => {
                r(!0)
            }
            ),
            t.get(Ka).afterPreactivation = () => (r(!0),
            i.closed ? A(void 0) : i),
            o.initialNavigation()
        }
        ))
    }
    )];
    return li(2, e)
}
function Ev() {
    let e = [oa( () => {
        p(on).setUpLocationChangeListener()
    }
    ), {
        provide: vf,
        useValue: 2
    }];
    return li(3, e)
}
var Cv = new v("");
function Iv(e) {
    return li(0, [{
        provide: Cv,
        useExisting: pv
    }, {
        provide: ui,
        useExisting: e
    }])
}
function wv() {
    return li(8, [uf, {
        provide: ai,
        useExisting: uf
    }])
}
function _v(e) {
    Ke("NgRouterViewTransitions");
    let t = [{
        provide: hf,
        useValue: uv
    }, {
        provide: pf,
        useValue: g({
            skipNextTransition: !!e?.skipInitialTransition
        }, e)
    }];
    return li(9, t)
}
var bv = [en, {
    provide: Wn,
    useClass: Ot
}, on, qn, {
    provide: Ft,
    useFactory: mv
}, Ya, []]
  , VT = ( () => {
    class e {
        constructor() {}
        static forRoot(n, r) {
            return {
                ngModule: e,
                providers: [bv, [], {
                    provide: Yn,
                    multi: !0,
                    useValue: n
                }, [], r?.errorHandler ? {
                    provide: gf,
                    useValue: r.errorHandler
                } : [], {
                    provide: Zn,
                    useValue: r || {}
                }, r?.useHash ? UT() : HT(), BT(), r?.preloadingStrategy ? Iv(r.preloadingStrategy).\u0275providers : [], r?.initialNavigation ? $T(r) : [], r?.bindToComponentInputs ? wv().\u0275providers : [], r?.enableViewTransitions ? _v().\u0275providers : [], zT()]
            }
        }
        static forChild(n) {
            return {
                ngModule: e,
                providers: [{
                    provide: Yn,
                    multi: !0,
                    useValue: n
                }]
            }
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275mod = Pe({
            type: e
        });
        static \u0275inj = _e({})
    }
    return e
}
)();
function BT() {
    return {
        provide: gv,
        useFactory: () => {
            let e = p(Nd)
              , t = p(Zn);
            return t.scrollOffset && e.setOffset(t.scrollOffset),
            new LT(t)
        }
    }
}
function UT() {
    return {
        provide: Nt,
        useClass: Sd
    }
}
function HT() {
    return {
        provide: Nt,
        useClass: ha
    }
}
function $T(e) {
    return [e.initialNavigation === "disabled" ? Ev().\u0275providers : [], e.initialNavigation === "enabledBlocking" ? Dv().\u0275providers : []]
}
var yf = new v("");
function zT() {
    return [{
        provide: yf,
        useFactory: yv
    }, {
        provide: jo,
        multi: !0,
        useExisting: yf
    }]
}
var Fv = ( () => {
    class e {
        _renderer;
        _elementRef;
        onChange = n => {}
        ;
        onTouched = () => {}
        ;
        constructor(n, r) {
            this._renderer = n,
            this._elementRef = r
        }
        setProperty(n, r) {
            this._renderer.setProperty(this._elementRef.nativeElement, n, r)
        }
        registerOnTouched(n) {
            this.onTouched = n
        }
        registerOnChange(n) {
            this.onChange = n
        }
        setDisabledState(n) {
            this.setProperty("disabled", n)
        }
        static \u0275fac = function(r) {
            return new (r || e)(U(St),U(Me))
        }
        ;
        static \u0275dir = ye({
            type: e
        })
    }
    return e
}
)()
  , WT = ( () => {
    class e extends Fv {
        static \u0275fac = ( () => {
            let n;
            return function(o) {
                return (n || (n = Pn(e)))(o || e)
            }
        }
        )();
        static \u0275dir = ye({
            type: e,
            features: [Kt]
        })
    }
    return e
}
)()
  , kv = new v("");
var qT = {
    provide: kv,
    useExisting: Ut( () => Pv),
    multi: !0
};
function ZT() {
    let e = Le() ? Le().getUserAgent() : "";
    return /android (\d+)/.test(e.toLowerCase())
}
var YT = new v("")
  , Pv = ( () => {
    class e extends Fv {
        _compositionMode;
        _composing = !1;
        constructor(n, r, o) {
            super(n, r),
            this._compositionMode = o,
            this._compositionMode == null && (this._compositionMode = !ZT())
        }
        writeValue(n) {
            let r = n ?? "";
            this.setProperty("value", r)
        }
        _handleInput(n) {
            (!this._compositionMode || this._compositionMode && !this._composing) && this.onChange(n)
        }
        _compositionStart() {
            this._composing = !0
        }
        _compositionEnd(n) {
            this._composing = !1,
            this._compositionMode && this.onChange(n)
        }
        static \u0275fac = function(r) {
            return new (r || e)(U(St),U(Me),U(YT, 8))
        }
        ;
        static \u0275dir = ye({
            type: e,
            selectors: [["input", "formControlName", "", 3, "type", "checkbox"], ["textarea", "formControlName", ""], ["input", "formControl", "", 3, "type", "checkbox"], ["textarea", "formControl", ""], ["input", "ngModel", "", 3, "type", "checkbox"], ["textarea", "ngModel", ""], ["", "ngDefaultControl", ""]],
            hostBindings: function(r, o) {
                r & 1 && Uo("input", function(s) {
                    return o._handleInput(s.target.value)
                })("blur", function() {
                    return o.onTouched()
                })("compositionstart", function() {
                    return o._compositionStart()
                })("compositionend", function(s) {
                    return o._compositionEnd(s.target.value)
                })
            },
            standalone: !1,
            features: [Ho([qT]), Kt]
        })
    }
    return e
}
)();
function QT(e) {
    return e == null ? null : Array.isArray(e) || typeof e == "string" ? e.length : e instanceof Set ? e.size : null
}
var Lv = new v("")
  , KT = new v("");
function JT(e) {
    return t => {
        let n = t.value?.length ?? QT(t.value);
        return n !== null && n > e ? {
            maxlength: {
                requiredLength: e,
                actualLength: n
            }
        } : null
    }
}
function Mv(e) {
    return null
}
function jv(e) {
    return e != null
}
function Vv(e) {
    return Jt(e) ? z(e) : e
}
function Bv(e) {
    let t = {};
    return e.forEach(n => {
        t = n != null ? g(g({}, t), n) : t
    }
    ),
    Object.keys(t).length === 0 ? null : t
}
function Uv(e, t) {
    return t.map(n => n(e))
}
function XT(e) {
    return !e.validate
}
function Hv(e) {
    return e.map(t => XT(t) ? t : n => t.validate(n))
}
function eS(e) {
    if (!e)
        return null;
    let t = e.filter(jv);
    return t.length == 0 ? null : function(n) {
        return Bv(Uv(n, t))
    }
}
function $v(e) {
    return e != null ? eS(Hv(e)) : null
}
function tS(e) {
    if (!e)
        return null;
    let t = e.filter(jv);
    return t.length == 0 ? null : function(n) {
        let r = Uv(n, t).map(Vv);
        return mc(r).pipe(j(Bv))
    }
}
function zv(e) {
    return e != null ? tS(Hv(e)) : null
}
function Tv(e, t) {
    return e === null ? [t] : Array.isArray(e) ? [...e, t] : [e, t]
}
function nS(e) {
    return e._rawValidators
}
function rS(e) {
    return e._rawAsyncValidators
}
function Df(e) {
    return e ? Array.isArray(e) ? e : [e] : []
}
function ec(e, t) {
    return Array.isArray(e) ? e.includes(t) : e === t
}
function Sv(e, t) {
    let n = Df(t);
    return Df(e).forEach(o => {
        ec(n, o) || n.push(o)
    }
    ),
    n
}
function Av(e, t) {
    return Df(t).filter(n => !ec(e, n))
}
var tc = class {
    get value() {
        return this.control ? this.control.value : null
    }
    get valid() {
        return this.control ? this.control.valid : null
    }
    get invalid() {
        return this.control ? this.control.invalid : null
    }
    get pending() {
        return this.control ? this.control.pending : null
    }
    get disabled() {
        return this.control ? this.control.disabled : null
    }
    get enabled() {
        return this.control ? this.control.enabled : null
    }
    get errors() {
        return this.control ? this.control.errors : null
    }
    get pristine() {
        return this.control ? this.control.pristine : null
    }
    get dirty() {
        return this.control ? this.control.dirty : null
    }
    get touched() {
        return this.control ? this.control.touched : null
    }
    get status() {
        return this.control ? this.control.status : null
    }
    get untouched() {
        return this.control ? this.control.untouched : null
    }
    get statusChanges() {
        return this.control ? this.control.statusChanges : null
    }
    get valueChanges() {
        return this.control ? this.control.valueChanges : null
    }
    get path() {
        return null
    }
    _composedValidatorFn;
    _composedAsyncValidatorFn;
    _rawValidators = [];
    _rawAsyncValidators = [];
    _setValidators(t) {
        this._rawValidators = t || [],
        this._composedValidatorFn = $v(this._rawValidators)
    }
    _setAsyncValidators(t) {
        this._rawAsyncValidators = t || [],
        this._composedAsyncValidatorFn = zv(this._rawAsyncValidators)
    }
    get validator() {
        return this._composedValidatorFn || null
    }
    get asyncValidator() {
        return this._composedAsyncValidatorFn || null
    }
    _onDestroyCallbacks = [];
    _registerOnDestroy(t) {
        this._onDestroyCallbacks.push(t)
    }
    _invokeOnDestroyCallbacks() {
        this._onDestroyCallbacks.forEach(t => t()),
        this._onDestroyCallbacks = []
    }
    reset(t=void 0) {
        this.control && this.control.reset(t)
    }
    hasError(t, n) {
        return this.control ? this.control.hasError(t, n) : !1
    }
    getError(t, n) {
        return this.control ? this.control.getError(t, n) : null
    }
}
  , Ef = class extends tc {
    name;
    get formDirective() {
        return null
    }
    get path() {
        return null
    }
}
  , gi = class extends tc {
    _parent = null;
    name = null;
    valueAccessor = null
}
  , Cf = class {
    _cd;
    constructor(t) {
        this._cd = t
    }
    get isTouched() {
        return this._cd?.control?._touched?.(),
        !!this._cd?.control?.touched
    }
    get isUntouched() {
        return !!this._cd?.control?.untouched
    }
    get isPristine() {
        return this._cd?.control?._pristine?.(),
        !!this._cd?.control?.pristine
    }
    get isDirty() {
        return !!this._cd?.control?.dirty
    }
    get isValid() {
        return this._cd?.control?._status?.(),
        !!this._cd?.control?.valid
    }
    get isInvalid() {
        return !!this._cd?.control?.invalid
    }
    get isPending() {
        return !!this._cd?.control?.pending
    }
    get isSubmitted() {
        return this._cd?._submitted?.(),
        !!this._cd?.submitted
    }
}
;
var V2 = ( () => {
    class e extends Cf {
        constructor(n) {
            super(n)
        }
        static \u0275fac = function(r) {
            return new (r || e)(U(gi, 2))
        }
        ;
        static \u0275dir = ye({
            type: e,
            selectors: [["", "formControlName", ""], ["", "ngModel", ""], ["", "formControl", ""]],
            hostVars: 14,
            hostBindings: function(r, o) {
                r & 2 && sa("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)("ng-pristine", o.isPristine)("ng-dirty", o.isDirty)("ng-valid", o.isValid)("ng-invalid", o.isInvalid)("ng-pending", o.isPending)
            },
            standalone: !1,
            features: [Kt]
        })
    }
    return e
}
)();
var di = "VALID"
  , Xa = "INVALID"
  , zr = "PENDING"
  , fi = "DISABLED"
  , Qn = class {
}
  , nc = class extends Qn {
    value;
    source;
    constructor(t, n) {
        super(),
        this.value = t,
        this.source = n
    }
}
  , hi = class extends Qn {
    pristine;
    source;
    constructor(t, n) {
        super(),
        this.pristine = t,
        this.source = n
    }
}
  , pi = class extends Qn {
    touched;
    source;
    constructor(t, n) {
        super(),
        this.touched = t,
        this.source = n
    }
}
  , Gr = class extends Qn {
    status;
    source;
    constructor(t, n) {
        super(),
        this.status = t,
        this.source = n
    }
}
;
var If = class extends Qn {
    source;
    constructor(t) {
        super(),
        this.source = t
    }
}
;
function oS(e) {
    return (rc(e) ? e.validators : e) || null
}
function iS(e) {
    return Array.isArray(e) ? $v(e) : e || null
}
function sS(e, t) {
    return (rc(t) ? t.asyncValidators : e) || null
}
function aS(e) {
    return Array.isArray(e) ? zv(e) : e || null
}
function rc(e) {
    return e != null && !Array.isArray(e) && typeof e == "object"
}
var wf = class {
    _pendingDirty = !1;
    _hasOwnPendingAsyncValidator = null;
    _pendingTouched = !1;
    _onCollectionChange = () => {}
    ;
    _updateOn;
    _parent = null;
    _asyncValidationSubscription;
    _composedValidatorFn;
    _composedAsyncValidatorFn;
    _rawValidators;
    _rawAsyncValidators;
    value;
    constructor(t, n) {
        this._assignValidators(t),
        this._assignAsyncValidators(n)
    }
    get validator() {
        return this._composedValidatorFn
    }
    set validator(t) {
        this._rawValidators = this._composedValidatorFn = t
    }
    get asyncValidator() {
        return this._composedAsyncValidatorFn
    }
    set asyncValidator(t) {
        this._rawAsyncValidators = this._composedAsyncValidatorFn = t
    }
    get parent() {
        return this._parent
    }
    get status() {
        return re(this.statusReactive)
    }
    set status(t) {
        re( () => this.statusReactive.set(t))
    }
    _status = Tr( () => this.statusReactive());
    statusReactive = Ge(void 0);
    get valid() {
        return this.status === di
    }
    get invalid() {
        return this.status === Xa
    }
    get pending() {
        return this.status == zr
    }
    get disabled() {
        return this.status === fi
    }
    get enabled() {
        return this.status !== fi
    }
    errors;
    get pristine() {
        return re(this.pristineReactive)
    }
    set pristine(t) {
        re( () => this.pristineReactive.set(t))
    }
    _pristine = Tr( () => this.pristineReactive());
    pristineReactive = Ge(!0);
    get dirty() {
        return !this.pristine
    }
    get touched() {
        return re(this.touchedReactive)
    }
    set touched(t) {
        re( () => this.touchedReactive.set(t))
    }
    _touched = Tr( () => this.touchedReactive());
    touchedReactive = Ge(!1);
    get untouched() {
        return !this.touched
    }
    _events = new J;
    events = this._events.asObservable();
    valueChanges;
    statusChanges;
    get updateOn() {
        return this._updateOn ? this._updateOn : this.parent ? this.parent.updateOn : "change"
    }
    setValidators(t) {
        this._assignValidators(t)
    }
    setAsyncValidators(t) {
        this._assignAsyncValidators(t)
    }
    addValidators(t) {
        this.setValidators(Sv(t, this._rawValidators))
    }
    addAsyncValidators(t) {
        this.setAsyncValidators(Sv(t, this._rawAsyncValidators))
    }
    removeValidators(t) {
        this.setValidators(Av(t, this._rawValidators))
    }
    removeAsyncValidators(t) {
        this.setAsyncValidators(Av(t, this._rawAsyncValidators))
    }
    hasValidator(t) {
        return ec(this._rawValidators, t)
    }
    hasAsyncValidator(t) {
        return ec(this._rawAsyncValidators, t)
    }
    clearValidators() {
        this.validator = null
    }
    clearAsyncValidators() {
        this.asyncValidator = null
    }
    markAsTouched(t={}) {
        let n = this.touched === !1;
        this.touched = !0;
        let r = t.sourceControl ?? this;
        this._parent && !t.onlySelf && this._parent.markAsTouched(R(g({}, t), {
            sourceControl: r
        })),
        n && t.emitEvent !== !1 && this._events.next(new pi(!0,r))
    }
    markAllAsDirty(t={}) {
        this.markAsDirty({
            onlySelf: !0,
            emitEvent: t.emitEvent,
            sourceControl: this
        }),
        this._forEachChild(n => n.markAllAsDirty(t))
    }
    markAllAsTouched(t={}) {
        this.markAsTouched({
            onlySelf: !0,
            emitEvent: t.emitEvent,
            sourceControl: this
        }),
        this._forEachChild(n => n.markAllAsTouched(t))
    }
    markAsUntouched(t={}) {
        let n = this.touched === !0;
        this.touched = !1,
        this._pendingTouched = !1;
        let r = t.sourceControl ?? this;
        this._forEachChild(o => {
            o.markAsUntouched({
                onlySelf: !0,
                emitEvent: t.emitEvent,
                sourceControl: r
            })
        }
        ),
        this._parent && !t.onlySelf && this._parent._updateTouched(t, r),
        n && t.emitEvent !== !1 && this._events.next(new pi(!1,r))
    }
    markAsDirty(t={}) {
        let n = this.pristine === !0;
        this.pristine = !1;
        let r = t.sourceControl ?? this;
        this._parent && !t.onlySelf && this._parent.markAsDirty(R(g({}, t), {
            sourceControl: r
        })),
        n && t.emitEvent !== !1 && this._events.next(new hi(!1,r))
    }
    markAsPristine(t={}) {
        let n = this.pristine === !1;
        this.pristine = !0,
        this._pendingDirty = !1;
        let r = t.sourceControl ?? this;
        this._forEachChild(o => {
            o.markAsPristine({
                onlySelf: !0,
                emitEvent: t.emitEvent
            })
        }
        ),
        this._parent && !t.onlySelf && this._parent._updatePristine(t, r),
        n && t.emitEvent !== !1 && this._events.next(new hi(!0,r))
    }
    markAsPending(t={}) {
        this.status = zr;
        let n = t.sourceControl ?? this;
        t.emitEvent !== !1 && (this._events.next(new Gr(this.status,n)),
        this.statusChanges.emit(this.status)),
        this._parent && !t.onlySelf && this._parent.markAsPending(R(g({}, t), {
            sourceControl: n
        }))
    }
    disable(t={}) {
        let n = this._parentMarkedDirty(t.onlySelf);
        this.status = fi,
        this.errors = null,
        this._forEachChild(o => {
            o.disable(R(g({}, t), {
                onlySelf: !0
            }))
        }
        ),
        this._updateValue();
        let r = t.sourceControl ?? this;
        t.emitEvent !== !1 && (this._events.next(new nc(this.value,r)),
        this._events.next(new Gr(this.status,r)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._updateAncestors(R(g({}, t), {
            skipPristineCheck: n
        }), this),
        this._onDisabledChange.forEach(o => o(!0))
    }
    enable(t={}) {
        let n = this._parentMarkedDirty(t.onlySelf);
        this.status = di,
        this._forEachChild(r => {
            r.enable(R(g({}, t), {
                onlySelf: !0
            }))
        }
        ),
        this.updateValueAndValidity({
            onlySelf: !0,
            emitEvent: t.emitEvent
        }),
        this._updateAncestors(R(g({}, t), {
            skipPristineCheck: n
        }), this),
        this._onDisabledChange.forEach(r => r(!1))
    }
    _updateAncestors(t, n) {
        this._parent && !t.onlySelf && (this._parent.updateValueAndValidity(t),
        t.skipPristineCheck || this._parent._updatePristine({}, n),
        this._parent._updateTouched({}, n))
    }
    setParent(t) {
        this._parent = t
    }
    getRawValue() {
        return this.value
    }
    updateValueAndValidity(t={}) {
        if (this._setInitialStatus(),
        this._updateValue(),
        this.enabled) {
            let r = this._cancelExistingSubscription();
            this.errors = this._runValidator(),
            this.status = this._calculateStatus(),
            (this.status === di || this.status === zr) && this._runAsyncValidator(r, t.emitEvent)
        }
        let n = t.sourceControl ?? this;
        t.emitEvent !== !1 && (this._events.next(new nc(this.value,n)),
        this._events.next(new Gr(this.status,n)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._parent && !t.onlySelf && this._parent.updateValueAndValidity(R(g({}, t), {
            sourceControl: n
        }))
    }
    _updateTreeValidity(t={
        emitEvent: !0
    }) {
        this._forEachChild(n => n._updateTreeValidity(t)),
        this.updateValueAndValidity({
            onlySelf: !0,
            emitEvent: t.emitEvent
        })
    }
    _setInitialStatus() {
        this.status = this._allControlsDisabled() ? fi : di
    }
    _runValidator() {
        return this.validator ? this.validator(this) : null
    }
    _runAsyncValidator(t, n) {
        if (this.asyncValidator) {
            this.status = zr,
            this._hasOwnPendingAsyncValidator = {
                emitEvent: n !== !1,
                shouldHaveEmitted: t !== !1
            };
            let r = Vv(this.asyncValidator(this));
            this._asyncValidationSubscription = r.subscribe(o => {
                this._hasOwnPendingAsyncValidator = null,
                this.setErrors(o, {
                    emitEvent: n,
                    shouldHaveEmitted: t
                })
            }
            )
        }
    }
    _cancelExistingSubscription() {
        if (this._asyncValidationSubscription) {
            this._asyncValidationSubscription.unsubscribe();
            let t = (this._hasOwnPendingAsyncValidator?.emitEvent || this._hasOwnPendingAsyncValidator?.shouldHaveEmitted) ?? !1;
            return this._hasOwnPendingAsyncValidator = null,
            t
        }
        return !1
    }
    setErrors(t, n={}) {
        this.errors = t,
        this._updateControlsErrors(n.emitEvent !== !1, this, n.shouldHaveEmitted)
    }
    get(t) {
        let n = t;
        return n == null || (Array.isArray(n) || (n = n.split(".")),
        n.length === 0) ? null : n.reduce( (r, o) => r && r._find(o), this)
    }
    getError(t, n) {
        let r = n ? this.get(n) : this;
        return r && r.errors ? r.errors[t] : null
    }
    hasError(t, n) {
        return !!this.getError(t, n)
    }
    get root() {
        let t = this;
        for (; t._parent; )
            t = t._parent;
        return t
    }
    _updateControlsErrors(t, n, r) {
        this.status = this._calculateStatus(),
        t && this.statusChanges.emit(this.status),
        (t || r) && this._events.next(new Gr(this.status,n)),
        this._parent && this._parent._updateControlsErrors(t, n, r)
    }
    _initObservables() {
        this.valueChanges = new ee,
        this.statusChanges = new ee
    }
    _calculateStatus() {
        return this._allControlsDisabled() ? fi : this.errors ? Xa : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(zr) ? zr : this._anyControlsHaveStatus(Xa) ? Xa : di
    }
    _anyControlsHaveStatus(t) {
        return this._anyControls(n => n.status === t)
    }
    _anyControlsDirty() {
        return this._anyControls(t => t.dirty)
    }
    _anyControlsTouched() {
        return this._anyControls(t => t.touched)
    }
    _updatePristine(t, n) {
        let r = !this._anyControlsDirty()
          , o = this.pristine !== r;
        this.pristine = r,
        this._parent && !t.onlySelf && this._parent._updatePristine(t, n),
        o && this._events.next(new hi(this.pristine,n))
    }
    _updateTouched(t={}, n) {
        this.touched = this._anyControlsTouched(),
        this._events.next(new pi(this.touched,n)),
        this._parent && !t.onlySelf && this._parent._updateTouched(t, n)
    }
    _onDisabledChange = [];
    _registerOnCollectionChange(t) {
        this._onCollectionChange = t
    }
    _setUpdateStrategy(t) {
        rc(t) && t.updateOn != null && (this._updateOn = t.updateOn)
    }
    _parentMarkedDirty(t) {
        let n = this._parent && this._parent.dirty;
        return !t && !!n && !this._parent._anyControlsDirty()
    }
    _find(t) {
        return null
    }
    _assignValidators(t) {
        this._rawValidators = Array.isArray(t) ? t.slice() : t,
        this._composedValidatorFn = iS(this._rawValidators)
    }
    _assignAsyncValidators(t) {
        this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t,
        this._composedAsyncValidatorFn = aS(this._rawAsyncValidators)
    }
}
;
var _f = new v("",{
    factory: () => oc
})
  , oc = "always";
function cS(e, t) {
    return [...t.path, e]
}
function uS(e, t, n=oc) {
    dS(e, t),
    t.valueAccessor.writeValue(e.value),
    (e.disabled || n === "always") && t.valueAccessor.setDisabledState?.(e.disabled),
    fS(e, t),
    pS(e, t),
    hS(e, t),
    lS(e, t)
}
function Nv(e, t) {
    e.forEach(n => {
        n.registerOnValidatorChange && n.registerOnValidatorChange(t)
    }
    )
}
function lS(e, t) {
    if (t.valueAccessor.setDisabledState) {
        let n = r => {
            t.valueAccessor.setDisabledState(r)
        }
        ;
        e.registerOnDisabledChange(n),
        t._registerOnDestroy( () => {
            e._unregisterOnDisabledChange(n)
        }
        )
    }
}
function dS(e, t) {
    let n = nS(e);
    t.validator !== null ? e.setValidators(Tv(n, t.validator)) : typeof n == "function" && e.setValidators([n]);
    let r = rS(e);
    t.asyncValidator !== null ? e.setAsyncValidators(Tv(r, t.asyncValidator)) : typeof r == "function" && e.setAsyncValidators([r]);
    let o = () => e.updateValueAndValidity();
    Nv(t._rawValidators, o),
    Nv(t._rawAsyncValidators, o)
}
function fS(e, t) {
    t.valueAccessor.registerOnChange(n => {
        e._pendingValue = n,
        e._pendingChange = !0,
        e._pendingDirty = !0,
        e.updateOn === "change" && Gv(e, t)
    }
    )
}
function hS(e, t) {
    t.valueAccessor.registerOnTouched( () => {
        e._pendingTouched = !0,
        e.updateOn === "blur" && e._pendingChange && Gv(e, t),
        e.updateOn !== "submit" && e.markAsTouched()
    }
    )
}
function Gv(e, t) {
    e._pendingDirty && e.markAsDirty(),
    e.setValue(e._pendingValue, {
        emitModelToViewChange: !1
    }),
    t.viewToModelUpdate(e._pendingValue),
    e._pendingChange = !1
}
function pS(e, t) {
    let n = (r, o) => {
        t.valueAccessor.writeValue(r),
        o && t.viewToModelUpdate(r)
    }
    ;
    e.registerOnChange(n),
    t._registerOnDestroy( () => {
        e._unregisterOnChange(n)
    }
    )
}
function gS(e, t) {
    if (!e.hasOwnProperty("model"))
        return !1;
    let n = e.model;
    return n.isFirstChange() ? !0 : !Object.is(t, n.currentValue)
}
function mS(e) {
    return Object.getPrototypeOf(e.constructor) === WT
}
function yS(e, t) {
    if (!t)
        return null;
    Array.isArray(t);
    let n, r, o;
    return t.forEach(i => {
        i.constructor === Pv ? n = i : mS(i) ? r = i : o = i
    }
    ),
    o || r || n || null
}
function Rv(e, t) {
    let n = e.indexOf(t);
    n > -1 && e.splice(n, 1)
}
function xv(e) {
    return typeof e == "object" && e !== null && Object.keys(e).length === 2 && "value"in e && "disabled"in e
}
var vS = class extends wf {
    defaultValue = null;
    _onChange = [];
    _pendingValue;
    _pendingChange = !1;
    constructor(t=null, n, r) {
        super(oS(n), sS(r, n)),
        this._applyFormState(t),
        this._setUpdateStrategy(n),
        this._initObservables(),
        this.updateValueAndValidity({
            onlySelf: !0,
            emitEvent: !!this.asyncValidator
        }),
        rc(n) && (n.nonNullable || n.initialValueIsDefault) && (xv(t) ? this.defaultValue = t.value : this.defaultValue = t)
    }
    setValue(t, n={}) {
        this.value = this._pendingValue = t,
        this._onChange.length && n.emitModelToViewChange !== !1 && this._onChange.forEach(r => r(this.value, n.emitViewToModelChange !== !1)),
        this.updateValueAndValidity(n)
    }
    patchValue(t, n={}) {
        this.setValue(t, n)
    }
    reset(t=this.defaultValue, n={}) {
        this._applyFormState(t),
        this.markAsPristine(n),
        this.markAsUntouched(n),
        this.setValue(this.value, n),
        n.overwriteDefaultValue && (this.defaultValue = this.value),
        this._pendingChange = !1,
        n?.emitEvent !== !1 && this._events.next(new If(this))
    }
    _updateValue() {}
    _anyControls(t) {
        return !1
    }
    _allControlsDisabled() {
        return this.disabled
    }
    registerOnChange(t) {
        this._onChange.push(t)
    }
    _unregisterOnChange(t) {
        Rv(this._onChange, t)
    }
    registerOnDisabledChange(t) {
        this._onDisabledChange.push(t)
    }
    _unregisterOnDisabledChange(t) {
        Rv(this._onDisabledChange, t)
    }
    _forEachChild(t) {}
    _syncPendingControls() {
        return this.updateOn === "submit" && (this._pendingDirty && this.markAsDirty(),
        this._pendingTouched && this.markAsTouched(),
        this._pendingChange) ? (this.setValue(this._pendingValue, {
            onlySelf: !0,
            emitModelToViewChange: !1
        }),
        !0) : !1
    }
    _applyFormState(t) {
        xv(t) ? (this.value = this._pendingValue = t.value,
        t.disabled ? this.disable({
            onlySelf: !0,
            emitEvent: !1
        }) : this.enable({
            onlySelf: !0,
            emitEvent: !1
        })) : this.value = this._pendingValue = t
    }
}
;
var DS = {
    provide: gi,
    useExisting: Ut( () => ES)
}
  , Ov = Promise.resolve()
  , ES = ( () => {
    class e extends gi {
        _changeDetectorRef;
        callSetDisabledState;
        control = new vS;
        static ngAcceptInputType_isDisabled;
        _registered = !1;
        viewModel;
        name = "";
        isDisabled;
        model;
        options;
        update = new ee;
        constructor(n, r, o, i, s, a) {
            super(),
            this._changeDetectorRef = s,
            this.callSetDisabledState = a,
            this._parent = n,
            this._setValidators(r),
            this._setAsyncValidators(o),
            this.valueAccessor = yS(this, i)
        }
        ngOnChanges(n) {
            if (this._checkForErrors(),
            !this._registered || "name"in n) {
                if (this._registered && (this._checkName(),
                this.formDirective)) {
                    let r = n.name.previousValue;
                    this.formDirective.removeControl({
                        name: r,
                        path: this._getPath(r)
                    })
                }
                this._setUpControl()
            }
            "isDisabled"in n && this._updateDisabled(n),
            gS(n, this.viewModel) && (this._updateValue(this.model),
            this.viewModel = this.model)
        }
        ngOnDestroy() {
            this.formDirective && this.formDirective.removeControl(this)
        }
        get path() {
            return this._getPath(this.name)
        }
        get formDirective() {
            return this._parent ? this._parent.formDirective : null
        }
        viewToModelUpdate(n) {
            this.viewModel = n,
            this.update.emit(n)
        }
        _setUpControl() {
            this._setUpdateStrategy(),
            this._isStandalone() ? this._setUpStandalone() : this.formDirective.addControl(this),
            this._registered = !0
        }
        _setUpdateStrategy() {
            this.options && this.options.updateOn != null && (this.control._updateOn = this.options.updateOn)
        }
        _isStandalone() {
            return !this._parent || !!(this.options && this.options.standalone)
        }
        _setUpStandalone() {
            uS(this.control, this, this.callSetDisabledState),
            this.control.updateValueAndValidity({
                emitEvent: !1
            })
        }
        _checkForErrors() {
            this._checkName()
        }
        _checkName() {
            this.options && this.options.name && (this.name = this.options.name),
            !this._isStandalone() && this.name
        }
        _updateValue(n) {
            Ov.then( () => {
                this.control.setValue(n, {
                    emitViewToModelChange: !1
                }),
                this._changeDetectorRef?.markForCheck()
            }
            )
        }
        _updateDisabled(n) {
            let r = n.isDisabled.currentValue
              , o = r !== 0 && la(r);
            Ov.then( () => {
                o && !this.control.disabled ? this.control.disable() : !o && this.control.disabled && this.control.enable(),
                this._changeDetectorRef?.markForCheck()
            }
            )
        }
        _getPath(n) {
            return this._parent ? cS(n, this._parent) : [n]
        }
        static \u0275fac = function(r) {
            return new (r || e)(U(Ef, 9),U(Lv, 10),U(KT, 10),U(kv, 10),U(jn, 8),U(_f, 8))
        }
        ;
        static \u0275dir = ye({
            type: e,
            selectors: [["", "ngModel", "", 3, "formControlName", "", 3, "formControl", ""]],
            inputs: {
                name: "name",
                isDisabled: [0, "disabled", "isDisabled"],
                model: [0, "ngModel", "model"],
                options: [0, "ngModelOptions", "options"]
            },
            outputs: {
                update: "ngModelChange"
            },
            exportAs: ["ngModel"],
            standalone: !1,
            features: [Ho([DS]), Kt, Yt]
        })
    }
    return e
}
)();
var CS = new v("");
function IS(e) {
    return typeof e == "number" ? e : parseInt(e, 10)
}
var wS = ( () => {
    class e {
        _validator = Mv;
        _onChange;
        _enabled;
        ngOnChanges(n) {
            if (this.inputName in n) {
                let r = this.normalizeInput(n[this.inputName].currentValue);
                this._enabled = this.enabled(r),
                this._validator = this._enabled ? this.createValidator(r) : Mv,
                this._onChange && this._onChange()
            }
        }
        validate(n) {
            return this._validator(n)
        }
        registerOnValidatorChange(n) {
            this._onChange = n
        }
        enabled(n) {
            return n != null
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275dir = ye({
            type: e,
            features: [Yt]
        })
    }
    return e
}
)();
var _S = {
    provide: Lv,
    useExisting: Ut( () => bS),
    multi: !0
}
  , bS = ( () => {
    class e extends wS {
        maxlength;
        inputName = "maxlength";
        normalizeInput = n => IS(n);
        createValidator = n => JT(n);
        static \u0275fac = ( () => {
            let n;
            return function(o) {
                return (n || (n = Pn(e)))(o || e)
            }
        }
        )();
        static \u0275dir = ye({
            type: e,
            selectors: [["", "maxlength", "", "formControlName", ""], ["", "maxlength", "", "formControl", ""], ["", "maxlength", "", "ngModel", ""]],
            hostVars: 1,
            hostBindings: function(r, o) {
                r & 2 && Vo("maxlength", o._enabled ? o.maxlength : null)
            },
            inputs: {
                maxlength: "maxlength"
            },
            standalone: !1,
            features: [Ho([_S]), Kt]
        })
    }
    return e
}
)();
var Wv = ( () => {
    class e {
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275mod = Pe({
            type: e
        });
        static \u0275inj = _e({})
    }
    return e
}
)();
var U2 = ( () => {
    class e {
        static withConfig(n) {
            return {
                ngModule: e,
                providers: [{
                    provide: _f,
                    useValue: n.callSetDisabledState ?? oc
                }]
            }
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275mod = Pe({
            type: e
        });
        static \u0275inj = _e({
            imports: [Wv]
        })
    }
    return e
}
)()
  , H2 = ( () => {
    class e {
        static withConfig(n) {
            return {
                ngModule: e,
                providers: [{
                    provide: CS,
                    useValue: n.warnOnNgModelWithFormControl ?? "always"
                }, {
                    provide: _f,
                    useValue: n.callSetDisabledState ?? oc
                }]
            }
        }
        static \u0275fac = function(r) {
            return new (r || e)
        }
        ;
        static \u0275mod = Pe({
            type: e
        });
        static \u0275inj = _e({
            imports: [Wv]
        })
    }
    return e
}
)();
export {g as a, K as b, O as c, A as d, j as e, yc as f, hc as g, rD as h, fn as i, MD as j, Xr as k, D as l, _e as m, p as n, _h as o, Vh as p, Bh as q, Xh as r, Ce as s, Ge as t, ap as u, Yt as v, Me as w, DC as x, EC as y, CC as z, LC as A, xn as B, St as C, U as D, id as E, Pe as F, ye as G, Vo as H, Hw as I, $w as J, zw as K, Gw as L, Ww as M, qw as N, Em as O, fd as P, hd as Q, ia as R, pd as S, gd as T, Cm as U, Jw as V, wm as W, Uo as X, t_ as Y, r_ as Z, o_ as _, bm as $, Mm as aa, Tm as ba, s_ as ca, Sm as da, sa as ea, I_ as fa, Rm as ga, md as ha, b_ as ia, A_ as ja, R_ as ka, O_ as la, k_ as ma, Tr as na, hB as oa, Hm as pa, gb as qa, mb as ra, Db as sa, Qm as ta, Fb as ua, Rt as va, my as wa, sM as xa, aM as ya, Ft as za, cf as Aa, on as Ba, jT as Ca, VT as Da, Pv as Ea, V2 as Fa, ES as Ga, bS as Ha, U2 as Ia, H2 as Ja};
