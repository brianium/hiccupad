import * as squint_core from 'squint-cljs/core.js';
import * as str from 'squint-cljs/src/squint/string.js';
var get_element_by_id = function (id) {
return document.getElementById(id)
};
var parse_attributes = function (attrs_string) {
if (squint_core.truth_((() => {
const and__24283__auto__1 = attrs_string;
if (squint_core.truth_(and__24283__auto__1)) {
return squint_core.not(str.blank_QMARK_(attrs_string))} else {
return and__24283__auto__1}
})())) {
const attr_pattern2 = /([^\s=]+)(?:=\"([^\"]*)\")?/;
const matches3 = squint_core.re_seq(attr_pattern2, attrs_string);
return squint_core.into(({  }), squint_core.map((function (p__1) {
const vec__47 = p__1;
const _8 = squint_core.nth(vec__47, 0, null);
const name9 = squint_core.nth(vec__47, 1, null);
const value10 = squint_core.nth(vec__47, 2, null);
return [squint_core.str(":", name9), (() => {
const or__24252__auto__11 = value10;
if (squint_core.truth_(or__24252__auto__11)) {
return or__24252__auto__11} else {
return true}
})()]
}), matches3))}
};
var strip_html_comments = function (html) {
return str.replace(html, /<!--[\s\S]*?-->/, "")
};
var normalize_whitespace = function (text) {
return str.trim(str.replace(text, /\s+/, " "))
};
var js_array__GT_clj_vec = function (arr) {
const result1 = squint_core.transient$([]);
const len2 = arr.length;
let i3 = 0;
while(true){
if ((i3) < (len2)) {
squint_core.conj_BANG_(result1, arr[i3]);
let G__4 = (i3 + 1);
i3 = G__4;
continue;
} else {
return squint_core.persistent_BANG_(result1)};break;
}

};
var has_multiple_roots_QMARK_ = function (html) {
const cleaned_html1 = str.trim(strip_html_comments(html));
const temp_div2 = document.createElement("div");
temp_div2.innerHTML = cleaned_html1;
const child_nodes3 = temp_div2.childNodes;
const element_count4 = (() => {
let i5 = 0;
let count6 = 0;
while(true){
if ((i5) < (child_nodes3.length)) {
const node7 = child_nodes3[i5];
let G__8 = (i5 + 1);
let G__9 = (((node7.nodeType) === (1)) ? ((count6 + 1)) : (count6));
i5 = G__8;
count6 = G__9;
continue;
} else {
return count6};break;
}

})();
return (element_count4) > (1)
};
var simple_html__GT_hiccup = function (html) {
const html1 = str.trim(strip_html_comments(html));
const has_html_tag2 = squint_core.re_find(/<html[\s>]/, html1);
const has_body_tag3 = squint_core.re_find(/<body[\s>]/, html1);
const has_head_tag4 = squint_core.re_find(/<head[\s>]/, html1);
const multiple_roots5 = has_multiple_roots_QMARK_(html1);
const parse_html6 = ((squint_core.truth_(multiple_roots5)) ? (squint_core.str("<div id=\"multiple-roots-wrapper\">", html1, "</div>")) : (html1));
const dom_parser7 = new DOMParser();
const doc8 = dom_parser7.parseFromString(parse_html6, "text/html");
const element__GT_hiccup9 = (function (el) {
if ((el.nodeType) === (3)) {
const text10 = normalize_whitespace(el.textContent);
if (squint_core.truth_(str.blank_QMARK_(text10))) {
return null} else {
return text10}} else {
if ((el.nodeType) === (1)) {
const tag_name11 = str.lower_case(el.tagName);
const is_wrapper12 = (() => {
const and__24283__auto__13 = multiple_roots5;
if (squint_core.truth_(and__24283__auto__13)) {
const and__24283__auto__14 = (tag_name11) === ("div");
if (and__24283__auto__14) {
return (el.id) === ("multiple-roots-wrapper")} else {
return and__24283__auto__14}} else {
return and__24283__auto__13}
})();
const skip_tag15 = (() => {
const or__24252__auto__16 = (() => {
const and__24283__auto__17 = (tag_name11) === ("html");
if (and__24283__auto__17) {
return squint_core.not(has_html_tag2)} else {
return and__24283__auto__17}
})();
if (squint_core.truth_(or__24252__auto__16)) {
return or__24252__auto__16} else {
const or__24252__auto__18 = (() => {
const and__24283__auto__19 = (tag_name11) === ("body");
if (and__24283__auto__19) {
return squint_core.not(has_body_tag3)} else {
return and__24283__auto__19}
})();
if (squint_core.truth_(or__24252__auto__18)) {
return or__24252__auto__18} else {
const and__24283__auto__20 = (tag_name11) === ("head");
if (and__24283__auto__20) {
return squint_core.not(has_head_tag4)} else {
return and__24283__auto__20}}}
})();
const tag_kw21 = squint_core.str(":", tag_name11);
const attrs22 = ((squint_core.truth_(el.attributes)) ? ((() => {
const attrs_map23 = ({  });
let i24 = 0;
let result25 = attrs_map23;
while(true){
if ((i24) < (el.attributes.length)) {
const attr26 = el.attributes[i24];
const name27 = squint_core.str(":", attr26.name);
const value28 = attr26.value;
let G__29 = (i24 + 1);
let G__30 = squint_core.assoc(result25, name27, value28);
i24 = G__29;
result25 = G__30;
continue;
} else {
if ((squint_core.count(result25)) > (0)) {
return result25}};break;
}

})()) : (null));
const children31 = js_array__GT_clj_vec(el.childNodes);
const child_hiccups32 = squint_core.filter(squint_core.identity, squint_core.map(element__GT_hiccup9, children31));
if (squint_core.truth_(is_wrapper12)) {
return squint_core.into(["__multiple_roots__"], child_hiccups32)} else {
if (squint_core.truth_(skip_tag15)) {
if (squint_core.truth_(squint_core.empty_QMARK_(child_hiccups32))) {
return null} else {
if ((squint_core.count(child_hiccups32)) === (1)) {
return squint_core.first(child_hiccups32)} else {
return child_hiccups32}}} else {
if ("else") {
if (squint_core.truth_(attrs22)) {
return squint_core.into([tag_kw21, attrs22], child_hiccups32)} else {
return squint_core.into([tag_kw21], child_hiccups32)}} else {
return null}}}}}
});
const raw_result33 = element__GT_hiccup9(doc8.documentElement);
console.log("Multiple roots:", multiple_roots5);
if (squint_core.truth_((() => {
const and__24283__auto__34 = multiple_roots5;
if (squint_core.truth_(and__24283__auto__34)) {
const and__24283__auto__35 = squint_core.vector_QMARK_(raw_result33);
if (squint_core.truth_(and__24283__auto__35)) {
return (squint_core.first(raw_result33)) === ("__multiple_roots__")} else {
return and__24283__auto__35}} else {
return and__24283__auto__34}
})())) {
return squint_core.into(["list"], squint_core.rest(raw_result33))} else {
if (squint_core.truth_((() => {
const and__24283__auto__36 = squint_core.not(multiple_roots5);
if (and__24283__auto__36) {
const and__24283__auto__37 = squint_core.vector_QMARK_(raw_result33);
if (squint_core.truth_(and__24283__auto__37)) {
const and__24283__auto__38 = (squint_core.first(raw_result33)) === ("__multiple_roots__");
if (and__24283__auto__38) {
return (squint_core.count(raw_result33)) > (1)} else {
return and__24283__auto__38}} else {
return and__24283__auto__37}} else {
return and__24283__auto__36}
})())) {
return squint_core.second(raw_result33)} else {
if (squint_core.truth_((() => {
const and__24283__auto__39 = squint_core.vector_QMARK_(raw_result33);
if (squint_core.truth_(and__24283__auto__39)) {
const and__24283__auto__40 = squint_core.string_QMARK_(squint_core.first(raw_result33));
if (squint_core.truth_(and__24283__auto__40)) {
return str.starts_with_QMARK_(squint_core.first(raw_result33), ":")} else {
return and__24283__auto__40}} else {
return and__24283__auto__39}
})())) {
return raw_result33} else {
if (squint_core.truth_(squint_core.vector_QMARK_(raw_result33))) {
let items41 = raw_result33;
while(true){
if (squint_core.truth_(squint_core.empty_QMARK_(items41))) {
return null} else {
if (squint_core.truth_((() => {
const and__24283__auto__42 = squint_core.vector_QMARK_(squint_core.first(items41));
if (squint_core.truth_(and__24283__auto__42)) {
const and__24283__auto__43 = squint_core.not(squint_core.empty_QMARK_(squint_core.first(items41)));
if (and__24283__auto__43) {
const and__24283__auto__44 = squint_core.string_QMARK_(squint_core.first(squint_core.first(items41)));
if (squint_core.truth_(and__24283__auto__44)) {
return str.starts_with_QMARK_(squint_core.first(squint_core.first(items41)), ":")} else {
return and__24283__auto__44}} else {
return and__24283__auto__43}} else {
return and__24283__auto__42}
})())) {
return squint_core.first(items41)} else {
if ("else") {
let G__45 = squint_core.rest(items41);
items41 = G__45;
continue;
} else {
return null}}};break;
}
} else {
if ("else") {
return raw_result33} else {
return null}}}}}
};
var pretty_print_hiccup = function (hiccup) {
const indent_level1 = squint_core.atom(0);
const result2 = squint_core.atom("");
const indent3 = (function () {
return squint_core.apply(squint_core.str, squint_core.repeat((2) * (squint_core.deref(indent_level1)), " "))
});
const append_BANG_4 = (function (s) {
return squint_core.swap_BANG_(result2, squint_core.str, s)
});
const pp_map5 = (function (m) {
append_BANG_4("{");
const entries7 = Object.entries(m);
const len8 = entries7.length;
let i9 = 0;
while(true){
if ((i9) < (len8)) {
const entry10 = entries7[i9];
const k11 = entry10[0];
const v12 = entry10[1];
append_BANG_4(k11);
append_BANG_4(" ");
append_BANG_4(squint_core.pr_str(v12));
if (((i9 + 1)) < (len8)) {
append_BANG_4(" ")};
let G__13 = (i9 + 1);
i9 = G__13;
continue;
};break;
}
;
return append_BANG_4("}")
});
const pp6 = (function (form) {
if (squint_core.truth_((() => {
const and__24283__auto__14 = squint_core.vector_QMARK_(form);
if (squint_core.truth_(and__24283__auto__14)) {
return (squint_core.first(form)) === ("list")} else {
return and__24283__auto__14}
})())) {
append_BANG_4("(list");
squint_core.swap_BANG_(indent_level1, squint_core.inc);
for (let G__15 of squint_core.iterable(squint_core.rest(form))) {
const child16 = G__15;
append_BANG_4("\n");
append_BANG_4(indent3());
pp6(child16)
};
squint_core.swap_BANG_(indent_level1, squint_core.dec);
return append_BANG_4(")")} else {
if (squint_core.truth_(squint_core.vector_QMARK_(form))) {
append_BANG_4("[");
const temp__23847__auto__17 = squint_core.first(form);
if (squint_core.truth_(temp__23847__auto__17)) {
const tag18 = temp__23847__auto__17;
append_BANG_4(tag18);
if (squint_core.truth_((() => {
const and__24283__auto__19 = (squint_core.count(form)) > (1);
if (and__24283__auto__19) {
return squint_core.map_QMARK_(squint_core.second(form))} else {
return and__24283__auto__19}
})())) {
append_BANG_4(" ");
pp_map5(squint_core.second(form))}};
if ((squint_core.count(form)) > (((squint_core.truth_(squint_core.map_QMARK_(squint_core.second(form)))) ? (2) : (1)))) {
squint_core.swap_BANG_(indent_level1, squint_core.inc);
for (let G__20 of squint_core.iterable(squint_core.drop(((squint_core.truth_(squint_core.map_QMARK_(squint_core.second(form)))) ? (2) : (1)), form))) {
const child21 = G__20;
append_BANG_4("\n");
append_BANG_4(indent3());
pp6(child21)
};
squint_core.swap_BANG_(indent_level1, squint_core.dec)};
return append_BANG_4("]")} else {
if (squint_core.truth_(squint_core.map_QMARK_(form))) {
return pp_map5(form)} else {
if ("else") {
return append_BANG_4(squint_core.pr_str(form))} else {
return null}}}}
});
pp6(hiccup);
return squint_core.deref(result2)
};
var translate = function (event) {
const html_input1 = event.target.value;
const result_el2 = get_element_by_id("result-output");
if (squint_core.truth_((() => {
const and__24283__auto__3 = html_input1;
if (squint_core.truth_(and__24283__auto__3)) {
return squint_core.not(str.blank_QMARK_(html_input1))} else {
return and__24283__auto__3}
})())) {
try{
const hiccup4 = simple_html__GT_hiccup(html_input1);
const pretty_hiccup5 = pretty_print_hiccup(hiccup4);
result_el2.innerHTML = "";
const pre_el6 = document.createElement("pre");
const code_el7 = document.createElement("code");
pre_el6.classList.add("whitespace-pre-wrap");
code_el7.classList.add("text-xs");
code_el7.classList.add("leading-tight");
code_el7.classList.add("font-mono");
code_el7.classList.add("language-clojure");
code_el7.textContent = pretty_hiccup5;
pre_el6.appendChild(code_el7);
result_el2.appendChild(pre_el6);
if (squint_core.truth_((() => {
const and__24283__auto__8 = window.Prism;
if (squint_core.truth_(and__24283__auto__8)) {
return window.Prism.highlightElement} else {
return and__24283__auto__8}
})())) {
window.Prism.highlightElement(code_el7)}}
catch(e9){
result_el2.innerHTML = squint_core.str("<div class=\"text-error\">Error parsing HTML: ", e9.message, "</div>");
}
};
const copy_button10 = get_element_by_id("copy-button");
if (squint_core.truth_((() => {
const and__24283__auto__11 = html_input1;
if (squint_core.truth_(and__24283__auto__11)) {
return squint_core.not(str.blank_QMARK_(html_input1))} else {
return and__24283__auto__11}
})())) {
copy_button10.classList.remove("hidden")} else {
copy_button10.classList.add("hidden")};
return console.log("Translation complete")
};
var toggle_convert_button = function () {
const textarea1 = get_element_by_id("html-input");
const convert_button2 = get_element_by_id("convert-button");
if (squint_core.truth_((() => {
const and__24283__auto__3 = textarea1;
if (squint_core.truth_(and__24283__auto__3)) {
return squint_core.not(str.blank_QMARK_(textarea1.value))} else {
return and__24283__auto__3}
})())) {
return convert_button2.classList.remove("hidden")} else {
return convert_button2.classList.add("hidden")}
};
var copy_to_clipboard = function () {
const result_el1 = get_element_by_id("result-output");
const copy_button2 = get_element_by_id("copy-button");
const code_el3 = ((squint_core.truth_(result_el1)) ? (result_el1.querySelector("code")) : (null));
if (squint_core.truth_((() => {
const and__24283__auto__4 = code_el3;
if (squint_core.truth_(and__24283__auto__4)) {
return copy_button2} else {
return and__24283__auto__4}
})())) {
const text_content5 = code_el3.textContent;
const temp_textarea6 = document.createElement("textarea");
temp_textarea6.value = text_content5;
temp_textarea6.style = "position: absolute; left: -9999px;";
document.body.appendChild(temp_textarea6);
temp_textarea6.select();
document.execCommand("copy");
document.body.removeChild(temp_textarea6);
const icon_elements7 = copy_button2.querySelectorAll("svg");
if (squint_core.truth_((() => {
const and__24283__auto__8 = (icon_elements7.length) > (0);
if (and__24283__auto__8) {
return (icon_elements7.length) > (1)} else {
return and__24283__auto__8}
})())) {
icon_elements7[0].classList.add("hidden");
icon_elements7[1].classList.remove("hidden");
return setTimeout((function () {
icon_elements7[0].classList.remove("hidden");
return icon_elements7[1].classList.add("hidden")
}), 1500)}}
};
var init = function () {
const textarea1 = get_element_by_id("html-input");
const convert_button2 = get_element_by_id("convert-button");
const copy_button3 = get_element_by_id("copy-button");
if (squint_core.truth_((() => {
const and__24283__auto__4 = textarea1;
if (squint_core.truth_(and__24283__auto__4)) {
const and__24283__auto__5 = convert_button2;
if (squint_core.truth_(and__24283__auto__5)) {
return copy_button3} else {
return and__24283__auto__5}} else {
return and__24283__auto__4}
})())) {
textarea1.addEventListener("input", (function (_) {
return toggle_convert_button()
}));
return copy_button3.addEventListener("click", (function (_) {
return copy_to_clipboard()
}))}
};
init();

export { strip_html_comments, simple_html__GT_hiccup, translate, copy_to_clipboard, pretty_print_hiccup, js_array__GT_clj_vec, normalize_whitespace, init, has_multiple_roots_QMARK_, get_element_by_id, parse_attributes, toggle_convert_button }
