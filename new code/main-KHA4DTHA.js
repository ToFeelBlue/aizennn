import {Aa as l, Ca as h, E as s, Ia as u, Ja as f, R as d, ma as m, o as p, t as i, ua as a, xa as c} from "./chunk-WEWYQZWU.js";
var v = ( () => {
    class t {
        constructor() {
            this.title = "A i z e n",
            this.animSeq = ["/", "$", "\\", "|", "$"],
            this.animIndex = i(0),
            this.titleIndex = i(0)
        }
        ngOnInit() {
            this.doInverseSpinZeroPitch(),
            setInterval( () => {
                this.doInverseSpinZeroPitch()
            }
            , 100),
            document.addEventListener("contextmenu", function(e) {
                e.preventDefault()
            }, !1),
            document.addEventListener("keydown", function(e) {
                e.ctrlKey && (e.code === "KeyU" || e.code === "KeyI" || e.code === "KeyC" || e.code === "KeyV" || e.code === "KeyS" || e.code === "F12") && e.preventDefault()
            }, !1)
        }
        doInverseSpinZeroPitch() {
            let e = this.titleIndex()
              , o = this.animIndex()
              , r = this.title.substring(0, e);
            e > this.title.length && (this.animIndex.set(0),
            this.titleIndex.set(0)),
            o > 3 && (this.titleIndex.update(n => n + 1),
            this.animIndex.set(0)),
            document.title = r + this.animSeq[this.animIndex()],
            this.animIndex.update(n => n + 1)
        }
        static{this.\u0275fac = function(o) {
            return new (o || t)
        }
        }static{this.\u0275cmp = s({
            type: t,
            selectors: [["app-root"]],
            decls: 1,
            vars: 0,
            template: function(o, r) {
                o & 1 && d(0, "router-outlet")
            },
            dependencies: [l],
            encapsulation: 2
        })
        }
    }
    return t
}
)();
var I = [{
    path: "",
    loadComponent: () => import("./chunk-SBOMOTKL.js").then(t => t.MainComponent)
}, {
    path: "profile/:id",
    loadComponent: () => import("./chunk-BC3CTKJL.js").then(t => t.ProfileViewerComponent)
}, {
    path: "**",
    redirectTo: "",
    pathMatch: "full"
}];
a(v, {
    providers: [m(), h(I), c(), p(u, f)]
}).catch(t => console.error(t));