function _(t){return!e(t)}function e(t){return t!=null&&t!==!1}function l(t){return!t||t.length===0||t.trimLeft().length===0}var c=function(t){return document.getElementById(t)},a=function(){const t=c("html-input"),u=c("convert-button");return e((()=>{const o=t;return e(o)?_(l(t.value)):o})())?u.classList.remove("hidden"):u.classList.add("hidden")},d=function(){const t=c("result-output"),u=c("copy-button"),o=e(t)?t.querySelector("code"):null;if(e((()=>{const n=o;return e(n)?u:n})())){const n=o.textContent,r=document.createElement("textarea");r.value=n,r.style="position: absolute; left: -9999px;",document.body.appendChild(r),r.select(),document.execCommand("copy"),document.body.removeChild(r);const i=u.querySelectorAll("svg");if(e((()=>{const s=i.length>0;return s&&i.length>1})()))return i[0].classList.add("hidden"),i[1].classList.remove("hidden"),setTimeout(function(){return i[0].classList.remove("hidden"),i[1].classList.add("hidden")},1500)}},f=function(){const t=c("html-input"),u=c("convert-button"),o=c("copy-button");if(e((()=>{const n=t;if(e(n)){const r=u;return e(r)?o:r}else return n})()))return t.addEventListener("input",function(n){return a()}),o.addEventListener("click",function(n){return d()})};f();
