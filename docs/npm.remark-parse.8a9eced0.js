(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{111:function(t,e,n){"use strict";t.exports={position:!0,gfm:!0,commonmark:!1,footnotes:!1,pedantic:!1,blocks:n(241)}},112:function(t,e,n){"use strict";t.exports=function(t){var e,n=0,i=0,o=t.charAt(n),f={};for(;o in r;)e=r[o],i+=e,e>1&&(i=Math.floor(i/e)*e),f[i]=n,o=t.charAt(++n);return{indent:i,stops:f}};var r={" ":1,"\t":4}},113:function(t,e,n){"use strict";var r="<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\u0000-\\u0020]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>",i="<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>";e.openCloseTag=new RegExp("^(?:"+r+"|"+i+")"),e.tag=new RegExp("^(?:"+r+"|"+i+"|\x3c!----\x3e|\x3c!--(?:-?[^>-])(?:-?[^-])*--\x3e|<[?].*?[?]>|<![A-Za-z]+\\s+[^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)")},114:function(t,e,n){"use strict";t.exports=function(t,e){return t.indexOf("<",e)}},115:function(t,e,n){"use strict";t.exports=function(t,e){var n=t.indexOf("[",e),r=t.indexOf("![",e);if(-1===r)return n;return n<r?n:r}},225:function(t,e,n){"use strict";var r=n(226),i=n(27),o=n(228);function f(t){var e=r(o);e.prototype.options=i(e.prototype.options,this.data("settings"),t),this.Parser=e}t.exports=f,f.Parser=o},228:function(t,e,n){"use strict";var r=n(27),i=n(229),o=n(230),f=n(231),c=n(232),a=n(238);function s(t,e){this.file=e,this.offset={},this.options=r(this.options),this.setOptions({}),this.inList=!1,this.inBlock=!1,this.inLink=!1,this.atStart=!0,this.toOffset=o(e).toOffset,this.unescape=f(this,"escape"),this.decode=c(this)}t.exports=s;var l=s.prototype;function h(t){var e,n=[];for(e in t)n.push(e);return n}l.setOptions=n(239),l.parse=n(242),l.options=n(111),l.exitStart=i("atStart",!0),l.enterList=i("inList",!1),l.enterLink=i("inLink",!1),l.enterBlock=i("inBlock",!1),l.interruptParagraph=[["thematicBreak"],["atxHeading"],["fencedCode"],["blockquote"],["html"],["setextHeading",{commonmark:!1}],["definition",{commonmark:!1}],["footnote",{commonmark:!1}]],l.interruptList=[["atxHeading",{pedantic:!1}],["fencedCode",{pedantic:!1}],["thematicBreak",{pedantic:!1}],["definition",{commonmark:!1}],["footnote",{commonmark:!1}]],l.interruptBlockquote=[["indentedCode",{commonmark:!0}],["fencedCode",{commonmark:!0}],["atxHeading",{commonmark:!0}],["setextHeading",{commonmark:!0}],["thematicBreak",{commonmark:!0}],["html",{commonmark:!0}],["list",{commonmark:!0}],["definition",{commonmark:!1}],["footnote",{commonmark:!1}]],l.blockTokenizers={newline:n(246),indentedCode:n(247),fencedCode:n(248),blockquote:n(249),atxHeading:n(250),thematicBreak:n(251),list:n(252),setextHeading:n(254),html:n(255),footnote:n(256),definition:n(258),table:n(259),paragraph:n(260)},l.inlineTokenizers={escape:n(261),autoLink:n(263),url:n(264),html:n(266),link:n(267),reference:n(268),strong:n(269),emphasis:n(271),deletion:n(274),code:n(276),break:n(278),text:n(280)},l.blockMethods=h(l.blockTokenizers),l.inlineMethods=h(l.inlineTokenizers),l.tokenizeBlock=a("block"),l.tokenizeInline=a("inline"),l.tokenizeFactory=a},231:function(t,e,n){"use strict";t.exports=function(t,e){return function(n){var r,i=0,o=n.indexOf("\\"),f=t[e],c=[];for(;-1!==o;)c.push(n.slice(i,o)),i=o+1,(r=n.charAt(i))&&-1!==f.indexOf(r)||c.push("\\"),o=n.indexOf("\\",i);return c.push(n.slice(i)),c.join("")}}},232:function(t,e,n){"use strict";var r=n(27),i=n(88);t.exports=function(t){return o.raw=function(t,o,f){return i(t,r(f,{position:e(o),warning:n}))},o;function e(e){for(var n=t.offset,r=e.line,i=[];++r&&r in n;)i.push((n[r]||0)+1);return{start:e,indent:i}}function n(e,n,r){3!==r&&t.file.message(e,n)}function o(r,o,f){i(r,{position:e(o),warning:n,text:f,reference:f,textContext:t,referenceContext:t})}}},238:function(t,e,n){"use strict";t.exports=function(t){return function(e,n){var o,f,c,a,s,l,h=this,u=h.offset,p=[],d=h[t+"Methods"],A=h[t+"Tokenizers"],k=n.line,g=n.column;if(!e)return p;b.now=m,b.file=h.file,v("");for(;e;){for(o=-1,f=d.length,s=!1;++o<f&&(a=d[o],!(c=A[a])||c.onlyAtStart&&!h.atStart||c.notInList&&h.inList||c.notInBlock&&h.inBlock||c.notInLink&&h.inLink||(l=e.length,c.apply(h,[b,e]),!(s=l!==e.length))););s||h.file.fail(new Error("Infinite loop"),b.now())}return h.eof=m(),p;function v(t){for(var e=-1,n=t.indexOf("\n");-1!==n;)k++,e=n,n=t.indexOf("\n",n+1);-1===e?g+=t.length:g=t.length-e,k in u&&(-1!==e?g+=u[k]:g<=u[k]&&(g=u[k]+1))}function m(){var t={line:k,column:g};return t.offset=h.toOffset(t),t}function x(t){this.start=t,this.end=m()}function b(t){var n=function(){var t=[],e=k+1;return function(){for(var n=k+1;e<n;)t.push((u[e]||0)+1),e++;return t}}(),o=function(){var t=m();return function(e,n){var r=e.position,i=r?r.start:t,o=[],f=r&&r.end.line,c=t.line;if(e.position=new x(i),r&&n&&r.indent){if(o=r.indent,f<c){for(;++f<c;)o.push((u[f]||0)+1);o.push(t.column)}n=o.concat(n)}return e.position.indent=n||[],e}}(),f=m();return function(t){e.substring(0,t.length)!==t&&h.file.fail(new Error("Incorrectly eaten value: please report this warning on http://git.io/vg5Ft"),m())}(t),c.reset=a,a.test=s,c.test=s,e=e.substring(t.length),v(t),n=n(),c;function c(t,e){return o(function(t,e){var n=e?e.children:p,o=n[n.length-1];o&&t.type===o.type&&t.type in r&&i(o)&&i(t)&&(t=r[t.type].call(h,o,t));t!==o&&n.push(t);h.atStart&&0!==p.length&&h.exitStart();return t}(o(t),e),n)}function a(){var n=c.apply(null,arguments);return k=f.line,g=f.column,e=t+e,n}function s(){var n=o({});return k=f.line,g=f.column,e=t+e,n.position}}}};var r={text:function(t,e){return t.value+=e.value,t},blockquote:function(t,e){if(this.options.commonmark)return e;return t.children=t.children.concat(e.children),t}};function i(t){var e,n;return"text"!==t.type||!t.position||(e=t.position.start,n=t.position.end,e.line!==n.line||n.column-e.column===t.value.length)}},239:function(t,e,n){"use strict";var r=n(27),i=n(240),o=n(111);t.exports=function(t){var e,n,f=this.options;if(null==t)t={};else{if("object"!==typeof t)throw new Error("Invalid value `"+t+"` for setting `options`");t=r(t)}for(e in o){if(null==(n=t[e])&&(n=f[e]),"blocks"!==e&&"boolean"!==typeof n||"blocks"===e&&"object"!==typeof n)throw new Error("Invalid value `"+n+"` for setting `options."+e+"`");t[e]=n}return this.options=t,this.escape=i(t),this}},241:function(t){t.exports=["address","article","aside","base","basefont","blockquote","body","caption","center","col","colgroup","dd","details","dialog","dir","div","dl","dt","fieldset","figcaption","figure","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","iframe","legend","li","link","main","menu","menuitem","meta","nav","noframes","ol","optgroup","option","p","param","pre","section","source","title","summary","table","tbody","td","tfoot","th","thead","title","tr","track","ul"]},242:function(t,e,n){"use strict";var r=n(27),i=n(243);t.exports=function(){var t,e=String(this.file),n={line:1,column:1,offset:0},c=r(n);65279===(e=e.replace(f,o)).charCodeAt(0)&&(e=e.slice(1),c.column++,c.offset++);t={type:"root",children:this.tokenizeBlock(e,c),position:{start:n,end:this.eof||r(n)}},this.options.position||i(t,!0);return t};var o="\n",f=/\r\n|\r/g},246:function(t,e,n){"use strict";var r=n(21);t.exports=function(t,e,n){var i,o,f,c,a=e.charAt(0);if("\n"!==a)return;if(n)return!0;c=1,i=e.length,o=a,f="";for(;c<i&&(a=e.charAt(c),r(a));)f+=a,"\n"===a&&(o+=f,f=""),c++;t(o)}},247:function(t,e,n){"use strict";var r=n(89),i=n(90);t.exports=function(t,e,n){var r,s,l,h=-1,u=e.length,p="",d="",A="",k="";for(;++h<u;)if(r=e.charAt(h),l)if(l=!1,p+=A,d+=k,A="",k="",r===o)A=r,k=r;else for(p+=r,d+=r;++h<u;){if(!(r=e.charAt(h))||r===o){k=r,A=r;break}p+=r,d+=r}else if(r===c&&e.charAt(h+1)===r&&e.charAt(h+2)===r&&e.charAt(h+3)===r)A+=a,h+=3,l=!0;else if(r===f)A+=r,l=!0;else{for(s="";r===f||r===c;)s+=r,r=e.charAt(++h);if(r!==o)break;A+=s+r,k+=r}if(d)return!!n||t(p)({type:"code",lang:null,value:i(d)})};var o="\n",f="\t",c=" ",a=r(c,4)},248:function(t,e,n){"use strict";var r=n(90);t.exports=function(t,e,n){var h,u,p,d,A,k,g,v,m,x,b,y=this.options,w=e.length+1,z=0,O="";if(!y.gfm)return;for(;z<w&&((p=e.charAt(z))===f||p===o);)O+=p,z++;if(x=z,(p=e.charAt(z))!==c&&p!==a)return;z++,u=p,h=1,O+=p;for(;z<w&&(p=e.charAt(z))===u;)O+=p,h++,z++;if(h<s)return;for(;z<w&&((p=e.charAt(z))===f||p===o);)O+=p,z++;d="",A="";for(;z<w&&(p=e.charAt(z))!==i&&p!==c&&p!==a;)p===f||p===o?A+=p:(d+=A+p,A=""),z++;if((p=e.charAt(z))&&p!==i)return;if(n)return!0;(b=t.now()).column+=O.length,b.offset+=O.length,O+=d,d=this.decode.raw(this.unescape(d),b),A&&(O+=A);A="",v="",m="",k="",g="";for(;z<w;)if(p=e.charAt(z),k+=v,g+=m,v="",m="",p===i){for(k?(v+=p,m+=p):O+=p,A="",z++;z<w&&(p=e.charAt(z))===f;)A+=p,z++;if(v+=A,m+=A.slice(x),!(A.length>=l)){for(A="";z<w&&(p=e.charAt(z))===u;)A+=p,z++;if(v+=A,m+=A,!(A.length<h)){for(A="";z<w&&((p=e.charAt(z))===f||p===o);)v+=p,m+=p,z++;if(!p||p===i)break}}}else k+=p,m+=p,z++;return t(O+=k+v)({type:"code",lang:d||null,value:r(g)})};var i="\n",o="\t",f=" ",c="~",a="`",s=3,l=4},249:function(t,e,n){"use strict";var r=n(43),i=n(91);t.exports=function(t,e,n){var s,l,h,u,p,d,A,k,g,v=this.offset,m=this.blockTokenizers,x=this.interruptBlockquote,b=t.now(),y=b.line,w=e.length,z=[],O=[],L=[],I=0;for(;I<w&&((l=e.charAt(I))===c||l===f);)I++;if(e.charAt(I)!==a)return;if(n)return!0;I=0;for(;I<w;){for(u=e.indexOf(o,I),A=I,k=!1,-1===u&&(u=w);I<w&&((l=e.charAt(I))===c||l===f);)I++;if(e.charAt(I)===a?(I++,k=!0,e.charAt(I)===c&&I++):I=A,p=e.slice(I,u),!k&&!r(p)){I=A;break}if(!k&&(h=e.slice(I),i(x,m,this,[t,h,!0])))break;d=A===I?p:e.slice(A,u),L.push(I-A),z.push(d),O.push(p),I=u+1}I=-1,w=L.length,s=t(z.join(o));for(;++I<w;)v[y]=(v[y]||0)+L[I],y++;return g=this.enterBlock(),O=this.tokenizeBlock(O.join(o),b),g(),s({type:"blockquote",children:O})};var o="\n",f="\t",c=" ",a=">"},250:function(t,e,n){"use strict";t.exports=function(t,e,n){var a,s,l,h=this.options,u=e.length+1,p=-1,d=t.now(),A="",k="";for(;++p<u;){if((a=e.charAt(p))!==o&&a!==i){p--;break}A+=a}l=0;for(;++p<=u;){if((a=e.charAt(p))!==f){p--;break}A+=a,l++}if(l>c)return;if(!l||!h.pedantic&&e.charAt(p+1)===f)return;u=e.length+1,s="";for(;++p<u;){if((a=e.charAt(p))!==o&&a!==i){p--;break}s+=a}if(!h.pedantic&&0===s.length&&a&&a!==r)return;if(n)return!0;A+=s,s="",k="";for(;++p<u&&(a=e.charAt(p))&&a!==r;)if(a===o||a===i||a===f){for(;a===o||a===i;)s+=a,a=e.charAt(++p);for(;a===f;)s+=a,a=e.charAt(++p);for(;a===o||a===i;)s+=a,a=e.charAt(++p);p--}else k+=s+a,s="";return d.column+=A.length,d.offset+=A.length,t(A+=k+s)({type:"heading",depth:l,children:this.tokenizeInline(k,d)})};var r="\n",i="\t",o=" ",f="#",c=6},251:function(t,e,n){"use strict";t.exports=function(t,e,n){var l,h,u,p,d=-1,A=e.length+1,k="";for(;++d<A&&((l=e.charAt(d))===i||l===o);)k+=l;if(l!==f&&l!==a&&l!==c)return;h=l,k+=l,u=1,p="";for(;++d<A;)if((l=e.charAt(d))===h)u++,k+=p+h,p="";else{if(l!==o)return u>=s&&(!l||l===r)?(k+=p,!!n||t(k)({type:"thematicBreak"})):void 0;p+=l}};var r="\n",i="\t",o=" ",f="*",c="_",a="-",s=3},252:function(t,e,n){"use strict";var r=n(43),i=n(89),o=n(59),f=n(112),c=n(253),a=n(91);t.exports=function(t,e,n){var i,f,c,A,g,v,m,x,b,L,I,B,T,C,j,S,_,E,Z,q,H,$,M,R,P=this.options.commonmark,D=this.options.pedantic,F=this.blockTokenizers,J=this.interruptList,N=0,X=e.length,G=null,K=0;for(;N<X;){if((A=e.charAt(N))===d)K+=k-K%k;else{if(A!==u)break;K++}N++}if(K>=k)return;if(A=e.charAt(N),i=P?z:w,!0===y[A])g=A,c=!1;else{for(c=!0,f="";N<X&&(A=e.charAt(N),o(A));)f+=A,N++;if(A=e.charAt(N),!f||!0!==i[A])return;G=parseInt(f,10),g=A}if((A=e.charAt(++N))!==u&&A!==d)return;if(n)return!0;N=0,C=[],j=[],S=[];for(;N<X;){for(v=e.indexOf(p,N),m=N,x=!1,R=!1,-1===v&&(v=X),M=N+k,K=0;N<X;){if((A=e.charAt(N))===d)K+=k-K%k;else{if(A!==u)break;K++}N++}if(K>=k&&(R=!0),_&&K>=_.indent&&(R=!0),A=e.charAt(N),b=null,!R){if(!0===y[A])b=A,N++,K++;else{for(f="";N<X&&(A=e.charAt(N),o(A));)f+=A,N++;A=e.charAt(N),N++,f&&!0===i[A]&&(b=A,K+=f.length+1)}if(b)if((A=e.charAt(N))===d)K+=k-K%k,N++;else if(A===u){for(M=N+k;N<M&&e.charAt(N)===u;)N++,K++;N===M&&e.charAt(N)===u&&(N-=k-1,K-=k-1)}else A!==p&&""!==A&&(b=null)}if(b){if(!D&&g!==b)break;x=!0}else P||R||e.charAt(m)!==u?P&&_&&(R=K>=_.indent||K>k):R=!0,x=!1,N=m;if(I=e.slice(m,v),L=m===N?I:e.slice(N,v),(b===s||b===l||b===h)&&F.thematicBreak.call(this,t,I,!0))break;if(B=T,T=!r(L).length,R&&_)_.value=_.value.concat(S,I),j=j.concat(S,I),S=[];else if(x)0!==S.length&&(_.value.push(""),_.trail=S.concat()),_={value:[I],indent:K,trail:[]},C.push(_),j=j.concat(S,I),S=[];else if(T){if(B)break;S.push(I)}else{if(B)break;if(a(J,F,this,[t,I,!0]))break;_.value=_.value.concat(S,I),j=j.concat(S,I),S=[]}N=v+1}H=t(j.join(p)).reset({type:"list",ordered:c,start:G,loose:null,children:[]}),E=this.enterList(),Z=this.enterBlock(),q=!1,N=-1,X=C.length;for(;++N<X;)_=C[N].value.join(p),$=t.now(),(_=t(_)(O(this,_,$),H)).loose&&(q=!0),_=C[N].trail.join(p),N!==X-1&&(_+=p),t(_);return E(),Z(),H.loose=q,H};var s="*",l="_",h="-",u=" ",p="\n",d="\t",A="x",k=4,g=/\n\n(?!\s*$)/,v=/^\[([ \t]|x|X)][ \t]/,m=/^([ \t]*)([*+-]|\d+[.)])( {1,4}(?! )| |\t|$|(?=\n))([^\n]*)/,x=/^([ \t]*)([*+-]|\d+[.)])([ \t]+)/,b=/^( {1,4}|\t)?/gm,y={};y[s]=!0,y["+"]=!0,y[h]=!0;var w={".":!0},z={};function O(t,e,n){var r,i,o=t.offset,f=null;return e=(t.options.pedantic?L:I).apply(null,arguments),t.options.gfm&&(r=e.match(v))&&(i=r[0].length,f=r[1].toLowerCase()===A,o[n.line]+=i,e=e.slice(i)),{type:"listItem",loose:g.test(e)||e.charAt(e.length-1)===p,checked:f,children:t.tokenizeBlock(e,n)}}function L(t,e,n){var r=t.offset,i=n.line;return e=e.replace(x,o),i=n.line,e.replace(b,o);function o(t){return r[i]=(r[i]||0)+t.length,i++,""}}function I(t,e,n){var r,o,a,s,l,h,d,A=t.offset,k=n.line;for(s=(e=e.replace(m,function(t,e,n,f,c){o=e+n+f,a=c,Number(n)<10&&o.length%2===1&&(n=u+n);return(r=e+i(u,n.length)+f)+a})).split(p),(l=c(e,f(r).indent).split(p))[0]=a,A[k]=(A[k]||0)+o.length,k++,h=0,d=s.length;++h<d;)A[k]=(A[k]||0)+s[h].length-l[h].length,k++;return l.join(p)}z["."]=!0,z[")"]=!0},253:function(t,e,n){"use strict";var r=n(43),i=n(89),o=n(112);t.exports=function(t,e){var n,s,l,h,u=t.split(c),p=u.length+1,d=1/0,A=[];u.unshift(i(f,e)+"!");for(;p--;)if(s=o(u[p]),A[p]=s.stops,0!==r(u[p]).length){if(!s.indent){d=1/0;break}s.indent>0&&s.indent<d&&(d=s.indent)}if(d!==1/0)for(p=u.length;p--;){for(l=A[p],n=d;n&&!(n in l);)n--;h=0!==r(u[p]).length&&d&&n!==d?a:"",u[p]=h+u[p].slice(n in l?l[n]+1:0)}return u.shift(),u.join(c)};var f=" ",c="\n",a="\t"},254:function(t,e,n){"use strict";t.exports=function(t,e,n){var a,s,l,h,u,p=t.now(),d=e.length,A=-1,k="";for(;++A<d;){if((l=e.charAt(A))!==o||A>=f){A--;break}k+=l}a="",s="";for(;++A<d;){if((l=e.charAt(A))===r){A--;break}l===o||l===i?s+=l:(a+=s+l,s="")}if(p.column+=k.length,p.offset+=k.length,k+=a+s,l=e.charAt(++A),h=e.charAt(++A),l!==r||!c[h])return;k+=l,s=h,u=c[h];for(;++A<d;){if((l=e.charAt(A))!==h){if(l!==r)return;A--;break}s+=l}if(n)return!0;return t(k+s)({type:"heading",depth:u,children:this.tokenizeInline(a,p)})};var r="\n",i="\t",o=" ",f=3,c={};c["="]=1,c["-"]=2},255:function(t,e,n){"use strict";var r=n(113).openCloseTag;t.exports=function(t,e,n){var a,s,l,h,u,p,d,A=this.options.blocks,k=e.length,g=0,v=[[/^<(script|pre|style)(?=(\s|>|$))/i,/<\/(script|pre|style)>/i,!0],[/^<!--/,/-->/,!0],[/^<\?/,/\?>/,!0],[/^<![A-Za-z]/,/>/,!0],[/^<!\[CDATA\[/,/\]\]>/,!0],[new RegExp("^</?("+A.join("|")+")(?=(\\s|/?>|$))","i"),/^$/,!0],[new RegExp(r.source+"\\s*$"),/^$/,!1]];for(;g<k&&((h=e.charAt(g))===i||h===o);)g++;if(e.charAt(g)!==c)return;a=-1===(a=e.indexOf(f,g+1))?k:a,s=e.slice(g,a),l=-1,u=v.length;for(;++l<u;)if(v[l][0].test(s)){p=v[l];break}if(!p)return;if(n)return p[2];if(g=a,!p[1].test(s))for(;g<k;){if(a=-1===(a=e.indexOf(f,g+1))?k:a,s=e.slice(g+1,a),p[1].test(s)){s&&(g=a);break}g=a}return d=e.slice(0,g),t(d)({type:"html",value:d})};var i="\t",o=" ",f="\n",c="<"},256:function(t,e,n){"use strict";var r=n(21),i=n(92);t.exports=d,d.notInList=!0,d.notInBlock=!0;var o="\\",f="\n",c="\t",a=" ",s="[",l="]",h="^",u=":",p=/^( {4}|\t)?/gm;function d(t,e,n){var d,A,k,g,v,m,x,b,y,w,z,O,L=this.offset;if(this.options.footnotes){for(d=0,A=e.length,k="",g=t.now(),v=g.line;d<A&&(y=e.charAt(d),r(y));)k+=y,d++;if(e.charAt(d)===s&&e.charAt(d+1)===h){for(d=(k+=s+h).length,x="";d<A&&(y=e.charAt(d))!==l;)y===o&&(x+=y,d++,y=e.charAt(d)),x+=y,d++;if(x&&e.charAt(d)===l&&e.charAt(d+1)===u){if(n)return!0;for(w=i(x),d=(k+=x+l+u).length;d<A&&((y=e.charAt(d))===c||y===a);)k+=y,d++;for(g.column+=k.length,g.offset+=k.length,x="",m="",b="";d<A;){if((y=e.charAt(d))===f){for(b=y,d++;d<A&&(y=e.charAt(d))===f;)b+=y,d++;for(x+=b,b="";d<A&&(y=e.charAt(d))===a;)b+=y,d++;if(0===b.length)break;x+=b}x&&(m+=x,x=""),m+=y,d++}return k+=m,m=m.replace(p,function(t){return L[v]=(L[v]||0)+t.length,v++,""}),z=t(k),O=this.enterBlock(),m=this.tokenizeBlock(m,g),O(),z({type:"footnoteDefinition",identifier:w,children:m})}}}}},258:function(t,e,n){"use strict";var r=n(21),i=n(92);t.exports=v,v.notInList=!0,v.notInBlock=!0;var o='"',f="'",c="\\",a="\n",s="\t",l=" ",h="[",u="]",p="(",d=")",A=":",k="<",g=">";function v(t,e,n){for(var r,g,v,b,y,w,z,O,L=this.options.commonmark,I=0,B=e.length,T="";I<B&&((b=e.charAt(I))===l||b===s);)T+=b,I++;if((b=e.charAt(I))===h){for(I++,T+=b,v="";I<B&&(b=e.charAt(I))!==u;)b===c&&(v+=b,I++,b=e.charAt(I)),v+=b,I++;if(v&&e.charAt(I)===u&&e.charAt(I+1)===A){for(w=v,I=(T+=v+u+A).length,v="";I<B&&((b=e.charAt(I))===s||b===l||b===a);)T+=b,I++;if(v="",r=T,(b=e.charAt(I))===k){for(I++;I<B&&m(b=e.charAt(I));)v+=b,I++;if((b=e.charAt(I))===m.delimiter)T+=k+v+b,I++;else{if(L)return;I-=v.length+1,v=""}}if(!v){for(;I<B&&x(b=e.charAt(I));)v+=b,I++;T+=v}if(v){for(z=v,v="";I<B&&((b=e.charAt(I))===s||b===l||b===a);)v+=b,I++;if(y=null,(b=e.charAt(I))===o?y=o:b===f?y=f:b===p&&(y=d),y){if(!v)return;for(I=(T+=v+b).length,v="";I<B&&(b=e.charAt(I))!==y;){if(b===a){if(I++,(b=e.charAt(I))===a||b===y)return;v+=a}v+=b,I++}if((b=e.charAt(I))!==y)return;g=T,T+=v+b,I++,O=v,v=""}else v="",I=T.length;for(;I<B&&((b=e.charAt(I))===s||b===l);)T+=b,I++;return(b=e.charAt(I))&&b!==a?void 0:!!n||(r=t(r).test().end,z=this.decode.raw(this.unescape(z),r,{nonTerminated:!1}),O&&(g=t(g).test().end,O=this.decode.raw(this.unescape(O),g)),t(T)({type:"definition",identifier:i(w),title:O||null,url:z}))}}}}function m(t){return t!==g&&t!==h&&t!==u}function x(t){return t!==h&&t!==u&&!r(t)}m.delimiter=g},259:function(t,e,n){"use strict";var r=n(21);t.exports=function(t,e,n){var v,m,x,b,y,w,z,O,L,I,B,T,C,j,S,_,E,Z,q,H,$,M,R,P;if(!this.options.gfm)return;v=0,Z=0,w=e.length+1,z=[];for(;v<w;){if(M=e.indexOf(l,v),R=e.indexOf(c,v+1),-1===M&&(M=e.length),-1===R||R>M){if(Z<p)return;break}z.push(e.slice(v,M)),Z++,v=M+1}b=z.join(l),m=z.splice(1,1)[0]||[],v=0,w=m.length,Z--,x=!1,B=[];for(;v<w;){if((L=m.charAt(v))===c){if(I=null,!1===x){if(!1===P)return}else B.push(x),x=!1;P=!1}else if(L===f)I=!0,x=x||g;else if(L===a)x=x===d?A:I&&x===g?k:d;else if(!r(L))return;v++}!1!==x&&B.push(x);if(B.length<u)return;if(n)return!0;E=-1,H=[],$=t(b).reset({type:"table",align:B,children:H});for(;++E<Z;){for(q=z[E],y={type:"tableRow",children:[]},E&&t(l),t(q).reset(y,$),w=q.length+1,v=0,O="",T="",C=!0,j=null,S=null;v<w;)if((L=q.charAt(v))!==h&&L!==s){if(""===L||L===c)if(C)t(L);else{if(L&&S){O+=L,v++;continue}!T&&!L||C||(b=T,O.length>1&&(L?(b+=O.slice(0,O.length-1),O=O.charAt(O.length-1)):(b+=O,O="")),_=t.now(),t(b)({type:"tableCell",children:this.tokenizeInline(T,_)},y)),t(O+L),O="",T=""}else if(O&&(T+=O,O=""),T+=L,L===i&&v!==w-2&&(T+=q.charAt(v+1),v++),L===o){for(j=1;q.charAt(v+1)===L;)T+=L,v++,j++;S?j>=S&&(S=0):S=j}C=!1,v++}else T?O+=L:t(L),v++;E||t(l+m)}return $};var i="\\",o="`",f="-",c="|",a=":",s=" ",l="\n",h="\t",u=1,p=2,d="left",A="center",k="right",g=null},260:function(t,e,n){"use strict";var r=n(43),i=n(59),o=n(90),f=n(91);t.exports=function(t,e,n){var h,u,p,d,A,k=this.options,g=k.commonmark,v=k.gfm,m=this.blockTokenizers,x=this.interruptParagraph,b=e.indexOf(c),y=e.length;for(;b<y;){if(-1===b){b=y;break}if(e.charAt(b+1)===c)break;if(g){for(d=0,h=b+1;h<y;){if((p=e.charAt(h))===a){d=l;break}if(p!==s)break;d++,h++}if(d>=l){b=e.indexOf(c,b+1);continue}}if(u=e.slice(b+1),f(x,m,this,[t,u,!0]))break;if(m.list.call(this,t,u,!0)&&(this.inList||g||v&&!i(r.left(u).charAt(0))))break;if(h=b,-1!==(b=e.indexOf(c,b+1))&&""===r(e.slice(h,b))){b=h;break}}if(u=e.slice(0,b),""===r(u))return t(u),null;if(n)return!0;return A=t.now(),u=o(u),t(u)({type:"paragraph",children:this.tokenizeInline(u,A)})};var c="\n",a="\t",s=" ",l=4},261:function(t,e,n){"use strict";var r=n(262);function i(t,e,n){var r,i;if("\\"===e.charAt(0)&&(r=e.charAt(1),-1!==this.escape.indexOf(r)))return!!n||(i="\n"===r?{type:"break"}:{type:"text",value:r},t("\\"+r)(i))}t.exports=i,i.locator=r},262:function(t,e,n){"use strict";t.exports=function(t,e){return t.indexOf("\\",e)}},263:function(t,e,n){"use strict";var r=n(21),i=n(88),o=n(114);t.exports=u,u.locator=o,u.notInLink=!0;var f="<",c=">",a="@",s="/",l="mailto:",h=l.length;function u(t,e,n){var o,u,p,d,A,k,g,v,m,x,b;if(e.charAt(0)===f){for(this,o="",u=e.length,p=0,d="",k=!1,g="",p++,o=f;p<u&&(A=e.charAt(p),!(r(A)||A===c||A===a||":"===A&&e.charAt(p+1)===s));)d+=A,p++;if(d){if(g+=d,d="",g+=A=e.charAt(p),p++,A===a)k=!0;else{if(":"!==A||e.charAt(p+1)!==s)return;g+=s,p++}for(;p<u&&(A=e.charAt(p),!r(A)&&A!==c);)d+=A,p++;if(A=e.charAt(p),d&&A===c)return!!n||(m=g+=d,o+=g+A,(v=t.now()).column++,v.offset++,k&&(g.slice(0,h).toLowerCase()===l?(m=m.substr(h),v.column+=h,v.offset+=h):g=l+g),x=this.inlineTokenizers,this.inlineTokenizers={text:x.text},b=this.enterLink(),m=this.tokenizeInline(m,v),this.inlineTokenizers=x,b(),t(o)({type:"link",title:null,url:i(g,{nonTerminated:!1}),children:m}))}}}},264:function(t,e,n){"use strict";var r=n(88),i=n(21),o=n(265);t.exports=A,A.locator=o,A.notInLink=!0;var f="[",c="]",a="(",s=")",l="<",h="@",u="mailto:",p=["http://","https://",u],d=p.length;function A(t,e,n){var o,A,k,g,v,m,x,b,y,w,z,O;if(this.options.gfm){for(o="",g=-1,b=d;++g<b;)if(m=p[g],(x=e.slice(0,m.length)).toLowerCase()===m){o=x;break}if(o){for(g=o.length,b=e.length,y="",w=0;g<b&&(k=e.charAt(g),!i(k)&&k!==l)&&("."!==k&&","!==k&&":"!==k&&";"!==k&&'"'!==k&&"'"!==k&&")"!==k&&"]"!==k||(z=e.charAt(g+1))&&!i(z))&&(k!==a&&k!==f||w++,k!==s&&k!==c||!(--w<0));)y+=k,g++;if(y){if(A=o+=y,m===u){if(-1===(v=y.indexOf(h))||v===b-1)return;A=A.substr(u.length)}return!!n||(O=this.enterLink(),A=this.tokenizeInline(A,t.now()),O(),t(o)({type:"link",title:null,url:r(o,{nonTerminated:!1}),children:A}))}}}}},265:function(t,e,n){"use strict";t.exports=function(t,e){var n,i=r.length,o=-1,f=-1;if(!this.options.gfm)return-1;for(;++o<i;)-1!==(n=t.indexOf(r[o],e))&&(n<f||-1===f)&&(f=n);return f};var r=["https://","http://","mailto:"]},266:function(t,e,n){"use strict";var r=n(110),i=n(114),o=n(113).tag;t.exports=a,a.locator=i;var f=/^<a /i,c=/^<\/a>/i;function a(t,e,n){var i,a,s=e.length;if(!("<"!==e.charAt(0)||s<3)&&(i=e.charAt(1),(r(i)||"?"===i||"!"===i||"/"===i)&&(a=e.match(o))))return!!n||(a=a[0],!this.inLink&&f.test(a)?this.inLink=!0:this.inLink&&c.test(a)&&(this.inLink=!1),t(a)({type:"html",value:a}))}},267:function(t,e,n){"use strict";var r=n(21),i=n(115);t.exports=k,k.locator=i;var o={}.hasOwnProperty,f="\\",c="[",a="]",s="(",l=")",h="<",u=">",p="`",d={'"':'"',"'":"'"},A={};function k(t,e,n){var i,k,g,v,m,x,b,y,w,z,O,L,I,B,T,C,j,S,_,E="",Z=0,q=e.charAt(0),H=this.options.pedantic,$=this.options.commonmark,M=this.options.gfm;if("!"===q&&(w=!0,E=q,q=e.charAt(++Z)),q===c&&(w||!this.inLink)){for(E+=q,T="",Z++,L=e.length,B=0,(j=t.now()).column+=Z,j.offset+=Z;Z<L;){if(x=q=e.charAt(Z),q===p){for(k=1;e.charAt(Z+1)===p;)x+=q,Z++,k++;g?k>=g&&(g=0):g=k}else if(q===f)Z++,x+=e.charAt(Z);else if(g&&!M||q!==c){if((!g||M)&&q===a){if(!B){if(!H)for(;Z<L&&(q=e.charAt(Z+1),r(q));)x+=q,Z++;if(e.charAt(Z+1)!==s)return;x+=s,i=!0,Z++;break}B--}}else B++;T+=x,x="",Z++}if(i){for(z=T,E+=T+x,Z++;Z<L&&(q=e.charAt(Z),r(q));)E+=q,Z++;if(q=e.charAt(Z),y=$?A:d,T="",v=E,q===h){for(Z++,v+=h;Z<L&&(q=e.charAt(Z))!==u;){if($&&"\n"===q)return;T+=q,Z++}if(e.charAt(Z)!==u)return;E+=h+T+u,C=T,Z++}else{for(q=null,x="";Z<L&&(q=e.charAt(Z),!x||!o.call(y,q));){if(r(q)){if(!H)break;x+=q}else{if(q===s)B++;else if(q===l){if(0===B)break;B--}T+=x,x="",q===f&&(T+=f,q=e.charAt(++Z)),T+=q}Z++}C=T,Z=(E+=T).length}for(T="";Z<L&&(q=e.charAt(Z),r(q));)T+=q,Z++;if(q=e.charAt(Z),E+=T,T&&o.call(y,q))if(Z++,E+=q,T="",O=y[q],m=E,$){for(;Z<L&&(q=e.charAt(Z))!==O;)q===f&&(T+=f,q=e.charAt(++Z)),Z++,T+=q;if((q=e.charAt(Z))!==O)return;for(I=T,E+=T+q,Z++;Z<L&&(q=e.charAt(Z),r(q));)E+=q,Z++}else for(x="";Z<L;){if((q=e.charAt(Z))===O)b&&(T+=O+x,x=""),b=!0;else if(b){if(q===l){E+=T+O+x,I=T;break}r(q)?x+=q:(T+=O+x+q,x="",b=!1)}else T+=q;Z++}if(e.charAt(Z)===l)return!!n||(E+=l,C=this.decode.raw(this.unescape(C),t(v).test().end,{nonTerminated:!1}),I&&(m=t(m).test().end,I=this.decode.raw(this.unescape(I),m)),_={type:w?"image":"link",title:I||null,url:C},w?_.alt=this.decode.raw(this.unescape(z),j)||null:(S=this.enterLink(),_.children=this.tokenizeInline(z,j),S()),t(E)(_))}}}A['"']='"',A["'"]="'",A[s]=l},268:function(t,e,n){"use strict";var r=n(21),i=n(115),o=n(92);t.exports=k,k.locator=i;var f="link",c="image",a="footnote",s="shortcut",l="collapsed",h="full",u="^",p="\\",d="[",A="]";function k(t,e,n){var i,k,g,v,m,x,b,y,w=e.charAt(0),z=0,O=e.length,L="",I="",B=f,T=s;if("!"===w&&(B=c,I=w,w=e.charAt(++z)),w===d){if(z++,I+=w,x="",this.options.footnotes&&e.charAt(z)===u){if(B===c)return;I+=u,z++,B=a}for(y=0;z<O;){if((w=e.charAt(z))===d)b=!0,y++;else if(w===A){if(!y)break;y--}w===p&&(x+=p,w=e.charAt(++z)),x+=w,z++}if(L=x,i=x,(w=e.charAt(z))===A){for(z++,L+=w,x="";z<O&&(w=e.charAt(z),r(w));)x+=w,z++;if(w=e.charAt(z),B!==a&&w===d){for(k="",x+=w,z++;z<O&&(w=e.charAt(z))!==d&&w!==A;)w===p&&(k+=p,w=e.charAt(++z)),k+=w,z++;(w=e.charAt(z))===A?(T=k?h:l,x+=k+w,z++):k="",L+=x,x=""}else{if(!i)return;k=i}if(T===h||!b)return L=I+L,B===f&&this.inLink?null:!!n||(B===a&&-1!==i.indexOf(" ")?t(L)({type:"footnote",children:this.tokenizeInline(i,t.now())}):((g=t.now()).column+=I.length,g.offset+=I.length,v={type:B+"Reference",identifier:o(k=T===h?k:i)},B!==f&&B!==c||(v.referenceType=T),B===f?(m=this.enterLink(),v.children=this.tokenizeInline(i,g),m()):B===c&&(v.alt=this.decode.raw(this.unescape(i),g)||null),t(L)(v)))}}}},269:function(t,e,n){"use strict";var r=n(43),i=n(21),o=n(270);t.exports=a,a.locator=o;var f="*",c="_";function a(t,e,n){var o,a,s,l,h,u,p,d=0,A=e.charAt(d);if((A===f||A===c)&&e.charAt(++d)===A&&(a=this.options.pedantic,h=(s=A)+s,u=e.length,d++,l="",A="",!a||!i(e.charAt(d))))for(;d<u;){if(p=A,(A=e.charAt(d))===s&&e.charAt(d+1)===s&&(!a||!i(p))&&(A=e.charAt(d+2))!==s){if(!r(l))return;return!!n||((o=t.now()).column+=2,o.offset+=2,t(h+l+h)({type:"strong",children:this.tokenizeInline(l,o)}))}a||"\\"!==A||(l+=A,A=e.charAt(++d)),l+=A,d++}}},270:function(t,e,n){"use strict";t.exports=function(t,e){var n=t.indexOf("**",e),r=t.indexOf("__",e);if(-1===r)return n;if(-1===n)return r;return r<n?r:n}},271:function(t,e,n){"use strict";var r=n(43),i=n(272),o=n(21),f=n(273);t.exports=s,s.locator=f;var c="*",a="_";function s(t,e,n){var f,s,l,h,u,p,d,A=0,k=e.charAt(A);if((k===c||k===a)&&(s=this.options.pedantic,u=k,l=k,p=e.length,A++,h="",k="",!s||!o(e.charAt(A))))for(;A<p;){if(d=k,(k=e.charAt(A))===l&&(!s||!o(d))){if((k=e.charAt(++A))!==l){if(!r(h)||d===l)return;if(!s&&l===a&&i(k)){h+=l;continue}return!!n||((f=t.now()).column++,f.offset++,t(u+h+l)({type:"emphasis",children:this.tokenizeInline(h,f)}))}h+=l}s||"\\"!==k||(h+=k,k=e.charAt(++A)),h+=k,A++}}},273:function(t,e,n){"use strict";t.exports=function(t,e){var n=t.indexOf("*",e),r=t.indexOf("_",e);if(-1===r)return n;if(-1===n)return r;return r<n?r:n}},274:function(t,e,n){"use strict";var r=n(21),i=n(275);t.exports=c,c.locator=i;var o="~",f="~~";function c(t,e,n){var i,c,a,s="",l="",h="",u="";if(this.options.gfm&&e.charAt(0)===o&&e.charAt(1)===o&&!r(e.charAt(2)))for(i=1,c=e.length,(a=t.now()).column+=2,a.offset+=2;++i<c;){if((s=e.charAt(i))===o&&l===o&&(!h||!r(h)))return!!n||t(f+u+f)({type:"delete",children:this.tokenizeInline(u,a)});u+=l,h=l,l=s}}},275:function(t,e,n){"use strict";t.exports=function(t,e){return t.indexOf("~~",e)}},276:function(t,e,n){"use strict";var r=n(21),i=n(277);t.exports=f,f.locator=i;var o="`";function f(t,e,n){for(var i,f,c,a,s,l,h,u,p=e.length,d=0,A="",k="";d<p&&e.charAt(d)===o;)A+=o,d++;if(A){for(s=A,a=d,A="",u=e.charAt(d),c=0;d<p;){if(l=u,u=e.charAt(d+1),l===o?(c++,k+=l):(c=0,A+=l),c&&u!==o){if(c===a){s+=A+k,h=!0;break}A+=k,k=""}d++}if(!h){if(a%2!==0)return;A=""}if(n)return!0;for(i="",f="",p=A.length,d=-1;++d<p;)l=A.charAt(d),r(l)?f+=l:(f&&(i&&(i+=f),f=""),i+=l);return t(s)({type:"inlineCode",value:i})}}},277:function(t,e,n){"use strict";t.exports=function(t,e){return t.indexOf("`",e)}},278:function(t,e,n){"use strict";var r=n(279);t.exports=o,o.locator=r;var i=2;function o(t,e,n){for(var r,o=e.length,f=-1,c="";++f<o;){if("\n"===(r=e.charAt(f))){if(f<i)return;return!!n||t(c+=r)({type:"break"})}if(" "!==r)return;c+=r}}},279:function(t,e,n){"use strict";t.exports=function(t,e){var n=t.indexOf("\n",e);for(;n>e&&" "===t.charAt(n-1);)n--;return n}},280:function(t,e,n){"use strict";t.exports=function(t,e,n){var r,i,o,f,c,a,s,l,h,u;if(n)return!0;r=this.inlineMethods,f=r.length,i=this.inlineTokenizers,o=-1,h=e.length;for(;++o<f;)"text"!==(l=r[o])&&i[l]&&((s=i[l].locator)||t.file.fail("Missing locator: `"+l+"`"),-1!==(a=s.call(this,e,1))&&a<h&&(h=a));c=e.slice(0,h),u=t.now(),this.decode(c,u,function(e,n,r){t(r||e)({type:"text",value:e})})}},91:function(t,e,n){"use strict";t.exports=function(t,e,n,r){var i,o,f,c,a,s,l=["pedantic","commonmark"],h=l.length,u=t.length,p=-1;for(;++p<u;){for(i=t[p],o=i[1]||{},f=i[0],c=-1,s=!1;++c<h;)if(void 0!==o[a=l[c]]&&o[a]!==n.options[a]){s=!0;break}if(!s&&e[f].apply(n,r))return!0}return!1}},92:function(t,e,n){"use strict";var r=n(257);t.exports=function(t){return r(t).toLowerCase()}}}]);