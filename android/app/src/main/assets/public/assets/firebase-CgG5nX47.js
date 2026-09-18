var cI=Object.defineProperty;var BI=(r,e,t)=>e in r?cI(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var q=(r,e,t)=>BI(r,typeof e!="symbol"?e+"":e,t);const lI=()=>{};var Jd={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yp=function(r){const e=[];let t=0;for(let n=0;n<r.length;n++){let s=r.charCodeAt(n);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(r.charCodeAt(++n)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},hI=function(r){const e=[];let t=0,n=0;for(;t<r.length;){const s=r[t++];if(s<128)e[n++]=String.fromCharCode(s);else if(s>191&&s<224){const i=r[t++];e[n++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=r[t++],o=r[t++],a=r[t++],u=((s&7)<<18|(i&63)<<12|(o&63)<<6|a&63)-65536;e[n++]=String.fromCharCode(55296+(u>>10)),e[n++]=String.fromCharCode(56320+(u&1023))}else{const i=r[t++],o=r[t++];e[n++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},wp={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let s=0;s<r.length;s+=3){const i=r[s],o=s+1<r.length,a=o?r[s+1]:0,u=s+2<r.length,B=u?r[s+2]:0,l=i>>2,d=(i&3)<<4|a>>4;let C=(a&15)<<2|B>>6,m=B&63;u||(m=64,o||(C=64)),n.push(t[l],t[d],t[C],t[m])}return n.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(yp(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):hI(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let s=0;s<r.length;){const i=t[r.charAt(s++)],a=s<r.length?t[r.charAt(s)]:0;++s;const B=s<r.length?t[r.charAt(s)]:64;++s;const d=s<r.length?t[r.charAt(s)]:64;if(++s,i==null||a==null||B==null||d==null)throw new dI;const C=i<<2|a>>4;if(n.push(C),B!==64){const m=a<<4&240|B>>2;if(n.push(m),d!==64){const y=B<<6&192|d;n.push(y)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class dI extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const fI=function(r){const e=yp(r);return wp.encodeByteArray(e,!0)},uu=function(r){return fI(r).replace(/\./g,"")},Tp=function(r){try{return wp.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ap(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const CI=()=>Ap().__FIREBASE_DEFAULTS__,pI=()=>{if(typeof process>"u"||typeof Jd>"u")return;const r=Jd.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},gI=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&Tp(r[1]);return e&&JSON.parse(e)},xu=()=>{try{return lI()||CI()||pI()||gI()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},Rp=r=>{var e,t;return(t=(e=xu())==null?void 0:e.emulatorHosts)==null?void 0:t[r]},mI=r=>{const e=Rp(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const n=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),n]:[e.substring(0,t),n]},vp=()=>{var r;return(r=xu())==null?void 0:r.config},Pp=r=>{var e;return(e=xu())==null?void 0:e[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bp{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,n))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _I(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},n=e||"demo-project",s=r.iat||0,i=r.sub||r.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${n}`,aud:n,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...r};return[uu(JSON.stringify(t)),uu(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function We(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function EI(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(We())}function Sp(){var e;const r=(e=xu())==null?void 0:e.forceEnvironment;if(r==="node")return!0;if(r==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function II(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function DI(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function yI(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function wI(){const r=We();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function Np(){return!Sp()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Op(){return!Sp()&&!!navigator.userAgent&&(navigator.userAgent.includes("Safari")||navigator.userAgent.includes("WebKit"))&&!navigator.userAgent.includes("Chrome")}function Fp(){try{return typeof indexedDB=="object"}catch{return!1}}function TI(){return new Promise((r,e)=>{try{let t=!0;const n="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(n);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(n),r(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var i;e(((i=s.error)==null?void 0:i.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const AI="FirebaseError";class fn extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name=AI,Object.setPrototypeOf(this,fn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,qo.prototype.create)}}class qo{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?RI(i,n):"Error",a=`${this.serviceName}: ${o} (${s}).`;return new fn(s,a,n)}}function RI(r,e){try{let t=0,n="";for(;t<r.length;){const s=r.indexOf("{$",t);if(s===-1){n+=r.substring(t);break}const i=r.indexOf("}",s+2);if(i===-1){n+=r.substring(t);break}const o=r.substring(s+2,i),a=e[o];n+=r.substring(t,s)+(a!=null?String(a):`<${o}?>`),t=i+1}return n}catch{return r}}function vI(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function An(r,e){if(r===e)return!0;const t=Object.keys(r),n=Object.keys(e);for(const s of t){if(!n.includes(s))return!1;const i=r[s],o=e[s];if(zd(i)&&zd(o)){if(!An(i,o))return!1}else if(i!==o)return!1}for(const s of n)if(!t.includes(s))return!1;return!0}function zd(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function li(r){const e=[];for(const[t,n]of Object.entries(r))Array.isArray(n)?n.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(n));return e.length?"&"+e.join("&"):""}function Wi(r){const e={};return r.replace(/^\?/,"").split("&").forEach(n=>{if(n){const[s,i]=n.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function $i(r){const e=r.indexOf("?");if(!e)return"";const t=r.indexOf("#",e);return r.substring(e,t>0?t:void 0)}function PI(r,e){const t=new bI(r,e);return t.subscribe.bind(t)}class bI{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(n=>{this.error(n)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let s;if(e===void 0&&t===void 0&&n===void 0)throw new Error("Missing Observer.");SI(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:n},s.next===void 0&&(s.next=Wc),s.error===void 0&&(s.error=Wc),s.complete===void 0&&(s.complete=Wc);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function SI(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function Wc(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ae(r){return r&&r._delegate?r._delegate:r}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cs(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}async function ol(r){return(await fetch(r,{credentials:"include"})).ok}class Cr{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fr="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class NI{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const n=new bp;if(this.instancesDeferred.set(t,n),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&n.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),n=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(n)return null;throw s}else{if(n)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(FI(e))try{this.getOrInitializeService({instanceIdentifier:Fr})}catch{}for(const[t,n]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:s});n.resolve(i)}catch{}}}}clearInstance(e=Fr){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Fr){return this.instances.has(e)}getOptions(e=Fr){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[i,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(i);n===a&&o.resolve(s)}return s}onInit(e,t){const n=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(n)??new Set;s.add(e),this.onInitCallbacks.set(n,s);const i=this.instances.get(n);return i&&e(i,n),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const s of n)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:OI(e),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}return n||null}normalizeInstanceIdentifier(e=Fr){return this.component?this.component.multipleInstances?e:Fr:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function OI(r){return r===Fr?void 0:r}function FI(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LI{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new NI(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var de;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(de||(de={}));const kI={debug:de.DEBUG,verbose:de.VERBOSE,info:de.INFO,warn:de.WARN,error:de.ERROR,silent:de.SILENT},xI=de.INFO,VI={[de.DEBUG]:"log",[de.VERBOSE]:"log",[de.INFO]:"info",[de.WARN]:"warn",[de.ERROR]:"error"},MI=(r,e,...t)=>{if(e<r.logLevel)return;const n=new Date().toISOString(),s=VI[e];if(s)console[s](`[${n}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class al{constructor(e){this.name=e,this._logLevel=xI,this._logHandler=MI,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in de))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?kI[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,de.DEBUG,...e),this._logHandler(this,de.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,de.VERBOSE,...e),this._logHandler(this,de.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,de.INFO,...e),this._logHandler(this,de.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,de.WARN,...e),this._logHandler(this,de.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,de.ERROR,...e),this._logHandler(this,de.ERROR,...e)}}const GI=(r,e)=>e.some(t=>r instanceof t);let Qd,Wd;function UI(){return Qd||(Qd=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function HI(){return Wd||(Wd=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Lp=new WeakMap,EB=new WeakMap,kp=new WeakMap,$c=new WeakMap,ul=new WeakMap;function qI(r){const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("success",i),r.removeEventListener("error",o)},i=()=>{t(ur(r.result)),s()},o=()=>{n(r.error),s()};r.addEventListener("success",i),r.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&Lp.set(t,r)}).catch(()=>{}),ul.set(e,r),e}function jI(r){if(EB.has(r))return;const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("complete",i),r.removeEventListener("error",o),r.removeEventListener("abort",o)},i=()=>{t(),s()},o=()=>{n(r.error||new DOMException("AbortError","AbortError")),s()};r.addEventListener("complete",i),r.addEventListener("error",o),r.addEventListener("abort",o)});EB.set(r,e)}let IB={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return EB.get(r);if(e==="objectStoreNames")return r.objectStoreNames||kp.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return ur(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function KI(r){IB=r(IB)}function JI(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const n=r.call(Yc(this),e,...t);return kp.set(n,e.sort?e.sort():[e]),ur(n)}:HI().includes(r)?function(...e){return r.apply(Yc(this),e),ur(Lp.get(this))}:function(...e){return ur(r.apply(Yc(this),e))}}function zI(r){return typeof r=="function"?JI(r):(r instanceof IDBTransaction&&jI(r),GI(r,UI())?new Proxy(r,IB):r)}function ur(r){if(r instanceof IDBRequest)return qI(r);if($c.has(r))return $c.get(r);const e=zI(r);return e!==r&&($c.set(r,e),ul.set(e,r)),e}const Yc=r=>ul.get(r);function QI(r,e,{blocked:t,upgrade:n,blocking:s,terminated:i}={}){const o=indexedDB.open(r,e),a=ur(o);return n&&o.addEventListener("upgradeneeded",u=>{n(ur(o.result),u.oldVersion,u.newVersion,ur(o.transaction),u)}),t&&o.addEventListener("blocked",u=>t(u.oldVersion,u.newVersion,u)),a.then(u=>{i&&u.addEventListener("close",()=>i()),s&&u.addEventListener("versionchange",B=>s(B.oldVersion,B.newVersion,B))}).catch(()=>{}),a}const WI=["get","getKey","getAll","getAllKeys","count"],$I=["put","add","delete","clear"],Xc=new Map;function $d(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(Xc.get(e))return Xc.get(e);const t=e.replace(/FromIndex$/,""),n=e!==t,s=$I.includes(t);if(!(t in(n?IDBIndex:IDBObjectStore).prototype)||!(s||WI.includes(t)))return;const i=async function(o,...a){const u=this.transaction(o,s?"readwrite":"readonly");let B=u.store;return n&&(B=B.index(a.shift())),(await Promise.all([B[t](...a),s&&u.done]))[0]};return Xc.set(e,i),i}KI(r=>({...r,get:(e,t,n)=>$d(e,t)||r.get(e,t,n),has:(e,t)=>!!$d(e,t)||r.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YI{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(XI(t)){const n=t.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(t=>t).join(" ")}}function XI(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const DB="@firebase/app",Yd="0.16.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rn=new al("@firebase/app"),ZI="@firebase/app-compat",eD="@firebase/analytics-compat",tD="@firebase/analytics",nD="@firebase/app-check-compat",rD="@firebase/app-check",sD="@firebase/auth",iD="@firebase/auth-compat",oD="@firebase/database",aD="@firebase/data-connect",uD="@firebase/database-compat",cD="@firebase/functions",BD="@firebase/functions-compat",lD="@firebase/installations",hD="@firebase/installations-compat",dD="@firebase/messaging",fD="@firebase/messaging-compat",CD="@firebase/performance",pD="@firebase/performance-compat",gD="@firebase/remote-config",mD="@firebase/remote-config-compat",_D="@firebase/storage",ED="@firebase/storage-compat",ID="@firebase/firestore",DD="@firebase/ai",yD="@firebase/firestore-compat",wD="firebase",TD="12.19.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yB="[DEFAULT]",AD={[DB]:"fire-core",[ZI]:"fire-core-compat",[tD]:"fire-analytics",[eD]:"fire-analytics-compat",[rD]:"fire-app-check",[nD]:"fire-app-check-compat",[sD]:"fire-auth",[iD]:"fire-auth-compat",[oD]:"fire-rtdb",[aD]:"fire-data-connect",[uD]:"fire-rtdb-compat",[cD]:"fire-fn",[BD]:"fire-fn-compat",[lD]:"fire-iid",[hD]:"fire-iid-compat",[dD]:"fire-fcm",[fD]:"fire-fcm-compat",[CD]:"fire-perf",[pD]:"fire-perf-compat",[gD]:"fire-rc",[mD]:"fire-rc-compat",[_D]:"fire-gcs",[ED]:"fire-gcs-compat",[ID]:"fire-fst",[yD]:"fire-fst-compat",[DD]:"fire-vertex","fire-js":"fire-js",[wD]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cu=new Map,RD=new Map,wB=new Map;function Xd(r,e){try{r.container.addComponent(e)}catch(t){Rn.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function ts(r){const e=r.name;if(wB.has(e))return Rn.debug(`There were multiple attempts to register component ${e}.`),!1;wB.set(e,r);for(const t of cu.values())Xd(t,r);for(const t of RD.values())Xd(t,r);return!0}function Vu(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function qe(r){return r==null?!1:r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vD={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},En=new qo("app","Firebase",vD);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PD{constructor(e,t,n){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new Cr("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw En.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ps=TD;function bD(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const n={name:yB,automaticDataCollectionEnabled:!0,...e},s=n.name;if(typeof s!="string"||!s)throw En.create("bad-app-name",{appName:String(s)});if(t||(t=vp()),!t)throw En.create("no-options");const i=cu.get(s);if(i)if(An(t,i.options)){if(An(n,i.config))return i;throw En.create("duplicate-app",{appName:s,mismatchedParam:"config",oldValue:JSON.stringify(i.config),newValue:JSON.stringify(n)})}else throw En.create("duplicate-app",{appName:s,mismatchedParam:"options",oldValue:JSON.stringify(i.options),newValue:JSON.stringify(t)});const o=new LI(s);for(const u of wB.values())o.addComponent(u);const a=new PD(t,n,o);return cu.set(s,a),a}function xp(r=yB){const e=cu.get(r);if(!e&&r===yB&&vp())return bD();if(!e)throw En.create("no-app",{appName:r});return e}function an(r,e,t){let n=AD[r]??r;t&&(n+=`-${t}`);const s=n.match(/\s|\//),i=e.match(/\s|\//);if(s||i){const o=[`Unable to register library "${n}" with version "${e}":`];s&&o.push(`library name "${n}" contains illegal characters (whitespace or "/")`),s&&i&&o.push("and"),i&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Rn.warn(o.join(" "));return}ts(new Cr(`${n}-version`,()=>({library:n,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const SD="firebase-heartbeat-database",ND=1,Eo="firebase-heartbeat-store";let Zc=null;function Vp(){return Zc||(Zc=QI(SD,ND,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(Eo)}catch(t){console.warn(t)}}}}).catch(r=>{throw En.create("idb-open",{originalErrorMessage:r.message})})),Zc}async function OD(r){try{const t=(await Vp()).transaction(Eo),n=await t.objectStore(Eo).get(Mp(r));return await t.done,n}catch(e){if(e instanceof fn)Rn.warn(e.message);else{const t=En.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Rn.warn(t.message)}}}async function Zd(r,e){try{const n=(await Vp()).transaction(Eo,"readwrite");await n.objectStore(Eo).put(e,Mp(r)),await n.done}catch(t){if(t instanceof fn)Rn.warn(t.message);else{const n=En.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Rn.warn(n.message)}}}function Mp(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const FD=1024,LD=30;class kD{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new VD(t),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=ef();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats.length>LD){const o=MD(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){Rn.warn(n)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=ef(),{heartbeatsToSend:n,unsentEntries:s}=xD(this._heartbeatsCache.heartbeats),i=uu(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return Rn.warn(t),""}}}function ef(){return new Date().toISOString().substring(0,10)}function xD(r,e=FD){const t=[];let n=r.slice();for(const s of r){const i=t.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),tf(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),tf(t)>e){t.pop();break}n=n.slice(1)}return{heartbeatsToSend:t,unsentEntries:n}}class VD{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Fp()?TI().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await OD(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const n=await this.read();return Zd(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const n=await this.read();return Zd(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...e.heartbeats]})}else return}}function tf(r){return uu(JSON.stringify({version:2,heartbeats:r})).length}function MD(r){if(r.length===0)return-1;let e=0,t=r[0].date;for(let n=1;n<r.length;n++)r[n].date<t&&(t=r[n].date,e=n);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function GD(r){ts(new Cr("platform-logger",e=>new YI(e),"PRIVATE")),ts(new Cr("heartbeat",e=>new kD(e),"PRIVATE")),an(DB,Yd,r),an(DB,Yd,"esm2020"),an("fire-js","")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */GD("");var UD="firebase",HD="12.19.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */an(UD,HD,"app");function Gp(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const qD=Gp,Up=new qo("auth","Firebase",Gp());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bu=new al("@firebase/auth");function ja(r,...e){Bu.logLevel<=de.WARN&&Bu.warn(`Auth (${ps}): ${r}`,...e)}function Ka(r,...e){Bu.logLevel<=de.ERROR&&Bu.error(`Auth (${ps}): ${r}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ht(r,...e){throw cl(r,...e)}function At(r,...e){return cl(r,...e)}function Mu(r,e,t){const n={...qD(),[e]:t};return new qo("auth","Firebase",n).create(e,{appName:r.name})}function _t(r){return Mu(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Gu(r,e,t){const n=t;if(!(e instanceof n))throw n.name!==e.constructor.name&&Ht(r,"argument-error"),Mu(r,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function cl(r,...e){if(typeof r!="string"){const t=e[0],n=[...e.slice(1)];return n[0]&&(n[0].appName=r.name),r._errorFactory.create(t,...n)}return Up.create(r,...e)}function W(r,e,...t){if(!r)throw cl(e,...t)}function In(r){const e="INTERNAL ASSERTION FAILED: "+r;throw Ka(e),new Error(e)}function vn(r,e){r||In(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Io(){var r;return typeof self<"u"&&((r=self.location)==null?void 0:r.href)||""}function Bl(){return nf()==="http:"||nf()==="https:"}function nf(){var r;return typeof self<"u"&&((r=self.location)==null?void 0:r.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jD(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Bl()||DI()||"connection"in navigator)?navigator.onLine:!0}function KD(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jo{constructor(e,t){this.shortDelay=e,this.longDelay=t,vn(t>e,"Short delay should be less than long delay!"),this.isMobile=EI()||yI()}get(){return jD()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ll(r,e){vn(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hp{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;In("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;In("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;In("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const JD={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zD=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],QD=new jo(3e4,6e4);function $e(r,e){return r.tenantId&&!e.tenantId?{...e,tenantId:r.tenantId}:e}async function Ye(r,e,t,n,s={}){return qp(r,s,async()=>{let i={},o={};n&&(e==="GET"?o=n:i={body:JSON.stringify(n)});const a=li({...o,key:r.config.apiKey}).slice(1),u=await r._getAdditionalHeaders();u["Content-Type"]="application/json",r.languageCode&&(u["X-Firebase-Locale"]=r.languageCode);const B={method:e,headers:u,...i};return II()||(B.referrerPolicy="strict-origin-when-cross-origin"),r.emulatorConfig&&Cs(r.emulatorConfig.host)&&(B.credentials="include"),Hp.fetch()(await jp(r,r.config.apiHost,t,a),B)})}async function qp(r,e,t){r._canInitEmulator=!1;const n={...JD,...e};try{const s=new $D(r),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw Yi(r,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const a=i.ok?o.errorMessage:o.error.message,[u,B]=a.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw Yi(r,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw Yi(r,"email-already-in-use",o);if(u==="USER_DISABLED")throw Yi(r,"user-disabled",o);const l=n[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(B)throw Mu(r,l,B);Ht(r,l)}}catch(s){if(s instanceof fn)throw s;Ht(r,"network-request-failed",{message:String(s)})}}async function Ln(r,e,t,n,s={}){const i=await Ye(r,e,t,n,s);return"mfaPendingCredential"in i&&Ht(r,"multi-factor-auth-required",{_serverResponse:i}),i}async function jp(r,e,t,n){const s=`${e}${t}?${n}`,i=r,o=i.config.emulator?ll(r.config,s):`${r.config.apiScheme}://${s}`;return zD.includes(t)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(o).toString():o}function WD(r){switch(r){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class $D{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,n)=>{this.timer=setTimeout(()=>n(At(this.auth,"network-request-failed")),QD.get())})}}function Yi(r,e,t){const n={appName:r.name};t.email&&(n.email=t.email),t.phoneNumber&&(n.phoneNumber=t.phoneNumber);const s=At(r,e,n);return s.customData._tokenResponse=t,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rf(r){return r!==void 0&&r.getResponse!==void 0}function sf(r){return r!==void 0&&r.enterprise!==void 0}class Kp{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return WD(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function YD(r){return(await Ye(r,"GET","/v1/recaptchaParams")).recaptchaSiteKey||""}async function Jp(r,e){return Ye(r,"GET","/v2/recaptchaConfig",$e(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function XD(r,e){return Ye(r,"POST","/v1/accounts:delete",e)}async function ZD(r,e){return Ye(r,"POST","/v1/accounts:update",e)}async function lu(r,e){return Ye(r,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function no(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function ey(r,e=!1){const t=ae(r),n=await t.getIdToken(e),s=Uu(n);W(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,o=i==null?void 0:i.sign_in_provider;return{claims:s,token:n,authTime:no(eB(s.auth_time)),issuedAtTime:no(eB(s.iat)),expirationTime:no(eB(s.exp)),signInProvider:o||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function eB(r){return Number(r)*1e3}function Uu(r){const[e,t,n]=r.split(".");if(e===void 0||t===void 0||n===void 0)return Ka("JWT malformed, contained fewer than 3 sections"),null;try{const s=Tp(t);return s?JSON.parse(s):(Ka("Failed to decode base64 JWT payload"),null)}catch(s){return Ka("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function of(r){const e=Uu(r);return W(e,"internal-error"),W(typeof e.exp<"u","internal-error"),W(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ns(r,e,t=!1){if(t)return e;try{return await e}catch(n){throw n instanceof fn&&ty(n)&&r.auth.currentUser===r&&await r.auth.signOut(),n}}function ty({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ny{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const n=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,n)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class TB{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=no(this.lastLoginAt),this.creationTime=no(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Do(r){var d;const e=r.auth,t=await r.getIdToken(),n=await ns(r,lu(e,{idToken:t}));W(n==null?void 0:n.users.length,e,"internal-error");const s=n.users[0];r._notifyReloadListener(s);const i=(d=s.providerUserInfo)!=null&&d.length?zp(s.providerUserInfo):[],o=sy(r.providerData,i),a=r.isAnonymous,u=!(r.email&&s.passwordHash)&&!(o!=null&&o.length),B=a?u:!1,l={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new TB(s.createdAt,s.lastLoginAt),isAnonymous:B};Object.assign(r,l)}async function ry(r){const e=ae(r);await Do(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function sy(r,e){return[...r.filter(n=>!e.some(s=>s.providerId===n.providerId)),...e]}function zp(r){return r.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function iy(r,e){const t=await qp(r,{},async()=>{const n=li({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=r.config,o=await jp(r,s,"/v1/token",`key=${i}`),a=await r._getAdditionalHeaders();a["Content-Type"]="application/x-www-form-urlencoded";const u={method:"POST",headers:a,body:n};return r.emulatorConfig&&Cs(r.emulatorConfig.host)&&(u.credentials="include"),Hp.fetch()(o,u)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function oy(r,e){return Ye(r,"POST","/v2/accounts:revokeToken",$e(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class js{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){W(e.idToken,"internal-error"),W(typeof e.idToken<"u","internal-error"),W(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):of(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){W(e.length!==0,"internal-error");const t=of(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(W(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:s,expiresIn:i}=await iy(e,t);this.updateTokensAndExpiration(n,s,Number(i))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(e,t){const{refreshToken:n,accessToken:s,expirationTime:i}=t,o=new js;return n&&(W(typeof n=="string","internal-error",{appName:e}),o.refreshToken=n),s&&(W(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),i&&(W(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new js,this.toJSON())}_performRefresh(){return In("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jn(r,e){W(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class Kt{constructor({uid:e,auth:t,stsTokenManager:n,...s}){this.providerId="firebase",this.proactiveRefresh=new ny(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=n,this.accessToken=n.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new TB(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await ns(this,this.stsTokenManager.getToken(this.auth,e));return W(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return ey(this,e)}reload(){return ry(this)}_assign(e){this!==e&&(W(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Kt({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){W(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await Do(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(qe(this.auth.app))return Promise.reject(_t(this.auth));const e=await this.getIdToken();return await ns(this,XD(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const n=t.displayName??void 0,s=t.email??void 0,i=t.phoneNumber??void 0,o=t.photoURL??void 0,a=t.tenantId??void 0,u=t._redirectEventId??void 0,B=t.createdAt??void 0,l=t.lastLoginAt??void 0,{uid:d,emailVerified:C,isAnonymous:m,providerData:y,stsTokenManager:O}=t;W(d&&O,e,"internal-error");const V=js.fromJSON(this.name,O);W(typeof d=="string",e,"internal-error"),jn(n,e.name),jn(s,e.name),W(typeof C=="boolean",e,"internal-error"),W(typeof m=="boolean",e,"internal-error"),jn(i,e.name),jn(o,e.name),jn(a,e.name),jn(u,e.name),jn(B,e.name),jn(l,e.name);const z=new Kt({uid:d,auth:e,email:s,emailVerified:C,displayName:n,isAnonymous:m,photoURL:o,phoneNumber:i,tenantId:a,stsTokenManager:V,createdAt:B,lastLoginAt:l});return y&&Array.isArray(y)&&(z.providerData=y.map(Z=>({...Z}))),u&&(z._redirectEventId=u),z}static async _fromIdTokenResponse(e,t,n=!1){const s=new js;s.updateFromServerResponse(t);const i=new Kt({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:n});return await Do(i),i}static async _fromGetAccountInfoResponse(e,t,n){const s=t.users[0];W(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?zp(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),a=new js;a.updateFromIdToken(n);const u=new Kt({uid:s.localId,auth:e,stsTokenManager:a,isAnonymous:o}),B={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new TB(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(u,B),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const af=new Map;function Dn(r){vn(r instanceof Function,"Expected a class definition");let e=af.get(r);return e?(vn(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,af.set(r,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qp{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Qp.type="NONE";const uf=Qp;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ja(r,e,t){return`firebase:${r}:${e}:${t}`}class zr{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:s,name:i}=this.auth;this.fullUserKey=Ja(this.userKey,s.apiKey,i),this.fullPersistenceKey=Ja("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t);try{this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}catch{}}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await lu(this.auth,{idToken:e}).catch(()=>{});return t?Kt._fromGetAccountInfoResponse(this.auth,t,e):null}return Kt._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){try{this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}catch{}}static async create(e,t,n="authUser"){if(!t.length)return new zr(Dn(uf),e,n);const s=(await Promise.all(t.map(async B=>{try{if(await B._isAvailable())return B}catch{return}}))).filter(B=>B);let i=s[0]||Dn(uf);const o=Ja(n,e.config.apiKey,e.name);let a=null;for(const B of t)try{const l=await B._get(o);if(l){let d;if(typeof l=="string"){const C=await lu(e,{idToken:l}).catch(()=>{});if(!C)break;d=await Kt._fromGetAccountInfoResponse(e,C,l)}else d=Kt._fromJSON(e,l);B!==i&&(a=d),i=B;break}}catch{}const u=s.filter(B=>B._shouldAllowMigration);return!i._shouldAllowMigration||!u.length?new zr(i,e,n):(i=u[0],a&&await i._set(o,a.toJSON()),await Promise.all(t.map(async B=>{if(B!==i)try{await B._remove(o)}catch{}})),new zr(i,e,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cf(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Xp(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Wp(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(eg(e))return"Blackberry";if(tg(e))return"Webos";if($p(e))return"Safari";if((e.includes("chrome/")||Yp(e))&&!e.includes("edge/"))return"Chrome";if(Zp(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=r.match(t);if((n==null?void 0:n.length)===2)return n[1]}return"Other"}function Wp(r=We()){return/firefox\//i.test(r)}function $p(r=We()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Yp(r=We()){return/crios\//i.test(r)}function Xp(r=We()){return/iemobile/i.test(r)}function Zp(r=We()){return/android/i.test(r)}function eg(r=We()){return/blackberry/i.test(r)}function tg(r=We()){return/webos/i.test(r)}function hl(r=We()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function ay(r=We()){var e;return hl(r)&&!!((e=window.navigator)!=null&&e.standalone)}function uy(){return wI()&&document.documentMode===10}function ng(r=We()){return hl(r)||Zp(r)||tg(r)||eg(r)||/windows phone/i.test(r)||Xp(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rg(r,e=[]){let t;switch(r){case"Browser":t=cf(We());break;case"Worker":t=`${cf(We())}-${r}`;break;default:t=r}const n=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${ps}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cy{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=i=>new Promise((o,a)=>{try{const u=e(i);o(u)}catch(u){a(u)}});n.onAbort=t,this.queue.push(n);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n==null?void 0:n.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function By(r,e={}){return Ye(r,"GET","/v2/passwordPolicy",$e(r,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ly=6;class hy{constructor(e){var n;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??ly,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((n=e.allowedNonAlphanumericCharacters)==null?void 0:n.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let n;for(let s=0;s<e.length;s++)n=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dy{constructor(e,t,n,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Bf(this),this.idTokenSubscription=new Bf(this),this.beforeStateQueue=new cy(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Up,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Dn(t)),this._initializationPromise=this.queue(async()=>{var n,s,i;if(!this._deleted){try{this.persistenceManager=await zr.create(this,e)}catch(o){ja(`Failed to initialize persistence: ${o}`),this.persistenceManager=await zr.create(this,[])}finally{(n=this._resolvePersistenceManagerAvailable)==null||n.call(this)}if(!this._deleted){if((s=this._popupRedirectResolver)!=null&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}try{await this.initializeCurrentUser(t)}catch(o){ja(`Failed to initialize current user: ${o}`),await this.directlySetCurrentUser(null).catch(()=>{})}this.lastNotifiedUid=((i=this.currentUser)==null?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await lu(this,{idToken:e}),n=await Kt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var i;if(qe(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(a,a))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let n=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(i=this.redirectUser)==null?void 0:i._redirectEventId,a=n==null?void 0:n._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===a)&&(u!=null&&u.user)&&(n=u.user,s=!0)}if(!n)return this.directlySetCurrentUser(null);if(!n._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(n)}catch(o){n=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return n?this.reloadAndSetCurrentUserOrClear(n):this.directlySetCurrentUser(null)}return W(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===n._redirectEventId?this.directlySetCurrentUser(n):this.reloadAndSetCurrentUserOrClear(n)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Do(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=KD()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(qe(this.app))return Promise.reject(_t(this));const t=e?ae(e):null;return t&&W(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&W(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return qe(this.app)?Promise.reject(_t(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return qe(this.app)?Promise.reject(_t(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Dn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await By(this),t=new hy(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new qo("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(n.tenantId=this.tenantId),await oy(this,n)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return e===null?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Dn(e)||this._popupRedirectResolver;W(t,this,"argument-error"),this.redirectPersistenceManager=await zr.create(this,[Dn(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((n=this.redirectUser)==null?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,s){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let o=!1;const a=this._isInitialized?Promise.resolve():this._initializationPromise;if(W(a,this,"internal-error"),a.then(()=>{o||i(this.currentUser)}).catch(u=>{if(!o)if(typeof t!="function"&&t.error)t.error(u);else if(n)n(u);else throw u}),typeof t=="function"){const u=e.addObserver(t,n,s);return()=>{o=!0,u()}}else{const u=e.addObserver(t);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){if(this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,this.persistenceManager)try{e?await this.persistenceManager.setCurrentUser(e):await this.persistenceManager.removeCurrentUser()}catch(t){const n=(t==null?void 0:t.message)||String(t),s=Mu(this,"internal-error",`An internal AuthError has occurred: ${n}`);throw s.customData={originalError:t},s}}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return W(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=rg(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var s;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((s=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:s.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const n=await this._getAppCheckToken();return n&&(e["X-Firebase-AppCheck"]=n),e}async _getAppCheckToken(){var t;if(qe(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&ja(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function st(r){return ae(r)}class Bf{constructor(e){this.auth=e,this.observer=null,this.addObserver=PI(t=>this.observer=t)}get next(){return W(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ko={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function fy(r){Ko=r}function dl(r){return Ko.loadJS(r)}function Cy(){return Ko.recaptchaV2Script}function py(){return Ko.recaptchaEnterpriseScript}function gy(){return Ko.gapiScript}function sg(r){return`__${r}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const my=500,_y=6e4,Ra=1e12;class Ey{constructor(e){this.auth=e,this.counter=Ra,this._widgets=new Map}render(e,t){const n=this.counter;return this._widgets.set(n,new yy(e,this.auth.name,t||{})),this.counter++,n}reset(e){var n;const t=e||Ra;(n=this._widgets.get(t))==null||n.delete(),this._widgets.delete(t)}getResponse(e){var n;const t=e||Ra;return((n=this._widgets.get(t))==null?void 0:n.getResponse())||""}async execute(e){var n;const t=e||Ra;return(n=this._widgets.get(t))==null||n.execute(),""}}class Iy{constructor(){this.enterprise=new Dy}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class Dy{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class yy{constructor(e,t,n){this.params=n,this.timerId=null,this.deleted=!1,this.responseToken=null,this.clickHandler=()=>{this.execute()};const s=typeof e=="string"?document.getElementById(e):e;W(s,"argument-error",{appName:t}),this.container=s,this.isVisible=this.params.size!=="invisible",this.isVisible?this.execute():this.container.addEventListener("click",this.clickHandler)}getResponse(){return this.checkIfDeleted(),this.responseToken}delete(){this.checkIfDeleted(),this.deleted=!0,this.timerId&&(clearTimeout(this.timerId),this.timerId=null),this.container.removeEventListener("click",this.clickHandler)}execute(){this.checkIfDeleted(),!this.timerId&&(this.timerId=window.setTimeout(()=>{this.responseToken=wy(50);const{callback:e,"expired-callback":t}=this.params;if(e)try{e(this.responseToken)}catch{}this.timerId=window.setTimeout(()=>{if(this.timerId=null,this.responseToken=null,t)try{t()}catch{}this.isVisible&&this.execute()},_y)},my))}checkIfDeleted(){if(this.deleted)throw new Error("reCAPTCHA mock was already deleted!")}}function wy(r){const e=[],t="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";for(let n=0;n<r;n++)e.push(t.charAt(Math.floor(Math.random()*t.length)));return e.join("")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ty="recaptcha-enterprise",ro="NO_RECAPTCHA",lf="onFirebaseAuthREInstanceReady";class gn{constructor(e){this.type=Ty,this.auth=st(e)}async verify(e="verify",t=!1){async function n(i){if(!t){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(o,a)=>{Jp(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)a(new Error("recaptcha Enterprise site key undefined"));else{const B=new Kp(u);return i.tenantId==null?i._agentRecaptchaConfig=B:i._tenantRecaptchaConfigs[i.tenantId]=B,o(B.siteKey)}}).catch(u=>{a(u)})})}function s(i,o,a){const u=window.grecaptcha;sf(u)?u.enterprise.ready(()=>{u.enterprise.execute(i,{action:e}).then(B=>{o(B)}).catch(()=>{o(ro)})}):a(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new Iy().execute("siteKey",{action:"verify"}):new Promise((i,o)=>{n(this.auth).then(async a=>{if(!t&&sf(window.grecaptcha)&&gn.scriptInjectionDeferred)await gn.scriptInjectionDeferred.promise,s(a,i,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let u=py();u.length!==0&&(u+=a+`&onload=${lf}`),gn.scriptInjectionDeferred=new bp,window[lf]=()=>{var B;(B=gn.scriptInjectionDeferred)==null||B.resolve()},dl(u).then(()=>{var B;return(B=gn.scriptInjectionDeferred)==null?void 0:B.promise}).then(()=>{s(a,i,o)}).catch(B=>{o(B)})}}).catch(a=>{o(a)})})}}gn.scriptInjectionDeferred=null;async function Ui(r,e,t,n=!1,s=!1){const i=new gn(r);let o;if(s)o=ro;else try{o=await i.verify(t)}catch{o=await i.verify(t,!0)}const a={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in a){const u=a.phoneEnrollmentInfo.phoneNumber,B=a.phoneEnrollmentInfo.recaptchaToken;Object.assign(a,{phoneEnrollmentInfo:{phoneNumber:u,recaptchaToken:B,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in a){const u=a.phoneSignInInfo.recaptchaToken;Object.assign(a,{phoneSignInInfo:{recaptchaToken:u,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return a}return n?Object.assign(a,{captchaResp:o}):Object.assign(a,{captchaResponse:o}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function cr(r,e,t,n,s){var i,o;if(s==="EMAIL_PASSWORD_PROVIDER")if((i=r._getRecaptchaConfig())!=null&&i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await Ui(r,e,t,t==="getOobCode");return n(r,a)}else return n(r,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const u=await Ui(r,e,t,t==="getOobCode");return n(r,u)}else return Promise.reject(a)});else if(s==="PHONE_PROVIDER")if((o=r._getRecaptchaConfig())!=null&&o.isProviderEnabled("PHONE_PROVIDER")){const a=await Ui(r,e,t);return n(r,a).catch(async u=>{var B;if(((B=r._getRecaptchaConfig())==null?void 0:B.getProviderEnforcementState("PHONE_PROVIDER"))==="AUDIT"&&(u.code==="auth/missing-recaptcha-token"||u.code==="auth/invalid-app-credential")){console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${t} flow.`);const l=await Ui(r,e,t,!1,!0);return n(r,l)}return Promise.reject(u)})}else{const a=await Ui(r,e,t,!1,!0);return n(r,a)}else return Promise.reject(s+" provider is not supported.")}async function Ay(r){const e=st(r),t=await Jp(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),n=new Kp(t);e.tenantId==null?e._agentRecaptchaConfig=n:e._tenantRecaptchaConfigs[e.tenantId]=n,n.isAnyProviderEnabled()&&new gn(e).verify()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ry(r,e){const t=Vu(r,"auth");if(t.isInitialized()){const s=t.getImmediate(),i=t.getOptions();if(An(i,e??{}))return s;Ht(s,"already-initialized")}return t.initialize({options:e})}function vy(r,e){const t=(e==null?void 0:e.persistence)||[],n=(Array.isArray(t)?t:[t]).map(Dn);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(n,e==null?void 0:e.popupRedirectResolver)}function Py(r,e,t){const n=st(r);W(/^https?:\/\//.test(e),n,"invalid-emulator-scheme");const s=!1,i=ig(e),{host:o,port:a}=by(e),u=a===null?"":`:${a}`,B={url:`${i}//${o}${u}/`},l=Object.freeze({host:o,port:a,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!n._canInitEmulator){W(n.config.emulator&&n.emulatorConfig,n,"emulator-config-failed"),W(An(B,n.config.emulator)&&An(l,n.emulatorConfig),n,"emulator-config-failed");return}n.config.emulator=B,n.emulatorConfig=l,n.settings.appVerificationDisabledForTesting=!0,Cs(o)?ol(`${i}//${o}${u}`):Sy()}function ig(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function by(r){const e=ig(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const n=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(n);if(s){const i=s[1];return{host:i,port:hf(n.substr(i.length+1))}}else{const[i,o]=n.split(":");return{host:i,port:hf(o)}}}function hf(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function Sy(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hu{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return In("not implemented")}_getIdTokenResponse(e){return In("not implemented")}_linkToIdToken(e,t){return In("not implemented")}_getReauthenticationResolver(e){return In("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ny(r,e){return Ye(r,"POST","/v1/accounts:resetPassword",$e(r,e))}async function Oy(r,e){return Ye(r,"POST","/v1/accounts:update",e)}async function Fy(r,e){return Ye(r,"POST","/v1/accounts:signUp",e)}async function Ly(r,e){return Ye(r,"POST","/v1/accounts:update",$e(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ky(r,e){return Ln(r,"POST","/v1/accounts:signInWithPassword",$e(r,e))}async function qu(r,e){return Ye(r,"POST","/v1/accounts:sendOobCode",$e(r,e))}async function xy(r,e){return qu(r,e)}async function Vy(r,e){return qu(r,e)}async function My(r,e){return qu(r,e)}async function Gy(r,e){return qu(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Uy(r,e){return Ln(r,"POST","/v1/accounts:signInWithEmailLink",$e(r,e))}async function Hy(r,e){return Ln(r,"POST","/v1/accounts:signInWithEmailLink",$e(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yo extends Hu{constructor(e,t,n,s=null){super("password",n),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new yo(e,t,"password")}static _fromEmailAndCode(e,t,n=null){return new yo(e,t,"emailLink",n)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return cr(e,t,"signInWithPassword",ky,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return Uy(e,{email:this._email,oobCode:this._password});default:Ht(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const n={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return cr(e,n,"signUpPassword",Fy,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return Hy(e,{idToken:t,email:this._email,oobCode:this._password});default:Ht(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ks(r,e){return Ln(r,"POST","/v1/accounts:signInWithIdp",$e(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qy="http://localhost";class Pn extends Hu{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Pn(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Ht("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:n,signInMethod:s,...i}=t;if(!n||!s)return null;const o=new Pn(n,s);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return Ks(e,t)}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,Ks(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Ks(e,t)}buildRequest(){const e={requestUri:qy,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=li(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function df(r,e){return Ye(r,"POST","/v1/accounts:sendVerificationCode",$e(r,e))}async function jy(r,e){return Ln(r,"POST","/v1/accounts:signInWithPhoneNumber",$e(r,e))}async function Ky(r,e){const t=await Ln(r,"POST","/v1/accounts:signInWithPhoneNumber",$e(r,e));if(t.temporaryProof)throw Yi(r,"account-exists-with-different-credential",t);return t}const Jy={USER_NOT_FOUND:"user-not-found"};async function zy(r,e){const t={...e,operation:"REAUTH"};return Ln(r,"POST","/v1/accounts:signInWithPhoneNumber",$e(r,t),Jy)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class so extends Hu{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new so({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new so({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return jy(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return Ky(e,{idToken:t,...this._makeVerificationRequest()})}_getReauthenticationResolver(e){return zy(e,this._makeVerificationRequest())}_makeVerificationRequest(){const{temporaryProof:e,phoneNumber:t,verificationId:n,verificationCode:s}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:n,code:s}}toJSON(){const e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){typeof e=="string"&&(e=JSON.parse(e));const{verificationId:t,verificationCode:n,phoneNumber:s,temporaryProof:i}=e;return!n&&!t&&!s&&!i?null:new so({verificationId:t,verificationCode:n,phoneNumber:s,temporaryProof:i})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qy(r){switch(r){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Wy(r){const e=Wi($i(r)).link,t=e?Wi($i(e)).deep_link_id:null,n=Wi($i(r)).deep_link_id;return(n?Wi($i(n)).link:null)||n||t||e||r}class ju{constructor(e){const t=Wi($i(e)),n=t.apiKey??null,s=t.oobCode??null,i=Qy(t.mode??null);W(n&&s&&i,"argument-error"),this.apiKey=n,this.operation=i,this.code=s,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){const t=Wy(e);try{return new ju(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gs{constructor(){this.providerId=gs.PROVIDER_ID}static credential(e,t){return yo._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const n=ju.parseLink(t);return W(n,"argument-error"),yo._fromEmailAndCode(e,n.code,n.tenantId)}}gs.PROVIDER_ID="password";gs.EMAIL_PASSWORD_SIGN_IN_METHOD="password";gs.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hi{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class di extends hi{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}class za extends di{static credentialFromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;return W("providerId"in t&&"signInMethod"in t,"argument-error"),Pn._fromParams(t)}credential(e){return this._credential({...e,nonce:e.rawNonce})}_credential(e){return W(e.idToken||e.accessToken,"argument-error"),Pn._fromParams({...e,providerId:this.providerId,signInMethod:this.providerId})}static credentialFromResult(e){return za.oauthCredentialFromTaggedObject(e)}static credentialFromError(e){return za.oauthCredentialFromTaggedObject(e.customData||{})}static oauthCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n,oauthTokenSecret:s,pendingToken:i,nonce:o,providerId:a}=e;if(!n&&!s&&!t&&!i||!a)return null;try{return new za(a)._credential({idToken:t,accessToken:n,nonce:o,pendingToken:i})}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xn extends di{constructor(){super("facebook.com")}static credential(e){return Pn._fromParams({providerId:Xn.PROVIDER_ID,signInMethod:Xn.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Xn.credentialFromTaggedObject(e)}static credentialFromError(e){return Xn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Xn.credential(e.oauthAccessToken)}catch{return null}}}Xn.FACEBOOK_SIGN_IN_METHOD="facebook.com";Xn.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zn extends di{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Pn._fromParams({providerId:Zn.PROVIDER_ID,signInMethod:Zn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Zn.credentialFromTaggedObject(e)}static credentialFromError(e){return Zn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return Zn.credential(t,n)}catch{return null}}}Zn.GOOGLE_SIGN_IN_METHOD="google.com";Zn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class er extends di{constructor(){super("github.com")}static credential(e){return Pn._fromParams({providerId:er.PROVIDER_ID,signInMethod:er.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return er.credentialFromTaggedObject(e)}static credentialFromError(e){return er.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return er.credential(e.oauthAccessToken)}catch{return null}}}er.GITHUB_SIGN_IN_METHOD="github.com";er.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tr extends di{constructor(){super("twitter.com")}static credential(e,t){return Pn._fromParams({providerId:tr.PROVIDER_ID,signInMethod:tr.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return tr.credentialFromTaggedObject(e)}static credentialFromError(e){return tr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return tr.credential(t,n)}catch{return null}}}tr.TWITTER_SIGN_IN_METHOD="twitter.com";tr.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function og(r,e){return Ln(r,"POST","/v1/accounts:signUp",$e(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,s=!1){const i=await Kt._fromIdTokenResponse(e,n,s),o=ff(n);return new Bn({user:i,providerId:o,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const s=ff(n);return new Bn({user:e,providerId:s,_tokenResponse:n,operationType:t})}}function ff(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function P0(r){var s;if(qe(r.app))return Promise.reject(_t(r));const e=st(r);if(await e._initializationPromise,(s=e.currentUser)!=null&&s.isAnonymous)return new Bn({user:e.currentUser,providerId:null,operationType:"signIn"});const t=await og(e,{returnSecureToken:!0}),n=await Bn._fromIdTokenResponse(e,"signIn",t,!0);return await e._updateCurrentUser(n.user),n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hu extends fn{constructor(e,t,n,s){super(t.code,t.message),this.operationType=n,this.user=s,Object.setPrototypeOf(this,hu.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,s){return new hu(e,t,n,s)}}function ag(r,e,t,n){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?hu._fromErrorAndOperation(r,i,e,n):i})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ug(r){return new Set(r.map(({providerId:e})=>e).filter(e=>!!e))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function b0(r,e){const t=ae(r);await Ku(!0,t,e);const{providerUserInfo:n}=await ZD(t.auth,{idToken:await t.getIdToken(),deleteProvider:[e]}),s=ug(n||[]);return t.providerData=t.providerData.filter(i=>s.has(i.providerId)),s.has("phone")||(t.phoneNumber=null),await t.auth._persistUserIfCurrent(t),t}async function cg(r,e,t=!1){const n=await ns(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return Bn._forOperation(r,"link",n)}async function Ku(r,e,t){await Do(e);const n=ug(e.providerData),s=r===!1?"provider-already-linked":"no-such-provider";W(n.has(t)===r,e.auth,s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $y(r,e,t=!1){const{auth:n}=r;if(qe(n.app))return Promise.reject(_t(n));const s="reauthenticate";try{const i=await ns(r,ag(n,s,e,r),t);W(i.idToken,n,"internal-error");const o=Uu(i.idToken);W(o,n,"internal-error");const{sub:a}=o;return W(r.uid===a,n,"user-mismatch"),Bn._forOperation(r,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&Ht(n,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Bg(r,e,t=!1){if(qe(r.app))return Promise.reject(_t(r));const n="signIn",s=await ag(r,n,e),i=await Bn._fromIdTokenResponse(r,n,s);return t||await r._updateCurrentUser(i.user),i}async function fl(r,e){return Bg(st(r),e)}async function Yy(r,e){const t=ae(r);return await Ku(!1,t,e.providerId),cg(t,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xy(r,e){return Ln(r,"POST","/v1/accounts:signInWithCustomToken",$e(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function S0(r,e){if(qe(r.app))return Promise.reject(_t(r));const t=st(r),n=await Xy(t,{token:e,returnSecureToken:!0}),s=await Bn._fromIdTokenResponse(t,"signIn",n);return await t._updateCurrentUser(s.user),s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ju(r,e,t){var n;W(((n=t.url)==null?void 0:n.length)>0,r,"invalid-continue-uri"),W(typeof t.dynamicLinkDomain>"u"||t.dynamicLinkDomain.length>0,r,"invalid-dynamic-link-domain"),W(typeof t.linkDomain>"u"||t.linkDomain.length>0,r,"invalid-hosting-link-domain"),e.continueUrl=t.url,e.dynamicLinkDomain=t.dynamicLinkDomain,e.linkDomain=t.linkDomain,e.canHandleCodeInApp=t.handleCodeInApp,t.iOS&&(W(t.iOS.bundleId.length>0,r,"missing-ios-bundle-id"),e.iOSBundleId=t.iOS.bundleId),t.android&&(W(t.android.packageName.length>0,r,"missing-android-pkg-name"),e.androidInstallApp=t.android.installApp,e.androidMinimumVersionCode=t.android.minimumVersion,e.androidPackageName=t.android.packageName)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Cl(r){const e=st(r);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function N0(r,e,t){const n=st(r),s={requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"};t&&Ju(n,s,t),await cr(n,s,"getOobCode",Vy,"EMAIL_PASSWORD_PROVIDER")}async function O0(r,e,t){await Ny(ae(r),{oobCode:e,newPassword:t}).catch(async n=>{throw n.code==="auth/password-does-not-meet-requirements"&&Cl(r),n})}async function F0(r,e){await Ly(ae(r),{oobCode:e})}async function L0(r,e,t){if(qe(r.app))return Promise.reject(_t(r));const n=st(r),o=await cr(n,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",og,"EMAIL_PASSWORD_PROVIDER").catch(u=>{throw u.code==="auth/password-does-not-meet-requirements"&&Cl(r),u}),a=await Bn._fromIdTokenResponse(n,"signIn",o);return await n._updateCurrentUser(a.user),a}function k0(r,e,t){return qe(r.app)?Promise.reject(_t(r)):fl(ae(r),gs.credential(e,t)).catch(async n=>{throw n.code==="auth/password-does-not-meet-requirements"&&Cl(r),n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function x0(r,e,t){const n=st(r),s={requestType:"EMAIL_SIGNIN",email:e,clientType:"CLIENT_TYPE_WEB"};function i(o,a){W(a.handleCodeInApp,n,"argument-error"),a&&Ju(n,o,a)}i(s,t),await cr(n,s,"getOobCode",My,"EMAIL_PASSWORD_PROVIDER")}function V0(r,e){const t=ju.parseLink(e);return(t==null?void 0:t.operation)==="EMAIL_SIGNIN"}async function M0(r,e,t){if(qe(r.app))return Promise.reject(_t(r));const n=ae(r),s=gs.credentialWithLink(e,t||Io());return W(s._tenantId===(n.tenantId||null),n,"tenant-id-mismatch"),fl(n,s)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zy(r,e){return Ye(r,"POST","/v1/accounts:createAuthUri",$e(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function G0(r,e){const t=Bl()?Io():"http://localhost",n={identifier:e,continueUri:t},{signinMethods:s}=await Zy(ae(r),n);return s||[]}async function U0(r,e){const t=ae(r),s={requestType:"VERIFY_EMAIL",idToken:await r.getIdToken()};e&&Ju(t.auth,s,e);const{email:i}=await xy(t.auth,s);i!==r.email&&await r.reload()}async function H0(r,e,t){const n=ae(r),i={requestType:"VERIFY_AND_CHANGE_EMAIL",idToken:await r.getIdToken(),newEmail:e};t&&Ju(n.auth,i,t);const{email:o}=await Gy(n.auth,i);o!==r.email&&await r.reload()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ew(r,e){return Ye(r,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function q0(r,e){const{displayName:t,photoURL:n}=e;if(t===void 0&&n===void 0)return;const s=ae(r),o={idToken:await s.getIdToken(),displayName:t,photoUrl:n,returnSecureToken:!0},a=await ns(s,ew(s.auth,o));s.displayName=a.displayName||null,s.photoURL=a.photoUrl||null;const u=s.providerData.find(({providerId:B})=>B==="password");u&&(u.displayName=s.displayName,u.photoURL=s.photoURL),await s._updateTokensIfNecessary(a)}function j0(r,e){const t=ae(r);return qe(t.auth.app)?Promise.reject(_t(t.auth)):lg(t,e,null)}function K0(r,e){return lg(ae(r),null,e)}async function lg(r,e,t){const{auth:n}=r,i={idToken:await r.getIdToken(),returnSecureToken:!0};e&&(i.email=e),t&&(i.password=t);const o=await ns(r,Oy(n,i));await r._updateTokensIfNecessary(o,!0)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tw(r){var s,i;if(!r)return null;const{providerId:e}=r,t=r.rawUserInfo?JSON.parse(r.rawUserInfo):{},n=r.isNewUser||r.kind==="identitytoolkit#SignupNewUserResponse";if(!e&&(r!=null&&r.idToken)){const o=(i=(s=Uu(r.idToken))==null?void 0:s.firebase)==null?void 0:i.sign_in_provider;if(o){const a=o!=="anonymous"&&o!=="custom"?o:null;return new Js(n,a)}}if(!e)return null;switch(e){case"facebook.com":return new nw(n,t);case"github.com":return new rw(n,t);case"google.com":return new sw(n,t);case"twitter.com":return new iw(n,t,r.screenName||null);case"custom":case"anonymous":return new Js(n,null);default:return new Js(n,e,t)}}class Js{constructor(e,t,n={}){this.isNewUser=e,this.providerId=t,this.profile=n}}class hg extends Js{constructor(e,t,n,s){super(e,t,n),this.username=s}}class nw extends Js{constructor(e,t){super(e,"facebook.com",t)}}class rw extends hg{constructor(e,t){super(e,"github.com",t,typeof(t==null?void 0:t.login)=="string"?t==null?void 0:t.login:null)}}class sw extends Js{constructor(e,t){super(e,"google.com",t)}}class iw extends hg{constructor(e,t,n){super(e,"twitter.com",t,n)}}function J0(r){const{user:e,_tokenResponse:t}=r;return e.isAnonymous&&!t?{providerId:null,isNewUser:!1,profile:null}:tw(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function z0(r,e){return ae(r).setPersistence(e)}function ow(r,e,t,n){return ae(r).onIdTokenChanged(e,t,n)}function aw(r,e,t){return ae(r).beforeAuthStateChanged(e,t)}function Q0(r,e,t,n){return ae(r).onAuthStateChanged(e,t,n)}function W0(r){return ae(r).signOut()}function $0(r,e){return st(r).revokeAccessToken(e)}async function Y0(r){return ae(r).delete()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cf(r,e){return Ye(r,"POST","/v2/accounts/mfaEnrollment:start",$e(r,e))}const du="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dg{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(du,"1"),this.storage.removeItem(du),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uw=1e3,cw=10;class fg extends dg{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=ng(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),s=this.localCache[t];n!==s&&e(t,s,n)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,a,u)=>{this.notifyListeners(o,u)});return}const n=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const o=this.storage.getItem(n);!t&&this.localCache[n]===o||this.notifyListeners(n,o)},i=this.storage.getItem(n);uy()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,cw):s()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const s of Array.from(n))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},uw)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}fg.type="LOCAL";const Bw=fg;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cg extends dg{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Cg.type="SESSION";const pg=Cg;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lw(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zu{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const n=new zu(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:s,data:i}=t.data,o=this.handlersMap[s];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:s});const a=Array.from(o).map(async B=>B(t.origin,i)),u=await lw(a);t.ports[0].postMessage({status:"done",eventId:n,eventType:s,response:u})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}zu.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qu(r="",e=10){let t="";for(let n=0;n<e;n++)t+=Math.floor(Math.random()*10);return r+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hw{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,o;return new Promise((a,u)=>{const B=Qu("",20);s.port1.start();const l=setTimeout(()=>{u(new Error("unsupported_event"))},n);o={messageChannel:s,onMessage(d){const C=d;if(C.data.eventId===B)switch(C.data.status){case"ack":clearTimeout(l),i=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),a(C.data.response);break;default:clearTimeout(l),clearTimeout(i),u(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:B,data:t},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ue(){return window}function dw(r){Ue().location.href=r}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pl(){return typeof Ue().WorkerGlobalScope<"u"&&typeof Ue().importScripts=="function"}async function fw(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Cw(){var r;return((r=navigator==null?void 0:navigator.serviceWorker)==null?void 0:r.controller)||null}function pw(){return pl()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gg="firebaseLocalStorageDb",gw=1,fu="firebaseLocalStorage",mg="fbase_key";class Jo{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Wu(r,e){return r.transaction([fu],e?"readwrite":"readonly").objectStore(fu)}function mw(){const r=indexedDB.deleteDatabase(gg);return new Jo(r).toPromise()}function _g(){const r=indexedDB.open(gg,gw);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const n=r.result;try{n.createObjectStore(fu,{keyPath:mg})}catch(s){t(s)}}),r.addEventListener("success",async()=>{const n=r.result;n.objectStoreNames.contains(fu)?e(n):(n.close(),await mw(),e(await _g()))})})}async function pf(r,e,t){const n=Wu(r,!0).put({[mg]:e,value:t});return new Jo(n).toPromise()}async function _w(r,e){const t=Wu(r,!1).get(e),n=await new Jo(t).toPromise();return n===void 0?null:n.value}function gf(r,e){const t=Wu(r,!0).delete(e);return new Jo(t).toPromise()}const Ew=800,Iw=3;class Eg{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.dbPromise?this.dbPromise:(this.dbPromise=_g(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let t=0;for(;;)try{const n=await this._openDb();return await e(n)}catch(n){if(t++>Iw)throw n;if(this.dbPromise){const s=this.dbPromise;this.dbPromise=null;try{(await s).close()}catch{}}}}async initializeServiceWorkerMessaging(){return pl()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=zu._getInstance(pw()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,n;if(this.activeServiceWorker=await fw(),!this.activeServiceWorker)return;this.sender=new hw(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(n=e[0])!=null&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Cw()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await pf(e,du,"1"),await gf(e,du)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>pf(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(n=>_w(n,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>gf(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(s=>{const i=Wu(s,!1).getAll();return new Jo(i).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],n=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)n.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!n.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}catch(e){return this.isClosing||ja(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const s of Array.from(n))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Ew)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}Eg.type="LOCAL";const Dw=Eg;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mf(r,e){return Ye(r,"POST","/v2/accounts/mfaSignIn:start",$e(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tB=sg("rcb"),yw=new jo(3e4,6e4);class ww{constructor(){var e;this.hostLanguage="",this.counter=0,this.librarySeparatelyLoaded=!!((e=Ue().grecaptcha)!=null&&e.render)}load(e,t=""){return W(Tw(t),e,"argument-error"),this.shouldResolveImmediately(t)&&rf(Ue().grecaptcha)?Promise.resolve(Ue().grecaptcha):new Promise((n,s)=>{const i=Ue().setTimeout(()=>{s(At(e,"network-request-failed"))},yw.get());Ue()[tB]=()=>{Ue().clearTimeout(i),delete Ue()[tB];const a=Ue().grecaptcha;if(!a||!rf(a)){s(At(e,"internal-error"));return}const u=a.render;a.render=(B,l)=>{const d=u(B,l);return this.counter++,d},this.hostLanguage=t,n(a)};const o=`${Cy()}?${li({onload:tB,render:"explicit",hl:t})}`;dl(o).catch(()=>{clearTimeout(i),s(At(e,"internal-error"))})})}clearedOneInstance(){this.counter--}shouldResolveImmediately(e){var t;return!!((t=Ue().grecaptcha)!=null&&t.render)&&(e===this.hostLanguage||this.counter>0||this.librarySeparatelyLoaded)}}function Tw(r){return r.length<=6&&/^\s*[a-zA-Z0-9\-]*\s*$/.test(r)}class Aw{async load(e){return new Ey(e)}clearedOneInstance(){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const io="recaptcha",Rw={theme:"light",type:"image"};class X0{constructor(e,t,n={...Rw}){this.parameters=n,this.type=io,this.destroyed=!1,this.widgetId=null,this.tokenChangeListeners=new Set,this.renderPromise=null,this.recaptcha=null,this.auth=st(e),this.isInvisible=this.parameters.size==="invisible",W(typeof document<"u",this.auth,"operation-not-supported-in-this-environment");const s=typeof t=="string"?document.getElementById(t):t;W(s,this.auth,"argument-error"),this.container=s,this.parameters.callback=this.makeTokenCallback(this.parameters.callback),this._recaptchaLoader=this.auth.settings.appVerificationDisabledForTesting?new Aw:new ww,this.validateStartingState()}async verify(){this.assertNotDestroyed();const e=await this.render(),t=this.getAssertedRecaptcha(),n=t.getResponse(e);return n||new Promise(s=>{const i=o=>{o&&(this.tokenChangeListeners.delete(i),s(o))};this.tokenChangeListeners.add(i),this.isInvisible&&t.execute(e)})}render(){try{this.assertNotDestroyed()}catch(e){return Promise.reject(e)}return this.renderPromise?this.renderPromise:(this.renderPromise=this.makeRenderPromise().catch(e=>{throw this.renderPromise=null,e}),this.renderPromise)}_reset(){this.assertNotDestroyed(),this.widgetId!==null&&this.getAssertedRecaptcha().reset(this.widgetId)}clear(){this.assertNotDestroyed(),this.destroyed=!0,this._recaptchaLoader.clearedOneInstance(),this.isInvisible||this.container.childNodes.forEach(e=>{this.container.removeChild(e)})}validateStartingState(){W(!this.parameters.sitekey,this.auth,"argument-error"),W(this.isInvisible||!this.container.hasChildNodes(),this.auth,"argument-error"),W(typeof document<"u",this.auth,"operation-not-supported-in-this-environment")}makeTokenCallback(e){return t=>{if(this.tokenChangeListeners.forEach(n=>n(t)),typeof e=="function")e(t);else if(typeof e=="string"){const n=Ue()[e];typeof n=="function"&&n(t)}}}assertNotDestroyed(){W(!this.destroyed,this.auth,"internal-error")}async makeRenderPromise(){if(await this.init(),!this.widgetId){let e=this.container;if(!this.isInvisible){const t=document.createElement("div");e.appendChild(t),e=t}this.widgetId=this.getAssertedRecaptcha().render(e,this.parameters)}return this.widgetId}async init(){W(Bl()&&!pl(),this.auth,"internal-error"),await vw(),this.recaptcha=await this._recaptchaLoader.load(this.auth,this.auth.languageCode||void 0);const e=await YD(this.auth);W(e,this.auth,"internal-error"),this.parameters.sitekey=e}getAssertedRecaptcha(){return W(this.recaptcha,this.auth,"internal-error"),this.recaptcha}}function vw(){let r=null;return new Promise(e=>{if(document.readyState==="complete"){e();return}r=()=>e(),window.addEventListener("load",r)}).catch(e=>{throw r&&window.removeEventListener("load",r),e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ig{constructor(e,t){this.verificationId=e,this.onConfirmation=t}confirm(e){const t=so._fromVerification(this.verificationId,e);return this.onConfirmation(t)}}async function Z0(r,e,t){if(qe(r.app))return Promise.reject(_t(r));const n=st(r),s=await Dg(n,e,ae(t));return new Ig(s,i=>fl(n,i))}async function eN(r,e,t){const n=ae(r);await Ku(!1,n,"phone");const s=await Dg(n.auth,e,ae(t));return new Ig(s,i=>Yy(n,i))}async function Dg(r,e,t){var n;if(!r._getRecaptchaConfig())try{await Ay(r)}catch{console.log("Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.")}try{let s;if(typeof e=="string"?s={phoneNumber:e}:s=e,"session"in s){const i=s.session;if("phoneNumber"in s){W(i.type==="enroll",r,"internal-error");const o={idToken:i.credential,phoneEnrollmentInfo:{phoneNumber:s.phoneNumber,clientType:"CLIENT_TYPE_WEB"}};return(await cr(r,o,"mfaSmsEnrollment",async(l,d)=>{if(d.phoneEnrollmentInfo.captchaResponse===ro){W((t==null?void 0:t.type)===io,l,"argument-error");const C=await nB(l,d,t);return Cf(l,C)}return Cf(l,d)},"PHONE_PROVIDER").catch(l=>Promise.reject(l))).phoneSessionInfo.sessionInfo}else{W(i.type==="signin",r,"internal-error");const o=((n=s.multiFactorHint)==null?void 0:n.uid)||s.multiFactorUid;W(o,r,"missing-multi-factor-info");const a={mfaPendingCredential:i.credential,mfaEnrollmentId:o,phoneSignInInfo:{clientType:"CLIENT_TYPE_WEB"}};return(await cr(r,a,"mfaSmsSignIn",async(d,C)=>{if(C.phoneSignInInfo.captchaResponse===ro){W((t==null?void 0:t.type)===io,d,"argument-error");const m=await nB(d,C,t);return mf(d,m)}return mf(d,C)},"PHONE_PROVIDER").catch(d=>Promise.reject(d))).phoneResponseInfo.sessionInfo}}else{const i={phoneNumber:s.phoneNumber,clientType:"CLIENT_TYPE_WEB"};return(await cr(r,i,"sendVerificationCode",async(B,l)=>{if(l.captchaResponse===ro){W((t==null?void 0:t.type)===io,B,"argument-error");const d=await nB(B,l,t);return df(B,d)}return df(B,l)},"PHONE_PROVIDER").catch(B=>Promise.reject(B))).sessionInfo}}finally{t==null||t._reset()}}async function nB(r,e,t){W(t.type===io,r,"argument-error");const n=await t.verify();W(typeof n=="string",r,"argument-error");const s={...e};if("phoneEnrollmentInfo"in s){const i=s.phoneEnrollmentInfo.phoneNumber,o=s.phoneEnrollmentInfo.captchaResponse,a=s.phoneEnrollmentInfo.clientType,u=s.phoneEnrollmentInfo.recaptchaVersion;return Object.assign(s,{phoneEnrollmentInfo:{phoneNumber:i,recaptchaToken:n,captchaResponse:o,clientType:a,recaptchaVersion:u}}),s}else if("phoneSignInInfo"in s){const i=s.phoneSignInInfo.captchaResponse,o=s.phoneSignInInfo.clientType,a=s.phoneSignInInfo.recaptchaVersion;return Object.assign(s,{phoneSignInInfo:{recaptchaToken:n,captchaResponse:i,clientType:o,recaptchaVersion:a}}),s}else return Object.assign(s,{recaptchaToken:n}),s}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zo(r,e){return e?Dn(e):(W(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gl extends Hu{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ks(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Ks(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Ks(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Pw(r){return Bg(r.auth,new gl(r),r.bypassAuthState)}function bw(r){const{auth:e,user:t}=r;return W(t,e,"internal-error"),$y(t,new gl(r),r.bypassAuthState)}async function Sw(r){const{auth:e,user:t}=r;return W(t,e,"internal-error"),cg(t,new gl(r),r.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yg{constructor(e,t,n,s,i=!1){this.auth=e,this.resolver=n,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:s,tenantId:i,error:o,type:a}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:t,sessionId:n,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(u))}catch(B){this.reject(B)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Pw;case"linkViaPopup":case"linkViaRedirect":return Sw;case"reauthViaPopup":case"reauthViaRedirect":return bw;default:Ht(this.auth,"internal-error")}}resolve(e){vn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){vn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nw=new jo(2e3,1e4);async function tN(r,e,t){if(qe(r.app))return Promise.reject(At(r,"operation-not-supported-in-this-environment"));const n=st(r);Gu(r,e,hi);const s=zo(n,t);return new sr(n,"signInViaPopup",e,s).executeNotNull()}async function nN(r,e,t){const n=ae(r);Gu(n.auth,e,hi);const s=zo(n.auth,t);return new sr(n.auth,"linkViaPopup",e,s,n).executeNotNull()}class sr extends yg{constructor(e,t,n,s,i){super(e,t,s,i),this.provider=n,this.authWindow=null,this.pollId=null,sr.currentPopupAction&&sr.currentPopupAction.cancel(),sr.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return W(e,this.auth,"internal-error"),e}async onExecution(){vn(this.filter.length===1,"Popup operations only handle one event");const e=Qu();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(At(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(At(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,sr.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;if((n=(t=this.authWindow)==null?void 0:t.window)!=null&&n.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(At(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Nw.get())};e()}}sr.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ow="pendingRedirect",Qa=new Map;class Fw extends yg{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=Qa.get(this.auth._key());if(!e){try{const n=await Lw(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(n)}catch(t){e=()=>Promise.reject(t)}Qa.set(this.auth._key(),e)}return this.bypassAuthState||Qa.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Lw(r,e){const t=Ag(e),n=Tg(r);if(!await n._isAvailable())return!1;const s=await n._get(t)==="true";return await n._remove(t),s}async function wg(r,e){return Tg(r)._set(Ag(e),"true")}function kw(r,e){Qa.set(r._key(),e)}function Tg(r){return Dn(r._redirectPersistence)}function Ag(r){return Ja(Ow,r.config.apiKey,r.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rN(r,e,t){return xw(r,e,t)}async function xw(r,e,t){if(qe(r.app))return Promise.reject(_t(r));const n=st(r);Gu(r,e,hi),await n._initializationPromise;const s=zo(n,t);return await wg(s,n),s._openRedirect(n,e,"signInViaRedirect")}function sN(r,e,t){return Vw(r,e,t)}async function Vw(r,e,t){const n=ae(r);Gu(n.auth,e,hi),await n.auth._initializationPromise;const s=zo(n.auth,t);await Ku(!1,n,e.providerId),await wg(s,n.auth);const i=await Mw(n);return s._openRedirect(n.auth,e,"linkViaRedirect",i)}async function iN(r,e){return await st(r)._initializationPromise,Rg(r,e,!1)}async function Rg(r,e,t=!1){if(qe(r.app))return Promise.reject(_t(r));const n=st(r),s=zo(n,e),o=await new Fw(n,s,t).execute();return o&&!t&&(delete o.user._redirectEventId,await n._persistUserIfCurrent(o.user),await n._setRedirectUser(null,e)),o}async function Mw(r){const e=Qu(`${r.uid}:::`);return r._redirectEventId=e,await r.auth._setRedirectUser(r),await r.auth._persistUserIfCurrent(r),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gw=10*60*1e3;class Uw{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Hw(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!vg(e)){const s=((n=e.error.code)==null?void 0:n.split("auth/")[1])||"internal-error";t.onError(At(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Gw&&this.cachedEventUids.clear(),this.cachedEventUids.has(_f(e))}saveEventToCache(e){this.cachedEventUids.add(_f(e)),this.lastProcessedEventTime=Date.now()}}function _f(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function vg({type:r,error:e}){return r==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Hw(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return vg(r);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qw(r,e={}){return Ye(r,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jw=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Kw=/^https?/;async function Jw(r){if(r.config.emulator)return;const{authorizedDomains:e}=await qw(r);for(const t of e)try{if(zw(t))return}catch{}Ht(r,"unauthorized-domain")}function zw(r){const e=Io(),{protocol:t,hostname:n}=new URL(e);if(r.startsWith("chrome-extension://")){const o=new URL(r);return o.hostname===""&&n===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===n}if(!Kw.test(t))return!1;if(jw.test(r))return n===r;const s=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(n)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qw=new jo(3e4,6e4);function Ef(){const r=Ue().___jsl;if(r!=null&&r.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function Ww(r){return new Promise((e,t)=>{var s,i,o;function n(){Ef(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Ef(),t(At(r,"network-request-failed"))},timeout:Qw.get()})}if((i=(s=Ue().gapi)==null?void 0:s.iframes)!=null&&i.Iframe)e(gapi.iframes.getContext());else if((o=Ue().gapi)!=null&&o.load)n();else{const a=sg("iframefcb");return Ue()[a]=()=>{gapi.load?n():t(At(r,"network-request-failed"))},dl(`${gy()}?onload=${a}`).catch(u=>t(u))}}).catch(e=>{throw Wa=null,e})}let Wa=null;function $w(r){return Wa=Wa||Ww(r),Wa}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yw=new jo(5e3,15e3),Xw="__/auth/iframe",Zw="emulator/auth/iframe",eT={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},tT=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function nT(r){const e=r.config;W(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?ll(e,Zw):`https://${r.config.authDomain}/${Xw}`,n={apiKey:e.apiKey,appName:r.name,v:ps},s=tT.get(r.config.apiHost);s&&(n.eid=s);const i=r._getFrameworks();return i.length&&(n.fw=i.join(",")),`${t}?${li(n).slice(1)}`}async function rT(r){const e=await $w(r),t=Ue().gapi;return W(t,r,"internal-error"),e.open({where:document.body,url:nT(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:eT,dontclear:!0},n=>new Promise(async(s,i)=>{await n.restyle({setHideOnLeave:!1});const o=At(r,"network-request-failed"),a=Ue().setTimeout(()=>{i(o)},Yw.get());function u(){Ue().clearTimeout(a),s(n)}n.ping(u).then(u,()=>{i(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sT={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},iT=500,oT=600,aT="_blank",uT="http://localhost";class If{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function cT(r,e,t,n=iT,s=oT){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-n)/2,0).toString();let a="";const u={...sT,width:n.toString(),height:s.toString(),top:i,left:o},B=We().toLowerCase();t&&(a=Yp(B)?aT:t),Wp(B)&&(e=e||uT,u.scrollbars="yes");const l=Object.entries(u).reduce((C,[m,y])=>`${C}${m}=${y},`,"");if(ay(B)&&a!=="_self")return BT(e||"",a),new If(null);const d=window.open(e||"",a,l);W(d,r,"popup-blocked");try{d.focus()}catch{}return new If(d)}function BT(r,e){const t=document.createElement("a");t.href=r,t.target=e;const n=document.createEvent("MouseEvent");n.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lT="__/auth/handler",hT="emulator/auth/handler",dT=encodeURIComponent("fac");async function Df(r,e,t,n,s,i){W(r.config.authDomain,r,"auth-domain-config-required"),W(r.config.apiKey,r,"invalid-api-key");const o={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:n,v:ps,eventId:s};if(e instanceof hi){e.setDefaultLanguage(r.languageCode),o.providerId=e.providerId||"",vI(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[l,d]of Object.entries({}))o[l]=d}if(e instanceof di){const l=e.getScopes().filter(d=>d!=="");l.length>0&&(o.scopes=l.join(","))}r.tenantId&&(o.tid=r.tenantId);const a=o;for(const l of Object.keys(a))a[l]===void 0&&delete a[l];const u=await r._getAppCheckToken(),B=u?`#${dT}=${encodeURIComponent(u)}`:"";return`${fT(r)}?${li(a).slice(1)}${B}`}function fT({config:r}){return r.emulator?ll(r,hT):`https://${r.authDomain}/${lT}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rB="webStorageSupport";class CT{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=pg,this._completeRedirectFn=Rg,this._overrideRedirectResult=kw}async _openPopup(e,t,n,s){var o;vn((o=this.eventManagers[e._key()])==null?void 0:o.manager,"_initialize() not called before _openPopup()");const i=await Df(e,t,n,Io(),s);return cT(e,i,Qu())}async _openRedirect(e,t,n,s){await this._originValidation(e);const i=await Df(e,t,n,Io(),s);return dw(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(vn(i,"If manager is not set, promise should be"),i)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await rT(e),n=new Uw(e);return t.register("authEvent",s=>(W(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:n.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(rB,{type:rB},s=>{var o;const i=(o=s==null?void 0:s[0])==null?void 0:o[rB];i!==void 0&&t(!!i),Ht(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Jw(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return ng()||$p()||hl()}}const pT=CT;var yf="@firebase/auth",wf="1.13.6";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gT{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(n=>{e((n==null?void 0:n.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){W(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mT(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function _T(r){ts(new Cr("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:a}=n.options;W(o&&!o.includes(":"),"invalid-api-key",{appName:n.name});const u={apiKey:o,authDomain:a,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:rg(r)},B=new dy(n,s,i,u);return vy(B,t),B},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),ts(new Cr("auth-internal",e=>{const t=st(e.getProvider("auth").getImmediate());return(n=>new gT(n))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),an(yf,wf,mT(r)),an(yf,wf,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ET=5*60,IT=Pp("authIdTokenMaxAge")||ET;let Tf=null;const DT=r=>async e=>{const t=e&&await e.getIdTokenResult(),n=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(n&&n>IT)return;const s=t==null?void 0:t.token;Tf!==s&&(Tf=s,await fetch(r,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function oN(r=xp()){const e=Vu(r,"auth");if(e.isInitialized())return e.getImmediate();const t=Ry(r,{popupRedirectResolver:pT,persistence:[Dw,Bw,pg]}),n=Pp("authTokenSyncURL");if(n&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(n,location.origin);if(location.origin===i.origin){const o=DT(i.toString());aw(t,o,()=>o(t.currentUser)),ow(t,a=>o(a))}}const s=Rp("auth");return s&&Py(t,`http://${s}`),t}function yT(){var r;return((r=document.getElementsByTagName("head"))==null?void 0:r[0])??document}fy({loadJS(r){return new Promise((e,t)=>{const n=document.createElement("script");n.setAttribute("src",r),n.onload=e,n.onerror=s=>{const i=At("internal-error");i.customData=s,t(i)},n.type="text/javascript",n.charset="UTF-8",yT().appendChild(n)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});_T("Browser");var Af=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Br,Pg;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(w,E){function D(){}D.prototype=E.prototype,w.F=E.prototype,w.prototype=new D,w.prototype.constructor=w,w.D=function(v,R,S){for(var I=Array(arguments.length-2),It=2;It<arguments.length;It++)I[It-2]=arguments[It];return E.prototype[R].apply(v,I)}}function t(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(n,t),n.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(w,E,D){D||(D=0);const v=Array(16);if(typeof E=="string")for(var R=0;R<16;++R)v[R]=E.charCodeAt(D++)|E.charCodeAt(D++)<<8|E.charCodeAt(D++)<<16|E.charCodeAt(D++)<<24;else for(R=0;R<16;++R)v[R]=E[D++]|E[D++]<<8|E[D++]<<16|E[D++]<<24;E=w.g[0],D=w.g[1],R=w.g[2];let S=w.g[3],I;I=E+(S^D&(R^S))+v[0]+3614090360&4294967295,E=D+(I<<7&4294967295|I>>>25),I=S+(R^E&(D^R))+v[1]+3905402710&4294967295,S=E+(I<<12&4294967295|I>>>20),I=R+(D^S&(E^D))+v[2]+606105819&4294967295,R=S+(I<<17&4294967295|I>>>15),I=D+(E^R&(S^E))+v[3]+3250441966&4294967295,D=R+(I<<22&4294967295|I>>>10),I=E+(S^D&(R^S))+v[4]+4118548399&4294967295,E=D+(I<<7&4294967295|I>>>25),I=S+(R^E&(D^R))+v[5]+1200080426&4294967295,S=E+(I<<12&4294967295|I>>>20),I=R+(D^S&(E^D))+v[6]+2821735955&4294967295,R=S+(I<<17&4294967295|I>>>15),I=D+(E^R&(S^E))+v[7]+4249261313&4294967295,D=R+(I<<22&4294967295|I>>>10),I=E+(S^D&(R^S))+v[8]+1770035416&4294967295,E=D+(I<<7&4294967295|I>>>25),I=S+(R^E&(D^R))+v[9]+2336552879&4294967295,S=E+(I<<12&4294967295|I>>>20),I=R+(D^S&(E^D))+v[10]+4294925233&4294967295,R=S+(I<<17&4294967295|I>>>15),I=D+(E^R&(S^E))+v[11]+2304563134&4294967295,D=R+(I<<22&4294967295|I>>>10),I=E+(S^D&(R^S))+v[12]+1804603682&4294967295,E=D+(I<<7&4294967295|I>>>25),I=S+(R^E&(D^R))+v[13]+4254626195&4294967295,S=E+(I<<12&4294967295|I>>>20),I=R+(D^S&(E^D))+v[14]+2792965006&4294967295,R=S+(I<<17&4294967295|I>>>15),I=D+(E^R&(S^E))+v[15]+1236535329&4294967295,D=R+(I<<22&4294967295|I>>>10),I=E+(R^S&(D^R))+v[1]+4129170786&4294967295,E=D+(I<<5&4294967295|I>>>27),I=S+(D^R&(E^D))+v[6]+3225465664&4294967295,S=E+(I<<9&4294967295|I>>>23),I=R+(E^D&(S^E))+v[11]+643717713&4294967295,R=S+(I<<14&4294967295|I>>>18),I=D+(S^E&(R^S))+v[0]+3921069994&4294967295,D=R+(I<<20&4294967295|I>>>12),I=E+(R^S&(D^R))+v[5]+3593408605&4294967295,E=D+(I<<5&4294967295|I>>>27),I=S+(D^R&(E^D))+v[10]+38016083&4294967295,S=E+(I<<9&4294967295|I>>>23),I=R+(E^D&(S^E))+v[15]+3634488961&4294967295,R=S+(I<<14&4294967295|I>>>18),I=D+(S^E&(R^S))+v[4]+3889429448&4294967295,D=R+(I<<20&4294967295|I>>>12),I=E+(R^S&(D^R))+v[9]+568446438&4294967295,E=D+(I<<5&4294967295|I>>>27),I=S+(D^R&(E^D))+v[14]+3275163606&4294967295,S=E+(I<<9&4294967295|I>>>23),I=R+(E^D&(S^E))+v[3]+4107603335&4294967295,R=S+(I<<14&4294967295|I>>>18),I=D+(S^E&(R^S))+v[8]+1163531501&4294967295,D=R+(I<<20&4294967295|I>>>12),I=E+(R^S&(D^R))+v[13]+2850285829&4294967295,E=D+(I<<5&4294967295|I>>>27),I=S+(D^R&(E^D))+v[2]+4243563512&4294967295,S=E+(I<<9&4294967295|I>>>23),I=R+(E^D&(S^E))+v[7]+1735328473&4294967295,R=S+(I<<14&4294967295|I>>>18),I=D+(S^E&(R^S))+v[12]+2368359562&4294967295,D=R+(I<<20&4294967295|I>>>12),I=E+(D^R^S)+v[5]+4294588738&4294967295,E=D+(I<<4&4294967295|I>>>28),I=S+(E^D^R)+v[8]+2272392833&4294967295,S=E+(I<<11&4294967295|I>>>21),I=R+(S^E^D)+v[11]+1839030562&4294967295,R=S+(I<<16&4294967295|I>>>16),I=D+(R^S^E)+v[14]+4259657740&4294967295,D=R+(I<<23&4294967295|I>>>9),I=E+(D^R^S)+v[1]+2763975236&4294967295,E=D+(I<<4&4294967295|I>>>28),I=S+(E^D^R)+v[4]+1272893353&4294967295,S=E+(I<<11&4294967295|I>>>21),I=R+(S^E^D)+v[7]+4139469664&4294967295,R=S+(I<<16&4294967295|I>>>16),I=D+(R^S^E)+v[10]+3200236656&4294967295,D=R+(I<<23&4294967295|I>>>9),I=E+(D^R^S)+v[13]+681279174&4294967295,E=D+(I<<4&4294967295|I>>>28),I=S+(E^D^R)+v[0]+3936430074&4294967295,S=E+(I<<11&4294967295|I>>>21),I=R+(S^E^D)+v[3]+3572445317&4294967295,R=S+(I<<16&4294967295|I>>>16),I=D+(R^S^E)+v[6]+76029189&4294967295,D=R+(I<<23&4294967295|I>>>9),I=E+(D^R^S)+v[9]+3654602809&4294967295,E=D+(I<<4&4294967295|I>>>28),I=S+(E^D^R)+v[12]+3873151461&4294967295,S=E+(I<<11&4294967295|I>>>21),I=R+(S^E^D)+v[15]+530742520&4294967295,R=S+(I<<16&4294967295|I>>>16),I=D+(R^S^E)+v[2]+3299628645&4294967295,D=R+(I<<23&4294967295|I>>>9),I=E+(R^(D|~S))+v[0]+4096336452&4294967295,E=D+(I<<6&4294967295|I>>>26),I=S+(D^(E|~R))+v[7]+1126891415&4294967295,S=E+(I<<10&4294967295|I>>>22),I=R+(E^(S|~D))+v[14]+2878612391&4294967295,R=S+(I<<15&4294967295|I>>>17),I=D+(S^(R|~E))+v[5]+4237533241&4294967295,D=R+(I<<21&4294967295|I>>>11),I=E+(R^(D|~S))+v[12]+1700485571&4294967295,E=D+(I<<6&4294967295|I>>>26),I=S+(D^(E|~R))+v[3]+2399980690&4294967295,S=E+(I<<10&4294967295|I>>>22),I=R+(E^(S|~D))+v[10]+4293915773&4294967295,R=S+(I<<15&4294967295|I>>>17),I=D+(S^(R|~E))+v[1]+2240044497&4294967295,D=R+(I<<21&4294967295|I>>>11),I=E+(R^(D|~S))+v[8]+1873313359&4294967295,E=D+(I<<6&4294967295|I>>>26),I=S+(D^(E|~R))+v[15]+4264355552&4294967295,S=E+(I<<10&4294967295|I>>>22),I=R+(E^(S|~D))+v[6]+2734768916&4294967295,R=S+(I<<15&4294967295|I>>>17),I=D+(S^(R|~E))+v[13]+1309151649&4294967295,D=R+(I<<21&4294967295|I>>>11),I=E+(R^(D|~S))+v[4]+4149444226&4294967295,E=D+(I<<6&4294967295|I>>>26),I=S+(D^(E|~R))+v[11]+3174756917&4294967295,S=E+(I<<10&4294967295|I>>>22),I=R+(E^(S|~D))+v[2]+718787259&4294967295,R=S+(I<<15&4294967295|I>>>17),I=D+(S^(R|~E))+v[9]+3951481745&4294967295,w.g[0]=w.g[0]+E&4294967295,w.g[1]=w.g[1]+(R+(I<<21&4294967295|I>>>11))&4294967295,w.g[2]=w.g[2]+R&4294967295,w.g[3]=w.g[3]+S&4294967295}n.prototype.v=function(w,E){E===void 0&&(E=w.length);const D=E-this.blockSize,v=this.C;let R=this.h,S=0;for(;S<E;){if(R==0)for(;S<=D;)s(this,w,S),S+=this.blockSize;if(typeof w=="string"){for(;S<E;)if(v[R++]=w.charCodeAt(S++),R==this.blockSize){s(this,v),R=0;break}}else for(;S<E;)if(v[R++]=w[S++],R==this.blockSize){s(this,v),R=0;break}}this.h=R,this.o+=E},n.prototype.A=function(){var w=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);w[0]=128;for(var E=1;E<w.length-8;++E)w[E]=0;E=this.o*8;for(var D=w.length-8;D<w.length;++D)w[D]=E&255,E/=256;for(this.v(w),w=Array(16),E=0,D=0;D<4;++D)for(let v=0;v<32;v+=8)w[E++]=this.g[D]>>>v&255;return w};function i(w,E){var D=a;return Object.prototype.hasOwnProperty.call(D,w)?D[w]:D[w]=E(w)}function o(w,E){this.h=E;const D=[];let v=!0;for(let R=w.length-1;R>=0;R--){const S=w[R]|0;v&&S==E||(D[R]=S,v=!1)}this.g=D}var a={};function u(w){return-128<=w&&w<128?i(w,function(E){return new o([E|0],E<0?-1:0)}):new o([w|0],w<0?-1:0)}function B(w){if(isNaN(w)||!isFinite(w))return d;if(w<0)return V(B(-w));const E=[];let D=1;for(let v=0;w>=D;v++)E[v]=w/D|0,D*=4294967296;return new o(E,0)}function l(w,E){if(w.length==0)throw Error("number format error: empty string");if(E=E||10,E<2||36<E)throw Error("radix out of range: "+E);if(w.charAt(0)=="-")return V(l(w.substring(1),E));if(w.indexOf("-")>=0)throw Error('number format error: interior "-" character');const D=B(Math.pow(E,8));let v=d;for(let S=0;S<w.length;S+=8){var R=Math.min(8,w.length-S);const I=parseInt(w.substring(S,S+R),E);R<8?(R=B(Math.pow(E,R)),v=v.j(R).add(B(I))):(v=v.j(D),v=v.add(B(I)))}return v}var d=u(0),C=u(1),m=u(16777216);r=o.prototype,r.m=function(){if(O(this))return-V(this).m();let w=0,E=1;for(let D=0;D<this.g.length;D++){const v=this.i(D);w+=(v>=0?v:4294967296+v)*E,E*=4294967296}return w},r.toString=function(w){if(w=w||10,w<2||36<w)throw Error("radix out of range: "+w);if(y(this))return"0";if(O(this))return"-"+V(this).toString(w);const E=B(Math.pow(w,6));var D=this;let v="";for(;;){const R=oe(D,E).g;D=z(D,R.j(E));let S=((D.g.length>0?D.g[0]:D.h)>>>0).toString(w);if(D=R,y(D))return S+v;for(;S.length<6;)S="0"+S;v=S+v}},r.i=function(w){return w<0?0:w<this.g.length?this.g[w]:this.h};function y(w){if(w.h!=0)return!1;for(let E=0;E<w.g.length;E++)if(w.g[E]!=0)return!1;return!0}function O(w){return w.h==-1}r.l=function(w){return w=z(this,w),O(w)?-1:y(w)?0:1};function V(w){const E=w.g.length,D=[];for(let v=0;v<E;v++)D[v]=~w.g[v];return new o(D,~w.h).add(C)}r.abs=function(){return O(this)?V(this):this},r.add=function(w){const E=Math.max(this.g.length,w.g.length),D=[];let v=0;for(let R=0;R<=E;R++){let S=v+(this.i(R)&65535)+(w.i(R)&65535),I=(S>>>16)+(this.i(R)>>>16)+(w.i(R)>>>16);v=I>>>16,S&=65535,I&=65535,D[R]=I<<16|S}return new o(D,D[D.length-1]&-2147483648?-1:0)};function z(w,E){return w.add(V(E))}r.j=function(w){if(y(this)||y(w))return d;if(O(this))return O(w)?V(this).j(V(w)):V(V(this).j(w));if(O(w))return V(this.j(V(w)));if(this.l(m)<0&&w.l(m)<0)return B(this.m()*w.m());const E=this.g.length+w.g.length,D=[];for(var v=0;v<2*E;v++)D[v]=0;for(v=0;v<this.g.length;v++)for(let R=0;R<w.g.length;R++){const S=this.i(v)>>>16,I=this.i(v)&65535,It=w.i(R)>>>16,vr=w.i(R)&65535;D[2*v+2*R]+=I*vr,Z(D,2*v+2*R),D[2*v+2*R+1]+=S*vr,Z(D,2*v+2*R+1),D[2*v+2*R+1]+=I*It,Z(D,2*v+2*R+1),D[2*v+2*R+2]+=S*It,Z(D,2*v+2*R+2)}for(w=0;w<E;w++)D[w]=D[2*w+1]<<16|D[2*w];for(w=E;w<2*E;w++)D[w]=0;return new o(D,0)};function Z(w,E){for(;(w[E]&65535)!=w[E];)w[E+1]+=w[E]>>>16,w[E]&=65535,E++}function ne(w,E){this.g=w,this.h=E}function oe(w,E){if(y(E))throw Error("division by zero");if(y(w))return new ne(d,d);if(O(w))return E=oe(V(w),E),new ne(V(E.g),V(E.h));if(O(E))return E=oe(w,V(E)),new ne(V(E.g),E.h);if(w.g.length>30){if(O(w)||O(E))throw Error("slowDivide_ only works with positive integers.");for(var D=C,v=E;v.l(w)<=0;)D=Be(D),v=Be(v);var R=ue(D,1),S=ue(v,1);for(v=ue(v,2),D=ue(D,2);!y(v);){var I=S.add(v);I.l(w)<=0&&(R=R.add(D),S=I),v=ue(v,1),D=ue(D,1)}return E=z(w,R.j(E)),new ne(R,E)}for(R=d;w.l(E)>=0;){for(D=Math.max(1,Math.floor(w.m()/E.m())),v=Math.ceil(Math.log(D)/Math.LN2),v=v<=48?1:Math.pow(2,v-48),S=B(D),I=S.j(E);O(I)||I.l(w)>0;)D-=v,S=B(D),I=S.j(E);y(S)&&(S=C),R=R.add(S),w=z(w,I)}return new ne(R,w)}r.B=function(w){return oe(this,w).h},r.and=function(w){const E=Math.max(this.g.length,w.g.length),D=[];for(let v=0;v<E;v++)D[v]=this.i(v)&w.i(v);return new o(D,this.h&w.h)},r.or=function(w){const E=Math.max(this.g.length,w.g.length),D=[];for(let v=0;v<E;v++)D[v]=this.i(v)|w.i(v);return new o(D,this.h|w.h)},r.xor=function(w){const E=Math.max(this.g.length,w.g.length),D=[];for(let v=0;v<E;v++)D[v]=this.i(v)^w.i(v);return new o(D,this.h^w.h)};function Be(w){const E=w.g.length+1,D=[];for(let v=0;v<E;v++)D[v]=w.i(v)<<1|w.i(v-1)>>>31;return new o(D,w.h)}function ue(w,E){const D=E>>5;E%=32;const v=w.g.length-D,R=[];for(let S=0;S<v;S++)R[S]=E>0?w.i(S+D)>>>E|w.i(S+D+1)<<32-E:w.i(S+D);return new o(R,w.h)}n.prototype.digest=n.prototype.A,n.prototype.reset=n.prototype.u,n.prototype.update=n.prototype.v,Pg=n,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.B,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=B,o.fromString=l,Br=o}).apply(typeof Af<"u"?Af:typeof self<"u"?self:typeof window<"u"?window:{});var va=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var bg,Xi,Sg,$a,AB,Ng,Og,Fg;(function(){var r,e=Object.defineProperty;function t(c){c=[typeof globalThis=="object"&&globalThis,c,typeof window=="object"&&window,typeof self=="object"&&self,typeof va=="object"&&va];for(var h=0;h<c.length;++h){var f=c[h];if(f&&f.Math==Math)return f}throw Error("Cannot find global object")}var n=t(this);function s(c,h){if(h)e:{var f=n;c=c.split(".");for(var p=0;p<c.length-1;p++){var b=c[p];if(!(b in f))break e;f=f[b]}c=c[c.length-1],p=f[c],h=h(p),h!=p&&h!=null&&e(f,c,{configurable:!0,writable:!0,value:h})}}s("Symbol.dispose",function(c){return c||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(c){return c||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(c){return c||function(h){var f=[],p;for(p in h)Object.prototype.hasOwnProperty.call(h,p)&&f.push([p,h[p]]);return f}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},o=this||self;function a(c){var h=typeof c;return h=="object"&&c!=null||h=="function"}function u(c,h,f){return c.call.apply(c.bind,arguments)}function B(c,h,f){return B=u,B.apply(null,arguments)}function l(c,h){var f=Array.prototype.slice.call(arguments,1);return function(){var p=f.slice();return p.push.apply(p,arguments),c.apply(this,p)}}function d(c,h){function f(){}f.prototype=h.prototype,c.Z=h.prototype,c.prototype=new f,c.prototype.constructor=c,c.Ob=function(p,b,F){for(var Q=Array(arguments.length-2),le=2;le<arguments.length;le++)Q[le-2]=arguments[le];return h.prototype[b].apply(p,Q)}}var C=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?c=>c&&AsyncContext.Snapshot.wrap(c):c=>c;function m(c){const h=c.length;if(h>0){const f=Array(h);for(let p=0;p<h;p++)f[p]=c[p];return f}return[]}function y(c,h){for(let p=1;p<arguments.length;p++){const b=arguments[p];var f=typeof b;if(f=f!="object"?f:b?Array.isArray(b)?"array":f:"null",f=="array"||f=="object"&&typeof b.length=="number"){f=c.length||0;const F=b.length||0;c.length=f+F;for(let Q=0;Q<F;Q++)c[f+Q]=b[Q]}else c.push(b)}}class O{constructor(h,f){this.i=h,this.j=f,this.h=0,this.g=null}get(){let h;return this.h>0?(this.h--,h=this.g,this.g=h.next,h.next=null):h=this.i(),h}}function V(c){o.setTimeout(()=>{throw c},0)}function z(){var c=w;let h=null;return c.g&&(h=c.g,c.g=c.g.next,c.g||(c.h=null),h.next=null),h}class Z{constructor(){this.h=this.g=null}add(h,f){const p=ne.get();p.set(h,f),this.h?this.h.next=p:this.g=p,this.h=p}}var ne=new O(()=>new oe,c=>c.reset());class oe{constructor(){this.next=this.g=this.h=null}set(h,f){this.h=h,this.g=f,this.next=null}reset(){this.next=this.g=this.h=null}}let Be,ue=!1,w=new Z,E=()=>{const c=Promise.resolve(void 0);Be=()=>{c.then(D)}};function D(){for(var c;c=z();){try{c.h.call(c.g)}catch(f){V(f)}var h=ne;h.j(c),h.h<100&&(h.h++,c.next=h.g,h.g=c)}ue=!1}function v(){this.u=this.u,this.C=this.C}v.prototype.u=!1,v.prototype.dispose=function(){this.u||(this.u=!0,this.N())},v.prototype[Symbol.dispose]=function(){this.dispose()},v.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function R(c,h){this.type=c,this.g=this.target=h,this.defaultPrevented=!1}R.prototype.h=function(){this.defaultPrevented=!0};var S=function(){if(!o.addEventListener||!Object.defineProperty)return!1;var c=!1,h=Object.defineProperty({},"passive",{get:function(){c=!0}});try{const f=()=>{};o.addEventListener("test",f,h),o.removeEventListener("test",f,h)}catch{}return c}();function I(c){return/^[\s\xa0]*$/.test(c)}function It(c,h){R.call(this,c?c.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,c&&this.init(c,h)}d(It,R),It.prototype.init=function(c,h){const f=this.type=c.type,p=c.changedTouches&&c.changedTouches.length?c.changedTouches[0]:null;this.target=c.target||c.srcElement,this.g=h,h=c.relatedTarget,h||(f=="mouseover"?h=c.fromElement:f=="mouseout"&&(h=c.toElement)),this.relatedTarget=h,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=c.clientX!==void 0?c.clientX:c.pageX,this.clientY=c.clientY!==void 0?c.clientY:c.pageY,this.screenX=c.screenX||0,this.screenY=c.screenY||0),this.button=c.button,this.key=c.key||"",this.ctrlKey=c.ctrlKey,this.altKey=c.altKey,this.shiftKey=c.shiftKey,this.metaKey=c.metaKey,this.pointerId=c.pointerId||0,this.pointerType=c.pointerType,this.state=c.state,this.i=c,c.defaultPrevented&&It.Z.h.call(this)},It.prototype.h=function(){It.Z.h.call(this);const c=this.i;c.preventDefault?c.preventDefault():c.returnValue=!1};var vr="closure_listenable_"+(Math.random()*1e6|0),SE=0;function NE(c,h,f,p,b){this.listener=c,this.proxy=null,this.src=h,this.type=f,this.capture=!!p,this.ha=b,this.key=++SE,this.da=this.fa=!1}function ha(c){c.da=!0,c.listener=null,c.proxy=null,c.src=null,c.ha=null}function da(c,h,f){for(const p in c)h.call(f,c[p],p,c)}function OE(c,h){for(const f in c)h.call(void 0,c[f],f,c)}function Kh(c){const h={};for(const f in c)h[f]=c[f];return h}const Jh="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function zh(c,h){let f,p;for(let b=1;b<arguments.length;b++){p=arguments[b];for(f in p)c[f]=p[f];for(let F=0;F<Jh.length;F++)f=Jh[F],Object.prototype.hasOwnProperty.call(p,f)&&(c[f]=p[f])}}function fa(c){this.src=c,this.g={},this.h=0}fa.prototype.add=function(c,h,f,p,b){const F=c.toString();c=this.g[F],c||(c=this.g[F]=[],this.h++);const Q=Ac(c,h,p,b);return Q>-1?(h=c[Q],f||(h.fa=!1)):(h=new NE(h,this.src,F,!!p,b),h.fa=f,c.push(h)),h};function Tc(c,h){const f=h.type;if(f in c.g){var p=c.g[f],b=Array.prototype.indexOf.call(p,h,void 0),F;(F=b>=0)&&Array.prototype.splice.call(p,b,1),F&&(ha(h),c.g[f].length==0&&(delete c.g[f],c.h--))}}function Ac(c,h,f,p){for(let b=0;b<c.length;++b){const F=c[b];if(!F.da&&F.listener==h&&F.capture==!!f&&F.ha==p)return b}return-1}var Rc="closure_lm_"+(Math.random()*1e6|0),vc={};function Qh(c,h,f,p,b){if(Array.isArray(h)){for(let F=0;F<h.length;F++)Qh(c,h[F],f,p,b);return null}return f=Yh(f),c&&c[vr]?c.J(h,f,a(p)?!!p.capture:!1,b):FE(c,h,f,!1,p,b)}function FE(c,h,f,p,b,F){if(!h)throw Error("Invalid event type");const Q=a(b)?!!b.capture:!!b;let le=bc(c);if(le||(c[Rc]=le=new fa(c)),f=le.add(h,f,p,Q,F),f.proxy)return f;if(p=LE(),f.proxy=p,p.src=c,p.listener=f,c.addEventListener)S||(b=Q),b===void 0&&(b=!1),c.addEventListener(h.toString(),p,b);else if(c.attachEvent)c.attachEvent($h(h.toString()),p);else if(c.addListener&&c.removeListener)c.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return f}function LE(){function c(f){return h.call(c.src,c.listener,f)}const h=kE;return c}function Wh(c,h,f,p,b){if(Array.isArray(h))for(var F=0;F<h.length;F++)Wh(c,h[F],f,p,b);else p=a(p)?!!p.capture:!!p,f=Yh(f),c&&c[vr]?(c=c.i,F=String(h).toString(),F in c.g&&(h=c.g[F],f=Ac(h,f,p,b),f>-1&&(ha(h[f]),Array.prototype.splice.call(h,f,1),h.length==0&&(delete c.g[F],c.h--)))):c&&(c=bc(c))&&(h=c.g[h.toString()],c=-1,h&&(c=Ac(h,f,p,b)),(f=c>-1?h[c]:null)&&Pc(f))}function Pc(c){if(typeof c!="number"&&c&&!c.da){var h=c.src;if(h&&h[vr])Tc(h.i,c);else{var f=c.type,p=c.proxy;h.removeEventListener?h.removeEventListener(f,p,c.capture):h.detachEvent?h.detachEvent($h(f),p):h.addListener&&h.removeListener&&h.removeListener(p),(f=bc(h))?(Tc(f,c),f.h==0&&(f.src=null,h[Rc]=null)):ha(c)}}}function $h(c){return c in vc?vc[c]:vc[c]="on"+c}function kE(c,h){if(c.da)c=!0;else{h=new It(h,this);const f=c.listener,p=c.ha||c.src;c.fa&&Pc(c),c=f.call(p,h)}return c}function bc(c){return c=c[Rc],c instanceof fa?c:null}var Sc="__closure_events_fn_"+(Math.random()*1e9>>>0);function Yh(c){return typeof c=="function"?c:(c[Sc]||(c[Sc]=function(h){return c.handleEvent(h)}),c[Sc])}function at(){v.call(this),this.i=new fa(this),this.M=this,this.G=null}d(at,v),at.prototype[vr]=!0,at.prototype.removeEventListener=function(c,h,f,p){Wh(this,c,h,f,p)};function Ct(c,h){var f,p=c.G;if(p)for(f=[];p;p=p.G)f.push(p);if(c=c.M,p=h.type||h,typeof h=="string")h=new R(h,c);else if(h instanceof R)h.target=h.target||c;else{var b=h;h=new R(p,c),zh(h,b)}b=!0;let F,Q;if(f)for(Q=f.length-1;Q>=0;Q--)F=h.g=f[Q],b=Ca(F,p,!0,h)&&b;if(F=h.g=c,b=Ca(F,p,!0,h)&&b,b=Ca(F,p,!1,h)&&b,f)for(Q=0;Q<f.length;Q++)F=h.g=f[Q],b=Ca(F,p,!1,h)&&b}at.prototype.N=function(){if(at.Z.N.call(this),this.i){var c=this.i;for(const h in c.g){const f=c.g[h];for(let p=0;p<f.length;p++)ha(f[p]);delete c.g[h],c.h--}}this.G=null},at.prototype.J=function(c,h,f,p){return this.i.add(String(c),h,!1,f,p)},at.prototype.K=function(c,h,f,p){return this.i.add(String(c),h,!0,f,p)};function Ca(c,h,f,p){if(h=c.i.g[String(h)],!h)return!0;h=h.concat();let b=!0;for(let F=0;F<h.length;++F){const Q=h[F];if(Q&&!Q.da&&Q.capture==f){const le=Q.listener,Je=Q.ha||Q.src;Q.fa&&Tc(c.i,Q),b=le.call(Je,p)!==!1&&b}}return b&&!p.defaultPrevented}function xE(c,h){if(typeof c!="function")if(c&&typeof c.handleEvent=="function")c=B(c.handleEvent,c);else throw Error("Invalid listener argument");return Number(h)>2147483647?-1:o.setTimeout(c,h||0)}function Xh(c){c.g=xE(()=>{c.g=null,c.i&&(c.i=!1,Xh(c))},c.l);const h=c.h;c.h=null,c.m.apply(null,h)}class VE extends v{constructor(h,f){super(),this.m=h,this.l=f,this.h=null,this.i=!1,this.g=null}j(h){this.h=arguments,this.g?this.i=!0:Xh(this)}N(){super.N(),this.g&&(o.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Ti(c){v.call(this),this.h=c,this.g={}}d(Ti,v);var Zh=[];function ed(c){da(c.g,function(h,f){this.g.hasOwnProperty(f)&&Pc(h)},c),c.g={}}Ti.prototype.N=function(){Ti.Z.N.call(this),ed(this)},Ti.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Nc=o.JSON.stringify,ME=o.JSON.parse,GE=class{stringify(c){return o.JSON.stringify(c,void 0)}parse(c){return o.JSON.parse(c,void 0)}};function td(){}function nd(){}var Ai={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Oc(){R.call(this,"d")}d(Oc,R);function Fc(){R.call(this,"c")}d(Fc,R);var Pr={},rd=null;function pa(){return rd=rd||new at}Pr.Ia="serverreachability";function sd(c){R.call(this,Pr.Ia,c)}d(sd,R);function Ri(c){const h=pa();Ct(h,new sd(h))}Pr.STAT_EVENT="statevent";function id(c,h){R.call(this,Pr.STAT_EVENT,c),this.stat=h}d(id,R);function pt(c){const h=pa();Ct(h,new id(h,c))}Pr.Ja="timingevent";function od(c,h){R.call(this,Pr.Ja,c),this.size=h}d(od,R);function vi(c,h){if(typeof c!="function")throw Error("Fn must not be null and must be a function");return o.setTimeout(function(){c()},h)}function Pi(){this.g=!0}Pi.prototype.ua=function(){this.g=!1};function UE(c,h,f,p,b,F){c.info(function(){if(c.g)if(F){var Q="",le=F.split("&");for(let De=0;De<le.length;De++){var Je=le[De].split("=");if(Je.length>1){const Ze=Je[0];Je=Je[1];const $t=Ze.split("_");Q=$t.length>=2&&$t[1]=="type"?Q+(Ze+"="+Je+"&"):Q+(Ze+"=redacted&")}}}else Q=null;else Q=F;return"XMLHTTP REQ ("+p+") [attempt "+b+"]: "+h+`
`+f+`
`+Q})}function HE(c,h,f,p,b,F,Q){c.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+b+"]: "+h+`
`+f+`
`+F+" "+Q})}function Ts(c,h,f,p){c.info(function(){return"XMLHTTP TEXT ("+h+"): "+jE(c,f)+(p?" "+p:"")})}function qE(c,h){c.info(function(){return"TIMEOUT: "+h})}Pi.prototype.info=function(){};function jE(c,h){if(!c.g)return h;if(!h)return null;try{const F=JSON.parse(h);if(F){for(c=0;c<F.length;c++)if(Array.isArray(F[c])){var f=F[c];if(!(f.length<2)){var p=f[1];if(Array.isArray(p)&&!(p.length<1)){var b=p[0];if(b!="noop"&&b!="stop"&&b!="close")for(let Q=1;Q<p.length;Q++)p[Q]=""}}}}return Nc(F)}catch{return h}}var ga={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},ad={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},ud;function Lc(){}d(Lc,td),Lc.prototype.g=function(){return new XMLHttpRequest},ud=new Lc;function bi(c){return encodeURIComponent(String(c))}function KE(c){var h=1;c=c.split(":");const f=[];for(;h>0&&c.length;)f.push(c.shift()),h--;return c.length&&f.push(c.join(":")),f}function Vn(c,h,f,p){this.j=c,this.i=h,this.l=f,this.S=p||1,this.V=new Ti(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new cd}function cd(){this.i=null,this.g="",this.h=!1}var Bd={},kc={};function xc(c,h,f){c.M=1,c.A=_a(Wt(h)),c.u=f,c.R=!0,ld(c,null)}function ld(c,h){c.F=Date.now(),ma(c),c.B=Wt(c.A);var f=c.B,p=c.S;Array.isArray(p)||(p=[String(p)]),wd(f.i,"t",p),c.C=0,f=c.j.L,c.h=new cd,c.g=Hd(c.j,f?h:null,!c.u),c.P>0&&(c.O=new VE(B(c.Y,c,c.g),c.P)),h=c.V,f=c.g,p=c.ba;var b="readystatechange";Array.isArray(b)||(b&&(Zh[0]=b.toString()),b=Zh);for(let F=0;F<b.length;F++){const Q=Qh(f,b[F],p||h.handleEvent,!1,h.h||h);if(!Q)break;h.g[Q.key]=Q}h=c.J?Kh(c.J):{},c.u?(c.v||(c.v="POST"),h["Content-Type"]="application/x-www-form-urlencoded",c.g.ea(c.B,c.v,c.u,h)):(c.v="GET",c.g.ea(c.B,c.v,null,h)),Ri(),UE(c.i,c.v,c.B,c.l,c.S,c.u)}Vn.prototype.ba=function(c){c=c.target;const h=this.O;h&&Un(c)==3?h.j():this.Y(c)},Vn.prototype.Y=function(c){try{if(c==this.g)e:{const le=Un(this.g),Je=this.g.ya(),De=this.g.ca();if(!(le<3)&&(le!=3||this.g&&(this.h.h||this.g.la()||Sd(this.g)))){this.K||le!=4||Je==7||(Je==8||De<=0?Ri(3):Ri(2)),Vc(this);var h=this.g.ca();this.X=h;var f=JE(this);if(this.o=h==200,HE(this.i,this.v,this.B,this.l,this.S,le,h),this.o){if(this.U&&!this.L){t:{if(this.g){var p,b=this.g;if((p=b.g?b.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!I(p)){var F=p;break t}}F=null}if(c=F)Ts(this.i,this.l,c,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Mc(this,c);else{this.o=!1,this.m=3,pt(12),br(this),Si(this);break e}}if(this.R){c=!0;let Ze;for(;!this.K&&this.C<f.length;)if(Ze=zE(this,f),Ze==kc){le==4&&(this.m=4,pt(14),c=!1),Ts(this.i,this.l,null,"[Incomplete Response]");break}else if(Ze==Bd){this.m=4,pt(15),Ts(this.i,this.l,f,"[Invalid Chunk]"),c=!1;break}else Ts(this.i,this.l,Ze,null),Mc(this,Ze);if(hd(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),le!=4||f.length!=0||this.h.h||(this.m=1,pt(16),c=!1),this.o=this.o&&c,!c)Ts(this.i,this.l,f,"[Invalid Chunked Response]"),br(this),Si(this);else if(f.length>0&&!this.W){this.W=!0;var Q=this.j;Q.g==this&&Q.aa&&!Q.P&&(Q.j.info("Great, no buffering proxy detected. Bytes received: "+f.length),zc(Q),Q.P=!0,pt(11))}}else Ts(this.i,this.l,f,null),Mc(this,f);le==4&&br(this),this.o&&!this.K&&(le==4?Vd(this.j,this):(this.o=!1,ma(this)))}else aI(this.g),h==400&&f.indexOf("Unknown SID")>0?(this.m=3,pt(12)):(this.m=0,pt(13)),br(this),Si(this)}}}catch{}finally{}};function JE(c){if(!hd(c))return c.g.la();const h=Sd(c.g);if(h==="")return"";let f="";const p=h.length,b=Un(c.g)==4;if(!c.h.i){if(typeof TextDecoder>"u")return br(c),Si(c),"";c.h.i=new o.TextDecoder}for(let F=0;F<p;F++)c.h.h=!0,f+=c.h.i.decode(h[F],{stream:!(b&&F==p-1)});return h.length=0,c.h.g+=f,c.C=0,c.h.g}function hd(c){return c.g?c.v=="GET"&&c.M!=2&&c.j.Aa:!1}function zE(c,h){var f=c.C,p=h.indexOf(`
`,f);return p==-1?kc:(f=Number(h.substring(f,p)),isNaN(f)?Bd:(p+=1,p+f>h.length?kc:(h=h.slice(p,p+f),c.C=p+f,h)))}Vn.prototype.cancel=function(){this.K=!0,br(this)};function ma(c){c.T=Date.now()+c.H,dd(c,c.H)}function dd(c,h){if(c.D!=null)throw Error("WatchDog timer not null");c.D=vi(B(c.aa,c),h)}function Vc(c){c.D&&(o.clearTimeout(c.D),c.D=null)}Vn.prototype.aa=function(){this.D=null;const c=Date.now();c-this.T>=0?(qE(this.i,this.B),this.M!=2&&(Ri(),pt(17)),br(this),this.m=2,Si(this)):dd(this,this.T-c)};function Si(c){c.j.I==0||c.K||Vd(c.j,c)}function br(c){Vc(c);var h=c.O;h&&typeof h.dispose=="function"&&h.dispose(),c.O=null,ed(c.V),c.g&&(h=c.g,c.g=null,h.abort(),h.dispose())}function Mc(c,h){try{var f=c.j;if(f.I!=0&&(f.g==c||Gc(f.h,c))){if(!c.L&&Gc(f.h,c)&&f.I==3){try{var p=f.Ba.g.parse(h)}catch{p=null}if(Array.isArray(p)&&p.length==3){var b=p;if(b[0]==0){e:if(!f.v){if(f.g)if(f.g.F+3e3<c.F)wa(f),Da(f);else break e;Jc(f),pt(18)}}else f.xa=b[1],0<f.xa-f.K&&b[2]<37500&&f.F&&f.A==0&&!f.C&&(f.C=vi(B(f.Va,f),6e3));pd(f.h)<=1&&f.ta&&(f.ta=void 0)}else Nr(f,11)}else if((c.L||f.g==c)&&wa(f),!I(h))for(b=f.Ba.g.parse(h),h=0;h<b.length;h++){let De=b[h];const Ze=De[0];if(!(Ze<=f.K))if(f.K=Ze,De=De[1],f.I==2)if(De[0]=="c"){f.M=De[1],f.ba=De[2];const $t=De[3];$t!=null&&(f.ka=$t,f.j.info("VER="+f.ka));const Or=De[4];Or!=null&&(f.za=Or,f.j.info("SVER="+f.za));const Hn=De[5];Hn!=null&&typeof Hn=="number"&&Hn>0&&(p=1.5*Hn,f.O=p,f.j.info("backChannelRequestTimeoutMs_="+p)),p=f;const qn=c.g;if(qn){const Aa=qn.g?qn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Aa){var F=p.h;F.g||Aa.indexOf("spdy")==-1&&Aa.indexOf("quic")==-1&&Aa.indexOf("h2")==-1||(F.j=F.l,F.g=new Set,F.h&&(Uc(F,F.h),F.h=null))}if(p.G){const Qc=qn.g?qn.g.getResponseHeader("X-HTTP-Session-Id"):null;Qc&&(p.wa=Qc,ve(p.J,p.G,Qc))}}f.I=3,f.l&&f.l.ra(),f.aa&&(f.T=Date.now()-c.F,f.j.info("Handshake RTT: "+f.T+"ms")),p=f;var Q=c;if(p.na=Ud(p,p.L?p.ba:null,p.W),Q.L){gd(p.h,Q);var le=Q,Je=p.O;Je&&(le.H=Je),le.D&&(Vc(le),ma(le)),p.g=Q}else kd(p);f.i.length>0&&ya(f)}else De[0]!="stop"&&De[0]!="close"||Nr(f,7);else f.I==3&&(De[0]=="stop"||De[0]=="close"?De[0]=="stop"?Nr(f,7):Kc(f):De[0]!="noop"&&f.l&&f.l.qa(De),f.A=0)}}Ri(4)}catch{}}var QE=class{constructor(c,h){this.g=c,this.map=h}};function fd(c){this.l=c||10,o.PerformanceNavigationTiming?(c=o.performance.getEntriesByType("navigation"),c=c.length>0&&(c[0].nextHopProtocol=="hq"||c[0].nextHopProtocol=="h2")):c=!!(o.chrome&&o.chrome.loadTimes&&o.chrome.loadTimes()&&o.chrome.loadTimes().wasFetchedViaSpdy),this.j=c?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function Cd(c){return c.h?!0:c.g?c.g.size>=c.j:!1}function pd(c){return c.h?1:c.g?c.g.size:0}function Gc(c,h){return c.h?c.h==h:c.g?c.g.has(h):!1}function Uc(c,h){c.g?c.g.add(h):c.h=h}function gd(c,h){c.h&&c.h==h?c.h=null:c.g&&c.g.has(h)&&c.g.delete(h)}fd.prototype.cancel=function(){if(this.i=md(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const c of this.g.values())c.cancel();this.g.clear()}};function md(c){if(c.h!=null)return c.i.concat(c.h.G);if(c.g!=null&&c.g.size!==0){let h=c.i;for(const f of c.g.values())h=h.concat(f.G);return h}return m(c.i)}var _d=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function WE(c,h){if(c){c=c.split("&");for(let f=0;f<c.length;f++){const p=c[f].indexOf("=");let b,F=null;p>=0?(b=c[f].substring(0,p),F=c[f].substring(p+1)):b=c[f],h(b,F?decodeURIComponent(F.replace(/\+/g," ")):"")}}}function Mn(c){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let h;c instanceof Mn?(this.l=c.l,Ni(this,c.j),this.o=c.o,this.g=c.g,Oi(this,c.u),this.h=c.h,Hc(this,Td(c.i)),this.m=c.m):c&&(h=String(c).match(_d))?(this.l=!1,Ni(this,h[1]||"",!0),this.o=Fi(h[2]||""),this.g=Fi(h[3]||"",!0),Oi(this,h[4]),this.h=Fi(h[5]||"",!0),Hc(this,h[6]||"",!0),this.m=Fi(h[7]||"")):(this.l=!1,this.i=new ki(null,this.l))}Mn.prototype.toString=function(){const c=[];var h=this.j;h&&c.push(Li(h,Ed,!0),":");var f=this.g;return(f||h=="file")&&(c.push("//"),(h=this.o)&&c.push(Li(h,Ed,!0),"@"),c.push(bi(f).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),f=this.u,f!=null&&c.push(":",String(f))),(f=this.h)&&(this.g&&f.charAt(0)!="/"&&c.push("/"),c.push(Li(f,f.charAt(0)=="/"?XE:YE,!0))),(f=this.i.toString())&&c.push("?",f),(f=this.m)&&c.push("#",Li(f,eI)),c.join("")},Mn.prototype.resolve=function(c){const h=Wt(this);let f=!!c.j;f?Ni(h,c.j):f=!!c.o,f?h.o=c.o:f=!!c.g,f?h.g=c.g:f=c.u!=null;var p=c.h;if(f)Oi(h,c.u);else if(f=!!c.h){if(p.charAt(0)!="/")if(this.g&&!this.h)p="/"+p;else{var b=h.h.lastIndexOf("/");b!=-1&&(p=h.h.slice(0,b+1)+p)}if(b=p,b==".."||b==".")p="";else if(b.indexOf("./")!=-1||b.indexOf("/.")!=-1){p=b.lastIndexOf("/",0)==0,b=b.split("/");const F=[];for(let Q=0;Q<b.length;){const le=b[Q++];le=="."?p&&Q==b.length&&F.push(""):le==".."?((F.length>1||F.length==1&&F[0]!="")&&F.pop(),p&&Q==b.length&&F.push("")):(F.push(le),p=!0)}p=F.join("/")}else p=b}return f?h.h=p:f=c.i.toString()!=="",f?Hc(h,Td(c.i)):f=!!c.m,f&&(h.m=c.m),h};function Wt(c){return new Mn(c)}function Ni(c,h,f){c.j=f?Fi(h,!0):h,c.j&&(c.j=c.j.replace(/:$/,""))}function Oi(c,h){if(h){if(h=Number(h),isNaN(h)||h<0)throw Error("Bad port number "+h);c.u=h}else c.u=null}function Hc(c,h,f){h instanceof ki?(c.i=h,tI(c.i,c.l)):(f||(h=Li(h,ZE)),c.i=new ki(h,c.l))}function ve(c,h,f){c.i.set(h,f)}function _a(c){return ve(c,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),c}function Fi(c,h){return c?h?decodeURI(c.replace(/%25/g,"%2525")):decodeURIComponent(c):""}function Li(c,h,f){return typeof c=="string"?(c=encodeURI(c).replace(h,$E),f&&(c=c.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),c):null}function $E(c){return c=c.charCodeAt(0),"%"+(c>>4&15).toString(16)+(c&15).toString(16)}var Ed=/[#\/\?@]/g,YE=/[#\?:]/g,XE=/[#\?]/g,ZE=/[#\?@]/g,eI=/#/g;function ki(c,h){this.h=this.g=null,this.i=c||null,this.j=!!h}function Sr(c){c.g||(c.g=new Map,c.h=0,c.i&&WE(c.i,function(h,f){c.add(decodeURIComponent(h.replace(/\+/g," ")),f)}))}r=ki.prototype,r.add=function(c,h){Sr(this),this.i=null,c=As(this,c);let f=this.g.get(c);return f||this.g.set(c,f=[]),f.push(h),this.h+=1,this};function Id(c,h){Sr(c),h=As(c,h),c.g.has(h)&&(c.i=null,c.h-=c.g.get(h).length,c.g.delete(h))}function Dd(c,h){return Sr(c),h=As(c,h),c.g.has(h)}r.forEach=function(c,h){Sr(this),this.g.forEach(function(f,p){f.forEach(function(b){c.call(h,b,p,this)},this)},this)};function yd(c,h){Sr(c);let f=[];if(typeof h=="string")Dd(c,h)&&(f=f.concat(c.g.get(As(c,h))));else for(c=Array.from(c.g.values()),h=0;h<c.length;h++)f=f.concat(c[h]);return f}r.set=function(c,h){return Sr(this),this.i=null,c=As(this,c),Dd(this,c)&&(this.h-=this.g.get(c).length),this.g.set(c,[h]),this.h+=1,this},r.get=function(c,h){return c?(c=yd(this,c),c.length>0?String(c[0]):h):h};function wd(c,h,f){Id(c,h),f.length>0&&(c.i=null,c.g.set(As(c,h),m(f)),c.h+=f.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const c=[],h=Array.from(this.g.keys());for(let p=0;p<h.length;p++){var f=h[p];const b=bi(f);f=yd(this,f);for(let F=0;F<f.length;F++){let Q=b;f[F]!==""&&(Q+="="+bi(f[F])),c.push(Q)}}return this.i=c.join("&")};function Td(c){const h=new ki;return h.i=c.i,c.g&&(h.g=new Map(c.g),h.h=c.h),h}function As(c,h){return h=String(h),c.j&&(h=h.toLowerCase()),h}function tI(c,h){h&&!c.j&&(Sr(c),c.i=null,c.g.forEach(function(f,p){const b=p.toLowerCase();p!=b&&(Id(this,p),wd(this,b,f))},c)),c.j=h}function nI(c,h){const f=new Pi;if(o.Image){const p=new Image;p.onload=l(Gn,f,"TestLoadImage: loaded",!0,h,p),p.onerror=l(Gn,f,"TestLoadImage: error",!1,h,p),p.onabort=l(Gn,f,"TestLoadImage: abort",!1,h,p),p.ontimeout=l(Gn,f,"TestLoadImage: timeout",!1,h,p),o.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=c}else h(!1)}function rI(c,h){const f=new Pi,p=new AbortController,b=setTimeout(()=>{p.abort(),Gn(f,"TestPingServer: timeout",!1,h)},1e4);fetch(c,{signal:p.signal}).then(F=>{clearTimeout(b),F.ok?Gn(f,"TestPingServer: ok",!0,h):Gn(f,"TestPingServer: server error",!1,h)}).catch(()=>{clearTimeout(b),Gn(f,"TestPingServer: error",!1,h)})}function Gn(c,h,f,p,b){try{b&&(b.onload=null,b.onerror=null,b.onabort=null,b.ontimeout=null),p(f)}catch{}}function sI(){this.g=new GE}function qc(c){this.i=c.Sb||null,this.h=c.ab||!1}d(qc,td),qc.prototype.g=function(){return new Ea(this.i,this.h)};function Ea(c,h){at.call(this),this.H=c,this.o=h,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}d(Ea,at),r=Ea.prototype,r.open=function(c,h){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=c,this.D=h,this.readyState=1,Vi(this)},r.send=function(c){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const h={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};c&&(h.body=c),(this.H||o).fetch(new Request(this.D,h)).then(this.Pa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,xi(this)),this.readyState=0},r.Pa=function(c){if(this.g&&(this.l=c,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=c.headers,this.readyState=2,Vi(this)),this.g&&(this.readyState=3,Vi(this),this.g)))if(this.responseType==="arraybuffer")c.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof o.ReadableStream<"u"&&"body"in c){if(this.j=c.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Ad(this)}else c.text().then(this.Oa.bind(this),this.ga.bind(this))};function Ad(c){c.j.read().then(c.Ma.bind(c)).catch(c.ga.bind(c))}r.Ma=function(c){if(this.g){if(this.o&&c.value)this.response.push(c.value);else if(!this.o){var h=c.value?c.value:new Uint8Array(0);(h=this.B.decode(h,{stream:!c.done}))&&(this.response=this.responseText+=h)}c.done?xi(this):Vi(this),this.readyState==3&&Ad(this)}},r.Oa=function(c){this.g&&(this.response=this.responseText=c,xi(this))},r.Na=function(c){this.g&&(this.response=c,xi(this))},r.ga=function(){this.g&&xi(this)};function xi(c){c.readyState=4,c.l=null,c.j=null,c.B=null,Vi(c)}r.setRequestHeader=function(c,h){this.A.append(c,h)},r.getResponseHeader=function(c){return this.h&&this.h.get(c.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const c=[],h=this.h.entries();for(var f=h.next();!f.done;)f=f.value,c.push(f[0]+": "+f[1]),f=h.next();return c.join(`\r
`)};function Vi(c){c.onreadystatechange&&c.onreadystatechange.call(c)}Object.defineProperty(Ea.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(c){this.m=c?"include":"same-origin"}});function Rd(c){let h="";return da(c,function(f,p){h+=p,h+=":",h+=f,h+=`\r
`}),h}function jc(c,h,f){e:{for(p in f){var p=!1;break e}p=!0}p||(f=Rd(f),typeof c=="string"?f!=null&&bi(f):ve(c,h,f))}function Le(c){at.call(this),this.headers=new Map,this.L=c||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}d(Le,at);var iI=/^https?$/i,oI=["POST","PUT"];r=Le.prototype,r.Fa=function(c){this.H=c},r.ea=function(c,h,f,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+c);h=h?h.toUpperCase():"GET",this.D=c,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():ud.g(),this.g.onreadystatechange=C(B(this.Ca,this));try{this.B=!0,this.g.open(h,String(c),!0),this.B=!1}catch(F){vd(this,F);return}if(c=f||"",f=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var b in p)f.set(b,p[b]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const F of p.keys())f.set(F,p.get(F));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(f.keys()).find(F=>F.toLowerCase()=="content-type"),b=o.FormData&&c instanceof o.FormData,!(Array.prototype.indexOf.call(oI,h,void 0)>=0)||p||b||f.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[F,Q]of f)this.g.setRequestHeader(F,Q);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(c),this.v=!1}catch(F){vd(this,F)}};function vd(c,h){c.h=!1,c.g&&(c.j=!0,c.g.abort(),c.j=!1),c.l=h,c.o=5,Pd(c),Ia(c)}function Pd(c){c.A||(c.A=!0,Ct(c,"complete"),Ct(c,"error"))}r.abort=function(c){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=c||7,Ct(this,"complete"),Ct(this,"abort"),Ia(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Ia(this,!0)),Le.Z.N.call(this)},r.Ca=function(){this.u||(this.B||this.v||this.j?bd(this):this.Xa())},r.Xa=function(){bd(this)};function bd(c){if(c.h&&typeof i<"u"){if(c.v&&Un(c)==4)setTimeout(c.Ca.bind(c),0);else if(Ct(c,"readystatechange"),Un(c)==4){c.h=!1;try{const F=c.ca();e:switch(F){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var h=!0;break e;default:h=!1}var f;if(!(f=h)){var p;if(p=F===0){let Q=String(c.D).match(_d)[1]||null;!Q&&o.self&&o.self.location&&(Q=o.self.location.protocol.slice(0,-1)),p=!iI.test(Q?Q.toLowerCase():"")}f=p}if(f)Ct(c,"complete"),Ct(c,"success");else{c.o=6;try{var b=Un(c)>2?c.g.statusText:""}catch{b=""}c.l=b+" ["+c.ca()+"]",Pd(c)}}finally{Ia(c)}}}}function Ia(c,h){if(c.g){c.m&&(clearTimeout(c.m),c.m=null);const f=c.g;c.g=null,h||Ct(c,"ready");try{f.onreadystatechange=null}catch{}}}r.isActive=function(){return!!this.g};function Un(c){return c.g?c.g.readyState:0}r.ca=function(){try{return Un(this)>2?this.g.status:-1}catch{return-1}},r.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.La=function(c){if(this.g){var h=this.g.responseText;return c&&h.indexOf(c)==0&&(h=h.substring(c.length)),ME(h)}};function Sd(c){try{if(!c.g)return null;if("response"in c.g)return c.g.response;switch(c.F){case"":case"text":return c.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in c.g)return c.g.mozResponseArrayBuffer}return null}catch{return null}}function aI(c){const h={};c=(c.g&&Un(c)>=2&&c.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<c.length;p++){if(I(c[p]))continue;var f=KE(c[p]);const b=f[0];if(f=f[1],typeof f!="string")continue;f=f.trim();const F=h[b]||[];h[b]=F,F.push(f)}OE(h,function(p){return p.join(", ")})}r.ya=function(){return this.o},r.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Mi(c,h,f){return f&&f.internalChannelParams&&f.internalChannelParams[c]||h}function Nd(c){this.za=0,this.i=[],this.j=new Pi,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Mi("failFast",!1,c),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Mi("baseRetryDelayMs",5e3,c),this.Za=Mi("retryDelaySeedMs",1e4,c),this.Ta=Mi("forwardChannelMaxRetries",2,c),this.va=Mi("forwardChannelRequestTimeoutMs",2e4,c),this.ma=c&&c.xmlHttpFactory||void 0,this.Ua=c&&c.Rb||void 0,this.Aa=c&&c.useFetchStreams||!1,this.O=void 0,this.L=c&&c.supportsCrossDomainXhr||!1,this.M="",this.h=new fd(c&&c.concurrentRequestLimit),this.Ba=new sI,this.S=c&&c.fastHandshake||!1,this.R=c&&c.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=c&&c.Pb||!1,c&&c.ua&&this.j.ua(),c&&c.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&c&&c.detectBufferingProxy||!1,this.ia=void 0,c&&c.longPollingTimeout&&c.longPollingTimeout>0&&(this.ia=c.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}r=Nd.prototype,r.ka=8,r.I=1,r.connect=function(c,h,f,p){pt(0),this.W=c,this.H=h||{},f&&p!==void 0&&(this.H.OSID=f,this.H.OAID=p),this.F=this.X,this.J=Ud(this,null,this.W),ya(this)};function Kc(c){if(Od(c),c.I==3){var h=c.V++,f=Wt(c.J);if(ve(f,"SID",c.M),ve(f,"RID",h),ve(f,"TYPE","terminate"),Gi(c,f),h=new Vn(c,c.j,h),h.M=2,h.A=_a(Wt(f)),f=!1,o.navigator&&o.navigator.sendBeacon)try{f=o.navigator.sendBeacon(h.A.toString(),"")}catch{}!f&&o.Image&&(new Image().src=h.A,f=!0),f||(h.g=Hd(h.j,null),h.g.ea(h.A)),h.F=Date.now(),ma(h)}Gd(c)}function Da(c){c.g&&(zc(c),c.g.cancel(),c.g=null)}function Od(c){Da(c),c.v&&(o.clearTimeout(c.v),c.v=null),wa(c),c.h.cancel(),c.m&&(typeof c.m=="number"&&o.clearTimeout(c.m),c.m=null)}function ya(c){if(!Cd(c.h)&&!c.m){c.m=!0;var h=c.Ea;Be||E(),ue||(Be(),ue=!0),w.add(h,c),c.D=0}}function uI(c,h){return pd(c.h)>=c.h.j-(c.m?1:0)?!1:c.m?(c.i=h.G.concat(c.i),!0):c.I==1||c.I==2||c.D>=(c.Sa?0:c.Ta)?!1:(c.m=vi(B(c.Ea,c,h),Md(c,c.D)),c.D++,!0)}r.Ea=function(c){if(this.m)if(this.m=null,this.I==1){if(!c){this.V=Math.floor(Math.random()*1e5),c=this.V++;const b=new Vn(this,this.j,c);let F=this.o;if(this.U&&(F?(F=Kh(F),zh(F,this.U)):F=this.U),this.u!==null||this.R||(b.J=F,F=null),this.S)e:{for(var h=0,f=0;f<this.i.length;f++){t:{var p=this.i[f];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(h+=p,h>4096){h=f;break e}if(h===4096||f===this.i.length-1){h=f+1;break e}}h=1e3}else h=1e3;h=Ld(this,b,h),f=Wt(this.J),ve(f,"RID",c),ve(f,"CVER",22),this.G&&ve(f,"X-HTTP-Session-Id",this.G),Gi(this,f),F&&(this.R?h="headers="+bi(Rd(F))+"&"+h:this.u&&jc(f,this.u,F)),Uc(this.h,b),this.Ra&&ve(f,"TYPE","init"),this.S?(ve(f,"$req",h),ve(f,"SID","null"),b.U=!0,xc(b,f,null)):xc(b,f,h),this.I=2}}else this.I==3&&(c?Fd(this,c):this.i.length==0||Cd(this.h)||Fd(this))};function Fd(c,h){var f;h?f=h.l:f=c.V++;const p=Wt(c.J);ve(p,"SID",c.M),ve(p,"RID",f),ve(p,"AID",c.K),Gi(c,p),c.u&&c.o&&jc(p,c.u,c.o),f=new Vn(c,c.j,f,c.D+1),c.u===null&&(f.J=c.o),h&&(c.i=h.G.concat(c.i)),h=Ld(c,f,1e3),f.H=Math.round(c.va*.5)+Math.round(c.va*.5*Math.random()),Uc(c.h,f),xc(f,p,h)}function Gi(c,h){c.H&&da(c.H,function(f,p){ve(h,p,f)}),c.l&&da({},function(f,p){ve(h,p,f)})}function Ld(c,h,f){f=Math.min(c.i.length,f);const p=c.l?B(c.l.Ka,c.l,c):null;e:{var b=c.i;let le=-1;for(;;){const Je=["count="+f];le==-1?f>0?(le=b[0].g,Je.push("ofs="+le)):le=0:Je.push("ofs="+le);let De=!0;for(let Ze=0;Ze<f;Ze++){var F=b[Ze].g;const $t=b[Ze].map;if(F-=le,F<0)le=Math.max(0,b[Ze].g-100),De=!1;else try{F="req"+F+"_"||"";try{var Q=$t instanceof Map?$t:Object.entries($t);for(const[Or,Hn]of Q){let qn=Hn;a(Hn)&&(qn=Nc(Hn)),Je.push(F+Or+"="+encodeURIComponent(qn))}}catch(Or){throw Je.push(F+"type="+encodeURIComponent("_badmap")),Or}}catch{p&&p($t)}}if(De){Q=Je.join("&");break e}}Q=void 0}return c=c.i.splice(0,f),h.G=c,Q}function kd(c){if(!c.g&&!c.v){c.Y=1;var h=c.Da;Be||E(),ue||(Be(),ue=!0),w.add(h,c),c.A=0}}function Jc(c){return c.g||c.v||c.A>=3?!1:(c.Y++,c.v=vi(B(c.Da,c),Md(c,c.A)),c.A++,!0)}r.Da=function(){if(this.v=null,xd(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var c=4*this.T;this.j.info("BP detection timer enabled: "+c),this.B=vi(B(this.Wa,this),c)}},r.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,pt(10),Da(this),xd(this))};function zc(c){c.B!=null&&(o.clearTimeout(c.B),c.B=null)}function xd(c){c.g=new Vn(c,c.j,"rpc",c.Y),c.u===null&&(c.g.J=c.o),c.g.P=0;var h=Wt(c.na);ve(h,"RID","rpc"),ve(h,"SID",c.M),ve(h,"AID",c.K),ve(h,"CI",c.F?"0":"1"),!c.F&&c.ia&&ve(h,"TO",c.ia),ve(h,"TYPE","xmlhttp"),Gi(c,h),c.u&&c.o&&jc(h,c.u,c.o),c.O&&(c.g.H=c.O);var f=c.g;c=c.ba,f.M=1,f.A=_a(Wt(h)),f.u=null,f.R=!0,ld(f,c)}r.Va=function(){this.C!=null&&(this.C=null,Da(this),Jc(this),pt(19))};function wa(c){c.C!=null&&(o.clearTimeout(c.C),c.C=null)}function Vd(c,h){var f=null;if(c.g==h){wa(c),zc(c),c.g=null;var p=2}else if(Gc(c.h,h))f=h.G,gd(c.h,h),p=1;else return;if(c.I!=0){if(h.o)if(p==1){f=h.u?h.u.length:0,h=Date.now()-h.F;var b=c.D;p=pa(),Ct(p,new od(p,f)),ya(c)}else kd(c);else if(b=h.m,b==3||b==0&&h.X>0||!(p==1&&uI(c,h)||p==2&&Jc(c)))switch(f&&f.length>0&&(h=c.h,h.i=h.i.concat(f)),b){case 1:Nr(c,5);break;case 4:Nr(c,10);break;case 3:Nr(c,6);break;default:Nr(c,2)}}}function Md(c,h){let f=c.Qa+Math.floor(Math.random()*c.Za);return c.isActive()||(f*=2),f*h}function Nr(c,h){if(c.j.info("Error code "+h),h==2){var f=B(c.bb,c),p=c.Ua;const b=!p;p=new Mn(p||"//www.google.com/images/cleardot.gif"),o.location&&o.location.protocol=="http"||Ni(p,"https"),_a(p),b?nI(p.toString(),f):rI(p.toString(),f)}else pt(2);c.I=0,c.l&&c.l.pa(h),Gd(c),Od(c)}r.bb=function(c){c?(this.j.info("Successfully pinged google.com"),pt(2)):(this.j.info("Failed to ping google.com"),pt(1))};function Gd(c){if(c.I=0,c.ja=[],c.l){const h=md(c.h);(h.length!=0||c.i.length!=0)&&(y(c.ja,h),y(c.ja,c.i),c.h.i.length=0,m(c.i),c.i.length=0),c.l.oa()}}function Ud(c,h,f){var p=f instanceof Mn?Wt(f):new Mn(f);if(p.g!="")h&&(p.g=h+"."+p.g),Oi(p,p.u);else{var b=o.location;p=b.protocol,h=h?h+"."+b.hostname:b.hostname,b=+b.port;const F=new Mn(null);p&&Ni(F,p),h&&(F.g=h),b&&Oi(F,b),f&&(F.h=f),p=F}return f=c.G,h=c.wa,f&&h&&ve(p,f,h),ve(p,"VER",c.ka),Gi(c,p),p}function Hd(c,h,f){if(h&&!c.L)throw Error("Can't create secondary domain capable XhrIo object.");return h=c.Aa&&!c.ma?new Le(new qc({ab:f})):new Le(c.ma),h.Fa(c.L),h}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function qd(){}r=qd.prototype,r.ra=function(){},r.qa=function(){},r.pa=function(){},r.oa=function(){},r.isActive=function(){return!0},r.Ka=function(){};function Ta(){}Ta.prototype.g=function(c,h){return new bt(c,h)};function bt(c,h){at.call(this),this.g=new Nd(h),this.l=c,this.h=h&&h.messageUrlParams||null,c=h&&h.messageHeaders||null,h&&h.clientProtocolHeaderRequired&&(c?c["X-Client-Protocol"]="webchannel":c={"X-Client-Protocol":"webchannel"}),this.g.o=c,c=h&&h.initMessageHeaders||null,h&&h.messageContentType&&(c?c["X-WebChannel-Content-Type"]=h.messageContentType:c={"X-WebChannel-Content-Type":h.messageContentType}),h&&h.sa&&(c?c["X-WebChannel-Client-Profile"]=h.sa:c={"X-WebChannel-Client-Profile":h.sa}),this.g.U=c,(c=h&&h.Qb)&&!I(c)&&(this.g.u=c),this.A=h&&h.supportsCrossDomainXhr||!1,this.v=h&&h.sendRawJson||!1,(h=h&&h.httpSessionIdParam)&&!I(h)&&(this.g.G=h,c=this.h,c!==null&&h in c&&(c=this.h,h in c&&delete c[h])),this.j=new Rs(this)}d(bt,at),bt.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},bt.prototype.close=function(){Kc(this.g)},bt.prototype.o=function(c){var h=this.g;if(typeof c=="string"){var f={};f.__data__=c,c=f}else this.v&&(f={},f.__data__=Nc(c),c=f);h.i.push(new QE(h.Ya++,c)),h.I==3&&ya(h)},bt.prototype.N=function(){this.g.l=null,delete this.j,Kc(this.g),delete this.g,bt.Z.N.call(this)};function jd(c){Oc.call(this),c.__headers__&&(this.headers=c.__headers__,this.statusCode=c.__status__,delete c.__headers__,delete c.__status__);var h=c.__sm__;if(h){e:{for(const f in h){c=f;break e}c=void 0}(this.i=c)&&(c=this.i,h=h!==null&&c in h?h[c]:void 0),this.data=h}else this.data=c}d(jd,Oc);function Kd(){Fc.call(this),this.status=1}d(Kd,Fc);function Rs(c){this.g=c}d(Rs,qd),Rs.prototype.ra=function(){Ct(this.g,"a")},Rs.prototype.qa=function(c){Ct(this.g,new jd(c))},Rs.prototype.pa=function(c){Ct(this.g,new Kd)},Rs.prototype.oa=function(){Ct(this.g,"b")},Ta.prototype.createWebChannel=Ta.prototype.g,bt.prototype.send=bt.prototype.o,bt.prototype.open=bt.prototype.m,bt.prototype.close=bt.prototype.close,Fg=function(){return new Ta},Og=function(){return pa()},Ng=Pr,AB={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},ga.NO_ERROR=0,ga.TIMEOUT=8,ga.HTTP_ERROR=6,$a=ga,ad.COMPLETE="complete",Sg=ad,nd.EventType=Ai,Ai.OPEN="a",Ai.CLOSE="b",Ai.ERROR="c",Ai.MESSAGE="d",at.prototype.listen=at.prototype.J,Xi=nd,Le.prototype.listenOnce=Le.prototype.K,Le.prototype.getLastError=Le.prototype.Ha,Le.prototype.getLastErrorCode=Le.prototype.ya,Le.prototype.getStatus=Le.prototype.ca,Le.prototype.getResponseJson=Le.prototype.La,Le.prototype.getResponseText=Le.prototype.la,Le.prototype.send=Le.prototype.ea,Le.prototype.setWithCredentials=Le.prototype.Fa,bg=Le}).apply(typeof va<"u"?va:typeof self<"u"?self:typeof window<"u"?window:{});/*!
* re2js
* RE2JS is the JavaScript port of RE2, a regular expression engine that provides linear time matching
*
* @version v2.8.6
* @author Oleksii Vasyliev
* @homepage https://github.com/le0pard/re2js#readme
* @repository github:le0pard/re2js
* @license MIT
*/var ye,M=(ye=class{},q(ye,"FOLD_CASE",1),q(ye,"LITERAL",2),q(ye,"CLASS_NL",4),q(ye,"DOT_NL",8),q(ye,"ONE_LINE",16),q(ye,"NON_GREEDY",32),q(ye,"PERL_X",64),q(ye,"UNICODE_GROUPS",128),q(ye,"WAS_DOLLAR",256),q(ye,"LOOKBEHIND",512),q(ye,"MATCH_NL",ye.CLASS_NL|ye.DOT_NL),q(ye,"PERL",ye.CLASS_NL|ye.ONE_LINE|ye.PERL_X|ye.UNICODE_GROUPS),q(ye,"POSIX",0),q(ye,"UNANCHORED",0),q(ye,"ANCHOR_START",1),q(ye,"ANCHOR_BOTH",2),ye);const vs={CASE_INSENSITIVE:1,DOTALL:2,MULTILINE:4,DISABLE_UNICODE_GROUPS:8,LONGEST_MATCH:16,LOOKBEHINDS:512},wo=128,RB=new Int32Array(wo),vB=new Int32Array(wo),Pa=65535;for(let r=0;r<wo;r++)r>=97&&r<=122?RB[r]=r-32:RB[r]=r,r>=65&&r<=90?vB[r]=r+32:vB[r]=r;var _B,L=(_B=class{static toUpperCase(r){if(r<wo)return RB[r];const e=String.fromCodePoint(r).toUpperCase(),t=e.codePointAt(0)>Pa?2:1;if(e.length>t)return r;const n=String.fromCodePoint(e.codePointAt(0)).toLowerCase(),s=n.codePointAt(0)>Pa?2:1;return n.length>s||n.codePointAt(0)!==r?r:e.codePointAt(0)}static toLowerCase(r){if(r<wo)return vB[r];const e=String.fromCodePoint(r).toLowerCase(),t=e.codePointAt(0)>Pa?2:1;if(e.length>t)return r;const n=String.fromCodePoint(e.codePointAt(0)).toUpperCase(),s=n.codePointAt(0)>Pa?2:1;return n.length>s||n.codePointAt(0)!==r?r:e.codePointAt(0)}},q(_B,"CODES",new Map([["\x07",7],["\b",8],["	",9],[`
`,10],["\v",11],["\f",12],["\r",13],[" ",32],['"',34],["$",36],["&",38],["'",39],["(",40],[")",41],["*",42],["+",43],["-",45],[".",46],["0",48],["1",49],["2",50],["3",51],["4",52],["5",53],["6",54],["7",55],["8",56],["9",57],[":",58],["<",60],[">",62],["?",63],["A",65],["B",66],["C",67],["F",70],["P",80],["Q",81],["U",85],["Z",90],["[",91],["\\",92],["]",93],["^",94],["_",95],["`",96],["a",97],["b",98],["f",102],["i",105],["m",109],["n",110],["r",114],["s",115],["t",116],["v",118],["x",120],["z",122],["{",123],["|",124],["}",125]])),_B),g=class{constructor(r,e=!1){this.data=r,this.isStride1=e,this.SIZE=e?2:3}getLo(r){return this.data[r*this.SIZE]}getHi(r){return this.data[r*this.SIZE+1]}getStride(r){return this.isStride1?1:this.data[r*this.SIZE+2]}get length(){return this.data.length/this.SIZE}};const Lg=new Uint8Array(256);for(let r=0,e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-";r<64;r++)Lg[e.charCodeAt(r)]=r;const kg=r=>{const e=[];let t=0,n=0;for(let s=0;s<r.length;s++){let i=Lg[r.charCodeAt(s)];t|=(i&31)<<n,i&32?n+=5:(e.push(t),t=0,n=0)}return e},_=(r,e)=>{const t=kg(r),n=e?t.length/2:t.length/3,s=new Uint32Array(n*3);let i=0,o=0;for(let a=0;a<n;a++)i+=t[o++],s[a*3]=i,i+=t[o++],s[a*3+1]=i,s[a*3+2]=e?1:t[o++];return s},wT=r=>{const e=kg(r),t=new Map;let n=0;for(let s=0;s<e.length;s+=2){n+=e[s];const i=e[s+1],o=i>>>1^-(i&1);t.set(n,n+o)}return t};var ba=class{constructor(r){this.initializer=r,this.cache=new Map}has(r){return r in this.initializer}get(r){if(this.cache.has(r))return this.cache.get(r);const e=this.initializer[r],t=e?e():null;return this.cache.set(r,t),t}},$n,yt=($n=class{static get CASE_ORBIT(){return this._CASE_ORBIT||(this._CASE_ORBIT=wT("rCgCIgCY+rQI4QiCuuBLgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCCgCBgCBgCBgCBgCBgCBgCB+7OB-BB-BB-BB-BB-BBskQB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BC-BB-BB-BB-BB-BB-BB-BByHBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBxHBCBBBCBBBCBBB3SBmMBkNBCBBBCBBB8MBCBBB6MB6MBCBBC+EB0MB2MBCBBB6MB+MBiGBmNBiNBCBBBmKBikzCBmNBqNBkIBsNBCBBBCBBBCBBB0NBCBBB0NDCBBB0NBCBBByNByNBCBBBCBBB2NBCBBDCBBCwDFCBCBDBCBCBDBCBCBDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB9EBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBCBDBCBBBhGBvDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBjICCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBH2iVBCBBBlKBwiVB+jVB+jVBCBBBlMBqEBuEBCBBBCBBBCBBBCBBBCBBB+hVB4hVB8hVBjNB7MC5MB5MCzMC1MB+0yCE5MB20yCC9MBu2yCBwyyCBo0yCChNBlNBo0yCBu-UBi0yCDlNC6-UBpNDrNIu+UDzNCm0yCBzNE0yyCBzNBpEBxNBxNBtEG1NLqxyCBkxyCnFoFrBCBBBCBBDCBBEkIBkIBkICoHHsCCqCBqCBqCCgEC+DB+DBmkOBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCC+BBgCBgCBgCBgCBgCBgCBgCBgCBrCBpCBpCBpCBmjOB-BB8BB-BB-BBgEB-BB-BByBBqgOBsDB-BBtwBB-BB-BB-BBsBBgDBCB-BB-BB-BBeB-BB-BB61OB-BB-BB-DB9DB9DBQB7DBmCE9CBrDBPBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBrFB-EBOBnHB3FB-FCCBBBNBCBBCjIBjIBjIBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB8kMB-BB6kMB-BB-BB-BB-BB-BB-BB-BB-BB-BBokMB-BB-BBkkMBkkMB-BB-BB-BB-BB-BB-BB-BB4jMB-BB-BB-BB-BB-BB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EBCBBBCBoiMBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBJCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBeBCBBBCBBBCBBBCBBBCBBBCBBBCBBBdBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDL-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-C64CgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOCgmOGgmODg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FDg8FBg8FBg8FhVg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBQBQBQBQBQBQDPBPBPBPBPBPjkC7mMB5mMBnmMBjmMBCBlmMB3lMBpiMBk8kCBCBBG-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FD-7FB-7FB-7F6FoglCEsuHRwjlCyDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCB0DBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBG1DD97OCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPEQCQCQCQCPCPCPCPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPB0EB0EBsFBsFBsFBsFBoGBoGBgIBgIBgHBgHB8HB8HDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQCSFPBPBzEBzEBRCxnOFSFrFBrFBrFBrFBREQBQClkOFPBPBnGBnGFQBQCljOCODPBPB-GB-GBNHSF-HB-HB7HB7HBRqJ53OE9tQBrmQH4Bc3BSgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfECBByZ0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzB34BgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CBCBBBt-UBruHBt+UB1iVBviVBCBBBCBBBCBBB3hVB5-UB9hVB7hVCCBBCCBBI9jVB9jVBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBICBBBCBBECBBN-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOC-lOG-lOzoeCBBBCBBBCBBBCBBBCBBBCBl8kCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBTCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBnECBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBKCBBBCBBBnglCBCBBBCBBBCBBBCBBBCBBECBBBvyyCDCBBBCBBBgDCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBn0yCB90yCB10yCBh0yCBn0yCCjxyCBzyyCBpxyCBg6BBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB-CBl0yCBvjlCBCBBBCBBBt2yCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBhkzCZCBB9a-5Bd-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCm6TCBB7gBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCH-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BmlBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvChDwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCFvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvC1DuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCCuCBuCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCCtCBtCk2BgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEO-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-D+CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCL-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-B74CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhrVgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BD1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BtxekCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjC")),this._CASE_ORBIT}static get Print(){return this._Print||(this._Print=new g(_("hB9CBjBLBCpWBDFBFGBCCCBSBCsMBClBBDxBBDCBC2BBJaBFFBSVBC-FBCvBBD6BBDkDBP6BBDwBBDOBCbBDCCBJBGfBIqCBCgFBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYBDCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPBLCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGBCCBCHBDBBDVBCGBCBBCEBDIBDBBDCBICBFBBCEBDRBLBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBGMBCCBCWBCPBDIBCCBCDBIBBCCBCBBDDBDJBIVBCCBCWBCJBCEBDIBCCBCDBIBBGCBCDBDJBCCBNMBCCBCyBBCCBCFBFPBDZBCCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBN5BBFcBmBBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDBhBnCBCjBBFmBBCjBBCOBCMBmBlGBCGGD4LBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBH1CBDFBD-TBCbBE4CBIVBKXBKTBNMBCCBCBBN9CBDJBHJBHNBCKBH4CBIqBBGlCBLeBCLBFLBFEEBoBBDEBMrBBFZBHKBE9BBDgCBCcBDKBHJBHNBDtBBDLBVsCBClFBJ7BBEOBE9BBGqBBDKBJqBBG1QBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBSXBJuBBSBBDaBCMBEhBBPgBBQrEBF5UBXKBWz4BBD9LBGsBBCGGD3BBIBBPXBKGBCGBCGBCGBCGBCGBCGBCGBC9DBjBZBC4CBN1GBbPBC+BBC1CBDmDBGqBBC9CBC1CBKvBBCszcBE2BBK7KBV3FBJ8GBV7BBEJBH3BBJlCBJLBHzDBMdBEtCBCKBFgBBC2BBKNBDJBDmDBZbBLFBDFBDFBKGBCGBC7BBF9DBDJBHj9KBNWBFwBBloItLBDpDBnBGBNEBGZBCEBCCCBCCBCCBoUBhBpBBHyBBCSBCDBFEBCmEBF9FBEFBDFBDFBDCBEGBCGBOBBDLBCZBCSBCBBCOBDNBjB6DBGCBFsBBE3CBCMBEwBwBBsBBjEcBEwBBQbBFjBBKdBGqBBGdBCkBBFNBrB9EBDJBHjBBFjBBFnBBJzBBMLBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBCnCBJIBxBSBCBBGgBBEaBGaBnB3BBFTBDxBBCBBGHBCCBCcBDCBFJBIIBI-BBhBmBBFLBK1BBEcBDaBGZBIDBNGBxCoCB4ByBBOyBBItBBJJBHlBBEcBJBBxGeBCpBBCCBDBBRFBJIBiBtBBJpBBXZBnBbBVWBKtCBFjBBK9BBCEBOYBIJBH0BBCRBJmBBK-CBCTBMRBCuBB-BGBCCCBCBCOBCKBH6BBGJBHDBCHBDBBDVBCGBCBBCEBCJBDBBDCBDHHGGBDGBEEBMJBCDDClBBCJBCDDCDBCJBCBBJBBe7CBCEBfnCBJJBnF1BBDlBBjBkCBMJBHMBU5BBHJBHTBdaBDOBFWB6F7BBlDyCBNHBDDDBGBCBBCdBCBBDLBKJBnCHBDtBBDKBcnCBJyCBOoCBIJB3CHB5ChBBPJBHIBCsBBCNBLcBEfBDVBCNBqCGBCBBCrBBECCBCCBHBJJBHFBCBBCkBBCBBCFBIJBHrBBFJB3HYBIQBCoBBEcB2CQQBwBBO6cBnDuDBCEBMjGBtyCiDBOvhBBRVBL68DBGmSB61G5BBn2B4RBIeBCJBFwCBCJBHdBDFBLlCBLJBCGBCUBGSBxN5BBnG6CBGYBDYBtBqCBF4BBIQBhCEBMGBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBDDBh7D8HBEzNBHWBQQBQtBBDWBKzDB9B1HBLmBBDpCBJvDBWlCB7DTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBD9VBQEBCOBxiBeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBENBDJBFBBhKeBS5BBGxOxOBoBB3GqBBFhGhGBdBCVBJBBhHGBCDBCBBCOBCkGBDPBqBrCBFJBFBByYjCBtC8BBjGDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBBvIrBBFjDBNOBDOBCOBCkBBLtFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBmgB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIBnkzVvHB",!1))),this._Print}static get Upper(){return this.CATEGORIES.get("Lu")}},q($n,"_CASE_ORBIT",null),q($n,"_Print",null),q($n,"CATEGORIES",new ba({C:()=>new g(_("AfBgDgBBOrWrWBHHBCBICCVuMuMnBBBzBBBE4B4BBGBcDBHQBXhGhGxBBB8BBBmDNB8BBByBBBQddBCCMEBhBGBsCiFiFJBBDBBXIICCBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBPMMBEB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKMMBDBbEByBPBDBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCB-FCBHBBHBBHBBECBIIIBLBDBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIB-BGGBLBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMBxhBPBXJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBF-6DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBrCHBxDUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIlkzVBxHvw-FB",!1)),Cc:()=>new g(_("AfgDgB",!0)),Cf:()=>new g(_("tFzqBzqBBEBXhGhGyBhMhMBxCxCs5D9-B9-BBDBbEByBEBCJBw03B6H6HBBBimEQQj7IPBhjiBDBwmFHBn0rYffB+CB",!1)),Cn:()=>new g(_("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBDBvzIBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-BB---BBB---BBB",!1)),Co:()=>new g(_("gg4B-nGh4hc9--BD9--B",!0)),Cs:()=>new g(_("gg2B--B",!0)),L:()=>new g(_("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICCiEEBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoCaBFDBuBqBBkBBBCiDBCQQBIIBLLBBBDRRCdBe4CBMZZBfBKBBFGGBUBFKKEYYBXBIKBGXBCGBRpBB7B1BBETTIJBQPBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNGB7BBBCCCBDBCXBCCCBIBCBBKDDBDBCWWBCBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNSSBkBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBkBFFkC4CBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBzC+C+CBtBBSHB3BdBOBBLrBBbjBBqBCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBhC1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBF1B1BB8zC8zCBjHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBxC2O2OBrBrBBDBGBBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBReBDlCByBIBDmDBDxCBVQBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBdRRBDBCJBLEBCoBBYCBCHBVWBEEEBwBBCEEBDDBDBDCCZCBDKBICBNFBDFBDFBKGBCGBCqBBCNBHyDBej9KBNWBFwBBloItLBDpDBnBGBNEBGCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBxB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOjBBnBbBKWB7HpBBHBBRFB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB1D-BBgBHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBqBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBGjCjCBLBhCBBCPPBNNB0mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBn7F0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFBmI9BBzEsBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCCBCBBCGBDEBKBBhHGBCDBCBBCOBCkGB8BjCBI1lB1lBBCBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),LC:()=>new g(_("hCZBHZB7BLLBVBCeBCiGBCDBFvGBDZBhGDBDBBECBCHHCCBCCCBSBCyCBCqEBJlFBClBBKoBB44ClBBCGGDqBBDCBhV1CBDFBjkCKBGqBBDCBhCrBBgCMBChBBmD1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGBmIFFDJBCEEBDBHGCBCBCFBFDDBCBGEBF1B1BB8zC8zCB6DBDmDBHDBEBBNlBBCGGzoetBBTbBnEtCBCWBEDBCsCBZBBE2Z2ZBpBBGIBIvCBh6TGBNEBqgBZBHZBmlBvCBhDjBBFjBB1DKBCOBCGBCBBCKBCOBCGBCBBk2ByBBOyBB+CVBLVB74C-BBhrV-BBhBYBDYBtpZ0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BJBCTBHFB2uCjCB",!1)),Ll:()=>new g(_("hDZB7BqBqBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDZBiGCCEEEBBBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBDCB5XFBjkCIBC2D2DBqBBgCMBChBBnD0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBBzIEEBEEcKFDBBJDBF2B2Bs1CvBBCEEBGCFCCBCCBEBGiDCBIICFFNlBBCGG0oesBCUaCoEMCBBBC+BCBGBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCbEE2ZqBBGIBIvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFB4vChBB",!1)),Lm:()=>new g(_("wVRBFLBPEBICCmEGG-OnHnHlFBBuIBBFgBgBKEEhFoFoF1mBgEgE2R72B72BsDkTkTxOFBvF+BBOjBjBBjBByVOORMBg-CBByHgGgG2OsBsBBDBGiDiDB+C+CBBB34bjnBjnBBEBvIzDzDdBB6DIBxCYYpDDBEBB2OXXqEtDtDWBBoDDBKngVngVuBBBh-BFBCpBBCIB0sBhBhB2K04D04DnrTDB9PCBpBBBnRMBhCBBCPPB9-P9-PBCBCGBCBByhM9BBqGGBud0Q0QsSAB",!1)),Lo:()=>new g(_("qFQQhIFFBCBxGBB7ZaBFDBuBfBCJBkBBBCiDBCZZBLLBBBDRRCdBe4CBMZZBfBWVBrBYBIKBGXBCGBRoBB8B1BBETTIJBROBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNFB8BBBCCCBDBCXBCCCBIBCBBKDDBDBYDBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNyDyDBnKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPByDrTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBpBkCkCBhBBC0BBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBxFuBBSHB3BdBOBBLrBBbjBBqBCBLdByDDBCFBCBBE7hB7hBBCB4-C3BBZWBKGBCGBCGBCGBCGBCGBCGBCGBoR2B2BF1CBJCCB4CBFGGBpBBC9CBSfBxBPBhQ-tGBhC0wUBC2jBBkCnBBJrIBFPBLBBjCyByBBkCBqFoDoDEGBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBuBEBDIBLEBCoBBYCBCHBVPBCFBEEEBwBBCEEBDDBDBDCCZBBEKBIPPBEBDFBDFBKGBCGByEiBBej9KBNWBFwBBloItLBDpDBkCCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBqDJBCsBBDeBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBhEtCBjDnBBJzBB9CzBBN2JBKVBLHB5EFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4FjBBnBDBCxJxJBoBBHBBRCBCBB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB0GHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBnBBCBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBB0BUBGSB0NnBB2MqCBGwFwFB0mHBqBfBiDyDBuwIiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBxzI2P2PBrBBiBiKiKBcBTrBBlPaBmHdBDwGwGBdBCCBCBBCGBDEBKiHiHBFBCDBCBBCOBCkGB8pBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Lt:()=>new g(_("lOGDnB2sH2sHBGBJHBJHBNQQwBAB",!1)),Lu:()=>new g(_("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBG+B+B9zCvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBB",!1)),M:()=>new g(_("gYvDB0IGBoIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCgBB3BCBCRBCGBLBBeCB5BCCBFBDBBDCBKLLBbbDCB5BCCBDBFBBDCBEffBEEMCB5BCCBGBCCBCCBVBBXFBCCB5BCCBFBDBBDCBICBLBBf8B8BBDBECBCDBKpBpBBDB4BCCBFBCCBCDBIBBMBBeCB5BCCBFBCCBCDBIBBMBBQNNBCB4BBBCGBCCBCDBKLLBeeBBBnCFFBEBCCCBGBTBB+BDDBFBNHBjDDDBHBMGBqCBBcECFBByBTBCBBGKBCjBBKlDlDBSBYDBFCBCCBDGBEDBOLBCLLBCBgWCBzdDBdCBeBBfBBhCfBKuBuBBBBC2D2DBjBjB3DLBFLB8GEB6BJBCcBDxBxBBsBBDLBVEBwBQBnBIBNCBfMB5BNBxBTB5ECBCUBFHHDCBnG-BBxWgBB--CCBuEhDhDBeBrRFBqDBB1udDBCJBhBBBxCBBxIEEFYYBDBF0C0CBzBzBBQBbRBOnBnBBGBaMBtBDBwBNBlBkCkCBMBNJJBuBuBBBBzBCCBBBDBBGBBCqBqBBDBGBBtHHBCBBx5TiXiXBOBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB7DCB2BOBqBDDBLLBCBuBKBI+B+BBBBlBNBRBBtBNNBBBxBNBJDBCBB9CLBHDD+ELBWDB4BBBCGBDBBDCBKLLBDDBFBEEBkCIBCDDCDBCEBCPPBzCzCBQBYyCyCBSBsHGBDIBcBBzCQBrDMBmDOBhIOB2HFBCBBDDBCCCBuEuEBFBDGBEddBIBpBGBCDBJKKBJBvBPBnGHBoGHBCHBzCVBCNB7DFBECCBCCBFBCjCjCBDBCBBCEB8KDBKBBCxBxBBFBEEBYmnFmnFHOBpmLRBhuCEB8BGB5gBCCB1BBIDByCMMBslTslTBizEizEBsBBDWB-QEBEFBJHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB",!1)),Mc:()=>new g(_("joC4B4BDCBJDBCBBzBBB7BCBHBBDBBLsBsB7BCBjC7B7BBBBJCCB2B2BB7B7BCHHBDDBLLnDBBCBBECBCCBLqBqBBBB+BDB+BBB7BCCBDBDBBCBBKBBdPPB7B7BBBBGCBCCBLrBrBBsCsCBBBHHBTBBrKBBgCsFsFBFFHDDBaaBLLBBBDGBWBBDFBDLLBBB5zBffiEIIBGBCBB7KDBDCBFBBCFBhHBB7BCCKCCBJJBEByExBxBGCCBDBCBB+BffFBBD9B9BDCBCEEBxBxBBGBJBBsFWW35EBB0-dBBD5C5CBzBzBBOBvEBBwBxBxBBFFBDDBBBvDBBDBBZuBuBCuDuDDBBGuHuHBCCBCCBCC0gZCCgEuBuBBBBFBB0DZZB8B8BxBCBKBBO+C+CBBBEBBCrFrFBBBgBBB7BBBCDBDBBDCBKLLB1C1CBBBIDDCDBCBBCmDmDBBBJBBErDrDBBBHCCBCBDuHuHBBBHDBDyDyDBBBJBBCuDuDCBBHoDoDCBBFmImIBBBK4H4HBEBCBBFDDCvEvEBBBJDBF1C1CeBB-BqGqGECCoGPPrDIID2G2GBDBFBBC-K-KBNNxBBBJBBCpvQpvQBBBlxD2BBpDBB0rYBBHFB",!1)),Me:()=>new g(_("okBBB1xF-wB-wBBCBCCBsshBCB",!1)),Mn:()=>new g(_("gYvDB0IEBqIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCfB4BCCFHBFEEBFBLBBe7B7BFDBJVVBbbDBB6BFFBFFBDDBBBEffBEEMBB6BFFBDBCBBFVVBXXBEBC7B7BDCCBCBJIIBMMBff+BNNzBEE4BCCBBBGCBCDBIBBMBBe7B7BDHHGBBVBBdBB6BBBFDBJVVBeepCIIBBBC7C7CDGBNHBjDDDBHBMGBqCBBcEC4BNBCEBCBBGKBCjBBKnDnDBCBCFBCBBDBBaBBFCBRDBODDBHHQgWgWBBBzdCBeBBfBBfBBhCBBCGBJDDBJBKuBuBBBBC2D2DBjBjB3DCBFBBKHHBBB8GBBD7B7BCGBCCCDHBHJBDxBxBBMBCeBDLBVDBxBCCBDBCGGpBIBNBBhBDBDBBCCB5BCCBEECCB7BHBDBB5ECBCMBCGBFHHEBBnG-BBxWMBFEEBKB--CCBuEhDhDBeBrRDBsDBB1udFFBIBhBBBxCBBxIEEFaaBGG4EBBbRBOnBnBBGBaKBvBCBxBDDBCBDBBoBkCkCBEBDBBDBBNJJwB0B0BCCBDBBGBBCrBrBBJJvHDDFx5Tx5TiXPBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB8D3B3BBNBqBDDBLLBBByBDBDBBI+B+BBBBlBEBCHB-BNNB1B1BBHBLDBDgDgDBBBDCCBHHD+E+EEHBWBB6BBBEmBmBBFBEEBnCFBOECPBB2CHBDCBCYY1CFBCFFBCCBvHvHBCBHBBCBBcBB2CHBDCCBrDrDCDDBEBCmDmDCDDBCBCEBkIIBCBBhIBBCFFxEDBDBBFhBhBBIBpBFBDDBJKKBEBDCBvBMBCBBnGCCBBBCqGqGBFBCFBCzCzCBUBDGBCBBCBB7DFBECCBCCBFBCpCpCBEEC8K8KBMMB1B1BBDBGCCYmnFmnFHOBpmLLBECBhuCEB8BGB5gBgCgCBCByC5lT5lTBizEizEBsBBDWBhRCBSHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB",!1)),N:()=>new g(_("wBJB5DBBGDDBBBitBJBnEJBnGJB9MJB3DJBFFBtDJB3DJB3DJBDFBvDMB0DJBJGBoDJBpDGBISBuDJBhDJB3DJBnCTBtIJBnCJBwWTBybCBwHJBHJBXJBtJJBhEKBmFJBHJB3FJB3CJBnEJBHJB3gBEEBEBHJBnGyBBDEB3W7BBvCVB3TdBqrBqYqYaIBPCB4KDBrEJBfHBCOBhBJBoBOBh7cJB9FJBhKFB7EJBnBJBnGJBXJB3CJB3MJB34UJBuPsBBN4BBSBB2KaBlBDBeJJnEEBrGJBvdHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBxBJBHJB3IeB-EJBrBDBxDGBnEdBhEJB9BJBxEJBITB8HJB3KJB3DJB3LJBnDJBHTBtCLBlNSB+CJB3UJB3CcBkHJBnCJB3BJBnLJBnDUBshBuDBimPJBnpCJB3CJBnEJBCGBvQJBnIWB+KCB6nXJBnuBTBNTBtDYB2iBxBBhqCJBnNJB3PJB4HJBtWIBhEJB4Y6BBCCBCDBtCsBBCOBjeMBk3CJB",!1)),Nd:()=>new g(_("wBJnxBJnEJnGJ9MJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJhDJ3DJnCJ3IJnCJn6BJnBJtJJhEJnFJHJ3FJ3CJnEJHJnuiBJnVJnBJnGJXJ3CJ3MJ34UJnsBJnkCJHJ9YJhEJ9BJxEJ3IJ3KJ3DJ3LJnDJHTtCJnNJnDJ3UJ3CJ3HJnCJ3BJnLJ3uQJnpCJ3CJnEJ3QJ37XJ12CxBhqCJnNJ3PJ4HJ2aJ30EJ",!0)),Nl:()=>new g(_("u3FCBwzCiBBDDB-zDaaBHBPCBs1dJBxyW0BBtOJJnEEBrhIuDBm8SCB",!1)),No:()=>new g(_("yFBBGDDBBB2pCFB5LFB5DCBmEGB6GGBSIByNJB2hBTB0jBJBhP20B20BEFBHJBnGPBqB3W3WB6BBvCVB3TdBqrB1kB1kBBCBrEJBfHBCOBhBJBoBOBxrdFBymWsBBiCDBSBB2KaBlBDB1pBHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBhLeB-EJBrBDBxDGBnETB8LTBmqBBBvNIBobSB0aUBn8SGB-YWBqhZTBNTBtDYBvqFIBid6BBCCBCDBtCsBBCOBjeMB",!1)),P:()=>new g(_("hBCBCFBCDBLBBEBBbCBCccCkBkBGEELBBEEE-VJJzOFBqBBB0BCCDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCmBmBBCBoCrCrCBDBFBBwDFBsFlTlTBHB4EuTuTtBBBvCCBoCBB+ECBCCBmBKB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBM9Z9ZBWBJTBCMBCLBfBBPBB6TDBeBB+hBNBwCBBgBJB0MVBgCDBhBBB8XDBCBBxDwEwEBtBBCfBDLBkNCBFJBDLBRNNjD7C7CjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HzqUzqUBxGxGBIBXiBBCNBCFFCBB2ECBCFBCDBLBBEBBbCBCccCCCBFB7MCB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDByO-J-JjBlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB",!1)),Pc:()=>new g(_("-Cg-Hg-HBUU-u3BBBZCBwHAB",!1)),Pd:()=>new g(_("tB9qB9qB0BiyDiyDmgBqgCqgCBEBiwDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J",!1)),Pe:()=>new g(_("pB0B0BgB+1D+1DC-6B-6BqtC4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECtBGCtNICEGCDBB-ozB6G6GeOCESSCCCrF0B0BgBGD",!1)),Pf:()=>new g(_("7F+6H+6HEddpuDCCFDDQEE",!1)),Pi:()=>new g(_("rFt7Ht7HDBBDaapuDCCFDDQEE",!1)),Po:()=>new g(_("hBCBCCBDECBLLBEEBcclCGGPBBI-V-VJzOzOBEBqB3B3BDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCxDxDrCEBFBBwDFBsFlTlTBHBmY9D9DBBBoCBB+ECBCCBmBFBCDB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBMjajaBJJBGBJIBDDBDCBEKBCCCBIB7kDDBCBBxDwEwEBFFBBBDDDBHBCBBCDDBLLBDBCJBDDBCCCBLBDCBtNCB6B+F+FjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HlxUlxUBFBDXXVBBDDBECBCDBICBHCCB2E2EBBBCCBDECBLLBEEBcclBDDB7M7MBBB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDB0ZlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB",!1)),Ps:()=>new g(_("oBzBzBgB-1D-1DC-6B-6B-rCEEnB4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECaTTCECtNICEGCDipzBipzB4GeeCMCESSCCCrFzBzBgBEEDAB",!1)),S:()=>new g(_("kBHHRCBgBCCcCCkBEBCBBDCCBCBDEEfgBgBrODBNNBGGBCCCBPB2DPPBxDxDsErIrIBBB3DCBDDDBvGvGLUUB4H4HIBBpEqLqLBHHB2H2H-DjEjEBGBlEwGwGqBmGmGiGCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WuLuLlL+E+EBgBBiLJBKIBhiBCCBBBMCBOCBOCBOBBmCOOoBCBOCBUhBB-BBBCDBCBBLCCBBBGFBCECFMMBFFBDBGDBC7B7BBFFB2LBFcBD+HBXKByCtCBXnTBtBwBBDeBLyMBX+BBFfBD1LBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBB8CBB0HBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BB6RWBKBBoDBB+EDBLDB+RCBiHPPB+9T+9TpEgBBuLPBhCBB3BHBtBDBjDCCBBBD7E7EHRRBBBgBCCcCCiEGBCGBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSmWmWBiKiKBGBnjC2kC2kCBbBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQQBgDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBrbaagBaagBaagBaagBaa9B-PB4BDBzBHBCNBCBBp2BwNwNttCEE+DiOiOBvIvIBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB",!1)),Sc:()=>new g(_("kB+D+DBCBqnB8D8DzPBBzPBBI2H2HoImSmS8sClmClmCBgBB37hBkuVkuVtD7E7E8GBBEBB3-HDB-4wBxtCxtC",!1)),Sk:()=>new g(_("+CCCoCHHFEEqQDBNNBGGBCCCBPB2DPPBjoBjoB15FCCBBBMCBOCBOCBOBB9kEBBkzdWBKBBoDBBxePPBniUniUBPB8bCCjF4g9B4g9BBDB",!1)),Sm:()=>new g(_("rBRRBBB+BCCuBFFmBgBgB-XwQwQBBB8xGOOoBCBOCBsEoBoBBDBHlClCBDBGBBFGDIgBgBBDDCgBgBBqIBhBBB7CffBXBpBFB2OKK3BHBwDxKxKBDBDeBLPBhIiEBX+BBFfBDhIBxBUBDFB9+zB5Z5ZCCBlFRRBBB+BCCkEHHBCBitDBBhrwBx+Bx+BagBgBagBgBagBgBagBgBat5Ft5FB-uC-uCBHB",!1)),So:()=>new g(_("mFDDFCCyerIrIBgEgEBvGvGLUUB4H4HkQ2L2LjEFBClElEwGqBqBoMCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WzWzW+EhBBiLJBKIBksBBBCDBCBBLCCBHHBEBCECFMMBPPCBBC7B7BBKKBDBDDBCBBCBBCGBCeBDBBCCCBdBtIHBFTBDGBDwCBCdBanBBHnCBXKByCtCBX2FBCIBC1BBJuDBC3HBtBrBBhC-HBhQvBBWBBHmBBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBBxKBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BBibDBLBBC+R+RBBBqqUPBuLPBhCBB3BHBuBCBlPEEFBBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSpgBpgBBGBnjC2kC2kCBGBFQBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQPBhDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBqlB-PB4BDBzBHBCNBCBBp2B96C96CiEyWyWBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E6HBG4WBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBB-B3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB",!1)),Z:()=>new g(_("gBgEgEgvFgsCgsCBJBeBBGwBwBh9DAB",!1)),Zl:()=>new g(_("ohIA",!0)),Zp:()=>new g(_("phIA",!0)),Zs:()=>new g(_("gBgEgEgvFgsCgsCBJBlBwBwBh9DAB",!1)),ASCII_Hex_Digit:()=>new g(_("wBJIFbF",!0)),Alphabetic:()=>new g(_("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICC3CeeBQBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoBNBCCCBCCBCCJaBFDBeKBG3BBCGBPlDBCHBFHBFCBLCBDRRBuBBOkDBZgBBKBBFGGBWBDSBUYBIKBGXBCGBIJJBoBBLLBEGBHrCBCPBCCBFOBOSBCHBDBBDVBCGBCEEBCBEHBDBBDBBCJJFBBCEBNBBLFFBBBCFBFBBDVBCGBCBBCBBCBBFEBFBBDBBFIIBCBCSSBEBMCBCIBCCBCVBCGBCBBCEBEIBCCBCBBEQQBCBWDBFCBCHBDBBDVBCGBCBBCEBEHBDBBDBBKBBFBBCEBORRBCCBEBECBCDBEBBCCCBEEBEEBBBELBFEBECBCCBEHHpBMBCCBCWBCPBEHBCCBCCBJBBCCBCBBDDBdDBCHBCCBCWBCJBCEBEHBCCBCCBJBBGCBCDBOCBNMBCCBCoBBDHBCCBCCBCGGBCBIEBXFBCCBCRBEXBCIBCDDBFBJFBCCCBGBTBBO5BBGGBH0B0BBECBDBCXBCCCBRBCCBDEBCHHPDBhBgCgCBGBCjBBFSBFPBCjBBkC2BBCDDBDBR-BBLDBDlBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBEKBITBMUBNTBNMBCCBCBBNzBBDSBPFFkC4CBIqBBGlCBLeBCLBFIBYdBDEBMrBBFZB3BbBF+BBDTBzBYYBMMBBByBzBBCOBCHB0BpBBDDBLrBBCKBP2BBXCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBUhBBM1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBFSSBnBBuZzBB34BkHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBCfBwB2O2OBBBaIBIEBDEBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBGHBEwDBoBIBDmDBDxCBVUBCgBBZzBBNjCBCtBtBBEBECCBBBLgBBGiBBOcBEyBBCLBQRRBOBLEBC2BBKNBTWBEkCBCCCZCBDPBDDBMFBDFBDFBKGBCGBCqBBCNBH6DBWj9KBNWBFwBBloItLBDpDBnBGBNEBGLBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmC0BBsIcBEwBBwBfBOdBGqBBGdBDjBBFHBCEBrB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCDBCBBGHBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOnBBjBbBEGGBVB7HpBBCBBEBBRFBzBCBEcBLJJBUBrBRBvBUBcWBKlCBsBEBL4BBKOOBXBYyBBSDBJiBBEKKB+BBCDBKBBLCCkBRBChBBDHHBCB-BGBCCCBCBCOBCJBI4BBYDBCHBDBBDVBCGBCBBCEBEHBDBBDBBEHHGGBdJBCDDClBBCJBCDDCDBCBBECCtBhCBCCBCDBVCBfhCBDBBC5F5FB0BBDGBaFBjB+BBCEE8B1BBDoCoCBZBDNBWGB6F4BBoD-BBgBHBDDDBGBCBBCdBCBBDBBDDB+CHBDtBBDFBCCCBccBxBBDJBSnCBGTTBnCBoDHB5CgBBgBIBCsBBCGBCyByBBcBDVBCNBqCGBCBBCrBBECCBCCBBBCDDBZZBEBCBBCkBBCBBCDBCYYBqBBlIWBKQBCoBBECBwDwCwCB4cBnDuDBSjGBtyCgDBQvhBBSFBa68DBGmSB61GuBBy2B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBF4BBIQBhCBBCNNBFBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBFi7Fi7FBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCVBJBBhHGBCDBCBBCOBCkGB8BjCBEEE1lBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1TZBHZBHZB3zD-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Dash:()=>new g(_("tB9qB9qB0BiyDiyDmgBqgCqgCBEB+BoBoBQnMnMlgDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J",!1)),Emoji:()=>new g(_("jBHHGJBwDFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDrGrGhFBBNBBPDDBIBsCZBCBBYVVDIBWBBvFhBBDvDBDBBCCBDyCBDCBCmIBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDDBEJBECCBEEDJBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB",!1)),Emoji_Component:()=>new g(_("jBHHGJB0+H2G2Gsp3B3+8B3+8BBYB8PEBxtBDBtzhY-CB",!1)),Emoji_Modifier:()=>new g(_("7-8DE",!0)),Emoji_Modifier_Base:()=>new g(_("9wJ8G8GRDB4jzD9B9BBBBDDDBBB2DBBDKBWSBEFFBBBCCBICCZqGqGBFFWFFBvFvFBBBEEB0CRRBBBKMMgSDDJHBHKKBIBDCB5B+B+BBCCBCCSCBCMBmHCBrBIB",!1)),Emoji_Presentation:()=>new g(_("64IBBuGDBEDDqQBBWBBzBLBsBUUOJJBSSBGGBJJGWWIBBCFFDIIFBBdkBkBCFFBBBC+B+BBBBZPP8aBB0BFFvlxDrGrG-FDDBIBsCZBCZZVDDBDBCCBWBBvFgBBNIBClCBCVBNqBBFEBNQBEEEBlCBCCCB5FBD+BBODBCXBTbbBOO3C0CBxBlCBHEEBBBDDBEDBMBBIIBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB",!1)),Extended_Pictographic:()=>new g(_("pFFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDoBoBBCBlDLBQBBQPPBmBmBBIBxDBBNBBPDDBIBU3BBcOBLVVDIBCDBKWBH7FBDvDBDBBCCBDyCBDCBCDBG9HBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDQBECCBEBDMB7GlBBNDB5BHBLFBpBHBfBBNDBDNBKmBBNuBBCJBC4FB5CHBPxEBhI9fB",!1)),Hex_Digit:()=>new g(_("wBJIFbFq1-BJIFbF",!0)),Lowercase:()=>new g(_("hDZBwBLLFlBlBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDiBBIBBfEBhDsBsBCEEDDBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBCDB5XFBjkCIBC2D2DB+FBiC0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBB6DOORMBuDEEBEEcKFDBBJDBFiBiBBOBFsasaBYBn6BvBBCEEBGCFCCBCCBGBEiDCBIICFFNlBBCGG0oesBCUaCBBBmEMCBBBC8BCBIBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCWDBCCCBBB2ZqBBCNBHvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBkODDBBBCpBBCIBmoByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFBmI9BB1lChBB",!1)),Math:()=>new g(_("rBRRBBBgBeeCuBuBFmBmBgB5W5WBBBDbbBDDBBBwQCBuwGccBBBMEEOPPBCBWEBMEBiCMBFEEBFFBDBTFFDJBCDDBEBHEEBDDBCCBBBCFBENBClClCBWBCFBCBBFBBFfBCHHBPPBqIBJDBVBB7CffBZBCZZMGB+NBBNJBFFBFBBDBBEEBPCCDFBMHBGBB6BCCeDBKCBxK-BBhI-PBxBUBDFB9+zB4Z4ZBEBCjFjFRCBeCCeCCkEHHBCBitDBBhrwBwoBwoBBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBBhwFDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB-uCIB",!1)),Quotation_Mark:()=>new g(_("iBFFkEQQ96HHBaBBowDqOqOBCBOCBixzBDB+FFF7CBB",!1)),Terminal_Punctuation:()=>new g(_("hBLLCMMBEE-ZJJiQ6B6BpCPPCCB1FsBsBBJBCsHsHB3B3BBEBCHBgBmImIB1nB1nBBtFtFFFB4JBB2YHBmY9D9DBBBoCBB+ECBEoBoBBCBDBB7JBBjLDBjFBBLBBCCBeCB8FEB-BBBldYYBKKBBBwlDCBzJOOFLLCBBEBBtNBB8ndBBuICBkHEB-LBB3CBBgD4E4EBBB0ECBgERRB6H6HnxUDDB6B6BBBBCDBqFLLCMMBEEiCDD7hBxBxBnkBoGoG3JBB5EFBlCFB6CDB5dEBtBDB+FGBxDDBgECBiEBBHRRB5C5CBDBtDrJrJB2D2DBBBNBBnLDBEOBqDBB6HCBmQCC8HBB4CBBFBB-MCBuBmUmUBrCrCBspBspBBDB6vRBBmEiCiCBBBLqRqRBoJoJBnwTnwTovHDB",!1)),Uppercase:()=>new g(_("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBGbbBOBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBBvgCZBHZBHZB",!1)),White_Space:()=>new g(_("JEBTlDlDbgvFgvFgsCKBeBBGwBwBh9DAB",!1))})),q($n,"SCRIPTS",new ba({Adlam:()=>new g(_("go6DrCFJFB",!0)),Ahom:()=>new g(_("g4lCaDOFW",!0)),Anatolian_Hieroglyphs:()=>new g(_("ggxCmS",!0)),Arabic:()=>new g(_("gwBEBCFBCNBCCBCfBCJBMZBCrDBChBBxCvBBxHhBBGqCBCcBxy8BtPBDvEBhBPBxDEBCmEBk7DeBkCFBJIBiBFBh43BDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB",!1)),Armenian:()=>new g(_("xpBlBDxBDCks9BE",!0)),Avestan:()=>new g(_("g4iC1BEG",!0)),Balinese:()=>new g(_("g4GsCCxB",!0)),Bamum:()=>new g(_("g1pB3CpowB4R",!0)),Bassa_Vah:()=>new g(_("w26CdDF",!0)),Batak:()=>new g(_("g+GzBJD",!0)),Bengali:()=>new g(_("gsCDBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYB",!1)),Beria_Erfe:()=>new g(_("g17CYDY",!0)),Bhaiksuki:()=>new g(_("ggnCICsBCNLc",!0)),Bopomofo:()=>new g(_("qXB6wLqBxDf",!0)),Brahmi:()=>new g(_("ggkCtCFjBKA",!0)),Braille:()=>new g(_("ggK-H",!0)),Buginese:()=>new g(_("gwGbDB",!0)),Buhid:()=>new g(_("g6FT",!0)),Canadian_Aboriginal:()=>new g(_("ggF-TxRlC7tgCP",!0)),Carian:()=>new g(_("g1gCwB",!0)),Caucasian_Albanian:()=>new g(_("wphCzBMA",!0)),Chakma:()=>new g(_("gokC0BCR",!0)),Cham:()=>new g(_("gwqB2BKNDJDD",!0)),Cherokee:()=>new g(_("g9E1CDFz7lBvC",!0)),Chorasmian:()=>new g(_("w9jCb",!0)),Common:()=>new g(_("AgCBbFBbuBBCOBCEBYgBgBiOmBBGEBDTB1DKKHCC+THHPEEhB9E9ElQiEiEB6mB6mB2MDBjJwvBwvBBBBoCBBsGBBCumBumBOIIBCBCFBCCBDmYmYBKBD2CBCKBEKBCOBShBB-BlBBCCBDFBCaBCQBqBCBF5UBXKBW-cBhIzTBDpEBhQ9CBzMUBCCCBXBQHBFDB8CBBE7C7CB0E0EBOBhBlBBKxBxBB+BBgBwCBwB5C5CBmFBhuG-BBhoWhBBnDCBmFJB1HhFhFsMPPBzuUzuUBxGxGBIBXiBBCSBCDB0ECCBeBbFBbKBLuBuBBhChCBFBCGBLEBjICBFsBBEIBxCMB0BsBBlHaBltuBDB96D8HBEzNBHWBQQBgDzDB9B1HBLmBBD9BBEQBJBBIdBF8BB2GTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBByjFjCBtC8BBjWrBBFjDBNOBDOBCOBCkBBLtFB5BZBCBBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBnghYffB+CB",!1)),Coptic:()=>new g(_("ifNxkKzDGG",!0)),Cuneiform:()=>new g(_("ggoC5cnDuDCEMjG",!0)),Cypriot:()=>new g(_("ggiCFBDCCBqBBCBBEDD",!1)),Cypro_Minoan:()=>new g(_("w8rCiD",!0)),Cyrillic:()=>new g(_("ggBkEBDoFBx6FKBhFtCtCojEfBhie-CBv8VBBhw4B9BBiBAB",!1)),Deseret:()=>new g(_("gghCvC",!0)),Devanagari:()=>new g(_("goCwCFODZh7nBfhwcJ",!0)),Dives_Akuru:()=>new g(_("gomCGBDDDBGBCBBCdBCBBDLBKJB",!1)),Dogra:()=>new g(_("ggmC7B",!0)),Duployan:()=>new g(_("ggvDqDGMEIIJDD",!0)),Egyptian_Hieroglyphs:()=>new g(_("ggsC1iBL68D",!0)),Elbasan:()=>new g(_("gohCnB",!0)),Elymaic:()=>new g(_("g-jCW",!0)),Ethiopic:()=>new g(_("gwEoCBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBnvGWBKGBCGBCGBCGBCGBCGBCGBCGBjpfFBDFBDFBKGBCGBylvCGBCDBCBBCOB",!1)),Garay:()=>new g(_("gqjClBEcJB",!0)),Georgian:()=>new g(_("glElBBCGGDqBBCDBx8CqBBDCBhiElBBCGG",!1)),Glagolitic:()=>new g(_("ggL-Ch9sDGCQDGCBCE",!0)),Gothic:()=>new g(_("w5gCa",!0)),Grantha:()=>new g(_("g4kCDBCHBDBBDVBCGBCBBCEBDIBDBBDCBDHHGGBDGBEEB",!1)),Greek:()=>new g(_("wbDBCCBDDBCFFCCCBBBCCCBSBC+BBPPBnpGEBzBEBFEB1ChKhKBUBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBoJ-xiB-xiB7uVuCBSgj0Bgj0BBkCB",!1)),Gujarati:()=>new g(_("h0CCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGB",!1)),Gunjala_Gondi:()=>new g(_("grnCFCBCkBCBCFIJ",!0)),Gurmukhi:()=>new g(_("hwCCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPB",!1)),Gurung_Khema:()=>new g(_("go4C5B",!0)),Han:()=>new g(_("g0LZBC4CBN1GBwBCCaIBPDBle-tGBhC-vUBhoWtLBDpDBpodBBNGBqgkB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Hangul:()=>new g(_("goE-HvxHBiI9CyDeiCei3dckUj9KNWFwBl9JeEFDFDFDC",!0)),Hanifi_Rohingya:()=>new g(_("gojCnBJJ",!0)),Hanunoo:()=>new g(_("g5FU",!0)),Hatran:()=>new g(_("gniCSCBGE",!0)),Hebrew:()=>new g(_("xsB2BBJaBFFBpp9BZBCEBCCCBCCBCCBIB",!1)),Hiragana:()=>new g(_("hiM1CBHCBi7-C+IBTeeBBBulQAB",!1)),Imperial_Aramaic:()=>new g(_("giiCVCI",!0)),Inherited:()=>new g(_("gYvDB2IBBlOKBbhXhXBCB8qEtBBDLBlPCBCMBCGBFHHEBBnG-BBtQBBjGgBB65DDBsDBBmrzBPBRNBwejHjH7iEl+uBl+uBBsBBDWBhRCBSHBDGBfDBz6rYvHB",!1)),Inscriptional_Pahlavi:()=>new g(_("g7iCSGH",!0)),Inscriptional_Parthian:()=>new g(_("g6iCVDH",!0)),Javanese:()=>new g(_("gsqBtCDJFB",!0)),Kaithi:()=>new g(_("gkkCiCLA",!0)),Kannada:()=>new g(_("gkDMCCCWCJCEDICCCDIBGCCDDJCC",!0)),Katakana:()=>new g(_("hlM5CBDCBxHPBxGuBBC3CBvgzBJBCsBBzisBDBCGBCBBCgJgJBBBzBPPBCB",!1)),Kawi:()=>new g(_("g4nCQCoBEc",!0)),Kayah_Li:()=>new g(_("goqBtBCA",!0)),Kharoshthi:()=>new g(_("gwiCDCBGHCCCcDCFJII",!0)),Khitan_Small_Script:()=>new g(_("k-7C84G84GB0OBqBAB",!1)),Khmer:()=>new g(_("g8F9CDJHJnPf",!0)),Khojki:()=>new g(_("gwkCRCuB",!0)),Khudawadi:()=>new g(_("w1kC6BGJ",!0)),Kirat_Rai:()=>new g(_("gq7C5B",!0)),Lao:()=>new g(_("h0DBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDB",!1)),Latin:()=>new g(_("hCZBHZBwBQQGWBCeBCgOBoBEB8wGlBBHwBBGDBGMBClCBiC-HByLOORMBuEBBHccSoBB42CfBj1elDBExCBVOBxZqBBCIBCDB38TGB7gBZBHZBmhCFBCpBBCIBm61BeBHFB",!1)),Lepcha:()=>new g(_("ggH3BEOEC",!0)),Limbu:()=>new g(_("goGeBCLBFLBFEEBKB",!1)),Linear_A:()=>new g(_("gwhC2JKVLH",!0)),Linear_B:()=>new g(_("gggCLCZCSCBCODNjB6D",!0)),Lisu:()=>new g(_("wmpBvBx1eA",!0)),Lycian:()=>new g(_("g0gCc",!0)),Lydian:()=>new g(_("gpiCZGA",!0)),Mahajani:()=>new g(_("wqkCmB",!0)),Makasar:()=>new g(_("g3nCY",!0)),Malayalam:()=>new g(_("goDMCCCyBCCCFFPDZ",!0)),Mandaic:()=>new g(_("giCbDA",!0)),Manichaean:()=>new g(_("g2iCmBFL",!0)),Marchen:()=>new g(_("wjnCfDVCN",!0)),Masaram_Gondi:()=>new g(_("gonCGBCBBCrBBECCBCCBHBJJB",!1)),Medefaidrin:()=>new g(_("gy7C6C",!0)),Meetei_Mayek:()=>new g(_("g3qBWqGtBDJ",!0)),Mende_Kikakui:()=>new g(_("gg6DkGDP",!0)),Meroitic_Cursive:()=>new g(_("gtiCXFTDtB",!0)),Meroitic_Hieroglyphs:()=>new g(_("gsiCf",!0)),Miao:()=>new g(_("g47CqCF4BIQ",!0)),Modi:()=>new g(_("gwlCkCMJ",!0)),Mongolian:()=>new g(_("ggGBBDCCBSBH4CBIqBB2t-BMB",!1)),Mro:()=>new g(_("gy6CeCJFB",!0)),Multani:()=>new g(_("g0kCGBCCCBCBCOBCKB",!1)),Myanmar:()=>new g(_("ggE-EhqmBeiDfxibT",!0)),Nabataean:()=>new g(_("gkiCeJI",!0)),Nag_Mundari:()=>new g(_("wm5DpB",!0)),Nandinagari:()=>new g(_("gtmCHDtBDK",!0)),New_Tai_Lue:()=>new g(_("gsGrBFZHKEB",!0)),Newa:()=>new g(_("gglC7CCE",!0)),Nko:()=>new g(_("g+B6BDC",!0)),Nushu:()=>new g(_("h-7CvsQvsQBqMB",!1)),Nyiakeng_Puachue_Hmong:()=>new g(_("go4DsBENDJFB",!0)),Ogham:()=>new g(_("g0Fc",!0)),Ol_Chiki:()=>new g(_("wiHvB",!0)),Ol_Onal:()=>new g(_("wu5DqBFA",!0)),Old_Hungarian:()=>new g(_("gkjCyBOyBIF",!0)),Old_Italic:()=>new g(_("g4gCjBKC",!0)),Old_North_Arabian:()=>new g(_("g0iCf",!0)),Old_Permic:()=>new g(_("w6gCqB",!0)),Old_Persian:()=>new g(_("g9gCjBFN",!0)),Old_Sogdian:()=>new g(_("g4jCnB",!0)),Old_South_Arabian:()=>new g(_("gziCf",!0)),Old_Turkic:()=>new g(_("ggjCoC",!0)),Old_Uyghur:()=>new g(_("w7jCZ",!0)),Oriya:()=>new g(_("h4CCCHDBDVCGCBCEDIDBDCICFBCEDR",!0)),Osage:()=>new g(_("wlhCjBFjB",!0)),Osmanya:()=>new g(_("gkhCdDJ",!0)),Pahawh_Hmong:()=>new g(_("g46ClCLJCGCUGS",!0)),Palmyrene:()=>new g(_("gjiCf",!0)),Pau_Cin_Hau:()=>new g(_("g2mC4B",!0)),Phags_Pa:()=>new g(_("giqB3B",!0)),Phoenician:()=>new g(_("goiCbEA",!0)),Psalter_Pahlavi:()=>new g(_("g8iCRIDNG",!0)),Rejang:()=>new g(_("wpqBjBMA",!0)),Runic:()=>new g(_("g1FqCEK",!0)),Samaritan:()=>new g(_("ggCtBDO",!0)),Saurashtra:()=>new g(_("gkqBlCJL",!0)),Sharada:()=>new g(_("gskC-ChsCH",!0)),Shavian:()=>new g(_("wihCvB",!0)),Siddham:()=>new g(_("gslC1BDlB",!0)),Sidetic:()=>new g(_("gqiCZ",!0)),SignWriting:()=>new g(_("gg2DrUQECO",!0)),Sinhala:()=>new g(_("hsDCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBt-gCTB",!1)),Sogdian:()=>new g(_("w5jCpB",!0)),Sora_Sompeng:()=>new g(_("wmkCYIJ",!0)),Soyombo:()=>new g(_("wymCyC",!0)),Sundanese:()=>new g(_("g8G-BhIH",!0)),Sunuwar:()=>new g(_("g+mChBPJ",!0)),Syloti_Nagri:()=>new g(_("ggqBsB",!0)),Syriac:()=>new g(_("g4BNC7BDCxIK",!0)),Tagalog:()=>new g(_("g4FVKA",!0)),Tagbanwa:()=>new g(_("g7FMCCCB",!0)),Tai_Le:()=>new g(_("wqGdDE",!0)),Tai_Tham:()=>new g(_("gxG+BCcDKHJHN",!0)),Tai_Viet:()=>new g(_("g0qBiCZE",!0)),Tai_Yo:()=>new g(_("g25DeCVJB",!0)),Takri:()=>new g(_("g0lC5BHJ",!0)),Tamil:()=>new g(_("i8CBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBm+kCxBBOAB",!1)),Tangsa:()=>new g(_("wz6CuCCJ",!0)),Tangut:()=>new g(_("g-7CgBgBB+3GBhQeBiDyDB",!1)),Telugu:()=>new g(_("ggDMCCCWCPDICCCDIBCCCBDDDJII",!0)),Thaana:()=>new g(_("g8BxB",!0)),Thai:()=>new g(_("hwD5BGb",!0)),Tibetan:()=>new g(_("g4DnCCjBFmBCjBCOCGFB",!0)),Tifinagh:()=>new g(_("wpL3BIBPA",!0)),Tirhuta:()=>new g(_("gklCnCJJ",!0)),Todhri:()=>new g(_("guhCzB",!0)),Tolong_Siki:()=>new g(_("wtnCrBFJ",!0)),Toto:()=>new g(_("w04De",!0)),Tulu_Tigalari:()=>new g(_("g8kCJBCDDClBBCJBCDDCDBCJBCBBJBB",!1)),Ugaritic:()=>new g(_("g8gCdCA",!0)),Unknown:()=>new g(_("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-FB",!1)),Vai:()=>new g(_("gopBrJ",!0)),Vithkuqi:()=>new g(_("wrhCKCOCGCBCKCOCGCB",!0)),Wancho:()=>new g(_("g24D5BGA",!0)),Warang_Citi:()=>new g(_("glmCyCNA",!0)),Yezidi:()=>new g(_("g0jCpBCCDB",!0)),Yi:()=>new g(_("ggoBskBE2B",!0)),Zanabazar_Square:()=>new g(_("gwmCnC",!0))})),q($n,"FOLD_CATEGORIES",new ba({L:()=>new g(_("laA",!0)),LC:()=>new g(_("laA",!0)),Ll:()=>new g(_("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGC3HrBrBCEEJHHCCBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHxC9zC9zCBuBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB",!1)),Lt:()=>new g(_("kOCCBCCBCClBCCtsHHBJHBJHBMQQwBAB",!1)),Lu:()=>new g(_("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpL2B2Bs1CvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB",!1)),M:()=>new g(_("5cgBgBlgHAB",!1)),Mn:()=>new g(_("5cgBgBlgHAB",!1)),Emoji:()=>new g(_("8mJA",!0)),Extended_Pictographic:()=>new g(_("8mJA",!0)),Lowercase:()=>new g(_("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHuBPBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB",!1)),Math:()=>new g(_("ycGDCHHFMMDDDCHHFAB",!1)),Uppercase:()=>new g(_("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpLiBiBBOBFsasaBYBn6BvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB",!1))})),q($n,"FOLD_SCRIPT",new ba({Common:()=>new g(_("8cgBgB",!1)),Greek:()=>new g(_("1FwUwU",!1)),Inherited:()=>new g(_("5cgBgBlgHAB",!1))})),$n),we,Y=(we=class{static is32(e,t){let n=0,s=e.length;for(;n<s;){const i=n+Math.floor((s-n)/2),o=e.getLo(i),a=e.getHi(i);if(o<=t&&t<=a){const u=e.getStride(i);return(t-o)%u===0}t<o?s=i:n=i+1}return!1}static is(e,t){if(t<=we.MAX_LATIN1){for(let n=0;n<e.length;n++){if(t>e.getHi(n))continue;const s=e.getLo(n);if(t<s)return!1;const i=e.getStride(n);return(t-s)%i===0}return!1}return e.length>0&&t>=e.getLo(0)&&we.is32(e,t)}static isUpper(e){if(e<=we.MAX_LATIN1){const t=String.fromCodePoint(e);return t.toUpperCase()===t&&t.toLowerCase()!==t}return we.is(yt.Upper,e)}static isPrint(e){return e<=we.MAX_LATIN1?e>=32&&e<we.MAX_ASCII||e>=161&&e!==173:we.is(yt.Print,e)}static simpleFold(e){if(yt.CASE_ORBIT.has(e))return yt.CASE_ORBIT.get(e);const t=L.toLowerCase(e);return t!==e?t:L.toUpperCase(e)}static equalsIgnoreCase(e,t){if(e===t)return!0;if(e<0||t<0)return!1;if(e<=we.MAX_ASCII&&t<=we.MAX_ASCII)return 65<=e&&e<=90&&(e|=32),65<=t&&t<=90&&(t|=32),e===t;for(let n=we.simpleFold(e);n!==e;n=we.simpleFold(n))if(n===t)return!0;return!1}},q(we,"MAX_RUNE",1114111),q(we,"MAX_ASCII",127),q(we,"MAX_LATIN1",255),q(we,"MAX_BMP",65535),q(we,"MIN_FOLD",65),q(we,"MAX_FOLD",125251),q(we,"MIN_HIGH_SURROGATE",55296),q(we,"MAX_HIGH_SURROGATE",56319),q(we,"MIN_LOW_SURROGATE",56320),q(we,"MAX_LOW_SURROGATE",57343),q(we,"MIN_SUPPLEMENTARY_CODE_POINT",65536),we);const ml=256,xg=new Uint8Array(ml);for(let r=0;r<ml;r++)xg[r]=97<=r&&r<=122||65<=r&&r<=90||48<=r&&r<=57||r===95?1:0;let sB=null,iB=null;var be,te=(be=class{static emptyInts(){return[]}static isByteArray(e){return Array.isArray(e)||e instanceof Uint8Array}static isalnum(e){return L.CODES.get("0")<=e&&e<=L.CODES.get("9")||L.CODES.get("a")<=e&&e<=L.CODES.get("z")||L.CODES.get("A")<=e&&e<=L.CODES.get("Z")}static unhex(e){return L.CODES.get("0")<=e&&e<=L.CODES.get("9")?e-L.CODES.get("0"):L.CODES.get("a")<=e&&e<=L.CODES.get("f")?e-L.CODES.get("a")+10:L.CODES.get("A")<=e&&e<=L.CODES.get("F")?e-L.CODES.get("A")+10:-1}static escapeRune(e){let t="";if(Y.isPrint(e))be.METACHARACTERS.indexOf(String.fromCodePoint(e))>=0&&(t+="\\"),t+=String.fromCodePoint(e);else switch(e){case L.CODES.get('"'):t+='\\"';break;case L.CODES.get("\\"):t+="\\\\";break;case L.CODES.get("	"):t+="\\t";break;case L.CODES.get(`
`):t+="\\n";break;case L.CODES.get("\r"):t+="\\r";break;case L.CODES.get("\b"):t+="\\b";break;case L.CODES.get("\f"):t+="\\f";break;default:{let n=e.toString(16);e<256?(t+="\\x",n.length===1&&(t+="0"),t+=n):t+=`\\x{${n}}`;break}}return t}static stringToRunes(e){const t=String(e),n=[];let s=0;for(;s<t.length;){const i=t.codePointAt(s);n.push(i),s+=i>Y.MAX_BMP?2:1}return n}static runeToString(e){return String.fromCodePoint(e)}static isWordRune(e){return e<ml?xg[e]===1:!1}static emptyOpContext(e,t){let n=0;return e<0&&(n|=be.EMPTY_BEGIN_TEXT|be.EMPTY_BEGIN_LINE),e===10&&(n|=be.EMPTY_BEGIN_LINE),t<0&&(n|=be.EMPTY_END_TEXT|be.EMPTY_END_LINE),t===10&&(n|=be.EMPTY_END_LINE),be.isWordRune(e)!==be.isWordRune(t)?n|=be.EMPTY_WORD_BOUNDARY:n|=be.EMPTY_NO_WORD_BOUNDARY,n}static quoteMeta(e){return e.split("").map(t=>be.METACHARACTERS.indexOf(t)>=0?`\\${t}`:t).join("")}static charCount(e){return e>Y.MAX_BMP?2:1}static toArray(e){const t=e.length,n=new Array(t);for(let s=0;s<t;s++)n[s]=e[s];return n}static stringToUtf8ByteArray(e){if(globalThis.TextEncoder)return sB||(sB=new TextEncoder),sB.encode(e);{let t=[],n=0;for(let s=0;s<e.length;s++){let i=e.charCodeAt(s);i<128?t[n++]=i:i<2048?(t[n++]=i>>6|192,t[n++]=i&63|128):(i&64512)===Y.MIN_HIGH_SURROGATE&&s+1<e.length&&(e.charCodeAt(s+1)&64512)===Y.MIN_LOW_SURROGATE?(i=Y.MIN_SUPPLEMENTARY_CODE_POINT+((i&1023)<<10)+(e.charCodeAt(++s)&1023),t[n++]=i>>18|240,t[n++]=i>>12&63|128,t[n++]=i>>6&63|128,t[n++]=i&63|128):(t[n++]=i>>12|224,t[n++]=i>>6&63|128,t[n++]=i&63|128)}return t}}static utf8ByteArrayToString(e){if(globalThis.TextDecoder){iB||(iB=new TextDecoder("utf-8"));const t=e instanceof Uint8Array?e:new Uint8Array(e);return iB.decode(t)}else{let t=[],n=0,s=0;for(;n<e.length;){let i=e[n++];if(i<128)t[s++]=String.fromCharCode(i);else if(i>191&&i<224){let o=e[n++];t[s++]=String.fromCharCode((i&31)<<6|o&63)}else if(i>239&&i<365){let o=e[n++],a=e[n++],u=e[n++],B=((i&7)<<18|(o&63)<<12|(a&63)<<6|u&63)-Y.MIN_SUPPLEMENTARY_CODE_POINT;t[s++]=String.fromCharCode(Y.MIN_HIGH_SURROGATE+(B>>10)),t[s++]=String.fromCharCode(Y.MIN_LOW_SURROGATE+(B&1023))}else{let o=e[n++],a=e[n++];t[s++]=String.fromCharCode((i&15)<<12|(o&63)<<6|a&63)}}return t.join("")}}},q(be,"METACHARACTERS","\\.+*?()|[]{}^$"),q(be,"EMPTY_BEGIN_LINE",1),q(be,"EMPTY_END_LINE",2),q(be,"EMPTY_BEGIN_TEXT",4),q(be,"EMPTY_END_TEXT",8),q(be,"EMPTY_WORD_BOUNDARY",16),q(be,"EMPTY_NO_WORD_BOUNDARY",32),q(be,"EMPTY_ALL",-1),be);const Vg=(r=[],e=0)=>{const t=Object.create(null);for(let n=0;n<r.length;n++){const s=r[n],i=e+n;t[s]=i,t[i]=s}return Object.freeze(t)};var ar,rs=(ar=class{getEncoding(){throw Error("not implemented")}asCharSequence(){throw Error("not implemented")}asBytes(){throw Error("not implemented")}length(){throw Error("not implemented")}isUTF8Encoding(){return this.getEncoding()===ar.Encoding.UTF_8}isUTF16Encoding(){return this.getEncoding()===ar.Encoding.UTF_16}},q(ar,"Encoding",Vg(["UTF_16","UTF_8"])),ar),Rf=class extends rs{constructor(r=null){super(),this.bytes=r}getEncoding(){return rs.Encoding.UTF_8}asCharSequence(){return te.utf8ByteArrayToString(this.bytes)}asBytes(){return this.bytes}length(){return this.bytes.length}},TT=class extends rs{constructor(r=null){super(),this.charSequence=r}getEncoding(){return rs.Encoding.UTF_16}asCharSequence(){return this.charSequence}asBytes(){return te.stringToUtf8ByteArray(this.charSequence.toString())}length(){return this.charSequence.length}},qr=class{static utf16(r){return new TT(r)}static utf8(r){return te.isByteArray(r)?new Rf(r):new Rf(te.stringToUtf8ByteArray(r))}},mt=class{static EOF(){return-8}constructor(){this.end=0}canCheckPrefix(){return!0}endPos(){return this.end}hasString(){return!1}hasAnyString(){return!1}prefixLength(){return 0}},AT=class extends mt{constructor(r,e=0,t=r.length){super(),this.bytes=r,this.start=e,this.end=t}hasString(r,e){const t=r.bytes;if(t.length===0)return!0;const n=this.indexOf(this.bytes,t,this.start+e);return n!==-1&&n<=this.end-t.length}hasAnyString(r,e){return r.ac8?r.ac8.searchUTF8(this.bytes,this.start+e,this.end):!1}step(r){if(r+=this.start,r>=this.end)return mt.EOF();const e=this.bytes[r]&255;if(e<128)return e<<3|1;if(e>=194&&e<=223&&r+1<this.end){const t=this.bytes[r+1]&255;return(t&192)!==128?e<<3|1:((e&31)<<6|t&63)<<3|2}else if(e>=224&&e<=239&&r+2<this.end){const t=this.bytes[r+1]&255;if((t&192)!==128)return e<<3|1;const n=this.bytes[r+2]&255;return(n&192)!==128?e<<3|1:((e&15)<<12|(t&63)<<6|n&63)<<3|3}else if(e>=240&&e<=244&&r+3<this.end){const t=this.bytes[r+1]&255;if((t&192)!==128)return e<<3|1;const n=this.bytes[r+2]&255;if((n&192)!==128)return e<<3|1;const s=this.bytes[r+3]&255;return(s&192)!==128?e<<3|1:((e&7)<<18|(t&63)<<12|(n&63)<<6|s&63)<<3|4}else return e<<3|1}index(r,e){e+=this.start;const t=this.indexOf(this.bytes,r.prefixUTF8,e);return t<0?t:t-e}context(r){r+=this.start;let e=-1;if(r>this.start&&r<=this.end){let n=r-1;if(e=this.bytes[n--],e>=128){let s=r-4;for(s<this.start&&(s=this.start);n>=s&&(this.bytes[n]&192)===128;)n--;n<this.start&&(n=this.start),e=this.step(n-this.start)>>3}}const t=r<this.end?this.step(r-this.start)>>3:-1;return te.emptyOpContext(e,t)}indexOf(r,e,t=0){let n=e.length;if(n===0)return t<=this.end?t:-1;const s=e[0];let i=this.end-n;const o=typeof r.indexOf=="function";let a=t;for(;a<=i;){if(o){if(a=r.indexOf(s,a),a===-1||a>i)return-1}else{for(;a<=i&&r[a]!==s;)a++;if(a>i)return-1}let u=!0;for(let B=1;B<n;B++)if(r[a+B]!==e[B]){u=!1;break}if(u)return a;a++}return-1}prefixLength(r){return r.prefixUTF8.length}},RT=class extends mt{constructor(r,e=0,t=r.length){super(),this.charSequence=r,this.start=e,this.end=t}hasString(r,e){const t=this.charSequence.indexOf(r.str,this.start+e);return t!==-1&&t<=this.end-r.str.length}hasAnyString(r,e){return r.ac16?r.ac16.searchUTF16(this.charSequence,this.start+e,this.end):!1}step(r){if(r+=this.start,r>=this.end)return mt.EOF();const e=this.charSequence.charCodeAt(r);if(e<Y.MIN_HIGH_SURROGATE||e>Y.MAX_HIGH_SURROGATE||r+1>=this.end)return e<<3|1;const t=this.charSequence.charCodeAt(r+1);return t>=Y.MIN_LOW_SURROGATE&&t<=Y.MAX_LOW_SURROGATE?(e-Y.MIN_HIGH_SURROGATE)*1024+(t-Y.MIN_LOW_SURROGATE)+Y.MIN_SUPPLEMENTARY_CODE_POINT<<3|2:e<<3|1}index(r,e){e+=this.start;const t=this.charSequence.indexOf(r.prefix,e);return t<0||t>this.end-r.prefix.length?-1:t-e}context(r){r+=this.start;const e=r>this.start&&r<=this.end?this.charSequence.charCodeAt(r-1):-1,t=r<this.end?this.charSequence.charCodeAt(r):-1;return te.emptyOpContext(e,t)}prefixLength(r){return r.prefix.length}},Pe=class{static fromUTF8(r,e=0,t=r.length){return new AT(r,e,t)}static fromUTF16(r,e=0,t=r.length){return new RT(r,e,t)}},Qo=class extends Error{constructor(r){super(r),this.name="RE2JSException"}},Ae=class extends Qo{constructor(r,e=null){let t=`error parsing regexp: ${r}`;e&&(t+=`: \`${e}\``),super(t),this.name="RE2JSSyntaxException",this.message=t,this.error=r,this.input=e}getDescription(){return this.error}getPattern(){return this.input}},vT=class extends Qo{constructor(r){super(r),this.name="RE2JSCompileException"}},Dt=class extends Qo{constructor(r){super(r),this.name="RE2JSGroupException"}},PT=class extends Qo{constructor(r){super(r),this.name="RE2JSFlagsException"}},oo=class extends Qo{constructor(r){super(r),this.name="RE2JSInternalException"}},Jr,vf=(Jr=class{static quoteReplacement(e,t=!1){return t?e.indexOf("\\")<0&&e.indexOf("$")<0?e:e.split("").map(n=>{const s=n.codePointAt(0);return s===L.CODES.get("\\")||s===L.CODES.get("$")?`\\${n}`:n}).join(""):e.indexOf("$")<0?e:e.split("").map(n=>n.codePointAt(0)===L.CODES.get("$")?"$$":n).join("")}constructor(e,t){if(e===null)throw new Error("pattern is null");this.patternInput=e;const n=this.patternInput.re2();this.patternGroupCount=n.numberOfCapturingGroups(),this.groups=[],this.namedGroups=n.namedGroups,this.numberOfInstructions=n.numberOfInstructions(),t instanceof rs?this.resetMatcherInput(t):te.isByteArray(t)?this.resetMatcherInput(qr.utf8(t)):this.resetMatcherInput(qr.utf16(t))}pattern(){return this.patternInput}reset(){return this.matcherInputLength=this.matcherInput.length(),this.appendPos=0,this.hasMatch=!1,this.hasGroups=!1,this.anchorFlag=0,this}resetMatcherInput(e){if(e===null)throw new Error("input is null");return e instanceof rs||(te.isByteArray(e)?e=qr.utf8(e):e=qr.utf16(e)),this.matcherInput=e,this.reset(),this}start(e=0){if(typeof e=="string"){const t=this.namedGroups[e];if(!Number.isFinite(t))throw new Dt(`group '${e}' not found`);e=t}return this.loadGroup(e),this.groups[2*e]}end(e=0){if(typeof e=="string"){const t=this.namedGroups[e];if(!Number.isFinite(t))throw new Dt(`group '${e}' not found`);e=t}return this.loadGroup(e),this.groups[2*e+1]}programSize(){return this.numberOfInstructions}group(e=0){if(typeof e=="string"){const s=this.namedGroups[e];if(!Number.isFinite(s))throw new Dt(`group '${e}' not found`);e=s}const t=this.start(e),n=this.end(e);return t<0&&n<0?null:this.substring(t,n)}getNamedGroups(){if(!this.hasMatch)throw new Dt("perhaps no match attempted");const e=Object.create(null);for(const t of Object.keys(this.namedGroups))e[t]=this.group(t);return e}groupCount(){return this.patternGroupCount}loadGroup(e){if(e<0||e>this.patternGroupCount)throw new Dt(`Group index out of bounds: ${e}`);if(!this.hasMatch)throw new Dt("perhaps no match attempted");if(e===0||this.hasGroups)return;const t=this.matcherInputLength,n=this.patternInput.re2().matchMachineInput(this.matcherInput,this.groups[0],t,this.anchorFlag,1+this.patternGroupCount);if(!n[0])throw new Dt("inconsistency in matching group data");this.groups=n[1],this.hasGroups=!0}matches(){return this.genMatch(0,M.ANCHOR_BOTH)}lookingAt(){return this.genMatch(0,M.ANCHOR_START)}find(e=null){if(e!==null){if(e<0||e>this.matcherInputLength)throw new Dt(`start index out of bounds: ${e}`);return this.reset(),this.genMatch(e,0)}if(e=0,this.hasMatch&&(e=this.groups[1],this.groups[0]===this.groups[1])){const t=(this.matcherInput.isUTF16Encoding()?Pe.fromUTF16(this.matcherInput.asCharSequence(),0,this.matcherInputLength):Pe.fromUTF8(this.matcherInput.asBytes(),0,this.matcherInputLength)).step(e);t<0?e++:e+=t&7}return this.genMatch(e,M.UNANCHORED)}genMatch(e,t){const n=this.patternInput.re2().matchMachineInput(this.matcherInput,e,this.matcherInputLength,t,1);return n[0]?(this.groups=n[1],this.hasMatch=!0,this.hasGroups=this.patternGroupCount===0,this.anchorFlag=t,!0):(this.hasMatch=!1,!1)}substring(e,t){return this.matcherInput.isUTF8Encoding()?te.utf8ByteArrayToString(this.matcherInput.asBytes().slice(e,t)):this.matcherInput.asCharSequence().substring(e,t).toString()}inputLength(){return this.matcherInputLength}appendReplacement(e,t=!1){let n="";const s=this.start(),i=this.end();return this.appendPos<s&&(n+=this.substring(this.appendPos,s)),this.appendPos=i,n+=t?this.appendReplacementInternalJava(e):this.appendReplacementInternalJs(e),n}appendReplacementInternalJava(e){let t="",n=0;const s=e.length;let i=0;for(;i<s;){const o=e.codePointAt(i);if(o===L.CODES.get("\\")){if(n<i&&(t+=e.substring(n,i)),i++,i>=s)throw new Dt("character to be escaped is missing");n=i,i++;continue}if(o===L.CODES.get("$")){if(n<i&&(t+=e.substring(n,i)),i+1>=s)throw new Dt("Illegal group reference: group index is missing");const a=e.codePointAt(i+1);if(L.CODES.get("0")<=a&&a<=L.CODES.get("9")){let u=a-L.CODES.get("0"),B=i+2;for(;B<s;B++){const d=e.codePointAt(B);if(d<L.CODES.get("0")||d>L.CODES.get("9")||u*10+d-L.CODES.get("0")>this.patternGroupCount)break;u=u*10+d-L.CODES.get("0")}if(u>this.patternGroupCount)throw new Dt(`n > number of groups: ${u}`);const l=this.group(u);l!==null&&(t+=l),i=B,n=i}else if(a===L.CODES.get("{")){let u=i+2;for(;u<s&&e.codePointAt(u)!==L.CODES.get("}");)u++;if(u>=s)throw new Dt("named capture group is missing trailing '}'");const B=e.substring(i+2,u),l=this.group(B);l!==null&&(t+=l),i=u+1,n=i}else throw new Dt("Illegal group reference");continue}i++}return n<s&&(t+=e.substring(n,s)),t}appendReplacementInternalJs(e){let t="",n=0;const s=e.length;for(let i=0;i<s-1;i++)if(e.codePointAt(i)===L.CODES.get("$")){let o=e.codePointAt(i+1);if(L.CODES.get("$")===o){n<i&&(t+=e.substring(n,i)),t+="$",i++,n=i+1;continue}else if(L.CODES.get("&")===o){n<i&&(t+=e.substring(n,i));const a=this.group(0);a!==null?t+=a:t+="$&",i++,n=i+1;continue}else if(L.CODES.get("`")===o){n<i&&(t+=e.substring(n,i)),t+=this.substring(0,this.start(0)),i++,n=i+1;continue}else if(L.CODES.get("'")===o){n<i&&(t+=e.substring(n,i)),t+=this.substring(this.end(0),this.matcherInputLength),i++,n=i+1;continue}else if(L.CODES.get("1")<=o&&o<=L.CODES.get("9")){let a=o-L.CODES.get("0");for(n<i&&(t+=e.substring(n,i)),i+=2;i<s&&(o=e.codePointAt(i),!(o<L.CODES.get("0")||o>L.CODES.get("9")||a*10+o-L.CODES.get("0")>this.patternGroupCount));i++)a=a*10+o-L.CODES.get("0");if(a>this.patternGroupCount){t+=`$${a}`,n=i,i--;continue}const u=this.group(a);u!==null&&(t+=u),n=i,i--;continue}else if(o===L.CODES.get("<")){n<i&&(t+=e.substring(n,i)),i++;let a=i+1;for(;a<e.length&&e.codePointAt(a)!==L.CODES.get(">")&&e.codePointAt(a)!==L.CODES.get(" ");)a++;if(a===e.length||e.codePointAt(a)!==L.CODES.get(">")){t+=e.substring(i-1,a+1),n=a+1,i=a;continue}const u=e.substring(i+1,a);if(Object.prototype.hasOwnProperty.call(this.namedGroups,u)){const B=this.group(u);B!==null&&(t+=B)}else t+=`$<${u}>`;n=a+1,i=a;continue}}return n<s&&(t+=e.substring(n,s)),t}appendTail(){return this.substring(this.appendPos,this.matcherInputLength)}replaceAll(e,t=!1){return this.replace(e,!0,t)}replaceFirst(e,t=!1){return this.replace(e,!1,t)}replace(e,t=!0,n=!1){let s="";this.reset();const i=typeof e=="function",o=Object.keys(this.namedGroups).length>0;let a=null;if(i){if(this.groupCount()>=Jr.MAX_REPLACER_ARGS)throw new Dt("Too many capture groups to safely invoke replacer function");a=this.matcherInput.isUTF8Encoding()?this.matcherInput.asBytes():this.matcherInput.asCharSequence()}for(;this.find()&&(s+=i?this.appendReplacementFunc(e,o,a):this.appendReplacement(e,n),!!t););return s+=this.appendTail(),s}appendReplacementFunc(e,t,n){let s="";const i=this.start(),o=this.end();this.appendPos<i&&(s+=this.substring(this.appendPos,i)),this.appendPos=o;const a=this.buildReplacerArgs(i,t,n);return s+=String(e(...a)),s}buildReplacerArgs(e,t,n){const s=[this.group(0)],i=this.groupCount();for(let o=1;o<=i;o++){const a=this.start(o);a<0?s.push(void 0):s.push(this.substring(a,this.end(o)))}if(s.push(e),s.push(n),t){const o=this.getNamedGroups();for(const a in o)o[a]===null&&(o[a]=void 0);s.push(o)}return s}},q(Jr,"MAX_REPLACER_ARGS",65535),Jr),Ce,k=(Ce=class{static isRuneOp(e){return Ce.RUNE<=e&&e<=Ce.RUNE_ANY_NOT_NL}static escapeRunes(e){let t='"';for(let n of e)t+=te.escapeRune(n);return t+='"',t}constructor(e){this.op=e,this.out=0,this.arg=0,this.runes=[],this.next=null}matchRune(e){if(this.runes.length===1){const o=this.runes[0];return this.arg&M.FOLD_CASE?Y.equalsIgnoreCase(o,e):e===o}const t=this.runes.length;if(t===0)return!1;if(t===2||t===4||t===6||t===8){for(let o=0;o<t;o+=2){if(e<this.runes[o])return!1;if(e<=this.runes[o+1])return!0}return!1}let n=0,s=t>>1;for(;s>1;){const o=s>>1;n+=this.runes[n+o<<1]<=e?o:0,s-=o}n+=this.runes[n<<1]<=e?1:0;const i=n-1;return i>=0&&e<=this.runes[i<<1|1]}matchRunePos(e){if(this.runes.length===1){const o=this.runes[0];return this.arg&M.FOLD_CASE?Y.equalsIgnoreCase(o,e)?0:-1:e===o?0:-1}const t=this.runes.length;if(t===0)return-1;if(t===2||t===4||t===6||t===8){for(let o=0;o<t;o+=2){if(e<this.runes[o])return-1;if(e<=this.runes[o+1])return Math.floor(o/2)}return-1}let n=0,s=t>>1;for(;s>1;){const o=s>>1;n+=this.runes[n+o<<1]<=e?o:0,s-=o}n+=this.runes[n<<1]<=e?1:0;const i=n-1;return i>=0&&e<=this.runes[i<<1|1]?i:-1}toString(){switch(this.op){case Ce.ALT:return`alt -> ${this.out}, ${this.arg}`;case Ce.ALT_MATCH:return`altmatch -> ${this.out}, ${this.arg}`;case Ce.CAPTURE:return`cap ${this.arg} -> ${this.out}`;case Ce.EMPTY_WIDTH:return`empty ${this.arg} -> ${this.out}`;case Ce.MATCH:return`match${this.arg!==0?` ${this.arg}`:""}`;case Ce.FAIL:return"fail";case Ce.NOP:return`nop -> ${this.out}`;case Ce.LB_WRITE:return`lbwrite ${this.arg} -> ${this.out}`;case Ce.LB_CHECK:return`lbcheck ${this.arg} -> ${this.out}`;case Ce.RUNE:return this.runes===null?"rune <null>":["rune ",Ce.escapeRunes(this.runes),this.arg&M.FOLD_CASE?"/i":""," -> ",this.out].join("");case Ce.RUNE1:return`rune1 ${Ce.escapeRunes(this.runes)} -> ${this.out}`;case Ce.RUNE_ANY:return`any -> ${this.out}`;case Ce.RUNE_ANY_NOT_NL:return`anynotnl -> ${this.out}`;default:throw new Error("unhandled case in Inst.toString")}}},q(Ce,"ALT",1),q(Ce,"ALT_MATCH",2),q(Ce,"CAPTURE",3),q(Ce,"EMPTY_WIDTH",4),q(Ce,"FAIL",5),q(Ce,"MATCH",6),q(Ce,"NOP",7),q(Ce,"RUNE",8),q(Ce,"RUNE1",9),q(Ce,"RUNE_ANY",10),q(Ce,"RUNE_ANY_NOT_NL",11),q(Ce,"LB_WRITE",12),q(Ce,"LB_CHECK",13),Ce),Pf=class{constructor(r){this.sparse=new Int32Array(r),this.densePcs=new Int32Array(r),this.denseCaps=null,this.size=0,this.ncap=0}init(r){this.ncap=r;const e=this.densePcs.length*r;(!this.denseCaps||this.denseCaps.length<e)&&(this.denseCaps=new Int32Array(e))}contains(r){const e=this.sparse[r];return e<this.size&&this.densePcs[e]===r}isEmpty(){return this.size===0}add(r){const e=this.size++;return this.sparse[r]=e,this.densePcs[e]=r,e}clear(){this.size=0}toString(){let r="{";for(let e=0;e<this.size;e++)e!==0&&(r+=", "),r+=this.densePcs[e];return r+="}",r}},bT=class PB{static fromRE2(e){const t=new PB;return t.prog=e.prog,t.re2=e,t.q0=new Pf(t.prog.numInst()),t.q1=new Pf(t.prog.numInst()),t.matched=!1,t.matchcap=new Int32Array(t.prog.numCap<2?2:t.prog.numCap),t.ncap=0,t}static fromMachine(e){return PB.fromRE2(e.re2)}constructor(){this.prog=null,this.re2=null,this.q0=null,this.q1=null,this.matched=!1,this.matchcap=null,this.ncap=0,this.lbTable=null}init(e){this.ncap=e,e>this.matchcap.length?this.matchcap=new Int32Array(e).fill(-1):this.matchcap.fill(-1),this.q0.init(e),this.q1.init(e),this.prog.numLb>0&&((!this.lbTable||this.lbTable.length<this.prog.numLb+1)&&(this.lbTable=new Int32Array(this.prog.numLb+1)),this.lbTable.fill(-1))}submatches(){return this.ncap===0?te.emptyInts():te.toArray(this.matchcap.subarray(0,this.ncap))}match(e,t,n){const s=this.re2.cond;if(s===te.EMPTY_ALL||(n===M.ANCHOR_START||n===M.ANCHOR_BOTH)&&t!==0)return!1;this.matched=!1,this.matchcap.fill(-1);let i=this.prog.numLb>0?0:t,o=t,a=this.q0,u=this.q1,B=e.step(i),l=B>>3,d=B&7,C=-1,m=0;B!==mt.EOF()&&(B=e.step(i+d),C=B>>3,m=B&7);let y;for(i===0?y=te.emptyOpContext(-1,l):y=e.context(i);;){if(a.isEmpty()){if(s&te.EMPTY_BEGIN_TEXT&&i!==0||(n===M.ANCHOR_START||n===M.ANCHOR_BOTH)&&i!==0||this.matched)break;if(this.prog.numLb===0&&this.re2.prefix.length!==0&&C!==this.re2.prefixRune&&e.canCheckPrefix()){const z=e.index(this.re2,i);if(z<0)break;i+=z,B=e.step(i),l=B>>3,d=B&7,B=e.step(i+d),C=B>>3,m=B&7,y=e.context(i)}}if(i===0&&this.prog.numLb>0)for(let z=0;z<this.prog.lbStarts.length;z++)this.add(a,this.prog.lbStarts[z],i,this.matchcap,0,y);!this.matched&&(i===0||n===M.UNANCHORED)&&i>=o&&(this.ncap>0&&(this.matchcap[0]=i),this.add(a,this.prog.start,i,this.matchcap,0,y));const O=i+d;if(y=e.context(O),this.step(a,u,i,O,l,y,n,i===e.endPos()),d===0||this.ncap===0&&this.matched)break;i+=d,l=C,d=m,l!==-1&&(B=e.step(i+d),C=B>>3,m=B&7);const V=a;a=u,u=V}return u.clear(),this.matched}matchSet(e,t,n){const s=this.re2.cond;if(s===te.EMPTY_ALL)return[];if((n===M.ANCHOR_START||n===M.ANCHOR_BOTH)&&t!==0)return[];let i=this.prog.numLb>0?0:t,o=t,a=this.q0,u=this.q1,B=e.step(i),l=B>>3,d=B&7,C=-1,m=0;B!==mt.EOF()&&(B=e.step(i+d),C=B>>3,m=B&7);let y=i===0?te.emptyOpContext(-1,l):e.context(i);const O=new Set;for(;!(a.isEmpty()&&(s&te.EMPTY_BEGIN_TEXT&&i!==0||(n===M.ANCHOR_START||n===M.ANCHOR_BOTH)&&i!==0));){if(i===0&&this.prog.numLb>0)for(let Z=0;Z<this.prog.lbStarts.length;Z++)this.add(a,this.prog.lbStarts[Z],i,this.matchcap,0,y);(i===0||n===M.UNANCHORED)&&i>=o&&this.add(a,this.prog.start,i,this.matchcap,0,y);const V=i+d;y=e.context(V);for(let Z=0;Z<a.size;Z++){const ne=a.densePcs[Z],oe=this.prog.inst[ne],Be=Z*this.ncap;let ue=!1;switch(oe.op){case k.MATCH:if(n===M.ANCHOR_BOTH&&i!==e.endPos())break;O.add(oe.arg);break;case k.RUNE:ue=oe.matchRune(l);break;case k.RUNE1:ue=l===oe.runes[0];break;case k.RUNE_ANY:ue=!0;break;case k.RUNE_ANY_NOT_NL:ue=l!==10;break;default:continue}ue&&this.add(u,oe.out,V,a.denseCaps,Be,y)}if(a.clear(),d===0)break;i+=d,l=C,d=m,l!==-1&&(B=e.step(i+d),C=B>>3,m=B&7);const z=a;a=u,u=z}return u.clear(),Array.from(O).sort((V,z)=>V-z)}step(e,t,n,s,i,o,a,u){const B=this.re2.longest;for(let l=0;l<e.size;l++){const d=e.densePcs[l],C=l*this.ncap;if(B&&this.matched&&this.ncap>0&&this.matchcap[0]<e.denseCaps[C])continue;const m=this.prog.inst[d];let y=!1;switch(m.op){case k.MATCH:if(a===M.ANCHOR_BOTH&&!u)break;if(this.ncap>0&&(!B||!this.matched||this.matchcap[1]<n)){e.denseCaps[C+1]=n;for(let O=0;O<this.ncap;O++)this.matchcap[O]=e.denseCaps[C+O]}B||(e.size=0),this.matched=!0;break;case k.RUNE:y=m.matchRune(i);break;case k.RUNE1:y=i===m.runes[0];break;case k.RUNE_ANY:y=!0;break;case k.RUNE_ANY_NOT_NL:y=i!==10;break;default:continue}y&&this.add(t,m.out,s,e.denseCaps,C,o)}e.clear()}add(e,t,n,s,i,o){for(;;){if(t===0||e.contains(t))return;const a=e.add(t),u=this.prog.inst[t];switch(u.op){case k.FAIL:return;case k.ALT:case k.ALT_MATCH:this.add(e,u.out,n,s,i,o),t=u.arg;continue;case k.EMPTY_WIDTH:if(!(u.arg&~o)){t=u.out;continue}return;case k.NOP:t=u.out;continue;case k.CAPTURE:if(u.arg<this.ncap){const B=s[i+u.arg];s[i+u.arg]=n,this.add(e,u.out,n,s,i,o),s[i+u.arg]=B;return}else{t=u.out;continue}case k.LB_WRITE:this.lbTable[Math.abs(u.arg)]=n,t=u.out;continue;case k.LB_CHECK:if(u.arg>0){if(this.lbTable[u.arg]===n){t=u.out;continue}}else if(this.lbTable[-u.arg]!==n){t=u.out;continue}return;case k.MATCH:case k.RUNE:case k.RUNE1:case k.RUNE_ANY:case k.RUNE_ANY_NOT_NL:if(this.ncap>0){const B=a*this.ncap;for(let l=0;l<this.ncap;l++)e.denseCaps[B+l]=s[i+l]}return;default:throw new oo("unhandled")}}}};const bf=r=>{let e=-2128831035;for(let t=0;t<r.length;t++)e^=r[t],e=Math.imul(e,16777619);return e},ST=(r,e)=>{if(r.length!==e.length)return!1;for(let t=0;t<r.length;t++)if(r[t]!==e[t])return!1;return!0};var NT=class{constructor(r,e,t=[]){this.nfaStates=r,this.isMatch=e,this.matchIDs=t,this.nextLatin1=new Array(Y.MAX_LATIN1+1).fill(null),this.nextLatin1Anchored=new Array(Y.MAX_LATIN1+1).fill(null),this.transKeys=[],this.transVals=[],this.lastSeen=0}},_n,OT=(_n=class{constructor(e,t=8388608){this.prog=e,this.stateCache=new Map,this.stateCount=0,this.startState=null,this.stateLimit=Math.max(1,Math.floor(t/_n.STATE_MEMORY_ESTIMATE)),this.cacheClears=0,this.failed=!1,this.clock=0}computeClosure(e){const t=new Set,n=[...e];let s=!1;const i=[];for(;n.length>0;){const a=n.pop();if(t.has(a))continue;t.add(a);const u=this.prog.getInst(a);switch(u.op){case k.MATCH:s=!0,i.includes(u.arg)||i.push(u.arg);break;case k.ALT:case k.ALT_MATCH:n.push(u.out),n.push(u.arg);break;case k.NOP:case k.CAPTURE:n.push(u.out);break;case k.EMPTY_WIDTH:case k.LB_WRITE:case k.LB_CHECK:return null}}const o=Int32Array.from(t).sort();return i.sort((a,u)=>a-u),{pcs:o,isMatch:s,matchIDs:i}}getState(e){const t=this.computeClosure(e);if(!t)return null;const n=t.pcs,s=bf(n);let i=this.stateCache.get(s);if(i)for(let a=0;a<i.length;a++){const u=i[a];if(ST(u.nfaStates,n))return u.lastSeen=++this.clock,u}else i=[],this.stateCache.set(s,i);if(this.failed)return null;if(this.stateCount>=this.stateLimit){if(this.cacheClears++,this.cacheClears>=_n.MAX_CACHE_CLEARS)return this.failed=!0,this.stateCache.clear(),this.stateCount=0,this.startState=null,null;this.evictCache(),i=this.stateCache.get(s),i||(i=[],this.stateCache.set(s,i))}const o=new NT(n,t.isMatch,t.matchIDs);return o.lastSeen=++this.clock,i.push(o),this.stateCount++,o}evictCache(){const e=[];for(const o of this.stateCache.values())for(let a=0;a<o.length;a++)e.push(o[a]);e.sort((o,a)=>o.lastSeen-a.lastSeen);const t=Math.max(1,Math.floor(this.stateLimit/2)),n=e.length-t,s=e.slice(n),i=new Set(s);this.stateCache.clear(),this.stateCount=0;for(let o=0;o<s.length;o++){const a=s[o];a.nextLatin1.fill(null),a.nextLatin1Anchored.fill(null),a.transKeys.length=0,a.transVals.length=0;const u=bf(a.nfaStates);let B=this.stateCache.get(u);B||(B=[],this.stateCache.set(u,B)),B.push(a),this.stateCount++}this.startState&&!i.has(this.startState)&&(this.startState=null)}step(e,t,n){if(t<=Y.MAX_LATIN1)if(n===M.UNANCHORED){const o=e.nextLatin1[t];if(o!==null)return o}else{const o=e.nextLatin1Anchored[t];if(o!==null)return o}else{const o=t+(n===M.UNANCHORED?0:Y.MAX_RUNE+1),a=e.transKeys,u=a.length;for(let B=0;B<u;B++)if(a[B]===o)return e.transVals[B]}const s=[];for(let o=0;o<e.nfaStates.length;o++){const a=e.nfaStates[o],u=this.prog.getInst(a);k.isRuneOp(u.op)&&u.matchRune(t)&&s.push(u.out)}n===M.UNANCHORED&&s.push(this.prog.start);const i=this.getState(s);if(t<=Y.MAX_LATIN1)n===M.UNANCHORED?e.nextLatin1[t]=i:e.nextLatin1Anchored[t]=i;else{const o=t+(n===M.UNANCHORED?0:Y.MAX_RUNE+1);e.transKeys.push(o),e.transVals.push(i)}return i}match(e,t,n){if((n===M.ANCHOR_START||n===M.ANCHOR_BOTH)&&t!==0)return!1;if(!this.startState&&(this.startState=this.getState([this.prog.start]),!this.startState))return null;let s=e.endPos(),i=this.startState;if(i.isMatch)if(n===M.ANCHOR_BOTH){if(t===s)return!0}else return!0;let o=t;for(;o<s;){const a=e.step(o),u=a>>3,B=a&7;if(B===0)break;if(i=n===M.UNANCHORED&&u<=Y.MAX_LATIN1&&i.nextLatin1[u]||this.step(i,u,n),i===null)return null;if(i.lastSeen=++this.clock,i.isMatch)if(n===M.ANCHOR_BOTH){if(o+B===s)return!0}else return!0;if(i.nfaStates.length===0&&n!==M.UNANCHORED)return!1;o+=B}return!1}matchSet(e,t,n){if((n===M.ANCHOR_START||n===M.ANCHOR_BOTH)&&t!==0)return[];if(!this.startState&&(this.startState=this.getState([this.prog.start]),!this.startState))return null;let s=e.endPos(),i=this.startState;const o=new Set,a=(B,l)=>{B.isMatch&&(n===M.ANCHOR_BOTH?l===s&&B.matchIDs.forEach(d=>o.add(d)):B.matchIDs.forEach(d=>o.add(d)))};a(i,t);let u=t;for(;u<s;){const B=e.step(u),l=B>>3,d=B&7;if(d===0)break;if(i=n===M.UNANCHORED&&l<=Y.MAX_LATIN1&&i.nextLatin1[l]||this.step(i,l,n),i===null)return null;if(i.lastSeen=++this.clock,u+=d,a(i,u),i.nfaStates.length===0&&n!==M.UNANCHORED)break}return Array.from(o).sort((B,l)=>B-l)}},q(_n,"MAX_CACHE_CLEARS",5),q(_n,"STATE_MEMORY_ESTIMATE",838),_n);const FT=32,LT=500,oB=256,kT=256*1024;var xT=class{constructor(){this.end=0,this.cap=new Int32Array(0),this.matchcap=new Int32Array(0),this.ncap=0,this.jobPc=new Int32Array(oB),this.jobArg=new Uint8Array(oB),this.jobPos=new Int32Array(oB),this.jobLen=0,this.visited=new Uint32Array(0)}reset(r,e,t){this.end=e,this.jobLen=0,this.ncap=t;const n=r.numInst()*(e+1)+FT-1>>>5;this.visited.length<n?this.visited=new Uint32Array(n):this.visited.fill(0,0,n),this.cap.length<t?this.cap=new Int32Array(t).fill(-1):this.cap.fill(-1,0,t),this.matchcap.length<t?this.matchcap=new Int32Array(t).fill(-1):this.matchcap.fill(-1,0,t)}shouldVisit(r,e){const t=r*(this.end+1)+e,n=t>>>5,s=1<<(t&31);return this.visited[n]&s?!1:(this.visited[n]|=s,!0)}push(r,e,t,n){if(r.prog.getInst(e).op!==k.FAIL&&(n||this.shouldVisit(e,t))){if(this.jobLen>=this.jobPc.length){const s=this.jobPc.length*2,i=new Int32Array(s);i.set(this.jobPc),this.jobPc=i;const o=new Uint8Array(s);o.set(this.jobArg),this.jobArg=o;const a=new Int32Array(s);a.set(this.jobPos),this.jobPos=a}this.jobPc[this.jobLen]=e,this.jobArg[this.jobLen]=n?1:0,this.jobPos[this.jobLen]=t,this.jobLen++}}tryBacktrack(r,e,t,n,s){const i=r.longest;for(this.push(r,t,n,!1);this.jobLen>0;){this.jobLen--;let o=this.jobPc[this.jobLen],a=this.jobArg[this.jobLen]===1,u=this.jobPos[this.jobLen],B=!0;for(;!(!B&&!this.shouldVisit(o,u));){B=!1;const l=r.prog.getInst(o);switch(l.op){case k.FAIL:throw new oo("unexpected InstFail");case k.ALT:if(a){a=!1,o=l.arg;continue}else{this.push(r,o,u,!0),o=l.out;continue}case k.ALT_MATCH:{const d=r.prog.getInst(l.out);if(k.isRuneOp(d.op)){this.push(r,l.arg,u,!1),o=l.arg,u=this.end;continue}this.push(r,l.out,this.end,!1),o=l.out;continue}case k.RUNE:{const d=e.step(u);if(d===mt.EOF()||!l.matchRune(d>>3))break;u+=d&7,o=l.out;continue}case k.RUNE1:{const d=e.step(u);if(d===mt.EOF()||d>>3!==l.runes[0])break;u+=d&7,o=l.out;continue}case k.RUNE_ANY_NOT_NL:{const d=e.step(u);if(d===mt.EOF()||d>>3===10)break;u+=d&7,o=l.out;continue}case k.RUNE_ANY:{const d=e.step(u);if(d===mt.EOF())break;u+=d&7,o=l.out;continue}case k.CAPTURE:if(a){this.cap[l.arg]=u;break}else{l.arg<this.ncap&&(this.push(r,o,this.cap[l.arg],!0),this.cap[l.arg]=u),o=l.out;continue}case k.EMPTY_WIDTH:{const d=e.context(u);if(l.arg&~d)break;o=l.out;continue}case k.NOP:o=l.out;continue;case k.MATCH:{if(s===M.ANCHOR_BOTH&&u!==this.end)break;if(this.ncap===0)return!0;this.ncap>1&&(this.cap[1]=u);const d=this.matchcap[1];if((d===-1||i&&u>0&&u>d)&&this.matchcap.set(this.cap),!i||u===this.end)return!0;break}case k.LB_WRITE:case k.LB_CHECK:throw new oo("Backtracker cannot evaluate Lookbehind instructions");default:throw new oo("bad inst")}break}}return i&&this.matchcap.length>1&&this.matchcap[1]>=0}};const Sa=[];var Na=class Mg{static shouldBacktrack(e){return e.numInst()<=LT}static maxBitStateLen(e){return Mg.shouldBacktrack(e)?Math.floor(kT/e.numInst()):0}static execute(e,t,n,s,i){const o=e.cond;if(o===te.EMPTY_ALL||(s===M.ANCHOR_START||s===M.ANCHOR_BOTH)&&n!==0||o&te.EMPTY_BEGIN_TEXT&&n!==0)return null;const a=Sa.length>0?Sa.pop():new xT,u=t.endPos();a.reset(e.prog,u,i);let B=!1;if(o&te.EMPTY_BEGIN_TEXT||s===M.ANCHOR_START||s===M.ANCHOR_BOTH)a.ncap>0&&(a.cap[0]=n),a.tryBacktrack(e,t,e.prog.start,n,s)&&(B=!0);else{let d=-1;for(;n<=u&&d!==0;n+=d){if(e.prefix.length>0){const m=t.index(e,n);if(m<0)break;n+=m}if(a.ncap>0&&(a.cap[0]=n),a.tryBacktrack(e,t,e.prog.start,n,s)){B=!0;break}const C=t.step(n);d=C===mt.EOF()?0:C&7}}if(!B)return Sa.push(a),null;const l=i===0?[]:te.toArray(a.matchcap.subarray(0,i));return Sa.push(a),l}},Sf=class{constructor(r){this.sparse=new Uint32Array(r),this.dense=new Uint32Array(r),this.size=0,this.nextIndex=0}empty(){return this.nextIndex>=this.size}next(){return this.dense[this.nextIndex++]}clear(){this.size=0,this.nextIndex=0}contains(r){return r<this.sparse.length&&this.sparse[r]<this.size&&this.dense[this.sparse[r]]===r}insert(r){this.contains(r)||this.insertNew(r)}insertNew(r){r>=this.sparse.length||(this.sparse[r]=this.size,this.dense[this.size]=r,this.size++)}};const VT=(r,e,t,n)=>{const s=r.length,i=e.length;let o=0,a=0;const u=[],B=[];let l=!0,d=-1;const C=m=>{const y=m?r:e,O=m?o:a,V=m?t:n;return d>0&&y[O]<=u[d]?!1:(u.push(y[O],y[O+1]),m?o+=2:a+=2,d+=2,B.push(V),!0)};for(;o<s||a<i;)if(a>=i?l=C(!0):o>=s||e[a]<r[o]?l=C(!1):l=C(!0),!l)return null;return{merged:u,next:B}};var MT=class{constructor(r){this.start=r.start,this.numCap=r.numCap,this.inst=new Array(r.inst.length);for(let e=0;e<r.inst.length;e++){const t=r.inst[e],n=new k(t.op);n.out=t.out,n.arg=t.arg,n.runes=t.runes?t.runes.slice():[],n.next=null,this.inst[e]=n}}};const GT=r=>{const e=new MT(r);for(let t=0;t<e.inst.length;t++){const n=e.inst[t];if(n.op!==k.ALT&&n.op!==k.ALT_MATCH)continue;let s="out",i="arg",o=e.inst[n[i]];if(o.op!==k.ALT&&o.op!==k.ALT_MATCH&&(s="arg",i="out",o=e.inst[n[i]],o.op!==k.ALT&&o.op!==k.ALT_MATCH))continue;const a=e.inst[n[s]];if(a.op===k.ALT||a.op===k.ALT_MATCH)continue;let u="out",B="arg",l=!1;o.out===t?l=!0:o.arg===t&&(l=!0,u="arg",B="out"),l&&(o[u]=n[s]),n[s]===o[u]&&(n[i]=o[B])}return e},UT=r=>{if(r.inst.length>=1e3)return null;const e=new Sf(r.inst.length),t=new Sf(r.inst.length),n=new Array(r.inst.length),s=new Array(r.inst.length).fill(!1),i=o=>{let a=!0;const u=r.inst[o];if(t.contains(o))return!0;switch(t.insert(o),u.op){case k.ALT:case k.ALT_MATCH:{a=i(u.out)&&i(u.arg);let B=s[u.out],l=s[u.arg];if(B&&l)return!1;if(l){const y=u.out;u.out=u.arg,u.arg=y;const O=B;B=l,l=O}B&&(s[o]=!0,u.op=k.ALT_MATCH);const d=n[u.out]||[],C=n[u.arg]||[],m=VT(d,C,u.out,u.arg);if(!m)return!1;n[o]=m.merged,u.next=new Uint32Array(m.next);break}case k.CAPTURE:case k.EMPTY_WIDTH:case k.NOP:a=i(u.out),s[o]=s[u.out],n[o]=n[u.out]?n[u.out].slice():[],u.next=new Uint32Array(Math.floor(n[o].length/2)+1).fill(u.out);break;case k.MATCH:case k.FAIL:s[o]=u.op===k.MATCH;break;case k.RUNE:{if(s[o]=!1,u.next&&u.next.length>0)break;if(e.insert(u.out),!u.runes||u.runes.length===0){n[o]=[],u.next=new Uint32Array([u.out]);break}let B=[];if(u.runes.length===1&&u.arg&M.FOLD_CASE){const l=u.runes[0];B.push(l,l);for(let d=Y.simpleFold(l);d!==l;d=Y.simpleFold(d))B.push(d,d);B.sort((d,C)=>d-C)}else for(let l=0;l<u.runes.length;l++)B.push(u.runes[l]);n[o]=B,u.next=new Uint32Array(Math.floor(B.length/2)+1).fill(u.out),u.op=k.RUNE;break}case k.RUNE1:{if(s[o]=!1,u.next&&u.next.length>0)break;e.insert(u.out);let B=[];if(u.arg&M.FOLD_CASE){const l=u.runes[0];B.push(l,l);for(let d=Y.simpleFold(l);d!==l;d=Y.simpleFold(d))B.push(d,d);B.sort((d,C)=>d-C)}else B.push(u.runes[0],u.runes[0]);n[o]=B,u.next=new Uint32Array(Math.floor(B.length/2)+1).fill(u.out),u.op=k.RUNE;break}case k.RUNE_ANY:if(s[o]=!1,u.next&&u.next.length>0)break;e.insert(u.out),n[o]=[0,Y.MAX_RUNE],u.next=new Uint32Array([u.out]);break;case k.RUNE_ANY_NOT_NL:if(s[o]=!1,u.next&&u.next.length>0)break;e.insert(u.out),n[o]=[0,9,11,Y.MAX_RUNE],u.next=new Uint32Array(Math.floor(n[o].length/2)+1).fill(u.out);break}return a};for(e.clear(),e.insert(r.start);!e.empty();)if(t.clear(),!i(e.next()))return null;for(let o=0;o<r.inst.length;o++)n[o]&&(r.inst[o].runes=n[o]);return r},HT=(r,e)=>{for(let t=0;t<e.inst.length;t++){const n=e.inst[t];switch(n.op){case k.ALT:case k.ALT_MATCH:case k.RUNE:break;case k.CAPTURE:case k.EMPTY_WIDTH:case k.NOP:case k.MATCH:case k.FAIL:r.inst[t].next=null;break;case k.RUNE1:case k.RUNE_ANY:case k.RUNE_ANY_NOT_NL:r.inst[t].next=null,r.inst[t].op=n.op,r.inst[t].runes=n.runes?n.runes.slice():[];break}}};var Nf=class Gg{static compile(e){if(e.start===0||e.numLb>0)return null;const t=e.inst[e.start];if(t.op!==k.EMPTY_WIDTH||!(t.arg&te.EMPTY_BEGIN_TEXT))return null;let n=!1;for(let i=0;i<e.inst.length;i++)if(e.inst[i].op===k.ALT||e.inst[i].op===k.ALT_MATCH){n=!0;break}for(let i=0;i<e.inst.length;i++){const o=e.inst[i],a=e.inst[o.out].op;switch(o.op){case k.ALT:case k.ALT_MATCH:if(a===k.MATCH||e.inst[o.arg].op===k.MATCH)return null;break;case k.EMPTY_WIDTH:if(a===k.MATCH){if((o.arg&te.EMPTY_END_TEXT)===te.EMPTY_END_TEXT)continue;return null}break;default:if(a===k.MATCH&&n)return null;break}}let s=GT(e);return s=UT(s),s!==null&&HT(s,e),s}static next(e,t){const n=e.matchRunePos(t);return n>=0?e.next[n]:e.op===k.ALT_MATCH?e.out:0}static execute(e,t,n,s,i){const o=e.onepass;if(!o)return null;const a=new Int32Array(i).fill(-1);let u=!1,B=t.step(n),l=B>>3,d=B&7,C=mt.EOF(),m=-1,y=0;B!==mt.EOF()&&(C=t.step(n+d),C!==mt.EOF()&&(m=C>>3,y=C&7));let O=n===0?te.emptyOpContext(-1,l):t.context(n),V=o.start,z;for(;;){switch(z=o.inst[V],V=z.out,z.op){case k.MATCH:return s===M.ANCHOR_BOTH&&n!==t.endPos()?null:(u=!0,a.length>0&&(a[0]=0,a[1]=n),i===0?[]:te.toArray(a));case k.RUNE:if(!z.matchRune(l))return null;break;case k.RUNE1:if(l!==z.runes[0])return null;break;case k.RUNE_ANY:break;case k.RUNE_ANY_NOT_NL:if(l===10)return null;break;case k.ALT:case k.ALT_MATCH:V=Gg.next(z,l);continue;case k.FAIL:return null;case k.NOP:continue;case k.EMPTY_WIDTH:if(z.arg&~O)return null;continue;case k.CAPTURE:z.arg<a.length&&(a[z.arg]=n);continue;default:throw new oo("bad inst")}if(d===0)break;O=te.emptyOpContext(l,m),n+=d,l=m,d=y,l!==-1&&(C=t.step(n+d),C!==mt.EOF()?(m=C>>3,y=C&7):(m=-1,y=0))}return u?i===0?[]:te.toArray(a):null}},re,A=(re=class{static isPseudoOp(e){return e>=re.Op.LEFT_PAREN}static emptySubs(){return[]}static quoteIfHyphen(e){return e===L.CODES.get("-")?"\\":""}static fromRegexp(e){const t=new re(e.op);return t.flags=e.flags,t.subs=e.subs,t.runes=e.runes,t.cap=e.cap,t.min=e.min,t.max=e.max,t.name=e.name,t.namedGroups=e.namedGroups,t.lb=e.lb,t}constructor(e){this.op=e,this.flags=0,this.subs=re.emptySubs(),this.runes=[],this.min=0,this.max=0,this.cap=0,this.name=null,this.namedGroups=Object.create(null),this.lb=0}reinit(){this.flags=0,this.subs=re.emptySubs(),this.runes=[],this.cap=0,this.min=0,this.max=0,this.name=null,this.namedGroups=Object.create(null),this.lb=0}toString(){return this.appendTo()}appendTo(){let e="";switch(this.op){case re.Op.NO_MATCH:e+="[^\\x00-\\x{10FFFF}]";break;case re.Op.EMPTY_MATCH:e+="(?:)";break;case re.Op.STAR:case re.Op.PLUS:case re.Op.QUEST:case re.Op.REPEAT:{const t=this.subs[0];switch(t.op>re.Op.CAPTURE||t.op===re.Op.LITERAL&&t.runes.length>1?e+=`(?:${t.appendTo()})`:e+=t.appendTo(),this.op){case re.Op.STAR:e+="*";break;case re.Op.PLUS:e+="+";break;case re.Op.QUEST:e+="?";break;case re.Op.REPEAT:e+=`{${this.min}`,this.min!==this.max&&(e+=",",this.max>=0&&(e+=this.max)),e+="}";break}this.flags&M.NON_GREEDY&&(e+="?");break}case re.Op.CONCAT:for(let t of this.subs)t.op===re.Op.ALTERNATE?e+=`(?:${t.appendTo()})`:e+=t.appendTo();break;case re.Op.ALTERNATE:{let t="";for(let n of this.subs)e+=t,t="|",e+=n.appendTo();break}case re.Op.LITERAL:this.flags&M.FOLD_CASE&&(e+="(?i:");for(let t of this.runes)e+=te.escapeRune(t);this.flags&M.FOLD_CASE&&(e+=")");break;case re.Op.ANY_CHAR_NOT_NL:e+="(?-s:.)";break;case re.Op.ANY_CHAR:e+="(?s:.)";break;case re.Op.PLB:e+=`(?<=${this.subs[0].appendTo()})`;break;case re.Op.NLB:e+=`(?<!${this.subs[0].appendTo()})`;break;case re.Op.CAPTURE:this.name===null||this.name.length===0?e+="(":e+=`(?P<${this.name}>`,this.subs[0].op!==re.Op.EMPTY_MATCH&&(e+=this.subs[0].appendTo()),e+=")";break;case re.Op.BEGIN_TEXT:e+="\\A";break;case re.Op.END_TEXT:this.flags&M.WAS_DOLLAR?e+="(?-m:$)":e+="\\z";break;case re.Op.BEGIN_LINE:e+="^";break;case re.Op.END_LINE:e+="$";break;case re.Op.WORD_BOUNDARY:e+="\\b";break;case re.Op.NO_WORD_BOUNDARY:e+="\\B";break;case re.Op.CHAR_CLASS:if(this.runes.length%2!==0){e+="[invalid char class]";break}if(e+="[",this.runes.length===0)e+="^\\x00-\\x{10FFFF}";else if(this.runes[0]===0&&this.runes[this.runes.length-1]===Y.MAX_RUNE){e+="^";for(let t=1;t<this.runes.length-1;t+=2){const n=this.runes[t]+1,s=this.runes[t+1]-1;e+=re.quoteIfHyphen(n),e+=te.escapeRune(n),n!==s&&(e+="-",e+=re.quoteIfHyphen(s),e+=te.escapeRune(s))}}else for(let t=0;t<this.runes.length;t+=2){const n=this.runes[t],s=this.runes[t+1];e+=re.quoteIfHyphen(n),e+=te.escapeRune(n),n!==s&&(e+="-",e+=re.quoteIfHyphen(s),e+=te.escapeRune(s))}e+="]";break;default:e+=this.op;break}return e}maxCap(){let e=0;if(this.op===re.Op.CAPTURE&&(e=this.cap),this.subs!==null)for(let t of this.subs){const n=t.maxCap();e<n&&(e=n)}return e}equals(e){if(!(e!==null&&e instanceof re)||this.op!==e.op)return!1;switch(this.op){case re.Op.END_TEXT:if((this.flags&M.WAS_DOLLAR)!==(e.flags&M.WAS_DOLLAR))return!1;break;case re.Op.LITERAL:case re.Op.CHAR_CLASS:if(this.runes===null&&e.runes===null)break;if(this.runes===null||e.runes===null||this.runes.length!==e.runes.length)return!1;for(let t=0;t<this.runes.length;t++)if(this.runes[t]!==e.runes[t])return!1;break;case re.Op.ALTERNATE:case re.Op.CONCAT:if(this.subs.length!==e.subs.length)return!1;for(let t=0;t<this.subs.length;++t)if(!this.subs[t].equals(e.subs[t]))return!1;break;case re.Op.STAR:case re.Op.PLUS:case re.Op.QUEST:if((this.flags&M.NON_GREEDY)!==(e.flags&M.NON_GREEDY)||!this.subs[0].equals(e.subs[0]))return!1;break;case re.Op.REPEAT:if((this.flags&M.NON_GREEDY)!==(e.flags&M.NON_GREEDY)||this.min!==e.min||this.max!==e.max||!this.subs[0].equals(e.subs[0]))return!1;break;case re.Op.CAPTURE:if(this.cap!==e.cap||(this.name===null?e.name!==null:this.name!==e.name)||!this.subs[0].equals(e.subs[0]))return!1;break;case re.Op.PLB:case re.Op.NLB:if(this.lb!==e.lb||!this.subs[0].equals(e.subs[0]))return!1;break}return!0}},q(re,"Op",Vg(["NO_MATCH","EMPTY_MATCH","LITERAL","CHAR_CLASS","ANY_CHAR_NOT_NL","ANY_CHAR","BEGIN_LINE","END_LINE","BEGIN_TEXT","END_TEXT","WORD_BOUNDARY","NO_WORD_BOUNDARY","CAPTURE","STAR","PLUS","QUEST","REPEAT","CONCAT","ALTERNATE","PLB","NLB","LEFT_PAREN","VERTICAL_BAR"])),re),Of=class{constructor(r){this.next=[Object.create(null)],this.fail=[0],this.match=[!1];for(const t of r){let n=0;for(let s=0;s<t.length;s++){const i=t[s];i in this.next[n]||(this.next.push(Object.create(null)),this.fail.push(0),this.match.push(!1),this.next[n][i]=this.next.length-1),n=this.next[n][i]}this.match[n]=!0}const e=[];for(const t in this.next[0])if(Object.prototype.hasOwnProperty.call(this.next[0],t)){const n=this.next[0][t];this.fail[n]=0,e.push(n)}for(;e.length>0;){const t=e.shift();for(const n in this.next[t])if(Object.prototype.hasOwnProperty.call(this.next[t],n)){const s=this.next[t][n];let i=this.fail[t];for(;i!==0&&!(n in this.next[i]);)i=this.fail[i];n in this.next[i]?this.fail[s]=this.next[i][n]:this.fail[s]=0,this.match[s]=this.match[s]||this.match[this.fail[s]],e.push(s)}}}searchUTF16(r,e,t){let n=0;for(let s=e;s<t;s++){const i=r.charCodeAt(s);for(;n!==0&&!(i in this.next[n]);)n=this.fail[n];if(i in this.next[n]&&(n=this.next[n][i]),this.match[n])return!0}return!1}searchUTF8(r,e,t){let n=0;for(let s=e;s<t;s++){const i=r[s];for(;n!==0&&!(i in this.next[n]);)n=this.fail[n];if(i in this.next[n]&&(n=this.next[n][i]),this.match[n])return!0}return!1}},on,me=(on=class{constructor(e){this.type=e,this.subs=[],this.str="",this.bytes=null,this.ac16=null,this.ac8=null}eval(e,t){switch(this.type){case on.Type.NONE:return!0;case on.Type.EXACT:return e.hasString(this,t);case on.Type.AND:for(let n=0;n<this.subs.length;n++)if(!this.subs[n].eval(e,t))return!1;return!0;case on.Type.OR:if(this.ac16&&this.ac8)return e.hasAnyString(this,t);for(let n=0;n<this.subs.length;n++)if(this.subs[n].eval(e,t))return!0;return!1;default:return!0}}},q(on,"Type",{NONE:0,EXACT:1,AND:2,OR:3}),on),qT=class pn{static build(e){const t=pn.fromRegexp(e);return pn.simplify(t)}static fromRegexp(e){if(!e)return new me(me.Type.NONE);switch(e.op){case A.Op.PLB:case A.Op.NLB:case A.Op.NO_MATCH:case A.Op.EMPTY_MATCH:case A.Op.BEGIN_LINE:case A.Op.END_LINE:case A.Op.BEGIN_TEXT:case A.Op.END_TEXT:case A.Op.WORD_BOUNDARY:case A.Op.NO_WORD_BOUNDARY:case A.Op.CHAR_CLASS:case A.Op.ANY_CHAR_NOT_NL:case A.Op.ANY_CHAR:return new me(me.Type.NONE);case A.Op.LITERAL:{if(e.runes.length===0||e.flags&M.FOLD_CASE)return new me(me.Type.NONE);const t=new me(me.Type.EXACT);let n="";for(let s=0;s<e.runes.length;s++)n+=String.fromCodePoint(e.runes[s]);return t.str=n,t.bytes=te.stringToUtf8ByteArray(t.str),t}case A.Op.CAPTURE:case A.Op.PLUS:return pn.fromRegexp(e.subs[0]);case A.Op.REPEAT:return e.min>=1?pn.fromRegexp(e.subs[0]):new me(me.Type.NONE);case A.Op.CONCAT:{const t=new me(me.Type.AND);for(const n of e.subs)t.subs.push(pn.fromRegexp(n));return t}case A.Op.ALTERNATE:{const t=new me(me.Type.OR);for(const n of e.subs)t.subs.push(pn.fromRegexp(n));return t}default:return new me(me.Type.NONE)}}static simplify(e){if(e.type===me.Type.EXACT||e.type===me.Type.NONE)return e;if(e.type===me.Type.AND){const t=[];for(const n of e.subs){const s=pn.simplify(n);if(s.type!==me.Type.NONE)if(s.type===me.Type.AND)for(let i=0;i<s.subs.length;i++)t.push(s.subs[i]);else t.push(s)}return t.length===0?new me(me.Type.NONE):t.length===1?t[0]:(e.subs=t,e)}if(e.type===me.Type.OR){const t=[];for(const o of e.subs){const a=pn.simplify(o);if(a.type===me.Type.NONE)return new me(me.Type.NONE);if(a.type===me.Type.OR)for(let u=0;u<a.subs.length;u++)t.push(a.subs[u]);else t.push(a)}if(t.length===0)return new me(me.Type.NONE);if(t.length===1)return t[0];const n=new Set,s=[];for(const o of t)o.type===me.Type.EXACT?n.has(o.str)||(n.add(o.str),s.push(o)):s.push(o);e.subs=s;let i=!0;for(const o of s)if(o.type!==me.Type.EXACT){i=!1;break}return i&&s.length>1&&(e.ac16=new Of(s.map(o=>{const a=[];for(let u=0;u<o.str.length;u++)a.push(o.str.charCodeAt(u));return a})),e.ac8=new Of(s.map(o=>o.bytes))),e}return e}},Gt=class{constructor(r=0,e=0){this.head=r,this.tail=e}},jT=class{constructor(){this.inst=[],this.start=0,this.numCap=2,this.lbStarts=[],this.numLb=0}getInst(r){return this.inst[r]}numInst(){return this.inst.length}addInst(r){this.inst.push(new k(r))}skipNop(r){let e=this.inst[r];for(;e.op===k.NOP||e.op===k.CAPTURE;)e=this.inst[r],r=e.out;return e}prefix(){let r="",e=this.skipNop(this.start);if(!k.isRuneOp(e.op)||e.runes.length!==1)return[e.op===k.MATCH,r];for(;k.isRuneOp(e.op)&&e.runes.length===1&&!(e.arg&M.FOLD_CASE);)r+=String.fromCodePoint(e.runes[0]),e=this.skipNop(e.out);return[e.op===k.MATCH,r]}startCond(){let r=0,e=this.start;e:for(;;){const t=this.inst[e];switch(t.op){case k.EMPTY_WIDTH:r|=t.arg;break;case k.FAIL:return-1;case k.CAPTURE:case k.NOP:break;default:break e}e=t.out}return r}patch(r,e){let t=r.head;for(;t!==0;){const n=this.inst[t>>1];t&1?(t=n.arg,n.arg=e):(t=n.out,n.out=e)}}append(r,e){if(r.head===0)return e;if(e.head===0)return r;const t=this.inst[r.tail>>1];return r.tail&1?t.arg=e.head:t.out=e.head,new Gt(r.head,e.tail)}toString(){let r="";for(let e=0;e<this.inst.length;e++){const t=r.length;r+=e,e===this.start&&(r+="*"),r+="        ".substring(r.length-t),r+=this.inst[e],r+=`
`}return r}},Oa=class{constructor(r=0,e=new Gt,t=!1){this.i=r,this.out=e,this.nullable=t}},KT=class ks{static ANY_RUNE_NOT_NL(){return[0,L.CODES.get(`
`)-1,L.CODES.get(`
`)+1,Y.MAX_RUNE]}static ANY_RUNE(){return[0,Y.MAX_RUNE]}static compileRegexp(e){const t=new ks,n=t.compile(e);return t.prog.patch(n.out,t.newInst(k.MATCH).i),t.prog.start=n.i,t.prog}static compileSet(e){const t=new ks;if(e.length===0)return t.prog.start=t.newInst(k.FAIL).i,t.prog;let n=[];for(let i=0;i<e.length;i++){const o=t.compile(e[i]),a=t.newInst(k.MATCH);t.prog.getInst(a.i).arg=i,t.prog.patch(o.out,a.i),n.push(o.i)}let s=n[0];for(let i=1;i<n.length;i++){const o=t.newInst(k.ALT),a=t.prog.getInst(o.i);a.out=s,a.arg=n[i],s=o.i}return t.prog.start=s,t.prog}constructor(){this.prog=new jT,this.newInst(k.FAIL)}newInst(e){return this.prog.addInst(e),new Oa(this.prog.numInst()-1,new Gt,!0)}nop(){const e=this.newInst(k.NOP);return e.out=new Gt(e.i<<1,e.i<<1),e}fail(){return new Oa}cap(e){const t=this.newInst(k.CAPTURE);return t.out=new Gt(t.i<<1,t.i<<1),this.prog.getInst(t.i).arg=e,this.prog.numCap<e+1&&(this.prog.numCap=e+1),t}cat(e,t){return e.i===0||t.i===0?this.fail():(this.prog.patch(e.out,t.i),new Oa(e.i,t.out,e.nullable&&t.nullable))}alt(e,t){if(e.i===0)return t;if(t.i===0)return e;const n=this.newInst(k.ALT),s=this.prog.getInst(n.i);return s.out=e.i,s.arg=t.i,n.out=this.prog.append(e.out,t.out),n.nullable=e.nullable||t.nullable,n}loop(e,t){const n=this.newInst(k.ALT),s=this.prog.getInst(n.i);return t?(s.arg=e.i,n.out=new Gt(n.i<<1,n.i<<1)):(s.out=e.i,n.out=new Gt(n.i<<1|1,n.i<<1|1)),this.prog.patch(e.out,n.i),n}quest(e,t){const n=this.newInst(k.ALT),s=this.prog.getInst(n.i);return t?(s.arg=e.i,n.out=new Gt(n.i<<1,n.i<<1)):(s.out=e.i,n.out=new Gt(n.i<<1|1,n.i<<1|1)),n.out=this.prog.append(n.out,e.out),n}star(e,t){return e.nullable?this.quest(this.plus(e,t),t):this.loop(e,t)}plus(e,t){return new Oa(e.i,this.loop(e,t).out,e.nullable)}empty(e){const t=this.newInst(k.EMPTY_WIDTH);return this.prog.getInst(t.i).arg=e,t.out=new Gt(t.i<<1,t.i<<1),t}rune(e,t){const n=this.newInst(k.RUNE);n.nullable=!1;const s=this.prog.getInst(n.i);return s.runes=e,t&=M.FOLD_CASE,(e.length!==1||Y.simpleFold(e[0])===e[0])&&(t&=-2),s.arg=t,n.out=new Gt(n.i<<1,n.i<<1),!(t&M.FOLD_CASE)&&e.length===1||e.length===2&&e[0]===e[1]?s.op=k.RUNE1:e.length===2&&e[0]===0&&e[1]===Y.MAX_RUNE?s.op=k.RUNE_ANY:e.length===4&&e[0]===0&&e[1]===L.CODES.get(`
`)-1&&e[2]===L.CODES.get(`
`)+1&&e[3]===Y.MAX_RUNE&&(s.op=k.RUNE_ANY_NOT_NL),n}lookBehind(e,t){const n=this.newInst(k.LB_WRITE);this.prog.getInst(n.i).arg=t;const s=this.rune(ks.ANY_RUNE(),0),i=this.star(s,!0),o=this.cat(i,e);this.prog.patch(o.out,n.i);const a=this.newInst(k.LB_CHECK);return this.prog.getInst(a.i).arg=t,this.prog.lbStarts.push(o.i),Math.abs(t)>this.prog.numLb&&(this.prog.numLb=Math.abs(t)),a.out=new Gt(a.i<<1,a.i<<1),a}compile(e){switch(e.op){case A.Op.NO_MATCH:return this.fail();case A.Op.EMPTY_MATCH:return this.nop();case A.Op.LITERAL:if(e.runes.length===0)return this.nop();{let t=null;for(let n of e.runes){const s=this.rune([n],e.flags);t=t===null?s:this.cat(t,s)}return t}case A.Op.CHAR_CLASS:return this.rune(e.runes,e.flags);case A.Op.ANY_CHAR_NOT_NL:return this.rune(ks.ANY_RUNE_NOT_NL(),0);case A.Op.ANY_CHAR:return this.rune(ks.ANY_RUNE(),0);case A.Op.BEGIN_LINE:return this.empty(te.EMPTY_BEGIN_LINE);case A.Op.END_LINE:return this.empty(te.EMPTY_END_LINE);case A.Op.BEGIN_TEXT:return this.empty(te.EMPTY_BEGIN_TEXT);case A.Op.END_TEXT:return this.empty(te.EMPTY_END_TEXT);case A.Op.WORD_BOUNDARY:return this.empty(te.EMPTY_WORD_BOUNDARY);case A.Op.NO_WORD_BOUNDARY:return this.empty(te.EMPTY_NO_WORD_BOUNDARY);case A.Op.PLB:case A.Op.NLB:return this.lookBehind(this.compile(e.subs[0]),e.lb);case A.Op.CAPTURE:{const t=this.cap(e.cap<<1),n=this.compile(e.subs[0]),s=this.cap(e.cap<<1|1);return this.cat(this.cat(t,n),s)}case A.Op.STAR:return this.star(this.compile(e.subs[0]),(e.flags&M.NON_GREEDY)!==0);case A.Op.PLUS:return this.plus(this.compile(e.subs[0]),(e.flags&M.NON_GREEDY)!==0);case A.Op.QUEST:return this.quest(this.compile(e.subs[0]),(e.flags&M.NON_GREEDY)!==0);case A.Op.CONCAT:if(e.subs.length===0)return this.nop();{let t=null;for(let n of e.subs){const s=this.compile(n);t=t===null?s:this.cat(t,s)}return t}case A.Op.ALTERNATE:if(e.subs.length===0)return this.nop();{let t=null;for(let n of e.subs){const s=this.compile(n);t=t===null?s:this.alt(t,s)}return t}default:throw new vT("regexp: unhandled case in compile")}}},JT=class St{static simplify(e){if(e===null)return null;switch(e.op){case A.Op.PLB:case A.Op.NLB:case A.Op.CAPTURE:{const t=St.simplify(e.subs[0]);if(t!==e.subs[0]){const n=A.fromRegexp(e);return n.runes=[],n.subs=[t],n}return e}case A.Op.CONCAT:case A.Op.ALTERNATE:{const t=[];let n=!1;for(let s=0;s<e.subs.length;s++){const i=e.subs[s],o=St.simplify(i);if(o!==i&&(n=!0),e.op===A.Op.CONCAT){if(o.op===A.Op.NO_MATCH)return new A(A.Op.NO_MATCH);if(o.op===A.Op.EMPTY_MATCH){n=!0;continue}if(o.op===A.Op.CONCAT){n=!0;for(let a=0;a<o.subs.length;a++)t.push(o.subs[a]);continue}}else if(e.op===A.Op.ALTERNATE){if(o.op===A.Op.NO_MATCH){n=!0;continue}if(o.op===A.Op.ALTERNATE){n=!0;for(let a=0;a<o.subs.length;a++)t.push(o.subs[a]);continue}}t.push(o)}if(n){if(t.length===0)return new A(e.op===A.Op.CONCAT?A.Op.EMPTY_MATCH:A.Op.NO_MATCH);if(t.length===1)return t[0];const s=A.fromRegexp(e);return s.runes=[],s.subs=t,s}return e}case A.Op.CHAR_CLASS:return e.runes===null?e:e.runes.length===0?new A(A.Op.NO_MATCH):e.runes.length===2&&e.runes[0]===0&&e.runes[1]===Y.MAX_RUNE?new A(A.Op.ANY_CHAR):e.runes.length===4&&e.runes[0]===0&&e.runes[1]===L.CODES.get(`
`)-1&&e.runes[2]===L.CODES.get(`
`)+1&&e.runes[3]===Y.MAX_RUNE?new A(A.Op.ANY_CHAR_NOT_NL):e;case A.Op.STAR:case A.Op.PLUS:case A.Op.QUEST:{const t=St.simplify(e.subs[0]);return St.simplify1(e.op,e.flags,t,e)}case A.Op.REPEAT:{if(e.min===0&&e.max===0)return new A(A.Op.EMPTY_MATCH);const t=St.simplify(e.subs[0]);if(e.max===-1){if(e.min===0)return St.simplify1(A.Op.STAR,e.flags,t,null);if(e.min===1)return St.simplify1(A.Op.PLUS,e.flags,t,null);const s=new A(A.Op.CONCAT),i=[];for(let o=0;o<e.min-1;o++)i.push(t);return i.push(St.simplify1(A.Op.PLUS,e.flags,t,null)),s.subs=i.slice(0),St.simplify(s)}if(e.min===1&&e.max===1)return t;let n=null;if(e.min>0){n=[];for(let s=0;s<e.min;s++)n.push(t)}if(e.max>e.min){let s=St.simplify1(A.Op.QUEST,e.flags,t,null);for(let i=e.min+1;i<e.max;i++){const o=new A(A.Op.CONCAT);o.subs=[t,s],s=St.simplify1(A.Op.QUEST,e.flags,o,null)}if(n===null)return s;n.push(s)}if(n!==null){const s=new A(A.Op.CONCAT);return s.subs=n.slice(0),St.simplify(s)}return new A(A.Op.NO_MATCH)}}return e}static simplify1(e,t,n,s){if(n.op===A.Op.EMPTY_MATCH)return n;if(n.op===A.Op.NO_MATCH)return e===A.Op.PLUS?n:new A(A.Op.EMPTY_MATCH);if(e===n.op&&(t&M.NON_GREEDY)===(n.flags&M.NON_GREEDY))return n;if(s!==null&&s.op===e&&(s.flags&M.NON_GREEDY)===(t&M.NON_GREEDY)&&n===s.subs[0])return s;const i=new A(e);return i.flags=t,i.subs=[n],i}},ge=class{constructor(r,e){this.sign=r,this.cls=e}};const Ff=[48,57],Lf=[9,10,12,13,32,32],kf=[48,57,65,90,95,95,97,122],xf=new Map([["\\d",new ge(1,Ff)],["\\D",new ge(-1,Ff)],["\\s",new ge(1,Lf)],["\\S",new ge(-1,Lf)],["\\w",new ge(1,kf)],["\\W",new ge(-1,kf)]]),Vf=[48,57,65,90,97,122],Mf=[65,90,97,122],Gf=[0,127],Uf=[9,9,32,32],Hf=[0,31,127,127],qf=[48,57],jf=[33,126],Kf=[97,122],Jf=[32,126],zf=[33,47,58,64,91,96,123,126],Qf=[9,13,32,32],Wf=[65,90],$f=[48,57,65,90,95,95,97,122],Yf=[48,57,65,70,97,102],Xf=new Map([["[:alnum:]",new ge(1,Vf)],["[:^alnum:]",new ge(-1,Vf)],["[:alpha:]",new ge(1,Mf)],["[:^alpha:]",new ge(-1,Mf)],["[:ascii:]",new ge(1,Gf)],["[:^ascii:]",new ge(-1,Gf)],["[:blank:]",new ge(1,Uf)],["[:^blank:]",new ge(-1,Uf)],["[:cntrl:]",new ge(1,Hf)],["[:^cntrl:]",new ge(-1,Hf)],["[:digit:]",new ge(1,qf)],["[:^digit:]",new ge(-1,qf)],["[:graph:]",new ge(1,jf)],["[:^graph:]",new ge(-1,jf)],["[:lower:]",new ge(1,Kf)],["[:^lower:]",new ge(-1,Kf)],["[:print:]",new ge(1,Jf)],["[:^print:]",new ge(-1,Jf)],["[:punct:]",new ge(1,zf)],["[:^punct:]",new ge(-1,zf)],["[:space:]",new ge(1,Qf)],["[:^space:]",new ge(-1,Qf)],["[:upper:]",new ge(1,Wf)],["[:^upper:]",new ge(-1,Wf)],["[:word:]",new ge(1,$f)],["[:^word:]",new ge(-1,$f)],["[:xdigit:]",new ge(1,Yf)],["[:^xdigit:]",new ge(-1,Yf)]]);var Kn=class Yn{static charClassToString(e,t){let n="[";for(let s=0;s<t;s+=2){s>0&&(n+=" ");const i=e[s],o=e[s+1];i===o?n+=`0x${i.toString(16)}`:n+=`0x${i.toString(16)}-0x${o.toString(16)}`}return n+="]",n}static cmp(e,t,n,s){const i=e[t]-n;return i!==0?i:s-e[t+1]}static qsortIntPair(e,t,n){const s=((t+n)/2|0)&-2,i=e[s],o=e[s+1];let a=t,u=n;for(;a<=u;){for(;a<n&&Yn.cmp(e,a,i,o)<0;)a+=2;for(;u>t&&Yn.cmp(e,u,i,o)>0;)u-=2;if(a<=u){if(a!==u){let B=e[a];e[a]=e[u],e[u]=B,B=e[a+1],e[a+1]=e[u+1],e[u+1]=B}a+=2,u-=2}}t<u&&Yn.qsortIntPair(e,t,u),a<n&&Yn.qsortIntPair(e,a,n)}constructor(e=te.emptyInts()){this.r=e,this.len=e.length}toArray(){return this.len===this.r.length?this.r:this.r.slice(0,this.len)}cleanClass(){if(this.len<4)return this;Yn.qsortIntPair(this.r,0,this.len-2);let e=2;for(let t=2;t<this.len;t+=2){const n=this.r[t],s=this.r[t+1];if(n<=this.r[e-1]+1){s>this.r[e-1]&&(this.r[e-1]=s);continue}this.r[e]=n,this.r[e+1]=s,e+=2}return this.len=e,this}appendLiteral(e,t){return t&M.FOLD_CASE?this.appendFoldedRange(e,e):this.appendRange(e,e)}appendRange(e,t){if(this.len>0){for(let n=2;n<=4;n+=2)if(this.len>=n){const s=this.r[this.len-n],i=this.r[this.len-n+1];if(e<=i+1&&s<=t+1)return e<s&&(this.r[this.len-n]=e),t>i&&(this.r[this.len-n+1]=t),this}}return this.r[this.len++]=e,this.r[this.len++]=t,this}appendFoldedRange(e,t){if(e<=Y.MIN_FOLD&&t>=Y.MAX_FOLD)return this.appendRange(e,t);if(t<Y.MIN_FOLD||e>Y.MAX_FOLD)return this.appendRange(e,t);e<Y.MIN_FOLD&&(this.appendRange(e,Y.MIN_FOLD-1),e=Y.MIN_FOLD),t>Y.MAX_FOLD&&(this.appendRange(Y.MAX_FOLD+1,t),t=Y.MAX_FOLD);for(let n=e;n<=t;n++){this.appendRange(n,n);for(let s=Y.simpleFold(n);s!==n;s=Y.simpleFold(s))this.appendRange(s,s)}return this}appendClass(e){for(let t=0;t<e.length;t+=2)this.appendRange(e[t],e[t+1]);return this}appendFoldedClass(e){for(let t=0;t<e.length;t+=2)this.appendFoldedRange(e[t],e[t+1]);return this}appendNegatedClass(e){let t=0;for(let n=0;n<e.length;n+=2){const s=e[n],i=e[n+1];t<=s-1&&this.appendRange(t,s-1),t=i+1}return t<=Y.MAX_RUNE&&this.appendRange(t,Y.MAX_RUNE),this}appendTable(e){for(let t=0;t<e.length;++t){const n=e.getLo(t),s=e.getHi(t),i=e.getStride(t);if(i===1){this.appendRange(n,s);continue}for(let o=n;o<=s;o+=i)this.appendRange(o,o)}return this}appendNegatedTable(e){let t=0;for(let n=0;n<e.length;++n){const s=e.getLo(n),i=e.getHi(n),o=e.getStride(n);if(o===1){t<=s-1&&this.appendRange(t,s-1),t=i+1;continue}for(let a=s;a<=i;a+=o)t<=a-1&&this.appendRange(t,a-1),t=a+1}return t<=Y.MAX_RUNE&&this.appendRange(t,Y.MAX_RUNE),this}appendTableWithSign(e,t){return t<0?this.appendNegatedTable(e):this.appendTable(e)}negateClass(){let e=0,t=0;for(let n=0;n<this.len;n+=2){const s=this.r[n],i=this.r[n+1];e<=s-1&&(this.r[t]=e,this.r[t+1]=s-1,t+=2),e=i+1}return this.len=t,e<=Y.MAX_RUNE&&(this.r[this.len++]=e,this.r[this.len++]=Y.MAX_RUNE),this}appendClassWithSign(e,t){return t<0?this.appendNegatedClass(e):this.appendClass(e)}appendGroup(e,t){let n=e.cls;return t&&(n=new Yn().appendFoldedClass(n).cleanClass().toArray()),this.appendClassWithSign(n,e.sign)}toString(){return Yn.charClassToString(this.r,this.len)}},zT=class{constructor(r){this.str=r,this.position=0}pos(){return this.position}rewindTo(r){this.position=r}more(){return this.position<this.str.length}peek(){return this.str.codePointAt(this.position)}skip(r){this.position+=r}skipString(r){this.position+=r.length}pop(){const r=this.str.codePointAt(this.position);return this.position+=te.charCount(r),r}lookingAt(r){return this.str.startsWith(r,this.position)}rest(){return this.str.substring(this.position)}from(r){return this.str.substring(r,this.position)}toString(){return this.rest()}},j,QT=(j=class{static unicodeTable(e){return e==="Any"?{tab:j.ANY_TABLE,fold:j.ANY_TABLE,sign:1}:e==="Ascii"?{tab:j.ASCII_TABLE,fold:j.ASCII_FOLD_TABLE,sign:1}:e==="Assigned"?{tab:yt.CATEGORIES.get("Cn"),fold:yt.CATEGORIES.get("Cn"),sign:-1}:e==="Lc"?{tab:yt.CATEGORIES.get("LC"),fold:yt.FOLD_CATEGORIES.get("LC"),sign:1}:yt.CATEGORIES.has(e)?{tab:yt.CATEGORIES.get(e),fold:yt.FOLD_CATEGORIES.get(e),sign:1}:yt.SCRIPTS.has(e)?{tab:yt.SCRIPTS.get(e),fold:yt.FOLD_SCRIPT.get(e),sign:1}:null}static minFoldRune(e){if(e<Y.MIN_FOLD||e>Y.MAX_FOLD)return e;let t=e;const n=e;for(e=Y.simpleFold(e);e!==n;e=Y.simpleFold(e))t>e&&(t=e);return t}static leadingRegexp(e){if(e.op===A.Op.EMPTY_MATCH)return null;if(e.op===A.Op.CONCAT&&e.subs.length>0){const t=e.subs[0];return t.op===A.Op.EMPTY_MATCH?null:t}return e}static literalRegexp(e,t){const n=new A(A.Op.LITERAL);return n.flags=t,n.runes=te.stringToRunes(e),n}static parse(e,t){return new j(e,t).parseInternal()}static parseRepeat(e){const t=e.pos();if(!e.more()||!e.lookingAt("{"))return-1;e.skip(1);const n=j.parseInt(e);if(n===-1||!e.more())return-1;let s;if(!e.lookingAt(","))s=n;else{if(e.skip(1),!e.more())return-1;if(e.lookingAt("}"))s=-1;else if((s=j.parseInt(e))===-1)return-1}if(!e.more()||!e.lookingAt("}"))return-1;if(e.skip(1),n<0||n>1e3||s===-2||s>1e3||s>=0&&n>s)throw new Ae(j.ERR_INVALID_REPEAT_SIZE,e.from(t));return n<<16|s&Y.MAX_BMP}static isValidCaptureName(e){if(e.length===0)return!1;for(let t=0;t<e.length;t++){const n=e.codePointAt(t);if(n!==L.CODES.get("_")&&!te.isalnum(n))return!1}return!0}static parseInt(e){const t=e.pos();for(;e.more()&&e.peek()>=L.CODES.get("0")&&e.peek()<=L.CODES.get("9");)e.skip(1);const n=e.from(t);return n.length===0||n.length>1&&n.codePointAt(0)===L.CODES.get("0")?-1:n.length>8?-2:parseInt(n,10)}static isCharClass(e){return e.op===A.Op.LITERAL&&e.runes.length===1||e.op===A.Op.CHAR_CLASS||e.op===A.Op.ANY_CHAR_NOT_NL||e.op===A.Op.ANY_CHAR}static matchRune(e,t){switch(e.op){case A.Op.LITERAL:return e.runes.length===1&&e.runes[0]===t;case A.Op.CHAR_CLASS:for(let n=0;n<e.runes.length;n+=2)if(e.runes[n]<=t&&t<=e.runes[n+1])return!0;return!1;case A.Op.ANY_CHAR_NOT_NL:return t!==L.CODES.get(`
`);case A.Op.ANY_CHAR:return!0}return!1}static mergeCharClass(e,t){switch(e.op){case A.Op.ANY_CHAR:break;case A.Op.ANY_CHAR_NOT_NL:j.matchRune(t,L.CODES.get(`
`))&&(e.op=A.Op.ANY_CHAR);break;case A.Op.CHAR_CLASS:t.op===A.Op.LITERAL?e.runes=new Kn(e.runes).appendLiteral(t.runes[0],t.flags).toArray():e.runes=new Kn(e.runes).appendClass(t.runes).toArray();break;case A.Op.LITERAL:if(t.runes[0]===e.runes[0]&&t.flags===e.flags)break;e.op=A.Op.CHAR_CLASS,e.runes=new Kn().appendLiteral(e.runes[0],e.flags).appendLiteral(t.runes[0],t.flags).toArray();break}}static parseEscape(e){const t=e.pos();if(e.skip(1),!e.more())throw new Ae(j.ERR_TRAILING_BACKSLASH);let n=e.pop();e:switch(n){case L.CODES.get("1"):case L.CODES.get("2"):case L.CODES.get("3"):case L.CODES.get("4"):case L.CODES.get("5"):case L.CODES.get("6"):case L.CODES.get("7"):if(!e.more()||e.peek()<L.CODES.get("0")||e.peek()>L.CODES.get("7"))break;case L.CODES.get("0"):{let s=n-L.CODES.get("0");for(let i=1;i<3&&!(!e.more()||e.peek()<L.CODES.get("0")||e.peek()>L.CODES.get("7"));i++)s=s*8+e.peek()-L.CODES.get("0"),e.skip(1);return s}case L.CODES.get("x"):{if(!e.more())break;if(n=e.pop(),n===L.CODES.get("{")){let o=0,a=0;for(;;){if(!e.more())break e;if(n=e.pop(),n===L.CODES.get("}"))break;const u=te.unhex(n);if(u<0||(a=a*16+u,a>Y.MAX_RUNE))break e;o++}if(o===0)break e;return a}const s=te.unhex(n);if(!e.more())break;n=e.pop();const i=te.unhex(n);if(s<0||i<0)break;return s*16+i}case L.CODES.get("a"):return L.CODES.get("\x07");case L.CODES.get("f"):return L.CODES.get("\f");case L.CODES.get("n"):return L.CODES.get(`
`);case L.CODES.get("r"):return L.CODES.get("\r");case L.CODES.get("t"):return L.CODES.get("	");case L.CODES.get("v"):return L.CODES.get("\v");default:if(n<=Y.MAX_ASCII&&!te.isalnum(n))return n;break}throw new Ae(j.ERR_INVALID_ESCAPE,e.from(t))}static parseClassChar(e,t){if(!e.more())throw new Ae(j.ERR_MISSING_BRACKET,e.from(t));return e.lookingAt("\\")?j.parseEscape(e):e.pop()}static concatRunes(e,t){for(let n=0;n<t.length;n++)e.push(t[n]);return e}static hasCapture(e){if(e===null)return!1;if(e.op===A.Op.CAPTURE)return!0;if(e.subs){for(let t of e.subs)if(j.hasCapture(t))return!0}return!1}constructor(e,t=0){this.wholeRegexp=e,this.flags=t,this.numCap=0,this.namedGroups=Object.create(null),this.stack=[],this.free=null,this.numRegexp=0,this.numRunes=0,this.repeats=0,this.height=null,this.size=null,this.nlb=0}newRegexp(e){let t=this.free;return t!==null&&t.subs!==null&&t.subs.length>0?(this.free=t.subs[0],t.reinit(),t.op=e):(t=new A(e),this.numRegexp+=1),t}reuse(e){this.height!==null&&this.height.has(e)&&this.height.delete(e),e.subs!==null&&e.subs.length>0&&(e.subs[0]=this.free),this.free=e}checkLimits(e){if(this.numRunes>j.MAX_RUNES)throw new Ae(j.ERR_LARGE);this.checkSize(e),this.checkHeight(e)}checkSize(e){if(this.size===null){if(this.repeats===0&&(this.repeats=1),e.op===A.Op.REPEAT){let t=e.max;t===-1&&(t=e.min),t<=0&&(t=1),t>Math.floor(j.MAX_SIZE/this.repeats)?this.repeats=j.MAX_SIZE:this.repeats*=t}if(this.numRegexp<Math.floor(j.MAX_SIZE/this.repeats))return;this.size=new Map;for(let t of this.stack)this.checkSize(t)}if(this.calcSize(e,!0)>j.MAX_SIZE)throw new Ae(j.ERR_LARGE)}calcSize(e,t=!1){if(!t&&this.size!==null&&this.size.has(e))return this.size.get(e);let n=0;switch(e.op){case A.Op.LITERAL:n=e.runes.length;break;case A.Op.PLB:case A.Op.NLB:case A.Op.CAPTURE:case A.Op.STAR:n=2+this.calcSize(e.subs[0]);break;case A.Op.PLUS:case A.Op.QUEST:n=1+this.calcSize(e.subs[0]);break;case A.Op.CONCAT:for(let s of e.subs)n=n+this.calcSize(s);break;case A.Op.ALTERNATE:for(let s of e.subs)n=n+this.calcSize(s);e.subs.length>1&&(n=n+e.subs.length-1);break;case A.Op.REPEAT:{let s=this.calcSize(e.subs[0]);if(e.max===-1){e.min===0?n=2+s:n=1+e.min*s;break}n=e.max*s+(e.max-e.min);break}}return n=Math.max(1,n),this.size===null&&(this.size=new Map),this.size.set(e,n),n}checkHeight(e){if(!(this.numRegexp<j.MAX_HEIGHT)){if(this.height===null){this.height=new Map;for(let t of this.stack)this.checkHeight(t)}if(this.calcHeight(e,!0)>j.MAX_HEIGHT)throw new Ae(j.ERR_NESTING_DEPTH)}}calcHeight(e,t=!1){if(!t&&this.height!==null&&this.height.has(e))return this.height.get(e);let n=1;for(let s of e.subs){const i=this.calcHeight(s);n<1+i&&(n=1+i)}return this.height===null&&(this.height=new Map),this.height.set(e,n),n}pop(){return this.stack.pop()}popToPseudo(){const e=this.stack.length;let t=e;for(;t>0&&!A.isPseudoOp(this.stack[t-1].op);)t--;const n=this.stack.slice(t,e);return this.stack=this.stack.slice(0,t),n}push(e){if(this.numRunes+=e.runes.length,e.op===A.Op.CHAR_CLASS&&e.runes.length===2&&e.runes[0]===e.runes[1]){if(this.maybeConcat(e.runes[0],this.flags&-2))return null;e.op=A.Op.LITERAL,e.runes=[e.runes[0]],e.flags=this.flags&-2}else if(e.op===A.Op.CHAR_CLASS&&e.runes.length===4&&e.runes[0]===e.runes[1]&&e.runes[2]===e.runes[3]&&Y.simpleFold(e.runes[0])===e.runes[2]&&Y.simpleFold(e.runes[2])===e.runes[0]||e.op===A.Op.CHAR_CLASS&&e.runes.length===2&&e.runes[0]+1===e.runes[1]&&Y.simpleFold(e.runes[0])===e.runes[1]&&Y.simpleFold(e.runes[1])===e.runes[0]){if(this.maybeConcat(e.runes[0],this.flags|M.FOLD_CASE))return null;e.op=A.Op.LITERAL,e.runes=[e.runes[0]],e.flags=this.flags|M.FOLD_CASE}else this.maybeConcat(-1,0);return this.stack.push(e),this.checkLimits(e),e}maybeConcat(e,t){const n=this.stack.length;if(n<2)return!1;const s=this.stack[n-1],i=this.stack[n-2];return s.op!==A.Op.LITERAL||i.op!==A.Op.LITERAL||(s.flags&M.FOLD_CASE)!==(i.flags&M.FOLD_CASE)?!1:(i.runes=j.concatRunes(i.runes,s.runes),e>=0?(s.runes=[e],s.flags=t,!0):(this.pop(),this.reuse(s),!1))}newLiteral(e,t){const n=this.newRegexp(A.Op.LITERAL);return n.flags=t,t&M.FOLD_CASE&&(e=j.minFoldRune(e)),n.runes=[e],n}literal(e){this.push(this.newLiteral(e,this.flags))}op(e){const t=this.newRegexp(e);return t.flags=this.flags,this.push(t)}repeat(e,t,n,s,i,o){let a=this.flags;if(a&M.PERL_X&&(i.more()&&i.lookingAt("?")&&(i.skip(1),a^=M.NON_GREEDY),o!==-1))throw new Ae(j.ERR_INVALID_REPEAT_OP,i.from(o));const u=this.stack.length;if(u===0)throw new Ae(j.ERR_MISSING_REPEAT_ARGUMENT,i.from(s));const B=this.stack[u-1];if(A.isPseudoOp(B.op))throw new Ae(j.ERR_MISSING_REPEAT_ARGUMENT,i.from(s));const l=this.newRegexp(e);if(l.min=t,l.max=n,l.flags=a,l.subs=[B],this.stack[u-1]=l,this.checkLimits(l),e===A.Op.REPEAT&&(t>=2||n>=2)&&!this.repeatIsValid(l,1e3))throw new Ae(j.ERR_INVALID_REPEAT_SIZE,i.from(s))}repeatIsValid(e,t){if(e.op===A.Op.REPEAT){let n=e.max;if(n===0)return!0;if(n<0&&(n=e.min),n>t)return!1;n>0&&(t=Math.trunc(t/n))}for(let n of e.subs)if(!this.repeatIsValid(n,t))return!1;return!0}concat(){this.maybeConcat(-1,0);const e=this.popToPseudo();return e.length===0?this.push(this.newRegexp(A.Op.EMPTY_MATCH)):this.push(this.collapse(e,A.Op.CONCAT))}alternate(){const e=this.popToPseudo();return e.length>0&&this.cleanAlt(e[e.length-1]),e.length===0?this.push(this.newRegexp(A.Op.NO_MATCH)):this.push(this.collapse(e,A.Op.ALTERNATE))}cleanAlt(e){e.op===A.Op.CHAR_CLASS&&(e.runes=new Kn(e.runes).cleanClass().toArray(),e.runes.length===2&&e.runes[0]===0&&e.runes[1]===Y.MAX_RUNE?(e.runes=[],e.op=A.Op.ANY_CHAR):e.runes.length===4&&e.runes[0]===0&&e.runes[1]===L.CODES.get(`
`)-1&&e.runes[2]===L.CODES.get(`
`)+1&&e.runes[3]===Y.MAX_RUNE&&(e.runes=[],e.op=A.Op.ANY_CHAR_NOT_NL))}collapse(e,t){if(e.length===1)return e[0];let n=0;for(let a of e)n+=a.op===t?a.subs.length:1;let s=new Array(n).fill(null),i=0;for(let a of e)if(a.op===t){for(let u=0;u<a.subs.length;u++)s[i++]=a.subs[u];this.reuse(a)}else s[i++]=a;let o=this.newRegexp(t);if(o.subs=s,t===A.Op.ALTERNATE&&(o.subs=this.factor(o.subs),o.subs.length===1)){const a=o;o=o.subs[0],this.reuse(a)}return o}factor(e){if(e.length<2)return e;let t=0,n=e.length,s=0,i=null,o=0,a=0,u=0;for(let l=0;l<=n;l++){let d=null,C=0,m=0;if(l<n){let y=e[t+l];if(y.op===A.Op.CONCAT&&y.subs.length>0&&(y=y.subs[0]),y.op===A.Op.LITERAL&&(d=y.runes,C=y.runes.length,m=y.flags&M.FOLD_CASE),m===a){let O=0;for(;O<o&&O<C&&i[O]===d[O];)O++;if(O>0){o=O;continue}}}if(l!==u)if(l===u+1)e[s++]=e[t+u];else{const y=this.newRegexp(A.Op.LITERAL);y.flags=a,y.runes=i.slice(0,o);for(let z=u;z<l;z++)e[t+z]=this.removeLeadingString(e[t+z],o),this.checkLimits(e[t+z]);const O=this.collapse(e.slice(t+u,t+l),A.Op.ALTERNATE),V=this.newRegexp(A.Op.CONCAT);V.subs=[y,O],e[s++]=V}u=l,i=d,o=C,a=m}n=s,t=0,u=0,s=0;let B=null;for(let l=0;l<=n;l++){let d=null;if(!(l<n&&(d=j.leadingRegexp(e[t+l]),B!==null&&B.equals(d)&&(j.isCharClass(B)||B.op===A.Op.REPEAT&&B.min===B.max&&j.isCharClass(B.subs[0]))))){if(l!==u)if(l===u+1)e[s++]=e[t+u];else{const C=B;for(let O=u;O<l;O++){const V=O!==u;e[t+O]=this.removeLeadingRegexp(e[t+O],V),this.checkLimits(e[t+O])}const m=this.collapse(e.slice(t+u,t+l),A.Op.ALTERNATE),y=this.newRegexp(A.Op.CONCAT);y.subs=[C,m],e[s++]=y}u=l,B=d}}n=s,t=0,u=0,s=0;for(let l=0;l<=n;l++)if(!(l<n&&j.isCharClass(e[t+l]))){if(l!==u)if(l===u+1)e[s++]=e[t+u];else{let d=u;for(let m=u+1;m<l;m++){const y=e[t+d],O=e[t+m];(y.op<O.op||y.op===O.op&&(y.runes!==null?y.runes.length:0)<(O.runes!==null?O.runes.length:0))&&(d=m)}const C=e[t+u];e[t+u]=e[t+d],e[t+d]=C;for(let m=u+1;m<l;m++)j.mergeCharClass(e[t+u],e[t+m]),this.reuse(e[t+m]);this.cleanAlt(e[t+u]),e[s++]=e[t+u]}l<n&&(e[s++]=e[t+l]),u=l+1}n=s,t=0,u=0,s=0;for(let l=0;l<n;++l)l+1<n&&e[t+l].op===A.Op.EMPTY_MATCH&&e[t+l+1].op===A.Op.EMPTY_MATCH||(e[s++]=e[t+l]);return n=s,t=0,e.slice(t,n)}removeLeadingString(e,t){if(e.op===A.Op.CONCAT&&e.subs.length>0){const n=this.removeLeadingString(e.subs[0],t);if(e.subs[0]=n,n.op===A.Op.EMPTY_MATCH)switch(this.reuse(n),e.subs.length){case 0:case 1:e.op=A.Op.EMPTY_MATCH,e.subs=A.emptySubs();break;case 2:{const s=e;e=e.subs[1],this.reuse(s);break}default:e.subs=e.subs.slice(1,e.subs.length);break}return e}return e.op===A.Op.LITERAL&&(e.runes=e.runes.slice(t,e.runes.length),e.runes.length===0&&(e.op=A.Op.EMPTY_MATCH)),e}removeLeadingRegexp(e,t){if(e.op===A.Op.CONCAT&&e.subs.length>0){switch(t&&this.reuse(e.subs[0]),e.subs=e.subs.slice(1,e.subs.length),e.subs.length){case 0:e.op=A.Op.EMPTY_MATCH,e.subs=A.emptySubs();break;case 1:{const n=e;e=e.subs[0],this.reuse(n);break}}return e}return t&&this.reuse(e),this.newRegexp(A.Op.EMPTY_MATCH)}parseInternal(){if(this.flags&M.LITERAL)return j.literalRegexp(this.wholeRegexp,this.flags);let e=-1,t=-1,n=-1;const s=new zT(this.wholeRegexp);for(;s.more();){let i=-1;e:switch(s.peek()){case L.CODES.get("("):if(this.flags&M.LOOKBEHIND){if(s.lookingAt("(?<=")){this.parsePosLookBehind(),s.skip(4);break}if(s.lookingAt("(?<!")){this.parseNegLookBehind(),s.skip(4);break}}if(this.flags&M.PERL_X&&s.lookingAt("(?")){this.parsePerlFlags(s);break}this.op(A.Op.LEFT_PAREN).cap=++this.numCap,s.skip(1);break;case L.CODES.get("|"):this.parseVerticalBar(),s.skip(1);break;case L.CODES.get(")"):this.parseRightParen(),s.skip(1);break;case L.CODES.get("^"):this.flags&M.ONE_LINE?this.op(A.Op.BEGIN_TEXT):this.op(A.Op.BEGIN_LINE),s.skip(1);break;case L.CODES.get("$"):this.flags&M.ONE_LINE?this.op(A.Op.END_TEXT).flags|=M.WAS_DOLLAR:this.op(A.Op.END_LINE),s.skip(1);break;case L.CODES.get("."):this.flags&M.DOT_NL?this.op(A.Op.ANY_CHAR):this.op(A.Op.ANY_CHAR_NOT_NL),s.skip(1);break;case L.CODES.get("["):this.parseClass(s);break;case L.CODES.get("*"):case L.CODES.get("+"):case L.CODES.get("?"):{i=s.pos();let o=null;switch(s.pop()){case L.CODES.get("*"):o=A.Op.STAR;break;case L.CODES.get("+"):o=A.Op.PLUS;break;case L.CODES.get("?"):o=A.Op.QUEST;break}this.repeat(o,t,n,i,s,e);break}case L.CODES.get("{"):{i=s.pos();const o=j.parseRepeat(s);if(o<0){s.rewindTo(i),this.literal(s.pop());break}t=o>>16,n=(o&Y.MAX_BMP)<<16>>16,this.repeat(A.Op.REPEAT,t,n,i,s,e);break}case L.CODES.get("\\"):{const o=s.pos();if(s.skip(1),this.flags&M.PERL_X&&s.more())switch(s.pop()){case L.CODES.get("A"):this.op(A.Op.BEGIN_TEXT);break e;case L.CODES.get("b"):this.op(A.Op.WORD_BOUNDARY);break e;case L.CODES.get("B"):this.op(A.Op.NO_WORD_BOUNDARY);break e;case L.CODES.get("C"):throw new Ae(j.ERR_INVALID_ESCAPE,"\\C");case L.CODES.get("Q"):{let B=s.rest();const l=B.indexOf("\\E");l>=0?(B=B.substring(0,l),s.skipString(B),s.skipString("\\E")):s.skipString(B);let d=0;for(;d<B.length;){const C=B.codePointAt(d);this.literal(C),d+=te.charCount(C)}break e}case L.CODES.get("z"):this.op(A.Op.END_TEXT);break e;default:s.rewindTo(o);break}else s.rewindTo(o);const a=this.newRegexp(A.Op.CHAR_CLASS);if(a.flags=this.flags,s.lookingAt("\\p")||s.lookingAt("\\P")){const B=new Kn;if(this.parseUnicodeClass(s,B)){a.runes=B.toArray(),this.push(a);break e}}const u=new Kn;if(this.parsePerlClassEscape(s,u)){a.runes=u.toArray(),this.push(a);break e}s.rewindTo(o),this.reuse(a),this.literal(j.parseEscape(s));break}default:this.literal(s.pop());break}e=i}if(this.concat(),this.swapVerticalBar()&&this.pop(),this.alternate(),this.stack.length!==1)throw new Ae(j.ERR_MISSING_PAREN,this.wholeRegexp);return this.stack[0].namedGroups=this.namedGroups,this.stack[0]}parsePerlFlags(e){const t=e.pos(),n=e.rest();if(n.startsWith("(?P<")||n.startsWith("(?<")){const a=n.charAt(2)==="P"?4:3,u=n.indexOf(">");if(u<0)throw new Ae(j.ERR_INVALID_NAMED_CAPTURE,n);const B=n.substring(a,u);if(e.skipString(B),e.skip(a+1),!j.isValidCaptureName(B))throw new Ae(j.ERR_INVALID_NAMED_CAPTURE,n.substring(0,u+1));const l=this.op(A.Op.LEFT_PAREN);if(l.cap=++this.numCap,this.namedGroups[B])throw new Ae(j.ERR_DUPLICATE_NAMED_CAPTURE,B);this.namedGroups[B]=this.numCap,l.name=B;return}e.skip(2);let s=this.flags,i=1,o=!1;e:for(;e.more();){const a=e.pop();switch(a){case L.CODES.get("i"):s|=M.FOLD_CASE,o=!0;break;case L.CODES.get("m"):s&=-17,o=!0;break;case L.CODES.get("s"):s|=M.DOT_NL,o=!0;break;case L.CODES.get("U"):s|=M.NON_GREEDY,o=!0;break;case L.CODES.get("-"):if(i<0)break e;i=-1,s=~s,o=!1;break;case L.CODES.get(":"):case L.CODES.get(")"):if(i<0){if(!o)break e;s=~s}a===L.CODES.get(":")&&this.op(A.Op.LEFT_PAREN),this.flags=s;return;default:break e}}throw new Ae(j.ERR_INVALID_PERL_OP,e.from(t))}parsePosLookBehind(){const e=this.newRegexp(A.Op.LEFT_PAREN);return e.flags=this.flags,e.lb=++this.nlb,this.push(e)}parseNegLookBehind(){const e=this.newRegexp(A.Op.LEFT_PAREN);return e.flags=this.flags,e.lb=-++this.nlb,this.push(e)}parseVerticalBar(){this.concat(),this.swapVerticalBar()||this.op(A.Op.VERTICAL_BAR)}swapVerticalBar(){const e=this.stack.length;if(e>=3&&this.stack[e-2].op===A.Op.VERTICAL_BAR&&j.isCharClass(this.stack[e-1])&&j.isCharClass(this.stack[e-3])){let t=this.stack[e-1],n=this.stack[e-3];if(t.op>n.op){const s=n;n=t,t=s,this.stack[e-3]=n}return j.mergeCharClass(n,t),this.reuse(t),this.pop(),!0}if(e>=2){const t=this.stack[e-1],n=this.stack[e-2];if(n.op===A.Op.VERTICAL_BAR)return e>=3&&this.cleanAlt(this.stack[e-3]),this.stack[e-2]=t,this.stack[e-1]=n,!0}return!1}parseRightParen(){if(this.concat(),this.swapVerticalBar()&&this.pop(),this.alternate(),this.stack.length<2)throw new Ae(j.ERR_UNEXPECTED_PAREN,this.wholeRegexp);const e=this.pop(),t=this.pop();if(t.op!==A.Op.LEFT_PAREN)throw new Ae(j.ERR_UNEXPECTED_PAREN,this.wholeRegexp);if(this.flags=t.flags,t.lb!==0){if(j.hasCapture(e))throw new Ae(j.ERR_INVALID_CAPTURE_IN_LOOKBEHIND,this.wholeRegexp);t.lb>0?t.op=A.Op.PLB:t.op=A.Op.NLB,t.subs=[e],this.push(t);return}t.cap===0?this.push(e):(t.op=A.Op.CAPTURE,t.subs=[e],this.push(t))}parsePerlClassEscape(e,t){const n=e.pos();if(!(this.flags&M.PERL_X)||!e.more()||e.pop()!==L.CODES.get("\\")||!e.more())return!1;e.pop();const s=e.from(n),i=xf.has(s)?xf.get(s):null;return i===null?!1:(t.appendGroup(i,(this.flags&M.FOLD_CASE)!==0),!0)}parseNamedClass(e,t){const n=e.rest(),s=n.indexOf(":]");if(s<0)return!1;const i=n.substring(0,s+2);e.skipString(i);const o=Xf.has(i)?Xf.get(i):null;if(o===null)throw new Ae(j.ERR_INVALID_CHAR_RANGE,i);return t.appendGroup(o,(this.flags&M.FOLD_CASE)!==0),!0}parseUnicodeClass(e,t){const n=e.pos();if(!(this.flags&M.UNICODE_GROUPS)||!e.lookingAt("\\p")&&!e.lookingAt("\\P"))return!1;e.skip(1);let s=1,i=e.pop();if(i===L.CODES.get("P")&&(s=-1),!e.more())throw e.rewindTo(n),new Ae(j.ERR_INVALID_CHAR_RANGE,e.rest());i=e.pop();let o;if(i!==L.CODES.get("{"))o=te.runeToString(i);else{const l=e.rest(),d=l.indexOf("}");if(d<0)throw e.rewindTo(n),new Ae(j.ERR_INVALID_CHAR_RANGE,e.rest());o=l.substring(0,d),e.skipString(o),e.skip(1)}o.length!==0&&o.codePointAt(0)===L.CODES.get("^")&&(s=0-s,o=o.substring(1));const a=j.unicodeTable(o);if(a===null)throw new Ae(j.ERR_INVALID_CHAR_RANGE,e.from(n));a.sign<0&&(s=0-s);const u=a.tab,B=a.fold;if(!(this.flags&M.FOLD_CASE)||B===null)t.appendTableWithSign(u,s);else{const l=new Kn().appendTable(u).appendTable(B).cleanClass().toArray();t.appendClassWithSign(l,s)}return!0}parseClass(e){const t=e.pos();e.skip(1);const n=this.newRegexp(A.Op.CHAR_CLASS);n.flags=this.flags;const s=new Kn;let i=1;e.more()&&e.lookingAt("^")&&(i=-1,e.skip(1),this.flags&M.CLASS_NL||s.appendRange(L.CODES.get(`
`),L.CODES.get(`
`)));let o=!0;for(;!e.more()||e.peek()!==L.CODES.get("]")||o;){if(e.more()&&e.lookingAt("-")&&!(this.flags&M.PERL_X)&&!o){const l=e.rest();if(l==="-"||!l.startsWith("-]"))throw e.rewindTo(t),new Ae(j.ERR_INVALID_CHAR_RANGE,e.rest())}o=!1;const a=e.pos();if(e.lookingAt("[:")){if(this.parseNamedClass(e,s))continue;e.rewindTo(a)}if(this.parseUnicodeClass(e,s)||this.parsePerlClassEscape(e,s))continue;e.rewindTo(a);const u=j.parseClassChar(e,t);let B=u;if(e.more()&&e.lookingAt("-")){if(e.skip(1),e.more()&&e.lookingAt("]"))e.skip(-1);else if(B=j.parseClassChar(e,t),B<u)throw new Ae(j.ERR_INVALID_CHAR_RANGE,e.from(a))}this.flags&M.FOLD_CASE?s.appendFoldedRange(u,B):s.appendRange(u,B)}e.skip(1),s.cleanClass(),i<0&&s.negateClass(),n.runes=s.toArray(),this.push(n)}},q(j,"ERR_INTERNAL_ERROR","regexp/syntax: internal error"),q(j,"ERR_INVALID_CHAR_RANGE","invalid character class range"),q(j,"ERR_INVALID_ESCAPE","invalid escape sequence"),q(j,"ERR_INVALID_NAMED_CAPTURE","invalid named capture"),q(j,"ERR_INVALID_PERL_OP","invalid or unsupported Perl syntax"),q(j,"ERR_INVALID_REPEAT_OP","invalid nested repetition operator"),q(j,"ERR_INVALID_REPEAT_SIZE","invalid repeat count"),q(j,"ERR_MISSING_BRACKET","missing closing ]"),q(j,"ERR_MISSING_PAREN","missing closing )"),q(j,"ERR_MISSING_REPEAT_ARGUMENT","missing argument to repetition operator"),q(j,"ERR_TRAILING_BACKSLASH","trailing backslash at end of expression"),q(j,"ERR_DUPLICATE_NAMED_CAPTURE","duplicate capture group name"),q(j,"ERR_UNEXPECTED_PAREN","unexpected )"),q(j,"ERR_NESTING_DEPTH","expression nests too deeply"),q(j,"ERR_LARGE","expression too large"),q(j,"ERR_INVALID_CAPTURE_IN_LOOKBEHIND","invalid capture in lookbehind"),q(j,"MAX_HEIGHT",1e3),q(j,"MAX_SIZE",3355443),q(j,"MAX_RUNES",33554432),q(j,"ANY_TABLE",new g(new Uint32Array([0,Y.MAX_RUNE,1]))),q(j,"ASCII_TABLE",new g(new Uint32Array([0,127,1]))),q(j,"ASCII_FOLD_TABLE",new g(new Uint32Array([0,127,1,383,383,1,8490,8490,1]))),j),WT=class Lr{static initTest(e){const t=Lr.compile(e),n=new Lr(t.expr,t.prog,t.numSubexp,t.longest);return n.cond=t.cond,n.prefix=t.prefix,n.prefixUTF8=t.prefixUTF8,n.prefixComplete=t.prefixComplete,n.prefixRune=t.prefixRune,n.prefilter=t.prefilter,n}static compile(e){return Lr.compileImpl(e,M.PERL,!1)}static compilePOSIX(e){return Lr.compileImpl(e,M.POSIX,!0)}static compileImpl(e,t,n){let s=QT.parse(e,t);const i=s.maxCap();s=JT.simplify(s);const o=qT.build(s),a=KT.compileRegexp(s),u=new Lr(e,a,i,n);u.prefilter=o.type===me.Type.NONE?null:o;const[B,l]=a.prefix();return u.prefixComplete=B,u.prefix=l,u.prefixUTF8=te.stringToUtf8ByteArray(u.prefix),u.prefix.length>0&&(u.prefixRune=u.prefix.codePointAt(0)),u.namedGroups=s.namedGroups,u}static match(e,t){return Lr.compile(e).match(t)}constructor(e,t,n=0,s=0){this.expr=e,this.prog=t,this.numSubexp=n,this.longest=s,this.cond=t.startCond(),this.prefix=null,this.prefixUTF8=null,this.prefixComplete=!1,this.prefixRune=0,this.machinePool=[],this.dfa=new OT(this.prog),this.onepass=Nf.compile(this.prog),this.prefilter=null}matchPrefixComplete(e,t,n,s){if((n===M.ANCHOR_START||n===M.ANCHOR_BOTH)&&t!==0)return null;let i=-1,o=-1;const a=e.prefixLength(this);if(n===M.UNANCHORED){const u=e.index(this,t);if(u<0)return null;i=t+u,o=i+a}else if(n===M.ANCHOR_BOTH){if(e.endPos()!==a||e.index(this,0)!==0)return null;i=0,o=a}else if(n===M.ANCHOR_START){if(e.index(this,0)!==0)return null;i=0,o=a}if(i<0)return null;if(s>0){const u=new Int32Array(s).fill(-1);return u[0]=i,u[1]=o,Array.from(u)}return[]}executeEngine(e,t,n,s){if(this.prefixComplete&&(s===0||this.numSubexp===0))return this.matchPrefixComplete(e,t,n,s);if(this.prefilter!==null&&n===M.UNANCHORED&&!this.prefilter.eval(e,t))return null;if(this.onepass!==null)return Nf.execute(this,e,t,n,s);if(s>0)return this.prog.numLb===0&&e.endPos()<=Na.maxBitStateLen(this.prog)?Na.execute(this,e,t,n,s):this.doExecuteNFA(e,t,n,s);if(this.prog.numLb===0){const i=this.dfa.match(e,t,n);if(i!==null)return i?[]:null;if(e.endPos()<=Na.maxBitStateLen(this.prog))return Na.execute(this,e,t,n,s)}return this.doExecuteNFA(e,t,n,s)}numberOfCapturingGroups(){return this.numSubexp}numberOfInstructions(){return this.prog.numInst()}get(){return this.machinePool.length>0?this.machinePool.pop():null}reset(){this.machinePool.length=0}put(e){this.machinePool.push(e)}toString(){return this.expr}doExecuteNFA(e,t,n,s){let i=this.get();i||(i=bT.fromRE2(this)),i.init(s);const o=i.match(e,t,n)?i.submatches():null;return this.put(i),o}match(e){return this.executeEngine(Pe.fromUTF16(e),0,M.UNANCHORED,0)!==null}matchWithGroup(e,t,n,s,i){return e instanceof rs||(te.isByteArray(e)?e=qr.utf8(e):e=qr.utf16(e)),this.matchMachineInput(e,t,n,s,i)}matchMachineInput(e,t,n,s,i){if(t>n)return[!1,null];const o=e.isUTF16Encoding()?Pe.fromUTF16(e.asCharSequence(),0,n):Pe.fromUTF8(e.asBytes(),0,n),a=this.executeEngine(o,t,s,2*i);return a===null?[!1,null]:[!0,a]}matchUTF8(e){return this.executeEngine(Pe.fromUTF8(e),0,M.UNANCHORED,0)!==null}replaceAll(e,t){return this.replaceAllFunc(e,()=>t,2*e.length+1)}replaceFirst(e,t){return this.replaceAllFunc(e,()=>t,1)}replaceAllFunc(e,t,n){let s=0,i=0,o="";const a=Pe.fromUTF16(e);let u=0;for(;i<=e.length;){const B=this.executeEngine(a,i,M.UNANCHORED,2);if(B===null||B.length===0)break;o+=e.substring(s,B[0]),(B[1]>s||B[0]===0)&&(o+=t(e.substring(B[0],B[1])),u++),s=B[1];const l=a.step(i)&7;if(i+l>B[1]?i+=l:i+1>B[1]?i++:i=B[1],u>=n)break}return o+=e.substring(s),o}pad(e){if(e===null)return null;let t=(1+this.numSubexp)*2;if(e.length<t){let n=new Array(t).fill(-1);for(let s=0;s<e.length;s++)n[s]=e[s];e=n}return e}allMatches(e,t,n=s=>s){let s=[];const i=e.endPos();t<0&&(t=i+1);let o=0,a=0,u=-1;for(;a<t&&o<=i;){const B=this.executeEngine(e,o,M.UNANCHORED,this.prog.numCap);if(B===null||B.length===0)break;let l=!0;if(B[1]===o){B[0]===u&&(l=!1);const d=e.step(o);d<0?o=i+1:o+=d&7}else o=B[1];u=B[1],l&&(s.push(n(this.pad(B))),a++)}return s}findUTF8(e){const t=this.executeEngine(Pe.fromUTF8(e),0,M.UNANCHORED,2);return t===null?null:e.slice(t[0],t[1])}findUTF8Index(e){const t=this.executeEngine(Pe.fromUTF8(e),0,M.UNANCHORED,2);return t===null?null:t.slice(0,2)}find(e){const t=this.executeEngine(Pe.fromUTF16(e),0,M.UNANCHORED,2);return t===null?"":e.substring(t[0],t[1])}findIndex(e){return this.executeEngine(Pe.fromUTF16(e),0,M.UNANCHORED,2)}findUTF8Submatch(e){const t=this.executeEngine(Pe.fromUTF8(e),0,M.UNANCHORED,this.prog.numCap);if(t===null)return null;const n=new Array(1+this.numSubexp).fill(null);for(let s=0;s<n.length;s++)2*s<t.length&&t[2*s]>=0&&(n[s]=e.slice(t[2*s],t[2*s+1]));return n}findUTF8SubmatchIndex(e){return this.pad(this.executeEngine(Pe.fromUTF8(e),0,M.UNANCHORED,this.prog.numCap))}findSubmatch(e){const t=this.executeEngine(Pe.fromUTF16(e),0,M.UNANCHORED,this.prog.numCap);if(t===null)return null;const n=new Array(1+this.numSubexp).fill(null);for(let s=0;s<n.length;s++)2*s<t.length&&t[2*s]>=0&&(n[s]=e.substring(t[2*s],t[2*s+1]));return n}findSubmatchIndex(e){return this.pad(this.executeEngine(Pe.fromUTF16(e),0,M.UNANCHORED,this.prog.numCap))}findAllUTF8(e,t){const n=this.allMatches(Pe.fromUTF8(e),t,s=>e.slice(s[0],s[1]));return n.length===0?null:n}findAllUTF8Index(e,t){const n=this.allMatches(Pe.fromUTF8(e),t,s=>s.slice(0,2));return n.length===0?null:n}findAll(e,t){const n=this.allMatches(Pe.fromUTF16(e),t,s=>e.substring(s[0],s[1]));return n.length===0?null:n}findAllIndex(e,t){const n=this.allMatches(Pe.fromUTF16(e),t,s=>s.slice(0,2));return n.length===0?null:n}findAllUTF8Submatch(e,t){const n=this.allMatches(Pe.fromUTF8(e),t,s=>{let i=new Array(s.length/2|0).fill(null);for(let o=0;o<i.length;o++)s[2*o]>=0&&(i[o]=e.slice(s[2*o],s[2*o+1]));return i});return n.length===0?null:n}findAllUTF8SubmatchIndex(e,t){const n=this.allMatches(Pe.fromUTF8(e),t);return n.length===0?null:n}findAllSubmatch(e,t){const n=this.allMatches(Pe.fromUTF16(e),t,s=>{let i=new Array(s.length/2|0).fill(null);for(let o=0;o<i.length;o++)s[2*o]>=0&&(i[o]=e.substring(s[2*o],s[2*o+1]));return i});return n.length===0?null:n}findAllSubmatchIndex(e,t){const n=this.allMatches(Pe.fromUTF16(e),t);return n.length===0?null:n}},$T=class xs{static isHexadecimal(e){return"0"<=e&&e<="9"||"A"<=e&&e<="F"||"a"<=e&&e<="f"}static translate(e){let t="";if(e instanceof RegExp&&(e.ignoreCase&&(t+="i"),e.multiline&&(t+="m"),e.dotAll&&(t+="s"),e=e.source),typeof e!="string")return e;let n="",s=!1,i=e.length;i===0&&(n="(?:)",s=!0);let o=!1,a=0;for(;a<i;){let B=e[a];if(B==="\\"){if(a+1<i)switch(B=e[a+1],B){case"\\":n+="\\\\",a+=2;continue;case"c":if(a+2<i){let C=e[a+2].charCodeAt(0);if(C>=65&&C<=90||C>=97&&C<=122){let m=C%32;n+="\\x",n+=(m>>4).toString(16).toUpperCase(),n+=(m&15).toString(16).toUpperCase(),a+=3,s=!0;continue}}n+="c",a+=2,s=!0;continue;case"u":if(a+2<i){if(e[a+2]==="{"){let C=a+3,m=!1,y=!1;for(;C<i;){const O=e[C];if(O==="}"){y=!0;break}if(!xs.isHexadecimal(O))break;m=!0,C++}if(y&&m){n+="\\x",a+=2,s=!0;continue}}else if(a+5<i){let C=!0;for(let m=0;m<4;m++)if(!xs.isHexadecimal(e[a+2+m])){C=!1;break}if(C){n+="\\x{"+e.substring(a+2,a+6)+"}",a+=6,s=!0;continue}}}n+="u",a+=2,s=!0;continue;case"x":{let C=!1;if(a+2<i&&e[a+2]==="{"){let m=a+3,y=!1,O=!1;for(;m<i;){const V=e[m];if(V==="}"){O=!0;break}if(!xs.isHexadecimal(V))break;y=!0,m++}O&&y&&(C=!0)}else a+3<i&&xs.isHexadecimal(e[a+2])&&xs.isHexadecimal(e[a+3])&&(C=!0);C?(n+="\\x",a+=2):(n+="x",a+=2,s=!0);continue}case"n":case"r":case"t":case"a":case"f":case"v":case"d":case"D":case"s":case"S":case"w":case"W":case"b":case"B":case"p":case"P":case"A":case"z":case"Q":case"E":case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":n+="\\"+B,a+=2;continue;default:{let C=e.codePointAt(a+1);if(C>=48&&C<=57||C>=65&&C<=90||C>=97&&C<=122){let m=te.charCount(C);n+=e.substring(a+1,a+1+m),a+=m+1,s=!0}else{n+="\\";let m=te.charCount(C);n+=e.substring(a+1,a+1+m),a+=m+1}continue}}}else if(B==="/"){n+="\\/",a+=1,s=!0;continue}else if(B==="[")o=!0;else if(B==="]")o=!1;else if(!o&&B==="("&&a+2<i&&e[a+1]==="?"&&e[a+2]==="<"&&a+3<i&&!"=!>)".includes(e[a+3])){n+="(?P<",a+=3,s=!0;continue}let l=e.codePointAt(a),d=te.charCount(l);n+=e.substring(a,a+d),a+=d}const u=s?n:e;return t.length>0?`(?${t})${u}`:u}},He,_l=(He=class{static quote(e){return te.quoteMeta(e)}static quoteReplacement(e,t=!1){return vf.quoteReplacement(e,t)}static translateRegExp(e){return $T.translate(e)}static compile(e,t=0){let n=e;if(t&He.CASE_INSENSITIVE&&(n=`(?i)${n}`),t&He.DOTALL&&(n=`(?s)${n}`),t&He.MULTILINE&&(n=`(?m)${n}`),t&-544)throw new PT("Flags should only be a combination of MULTILINE, DOTALL, CASE_INSENSITIVE, DISABLE_UNICODE_GROUPS, LONGEST_MATCH, LOOKBEHINDS");let s=M.PERL;t&He.DISABLE_UNICODE_GROUPS&&(s&=-129),t&He.LOOKBEHINDS&&(s|=M.LOOKBEHIND);const i=new He(e,t);return i.re2Input=WT.compileImpl(n,s,(t&He.LONGEST_MATCH)!==0),i}static matches(e,t){return He.compile(e).testExact(t)}static initTest(e,t,n){if(e==null)throw new Error("pattern is null");if(n==null)throw new Error("re2 is null");const s=new He(e,t);return s.re2Input=n,s}constructor(e,t){this.patternInput=e,this.flagsInput=t,this.re2Input=null}reset(){this.re2Input.reset()}flags(){return this.flagsInput}pattern(){return this.patternInput}re2(){return this.re2Input}matches(e){return this.testExact(e)}matcher(e){return te.isByteArray(e)&&(e=qr.utf8(e)),new vf(this,e)}test(e){return te.isByteArray(e)?this.re2Input.matchUTF8(e):this.re2Input.match(e)}testExact(e){const t=te.isByteArray(e)?Pe.fromUTF8(e):Pe.fromUTF16(e);return this.re2Input.executeEngine(t,0,M.ANCHOR_BOTH,0)!==null}exec(e){const t=this.matcher(e);if(!t.find())return null;const n=[t.group(0)];for(let i=1;i<=t.groupCount();i++){const o=t.group(i);n.push(o===null?void 0:o)}n.index=t.start(0),n.input=e;const s=this.namedGroups();if(Object.keys(s).length>0){const i=t.getNamedGroups();for(const o in i)i[o]===null&&(i[o]=void 0);n.groups=i}else n.groups=void 0;return n}split(e,t=0){const n=this.matcher(e),s=[];let i=0,o=0;for(;n.find();){if(o===0&&n.end()===0){o=n.end();continue}if(t>0&&s.length===t-1)break;if(o===n.start()){if(t===0){i+=1,o=n.end();continue}}else for(;i>0;)s.push(""),i-=1;s.push(n.substring(o,n.start())),o=n.end()}if(t===0&&o!==n.inputLength()){for(;i>0;)s.push(""),i-=1;s.push(n.substring(o,n.inputLength()))}return(t!==0||s.length===0&&!(o===n.inputLength()&&o>0))&&s.push(n.substring(o,n.inputLength())),s}*matchAll(e){const t=this.matcher(e);for(;t.find();){const n=[t.group(0)];for(let i=1;i<=t.groupCount();i++){const o=t.group(i);n.push(o===null?void 0:o)}n.index=t.start(0),n.input=e;const s=this.namedGroups();if(Object.keys(s).length>0){const i=t.getNamedGroups();for(const o in i)i[o]===null&&(i[o]=void 0);n.groups=i}else n.groups=void 0;yield n}}toString(){return this.patternInput}programSize(){return this.re2Input.numberOfInstructions()}groupCount(){return this.re2Input.numberOfCapturingGroups()}namedGroups(){return this.re2Input.namedGroups}equals(e){return this===e?!0:e===null||this.constructor!==e.constructor?!1:this.flagsInput===e.flagsInput&&this.patternInput===e.patternInput}},q(He,"CASE_INSENSITIVE",vs.CASE_INSENSITIVE),q(He,"DOTALL",vs.DOTALL),q(He,"MULTILINE",vs.MULTILINE),q(He,"DISABLE_UNICODE_GROUPS",vs.DISABLE_UNICODE_GROUPS),q(He,"LONGEST_MATCH",vs.LONGEST_MATCH),q(He,"LOOKBEHINDS",vs.LOOKBEHINDS),He);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let fi="12.19.0";function YT(r){fi=r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ss=new al("@firebase/firestore");function Vs(){return ss.logLevel}function U(r,...e){if(ss.logLevel<=de.DEBUG){const t=e.map(El);ss.debug(`Firestore (${fi}): ${r}`,...t)}}function Me(r,...e){if(ss.logLevel<=de.ERROR){const t=e.map(El);ss.error(`Firestore (${fi}): ${r}`,...t)}}function zt(r,...e){if(ss.logLevel<=de.WARN){const t=e.map(El);ss.warn(`Firestore (${fi}): ${r}`,...t)}}function El(r){if(typeof r=="string")return r;try{return function(t){return JSON.stringify(t)}(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $(r,e,t){let n="Unexpected state";typeof e=="string"?n=e:t=e,Ug(r,n,t)}function Ug(r,e,t){let n=`FIRESTORE (${fi}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{n+=" CONTEXT: "+JSON.stringify(t)}catch{n+=" CONTEXT: "+t}throw Me(n),new Error(n)}function H(r,e,t,n){let s="Unexpected state";typeof t=="string"?s=t:n=t,r||Ug(e,s,n)}function X(r,e){return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function XT(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<r;n++)t[n]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Il{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const s=XT(40);for(let i=0;i<s.length;++i)n.length<20&&s[i]<t&&(n+=e.charAt(s[i]%62))}return n}}function ie(r,e){return r<e?-1:r>e?1:0}function bB(r,e){const t=Math.min(r.length,e.length);for(let n=0;n<t;n++){const s=r.charAt(n),i=e.charAt(n);if(s!==i)return aB(s)===aB(i)?ie(s,i):aB(s)?1:-1}return ie(r.length,e.length)}const ZT=55296,eA=57343;function aB(r){const e=r.charCodeAt(0);return e>=ZT&&e<=eA}function Ws(r,e,t){return r.length===e.length&&r.every((n,s)=>t(n,e[s]))}function Hg(r){return r+"\0"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Te{constructor(e,t){this.comparator=e,this.root=t||it.EMPTY}insert(e,t){return new Te(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,it.BLACK,null,null))}remove(e){return new Te(this.comparator,this.root.remove(e,this.comparator).copy(null,null,it.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return t+n.left.size;s<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,n)=>(e(t,n),!1))}toString(){const e=[];return this.inorderTraversal((t,n)=>(e.push(`${t}:${n}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Fa(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Fa(this.root,e,this.comparator,!1)}getReverseIterator(){return new Fa(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Fa(this.root,e,this.comparator,!0)}}class Fa{constructor(e,t,n,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class it{constructor(e,t,n,s,i){this.key=e,this.value=t,this.color=n??it.RED,this.left=s??it.EMPTY,this.right=i??it.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,s,i){return new it(e??this.key,t??this.value,n??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let s=this;const i=n(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,n),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,n)),s.fixUp()}removeMin(){if(this.left.isEmpty())return it.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return it.EMPTY;n=s.right.min(),s=s.copy(n.key,n.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,it.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,it.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw $(43730,{key:this.key,value:this.value});if(this.right.isRed())throw $(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw $(27949);return e+(this.isRed()?0:1)}}it.EMPTY=null,it.RED=!0,it.BLACK=!1;it.EMPTY=new class{constructor(){this.size=0}get key(){throw $(57766)}get value(){throw $(16141)}get color(){throw $(16727)}get left(){throw $(29726)}get right(){throw $(36894)}copy(e,t,n,s,i){return this}insert(e,t,n){return new it(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ee{constructor(e){this.comparator=e,this.data=new Te(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,n)=>(e(t),!1))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const s=n.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Zf(this.data.getIterator())}getIteratorFrom(e){return new Zf(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(n=>{t=t.add(n)}),t}isEqual(e){if(!(e instanceof Ee)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new Ee(this.comparator);return t.data=e,t}}class Zf{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function Ps(r){return r.hasNext()?r.getNext():void 0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const N={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class G extends fn{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zt="__name__";class Yt{constructor(e,t,n){t===void 0?t=0:t>e.length&&$(637,{offset:t,range:e.length}),n===void 0?n=e.length-t:n>e.length-t&&$(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return Yt.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Yt?e.forEach(n=>{t.push(n)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let s=0;s<n;s++){const i=Yt.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return ie(e.length,t.length)}static compareSegments(e,t){const n=Yt.isNumericId(e),s=Yt.isNumericId(t);return n&&!s?-1:!n&&s?1:n&&s?Yt.extractNumericId(e).compare(Yt.extractNumericId(t)):bB(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Br.fromString(e.substring(4,e.length-2))}}class he extends Yt{construct(e,t,n){return new he(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toStringWithLeadingSlash(){return`/${this.canonicalString()}`}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new G(N.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter(s=>s.length>0))}return new he(t)}static emptyPath(){return new he([])}}const tA=/^[_a-zA-Z][_a-zA-Z0-9]*$/;let Qe=class Ms extends Yt{construct(e,t,n){return new Ms(e,t,n)}static isValidIdentifier(e){return tA.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Ms.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Zt}static keyField(){return new Ms([Zt])}static fromServerFormat(e){const t=[];let n="",s=0;const i=()=>{if(n.length===0)throw new G(N.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let o=!1;for(;s<e.length;){const a=e[s];if(a==="\\"){if(s+1===e.length)throw new G(N.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new G(N.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=u,s+=2}else a==="`"?(o=!o,s++):a!=="."||o?(n+=a,s++):(i(),s++)}if(i(),o)throw new G(N.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Ms(t)}static emptyPath(){return new Ms([])}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wt{constructor(e){this.fields=e,e.sort(Qe.comparator)}static empty(){return new wt([])}unionWith(e){let t=new Ee(Qe.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new wt(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Ws(this.fields,e.fields,(t,n)=>t.isEqual(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cu(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function wr(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function nA(r,e){const t=[];for(const n in r)Object.prototype.hasOwnProperty.call(r,n)&&t.push(e(r[n],n,r));return t}function qg(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class J{constructor(e){this.path=e}static fromPath(e){return new J(he.fromString(e))}static fromName(e){return new J(he.fromString(e).popFirst(5))}static empty(){return new J(he.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&he.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return he.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new J(new he(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jg(r,e,t){if(!t)throw new G(N.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function rA(r,e,t,n){if(e===!0&&n===!0)throw new G(N.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function eC(r){if(!J.isDocumentKey(r))throw new G(N.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function tC(r){if(J.isDocumentKey(r))throw new G(N.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function Wo(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function $u(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=function(n){return n.constructor?n.constructor.name:null}(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":$(12329,{type:typeof r})}function Et(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new G(N.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=$u(r);throw new G(N.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}function sA(r,e){if(e<=0)throw new G(N.INVALID_ARGUMENT,`Function ${r}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function je(r,e){const t={typeString:r};return e&&(t.value=e),t}function $o(r,e){if(!Wo(r))throw new G(N.INVALID_ARGUMENT,"JSON must be an object");let t;for(const n in e)if(e[n]){const s=e[n].typeString,i="value"in e[n]?{value:e[n].value}:void 0;if(!(n in r)){t=`JSON missing required field: '${n}'`;break}const o=r[n];if(s&&typeof o!==s){t=`JSON field '${n}' must be a ${s}.`;break}if(i!==void 0&&o!==i.value){t=`Expected '${n}' field to equal '${i.value}'`;break}}if(t)throw new G(N.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nC=-62135596800,rC=1e6;class _e{static now(){return _e.fromMillis(Date.now())}static fromDate(e){return _e.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*rC);return new _e(t,n)}static fromInstant(e){if(!e||typeof e.t!="bigint")throw new G(N.INVALID_ARGUMENT,"Invalid Temporal.Instant object provided.");return _e._fromEpochNanoseconds(e.t)}static _fromEpochNanoseconds(e){let t,n;if(e>=0n)t=Number(e/1000000000n),n=Number(e%1000000000n);else{const s=e%1000000000n;s===0n?(t=Number(e/1000000000n),n=0):(t=Number(e/1000000000n-1n),n=Number(s+1000000000n))}return new _e(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new G(N.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new G(N.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<nC)throw new G(N.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new G(N.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/rC}toInstant(){if(typeof Temporal>"u"||!Temporal.Instant)throw new G(N.FAILED_PRECONDITION,"The Temporal object is not available in the current environment.");const e=1000000000n*BigInt(this.seconds)+BigInt(this.nanoseconds);return Temporal.Instant.__PRIVATE_fromEpochNanoseconds(e)}_compareTo(e){return this.seconds===e.seconds?ie(this.nanoseconds,e.nanoseconds):ie(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:_e._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if($o(e,_e._jsonSchema))return new _e(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-nC;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}_e._jsonSchemaVersion="firestore/timestamp/1.0",_e._jsonSchema={type:je("string",_e._jsonSchemaVersion),seconds:je("number"),nanoseconds:je("number")};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kg extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fe{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new Kg("Invalid base64 string: "+i):i}}(e);return new Fe(t)}static fromUint8Array(e){const t=function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i}(e);return new Fe(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ie(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Fe.EMPTY_BYTE_STRING=new Fe("");const iA=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function bn(r){if(H(!!r,39018),typeof r=="string"){let e=0;const t=iA.exec(r);if(H(!!t,46558,{timestamp:r}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:Re(r.seconds),nanos:Re(r.nanos)}}function Re(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function Sn(r){return typeof r=="string"?Fe.fromBase64String(r):Fe.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jg="server_timestamp",zg="__type__",Qg="__previous_value__",Wg="__local_write_time__";function Yo(r){var t,n;return((n=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[zg])==null?void 0:n.stringValue)===Jg}function Xo(r){const e=r.mapValue.fields[Qg];return Yo(e)?Xo(e):e}function $s(r){const e=bn(r.mapValue.fields[Wg].timestampValue);return new _e(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oA{constructor(e,t,n,s,i,o,a,u,B,l,d,C,m){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=u,this.useFetchStreams=B,this.isUsingEmulator=l,this.apiKey=d,this._customHeaders=C,this.grpcFlowControlWindow=m}}const pu="(default)";class is{constructor(e,t){this.projectId=e,this.database=t||pu}static empty(){return new is("","")}get isDefaultDatabase(){return this.database===pu}isEqual(e){return e instanceof is&&e.projectId===this.projectId&&e.database===this.database}}function aA(r,e){if(!Object.prototype.hasOwnProperty.apply(r.options,["projectId"]))throw new G(N.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new is(r.options.projectId,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qr=-1;function Zo(r){return r==null}function Ys(r){return r===0&&1/r==-1/0}function $g(r){return typeof r=="number"&&Number.isInteger(r)&&!Ys(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}function uA(r){return typeof r=="string"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dl="__type__",Yg="__max__",ir={mapValue:{fields:{__type__:{stringValue:Yg}}}},yl="__vector__",os="value",un={nullValue:"NULL_VALUE"},vt={booleanValue:!0},nt={booleanValue:!1};function Ke(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Yo(r)?4:Xg(r)?9007199254740991:us(r)?10:11:$(28295,{value:r})}function qt(r,e,t){if(r===e)return!0;const n=Ke(r);if(n!==Ke(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return $s(r).isEqual($s(e));case 3:return function(i,o){if(typeof i.timestampValue=="string"&&typeof o.timestampValue=="string"&&i.timestampValue.length===o.timestampValue.length)return i.timestampValue===o.timestampValue;const a=bn(i.timestampValue),u=bn(o.timestampValue);return a.seconds===u.seconds&&a.nanos===u.nanos}(r,e);case 5:return r.stringValue===e.stringValue;case 6:return function(i,o){return Sn(i.bytesValue).isEqual(Sn(o.bytesValue))}(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return function(i,o){return Re(i.geoPointValue.latitude)===Re(o.geoPointValue.latitude)&&Re(i.geoPointValue.longitude)===Re(o.geoPointValue.longitude)}(r,e);case 2:return function(i,o,a){if("integerValue"in i&&"integerValue"in o)return Re(i.integerValue)===Re(o.integerValue);let u,B;if("doubleValue"in i&&"doubleValue"in o)u=Re(i.doubleValue),B=Re(o.doubleValue);else{if(!(a!=null&&a.i))return!1;u=Re(i.integerValue??i.doubleValue),B=Re(o.integerValue??o.doubleValue)}return u===B?!!(a!=null&&a.o)||Ys(u)===Ys(B):!!(a===void 0||a.u)&&isNaN(u)&&isNaN(B)}(r,e,t);case 9:return Ws(r.arrayValue.values||[],e.arrayValue.values||[],(s,i)=>qt(s,i,t));case 10:case 11:return function(i,o,a){const u=i.mapValue.fields||{},B=o.mapValue.fields||{};if(Cu(u)!==Cu(B))return!1;for(const l in u)if(u.hasOwnProperty(l)&&(B[l]===void 0||!qt(u[l],B[l],a)))return!1;return!0}(r,e,t);default:return $(52216,{left:r})}}function To(r,e){return(r.values||[]).find(t=>qt(t,e))!==void 0}function dt(r,e){if(r===e)return 0;const t=Ke(r),n=Ke(e);if(t!==n)return ie(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return ie(r.booleanValue,e.booleanValue);case 2:return function(i,o){const a=Re(i.integerValue||i.doubleValue),u=Re(o.integerValue||o.doubleValue);return a<u?-1:a>u?1:a===u?0:isNaN(a)?isNaN(u)?0:-1:1}(r,e);case 3:return sC(r.timestampValue,e.timestampValue);case 4:return sC($s(r),$s(e));case 5:return bB(r.stringValue,e.stringValue);case 6:return function(i,o){const a=Sn(i),u=Sn(o);return a.compareTo(u)}(r.bytesValue,e.bytesValue);case 7:return function(i,o){const a=i.split("/"),u=o.split("/");for(let B=0;B<a.length&&B<u.length;B++){const l=ie(a[B],u[B]);if(l!==0)return l}return ie(a.length,u.length)}(r.referenceValue,e.referenceValue);case 8:return function(i,o){const a=ie(Re(i.latitude),Re(o.latitude));return a!==0?a:ie(Re(i.longitude),Re(o.longitude))}(r.geoPointValue,e.geoPointValue);case 9:return iC(r.arrayValue,e.arrayValue);case 10:return function(i,o){var C,m,y,O;const a=i.fields||{},u=o.fields||{},B=(C=a[os])==null?void 0:C.arrayValue,l=(m=u[os])==null?void 0:m.arrayValue,d=ie(((y=B==null?void 0:B.values)==null?void 0:y.length)||0,((O=l==null?void 0:l.values)==null?void 0:O.length)||0);return d!==0?d:iC(B,l)}(r.mapValue,e.mapValue);case 11:return function(i,o){if(i===ir.mapValue&&o===ir.mapValue)return 0;if(i===ir.mapValue)return 1;if(o===ir.mapValue)return-1;const a=i.fields||{},u=Object.keys(a),B=o.fields||{},l=Object.keys(B);u.sort(),l.sort();for(let d=0;d<u.length&&d<l.length;++d){const C=bB(u[d],l[d]);if(C!==0)return C;const m=dt(a[u[d]],B[l[d]]);if(m!==0)return m}return ie(u.length,l.length)}(r.mapValue,e.mapValue);default:throw $(23264,{l:t})}}function sC(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return ie(r,e);const t=bn(r),n=bn(e),s=ie(t.seconds,n.seconds);return s!==0?s:ie(t.nanos,n.nanos)}function iC(r,e){const t=r.values||[],n=e.values||[];for(let s=0;s<t.length&&s<n.length;++s){const i=dt(t[s],n[s]);if(i!==void 0&&i!==0)return i}return ie(t.length,n.length)}function Xs(r){return SB(r)}function SB(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?function(t){const n=bn(t);return`time(${n.seconds},${n.nanos})`}(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?function(t){return Sn(t).toBase64()}(r.bytesValue):"referenceValue"in r?function(t){return J.fromName(t).toString()}(r.referenceValue):"geoPointValue"in r?function(t){return`geo(${t.latitude},${t.longitude})`}(r.geoPointValue):"arrayValue"in r?function(t){let n="[",s=!0;for(const i of t.values||[])s?s=!1:n+=",",n+=SB(i);return n+"]"}(r.arrayValue):"mapValue"in r?function(t){const n=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const o of n)i?i=!1:s+=",",s+=`${o}:${SB(t.fields[o])}`;return s+"}"}(r.mapValue):$(61005,{value:r})}function Ya(r){switch(Ke(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Xo(r);return e?16+Ya(e):16;case 5:return 2*r.stringValue.length;case 6:return Sn(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return function(n){return(n.values||[]).reduce((s,i)=>s+Ya(i),0)}(r.arrayValue);case 10:case 11:return function(n){let s=0;return wr(n.fields,(i,o)=>{s+=i.length+Ya(o)}),s}(r.mapValue);default:throw $(13486,{value:r})}}function as(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function en(r){return!!r&&"integerValue"in r}function jr(r){return!!r&&"doubleValue"in r}function pr(r){return en(r)||jr(r)}function gr(r){return!!r&&"arrayValue"in r}function Lt(r){return!!r&&"nullValue"in r}function Pt(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function Wr(r){return!!r&&"mapValue"in r}function us(r){var t,n;return((n=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[Dl])==null?void 0:n.stringValue)===yl}function NB(r){var e,t;return(t=(((e=r==null?void 0:r.mapValue)==null?void 0:e.fields)||{})[os])==null?void 0:t.arrayValue}function ao(r){if(r.geoPointValue)return{geoPointValue:{...r.geoPointValue}};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:{...r.timestampValue}};if(r.mapValue){const e={mapValue:{fields:{}}};return wr(r.mapValue.fields,(t,n)=>e.mapValue.fields[t]=ao(n)),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=ao(r.arrayValue.values[t]);return e}return{...r}}function Xg(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===Yg}const Zg={mapValue:{fields:{[Dl]:{stringValue:yl},[os]:{arrayValue:{}}}}};function cA(r){return"nullValue"in r?un:"booleanValue"in r?{booleanValue:!1}:"integerValue"in r||"doubleValue"in r?{doubleValue:NaN}:"timestampValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in r?{stringValue:""}:"bytesValue"in r?{bytesValue:""}:"referenceValue"in r?as(is.empty(),J.empty()):"geoPointValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in r?{arrayValue:{}}:"mapValue"in r?us(r)?Zg:{mapValue:{}}:$(35942,{value:r})}function BA(r){return"nullValue"in r?{booleanValue:!1}:"booleanValue"in r?{doubleValue:NaN}:"integerValue"in r||"doubleValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in r?{stringValue:""}:"stringValue"in r?{bytesValue:""}:"bytesValue"in r?as(is.empty(),J.empty()):"referenceValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in r?{arrayValue:{}}:"arrayValue"in r?Zg:"mapValue"in r?us(r)?{mapValue:{}}:ir:$(61959,{value:r})}function oC(r,e){const t=dt(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?-1:!r.inclusive&&e.inclusive?1:0}function aC(r,e){const t=dt(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?1:!r.inclusive&&e.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(e){this.value=e}static empty(){return new tt({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!Wr(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=ao(t)}setAll(e){let t=Qe.emptyPath(),n={},s=[];e.forEach((o,a)=>{if(!t.isImmediateParentOf(a)){const u=this.getFieldsMap(t);this.applyChanges(u,n,s),n={},s=[],t=a.popLast()}o?n[a.lastSegment()]=ao(o):s.push(a.lastSegment())});const i=this.getFieldsMap(t);this.applyChanges(i,n,s)}delete(e){const t=this.field(e.popLast());Wr(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return qt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let s=t.mapValue.fields[e.get(n)];Wr(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,n){wr(t,(s,i)=>e[s]=i);for(const s of n)delete e[s]}clone(){return new tt(ao(this.value))}}function em(r){const e=[];return wr(r.fields,(t,n)=>{const s=new Qe([t]);if(Wr(n)){const i=em(n.mapValue).fields;if(i.length===0)e.push(s);else for(const o of i)e.push(s.child(o))}else e.push(s)}),new wt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yu(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Ys(e)?"-0":e}}function wl(r){return{integerValue:""+r}}function Xu(r,e,t){return $g(e)?wl(e):Yu(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zu{constructor(){this._=void 0}}function lA(r,e,t){return r instanceof Zs?function(s,i){const o={fields:{[zg]:{stringValue:Jg},[Wg]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&Yo(i)&&(i=Xo(i)),i&&(o.fields[Qg]=i),{mapValue:o}}(t,e):r instanceof cs?nm(r,e):r instanceof Bs?rm(r,e):r instanceof ls?function(s,i){const o=tm(s,i),a=gu(o)+gu(s.h);return en(o)&&en(s.h)?wl(a):Yu(s.serializer,a)}(r,e):r instanceof Ao?function(s,i){return uC(s,i,Math.min)}(r,e):r instanceof Ro?function(s,i){return uC(s,i,Math.max)}(r,e):void 0}function hA(r,e,t){return r instanceof cs?nm(r,e):r instanceof Bs?rm(r,e):t}function tm(r,e){return r instanceof ls?pr(e)?e:{integerValue:0}:null}class Zs extends Zu{}class cs extends Zu{constructor(e){super(),this.elements=e}}function nm(r,e){const t=sm(e);for(const n of r.elements)t.some(s=>qt(s,n))||t.push(n);return{arrayValue:{values:t}}}class Bs extends Zu{constructor(e){super(),this.elements=e}}function rm(r,e){let t=sm(e);for(const n of r.elements)t=t.filter(s=>!qt(s,n));return{arrayValue:{values:t}}}class Tl extends Zu{constructor(e,t){super(),this.serializer=e,this.h=t}}class ls extends Tl{}class Ao extends Tl{}class Ro extends Tl{}function uC(r,e,t){if(!pr(e))return r.h;const n=t(gu(e),gu(r.h));return en(e)&&en(r.h)?wl(n):Yu(r.serializer,n)}function gu(r){return Re(r.integerValue||r.doubleValue)}function sm(r){return gr(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ea{constructor(e,t){this.field=e,this.transform=t}}function dA(r,e){return r.field.isEqual(e.field)&&function(n,s){return n instanceof cs&&s instanceof cs||n instanceof Bs&&s instanceof Bs?Ws(n.elements,s.elements,qt):n instanceof ls&&s instanceof ls||n instanceof Ao&&s instanceof Ao||n instanceof Ro&&s instanceof Ro?qt(n.h,s.h):n instanceof Zs&&s instanceof Zs}(r.transform,e.transform)}class fA{constructor(e,t){this.version=e,this.transformResults=t}}class Ne{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Ne}static exists(e){return new Ne(void 0,e)}static updateTime(e){return new Ne(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Xa(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class ec{}function im(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new pi(r.key,Ne.none()):new Ci(r.key,r.data,Ne.none());{const t=r.data,n=tt.empty();let s=new Ee(Qe.comparator);for(let i of e.fields)if(!s.has(i)){let o=t.field(i);o===null&&i.length>1&&(i=i.popLast(),o=t.field(i)),o===null?n.delete(i):n.set(i,o),s=s.add(i)}return new kn(r.key,n,new wt(s.toArray()),Ne.none())}}function CA(r,e,t){r instanceof Ci?function(s,i,o){const a=s.value.clone(),u=BC(s.fieldTransforms,i,o.transformResults);a.setAll(u),i.convertToFoundDocument(o.version,a).setHasCommittedMutations()}(r,e,t):r instanceof kn?function(s,i,o){if(!Xa(s.precondition,i))return void i.convertToUnknownDocument(o.version);const a=BC(s.fieldTransforms,i,o.transformResults),u=i.data;u.setAll(om(s)),u.setAll(a),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()}(r,e,t):function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,t)}function uo(r,e,t,n){return r instanceof Ci?function(i,o,a,u){if(!Xa(i.precondition,o))return a;const B=i.value.clone(),l=lC(i.fieldTransforms,u,o);return B.setAll(l),o.convertToFoundDocument(o.version,B).setHasLocalMutations(),null}(r,e,t,n):r instanceof kn?function(i,o,a,u){if(!Xa(i.precondition,o))return a;const B=lC(i.fieldTransforms,u,o),l=o.data;return l.setAll(om(i)),l.setAll(B),o.convertToFoundDocument(o.version,l).setHasLocalMutations(),a===null?null:a.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(d=>d.field))}(r,e,t,n):function(i,o,a){return Xa(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):a}(r,e,t)}function pA(r,e){let t=null;for(const n of r.fieldTransforms){const s=e.data.field(n.field),i=tm(n.transform,s||null);i!=null&&(t===null&&(t=tt.empty()),t.set(n.field,i))}return t||null}function cC(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!function(n,s){return n===void 0&&s===void 0||!(!n||!s)&&Ws(n,s,(i,o)=>dA(i,o))}(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class Ci extends ec{constructor(e,t,n,s=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class kn extends ec{constructor(e,t,n,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function om(r){const e=new Map;return r.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const n=r.data.field(t);e.set(t,n)}}),e}function BC(r,e,t){const n=new Map;H(r.length===t.length,32656,{T:t.length,P:r.length});for(let s=0;s<t.length;s++){const i=r[s],o=i.transform,a=e.data.field(i.field);n.set(i.field,hA(o,a,t[s]))}return n}function lC(r,e,t){const n=new Map;for(const s of r){const i=s.transform,o=t.data.field(s.field);n.set(s.field,lA(i,o,e))}return n}class pi extends ec{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Al extends ec{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mr{constructor(e,t){this.position=e,this.inclusive=t}}function hC(r,e,t){let n=0;for(let s=0;s<r.position.length;s++){const i=e[s],o=r.position[s];if(i.field.isKeyField()?n=J.comparator(J.fromName(o.referenceValue),t.key):n=dt(o,t.data.field(i.field)),i.dir==="desc"&&(n*=-1),n!==0)break}return n}function dC(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!qt(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class am{}class fe extends am{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new gA(e,t,n):t==="array-contains"?new EA(e,n):t==="in"?new dm(e,n):t==="not-in"?new IA(e,n):t==="array-contains-any"?new DA(e,n):new fe(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new mA(e,n):new _A(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(dt(t,this.value)):t!==null&&Ke(this.value)===Ke(t)&&this.matchesComparison(dt(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return $(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Ie extends am{constructor(e,t){super(),this.filters=e,this.op=t,this.I=null}static create(e,t){return new Ie(e,t)}matches(e){return ei(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.I!==null||(this.I=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.I}getFilters(){return Object.assign([],this.filters)}}function ei(r){return r.op==="and"}function OB(r){return r.op==="or"}function Rl(r){return um(r)&&ei(r)}function um(r){for(const e of r.filters)if(e instanceof Ie)return!1;return!0}function FB(r){if(r instanceof fe)return r.field.canonicalString()+r.op.toString()+Xs(r.value);if(Rl(r))return r.filters.map(e=>FB(e)).join(",");{const e=r.filters.map(t=>FB(t)).join(",");return`${r.op}(${e})`}}function cm(r,e){return r instanceof fe?function(n,s){return s instanceof fe&&n.op===s.op&&n.field.isEqual(s.field)&&qt(n.value,s.value)}(r,e):r instanceof Ie?function(n,s){return s instanceof Ie&&n.op===s.op&&n.filters.length===s.filters.length?n.filters.reduce((i,o,a)=>i&&cm(o,s.filters[a]),!0):!1}(r,e):void $(19439)}function Bm(r,e){const t=r.filters.concat(e);return Ie.create(t,r.op)}function lm(r){return r instanceof fe?function(t){return`${t.field.canonicalString()} ${t.op} ${Xs(t.value)}`}(r):r instanceof Ie?function(t){return t.op.toString()+" {"+t.getFilters().map(lm).join(" ,")+"}"}(r):"Filter"}class gA extends fe{constructor(e,t,n){super(e,t,n),this.key=J.fromName(n.referenceValue)}matches(e){const t=J.comparator(e.key,this.key);return this.matchesComparison(t)}}class mA extends fe{constructor(e,t){super(e,"in",t),this.keys=hm("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class _A extends fe{constructor(e,t){super(e,"not-in",t),this.keys=hm("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function hm(r,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map(n=>J.fromName(n.referenceValue))}class EA extends fe{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return gr(t)&&To(t.arrayValue,this.value)}}class dm extends fe{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&To(this.value.arrayValue,t)}}class IA extends fe{constructor(e,t){super(e,"not-in",t)}matches(e){if(To(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!To(this.value.arrayValue,t)}}class DA extends fe{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!gr(t)||!t.arrayValue.values)&&t.arrayValue.values.some(n=>To(this.value.arrayValue,n))}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vo{constructor(e,t="asc"){this.field=e,this.dir=t}}function yA(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ee{static fromTimestamp(e){return new ee(e)}static min(){return new ee(new _e(0,0))}static max(){return new ee(new _e(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Se{constructor(e,t,n,s,i,o,a){this.key=e,this.documentType=t,this.version=n,this.readTime=s,this.createTime=i,this.data=o,this.documentState=a}static newInvalidDocument(e){return new Se(e,0,ee.min(),ee.min(),ee.min(),tt.empty(),0)}static newFoundDocument(e,t,n,s){return new Se(e,1,t,ee.min(),n,s,0)}static newNoDocument(e,t){return new Se(e,2,t,ee.min(),ee.min(),tt.empty(),0)}static newUnknownDocument(e,t){return new Se(e,3,t,ee.min(),ee.min(),tt.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(ee.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=tt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=tt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=ee.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Se&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Se(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ti=-1;class mu{constructor(e,t,n,s){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=s}}function LB(r){return r.fields.find(e=>e.kind===2)}function kr(r){return r.fields.filter(e=>e.kind!==2)}mu.UNKNOWN_ID=-1;class Za{constructor(e,t){this.fieldPath=e,this.kind=t}}class Po{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new Po(0,Vt.min())}}function fm(r,e){const t=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,s=ee.fromTimestamp(n===1e9?new _e(t+1,0):new _e(t,n));return new Vt(s,J.empty(),e)}function Cm(r){return new Vt(r.readTime,r.key,ti)}class Vt{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new Vt(ee.min(),J.empty(),ti)}static max(){return new Vt(ee.max(),J.empty(),ti)}}function vl(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=J.comparator(r.documentKey,e.documentKey),t!==0?t:ie(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wA{constructor(e,t=null,n=[],s=[],i=null,o=null,a=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=s,this.limit=i,this.startAt=o,this.endAt=a,this.R=null}}function kB(r,e=null,t=[],n=[],s=null,i=null,o=null){return new wA(r,e,t,n,s,i,o)}function _u(r){const e=X(r);if(e.R===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(n=>FB(n)).join(","),t+="|ob:",t+=e.orderBy.map(n=>function(i){return i.field.canonicalString()+i.dir}(n)).join(","),Zo(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(n=>Xs(n)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(n=>Xs(n)).join(",")),e.R=t}return e.R}function Pl(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!yA(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!cm(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!dC(r.startAt,e.startAt)&&dC(r.endAt,e.endAt)}function mn(r){return!!r.isCorePipeline}function bl(r){return!!r.path&&J.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function Eu(r,e){return r.filters.filter(t=>t instanceof fe&&t.field.isEqual(e))}function fC(r,e,t){let n=un,s=!0;for(const i of Eu(r,e)){let o=un,a=!0;switch(i.op){case"<":case"<=":o=cA(i.value);break;case"==":case"in":case">=":o=i.value;break;case">":o=i.value,a=!1;break;case"!=":case"not-in":o=un}oC({value:n,inclusive:s},{value:o,inclusive:a})<0&&(n=o,s=a)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const o=t.position[i];oC({value:n,inclusive:s},{value:o,inclusive:t.inclusive})<0&&(n=o,s=t.inclusive);break}}return{value:n,inclusive:s}}function CC(r,e,t){let n=ir,s=!0;for(const i of Eu(r,e)){let o=ir,a=!0;switch(i.op){case">=":case">":o=BA(i.value),a=!1;break;case"==":case"in":case"<=":o=i.value;break;case"<":o=i.value,a=!1;break;case"!=":case"not-in":o=ir}aC({value:n,inclusive:s},{value:o,inclusive:a})>0&&(n=o,s=a)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const o=t.position[i];aC({value:n,inclusive:s},{value:o,inclusive:t.inclusive})>0&&(n=o,s=t.inclusive);break}}return{value:n,inclusive:s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ms{constructor(e,t=null,n=[],s=[],i=null,o="F",a=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=s,this.limit=i,this.limitType=o,this.startAt=a,this.endAt=u,this.A=null,this.V=null,this.m=null,this.startAt,this.endAt}}function pm(r,e,t,n,s,i,o,a){return new ms(r,e,t,n,s,i,o,a)}function ta(r){return new ms(r)}function pC(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function TA(r){return J.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function Sl(r){return r.collectionGroup!==null}function zs(r){const e=X(r);if(e.A===null){e.A=[];const t=new Set;for(const i of e.explicitOrderBy)e.A.push(i),t.add(i.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let a=new Ee(Qe.comparator);return o.filters.forEach(u=>{u.getFlattenedFilters().forEach(B=>{B.isInequality()&&(a=a.add(B.field))})}),a})(e).forEach(i=>{t.has(i.canonicalString())||i.isKeyField()||e.A.push(new vo(i,n))}),t.has(Qe.keyField().canonicalString())||e.A.push(new vo(Qe.keyField(),n))}return e.A}function xt(r){const e=X(r);return e.V||(e.V=AA(e,zs(r))),e.V}function AA(r,e){if(r.limitType==="F")return kB(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map(s=>{const i=s.dir==="desc"?"asc":"desc";return new vo(s.field,i)});const t=r.endAt?new mr(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new mr(r.startAt.position,r.startAt.inclusive):null;return kB(r.path,r.collectionGroup,e,r.filters,r.limit,t,n)}}function xB(r,e){const t=r.filters.concat([e]);return new ms(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function RA(r,e){const t=r.explicitOrderBy.concat([e]);return new ms(r.path,r.collectionGroup,t,r.filters.slice(),r.limit,r.limitType,r.startAt,r.endAt)}function Iu(r,e,t){return new ms(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function vA(r,e){return new ms(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),r.limit,r.limitType,e,r.endAt)}function PA(r,e){return Pl(xt(r),xt(e))&&r.limitType===e.limitType}function co(r){return`Query(target=${function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map(s=>lm(s)).join(", ")}]`),Zo(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map(s=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(s)).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map(s=>Xs(s)).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map(s=>Xs(s)).join(",")),`Target(${n})`}(xt(r))}; limitType=${r.limitType})`}function tc(r,e){return e.isFoundDocument()&&function(n,s){const i=s.key.path;return n.collectionGroup!==null?s.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(i):J.isDocumentKey(n.path)?n.path.isEqual(i):n.path.isImmediateParentOf(i)}(r,e)&&function(n,s){for(const i of zs(n))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0}(r,e)&&function(n,s){for(const i of n.filters)if(!i.matches(s))return!1;return!0}(r,e)&&function(n,s){return!(n.startAt&&!function(o,a,u){const B=hC(o,a,u);return o.inclusive?B<=0:B<0}(n.startAt,zs(n),s)||n.endAt&&!function(o,a,u){const B=hC(o,a,u);return o.inclusive?B>=0:B>0}(n.endAt,zs(n),s))}(r,e)}function Nl(r){return(e,t)=>{let n=!1;for(const s of zs(r)){const i=bA(s,e,t);if(i!==0)return i;n=n||s.field.isKeyField()}return 0}}function bA(r,e,t){const n=r.field.isKeyField()?J.comparator(e.key,t.key):function(i,o,a){const u=o.data.field(i),B=a.data.field(i);return u!==null&&B!==null?dt(u,B):$(42886)}(r.field,e,t);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return $(19790,{direction:r.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SA{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ge,pe;function gm(r){switch(r){case N.OK:return $(64938);case N.CANCELLED:case N.UNKNOWN:case N.DEADLINE_EXCEEDED:case N.RESOURCE_EXHAUSTED:case N.INTERNAL:case N.UNAVAILABLE:case N.UNAUTHENTICATED:return!1;case N.INVALID_ARGUMENT:case N.NOT_FOUND:case N.ALREADY_EXISTS:case N.PERMISSION_DENIED:case N.FAILED_PRECONDITION:case N.ABORTED:case N.OUT_OF_RANGE:case N.UNIMPLEMENTED:case N.DATA_LOSS:return!0;default:return $(15467,{code:r})}}function mm(r){if(r===void 0)return Me("GRPC error has no .code"),N.UNKNOWN;switch(r){case Ge.OK:return N.OK;case Ge.CANCELLED:return N.CANCELLED;case Ge.UNKNOWN:return N.UNKNOWN;case Ge.DEADLINE_EXCEEDED:return N.DEADLINE_EXCEEDED;case Ge.RESOURCE_EXHAUSTED:return N.RESOURCE_EXHAUSTED;case Ge.INTERNAL:return N.INTERNAL;case Ge.UNAVAILABLE:return N.UNAVAILABLE;case Ge.UNAUTHENTICATED:return N.UNAUTHENTICATED;case Ge.INVALID_ARGUMENT:return N.INVALID_ARGUMENT;case Ge.NOT_FOUND:return N.NOT_FOUND;case Ge.ALREADY_EXISTS:return N.ALREADY_EXISTS;case Ge.PERMISSION_DENIED:return N.PERMISSION_DENIED;case Ge.FAILED_PRECONDITION:return N.FAILED_PRECONDITION;case Ge.ABORTED:return N.ABORTED;case Ge.OUT_OF_RANGE:return N.OUT_OF_RANGE;case Ge.UNIMPLEMENTED:return N.UNIMPLEMENTED;case Ge.DATA_LOSS:return N.DATA_LOSS;default:return $(39323,{code:r})}}(pe=Ge||(Ge={}))[pe.OK=0]="OK",pe[pe.CANCELLED=1]="CANCELLED",pe[pe.UNKNOWN=2]="UNKNOWN",pe[pe.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",pe[pe.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",pe[pe.NOT_FOUND=5]="NOT_FOUND",pe[pe.ALREADY_EXISTS=6]="ALREADY_EXISTS",pe[pe.PERMISSION_DENIED=7]="PERMISSION_DENIED",pe[pe.UNAUTHENTICATED=16]="UNAUTHENTICATED",pe[pe.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",pe[pe.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",pe[pe.ABORTED=10]="ABORTED",pe[pe.OUT_OF_RANGE=11]="OUT_OF_RANGE",pe[pe.UNIMPLEMENTED=12]="UNIMPLEMENTED",pe[pe.INTERNAL=13]="INTERNAL",pe[pe.UNAVAILABLE=14]="UNAVAILABLE",pe[pe.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xn{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[s,i]of n)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let s=0;s<n.length;s++)if(this.equalsFn(n[s][0],e))return n.length===1?delete this.inner[t]:n.splice(s,1),this.innerSize--,!0;return!1}forEach(e){wr(this.inner,(t,n)=>{for(const[s,i]of n)e(s,i)})}isEmpty(){return qg(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NA=new Te(J.comparator);function ze(){return NA}const _m=new Te(J.comparator);function Vr(...r){let e=_m;for(const t of r)e=e.insert(t.key,t);return e}function Em(r){let e=_m;return r.forEach((t,n)=>e=e.insert(t,n.overlayedDocument)),e}function Ut(){return Bo()}function Im(){return Bo()}function Bo(){return new xn(r=>r.toString(),(r,e)=>r.isEqual(e))}const OA=new Te(J.comparator),FA=new Ee(J.comparator);function ce(...r){let e=FA;for(const t of r)e=e.add(t);return e}const LA=new Ee(ie);function Ol(){return LA}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kA(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xA=new Br([4294967295,4294967295],0);function gC(r){const e=kA().encode(r),t=new Pg;return t.update(e),new Uint8Array(t.digest())}function mC(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new Br([t,n],0),new Br([s,i],0)]}class Fl{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new Zi(`Invalid padding: ${t}`);if(n<0)throw new Zi(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new Zi(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new Zi(`Invalid padding when bitmap length is 0: ${t}`);this.p=8*e.length-t,this.S=Br.fromNumber(this.p)}v(e,t,n){let s=e.add(t.multiply(Br.fromNumber(n)));return s.compare(xA)===1&&(s=new Br([s.getBits(0),s.getBits(1)],0)),s.modulo(this.S).toNumber()}D(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.p===0)return!1;const t=gC(e),[n,s]=mC(t);for(let i=0;i<this.hashCount;i++){const o=this.v(n,s,i);if(!this.D(o))return!1}return!0}static create(e,t,n){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new Fl(i,s,t);return n.forEach(a=>o.insert(a)),o}insert(e){if(this.p===0)return;const t=gC(e),[n,s]=mC(t);for(let i=0;i<this.hashCount;i++){const o=this.v(n,s,i);this.C(o)}}C(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class Zi extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gi{constructor(e,t,n,s,i,o){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=s,this.augmentedDocumentUpdates=i,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const s=new Map;return s.set(e,na.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new gi(ee.min(),s,new Te(ie),ze(),ze(),ce())}}class na{constructor(e,t,n,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new na(n,t,ce(),ce(),ce())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eu{constructor(e,t,n,s){this.F=e,this.removedTargetIds=t,this.key=n,this.O=s}}class Dm{constructor(e,t){this.targetId=e,this.M=t}}class ym{constructor(e,t,n=Fe.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=s}}class _C{constructor(e){this.targetId=e,this.N=0,this.L=EC(),this.B=Fe.EMPTY_BYTE_STRING,this.U=!1,this.k=!0}get current(){return this.U}get resumeToken(){return this.B}get q(){return this.N!==0}get $(){return this.k}K(e){e.approximateByteSize()>0&&(this.k=!0,this.B=e)}W(){let e=ce(),t=ce(),n=ce();return this.L.forEach((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:n=n.add(s);break;default:$(38017,{changeType:i})}}),new na(this.B,this.U,e,t,n)}G(){this.k=!1,this.L=EC()}j(e,t){this.k=!0,this.L=this.L.insert(e,t)}H(e){this.k=!0,this.L=this.L.remove(e)}J(){this.N+=1}Y(){this.N-=1,H(this.N>=0,3241,{N:this.N,targetId:this.targetId})}Z(){this.k=!0,this.U=!0}}const Hi="WatchChangeAggregator";class VA{constructor(e){this.X=e,this.ee=new Map,this.te=ze(),this.ne=La(),this.re=ze(),this.ie=La(),this.se=new Te(ie)}_e(e){for(const t of e.F)e.O&&e.O.isFoundDocument()?this.oe(t,e.O):this.ae(t,e.key,e.O);for(const t of e.removedTargetIds)this.ae(t,e.key,e.O)}ue(e){this.forEachTarget(e,t=>{const n=this.ee.get(t);if(n)switch(e.state){case 0:this.ce(t)&&n.K(e.resumeToken);break;case 1:n.Y(),n.q||n.G(),n.K(e.resumeToken);break;case 2:n.Y(),n.q||this.removeTarget(t);break;case 3:this.ce(t)&&(n.Z(),n.K(e.resumeToken));break;case 4:this.ce(t)&&(this.le(t),n.K(e.resumeToken));break;default:$(56790,{state:e.state})}else U(Hi,`handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`)})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ee.forEach((n,s)=>{this.ce(s)&&t(s)})}Ee(e){var t;return mn(e)?e.getPipelineSourceType()==="documents"&&((t=e.getPipelineDocuments())==null?void 0:t.length)===1:bl(e)}he(e){const t=e.targetId,n=e.M.count,s=this.Te(t);if(s){const i=s.target;if(this.Ee(i))if(n===0){const o=new J(mn(i)?he.fromString(i.getPipelineDocuments()[0]):i.path);this.ae(t,o,Se.newNoDocument(o,ee.min()))}else H(n===1,20013,"Single document existence filter with count: "+n);else{const o=this.Pe(t);if(o!==n){const a=this.Ie(e),u=a?this.Re(a,e,o):1;if(u!==0){this.le(t);const B=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.se=this.se.insert(t,B)}}}}}Ie(e){const t=e.M.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:s=0},hashCount:i=0}=t;let o,a;try{o=Sn(n).toUint8Array()}catch(u){if(u instanceof Kg)return zt("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{a=new Fl(o,s,i)}catch(u){return zt(u instanceof Zi?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return a.p===0?null:a}Re(e,t,n){return t.M.count===n-this.de(e,t.targetId)?0:2}de(e,t){const n=this.X.getRemoteKeysForTarget(t);let s=0;return n.forEach(i=>{const o=this.X.Ve(),a=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(a)||(this.ae(t,i,null),s++)}),s}fe(e){const t=new Map;this.ee.forEach((i,o)=>{const a=this.Te(o);if(a){if(i.current&&this.Ee(a.target)){const u=mn(a.target)?he.fromString(a.target.getPipelineDocuments()[0]):a.target.path,B=new J(u);this.me(B).has(o)||this.pe(o,B)||this.ae(o,B,Se.newNoDocument(B,e))}i.$&&(t.set(o,i.W()),i.G())}});let n=ce();this.ie.forEach((i,o)=>{let a=!0;o.forEachWhile(u=>{const B=this.Te(u);return!B||B.purpose==="TargetPurposeLimboResolution"||(a=!1,!1)}),a&&(n=n.add(i))}),this.te.forEach((i,o)=>o.setReadTime(e)),this.re.forEach((i,o)=>o.setReadTime(e));const s=new gi(e,t,this.se,this.te,this.re,n);return this.te=ze(),this.ne=La(),this.re=ze(),this.ie=La(),this.se=new Te(ie),s}oe(e,t){const n=this.ee.get(e);if(!n||!this.ce(e))return void U(Hi,`addDocumentToTarget received document for unknown inactive target (${e})`);const s=this.pe(e,t.key)?2:0;n.j(t.key,s),mn(this.Te(e).target)&&this.Te(e).target.getPipelineFlavor()!=="exact"?this.re=this.re.insert(t.key,t):this.te=this.te.insert(t.key,t),this.ne=this.ne.insert(t.key,this.me(t.key).add(e)),this.ie=this.ie.insert(t.key,this.ge(t.key).add(e))}ae(e,t,n){const s=this.ee.get(e);s&&this.ce(e)?(this.pe(e,t)?s.j(t,1):s.H(t),this.ie=this.ie.insert(t,this.ge(t).delete(e)),this.ie=this.ie.insert(t,this.ge(t).add(e)),n&&(mn(this.Te(e).target)&&this.Te(e).target.getPipelineFlavor()!=="exact"?this.re=this.re.insert(t,n):this.te=this.te.insert(t,n))):U(Hi,`removeDocumentFromTarget received document for unknown or inactive target (${e})`)}removeTarget(e){this.ee.delete(e)}Pe(e){const t=this.ee.get(e);if(!t)return 0;const n=t.W();return this.X.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}J(e){let t=this.ee.get(e);t||(U(Hi,`recordPendingTargetRequest set up tracking for target ID ${e}`),t=new _C(e),this.ee.set(e,t)),t.J()}ge(e){let t=this.ie.get(e);return t||(t=new Ee(ie),this.ie=this.ie.insert(e,t)),t}me(e){let t=this.ne.get(e);return t||(t=new Ee(ie),this.ne=this.ne.insert(e,t)),t}ce(e){const t=this.Te(e)!==null;return t||U(Hi,"Detected inactive target",e),t}Te(e){const t=this.ee.get(e);return t===void 0||t.q?null:this.X.ye(e)}le(e){this.ee.set(e,new _C(e)),this.X.getRemoteKeysForTarget(e).forEach(t=>{this.ae(e,t,null)})}pe(e,t){return this.X.getRemoteKeysForTarget(e).has(t)}}function La(){return new Te(J.comparator)}function EC(){return new Te(J.comparator)}const MA={asc:"ASCENDING",desc:"DESCENDING"},GA={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},UA={and:"AND",or:"OR"};class HA{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function VB(r,e){return r.useProto3Json||Zo(e)?e:{value:e}}function $r(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Ll(r){const e=bn(r);return new _e(e.seconds,e.nanos)}function wm(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function tu(r,e){return $r(r,e.toTimestamp())}function rt(r){return H(!!r,49232),ee.fromTimestamp(Ll(r))}function kl(r,e){return MB(r,e).canonicalString()}function MB(r,e){const t=function(s){return new he(["projects",s.projectId,"databases",s.database])}(r).child("documents");return e===void 0?t:t.child(e)}function Tm(r){const e=he.fromString(r);return H(Lm(e),10190,{key:e.toString()}),e}function ni(r,e){return kl(r.databaseId,e.path)}function yn(r,e){const t=Tm(e);if(t.get(1)!==r.databaseId.projectId)throw new G(N.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new G(N.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new J(vm(t))}function Am(r,e){return kl(r.databaseId,e)}function Rm(r){const e=Tm(r);return e.length===4?he.emptyPath():vm(e)}function GB(r){return new he(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function vm(r){return H(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function IC(r,e,t){return{name:ni(r,e),fields:t.value.mapValue.fields}}function qA(r,e,t){const n=yn(r,e.name),s=rt(e.updateTime),i=e.createTime?rt(e.createTime):ee.min(),o=new tt({mapValue:{fields:e.fields}}),a=Se.newFoundDocument(n,s,i,o);return t&&a.setHasCommittedMutations(),t?a.setHasCommittedMutations():a}function jA(r,e){return"found"in e?function(n,s){H(!!s.found,43571),s.found.name,s.found.updateTime;const i=yn(n,s.found.name),o=rt(s.found.updateTime),a=s.found.createTime?rt(s.found.createTime):ee.min(),u=new tt({mapValue:{fields:s.found.fields}});return Se.newFoundDocument(i,o,a,u)}(r,e):"missing"in e?function(n,s){H(!!s.missing,3894),H(!!s.readTime,22933);const i=yn(n,s.missing),o=rt(s.readTime);return Se.newNoDocument(i,o)}(r,e):$(7234,{result:e})}function KA(r,e){let t;if("targetChange"in e){e.targetChange;const n=function(B){return B==="NO_CHANGE"?0:B==="ADD"?1:B==="REMOVE"?2:B==="CURRENT"?3:B==="RESET"?4:$(39313,{state:B})}(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=function(B,l){return B.useProto3Json?(H(l===void 0||typeof l=="string",58123),Fe.fromBase64String(l||"")):(H(l===void 0||l instanceof Buffer||l instanceof Uint8Array,16193),Fe.fromUint8Array(l||new Uint8Array))}(r,e.targetChange.resumeToken),o=e.targetChange.cause,a=o&&function(B){const l=B.code===void 0?N.UNKNOWN:mm(B.code);return new G(l,B.message||"")}(o);t=new ym(n,s,i,a||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const s=yn(r,n.document.name),i=rt(n.document.updateTime),o=n.document.createTime?rt(n.document.createTime):ee.min(),a=new tt({mapValue:{fields:n.document.fields}}),u=Se.newFoundDocument(s,i,o,a),B=n.targetIds||[],l=n.removedTargetIds||[];t=new eu(B,l,u.key,u)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const s=yn(r,n.document),i=n.readTime?rt(n.readTime):ee.min(),o=Se.newNoDocument(s,i),a=n.removedTargetIds||[];t=new eu([],a,o.key,o)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const s=yn(r,n.document),i=n.removedTargetIds||[];t=new eu([],i,s,null)}else{if(!("filter"in e))return $(11601,{we:e});{e.filter;const n=e.filter;n.targetId;const{count:s=0,unchangedNames:i}=n,o=new SA(s,i),a=n.targetId;t=new Dm(a,o)}}return t}function bo(r,e){let t;if(e instanceof Ci)t={update:IC(r,e.key,e.value)};else if(e instanceof pi)t={delete:ni(r,e.key)};else if(e instanceof kn)t={update:IC(r,e.key,e.data),updateMask:YA(e.fieldMask)};else{if(!(e instanceof Al))return $(16599,{be:e.type});t={verify:ni(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(n=>function(i,o){const a=o.transform;if(a instanceof Zs)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof cs)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof Bs)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof ls)return{fieldPath:o.field.canonicalString(),increment:a.h};if(a instanceof Ao)return{fieldPath:o.field.canonicalString(),minimum:a.h};if(a instanceof Ro)return{fieldPath:o.field.canonicalString(),maximum:a.h};throw $(20930,{transform:o.transform})}(0,n))),e.precondition.isNone||(t.currentDocument=function(s,i){return i.updateTime!==void 0?{updateTime:tu(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:$(27497)}(r,e.precondition)),t}function UB(r,e){const t=e.currentDocument?function(i){return i.updateTime!==void 0?Ne.updateTime(rt(i.updateTime)):i.exists!==void 0?Ne.exists(i.exists):Ne.none()}(e.currentDocument):Ne.none(),n=e.updateTransforms?e.updateTransforms.map(s=>function(o,a){let u=null;if("setToServerValue"in a)H(a.setToServerValue==="REQUEST_TIME",16630,{proto:a}),u=new Zs;else if("appendMissingElements"in a){const l=a.appendMissingElements.values||[];u=new cs(l)}else if("removeAllFromArray"in a){const l=a.removeAllFromArray.values||[];u=new Bs(l)}else"increment"in a?u=new ls(o,a.increment):"minimum"in a?u=new Ao(o,a.minimum):"maximum"in a?u=new Ro(o,a.maximum):$(16584,{proto:a});const B=Qe.fromServerFormat(a.fieldPath);return new ea(B,u)}(r,s)):[];if(e.update){e.update.name;const s=yn(r,e.update.name),i=new tt({mapValue:{fields:e.update.fields}});if(e.updateMask){const o=function(u){const B=u.fieldPaths||[];return new wt(B.map(l=>Qe.fromServerFormat(l)))}(e.updateMask);return new kn(s,i,o,t,n)}return new Ci(s,i,t,n)}if(e.delete){const s=yn(r,e.delete);return new pi(s,t)}if(e.verify){const s=yn(r,e.verify);return new Al(s,t)}return $(1463,{proto:e})}function JA(r,e){return r&&r.length>0?(H(e!==void 0,14353),r.map(t=>function(s,i){let o=s.updateTime?rt(s.updateTime):rt(i);return o.isEqual(ee.min())&&(o=rt(i)),new fA(o,s.transformResults||[])}(t,e))):[]}function Pm(r,e){return{documents:[Am(r,e.path)]}}function bm(r,e){const t={structuredQuery:{}},n=e.path;let s;e.collectionGroup!==null?(s=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=Am(r,s);const i=function(B){if(B.length!==0)return Fm(Ie.create(B,"and"))}(e.filters);i&&(t.structuredQuery.where=i);const o=function(B){if(B.length!==0)return B.map(l=>function(C){return{field:Gs(C.field),direction:QA(C.dir)}}(l))}(e.orderBy);o&&(t.structuredQuery.orderBy=o);const a=VB(r,e.limit);return a!==null&&(t.structuredQuery.limit=a),e.startAt&&(t.structuredQuery.startAt=function(B){return{before:B.inclusive,values:B.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(B){return{before:!B.inclusive,values:B.position}}(e.endAt)),{Se:t,parent:s}}function Sm(r){let e=Rm(r.parent);const t=r.structuredQuery,n=t.from?t.from.length:0;let s=null;if(n>0){H(n===1,65062);const l=t.from[0];l.allDescendants?s=l.collectionId:e=e.child(l.collectionId)}let i=[];t.where&&(i=function(d){const C=Om(d);return C instanceof Ie&&Rl(C)?C.getFilters():[C]}(t.where));let o=[];t.orderBy&&(o=function(d){return d.map(C=>function(y){return new vo(Us(y.field),function(V){switch(V){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(y.direction))}(C))}(t.orderBy));let a=null;t.limit&&(a=function(d){let C;return C=typeof d=="object"?d.value:d,Zo(C)?null:C}(t.limit));let u=null;t.startAt&&(u=function(d){const C=!!d.before,m=d.values||[];return new mr(m,C)}(t.startAt));let B=null;return t.endAt&&(B=function(d){const C=!d.before,m=d.values||[];return new mr(m,C)}(t.endAt)),pm(e,s,o,i,a,"F",u,B)}function zA(r,e){const t=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return $(28987,{purpose:s})}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Nm(r,e){return{structuredPipeline:{pipeline:{stages:e.stages.map(t=>t._toProto(r))}}}}function Om(r){return r.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=Us(t.unaryFilter.field);return fe.create(n,"==",{doubleValue:NaN});case"IS_NULL":const s=Us(t.unaryFilter.field);return fe.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Us(t.unaryFilter.field);return fe.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Us(t.unaryFilter.field);return fe.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return $(61313);default:return $(60726)}}(r):r.fieldFilter!==void 0?function(t){return fe.create(Us(t.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return $(58110);default:return $(50506)}}(t.fieldFilter.op),t.fieldFilter.value)}(r):r.compositeFilter!==void 0?function(t){return Ie.create(t.compositeFilter.filters.map(n=>Om(n)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return $(1026)}}(t.compositeFilter.op))}(r):$(30097,{filter:r})}function QA(r){return MA[r]}function WA(r){return GA[r]}function $A(r){return UA[r]}function Gs(r){return{fieldPath:r.canonicalString()}}function Us(r){return Qe.fromServerFormat(r.fieldPath)}function Fm(r){return r instanceof fe?function(t){if(t.op==="=="){if(Pt(t.value))return{unaryFilter:{field:Gs(t.field),op:"IS_NAN"}};if(Lt(t.value))return{unaryFilter:{field:Gs(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Pt(t.value))return{unaryFilter:{field:Gs(t.field),op:"IS_NOT_NAN"}};if(Lt(t.value))return{unaryFilter:{field:Gs(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Gs(t.field),op:WA(t.op),value:t.value}}}(r):r instanceof Ie?function(t){const n=t.getFilters().map(s=>Fm(s));return n.length===1?n[0]:{compositeFilter:{op:$A(t.op),filters:n}}}(r):$(54877,{filter:r})}function YA(r){const e=[];return r.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function Lm(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}function km(r){return!!r&&typeof r._toProto=="function"&&r._protoValueType==="ProtoValue"}function So(r,e){const t={fields:{}};return e.forEach((n,s)=>{if(typeof s!="string")throw new Error(`Cannot encode map with non-string key: ${s}`);t.fields[s]=n._toProto(r)}),{mapValue:t}}function xm(r){return{stringValue:r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nc(r){return new HA(r,!0)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ft{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Ft(Fe.fromBase64String(e))}catch(t){throw new G(N.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Ft(Fe.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Ft._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if($o(e,Ft._jsonSchema))return Ft.fromBase64String(e.bytes)}}Ft._jsonSchemaVersion="firestore/bytes/1.0",Ft._jsonSchema={type:je("string",Ft._jsonSchemaVersion),bytes:je("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mi{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new G(N.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Qe(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}function XA(){return new mi(Zt)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _s{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cn{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new G(N.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new G(N.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return ie(this._lat,e._lat)||ie(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:cn._jsonSchemaVersion}}static fromJSON(e){if($o(e,cn._jsonSchema))return new cn(e.latitude,e.longitude)}}cn._jsonSchemaVersion="firestore/geoPoint/1.0",cn._jsonSchema={type:je("string",cn._jsonSchemaVersion),latitude:je("number"),longitude:je("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ct{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}ct.UNAUTHENTICATED=new ct(null),ct.GOOGLE_CREDENTIALS=new ct("google-credentials-uid"),ct.FIRST_PARTY=new ct("first-party-uid"),ct.MOCK_USER=new ct("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jt{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ZA{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class eR{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(ct.UNAUTHENTICATED))}shutdown(){}}class tR{constructor(e){this.De=e,this.currentUser=ct.UNAUTHENTICATED,this.xe=0,this.forceRefresh=!1,this.auth=null}start(e,t){H(this.Ce===void 0,42304);let n=this.xe;const s=u=>this.xe!==n?(n=this.xe,t(u)):Promise.resolve();let i=new Jt;this.Ce=()=>{this.xe++,this.currentUser=this.Fe(),i.resolve(),i=new Jt,e.enqueueRetryable(()=>s(this.currentUser))};const o=()=>{const u=i;e.enqueueRetryable(async()=>{await u.promise,await s(this.currentUser)})},a=u=>{U("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.Ce&&(this.auth.addAuthTokenListener(this.Ce),o())};this.De.onInit(u=>a(u)),setTimeout(()=>{if(!this.auth){const u=this.De.getImmediate({optional:!0});u?a(u):(U("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Jt)}},0),o()}getToken(){const e=this.xe,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(n=>this.xe!==e?(U("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(H(typeof n.accessToken=="string",31837,{Oe:n}),new ZA(n.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.Ce&&this.auth.removeAuthTokenListener(this.Ce),this.Ce=void 0}Fe(){const e=this.auth&&this.auth.getUid();return H(e===null||typeof e=="string",2055,{Me:e}),new ct(e)}}class nR{constructor(e,t,n){this.Ne=e,this.Le=t,this.Be=n,this.type="FirstParty",this.user=ct.FIRST_PARTY,this.Ue=new Map}ke(){return this.Be?this.Be():null}get headers(){this.Ue.set("X-Goog-AuthUser",this.Ne);const e=this.ke();return e&&this.Ue.set("Authorization",e),this.Le&&this.Ue.set("X-Goog-Iam-Authorization-Token",this.Le),this.Ue}}class rR{constructor(e,t,n){this.Ne=e,this.Le=t,this.Be=n}getToken(){return Promise.resolve(new nR(this.Ne,this.Le,this.Be))}start(e,t){e.enqueueRetryable(()=>t(ct.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class DC{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class sR{constructor(e,t){this.qe=t,this.forceRefresh=!1,this.appCheck=null,this.$e=null,this.Ke=null,qe(e)&&e.settings.appCheckToken&&(this.Ke=e.settings.appCheckToken)}start(e,t){H(this.Ce===void 0,3512);const n=i=>{i.error!=null&&U("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.$e;return this.$e=i.token,U("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(i.token):Promise.resolve()};this.Ce=i=>{e.enqueueRetryable(()=>n(i))};const s=i=>{U("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.Ce&&this.appCheck.addTokenListener(this.Ce)};this.qe.onInit(i=>s(i)),setTimeout(()=>{if(!this.appCheck){const i=this.qe.getImmediate({optional:!0});i?s(i):U("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.Ke)return Promise.resolve(new DC(this.Ke));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(H(typeof t.token=="string",44558,{tokenResult:t}),this.$e=t.token,new DC(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.Ce&&this.appCheck.removeTokenListener(this.Ce),this.Ce=void 0}}function Vm(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iR{Qe(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yC="ConnectivityMonitor";class wC{constructor(){this.We=()=>this.Ge(),this.ze=()=>this.je(),this.He=[],this.Je()}Qe(e){this.He.push(e)}shutdown(){window.removeEventListener("online",this.We),window.removeEventListener("offline",this.ze)}Je(){window.addEventListener("online",this.We),window.addEventListener("offline",this.ze)}Ge(){U(yC,"Network connectivity changed: AVAILABLE");for(const e of this.He)e(0)}je(){U(yC,"Network connectivity changed: UNAVAILABLE");for(const e of this.He)e(1)}static Ye(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ka=null;function HB(){return ka===null?ka=function(){return 268435456+Math.round(2147483648*Math.random())}():ka++,"0x"+ka.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uB="RestConnection",oR={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class aR{get Ze(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Xe=t+"://"+e.host,this.et=`projects/${n}/databases/${s}`,this.tt=this.databaseId.database===pu?`project_id=${n}`:`project_id=${n}&database_id=${s}`}nt(e,t,n,s,i){const o=HB(),a=this.rt(e,t.toUriEncodedString());U(uB,`Sending RPC '${e}' ${o}:`,a,n);const u={"google-cloud-resource-prefix":this.et,"x-goog-request-params":this.tt};this.it(u,s,i);const{host:B}=new URL(a),l=Cs(B);return this.st(e,a,u,n,l).then(d=>(U(uB,`Received RPC '${e}' ${o}: `,d),d),d=>{throw zt(uB,`RPC '${e}' ${o} failed with error: `,d,"url: ",a,"request:",n),d})}_t(e,t,n,s,i,o){return this.nt(e,t,n,s,i)}it(e,t,n){if(e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+fi}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((s,i)=>e[i]=s),n&&n.headers.forEach((s,i)=>e[i]=s),this.databaseInfo._customHeaders)for(const s of Object.keys(this.databaseInfo._customHeaders))e[s]=this.databaseInfo._customHeaders[s]}rt(e,t){const n=oR[e];let s=`${this.Xe}/v1/${t}:${n}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uR{constructor(e){this.ot=e.ot,this.ut=e.ut}ct(e){this.lt=e}Et(e){this.ht=e}Tt(e){this.Pt=e}onMessage(e){this.It=e}close(){this.ut()}send(e){this.ot(e)}Rt(){this.lt()}At(){this.ht()}Vt(e){this.Pt(e)}dt(e){this.It(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ut="WebChannelConnection",qi=(r,e,t)=>{r.listen(e,n=>{try{t(n)}catch(s){setTimeout(()=>{throw s},0)}})};class Qs extends aR{constructor(e){super(e),this.ft=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static gt(){if(!Qs.yt){const e=Og();qi(e,Ng.STAT_EVENT,t=>{t.stat===AB.PROXY?U(ut,"STAT_EVENT: detected buffering proxy"):t.stat===AB.NOPROXY&&U(ut,"STAT_EVENT: detected no buffering proxy")}),Qs.yt=!0}}st(e,t,n,s,i){const o=HB();return new Promise((a,u)=>{const B=new bg;B.setWithCredentials(!0),B.listenOnce(Sg.COMPLETE,()=>{try{switch(B.getLastErrorCode()){case $a.NO_ERROR:const d=B.getResponseJson();U(ut,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(d)),a(d);break;case $a.TIMEOUT:U(ut,`RPC '${e}' ${o} timed out`),u(new G(N.DEADLINE_EXCEEDED,"Request time out"));break;case $a.HTTP_ERROR:const C=B.getStatus();if(U(ut,`RPC '${e}' ${o} failed with status:`,C,"response text:",B.getResponseText()),C>0){let m=B.getResponseJson();Array.isArray(m)&&(m=m[0]);const y=m==null?void 0:m.error;if(y&&y.status&&y.message){const O=function(z){const Z=z.toLowerCase().replace(/_/g,"-");return Object.values(N).indexOf(Z)>=0?Z:N.UNKNOWN}(y.status);u(new G(O,y.message))}else u(new G(N.UNKNOWN,"Server responded with status "+B.getStatus()))}else u(new G(N.UNAVAILABLE,"Connection failed."));break;default:$(9055,{wt:e,streamId:o,bt:B.getLastErrorCode(),St:B.getLastError()})}}finally{U(ut,`RPC '${e}' ${o} completed.`)}});const l=JSON.stringify(s);U(ut,`RPC '${e}' ${o} sending request:`,s),B.send(t,"POST",l,n,15)})}vt(e,t,n){const s=HB(),i=[this.Xe,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=this.createWebChannelTransport(),a={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(a.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(a.useFetchStreams=!0),this.it(a.initMessageHeaders,t,n),a.encodeInitMessageHeaders=!0;const B=i.join("");U(ut,`Creating RPC '${e}' stream ${s}: ${B}`,a);const l=o.createWebChannel(B,a);this.Dt(l);let d=!1,C=!1;const m=new uR({ot:y=>{C?U(ut,`Not sending because RPC '${e}' stream ${s} is closed:`,y):(d||(U(ut,`Opening RPC '${e}' stream ${s} transport.`),l.open(),d=!0),U(ut,`RPC '${e}' stream ${s} sending:`,y),l.send(y))},ut:()=>l.close()});return qi(l,Xi.EventType.OPEN,()=>{C||(U(ut,`RPC '${e}' stream ${s} transport opened.`),m.Rt())}),qi(l,Xi.EventType.CLOSE,()=>{C||(C=!0,U(ut,`RPC '${e}' stream ${s} transport closed`),m.Vt(),this.xt(l))}),qi(l,Xi.EventType.ERROR,y=>{C||(C=!0,zt(ut,`RPC '${e}' stream ${s} transport errored. Name:`,y.name,"Message:",y.message),m.Vt(new G(N.UNAVAILABLE,"The operation could not be completed")))}),qi(l,Xi.EventType.MESSAGE,y=>{var O;if(!C){const V=y.data[0];H(!!V,16349);const z=V,Z=(z==null?void 0:z.error)||((O=z[0])==null?void 0:O.error);if(Z){U(ut,`RPC '${e}' stream ${s} received error:`,Z);const ne=Z.status;let oe=function(w){const E=Ge[w];if(E!==void 0)return mm(E)}(ne),Be=Z.message;ne==="NOT_FOUND"&&Be.includes("database")&&Be.includes("does not exist")&&Be.includes(this.databaseId.database)&&zt(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),oe===void 0&&(oe=N.INTERNAL,Be="Unknown error status: "+ne+" with message "+Z.message),C=!0,m.Vt(new G(oe,Be)),l.close()}else U(ut,`RPC '${e}' stream ${s} received:`,V),m.dt(V)}}),Qs.gt(),setTimeout(()=>{m.At()},0),m}terminate(){this.ft.forEach(e=>e.close()),this.ft=[]}Dt(e){this.ft.push(e)}xt(e){this.ft=this.ft.filter(t=>t===e)}it(e,t,n){super.it(e,t,n),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return Fg()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cR(r){return new Qs(r)}Qs.yt=!1;class xl{constructor(e,t,n=1e3,s=1.5,i=6e4){this.Ct=e,this.timerId=t,this.Ft=n,this.Ot=s,this.Mt=i,this.Nt=0,this.Lt=null,this.Bt=Date.now(),this.reset()}reset(){this.Nt=0}Ut(){this.Nt=this.Mt}kt(e){this.cancel();const t=Math.floor(this.Nt+this.qt()),n=Math.max(0,Date.now()-this.Bt),s=Math.max(0,t-n);s>0&&U("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Nt} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.Lt=this.Ct.enqueueAfterDelay(this.timerId,s,()=>(this.Bt=Date.now(),e())),this.Nt*=this.Ot,this.Nt<this.Ft&&(this.Nt=this.Ft),this.Nt>this.Mt&&(this.Nt=this.Mt)}$t(){this.Lt!==null&&(this.Lt.skipDelay(),this.Lt=null)}cancel(){this.Lt!==null&&(this.Lt.cancel(),this.Lt=null)}qt(){return(Math.random()-.5)*this.Nt}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TC="PersistentStream";class Mm{constructor(e,t,n,s,i,o,a,u){this.Ct=e,this.Kt=n,this.Qt=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=a,this.listener=u,this.state=0,this.Wt=0,this.Gt=null,this.zt=null,this.stream=null,this.jt=0,this.Ht=new xl(e,t)}Jt(){return this.state===1||this.state===5||this.Yt()}Yt(){return this.state===2||this.state===3}start(){this.jt=0,this.state!==4?this.auth():this.Zt()}async stop(){this.Jt()&&await this.close(0)}Xt(){this.state=0,this.Ht.reset()}en(){this.Yt()&&this.Gt===null&&(this.Gt=this.Ct.enqueueAfterDelay(this.Kt,6e4,()=>this.tn()))}nn(e){this.rn(),this.stream.send(e)}async tn(){if(this.Yt())return this.close(0)}rn(){this.Gt&&(this.Gt.cancel(),this.Gt=null)}sn(){this.zt&&(this.zt.cancel(),this.zt=null)}async close(e,t){this.rn(),this.sn(),this.Ht.cancel(),this.Wt++,e!==4?this.Ht.reset():t&&t.code===N.RESOURCE_EXHAUSTED?(Me(t.toString()),Me("Using maximum backoff delay to prevent overloading the backend."),this.Ht.Ut()):t&&t.code===N.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this._n(),this.stream.close(),this.stream=null),this.state=e,await this.listener.Tt(t)}_n(){}auth(){this.state=1;const e=this.an(this.Wt),t=this.Wt;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([n,s])=>{this.Wt===t&&this.un(n,s)},n=>{e(()=>{const s=new G(N.UNKNOWN,"Fetching auth token failed: "+n.message);return this.cn(s)})})}un(e,t){const n=this.an(this.Wt);this.stream=this.En(e,t),this.stream.ct(()=>{n(()=>this.listener.ct())}),this.stream.Et(()=>{n(()=>(this.state=2,this.zt=this.Ct.enqueueAfterDelay(this.Qt,1e4,()=>(this.Yt()&&(this.state=3),Promise.resolve())),this.listener.Et()))}),this.stream.Tt(s=>{n(()=>this.cn(s))}),this.stream.onMessage(s=>{n(()=>++this.jt==1?this.hn(s):this.onNext(s))})}Zt(){this.state=5,this.Ht.kt(async()=>{this.state=0,this.start()})}cn(e){return U(TC,`close with error: ${e}`),this.stream=null,this.close(4,e)}an(e){return t=>{this.Ct.enqueueAndForget(()=>this.Wt===e?t():(U(TC,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class BR extends Mm{constructor(e,t,n,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}En(e,t){return this.connection.vt("Listen",e,t)}hn(e){return this.onNext(e)}onNext(e){this.Ht.reset();const t=KA(this.serializer,e),n=function(i){if(!("targetChange"in i))return ee.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?ee.min():o.readTime?rt(o.readTime):ee.min()}(e);return this.listener.Tn(t,n)}Pn(e){const t={};t.database=GB(this.serializer),t.addTarget=function(i,o){let a;const u=o.target;if(a=mn(u)?{pipelineQuery:Nm(i,u)}:bl(u)?{documents:Pm(i,u)}:{query:bm(i,u).Se},a.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){a.resumeToken=wm(i,o.resumeToken);const B=VB(i,o.expectedCount);B!==null&&(a.expectedCount=B)}else if(o.snapshotVersion.compareTo(ee.min())>0){a.readTime=$r(i,o.snapshotVersion.toTimestamp());const B=VB(i,o.expectedCount);B!==null&&(a.expectedCount=B)}return a}(this.serializer,e);const n=zA(this.serializer,e);n&&(t.labels=n),this.nn(t)}In(e){const t={};t.database=GB(this.serializer),t.removeTarget=e,this.nn(t)}}class lR extends Mm{constructor(e,t,n,s,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}get Rn(){return this.jt>0}start(){this.lastStreamToken=void 0,super.start()}_n(){this.Rn&&this.An([])}En(e,t){return this.connection.vt("Write",e,t)}hn(e){return H(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,H(!e.writeResults||e.writeResults.length===0,55816),this.listener.Vn()}onNext(e){H(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.Ht.reset();const t=JA(e.writeResults,e.commitTime),n=rt(e.commitTime);return this.listener.dn(n,t)}fn(){const e={};e.database=GB(this.serializer),this.nn(e)}An(e){const t={streamToken:this.lastStreamToken,writes:e.map(n=>bo(this.serializer,n))};this.nn(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hR{}class dR extends hR{constructor(e,t,n,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=s,this.mn=!1}pn(){if(this.mn)throw new G(N.FAILED_PRECONDITION,"The client has already been terminated.")}nt(e,t,n,s){return this.pn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,o])=>this.connection.nt(e,MB(t,n),s,i,o)).catch(i=>{throw i.name==="FirebaseError"?(i.code===N.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new G(N.UNKNOWN,i.toString())})}_t(e,t,n,s,i){return this.pn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection._t(e,MB(t,n),s,o,a,i)).catch(o=>{throw o.name==="FirebaseError"?(o.code===N.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new G(N.UNKNOWN,o.toString())})}terminate(){this.mn=!0,this.connection.terminate()}}function fR(r,e,t,n){return new dR(r,e,t,n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const CR="ComponentProvider",AC=new Map;function pR(r,e,t,n,s){return new oA(r,e,t,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,Vm(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,n,s._customHeaders,s.grpcFlowControlWindow)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const RC={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Gm=41943040;class Bt{static withCacheSize(e){return new Bt(e,Bt.DEFAULT_COLLECTION_PERCENTILE,Bt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}Bt.DEFAULT_COLLECTION_PERCENTILE=10,Bt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Bt.DEFAULT=new Bt(Gm,Bt.DEFAULT_COLLECTION_PERCENTILE,Bt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Bt.DISABLED=new Bt(-1,0,0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tt{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this.gn(n),this.yn=n=>t.writeSequenceNumber(n))}gn(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.yn&&this.yn(e),e}}Tt.wn=-1;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Um="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Hm{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Tr(r){if(r.code!==N.FAILED_PRECONDITION||r.message!==Um)throw r;U("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class P{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&$(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new P((n,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(n,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(n,s)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof P?t:P.resolve(t)}catch(t){return P.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):P.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):P.reject(t)}static resolve(e){return new P((t,n)=>{t(e)})}static reject(e){return new P((t,n)=>{n(e)})}static waitFor(e){return new P((t,n)=>{let s=0,i=0,o=!1;e.forEach(a=>{++s,a.next(()=>{++i,o&&i===s&&t()},u=>n(u))}),o=!0,i===s&&t()})}static or(e){let t=P.resolve(!1);for(const n of e)t=t.next(s=>s?P.resolve(s):n());return t}static forEach(e,t){const n=[];return e.forEach((s,i)=>{n.push(t.call(this,s,i))}),this.waitFor(n)}static mapArray(e,t){return new P((n,s)=>{const i=e.length,o=new Array(i);let a=0;for(let u=0;u<i;u++){const B=u;t(e[B]).next(l=>{o[B]=l,++a,a===i&&n(o)},l=>s(l))}})}static doWhile(e,t){return new P((n,s)=>{const i=()=>{e()===!0?t().next(()=>{i()},s):n()};i()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ot="SimpleDb";class rc{static open(e,t,n,s){try{return new rc(t,e.transaction(s,n))}catch(i){throw new lo(t,i)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.bn=new Jt,this.transaction.oncomplete=()=>{this.bn.resolve()},this.transaction.onabort=()=>{t.error?this.bn.reject(new lo(e,t.error)):this.bn.resolve()},this.transaction.onerror=n=>{const s=Vl(n.target.error);this.bn.reject(new lo(e,s))}}get Sn(){return this.bn.promise}abort(e){e&&this.bn.reject(e),this.aborted||(U(Ot,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}vn(){const e=this.transaction;this.aborted||typeof e.commit!="function"||e.commit()}store(e){const t=this.transaction.objectStore(e);return new mR(t)}}class lr{static delete(e){return U(Ot,"Removing database:",e),Mr(Ap().indexedDB.deleteDatabase(e)).toPromise()}static Ye(){if(!Fp())return!1;if(lr.Dn())return!0;const e=We(),t=lr.xn(e),n=0<t&&t<10,s=qm(e),i=0<s&&s<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||i)}static Dn(){var e;return typeof process<"u"&&((e=process.__PRIVATE_env)==null?void 0:e.__PRIVATE_USE_MOCK_PERSISTENCE)==="YES"}static Cn(e,t){return e.store(t)}static xn(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}constructor(e,t,n){this.name=e,this.version=t,this.Fn=n,this.On=null,lr.xn(We())===12.2&&Me("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async Mn(e){return this.db||(U(Ot,"Opening database:",this.name),this.db=await new Promise((t,n)=>{const s=indexedDB.open(this.name,this.version);s.onsuccess=i=>{const o=i.target.result;t(o)},s.onblocked=()=>{n(new lo(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},s.onerror=i=>{const o=i.target.error;o.name==="VersionError"?n(new G(N.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):o.name==="InvalidStateError"?n(new G(N.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+o)):n(new lo(e,o))},s.onupgradeneeded=i=>{U(Ot,'Database "'+this.name+'" requires upgrade from version:',i.oldVersion);const o=i.target.result;this.Fn.Nn(o,s.transaction,i.oldVersion,this.version).next(()=>{U(Ot,"Database upgrade to version "+this.version+" complete")})}})),this.Ln&&(this.db.onversionchange=t=>this.Ln(t)),this.db}Bn(e){this.Ln=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,s){const i=t==="readonly";let o=0;for(;;){++o;try{this.db=await this.Mn(e);const a=rc.open(this.db,e,i?"readonly":"readwrite",n),u=s(a).next(B=>(a.vn(),B)).catch(B=>(a.abort(B),P.reject(B))).toPromise();return u.catch(()=>{}),await a.Sn,u}catch(a){const u=a,B=u.name!=="FirebaseError"&&o<3;if(U(Ot,"Transaction failed with error:",u.message,"Retrying:",B),this.close(),!B)return Promise.reject(u)}}}close(){this.db&&this.db.close(),this.db=void 0}}function qm(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}class gR{constructor(e){this.Un=e,this.kn=!1,this.qn=null}get isDone(){return this.kn}get $n(){return this.qn}set cursor(e){this.Un=e}done(){this.kn=!0}Kn(e){this.qn=e}delete(){return Mr(this.Un.delete())}}class lo extends G{constructor(e,t){super(N.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function Ar(r){return r.name==="IndexedDbTransactionError"}class mR{constructor(e){this.store=e}put(e,t){let n;return t!==void 0?(U(Ot,"PUT",this.store.name,e,t),n=this.store.put(t,e)):(U(Ot,"PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),Mr(n)}add(e){return U(Ot,"ADD",this.store.name,e,e),Mr(this.store.add(e))}get(e){return Mr(this.store.get(e)).next(t=>(t===void 0&&(t=null),U(Ot,"GET",this.store.name,e,t),t))}delete(e){return U(Ot,"DELETE",this.store.name,e),Mr(this.store.delete(e))}count(){return U(Ot,"COUNT",this.store.name),Mr(this.store.count())}Qn(e,t){const n=this.options(e,t),s=n.index?this.store.index(n.index):this.store;if(typeof s.getAll=="function"){const i=s.getAll(n.range);return new P((o,a)=>{i.onerror=u=>{a(u.target.error)},i.onsuccess=u=>{o(u.target.result)}})}{const i=this.cursor(n),o=[];return this.Wn(i,(a,u)=>{o.push(u)}).next(()=>o)}}Gn(e,t){const n=this.store.getAll(e,t===null?void 0:t);return new P((s,i)=>{n.onerror=o=>{i(o.target.error)},n.onsuccess=o=>{s(o.target.result)}})}zn(e,t){U(Ot,"DELETE ALL",this.store.name);const n=this.options(e,t);n.jn=!1;const s=this.cursor(n);return this.Wn(s,(i,o,a)=>a.delete())}Hn(e,t){let n;t?n=e:(n={},t=e);const s=this.cursor(n);return this.Wn(s,t)}Jn(e){const t=this.cursor({});return new P((n,s)=>{t.onerror=i=>{const o=Vl(i.target.error);s(o)},t.onsuccess=i=>{const o=i.target.result;o?e(o.primaryKey,o.value).next(a=>{a?o.continue():n()}):n()}})}Wn(e,t){const n=[];return new P((s,i)=>{e.onerror=o=>{i(o.target.error)},e.onsuccess=o=>{const a=o.target.result;if(!a)return void s();const u=new gR(a),B=t(a.primaryKey,a.value,u);if(B instanceof P){const l=B.catch(d=>(u.done(),P.reject(d)));n.push(l)}u.isDone?s():u.$n===null?a.continue():a.continue(u.$n)}}).next(()=>P.waitFor(n))}options(e,t){let n;return e!==void 0&&(typeof e=="string"?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.jn?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function Mr(r){return new P((e,t)=>{r.onsuccess=n=>{const s=n.target.result;e(s)},r.onerror=n=>{const s=Vl(n.target.error);t(s)}})}let vC=!1;function Vl(r){const e=lr.xn(We());if(e>=12.2&&e<13){const t="An internal error was encountered in the Indexed Database server";if(r.message.indexOf(t)>=0){const n=new G("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return vC||(vC=!0,setTimeout(()=>{throw n},0)),n}}return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const PC="LruGarbageCollector",jm=1048576;function bC([r,e],[t,n]){const s=ie(r,t);return s===0?ie(e,n):s}class _R{constructor(e){this.Yn=e,this.buffer=new Ee(bC),this.Zn=0}Xn(){return++this.Zn}er(e){const t=[e,this.Xn()];if(this.buffer.size<this.Yn)this.buffer=this.buffer.add(t);else{const n=this.buffer.last();bC(t,n)<0&&(this.buffer=this.buffer.delete(n).add(t))}}get maxValue(){return this.buffer.last()[0]}}class Km{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.tr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.nr(6e4)}stop(){this.tr&&(this.tr.cancel(),this.tr=null)}get started(){return this.tr!==null}nr(e){U(PC,`Garbage collection scheduled in ${e}ms`),this.tr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.tr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Ar(t)?U(PC,"Ignoring IndexedDB error during garbage collection: ",t):await Tr(t)}await this.nr(3e5)})}}class ER{constructor(e,t){this.rr=e,this.params=t}calculateTargetCount(e,t){return this.rr.ir(e).next(n=>Math.floor(t/100*n))}nthSequenceNumber(e,t){if(t===0)return P.resolve(Tt.wn);const n=new _R(t);return this.rr.forEachTarget(e,s=>n.er(s.sequenceNumber)).next(()=>this.rr.sr(e,s=>n.er(s))).next(()=>n.maxValue)}removeTargets(e,t,n){return this.rr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.rr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(U("LruGarbageCollector","Garbage collection skipped; disabled"),P.resolve(RC)):this.getCacheSize(e).next(n=>n<this.params.cacheSizeCollectionThreshold?(U("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),RC):this._r(e,t))}getCacheSize(e){return this.rr.getCacheSize(e)}_r(e,t){let n,s,i,o,a,u,B;const l=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(d=>(d>this.params.maximumSequenceNumbersToCollect?(U("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${d}`),s=this.params.maximumSequenceNumbersToCollect):s=d,o=Date.now(),this.nthSequenceNumber(e,s))).next(d=>(n=d,a=Date.now(),this.removeTargets(e,n,t))).next(d=>(i=d,u=Date.now(),this.removeOrphanedDocuments(e,n))).next(d=>(B=Date.now(),Vs()<=de.DEBUG&&U("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-l}ms
	Determined least recently used ${s} in `+(a-o)+`ms
	Removed ${i} targets in `+(u-a)+`ms
	Removed ${d} documents in `+(B-u)+`ms
Total Duration: ${B-l}ms`),P.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:d})))}}function Jm(r,e){return new ER(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const IR="firestore.googleapis.com",SC=!0;class NC{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new G(N.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=IR,this.ssl=SC}else this.host=e.host,this.ssl=e.ssl??SC;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e._customHeaders&&(this._customHeaders={...e._customHeaders}),e.cacheSizeBytes===void 0)this.cacheSizeBytes=Gm;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<jm)throw new G(N.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}if(rA("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Vm(e.experimentalLongPollingOptions??{}),function(n){if(n.timeoutSeconds!==void 0){if(isNaN(n.timeoutSeconds))throw new G(N.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (must not be NaN)`);if(n.timeoutSeconds<5)throw new G(N.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (minimum allowed value is 5)`);if(n.timeoutSeconds>30)throw new G(N.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams,e.grpcFlowControlWindow!==void 0){if(typeof e.grpcFlowControlWindow!="number"||e.grpcFlowControlWindow<=0||e.grpcFlowControlWindow>2147483647||!Number.isInteger(e.grpcFlowControlWindow))throw new G(N.INVALID_ARGUMENT,"grpcFlowControlWindow must be a positive integer and cannot exceed 2147483647");this.grpcFlowControlWindow=e.grpcFlowControlWindow}}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(n,s){return n.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams&&this.grpcFlowControlWindow===e.grpcFlowControlWindow&&function(n,s){if(n===s)return!0;if(!n||!s)return!1;const i=Object.keys(n),o=Object.keys(s);if(i.length!==o.length)return!1;for(const a of i)if(n[a]!==s[a])return!1;return!0}(this._customHeaders,e._customHeaders)}}let Ml=class{constructor(e,t,n,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new NC({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new G(N.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new G(N.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new NC(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(n){if(!n)return new eR;switch(n.type){case"firstParty":return new rR(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new G(N.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const n=AC.get(t);n&&(U(CR,"Removing Datastore"),AC.delete(t),n.terminate())}(this),Promise.resolve()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cn{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new Cn(this.firestore,e,this._query)}}class Oe{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new hr(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Oe(this.firestore,e,this._key)}toJSON(){return{type:Oe._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if($o(t,Oe._jsonSchema))return new Oe(e,n||null,new J(he.fromString(t.referencePath)))}}Oe._jsonSchemaVersion="firestore/documentReference/1.0",Oe._jsonSchema={type:je("string",Oe._jsonSchemaVersion),referencePath:je("string")};class hr extends Cn{constructor(e,t,n){super(e,t,ta(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Oe(this.firestore,null,new J(e))}withConverter(e){return new hr(this.firestore,e,this._path)}}function cN(r,e,...t){if(r=ae(r),jg("collection","path",e),r instanceof Ml){const n=he.fromString(e,...t);return tC(n),new hr(r,null,n)}{if(!(r instanceof Oe||r instanceof hr))throw new G(N.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(he.fromString(e,...t));return tC(n),new hr(r.firestore,null,n)}}function DR(r,e,...t){if(r=ae(r),arguments.length===1&&(e=Il.newId()),jg("doc","path",e),r instanceof Ml){const n=he.fromString(e,...t);return eC(n),new Oe(r,null,new J(n))}{if(!(r instanceof Oe||r instanceof hr))throw new G(N.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(he.fromString(e,...t));return eC(n),new Oe(r.firestore,r instanceof hr?r.converter:null,new J(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rt{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(n,s){if(n.length!==s.length)return!1;for(let i=0;i<n.length;++i)if(n[i]!==s[i])return!1;return!0}(this._values,e._values)}toJSON(){return{type:Rt._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if($o(e,Rt._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(t=>typeof t=="number"))return new Rt(e.vectorValues);throw new G(N.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Rt._jsonSchemaVersion="firestore/vectorValue/1.0",Rt._jsonSchema={type:je("string",Rt._jsonSchemaVersion),vectorValues:je("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yR=/^__.*__$/;class wR{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new kn(e,this.data,this.fieldMask,t,this.fieldTransforms):new Ci(e,this.data,t,this.fieldTransforms)}}class zm{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new kn(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Qm(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw $(40011,{dataSource:r})}}class sc{constructor(e,t,n,s,i,o){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=s,i===void 0&&this.validatePath(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new sc({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){var s;const t=(s=this.path)==null?void 0:s.child(e),n=this.contextWith({path:t,arrayElement:!1});return n.validatePathSegment(e),n}childContextForFieldPath(e){var s;const t=(s=this.path)==null?void 0:s.child(e),n=this.contextWith({path:t,arrayElement:!1});return n.validatePath(),n}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return Du(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(e.length===0)throw this.createError("Document fields must not be empty");if(Qm(this.dataSource)&&yR.test(e))throw this.createError('Document fields cannot begin and end with "__"')}}class TR{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||nc(e)}createContext(e,t,n,s=!1){return new sc({dataSource:e,methodName:t,targetDoc:n,path:Qe.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Es(r){const e=r._freezeSettings(),t=nc(r._databaseId);return new TR(r._databaseId,!!e.ignoreUndefinedProperties,t)}function ic(r,e,t,n,s,i={}){const o=r.createContext(i.merge||i.mergeFields?2:0,e,t,s);Jl("Data must be an object, but it was:",o,n);const a=Ym(n,o);let u,B;if(i.merge)u=new wt(o.fieldMask),B=o.fieldTransforms;else if(i.mergeFields){const l=[];for(const d of i.mergeFields){const C=Nn(e,d,t);if(!o.contains(C))throw new G(N.INVALID_ARGUMENT,`Field '${C}' is specified in your field mask but missing from your input data.`);t_(l,C)||l.push(C)}u=new wt(l),B=o.fieldTransforms.filter(d=>u.covers(d.field))}else u=null,B=o.fieldTransforms;return new wR(new tt(a),u,B)}class ra extends _s{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.createError(`${this._methodName}() can only appear at the top level of your update data`):e.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof ra}}function Wm(r,e,t){return new sc({dataSource:3,targetDoc:e.settings.targetDoc,methodName:r._methodName,arrayElement:t},e.databaseId,e.serializer,e.ignoreUndefinedProperties)}class Gl extends _s{_toFieldTransform(e){return new ea(e.path,new Zs)}isEqual(e){return e instanceof Gl}}class Ul extends _s{constructor(e,t){super(e),this.ar=t}_toFieldTransform(e){const t=Wm(this,e,!0),n=this.ar.map(i=>ln(i,t)),s=new cs(n);return new ea(e.path,s)}isEqual(e){return e instanceof Ul&&An(this.ar,e.ar)}}class Hl extends _s{constructor(e,t){super(e),this.ar=t}_toFieldTransform(e){const t=Wm(this,e,!0),n=this.ar.map(i=>ln(i,t)),s=new Bs(n);return new ea(e.path,s)}isEqual(e){return e instanceof Hl&&An(this.ar,e.ar)}}class ql extends _s{constructor(e,t){super(e),this.ur=t}_toFieldTransform(e){const t=new ls(e.serializer,Xu(e.serializer,this.ur));return new ea(e.path,t)}isEqual(e){return e instanceof ql&&(this.ur===e.ur||Number.isNaN(this.ur)&&Number.isNaN(e.ur))}}function jl(r,e,t,n){const s=r.createContext(1,e,t);Jl("Data must be an object, but it was:",s,n);const i=[],o=tt.empty();wr(n,(u,B)=>{const l=e_(e,u,t);B=ae(B);const d=s.childContextForFieldPath(l);if(B instanceof ra)i.push(l);else{const C=ln(B,d);C!=null&&(i.push(l),o.set(l,C))}});const a=new wt(i);return new zm(o,a,s.fieldTransforms)}function Kl(r,e,t,n,s,i){const o=r.createContext(1,e,t),a=[Nn(e,n,t)],u=[s];if(i.length%2!=0)throw new G(N.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let C=0;C<i.length;C+=2)a.push(Nn(e,i[C])),u.push(i[C+1]);const B=[],l=tt.empty();for(let C=a.length-1;C>=0;--C)if(!t_(B,a[C])){const m=a[C];let y=u[C];y=ae(y);const O=o.childContextForFieldPath(m);if(y instanceof ra)B.push(m);else{const V=ln(y,O);V!=null&&(B.push(m),l.set(m,V))}}const d=new wt(B);return new zm(l,d,o.fieldTransforms)}function $m(r,e,t,n=!1){return ln(t,r.createContext(n?4:3,e))}function ln(r,e,t){if(Zm(r=ae(r)))return Jl("Unsupported field value:",e,r),Ym(r,e);if(r instanceof _s)return function(s,i){if(!Qm(i.dataSource))throw i.createError(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.createError(`${s._methodName}() is not currently supported inside arrays`);const o=s._toFieldTransform(i);o&&i.fieldTransforms.push(o)}(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.createError("Nested arrays are not supported");return function(s,i){const o=[];let a=0;for(const u of s){let B=ln(u,i.childContextForArray(a));B==null&&(B={nullValue:"NULL_VALUE"}),o.push(B),a++}return{arrayValue:{values:o}}}(r,e)}return function(s,i,o){if((s=ae(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return Xu(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const a=_e.fromDate(s);return{timestampValue:$r(i.serializer,a)}}if(s instanceof _e){const a=new _e(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:$r(i.serializer,a)}}if(Xm(s)){const a=_e.fromInstant(s),u=new _e(a.seconds,1e3*Math.floor(a.nanoseconds/1e3));return{timestampValue:$r(i.serializer,u)}}if(s instanceof cn)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Ft)return{bytesValue:wm(i.serializer,s._byteString)};if(s instanceof Oe){const a=i.databaseId,u=s.firestore._databaseId;if(!u.isEqual(a))throw i.createError(`Document reference is for database ${u.projectId}/${u.database} but should be for database ${a.projectId}/${a.database}`);return{referenceValue:kl(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof Rt)return function(u,B){const l=u instanceof Rt?u.toArray():u;return{mapValue:{fields:{[Dl]:{stringValue:yl},[os]:{arrayValue:{values:l.map(C=>{if(typeof C!="number")throw B.createError("VectorValues must only contain numeric values.");return Yu(B.serializer,C)})}}}}}}(s,i);if(km(s))return s._toProto(i.serializer);throw i.createError(`Unsupported field value: ${$u(s)}`)}(r,e)}function Ym(r,e){const t={};return qg(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):wr(r,(n,s)=>{const i=ln(s,e.childContextForField(n));i!=null&&(t[n]=i)}),{mapValue:{fields:t}}}function Xm(r){if(typeof r!="object"||r===null)return!1;if(typeof Temporal<"u"&&typeof Temporal.Instant=="function"&&r instanceof Temporal.Instant)return!0;const e=r;return e[Symbol.toStringTag]==="Temporal.Instant"&&typeof e.t=="bigint"}function Zm(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof _e||r instanceof cn||r instanceof Ft||r instanceof Oe||r instanceof _s||r instanceof Rt||Xm(r)||km(r))}function Jl(r,e,t){if(!Zm(t)||!Wo(t)){const n=$u(t);throw n==="an object"?e.createError(r+" a custom object"):e.createError(r+" "+n)}}function Nn(r,e,t){if((e=ae(e))instanceof mi)return e._internalPath;if(typeof e=="string")return e_(r,e);throw Du("Field path arguments must be of type string or ",r,!1,void 0,t)}const AR=new RegExp("[~\\*/\\[\\]]");function e_(r,e,t){if(e.search(AR)>=0)throw Du(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new mi(...e.split("."))._internalPath}catch{throw Du(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function Du(r,e,t,n,s){const i=n&&!n.isEmpty(),o=s!==void 0;let a=`Function ${e}() called with invalid data`;t&&(a+=" (via `toFirestore()`)"),a+=". ";let u="";return(i||o)&&(u+=" (found",i&&(u+=` in field ${n}`),o&&(u+=` in document ${s}`),u+=")"),new G(N.INVALID_ARGUMENT,a+r+u)}function t_(r,e){return r.some(t=>t.isEqual(e))}function n_(r){return typeof r._readUserData=="function"}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ft{constructor(e){this.optionDefinitions=e}_getKnownOptions(e,t){const n=tt.empty();for(const s in this.optionDefinitions)if(this.optionDefinitions.hasOwnProperty(s)){const i=this.optionDefinitions[s];if(s in e){const o=e[s];let a;i.nestedOptions&&Wo(o)?a={mapValue:{fields:new ft(i.nestedOptions).getOptionsProto(t,o)}}:o&&(a=ln(o,t)??void 0),a&&n.set(Qe.fromServerFormat(i.serverName),a)}}return n}getOptionsProto(e,t,n){const s=this._getKnownOptions(t,e);if(n){const i=new Map(nA(n,(o,a)=>[Qe.fromServerFormat(a),o!==void 0?ln(o,e):null]));s.setAll(i)}return s.value.mapValue.fields??{}}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function RR(r){return typeof r=="object"&&r!==null&&!!("nullValue"in r&&(r.nullValue===null||r.nullValue==="NULL_VALUE")||"booleanValue"in r&&(r.booleanValue===null||typeof r.booleanValue=="boolean")||"integerValue"in r&&(r.integerValue===null||typeof r.integerValue=="number"||typeof r.integerValue=="string")||"doubleValue"in r&&(r.doubleValue===null||typeof r.doubleValue=="number")||"timestampValue"in r&&(r.timestampValue===null||function(t){return typeof t=="object"&&t!==null&&"seconds"in t&&(t.seconds===null||typeof t.seconds=="number"||typeof t.seconds=="string")&&"nanos"in t&&(t.nanos===null||typeof t.nanos=="number")}(r.timestampValue))||"stringValue"in r&&(r.stringValue===null||typeof r.stringValue=="string")||"bytesValue"in r&&(r.bytesValue===null||r.bytesValue instanceof Uint8Array)||"referenceValue"in r&&(r.referenceValue===null||typeof r.referenceValue=="string")||"geoPointValue"in r&&(r.geoPointValue===null||function(t){return typeof t=="object"&&t!==null&&"latitude"in t&&(t.latitude===null||typeof t.latitude=="number")&&"longitude"in t&&(t.longitude===null||typeof t.longitude=="number")}(r.geoPointValue))||"arrayValue"in r&&(r.arrayValue===null||function(t){return typeof t=="object"&&t!==null&&!(!("values"in t)||t.values!==null&&!Array.isArray(t.values))}(r.arrayValue))||"mapValue"in r&&(r.mapValue===null||function(t){return typeof t=="object"&&t!==null&&!(!("fields"in t)||t.fields!==null&&!Wo(t.fields))}(r.mapValue))||"fieldReferenceValue"in r&&(r.fieldReferenceValue===null||typeof r.fieldReferenceValue=="string")||"functionValue"in r&&(r.functionValue===null||function(t){return typeof t=="object"&&t!==null&&!(!("name"in t)||t.name!==null&&typeof t.name!="string"||!("args"in t)||t.args!==null&&!Array.isArray(t.args))}(r.functionValue))||"pipelineValue"in r&&(r.pipelineValue===null||function(t){return typeof t=="object"&&t!==null&&!(!("stages"in t)||t.stages!==null&&!Array.isArray(t.stages))}(r.pipelineValue)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function BN(){return new ra("deleteField")}function lN(){return new Gl("serverTimestamp")}function hN(...r){return new Ul("arrayUnion",r)}function dN(...r){return new Hl("arrayRemove",r)}function fN(r){return new ql("increment",r)}function vR(r){return new Rt(r)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function K(r){let e;return r instanceof Is?r:(e=Wo(r)?OR(r):r instanceof Array?FR(r):r_(r,void 0),e)}function cB(r){if(r instanceof Is)return r;if(r instanceof Rt)return No(r);if(Array.isArray(r))return No(vR(r));throw new Error("Unsupported value: "+typeof r)}function zl(r){return uA(r)?nu(r):K(r)}class Is{constructor(){this._protoValueType="ProtoValue"}add(e){return new x("add",[this,K(e)],"add")}asBoolean(){if(this instanceof _r)return this;if(this instanceof ys)return new i_(this);if(this instanceof Ds)return new NR(this);if(this instanceof x)return new s_(this);throw new G("invalid-argument",`Conversion of type ${typeof this} to BooleanExpression not supported.`)}subtract(e){return new x("subtract",[this,K(e)],"subtract")}multiply(e){return new x("multiply",[this,K(e)],"multiply")}divide(e){return new x("divide",[this,K(e)],"divide")}mod(e){return new x("mod",[this,K(e)],"mod")}equal(e){return new x("equal",[this,K(e)],"equal").asBoolean()}notEqual(e){return new x("not_equal",[this,K(e)],"notEqual").asBoolean()}lessThan(e){return new x("less_than",[this,K(e)],"lessThan").asBoolean()}lessThanOrEqual(e){return new x("less_than_or_equal",[this,K(e)],"lessThanOrEqual").asBoolean()}greaterThan(e){return new x("greater_than",[this,K(e)],"greaterThan").asBoolean()}greaterThanOrEqual(e){return new x("greater_than_or_equal",[this,K(e)],"greaterThanOrEqual").asBoolean()}arrayConcat(e,...t){const n=[e,...t].map(s=>K(s));return new x("array_concat",[this,...n],"arrayConcat")}arrayContains(e){return new x("array_contains",[this,K(e)],"arrayContains").asBoolean()}arrayContainsAll(e){const t=Array.isArray(e)?new eo(e.map(K),"arrayContainsAll"):e;return new x("array_contains_all",[this,t],"arrayContainsAll").asBoolean()}arrayContainsAny(e){const t=Array.isArray(e)?new eo(e.map(K),"arrayContainsAny"):e;return new x("array_contains_any",[this,t],"arrayContainsAny").asBoolean()}arrayReverse(){return new x("array_reverse",[this])}arrayLength(){return new x("array_length",[this],"arrayLength")}equalAny(e){const t=Array.isArray(e)?new eo(e.map(K),"equalAny"):e;return new x("equal_any",[this,t],"equalAny").asBoolean()}notEqualAny(e){const t=Array.isArray(e)?new eo(e.map(K),"notEqualAny"):e;return new x("not_equal_any",[this,t],"notEqualAny").asBoolean()}exists(){return new x("exists",[this],"exists").asBoolean()}charLength(){return new x("char_length",[this],"charLength")}like(e){return new x("like",[this,K(e)],"like").asBoolean()}regexContains(e){return new x("regex_contains",[this,K(e)],"regexContains").asBoolean()}regexFind(e){return new x("regex_find",[this,K(e)],"regexFind")}regexFindAll(e){return new x("regex_find_all",[this,K(e)],"regexFindAll")}regexMatch(e){return new x("regex_match",[this,K(e)],"regexMatch").asBoolean()}stringContains(e){return new x("string_contains",[this,K(e)],"stringContains").asBoolean()}startsWith(e){return new x("starts_with",[this,K(e)],"startsWith").asBoolean()}endsWith(e){return new x("ends_with",[this,K(e)],"endsWith").asBoolean()}toLower(){return new x("to_lower",[this],"toLower")}toUpper(){return new x("to_upper",[this],"toUpper")}trim(e){const t=[this];return e&&t.push(K(e)),new x("trim",t,"trim")}ltrim(e){const t=[this];return e&&t.push(K(e)),new x("ltrim",t,"ltrim")}rtrim(e){const t=[this];return e&&t.push(K(e)),new x("rtrim",t,"rtrim")}type(){return new x("type",[this])}isType(e){return new x("is_type",[this,No(e)],"isType").asBoolean()}stringConcat(e,...t){const n=[e,...t].map(K);return new x("string_concat",[this,...n],"stringConcat")}stringIndexOf(e){return new x("string_index_of",[this,K(e)],"stringIndexOf")}stringRepeat(e){return new x("string_repeat",[this,K(e)],"stringRepeat")}stringReplaceAll(e,t){return new x("string_replace_all",[this,K(e),K(t)],"stringReplaceAll")}stringReplaceOne(e,t){return new x("string_replace_one",[this,K(e),K(t)],"stringReplaceOne")}concat(e,...t){const n=[e,...t].map(K);return new x("concat",[this,...n],"concat")}reverse(){return new x("reverse",[this],"reverse")}arrayFilter(e,t){return new x("array_filter",[this,K(e),t],"arrayFilter")}arrayTransform(e,t){return new x("array_transform",[this,K(e),t],"arrayTransform")}arrayTransformWithIndex(e,t,n){return new x("array_transform",[this,K(e),K(t),n],"arrayTransformWithIndex")}arraySlice(e,t){const n=[this,K(e)];return t!==void 0&&n.push(K(t)),new x("array_slice",n,"arraySlice")}arrayFirst(){return new x("array_first",[this],"arrayFirst")}arrayFirstN(e){return new x("array_first_n",[this,K(e)],"arrayFirstN")}arrayLast(){return new x("array_last",[this],"arrayLast")}arrayLastN(e){return new x("array_last_n",[this,K(e)],"arrayLastN")}arrayMaximum(){return new x("maximum",[this],"arrayMaximum")}arrayMaximumN(e){return new x("maximum_n",[this,K(e)],"arrayMaximumN")}arrayMinimum(){return new x("minimum",[this],"arrayMinimum")}arrayMinimumN(e){return new x("minimum_n",[this,K(e)],"arrayMinimumN")}arrayIndexOf(e){return new x("array_index_of",[this,K(e),K("first")],"arrayIndexOf")}arrayLastIndexOf(e){return new x("array_index_of",[this,K(e),K("last")],"arrayLastIndexOf")}arrayIndexOfAll(e){return new x("array_index_of_all",[this,K(e)],"arrayIndexOfAll")}byteLength(){return new x("byte_length",[this],"byteLength")}ceil(){return new x("ceil",[this])}floor(){return new x("floor",[this])}abs(){return new x("abs",[this])}exp(){return new x("exp",[this])}mapGet(e){return new x("map_get",[this,No(e)],"mapGet")}mapSet(e,t,...n){const s=[this,K(e),K(t),...n.map(K)];return new x("map_set",s,"mapSet")}mapKeys(){return new x("map_keys",[this],"mapKeys")}mapValues(){return new x("map_values",[this],"mapValues")}mapEntries(){return new x("map_entries",[this],"mapEntries")}getField(e){return new x("get_field",[this,K(e)],"get_field")}count(){return Nt._create("count",[this],"count")}sum(){return Nt._create("sum",[this],"sum")}average(){return Nt._create("average",[this],"average")}minimum(){return Nt._create("minimum",[this],"minimum")}maximum(){return Nt._create("maximum",[this],"maximum")}first(){return Nt._create("first",[this],"first")}last(){return Nt._create("last",[this],"last")}arrayAgg(){return Nt._create("array_agg",[this],"arrayAgg")}arrayAggDistinct(){return Nt._create("array_agg_distinct",[this],"arrayAggDistinct")}countDistinct(){return Nt._create("count_distinct",[this],"countDistinct")}logicalMaximum(e,...t){const n=[e,...t];return new x("maximum",[this,...n.map(K)],"logicalMaximum")}logicalMinimum(e,...t){const n=[e,...t];return new x("minimum",[this,...n.map(K)],"minimum")}vectorLength(){return new x("vector_length",[this],"vectorLength")}cosineDistance(e){return new x("cosine_distance",[this,cB(e)],"cosineDistance")}dotProduct(e){return new x("dot_product",[this,cB(e)],"dotProduct")}euclideanDistance(e){return new x("euclidean_distance",[this,cB(e)],"euclideanDistance")}unixMicrosToTimestamp(){return new x("unix_micros_to_timestamp",[this],"unixMicrosToTimestamp")}timestampToUnixMicros(){return new x("timestamp_to_unix_micros",[this],"timestampToUnixMicros")}unixMillisToTimestamp(){return new x("unix_millis_to_timestamp",[this],"unixMillisToTimestamp")}timestampToUnixMillis(){return new x("timestamp_to_unix_millis",[this],"timestampToUnixMillis")}unixSecondsToTimestamp(){return new x("unix_seconds_to_timestamp",[this],"unixSecondsToTimestamp")}timestampToUnixSeconds(){return new x("timestamp_to_unix_seconds",[this],"timestampToUnixSeconds")}timestampAdd(e,t){return new x("timestamp_add",[this,K(e),K(t)],"timestampAdd")}timestampSubtract(e,t){return new x("timestamp_subtract",[this,K(e),K(t)],"timestampSubtract")}timestampDiff(e,t){return new x("timestamp_diff",[this,zl(e),K(t)],"timestampDiff")}timestampExtract(e,t){const n=[this,K(e)];return t&&n.push(K(t)),new x("timestamp_extract",n,"timestampExtract")}documentId(){return new x("document_id",[this],"documentId")}parent(){return new x("parent",[this],"parent")}substring(e,t){const n=K(e);return new x("substring",t===void 0?[this,n]:[this,n,K(t)],"substring")}arrayGet(e){return new x("array_get",[this,K(e)],"arrayGet")}isError(){return new x("is_error",[this],"isError").asBoolean()}ifError(e){const t=new x("if_error",[this,K(e)],"ifError");return e instanceof _r?t.asBoolean():t}isAbsent(){return new x("is_absent",[this],"isAbsent").asBoolean()}mapRemove(e){return new x("map_remove",[this,K(e)],"mapRemove")}mapMerge(e,...t){const n=K(e),s=t.map(K);return new x("map_merge",[this,n,...s],"mapMerge")}pow(e){return new x("pow",[this,K(e)])}trunc(e){return e===void 0?new x("trunc",[this]):new x("trunc",[this,K(e)],"trunc")}round(e){return e===void 0?new x("round",[this]):new x("round",[this,K(e)],"round")}collectionId(){return new x("collection_id",[this])}length(){return new x("length",[this])}ln(){return new x("ln",[this])}sqrt(){return new x("sqrt",[this])}stringReverse(){return new x("string_reverse",[this])}ifAbsent(e){return new x("if_absent",[this,K(e)],"ifAbsent")}ifNull(e){return new x("if_null",[this,K(e)],"ifNull")}coalesce(e,...t){return new x("coalesce",[this,K(e),...t.map(K)],"coalesce")}join(e){return new x("join",[this,K(e)],"join")}log10(){return new x("log10",[this])}arraySum(){return new x("sum",[this])}split(e){return new x("split",[this,K(e)])}timestampTruncate(e,t){const n=[this,K(e)];return t&&n.push(K(t)),new x("timestamp_trunc",n)}ascending(){return LR(this)}descending(){return kR(this)}as(e){return new bR(this,e,"as")}}class Nt{constructor(e,t){this.name=e,this.params=t,this.exprType="AggregateFunction",this._protoValueType="ProtoValue"}static _create(e,t,n){const s=new Nt(e,t);return s._methodName=n,s}as(e){return new PR(this,e,"as")}_toProto(e){return{functionValue:{name:this.name,args:this.params.map(t=>t._toProto(e))}}}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach(t=>t._readUserData(e))}}class PR{constructor(e,t,n){this.aggregate=e,this.alias=t,this._methodName=n}_readUserData(e){this.aggregate._readUserData(e)}}class bR{constructor(e,t,n){this.expr=e,this.alias=t,this._methodName=n,this.exprType="AliasedExpression",this.selectable=!0}_readUserData(e){this.expr._readUserData(e)}}class eo extends Is{constructor(e,t){super(),this.cr=e,this._methodName=t,this.expressionType="ListOfExpressions"}_toProto(e){return{arrayValue:{values:this.cr.map(t=>t._toProto(e))}}}_readUserData(e){this.cr.forEach(t=>t._readUserData(e))}}class Ds extends Is{constructor(e,t){super(),this.fieldPath=e,this._methodName=t,this.expressionType="Field",this.selectable=!0}get _fieldPath(){return this.fieldPath}get fieldName(){return this.fieldPath.canonicalString()}get alias(){return this.fieldName}get expr(){return this}geoDistance(e){return new x("geo_distance",[this,K(e)],"geoDistance")}_toProto(e){return{fieldReferenceValue:this.fieldPath.canonicalString()}}_readUserData(e){}}function nu(r){return SR(r,"field")}function SR(r,e){return new Ds(typeof r=="string"?Zt===r?XA()._internalPath:Nn("field",r):r._internalPath,e)}class ys extends Is{constructor(e,t){super(),this.value=e,this._methodName=t,this.expressionType="Constant"}static _fromProto(e){const t=new ys(e,void 0);return t._protoValue=e,t}_toProto(e){return H(this._protoValue!==void 0,237),this._protoValue}_getValue(){return this._protoValue}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,RR(this._protoValue)||(this._protoValue=ln(this.value,e))}}function No(r,e){return r_(r,"constant")}function r_(r,e){const t=new ys(r,e);return typeof r=="boolean"?new i_(t):t}class x extends Is{constructor(e,t,n,s){super(),this.name=e,this.params=t,this.expressionType="Function",this._optionsProto=void 0,n!==void 0&&(this._methodName=n),s!==void 0&&(this._options=s)}get _optionsUtil(){return new ft({})}_toProto(e){const t={functionValue:{name:this.name,args:this.params.map(n=>n._toProto(e))}};return this._optionsProto&&(t.functionValue.options=this._optionsProto),t}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach(t=>t._readUserData(e)),this._options&&(this._optionsProto=this._optionsUtil.getOptionsProto(e,this._options))}}class _r extends Is{get _methodName(){return this._expr._methodName}countIf(){return Nt._create("count_if",[this],"countIf")}not(){return new x("not",[this],"not").asBoolean()}conditional(e,t){return new x("conditional",[this,e,t],"conditional")}ifError(e){const t=K(e),n=new x("if_error",[this,t],"ifError");return t instanceof _r?n.asBoolean():n}_toProto(e){return this._expr._toProto(e)}_readUserData(e){this._expr._readUserData(e)}}class s_ extends _r{constructor(e){super(),this._expr=e,this.expressionType="Function"}}class i_ extends _r{constructor(e){super(),this._expr=e,this.expressionType="Constant"}_getValue(){return this._expr._getValue()}}class NR extends _r{constructor(e){super(),this._expr=e,this.expressionType="Field"}}function OR(r,e){const t=[];for(const n in r)if(Object.prototype.hasOwnProperty.call(r,n)){const s=r[n];t.push(No(n)),t.push(K(s))}return new x("map",t,"map")}function FR(r){return function(t,n){return new x("array",t.map(s=>K(s)),n)}(r,"array")}function LR(r){return new Ql(zl(r),"ascending","ascending")}function kR(r){return new Ql(zl(r),"descending","descending")}class Ql{constructor(e,t,n){this.expr=e,this.direction=t,this._methodName=n,this._protoValueType="ProtoValue"}_toProto(e){return{mapValue:{fields:{direction:xm(this.direction),expression:this.expr._toProto(e)}}}}_readUserData(e){this.expr._readUserData(e)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mt{constructor(e){this.optionsProto=void 0,{rawOptions:this.rawOptions,...this.knownOptions}=e}_readUserData(e){this.optionsProto=this._optionsUtil.getOptionsProto(e,this.knownOptions,this.rawOptions)}_toProto(e){return{name:this._name,options:this.optionsProto}}}class o_ extends Mt{get _name(){return"add_fields"}get _optionsUtil(){return new ft({})}constructor(e,t){super(t),this.fields=e}_toProto(e){return{...super._toProto(e),args:[So(e,this.fields)]}}_readUserData(e){super._readUserData(e),Ir(this.fields,e)}}class a_ extends Mt{get _name(){return"aggregate"}get _optionsUtil(){return new ft({})}constructor(e,t,n){super(n),this.groups=e,this.accumulators=t}_toProto(e){return{...super._toProto(e),args:[So(e,this.accumulators),So(e,this.groups)]}}_readUserData(e){super._readUserData(e),Ir(this.groups,e),Ir(this.accumulators,e)}}class u_ extends Mt{get _name(){return"distinct"}get _optionsUtil(){return new ft({})}constructor(e,t){super(t),this.groups=e}_toProto(e){return{...super._toProto(e),args:[So(e,this.groups)]}}_readUserData(e){super._readUserData(e),Ir(this.groups,e)}}class sa extends Mt{get _name(){return"collection"}get _optionsUtil(){return new ft({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.hr=e.startsWith("/")?e:"/"+e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:this.hr}]}}_readUserData(e){super._readUserData(e)}}class ia extends Mt{get _name(){return"collection_group"}get _optionsUtil(){return new ft({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.collectionId=e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:""},{stringValue:this.collectionId}]}}_readUserData(e){super._readUserData(e)}}class oc extends Mt{get _name(){return"database"}get _optionsUtil(){return new ft({})}_toProto(e){return{...super._toProto(e)}}_readUserData(e){super._readUserData(e)}}class ac extends Mt{get _name(){return"documents"}get _optionsUtil(){return new ft({})}constructor(e,t){if(super(t),!e||e.length===0)throw new G(N.INVALID_ARGUMENT,"Empty document paths are not allowed in DocumentsSource");const n=e.map(i=>i.startsWith("/")?i:"/"+i),s=new Set(n);if(s.size!==n.length)throw new G(N.INVALID_ARGUMENT,"Duplicate document paths are not allowed in DocumentsSource");this.Tr=n,this.Pr=s}_toProto(e){return{...super._toProto(e),args:this.Tr.map(t=>({referenceValue:t}))}}_readUserData(e){super._readUserData(e)}}class oa extends Mt{get _name(){return"where"}get _optionsUtil(){return new ft({})}constructor(e,t){super(t),this.condition=e}_toProto(e){return{...super._toProto(e),args:[this.condition._toProto(e)]}}_readUserData(e){super._readUserData(e),Ir(this.condition,e)}}class Er extends Mt{get _name(){return"limit"}get _optionsUtil(){return new ft({})}constructor(e,t){H(!isNaN(e)&&e!==1/0&&e!==-1/0,34860),super(t),this.limit=e}_toProto(e){return{...super._toProto(e),args:[Xu(e,this.limit)]}}}class OC extends Mt{get _name(){return"offset"}get _optionsUtil(){return new ft({})}constructor(e,t){super(t),this.offset=e}_toProto(e){return{...super._toProto(e),args:[Xu(e,this.offset)]}}}class xR extends Mt{get _name(){return"select"}get _optionsUtil(){return new ft({})}constructor(e,t){super(t),this.selections=e}_toProto(e){return{...super._toProto(e),args:[So(e,this.selections)]}}_readUserData(e){super._readUserData(e),Ir(this.selections,e)}}class tn extends Mt{get _name(){return"sort"}get _optionsUtil(){return new ft({})}constructor(e,t){super(t),this.orderings=e}_toProto(e){return{...super._toProto(e),args:this.orderings.map(t=>t._toProto(e))}}_readUserData(e){super._readUserData(e),Ir(this.orderings,e)}}class Wl extends Mt{get _name(){return"replace_with"}get _optionsUtil(){return new ft({})}constructor(e,t){super(t),this.map=e}_toProto(e){return{...super._toProto(e),args:[this.map._toProto(e),xm(Wl.Ir)]}}_readUserData(e){super._readUserData(e),Ir(this.map,e)}}Wl.Ir="full_replace";function Ir(r,e){return n_(r)?r._readUserData(e):Array.isArray(r)?r.forEach(t=>t._readUserData(e)):r instanceof Map?r.forEach(t=>t._readUserData(e)):Object.values(r).forEach(t=>t._readUserData(e)),r}/**
 * @license
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ho{constructor(e,t,n,s){this._db=e,this.userDataReader=t,this._userDataWriter=n,this.stages=s}Vr(e,t){const n=this.userDataReader.createContext(3,e);return n_(t)?t._readUserData(n):Array.isArray(t)?t.forEach(s=>s._readUserData(n)):t.forEach(s=>s._readUserData(n)),t}where(e){const t=this.stages.map(n=>n);return this.Vr("where",e),t.push(new oa(e,{})),new ho(this._db,this.userDataReader,this._userDataWriter,t)}limit(e){const t=this.stages.map(n=>n);return t.push(new Er(e,{})),new ho(this._db,this.userDataReader,this._userDataWriter,t)}sort(e,...t){const n=this.stages.map(s=>s);return"orderings"in e?n.push(new tn(this.Vr("sort",e.orderings),{})):n.push(new tn(this.Vr("sort",[e,...t]),{})),new ho(this._db,this.userDataReader,this._userDataWriter,n)}dr(e){return{pipeline:{stages:this.stages.map(t=>t._toProto(e))}}}}// Copyright 2024 Google LLC* @license
class lt{constructor(e,t,n){this.serializer=e,this.stages=t,this.listenOptions=n,this.isCorePipeline=!0}getPipelineCollection(){return aa(this)}getPipelineCollectionGroup(){return $l(this)}getPipelineCollectionId(){return c_(this)}getPipelineDocuments(){return yu(this)}getPipelineFlavor(){return function(t){let n="exact";return t.stages.forEach((s,i)=>{s._name!==u_.name&&s._name!==a_.name||(n="keyless"),s._name===xR.name&&n==="exact"&&(n="augmented"),s._name===o_.name&&i<t.stages.length-1&&n==="exact"&&(n="augmented")}),n}(this)}getPipelineSourceType(){return wn(this)}}function wn(r){const e=r.stages[0];return e instanceof sa||e instanceof ia||e instanceof oc||e instanceof ac?e._name:"unknown"}function aa(r){if(wn(r)==="collection")return r.stages[0].hr}function $l(r){if(wn(r)==="collection_group")return r.stages[0].collectionId}function c_(r){switch(wn(r)){case"collection":return he.fromString(aa(r)).lastSegment();case"collection_group":return $l(r);default:return}}function yu(r){if(wn(r)==="documents")return r.stages[0].Tr}class T{constructor(e,t){this.type=e,this.value=t}static mr(){return new T("ERROR",void 0)}static pr(){return new T("UNSET",void 0)}static gr(){return new T("NULL",un)}static newValue(e){return Lt(e)?new T("NULL",un):function(n){return!!n&&"booleanValue"in n}(e)?new T("BOOLEAN",e):en(e)?new T("INT",e):jr(e)?new T("DOUBLE",e):function(n){return!!n&&"timestampValue"in n&&!!n.timestampValue}(e)?new T("TIMESTAMP",e):function(n){return!!n&&"stringValue"in n}(e)?new T("STRING",e):function(n){return!!n&&"bytesValue"in n}(e)?new T("BYTES",e):e.referenceValue?new T("REFERENCE",e):e.geoPointValue?new T("GEO_POINT",e):gr(e)?new T("ARRAY",e):us(e)?new T("VECTOR",e):Wr(e)?new T("MAP",e):new T("ERROR",void 0)}yr(){return this.type==="ERROR"||this.type==="UNSET"}wr(){return this.type==="NULL"}}function fo(r){if(!r.yr())return r.value}function B_(r){return r instanceof _r?r._expr:r}function se(r){if((r=B_(r))instanceof Ds)return new VR(r);if(r instanceof ys)return new MR(r);if(r instanceof eo)return new GR(r);if(r instanceof x){if(r.name==="add")return new qR(r);if(r.name==="subtract")return new jR(r);if(r.name==="multiply")return new KR(r);if(r.name==="divide")return new JR(r);if(r.name==="mod")return new zR(r);if(r.name==="and")return new QR(r);if(r.name==="equal")return new ov(r);if(r.name==="not_equal")return new av(r);if(r.name==="less_than")return new uv(r);if(r.name==="less_than_or_equal")return new cv(r);if(r.name==="greater_than")return new Bv(r);if(r.name==="greater_than_or_equal")return new lv(r);if(r.name==="array_concat")return new hv(r);if(r.name==="array_reverse")return new dv(r);if(r.name==="array_contains")return new fv(r);if(r.name==="array_contains_all")return new Cv(r);if(r.name==="array_contains_any")return new pv(r);if(r.name==="array_length")return new gv(r);if(r.name==="array_element")return new mv(r);if(r.name==="equal_any")return new l_(r);if(r.name==="not_equal_any")return new $R(r);if(r.name==="is_nan")return new YR(r);if(r.name==="is_not_nan")return new XR(r);if(r.name==="is_null")return new ZR(r);if(r.name==="is_not_null")return new ev(r);if(r.name==="is_error")return new tv(r);if(r.name==="exists")return new nv(r);if(r.name==="not")return new uc(r);if(r.name==="or")return new WR(r);if(r.name==="xor")return new Yl(r);if(r.name==="conditional")return new rv(r);if(r.name==="maximum")return new sv(r);if(r.name==="minimum")return new iv(r);if(r.name==="reverse")return new _v(r);if(r.name==="replace_first")return new Ev(r);if(r.name==="replace_all")return new Iv(r);if(r.name==="char_length")return new Dv(r);if(r.name==="byte_length")return new yv(r);if(r.name==="like")return new wv(r);if(r.name==="regex_contains")return new Tv(r);if(r.name==="regex_match")return new Av(r);if(r.name==="string_contains")return new Rv(r);if(r.name==="starts_with")return new vv(r);if(r.name==="ends_with")return new Pv(r);if(r.name==="to_lower")return new bv(r);if(r.name==="to_upper")return new Sv(r);if(r.name==="trim")return new Nv(r);if(r.name==="string_concat")return new Ov(r);if(r.name==="map_get")return new Fv(r);if(r.name==="cosine_distance")return new Lv(r);if(r.name==="dot_product")return new kv(r);if(r.name==="euclidean_distance")return new xv(r);if(r.name==="vector_length")return new Vv(r);if(r.name==="unix_micros_to_timestamp")return new qv(r);if(r.name==="timestamp_to_unix_micros")return new Jv(r);if(r.name==="unix_millis_to_timestamp")return new jv(r);if(r.name==="timestamp_to_unix_millis")return new zv(r);if(r.name==="unix_seconds_to_timestamp")return new Kv(r);if(r.name==="timestamp_to_unix_seconds")return new Qv(r);if(r.name==="timestamp_add")return new Wv(r);if(r.name==="timestamp_subtract")return new $v(r)}throw new Error(`Unknown Expr : ${r}`)}class VR{constructor(e){this.expr=e}evaluate(e,t){if(this.expr.fieldName===Zt)return T.newValue({referenceValue:ni(e.serializer,t.key)});if(this.expr.fieldName==="__update_time__")return T.newValue({timestampValue:tu(e.serializer,t.version)});if(this.expr.fieldName==="__create_time__")return T.newValue({timestampValue:tu(e.serializer,t.createTime)});const n=t.data.field(this.expr._fieldPath);return n?Yo(n)?T.newValue(function(i,o){if(i.serverTimestampBehavior==="estimate")return{timestampValue:tu(i.serializer,ee.fromTimestamp($s(o)))};if(i.serverTimestampBehavior==="previous"){const a=Xo(o);if(a)return a}return{nullValue:"NULL_VALUE"}}(e,n)):T.newValue(n):T.pr()}}class MR{constructor(e){this.expr=e}evaluate(e,t){return T.newValue(this.expr._getValue())}}class GR{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.cr.map(s=>se(s).evaluate(e,t));return n.some(s=>s.yr())?T.mr():T.newValue({arrayValue:{values:n.map(s=>s.value)}})}}function ot(r){return jr(r)?Number(r.doubleValue):Number(r.integerValue)}function hn(r){return BigInt(r.integerValue)}const UR=BigInt("0x7fffffffffffffff"),HR=-BigInt("0x8000000000000000");class ua{constructor(e){this.expr=e}evaluate(e,t){H(this.expr.params.length>=2,24778);const n=se(this.expr.params[0]).evaluate(e,t),s=se(this.expr.params[1]).evaluate(e,t);let i=this.br(n,s);for(const o of this.expr.params.slice(2)){const a=se(o).evaluate(e,t);i=this.br(i,a)}return i}br(e,t){if(e.yr()||t.yr())return T.mr();if(e.wr()||t.wr())return T.gr();const n=e.value,s=t.value;if(!jr(n)&&!en(n)||!jr(s)&&!en(s))return T.mr();if(jr(n)||jr(s)){const i=this.Sr(n,s);return i?T.newValue(i):T.mr()}if(en(n)&&en(s)){const i=this.vr(n,s);return i===void 0?T.mr():typeof i=="number"?T.newValue({doubleValue:i}):i<HR||i>UR?T.mr():T.newValue({integerValue:`${i}`})}return T.mr()}}function On(r,e){return Ke(r)!==Ke(e)?"TYPE_MISMATCH":Pt(r)||Pt(e)?"NOT_EQ":Lt(r)&&Lt(e)?"EQ":Lt(r)||Lt(e)?"NULL":gr(r)&&gr(e)?function(n,s){var o,a,u;if(((o=n.values)==null?void 0:o.length)!==((a=s.values)==null?void 0:a.length))return"NOT_EQ";let i=!1;for(let B=0;B<(((u=n.values)==null?void 0:u.length)??0);B++){const l=n.values[B],d=s.values[B];switch(On(l,d)){case"EQ":break;case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":i=!0;break;default:$(44609,{Dr:l,Cr:d})}}return i?"NULL":"EQ"}(r.arrayValue,e.arrayValue):us(r)&&us(e)||Wr(r)&&Wr(e)?function(n,s){const i=n.fields||{},o=s.fields||{};if(Cu(i)!==Cu(o))return"NOT_EQ";let a=!1;for(const u in i)if(i.hasOwnProperty(u)){if(o[u]===void 0)return"NOT_EQ";switch(On(i[u],o[u])){case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":a=!0}}return a?"NULL":"EQ"}(r.mapValue,e.mapValue):function(n,s){return qt(n,s,{u:!1,i:!0,o:!0})}(r,e)?"EQ":"NOT_EQ"}class qR extends ua{vr(e,t){return hn(e)+hn(t)}Sr(e,t){return{doubleValue:ot(e)+ot(t)}}}class jR extends ua{constructor(e){super(e),this.expr=e}vr(e,t){return hn(e)-hn(t)}Sr(e,t){return{doubleValue:ot(e)-ot(t)}}}class KR extends ua{constructor(e){super(e),this.expr=e}vr(e,t){return hn(e)*hn(t)}Sr(e,t){return{doubleValue:ot(e)*ot(t)}}}class JR extends ua{constructor(e){super(e),this.expr=e}vr(e,t){const n=hn(t);if(n!==BigInt(0))return hn(e)/n}Sr(e,t){const n=ot(t);return n===0?{doubleValue:Ys(n)?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY}:{doubleValue:ot(e)/n}}}class zR extends ua{constructor(e){super(e),this.expr=e}vr(e,t){const n=hn(t);if(n!==BigInt(0))return hn(e)%n}Sr(e,t){const n=ot(t);if(n!==0)return{doubleValue:ot(e)%n}}}class QR{constructor(e){this.expr=e}evaluate(e,t){var i;let n=!1,s=!1;for(const o of this.expr.params){const a=se(o).evaluate(e,t);switch(a.type){case"BOOLEAN":if(!((i=a.value)!=null&&i.booleanValue))return T.newValue(nt);break;case"NULL":s=!0;break;default:n=!0}}return n?T.mr():s?T.gr():T.newValue(vt)}}class uc{constructor(e){this.expr=e}evaluate(e,t){var s;H(this.expr.params.length===1,9634);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"BOOLEAN":return T.newValue({booleanValue:!((s=n.value)!=null&&s.booleanValue)});case"NULL":return T.gr();default:return T.mr()}}}class WR{constructor(e){this.expr=e}evaluate(e,t){var i;let n=!1,s=!1;for(const o of this.expr.params){const a=se(o).evaluate(e,t);switch(a.type){case"BOOLEAN":if((i=a.value)!=null&&i.booleanValue)return T.newValue(vt);break;case"NULL":s=!0;break;default:n=!0}}return n?T.mr():s?T.gr():T.newValue(nt)}}class Yl{constructor(e){this.expr=e}evaluate(e,t){var i;let n=!1,s=!1;for(const o of this.expr.params){const a=se(o).evaluate(e,t);switch(a.type){case"BOOLEAN":n=Yl.xor(n,!!((i=a.value)!=null&&i.booleanValue));break;case"NULL":s=!0;break;default:return T.mr()}}return s?T.gr():T.newValue({booleanValue:n})}static xor(e,t){return(e||t)&&!(e&&t)}}class l_{constructor(e){this.expr=e}evaluate(e,t){var o,a;H(this.expr.params.length===2,55094);let n=!1;const s=se(this.expr.params[0]).evaluate(e,t);switch(s.type){case"NULL":n=!0;break;case"ERROR":case"UNSET":return T.mr()}const i=se(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":n=!0;break;default:return T.mr()}if(n)return T.gr();for(const u of((a=(o=i.value)==null?void 0:o.arrayValue)==null?void 0:a.values)??[])switch(Lt(s.value)&&Lt(u)?"EQ":On(s.value,u)){case"EQ":return T.newValue(vt);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":n=!0;break;default:$(44608,{value:s.value,candidate:u})}return n?T.gr():T.newValue(nt)}}class $R{constructor(e){this.expr=e}evaluate(e,t){return new uc(new x("not",[new x("equal_any",this.expr.params)])).evaluate(e,t)}}class YR{constructor(e){this.expr=e}evaluate(e,t){H(this.expr.params.length===1,23322);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"INT":return T.newValue(nt);case"DOUBLE":return T.newValue({booleanValue:isNaN(ot(n.value))});case"NULL":return T.gr();default:return T.mr()}}}class XR{constructor(e){this.expr=e}evaluate(e,t){return H(this.expr.params.length===1,50406),new uc(new x("not",[new x("is_nan",this.expr.params)])).evaluate(e,t)}}class ZR{constructor(e){this.expr=e}evaluate(e,t){switch(H(this.expr.params.length===1,23123),se(this.expr.params[0]).evaluate(e,t).type){case"NULL":return T.newValue(vt);case"UNSET":case"ERROR":return T.mr();default:return T.newValue(nt)}}}class ev{constructor(e){this.expr=e}evaluate(e,t){return H(this.expr.params.length===1,23167),new uc(new x("not",[new x("is_null",this.expr.params)])).evaluate(e,t)}}class tv{constructor(e){this.expr=e}evaluate(e,t){return H(this.expr.params.length===1,5228),se(this.expr.params[0]).evaluate(e,t).type==="ERROR"?T.newValue(vt):T.newValue(nt)}}class nv{constructor(e){this.expr=e}evaluate(e,t){switch(H(this.expr.params.length===1,6877),se(this.expr.params[0]).evaluate(e,t).type){case"ERROR":return T.mr();case"UNSET":return T.newValue(nt);default:return T.newValue(vt)}}}class rv{constructor(e){this.expr=e}evaluate(e,t){var s;H(this.expr.params.length===3,11706);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"BOOLEAN":return(s=n.value)!=null&&s.booleanValue?se(this.expr.params[1]).evaluate(e,t):se(this.expr.params[2]).evaluate(e,t);case"NULL":return se(this.expr.params[2]).evaluate(e,t);default:return T.mr()}}}class sv{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.params.map(i=>se(i).evaluate(e,t));let s;for(const i of n)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||dt(i.value,s.value)>0?i:s}return s===void 0?T.gr():s}}class iv{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.params.map(i=>se(i).evaluate(e,t));let s;for(const i of n)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||dt(i.value,s.value)<0?i:s}return s===void 0?T.gr():s}}class _i{constructor(e){this.expr=e}evaluate(e,t){H(this.expr.params.length===2,31033,`${this.expr.name}() function should have exactly 2 params`);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"ERROR":case"UNSET":return T.mr()}const s=se(this.expr.params[1]).evaluate(e,t);switch(s.type){case"ERROR":case"UNSET":return T.mr()}return this.Fr(n,s)}}class ov extends _i{constructor(e){super(e),this.expr=e}Fr(e,t){if(e.wr()&&t.wr())return T.newValue(vt);if(e.wr()||t.wr()||Pt(e.value)||Pt(t.value)||Ke(e.value)!==Ke(t.value))return T.newValue(nt);switch(On(e.value,t.value)){case"EQ":return T.newValue(vt);case"NOT_EQ":return T.newValue(nt);case"NULL":return T.gr();default:$(44615,{left:e,right:t})}}}class av extends _i{constructor(e){super(e),this.expr=e}Fr(e,t){switch(On(e.value,t.value)){case"EQ":return T.newValue(nt);case"NOT_EQ":case"TYPE_MISMATCH":return T.newValue(vt);case"NULL":return T.gr();default:$(44614,{left:e,right:t})}}}class uv extends _i{constructor(e){super(e),this.expr=e}Fr(e,t){return Ke(e.value)!==Ke(t.value)||Pt(e.value)||Pt(t.value)?T.newValue(nt):T.newValue({booleanValue:dt(e.value,t.value)<0})}}class cv extends _i{constructor(e){super(e),this.expr=e}Fr(e,t){return Ke(e.value)!==Ke(t.value)||Pt(e.value)||Pt(t.value)?T.newValue(nt):On(e.value,t.value)==="EQ"?T.newValue(vt):T.newValue({booleanValue:dt(e.value,t.value)<0})}}class Bv extends _i{constructor(e){super(e),this.expr=e}Fr(e,t){return Ke(e.value)!==Ke(t.value)||Pt(e.value)||Pt(t.value)?T.newValue(nt):T.newValue({booleanValue:dt(e.value,t.value)>0})}}class lv extends _i{constructor(e){super(e),this.expr=e}Fr(e,t){return Ke(e.value)!==Ke(t.value)||Pt(e.value)||Pt(t.value)?T.newValue(nt):On(e.value,t.value)==="EQ"?T.newValue(vt):T.newValue({booleanValue:dt(e.value,t.value)>0})}}class hv{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class dv{constructor(e){this.expr=e}evaluate(e,t){var s;H(this.expr.params.length===1,216);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return T.gr();case"ARRAY":{const i=((s=n.value.arrayValue)==null?void 0:s.values)??[];return T.newValue({arrayValue:{values:[...i].reverse()}})}default:return T.mr()}}}class fv{constructor(e){this.expr=e}evaluate(e,t){return H(this.expr.params.length===2,52884),new l_(new x("eq_any",[this.expr.params[1],this.expr.params[0]])).evaluate(e,t)}}class Cv{constructor(e){this.expr=e}evaluate(e,t){var u,B,l,d;H(this.expr.params.length===2,1392);let n=!1;const s=se(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":n=!0;break;default:return T.mr()}const i=se(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":n=!0;break;default:return T.mr()}if(n)return T.gr();const o=((B=(u=i.value)==null?void 0:u.arrayValue)==null?void 0:B.values)??[],a=((d=(l=s.value)==null?void 0:l.arrayValue)==null?void 0:d.values)??[];for(const C of o){let m=!1;n=!1;for(const y of a){switch(Lt(C)&&Lt(y)?"EQ":On(C,y)){case"EQ":m=!0;break;case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":n=!0;break;default:$(44613,{value:y,search:C})}if(m)break}if(!m)return T.newValue(nt)}return T.newValue(vt)}}class pv{constructor(e){this.expr=e}evaluate(e,t){var u,B,l,d;H(this.expr.params.length===2,2680);let n=!1;const s=se(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":n=!0;break;default:return T.mr()}const i=se(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":n=!0;break;default:return T.mr()}if(n)return T.gr();const o=((B=(u=i.value)==null?void 0:u.arrayValue)==null?void 0:B.values)??[],a=((d=(l=s.value)==null?void 0:l.arrayValue)==null?void 0:d.values)??[];for(const C of a)for(const m of o)switch(Lt(C)&&Lt(m)?"EQ":On(C,m)){case"EQ":return T.newValue(vt);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":n=!0;break;default:$(60403,{value:C,search:m})}return n?T.gr():T.newValue(nt)}}class gv{constructor(e){this.expr=e}evaluate(e,t){var s,i,o;H(this.expr.params.length===1,38605);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return T.gr();case"ARRAY":return T.newValue({integerValue:`${((o=(i=(s=n.value)==null?void 0:s.arrayValue)==null?void 0:i.values)==null?void 0:o.length)??0}`});default:return T.mr()}}}class mv{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class _v{constructor(e){this.expr=e}evaluate(e,t){var s,i;H(this.expr.params.length===1,1508);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return T.gr();case"BYTES":{const o=(s=n.value)==null?void 0:s.bytesValue;if(typeof o=="string"){const a=Fe.fromBase64String(o).toUint8Array();return a.reverse(),T.newValue({bytesValue:Fe.fromUint8Array(a).toBase64()})}return T.newValue({bytesValue:new Uint8Array(o).reverse()})}case"STRING":{const o=(i=n.value)==null?void 0:i.stringValue,a=new Intl.__PRIVATE_Segmenter(void 0,{granularity:"grapheme"}).segment(o),u=Array.from(a,B=>B.segment).reverse();return T.newValue({stringValue:u.join("")})}default:return T.mr()}}}class Ev{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class Iv{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class Dv{constructor(e){this.expr=e}evaluate(e,t){H(this.expr.params.length===1,19400);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return T.gr();case"STRING":{const s=function(o){let a=0;for(let u=0;u<o.length;u++){const B=o.codePointAt(u);if(B===void 0)return;if(B<=65535)if(B>=55296&&B<=57343)if(B<=56319){const l=o.codePointAt(u+1);l!==void 0&&l>=56320&&l<=57343?(a+=1,u++):a+=1}else a+=1;else a+=1;else{if(!(B<=1114111))return;a+=1,u++}}return a}(n.value.stringValue);return s===void 0?T.mr():T.newValue({integerValue:s})}default:return T.mr()}}}class yv{constructor(e){this.expr=e}evaluate(e,t){var s,i;H(this.expr.params.length===1,8486);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"BYTES":{const o=(s=n.value)==null?void 0:s.bytesValue;return typeof o=="string"?T.newValue({integerValue:Fe.fromBase64String(o).toUint8Array().length}):T.newValue({integerValue:new Uint8Array(o).length})}case"STRING":{const o=function(u){let B=0;for(let l=0;l<u.length;l++){const d=u.codePointAt(l);if(d===void 0)return;if(d>=55296&&d<=57343){if(!(d<=56319))return;{const C=u.codePointAt(l+1);if(C===void 0||!(C>=56320&&C<=57343))return;B+=4,l++}}else if(d<=127)B+=1;else if(d<=2047)B+=2;else if(d<=65535)B+=3;else{if(!(d<=1114111))return;B+=4,l++}}return B}((i=n.value)==null?void 0:i.stringValue);return o===void 0?T.mr():T.newValue({integerValue:o})}case"NULL":return T.gr();default:return T.mr()}}}class Ei{constructor(e){this.expr=e}evaluate(e,t){var o,a;H(this.expr.params.length===2,39773,`${this.expr.name}() function should have exactly two parameters`);let n=!1;const s=se(this.expr.params[0]).evaluate(e,t);switch(s.type){case"STRING":break;case"NULL":n=!0;break;default:return T.mr()}const i=se(this.expr.params[1]).evaluate(e,t);switch(i.type){case"STRING":break;case"NULL":n=!0;break;default:return T.mr()}return n?T.gr():this.Or((o=s.value)==null?void 0:o.stringValue,(a=i.value)==null?void 0:a.stringValue)}}class wv extends Ei{Or(e,t){try{const n=function(o){let a="";for(let u=0;u<o.length;u++){const B=o.charAt(u);switch(B){case"_":a+=".";break;case"%":a+=".*";break;case"\\":case".":case"*":case"?":case"+":case"^":case"$":case"|":case"(":case")":case"[":case"]":case"{":case"}":a+="\\"+B;break;default:a+=B}}return"^"+a+"$"}(t),s=_l.compile(n);return T.newValue({booleanValue:s.matches(e)})}catch(n){return zt(`Invalid LIKE pattern converted to regex: ${t}, returning error. Error: ${n}`),T.mr()}}}class Tv extends Ei{Or(e,t){try{const n=_l.compile(t);return T.newValue({booleanValue:n.test(e)})}catch{return zt(`Invalid regex pattern found in regex_contains: ${t}, returning error`),T.mr()}}}class Av extends Ei{Or(e,t){try{return T.newValue({booleanValue:_l.compile(t).matches(e)})}catch{return zt(`Invalid regex pattern found in regex_match: ${t}, returning error`),T.mr()}}}class Rv extends Ei{Or(e,t){return T.newValue({booleanValue:e.includes(t)})}}class vv extends Ei{Or(e,t){return T.newValue({booleanValue:e.startsWith(t)})}}class Pv extends Ei{Or(e,t){return T.newValue({booleanValue:e.endsWith(t)})}}class bv{constructor(e){this.expr=e}evaluate(e,t){var s,i;H(this.expr.params.length===1,29079);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"STRING":return T.newValue({stringValue:(i=(s=n.value)==null?void 0:s.stringValue)==null?void 0:i.toLowerCase()});case"NULL":return T.gr();default:return T.mr()}}}class Sv{constructor(e){this.expr=e}evaluate(e,t){var s,i;H(this.expr.params.length===1,60487);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"STRING":return T.newValue({stringValue:(i=(s=n.value)==null?void 0:s.stringValue)==null?void 0:i.toUpperCase()});case"NULL":return T.gr();default:return T.mr()}}}class Nv{constructor(e){this.expr=e}evaluate(e,t){var s,i;H(this.expr.params.length===1,28544);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"STRING":return T.newValue({stringValue:(i=(s=n.value)==null?void 0:s.stringValue)==null?void 0:i.trim()});case"NULL":return T.gr();default:return T.mr()}}}class Ov{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.params.map(o=>se(o).evaluate(e,t));let s="",i=!1;for(const o of n)switch(o.type){case"STRING":s+=o.value.stringValue;break;case"NULL":i=!0;break;default:return T.mr()}return i?T.gr():T.newValue({stringValue:s})}}class Fv{constructor(e){this.expr=e}evaluate(e,t){var o,a,u,B;H(this.expr.params.length===2,4483);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"UNSET":return T.pr();case"MAP":break;default:return T.mr()}const s=se(this.expr.params[1]).evaluate(e,t);if(s.type!=="STRING")return T.mr();const i=(B=(a=(o=n.value)==null?void 0:o.mapValue)==null?void 0:a.fields)==null?void 0:B[(u=s.value)==null?void 0:u.stringValue];return i===void 0?T.pr():T.newValue(i)}}class Xl{constructor(e){this.expr=e}evaluate(e,t){var B,l;H(this.expr.params.length===2,25231,`${this.expr.name}() function should have exactly 2 params`);let n=!1;const s=se(this.expr.params[0]).evaluate(e,t);switch(s.type){case"VECTOR":break;case"NULL":n=!0;break;default:return T.mr()}const i=se(this.expr.params[1]).evaluate(e,t);switch(i.type){case"VECTOR":break;case"NULL":n=!0;break;default:return T.mr()}if(n)return T.gr();const o=NB(s.value),a=NB(i.value);if(o===void 0||a===void 0||((B=o.values)==null?void 0:B.length)!==((l=a.values)==null?void 0:l.length))return T.mr();const u=this.Mr(o,a);return u===void 0||isNaN(u)?T.mr():T.newValue({doubleValue:u})}}class Lv extends Xl{Mr(e,t){const n=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(n.length===0)return;let i=0,o=0,a=0;for(let B=0;B<n.length;B++){if(!pr(n[B])||!pr(s[B]))return;const l=ot(n[B]),d=ot(s[B]);i+=l*d,o+=l*l,a+=d*d}const u=Math.sqrt(o)*Math.sqrt(a);if(u!==0)return 1-Math.max(-1,Math.min(1,i/u))}}class kv extends Xl{Mr(e,t){const n=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(n.length===0)return 0;let i=0;for(let o=0;o<n.length;o++){if(!pr(n[o])||!pr(s[o]))return;i+=ot(n[o])*ot(s[o])}return i}}class xv extends Xl{Mr(e,t){const n=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(n.length===0)return 0;let i=0;for(let o=0;o<n.length;o++){if(!pr(n[o])||!pr(s[o]))return;const a=ot(n[o]),u=ot(s[o]);i+=Math.pow(a-u,2)}return Math.sqrt(i)}}class Vv{constructor(e){this.expr=e}evaluate(e,t){var s;H(this.expr.params.length===1,39044);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"VECTOR":{const i=NB(n.value);return T.newValue({integerValue:((s=i==null?void 0:i.values)==null?void 0:s.length)??0})}case"NULL":return T.gr();default:return T.mr()}}}const Oo=BigInt(-62135596800),Fo=BigInt(253402300799),wu=BigInt(1e3),dr=BigInt(1e6),Mv=Oo*wu,Gv=Fo*wu+BigInt(999),Uv=Oo*dr,Hv=Fo*dr+BigInt(999999);function Zl(r){return r>=Uv&&r<=Hv}function h_(r){return r>=Oo&&r<=Fo}function Lo(r,e){const t=BigInt(r);return!(t<Oo||t>Fo)&&!(e<0||e>=1e9)&&(t!==Oo||e===0)&&!(t===Fo&&e>999999999)}function d_(r,e){return e<0?{seconds:r-1,nanos:e+1e9}:{seconds:r,nanos:e}}function eh(r){return BigInt(r.seconds)*dr+BigInt(Math.trunc(r.nanoseconds/1e3))}class th{constructor(e){this.expr=e}evaluate(e,t){H(this.expr.params.length===1,49262,`${this.expr.name}() function should have exactly one parameter`);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"INT":return this.toTimestamp(BigInt(n.value.integerValue));case"NULL":return T.gr();default:return T.mr()}}}class qv extends th{toTimestamp(e){if(!Zl(e))return T.mr();let t=Number(e/dr),n=Number(e%dr*BigInt(1e3));const s=d_(t,n);return t=s.seconds,n=s.nanos,Lo(t,n)?T.newValue({timestampValue:{seconds:t,nanos:n}}):T.mr()}}class jv extends th{toTimestamp(e){if(!function(o){return o>=Mv&&o<=Gv}(e))return T.mr();let t=Number(e/wu),n=Number(e%wu*BigInt(1e6));const s=d_(t,n);return t=s.seconds,n=s.nanos,Lo(t,n)?T.newValue({timestampValue:{seconds:t,nanos:n}}):T.mr()}}class Kv extends th{toTimestamp(e){if(!h_(e))return T.mr();const t=Number(e);return T.newValue({timestampValue:{seconds:t,nanos:0}})}}class nh{constructor(e){this.expr=e}evaluate(e,t){H(this.expr.params.length===1,1265,`${this.expr.name}() function should have exactly one parameter`);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"TIMESTAMP":break;case"NULL":return T.gr();default:return T.mr()}const s=Ll(n.value.timestampValue);return Lo(s.seconds,s.nanoseconds)?this.Nr(s):T.mr()}}class Jv extends nh{Nr(e){const t=eh(e);return Zl(t)?T.newValue({integerValue:`${t.toString()}`}):T.mr()}}class zv extends nh{Nr(e){const t=eh(e),n=t/BigInt(1e3),s=t%BigInt(1e3);return n>BigInt(0)||s===BigInt(0)?T.newValue({integerValue:n.toString()}):T.newValue({integerValue:(n-BigInt(1)).toString()})}}class Qv extends nh{Nr(e){const t=BigInt(e.seconds);return h_(t)?T.newValue({integerValue:t.toString()}):T.mr()}}class f_{constructor(e){this.expr=e}evaluate(e,t){H(this.expr.params.length===3,2775,`${this.expr.name}() function should have exactly 3 parameters`);let n=!1;const s=se(this.expr.params[0]).evaluate(e,t);switch(s.type){case"TIMESTAMP":break;case"NULL":n=!0;break;default:return T.mr()}const i=se(this.expr.params[1]).evaluate(e,t);let o;switch(i.type){case"STRING":if(o=function(Z){switch(Z){case"microsecond":return"microsecond";case"millisecond":return"millisecond";case"second":return"second";case"minute":return"minute";case"hour":return"hour";case"day":return"day";default:return}}(i.value.stringValue),o===void 0)return T.mr();break;case"NULL":n=!0;break;default:return T.mr()}const a=se(this.expr.params[2]).evaluate(e,t);switch(a.type){case"INT":break;case"NULL":n=!0;break;default:return T.mr()}if(n)return T.gr();const u=BigInt(a.value.integerValue);let B;try{switch(o){case"microsecond":B=u;break;case"millisecond":B=u*BigInt(1e3);break;case"second":B=u*BigInt(1e6);break;case"minute":B=u*BigInt(6e7);break;case"hour":B=u*BigInt(36e8);break;case"day":B=u*BigInt(864e8);break;default:return T.mr()}if(o!=="microsecond"&&u!==BigInt(0)&&B/u!==BigInt(this.Lr(o)))return T.mr()}catch(z){return zt(`Error during timestamp arithmetic: ${z}`),T.mr()}const l=Ll(s.value.timestampValue);if(!Lo(l.seconds,l.nanoseconds))return T.mr();const d=eh(l),C=this.Br(d,B);if(!Zl(C))return T.mr();const m=Number(C/dr),y=C%dr,O=Number((y<0?y+dr:y)*BigInt(1e3)),V=y<0?m-1:m;return Lo(V,O)?T.newValue({timestampValue:{seconds:V,nanos:O}}):T.mr()}Lr(e){switch(e){case"millisecond":return 1e3;case"second":return 1e6;case"minute":return 6e7;case"hour":return 36e8;case"day":return 864e8;default:return 1}}}class Wv extends f_{Br(e,t){return e+t}}class $v extends f_{Br(e,t){return e-t}}function ko(r){if((r=B_(r))instanceof Ds)return`fld(${r.fieldName})`;if(r instanceof ys)return`cst(${function(t){return t===null?"null":typeof t=="number"?t.toString():typeof t=="string"?`"${t}"`:t instanceof Oe?`ref(${t.path})`:t instanceof Rt?`vec(${JSON.stringify(t)})`:JSON.stringify(t)}(r.value)})`;if(r instanceof x)return`fn(${r.name},[${r.params.map(ko).join(",")}])`;if(r.expressionType==="ListOfExpressions")return`list([${r.cr.map(ko).join(",")}])`;throw new Error(`Unrecognized expr ${JSON.stringify(r,null,2)}`)}function Yv(r){if(r instanceof o_)return`${r._name}(${xa(r.fields)})`;if(r instanceof a_){let e=`${r._name}(${xa(r.accumulators)})`;return r.groups.size>0&&(e+=`grouping(${xa(r.groups)})`),e}if(r instanceof u_)return`${r._name}(${xa(r.groups)})`;if(r instanceof sa)return`${r._name}(${r.hr})`;if(r instanceof ia)return`${r._name}(${r.collectionId})`;if(r instanceof oc)return`${r._name}()`;if(r instanceof ac)return`${r._name}(${r.Tr.sort()})`;if(r instanceof oa)return`${r._name}(${ko(r.condition)})`;if(r instanceof Er)return`${r._name}(${r.limit})`;if(r instanceof tn)return`${r._name}(${function(t){return t.map(n=>`${ko(n.expr)}${n.direction}`).join(",")}(r.orderings)})`;throw new Error(`Unrecognized stage ${r._name}`)}function xa(r){return`${Array.from(r.entries()).sort().map(([e,t])=>`${e}=${ko(t)}`).join(",")}`}function Tn(r){return r.stages.map(e=>Yv(e)).join("|")}function C_(r,e){return Tn(r)===Tn(e)}function ke(r){return r instanceof lt}function FC(r){return ke(r)?Tn(r):co(r)}function p_(r){return ke(r)?Tn(r):function(t){return`${_u(xt(t))}|lt:${t.limitType}`}(r)}function cc(r,e){return r instanceof lt&&e instanceof lt?C_(r,e):!(r instanceof lt&&!(e instanceof lt)||!(r instanceof lt)&&e instanceof lt)&&PA(r,e)}function Bc(r){return mn(r)?Tn(r):_u(r)}function rh(r,e){return r instanceof lt&&e instanceof lt?C_(r,e):!(r instanceof lt&&!(e instanceof lt)||!(r instanceof lt)&&e instanceof lt)&&Pl(r,e)}function Xv(r,e){const t=function(s){let i=!1;const o=[];for(const a of s)if(a instanceof tn)if(i=!0,a.orderings.some(u=>u.expr instanceof Ds&&u.expr.fieldName===Zt))o.push(a);else{const u=a.orderings.map(B=>B);u.push(nu(Zt).ascending()),o.push(new tn(u,{}))}else a instanceof Er&&(i||(o.push(new tn([nu(Zt).ascending()],{})),i=!0)),o.push(a);return i||o.push(new tn([nu(Zt).ascending()],{})),o}(r.stages);if(r.userDataReader){const n=r.userDataReader.createContext(3,"toCorePipeline");t.forEach(s=>s._readUserData(n))}return new lt(r.userDataReader.serializer,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sh{constructor(e,t,n,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=s}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&CA(i,e,n[s])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=uo(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=uo(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=Im();return this.mutations.forEach(s=>{const i=e.get(s.key),o=i.overlayedDocument;let a=this.applyToLocalView(o,i.mutatedFields);a=t.has(s.key)?null:a;const u=im(o,a);u!==null&&n.set(s.key,u),o.isValidDocument()||o.convertToNoDocument(ee.min())}),n}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),ce())}isEqual(e){return this.batchId===e.batchId&&Ws(this.mutations,e.mutations,(t,n)=>cC(t,n))&&Ws(this.baseMutations,e.baseMutations,(t,n)=>cC(t,n))}}class ih{constructor(e,t,n,s){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=s}static from(e,t,n){H(e.mutations.length===n.length,58842,{Ur:e.mutations.length,kr:n.length});let s=function(){return OA}();const i=e.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,n[o].version);return new ih(e,t,n,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tu="";function ht(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=LC(e)),e=Zv(r.get(t),e);return LC(e)}function Zv(r,e){let t=e;const n=r.length;for(let s=0;s<n;s++){const i=r.charAt(s);switch(i){case"\0":t+="";break;case Tu:t+="";break;default:t+=i}}return t}function LC(r){return r+Tu+""}function nn(r){const e=r.length;if(H(e>=2,64408,{path:r}),e===2)return H(r.charAt(0)===Tu&&r.charAt(1)==="",56145,{path:r}),he.emptyPath();const t=e-2,n=[];let s="";for(let i=0;i<e;){const o=r.indexOf(Tu,i);switch((o<0||o>t)&&$(50515,{path:r}),r.charAt(o+1)){case"":const a=r.substring(i,o);let u;s.length===0?u=a:(s+=a,u=s,s=""),n.push(u);break;case"":s+=r.substring(i,o),s+="\0";break;case"":s+=r.substring(i,o+1);break;default:$(61167,{path:r})}i=o+2}return new he(n)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xr="remoteDocuments",ca="owner",bs="owner",xo="mutationQueues",eP="userId",jt="mutations",kC="batchId",Kr="userMutationsIndex",xC=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ru(r,e){return[r,ht(e)]}function g_(r,e,t){return[r,ht(e),t]}const tP={},ri="documentMutations",Au="remoteDocumentsV14",nP=["prefixPath","collectionGroup","readTime","documentId"],su="documentKeyIndex",rP=["prefixPath","collectionGroup","documentId"],m_="collectionGroupIndex",sP=["collectionGroup","readTime","prefixPath","documentId"],Vo="remoteDocumentGlobal",qB="remoteDocumentGlobalKey",si="targets",__="queryTargetsIndex",iP=["canonicalId","targetId"],ii="targetDocuments",oP=["targetId","path"],oh="documentTargetsIndex",aP=["path","targetId"],Ru="targetGlobalKey",Yr="targetGlobal",Mo="collectionParents",uP=["collectionId","parent"],oi="clientMetadata",cP="clientId",lc="bundles",BP="bundleId",hc="namedQueries",lP="name",ah="indexConfiguration",hP="indexId",jB="collectionGroupIndex",dP="collectionGroup",Co="indexState",fP=["indexId","uid"],E_="sequenceNumberIndex",CP=["uid","sequenceNumber"],po="indexEntries",pP=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],I_="documentKeyIndex",gP=["indexId","uid","orderedDocumentKey"],dc="documentOverlays",mP=["userId","collectionPath","documentId"],KB="collectionPathOverlayIndex",_P=["userId","collectionPath","largestBatchId"],D_="collectionGroupOverlayIndex",EP=["userId","collectionGroup","largestBatchId"],uh="globals",IP="name",y_=[xo,jt,ri,xr,si,ca,Yr,ii,oi,Vo,Mo,lc,hc],DP=[...y_,dc],w_=[xo,jt,ri,Au,si,ca,Yr,ii,oi,Vo,Mo,lc,hc,dc],T_=w_,ch=[...T_,ah,Co,po],yP=ch,A_=[...ch,uh],wP=A_;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function R_(r,e,t){const n=r.store(jt),s=r.store(ri),i=[],o=IDBKeyRange.only(t.batchId);let a=0;const u=n.Hn({range:o},(l,d,C)=>(a++,C.delete()));i.push(u.next(()=>{H(a===1,47070,{batchId:t.batchId})}));const B=[];for(const l of t.mutations){const d=g_(e,l.key.path,t.batchId);i.push(s.delete(d)),B.push(l.key)}return P.waitFor(i).next(()=>B)}function vu(r){if(!r)return 0;let e;if(r.document)e=r.document;else if(r.unknownDocument)e=r.unknownDocument;else{if(!r.noDocument)throw $(14731);e=r.noDocument}return JSON.stringify(e).length}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class JB extends Hm{constructor(e,t){super(),this.qr=e,this.currentSequenceNumber=t}}function Xe(r,e){const t=X(r);return lr.Cn(t.qr,e)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bh{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rn{constructor(e,t,n,s,i=ee.min(),o=ee.min(),a=Fe.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=a,this.expectedCount=u}withSequenceNumber(e){return new rn(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new rn(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new rn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new rn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v_{constructor(e){this.$r=e}}function TP(r,e){let t;if(e.document)t=qA(r.$r,e.document,!!e.hasCommittedMutations);else if(e.noDocument){const n=J.fromSegments(e.noDocument.path),s=ds(e.noDocument.readTime);t=Se.newNoDocument(n,s),e.hasCommittedMutations&&t.setHasCommittedMutations()}else{if(!e.unknownDocument)return $(56709);{const n=J.fromSegments(e.unknownDocument.path),s=ds(e.unknownDocument.version);t=Se.newUnknownDocument(n,s)}}return e.readTime&&t.setReadTime(function(s){const i=new _e(s[0],s[1]);return ee.fromTimestamp(i)}(e.readTime)),t}function VC(r,e){const t=e.key,n={prefixPath:t.getCollectionPath().popLast().toArray(),collectionGroup:t.collectionGroup,documentId:t.path.lastSegment(),readTime:Pu(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())n.document=function(i,o){return{name:ni(i,o.key),fields:o.data.value.mapValue.fields,updateTime:$r(i,o.version.toTimestamp()),createTime:$r(i,o.createTime.toTimestamp())}}(r.$r,e);else if(e.isNoDocument())n.noDocument={path:t.path.toArray(),readTime:hs(e.version)};else{if(!e.isUnknownDocument())return $(57904,{document:e});n.unknownDocument={path:t.path.toArray(),version:hs(e.version)}}return n}function Pu(r){const e=r.toTimestamp();return[e.seconds,e.nanoseconds]}function hs(r){const e=r.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function ds(r){const e=new _e(r.seconds,r.nanoseconds);return ee.fromTimestamp(e)}function Gr(r,e){const t=(e.baseMutations||[]).map(i=>UB(r.$r,i));for(let i=0;i<e.mutations.length-1;++i){const o=e.mutations[i];if(i+1<e.mutations.length&&e.mutations[i+1].transform!==void 0){const a=e.mutations[i+1];o.updateTransforms=a.transform.fieldTransforms,e.mutations.splice(i+1,1),++i}}const n=e.mutations.map(i=>UB(r.$r,i)),s=_e.fromMillis(e.localWriteTimeMs);return new sh(e.batchId,s,t,n)}function to(r,e){const t=ds(e.readTime),n=e.lastLimboFreeSnapshotVersion!==void 0?ds(e.lastLimboFreeSnapshotVersion):ee.min();let s;return s=function(o){return o.structuredPipeline!==void 0}(e.query)?function(o,a){var l,d;const u=o.structuredPipeline;H((((l=u==null?void 0:u.pipeline)==null?void 0:l.stages)??[]).length>0,1845);const B=(d=u==null?void 0:u.pipeline)==null?void 0:d.stages.map(AP);return new lt(a,B)}(e.query,r.$r):function(o){return o.documents!==void 0}(e.query)?function(o){const a=o.documents.length;return H(a===1,1966,{count:a}),xt(ta(Rm(o.documents[0])))}(e.query):function(o){return xt(Sm(o))}(e.query),new rn(s,e.targetId,"TargetPurposeListen",e.lastListenSequenceNumber,t,n,Fe.fromBase64String(e.resumeToken))}function P_(r,e){const t=hs(e.snapshotVersion),n=hs(e.lastLimboFreeSnapshotVersion);let s;s=mn(e.target)?Nm(r.$r,e.target):bl(e.target)?Pm(r.$r,e.target):bm(r.$r,e.target).Se;const i=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:Bc(e.target),readTime:t,resumeToken:i,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:n,query:s}}function b_(r){const e=Sm({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?Iu(e,e.limit,"L"):e}function Va(r,e){return new Bh(e.largestBatchId,UB(r.$r,e.overlayMutation))}function MC(r,e){const t=e.path.lastSegment();return[r,ht(e.path.popLast()),t]}function GC(r,e,t,n){return{indexId:r,uid:e,sequenceNumber:t,readTime:hs(n.readTime),documentKey:ht(n.documentKey.path),largestBatchId:n.largestBatchId}}function AP(r){switch(r.name){case"collection":return new sa(r.args[0].referenceValue,{});case"collection_group":return new ia(r.args[1].stringValue,{});case"database":return new oc({});case"documents":return new ac(r.args.map(e=>e.referenceValue),{});case"where":return new oa(zB(r.args[0]),{});case"limit":{const e=r.args[0].integerValue??r.args[0].doubleValue;return new Er(typeof e=="number"?e:Number(e),{})}case"sort":return new tn(r.args.map(e=>function(n){var i,o;const s=(i=n.mapValue)==null?void 0:i.fields;return new Ql(zB(s.expression),(o=s.direction)==null?void 0:o.stringValue,"orderingFromProto")}(e)),{});default:throw new Error(`Stage type: ${r.name} not supported.`)}}function zB(r){return r.fieldReferenceValue?new Ds(Nn("_exprFromProto",r.fieldReferenceValue),"_exprFromProto"):r.functionValue?function(t){var n;return new x(t.functionValue.name,((n=t.functionValue.args)==null?void 0:n.map(zB))||[])}(r):ys._fromProto(r)}class fc{constructor(e,t,n,s){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=s,this.Kr={}}static Qr(e,t,n,s){H(e.uid!=="",64387);const i=e.isAuthenticated()?e.uid:"";return new fc(i,t,n,s)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return Jn(e).Hn({index:Kr,range:n},(s,i,o)=>{t=!1,o.done()}).next(()=>t)}addMutationBatch(e,t,n,s){const i=Hs(e),o=Jn(e);return o.add({}).next(a=>{H(typeof a=="number",49019);const u=new sh(a,t,n,s),B=function(m,y,O){const V=O.baseMutations.map(Z=>bo(m.$r,Z)),z=O.mutations.map(Z=>bo(m.$r,Z));return{userId:y,batchId:O.batchId,localWriteTimeMs:O.localWriteTime.toMillis(),baseMutations:V,mutations:z}}(this.serializer,this.userId,u),l=[];let d=new Ee((C,m)=>ie(C.canonicalString(),m.canonicalString()));for(const C of s){const m=g_(this.userId,C.key.path,a);d=d.add(C.key.path.popLast()),l.push(o.put(B)),l.push(i.put(m,tP))}return d.forEach(C=>{l.push(this.indexManager.addToCollectionParentIndex(e,C))}),e.addOnCommittedListener(()=>{this.Kr[a]=u.keys()}),P.waitFor(l).next(()=>u)})}lookupMutationBatch(e,t){return Jn(e).get(t).next(n=>n?(H(n.userId===this.userId,48,"Unexpected user for mutation batch",{userId:n.userId,batchId:t}),Gr(this.serializer,n)):null)}Wr(e,t){return this.Kr[t]?P.resolve(this.Kr[t]):this.lookupMutationBatch(e,t).next(n=>{if(n){const s=n.keys();return this.Kr[t]=s,s}return null})}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=IDBKeyRange.lowerBound([this.userId,n]);let i=null;return Jn(e).Hn({index:Kr,range:s},(o,a,u)=>{a.userId===this.userId&&(H(a.batchId>=n,47524,{Gr:n}),i=Gr(this.serializer,a)),u.done()}).next(()=>i)}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=Qr;return Jn(e).Hn({index:Kr,range:t,reverse:!0},(s,i,o)=>{n=i.batchId,o.done()}).next(()=>n)}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,Qr],[this.userId,Number.POSITIVE_INFINITY]);return Jn(e).Qn(Kr,t).next(n=>n.map(s=>Gr(this.serializer,s)))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=ru(this.userId,t.path),s=IDBKeyRange.lowerBound(n),i=[];return Hs(e).Hn({range:s},(o,a,u)=>{const[B,l,d]=o,C=nn(l);if(B===this.userId&&t.path.isEqual(C))return Jn(e).get(d).next(m=>{if(!m)throw $(61480,{zr:o,batchId:d});H(m.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:m.userId,batchId:d}),i.push(Gr(this.serializer,m))});u.done()}).next(()=>i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new Ee(ie);const s=[];return t.forEach(i=>{const o=ru(this.userId,i.path),a=IDBKeyRange.lowerBound(o),u=Hs(e).Hn({range:a},(B,l,d)=>{const[C,m,y]=B,O=nn(m);C===this.userId&&i.path.isEqual(O)?n=n.add(y):d.done()});s.push(u)}),P.waitFor(s).next(()=>this.jr(e,n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1,i=ru(this.userId,n),o=IDBKeyRange.lowerBound(i);let a=new Ee(ie);return Hs(e).Hn({range:o},(u,B,l)=>{const[d,C,m]=u,y=nn(C);d===this.userId&&n.isPrefixOf(y)?y.length===s&&(a=a.add(m)):l.done()}).next(()=>this.jr(e,a))}jr(e,t){const n=[],s=[];return t.forEach(i=>{s.push(Jn(e).get(i).next(o=>{if(o===null)throw $(35274,{batchId:i});H(o.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:o.userId,batchId:i}),n.push(Gr(this.serializer,o))}))}),P.waitFor(s).next(()=>n)}removeMutationBatch(e,t){return R_(e.qr,this.userId,t).next(n=>(e.addOnCommittedListener(()=>{this.Hr(t.batchId)}),P.forEach(n,s=>this.referenceDelegate.markPotentiallyOrphaned(e,s))))}Hr(e){delete this.Kr[e]}performConsistencyCheck(e){return this.checkEmpty(e).next(t=>{if(!t)return P.resolve();const n=IDBKeyRange.lowerBound(function(o){return[o]}(this.userId)),s=[];return Hs(e).Hn({range:n},(i,o,a)=>{if(i[0]===this.userId){const u=nn(i[1]);s.push(u)}else a.done()}).next(()=>{H(s.length===0,56720,{Jr:s.map(i=>i.canonicalString())})})})}containsKey(e,t){return S_(e,this.userId,t)}Yr(e){return N_(e).get(this.userId).next(t=>t||{userId:this.userId,lastAcknowledgedBatchId:Qr,lastStreamToken:""})}}function S_(r,e,t){const n=ru(e,t.path),s=n[1],i=IDBKeyRange.lowerBound(n);let o=!1;return Hs(r).Hn({range:i,jn:!0},(a,u,B)=>{const[l,d,C]=a;l===e&&d===s&&(o=!0),B.done()}).next(()=>o)}function Jn(r){return Xe(r,jt)}function Hs(r){return Xe(r,ri)}function N_(r){return Xe(r,xo)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class RP{getBundleMetadata(e,t){return UC(e).get(t).next(n=>{if(n)return function(i){return{id:i.bundleId,createTime:ds(i.createTime),version:i.version}}(n)})}saveBundleMetadata(e,t){return UC(e).put(function(s){return{bundleId:s.id,createTime:hs(rt(s.createTime)),version:s.version}}(t))}getNamedQuery(e,t){return HC(e).get(t).next(n=>{if(n)return function(i){return{name:i.name,query:b_(i.bundledQuery),readTime:ds(i.readTime)}}(n)})}saveNamedQuery(e,t){return HC(e).put(function(s){return{name:s.name,readTime:hs(rt(s.readTime)),bundledQuery:s.bundledQuery}}(t))}}function UC(r){return Xe(r,lc)}function HC(r){return Xe(r,hc)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cc{constructor(e,t){this.serializer=e,this.userId=t}static Qr(e,t){const n=t.uid||"";return new Cc(e,n)}getOverlay(e,t){return Ss(e).get(MC(this.userId,t)).next(n=>n?Va(this.serializer,n):null)}getOverlays(e,t){const n=Ut();return P.forEach(t,s=>this.getOverlay(e,s).next(i=>{i!==null&&n.set(s,i)})).next(()=>n)}getAllOverlays(e,t){const n=Ut();return Ss(e).Hn((s,i)=>{const o=Va(this.serializer,i);o.largestBatchId>t&&n.set(o.getKey(),o)}).next(()=>n)}saveOverlays(e,t,n){const s=[];return n.forEach((i,o)=>{const a=new Bh(t,o);s.push(this.Zr(e,a))}),P.waitFor(s)}removeOverlaysForBatchId(e,t,n){const s=new Set;t.forEach(o=>s.add(ht(o.getCollectionPath())));const i=[];return s.forEach(o=>{const a=IDBKeyRange.bound([this.userId,o,n],[this.userId,o,n+1],!1,!0);i.push(Ss(e).zn(KB,a))}),P.waitFor(i)}getOverlaysForCollection(e,t,n){const s=Ut(),i=ht(t),o=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,Number.POSITIVE_INFINITY],!0);return Ss(e).Qn(KB,o).next(a=>{for(const u of a){const B=Va(this.serializer,u);s.set(B.getKey(),B)}return s})}getOverlaysForCollectionGroup(e,t,n,s){const i=Ut();let o;const a=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return Ss(e).Hn({index:D_,range:a},(u,B,l)=>{const d=Va(this.serializer,B);i.size()<s||d.largestBatchId===o?(i.set(d.getKey(),d),o=d.largestBatchId):l.done()}).next(()=>i)}Zr(e,t){return Ss(e).put(function(s,i,o){const[a,u,B]=MC(i,o.mutation.key);return{userId:i,collectionPath:u,documentId:B,collectionGroup:o.mutation.key.getCollectionGroup(),largestBatchId:o.largestBatchId,overlayMutation:bo(s.$r,o.mutation)}}(this.serializer,this.userId,t))}}function Ss(r){return Xe(r,dc)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vP{Xr(e){return Xe(e,uh)}getSessionToken(e){return this.Xr(e).get("sessionToken").next(t=>{const n=t==null?void 0:t.value;return n?Fe.fromUint8Array(n):Fe.EMPTY_BYTE_STRING})}setSessionToken(e,t){return this.Xr(e).put({name:"sessionToken",value:t.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ur{constructor(){}ei(e,t){this.ti(e,t),t.ni()}ti(e,t){if("nullValue"in e)this.ri(t,5);else if("booleanValue"in e)this.ri(t,10),t.ii(e.booleanValue?1:0);else if("integerValue"in e)this.ri(t,15),t.ii(Re(e.integerValue));else if("doubleValue"in e){const n=Re(e.doubleValue);isNaN(n)?this.ri(t,13):(this.ri(t,15),Ys(n)?t.ii(0):t.ii(n))}else if("timestampValue"in e){let n=e.timestampValue;this.ri(t,20),typeof n=="string"&&(n=bn(n)),t.si(`${n.seconds||""}`),t.ii(n.nanos||0)}else if("stringValue"in e)this._i(e.stringValue,t),this.oi(t);else if("bytesValue"in e)this.ri(t,30),t.ai(Sn(e.bytesValue)),this.oi(t);else if("referenceValue"in e)this.ui(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.ri(t,45),t.ii(n.latitude||0),t.ii(n.longitude||0)}else"mapValue"in e?Xg(e)?this.ri(t,Number.MAX_SAFE_INTEGER):us(e)?this.ci(e.mapValue,t):(this.li(e.mapValue,t),this.oi(t)):"arrayValue"in e?(this.Ei(e.arrayValue,t),this.oi(t)):$(19022,{hi:e})}_i(e,t){this.ri(t,25),this.Ti(e,t)}Ti(e,t){t.si(e)}li(e,t){const n=e.fields||{};this.ri(t,55);for(const s of Object.keys(n))this._i(s,t),this.ti(n[s],t)}ci(e,t){var o,a;const n=e.fields||{};this.ri(t,53);const s=os,i=((a=(o=n[s].arrayValue)==null?void 0:o.values)==null?void 0:a.length)||0;this.ri(t,15),t.ii(Re(i)),this._i(s,t),this.ti(n[s],t)}Ei(e,t){const n=e.values||[];this.ri(t,50);for(const s of n)this.ti(s,t)}ui(e,t){this.ri(t,37),J.fromName(e).path.forEach(n=>{this.ri(t,60),this.Ti(n,t)})}ri(e,t){e.ii(t)}oi(e){e.ii(2)}}Ur.Pi=new Ur;/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ns=255;function PP(r){if(r===0)return 8;let e=0;return r>>4||(e+=4,r<<=4),r>>6||(e+=2,r<<=2),r>>7||(e+=1),e}function qC(r){const e=64-function(n){let s=0;for(let i=0;i<8;++i){const o=PP(255&n[i]);if(s+=o,o!==8)break}return s}(r);return Math.ceil(e/8)}class bP{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Ii(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Ri(n.value),n=t.next();this.Ai()}Vi(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.di(n.value),n=t.next();this.fi()}mi(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Ri(n);else if(n<2048)this.Ri(960|n>>>6),this.Ri(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Ri(480|n>>>12),this.Ri(128|63&n>>>6),this.Ri(128|63&n);else{const s=t.codePointAt(0);this.Ri(240|s>>>18),this.Ri(128|63&s>>>12),this.Ri(128|63&s>>>6),this.Ri(128|63&s)}}this.Ai()}pi(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.di(n);else if(n<2048)this.di(960|n>>>6),this.di(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.di(480|n>>>12),this.di(128|63&n>>>6),this.di(128|63&n);else{const s=t.codePointAt(0);this.di(240|s>>>18),this.di(128|63&s>>>12),this.di(128|63&s>>>6),this.di(128|63&s)}}this.fi()}gi(e){const t=this.yi(e),n=qC(t);this.wi(1+n),this.buffer[this.position++]=255&n;for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=255&t[s]}bi(e){const t=this.yi(e),n=qC(t);this.wi(1+n),this.buffer[this.position++]=~(255&n);for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=~(255&t[s])}Si(){this.Di(Ns),this.Di(255)}xi(){this.Ci(Ns),this.Ci(255)}reset(){this.position=0}seed(e){this.wi(e.length),this.buffer.set(e,this.position),this.position+=e.length}Fi(){return this.buffer.slice(0,this.position)}yi(e){const t=function(i){const o=new DataView(new ArrayBuffer(8));return o.setFloat64(0,i,!1),new Uint8Array(o.buffer)}(e),n=!!(128&t[0]);t[0]^=n?255:128;for(let s=1;s<t.length;++s)t[s]^=n?255:0;return t}Ri(e){const t=255&e;t===0?(this.Di(0),this.Di(255)):t===Ns?(this.Di(Ns),this.Di(0)):this.Di(t)}di(e){const t=255&e;t===0?(this.Ci(0),this.Ci(255)):t===Ns?(this.Ci(Ns),this.Ci(0)):this.Ci(e)}Ai(){this.Di(0),this.Di(1)}fi(){this.Ci(0),this.Ci(1)}Di(e){this.wi(1),this.buffer[this.position++]=e}Ci(e){this.wi(1),this.buffer[this.position++]=~e}wi(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const s=new Uint8Array(n);s.set(this.buffer),this.buffer=s}}class SP{constructor(e){this.Oi=e}ai(e){this.Oi.Ii(e)}si(e){this.Oi.mi(e)}ii(e){this.Oi.gi(e)}ni(){this.Oi.Si()}}class NP{constructor(e){this.Oi=e}ai(e){this.Oi.Vi(e)}si(e){this.Oi.pi(e)}ii(e){this.Oi.bi(e)}ni(){this.Oi.xi()}}class ji{constructor(){this.Oi=new bP,this.ascending=new SP(this.Oi),this.descending=new NP(this.Oi)}seed(e){this.Oi.seed(e)}Mi(e){return e===0?this.ascending:this.descending}Fi(){return this.Oi.Fi()}reset(){this.Oi.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hr{constructor(e,t,n,s){this.Ni=e,this.Li=t,this.Bi=n,this.Ui=s}ki(){const e=this.Ui.length,t=e===0||this.Ui[e-1]===255?e+1:e,n=new Uint8Array(t);return n.set(this.Ui,0),t!==e?n.set([0],this.Ui.length):++n[n.length-1],new Hr(this.Ni,this.Li,this.Bi,n)}qi(e,t,n){return{indexId:this.Ni,uid:e,arrayValue:iu(this.Bi),directionalValue:iu(this.Ui),orderedDocumentKey:iu(t),documentKey:n.path.toArray()}}$i(e,t,n){const s=this.qi(e,t,n);return[s.indexId,s.uid,s.arrayValue,s.directionalValue,s.orderedDocumentKey,s.documentKey]}}function zn(r,e){let t=r.Ni-e.Ni;return t!==0?t:(t=jC(r.Bi,e.Bi),t!==0?t:(t=jC(r.Ui,e.Ui),t!==0?t:J.comparator(r.Li,e.Li)))}function jC(r,e){for(let t=0;t<r.length&&t<e.length;++t){const n=r[t]-e[t];if(n!==0)return n}return r.length-e.length}function iu(r){return Op()?function(t){let n="";for(let s=0;s<t.length;s++)n+=String.fromCharCode(t[s]);return n}(r):r}function KC(r){return typeof r!="string"?r:function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n}(r)}class JC{constructor(e){this.Ki=new Ee((t,n)=>Qe.comparator(t.field,n.field)),this.collectionId=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment(),this.Qi=e.orderBy,this.Wi=[];for(const t of e.filters){const n=t;n.isInequality()?this.Ki=this.Ki.add(n):this.Wi.push(n)}}get Gi(){return this.Ki.size>1}zi(e){if(H(e.collectionGroup===this.collectionId,49279),this.Gi)return!1;const t=LB(e);if(t!==void 0&&!this.ji(t))return!1;const n=kr(e);let s=new Set,i=0,o=0;for(;i<n.length&&this.ji(n[i]);++i)s=s.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.Ki.size>0){const a=this.Ki.getIterator().getNext();if(!s.has(a.field.canonicalString())){const u=n[i];if(!this.Hi(a,u)||!this.Ji(this.Qi[o++],u))return!1}++i}for(;i<n.length;++i){const a=n[i];if(o>=this.Qi.length||!this.Ji(this.Qi[o++],a))return!1}return!0}Yi(){if(this.Gi)return null;let e=new Ee(Qe.comparator);const t=[];for(const n of this.Wi)if(!n.field.isKeyField())if(n.op==="array-contains"||n.op==="array-contains-any")t.push(new Za(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new Za(n.field,0))}for(const n of this.Qi)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new Za(n.field,n.dir==="asc"?0:1)));return new mu(mu.UNKNOWN_ID,this.collectionId,t,Po.empty())}ji(e){for(const t of this.Wi)if(this.Hi(t,e))return!0;return!1}Hi(e,t){if(e===void 0||!e.field.isEqual(t.fieldPath))return!1;const n=e.op==="array-contains"||e.op==="array-contains-any";return t.kind===2===n}Ji(e,t){return!!e.field.isEqual(t.fieldPath)&&(t.kind===0&&e.dir==="asc"||t.kind===1&&e.dir==="desc")}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function O_(r){var t,n;if(H(r instanceof fe||r instanceof Ie,20012),r instanceof fe){if(r instanceof dm){const s=((n=(t=r.value.arrayValue)==null?void 0:t.values)==null?void 0:n.map(i=>fe.create(r.field,"==",i)))||[];return Ie.create(s,"or")}return r}const e=r.filters.map(s=>O_(s));return Ie.create(e,r.op)}function OP(r){if(r.getFilters().length===0)return[];const e=$B(O_(r));return H(F_(e),7391),QB(e)||WB(e)?[e]:e.getFilters()}function QB(r){return r instanceof fe}function WB(r){return r instanceof Ie&&Rl(r)}function F_(r){return QB(r)||WB(r)||function(t){if(t instanceof Ie&&OB(t)){for(const n of t.getFilters())if(!QB(n)&&!WB(n))return!1;return!0}return!1}(r)}function $B(r){if(H(r instanceof fe||r instanceof Ie,34018),r instanceof fe)return r;if(r.filters.length===1)return $B(r.filters[0]);const e=r.filters.map(n=>$B(n));let t=Ie.create(e,r.op);return t=bu(t),F_(t)?t:(H(t instanceof Ie,64498),H(ei(t),40251),H(t.filters.length>1,57927),t.filters.reduce((n,s)=>lh(n,s)))}function lh(r,e){let t;return H(r instanceof fe||r instanceof Ie,38388),H(e instanceof fe||e instanceof Ie,25473),t=r instanceof fe?e instanceof fe?function(s,i){return Ie.create([s,i],"and")}(r,e):zC(r,e):e instanceof fe?zC(e,r):function(s,i){if(H(s.filters.length>0&&i.filters.length>0,48005),ei(s)&&ei(i))return Bm(s,i.getFilters());const o=OB(s)?s:i,a=OB(s)?i:s,u=o.filters.map(B=>lh(B,a));return Ie.create(u,"or")}(r,e),bu(t)}function zC(r,e){if(ei(e))return Bm(e,r.getFilters());{const t=e.filters.map(n=>lh(r,n));return Ie.create(t,"or")}}function bu(r){if(H(r instanceof fe||r instanceof Ie,11850),r instanceof fe)return r;const e=r.getFilters();if(e.length===1)return bu(e[0]);if(um(r))return r;const t=e.map(s=>bu(s)),n=[];return t.forEach(s=>{s instanceof fe?n.push(s):s instanceof Ie&&(s.op===r.op?n.push(...s.filters):n.push(s))}),n.length===1?n[0]:Ie.create(n,r.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FP{constructor(){this.Zi=new hh}addToCollectionParentIndex(e,t){return this.Zi.add(t),P.resolve()}getCollectionParents(e,t){return P.resolve(this.Zi.getEntries(t))}addFieldIndex(e,t){return P.resolve()}deleteFieldIndex(e,t){return P.resolve()}deleteAllFieldIndexes(e){return P.resolve()}createTargetIndexes(e,t){return P.resolve()}getDocumentsMatchingTarget(e,t){return P.resolve(null)}getIndexType(e,t){return P.resolve(0)}getFieldIndexes(e,t){return P.resolve([])}getNextCollectionGroupToUpdate(e){return P.resolve(null)}getMinOffset(e,t){return P.resolve(Vt.min())}getMinOffsetFromCollectionGroup(e,t){return P.resolve(Vt.min())}updateCollectionGroup(e,t,n){return P.resolve()}updateIndexEntries(e,t){return P.resolve()}}class hh{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t]||new Ee(he.comparator),i=!s.has(n);return this.index[t]=s.add(n),i}has(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t];return s&&s.has(n)}getEntries(e){return(this.index[e]||new Ee(he.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const QC="IndexedDbIndexManager",Ma=new Uint8Array(0);class LP{constructor(e,t){this.databaseId=t,this.Xi=new hh,this.es=new xn(n=>_u(n),(n,s)=>Pl(n,s)),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.Xi.has(t)){const n=t.lastSegment(),s=t.popLast();e.addOnCommittedListener(()=>{this.Xi.add(t)});const i={collectionId:n,parent:ht(s)};return WC(e).put(i)}return P.resolve()}getCollectionParents(e,t){const n=[],s=IDBKeyRange.bound([t,""],[Hg(t),""],!1,!0);return WC(e).Qn(s).next(i=>{for(const o of i){if(o.collectionId!==t)break;n.push(nn(o.parent))}return n})}addFieldIndex(e,t){const n=Ki(e),s=function(a){return{indexId:a.indexId,collectionGroup:a.collectionGroup,fields:a.fields.map(u=>[u.fieldPath.canonicalString(),u.kind])}}(t);delete s.indexId;const i=n.add(s);if(t.indexState){const o=Fs(e);return i.next(a=>{o.put(GC(a,this.uid,t.indexState.sequenceNumber,t.indexState.offset))})}return i.next()}deleteFieldIndex(e,t){const n=Ki(e),s=Fs(e),i=Os(e);return n.delete(t.indexId).next(()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))).next(()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))}deleteAllFieldIndexes(e){const t=Ki(e),n=Os(e),s=Fs(e);return t.zn().next(()=>n.zn()).next(()=>s.zn())}createTargetIndexes(e,t){return P.forEach(this.ts(t),n=>this.getIndexType(e,n).next(s=>{if(s===0||s===1){const i=new JC(n).Yi();if(i!=null)return this.addFieldIndex(e,i)}}))}getDocumentsMatchingTarget(e,t){const n=Os(e);let s=!0;const i=new Map;return P.forEach(this.ts(t),o=>this.ns(e,o).next(a=>{s&&(s=!!a),i.set(o,a)})).next(()=>{if(s){let o=ce();const a=[];return P.forEach(i,(u,B)=>{U(QC,`Using index ${function(ne){return`id=${ne.indexId}|cg=${ne.collectionGroup}|f=${ne.fields.map(oe=>`${oe.fieldPath}:${oe.kind}`).join(",")}`}(u)} to execute ${_u(t)}`);const l=function(ne,oe){const Be=LB(oe);if(Be===void 0)return null;for(const ue of Eu(ne,Be.fieldPath))switch(ue.op){case"array-contains-any":return ue.value.arrayValue.values||[];case"array-contains":return[ue.value]}return null}(B,u),d=function(ne,oe){const Be=new Map;for(const ue of kr(oe))for(const w of Eu(ne,ue.fieldPath))switch(w.op){case"==":case"in":Be.set(ue.fieldPath.canonicalString(),w.value);break;case"not-in":case"!=":return Be.set(ue.fieldPath.canonicalString(),w.value),Array.from(Be.values())}return null}(B,u),C=function(ne,oe){const Be=[];let ue=!0;for(const w of kr(oe)){const E=w.kind===0?fC(ne,w.fieldPath,ne.startAt):CC(ne,w.fieldPath,ne.startAt);Be.push(E.value),ue&&(ue=E.inclusive)}return new mr(Be,ue)}(B,u),m=function(ne,oe){const Be=[];let ue=!0;for(const w of kr(oe)){const E=w.kind===0?CC(ne,w.fieldPath,ne.endAt):fC(ne,w.fieldPath,ne.endAt);Be.push(E.value),ue&&(ue=E.inclusive)}return new mr(Be,ue)}(B,u),y=this.rs(u,B,C),O=this.rs(u,B,m),V=this.ss(u,B,d),z=this._s(u.indexId,l,y,C.inclusive,O,m.inclusive,V);return P.forEach(z,Z=>n.Gn(Z,t.limit).next(ne=>{ne.forEach(oe=>{const Be=J.fromSegments(oe.documentKey);o.has(Be)||(o=o.add(Be),a.push(Be))})}))}).next(()=>a)}return P.resolve(null)})}ts(e){let t=this.es.get(e);return t||(e.filters.length===0?t=[e]:t=OP(Ie.create(e.filters,"and")).map(n=>kB(e.path,e.collectionGroup,e.orderBy,n.getFilters(),e.limit,e.startAt,e.endAt)),this.es.set(e,t),t)}_s(e,t,n,s,i,o,a){const u=(t!=null?t.length:1)*Math.max(n.length,i.length),B=u/(t!=null?t.length:1),l=[];for(let d=0;d<u;++d){const C=t?this.us(t[d/B]):Ma,m=this.cs(e,C,n[d%B],s),y=this.ls(e,C,i[d%B],o),O=a.map(V=>this.cs(e,C,V,!0));l.push(...this.createRange(m,y,O))}return l}cs(e,t,n,s){const i=new Hr(e,J.empty(),t,n);return s?i:i.ki()}ls(e,t,n,s){const i=new Hr(e,J.empty(),t,n);return s?i.ki():i}ns(e,t){const n=new JC(t),s=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,s).next(i=>{let o=null;for(const a of i)n.zi(a)&&(!o||a.fields.length>o.fields.length)&&(o=a);return o})}getIndexType(e,t){let n=2;const s=this.ts(t);return P.forEach(s,i=>this.ns(e,i).next(o=>{o?n!==0&&o.fields.length<function(u){let B=new Ee(Qe.comparator),l=!1;for(const d of u.filters)for(const C of d.getFlattenedFilters())C.field.isKeyField()||(C.op==="array-contains"||C.op==="array-contains-any"?l=!0:B=B.add(C.field));for(const d of u.orderBy)d.field.isKeyField()||(B=B.add(d.field));return B.size+(l?1:0)}(i)&&(n=1):n=0})).next(()=>function(o){return o.limit!==null}(t)&&s.length>1&&n===2?1:n)}Es(e,t){const n=new ji;for(const s of kr(e)){const i=t.data.field(s.fieldPath);if(i==null)return null;const o=n.Mi(s.kind);Ur.Pi.ei(i,o)}return n.Fi()}us(e){const t=new ji;return Ur.Pi.ei(e,t.Mi(0)),t.Fi()}hs(e,t){const n=new ji;return Ur.Pi.ei(as(this.databaseId,t),n.Mi(function(i){const o=kr(i);return o.length===0?0:o[o.length-1].kind}(e))),n.Fi()}ss(e,t,n){if(n===null)return[];let s=[];s.push(new ji);let i=0;for(const o of kr(e)){const a=n[i++];for(const u of s)if(this.Ts(t,o.fieldPath)&&gr(a))s=this.Ps(s,o,a);else{const B=u.Mi(o.kind);Ur.Pi.ei(a,B)}}return this.Is(s)}rs(e,t,n){return this.ss(e,t,n.position)}Is(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].Fi();return t}Ps(e,t,n){const s=[...e],i=[];for(const o of n.arrayValue.values||[])for(const a of s){const u=new ji;u.seed(a.Fi()),Ur.Pi.ei(o,u.Mi(t.kind)),i.push(u)}return i}Ts(e,t){return!!e.filters.find(n=>n instanceof fe&&n.field.isEqual(t)&&(n.op==="in"||n.op==="not-in"))}getFieldIndexes(e,t){const n=Ki(e),s=Fs(e);return(t?n.Qn(jB,IDBKeyRange.bound(t,t)):n.Qn()).next(i=>{const o=[];return P.forEach(i,a=>s.get([a.indexId,this.uid]).next(u=>{o.push(function(l,d){const C=d?new Po(d.sequenceNumber,new Vt(ds(d.readTime),new J(nn(d.documentKey)),d.largestBatchId)):Po.empty(),m=l.fields.map(([y,O])=>new Za(Qe.fromServerFormat(y),O));return new mu(l.indexId,l.collectionGroup,m,C)}(a,u))})).next(()=>o)})}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next(t=>t.length===0?null:(t.sort((n,s)=>{const i=n.indexState.sequenceNumber-s.indexState.sequenceNumber;return i!==0?i:ie(n.collectionGroup,s.collectionGroup)}),t[0].collectionGroup))}updateCollectionGroup(e,t,n){const s=Ki(e),i=Fs(e);return this.Rs(e).next(o=>s.Qn(jB,IDBKeyRange.bound(t,t)).next(a=>P.forEach(a,u=>i.put(GC(u.indexId,this.uid,o,n)))))}updateIndexEntries(e,t){const n=new Map;return P.forEach(t,(s,i)=>{const o=n.get(s.collectionGroup);return(o?P.resolve(o):this.getFieldIndexes(e,s.collectionGroup)).next(a=>(n.set(s.collectionGroup,a),P.forEach(a,u=>this.As(e,s,u).next(B=>{const l=this.Vs(i,u);return B.isEqual(l)?P.resolve():this.ds(e,i,u,B,l)}))))})}fs(e,t,n,s){return Os(e).put(s.qi(this.uid,this.hs(n,t.key),t.key))}ps(e,t,n,s){return Os(e).delete(s.$i(this.uid,this.hs(n,t.key),t.key))}As(e,t,n){const s=Os(e);let i=new Ee(zn);return s.Hn({index:I_,range:IDBKeyRange.only([n.indexId,this.uid,iu(this.hs(n,t))])},(o,a)=>{i=i.add(new Hr(n.indexId,t,KC(a.arrayValue),KC(a.directionalValue)))}).next(()=>i)}Vs(e,t){let n=new Ee(zn);const s=this.Es(t,e);if(s==null)return n;const i=LB(t);if(i!=null){const o=e.data.field(i.fieldPath);if(gr(o))for(const a of o.arrayValue.values||[])n=n.add(new Hr(t.indexId,e.key,this.us(a),s))}else n=n.add(new Hr(t.indexId,e.key,Ma,s));return n}ds(e,t,n,s,i){U(QC,"Updating index entries for document '%s'",t.key);const o=[];return function(u,B,l,d,C){const m=u.getIterator(),y=B.getIterator();let O=Ps(m),V=Ps(y);for(;O||V;){let z=!1,Z=!1;if(O&&V){const ne=l(O,V);ne<0?Z=!0:ne>0&&(z=!0)}else O!=null?Z=!0:z=!0;z?(d(V),V=Ps(y)):Z?(C(O),O=Ps(m)):(O=Ps(m),V=Ps(y))}}(s,i,zn,a=>{o.push(this.fs(e,t,n,a))},a=>{o.push(this.ps(e,t,n,a))}),P.waitFor(o)}Rs(e){let t=1;return Fs(e).Hn({index:E_,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(n,s,i)=>{i.done(),t=s.sequenceNumber+1}).next(()=>t)}createRange(e,t,n){n=n.sort((o,a)=>zn(o,a)).filter((o,a,u)=>!a||zn(o,u[a-1])!==0);const s=[];s.push(e);for(const o of n){const a=zn(o,e),u=zn(o,t);if(a===0)s[0]=e.ki();else if(a>0&&u<0)s.push(o),s.push(o.ki());else if(u>0)break}s.push(t);const i=[];for(let o=0;o<s.length;o+=2){if(this.gs(s[o],s[o+1]))return[];const a=s[o].$i(this.uid,Ma,J.empty()),u=s[o+1].$i(this.uid,Ma,J.empty());i.push(IDBKeyRange.bound(a,u))}return i}gs(e,t){return zn(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next($C)}getMinOffset(e,t){return P.mapArray(this.ts(t),n=>this.ns(e,n).next(s=>s||$(44426))).next($C)}}function WC(r){return Xe(r,Mo)}function Os(r){return Xe(r,po)}function Ki(r){return Xe(r,ah)}function Fs(r){return Xe(r,Co)}function $C(r){H(r.length!==0,28825);let e=r[0].indexState.offset,t=e.largestBatchId;for(let n=1;n<r.length;n++){const s=r[n].indexState.offset;vl(s,e)<0&&(e=s),t<s.largestBatchId&&(t=s.largestBatchId)}return new Vt(e.readTime,e.documentKey,t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fn{constructor(e){this.ys=e}next(){return this.ys+=2,this.ys}static ws(){return new Fn(0)}static bs(){return new Fn(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kP{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.Ss(e).next(t=>{const n=new Fn(t.highestTargetId);return t.highestTargetId=n.next(),this.vs(e,t).next(()=>t.highestTargetId)})}getLastRemoteSnapshotVersion(e){return this.Ss(e).next(t=>ee.fromTimestamp(new _e(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(e){return this.Ss(e).next(t=>t.highestListenSequenceNumber)}setTargetsMetadata(e,t,n){return this.Ss(e).next(s=>(s.highestListenSequenceNumber=t,n&&(s.lastRemoteSnapshotVersion=n.toTimestamp()),t>s.highestListenSequenceNumber&&(s.highestListenSequenceNumber=t),this.vs(e,s)))}addTargetData(e,t){return this.Ds(e,t).next(()=>this.Ss(e).next(n=>(n.targetCount+=1,this.xs(t,n),this.vs(e,n))))}updateTargetData(e,t){return this.Ds(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next(()=>Ls(e).delete(t.targetId)).next(()=>this.Ss(e)).next(n=>(H(n.targetCount>0,8065),n.targetCount-=1,this.vs(e,n)))}removeTargets(e,t,n){let s=0;const i=[];return Ls(e).Hn((o,a)=>{const u=to(this.serializer,a);u.sequenceNumber<=t&&n.get(u.targetId)===null&&(s++,i.push(this.removeTargetData(e,u)))}).next(()=>P.waitFor(i)).next(()=>s)}forEachTarget(e,t){return Ls(e).Hn((n,s)=>{const i=to(this.serializer,s);t(i)})}Ss(e){return YC(e).get(Ru).next(t=>(H(t!==null,2888),t))}vs(e,t){return YC(e).put(Ru,t)}Ds(e,t){return Ls(e).put(P_(this.serializer,t))}xs(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.Ss(e).next(t=>t.targetCount)}getTargetData(e,t){const n=Bc(t),s=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let i=null;return Ls(e).Hn({range:s,index:__},(o,a,u)=>{const B=to(this.serializer,a);rh(t,B.target)&&(i=B,u.done())}).next(()=>i)}addMatchingKeys(e,t,n){const s=[],i=nr(e);return t.forEach(o=>{const a=ht(o.path);s.push(i.put({targetId:n,path:a})),s.push(this.referenceDelegate.addReference(e,n,o))}),P.waitFor(s)}removeMatchingKeys(e,t,n){const s=nr(e);return P.forEach(t,i=>{const o=ht(i.path);return P.waitFor([s.delete([n,o]),this.referenceDelegate.removeReference(e,n,i)])})}removeMatchingKeysForTargetId(e,t){const n=nr(e),s=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(s)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),s=nr(e);let i=ce();return s.Hn({range:n,jn:!0},(o,a,u)=>{const B=nn(o[1]),l=new J(B);i=i.add(l)}).next(()=>i)}containsKey(e,t){const n=ht(t.path),s=IDBKeyRange.bound([n],[Hg(n)],!1,!0);let i=0;return nr(e).Hn({index:oh,jn:!0,range:s},([o,a],u,B)=>{o!==0&&(i++,B.done())}).next(()=>i>0)}ye(e,t){return Ls(e).get(t).next(n=>n?to(this.serializer,n):null)}}function Ls(r){return Xe(r,si)}function YC(r){return Xe(r,Yr)}function nr(r){return Xe(r,ii)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xP{constructor(e,t){this.db=e,this.garbageCollector=Jm(this,t)}ir(e){const t=this.Cs(e);return this.db.getTargetCache().getTargetCount(e).next(n=>t.next(s=>n+s))}Cs(e){let t=0;return this.sr(e,n=>{t++}).next(()=>t)}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}sr(e,t){return this.Fs(e,(n,s)=>t(s))}addReference(e,t,n){return Ga(e,n)}removeReference(e,t,n){return Ga(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return Ga(e,t)}Os(e,t){return function(s,i){let o=!1;return N_(s).Jn(a=>S_(s,a,i).next(u=>(u&&(o=!0),P.resolve(!u)))).next(()=>o)}(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),s=[];let i=0;return this.Fs(e,(o,a)=>{if(a<=t){const u=this.Os(e,o).next(B=>{if(!B)return i++,n.getEntry(e,o).next(()=>(n.removeEntry(o,ee.min()),nr(e).delete(function(d){return[0,ht(d.path)]}(o))))});s.push(u)}}).next(()=>P.waitFor(s)).next(()=>n.apply(e)).next(()=>i)}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return Ga(e,t)}Fs(e,t){const n=nr(e);let s,i=Tt.wn;return n.Hn({index:oh},([o,a],{path:u,sequenceNumber:B})=>{o===0?(i!==Tt.wn&&t(new J(nn(s)),i),i=B,s=u):i=Tt.wn}).next(()=>{i!==Tt.wn&&t(new J(nn(s)),i)})}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function Ga(r,e){return nr(r).put(function(n,s){return{targetId:0,path:ht(n.path),sequenceNumber:s}}(e,r.currentSequenceNumber))}// Copyright 2024 Google LLC* @license
function L_(r,e){var n;let t=e;for(const s of r.stages)t=VP({serializer:r.serializer,serverTimestampBehavior:(n=r.listenOptions)==null?void 0:n.serverTimestampBehavior},s,t);return t}function pc(r,e){return L_(r,[e]).length>0}function k_(r,e){return ke(r)?pc(r,e):tc(r,e)}function VP(r,e,t){if(e instanceof sa)return function(s,i,o){return o.filter(a=>a.isFoundDocument()&&`/${a.key.getCollectionPath().canonicalString()}`===i.hr)}(0,e,t);if(e instanceof oa)return function(s,i,o){return o.filter(a=>{const u=fo(se(i.condition).evaluate(s,a));return u!==void 0&&qt(u,vt)})}(r,e,t);if(e instanceof ia)return function(s,i,o){return o.filter(a=>a.isFoundDocument()&&a.key.getCollectionPath().lastSegment()===i.collectionId)}(0,e,t);if(e instanceof oc)return function(s,i,o){return o.filter(a=>a.isFoundDocument())}(0,0,t);if(e instanceof ac)return function(s,i,o){return o.filter(a=>a.isFoundDocument()&&i.Pr.has(a.key.path.toStringWithLeadingSlash()))}(0,e,t);if(e instanceof Er)return function(s,i,o){return o.slice(0,i.limit)}(0,e,t);if(e instanceof tn)return function(s,i,o){const a=i.orderings.map(u=>({Ms:se(u.expr),direction:u.direction}));return[...o].sort((u,B)=>{for(const{Ms:l,direction:d}of a){const C=fo(l.evaluate(s,u)),m=fo(l.evaluate(s,B)),y=dt(C??un,m??un);if(y!==0)return d==="ascending"?y:-y}return 0})}(r,e,t);throw new Error(`Unknown stage: ${e._name}`)}function YB(r){const e=function(n){for(let s=n.stages.length-1;s>=0;s--){const i=n.stages[s];if(i instanceof tn)return i.orderings}throw new Error("Pipeline must contain at least one Sort stage")}(r);return(t,n)=>{for(const s of e){const i=fo(se(s.expr).evaluate({serializer:r.serializer},t)),o=fo(se(s.expr).evaluate({serializer:r.serializer},n)),a=dt(i||un,o||un);if(a!==0)return s.direction==="ascending"?a:-a}return 0}}function BB(r){for(let e=r.stages.length-1;e>=0;e--){const t=r.stages[e];if(t instanceof Er)return{limit:t.limit}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class x_{constructor(){this.changes=new xn(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Se.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?P.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class MP{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return Qn(e).put(n)}removeEntry(e,t,n){return Qn(e).delete(function(i,o){const a=i.path.toArray();return[a.slice(0,a.length-2),a[a.length-2],Pu(o),a[a.length-1]]}(t,n))}updateMetadata(e,t){return this.getMetadata(e).next(n=>(n.byteSize+=t,this.Ns(e,n)))}getEntry(e,t){let n=Se.newInvalidDocument(t);return Qn(e).Hn({index:su,range:IDBKeyRange.only(Ji(t))},(s,i)=>{n=this.Ls(t,i)}).next(()=>n)}Bs(e,t){let n={size:0,document:Se.newInvalidDocument(t)};return Qn(e).Hn({index:su,range:IDBKeyRange.only(Ji(t))},(s,i)=>{n={document:this.Ls(t,i),size:vu(i)}}).next(()=>n)}getEntries(e,t){let n=ze();return this.Us(e,t,(s,i)=>{const o=this.Ls(s,i);n=n.insert(s,o)}).next(()=>n)}getAllEntries(e){let t=ze();return Qn(e).Hn((n,s)=>{const i=this.Ls(J.fromSegments(s.prefixPath.concat(s.collectionGroup,s.documentId)),s);t=t.insert(i.key,i)}).next(()=>t)}ks(e,t){let n=ze(),s=new Te(J.comparator);return this.Us(e,t,(i,o)=>{const a=this.Ls(i,o);n=n.insert(i,a),s=s.insert(i,vu(o))}).next(()=>({documents:n,qs:s}))}Us(e,t,n){if(t.isEmpty())return P.resolve();let s=new Ee(ep);t.forEach(u=>s=s.add(u));const i=IDBKeyRange.bound(Ji(s.first()),Ji(s.last())),o=s.getIterator();let a=o.getNext();return Qn(e).Hn({index:su,range:i},(u,B,l)=>{const d=J.fromSegments([...B.prefixPath,B.collectionGroup,B.documentId]);for(;a&&ep(a,d)<0;)n(a,null),a=o.getNext();a&&a.isEqual(d)&&(n(a,B),a=o.hasNext()?o.getNext():null),a?l.Kn(Ji(a)):l.done()}).next(()=>{for(;a;)n(a,null),a=o.hasNext()?o.getNext():null})}getDocumentsMatchingQuery(e,t,n,s,i){const o=ke(t)?he.fromString(aa(t)):t.path,a=[o.popLast().toArray(),o.lastSegment(),Pu(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],u=[o.popLast().toArray(),o.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return Qn(e).Qn(IDBKeyRange.bound(a,u,!0)).next(B=>{i==null||i.incrementDocumentReadCount(B.length);let l=ze();for(const d of B){const C=this.Ls(J.fromSegments(d.prefixPath.concat(d.collectionGroup,d.documentId)),d);C.isFoundDocument()&&(k_(t,C)||s.has(C.key))&&(l=l.insert(C.key,C))}return l})}getAllFromCollectionGroup(e,t,n,s){let i=ze();const o=ZC(t,n),a=ZC(t,Vt.max());return Qn(e).Hn({index:m_,range:IDBKeyRange.bound(o,a,!0)},(u,B,l)=>{const d=this.Ls(J.fromSegments(B.prefixPath.concat(B.collectionGroup,B.documentId)),B);i=i.insert(d.key,d),i.size===s&&l.done()}).next(()=>i)}newChangeBuffer(e){return new GP(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next(t=>t.byteSize)}getMetadata(e){return XC(e).get(qB).next(t=>(H(!!t,20021),t))}Ns(e,t){return XC(e).put(qB,t)}Ls(e,t){if(t){const n=TP(this.serializer,t);if(!(n.isNoDocument()&&n.version.isEqual(ee.min())))return n}return Se.newInvalidDocument(e)}}function V_(r){return new MP(r)}class GP extends x_{constructor(e,t){super(),this.$s=e,this.trackRemovals=t,this.Ks=new xn(n=>n.toString(),(n,s)=>n.isEqual(s))}applyChanges(e){const t=[];let n=0,s=new Ee((i,o)=>ie(i.canonicalString(),o.canonicalString()));return this.changes.forEach((i,o)=>{const a=this.Ks.get(i);if(t.push(this.$s.removeEntry(e,i,a.readTime)),o.isValidDocument()){const u=VC(this.$s.serializer,o);s=s.add(i.path.popLast());const B=vu(u);n+=B-a.size,t.push(this.$s.addEntry(e,i,u))}else if(n-=a.size,this.trackRemovals){const u=VC(this.$s.serializer,o.convertToNoDocument(ee.min()));t.push(this.$s.addEntry(e,i,u))}}),s.forEach(i=>{t.push(this.$s.indexManager.addToCollectionParentIndex(e,i))}),t.push(this.$s.updateMetadata(e,n)),P.waitFor(t)}getFromCache(e,t){return this.$s.Bs(e,t).next(n=>(this.Ks.set(t,{size:n.size,readTime:n.document.readTime}),n.document))}getAllFromCache(e,t){return this.$s.ks(e,t).next(({documents:n,qs:s})=>(s.forEach((i,o)=>{this.Ks.set(i,{size:o,readTime:n.get(i).readTime})}),n))}}function XC(r){return Xe(r,Vo)}function Qn(r){return Xe(r,Au)}function Ji(r){const e=r.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function ZC(r,e){const t=e.documentKey.path.toArray();return[r,Pu(e.readTime),t.slice(0,t.length-2),t.length>0?t[t.length-1]:""]}function ep(r,e){const t=r.path.toArray(),n=e.path.toArray();let s=0;for(let i=0;i<t.length-2&&i<n.length-2;++i)if(s=ie(t[i],n[i]),s)return s;return s=ie(t.length,n.length),s||(s=ie(t[t.length-2],n[n.length-2]),s||ie(t[t.length-1],n[n.length-1]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UP{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M_{constructor(e,t,n,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=s}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next(s=>(n=s,this.remoteDocumentCache.getEntry(e,t))).next(s=>(n!==null&&uo(n.mutation,s,wt.empty(),_e.now()),s))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(n=>this.getLocalViewOfDocuments(e,n,ce()).next(()=>n))}getLocalViewOfDocuments(e,t,n=ce()){const s=Ut();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,n).next(i=>{let o=Vr();return i.forEach((a,u)=>{o=o.insert(a,u.overlayedDocument)}),o}))}getOverlayedDocuments(e,t){const n=Ut();return this.populateOverlays(e,n,t).next(()=>this.computeViews(e,t,n,ce()))}populateOverlays(e,t,n){const s=[];return n.forEach(i=>{t.has(i)||s.push(i)}),this.documentOverlayCache.getOverlays(e,s).next(i=>{i.forEach((o,a)=>{t.set(o,a)})})}computeViews(e,t,n,s){let i=ze();const o=Bo(),a=function(){return Bo()}();return t.forEach((u,B)=>{const l=n.get(B.key);s.has(B.key)&&(l===void 0||l.mutation instanceof kn)?i=i.insert(B.key,B):l!==void 0?(o.set(B.key,l.mutation.getFieldMask()),uo(l.mutation,B,l.mutation.getFieldMask(),_e.now())):o.set(B.key,wt.empty())}),this.recalculateAndSaveOverlays(e,i).next(u=>(u.forEach((B,l)=>o.set(B,l)),t.forEach((B,l)=>a.set(B,new UP(l,o.get(B)??null))),a))}recalculateAndSaveOverlays(e,t){const n=Bo();let s=new Te((o,a)=>o-a),i=ce();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(o=>{for(const a of o)a.keys().forEach(u=>{const B=t.get(u);if(B===null)return;let l=n.get(u)||wt.empty();l=a.applyToLocalView(B,l),n.set(u,l);const d=(s.get(a.batchId)||ce()).add(u);s=s.insert(a.batchId,d)})}).next(()=>{const o=[],a=s.getReverseIterator();for(;a.hasNext();){const u=a.getNext(),B=u.key,l=u.value,d=Im();l.forEach(C=>{if(!i.has(C)){const m=im(t.get(C),n.get(C));m!==null&&d.set(C,m),i=i.add(C)}}),o.push(this.documentOverlayCache.saveOverlays(e,B,d))}return P.waitFor(o)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(n=>this.recalculateAndSaveOverlays(e,n))}getDocumentsMatchingQuery(e,t,n,s){return ke(t)?this.getDocumentsMatchingPipeline(e,t,n,s):TA(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Sl(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,s):this.getDocumentsMatchingCollectionQuery(e,t,n,s)}getNextDocuments(e,t,n,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,s).next(i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,s-i.size):P.resolve(Ut());let a=ti,u=i;return o.next(B=>P.forEach(B,(l,d)=>(a<d.largestBatchId&&(a=d.largestBatchId),i.get(l)?P.resolve():this.remoteDocumentCache.getEntry(e,l).next(C=>{u=u.insert(l,C)}))).next(()=>this.populateOverlays(e,B,i)).next(()=>this.computeViews(e,u,B,ce())).next(l=>({batchId:a,changes:Em(l)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new J(t)).next(n=>{let s=Vr();return n.isFoundDocument()&&(s=s.insert(n.key,n)),s})}getDocumentsMatchingCollectionGroupQuery(e,t,n,s){const i=t.collectionGroup;let o=Vr();return this.indexManager.getCollectionParents(e,i).next(a=>P.forEach(a,u=>{const B=function(d,C){return new ms(C,null,d.explicitOrderBy.slice(),d.filters.slice(),d.limit,d.limitType,d.startAt,d.endAt)}(t,u.child(i));return this.getDocumentsMatchingCollectionQuery(e,B,n,s).next(l=>{l.forEach((d,C)=>{o=o.insert(d,C)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,t,n,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next(o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,s))).next(o=>this.retrieveMatchingLocalDocuments(i,o,a=>tc(t,a)))}getDocumentsMatchingPipeline(e,t,n,s){if(wn(t)==="collection_group"){const i=$l(t);let o=Vr();return this.indexManager.getCollectionParents(e,i).next(a=>P.forEach(a,u=>{const B=function(d,C){const m=d.stages.map(y=>y instanceof ia?new sa(C.canonicalString(),{}):y);return new lt(d.serializer,m)}(t,u.child(i));return this.getDocumentsMatchingPipeline(e,B,n,s).next(l=>{l.forEach((d,C)=>{o=o.insert(d,C)})})}).next(()=>o))}{let i;return this.getOverlaysForPipeline(e,t,n.largestBatchId).next(o=>{switch(i=o,wn(t)){case"collection":return this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,s);case"documents":let a=ce();for(const u of yu(t))a=a.add(J.fromPath(u));return this.remoteDocumentCache.getEntries(e,a);case"database":return this.remoteDocumentCache.getAllEntries(e);default:throw new G("invalid-argument",`Invalid pipeline source to execute offline: ${Tn(t)}`)}}).next(o=>this.retrieveMatchingLocalDocuments(i,o,a=>pc(t,a)))}}retrieveMatchingLocalDocuments(e,t,n){e.forEach((i,o)=>{const a=o.getKey();t.get(a)===null&&(t=t.insert(a,Se.newInvalidDocument(a)))});let s=Vr();return t.forEach((i,o)=>{const a=e.get(i);a!==void 0&&uo(a.mutation,o,wt.empty(),_e.now()),n(o)&&(s=s.insert(i,o))}),s}getOverlaysForPipeline(e,t,n){switch(wn(t)){case"collection":return this.documentOverlayCache.getOverlaysForCollection(e,he.fromString(aa(t)),n);case"collection_group":throw new G("invalid-argument",`Unexpected collection group pipeline: ${Tn(t)}`);case"documents":return this.documentOverlayCache.getOverlays(e,yu(t).map(s=>J.fromPath(s)));case"database":return this.documentOverlayCache.getAllOverlays(e,n);default:throw new G("invalid-argument",`Failed to get overlays for pipeline: ${Tn(t)}`)}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HP{constructor(e){this.serializer=e,this.Qs=new Map,this.Ws=new Map}getBundleMetadata(e,t){return P.resolve(this.Qs.get(t))}saveBundleMetadata(e,t){return this.Qs.set(t.id,function(s){return{id:s.id,version:s.version,createTime:rt(s.createTime)}}(t)),P.resolve()}getNamedQuery(e,t){return P.resolve(this.Ws.get(t))}saveNamedQuery(e,t){return this.Ws.set(t.name,function(s){return{name:s.name,query:b_(s.bundledQuery),readTime:rt(s.readTime)}}(t)),P.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qP{constructor(){this.overlays=new Te(J.comparator),this.Gs=new Map}getOverlay(e,t){return P.resolve(this.overlays.get(t))}getOverlays(e,t){const n=Ut();return P.forEach(t,s=>this.getOverlay(e,s).next(i=>{i!==null&&n.set(s,i)})).next(()=>n)}getAllOverlays(e,t){const n=Ut();return this.overlays.forEach((s,i)=>{i.largestBatchId>t&&n.set(s,i)}),P.resolve(n)}saveOverlays(e,t,n){return n.forEach((s,i)=>{this.Zr(e,t,i)}),P.resolve()}removeOverlaysForBatchId(e,t,n){const s=this.Gs.get(n);return s!==void 0&&(s.forEach(i=>this.overlays=this.overlays.remove(i)),this.Gs.delete(n)),P.resolve()}getOverlaysForCollection(e,t,n){const s=Ut(),i=t.length+1,o=new J(t.child("")),a=this.overlays.getIteratorFrom(o);for(;a.hasNext();){const u=a.getNext().value,B=u.getKey();if(!t.isPrefixOf(B.path))break;B.path.length===i&&u.largestBatchId>n&&s.set(u.getKey(),u)}return P.resolve(s)}getOverlaysForCollectionGroup(e,t,n,s){let i=new Te((B,l)=>B-l);const o=this.overlays.getIterator();for(;o.hasNext();){const B=o.getNext().value;if(B.getKey().getCollectionGroup()===t&&B.largestBatchId>n){let l=i.get(B.largestBatchId);l===null&&(l=Ut(),i=i.insert(B.largestBatchId,l)),l.set(B.getKey(),B)}}const a=Ut(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach((B,l)=>a.set(B,l)),!(a.size()>=s)););return P.resolve(a)}Zr(e,t,n){const s=this.overlays.get(n.key);if(s!==null){const o=this.Gs.get(s.largestBatchId).delete(n.key);this.Gs.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(n.key,new Bh(t,n));let i=this.Gs.get(t);i===void 0&&(i=ce(),this.Gs.set(t,i)),this.Gs.set(t,i.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jP{constructor(){this.sessionToken=Fe.EMPTY_BYTE_STRING}getSessionToken(e){return P.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,P.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dh{constructor(){this.zs=new Ee(et.js),this.Hs=new Ee(et.Js)}isEmpty(){return this.zs.isEmpty()}addReference(e,t){const n=new et(e,t);this.zs=this.zs.add(n),this.Hs=this.Hs.add(n)}Ys(e,t){e.forEach(n=>this.addReference(n,t))}removeReference(e,t){this.Zs(new et(e,t))}Xs(e,t){e.forEach(n=>this.removeReference(n,t))}e_(e){const t=new J(new he([])),n=new et(t,e),s=new et(t,e+1),i=[];return this.Hs.forEachInRange([n,s],o=>{this.Zs(o),i.push(o.key)}),i}t_(){this.zs.forEach(e=>this.Zs(e))}Zs(e){this.zs=this.zs.delete(e),this.Hs=this.Hs.delete(e)}n_(e){const t=new J(new he([])),n=new et(t,e),s=new et(t,e+1);let i=ce();return this.Hs.forEachInRange([n,s],o=>{i=i.add(o.key)}),i}containsKey(e){const t=new et(e,0),n=this.zs.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class et{constructor(e,t){this.key=e,this.r_=t}static js(e,t){return J.comparator(e.key,t.key)||ie(e.r_,t.r_)}static Js(e,t){return ie(e.r_,t.r_)||J.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class KP{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Gr=1,this.i_=new Ee(et.js)}checkEmpty(e){return P.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,s){const i=this.Gr;this.Gr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new sh(i,t,n,s);this.mutationQueue.push(o);for(const a of s)this.i_=this.i_.add(new et(a.key,i)),this.indexManager.addToCollectionParentIndex(e,a.key.path.popLast());return P.resolve(o)}lookupMutationBatch(e,t){return P.resolve(this.s_(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=this.__(n),i=s<0?0:s;return P.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return P.resolve(this.mutationQueue.length===0?Qr:this.Gr-1)}getAllMutationBatches(e){return P.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new et(t,0),s=new et(t,Number.POSITIVE_INFINITY),i=[];return this.i_.forEachInRange([n,s],o=>{const a=this.s_(o.r_);i.push(a)}),P.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new Ee(ie);return t.forEach(s=>{const i=new et(s,0),o=new et(s,Number.POSITIVE_INFINITY);this.i_.forEachInRange([i,o],a=>{n=n.add(a.r_)})}),P.resolve(this.o_(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1;let i=n;J.isDocumentKey(i)||(i=i.child(""));const o=new et(new J(i),0);let a=new Ee(ie);return this.i_.forEachWhile(u=>{const B=u.key.path;return!!n.isPrefixOf(B)&&(B.length===s&&(a=a.add(u.r_)),!0)},o),P.resolve(this.o_(a))}o_(e){const t=[];return e.forEach(n=>{const s=this.s_(n);s!==null&&t.push(s)}),t}removeMutationBatch(e,t){H(this.a_(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let n=this.i_;return P.forEach(t.mutations,s=>{const i=new et(s.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.i_=n})}Hr(e){}containsKey(e,t){const n=new et(t,0),s=this.i_.firstAfterOrEqual(n);return P.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,P.resolve()}a_(e,t){return this.__(e)}__(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}s_(e){const t=this.__(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class JP{constructor(e){this.u_=e,this.docs=function(){return new Te(J.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,s=this.docs.get(n),i=s?s.size:0,o=this.u_(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return P.resolve(n?n.document.mutableCopy():Se.newInvalidDocument(t))}getEntries(e,t){let n=ze();return t.forEach(s=>{const i=this.docs.get(s);n=n.insert(s,i?i.document.mutableCopy():Se.newInvalidDocument(s))}),P.resolve(n)}getAllEntries(e){let t=ze();return this.docs.forEach((n,s)=>{t=t.insert(n,s.document)}),P.resolve(t)}getDocumentsMatchingQuery(e,t,n,s){let i,o;ke(t)?(i=he.fromString(aa(t)),o=l=>pc(t,l)):(i=t.path,o=l=>tc(t,l));let a=ze();const u=new J(i.child("__id-9223372036854775808__")),B=this.docs.getIteratorFrom(u);for(;B.hasNext();){const{key:l,value:{document:d}}=B.getNext();if(!i.isPrefixOf(l.path))break;l.path.length>i.length+1||vl(Cm(d),n)<=0||(s.has(d.key)||o(d))&&(a=a.insert(d.key,d.mutableCopy()))}return P.resolve(a)}getAllFromCollectionGroup(e,t,n,s){$(9500)}c_(e,t){return P.forEach(this.docs,n=>t(n))}newChangeBuffer(e){return new zP(this)}getSize(e){return P.resolve(this.size)}}class zP extends x_{constructor(e){super(),this.$s=e}applyChanges(e){const t=[];return this.changes.forEach((n,s)=>{s.isValidDocument()?t.push(this.$s.addEntry(e,s)):this.$s.removeEntry(n)}),P.waitFor(t)}getFromCache(e,t){return this.$s.getEntry(e,t)}getAllFromCache(e,t){return this.$s.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QP{constructor(e){this.persistence=e,this.l_=new xn(t=>Bc(t),rh),this.lastRemoteSnapshotVersion=ee.min(),this.highestTargetId=0,this.E_=0,this.h_=new dh,this.targetCount=0,this.T_=Fn.ws()}forEachTarget(e,t){return this.l_.forEach((n,s)=>t(s)),P.resolve()}getLastRemoteSnapshotVersion(e){return P.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return P.resolve(this.E_)}allocateTargetId(e){return this.highestTargetId=this.T_.next(),P.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.E_&&(this.E_=t),P.resolve()}Ds(e){this.l_.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.T_=new Fn(t),this.highestTargetId=t),e.sequenceNumber>this.E_&&(this.E_=e.sequenceNumber)}addTargetData(e,t){return this.Ds(t),this.targetCount+=1,P.resolve()}updateTargetData(e,t){return this.Ds(t),P.resolve()}removeTargetData(e,t){return this.l_.delete(t.target),this.h_.e_(t.targetId),this.targetCount-=1,P.resolve()}removeTargets(e,t,n){let s=0;const i=[];return this.l_.forEach((o,a)=>{a.sequenceNumber<=t&&n.get(a.targetId)===null&&(this.l_.delete(o),i.push(this.removeMatchingKeysForTargetId(e,a.targetId)),s++)}),P.waitFor(i).next(()=>s)}getTargetCount(e){return P.resolve(this.targetCount)}getTargetData(e,t){const n=this.l_.get(t)||null;return P.resolve(n)}addMatchingKeys(e,t,n){return this.h_.Ys(t,n),P.resolve()}removeMatchingKeys(e,t,n){this.h_.Xs(t,n);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach(o=>{i.push(s.markPotentiallyOrphaned(e,o))}),P.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.h_.e_(t),P.resolve()}getMatchingKeysForTargetId(e,t){const n=this.h_.n_(t);return P.resolve(n)}containsKey(e,t){return P.resolve(this.h_.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fh{constructor(e,t){this.P_={},this.overlays={},this.I_=new Tt(0),this.R_=!1,this.R_=!0,this.A_=new jP,this.referenceDelegate=e(this),this.V_=new QP(this),this.indexManager=new FP,this.remoteDocumentCache=function(s){return new JP(s)}(n=>this.referenceDelegate.d_(n)),this.serializer=new v_(t),this.f_=new HP(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.R_=!1,Promise.resolve()}get started(){return this.R_}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new qP,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.P_[e.toKey()];return n||(n=new KP(t,this.referenceDelegate),this.P_[e.toKey()]=n),n}getGlobalsCache(){return this.A_}getTargetCache(){return this.V_}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.f_}runTransaction(e,t,n){U("MemoryPersistence","Starting transaction:",e);const s=new WP(this.I_.next());return this.referenceDelegate.m_(),n(s).next(i=>this.referenceDelegate.p_(s).next(()=>i)).toPromise().then(i=>(s.raiseOnCommittedEvent(),i))}g_(e,t){return P.or(Object.values(this.P_).map(n=>()=>n.containsKey(e,t)))}}class WP extends Hm{constructor(e){super(),this.currentSequenceNumber=e}}class gc{constructor(e){this.persistence=e,this.y_=new dh,this.w_=null}static b_(e){return new gc(e)}get S_(){if(this.w_)return this.w_;throw $(60996)}addReference(e,t,n){return this.y_.addReference(n,t),this.S_.delete(n.toString()),P.resolve()}removeReference(e,t,n){return this.y_.removeReference(n,t),this.S_.add(n.toString()),P.resolve()}markPotentiallyOrphaned(e,t){return this.S_.add(t.toString()),P.resolve()}removeTarget(e,t){this.y_.e_(t.targetId).forEach(s=>this.S_.add(s.toString()));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next(s=>{s.forEach(i=>this.S_.add(i.toString()))}).next(()=>n.removeTargetData(e,t))}m_(){this.w_=new Set}p_(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return P.forEach(this.S_,n=>{const s=J.fromPath(n);return this.v_(e,s).next(i=>{i||t.removeEntry(s,ee.min())})}).next(()=>(this.w_=null,t.apply(e)))}updateLimboDocument(e,t){return this.v_(e,t).next(n=>{n?this.S_.delete(t.toString()):this.S_.add(t.toString())})}d_(e){return 0}v_(e,t){return P.or([()=>P.resolve(this.y_.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.g_(e,t)])}}class Su{constructor(e,t){this.persistence=e,this.D_=new xn(n=>ht(n.path),(n,s)=>n.isEqual(s)),this.garbageCollector=Jm(this,t)}static b_(e,t){return new Su(e,t)}m_(){}p_(e){return P.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}ir(e){const t=this.Cs(e);return this.persistence.getTargetCache().getTargetCount(e).next(n=>t.next(s=>n+s))}Cs(e){let t=0;return this.sr(e,n=>{t++}).next(()=>t)}sr(e,t){return P.forEach(this.D_,(n,s)=>this.Os(e,n,s).next(i=>i?P.resolve():t(s)))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.c_(e,o=>this.Os(e,o,t).next(a=>{a||(n++,i.removeEntry(o,ee.min()))})).next(()=>i.apply(e)).next(()=>n)}markPotentiallyOrphaned(e,t){return this.D_.set(t,e.currentSequenceNumber),P.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.D_.set(n,e.currentSequenceNumber),P.resolve()}removeReference(e,t,n){return this.D_.set(n,e.currentSequenceNumber),P.resolve()}updateLimboDocument(e,t){return this.D_.set(t,e.currentSequenceNumber),P.resolve()}d_(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=Ya(e.data.value)),t}Os(e,t,n){return P.or([()=>this.persistence.g_(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.D_.get(t);return P.resolve(s!==void 0&&s>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $P{constructor(e){this.serializer=e}Nn(e,t,n,s){const i=new rc("createOrUpgrade",t);n<1&&s>=1&&(function(u){u.createObjectStore(ca)}(e),function(u){u.createObjectStore(xo,{keyPath:eP}),u.createObjectStore(jt,{keyPath:kC,autoIncrement:!0}).createIndex(Kr,xC,{unique:!0}),u.createObjectStore(ri)}(e),tp(e),function(u){u.createObjectStore(xr)}(e));let o=P.resolve();return n<3&&s>=3&&(n!==0&&(function(u){u.deleteObjectStore(ii),u.deleteObjectStore(si),u.deleteObjectStore(Yr)}(e),tp(e)),o=o.next(()=>function(u){const B=u.store(Yr),l={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:ee.min().toTimestamp(),targetCount:0};return B.put(Ru,l)}(i))),n<4&&s>=4&&(n!==0&&(o=o.next(()=>function(u,B){return B.store(jt).Qn().next(d=>{u.deleteObjectStore(jt),u.createObjectStore(jt,{keyPath:kC,autoIncrement:!0}).createIndex(Kr,xC,{unique:!0});const C=B.store(jt),m=d.map(y=>C.put(y));return P.waitFor(m)})}(e,i))),o=o.next(()=>{(function(u){u.createObjectStore(oi,{keyPath:cP})})(e)})),n<5&&s>=5&&(o=o.next(()=>this.x_(i))),n<6&&s>=6&&(o=o.next(()=>(function(u){u.createObjectStore(Vo)}(e),this.C_(i)))),n<7&&s>=7&&(o=o.next(()=>this.F_(i))),n<8&&s>=8&&(o=o.next(()=>this.O_(e,i))),n<9&&s>=9&&(o=o.next(()=>{(function(u){u.objectStoreNames.contains("remoteDocumentChanges")&&u.deleteObjectStore("remoteDocumentChanges")})(e)})),n<10&&s>=10&&(o=o.next(()=>this.M_(i))),n<11&&s>=11&&(o=o.next(()=>{(function(u){u.createObjectStore(lc,{keyPath:BP})})(e),function(u){u.createObjectStore(hc,{keyPath:lP})}(e)})),n<12&&s>=12&&(o=o.next(()=>{(function(u){const B=u.createObjectStore(dc,{keyPath:mP});B.createIndex(KB,_P,{unique:!1}),B.createIndex(D_,EP,{unique:!1})})(e)})),n<13&&s>=13&&(o=o.next(()=>function(u){const B=u.createObjectStore(Au,{keyPath:nP});B.createIndex(su,rP),B.createIndex(m_,sP)}(e)).next(()=>this.N_(e,i)).next(()=>e.deleteObjectStore(xr))),n<14&&s>=14&&(o=o.next(()=>this.L_(e,i))),n<15&&s>=15&&(o=o.next(()=>function(u){u.createObjectStore(ah,{keyPath:hP,autoIncrement:!0}).createIndex(jB,dP,{unique:!1}),u.createObjectStore(Co,{keyPath:fP}).createIndex(E_,CP,{unique:!1}),u.createObjectStore(po,{keyPath:pP}).createIndex(I_,gP,{unique:!1})}(e))),n<16&&s>=16&&(o=o.next(()=>{t.objectStore(Co).clear()}).next(()=>{t.objectStore(po).clear()})),n<17&&s>=17&&(o=o.next(()=>{(function(u){u.createObjectStore(uh,{keyPath:IP})})(e)})),n<18&&s>=18&&Op()&&(o=o.next(()=>{t.objectStore(Co).clear()}).next(()=>{t.objectStore(po).clear()})),o}C_(e){let t=0;return e.store(xr).Hn((n,s)=>{t+=vu(s)}).next(()=>{const n={byteSize:t};return e.store(Vo).put(qB,n)})}x_(e){const t=e.store(xo),n=e.store(jt);return t.Qn().next(s=>P.forEach(s,i=>{const o=IDBKeyRange.bound([i.userId,Qr],[i.userId,i.lastAcknowledgedBatchId]);return n.Qn(Kr,o).next(a=>P.forEach(a,u=>{H(u.userId===i.userId,18650,"Cannot process batch from unexpected user",{batchId:u.batchId});const B=Gr(this.serializer,u);return R_(e,i.userId,B).next(()=>{})}))}))}F_(e){const t=e.store(ii),n=e.store(xr);return e.store(Yr).get(Ru).next(s=>{const i=[];return n.Hn((o,a)=>{const u=new he(o),B=function(d){return[0,ht(d)]}(u);i.push(t.get(B).next(l=>l?P.resolve():(d=>t.put({targetId:0,path:ht(d),sequenceNumber:s.highestListenSequenceNumber}))(u)))}).next(()=>P.waitFor(i))})}O_(e,t){e.createObjectStore(Mo,{keyPath:uP});const n=t.store(Mo),s=new hh,i=o=>{if(s.add(o)){const a=o.lastSegment(),u=o.popLast();return n.put({collectionId:a,parent:ht(u)})}};return t.store(xr).Hn({jn:!0},(o,a)=>{const u=new he(o);return i(u.popLast())}).next(()=>t.store(ri).Hn({jn:!0},([o,a,u],B)=>{const l=nn(a);return i(l.popLast())}))}M_(e){const t=e.store(si);return t.Hn((n,s)=>{const i=to(this.serializer,s),o=P_(this.serializer,i);return t.put(o)})}N_(e,t){const n=t.store(xr),s=[];return n.Hn((i,o)=>{const a=t.store(Au),u=function(d){return d.document?new J(he.fromString(d.document.name).popFirst(5)):d.noDocument?J.fromSegments(d.noDocument.path):d.unknownDocument?J.fromSegments(d.unknownDocument.path):$(36783)}(o).path.toArray(),B={prefixPath:u.slice(0,u.length-2),collectionGroup:u[u.length-2],documentId:u[u.length-1],readTime:o.readTime||[0,0],unknownDocument:o.unknownDocument,noDocument:o.noDocument,document:o.document,hasCommittedMutations:!!o.hasCommittedMutations};s.push(a.put(B))}).next(()=>P.waitFor(s))}L_(e,t){const n=t.store(jt),s=V_(this.serializer),i=new fh(gc.b_,this.serializer.$r);return n.Qn().next(o=>{const a=new Map;return o.forEach(u=>{let B=a.get(u.userId)??ce();Gr(this.serializer,u).keys().forEach(l=>B=B.add(l)),a.set(u.userId,B)}),P.forEach(a,(u,B)=>{const l=new ct(B),d=Cc.Qr(this.serializer,l),C=i.getIndexManager(l),m=fc.Qr(l,this.serializer,C,i.referenceDelegate);return new M_(s,m,d,C).recalculateAndSaveOverlaysForDocumentKeys(new JB(t,Tt.wn),u).next()})})}}function tp(r){r.createObjectStore(ii,{keyPath:oP}).createIndex(oh,aP,{unique:!0}),r.createObjectStore(si,{keyPath:"targetId"}).createIndex(__,iP,{unique:!0}),r.createObjectStore(Yr)}const Wn="IndexedDbPersistence",lB=18e5,hB=5e3,dB="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",YP="main";class Ch{constructor(e,t,n,s,i,o,a,u,B,l,d=18){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.Ct=i,this.window=o,this.document=a,this.B_=B,this.U_=l,this.k_=d,this.I_=null,this.R_=!1,this.isPrimary=!1,this.networkEnabled=!0,this.q_=null,this.inForeground=!1,this.K_=null,this.Q_=null,this.W_=Number.NEGATIVE_INFINITY,this.G_=C=>Promise.resolve(),!Ch.Ye())throw new G(N.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new xP(this,s),this.z_=t+YP,this.serializer=new v_(u),this.j_=new lr(this.z_,this.k_,new $P(this.serializer)),this.A_=new vP,this.V_=new kP(this.referenceDelegate,this.serializer),this.remoteDocumentCache=V_(this.serializer),this.f_=new RP,this.window&&this.window.localStorage?this.H_=this.window.localStorage:(this.H_=null,l===!1&&Me(Wn,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.J_().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new G(N.FAILED_PRECONDITION,dB);return this.Y_(),this.Z_(),this.X_(),this.runTransaction("getHighestListenSequenceNumber","readonly",e=>this.V_.getHighestSequenceNumber(e))}).then(e=>{this.I_=new Tt(e,this.B_)}).then(()=>{this.R_=!0}).catch(e=>(this.j_&&this.j_.close(),Promise.reject(e)))}eo(e){return this.G_=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.j_.Bn(async t=>{t.newVersion===null&&await e()})}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Ct.enqueueAndForget(async()=>{this.started&&await this.J_()}))}J_(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",e=>Ua(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.no(e).next(t=>{t||(this.isPrimary=!1,this.Ct.enqueueRetryable(()=>this.G_(!1)))})}).next(()=>this.ro(e)).next(t=>this.isPrimary&&!t?this.io(e).next(()=>!1):!!t&&this.so(e).next(()=>!0))).catch(e=>{if(Ar(e))return U(Wn,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return U(Wn,"Releasing owner lease after error during lease refresh",e),!1}).then(e=>{this.isPrimary!==e&&this.Ct.enqueueRetryable(()=>this.G_(e)),this.isPrimary=e})}no(e){return zi(e).get(bs).next(t=>P.resolve(this._o(t)))}oo(e){return Ua(e).delete(this.clientId)}async ao(){if(this.isPrimary&&!this.uo(this.W_,lB)){this.W_=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",t=>{const n=Xe(t,oi);return n.Qn().next(s=>{const i=this.co(s,lB),o=s.filter(a=>i.indexOf(a)===-1);return P.forEach(o,a=>n.delete(a.clientId)).next(()=>o)})}).catch(()=>[]);if(this.H_)for(const t of e)this.H_.removeItem(this.lo(t.clientId))}}X_(){this.Q_=this.Ct.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.J_().then(()=>this.ao()).then(()=>this.X_()))}_o(e){return!!e&&e.ownerId===this.clientId}ro(e){return this.U_?P.resolve(!0):zi(e).get(bs).next(t=>{if(t!==null&&this.uo(t.leaseTimestampMs,hB)&&!this.Eo(t.ownerId)){if(this._o(t)&&this.networkEnabled)return!0;if(!this._o(t)){if(!t.allowTabSynchronization)throw new G(N.FAILED_PRECONDITION,dB);return!1}}return!(!this.networkEnabled||!this.inForeground)||Ua(e).Qn().next(n=>this.co(n,hB).find(s=>{if(this.clientId!==s.clientId){const i=!this.networkEnabled&&s.networkEnabled,o=!this.inForeground&&s.inForeground,a=this.networkEnabled===s.networkEnabled;if(i||o&&a)return!0}return!1})===void 0)}).next(t=>(this.isPrimary!==t&&U(Wn,`Client ${t?"is":"is not"} eligible for a primary lease.`),t))}async shutdown(){this.R_=!1,this.ho(),this.Q_&&(this.Q_.cancel(),this.Q_=null),this.To(),this.Po(),await this.j_.runTransaction("shutdown","readwrite",[ca,oi],e=>{const t=new JB(e,Tt.wn);return this.io(t).next(()=>this.oo(t))}),this.j_.close(),this.Io()}co(e,t){return e.filter(n=>this.uo(n.updateTimeMs,t)&&!this.Eo(n.clientId))}Ro(){return this.runTransaction("getActiveClients","readonly",e=>Ua(e).Qn().next(t=>this.co(t,lB).map(n=>n.clientId)))}get started(){return this.R_}getGlobalsCache(){return this.A_}getMutationQueue(e,t){return fc.Qr(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.V_}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new LP(e,this.serializer.$r.databaseId)}getDocumentOverlayCache(e){return Cc.Qr(this.serializer,e)}getBundleCache(){return this.f_}runTransaction(e,t,n){U(Wn,"Starting transaction:",e);const s=t==="readonly"?"readonly":"readwrite",i=function(u){return u===18?wP:u===17?A_:u===16?yP:u===15?ch:u===14?T_:u===13?w_:u===12?DP:u===11?y_:void $(60245)}(this.k_);let o;return this.j_.runTransaction(e,s,i,a=>(o=new JB(a,this.I_?this.I_.next():Tt.wn),t==="readwrite-primary"?this.no(o).next(u=>!!u||this.ro(o)).next(u=>{if(!u)throw Me(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Ct.enqueueRetryable(()=>this.G_(!1)),new G(N.FAILED_PRECONDITION,Um);return n(o)}).next(u=>this.so(o).next(()=>u)):this.Ao(o).next(()=>n(o)))).then(a=>(o.raiseOnCommittedEvent(),a))}Ao(e){return zi(e).get(bs).next(t=>{if(t!==null&&this.uo(t.leaseTimestampMs,hB)&&!this.Eo(t.ownerId)&&!this._o(t)&&!(this.U_||this.allowTabSynchronization&&t.allowTabSynchronization))throw new G(N.FAILED_PRECONDITION,dB)})}so(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return zi(e).put(bs,t)}static Ye(){return lr.Ye()}io(e){const t=zi(e);return t.get(bs).next(n=>this._o(n)?(U(Wn,"Releasing primary lease."),t.delete(bs)):P.resolve())}uo(e,t){const n=Date.now();return!(e<n-t)&&(!(e>n)||(Me(`Detected an update time that is in the future: ${e} > ${n}`),!1))}Y_(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.K_=()=>{this.Ct.enqueueAndForget(()=>(this.inForeground=this.document.visibilityState==="visible",this.J_()))},this.document.addEventListener("visibilitychange",this.K_),this.inForeground=this.document.visibilityState==="visible")}To(){this.K_&&(this.document.removeEventListener("visibilitychange",this.K_),this.K_=null)}Z_(){var e;typeof((e=this.window)==null?void 0:e.addEventListener)=="function"&&(this.q_=()=>{this.ho();const t=/(?:Version|Mobile)\/1[456]/;Np()&&(navigator.appVersion.match(t)||navigator.userAgent.match(t))&&this.Ct.enterRestrictedMode(!0),this.Ct.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.q_))}Po(){this.q_&&(this.window.removeEventListener("pagehide",this.q_),this.q_=null)}Eo(e){var t;try{const n=((t=this.H_)==null?void 0:t.getItem(this.lo(e)))!==null;return U(Wn,`Client '${e}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return Me(Wn,"Failed to get zombied client id.",n),!1}}ho(){if(this.H_)try{this.H_.setItem(this.lo(this.clientId),String(Date.now()))}catch(e){Me("Failed to set zombie client id.",e)}}Io(){if(this.H_)try{this.H_.removeItem(this.lo(this.clientId))}catch{}}lo(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function zi(r){return Xe(r,ca)}function Ua(r){return Xe(r,oi)}function G_(r,e){let t=r.projectId;return r.isDefaultDatabase||(t+="."+r.database),"firestore/"+e+"/"+t+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ph{constructor(e,t,n,s){this.targetId=e,this.fromCache=t,this.Vo=n,this.fo=s}static mo(e,t){let n=ce(),s=ce();for(const i of t.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new ph(e,t.fromCache,n,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function XP(r,e){return J.comparator(r.key,e.key)}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ZP{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U_{constructor(){this.po=!1,this.yo=!1,this.wo=100,this.bo=function(){return Np()?8:qm(We())>0?6:4}()}initialize(e,t){this.So=e,this.indexManager=t,this.po=!0}getDocumentsMatchingQuery(e,t,n,s){const i={result:null};return this.vo(e,t).next(o=>{i.result=o}).next(()=>{if(!i.result)return this.Do(e,t,s,n).next(o=>{i.result=o})}).next(()=>{if(i.result)return;const o=new ZP;return this.xo(e,t,o).next(a=>{if(i.result=a,this.yo)return this.Co(e,t,o,a.size)})}).next(()=>i.result)}Co(e,t,n,s){return ke(t)?P.resolve():n.documentReadCount<this.wo?(Vs()<=de.DEBUG&&U("QueryEngine","SDK will not create cache indexes for query:",co(t),"since it only creates cache indexes for collection contains","more than or equal to",this.wo,"documents"),P.resolve()):(Vs()<=de.DEBUG&&U("QueryEngine","Query:",co(t),"scans",n.documentReadCount,"local documents and returns",s,"documents as results."),n.documentReadCount>this.bo*s?(Vs()<=de.DEBUG&&U("QueryEngine","The SDK decides to create cache indexes for query:",co(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,xt(t))):P.resolve())}vo(e,t){if(ke(t))return P.resolve(null);let n=t;if(pC(n))return P.resolve(null);let s=xt(n);return this.indexManager.getIndexType(e,s).next(i=>i===0?null:(n.limit!==null&&i===1&&(n=Iu(n,null,"F"),s=xt(n)),this.indexManager.getDocumentsMatchingTarget(e,s).next(o=>{const a=ce(...o);return this.So.getDocuments(e,a).next(u=>this.indexManager.getMinOffset(e,s).next(B=>{const l=this.Fo(n,u);return this.Oo(n,l,a,B.readTime)?this.vo(e,Iu(n,null,"F")):this.Mo(e,l,n,B)}))})))}Do(e,t,n,s){return(ke(t)?function(o){for(const a of o.stages){if(a instanceof Er||a instanceof OC)return!1;if(a instanceof oa){if(a.condition instanceof s_&&a.condition._expr.name==="exists"&&a.condition._expr.params[0]instanceof Ds&&a.condition._expr.params[0].fieldName===Zt)continue;return!1}}return!0}(t):pC(t))||s.isEqual(ee.min())?P.resolve(null):this.So.getDocuments(e,n).next(i=>{const o=this.Fo(t,i);return this.Oo(t,o,n,s)?P.resolve(null):(Vs()<=de.DEBUG&&U("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),FC(t)),this.Mo(e,o,t,fm(s,ti)).next(a=>a))})}Fo(e,t){let n,s;return ke(e)?(n=new Ee(XP),s=i=>pc(e,i)):(n=new Ee(Nl(e)),s=i=>tc(e,i)),t.forEach((i,o)=>{s(o)&&(n=n.add(o))}),n}Oo(e,t,n,s){if(ke(e))return function(a){return a.stages.some(u=>u instanceof Er||u instanceof OC)}(e);if(e.limit===null)return!1;if(n.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}xo(e,t,n){return Vs()<=de.DEBUG&&U("QueryEngine","Using full collection scan to execute query:",FC(t)),this.So.getDocumentsMatchingQuery(e,t,Vt.min(),n)}Mo(e,t,n,s){return this.So.getDocumentsMatchingQuery(e,n,s).next(i=>(t.forEach(o=>{i=i.insert(o.key,o)}),i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gh="LocalStore",eb=3e8;class tb{constructor(e,t,n,s){this.persistence=e,this.No=t,this.serializer=s,this.Lo=new Te(ie),this.Bo=new xn(i=>Bc(i),rh),this.Uo=new Map,this.ko=e.getRemoteDocumentCache(),this.V_=e.getTargetCache(),this.f_=e.getBundleCache(),this.qo(n)}qo(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new M_(this.ko,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.ko.setIndexManager(this.indexManager),this.No.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.Lo))}}function H_(r,e,t,n){return new tb(r,e,t,n)}async function q_(r,e){const t=X(r);return await t.persistence.runTransaction("Handle user change","readonly",n=>{let s;return t.mutationQueue.getAllMutationBatches(n).next(i=>(s=i,t.qo(e),t.mutationQueue.getAllMutationBatches(n))).next(i=>{const o=[],a=[];let u=ce();for(const B of s){o.push(B.batchId);for(const l of B.mutations)u=u.add(l.key)}for(const B of i){a.push(B.batchId);for(const l of B.mutations)u=u.add(l.key)}return t.localDocuments.getDocuments(n,u).next(B=>({$o:B,removedBatchIds:o,addedBatchIds:a}))})})}function nb(r,e){const t=X(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",n=>{const s=e.batch.keys(),i=t.ko.newChangeBuffer({trackRemovals:!0});return function(a,u,B,l){const d=B.batch,C=d.keys();let m=P.resolve();return C.forEach(y=>{m=m.next(()=>l.getEntry(u,y)).next(O=>{const V=B.docVersions.get(y);H(V!==null,48541),O.version.compareTo(V)<0&&(d.applyToRemoteDocument(O,B),O.isValidDocument()&&(O.setReadTime(B.commitVersion),l.addEntry(O)))})}),m.next(()=>a.mutationQueue.removeMutationBatch(u,d))}(t,n,e,i).next(()=>i.apply(n)).next(()=>t.mutationQueue.performConsistencyCheck(n)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(n,s,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,function(a){let u=ce();for(let B=0;B<a.mutationResults.length;++B)a.mutationResults[B].transformResults.length>0&&(u=u.add(a.batch.mutations[B].key));return u}(e))).next(()=>t.localDocuments.getDocuments(n,s))})}function j_(r){const e=X(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.V_.getLastRemoteSnapshotVersion(t))}function rb(r,e){const t=X(r),n=e.snapshotVersion;let s=t.Lo;return t.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const o=t.ko.newChangeBuffer({trackRemovals:!0});s=t.Lo;const a=[];e.targetChanges.forEach((l,d)=>{const C=s.get(d);if(!C)return;a.push(t.V_.removeMatchingKeys(i,l.removedDocuments,d).next(()=>t.V_.addMatchingKeys(i,l.addedDocuments,d)));let m=C.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(d)!==null?m=m.withResumeToken(Fe.EMPTY_BYTE_STRING,ee.min()).withLastLimboFreeSnapshotVersion(ee.min()):l.resumeToken.approximateByteSize()>0&&(m=m.withResumeToken(l.resumeToken,n)),s=s.insert(d,m),function(O,V,z){return O.resumeToken.approximateByteSize()===0||V.snapshotVersion.toMicroseconds()-O.snapshotVersion.toMicroseconds()>=eb?!0:z.addedDocuments.size+z.modifiedDocuments.size+z.removedDocuments.size>0}(C,m,l)&&a.push(t.V_.updateTargetData(i,m))});let u=ze(),B=ce();if(e.documentUpdates.forEach(l=>{e.resolvedLimboDocuments.has(l)&&a.push(t.persistence.referenceDelegate.updateLimboDocument(i,l))}),a.push(sb(i,o,e.documentUpdates).next(l=>{u=l.Ko,B=l.Qo})),!n.isEqual(ee.min())){const l=t.V_.getLastRemoteSnapshotVersion(i).next(d=>t.V_.setTargetsMetadata(i,i.currentSequenceNumber,n));a.push(l)}return P.waitFor(a).next(()=>o.apply(i)).next(()=>t.localDocuments.getLocalViewOfDocuments(i,u,B)).next(()=>u)}).then(i=>(t.Lo=s,i))}function sb(r,e,t){let n=ce(),s=ce();return t.forEach(i=>n=n.add(i)),e.getEntries(r,n).next(i=>{let o=ze();return t.forEach((a,u)=>{const B=i.get(a);u.isFoundDocument()!==B.isFoundDocument()&&(s=s.add(a)),u.isNoDocument()&&u.version.isEqual(ee.min())?(e.removeEntry(a,u.readTime),o=o.insert(a,u)):!B.isValidDocument()||u.version.compareTo(B.version)>0||u.version.compareTo(B.version)===0&&B.hasPendingWrites?(e.addEntry(u),o=o.insert(a,u)):U(gh,"Ignoring outdated watch update for ",a,". Current version:",B.version," Watch version:",u.version)}),{Ko:o,Qo:s}})}function ib(r,e){const t=X(r);return t.persistence.runTransaction("Get next mutation batch","readonly",n=>(e===void 0&&(e=Qr),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e)))}function Nu(r,e){const t=X(r);return t.persistence.runTransaction("Allocate target","readwrite",n=>{let s;return t.V_.getTargetData(n,e).next(i=>i?(s=i,P.resolve(s)):t.V_.allocateTargetId(n).next(o=>(s=new rn(e,o,"TargetPurposeListen",n.currentSequenceNumber),t.V_.addTargetData(n,s).next(()=>s))))}).then(n=>{const s=t.Lo.get(n.targetId);return(s===null||n.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.Lo=t.Lo.insert(n.targetId,n),t.Bo.set(e,n.targetId)),n})}async function ai(r,e,t){const n=X(r),s=n.Lo.get(e),i=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",i,o=>n.persistence.referenceDelegate.removeTarget(o,s))}catch(o){if(!Ar(o))throw o;U(gh,`Failed to update sequence numbers for target ${e}: ${o}`)}n.Lo=n.Lo.remove(e),n.Bo.delete(s.target)}function XB(r,e,t){const n=X(r);let s=ee.min(),i=ce();return n.persistence.runTransaction("Execute query","readwrite",o=>function(u,B,l){const d=X(u),C=d.Bo.get(l);return C!==void 0?P.resolve(d.Lo.get(C)):d.V_.getTargetData(B,l)}(n,o,ke(e)?e:xt(e)).next(a=>{if(a)return s=a.lastLimboFreeSnapshotVersion,n.V_.getMatchingKeysForTargetId(o,a.targetId).next(u=>{i=u})}).next(()=>n.No.getDocumentsMatchingQuery(o,e,t?s:ee.min(),t?i:ce())).next(a=>(J_(n,a),{documents:a,Wo:i})))}function K_(r,e){const t=X(r),n=X(t.V_),s=t.Lo.get(e);return s?Promise.resolve(s.target??null):t.persistence.runTransaction("Get target data","readonly",i=>n.ye(i,e).next(o=>(o==null?void 0:o.target)??null))}function ZB(r,e){const t=X(r),n=t.Uo.get(e)||ee.min();return t.persistence.runTransaction("Get new document changes","readonly",s=>t.ko.getAllFromCollectionGroup(s,e,fm(n,ti),Number.MAX_SAFE_INTEGER)).then(s=>(J_(t,s),s))}function J_(r,e){e.forEach((t,n)=>{const s=n.key.getCollectionGroup(),i=r.Uo.get(s)||ee.min();n.readTime.compareTo(i)>0&&r.Uo.set(s,n.readTime)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ob{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.Yo=0,this.Zo=null,this.Xo=!0}ea(){this.Yo===0&&(this.ta("Unknown"),this.Zo=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.Zo=null,this.na("Backend didn't respond within 10 seconds."),this.ta("Offline"),Promise.resolve())))}ra(e){this.state==="Online"?this.ta("Unknown"):(this.Yo++,this.Yo>=1&&(this.ia(),this.na(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ta("Offline")))}set(e){this.ia(),this.Yo=0,e==="Online"&&(this.Xo=!1),this.ta(e)}ta(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}na(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.Xo?(Me(t),this.Xo=!1):U("OnlineStateTracker",t)}ia(){this.Zo!==null&&(this.Zo.cancel(),this.Zo=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dn="RemoteStore";class ab{constructor(e,t,n,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.sa=[],this._a=new Map,this.oa=new Map,this.aa=new Map,this.ua=new Fn(1e3),this.ca=new Fn(1001),this.la=new Set,this.Ea=[],this.ha=i,this.ha.Qe(o=>{n.enqueueAndForget(async()=>{ws(this)&&(U(dn,"Restarting streams for network reachability change."),await async function(u){const B=X(u);B.la.add(4),await Ba(B),B.Ta.set("Unknown"),B.la.delete(4),await mc(B)}(this))})}),this.Ta=new ob(n,s)}}async function mc(r){if(ws(r))for(const e of r.Ea)await e(!0)}async function Ba(r){for(const e of r.Ea)await e(!1)}function el(r,e){return r.oa.get(e)||void 0}function _c(r,e){const t=X(r),n=el(t,e.targetId);if(n!==void 0&&t._a.has(n))return;const s=function(a,u){const B=el(a,u);B!==void 0&&a.aa.delete(B);const l=function(C,m){return m%2!=0?C.ca.next():C.ua.next()}(a,u);return a.oa.set(u,l),a.aa.set(l,u),l}(t,e.targetId);U(dn,"remoteStoreListen mapping SDK target ID to remote",e.targetId,s);const i=new rn(e.target,s,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t._a.set(s,i),Eh(t)?_h(t):Di(t).Yt()&&mh(t,i)}function ui(r,e){const t=X(r),n=Di(t),s=el(t,e);U(dn,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,s),t._a.delete(s),t.oa.delete(e),t.aa.delete(s),n.Yt()&&z_(t,s),t._a.size===0&&(n.Yt()?n.en():ws(t)&&t.Ta.set("Unknown"))}function mh(r,e){if(r.Pa.J(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(ee.min())>0){const t=r.aa.get(e.targetId);if(t===void 0)return void U(dn,"SDK target ID not found for remote ID: "+e.targetId);const n=r.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(n)}Di(r).Pn(e)}function z_(r,e){r.Pa.J(e),Di(r).In(e)}function _h(r){r.Pa=new VA({getRemoteKeysForTarget:e=>{const t=r.aa.get(e);return t!==void 0?r.remoteSyncer.getRemoteKeysForTarget(t):ce()},ye:e=>r._a.get(e)||null,Ve:()=>r.datastore.serializer.databaseId}),Di(r).start(),r.Ta.ea()}function Eh(r){return ws(r)&&!Di(r).Jt()&&r._a.size>0}function ws(r){return X(r).la.size===0}function Q_(r){r.Pa=void 0}async function ub(r){r.Ta.set("Online")}async function cb(r){r._a.forEach((e,t)=>{mh(r,e)})}async function Bb(r,e){Q_(r),Eh(r)?(r.Ta.ra(e),_h(r)):r.Ta.set("Unknown")}async function lb(r,e,t){if(r.Ta.set("Online"),e instanceof ym&&e.state===2&&e.cause)try{await async function(s,i){const o=i.cause;for(const a of i.targetIds){if(s._a.has(a)){const u=s.aa.get(a);u!==void 0&&(await s.remoteSyncer.rejectListen(u,o),s.oa.delete(u),s.aa.delete(a)),s._a.delete(a)}s.Pa.removeTarget(a)}}(r,e)}catch(n){U(dn,"Failed to remove targets %s: %s ",e.targetIds.join(","),n),await Ou(r,n)}else if(e instanceof eu?r.Pa._e(e):e instanceof Dm?r.Pa.he(e):r.Pa.ue(e),!t.isEqual(ee.min()))try{const n=await j_(r.localStore);t.compareTo(n)>=0&&await function(i,o){const a=i.Pa.fe(o);a.targetChanges.forEach((B,l)=>{if(B.resumeToken.approximateByteSize()>0){const d=i._a.get(l);d&&i._a.set(l,d.withResumeToken(B.resumeToken,o))}}),a.targetMismatches.forEach((B,l)=>{const d=i._a.get(B);if(!d)return;i._a.set(B,d.withResumeToken(Fe.EMPTY_BYTE_STRING,d.snapshotVersion)),z_(i,B);const C=new rn(d.target,B,l,d.sequenceNumber);mh(i,C)});const u=function(l,d){const C=new Map;d.targetChanges.forEach((y,O)=>{const V=l.aa.get(O);V!==void 0&&C.set(V,y)});let m=new Te(ie);return d.targetMismatches.forEach((y,O)=>{const V=l.aa.get(y);V!==void 0&&(m=m.insert(V,O))}),new gi(d.snapshotVersion,C,m,d.documentUpdates,d.augmentedDocumentUpdates,d.resolvedLimboDocuments)}(i,a);return i.remoteSyncer.applyRemoteEvent(u)}(r,t)}catch(n){U(dn,"Failed to raise snapshot:",n),await Ou(r,n)}}async function Ou(r,e,t){if(!Ar(e))throw e;r.la.add(1),await Ba(r),r.Ta.set("Offline"),t||(t=()=>j_(r.localStore)),r.asyncQueue.enqueueRetryable(async()=>{U(dn,"Retrying IndexedDB access"),await t(),r.la.delete(1),await mc(r)})}function W_(r,e){return e().catch(t=>Ou(r,t,e))}async function Ii(r){const e=X(r),t=Dr(e);let n=e.sa.length>0?e.sa[e.sa.length-1].batchId:Qr;for(;hb(e);)try{const s=await ib(e.localStore,n);if(s===null){e.sa.length===0&&t.en();break}n=s.batchId,db(e,s)}catch(s){await Ou(e,s)}$_(e)&&Y_(e)}function hb(r){return ws(r)&&r.sa.length<10}function db(r,e){r.sa.push(e);const t=Dr(r);t.Yt()&&t.Rn&&t.An(e.mutations)}function $_(r){return ws(r)&&!Dr(r).Jt()&&r.sa.length>0}function Y_(r){Dr(r).start()}async function fb(r){Dr(r).fn()}async function Cb(r){const e=Dr(r);for(const t of r.sa)e.An(t.mutations)}async function pb(r,e,t){const n=r.sa.shift(),s=ih.from(n,e,t);await W_(r,()=>r.remoteSyncer.applySuccessfulWrite(s)),await Ii(r)}async function gb(r,e){e&&Dr(r).Rn&&await async function(n,s){if(function(o){return gm(o)&&o!==N.ABORTED}(s.code)){const i=n.sa.shift();Dr(n).Xt(),await W_(n,()=>n.remoteSyncer.rejectFailedWrite(i.batchId,s)),await Ii(n)}}(r,e),$_(r)&&Y_(r)}async function np(r,e){const t=X(r);t.asyncQueue.verifyOperationInProgress(),U(dn,"RemoteStore received new credentials");const n=ws(t);t.la.add(3),await Ba(t),n&&t.Ta.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.la.delete(3),await mc(t)}async function tl(r,e){const t=X(r);e?(t.la.delete(2),await mc(t)):e||(t.la.add(2),await Ba(t),t.Ta.set("Unknown"))}function Di(r){return r.Ia||(r.Ia=function(t,n,s){const i=X(t);return i.pn(),new BR(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(r.datastore,r.asyncQueue,{ct:ub.bind(null,r),Et:cb.bind(null,r),Tt:Bb.bind(null,r),Tn:lb.bind(null,r)}),r.Ea.push(async e=>{e?(r.Ia.Xt(),Eh(r)?_h(r):r.Ta.set("Unknown")):(await r.Ia.stop(),Q_(r))})),r.Ia}function Dr(r){return r.Ra||(r.Ra=function(t,n,s){const i=X(t);return i.pn(),new lR(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(r.datastore,r.asyncQueue,{ct:()=>Promise.resolve(),Et:fb.bind(null,r),Tt:gb.bind(null,r),Vn:Cb.bind(null,r),dn:pb.bind(null,r)}),r.Ea.push(async e=>{e?(r.Ra.Xt(),await Ii(r)):(await r.Ra.stop(),r.sa.length>0&&(U(dn,`Stopping write stream with ${r.sa.length} pending writes`),r.sa=[]))})),r.Ra}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ih{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Aa(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Aa(this.observer.error,e):Me("Uncaught Error in snapshot listener:",e.toString()))}Va(){this.muted=!0}Aa(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dh{constructor(e,t,n,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=s,this.removalCallback=i,this.deferred=new Jt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,s,i){const o=Date.now()+n,a=new Dh(e,t,o,s,i);return a.start(n),a}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new G(N.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function yh(r,e){if(Me("AsyncQueue",`${e}: ${r}`),Ar(r))return new G(N.UNAVAILABLE,`${e}: ${r}`);throw r}const go="IndexBackfiller";class mb{constructor(e,t){this.asyncQueue=e,this.Da=t,this.task=null}start(){this.xa(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}xa(e){U(go,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,async()=>{this.task=null;try{const t=await this.Da.Ca();U(go,`Documents written: ${t}`)}catch(t){Ar(t)?U(go,"Ignoring IndexedDB error during index backfill: ",t):await Tr(t)}await this.xa(6e4)})}}class _b{constructor(e,t){this.localStore=e,this.persistence=t}async Ca(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",t=>this.Fa(t,e))}Fa(e,t){const n=new Set;let s=t,i=!0;return P.doWhile(()=>i===!0&&s>0,()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next(o=>{if(o!==null&&!n.has(o))return U(go,`Processing collection: ${o}`),this.Oa(e,o,s).next(a=>{s-=a,n.add(o)});i=!1})).next(()=>t-s)}Oa(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next(s=>this.localStore.localDocuments.getNextDocuments(e,t,s,n).next(i=>{const o=i.changes;return this.localStore.indexManager.updateIndexEntries(e,o).next(()=>this.Ma(s,i)).next(a=>(U(go,`Updating offset: ${a}`),this.localStore.indexManager.updateCollectionGroup(e,t,a))).next(()=>o.size)}))}Ma(e,t){let n=e;return t.changes.forEach((s,i)=>{const o=Cm(i);vl(o,n)>0&&(n=o)}),new Vt(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const X_="firestore_clients";function rp(r,e){return`${X_}_${r}_${e}`}const Z_="firestore_mutations";function sp(r,e,t){let n=`${Z_}_${r}_${t}`;return e.isAuthenticated()&&(n+=`_${e.uid}`),n}const eE="firestore_targets";function fB(r,e){return`${eE}_${r}_${e}`}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xt="SharedClientState";class Fu{constructor(e,t,n,s){this.user=e,this.batchId=t,this.state=n,this.error=s}static Na(e,t,n){const s=JSON.parse(n);let i,o=typeof s=="object"&&["pending","acknowledged","rejected"].indexOf(s.state)!==-1&&(s.error===void 0||typeof s.error=="object");return o&&s.error&&(o=typeof s.error.message=="string"&&typeof s.error.code=="string",o&&(i=new G(s.error.code,s.error.message))),o?new Fu(e,t,s.state,i):(Me(Xt,`Failed to parse mutation state for ID '${t}': ${n}`),null)}La(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class mo{constructor(e,t,n){this.targetId=e,this.state=t,this.error=n}static Na(e,t){const n=JSON.parse(t);let s,i=typeof n=="object"&&["not-current","current","rejected"].indexOf(n.state)!==-1&&(n.error===void 0||typeof n.error=="object");return i&&n.error&&(i=typeof n.error.message=="string"&&typeof n.error.code=="string",i&&(s=new G(n.error.code,n.error.message))),i?new mo(e,n.state,s):(Me(Xt,`Failed to parse target state for ID '${e}': ${t}`),null)}La(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Lu{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static Na(e,t){const n=JSON.parse(t);let s=typeof n=="object"&&n.activeTargetIds instanceof Array,i=Ol();for(let o=0;s&&o<n.activeTargetIds.length;++o)s=$g(n.activeTargetIds[o]),i=i.add(n.activeTargetIds[o]);return s?new Lu(e,i):(Me(Xt,`Failed to parse client data for instance '${e}': ${t}`),null)}}class wh{constructor(e,t){this.clientId=e,this.onlineState=t}static Na(e){const t=JSON.parse(e);return typeof t=="object"&&["Unknown","Online","Offline"].indexOf(t.onlineState)!==-1&&typeof t.clientId=="string"?new wh(t.clientId,t.onlineState):(Me(Xt,`Failed to parse online state: ${e}`),null)}}class nl{constructor(){this.activeTargetIds=Ol()}Ba(e){this.activeTargetIds=this.activeTargetIds.add(e)}Ua(e){this.activeTargetIds=this.activeTargetIds.delete(e)}La(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class CB{constructor(e,t,n,s,i){this.window=e,this.Ct=t,this.persistenceKey=n,this.ka=s,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.qa=this.$a.bind(this),this.Ka=new Te(ie),this.started=!1,this.Qa=[];const o=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=i,this.Wa=rp(this.persistenceKey,this.ka),this.Ga=function(u){return`firestore_sequence_number_${u}`}(this.persistenceKey),this.Ka=this.Ka.insert(this.ka,new nl),this.za=new RegExp(`^${X_}_${o}_([^_]*)$`),this.ja=new RegExp(`^${Z_}_${o}_(\\d+)(?:_(.*))?$`),this.Ha=new RegExp(`^${eE}_${o}_(\\d+)$`),this.Ja=function(u){return`firestore_online_state_${u}`}(this.persistenceKey),this.Ya=function(u){return`firestore_bundle_loaded_v2_${u}`}(this.persistenceKey),this.window.addEventListener("storage",this.qa)}static Ye(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.Ro();for(const n of e){if(n===this.ka)continue;const s=this.getItem(rp(this.persistenceKey,n));if(s){const i=Lu.Na(n,s);i&&(this.Ka=this.Ka.insert(i.clientId,i))}}this.Za();const t=this.storage.getItem(this.Ja);if(t){const n=this.Xa(t);n&&this.eu(n)}for(const n of this.Qa)this.$a(n);this.Qa=[],this.window.addEventListener("pagehide",()=>this.shutdown()),this.started=!0}writeSequenceNumber(e){this.setItem(this.Ga,JSON.stringify(e))}getAllActiveQueryTargets(){return this.tu(this.Ka)}isActiveQueryTarget(e){let t=!1;return this.Ka.forEach((n,s)=>{s.activeTargetIds.has(e)&&(t=!0)}),t}addPendingMutation(e){this.nu(e,"pending")}updateMutationState(e,t,n){this.nu(e,t,n),this.ru(e)}addLocalQueryTarget(e,t=!0){let n="not-current";if(this.isActiveQueryTarget(e)){const s=this.storage.getItem(fB(this.persistenceKey,e));if(s){const i=mo.Na(e,s);i&&(n=i.state)}}return t&&this.iu.Ba(e),this.Za(),n}removeLocalQueryTarget(e){this.iu.Ua(e),this.Za()}isLocalQueryTarget(e){return this.iu.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(fB(this.persistenceKey,e))}updateQueryState(e,t,n){this.su(e,t,n)}handleUserChange(e,t,n){t.forEach(s=>{this.ru(s)}),this.currentUser=e,n.forEach(s=>{this.addPendingMutation(s)})}setOnlineState(e){this._u(e)}notifyBundleLoaded(e){this.ou(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.qa),this.removeItem(this.Wa),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return U(Xt,"READ",e,t),t}setItem(e,t){U(Xt,"SET",e,t),this.storage.setItem(e,t)}removeItem(e){U(Xt,"REMOVE",e),this.storage.removeItem(e)}$a(e){const t=e;if(t.storageArea===this.storage){if(U(Xt,"EVENT",t.key,t.newValue),t.key===this.Wa)return void Me("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.Ct.enqueueRetryable(async()=>{if(this.started){if(t.key!==null){if(this.za.test(t.key)){if(t.newValue==null){const n=this.au(t.key);return this.uu(n,null)}{const n=this.cu(t.key,t.newValue);if(n)return this.uu(n.clientId,n)}}else if(this.ja.test(t.key)){if(t.newValue!==null){const n=this.lu(t.key,t.newValue);if(n)return this.Eu(n)}}else if(this.Ha.test(t.key)){if(t.newValue!==null){const n=this.hu(t.key,t.newValue);if(n)return this.Tu(n)}}else if(t.key===this.Ja){if(t.newValue!==null){const n=this.Xa(t.newValue);if(n)return this.eu(n)}}else if(t.key===this.Ga){const n=function(i){let o=Tt.wn;if(i!=null)try{const a=JSON.parse(i);H(typeof a=="number",30636,{Pu:i}),o=a}catch(a){Me(Xt,"Failed to read sequence number from WebStorage",a)}return o}(t.newValue);n!==Tt.wn&&this.sequenceNumberHandler(n)}else if(t.key===this.Ya){const n=this.Iu(t.newValue);await Promise.all(n.map(s=>this.syncEngine.Ru(s)))}}}else this.Qa.push(t)})}}get iu(){return this.Ka.get(this.ka)}Za(){this.setItem(this.Wa,this.iu.La())}nu(e,t,n){const s=new Fu(this.currentUser,e,t,n),i=sp(this.persistenceKey,this.currentUser,e);this.setItem(i,s.La())}ru(e){const t=sp(this.persistenceKey,this.currentUser,e);this.removeItem(t)}_u(e){const t={clientId:this.ka,onlineState:e};this.storage.setItem(this.Ja,JSON.stringify(t))}su(e,t,n){const s=fB(this.persistenceKey,e),i=new mo(e,t,n);this.setItem(s,i.La())}ou(e){const t=JSON.stringify(Array.from(e));this.setItem(this.Ya,t)}au(e){const t=this.za.exec(e);return t?t[1]:null}cu(e,t){const n=this.au(e);return Lu.Na(n,t)}lu(e,t){const n=this.ja.exec(e),s=Number(n[1]),i=n[2]!==void 0?n[2]:null;return Fu.Na(new ct(i),s,t)}hu(e,t){const n=this.Ha.exec(e),s=Number(n[1]);return mo.Na(s,t)}Xa(e){return wh.Na(e)}Iu(e){return JSON.parse(e)}async Eu(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.Au(e.batchId,e.state,e.error);U(Xt,`Ignoring mutation for non-active user ${e.user.uid}`)}Tu(e){return this.syncEngine.Vu(e.targetId,e.state,e.error)}uu(e,t){const n=t?this.Ka.insert(e,t):this.Ka.remove(e),s=this.tu(this.Ka),i=this.tu(n),o=[],a=[];return i.forEach(u=>{s.has(u)||o.push(u)}),s.forEach(u=>{i.has(u)||a.push(u)}),this.syncEngine.du(o,a).then(()=>{this.Ka=n})}eu(e){this.Ka.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}tu(e){let t=Ol();return e.forEach((n,s)=>{t=t.unionWith(s.activeTargetIds)}),t}}class tE{constructor(){this.fu=new nl,this.mu={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.fu.Ba(e),this.mu[e]||"not-current"}updateQueryState(e,t,n){this.mu[e]=t}removeLocalQueryTarget(e){this.fu.Ua(e)}isLocalQueryTarget(e){return this.fu.activeTargetIds.has(e)}clearQueryState(e){delete this.mu[e]}getAllActiveQueryTargets(){return this.fu.activeTargetIds}isActiveQueryTarget(e){return this.fu.activeTargetIds.has(e)}start(){return this.fu=new nl,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nE(){return typeof window<"u"?window:null}function ou(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xr{static emptySet(e){return new Xr(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||J.comparator(t.key,n.key):(t,n)=>J.comparator(t.key,n.key),this.keyedMap=Vr(),this.sortedSet=new Te(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,n)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Xr)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new Xr;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ip{constructor(){this.pu=new Te(J.comparator)}track(e){const t=e.doc.key,n=this.pu.get(t);n?e.type!==0&&n.type===3?this.pu=this.pu.insert(t,e):e.type===3&&n.type!==1?this.pu=this.pu.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.pu=this.pu.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.pu=this.pu.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.pu=this.pu.remove(t):e.type===1&&n.type===2?this.pu=this.pu.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.pu=this.pu.insert(t,{type:2,doc:e.doc}):$(63341,{we:e,gu:n}):this.pu=this.pu.insert(t,e)}yu(){const e=[];return this.pu.inorderTraversal((t,n)=>{e.push(n)}),e}}class ci{constructor(e,t,n,s,i,o,a,u,B){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=a,this.excludesMetadataChanges=u,this.hasCachedResults=B}static fromInitialDocuments(e,t,n,s,i){const o=[];return t.forEach(a=>{o.push({type:0,doc:a})}),new ci(e,t,Xr.emptySet(t),o,n,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&cc(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==n[s].type||!t[s].doc.isEqual(n[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eb{constructor(){this.wu=void 0,this.bu=[]}Su(){return this.bu.some(e=>e.vu())}}class Ib{constructor(){this.queries=op(),this.onlineState="Unknown",this.Du=new Set}terminate(){(function(t,n){const s=X(t),i=s.queries;s.queries=op(),i.forEach((o,a)=>{for(const u of a.bu)u.onError(n)})})(this,new G(N.ABORTED,"Firestore shutting down"))}}function op(){return new xn(r=>p_(r),cc)}async function Th(r,e){const t=X(r);let n=3;const s=e.query;let i=t.queries.get(s);i?!i.Su()&&e.vu()&&(n=2):(i=new Eb,n=e.vu()?0:1);try{switch(n){case 0:i.wu=await t.onListen(s,!0);break;case 1:i.wu=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(o){const a=yh(o,`Initialization of query '${ke(e.query)?Tn(e.query):co(e.query)}' failed`);return void e.onError(a)}t.queries.set(s,i),i.bu.push(e),e.xu(t.onlineState),i.wu&&e.Cu(i.wu)&&Rh(t)}async function Ah(r,e){const t=X(r),n=e.query;let s=3;const i=t.queries.get(n);if(i){const o=i.bu.indexOf(e);o>=0&&(i.bu.splice(o,1),i.bu.length===0?s=e.vu()?0:1:!i.Su()&&e.vu()&&(s=2))}switch(s){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function Db(r,e){const t=X(r);let n=!1;for(const s of e){const i=s.query,o=t.queries.get(i);if(o){for(const a of o.bu)a.Cu(s)&&(n=!0);o.wu=s}}n&&Rh(t)}function yb(r,e,t){const n=X(r),s=n.queries.get(e);if(s)for(const i of s.bu)i.onError(t);n.queries.delete(e)}function Rh(r){r.Du.forEach(e=>{e.next()})}var rl;(function(r){r.Default="default",r.Cache="cache"})(rl||(rl={}));class vh{constructor(e,t,n){this.query=e,this.Fu=t,this.Ou=!1,this.Mu=null,this.onlineState="Unknown",this.options=n||{}}Cu(e){if(!this.options.includeMetadataChanges){const n=[];for(const s of e.docChanges)s.type!==3&&n.push(s);e=new ci(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Ou?this.Nu(e)&&(this.Fu.next(e),t=!0):this.Lu(e,this.onlineState)&&(this.Bu(e),t=!0),this.Mu=e,t}onError(e){this.Fu.error(e)}xu(e){this.onlineState=e;let t=!1;return this.Mu&&!this.Ou&&this.Lu(this.Mu,e)&&(this.Bu(this.Mu),t=!0),t}Lu(e,t){if(!e.fromCache||!this.vu())return!0;const n=t!=="Offline";return(!this.options.waitForSyncWhenOnline||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Nu(e){if(e.docChanges.length>0)return!0;const t=this.Mu&&this.Mu.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}Bu(e){e=ci.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Ou=!0,this.Fu.next(e)}vu(){return this.options.source!==rl.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rE{constructor(e){this.key=e}}class sE{constructor(e){this.key=e}}class wb{constructor(e,t){this.query=e,this.zu=t,this.ju=null,this.hasCachedResults=!1,this.current=!1,this.Hu=ce(),this.mutatedKeys=ce(),this.Ju=ke(e)?YB(e):Nl(e),this.Yu=new Xr(this.Ju)}get Zu(){return this.zu}Xu(e,t){const n=t?t.ec:new ip,s=t?t.Yu:this.Yu;let i=t?t.mutatedKeys:this.mutatedKeys,o=s,a=!1;const[u,B]=this.tc(this.query,s);e.inorderTraversal((d,C)=>{const m=s.get(d),y=k_(this.query,C)?C:null,O=!!m&&this.mutatedKeys.has(m.key),V=!!y&&(y.hasLocalMutations||this.mutatedKeys.has(y.key)&&y.hasCommittedMutations);let z=!1;m&&y?m.data.isEqual(y.data)?O!==V&&(n.track({type:3,doc:y}),z=!0):this.nc(m,y)||(n.track({type:2,doc:y}),z=!0,(u&&this.Ju(y,u)>0||B&&this.Ju(y,B)<0)&&(a=!0)):!m&&y?(n.track({type:0,doc:y}),z=!0):m&&!y&&(n.track({type:1,doc:m}),z=!0,(u||B)&&(a=!0)),z&&(y?(o=o.add(y),i=V?i.add(d):i.delete(d)):(o=o.delete(d),i=i.delete(d)))});const l=this.rc(this.query);if(l)if(ke(this.query)){const d=[];o.forEach(y=>d.push(y));const C=L_(this.query,d);let m=new Xr(YB(this.query));for(const y of C)m=m.add(y);o.forEach(y=>{m.has(y.key)||(i=i.delete(y.key),n.track({type:1,doc:y}))}),o=m}else{const d=this.sc(this.query);for(;o.size>l;){const C=d==="F"?o.last():o.first();o=o.delete(C.key),i=i.delete(C.key),n.track({type:1,doc:C})}}return{Yu:o,ec:n,Oo:a,mutatedKeys:i}}rc(e){var t;return ke(e)?(t=BB(e))==null?void 0:t.limit:e.limit||void 0}sc(e){if(ke(e)){const t=BB(e);return t&&t.limit<0?"L":"F"}return e.limitType}tc(e,t){var n;if(ke(e)){const s=(n=BB(e))==null?void 0:n.limit;return[t.size===s?t.last():null,null]}return[e.limitType==="F"&&t.size===this.rc(this.query)?t.last():null,e.limitType==="L"&&t.size===this.rc(this.query)?t.first():null]}nc(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,s){const i=this.Yu;this.Yu=e.Yu,this.mutatedKeys=e.mutatedKeys;const o=e.ec.yu();o.sort((l,d)=>function(m,y){const O=V=>{switch(V){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return $(20277,{we:V})}};return O(m)-O(y)}(l.type,d.type)||this.Ju(l.doc,d.doc)),this._c(n),s=s??!1;const a=t&&!s?this.oc():[],u=this.Hu.size===0&&this.current&&!s?1:0,B=u!==this.ju;return this.ju=u,o.length!==0||B?{snapshot:new ci(this.query,e.Yu,i,o,e.mutatedKeys,u===0,B,!1,!!n&&n.resumeToken.approximateByteSize()>0),ac:a}:{ac:a}}xu(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Yu:this.Yu,ec:new ip,mutatedKeys:this.mutatedKeys,Oo:!1},!1)):{ac:[]}}uc(e){return!this.zu.has(e)&&!!this.Yu.has(e)&&!this.Yu.get(e).hasLocalMutations}_c(e){e&&(e.addedDocuments.forEach(t=>this.zu=this.zu.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.zu=this.zu.delete(t)),this.current=e.current)}oc(){if(!this.current)return[];const e=this.Hu;this.Hu=ce(),this.Yu.forEach(n=>{this.uc(n.key)&&(this.Hu=this.Hu.add(n.key))});const t=[];return e.forEach(n=>{this.Hu.has(n)||t.push(new sE(n))}),this.Hu.forEach(n=>{e.has(n)||t.push(new rE(n))}),t}cc(e){this.zu=e.Wo,this.Hu=ce();const t=this.Xu(e.documents);return this.applyChanges(t,!0)}lc(){return ci.fromInitialDocuments(this.query,this.Yu,this.mutatedKeys,this.ju===0,this.hasCachedResults)}}const yi="SyncEngine";class Tb{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class Ab{constructor(e){this.key=e,this.Ec=!1}}class Rb{constructor(e,t,n,s,i,o){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.hc={},this.Tc=new xn(a=>p_(a),cc),this.Pc=new Map,this.Ic=new Set,this.Rc=new Te(J.comparator),this.Ac=new Map,this.Vc=new dh,this.dc={},this.fc=new Map,this.mc=Fn.bs(),this.onlineState="Unknown",this.gc=void 0}get isPrimaryClient(){return this.gc===!0}}async function vb(r,e,t=!0){const n=Ec(r);let s;const i=n.Tc.get(e);return i?(n.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.lc()):s=await iE(n,e,t,!0),s}async function Pb(r,e){const t=Ec(r);await iE(t,e,!0,!1)}async function iE(r,e,t,n){const s=await Nu(r.localStore,ke(e)?e:xt(e)),i=s.targetId,o=r.sharedClientState.addLocalQueryTarget(i,t);let a;return n&&(a=await Ph(r,e,i,o==="current",s.resumeToken)),r.isPrimaryClient&&t&&_c(r.remoteStore,s),a}async function Ph(r,e,t,n,s){r.yc=(d,C,m)=>async function(O,V,z,Z){let ne=V.view.Xu(z);ne.Oo&&(ne=await XB(O.localStore,V.query,!1).then(({documents:w})=>V.view.Xu(w,ne)));const oe=Z&&Z.targetChanges.get(V.targetId),Be=Z&&Z.targetMismatches.get(V.targetId)!=null,ue=V.view.applyChanges(ne,O.isPrimaryClient,oe,Be);return sl(O,V.targetId,ue.ac),ue.snapshot}(r,d,C,m);const i=await XB(r.localStore,e,!0),o=new wb(e,i.Wo),a=o.Xu(i.documents),u=na.createSynthesizedTargetChangeForCurrentChange(t,n&&r.onlineState!=="Offline",s),B=o.applyChanges(a,r.isPrimaryClient,u);sl(r,t,B.ac);const l=new Tb(e,t,o);return r.Tc.set(e,l),r.Pc.has(t)?r.Pc.get(t).push(e):r.Pc.set(t,[e]),B.snapshot}async function bb(r,e,t){const n=X(r),s=n.Tc.get(e),i=n.Pc.get(s.targetId);if(i.length>1)return n.Pc.set(s.targetId,i.filter(o=>!cc(o,e))),void n.Tc.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(s.targetId),n.sharedClientState.isActiveQueryTarget(s.targetId)||await ai(n.localStore,s.targetId,!1).then(()=>{n.sharedClientState.clearQueryState(s.targetId),t&&ui(n.remoteStore,s.targetId),Bi(n,s.targetId)}).catch(Tr)):(Bi(n,s.targetId),await ai(n.localStore,s.targetId,!0))}async function Sb(r,e){const t=X(r),n=t.Tc.get(e),s=t.Pc.get(n.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),ui(t.remoteStore,n.targetId))}async function Nb(r,e,t){const n=Oh(r);try{const s=await function(o,a){const u=X(o),B=_e.now(),l=a.reduce((m,y)=>m.add(y.key),ce());let d,C;return u.persistence.runTransaction("Locally write mutations","readwrite",m=>{let y=ze(),O=ce();return u.ko.getEntries(m,l).next(V=>{y=V,y.forEach((z,Z)=>{Z.isValidDocument()||(O=O.add(z))})}).next(()=>u.localDocuments.getOverlayedDocuments(m,y)).next(V=>{d=V;const z=[];for(const Z of a){const ne=pA(Z,d.get(Z.key).overlayedDocument);ne!=null&&z.push(new kn(Z.key,ne,em(ne.value.mapValue),Ne.exists(!0)))}return u.mutationQueue.addMutationBatch(m,B,z,a)}).next(V=>{C=V;const z=V.applyToLocalDocumentSet(d,O);return u.documentOverlayCache.saveOverlays(m,V.batchId,z)})}).then(()=>({batchId:C.batchId,changes:Em(d)}))}(n.localStore,e);n.sharedClientState.addPendingMutation(s.batchId),function(o,a,u){let B=o.dc[o.currentUser.toKey()];B||(B=new Te(ie)),B=B.insert(a,u),o.dc[o.currentUser.toKey()]=B}(n,s.batchId,t),await Rr(n,s.changes),await Ii(n.remoteStore)}catch(s){const i=yh(s,"Failed to persist write");t.reject(i)}}async function oE(r,e){const t=X(r);try{const n=await rb(t.localStore,e);e.targetChanges.forEach((s,i)=>{const o=t.Ac.get(i);o&&(H(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?o.Ec=!0:s.modifiedDocuments.size>0?H(o.Ec,14607):s.removedDocuments.size>0&&(H(o.Ec,42227),o.Ec=!1))}),await Rr(t,n,e)}catch(n){await Tr(n)}}function ap(r,e,t){const n=X(r);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const s=[];n.Tc.forEach((i,o)=>{const a=o.view.xu(e);a.snapshot&&s.push(a.snapshot)}),function(o,a){const u=X(o);u.onlineState=a;let B=!1;u.queries.forEach((l,d)=>{for(const C of d.bu)C.xu(a)&&(B=!0)}),B&&Rh(u)}(n.eventManager,e),s.length&&n.hc.Tn(s),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function Ob(r,e,t){const n=X(r);n.sharedClientState.updateQueryState(e,"rejected",t);const s=n.Ac.get(e),i=s&&s.key;if(i){let o=new Te(J.comparator);o=o.insert(i,Se.newNoDocument(i,ee.min()));const a=ce().add(i),u=new gi(ee.min(),new Map,new Te(ie),o,ze(),a);await oE(n,u),n.Rc=n.Rc.remove(i),n.Ac.delete(e),Nh(n)}else await ai(n.localStore,e,!1).then(()=>Bi(n,e,t)).catch(Tr)}async function Fb(r,e){const t=X(r),n=e.batch.batchId;try{const s=await nb(t.localStore,e);Sh(t,n,null),bh(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await Rr(t,s)}catch(s){await Tr(s)}}async function Lb(r,e,t){const n=X(r);try{const s=await function(o,a){const u=X(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",B=>{let l;return u.mutationQueue.lookupMutationBatch(B,a).next(d=>(H(d!==null,37113),l=d.keys(),u.mutationQueue.removeMutationBatch(B,d))).next(()=>u.mutationQueue.performConsistencyCheck(B)).next(()=>u.documentOverlayCache.removeOverlaysForBatchId(B,l,a)).next(()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(B,l)).next(()=>u.localDocuments.getDocuments(B,l))})}(n.localStore,e);Sh(n,e,t),bh(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await Rr(n,s)}catch(s){await Tr(s)}}function bh(r,e){(r.fc.get(e)||[]).forEach(t=>{t.resolve()}),r.fc.delete(e)}function Sh(r,e,t){const n=X(r);let s=n.dc[n.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),n.dc[n.currentUser.toKey()]=s}}function Bi(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const n of r.Pc.get(e))r.Tc.delete(n),t&&r.hc.wc(n,t);r.Pc.delete(e),r.isPrimaryClient&&r.Vc.e_(e).forEach(n=>{r.Vc.containsKey(n)||aE(r,n)})}function aE(r,e){r.Ic.delete(e.path.canonicalString());const t=r.Rc.get(e);t!==null&&(ui(r.remoteStore,t),r.Rc=r.Rc.remove(e),r.Ac.delete(t),Nh(r))}function sl(r,e,t){for(const n of t)n instanceof rE?(r.Vc.addReference(n.key,e),kb(r,n)):n instanceof sE?(U(yi,"Document no longer in limbo: "+n.key),r.Vc.removeReference(n.key,e),r.Vc.containsKey(n.key)||aE(r,n.key)):$(19791,{bc:n})}function kb(r,e){const t=e.key,n=t.path.canonicalString();r.Rc.get(t)||r.Ic.has(n)||(U(yi,"New document in limbo: "+t),r.Ic.add(n),Nh(r))}function Nh(r){for(;r.Ic.size>0&&r.Rc.size<r.maxConcurrentLimboResolutions;){const e=r.Ic.values().next().value;r.Ic.delete(e);const t=new J(he.fromString(e)),n=r.mc.next();r.Ac.set(n,new Ab(t)),r.Rc=r.Rc.insert(t,n),_c(r.remoteStore,new rn(xt(ta(t.path)),n,"TargetPurposeLimboResolution",Tt.wn))}}async function Rr(r,e,t){const n=X(r),s=[],i=[],o=[];n.Tc.isEmpty()||(n.Tc.forEach((a,u)=>{o.push(n.yc(u,e,t).then(B=>{var l;if((B||t)&&n.isPrimaryClient){const d=B?!B.fromCache:(l=t==null?void 0:t.targetChanges.get(u.targetId))==null?void 0:l.current;n.sharedClientState.updateQueryState(u.targetId,d?"current":"not-current")}if(B){s.push(B);const d=ph.mo(u.targetId,B);i.push(d)}}))}),await Promise.all(o),n.hc.Tn(s),await async function(u,B){const l=X(u);try{await l.persistence.runTransaction("notifyLocalViewChanges","readwrite",d=>P.forEach(B,C=>P.forEach(C.Vo,m=>l.persistence.referenceDelegate.addReference(d,C.targetId,m)).next(()=>P.forEach(C.fo,m=>l.persistence.referenceDelegate.removeReference(d,C.targetId,m)))))}catch(d){if(!Ar(d))throw d;U(gh,"Failed to update sequence numbers: "+d)}for(const d of B){const C=d.targetId;if(!d.fromCache){const m=l.Lo.get(C),y=m.snapshotVersion,O=m.withLastLimboFreeSnapshotVersion(y);l.Lo=l.Lo.insert(C,O)}}}(n.localStore,i))}async function xb(r,e){const t=X(r);if(!t.currentUser.isEqual(e)){U(yi,"User change. New user:",e.toKey());const n=await q_(t.localStore,e);t.currentUser=e,function(i,o){i.fc.forEach(a=>{a.forEach(u=>{u.reject(new G(N.CANCELLED,o))})}),i.fc.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await Rr(t,n.$o)}}function Vb(r,e){const t=X(r),n=t.Ac.get(e);if(n&&n.Ec)return ce().add(n.key);{let s=ce();const i=t.Pc.get(e);if(!i)return s;for(const o of i??[]){const a=t.Tc.get(o);s=s.unionWith(a.view.Zu)}return s}}async function Mb(r,e){const t=X(r),n=await XB(t.localStore,e.query,!0),s=e.view.cc(n);return t.isPrimaryClient&&sl(t,e.targetId,s.ac),s}async function Gb(r,e){const t=X(r);return ZB(t.localStore,e).then(n=>Rr(t,n))}async function Ub(r,e,t,n){const s=X(r),i=await function(a,u){const B=X(a),l=X(B.mutationQueue);return B.persistence.runTransaction("Lookup mutation documents","readonly",d=>l.Wr(d,u).next(C=>C?B.localDocuments.getDocuments(d,C):P.resolve(null)))}(s.localStore,e);i!==null?(t==="pending"?await Ii(s.remoteStore):t==="acknowledged"||t==="rejected"?(Sh(s,e,n||null),bh(s,e),function(a,u){X(X(a).mutationQueue).Hr(u)}(s.localStore,e)):$(6720,"Unknown batchState",{Sc:t}),await Rr(s,i)):U(yi,"Cannot apply mutation batch with id: "+e)}async function Hb(r,e){const t=X(r);if(Ec(t),Oh(t),e===!0&&t.gc!==!0){const n=t.sharedClientState.getAllActiveQueryTargets(),s=await up(t,n.toArray());t.gc=!0,await tl(t.remoteStore,!0);for(const i of s)_c(t.remoteStore,i)}else if(e===!1&&t.gc!==!1){const n=[];let s=Promise.resolve();t.Pc.forEach((i,o)=>{t.sharedClientState.isLocalQueryTarget(o)?n.push(o):s=s.then(()=>(Bi(t,o),ai(t.localStore,o,!0))),ui(t.remoteStore,o)}),await s,await up(t,n),function(o){const a=X(o);a.Ac.forEach((u,B)=>{ui(a.remoteStore,B)}),a.Vc.t_(),a.Ac=new Map,a.Rc=new Te(J.comparator)}(t),t.gc=!1,await tl(t.remoteStore,!1)}}async function up(r,e,t){const n=X(r),s=[],i=[];for(const o of e){let a;const u=n.Pc.get(o);if(u&&u.length!==0){a=await Nu(n.localStore,ke(u[0])?u[0]:xt(u[0]));for(const B of u){const l=n.Tc.get(B),d=await Mb(n,l);d.snapshot&&i.push(d.snapshot)}}else{const B=await K_(n.localStore,o);a=await Nu(n.localStore,B),await Ph(n,uE(B),o,!1,a.resumeToken)}s.push(a)}return n.hc.Tn(i),s}function uE(r){return mn(r)?r:pm(r.path,r.collectionGroup,r.orderBy,r.filters,r.limit,"F",r.startAt,r.endAt)}function qb(r){return function(t){return X(X(t).persistence).Ro()}(X(r).localStore)}async function jb(r,e,t,n){const s=X(r);if(s.gc)return void U(yi,"Ignoring unexpected query state notification.");const i=s.Pc.get(e);if(i&&i.length>0)switch(t){case"current":case"not-current":{let o;if(ke(i[0]))switch(wn(i[0])){case"collection_group":case"collection":o=await ZB(s.localStore,c_(i[0]));break;case"documents":o=await function(B,l){const d=X(B),C=ce(...yu(l).map(m=>J.fromPath(m)));return d.persistence.runTransaction("Get documents for pipeline","readonly",m=>d.ko.getEntries(m,C)).then(m=>m)}(s.localStore,i[0]);break;default:zt(""),o=Vr()}else o=await ZB(s.localStore,function(B){return B.collectionGroup||(B.path.length%2==1?B.path.lastSegment():B.path.get(B.path.length-2))}(i[0]));const a=gi.createSynthesizedRemoteEventForCurrentChange(e,t==="current",Fe.EMPTY_BYTE_STRING);await Rr(s,o,a);break}case"rejected":await ai(s.localStore,e,!0),Bi(s,e,n);break;default:$(64155,t)}}async function Kb(r,e,t){const n=Ec(r);if(n.gc){for(const s of e){if(n.Pc.has(s)&&n.sharedClientState.isActiveQueryTarget(s)){U(yi,"Adding an already active target "+s);continue}const i=await K_(n.localStore,s),o=await Nu(n.localStore,i);await Ph(n,uE(i),o.targetId,!1,o.resumeToken),_c(n.remoteStore,o)}for(const s of t)n.Pc.has(s)&&await ai(n.localStore,s,!1).then(()=>{ui(n.remoteStore,s),Bi(n,s)}).catch(Tr)}}function Ec(r){const e=X(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=oE.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Vb.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=Ob.bind(null,e),e.hc.Tn=Db.bind(null,e.eventManager),e.hc.wc=yb.bind(null,e.eventManager),e}function Oh(r){const e=X(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Fb.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Lb.bind(null,e),e}class Go{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=nc(e.databaseInfo.databaseId),this.sharedClientState=this.vc(e),this.persistence=this.Dc(e),await this.persistence.start(),this.localStore=this.xc(e),this.gcScheduler=this.Cc(e,this.localStore),this.indexBackfillerScheduler=this.Fc(e,this.localStore)}Cc(e,t){return null}Fc(e,t){return null}xc(e){return H_(this.persistence,new U_,e.initialUser,this.serializer)}Dc(e){return new fh(gc.b_,this.serializer)}vc(e){return new tE}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Go.provider={build:()=>new Go};class Jb extends Go{constructor(e){super(),this.cacheSizeBytes=e}Cc(e,t){H(this.persistence.referenceDelegate instanceof Su,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new Km(n,e.asyncQueue,t)}Dc(e){const t=this.cacheSizeBytes!==void 0?Bt.withCacheSize(this.cacheSizeBytes):Bt.DEFAULT;return new fh(n=>Su.b_(n,t),this.serializer)}}class cE extends Go{constructor(e,t,n){super(),this.Oc=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.Oc.initialize(this,e),await Oh(this.Oc.syncEngine),await Ii(this.Oc.remoteStore),await this.persistence.eo(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve()))}xc(e){return H_(this.persistence,new U_,e.initialUser,this.serializer)}Cc(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new Km(n,e.asyncQueue,t)}Fc(e,t){const n=new _b(t,this.persistence);return new mb(e.asyncQueue,n)}Dc(e){const t=G_(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=this.cacheSizeBytes!==void 0?Bt.withCacheSize(this.cacheSizeBytes):Bt.DEFAULT;return new Ch(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,nE(),ou(),this.serializer,this.sharedClientState,!!this.forceOwnership)}vc(e){return new tE}}class zb extends cE{constructor(e,t){super(e,t,!1),this.Oc=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.Oc.syncEngine;this.sharedClientState instanceof CB&&(this.sharedClientState.syncEngine={Au:Ub.bind(null,t),Vu:jb.bind(null,t),du:Kb.bind(null,t),Ro:qb.bind(null,t),Ru:Gb.bind(null,t)},await this.sharedClientState.start()),await this.persistence.eo(async n=>{await Hb(this.Oc.syncEngine,n),this.gcScheduler&&(n&&!this.gcScheduler.started?this.gcScheduler.start():n||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(n&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():n||this.indexBackfillerScheduler.stop())})}vc(e){const t=nE();if(!CB.Ye(t))throw new G(N.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const n=G_(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new CB(t,e.asyncQueue,n,e.clientId,e.initialUser)}}class Uo{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>ap(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=xb.bind(null,this.syncEngine),await tl(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new Ib}()}createDatastore(e){const t=nc(e.databaseInfo.databaseId),n=cR(e.databaseInfo);return fR(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return function(n,s,i,o,a){return new ab(n,s,i,o,a)}(this.localStore,this.datastore,e.asyncQueue,t=>ap(this.syncEngine,t,0),function(){return wC.Ye()?new wC:new iR}())}createSyncEngine(e,t){return function(s,i,o,a,u,B,l){const d=new Rb(s,i,o,a,u,B);return l&&(d.gc=!0),d}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(s){const i=X(s);U(dn,"RemoteStore shutting down."),i.la.add(5),await Ba(i),i.ha.shutdown(),i.Ta.set("Unknown")}(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}Uo.provider={build:()=>new Uo};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Qb=class{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new G(N.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await async function(s,i){const o=X(s),a={documents:i.map(d=>ni(o.serializer,d))},u=await o._t("BatchGetDocuments",o.serializer.databaseId,he.emptyPath(),a,i.length),B=new Map;u.forEach(d=>{const C=jA(o.serializer,d);B.set(C.key.toString(),C)});const l=[];return i.forEach(d=>{const C=B.get(d.toString());H(!!C,55234,{key:d}),l.push(C)}),l}(this.datastore,e);return t.forEach(n=>this.recordVersion(n)),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(n){this.lastTransactionError=n}this.writtenDocs.add(e.toString())}delete(e){this.write(new pi(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach(t=>{e.delete(t.key.toString())}),e.forEach((t,n)=>{const s=J.fromPath(n);this.mutations.push(new Al(s,this.precondition(s)))}),await async function(n,s){const i=X(n),o={writes:s.map(a=>bo(i.serializer,a))};await i.nt("Commit",i.serializer.databaseId,he.emptyPath(),o)}(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw $(50498,{Mc:e.constructor.name});t=ee.min()}const n=this.readVersions.get(e.key.toString());if(n){if(!t.isEqual(n))throw new G(N.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(ee.min())?Ne.exists(!1):Ne.updateTime(t):Ne.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(ee.min()))throw new G(N.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return Ne.updateTime(t)}return Ne.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wb{constructor(e,t,n,s,i){this.asyncQueue=e,this.datastore=t,this.options=n,this.updateFunction=s,this.deferred=i,this.Nc=n.maxAttempts,this.Ht=new xl(this.asyncQueue,"transaction_retry")}Lc(){this.Nc-=1,this.Bc()}Bc(){this.Ht.kt(async()=>{const e=new Qb(this.datastore),t=this.Uc(e);t&&t.then(n=>{this.asyncQueue.enqueueAndForget(()=>e.commit().then(()=>{this.deferred.resolve(n)}).catch(s=>{this.kc(s)}))}).catch(n=>{this.kc(n)})})}Uc(e){try{const t=this.updateFunction(e);return!Zo(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}kc(e){this.Nc>0&&this.qc(e)?(this.Nc-=1,this.asyncQueue.enqueueAndForget(()=>(this.Bc(),Promise.resolve()))):this.deferred.reject(e)}qc(e){if((e==null?void 0:e.name)==="FirebaseError"){const t=e.code;return t==="aborted"||t==="failed-precondition"||t==="already-exists"||!gm(t)}return!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yr="FirestoreClient";class $b{constructor(e,t,n,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this._databaseInfo=s,this.user=ct.UNAUTHENTICATED,this.clientId=Il.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,async o=>{U(yr,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(n,o=>(U(yr,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Jt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=yh(t,"Failed to shutdown persistence");e.reject(n)}}),e.promise}}async function pB(r,e){r.asyncQueue.verifyOperationInProgress(),U(yr,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let n=t.initialUser;r.setCredentialChangeListener(async s=>{n.isEqual(s)||(await q_(e.localStore,s),n=s)}),e.persistence.setDatabaseDeletedListener(()=>r.terminate()),r._offlineComponents=e}async function cp(r,e){r.asyncQueue.verifyOperationInProgress();const t=await Yb(r);U(yr,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener(n=>np(e.remoteStore,n)),r.setAppCheckTokenChangeListener((n,s)=>np(e.remoteStore,s)),r._onlineComponents=e}async function Yb(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){U(yr,"Using user provided OfflineComponentProvider");try{await pB(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(s){return s.name==="FirebaseError"?s.code===N.FAILED_PRECONDITION||s.code===N.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(t))throw t;zt("Error using user provided cache. Falling back to memory cache: "+t),await pB(r,new Go)}}else U(yr,"Using default OfflineComponentProvider"),await pB(r,new Jb(void 0));return r._offlineComponents}async function Fh(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(U(yr,"Using user provided OnlineComponentProvider"),await cp(r,r._uninitializedComponentsProvider._online)):(U(yr,"Using default OnlineComponentProvider"),await cp(r,new Uo))),r._onlineComponents}function Xb(r){return Fh(r).then(e=>e.syncEngine)}function Zb(r){return Fh(r).then(e=>e.datastore)}async function ku(r){const e=await Fh(r),t=e.eventManager;return t.onListen=vb.bind(null,e.syncEngine),t.onUnlisten=bb.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=Pb.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Sb.bind(null,e.syncEngine),t}function eS(r,e,t,n){const s=new Ih(n),i=new vh(e,s,t);return r.asyncQueue.enqueueAndForget(async()=>Th(await ku(r),i)),()=>{s.Va(),r.asyncQueue.enqueueAndForget(async()=>Ah(await ku(r),i))}}function tS(r,e,t={}){const n=new Jt;return r.asyncQueue.enqueueAndForget(async()=>function(i,o,a,u,B){const l=new Ih({next:C=>{l.Va(),o.enqueueAndForget(()=>Ah(i,d));const m=C.docs.has(a);!m&&C.fromCache?B.reject(new G(N.UNAVAILABLE,"Failed to get document because the client is offline.")):m&&C.fromCache&&u&&u.source==="server"?B.reject(new G(N.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):B.resolve(C)},error:C=>B.reject(C)}),d=new vh(ta(a.path),l,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return Th(i,d)}(await ku(r),r.asyncQueue,e,t,n)),n.promise}function nS(r,e,t={}){const n=new Jt;return r.asyncQueue.enqueueAndForget(async()=>function(i,o,a,u,B){const l=new Ih({next:C=>{l.Va(),o.enqueueAndForget(()=>Ah(i,d)),C.fromCache&&u.source==="server"?B.reject(new G(N.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):B.resolve(C)},error:C=>B.reject(C)}),d=new vh(a instanceof ho?Xv(a):a,l,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return Th(i,d)}(await ku(r),r.asyncQueue,e,t,n)),n.promise}function rS(r,e){const t=new Jt;return r.asyncQueue.enqueueAndForget(async()=>Nb(await Xb(r),e,t)),t.promise}function sS(r,e,t){const n=new Jt;return r.asyncQueue.enqueueAndForget(async()=>{const s=await Zb(r);new Wb(r.asyncQueue,s,t,e,n).Lc()}),n.promise}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ho=class{constructor(e,t,n,s,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new Oe(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new iS(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(Nn("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}},iS=class extends Ho{data(){return super.data()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BE{convertValue(e,t="none"){switch(Ke(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Re(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Sn(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw $(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return wr(e,(s,i)=>{n[s]=this.convertValue(i,t)}),n}convertVectorValue(e){var n,s,i;const t=(i=(s=(n=e.fields)==null?void 0:n[os].arrayValue)==null?void 0:s.values)==null?void 0:i.map(o=>Re(o.doubleValue));return new Rt(t)}convertGeoPoint(e){return new cn(Re(e.latitude),Re(e.longitude))}convertArray(e,t){return(e.values||[]).map(n=>this.convertValue(n,t))}convertServerTimestamp(e,t){switch(t){case"previous":const n=Xo(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp($s(e));default:return null}}convertTimestamp(e){const t=bn(e);return new _e(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=he.fromString(e);H(Lm(n),9688,{name:e});const s=new is(n.get(1),n.get(3)),i=new J(n.popFirst(5));return s.isEqual(t)||Me(`A document reference to ${i} refers to a different database (${s.projectId}/${s.database}), which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ic(r,e,t){let n;return n=r?t&&(t.merge||t.mergeFields)?r.toFirestore(e,t):r.toFirestore(e):e,n}class oS extends BE{constructor(e){super(),this.firestore=e}convertBytes(e){return new Ft(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Oe(this.firestore,null,t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bp="AsyncQueue";class lp{constructor(e=Promise.resolve()){this.$c=[],this.Kc=!1,this.Qc=[],this.Wc=null,this.Gc=!1,this.zc=!1,this.jc=[],this.Ht=new xl(this,"async_queue_retry"),this.Hc=()=>{const n=ou();n&&U(Bp,"Visibility state changed to "+n.visibilityState),this.Ht.$t()},this.Jc=e;const t=ou();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Hc)}get isShuttingDown(){return this.Kc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Yc(),this.Zc(e)}enterRestrictedMode(e){if(!this.Kc){this.Kc=!0,this.zc=e||!1;const t=ou();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Hc)}}enqueue(e){if(this.Yc(),this.Kc)return new Promise(()=>{});const t=new Jt;return this.Zc(()=>this.Kc&&this.zc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.$c.push(e),this.Xc()))}async Xc(){if(this.$c.length!==0){try{await this.$c[0](),this.$c.shift(),this.Ht.reset()}catch(e){if(!Ar(e))throw e;U(Bp,"Operation failed with retryable error: "+e)}this.$c.length>0&&this.Ht.kt(()=>this.Xc())}}Zc(e){const t=this.Jc.then(()=>(this.Gc=!0,e().catch(n=>{throw this.Wc=n,this.Gc=!1,Me("INTERNAL UNHANDLED ERROR: ",hp(n)),n}).then(n=>(this.Gc=!1,n))));return this.Jc=t,t}enqueueAfterDelay(e,t,n){this.Yc(),this.jc.indexOf(e)>-1&&(t=0);const s=Dh.createAndSchedule(this,e,t,n,i=>this.el(i));return this.Qc.push(s),s}Yc(){this.Wc&&$(47125,{tl:hp(this.Wc)})}verifyOperationInProgress(){}async nl(){let e;do e=this.Jc,await e;while(e!==this.Jc)}rl(e){for(const t of this.Qc)if(t.timerId===e)return!0;return!1}il(e){return this.nl().then(()=>{this.Qc.sort((t,n)=>t.targetTimeMs-n.targetTimeMs);for(const t of this.Qc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.nl()})}sl(e){this.jc.push(e)}el(e){const t=this.Qc.indexOf(e);this.Qc.splice(t,1)}}function hp(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}class Qt extends Ml{constructor(e,t,n,s){super(e,t,n,s),this.type="firestore",this._queue=new lp,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new lp(e),this._firestoreClient=void 0,await e}}}function mN(r,e,t){t||(t=pu);const n=Vu(r,"firestore");if(n.isInitialized(t)){const s=n.getImmediate({identifier:t}),i=n.getOptions(t);if(An(i,e))return s;throw new G(N.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new G(N.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<jm)throw new G(N.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&Cs(e.host)&&ol(e.host),n.initialize({options:e,instanceIdentifier:t})}function wi(r){if(r._terminated)throw new G(N.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||aS(r),r._firestoreClient}function aS(r){var n,s,i,o;const e=r._freezeSettings(),t=pR(r._databaseId,((n=r._app)==null?void 0:n.options.appId)||"",r._persistenceKey,(s=r._app)==null?void 0:s.options.apiKey,e);r._componentsProvider||(i=e.localCache)!=null&&i._offlineComponentProvider&&((o=e.localCache)!=null&&o._onlineComponentProvider)&&(r._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),r._firestoreClient=new $b(r._authCredentials,r._appCheckCredentials,r._queue,t,r._componentsProvider&&function(u){const B=u==null?void 0:u._online.build();return{_offline:u==null?void 0:u._offline.build(B),_online:B}}(r._componentsProvider))}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dc extends BE{constructor(e){super(),this.firestore=e}convertBytes(e){return new Ft(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Oe(this.firestore,null,t)}}class qs{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class fr extends Ho{constructor(e,t,n,s,i,o){super(e,t,n,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new au(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(Nn("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new G(N.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=fr._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}fr._jsonSchemaVersion="firestore/documentSnapshot/1.0",fr._jsonSchema={type:je("string",fr._jsonSchemaVersion),bundleSource:je("string","DocumentSnapshot"),bundleName:je("string"),bundle:je("string")};class au extends fr{data(e={}){return super.data(e)}}class Zr{constructor(e,t,n,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new qs(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(n=>{e.call(t,new au(this._firestore,this._userDataWriter,n.key,n,new qs(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new G(N.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map(a=>{ke(s._snapshot.query)?YB(s._snapshot.query):Nl(s.query._query);const u=new au(s._firestore,s._userDataWriter,a.doc.key,a.doc,new qs(s._snapshot.mutatedKeys.has(a.doc.key),s._snapshot.fromCache),s.query.converter);return a.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}})}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(a=>i||a.type!==3).map(a=>{const u=new au(s._firestore,s._userDataWriter,a.doc.key,a.doc,new qs(s._snapshot.mutatedKeys.has(a.doc.key),s._snapshot.fromCache),s.query.converter);let B=-1,l=-1;return a.type!==0&&(B=o.indexOf(a.doc.key),o=o.delete(a.doc.key)),a.type!==1&&(o=o.add(a.doc),l=o.indexOf(a.doc.key)),{type:uS(a.type),doc:u,oldIndex:B,newIndex:l}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new G(N.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Zr._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Il.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],n=[],s=[];return this.docs.forEach(i=>{i._document!==null&&(t.push(i._document),n.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function uS(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return $(61501,{type:r})}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Zr._jsonSchemaVersion="firestore/querySnapshot/1.0",Zr._jsonSchema={type:je("string",Zr._jsonSchemaVersion),bundleSource:je("string","QuerySnapshot"),bundleName:je("string"),bundle:je("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lE(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new G(N.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Lh{}class yc extends Lh{}function _N(r,e,...t){let n=[];e instanceof Lh&&n.push(e),n=n.concat(t),function(i){const o=i.filter(u=>u instanceof kh).length,a=i.filter(u=>u instanceof wc).length;if(o>1||o>0&&a>0)throw new G(N.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(n);for(const s of n)r=s._apply(r);return r}class wc extends yc{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new wc(e,t,n)}_apply(e){const t=this._parse(e);return hE(e._query,t),new Cn(e.firestore,e.converter,xB(e._query,t))}_parse(e){const t=Es(e.firestore);return function(i,o,a,u,B,l,d){let C;if(B.isKeyField()){if(l==="array-contains"||l==="array-contains-any")throw new G(N.INVALID_ARGUMENT,`Invalid Query. You can't perform '${l}' queries on documentId().`);if(l==="in"||l==="not-in"){fp(d,l);const y=[];for(const O of d)y.push(dp(u,i,O));C={arrayValue:{values:y}}}else C=dp(u,i,d)}else l!=="in"&&l!=="not-in"&&l!=="array-contains-any"||fp(d,l),C=$m(a,o,d,l==="in"||l==="not-in");return fe.create(B,l,C)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function EN(r,e,t){const n=e,s=Nn("where",r);return wc._create(s,n,t)}class kh extends Lh{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new kh(e,t)}_parse(e){const t=this._queryConstraints.map(n=>n._parse(e)).filter(n=>n.getFilters().length>0);return t.length===1?t[0]:Ie.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:(function(s,i){let o=s;const a=i.getFlattenedFilters();for(const u of a)hE(o,u),o=xB(o,u)}(e._query,t),new Cn(e.firestore,e.converter,xB(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class xh extends yc{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new xh(e,t)}_apply(e){const t=function(s,i,o){if(s.startAt!==null)throw new G(N.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new G(N.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new vo(i,o)}(e._query,this._field,this._direction);return new Cn(e.firestore,e.converter,RA(e._query,t))}}function IN(r,e="asc"){const t=e,n=Nn("orderBy",r);return xh._create(n,t)}class Vh extends yc{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new Vh(e,t,n)}_apply(e){return new Cn(e.firestore,e.converter,Iu(e._query,this._limit,this._limitType))}}function DN(r){return sA("limit",r),Vh._create("limit",r,"F")}class Mh extends yc{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new Mh(e,t,n)}_apply(e){const t=cS(e,this.type,this._docOrFields,this._inclusive);return new Cn(e.firestore,e.converter,vA(e._query,t))}}function yN(...r){return Mh._create("startAfter",r,!1)}function cS(r,e,t,n){if(t[0]=ae(t[0]),t[0]instanceof Ho)return function(i,o,a,u,B){if(!u)throw new G(N.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${a}().`);const l=[];for(const d of zs(i))if(d.field.isKeyField())l.push(as(o,u.key));else{const C=u.data.field(d.field);if(Yo(C))throw new G(N.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+d.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(C===null){const m=d.field.canonicalString();throw new G(N.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${m}' (used as the orderBy) does not exist.`)}l.push(C)}return new mr(l,B)}(r._query,r.firestore._databaseId,e,t[0]._document,n);{const s=Es(r.firestore);return function(o,a,u,B,l,d){const C=o.explicitOrderBy;if(l.length>C.length)throw new G(N.INVALID_ARGUMENT,`Too many arguments provided to ${B}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const m=[];for(let y=0;y<l.length;y++){const O=l[y];if(C[y].field.isKeyField()){if(typeof O!="string")throw new G(N.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${B}(), but got a ${typeof O}`);if(!Sl(o)&&O.indexOf("/")!==-1)throw new G(N.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${B}() must be a plain document ID, but '${O}' contains a slash.`);const V=o.path.child(he.fromString(O));if(!J.isDocumentKey(V))throw new G(N.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${B}() must result in a valid document path, but '${V}' is not because it contains an odd number of segments.`);const z=new J(V);m.push(as(a,z))}else{const V=$m(u,B,O);m.push(V)}}return new mr(m,d)}(r._query,r.firestore._databaseId,s,e,t,n)}}function dp(r,e,t){if(typeof(t=ae(t))=="string"){if(t==="")throw new G(N.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Sl(e)&&t.indexOf("/")!==-1)throw new G(N.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const n=e.path.child(he.fromString(t));if(!J.isDocumentKey(n))throw new G(N.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return as(r,new J(n))}if(t instanceof Oe)return as(r,t._key);throw new G(N.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${$u(t)}.`)}function fp(r,e){if(!Array.isArray(r)||r.length===0)throw new G(N.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function hE(r,e){const t=function(s,i){for(const o of s)for(const a of o.getFlattenedFilters())if(i.indexOf(a.op)>=0)return a.op;return null}(r.filters,function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(t!==null)throw t===e.op?new G(N.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new G(N.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cp(r){return function(t,n){if(typeof t!="object"||t===null)return!1;const s=t;for(const i of n)if(i in s&&typeof s[i]=="function")return!0;return!1}(r,["next","error","complete"])}class BS{constructor(e){let t;this.kind="persistent",e!=null&&e.tabManager?(e.tabManager._initialize(e),t=e.tabManager):(t=dS(void 0),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}}function wN(r){return new BS(r)}class lS{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=Uo.provider,this._offlineComponentProvider={build:t=>new cE(t,e==null?void 0:e.cacheSizeBytes,this.forceOwnership)}}}class hS{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=Uo.provider,this._offlineComponentProvider={build:t=>new zb(t,e==null?void 0:e.cacheSizeBytes)}}}function dS(r){return new lS(r==null?void 0:r.forceOwnership)}function TN(){return new hS}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fS={maxAttempts:5};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class CS{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=Es(e)}set(e,t,n){this._verifyNotCommitted();const s=or(e,this._firestore),i=Ic(s.converter,t,n),o=ic(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,n);return this._mutations.push(o.toMutation(s._key,Ne.none())),this}update(e,t,n,...s){this._verifyNotCommitted();const i=or(e,this._firestore);let o;return o=typeof(t=ae(t))=="string"||t instanceof mi?Kl(this._dataReader,"WriteBatch.update",i._key,t,n,s):jl(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(o.toMutation(i._key,Ne.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=or(e,this._firestore);return this._mutations=this._mutations.concat(new pi(t._key,Ne.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new G(N.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function or(r,e){if((r=ae(r)).firestore!==e)throw new G(N.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let pS=class{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=Es(e)}get(e){const t=or(e,this._firestore),n=new oS(this._firestore);return this._transaction.lookup([t._key]).then(s=>{if(!s||s.length!==1)return $(24041);const i=s[0];if(i.isFoundDocument())return new Ho(this._firestore,n,i.key,i,t.converter);if(i.isNoDocument())return new Ho(this._firestore,n,t._key,null,t.converter);throw $(18433,{doc:i})})}set(e,t,n){const s=or(e,this._firestore),i=Ic(s.converter,t,n),o=ic(this._dataReader,"Transaction.set",s._key,i,s.converter!==null,n);return this._transaction.set(s._key,o),this}update(e,t,n,...s){const i=or(e,this._firestore);let o;return o=typeof(t=ae(t))=="string"||t instanceof mi?Kl(this._dataReader,"Transaction.update",i._key,t,n,s):jl(this._dataReader,"Transaction.update",i._key,t),this._transaction.update(i._key,o),this}delete(e){const t=or(e,this._firestore);return this._transaction.delete(t._key),this}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gS extends pS{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=or(e,this._firestore),n=new Dc(this._firestore);return super.get(e).then(s=>new fr(this._firestore,n,t._key,s._document,new qs(!1,!1),t.converter))}}function RN(r,e,t){r=Et(r,Qt);const n={...fS,...t};(function(o){if(o.maxAttempts<1)throw new G(N.INVALID_ARGUMENT,"Max attempts must be at least 1")})(n);const s=wi(r);return sS(s,i=>e(new gS(r,i)),n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vN(r){r=Et(r,Oe);const e=Et(r.firestore,Qt),t=wi(e);return tS(t,r._key).then(n=>dE(e,r,n))}function PN(r){r=Et(r,Cn);const e=Et(r.firestore,Qt),t=wi(e),n=new Dc(e);return lE(r._query),nS(t,r._query).then(s=>new Zr(e,n,r,s))}function bN(r,e,t){r=Et(r,Oe);const n=Et(r.firestore,Qt),s=Ic(r.converter,e,t),i=Es(n);return la(n,[ic(i,"setDoc",r._key,s,r.converter!==null,t).toMutation(r._key,Ne.none())])}function SN(r,e,t,...n){r=Et(r,Oe);const s=Et(r.firestore,Qt),i=Es(s);let o;return o=typeof(e=ae(e))=="string"||e instanceof mi?Kl(i,"updateDoc",r._key,e,t,n):jl(i,"updateDoc",r._key,e),la(s,[o.toMutation(r._key,Ne.exists(!0))])}function NN(r){return la(Et(r.firestore,Qt),[new pi(r._key,Ne.none())])}function ON(r,e){const t=Et(r.firestore,Qt),n=DR(r),s=Ic(r.converter,e),i=Es(r.firestore);return la(t,[ic(i,"addDoc",n._key,s,r.converter!==null,{}).toMutation(n._key,Ne.exists(!1))]).then(()=>n)}function FN(r,...e){var B,l,d;r=ae(r);let t={includeMetadataChanges:!1,source:"default"},n=0;typeof e[n]!="object"||Cp(e[n])||(t=e[n++]);const s={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(Cp(e[n])){const C=e[n];e[n]=(B=C.next)==null?void 0:B.bind(C),e[n+1]=(l=C.error)==null?void 0:l.bind(C),e[n+2]=(d=C.complete)==null?void 0:d.bind(C)}let i,o,a;if(r instanceof Oe)o=Et(r.firestore,Qt),a=ta(r._key.path),i={next:C=>{e[n]&&e[n](dE(o,r,C))},error:e[n+1],complete:e[n+2]};else{const C=Et(r,Cn);o=Et(C.firestore,Qt),a=C._query;const m=new Dc(o);i={next:y=>{e[n]&&e[n](new Zr(o,m,C,y))},error:e[n+1],complete:e[n+2]},lE(r._query)}const u=wi(o);return eS(u,a,s,i)}function la(r,e){const t=wi(r);return rS(t,e)}function dE(r,e,t){const n=t.docs.get(e._key),s=new Dc(r);return new fr(r,s,e._key,n,new qs(t.hasPendingWrites,t.fromCache),e.converter)}function LN(r){return r=Et(r,Qt),wi(r),new CS(r,e=>la(r,e))}const pp="@firebase/firestore",gp="4.17.2";(function(e,t=!0){YT(ps),ts(new Cr("firestore",(n,{instanceIdentifier:s,options:i})=>{const o=n.getProvider("app").getImmediate(),a=new Qt(new tR(n.getProvider("auth-internal")),new sR(o,n.getProvider("app-check-internal")),aA(o,s),o);return i={useFetchStreams:t,...i},a._setSettings(i),a},"PUBLIC").setMultipleInstances(!0)),an(pp,gp,e),an(pp,gp,"esm2020")})();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fE="firebasestorage.googleapis.com",CE="storageBucket",mS=2*60*1e3,_S=10*60*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ve extends fn{constructor(e,t,n=0){super(gB(e),`Firebase Storage: ${t} (${gB(e)})`),this.status_=n,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,Ve.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return gB(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var xe;(function(r){r.UNKNOWN="unknown",r.OBJECT_NOT_FOUND="object-not-found",r.BUCKET_NOT_FOUND="bucket-not-found",r.PROJECT_NOT_FOUND="project-not-found",r.QUOTA_EXCEEDED="quota-exceeded",r.UNAUTHENTICATED="unauthenticated",r.UNAUTHORIZED="unauthorized",r.UNAUTHORIZED_APP="unauthorized-app",r.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",r.INVALID_CHECKSUM="invalid-checksum",r.CANCELED="canceled",r.INVALID_EVENT_NAME="invalid-event-name",r.INVALID_URL="invalid-url",r.INVALID_DEFAULT_BUCKET="invalid-default-bucket",r.NO_DEFAULT_BUCKET="no-default-bucket",r.CANNOT_SLICE_BLOB="cannot-slice-blob",r.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",r.NO_DOWNLOAD_URL="no-download-url",r.INVALID_ARGUMENT="invalid-argument",r.INVALID_ARGUMENT_COUNT="invalid-argument-count",r.APP_DELETED="app-deleted",r.INVALID_ROOT_OPERATION="invalid-root-operation",r.INVALID_FORMAT="invalid-format",r.INTERNAL_ERROR="internal-error",r.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(xe||(xe={}));function gB(r){return"storage/"+r}function Gh(){const r="An unknown error occurred, please check the error payload for server response.";return new Ve(xe.UNKNOWN,r)}function ES(r){return new Ve(xe.OBJECT_NOT_FOUND,"Object '"+r+"' does not exist.")}function IS(r){return new Ve(xe.QUOTA_EXCEEDED,"Quota for bucket '"+r+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function DS(){const r="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new Ve(xe.UNAUTHENTICATED,r)}function yS(){return new Ve(xe.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function wS(r){return new Ve(xe.UNAUTHORIZED,"User does not have permission to access '"+r+"'.")}function TS(){return new Ve(xe.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function AS(){return new Ve(xe.CANCELED,"User canceled the upload/download.")}function RS(r){return new Ve(xe.INVALID_URL,"Invalid URL '"+r+"'.")}function vS(r){return new Ve(xe.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+r+"'.")}function PS(){return new Ve(xe.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+CE+"' property when initializing the app?")}function bS(){return new Ve(xe.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function SS(){return new Ve(xe.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function NS(r){return new Ve(xe.UNSUPPORTED_ENVIRONMENT,`${r} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function il(r){return new Ve(xe.INVALID_ARGUMENT,r)}function pE(){return new Ve(xe.APP_DELETED,"The Firebase app was deleted.")}function OS(r){return new Ve(xe.INVALID_ROOT_OPERATION,"The operation '"+r+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function _o(r,e){return new Ve(xe.INVALID_FORMAT,"String does not match format '"+r+"': "+e)}function Qi(r){throw new Ve(xe.INTERNAL_ERROR,"Internal error: "+r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kt{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let n;try{n=kt.makeFromUrl(e,t)}catch{return new kt(e,"")}if(n.path==="")return n;throw vS(e)}static makeFromUrl(e,t){let n=null;const s="([A-Za-z0-9.\\-_]+)";function i(oe){oe.path.charAt(oe.path.length-1)==="/"&&(oe.path_=oe.path_.slice(0,-1))}const o="(/(.*))?$",a=new RegExp("^gs://"+s+o,"i"),u={bucket:1,path:3};function B(oe){oe.path_=decodeURIComponent(oe.path)}const l="v[A-Za-z0-9_]+",d=t.replace(/[.]/g,"\\."),C="(/([^?#]*).*)?$",m=new RegExp(`^https?://${d}/${l}/b/${s}/o${C}`,"i"),y={bucket:1,path:3},O=t===fE?"(?:storage.googleapis.com|storage.cloud.google.com)":t,V="([^?#]*)",z=new RegExp(`^https?://${O}/${s}/${V}`,"i"),ne=[{regex:a,indices:u,postModify:i},{regex:m,indices:y,postModify:B},{regex:z,indices:{bucket:1,path:2},postModify:B}];for(let oe=0;oe<ne.length;oe++){const Be=ne[oe],ue=Be.regex.exec(e);if(ue){const w=ue[Be.indices.bucket];let E=ue[Be.indices.path];E||(E=""),n=new kt(w,E),Be.postModify(n);break}}if(n==null)throw RS(e);return n}}class FS{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function LS(r,e,t){let n=1,s=null,i=null,o=!1,a=0;function u(){return a===2}let B=!1;function l(...V){B||(B=!0,e.apply(null,V))}function d(V){s=setTimeout(()=>{s=null,r(m,u())},V)}function C(){i&&clearTimeout(i)}function m(V,...z){if(B){C();return}if(V){C(),l.call(null,V,...z);return}if(u()||o){C(),l.call(null,V,...z);return}n<64&&(n*=2);let ne;a===1?(a=2,ne=0):ne=(n+Math.random())*1e3,d(ne)}let y=!1;function O(V){y||(y=!0,C(),!B&&(s!==null?(V||(a=2),clearTimeout(s),d(0)):V||(a=1)))}return d(0),i=setTimeout(()=>{o=!0,O(!0)},t),O}function kS(r){r(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xS(r){return r!==void 0}function VS(r){return typeof r=="object"&&!Array.isArray(r)}function Uh(r){return typeof r=="string"||r instanceof String}function mp(r){return Hh()&&r instanceof Blob}function Hh(){return typeof Blob<"u"}function _p(r,e,t,n){if(n<e)throw il(`Invalid value for '${r}'. Expected ${e} or greater.`);if(n>t)throw il(`Invalid value for '${r}'. Expected ${t} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qh(r,e,t){let n=e;return t==null&&(n=`https://${e}`),`${t}://${n}/v0${r}`}function gE(r){const e=encodeURIComponent;let t="?";for(const n in r)if(r.hasOwnProperty(n)){const s=e(n)+"="+e(r[n]);t=t+s+"&"}return t=t.slice(0,-1),t}var es;(function(r){r[r.NO_ERROR=0]="NO_ERROR",r[r.NETWORK_ERROR=1]="NETWORK_ERROR",r[r.ABORT=2]="ABORT"})(es||(es={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function MS(r,e){const t=r>=500&&r<600,s=[408,429].indexOf(r)!==-1,i=e.indexOf(r)!==-1;return t||s||i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GS{constructor(e,t,n,s,i,o,a,u,B,l,d,C=!0,m=!1){this.url_=e,this.method_=t,this.headers_=n,this.body_=s,this.successCodes_=i,this.additionalRetryCodes_=o,this.callback_=a,this.errorCallback_=u,this.timeout_=B,this.progressCallback_=l,this.connectionFactory_=d,this.retry=C,this.isUsingEmulator=m,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((y,O)=>{this.resolve_=y,this.reject_=O,this.start_()})}start_(){const e=(n,s)=>{if(s){n(!1,new Ha(!1,null,!0));return}const i=this.connectionFactory_();this.pendingConnection_=i;const o=a=>{const u=a.loaded,B=a.lengthComputable?a.total:-1;this.progressCallback_!==null&&this.progressCallback_(u,B)};this.progressCallback_!==null&&i.addUploadProgressListener(o),i.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&i.removeUploadProgressListener(o),this.pendingConnection_=null;const a=i.getErrorCode()===es.NO_ERROR,u=i.getStatus();if(!a||MS(u,this.additionalRetryCodes_)&&this.retry){const l=i.getErrorCode()===es.ABORT;n(!1,new Ha(!1,null,l));return}const B=this.successCodes_.indexOf(u)!==-1;n(!0,new Ha(B,i))})},t=(n,s)=>{const i=this.resolve_,o=this.reject_,a=s.connection;if(s.wasSuccessCode)try{const u=this.callback_(a,a.getResponse());xS(u)?i(u):i()}catch(u){o(u)}else if(a!==null){const u=Gh();u.serverResponse=a.getErrorText(),this.errorCallback_?o(this.errorCallback_(a,u)):o(u)}else if(s.canceled){const u=this.appDelete_?pE():AS();o(u)}else{const u=TS();o(u)}};this.canceled_?t(!1,new Ha(!1,null,!0)):this.backoffId_=LS(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&kS(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class Ha{constructor(e,t,n){this.wasSuccessCode=e,this.connection=t,this.canceled=!!n}}function US(r,e){e!==null&&e.length>0&&(r.Authorization="Firebase "+e)}function HS(r,e){r["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function qS(r,e){e&&(r["X-Firebase-GMPID"]=e)}function jS(r,e){e!==null&&(r["X-Firebase-AppCheck"]=e)}function KS(r,e,t,n,s,i,o=!0,a=!1){const u=gE(r.urlParams),B=r.url+u,l=Object.assign({},r.headers);return qS(l,e),US(l,t),HS(l,i),jS(l,n),new GS(B,r.method,l,r.body,r.successCodes,r.additionalRetryCodes,r.handler,r.errorHandler,r.timeout,r.progressCallback,s,o,a)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function JS(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function zS(...r){const e=JS();if(e!==void 0){const t=new e;for(let n=0;n<r.length;n++)t.append(r[n]);return t.getBlob()}else{if(Hh())return new Blob(r);throw new Ve(xe.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function QS(r,e,t){return r.webkitSlice?r.webkitSlice(e,t):r.mozSlice?r.mozSlice(e,t):r.slice?r.slice(e,t):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function WS(r){if(typeof atob>"u")throw NS("base-64");return atob(r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sn={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class mB{constructor(e,t){this.data=e,this.contentType=t||null}}function $S(r,e){switch(r){case sn.RAW:return new mB(mE(e));case sn.BASE64:case sn.BASE64URL:return new mB(_E(r,e));case sn.DATA_URL:return new mB(XS(e),ZS(e))}throw Gh()}function mE(r){const e=[];for(let t=0;t<r.length;t++){let n=r.charCodeAt(t);if(n<=127)e.push(n);else if(n<=2047)e.push(192|n>>6,128|n&63);else if((n&64512)===55296)if(!(t<r.length-1&&(r.charCodeAt(t+1)&64512)===56320))e.push(239,191,189);else{const i=n,o=r.charCodeAt(++t);n=65536|(i&1023)<<10|o&1023,e.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|n&63)}else(n&64512)===56320?e.push(239,191,189):e.push(224|n>>12,128|n>>6&63,128|n&63)}return new Uint8Array(e)}function YS(r){let e;try{e=decodeURIComponent(r)}catch{throw _o(sn.DATA_URL,"Malformed data URL.")}return mE(e)}function _E(r,e){switch(r){case sn.BASE64:{const s=e.indexOf("-")!==-1,i=e.indexOf("_")!==-1;if(s||i)throw _o(r,"Invalid character '"+(s?"-":"_")+"' found: is it base64url encoded?");break}case sn.BASE64URL:{const s=e.indexOf("+")!==-1,i=e.indexOf("/")!==-1;if(s||i)throw _o(r,"Invalid character '"+(s?"+":"/")+"' found: is it base64 encoded?");e=e.replace(/-/g,"+").replace(/_/g,"/");break}}let t;try{t=WS(e)}catch(s){throw s.message.includes("polyfill")?s:_o(r,"Invalid character found")}const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n}class EE{constructor(e){this.base64=!1,this.contentType=null;const t=e.match(/^data:([^,]+)?,/);if(t===null)throw _o(sn.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const n=t[1]||null;n!=null&&(this.base64=e0(n,";base64"),this.contentType=this.base64?n.substring(0,n.length-7):n),this.rest=e.substring(e.indexOf(",")+1)}}function XS(r){const e=new EE(r);return e.base64?_E(sn.BASE64,e.rest):YS(e.rest)}function ZS(r){return new EE(r).contentType}function e0(r,e){return r.length>=e.length?r.substring(r.length-e.length)===e:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rr{constructor(e,t){let n=0,s="";mp(e)?(this.data_=e,n=e.size,s=e.type):e instanceof ArrayBuffer?(t?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),n=this.data_.length):e instanceof Uint8Array&&(t?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),n=e.length),this.size_=n,this.type_=s}size(){return this.size_}type(){return this.type_}slice(e,t){if(mp(this.data_)){const n=this.data_,s=QS(n,e,t);return s===null?null:new rr(s)}else{const n=new Uint8Array(this.data_.buffer,e,t-e);return new rr(n,!0)}}static getBlob(...e){if(Hh()){const t=e.map(n=>n instanceof rr?n.data_:n);return new rr(zS.apply(null,t))}else{const t=e.map(o=>Uh(o)?$S(sn.RAW,o).data:o.data_);let n=0;t.forEach(o=>{n+=o.byteLength});const s=new Uint8Array(n);let i=0;return t.forEach(o=>{for(let a=0;a<o.length;a++)s[i++]=o[a]}),new rr(s,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function IE(r){let e;try{e=JSON.parse(r)}catch{return null}return VS(e)?e:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function t0(r){if(r.length===0)return null;const e=r.lastIndexOf("/");return e===-1?"":r.slice(0,e)}function n0(r,e){const t=e.split("/").filter(n=>n.length>0).join("/");return r.length===0?t:r+"/"+t}function DE(r){const e=r.lastIndexOf("/",r.length-2);return e===-1?r:r.slice(e+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function r0(r,e){return e}class gt{constructor(e,t,n,s){this.server=e,this.local=t||e,this.writable=!!n,this.xform=s||r0}}let qa=null;function s0(r){return!Uh(r)||r.length<2?r:DE(r)}function yE(){if(qa)return qa;const r=[];r.push(new gt("bucket")),r.push(new gt("generation")),r.push(new gt("metageneration")),r.push(new gt("name","fullPath",!0));function e(i,o){return s0(o)}const t=new gt("name");t.xform=e,r.push(t);function n(i,o){return o!==void 0?Number(o):o}const s=new gt("size");return s.xform=n,r.push(s),r.push(new gt("timeCreated")),r.push(new gt("updated")),r.push(new gt("md5Hash",null,!0)),r.push(new gt("cacheControl",null,!0)),r.push(new gt("contentDisposition",null,!0)),r.push(new gt("contentEncoding",null,!0)),r.push(new gt("contentLanguage",null,!0)),r.push(new gt("contentType",null,!0)),r.push(new gt("metadata","customMetadata",!0)),qa=r,qa}function i0(r,e){function t(){const n=r.bucket,s=r.fullPath,i=new kt(n,s);return e._makeStorageReference(i)}Object.defineProperty(r,"ref",{get:t})}function o0(r,e,t){const n={};n.type="file";const s=t.length;for(let i=0;i<s;i++){const o=t[i];n[o.local]=o.xform(n,e[o.server])}return i0(n,r),n}function wE(r,e,t){const n=IE(e);return n===null?null:o0(r,n,t)}function a0(r,e,t,n){const s=IE(e);if(s===null||!Uh(s.downloadTokens))return null;const i=s.downloadTokens;if(i.length===0)return null;const o=encodeURIComponent;return i.split(",").map(B=>{const l=r.bucket,d=r.fullPath,C="/b/"+o(l)+"/o/"+o(d),m=qh(C,t,n),y=gE({alt:"media",token:B});return m+y})[0]}function u0(r,e){const t={},n=e.length;for(let s=0;s<n;s++){const i=e[s];i.writable&&(t[i.server]=r[i.local])}return JSON.stringify(t)}class TE{constructor(e,t,n,s){this.url=e,this.method=t,this.handler=n,this.timeout=s,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function AE(r){if(!r)throw Gh()}function c0(r,e){function t(n,s){const i=wE(r,s,e);return AE(i!==null),i}return t}function B0(r,e){function t(n,s){const i=wE(r,s,e);return AE(i!==null),a0(i,s,r.host,r._protocol)}return t}function RE(r){function e(t,n){let s;return t.getStatus()===401?t.getErrorText().includes("Firebase App Check token is invalid")?s=yS():s=DS():t.getStatus()===402?s=IS(r.bucket):t.getStatus()===403?s=wS(r.path):s=n,s.status=t.getStatus(),s.serverResponse=n.serverResponse,s}return e}function l0(r){const e=RE(r);function t(n,s){let i=e(n,s);return n.getStatus()===404&&(i=ES(r.path)),i.serverResponse=s.serverResponse,i}return t}function h0(r,e,t){const n=e.fullServerUrl(),s=qh(n,r.host,r._protocol),i="GET",o=r.maxOperationRetryTime,a=new TE(s,i,B0(r,t),o);return a.errorHandler=l0(e),a}function d0(r,e){return r&&r.contentType||e&&e.type()||"application/octet-stream"}function f0(r,e,t){const n=Object.assign({},t);return n.fullPath=r.path,n.size=e.size(),n.contentType||(n.contentType=d0(null,e)),n}function C0(r,e,t,n,s){const i=e.bucketOnlyServerUrl(),o={"X-Goog-Upload-Protocol":"multipart"};function a(){let ne="";for(let oe=0;oe<2;oe++)ne=ne+Math.random().toString().slice(2);return ne}const u=a();o["Content-Type"]="multipart/related; boundary="+u;const B=f0(e,n,s),l=u0(B,t),d="--"+u+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+l+`\r
--`+u+`\r
Content-Type: `+B.contentType+`\r
\r
`,C=`\r
--`+u+"--",m=rr.getBlob(d,n,C);if(m===null)throw bS();const y={name:B.fullPath},O=qh(i,r.host,r._protocol),V="POST",z=r.maxUploadRetryTime,Z=new TE(O,V,c0(r,t),z);return Z.urlParams=y,Z.headers=o,Z.body=m.uploadData(),Z.errorHandler=RE(e),Z}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class p0{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=es.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=es.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=es.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,t,n,s,i){if(this.sent_)throw Qi("cannot .send() more than once");if(Cs(e)&&n&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(t,e,!0),i!==void 0)for(const o in i)i.hasOwnProperty(o)&&this.xhr_.setRequestHeader(o,i[o].toString());return s!==void 0?this.xhr_.send(s):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw Qi("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw Qi("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw Qi("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw Qi("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}}class g0 extends p0{initXhr(){this.xhr_.responseType="text"}}function vE(){return new g0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fs{constructor(e,t){this._service=e,t instanceof kt?this._location=t:this._location=kt.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new fs(e,t)}get root(){const e=new kt(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return DE(this._location.path)}get storage(){return this._service}get parent(){const e=t0(this._location.path);if(e===null)return null;const t=new kt(this._location.bucket,e);return new fs(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw OS(e)}}function m0(r,e,t){r._throwIfRoot("uploadBytes");const n=C0(r.storage,r._location,yE(),new rr(e,!0),t);return r.storage.makeRequestWithTokens(n,vE).then(s=>({metadata:s,ref:r}))}function _0(r){r._throwIfRoot("getDownloadURL");const e=h0(r.storage,r._location,yE());return r.storage.makeRequestWithTokens(e,vE).then(t=>{if(t===null)throw SS();return t})}function E0(r,e){const t=n0(r._location.path,e),n=new kt(r._location.bucket,t);return new fs(r.storage,n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function I0(r){return/^[A-Za-z]+:\/\//.test(r)}function D0(r,e){return new fs(r,e)}function PE(r,e){if(r instanceof jh){const t=r;if(t._bucket==null)throw PS();const n=new fs(t,t._bucket);return e!=null?PE(n,e):n}else return e!==void 0?E0(r,e):r}function y0(r,e){if(e&&I0(e)){if(r instanceof jh)return D0(r,e);throw il("To use ref(service, url), the first argument must be a Storage instance.")}else return PE(r,e)}function Ep(r,e){const t=e==null?void 0:e[CE];return t==null?null:kt.makeFromBucketSpec(t,r)}function w0(r,e,t,n={}){r.host=`${e}:${t}`;const s=Cs(e);s&&ol(`https://${r.host}/b`),r._isUsingEmulator=!0,r._protocol=s?"https":"http";const{mockUserToken:i}=n;i&&(r._overrideAuthToken=typeof i=="string"?i:_I(i,r.app.options.projectId))}class jh{constructor(e,t,n,s,i,o=!1){this.app=e,this._authProvider=t,this._appCheckProvider=n,this._url=s,this._firebaseVersion=i,this._isUsingEmulator=o,this._bucket=null,this._host=fE,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=mS,this._maxUploadRetryTime=_S,this._requests=new Set,s!=null?this._bucket=kt.makeFromBucketSpec(s,this._host):this._bucket=Ep(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=kt.makeFromBucketSpec(this._url,e):this._bucket=Ep(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){_p("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){_p("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){if(qe(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new fs(this,e)}_makeRequest(e,t,n,s,i=!0){if(this._deleted)return new FS(pE());{const o=KS(e,this._appId,n,s,t,this._firebaseVersion,i,this._isUsingEmulator);return this._requests.add(o),o.getPromise().then(()=>this._requests.delete(o),()=>this._requests.delete(o)),o}}async makeRequestWithTokens(e,t){const[n,s]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,n,s).getPromise()}}const Ip="@firebase/storage",Dp="0.14.5";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bE="storage";function kN(r,e,t){return r=ae(r),m0(r,e,t)}function xN(r){return r=ae(r),_0(r)}function VN(r,e){return r=ae(r),y0(r,e)}function MN(r=xp(),e){r=ae(r);const n=Vu(r,bE).getImmediate({identifier:e}),s=mI("storage");return s&&T0(n,...s),n}function T0(r,e,t,n={}){w0(r,e,t,n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function A0(r,{instanceIdentifier:e}){const t=r.getProvider("app").getImmediate(),n=r.getProvider("auth-internal"),s=r.getProvider("app-check-internal");return new jh(t,n,s,e,ps)}function R0(){ts(new Cr(bE,A0,"PUBLIC").setMultipleInstances(!0)),an(Ip,Dp,""),an(Ip,Dp,"esm2020")}R0();export{U0 as $,fl as A,tN as B,RN as C,LN as D,iN as E,dN as F,Zn as G,L0 as H,q0 as I,lN as J,W0 as K,Q0 as L,BN as M,F0 as N,O0 as O,Y0 as P,G0 as Q,za as R,V0 as S,gs as T,Xn as U,er as V,X0 as W,eN as X,tr as Y,ry as Z,$0 as _,mN as a,N0 as a0,x0 as a1,z0 as a2,P0 as a3,S0 as a4,M0 as a5,Z0 as a6,b0 as a7,j0 as a8,K0 as a9,Py as aa,H0 as ab,rN as ac,sN as ad,nN as ae,Yy as af,Pn as ag,J0 as ah,uf as ai,Dw as aj,pg as ak,Bw as al,MN as b,TN as c,PN as d,cN as e,DR as f,oN as g,vN as h,bD as i,FN as j,NN as k,DN as l,bN as m,fN as n,IN as o,wN as p,_N as q,ON as r,yN as s,VN as t,SN as u,kN as v,EN as w,xN as x,hN as y,k0 as z};
