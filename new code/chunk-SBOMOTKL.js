import {a as R, c as W, d as Y, f as H, h as j, i as U, l as J, n as X, r as Q, s as K, t as $, u as Z} from "./chunk-CZJDASV3.js";
import {$ as k, A as s, Ba as I, C as D, Da as E, E as C, L as N, M as S, N as y, O as m, P as i, Q as f, R as z, U as T, V as F, X as u, aa as P, ba as w, ca as B, da as _, ea as O, fa as p, ha as G, n as L, p as d, q as b, t as r, w as q, y as A, z as V} from "./chunk-WEWYQZWU.js";
var u1 = ["oneko"]
  , c1 = ( () => {
    class t {
        constructor() {
            this.nekoPosX = r(32),
            this.nekoPosY = r(32),
            this.mousePosX = r(0),
            this.mousePosY = r(0),
            this.frameCount = r(0),
            this.idleTime = r(0),
            this.idleAnimation = r(null),
            this.idleAnimationFrame = r(0),
            this.nekoSpeed = 10,
            this.nekoEl = null,
            this.spriteSets = {
                idle: [[-3, -3]],
                alert: [[-7, -3]],
                scratch: [[-5, 0], [-6, 0], [-7, 0]],
                tired: [[-3, -2]],
                sleeping: [[-2, 0], [-2, -1]],
                N: [[-1, -2], [-1, -3]],
                NE: [[0, -2], [0, -3]],
                E: [[-3, 0], [-3, -1]],
                SE: [[-5, -1], [-5, -2]],
                S: [[-6, -3], [-7, -2]],
                SW: [[-5, -3], [-6, -1]],
                W: [[-4, -2], [-4, -3]],
                NW: [[-1, 0], [-1, -1]]
            }
        }
        ngAfterViewInit() {
            this.onekoInterval = setInterval( () => this.frame(), 100)
        }
        ngOnDestroy() {
            this.onekoInterval && clearInterval(this.onekoInterval)
        }
        onMouseMove(c) {
            this.mousePosX.set(c.clientX),
            this.mousePosY.set(c.clientY)
        }
        setSprite(c, a) {
            let l = this.spriteSets[c][a % this.spriteSets[c].length];
            this.oneko && (this.oneko.nativeElement.style.backgroundPosition = `${l[0] * 32}px ${l[1] * 32}px`)
        }
        resetIdleAnimation() {
            this.idleAnimation.set(null),
            this.idleAnimationFrame.set(0)
        }
        idle() {
            this.idleTime.update(e => e + 1);
            let c = this.idleTime()
              , a = this.idleAnimation()
              , l = this.idleAnimationFrame();
            switch (c > 10 && Math.floor(Math.random() * 200) === 0 && a === null && this.idleAnimation.set(["sleeping", "scratch"][Math.floor(Math.random() * 2)]),
            this.idleAnimation()) {
            case "sleeping":
                if (l < 8) {
                    this.setSprite("tired", 0);
                    break
                }
                this.setSprite("sleeping", Math.floor(l / 4)),
                l > 192 && this.resetIdleAnimation();
                break;
            case "scratch":
                this.setSprite("scratch", l),
                l > 9 && this.resetIdleAnimation();
                break;
            default:
                this.setSprite("idle", 0);
                return
            }
            this.idleAnimationFrame.update(e => e + 1)
        }
        frame() {
            this.frameCount.update(g => g + 1);
            let c = this.nekoPosX()
              , a = this.nekoPosY()
              , l = this.mousePosX()
              , e = this.mousePosY()
              , n = c - l
              , o = a - e
              , M = Math.sqrt(n ** 2 + o ** 2);
            if (M < this.nekoSpeed || M < 48) {
                this.idle();
                return
            }
            this.idleAnimation.set(null),
            this.idleAnimationFrame.set(0);
            let v = this.idleTime();
            if (v > 1) {
                this.setSprite("alert", 0),
                this.idleTime.set(Math.min(v, 7) - 1);
                return
            }
            let h = o / M > .5 ? "N" : "";
            h += o / M < -.5 ? "S" : "",
            h += n / M > .5 ? "W" : "",
            h += n / M < -.5 ? "E" : "",
            this.setSprite(h, this.frameCount()),
            this.nekoPosX.update(g => g - n / M * this.nekoSpeed),
            this.nekoPosY.update(g => g - o / M * this.nekoSpeed),
            this.oneko && (this.oneko.nativeElement.style.left = `${this.nekoPosX() - 16}px`,
            this.oneko.nativeElement.style.top = `${this.nekoPosY() - 16}px`)
        }
        static{this.\u0275fac = function(a) {
            return new (a || t)
        }
        }static{this.\u0275cmp = C({
            type: t,
            selectors: [["app-neko"]],
            viewQuery: function(a, l) {
                if (a & 1 && k(u1, 5),
                a & 2) {
                    let e;
                    P(e = w()) && (l.oneko = e.first)
                }
            },
            hostBindings: function(a, l) {
                a & 1 && u("mousemove", function(n) {
                    return l.onMouseMove(n)
                }, V)
            },
            decls: 2,
            vars: 0,
            consts: [["oneko", ""], ["id", "oneko", 2, "width", "32px", "height", "32px", "position", "fixed", "background-image", "url(/assets/images/oneko.gif)", "image-rendering", "pixelated", "z-index", "5", "left", "16px", "top", "16px"]],
            template: function(a, l) {
                a & 1 && T(0, "div", 1, 0)
            },
            encapsulation: 2
        })
        }
    }
    return t
}
)();
var l1 = {
    prefix: "fab",
    iconName: "youtube",
    icon: [576, 512, [61802], "f167", "M549.7 124.1C543.5 100.4 524.9 81.8 501.4 75.5 458.9 64 288.1 64 288.1 64S117.3 64 74.7 75.5C51.2 81.8 32.7 100.4 26.4 124.1 15 167 15 256.4 15 256.4s0 89.4 11.4 132.3c6.3 23.6 24.8 41.5 48.3 47.8 42.6 11.5 213.4 11.5 213.4 11.5s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zM232.2 337.6l0-162.4 142.7 81.2-142.7 81.2z"]
};
var a1 = {
    prefix: "fab",
    iconName: "bootstrap",
    icon: [576, 512, [], "f836", "M333.5 201.4c0-22.1-15.6-34.3-43-34.3l-50.4 0 0 71.2 42.5 0c32.8-.1 50.9-13.3 50.9-36.9zM517 188.6c-9.5-30.9-10.9-68.8-9.8-98.1 1.1-30.5-22.7-58.5-54.7-58.5L123.7 32c-32.1 0-55.8 28.1-54.7 58.5 1 29.3-.3 67.2-9.8 98.1-9.6 31-25.7 50.6-52.2 53.1l0 28.5c26.4 2.5 42.6 22.1 52.2 53.1 9.5 30.9 10.9 68.8 9.8 98.1-1.1 30.5 22.7 58.5 54.7 58.5l328.7 0c32.1 0 55.8-28.1 54.7-58.5-1-29.3 .3-67.2 9.8-98.1 9.6-31 25.7-50.6 52.1-53.1l0-28.5c-26.3-2.5-42.5-22.1-52-53.1zM300.2 375.1l-97.9 0 0-238.3 97.4 0c43.3 0 71.7 23.4 71.7 59.4 0 25.3-19.1 47.9-43.5 51.8l0 1.3c33.2 3.6 55.5 26.6 55.5 58.3 0 42.1-31.3 67.5-83.2 67.5zm-10-108.7l-50.1 0 0 78.4 52.3 0c34.2 0 52.3-13.7 52.3-39.5 0-25.7-18.6-38.9-54.5-38.9z"]
};
var e1 = {
    prefix: "fab",
    iconName: "css3-alt",
    icon: [384, 512, [], "f38b", "M0 32L34.9 427.8 192 480 349.1 427.8 384 32 0 32zm313.1 80l-4.8 47.3-115.3 49.3-.3 .1 111.5 0-12.8 146.6-98.2 28.7-98.8-29.2-6.4-73.9 48.9 0 3.2 38.3 52.6 13.3 54.7-15.4 3.7-61.6-166.3-.5 0-.1-.2 .1-3.6-46.3 112.1-46.7 6.5-2.7-122.9 0-5.8-47.3 242.2 0z"]
};
var i1 = {
    prefix: "fab",
    iconName: "github",
    icon: [512, 512, [], "f09b", "M173.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM252.8 8c-138.7 0-244.8 105.3-244.8 244 0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1 100-33.2 167.8-128.1 167.8-239 0-138.7-112.5-244-251.2-244zM105.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9s4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"]
};
var n1 = {
    prefix: "fab",
    iconName: "steam",
    icon: [512, 512, [], "f1b6", "M504 256c0 137-111.2 248-248.4 248-113.8 0-209.6-76.3-239-180.4l95.2 39.3c6.4 32.1 34.9 56.4 68.9 56.4 39.2 0 71.9-32.4 70.2-73.5l84.5-60.2c52.1 1.3 95.8-40.9 95.8-93.5 0-51.6-42-93.5-93.7-93.5s-93.7 42-93.7 93.5l0 1.2-59.2 85.7c-15.5-.9-30.7 3.4-43.5 12.1L8 236.1C18.2 108.4 125.1 8 255.6 8 392.8 8 504 119 504 256zM163.7 384.3l-30.5-12.6c5.6 11.6 15.3 20.8 27.2 25.8 26.9 11.2 57.8-1.6 69-28.4 5.4-13 5.5-27.3 .1-40.3S214 305.6 201 300.2c-12.9-5.4-26.7-5.2-38.9-.6l31.5 13c19.8 8.2 29.2 30.9 20.9 50.7-8.3 19.9-31 29.2-50.8 21zM337.5 129.8a62.3 62.3 0 1 1 0 124.6 62.3 62.3 0 1 1 0-124.6zm.1 109a46.8 46.8 0 1 0 0-93.6 46.8 46.8 0 1 0 0 93.6z"]
};
var o1 = {
    prefix: "fab",
    iconName: "sass",
    icon: [640, 512, [], "f41e", "M301.8 378.9l0 0zm249.1-87c-20.1 0-40 4.6-58 13.5-5.9-11.9-12-22.3-13-30.1-1.2-9.1-2.5-14.5-1.1-25.3s7.7-26.1 7.6-27.2-1.4-6.6-14.3-6.7-24 2.5-25.3 5.9c-2.3 6.2-4.1 12.6-5.3 19.1-2.3 11.7-25.8 53.5-39.1 75.3-4.4-8.5-8.1-16-8.9-22-1.2-9.1-2.5-14.5-1.1-25.3s7.7-26.1 7.6-27.2-1.4-6.6-14.3-6.7-24 2.5-25.3 5.9-2.7 11.4-5.3 19.1-33.9 77.3-42.1 95.4c-4.2 9.2-7.8 16.6-10.4 21.6-.4 .8-.7 1.3-.9 1.7 .3-.5 .5-1 .5-.8-2.2 4.3-3.5 6.7-3.5 6.7l0 .1c-1.7 3.2-3.6 6.1-4.5 6.1-.6 0-1.9-8.4 .3-19.9 4.7-24.2 15.8-61.8 15.7-63.1-.1-.7 2.1-7.2-7.3-10.7-9.1-3.3-12.4 2.2-13.2 2.2s-1.4 2-1.4 2 10.1-42.4-19.4-42.4c-18.4 0-44 20.2-56.6 38.5-7.9 4.3-25 13.6-43 23.5-6.9 3.8-14 7.7-20.7 11.4-.5-.5-.9-1-1.4-1.5-35.8-38.2-101.9-65.2-99.1-116.5 1-18.7 7.5-67.8 127.1-127.4 98-48.8 176.3-35.4 189.8-5.6 19.4 42.5-41.9 121.6-143.7 133-38.8 4.3-59.2-10.7-64.3-16.3-5.3-5.9-6.1-6.2-8.1-5.1-3.3 1.8-1.2 7 0 10.1 3 7.9 15.5 21.9 36.8 28.9 18.7 6.1 64.2 9.5 119.2-11.8 61.8-23.8 109.9-90.1 95.8-145.6-14.4-56.4-107.9-74.9-196.3-43.5-52.7 18.7-109.7 48.1-150.7 86.4-48.7 45.6-56.5 85.3-53.3 101.9 11.4 58.9 92.6 97.3 125.1 125.7-1.6 .9-3.1 1.7-4.5 2.5-16.3 8.1-78.2 40.5-93.7 74.7-17.5 38.8 2.9 66.6 16.3 70.4 41.8 11.6 84.6-9.3 107.6-43.6s20.2-79.1 9.6-99.5c-.1-.3-.3-.5-.4-.8 4.2-2.5 8.5-5 12.8-7.5 8.3-4.9 16.4-9.4 23.5-13.3-4 10.8-6.9 23.8-8.4 42.6-1.8 22 7.3 50.5 19.1 61.7 5.2 4.9 11.5 5 15.4 5 13.8 0 20-11.4 26.9-25 8.5-16.6 16-35.9 16-35.9s-9.4 52.2 16.3 52.2c9.4 0 18.8-12.1 23-18.3l0 .1s.2-.4 .7-1.2c1-1.5 1.5-2.4 1.5-2.4l0-.3c3.8-6.5 12.1-21.4 24.6-46 16.2-31.8 31.7-71.5 31.7-71.5 1.5 8.7 3.6 17.3 6.2 25.8 2.8 9.5 8.7 19.9 13.4 30-3.8 5.2-6.1 8.2-6.1 8.2 0 .1 0 .1 .1 .2-3 4-6.4 8.3-9.9 12.5-12.8 15.2-28 32.6-30 37.6-2.4 5.9-1.8 10.3 2.8 13.7 3.4 2.6 9.4 3 15.7 2.5 11.5-.8 19.6-3.6 23.5-5.4 7.2-2.6 14-6.1 20.2-10.6 12.5-9.2 20.1-22.4 19.4-39.8-.4-9.6-3.5-19.2-7.3-28.2 1.1-1.6 2.3-3.3 3.4-5 19.8-28.9 35.1-60.6 35.1-60.6 1.5 8.7 3.6 17.3 6.2 25.8 2.4 8.1 7.1 17 11.4 25.7-18.6 15.1-30.1 32.6-34.1 44.1-7.4 21.3-1.6 30.9 9.3 33.1 4.9 1 11.9-1.3 17.1-3.5 7.7-2.6 15-6.3 21.6-11.1 12.5-9.2 24.6-22.1 23.8-39.6-.3-7.9-2.5-15.8-5.4-23.4 15.7-6.6 36.1-10.2 62.1-7.2 55.7 6.5 66.6 41.3 64.5 55.8s-13.8 22.6-17.7 25-5.1 3.3-4.8 5.1c.5 2.6 2.3 2.5 5.6 1.9 4.6-.8 29.2-11.8 30.3-38.7 1.6-34-31.1-71.4-89-71.1l0 0zM121.8 436.6c-18.4 20.1-44.2 27.7-55.3 21.3-11.9-6.9-7.2-36.5 15.5-57.9 13.8-13 31.6-25 43.4-32.4 2.7-1.6 6.6-4 11.4-6.9 .8-.5 1.2-.7 1.2-.7 .9-.6 1.9-1.1 2.9-1.7 8.3 30.4 .3 57.2-19.1 78.3l0 0zm134.4-91.4c-6.4 15.7-19.9 55.7-28.1 53.6-7-1.8-11.3-32.3-1.4-62.3 5-15.1 15.6-33.1 21.9-40.1 10.1-11.3 21.2-14.9 23.8-10.4 3.5 5.9-12.2 49.4-16.2 59.2zm111 53c-2.7 1.4-5.2 2.3-6.4 1.6-.9-.5 1.1-2.4 1.1-2.4s13.9-14.9 19.4-21.7c3.2-4 6.9-8.7 10.9-13.9 0 .5 .1 1 .1 1.6-.1 17.9-17.3 30-25.1 34.8l0 0zm85.6-19.5c-2-1.4-1.7-6.1 5-20.7 2.6-5.7 8.6-15.3 19-24.5 1.2 3.5 1.8 7.1 1.9 10.8-.1 22.5-16.2 30.9-25.9 34.4l0 0z"]
};
var f1 = {
    prefix: "fab",
    iconName: "angular",
    icon: [448, 512, [], "f420", "M185.7 268.1l76.2 0-38.1-91.6-38.1 91.6zM223.8 32L16 106.4 47.8 382.1 223.8 480 399.8 382.1 431.6 106.4 223.8 32zM354 373.8l-48.6 0-26.2-65.4-110.6 0-26.2 65.4-48.7 0 130.1-292.3 130.2 292.3z"]
};
var r1 = {
    prefix: "fab",
    iconName: "docker",
    icon: [640, 512, [], "f395", "M349.9 236.3l-66.1 0 0-59.4 66.1 0 0 59.4zm0-204.3l-66.1 0 0 60.7 66.1 0 0-60.7zm78.2 144.8l-66.1 0 0 59.4 66.1 0 0-59.4zM271.8 104.7l-66.1 0 0 60.1 66.1 0 0-60.1zm78.1 0l-66.1 0 0 60.1 66.1 0 0-60.1zm276.8 100c-14.4-9.7-47.6-13.2-73.1-8.4-3.3-24-16.7-44.9-41.1-63.7l-14-9.3-9.3 14c-18.4 27.8-23.4 73.6-3.7 103.8-8.7 4.7-25.8 11.1-48.4 10.7l-434.7 0c-8.7 50.8 5.8 116.8 44 162.1 37.1 43.9 92.7 66.2 165.4 66.2 157.4 0 273.9-72.5 328.4-204.2 21.4 .4 67.6 .1 91.3-45.2 1.5-2.5 6.6-13.2 8.5-17.1l-13.3-8.9zM115.6 176.8l-66 0 0 59.4 66.1 0 0-59.4-.1 0zm78.1 0l-66.1 0 0 59.4 66.1 0 0-59.4zm78.1 0l-66.1 0 0 59.4 66.1 0 0-59.4zm-78.1-72.1l-66.1 0 0 60.1 66.1 0 0-60.1z"]
};
var s1 = {
    prefix: "fab",
    iconName: "git-alt",
    icon: [448, 512, [], "f841", "M439.6 236.1L244 40.5C238.6 35 231.2 32 223.6 32s-15 3-20.4 8.4l-40.7 40.6 51.5 51.5c27.1-9.1 52.7 16.8 43.4 43.7l49.7 49.7c34.2-11.8 61.2 31 35.5 56.7-26.5 26.5-70.2-2.9-56-37.3l-46.3-46.3 0 121.9c25.3 12.5 22.3 41.8 9.1 55-6.4 6.4-15.2 10.1-24.3 10.1s-17.8-3.6-24.3-10.1c-17.6-17.6-11.1-46.9 11.2-56l0-123c-20.8-8.5-24.6-30.7-18.6-45L142.6 101 8.5 235.1C3 240.6 0 247.9 0 255.5s3 15 8.5 20.4L204.1 471.6c5.4 5.4 12.7 8.4 20.4 8.4s15-3 20.4-8.4L439.6 276.9c5.4-5.4 8.4-12.8 8.4-20.4s-3-15-8.4-20.4z"]
};
var t1 = {
    prefix: "fab",
    iconName: "react",
    icon: [512, 512, [], "f41b", "M418.2 177.2c-5.4-1.8-10.8-3.5-16.2-5.1 .9-3.7 1.7-7.4 2.5-11.1 12.3-59.6 4.2-107.5-23.1-123.3-26.3-15.1-69.2 .6-112.6 38.4-4.3 3.7-8.5 7.6-12.5 11.5-2.7-2.6-5.5-5.2-8.3-7.7-45.5-40.4-91.1-57.4-118.4-41.5-26.2 15.2-34 60.3-23 116.7 1.1 5.6 2.3 11.1 3.7 16.7-6.4 1.8-12.7 3.8-18.6 5.9-53.4 18.5-91.7 47.7-91.7 77.9 0 31.2 40.8 62.5 96.3 81.5 4.5 1.5 9 3 13.6 4.3-1.5 6-2.8 11.9-4 18-10.5 55.5-2.3 99.5 23.9 114.6 27 15.6 72.4-.4 116.6-39.1 3.5-3.1 7-6.3 10.5-9.7 4.4 4.3 9 8.4 13.6 12.4 42.8 36.8 85.1 51.7 111.2 36.6 27-15.6 35.8-62.9 24.4-120.5-.9-4.4-1.9-8.9-3-13.5 3.2-.9 6.3-1.9 9.4-2.9 57.7-19.1 99.5-50 99.5-81.7 0-30.3-39.4-59.7-93.8-78.4zM282.9 92.3c37.2-32.4 71.9-45.1 87.7-36 16.9 9.7 23.4 48.9 12.8 100.4-.7 3.4-1.4 6.7-2.3 10-22.2-5-44.7-8.6-67.3-10.6-13-18.6-27.2-36.4-42.6-53.1 3.9-3.7 7.7-7.2 11.7-10.7zM167.2 307.5c5.1 8.7 10.3 17.4 15.8 25.9-15.6-1.7-31.1-4.2-46.4-7.5 4.4-14.4 9.9-29.3 16.3-44.5 4.6 8.8 9.3 17.5 14.3 26.1zM136.9 187.2c14.4-3.2 29.7-5.8 45.6-7.8-5.3 8.3-10.5 16.8-15.4 25.4-4.9 8.5-9.7 17.2-14.2 26-6.3-14.9-11.6-29.5-16-43.6zm27.4 68.9c6.6-13.8 13.8-27.3 21.4-40.6s15.8-26.2 24.4-38.9c15-1.1 30.3-1.7 45.9-1.7s31 .6 45.9 1.7c8.5 12.6 16.6 25.5 24.3 38.7s14.9 26.7 21.7 40.4c-6.7 13.8-13.9 27.4-21.6 40.8-7.6 13.3-15.7 26.2-24.2 39-14.9 1.1-30.4 1.6-46.1 1.6s-30.9-.5-45.6-1.4c-8.7-12.7-16.9-25.7-24.6-39s-14.8-26.8-21.5-40.6zm180.6 51.2c5.1-8.8 9.9-17.7 14.6-26.7 6.4 14.5 12 29.2 16.9 44.3-15.5 3.5-31.2 6.2-47 8 5.4-8.4 10.5-17 15.5-25.6zm14.4-76.5c-4.7-8.8-9.5-17.6-14.5-26.2-4.9-8.5-10-16.9-15.3-25.2 16.1 2 31.5 4.7 45.9 8-4.6 14.8-10 29.2-16.1 43.4zM256.2 118.3c10.5 11.4 20.4 23.4 29.6 35.8-19.8-.9-39.7-.9-59.5 0 9.8-12.9 19.9-24.9 29.9-35.8zM140.2 57c16.8-9.8 54.1 4.2 93.4 39 2.5 2.2 5 4.6 7.6 7-15.5 16.7-29.8 34.5-42.9 53.1-22.6 2-45 5.5-67.2 10.4-1.3-5.1-2.4-10.3-3.5-15.5-9.4-48.4-3.2-84.9 12.6-94zM115.7 320.6c-4.2-1.2-8.3-2.5-12.4-3.9-21.3-6.7-45.5-17.3-63-31.2-10.1-7-16.9-17.8-18.8-29.9 0-18.3 31.6-41.7 77.2-57.6 5.7-2 11.5-3.8 17.3-5.5 6.8 21.7 15 43 24.5 63.6-9.6 20.9-17.9 42.5-24.8 64.5zm116.6 98c-16.5 15.1-35.6 27.1-56.4 35.3-11.1 5.3-23.9 5.8-35.3 1.3-15.9-9.2-22.5-44.5-13.5-92 1.1-5.6 2.3-11.2 3.7-16.7 22.4 4.8 45 8.1 67.9 9.8 13.2 18.7 27.7 36.6 43.2 53.4-3.2 3.1-6.4 6.1-9.6 8.9zm24.5-24.3c-10.2-11-20.4-23.2-30.3-36.3 9.6 .4 19.5 .6 29.5 .6 10.3 0 20.4-.2 30.4-.7-9.2 12.7-19.1 24.8-29.6 36.4zm130.7 30c-.9 12.2-6.9 23.6-16.5 31.3-15.9 9.2-49.8-2.8-86.4-34.2-4.2-3.6-8.4-7.5-12.7-11.5 15.3-16.9 29.4-34.8 42.2-53.6 22.9-1.9 45.7-5.4 68.2-10.5 1 4.1 1.9 8.2 2.7 12.2 4.9 21.6 5.7 44.1 2.5 66.3zm18.2-107.5c-2.8 .9-5.6 1.8-8.5 2.6-7-21.8-15.6-43.1-25.5-63.8 9.6-20.4 17.7-41.4 24.5-62.9 5.2 1.5 10.2 3.1 15 4.7 46.6 16 79.3 39.8 79.3 58 0 19.6-34.9 44.9-84.8 61.4zM256 301.8a45.8 45.8 0 1 0 0-91.6 45.8 45.8 0 1 0 0 91.6z"]
};
var z1 = {
    prefix: "fab",
    iconName: "instagram",
    icon: [448, 512, [], "f16d", "M224.3 141a115 115 0 1 0 -.6 230 115 115 0 1 0 .6-230zm-.6 40.4a74.6 74.6 0 1 1 .6 149.2 74.6 74.6 0 1 1 -.6-149.2zm93.4-45.1a26.8 26.8 0 1 1 53.6 0 26.8 26.8 0 1 1 -53.6 0zm129.7 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM399 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"]
};
var m1 = {
    prefix: "fab",
    iconName: "python",
    icon: [448, 512, [], "f3e2", "M439.8 200.5c-7.7-30.9-22.3-54.2-53.4-54.2l-40.1 0 0 47.4c0 36.8-31.2 67.8-66.8 67.8l-106.8 0c-29.2 0-53.4 25-53.4 54.3l0 101.8c0 29 25.2 46 53.4 54.3 33.8 9.9 66.3 11.7 106.8 0 26.9-7.8 53.4-23.5 53.4-54.3l0-40.7-106.7 0 0-13.6 160.2 0c31.1 0 42.6-21.7 53.4-54.2 11.2-33.5 10.7-65.7 0-108.6zM286.2 444.7a20.4 20.4 0 1 1 0-40.7 20.4 20.4 0 1 1 0 40.7zM167.8 248.1l106.8 0c29.7 0 53.4-24.5 53.4-54.3l0-101.9c0-29-24.4-50.7-53.4-55.6-35.8-5.9-74.7-5.6-106.8 .1-45.2 8-53.4 24.7-53.4 55.6l0 40.7 106.9 0 0 13.6-147 0c-31.1 0-58.3 18.7-66.8 54.2-9.8 40.7-10.2 66.1 0 108.6 7.6 31.6 25.7 54.2 56.8 54.2l36.7 0 0-48.8c0-35.3 30.5-66.4 66.8-66.4zM161.2 64.7a20.4 20.4 0 1 1 0 40.8 20.4 20.4 0 1 1 0-40.8z"]
};
var M1 = {
    prefix: "fab",
    iconName: "js",
    icon: [448, 512, [], "f3b8", "M0 32l0 448 448 0 0-448-448 0zM243.8 381.4c0 43.6-25.6 63.5-62.9 63.5-33.7 0-53.2-17.4-63.2-38.5L152 385.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5l0-143.1 42.1 0 0 143.7zm99.6 63.5c-39.1 0-64.4-18.6-76.7-43L301 382.1c9 14.7 20.8 25.6 41.5 25.6 17.4 0 28.6-8.7 28.6-20.8 0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5 0-31.6 24.1-55.6 61.6-55.6 26.8 0 46 9.3 59.8 33.7L368 290c-7.2-12.9-15-18-27.1-18-12.3 0-20.1 7.8-20.1 18 0 12.6 7.8 17.7 25.9 25.6l10.5 4.5c35.8 15.3 55.9 31 55.9 66.2 0 37.8-29.8 58.6-69.7 58.6z"]
};
var p1 = {
    prefix: "fab",
    iconName: "html5",
    icon: [384, 512, [], "f13b", "M0 32L34.9 427.8 191.5 480 349.1 427.8 384 32 0 32zM308.2 159.9l-183.8 0 4.1 49.4 175.6 0-13.6 148.4-97.9 27 0 .3-1.1 0-98.7-27.3-6-75.8 47.7 0 3.5 38.1 53.5 14.5 53.7-14.5 6-62.2-166.9 0-12.8-145.6 241.1 0-4.4 47.7z"]
};
var d1 = {
    prefix: "fab",
    iconName: "node-js",
    icon: [448, 512, [], "f3d3", "M224.5 508c-6.7 0-13.5-1.8-19.4-5.2l-61.7-36.5c-9.2-5.2-4.7-7-1.7-8 12.3-4.3 14.8-5.2 27.9-12.7 1.4-.8 3.2-.5 4.6 .4l47.4 28.1c1.7 1 4.1 1 5.7 0L412 367.5c1.7-1 2.8-3 2.8-5l0-213.2c0-2.1-1.1-4-2.9-5.1L227.3 37.7c-1.7-1-4-1-5.7 0L37.1 144.3c-1.8 1-2.9 3-2.9 5.1l0 213.1c0 2 1.1 4 2.9 4.9l50.6 29.2c27.5 13.7 44.3-2.4 44.3-18.7l0-210.4c0-3 2.4-5.3 5.4-5.3l23.4 0c2.9 0 5.4 2.3 5.4 5.3l0 210.5c0 36.6-20 57.6-54.7 57.6-10.7 0-19.1 0-42.5-11.6L20.6 396.1c-12-6.9-19.4-19.8-19.4-33.7l0-213.1c0-13.8 7.4-26.8 19.4-33.7L205.1 9c11.7-6.6 27.2-6.6 38.8 0L428.6 115.7c12 6.9 19.4 19.8 19.4 33.7l0 213.1c0 13.8-7.4 26.7-19.4 33.7L243.9 502.8c-5.9 3.4-12.6 5.2-19.4 5.2zM373.6 297.9c0-39.9-27-50.5-83.7-58-57.4-7.6-63.2-11.5-63.2-24.9 0-11.1 4.9-25.9 47.4-25.9 37.9 0 51.9 8.2 57.7 33.8 .5 2.4 2.7 4.2 5.2 4.2l24 0c1.5 0 2.9-.6 3.9-1.7s1.5-2.6 1.4-4.1c-3.7-44.1-33-64.6-92.2-64.6-52.7 0-84.1 22.2-84.1 59.5 0 40.4 31.3 51.6 81.8 56.6 60.5 5.9 65.2 14.8 65.2 26.7 0 20.6-16.6 29.4-55.5 29.4-48.9 0-59.6-12.3-63.2-36.6-.4-2.6-2.6-4.5-5.3-4.5l-23.9 0c-3 0-5.3 2.4-5.3 5.3 0 31.1 16.9 68.2 97.8 68.2 58.4-.1 92-23.2 92-63.4z"]
};
var v1 = ["backgroundVideo"];
function x1(t, x) {
    if (t & 1 && (i(0, "div", 39),
    z(1, "fa-icon", 7),
    f()),
    t & 2) {
        let c = x.$implicit;
        m("title", c.name),
        s(),
        _("color", c.color),
        m("icon", c.icon)
    }
}
function g1(t, x) {
    if (t & 1 && (i(0, "div", 39),
    z(1, "fa-icon", 7),
    f()),
    t & 2) {
        let c = x.$implicit;
        m("title", c.name),
        s(),
        _("color", c.color),
        m("icon", c.icon)
    }
}
function L1(t, x) {
    if (t & 1 && (i(0, "div", 39),
    z(1, "fa-icon", 7),
    f()),
    t & 2) {
        let c = x.$implicit;
        m("title", c.name),
        s(),
        _("color", c.color),
        m("icon", c.icon)
    }
}
var R1 = ( () => {
    class t {
        constructor() {
            this.router = L(I),
            this.el = L(q),
            this.renderer = L(D),
            this.card3DService = L(R),
            this.faTerminal = U,
            this.faSearch = H,
            this.faVolumeUp = X,
            this.faVolumeMute = J,
            this.faGithub = i1,
            this.faYoutube = l1,
            this.faInstagram = z1,
            this.faSteam = n1,
            this.isModalOpen = r(!1),
            this.isActivityVisible = r(!1),
            this.nameplateAsset = r(null),
            this.currentQuote = r(""),
            this.isBackgroundVideoMuted = r(!0),
            this.isBackgroundVideoLoaded = r(!1),
            this.quotes = ["The world doesn't need heroes, it needs someone to pull the strings from the shadows.", "I am the one who lurks in the shadows to hunt the shadows.", "I seek neither power nor glory. I only seek to be the Eminence in Shadow.", "True power is not in the light, but in the darkness that swallows it.", "The hour of awakening is at hand.", "I am Atomic."],
            this.quoteIndex = r(0),
            this.charIndex = r(0),
            this.isDeleting = r(!1),
            this.techStack = [{
                name: "Angular",
                icon: f1,
                color: "#dd0031"
            }, {
                name: "React",
                icon: t1,
                color: "#61dafb"
            }, {
                name: "Bootstrap",
                icon: a1,
                color: "#7952b3"
            }, {
                name: "Python",
                icon: m1,
                color: "#3776ab"
            }, {
                name: "JavaScript",
                icon: M1,
                color: "#f0db4f"
            }, {
                name: "TypeScript",
                icon: j,
                color: "#3178c6"
            }, {
                name: "Sass",
                icon: o1,
                color: "#cc6699"
            }, {
                name: "HTML5",
                icon: p1,
                color: "#e34f26"
            }, {
                name: "CSS3",
                icon: e1,
                color: "#264de4"
            }, {
                name: "Node.js",
                icon: d1,
                color: "#339933"
            }, {
                name: "Git",
                icon: s1,
                color: "#f05032"
            }, {
                name: "Docker",
                icon: r1,
                color: "#2496ed"
            }],
            this.unlistenFunctions = [],
            this.videoPlayRetryCount = 0,
            this.maxRetries = 5,
            this.videoInitialMuteSet = !1
        }
        ngOnInit() {
            this.startTyping(),
            setTimeout( () => {
                this.setupBackgroundVideo()
            }
            , 100)
        }
        ngAfterViewInit() {
            this.setupBackgroundVideo(),
            setTimeout( () => {
                this.attemptVideoPlay()
            }
            , 300),
            this.el.nativeElement.querySelectorAll(".widget-card").forEach(l => {
                let e = this.renderer.listen(l, "mousemove", n => {
                    let o = l.getBoundingClientRect()
                      , M = n.clientX - o.left
                      , v = n.clientY - o.top;
                    l.style.setProperty("--mouse-x", `${M}px`),
                    l.style.setProperty("--mouse-y", `${v}px`)
                }
                );
                this.unlistenFunctions.push(e),
                this.card3DService.initCard3DEffect(new q(l), {
                    maxRotation: 5,
                    scale: 1.02
                })
            }
            ),
            this.el.nativeElement.querySelectorAll(".social-item").forEach(l => {
                let e = l.querySelector(".item-name");
                if (e) {
                    let n = e.innerText;
                    l.dataset.originalText = n;
                    let o = this.renderer.listen(l, "mouseenter", () => {
                        this.scrambleText(e, n)
                    }
                    );
                    this.unlistenFunctions.push(o)
                }
            }
            )
        }
        scrambleText(c, a) {
            let l = "!<>-/[]{}\u2014=+*^?#________"
              , e = 0
              , n = c.dataset.intervalId;
            n && clearInterval(parseInt(n));
            let o = setInterval( () => {
                c.innerText = a.split("").map( (M, v) => v < e ? a[v] : l[Math.floor(Math.random() * l.length)]).join(""),
                e >= a.length && (clearInterval(o),
                c.dataset.intervalId = ""),
                e += 1 / 3
            }
            , 30);
            c.dataset.intervalId = o.toString()
        }
        ngOnDestroy() {
            this.unlistenFunctions.forEach(c => c()),
            this.unlistenFunctions = [],
            this.typeTimeout && clearTimeout(this.typeTimeout)
        }
        startTyping() {
            let c = this.quotes[this.quoteIndex()]
              , a = this.isDeleting()
              , l = this.charIndex();
            a ? (this.currentQuote.set(c.substring(0, l - 1)),
            this.charIndex.update(o => o - 1)) : (this.currentQuote.set(c.substring(0, l + 1)),
            this.charIndex.update(o => o + 1));
            let e = a ? 20 : 50;
            a || (e += Math.random() * 20);
            let n = this.charIndex();
            !a && n === c.length ? (e = 4e3,
            this.isDeleting.set(!0)) : a && n === 0 && (this.isDeleting.set(!1),
            this.quoteIndex.update(o => (o + 1) % this.quotes.length),
            e = 500),
            this.typeTimeout = setTimeout( () => {
                this.startTyping()
            }
            , e)
        }
        openSearchModal() {
            this.isModalOpen.set(!0)
        }
        closeSearchModal() {
            this.isModalOpen.set(!1)
        }
        onSearchProfile(c) {
            this.router.navigate(["/profile", c])
        }
        onActivityVisibilityChange(c) {
            this.isActivityVisible.set(c)
        }
        onNameplateAssetChange(c) {
            this.nameplateAsset.set(c)
        }
        get backgroundVideoUrl() {
            return "assets/videos/edit.mp4"
        }
        toggleBackgroundVideoMute(c) {
            c.muted = !c.muted,
            this.isBackgroundVideoMuted.set(c.muted)
        }
        onBackgroundVideoLoaded() {
            console.log("Video loaded data event fired"),
            this.isBackgroundVideoLoaded.set(!0),
            this.attemptVideoPlay()
        }
        onBackgroundVideoCanPlay() {
            console.log("Video can play event fired"),
            this.isBackgroundVideoLoaded.set(!0),
            this.attemptVideoPlay()
        }
        onBackgroundVideoMetaLoaded() {
            console.log("Video metadata loaded event fired"),
            this.attemptVideoPlay()
        }
        attemptVideoPlay() {
            let c = this.backgroundVideoRef?.nativeElement;
            if (!c) {
                console.warn("Video element not found");
                return
            }
            this.videoInitialMuteSet || (c.muted = !0,
            this.isBackgroundVideoMuted.set(!0),
            this.videoInitialMuteSet = !0);
            let a = c.play();
            a !== void 0 && a.then( () => {
                console.log("Video playing successfully"),
                this.videoPlayRetryCount = 0
            }
            ).catch(l => {
                console.error("Video play failed:", l),
                this.videoPlayRetryCount < this.maxRetries && (this.videoPlayRetryCount++,
                console.log(`Retry attempt ${this.videoPlayRetryCount} of ${this.maxRetries}`),
                setTimeout( () => this.attemptVideoPlay(), 500))
            }
            )
        }
        setupBackgroundVideo() {
            let c = this.backgroundVideoRef?.nativeElement;
            if (!c) {
                console.warn("Background video ref not available yet");
                return
            }
            console.log("Setting up background video"),
            c.muted = !0,
            c.autoplay = !0,
            c.loop = !0,
            c.playsInline = !0,
            c.preload = "auto",
            c.addEventListener("loadstart", () => {
                console.log("Video loadstart event")
            }
            ),
            c.addEventListener("progress", () => {
                console.log("Video progress event")
            }
            ),
            c.addEventListener("durationchange", () => {
                console.log("Video durationchange event")
            }
            ),
            c.addEventListener("timeupdate", () => {}
            ),
            c.addEventListener("playing", () => {
                console.log("Video now playing")
            }
            ),
            c.addEventListener("pause", () => {
                console.log("Video paused, attempting to resume..."),
                setTimeout( () => this.attemptVideoPlay(), 300)
            }
            ),
            c.addEventListener("ended", () => {
                console.log("Video ended, should loop")
            }
            ),
            c.addEventListener("error", a => {
                console.error("Video error event:", a, "Error code:", c.error?.code),
                this.videoPlayRetryCount < this.maxRetries && (this.videoPlayRetryCount++,
                setTimeout( () => this.attemptVideoPlay(), 1e3))
            }
            )
        }
        static{this.\u0275fac = function(a) {
            return new (a || t)
        }
        }static{this.\u0275cmp = C({
            type: t,
            selectors: [["app-main"]],
            viewQuery: function(a, l) {
                if (a & 1 && k(v1, 5),
                a & 2) {
                    let e;
                    P(e = w()) && (l.backgroundVideoRef = e.first)
                }
            },
            decls: 72,
            vars: 14,
            consts: [["backgroundVideo", ""], [1, "ethereal-background-container"], ["autoplay", "", "loop", "", "muted", "", "playsinline", "", "preload", "auto", 1, "background-video", 3, "loadeddata", "canplay", "loadedmetadata", "src"], [1, "background-video-overlay"], [1, "video-loading-screen"], [1, "loading-spinner"], [1, "page-mute-button", 3, "click", "title"], [3, "icon"], [1, "main-container"], [1, "bento-grid"], [1, "bento-col-profile"], [3, "nameplateAssetChange"], [1, "bento-col-widgets"], [1, "anim-wrapper", "delay-1"], [1, "widget-card", "clock-card"], [1, "clock-content"], [1, "anim-wrapper", "delay-2"], [1, "widget-card", "shadow-card"], [1, "shadow-bg"], [1, "shadow-content"], [1, "shadow-role"], [1, "shadow-quote"], [1, "typewriter-cursor"], [1, "anim-wrapper", "delay-3"], [1, "widget-card", "social-card-container"], [1, "social-header"], [1, "line"], [1, "social-title"], [1, "social-grid"], ["href", "", "target", "_blank", "title", "GitHub", 1, "social-item"], [1, "item-bg"], [1, "item-name"], ["href", "", "target", "_blank", "title", "YouTube", 1, "social-item"], ["href", "", "target", "_blank", "title", "Instagram", 1, "social-item"], ["href", "", "target", "_blank", "title", "Steam", 1, "social-item"], [1, "anim-wrapper", "delay-4"], [1, "widget-card", "tech-stack-card"], [1, "marquee-mask"], [1, "marquee-track"], [1, "tech-item", 3, "title"], [3, "close", "search", "isOpen"], [3, "visibilityChange"]],
            template: function(a, l) {
                if (a & 1) {
                    let e = F();
                    z(0, "app-neko"),
                    i(1, "div", 1)(2, "video", 2, 0),
                    u("loadeddata", function() {
                        return d(e),
                        b(l.onBackgroundVideoLoaded())
                    })("canplay", function() {
                        return d(e),
                        b(l.onBackgroundVideoCanPlay())
                    })("loadedmetadata", function() {
                        return d(e),
                        b(l.onBackgroundVideoMetaLoaded())
                    }),
                    f(),
                    z(4, "div", 3),
                    i(5, "div", 4),
                    z(6, "div", 5),
                    f()(),
                    i(7, "button", 6),
                    u("click", function() {
                        d(e);
                        let o = B(3);
                        return b(l.toggleBackgroundVideoMute(o))
                    }),
                    z(8, "fa-icon", 7),
                    f(),
                    i(9, "main", 8)(10, "div", 9)(11, "div", 10)(12, "app-card-profile", 11),
                    u("nameplateAssetChange", function(o) {
                        return d(e),
                        b(l.onNameplateAssetChange(o))
                    }),
                    f()(),
                    i(13, "div", 12)(14, "div", 13)(15, "article", 14)(16, "div", 15),
                    z(17, "app-clock"),
                    f()()(),
                    i(18, "div", 16)(19, "article", 17),
                    z(20, "div", 18),
                    i(21, "div", 19)(22, "div", 20),
                    z(23, "fa-icon", 7),
                    i(24, "span"),
                    p(25, "Aizen"),
                    f()(),
                    i(26, "div", 21)(27, "span"),
                    p(28),
                    i(29, "span", 22),
                    p(30, "|"),
                    f(),
                    p(31, '"'),
                    f()()()()(),
                    i(32, "div", 23)(33, "nav", 24)(34, "div", 25),
                    z(35, "span", 26),
                    i(36, "span", 27),
                    p(37, "Connect"),
                    f(),
                    z(38, "span", 26),
                    f(),
                    i(39, "div", 28)(40, "a", 29),
                    z(41, "div", 30)(42, "fa-icon", 7),
                    i(43, "span", 31),
                    p(44, "GitHub"),
                    f()(),
                    i(45, "a", 32),
                    z(46, "div", 30)(47, "fa-icon", 7),
                    i(48, "span", 31),
                    p(49, "YouTube"),
                    f()(),
                    i(50, "a", 33),
                    z(51, "div", 30)(52, "fa-icon", 7),
                    i(53, "span", 31),
                    p(54, "Instagram"),
                    f()(),
                    i(55, "a", 34),
                    z(56, "div", 30)(57, "fa-icon", 7),
                    i(58, "span", 31),
                    p(59, "Steam"),
                    f()()()()(),
                    i(60, "div", 35)(61, "section", 36)(62, "div", 37)(63, "div", 38),
                    S(64, x1, 2, 4, "div", 39, N),
                    S(66, g1, 2, 4, "div", 39, N),
                    S(68, L1, 2, 4, "div", 39, N),
                    f()()()()()()(),
                    i(70, "app-search-modal", 40),
                    u("close", function() {
                        return d(e),
                        b(l.closeSearchModal())
                    })("search", function(o) {
                        return d(e),
                        b(l.onSearchProfile(o))
                    }),
                    f(),
                    i(71, "app-floating-activity", 41),
                    u("visibilityChange", function(o) {
                        return d(e),
                        b(l.onActivityVisibilityChange(o))
                    }),
                    f()
                }
                a & 2 && (s(2),
                m("src", l.backgroundVideoUrl, A),
                s(3),
                O("loaded", l.isBackgroundVideoLoaded()),
                s(2),
                m("title", l.isBackgroundVideoMuted() ? "Unmute" : "Mute"),
                s(),
                m("icon", l.isBackgroundVideoMuted() ? l.faVolumeMute : l.faVolumeUp),
                s(),
                O("has-floating-activity", l.isActivityVisible()),
                s(14),
                m("icon", l.faTerminal),
                s(5),
                G('"', l.currentQuote()),
                s(14),
                m("icon", l.faGithub),
                s(5),
                m("icon", l.faYoutube),
                s(5),
                m("icon", l.faInstagram),
                s(5),
                m("icon", l.faSteam),
                s(7),
                y(l.techStack),
                s(2),
                y(l.techStack),
                s(2),
                y(l.techStack),
                s(2),
                m("isOpen", l.isModalOpen()))
            },
            dependencies: [E, c1, K, Q, $, Z, Y, W],
            styles: ['.ethereal-background-container[_ngcontent-%COMP%]{position:fixed;inset:0;z-index:-100;overflow:hidden}.ethereal-background-container[_ngcontent-%COMP%]   .background-video[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;object-position:center;z-index:0}.ethereal-background-container[_ngcontent-%COMP%]   .background-video-overlay[_ngcontent-%COMP%]{position:absolute;inset:0;background:linear-gradient(135deg,#0006,#00000080,#0006);z-index:1;pointer-events:none}.ethereal-background-container[_ngcontent-%COMP%]   .video-loading-screen[_ngcontent-%COMP%]{position:absolute;inset:0;background:#000;z-index:2;display:flex;align-items:center;justify-content:center;opacity:1;transition:opacity .6s ease-out;pointer-events:none}.ethereal-background-container[_ngcontent-%COMP%]   .video-loading-screen.loaded[_ngcontent-%COMP%]{opacity:0;pointer-events:none}.ethereal-background-container[_ngcontent-%COMP%]   .video-loading-screen[_ngcontent-%COMP%]   .loading-spinner[_ngcontent-%COMP%]{width:50px;height:50px;border:3px solid rgba(255,255,255,.2);border-top:3px solid rgba(255,255,255,.8);border-radius:50%;animation:_ngcontent-%COMP%_spin 1s linear infinite}@keyframes _ngcontent-%COMP%_spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.main-container[_ngcontent-%COMP%]{min-height:100vh;width:100%;padding:2rem;display:flex;justify-content:center;align-items:center;overflow-x:hidden;transition:transform .6s cubic-bezier(.22,1,.36,1)}.main-container.has-floating-activity[_ngcontent-%COMP%]{transform:translateY(-120px)}@media(max-width:1024px){.main-container[_ngcontent-%COMP%]{padding:2rem 1rem 5rem;align-items:flex-start}.main-container.has-floating-activity[_ngcontent-%COMP%]{transform:translateY(0)}}.bento-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:auto minmax(400px,500px);gap:1.5rem;width:auto}@media(max-width:1024px){.bento-grid[_ngcontent-%COMP%]{grid-template-columns:1fr;justify-items:center}}.bento-col-profile[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:flex-start}.bento-col-widgets[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.9rem;width:auto}@media(max-width:1024px){.bento-col-widgets[_ngcontent-%COMP%]{width:100%;max-width:400px}}.widget-card[_ngcontent-%COMP%]{position:relative;width:100%;transform-style:preserve-3d;background:#0006;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden;box-shadow:0 4px 24px -1px #0003,0 0 0 1px #ffffff0d inset;transition:transform .4s cubic-bezier(.25,.46,.45,.94),box-shadow .4s ease,border-color .4s ease}.widget-card[_ngcontent-%COMP%]:before{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(800px circle at var(--mouse-x, -50%) var(--mouse-y, -50%),rgba(255,255,255,.08),transparent 40%);opacity:0;transition:opacity .5s ease;z-index:2;pointer-events:none}.widget-card[_ngcontent-%COMP%]:hover{transform:translateY(-4px) scale(1.005);box-shadow:0 20px 40px -5px #0006,0 0 0 1px #ffffff26 inset;border-color:#fff3;z-index:10}.widget-card[_ngcontent-%COMP%]:hover:before{opacity:1}.clock-card[_ngcontent-%COMP%]{min-height:150px;display:flex;flex-direction:column}.clock-card[_ngcontent-%COMP%]   .clock-content[_ngcontent-%COMP%]{position:relative;z-index:1;flex-grow:1;width:100%;display:flex;justify-content:center;align-items:center}.shadow-card[_ngcontent-%COMP%]{min-height:160px}.shadow-card[_ngcontent-%COMP%]:hover   .shadow-bg[_ngcontent-%COMP%]{transform:scale(1.05);filter:brightness(.8) blur(1px)}.shadow-card[_ngcontent-%COMP%]   .shadow-bg[_ngcontent-%COMP%]{position:absolute;inset:0;background-image:url("./media/shadow-WQPJBUIG.webp");background-size:cover;background-position:center 55%;filter:brightness(.6);transition:all .5s ease;z-index:0}.shadow-card[_ngcontent-%COMP%]   .shadow-bg[_ngcontent-%COMP%]:after{content:"";position:absolute;inset:0;background:linear-gradient(to right,#000000e6,#0009,#0006)}.shadow-card[_ngcontent-%COMP%]   .shadow-content[_ngcontent-%COMP%]{position:relative;z-index:1;padding:1.5rem 2rem;display:flex;flex-direction:column;justify-content:center;height:100%}.shadow-card[_ngcontent-%COMP%]   .shadow-role[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.75rem;margin-bottom:.75rem}.shadow-card[_ngcontent-%COMP%]   .shadow-role[_ngcontent-%COMP%]   fa-icon[_ngcontent-%COMP%]{color:#fff;font-size:1.1rem;filter:drop-shadow(0 0 2px rgba(255,255,255,.3))}.shadow-card[_ngcontent-%COMP%]   .shadow-role[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-family:Cinzel,serif;font-weight:700;font-size:.9rem;letter-spacing:2px;text-transform:uppercase;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,.3)}.shadow-card[_ngcontent-%COMP%]   .shadow-quote[_ngcontent-%COMP%]{font-family:Playfair Display,serif;font-style:italic;font-size:1rem;line-height:1.5;color:#ffffffe6;border-left:3px solid rgba(255,255,255,.3);padding-left:1rem;opacity:.95;min-height:4.5em;display:flex;align-items:center}.shadow-card[_ngcontent-%COMP%]   .typewriter-cursor[_ngcontent-%COMP%]{display:inline;color:#fff;font-weight:400;margin-left:2px;animation:_ngcontent-%COMP%_blink 1s step-end infinite;text-shadow:0 0 8px rgba(255,255,255,.6);vertical-align:baseline}@keyframes _ngcontent-%COMP%_blink{0%,to{opacity:1}50%{opacity:0}}.social-card-container[_ngcontent-%COMP%]{padding:1.5rem 2rem;display:flex;flex-direction:column;gap:1.2rem}.social-header[_ngcontent-%COMP%]{display:flex;align-items:center;gap:1rem;opacity:.8;width:100%}.social-header[_ngcontent-%COMP%]   .line[_ngcontent-%COMP%]{flex-grow:1;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent)}.social-header[_ngcontent-%COMP%]   .social-title[_ngcontent-%COMP%]{font-family:Roboto,sans-serif;font-size:.75rem;text-transform:uppercase;letter-spacing:4px;color:#fffc;font-weight:400}.social-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(2,1fr);gap:.75rem;width:100%}.social-item[_ngcontent-%COMP%]{position:relative;display:flex;align-items:center;gap:.75rem;padding:.8rem 1rem;background:#ffffff08;border:1px solid rgba(255,255,255,.05);border-radius:8px;overflow:hidden;text-decoration:none;transition:all .2s ease;cursor:url("./media/link-HDI54XKM.png"),pointer}.social-item[_ngcontent-%COMP%]   .item-bg[_ngcontent-%COMP%]{position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,255,255,.05),transparent);opacity:0;transition:opacity .2s ease}.social-item[_ngcontent-%COMP%]   fa-icon[_ngcontent-%COMP%]{font-size:1.2rem;color:#fff9;transition:all .2s ease;z-index:1;width:24px;text-align:center;display:flex;justify-content:center;align-items:center}.social-item[_ngcontent-%COMP%]   .item-name[_ngcontent-%COMP%]{font-family:Roboto,sans-serif;font-size:.8rem;font-weight:500;color:#fff9;letter-spacing:1px;text-transform:uppercase;transition:color .2s ease;z-index:1}.social-item[_ngcontent-%COMP%]:hover{background:#ffffff14;border-color:#ffffff26;transform:translate(2px)}.social-item[_ngcontent-%COMP%]:hover   .item-bg[_ngcontent-%COMP%]{opacity:1}.social-item[_ngcontent-%COMP%]:hover   fa-icon[_ngcontent-%COMP%]{color:#fff;transform:scale(1.1)}.social-item[_ngcontent-%COMP%]:hover   .item-name[_ngcontent-%COMP%]{color:#fff}.page-mute-button[_ngcontent-%COMP%]{position:fixed;top:2rem;right:2rem;z-index:9998;width:48px;height:48px;background:#0009;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1.5px solid rgba(255,255,255,.25);border-radius:12px;color:#ffffffd9;cursor:pointer;transition:all .3s cubic-bezier(.4,0,.2,1);font-size:1.3rem;padding:0;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 32px #0000004d,0 0 0 1px #ffffff1a inset}.page-mute-button[_ngcontent-%COMP%]   fa-icon[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center}.page-mute-button[_ngcontent-%COMP%]:hover{background:#000000bf;border-color:#fff6;color:#fff;transform:scale(1.15);box-shadow:0 12px 40px #0006,0 0 20px #fff3 inset}.page-mute-button[_ngcontent-%COMP%]:active{transform:scale(.98)}@media(max-width:640px){.page-mute-button[_ngcontent-%COMP%]{top:1.5rem;right:1.5rem;width:44px;height:44px;font-size:1.1rem}}.floating-search-btn[_ngcontent-%COMP%]{position:fixed;bottom:1.5rem;right:1.5rem;display:flex;align-items:center;justify-content:center;gap:.75rem;padding:.875rem 1.25rem;background:#0009;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.15);border-radius:9999px;color:#fff;font-weight:600;font-size:.95rem;cursor:pointer;z-index:998;transition:all .3s cubic-bezier(.4,0,.2,1);box-shadow:0 8px 24px #0006,0 0 40px #ffffff0d;overflow:hidden;max-width:calc(100vw - 3rem);white-space:nowrap}.floating-search-btn[_ngcontent-%COMP%]   .btn-glow[_ngcontent-%COMP%]{position:absolute;inset:0;background:linear-gradient(45deg,transparent,rgba(255,255,255,.2),transparent);transform:translate(-100%);transition:transform .6s;pointer-events:none}.floating-search-btn[_ngcontent-%COMP%]   .search-icon[_ngcontent-%COMP%]{font-size:1.125rem;transition:transform .3s;flex-shrink:0}.floating-search-btn[_ngcontent-%COMP%]   .btn-text[_ngcontent-%COMP%]{font-size:.9rem;letter-spacing:.02em;line-height:1}.floating-search-btn[_ngcontent-%COMP%]:hover{transform:translateY(-2px) scale(1.03);box-shadow:0 12px 32px #00000080,0 0 60px #ffffff1a;background:#ffffff1a;border-color:#ffffff4d}.floating-search-btn[_ngcontent-%COMP%]:hover   .btn-glow[_ngcontent-%COMP%]{transform:translate(100%)}.floating-search-btn[_ngcontent-%COMP%]:hover   .search-icon[_ngcontent-%COMP%]{transform:rotate(90deg)}.floating-search-btn[_ngcontent-%COMP%]:active{transform:translateY(-1px) scale(1)}.tech-stack-card[_ngcontent-%COMP%]{min-height:70px;padding:0;display:flex;align-items:center}.tech-stack-card[_ngcontent-%COMP%]   .marquee-mask[_ngcontent-%COMP%]{width:100%;overflow:hidden;mask-image:linear-gradient(to right,transparent,black 10%,black 90%,transparent);-webkit-mask-image:linear-gradient(to right,transparent,black 10%,black 90%,transparent)}.tech-stack-card[_ngcontent-%COMP%]   .marquee-track[_ngcontent-%COMP%]{display:flex;gap:3rem;width:max-content;animation:_ngcontent-%COMP%_scroll 20s linear infinite;padding:.5rem 0}.tech-stack-card[_ngcontent-%COMP%]   .marquee-track[_ngcontent-%COMP%]:hover{animation-play-state:paused}.tech-stack-card[_ngcontent-%COMP%]   .tech-item[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center}.tech-stack-card[_ngcontent-%COMP%]   .tech-item[_ngcontent-%COMP%]   fa-icon[_ngcontent-%COMP%]{font-size:1.8rem;transition:all .3s ease;filter:grayscale(100%) brightness(.7);opacity:.6}.tech-stack-card[_ngcontent-%COMP%]   .tech-item[_ngcontent-%COMP%]:hover   fa-icon[_ngcontent-%COMP%]{filter:grayscale(0%) brightness(1.2) drop-shadow(0 0 5px currentColor);opacity:1;transform:scale(1.2)}@keyframes _ngcontent-%COMP%_scroll{0%{transform:translate(0)}to{transform:translate(-33.3333333333%)}}@media screen and (max-width:640px){.floating-search-btn[_ngcontent-%COMP%]{bottom:1rem;right:1rem;padding:.75rem;width:52px;height:52px}.floating-search-btn[_ngcontent-%COMP%]   .btn-text[_ngcontent-%COMP%]{display:none}.floating-search-btn[_ngcontent-%COMP%]   .search-icon[_ngcontent-%COMP%]{font-size:1.25rem}}@keyframes _ngcontent-%COMP%_fadeInUp{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}app-neko[_ngcontent-%COMP%]{position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;pointer-events:none}.anim-wrapper[_ngcontent-%COMP%]{width:100%;opacity:0;animation:_ngcontent-%COMP%_fadeInUp .6s cubic-bezier(.2,.8,.2,1) forwards}.bento-col-profile[_ngcontent-%COMP%]{opacity:0;animation:_ngcontent-%COMP%_fadeInUp .6s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:.1s}.delay-1[_ngcontent-%COMP%]{animation-delay:.2s}.delay-2[_ngcontent-%COMP%]{animation-delay:.3s}.delay-3[_ngcontent-%COMP%]{animation-delay:.4s}.delay-4[_ngcontent-%COMP%]{animation-delay:.5s}.clock-card[_ngcontent-%COMP%], .shadow-card[_ngcontent-%COMP%], .social-card-container[_ngcontent-%COMP%], .tech-stack-card[_ngcontent-%COMP%]{opacity:1}']
        })
        }
    }
    return t
}
)();
export {R1 as MainComponent};
