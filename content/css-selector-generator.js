!(function (t, e) {
	"object" == typeof exports && "object" == typeof module ? (module.exports = e()) : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? (exports.CssSelectorGenerator = e()) : (t.CssSelectorGenerator = e());
})(self, () =>
	(() => {
		"use strict";
		var t = {
				d: (e, n) => {
					for (var r in n) t.o(n, r) && !t.o(e, r) && Object.defineProperty(e, r, { enumerable: !0, get: n[r] });
				},
				o: (t, e) => Object.prototype.hasOwnProperty.call(t, e),
				r: (t) => {
					"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 });
				},
			},
			e = {};
		function n(t) {
			return t && t instanceof Element;
		}
		t.r(e), t.d(e, { default: () => K, getCssSelector: () => J });
		const r = { NONE: "", DESCENDANT: " ", CHILD: " > " },
			o = { id: "id", class: "class", tag: "tag", attribute: "attribute", nthchild: "nthchild", nthoftype: "nthoftype" },
			i = "CssSelectorGenerator";
		function c(t = "unknown problem", ...e) {
			console.warn(`${i}: ${t}`, ...e);
		}
		const u = {
			selectors: [o.id, o.class, o.tag, o.attribute],
			includeTag: !1,
			whitelist: [],
			blacklist: [],
			combineWithinSelector: !0,
			combineBetweenSelectors: !0,
			root: null,
			maxCombinations: Number.POSITIVE_INFINITY,
			maxCandidates: Number.POSITIVE_INFINITY,
		};
		function s(t) {
			return t instanceof RegExp;
		}
		function a(t) {
			return ["string", "function"].includes(typeof t) || s(t);
		}
		function l(t) {
			return Array.isArray(t) ? t.filter(a) : [];
		}
		function f(t) {
			const e = [Node.DOCUMENT_NODE, Node.DOCUMENT_FRAGMENT_NODE, Node.ELEMENT_NODE];
			return (
				(function (t) {
					return t instanceof Node;
				})(t) && e.includes(t.nodeType)
			);
		}
		function d(t, e) {
			if (f(t))
				return (
					t.contains(e) ||
						c(
							"element root mismatch",
							"Provided root does not contain the element. This will most likely result in producing a fallback selector using element's real root node. If you plan to use the selector using provided root (e.g. `root.querySelector`), it will nto work as intended."
						),
					t
				);
			const n = e.getRootNode({ composed: !1 });
			return f(n)
				? (n !== document &&
						c(
							"shadow root inferred",
							"You did not provide a root and the element is a child of Shadow DOM. This will produce a selector using ShadowRoot as a root. If you plan to use the selector using document as a root (e.g. `document.querySelector`), it will not work as intended."
						),
				  n)
				: e.ownerDocument.querySelector(":root");
		}
		function m(t) {
			return "number" == typeof t ? t : Number.POSITIVE_INFINITY;
		}
		function p(t = []) {
			const [e = [], ...n] = t;
			return 0 === n.length ? e : n.reduce((t, e) => t.filter((t) => e.includes(t)), e);
		}
		function g(t) {
			return [].concat(...t);
		}
		function h(t) {
			const e = t.map((t) => {
				if (s(t)) return (e) => t.test(e);
				if ("function" == typeof t)
					return (e) => {
						const n = t(e);
						return "boolean" != typeof n ? (c("pattern matcher function invalid", "Provided pattern matching function does not return boolean. It's result will be ignored.", t), !1) : n;
					};
				if ("string" == typeof t) {
					const e = new RegExp("^" + t.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".+") + "$");
					return (t) => e.test(t);
				}
				return c("pattern matcher invalid", "Pattern matching only accepts strings, regular expressions and/or functions. This item is invalid and will be ignored.", t), () => !1;
			});
			return (t) => e.some((e) => e(t));
		}
		function b(t, e, n) {
			const r = Array.from(d(n, t[0]).querySelectorAll(e));
			return r.length === t.length && t.every((t) => r.includes(t));
		}
		function y(t, e) {
			e =
				null != e
					? e
					: (function (t) {
							return t.ownerDocument.querySelector(":root");
					  })(t);
			const r = [];
			let o = t;
			for (; n(o) && o !== e; ) r.push(o), (o = o.parentElement);
			return r;
		}
		function N(t, e) {
			return p(t.map((t) => y(t, e)));
		}
		const S = ", ",
			E = new RegExp(["^$", "\\s"].join("|")),
			w = new RegExp(["^$"].join("|")),
			v = [o.nthoftype, o.tag, o.id, o.class, o.attribute, o.nthchild],
			I = h(["class", "id", "ng-*"]);
		function C({ name: t }) {
			return `[${t}]`;
		}
		function T({ name: t, value: e }) {
			return `[${t}='${e}']`;
		}
		function O({ nodeName: t, nodeValue: e }) {
			return { name: ((n = t), n.replace(/:/g, "\\:")), value: V(e) };
			var n;
		}
		function x(t) {
			const e = Array.from(t.attributes)
				.filter((e) =>
					(function ({ nodeName: t }, e) {
						const n = e.tagName.toLowerCase();
						return !((["input", "option"].includes(n) && "value" === t) || I(t));
					})(e, t)
				)
				.map(O);
			return [...e.map(C), ...e.map(T)];
		}
		function j(t) {
			return (t.getAttribute("class") || "")
				.trim()
				.split(/\s+/)
				.filter((t) => !w.test(t))
				.map((t) => `.${V(t)}`);
		}
		function A(t) {
			const e = t.getAttribute("id") || "",
				n = `#${V(e)}`,
				r = t.getRootNode({ composed: !1 });
			return !E.test(e) && b([t], n, r) ? [n] : [];
		}
		function $(t) {
			const e = t.parentNode;
			if (e) {
				const r = Array.from(e.childNodes).filter(n).indexOf(t);
				if (r > -1) return [`:nth-child(${r + 1})`];
			}
			return [];
		}
		function D(t) {
			return [V(t.tagName.toLowerCase())];
		}
		function R(t) {
			const e = [...new Set(g(t.map(D)))];
			return 0 === e.length || e.length > 1 ? [] : [e[0]];
		}
		function P(t) {
			const e = R([t])[0],
				n = t.parentElement;
			if (n) {
				const r = Array.from(n.children).filter((t) => t.tagName.toLowerCase() === e),
					o = r.indexOf(t);
				if (o > -1) return [`${e}:nth-of-type(${o + 1})`];
			}
			return [];
		}
		function _(t = [], { maxResults: e = Number.POSITIVE_INFINITY } = {}) {
			return Array.from(
				(function* (t = [], { maxResults: e = Number.POSITIVE_INFINITY } = {}) {
					let n = 0,
						r = L(1);
					for (; r.length <= t.length && n < e; ) {
						n += 1;
						const e = r.map((e) => t[e]);
						yield e, (r = k(r, t.length - 1));
					}
				})(t, { maxResults: e })
			);
		}
		function k(t = [], e = 0) {
			const n = t.length;
			if (0 === n) return [];
			const r = [...t];
			r[n - 1] += 1;
			for (let t = n - 1; t >= 0; t--)
				if (r[t] > e) {
					if (0 === t) return L(n + 1);
					r[t - 1]++, (r[t] = r[t - 1] + 1);
				}
			return r[n - 1] > e ? L(n + 1) : r;
		}
		function L(t = 1) {
			return Array.from(Array(t).keys());
		}
		const M = ":".charCodeAt(0).toString(16).toUpperCase(),
			F = /[ !"#$%&'()\[\]{|}<>*+,./;=?@^`~\\]/;
		function V(t = "") {
			var e, n;
			return null !== (n = null === (e = null === CSS || void 0 === CSS ? void 0 : CSS.escape) || void 0 === e ? void 0 : e.call(CSS, t)) && void 0 !== n
				? n
				: (function (t = "") {
						return t
							.split("")
							.map((t) => (":" === t ? `\\${M} ` : F.test(t) ? `\\${t}` : escape(t).replace(/%/g, "\\")))
							.join("");
				  })(t);
		}
		const Y = {
				tag: R,
				id: function (t) {
					return 0 === t.length || t.length > 1 ? [] : A(t[0]);
				},
				class: function (t) {
					return p(t.map(j));
				},
				attribute: function (t) {
					return p(t.map(x));
				},
				nthchild: function (t) {
					return p(t.map($));
				},
				nthoftype: function (t) {
					return p(t.map(P));
				},
			},
			q = { tag: D, id: A, class: j, attribute: x, nthchild: $, nthoftype: P };
		function B(t) {
			return t.includes(o.tag) || t.includes(o.nthoftype) ? [...t] : [...t, o.tag];
		}
		function G(t = {}) {
			const e = [...v];
			return (
				t[o.tag] && t[o.nthoftype] && e.splice(e.indexOf(o.tag), 1),
				e
					.map((e) => {
						return (r = t)[(n = e)] ? r[n].join("") : "";
						var n, r;
					})
					.join("")
			);
		}
		function H(t, e, n = "", o) {
			const i = (function (t, e) {
				return "" === e
					? t
					: (function (t, e) {
							return [...t.map((t) => e + r.DESCENDANT + t), ...t.map((t) => e + r.CHILD + t)];
					  })(t, e);
			})(
				(function (t, e, n) {
					const r = (function (t, e) {
							const { blacklist: n, whitelist: r, combineWithinSelector: o, maxCombinations: i } = e,
								c = h(n),
								u = h(r);
							return (function (t) {
								const { selectors: e, includeTag: n } = t,
									r = [].concat(e);
								return n && !r.includes("tag") && r.push("tag"), r;
							})(e).reduce((e, n) => {
								const r = (function (t, e) {
										var n;
										return (null !== (n = Y[e]) && void 0 !== n ? n : () => [])(t);
									})(t, n),
									s = (function (t = [], e, n) {
										return t.filter((t) => n(t) || !e(t));
									})(r, c, u),
									a = (function (t = [], e) {
										return t.sort((t, n) => {
											const r = e(t),
												o = e(n);
											return r && !o ? -1 : !r && o ? 1 : 0;
										});
									})(s, u);
								return (e[n] = o ? _(a, { maxResults: i }) : a.map((t) => [t])), e;
							}, {});
						})(t, n),
						o = (function (t, e) {
							return (function (t) {
								const { selectors: e, combineBetweenSelectors: n, includeTag: r, maxCandidates: o } = t,
									i = n ? _(e, { maxResults: o }) : e.map((t) => [t]);
								return r ? i.map(B) : i;
							})(e)
								.map((e) =>
									(function (t, e) {
										const n = {};
										return (
											t.forEach((t) => {
												const r = e[t];
												r.length > 0 && (n[t] = r);
											}),
											(function (t = {}) {
												let e = [];
												return (
													Object.entries(t).forEach(([t, n]) => {
														e = n.flatMap((n) => (0 === e.length ? [{ [t]: n }] : e.map((e) => Object.assign(Object.assign({}, e), { [t]: n }))));
													}),
													e
												);
											})(n).map(G)
										);
									})(e, t)
								)
								.filter((t) => t.length > 0);
						})(r, n),
						i = g(o);
					return [...new Set(i)];
				})(t, o.root, o),
				n
			);
			for (const e of i) if (b(t, e, o.root)) return e;
			return null;
		}
		function W(t) {
			return { value: t, include: !1 };
		}
		function U({ selectors: t, operator: e }) {
			let n = [...v];
			t[o.tag] && t[o.nthoftype] && (n = n.filter((t) => t !== o.tag));
			let r = "";
			return (
				n.forEach((e) => {
					(t[e] || []).forEach(({ value: t, include: e }) => {
						e && (r += t);
					});
				}),
				e + r
			);
		}
		function z(t) {
			return [
				":root",
				...y(t)
					.reverse()
					.map((t) => {
						const e = (function (t, e, n = r.NONE) {
							const o = {};
							return (
								e.forEach((e) => {
									Reflect.set(
										o,
										e,
										(function (t, e) {
											return q[e](t);
										})(t, e).map(W)
									);
								}),
								{ element: t, operator: n, selectors: o }
							);
						})(t, [o.nthchild], r.CHILD);
						return (
							e.selectors.nthchild.forEach((t) => {
								t.include = !0;
							}),
							e
						);
					})
					.map(U),
			].join("");
		}
		function J(t, e = {}) {
			const r = (function (t) {
					(t instanceof NodeList || t instanceof HTMLCollection) && (t = Array.from(t));
					const e = (Array.isArray(t) ? t : [t]).filter(n);
					return [...new Set(e)];
				})(t),
				i = (function (t, e = {}) {
					const n = Object.assign(Object.assign({}, u), e);
					return {
						selectors:
							((r = n.selectors),
							Array.isArray(r)
								? r.filter((t) => {
										return (e = o), (n = t), Object.values(e).includes(n);
										var e, n;
								  })
								: []),
						whitelist: l(n.whitelist),
						blacklist: l(n.blacklist),
						root: d(n.root, t),
						combineWithinSelector: !!n.combineWithinSelector,
						combineBetweenSelectors: !!n.combineBetweenSelectors,
						includeTag: !!n.includeTag,
						maxCombinations: m(n.maxCombinations),
						maxCandidates: m(n.maxCandidates),
					};
					var r;
				})(r[0], e);
			let c = "",
				s = i.root;
			function a() {
				return (function (t, e, n = "", r) {
					if (0 === t.length) return null;
					const o = [t.length > 1 ? t : [], ...N(t, e).map((t) => [t])];
					for (const t of o) {
						const e = H(t, 0, n, r);
						if (e) return { foundElements: t, selector: e };
					}
					return null;
				})(r, s, c, i);
			}
			let f = a();
			for (; f; ) {
				const { foundElements: t, selector: e } = f;
				if (b(r, e, i.root)) return e;
				(s = t[0]), (c = e), (f = a());
			}
			return r.length > 1
				? r.map((t) => J(t, i)).join(S)
				: (function (t) {
						return t.map(z).join(S);
				  })(r);
		}
		const K = J;
		return e;
	})()
);
//# sourceMappingURL=css-selector-generator.js.map
