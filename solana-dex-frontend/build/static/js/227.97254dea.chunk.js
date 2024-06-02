(self.webpackChunksolana_dex_frontend=self.webpackChunksolana_dex_frontend||[]).push([[227],{4227:(e,t,n)=>{"use strict";n.r(t),n.d(t,{StandardSolflareMetaMaskWalletAccount:()=>I,default:()=>H});var r=n(6782);const i=n(5036);var s=n(7059),o=n.n(s);const a={randomUUID:"undefined"!==typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let c;const l=new Uint8Array(16);function d(){if(!c&&(c="undefined"!==typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!c))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return c(l)}const h=[];for(let O=0;O<256;++O)h.push((O+256).toString(16).slice(1));function u(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return h[e[t+0]]+h[e[t+1]]+h[e[t+2]]+h[e[t+3]]+"-"+h[e[t+4]]+h[e[t+5]]+"-"+h[e[t+6]]+h[e[t+7]]+"-"+h[e[t+8]]+h[e[t+9]]+"-"+h[e[t+10]]+h[e[t+11]]+h[e[t+12]]+h[e[t+13]]+h[e[t+14]]+h[e[t+15]]}const f=function(e,t,n){if(a.randomUUID&&!t&&!e)return a.randomUUID();const r=(e=e||{}).random||(e.rng||d)();if(r[6]=15&r[6]|64,r[8]=63&r[8]|128,t){n=n||0;for(let e=0;e<16;++e)t[n+e]=r[e];return t}return u(r)};n(6382).Buffer;function v(e){return void 0===e.version}function m(e){return v(e)?e.serialize({verifySignatures:!1,requireAllSignatures:!1}):e.serialize()}var p=function(e,t,n,r){return new(n||(n=Promise))((function(i,s){function o(e){try{c(r.next(e))}catch(t){s(t)}}function a(e){try{c(r.throw(e))}catch(t){s(t)}}function c(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,a)}c((r=r.apply(e,t||[])).next())}))};function g(e){return p(this,void 0,void 0,(function*(){try{return yield e.request({method:"wallet_getSnaps"}),!0}catch(t){return!1}}))}var y=n(5007),_=n(8780),w=n(991);const b=["solana:mainnet","solana:devnet","solana:testnet","solana:localnet"];function E(e){return b.includes(e)}var A,x,M,T,C,S,k=function(e,t,n,r){if("a"===n&&!r)throw new TypeError("Private accessor was defined without a getter");if("function"===typeof t?e!==t||!r:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===n?r:"a"===n?r.call(e):r?r.value:t.get(e)},U=function(e,t,n,r,i){if("m"===r)throw new TypeError("Private method is not writable");if("a"===r&&!i)throw new TypeError("Private accessor was defined without a setter");if("function"===typeof t?e!==t||!i:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===r?i.call(e,n):i?i.value=n:t.set(e,n),n};const j=b,K=[y.R,_.q,w.F];class I{get address(){return k(this,A,"f")}get publicKey(){return k(this,x,"f").slice()}get chains(){return k(this,M,"f").slice()}get features(){return k(this,T,"f").slice()}get label(){return k(this,C,"f")}get icon(){return k(this,S,"f")}constructor(e){let{address:t,publicKey:n,label:r,icon:i}=e;A.set(this,void 0),x.set(this,void 0),M.set(this,void 0),T.set(this,void 0),C.set(this,void 0),S.set(this,void 0),new.target===I&&Object.freeze(this),U(this,A,t,"f"),U(this,x,n,"f"),U(this,M,j,"f"),U(this,T,K,"f"),U(this,C,r,"f"),U(this,S,i,"f")}}A=new WeakMap,x=new WeakMap,M=new WeakMap,T=new WeakMap,C=new WeakMap,S=new WeakMap;var P=function(e,t,n,r){return new(n||(n=Promise))((function(i,s){function o(e){try{c(r.next(e))}catch(t){s(t)}}function a(e){try{c(r.throw(e))}catch(t){s(t)}}function c(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,a)}c((r=r.apply(e,t||[])).next())}))};class z extends i{constructor(e){super(),this._network="mainnet-beta",this._iframeParams={},this._element=null,this._iframe=null,this._publicKey=null,this._account=null,this._isConnected=!1,this._connectHandler=null,this._messageHandlers={},this._handleEvent=e=>{var t,n;switch(e.type){case"connect":return this._collapseIframe(),void((null===(t=e.data)||void 0===t?void 0:t.publicKey)?(this._publicKey=e.data.publicKey,this._isConnected=!0,this._connectHandler&&(this._connectHandler.resolve(),this._connectHandler=null),this._connected()):(this._connectHandler&&(this._connectHandler.reject(),this._connectHandler=null),this._disconnected()));case"disconnect":return this._connectHandler&&(this._connectHandler.reject(),this._connectHandler=null),void this._disconnected();case"accountChanged":return void((null===(n=e.data)||void 0===n?void 0:n.publicKey)?(this._publicKey=e.data.publicKey,this.emit("accountChanged",this.publicKey),this._standardConnected()):(this.emit("accountChanged",void 0),this._standardDisconnected()));default:return}},this._handleResize=e=>{"full"===e.resizeMode?"fullscreen"===e.params.mode?this._expandIframe():"hide"===e.params.mode&&this._collapseIframe():"coordinates"===e.resizeMode&&this._resizeIframe(e.params)},this._handleMessage=e=>{var t;if("solflareIframeToWalletAdapter"!==(null===(t=e.data)||void 0===t?void 0:t.channel))return;const n=e.data.data||{};if("event"===n.type)this._handleEvent(n.event);else if("resize"===n.type)this._handleResize(n);else if("response"===n.type&&this._messageHandlers[n.id]){const{resolve:e,reject:t}=this._messageHandlers[n.id];delete this._messageHandlers[n.id],n.error?t(n.error):e(n.result)}},this._removeElement=()=>{this._element&&(this._element.remove(),this._element=null)},this._removeDanglingElements=()=>{const e=document.getElementsByClassName("solflare-metamask-wallet-adapter-iframe");for(const t of e)t.parentElement&&t.remove()},this._injectElement=()=>{this._removeElement(),this._removeDanglingElements();const e=Object.assign(Object.assign({},this._iframeParams),{mm:!0,v:1,cluster:this._network||"mainnet-beta",origin:window.location.origin||"",title:document.title||""}),t=Object.keys(e).map((t=>"".concat(t,"=").concat(encodeURIComponent(e[t])))).join("&"),n="".concat(z.IFRAME_URL,"?").concat(t);this._element=document.createElement("div"),this._element.className="solflare-metamask-wallet-adapter-iframe",this._element.innerHTML="\n      <iframe src='".concat(n,"' style='position: fixed; top: 0; bottom: 0; left: 0; right: 0; width: 100%; height: 100%; border: none; border-radius: 0; z-index: 99999; color-scheme: auto;' allowtransparency='true'></iframe>\n    "),document.body.appendChild(this._element),this._iframe=this._element.querySelector("iframe"),window.addEventListener("message",this._handleMessage,!1)},this._collapseIframe=()=>{this._iframe&&(this._iframe.style.top="",this._iframe.style.right="",this._iframe.style.height="2px",this._iframe.style.width="2px")},this._expandIframe=()=>{this._iframe&&(this._iframe.style.top="0px",this._iframe.style.bottom="0px",this._iframe.style.left="0px",this._iframe.style.right="0px",this._iframe.style.width="100%",this._iframe.style.height="100%")},this._resizeIframe=e=>{this._iframe&&(this._iframe.style.top=isFinite(e.top)?"".concat(e.top,"px"):"",this._iframe.style.bottom=isFinite(e.bottom)?"".concat(e.bottom,"px"):"",this._iframe.style.left=isFinite(e.left)?"".concat(e.left,"px"):"",this._iframe.style.right=isFinite(e.right)?"".concat(e.right,"px"):"",this._iframe.style.width=isFinite(e.width)?"".concat(e.width,"px"):e.width,this._iframe.style.height=isFinite(e.height)?"".concat(e.height,"px"):e.height)},this._sendIframeMessage=e=>{if(!this.connected||!this.publicKey)throw new Error("Wallet not connected");return new Promise(((t,n)=>{var r,i;const s=f();this._messageHandlers[s]={resolve:t,reject:n},null===(i=null===(r=this._iframe)||void 0===r?void 0:r.contentWindow)||void 0===i||i.postMessage({channel:"solflareWalletAdapterToIframe",data:Object.assign({id:s},e)},"*")}))},this._connected=()=>{this._isConnected=!0,this.emit("connect",this.publicKey),this._standardConnected()},this._disconnected=()=>{this._publicKey=null,this._isConnected=!1,window.removeEventListener("message",this._handleMessage,!1),this._removeElement(),this.emit("disconnect"),this._standardDisconnected()},this._standardConnected=()=>{if(!this.publicKey)return;const e=this.publicKey.toString();this._account&&this._account.address===e||(this._account=new I({address:e,publicKey:this.publicKey.toBytes()}),this.emit("standard_change",{accounts:this.standardAccounts}))},this._standardDisconnected=()=>{this._account&&(this._account=null,this.emit("standard_change",{accounts:this.standardAccounts}))},(null===e||void 0===e?void 0:e.network)&&(this._network=null===e||void 0===e?void 0:e.network),window.SolflareMetaMaskParams&&(this._iframeParams=Object.assign(Object.assign({},this._iframeParams),window.SolflareMetaMaskParams)),(null===e||void 0===e?void 0:e.params)&&(this._iframeParams=Object.assign(Object.assign({},this._iframeParams),null===e||void 0===e?void 0:e.params))}get publicKey(){return this._publicKey?new r.PublicKey(this._publicKey):null}get standardAccount(){return this._account}get standardAccounts(){return this._account?[this._account]:[]}get isConnected(){return this._isConnected}get connected(){return this.isConnected}get autoApprove(){return!1}connect(){return P(this,void 0,void 0,(function*(){this.connected||(this._injectElement(),yield new Promise(((e,t)=>{this._connectHandler={resolve:e,reject:t}})))}))}disconnect(){return P(this,void 0,void 0,(function*(){yield this._sendIframeMessage({method:"disconnect"}),this._disconnected()}))}signTransaction(e){var t;return P(this,void 0,void 0,(function*(){if(!this.connected||!this.publicKey)throw new Error("Wallet not connected");try{const t=m(e),n=yield this._sendIframeMessage({method:"signTransactionV2",params:{transaction:o().encode(t)}}),{transaction:i}=n;return v(e)?r.Transaction.from(o().decode(i)):r.VersionedTransaction.deserialize(o().decode(i))}catch(n){throw new Error((null===(t=null===n||void 0===n?void 0:n.toString)||void 0===t?void 0:t.call(n))||"Failed to sign transaction")}}))}signAllTransactions(e){var t;return P(this,void 0,void 0,(function*(){if(!this.connected||!this.publicKey)throw new Error("Wallet not connected");try{const t=e.map((e=>m(e))),{transactions:n}=yield this._sendIframeMessage({method:"signAllTransactionsV2",params:{transactions:t.map((e=>o().encode(e)))}});return n.map(((t,n)=>v(e[n])?r.Transaction.from(o().decode(t)):r.VersionedTransaction.deserialize(o().decode(t))))}catch(n){throw new Error((null===(t=null===n||void 0===n?void 0:n.toString)||void 0===t?void 0:t.call(n))||"Failed to sign transactions")}}))}signAndSendTransaction(e,t){var n;return P(this,void 0,void 0,(function*(){if(!this.connected||!this.publicKey)throw new Error("Wallet not connected");try{const n=m(e),{signature:r}=yield this._sendIframeMessage({method:"signAndSendTransaction",params:{transaction:o().encode(n),options:t}});return r}catch(r){throw new Error((null===(n=null===r||void 0===r?void 0:r.toString)||void 0===n?void 0:n.call(r))||"Failed to sign and send transaction")}}))}signMessage(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"utf8";var n;return P(this,void 0,void 0,(function*(){if(!this.connected||!this.publicKey)throw new Error("Wallet not connected");try{const{signature:n}=yield this._sendIframeMessage({method:"signMessage",params:{data:o().encode(e),display:t}});return Uint8Array.from(o().decode(n))}catch(r){throw new Error((null===(n=null===r||void 0===r?void 0:r.toString)||void 0===n?void 0:n.call(r))||"Failed to sign message")}}))}sign(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"utf8";return P(this,void 0,void 0,(function*(){return yield this.signMessage(e,t)}))}static isSupported(){return P(this,void 0,void 0,(function*(){return!!(yield function(){return p(this,void 0,void 0,(function*(){try{const e=window.ethereum;if(!e)return null;if(e.providers&&Array.isArray(e.providers)){const t=e.providers;for(const e of t)if(yield g(e))return e}if(e.detected&&Array.isArray(e.detected)){const t=e.detected;for(const e of t)if(yield g(e))return e}return(yield g(e))?e:null}catch(e){return console.error(e),null}}))}())}))}standardSignAndSendTransaction(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return P(this,void 0,void 0,(function*(){if(!this.connected)throw new Error("not connected");const e=[];if(1===t.length){const{transaction:n,account:i,chain:s,options:a}=t[0],{minContextSlot:c,preflightCommitment:l,skipPreflight:d,maxRetries:h}=a||{};if(i!==this._account)throw new Error("invalid account");if(!E(s))throw new Error("invalid chain");const u=yield this.signAndSendTransaction(r.VersionedTransaction.deserialize(n),{preflightCommitment:l,minContextSlot:c,maxRetries:h,skipPreflight:d});e.push({signature:o().decode(u)})}else if(t.length>1)for(const n of t)e.push(...yield this.standardSignAndSendTransaction(n));return e}))}standardSignTransaction(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return P(this,void 0,void 0,(function*(){if(!this.connected)throw new Error("not connected");const e=[];if(1===t.length){const{transaction:n,account:i,chain:s}=t[0];if(i!==this._account)throw new Error("invalid account");if(s&&!E(s))throw new Error("invalid chain");const o=yield this.signTransaction(r.VersionedTransaction.deserialize(n));e.push({signedTransaction:o.serialize()})}else if(t.length>1){let n;for(const e of t){if(e.account!==this._account)throw new Error("invalid account");if(e.chain){if(!E(e.chain))throw new Error("invalid chain");if(n){if(e.chain!==n)throw new Error("conflicting chain")}else n=e.chain}}const i=t.map((e=>{let{transaction:t}=e;return r.VersionedTransaction.deserialize(t)})),s=yield this.signAllTransactions(i);e.push(...s.map((e=>({signedTransaction:e.serialize()}))))}return e}))}standardSignMessage(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return P(this,void 0,void 0,(function*(){if(!this.connected)throw new Error("not connected");const e=[];if(1===t.length){const{message:n,account:r}=t[0];if(r!==this._account)throw new Error("invalid account");const i=yield this.signMessage(n);e.push({signedMessage:n,signature:i})}else if(t.length>1)for(const n of t)e.push(...yield this.standardSignMessage(n));return e}))}}z.IFRAME_URL="https://widget.solflare.com/";const H=z},6588:e=>{"use strict";e.exports=function(e){if(e.length>=255)throw new TypeError("Alphabet too long");for(var t=new Uint8Array(256),n=0;n<t.length;n++)t[n]=255;for(var r=0;r<e.length;r++){var i=e.charAt(r),s=i.charCodeAt(0);if(255!==t[s])throw new TypeError(i+" is ambiguous");t[s]=r}var o=e.length,a=e.charAt(0),c=Math.log(o)/Math.log(256),l=Math.log(256)/Math.log(o);function d(e){if("string"!==typeof e)throw new TypeError("Expected String");if(0===e.length)return new Uint8Array;for(var n=0,r=0,i=0;e[n]===a;)r++,n++;for(var s=(e.length-n)*c+1>>>0,l=new Uint8Array(s);e[n];){var d=t[e.charCodeAt(n)];if(255===d)return;for(var h=0,u=s-1;(0!==d||h<i)&&-1!==u;u--,h++)d+=o*l[u]>>>0,l[u]=d%256>>>0,d=d/256>>>0;if(0!==d)throw new Error("Non-zero carry");i=h,n++}for(var f=s-i;f!==s&&0===l[f];)f++;for(var v=new Uint8Array(r+(s-f)),m=r;f!==s;)v[m++]=l[f++];return v}return{encode:function(t){if(t instanceof Uint8Array||(ArrayBuffer.isView(t)?t=new Uint8Array(t.buffer,t.byteOffset,t.byteLength):Array.isArray(t)&&(t=Uint8Array.from(t))),!(t instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(0===t.length)return"";for(var n=0,r=0,i=0,s=t.length;i!==s&&0===t[i];)i++,n++;for(var c=(s-i)*l+1>>>0,d=new Uint8Array(c);i!==s;){for(var h=t[i],u=0,f=c-1;(0!==h||u<r)&&-1!==f;f--,u++)h+=256*d[f]>>>0,d[f]=h%o>>>0,h=h/o>>>0;if(0!==h)throw new Error("Non-zero carry");r=u,i++}for(var v=c-r;v!==c&&0===d[v];)v++;for(var m=a.repeat(n);v<c;++v)m+=e.charAt(d[v]);return m},decodeUnsafe:d,decode:function(e){var t=d(e);if(t)return t;throw new Error("Non-base"+o+" character")}}}},7059:(e,t,n)=>{const r=n(6588);e.exports=r("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")},5036:e=>{"use strict";var t=Object.prototype.hasOwnProperty,n="~";function r(){}function i(e,t,n){this.fn=e,this.context=t,this.once=n||!1}function s(e,t,r,s,o){if("function"!==typeof r)throw new TypeError("The listener must be a function");var a=new i(r,s||e,o),c=n?n+t:t;return e._events[c]?e._events[c].fn?e._events[c]=[e._events[c],a]:e._events[c].push(a):(e._events[c]=a,e._eventsCount++),e}function o(e,t){0===--e._eventsCount?e._events=new r:delete e._events[t]}function a(){this._events=new r,this._eventsCount=0}Object.create&&(r.prototype=Object.create(null),(new r).__proto__||(n=!1)),a.prototype.eventNames=function(){var e,r,i=[];if(0===this._eventsCount)return i;for(r in e=this._events)t.call(e,r)&&i.push(n?r.slice(1):r);return Object.getOwnPropertySymbols?i.concat(Object.getOwnPropertySymbols(e)):i},a.prototype.listeners=function(e){var t=n?n+e:e,r=this._events[t];if(!r)return[];if(r.fn)return[r.fn];for(var i=0,s=r.length,o=new Array(s);i<s;i++)o[i]=r[i].fn;return o},a.prototype.listenerCount=function(e){var t=n?n+e:e,r=this._events[t];return r?r.fn?1:r.length:0},a.prototype.emit=function(e,t,r,i,s,o){var a=n?n+e:e;if(!this._events[a])return!1;var c,l,d=this._events[a],h=arguments.length;if(d.fn){switch(d.once&&this.removeListener(e,d.fn,void 0,!0),h){case 1:return d.fn.call(d.context),!0;case 2:return d.fn.call(d.context,t),!0;case 3:return d.fn.call(d.context,t,r),!0;case 4:return d.fn.call(d.context,t,r,i),!0;case 5:return d.fn.call(d.context,t,r,i,s),!0;case 6:return d.fn.call(d.context,t,r,i,s,o),!0}for(l=1,c=new Array(h-1);l<h;l++)c[l-1]=arguments[l];d.fn.apply(d.context,c)}else{var u,f=d.length;for(l=0;l<f;l++)switch(d[l].once&&this.removeListener(e,d[l].fn,void 0,!0),h){case 1:d[l].fn.call(d[l].context);break;case 2:d[l].fn.call(d[l].context,t);break;case 3:d[l].fn.call(d[l].context,t,r);break;case 4:d[l].fn.call(d[l].context,t,r,i);break;default:if(!c)for(u=1,c=new Array(h-1);u<h;u++)c[u-1]=arguments[u];d[l].fn.apply(d[l].context,c)}}return!0},a.prototype.on=function(e,t,n){return s(this,e,t,n,!1)},a.prototype.once=function(e,t,n){return s(this,e,t,n,!0)},a.prototype.removeListener=function(e,t,r,i){var s=n?n+e:e;if(!this._events[s])return this;if(!t)return o(this,s),this;var a=this._events[s];if(a.fn)a.fn!==t||i&&!a.once||r&&a.context!==r||o(this,s);else{for(var c=0,l=[],d=a.length;c<d;c++)(a[c].fn!==t||i&&!a[c].once||r&&a[c].context!==r)&&l.push(a[c]);l.length?this._events[s]=1===l.length?l[0]:l:o(this,s)}return this},a.prototype.removeAllListeners=function(e){var t;return e?(t=n?n+e:e,this._events[t]&&o(this,t)):(this._events=new r,this._eventsCount=0),this},a.prototype.off=a.prototype.removeListener,a.prototype.addListener=a.prototype.on,a.prefixed=n,a.EventEmitter=a,e.exports=a}}]);
//# sourceMappingURL=227.97254dea.chunk.js.map