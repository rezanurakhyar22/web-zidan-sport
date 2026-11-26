(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,48958,e=>{"use strict";let t,r;var n,s,a,i,l,o=e.i(43476),c=e.i(71645),d=e.i(46932),h=e.i(88653),u=e.i(63662);e.i(23842);var m=e.i(78367),g=e.i(2153),f=e.i(18566);e.i(12243);var x=e.i(68216);e.i(47167);var p=e.i(60061),y=e.i(24847),N=e.i(57688),b=Object.defineProperty,v=Object.getOwnPropertySymbols,j=Object.prototype.hasOwnProperty,w=Object.prototype.propertyIsEnumerable,C=(e,t,r)=>t in e?b(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,E=(e,t)=>{for(var r in t||(t={}))j.call(t,r)&&C(e,r,t[r]);if(v)for(var r of v(t))w.call(t,r)&&C(e,r,t[r]);return e},M=(e,t)=>{var r={};for(var n in e)j.call(e,n)&&0>t.indexOf(n)&&(r[n]=e[n]);if(null!=e&&v)for(var n of v(e))0>t.indexOf(n)&&w.call(e,n)&&(r[n]=e[n]);return r};(e=>{let t=class t{constructor(e,r,n,a){if(this.version=e,this.errorCorrectionLevel=r,this.modules=[],this.isFunction=[],e<t.MIN_VERSION||e>t.MAX_VERSION)throw RangeError("Version value out of range");if(a<-1||a>7)throw RangeError("Mask value out of range");this.size=4*e+17;let i=[];for(let e=0;e<this.size;e++)i.push(!1);for(let e=0;e<this.size;e++)this.modules.push(i.slice()),this.isFunction.push(i.slice());this.drawFunctionPatterns();const l=this.addEccAndInterleave(n);if(this.drawCodewords(l),-1==a){let e=1e9;for(let t=0;t<8;t++){this.applyMask(t),this.drawFormatBits(t);const r=this.getPenaltyScore();r<e&&(a=t,e=r),this.applyMask(t)}}s(0<=a&&a<=7),this.mask=a,this.applyMask(a),this.drawFormatBits(a),this.isFunction=[]}static encodeText(r,n){let s=e.QrSegment.makeSegments(r);return t.encodeSegments(s,n)}static encodeBinary(r,n){let s=e.QrSegment.makeBytes(r);return t.encodeSegments([s],n)}static encodeSegments(e,n,a=1,l=40,o=-1,c=!0){let d,h;if(!(t.MIN_VERSION<=a&&a<=l&&l<=t.MAX_VERSION)||o<-1||o>7)throw RangeError("Invalid value");for(d=a;;d++){let r=8*t.getNumDataCodewords(d,n),s=i.getTotalBits(e,d);if(s<=r){h=s;break}if(d>=l)throw RangeError("Data too long")}for(let e of[t.Ecc.MEDIUM,t.Ecc.QUARTILE,t.Ecc.HIGH])c&&h<=8*t.getNumDataCodewords(d,e)&&(n=e);let u=[];for(let t of e)for(let e of(r(t.mode.modeBits,4,u),r(t.numChars,t.mode.numCharCountBits(d),u),t.getData()))u.push(e);s(u.length==h);let m=8*t.getNumDataCodewords(d,n);s(u.length<=m),r(0,Math.min(4,m-u.length),u),r(0,(8-u.length%8)%8,u),s(u.length%8==0);for(let e=236;u.length<m;e^=253)r(e,8,u);let g=[];for(;8*g.length<u.length;)g.push(0);return u.forEach((e,t)=>g[t>>>3]|=e<<7-(7&t)),new t(d,n,g,o)}getModule(e,t){return 0<=e&&e<this.size&&0<=t&&t<this.size&&this.modules[t][e]}getModules(){return this.modules}drawFunctionPatterns(){for(let e=0;e<this.size;e++)this.setFunctionModule(6,e,e%2==0),this.setFunctionModule(e,6,e%2==0);this.drawFinderPattern(3,3),this.drawFinderPattern(this.size-4,3),this.drawFinderPattern(3,this.size-4);let e=this.getAlignmentPatternPositions(),t=e.length;for(let r=0;r<t;r++)for(let n=0;n<t;n++)(0!=r||0!=n)&&(0!=r||n!=t-1)&&(r!=t-1||0!=n)&&this.drawAlignmentPattern(e[r],e[n]);this.drawFormatBits(0),this.drawVersion()}drawFormatBits(e){let t=this.errorCorrectionLevel.formatBits<<3|e,r=t;for(let e=0;e<10;e++)r=r<<1^(r>>>9)*1335;let a=(t<<10|r)^21522;s(a>>>15==0);for(let e=0;e<=5;e++)this.setFunctionModule(8,e,n(a,e));this.setFunctionModule(8,7,n(a,6)),this.setFunctionModule(8,8,n(a,7)),this.setFunctionModule(7,8,n(a,8));for(let e=9;e<15;e++)this.setFunctionModule(14-e,8,n(a,e));for(let e=0;e<8;e++)this.setFunctionModule(this.size-1-e,8,n(a,e));for(let e=8;e<15;e++)this.setFunctionModule(8,this.size-15+e,n(a,e));this.setFunctionModule(8,this.size-8,!0)}drawVersion(){if(this.version<7)return;let e=this.version;for(let t=0;t<12;t++)e=e<<1^(e>>>11)*7973;let t=this.version<<12|e;s(t>>>18==0);for(let e=0;e<18;e++){let r=n(t,e),s=this.size-11+e%3,a=Math.floor(e/3);this.setFunctionModule(s,a,r),this.setFunctionModule(a,s,r)}}drawFinderPattern(e,t){for(let r=-4;r<=4;r++)for(let n=-4;n<=4;n++){let s=Math.max(Math.abs(n),Math.abs(r)),a=e+n,i=t+r;0<=a&&a<this.size&&0<=i&&i<this.size&&this.setFunctionModule(a,i,2!=s&&4!=s)}}drawAlignmentPattern(e,t){for(let r=-2;r<=2;r++)for(let n=-2;n<=2;n++)this.setFunctionModule(e+n,t+r,1!=Math.max(Math.abs(n),Math.abs(r)))}setFunctionModule(e,t,r){this.modules[t][e]=r,this.isFunction[t][e]=!0}addEccAndInterleave(e){let r=this.version,n=this.errorCorrectionLevel;if(e.length!=t.getNumDataCodewords(r,n))throw RangeError("Invalid argument");let a=t.NUM_ERROR_CORRECTION_BLOCKS[n.ordinal][r],i=t.ECC_CODEWORDS_PER_BLOCK[n.ordinal][r],l=Math.floor(t.getNumRawDataModules(r)/8),o=a-l%a,c=Math.floor(l/a),d=[],h=t.reedSolomonComputeDivisor(i);for(let r=0,n=0;r<a;r++){let s=e.slice(n,n+c-i+(r<o?0:1));n+=s.length;let a=t.reedSolomonComputeRemainder(s,h);r<o&&s.push(0),d.push(s.concat(a))}let u=[];for(let e=0;e<d[0].length;e++)d.forEach((t,r)=>{(e!=c-i||r>=o)&&u.push(t[e])});return s(u.length==l),u}drawCodewords(e){if(e.length!=Math.floor(t.getNumRawDataModules(this.version)/8))throw RangeError("Invalid argument");let r=0;for(let t=this.size-1;t>=1;t-=2){6==t&&(t=5);for(let s=0;s<this.size;s++)for(let a=0;a<2;a++){let i=t-a,l=(t+1&2)==0?this.size-1-s:s;!this.isFunction[l][i]&&r<8*e.length&&(this.modules[l][i]=n(e[r>>>3],7-(7&r)),r++)}}s(r==8*e.length)}applyMask(e){if(e<0||e>7)throw RangeError("Mask value out of range");for(let t=0;t<this.size;t++)for(let r=0;r<this.size;r++){let n;switch(e){case 0:n=(r+t)%2==0;break;case 1:n=t%2==0;break;case 2:n=r%3==0;break;case 3:n=(r+t)%3==0;break;case 4:n=(Math.floor(r/3)+Math.floor(t/2))%2==0;break;case 5:n=r*t%2+r*t%3==0;break;case 6:n=(r*t%2+r*t%3)%2==0;break;case 7:n=((r+t)%2+r*t%3)%2==0;break;default:throw Error("Unreachable")}!this.isFunction[t][r]&&n&&(this.modules[t][r]=!this.modules[t][r])}}getPenaltyScore(){let e=0;for(let r=0;r<this.size;r++){let n=!1,s=0,a=[0,0,0,0,0,0,0];for(let i=0;i<this.size;i++)this.modules[r][i]==n?5==++s?e+=t.PENALTY_N1:s>5&&e++:(this.finderPenaltyAddHistory(s,a),n||(e+=this.finderPenaltyCountPatterns(a)*t.PENALTY_N3),n=this.modules[r][i],s=1);e+=this.finderPenaltyTerminateAndCount(n,s,a)*t.PENALTY_N3}for(let r=0;r<this.size;r++){let n=!1,s=0,a=[0,0,0,0,0,0,0];for(let i=0;i<this.size;i++)this.modules[i][r]==n?5==++s?e+=t.PENALTY_N1:s>5&&e++:(this.finderPenaltyAddHistory(s,a),n||(e+=this.finderPenaltyCountPatterns(a)*t.PENALTY_N3),n=this.modules[i][r],s=1);e+=this.finderPenaltyTerminateAndCount(n,s,a)*t.PENALTY_N3}for(let r=0;r<this.size-1;r++)for(let n=0;n<this.size-1;n++){let s=this.modules[r][n];s==this.modules[r][n+1]&&s==this.modules[r+1][n]&&s==this.modules[r+1][n+1]&&(e+=t.PENALTY_N2)}let r=0;for(let e of this.modules)r=e.reduce((e,t)=>e+ +!!t,r);let n=this.size*this.size,a=Math.ceil(Math.abs(20*r-10*n)/n)-1;return s(0<=a&&a<=9),s(0<=(e+=a*t.PENALTY_N4)&&e<=2568888),e}getAlignmentPatternPositions(){if(1==this.version)return[];{let e=Math.floor(this.version/7)+2,t=32==this.version?26:2*Math.ceil((4*this.version+4)/(2*e-2)),r=[6];for(let n=this.size-7;r.length<e;n-=t)r.splice(1,0,n);return r}}static getNumRawDataModules(e){if(e<t.MIN_VERSION||e>t.MAX_VERSION)throw RangeError("Version number out of range");let r=(16*e+128)*e+64;if(e>=2){let t=Math.floor(e/7)+2;r-=(25*t-10)*t-55,e>=7&&(r-=36)}return s(208<=r&&r<=29648),r}static getNumDataCodewords(e,r){return Math.floor(t.getNumRawDataModules(e)/8)-t.ECC_CODEWORDS_PER_BLOCK[r.ordinal][e]*t.NUM_ERROR_CORRECTION_BLOCKS[r.ordinal][e]}static reedSolomonComputeDivisor(e){if(e<1||e>255)throw RangeError("Degree out of range");let r=[];for(let t=0;t<e-1;t++)r.push(0);r.push(1);let n=1;for(let s=0;s<e;s++){for(let e=0;e<r.length;e++)r[e]=t.reedSolomonMultiply(r[e],n),e+1<r.length&&(r[e]^=r[e+1]);n=t.reedSolomonMultiply(n,2)}return r}static reedSolomonComputeRemainder(e,r){let n=r.map(e=>0);for(let s of e){let e=s^n.shift();n.push(0),r.forEach((r,s)=>n[s]^=t.reedSolomonMultiply(r,e))}return n}static reedSolomonMultiply(e,t){if(e>>>8!=0||t>>>8!=0)throw RangeError("Byte out of range");let r=0;for(let n=7;n>=0;n--)r=r<<1^(r>>>7)*285^(t>>>n&1)*e;return s(r>>>8==0),r}finderPenaltyCountPatterns(e){let t=e[1];s(t<=3*this.size);let r=t>0&&e[2]==t&&e[3]==3*t&&e[4]==t&&e[5]==t;return(r&&e[0]>=4*t&&e[6]>=t?1:0)+(r&&e[6]>=4*t&&e[0]>=t?1:0)}finderPenaltyTerminateAndCount(e,t,r){return e&&(this.finderPenaltyAddHistory(t,r),t=0),t+=this.size,this.finderPenaltyAddHistory(t,r),this.finderPenaltyCountPatterns(r)}finderPenaltyAddHistory(e,t){0==t[0]&&(e+=this.size),t.pop(),t.unshift(e)}};function r(e,t,r){if(t<0||t>31||e>>>t!=0)throw RangeError("Value out of range");for(let n=t-1;n>=0;n--)r.push(e>>>n&1)}function n(e,t){return(e>>>t&1)!=0}function s(e){if(!e)throw Error("Assertion error")}t.MIN_VERSION=1,t.MAX_VERSION=40,t.PENALTY_N1=3,t.PENALTY_N2=3,t.PENALTY_N3=40,t.PENALTY_N4=10,t.ECC_CODEWORDS_PER_BLOCK=[[-1,7,10,15,20,26,18,20,24,30,18,20,24,26,30,22,24,28,30,28,28,28,28,30,30,26,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],[-1,10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28],[-1,13,22,18,26,18,24,18,22,20,24,28,26,24,20,30,24,28,28,26,30,28,30,30,30,30,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],[-1,17,28,22,16,22,28,26,26,24,28,24,28,22,24,24,30,28,28,26,28,30,24,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30]],t.NUM_ERROR_CORRECTION_BLOCKS=[[-1,1,1,1,1,1,2,2,2,2,4,4,4,4,4,6,6,6,6,7,8,8,9,9,10,12,12,12,13,14,15,16,17,18,19,19,20,21,22,24,25],[-1,1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16,17,17,18,20,21,23,25,26,28,29,31,33,35,37,38,40,43,45,47,49],[-1,1,1,2,2,4,4,6,6,8,8,8,10,12,16,12,17,16,18,21,20,23,23,25,27,29,34,34,35,38,40,43,45,48,51,53,56,59,62,65,68],[-1,1,1,2,4,4,4,5,6,8,8,11,11,16,16,18,16,19,21,25,25,25,34,30,32,35,37,40,42,45,48,51,54,57,60,63,66,70,74,77,81]],e.QrCode=t;let a=class e{constructor(e,t,r){if(this.mode=e,this.numChars=t,this.bitData=r,t<0)throw RangeError("Invalid argument");this.bitData=r.slice()}static makeBytes(t){let n=[];for(let e of t)r(e,8,n);return new e(e.Mode.BYTE,t.length,n)}static makeNumeric(t){if(!e.isNumeric(t))throw RangeError("String contains non-numeric characters");let n=[];for(let e=0;e<t.length;){let s=Math.min(t.length-e,3);r(parseInt(t.substring(e,e+s),10),3*s+1,n),e+=s}return new e(e.Mode.NUMERIC,t.length,n)}static makeAlphanumeric(t){let n;if(!e.isAlphanumeric(t))throw RangeError("String contains unencodable characters in alphanumeric mode");let s=[];for(n=0;n+2<=t.length;n+=2){let a=45*e.ALPHANUMERIC_CHARSET.indexOf(t.charAt(n));r(a+=e.ALPHANUMERIC_CHARSET.indexOf(t.charAt(n+1)),11,s)}return n<t.length&&r(e.ALPHANUMERIC_CHARSET.indexOf(t.charAt(n)),6,s),new e(e.Mode.ALPHANUMERIC,t.length,s)}static makeSegments(t){return""==t?[]:e.isNumeric(t)?[e.makeNumeric(t)]:e.isAlphanumeric(t)?[e.makeAlphanumeric(t)]:[e.makeBytes(e.toUtf8ByteArray(t))]}static makeEci(t){let n=[];if(t<0)throw RangeError("ECI assignment value out of range");if(t<128)r(t,8,n);else if(t<16384)r(2,2,n),r(t,14,n);else if(t<1e6)r(6,3,n),r(t,21,n);else throw RangeError("ECI assignment value out of range");return new e(e.Mode.ECI,0,n)}static isNumeric(t){return e.NUMERIC_REGEX.test(t)}static isAlphanumeric(t){return e.ALPHANUMERIC_REGEX.test(t)}getData(){return this.bitData.slice()}static getTotalBits(e,t){let r=0;for(let n of e){let e=n.mode.numCharCountBits(t);if(n.numChars>=1<<e)return 1/0;r+=4+e+n.bitData.length}return r}static toUtf8ByteArray(e){e=encodeURI(e);let t=[];for(let r=0;r<e.length;r++)"%"!=e.charAt(r)?t.push(e.charCodeAt(r)):(t.push(parseInt(e.substring(r+1,r+3),16)),r+=2);return t}};a.NUMERIC_REGEX=/^[0-9]*$/,a.ALPHANUMERIC_REGEX=/^[A-Z0-9 $%*+.\/:-]*$/,a.ALPHANUMERIC_CHARSET="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";let i=a;e.QrSegment=a})(l||(l={})),s=(n=l||(l={})).QrCode||(n.QrCode={}),(t=class{constructor(e,t){this.ordinal=e,this.formatBits=t}}).LOW=new t(0,1),t.MEDIUM=new t(1,0),t.QUARTILE=new t(2,3),t.HIGH=new t(3,2),s.Ecc=t,i=(a=l||(l={})).QrSegment||(a.QrSegment={}),(r=class{constructor(e,t){this.modeBits=e,this.numBitsCharCount=t}numCharCountBits(e){return this.numBitsCharCount[Math.floor((e+7)/17)]}}).NUMERIC=new r(1,[10,12,14]),r.ALPHANUMERIC=new r(2,[9,11,13]),r.BYTE=new r(4,[8,16,16]),r.KANJI=new r(8,[8,10,12]),r.ECI=new r(7,[0,0,0]),i.Mode=r;var _=l,R={L:_.QrCode.Ecc.LOW,M:_.QrCode.Ecc.MEDIUM,Q:_.QrCode.Ecc.QUARTILE,H:_.QrCode.Ecc.HIGH},k="#FFFFFF",A="#000000";function P(e,t=0){let r=[];return e.forEach(function(e,n){let s=null;e.forEach(function(a,i){if(!a&&null!==s){r.push(`M${s+t} ${n+t}h${i-s}v1H${s+t}z`),s=null;return}if(i===e.length-1){if(!a)return;null===s?r.push(`M${i+t},${n+t} h1v1H${i+t}z`):r.push(`M${s+t},${n+t} h${i+1-s}v1H${s+t}z`);return}a&&null===s&&(s=i)})}),r.join("")}function S(e,t){return e.slice().map((e,r)=>r<t.y||r>=t.y+t.h?e:e.map((e,r)=>(r<t.x||r>=t.x+t.w)&&e))}function I({value:e,level:t,minVersion:r,includeMargin:n,marginSize:s,imageSettings:a,size:i,boostLevel:l}){let o=c.default.useMemo(()=>{let n=(Array.isArray(e)?e:[e]).reduce((e,t)=>(e.push(..._.QrSegment.makeSegments(t)),e),[]);return _.QrCode.encodeSegments(n,R[t],r,void 0,void 0,l)},[e,t,r,l]),{cells:d,margin:h,numCells:u,calculatedImageSettings:m}=c.default.useMemo(()=>{let e=o.getModules(),t=null!=s?Math.max(Math.floor(s),0):4*!!n,r=e.length+2*t,l=function(e,t,r,n){if(null==n)return null;let s=e.length+2*r,a=Math.floor(.1*t),i=s/t,l=(n.width||a)*i,o=(n.height||a)*i,c=null==n.x?e.length/2-l/2:n.x*i,d=null==n.y?e.length/2-o/2:n.y*i,h=null==n.opacity?1:n.opacity,u=null;if(n.excavate){let e=Math.floor(c),t=Math.floor(d),r=Math.ceil(l+c-e),n=Math.ceil(o+d-t);u={x:e,y:t,w:r,h:n}}return{x:c,y:d,h:o,w:l,excavation:u,opacity:h,crossOrigin:n.crossOrigin}}(e,i,t,a);return{cells:e,margin:t,numCells:r,calculatedImageSettings:l}},[o,i,a,n,s]);return{qrcode:o,margin:h,cells:d,numCells:u,calculatedImageSettings:m}}var O=function(){try{new Path2D().addPath(new Path2D)}catch(e){return!1}return!0}(),D=c.default.forwardRef(function(e,t){let{value:r,size:n=128,level:s="L",bgColor:a=k,fgColor:i=A,includeMargin:l=!1,minVersion:o=1,boostLevel:d,marginSize:h,imageSettings:u}=e,m=M(e,["value","size","level","bgColor","fgColor","includeMargin","minVersion","boostLevel","marginSize","imageSettings"]),{style:g}=m,f=M(m,["style"]),x=null==u?void 0:u.src,p=c.default.useRef(null),y=c.default.useRef(null),N=c.default.useCallback(e=>{p.current=e,"function"==typeof t?t(e):t&&(t.current=e)},[t]),[b,v]=c.default.useState(!1),{margin:j,cells:w,numCells:C,calculatedImageSettings:_}=I({value:r,level:s,minVersion:o,boostLevel:d,includeMargin:l,marginSize:h,imageSettings:u,size:n});c.default.useEffect(()=>{if(null!=p.current){let e=p.current,t=e.getContext("2d");if(!t)return;let r=w,s=y.current,l=null!=_&&null!==s&&s.complete&&0!==s.naturalHeight&&0!==s.naturalWidth;l&&null!=_.excavation&&(r=S(w,_.excavation));let o=window.devicePixelRatio||1;e.height=e.width=n*o;let c=n/C*o;t.scale(c,c),t.fillStyle=a,t.fillRect(0,0,C,C),t.fillStyle=i,O?t.fill(new Path2D(P(r,j))):w.forEach(function(e,r){e.forEach(function(e,n){e&&t.fillRect(n+j,r+j,1,1)})}),_&&(t.globalAlpha=_.opacity),l&&t.drawImage(s,_.x+j,_.y+j,_.w,_.h)}}),c.default.useEffect(()=>{v(!1)},[x]);let R=E({height:n,width:n},g),D=null;return null!=x&&(D=c.default.createElement("img",{src:x,key:x,style:{display:"none"},onLoad:()=>{v(!0)},ref:y,crossOrigin:null==_?void 0:_.crossOrigin})),c.default.createElement(c.default.Fragment,null,c.default.createElement("canvas",E({style:R,height:n,width:n,ref:N,role:"img"},f)),D)});D.displayName="QRCodeCanvas",c.default.forwardRef(function(e,t){let{value:r,size:n=128,level:s="L",bgColor:a=k,fgColor:i=A,includeMargin:l=!1,minVersion:o=1,boostLevel:d,title:h,marginSize:u,imageSettings:m}=e,g=M(e,["value","size","level","bgColor","fgColor","includeMargin","minVersion","boostLevel","title","marginSize","imageSettings"]),{margin:f,cells:x,numCells:p,calculatedImageSettings:y}=I({value:r,level:s,minVersion:o,boostLevel:d,includeMargin:l,marginSize:u,imageSettings:m,size:n}),N=x,b=null;null!=m&&null!=y&&(null!=y.excavation&&(N=S(x,y.excavation)),b=c.default.createElement("image",{href:m.src,height:y.h,width:y.w,x:y.x+f,y:y.y+f,preserveAspectRatio:"none",opacity:y.opacity,crossOrigin:y.crossOrigin}));let v=P(N,f);return c.default.createElement("svg",E({height:n,width:n,viewBox:`0 0 ${p} ${p}`,ref:t,role:"img"},g),!!h&&c.default.createElement("title",null,h),c.default.createElement("path",{fill:a,d:`M0,0 h${p}v${p}H0z`,shapeRendering:"crispEdges"}),c.default.createElement("path",{fill:i,d:v,shapeRendering:"crispEdges"}),b)}).displayName="QRCodeSVG";let L=e.r(66540),z=({title:e,children:t,add:r})=>{let[n,s]=(0,c.useState)(!1);return(0,o.jsxs)("div",{className:"border border-gray-200 rounded-md overflow-hidden bg-white transition",children:[(0,o.jsxs)("button",{onClick:()=>s(!n),className:"cursor-pointer w-full flex justify-between items-center px-5 py-4 text-sm font-semibold transition-colors bg-white text-gray-600 hover:bg-green-50",children:[(0,o.jsx)("span",{children:e}),(0,o.jsxs)("div",{className:"flex gap-4",children:[r&&(0,o.jsx)(d.motion.span,{whileHover:{scale:1.2},whileTap:{scale:.9},className:"text-green-600 hover:text-green-400 cursor-pointer",onClick:e=>{e.preventDefault(),e.stopPropagation(),r?.()},children:(0,o.jsx)(u.Icon,{icon:"solar:add-square-bold",width:24})}),(0,o.jsx)(d.motion.span,{animate:{rotate:180*!!n},transition:{duration:.25,ease:"easeInOut"},className:"text-gray-400",children:"▼"})]})]}),(0,o.jsx)(h.AnimatePresence,{initial:!1,children:n&&(0,o.jsx)(d.motion.div,{initial:{height:0,opacity:0},animate:{height:"auto",opacity:1},exit:{height:0,opacity:0},transition:{duration:.25,ease:"easeInOut"},className:"p-4 bg-gray-100 border-t border-gray-300 text-sm text-gray-700",children:t})})]})},F=({event:e,refresh:t})=>{let r=(0,f.useRouter)(),[n,s]=(0,c.useState)(null),a=async r=>{if(r.photo){let{status:e,data:t}=await y.utilsRepo.uploadFile(r.photo);e&&(r.photo=String(t?.data?.link))}let{status:n}=await x.eventRepo.updateEvent(e.id,r);n&&t()},i=async()=>{if(!confirm("Yakin ingin menghapus event ini?"))return;let{status:t}=await x.eventRepo.deleteEvent(e.id);t&&r.back()};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(p.ModalEditEvent,{isOpen:0==n,event:e,onClose:()=>s(null),onSubmit:a}),(0,o.jsx)(p.ModalEventCategories,{isOpen:1==n,onClose:()=>s(null),onSubmit:a,existingCategories:e.categories.map(e=>e.category_id)}),(0,o.jsxs)("div",{className:"flex gap-6 flex-col md:flex-row bg-white p-4 rounded-md border border-gray-200 w-full",children:[(0,o.jsx)(N.default,{src:e.photo||"/no-image.jpg",alt:e.name,width:500,height:100,className:"w-full md:w-xl h-90 rounded-md object-cover"}),(0,o.jsxs)("div",{className:"flex flex-col gap-1 flex-1",children:[(0,o.jsxs)("div",{className:"flex flex-col",children:[(0,o.jsx)("span",{className:"text-gray-400 text-sm",children:"Nama"}),(0,o.jsx)("span",{className:"text-gray-800 text-sm",children:e.name||"-"})]}),(0,o.jsxs)("div",{className:"flex flex-col",children:[(0,o.jsx)("span",{className:"text-gray-400 text-sm",children:"Penyelenggara"}),(0,o.jsx)("span",{className:"text-gray-800 text-sm",children:e.organizer||"-"})]}),(0,o.jsxs)("div",{className:"flex flex-col",children:[(0,o.jsx)("span",{className:"text-gray-400 text-sm",children:"Lokasi"}),(0,o.jsx)("span",{className:"text-gray-800 text-sm",children:e.location||"-"})]}),(0,o.jsxs)("div",{className:"flex flex-col",children:[(0,o.jsx)("span",{className:"text-gray-400 text-sm",children:"Periode Pendaftaran"}),(0,o.jsxs)("span",{className:"text-gray-800 text-sm",children:[L(e.reg_start_date).format("DD MMM YYYY")," - ",L(e.reg_end_date).format("DD MMM YYYY")]})]}),(0,o.jsxs)("div",{className:"flex flex-col",children:[(0,o.jsx)("span",{className:"text-gray-400 text-sm",children:"Periode Acara"}),(0,o.jsxs)("span",{className:"text-gray-800 text-sm",children:[L(e.start_date).format("DD MMM YYYY")," - ",L(e.end_date).format("DD MMM YYYY")]})]}),(0,o.jsxs)("div",{className:"flex flex-col",children:[(0,o.jsx)("span",{className:"text-gray-400 text-sm",children:"Series"}),(0,o.jsx)("span",{className:"text-gray-800 text-sm",children:e.is_series?"Ya":"Tidak"})]}),(0,o.jsxs)("div",{className:"flex flex-col",children:[(0,o.jsx)("span",{className:"text-gray-400 text-sm",children:"Terakhir diubah"}),(0,o.jsx)("span",{className:"text-gray-800 text-sm",children:L(e.updated_at).format("DD/MM/YYYY HH:mm:ss")})]})]}),(0,o.jsxs)("div",{className:"flex justify-end items-start gap-3",children:[(0,o.jsx)("button",{onClick:()=>s(0),className:"cursor-pointer text-gray-600 hover:text-primary-600",children:(0,o.jsx)(u.Icon,{icon:"solar:pen-2-outline",width:24})}),(0,o.jsx)("button",{onClick:i,className:"cursor-pointer text-gray-600 hover:text-red-400",children:(0,o.jsx)(u.Icon,{icon:"solar:trash-bin-trash-bold",width:24})})]})]}),(0,o.jsx)(z,{title:"Link",children:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("label",{className:"text-xs text-gray-500",children:"Publik"}),(0,o.jsx)(D,{value:`https://zidansport.org/events/detail?code=${e?.code}`,size:80,bgColor:"transparent",className:"my-2 border border-white/20"}),(0,o.jsx)("p",{className:"text-xs text-blue-300",children:(0,o.jsx)("a",{target:"_blank",rel:"noopener noreferrer",href:`https://zidansport.org/events/detail?code=${e?.code}`,children:`https://zidansport.org/events/detail?code=${e?.code}`})})]})}),(0,o.jsx)(z,{add:()=>s(1),title:`Kategori ${e?.categories?.length>0?`(${e?.categories?.length})`:""}`,children:e?.categories?.length?(0,o.jsx)("ul",{className:"flex flex-col divide-y divide-gray-200 gap-2",children:e?.categories.map((e,r)=>{let n,isTeam=Boolean(e.category?.is_team||/beregu/i.test(e.category?.name||""));return(0,o.jsxs)("li",{className:"flex justify-between pb-2 last:pb-0",children:[(0,o.jsxs)("span",{className:"flex items-center gap-2 flex-wrap",children:[r+1,". ",e.category?.name,isTeam&&(0,o.jsxs)("span",{className:"px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full font-medium",children:["Beregu (",e.category?.team_members||3," Atlet)"]})]}),(0,o.jsxs)("div",{className:"flex items-center gap-2",children:[e?.count_participants==0&&(0,o.jsx)(u.Icon,{icon:"bx:x",width:24,onClick:(n=e.id,async()=>{if(confirm("Yakin ingin menghapus kategori ini?")){let{status:e}=await x.eventRepo.deleteEventCategory(n);e&&t()}}),className:"text-gray-600 hover:text-red-400 cursor-pointer"}),(0,o.jsxs)("span",{className:"text-gray-600",children:[e?.count_participants||0," peserta"]})]})]},r)})}):(0,o.jsx)("p",{className:"text-gray-600",children:"Tidak ada kategori"})}),(0,o.jsx)(z,{title:`Kontingen ${e?.contingents?.length>0?`(${e?.contingents?.length})`:""}`,children:e?.contingents?.length?(0,o.jsx)("ul",{className:"divide-y divide-gray-200 gap-2",children:e?.contingents.map((e,t)=>(0,o.jsxs)("li",{className:"flex justify-between pb-2 last:pb-0",children:[(0,o.jsxs)("span",{children:[t+1,". ",e?.contingent?.name]}),(0,o.jsxs)("span",{className:"text-gray-600",children:[e?.count_participants," peserta"]})]},t))}):(0,o.jsx)("p",{className:"text-gray-600",children:"Tidak ada kontingen"})})]})};var T=e.i(23720),cRepo=e.i(4617),aRepo=e.i(28719);let Y=({athletes:e,event_id:t,categories:cats=[],refresh:r})=>{let fmtDob = d => {
    if (!d) return "-";
    try {
        let dt = new Date(d);
        if (isNaN(dt.getTime())) return String(d).slice(0, 10);
        let day = String(dt.getDate()).padStart(2, "0");
        let mon = String(dt.getMonth() + 1).padStart(2, "0");
        return `${day}/${mon}/${dt.getFullYear()}`;
    } catch (e) {
        return "-";
    }
};;let n=(0,f.useRouter)(),s=(0,f.useSearchParams)().get("id"),[a,i]=(0,c.useState)(""),[l,d]=(0,c.useState)("name"),[h,m]=(0,c.useState)("asc"),[g,p]=(0,c.useState)(1),[conts,setConts]=(0,c.useState)([]),[allAthletes,setAllAthletes]=(0,c.useState)([]),[modalOpen,setModalOpen]=(0,c.useState)(!1),[isNewAth,setIsNewAth]=(0,c.useState)(!1),[form,setForm]=(0,c.useState)({id:null,category_id:"",contingent_id:"",athlete_id:"",athlete_ids:[],team_name:"",name:"",gender:1,date_of_birth:"",body_weight:""}),selCat=(0,c.useMemo)(()=>cats.find(c=>String(c.id)===String(form.category_id)),[cats,form.category_id]),isTeamCat=Boolean(selCat?.category?.is_team||/beregu/i.test(selCat?.category?.name||"")),stdTeamMembers=selCat?.category?.team_members||3,loadLookups=async()=>{let[resC,resA]=await Promise.all([cRepo.getAllContingents(),aRepo.findAthletes({page:1,limit:1e3,sort_by:"name",order:"asc"})]);resC.status&&setConts(resC.data?.data||[]),resA.status&&setAllAthletes(resA.data?.data||[])},openAdd=()=>{loadLookups(),setIsNewAth(!1),setForm({id:null,category_id:cats[0]?.id||"",contingent_id:"",athlete_id:"",athlete_ids:[],team_name:"",name:"",gender:1,date_of_birth:"",body_weight:""}),setModalOpen(!0)},openEdit=(ev,item)=>{ev.preventDefault(),ev.stopPropagation(),loadLookups(),setIsNewAth(!1),setForm({id:item.id,category_id:item.category_id||item.category?.id||"",contingent_id:item.event_contingent?.contingent_id||item.event_contingent?.contingent?.id||item.athlete?.contingent_id||"",athlete_id:item.athlete_id||item.athlete?.id||"",athlete_ids:[],team_name:item.team_name||"",name:item.athlete?.name||"",gender:item.athlete?.gender??1,date_of_birth:item.athlete?.date_of_birth?String(item.athlete.date_of_birth).slice(0,10):"",body_weight:item.athlete?.body_weight??""}),setModalOpen(!0)},addNewAthToTeam=async()=>{if(!form.name||!form.contingent_id)return alert("Pilih Kontingen dan isi Nama Atlet Baru terlebih dahulu!");let{status:okA,data:resA}=await aRepo.createAthlete({name:form.name,gender:Number(form.gender),date_of_birth:form.date_of_birth||void 0,body_weight:form.body_weight!==""?Number(form.body_weight):0,contingent_id:Number(form.contingent_id),is_verified:!0});if(okA&&resA?.data?.id){let newAth=resA.data;setAllAthletes(prev=>[...prev,newAth]),setForm(prev=>({...prev,athlete_ids:prev.athlete_ids.includes(newAth.id)?prev.athlete_ids:[...prev.athlete_ids,newAth.id],name:"",date_of_birth:"",body_weight:""})),setIsNewAth(!1)}},saveParticipant=async ev=>{ev.preventDefault();if(!form.category_id)return alert("Pilih kategori pertandingan terlebih dahulu!");if(form.id){if(isTeamCat&&!form.team_name?.trim())return alert("Nama Tim / Regu wajib diisi untuk kategori beregu!");let{status:ok}=await x.eventRepo.updateParticipant(t,form.id,{category_id:Number(form.category_id),contingent_id:form.contingent_id?Number(form.contingent_id):void 0,athlete_id:form.athlete_id?Number(form.athlete_id):void 0,team_name:isTeamCat?form.team_name.trim():null,name:form.name||void 0,gender:Number(form.gender),date_of_birth:form.date_of_birth||void 0,body_weight:form.body_weight!==""?Number(form.body_weight):void 0});ok&&(setModalOpen(!1),r())}else if(isTeamCat){let targetContId=form.contingent_id?Number(form.contingent_id):null;if(!targetContId)return alert("Pilih kontingen terlebih dahulu!");if(!form.team_name||!form.team_name.trim())return alert("Nama Tim / Regu wajib diisi!");let teamIds=[...form.athlete_ids];if(isNewAth&&form.name){let{status:okA,data:resA}=await aRepo.createAthlete({name:form.name,gender:Number(form.gender),date_of_birth:form.date_of_birth||void 0,body_weight:form.body_weight!==""?Number(form.body_weight):0,contingent_id:targetContId,is_verified:!0});if(!okA||!resA?.data?.id)return;teamIds.push(resA.data.id)}if(teamIds.length<3)return alert("Kategori beregu wajib memilih minimal 3 atlet dalam 1 tim/regu!");let{status:ok}=await x.eventRepo.register(t,{contingent_id:targetContId,team_name:form.team_name.trim(),athletes:teamIds.map(aid=>({athlete_id:Number(aid),category_id:Number(form.category_id),contingent_id:targetContId,team_name:form.team_name.trim()}))});ok&&(setModalOpen(!1),r())}else{let targetAthId=form.athlete_id?Number(form.athlete_id):null,targetContId=form.contingent_id?Number(form.contingent_id):null;if(isNewAth){if(!form.name||!targetContId)return alert("Nama atlet baru dan Kontingen wajib diisi!");let{status:okA,data:resA}=await aRepo.createAthlete({name:form.name,gender:Number(form.gender),date_of_birth:form.date_of_birth||void 0,body_weight:form.body_weight!==""?Number(form.body_weight):0,contingent_id:targetContId,is_verified:!0});if(!okA||!resA?.data?.id)return;targetAthId=resA.data.id}else if(!targetAthId)return alert("Pilih atlet terlebih dahulu!");let{status:ok}=await x.eventRepo.register(t,{contingent_id:targetContId||void 0,athletes:[{athlete_id:targetAthId,category_id:Number(form.category_id),contingent_id:targetContId||void 0}]});ok&&(setModalOpen(!1),r())}},y=(0,c.useMemo)(()=>e.filter(e=>{let t=a.toLowerCase(),r=e?.athlete?.name?.toLowerCase()||"",n=e?.athlete?.code?.toLowerCase()||"",tm=e?.team_name?.toLowerCase()||"";return""===t||r.includes(t)||n.includes(t)||tm.includes(t)}).sort((e,t)=>{let r=e?.athlete?e.athlete[l]:null,n=t?.athlete?t.athlete[l]:null;if(null==r||null==n);else if(r<n)return"asc"===h?-1:1;else if(r>n)return"asc"===h?1:-1;return 0}),[e,a,l,h]),N=Math.ceil(y.length/15)||1,b=Math.min(g,N),v=y.slice((b-1)*15,15*b),j=e=>{l===e?m("asc"===h?"desc":"asc"):(d(e),m("asc"))},w=async()=>{s&&await x.eventRepo.exportEvent(parseInt(s))},C=({field:e})=>{let t=l===e;return(0,o.jsx)(u.Icon,{icon:t?"asc"===h?"solar:arrow-up-outline":"solar:arrow-down-outline":"solar:sort-vertical-linear",width:16,className:`ml-1 transition-all ${t?"text-green-600":"text-gray-400"}`})},E=(0,c.useMemo)(()=>{let e=[];if(e.push(1),N<=4){for(let t=2;t<=N;t++)e.push(t);return e}let t=Math.max(2,g-1),r=Math.min(N-1,g+1);t>2&&e.push("...");for(let n=t;n<=r;n++)e.push(n);return r<N-1&&e.push("..."),e.push(N),e},[b,N]),filteredAthletes=(0,c.useMemo)(()=>{
    let list=form.contingent_id?allAthletes.filter(a=>String(a.contingent_id||a.contingent?.id||"")===String(form.contingent_id)):allAthletes;
    if(!selCat?.category)return list;
    let cat=selCat.category;
    let catGen=Number(cat.gender)||0;
    if(catGen!==1&&catGen!==2){
        let cName=cat.name||"";
        let hasPutra=/\bputra\b/i.test(cName),hasPutri=/\bputri\b/i.test(cName);
        if(hasPutri&&!hasPutra)catGen=2;
        else if(hasPutra&&!hasPutri)catGen=1;
    }
    let minY=(cat.min_year!==undefined&&cat.min_year!==null&&String(cat.min_year).trim()!=="")?parseInt(cat.min_year,10):null;
    let maxY=(cat.max_year!==undefined&&cat.max_year!==null&&String(cat.max_year).trim()!=="")?parseInt(cat.max_year,10):null;
    if(isNaN(minY)||minY<=0)minY=null;
    if(isNaN(maxY)||maxY<=0)maxY=null;
    if(minY&&maxY&&minY>maxY){let tmpY=minY;minY=maxY;maxY=tmpY;}
    let minW=parseFloat(cat.min_body_weight);
    let maxW=parseFloat(cat.max_body_weight);
    if(isNaN(minW)||minW<=0)minW=0;
    if(isNaN(maxW)||maxW<=0)maxW=0;
    if(minW>0&&maxW>0&&minW>maxW){let tmpW=minW;minW=maxW;maxW=tmpW;}
    return list.filter(ath=>{
        if(catGen===1||catGen===2){
            let athGen=Number(ath.gender);
            if(athGen!==catGen)return false;
        }
        if(minY||maxY){
            let bYear=null;
            if(ath.date_of_birth){
                let dt=new Date(ath.date_of_birth);
                if(!isNaN(dt.getTime()))bYear=dt.getFullYear();
                else{
                    let m=String(ath.date_of_birth).match(/(\d{4})/);
                    if(m)bYear=parseInt(m[1],10);
                }
            }
            if(!bYear)return false;
            if(minY&&bYear<minY)return false;
            if(maxY&&bYear>maxY)return false;
        }
        if(minW>0||maxW>0){
            let athW=(ath.body_weight!==undefined&&ath.body_weight!==null&&String(ath.body_weight).trim()!=="")?parseFloat(ath.body_weight):NaN;
            if(isNaN(athW)||athW<=0)return false;
            if(minW>0&&athW<minW)return false;
            if(maxW>0&&athW>maxW)return false;
        }
        return true;
    });
},[allAthletes,form.contingent_id,selCat]);return(0,o.jsxs)("div",{className:"min-h-screen bg-gray-50 pb-16",children:[modalOpen&&(0,o.jsx)("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",style:{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:99999,backgroundColor:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",padding:"16px",overflowY:"auto"},children:(0,o.jsxs)("div",{className:"bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto text-gray-800",style:{color:"#1f2937",backgroundColor:"#ffffff",borderRadius:"8px",boxShadow:"0 20px 25px -5px rgba(0,0,0,0.25)",width:"100%",maxWidth:"540px",maxHeight:"88vh",overflowY:"auto",padding:"24px",position:"relative",margin:"auto"},children:[(0,o.jsxs)("div",{className:"flex justify-between items-center mb-4 border-b pb-2",children:[(0,o.jsx)("h3",{className:"text-lg font-semibold text-gray-800",children:form.id?"Edit Peserta Event":isTeamCat?"Tambah Tim / Regu Event":"Tambah Peserta Event"}),(0,o.jsx)("button",{onClick:()=>setModalOpen(!1),className:"text-gray-400 hover:text-gray-600 cursor-pointer",children:"✕"})]}),(0,o.jsxs)("form",{onSubmit:saveParticipant,className:"space-y-3 text-sm",children:[(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-gray-600 mb-1",children:"Kategori Pertandingan *"}),(0,o.jsxs)("select",{required:!0,value:form.category_id,onChange:e=>setForm({...form,category_id:e.target.value,athlete_id:"",athlete_ids:[]}),className:"w-full border border-gray-300 rounded px-3 py-2",children:[(0,o.jsx)("option",{value:"",children:"-- Pilih Kategori --"}),cats.map(c=>(0,o.jsx)("option",{value:c.id,children:`${c.category?.name||`Kategori #${c.id}`}${c.category?.is_team||/beregu/i.test(c.category?.name||"")?` [Beregu - ${c.category?.team_members||3} Atlet]`:""}`},c.id))]})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-gray-600 mb-1",children:"Kontingen *"}),(0,o.jsxs)("select",{required:!0,value:form.contingent_id,onChange:e=>{let cid=e.target.value,cName=conts.find(c=>String(c.id)===String(cid))?.name||"";setForm({...form,contingent_id:cid,team_name:form.team_name||(isTeamCat&&cName?`${cName} - Tim 1`:"")})},className:"w-full border border-gray-300 rounded px-3 py-2",children:[(0,o.jsx)("option",{value:"",children:"-- Pilih Kontingen --"}),conts.map(c=>(0,o.jsx)("option",{value:c.id,children:c.name},c.id))]})]}),isTeamCat&&(0,o.jsxs)("div",{className:"p-3 bg-emerald-50 border border-emerald-200 rounded space-y-2",children:[(0,o.jsxs)("div",{className:"text-xs text-emerald-800 font-medium",children:["Kategori Beregu (Standar ",stdTeamMembers," Atlet, Minimal 3 Atlet per Tim)"]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-gray-700 font-medium mb-1",children:"Nama Tim / Regu *"}),(0,o.jsx)("input",{type:"text",required:!0,placeholder:"Contoh: Kontingen A - Tim 1",value:form.team_name,onChange:e=>setForm({...form,team_name:e.target.value}),className:"w-full bg-white border border-gray-300 rounded px-3 py-2"})]})]}),!form.id&&(0,o.jsxs)("div",{className:"flex gap-2 pt-1",children:[(0,o.jsx)("button",{type:"button",onClick:()=>setIsNewAth(!1),className:`flex-1 py-1.5 rounded text-xs font-medium border cursor-pointer ${!isNewAth?"bg-green-50 border-green-600 text-green-700":"border-gray-200 text-gray-600"}`,children:isTeamCat?"Pilih Atlet Terdaftar (Multi)":"Pilih Atlet Terdaftar"}),(0,o.jsx)("button",{type:"button",onClick:()=>setIsNewAth(!0),className:`flex-1 py-1.5 rounded text-xs font-medium border cursor-pointer ${isNewAth?"bg-green-50 border-green-600 text-green-700":"border-gray-200 text-gray-600"}`,children:isTeamCat?"+ Buat Atlet Baru ke Tim":"Buat Atlet Baru"})]}),!form.id&&!isNewAth&&!isTeamCat&&(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-gray-600 mb-1",children:"Pilih Atlet *"}),(0,o.jsxs)("select",{required:!0,value:form.athlete_id,onChange:e=>{let val=e.target.value,found=allAthletes.find(a=>String(a.id)===String(val));setForm({...form,athlete_id:val,contingent_id:form.contingent_id||(found?.contingent_id||found?.contingent?.id||"")})},className:"w-full border border-gray-300 rounded px-3 py-2",children:[(0,o.jsx)("option",{value:"",children:"-- Pilih Atlet --"}),filteredAthletes.map(a=>(0,o.jsx)("option",{value:a.id,children:`${a.name} (${a.code||"-"}) - ${a.body_weight||0} kg`},a.id))]})]}),!form.id&&!isNewAth&&isTeamCat&&(0,o.jsxs)("div",{className:"space-y-2",children:[(0,o.jsxs)("label",{className:"block text-gray-600 mb-1",children:["Pilih Anggota Tim (Minimal 3 Atlet, Terpilih: ",form.athlete_ids.length,") *"]}),(0,o.jsxs)("select",{value:"",onChange:e=>{let val=Number(e.target.value);if(!val)return;let found=allAthletes.find(a=>Number(a.id)===val),cid=form.contingent_id||(found?.contingent_id||found?.contingent?.id||""),cName=conts.find(c=>String(c.id)===String(cid))?.name||"";setForm(prev=>({...prev,contingent_id:cid,team_name:prev.team_name||(cName?`${cName} - Tim 1`:""),athlete_ids:prev.athlete_ids.includes(val)?prev.athlete_ids:[...prev.athlete_ids,val]}))},className:"w-full border border-gray-300 rounded px-3 py-2",children:[(0,o.jsx)("option",{value:"",children:"-- Klik untuk Menambahkan Atlet ke Tim --"}),filteredAthletes.filter(a=>!form.athlete_ids.includes(Number(a.id))).map(a=>(0,o.jsx)("option",{value:a.id,children:`${a.name} (${a.code||"-"}) - ${a.body_weight||0} kg`},a.id))]}),form.athlete_ids.length>0&&(0,o.jsx)("div",{className:"border border-gray-200 rounded bg-gray-50 p-2 space-y-1 max-h-44 overflow-y-auto",children:form.athlete_ids.map((aid,idx)=>{let ath=allAthletes.find(a=>Number(a.id)===Number(aid));return(0,o.jsxs)("div",{className:"flex justify-between items-center bg-white px-3 py-1.5 rounded border border-gray-100 text-xs",children:[(0,o.jsxs)("span",{className:"font-medium text-gray-700",children:[idx+1,". ",ath?.name||`Atlet #${aid}`," (",ath?.body_weight||0," kg)"]}),(0,o.jsx)("button",{type:"button",onClick:()=>setForm(prev=>({...prev,athlete_ids:prev.athlete_ids.filter(x=>x!==aid)})),className:"text-red-500 hover:text-red-700 font-bold cursor-pointer",children:"✕"})]},aid)})})]}),(form.id||isNewAth)&&(0,o.jsxs)("div",{className:"space-y-3 border-t pt-3",children:[(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-gray-600 mb-1",children:"Nama Atlet *"}),(0,o.jsx)("input",{type:"text",required:!isTeamCat||!!form.id,value:form.name,onChange:e=>setForm({...form,name:e.target.value}),className:"w-full border border-gray-300 rounded px-3 py-2"})]}),(0,o.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-3",children:[(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-gray-600 mb-1",children:"Jenis Kelamin"}),(0,o.jsxs)("select",{value:form.gender,onChange:e=>setForm({...form,gender:Number(e.target.value)}),className:"w-full border border-gray-300 rounded px-3 py-2",children:[(0,o.jsx)("option",{value:1,children:"Putra"}),(0,o.jsx)("option",{value:2,children:"Putri"})]})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-gray-600 mb-1",children:"Tanggal Lahir"}),(0,o.jsx)("input",{type:"date",value:form.date_of_birth,onChange:e=>setForm({...form,date_of_birth:e.target.value}),className:"w-full border border-gray-300 rounded px-3 py-2"})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-gray-600 mb-1",children:"Berat Badan (kg)"}),(0,o.jsx)("input",{type:"number",step:"0.1",value:form.body_weight,onChange:e=>setForm({...form,body_weight:e.target.value}),className:"w-full border border-gray-300 rounded px-3 py-2"})]})]}),!form.id&&isTeamCat&&isNewAth&&(0,o.jsx)("button",{type:"button",onClick:addNewAthToTeam,className:"w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium cursor-pointer",children:"+ Simpan & Tambahkan Atlet Ini ke Daftar Anggota Tim"})]}),(0,o.jsxs)("div",{className:"flex justify-end gap-2 pt-4 border-t",children:[(0,o.jsx)("button",{type:"button",onClick:()=>setModalOpen(!1),className:"px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 cursor-pointer",children:"Batal"}),(0,o.jsx)("button",{type:"submit",className:"px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer",children:form.id?"Simpan":isTeamCat?`Simpan Tim (${form.athlete_ids.length} Atlet)`:"Simpan"})]})]})]})}),(0,o.jsxs)("div",{className:"flex items-center justify-between gap-4 mb-4",children:[(0,o.jsx)(T.Input,{type:"search",placeholder:"Cari atlet atau nama tim...",value:a,onChange:i,className:"w-full md:w-[600px]"}),(0,o.jsxs)("div",{className:"flex items-center gap-2 shrink-0",children:[(0,o.jsxs)("button",{onClick:openAdd,className:"cursor-pointer bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 py-2 rounded-sm mt-1 text-sm",children:[(0,o.jsx)(u.Icon,{icon:"solar:add-square-bold",width:20}),"Tambah Peserta"]}),(0,o.jsxs)("button",{onClick:w,className:"cursor-pointer text-gray-600 hover:text-green-600 hover:bg-green-50 flex items-center gap-2 border border-gray-200 hover:border-green-200 px-4 py-2 rounded-sm mt-1 text-sm",children:[(0,o.jsx)(u.Icon,{icon:"solar:export-bold",width:20}),"Ekspor"]})]})]}),(0,o.jsxs)("div",{className:"overflow-auto bg-white border border-gray-100 rounded-md",children:[(0,o.jsxs)("table",{className:"w-full text-sm text-left text-gray-700",children:[(0,o.jsx)("thead",{style:{color:"#000000"},className:"bg-white text-black border-b border-gray-200",children:(0,o.jsxs)("tr",{style:{color:"#000000"},children:[(0,o.jsx)("th",{style:{color:"#000000"},className:"px-4 py-3 font-bold text-center w-12",children:"No"}),(0,o.jsx)("th",{style:{color:"#000000"},onClick:()=>j("name"),className:"px-4 py-3 font-bold cursor-pointer select-none",children:(0,o.jsxs)("div",{style:{color:"#000000"},className:"flex items-center justify-start",children:["Nama ",(0,o.jsx)(C,{field:"name"})]})}),(0,o.jsx)("th",{style:{color:"#000000"},onClick:()=>j("contingent_id"),className:"px-4 py-3 font-bold cursor-pointer select-none",children:(0,o.jsxs)("div",{style:{color:"#000000"},className:"flex items-center justify-start",children:["Kontingen ",(0,o.jsx)(C,{field:"contingent_id"})]})}),(0,o.jsx)("th",{style:{color:"#000000"},onClick:()=>j("category_id"),className:"px-4 py-3 font-bold cursor-pointer select-none",children:(0,o.jsxs)("div",{style:{color:"#000000"},className:"flex items-center justify-start",children:["Kelas ",(0,o.jsx)(C,{field:"category_id"})]})}),(0,o.jsx)("th",{style:{color:"#000000"},onClick:()=>j("gender"),className:"px-4 py-3 font-bold text-center cursor-pointer select-none",children:(0,o.jsxs)("div",{style:{color:"#000000"},className:"flex justify-center items-center",children:["Jenis Kelamin ",(0,o.jsx)(C,{field:"gender"})]})}),(0,o.jsx)("th",{style:{color:"#000000"},className:"px-4 py-3 font-bold text-center",children:"Tanggal Lahir"}),(0,o.jsx)("th",{style:{color:"#000000"},onClick:()=>j("body_weight"),className:"px-4 py-3 font-bold text-center cursor-pointer select-none",children:(0,o.jsxs)("div",{style:{color:"#000000"},className:"flex justify-center items-center",children:["Berat badan ",(0,o.jsx)(C,{field:"body_weight"})]})}),(0,o.jsx)("th",{style:{color:"#000000"},className:"px-4 py-3 font-bold text-center rounded-r-md",children:"Actions"})]})}),(0,o.jsxs)("tbody",{children:[v.map((e,s)=>{let a;return(0,o.jsxs)("tr",{className:"border-b border-gray-100 bg-gray-50 hover:bg-white transition-colors text-sm",children:[(0,o.jsx)("td",{className:"p-4 text-center text-gray-500 font-medium",children:s+1}),(0,o.jsx)("td",{className:"p-4 font-semibold text-gray-800",children:e.athlete?.name||e.team_name||"-"}),(0,o.jsx)("td",{className:"p-4 text-gray-600",children:e.event_contingent?.contingent?.name||e.athlete?.contingent?.name||"-"}),(0,o.jsxs)("td",{className:"p-4",children:[(0,o.jsx)("div",{children:e.category?.category?.name||cats.find(c=>c.id===e.category_id)?.category?.name||"-"}),e.team_name&&(0,o.jsxs)("span",{className:"inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full",children:["Tim: ",e.team_name]})]}),(0,o.jsx)("td",{className:"p-4 text-center",children:e.athlete?.gender===0?"Bebas":e.athlete?.gender===1?"Putra":e.athlete?.gender===2?"Putri":"-"}),(0,o.jsx)("td",{className:"p-4 text-center text-gray-600",children:fmtDob(e.athlete?.date_of_birth)}),(0,o.jsxs)("td",{className:"p-4 text-center text-gray-600",children:[e.athlete?.body_weight?`${e.athlete.body_weight} Kg`:"-"]}),(0,o.jsx)("td",{className:"p-4 text-center",children:(0,o.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"},className:"flex justify-center gap-2",children:[(0,o.jsx)("button",{onClick:ev=>openEdit(ev,e),className:"px-2.5 py-1 text-white rounded text-xs font-semibold shadow-xs transition cursor-pointer",style:{backgroundColor:"#f6c23e",color:"#ffffff",padding:"4px 10px",borderRadius:"4px",fontWeight:"600",fontSize:"12px",border:"none",cursor:"pointer",display:"inline-block"},children:"Edit"}),(0,o.jsx)("button",{onClick:(a=e.id,async ev=>{if(ev.preventDefault(),ev.stopPropagation(),!confirm("Yakin ingin menghapus atlet ini dari event?"))return;let{status:n}=await x.eventRepo.deleteParticipant(t,a);n&&r()}),className:"px-2.5 py-1 text-white rounded text-xs font-semibold shadow-xs transition cursor-pointer",style:{backgroundColor:"#e74a3b",color:"#ffffff",padding:"4px 10px",borderRadius:"4px",fontWeight:"600",fontSize:"12px",border:"none",cursor:"pointer",display:"inline-block"},children:"Delete"})]})})]},s)}),0===v.length&&(0,o.jsx)("tr",{children:(0,o.jsx)("td",{colSpan:8,className:"text-center text-gray-400 py-6 text-sm",children:"Tidak ada atlet ditemukan"})})]})]}),N>1&&(0,o.jsxs)("div",{className:"flex justify-end items-center gap-2 px-4 py-3 bg-white border-t border-gray-100",children:[1!==b&&(0,o.jsx)("button",{onClick:()=>p(b-1),className:"px-3 py-1 text-sm rounded-md text-gray-600 hover:text-green-600",children:"Sebelumnya"}),E.map((e,t)=>"string"==typeof e&&"..."==e?(0,o.jsx)("span",{className:"text-gray-400",children:"…"},`dots-${t}`):(0,o.jsx)("button",{onClick:()=>p(e),className:`cursor-pointer px-3 py-1 text-sm rounded-md transition-colors ${e===g?"bg-green-100 text-green-700":"text-gray-600 hover:text-green-600"}`,children:e},e)),b!==N&&(0,o.jsx)("button",{onClick:()=>p(b+1),className:"px-3 py-1 text-sm rounded-md text-gray-600 hover:text-green-600",children:"Selanjutnya"})]})]})]})},$=e.r(66540),B=({event:e,refresh:t})=>{let P=[150,125,100,100,75,75,75,75,50,50,50,50,50,50,50,50,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25],I=()=>Array.from({length:32},(e,t)=>({position:t+1,athlete_id:null,last_match_point:P[t]})),[r,n]=(0,c.useState)(null),[s,a]=(0,c.useState)(I()),i=(e?.categories||[]).filter(e=>!e?.category?.is_festival&&!/festival/i.test(e?.category?.name||"")),l=(0,c.useMemo)(()=>i.find(e=>e.id===r),[i,r]),h=(0,c.useMemo)(()=>{if(!r||!e.participants)return[];let t=i.find(e=>e.id===r);if(!t)return[];let n=t.category;return n?.is_best_of_the_best?e.participants.filter(e=>{let t=$(e.athlete.date_of_birth).year();return(null==n.min_body_weight||!(e.athlete.body_weight<n.min_body_weight))&&(null==n.max_body_weight||!(e.athlete.body_weight>n.max_body_weight))&&(!n.min_year||!(t<n.min_year))&&(!n.max_year||!(t>n.max_year))&&(0==n.gender||n.gender==e.athlete.gender)}):e.participants.filter(e=>e.category_id===r)},[e.participants,r,i]),m=l?.match_results||[],g=async()=>{if(!confirm("Apakah anda yakin ingin menyimpan pemenang?"))return;console.log(s.filter(e=>null!=e.athlete_id&&0!=e.athlete_id));let{status:e}=await x.eventRepo.postMatchResult(Number(l?.id),{results:s.filter(e=>null!=e.athlete_id&&0!=e.athlete_id),total_participants:h?.length||0});e&&(t(),a(I()))};return(0,c.useEffect)(()=>{r&&a(I())},[r]),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)("div",{className:"flex gap-2",children:[(0,o.jsx)(T.Input,{type:"select",options:[{label:"Pilih Kategori",value:"",disabled:!0},...i.sort((e,t)=>e.category.name.localeCompare(t.category.name)).map(e=>({label:`${e.category.is_best_of_the_best?"⭐ ":""}${e.match_results.length>0?`☑ `:""}${e.category.name}`,value:e.id}))],onChange:e=>n(Number(e)||null)}),s.some(e=>null!=e.athlete_id&&0!=e.athlete_id)&&(0,o.jsx)("button",{onClick:g,className:"cursor-pointer py-1 px-4 bg-green-500 hover:bg-green-400 text-white rounded-sm mt-1",children:"Simpan"})]}),l&&(0,o.jsx)("div",{className:"space-y-3",children:s.map((e,r)=>{let n,s=m.find(t=>t.position==e.position),i=h.find(e=>e.athlete.id===s?.athlete_id);return(0,o.jsx)(d.motion.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:Math.min(.02*r,.6)},className:"flex items-center justify-between border border-gray-200 bg-[#f5f5f5] rounded-lg px-4 py-3 transition",children:(0,o.jsxs)("div",{className:"flex flex-1 items-center gap-2",children:[(0,o.jsx)("div",{className:`text-gray-600 font-semibold ${e.position<=4?"text-2xl mr-3":"text-md mr-4 ml-2"}`,children:1==e.position?"🥇":2==e.position?"🥈":3==e.position||4==e.position?"🥉":[1,2,3,3,5,5,5,5,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7][e.position-1]||e.position}),i?(0,o.jsxs)("div",{className:"flex flex-1 items-center",children:[(0,o.jsxs)("div",{className:"flex flex-col flex-1",children:[(0,o.jsxs)("span",{className:"text-gray-600 text-md",children:[i?.athlete?.name||"-",i?.team_name?` [Tim: ${i.team_name}]`:""," (",i?.event_contingent?.contingent?.abbreviation,")"]}),(0,o.jsxs)("span",{className:"text-gray-600 text-xs",children:["Poin terakhir: ",s?.last_match_point??P[e.position-1]??0]})]}),(0,o.jsx)("button",{onClick:(n=s?.id,async e=>{if(!confirm("Yakin ingin menghapus pemenang ini?"))return;let{status:r}=await x.eventRepo.deleteMatchResult(n);r&&(t(),a(I()))}),className:"cursor-pointer text-gray-600 hover:text-red-400",children:(0,o.jsx)(u.Icon,{icon:"solar:trash-bin-trash-bold",width:24})})]}):(0,o.jsxs)("div",{className:"flex flex-1 flex-col md:flex-row items-center gap-2",children:[(0,o.jsx)(T.Input,{type:"select",options:[{label:"Pilih Atlet",value:"",disabled:!0},...h.map(e=>({label:`[${e.event_contingent.contingent.abbreviation}] ${e.athlete.name}${e.team_name?` (Tim: ${e.team_name})`:""}`,value:e.athlete.id}))],onChange:t=>{var r;return r=e.position,void a(e=>e.map(e=>e.position===r?{...e,athlete_id:"string"==typeof t?Number(t):null}:e))}}),(0,o.jsx)(T.Input,{type:"number",placeholder:"Poin terakhir",value:e.last_match_point,className:"w-full md:w-100",onChange:t=>a(e=>e.map((item,idx)=>idx===r?{...item,last_match_point:Number(t)}:item))})]})]})},e.position)})})]})};e.i(20464);var H=e.i(60107),redux=e.i(55487);
let RegOSH = ({event: s, refresh: i, user: s_user}) => {
    let router = (0, f.useRouter)();
    let [search, setSearch] = (0, c.useState)("");
    let [genderFilter, setGenderFilter] = (0, c.useState)("all");
    let [catFilter, setCatFilter] = (0, c.useState)("all");
    let [tabType, setTabType] = (0, c.useState)("individual"); // "individual" or "team"
    let [modalOpen, setModalOpen] = (0, c.useState)(!1);
    let [modalMode, setModalMode] = (0, c.useState)("add"); // "add" or "edit"
    let [editingPartId, setEditingPartId] = (0, c.useState)(null);
    let [editingAthId, setEditingAthId] = (0, c.useState)(null);
    let [isNewAth, setIsNewAth] = (0, c.useState)(!1);
    let [conts, setConts] = (0, c.useState)([]);
    let [allAthletes, setAllAthletes] = (0, c.useState)([]);
    let [loadingAction, setLoadingAction] = (0, c.useState)(!1);
    let [teamAthSearch, setTeamAthSearch] = (0, c.useState)("");
    let [showAllAthletes, setShowAllAthletes] = (0, c.useState)(!1);

    let myContId = s_user?.contingent?.id ? Number(s_user.contingent.id) : null;

    let [form, setForm] = (0, c.useState)({
        category_id: "",
        contingent_id: myContId ? String(myContId) : "",
        athlete_id: "",
        athlete_ids: [],
        team_name: "",
        name: "",
        gender: 1,
        date_of_birth: "",
        body_weight: ""
    });

    let cats = s.categories || [];
    let participants = s.participants || [];
    let contingents = s.contingents || [];

    // Filter participants: show user's contingent participants if available, or all if none
    let displayParticipants = (0, c.useMemo)(() => {
        let list = participants;
        if (myContId) {
            let myParts = list.filter(p => {
                let pContId = p.event_contingent?.contingent_id || p.event_contingent?.contingent?.id || p.athlete?.contingent_id;
                return pContId && Number(pContId) === myContId;
            });
            if (myParts.length > 0) return myParts;
        }
        return list;
    }, [participants, myContId]);

    // Format helpers
    let formatDate = d => {
        if (!d) return "-";
        try {
            let dt = new Date(d);
            if (isNaN(dt.getTime())) return String(d).split("T")[0];
            let day = String(dt.getDate()).padStart(2, "0");
            let month = String(dt.getMonth() + 1).padStart(2, "0");
            let year = dt.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (e) {
            return String(d);
        }
    };

    let formatWeight = w => {
        if (w === undefined || w === null || w === "" || w === 0) return "-";
        return `${w} Kg`;
    };

    let formatGender = g => {
        if (g === 1 || g === "1") return "Putra";
        if (g === 2 || g === "2") return "Putri";
        return "-";
    };

    // Filtered by search, gender, category, and individual/team
    let filteredParticipants = (0, c.useMemo)(() => {
        return displayParticipants.filter(p => {
            let ath = p.athlete;
            let catObj = cats.find(c => c.id === p.category_id);
            let catName = catObj?.category?.name || p.category?.category?.name || "";
            let contName = p.event_contingent?.contingent?.name || p.event_contingent?.contingent?.abbreviation || ath?.contingent?.name || "";
            let athName = ath?.name || p.team_name || "";
            let isTeam = Boolean(p.team_name || catObj?.category?.is_team || /beregu/i.test(catName));

            if (tabType === "individual" && isTeam) return false;
            if (tabType === "team" && !isTeam) return false;

            if (genderFilter === "1" && ath?.gender !== 1 && catObj?.category?.gender !== 1) return false;
            if (genderFilter === "2" && ath?.gender !== 2 && catObj?.category?.gender !== 2) return false;

            if (catFilter !== "all" && String(p.category_id) !== String(catFilter)) return false;

            if (search.trim()) {
                let q = search.trim().toLowerCase();
                let match = athName.toLowerCase().includes(q) ||
                    catName.toLowerCase().includes(q) ||
                    contName.toLowerCase().includes(q);
                if (!match) return false;
            }
            return true;
        });
    }, [displayParticipants, cats, search, genderFilter, catFilter, tabType]);

    let totalCats = cats.length;
    let totalParticipants = displayParticipants.length;
    let totalPaid = 0;
    let totalUnpaid = totalParticipants;
    let totalVerified = totalParticipants;
    let totalConts = contingents.length || (myContId ? 1 : 0);

    let selModalCat = (0, c.useMemo)(() => cats.find(c => String(c.id) === String(form.category_id)), [cats, form.category_id]);
    let isModalTeam = Boolean(selModalCat?.category?.is_team || /beregu/i.test(selModalCat?.category?.name || ""));

    let catCriteria = (0, c.useMemo)(() => {
        if (!selModalCat?.category) return null;
        let cat = selModalCat.category;
        let catGen = Number(cat.gender) || 0;
        if (catGen !== 1 && catGen !== 2) {
            let cName = cat.name || "";
            let hasPutra = /\bputra\b/i.test(cName);
            let hasPutri = /\bputri\b/i.test(cName);
            if (hasPutri && !hasPutra) catGen = 2;
            else if (hasPutra && !hasPutri) catGen = 1;
        }
        let minY = (cat.min_year !== undefined && cat.min_year !== null && String(cat.min_year).trim() !== "") ? parseInt(cat.min_year, 10) : null;
        let maxY = (cat.max_year !== undefined && cat.max_year !== null && String(cat.max_year).trim() !== "") ? parseInt(cat.max_year, 10) : null;
        if (isNaN(minY) || minY <= 0) minY = null;
        if (isNaN(maxY) || maxY <= 0) maxY = null;
        if (minY && maxY && minY > maxY) { let tmpY = minY; minY = maxY; maxY = tmpY; }
        let minW = parseFloat(cat.min_body_weight);
        let maxW = parseFloat(cat.max_body_weight);
        if (isNaN(minW) || minW <= 0) minW = 0;
        if (isNaN(maxW) || maxW <= 0) maxW = 0;
        if (minW > 0 && maxW > 0 && minW > maxW) { let tmpW = minW; minW = maxW; maxW = tmpW; }
        return { catGen, minY, maxY, minW, maxW };
    }, [selModalCat]);

    let eligibleAthletes = (0, c.useMemo)(() => {
        let list = allAthletes.filter(a => {
            if (!form.contingent_id) return true;
            let aContId = a.contingent_id || a.contingent?.id || "";
            return String(aContId) === String(form.contingent_id);
        });
        if (showAllAthletes && isModalTeam) return list;
        if (!catCriteria) return list;
        let { catGen, minY, maxY, minW, maxW } = catCriteria;

        return list.filter(a => {
            if (catGen === 1 || catGen === 2) {
                let athGen = Number(a.gender);
                if (athGen !== catGen) return false;
            }
            if (minY || maxY) {
                let bYear = null;
                if (a.date_of_birth) {
                    let dt = new Date(a.date_of_birth);
                    if (!isNaN(dt.getTime())) bYear = dt.getFullYear();
                    else {
                        let m = String(a.date_of_birth).match(/(\d{4})/);
                        if (m) bYear = parseInt(m[1], 10);
                    }
                }
                if (!bYear) return false;
                if (minY && bYear < minY) return false;
                if (maxY && bYear > maxY) return false;
            }
            if (minW > 0 || maxW > 0) {
                let athW = (a.body_weight !== undefined && a.body_weight !== null && String(a.body_weight).trim() !== "") ? parseFloat(a.body_weight) : NaN;
                if (isNaN(athW) || athW <= 0) return false;
                if (minW > 0 && athW < minW) return false;
                if (maxW > 0 && athW > maxW) return false;
            }
            return true;
        });
    }, [allAthletes, form.contingent_id, catCriteria, showAllAthletes, isModalTeam]);

    let searchedAthletes = (0, c.useMemo)(() => {
        let base = eligibleAthletes;
        if (!teamAthSearch.trim()) return base;
        let q = teamAthSearch.trim().toLowerCase();
        return base.filter(a => (a.name || "").toLowerCase().includes(q) || String(a.code || "").toLowerCase().includes(q));
    }, [eligibleAthletes, teamAthSearch]);

    let exportCSV = () => {
        let headers = ["No", "Nama", "Kontingen", "Kelas", "Jenis Kelamin", "Tanggal Lahir", "Berat badan"];
        let rows = [headers];
        filteredParticipants.forEach((p, idx) => {
            let ath = p.athlete;
            let catObj = cats.find(c => c.id === p.category_id);
            let catName = catObj?.category?.name || p.category?.category?.name || "-";
            let contName = p.event_contingent?.contingent?.name || p.event_contingent?.contingent?.abbreviation || ath?.contingent?.name || "-";
            let athName = ath?.name || p.team_name || "-";
            let gender = ath?.gender ? formatGender(ath.gender) : formatGender(catObj?.category?.gender);
            let dob = ath?.date_of_birth ? formatDate(ath.date_of_birth) : "-";
            let weight = ath?.body_weight ? formatWeight(ath.body_weight) : "-";

            rows.push([
                idx + 1,
                `"${athName.replace(/"/g, '""')}"`,
                `"${contName.replace(/"/g, '""')}"`,
                `"${catName.replace(/"/g, '""')}"`,
                gender,
                dob,
                weight
            ]);
        });
        let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Participant_List_${(s.name || 'Event').replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    let openAdd = async () => {
        setLoadingAction(!0);
        try {
            let [resC, resA] = await Promise.all([
                cRepo.getAllContingents(),
                myContId ? aRepo.getAthletesByContingent(myContId) : aRepo.findAthletes({ page: 1, limit: 10000, sort_by: "name", order: "asc" })
            ]);
            if (resC.status) setConts(resC.data?.data || resC.data || []);
            if (resA.status) setAllAthletes(resA.data?.data || resA.data || []);
        } catch (err) {}
        setLoadingAction(!1);
        setModalMode("add");
        setEditingPartId(null);
        setEditingAthId(null);
        setIsNewAth(!1);
        setTeamAthSearch("");
        setShowAllAthletes(!1);
        setForm({
            category_id: cats[0]?.id ? String(cats[0].id) : "",
            contingent_id: myContId ? String(myContId) : "",
            athlete_id: "",
            athlete_ids: [],
            team_name: "",
            name: "",
            gender: (() => {
                let initCat = cats[0]?.category;
                let g = Number(initCat?.gender) || 0;
                if (g !== 1 && g !== 2) {
                    let cn = initCat?.name || "";
                    let hp = /\bputra\b/i.test(cn), hpi = /\bputri\b/i.test(cn);
                    if (hpi && !hp) g = 2;
                    else if (hp && !hpi) g = 1;
                }
                return (g === 1 || g === 2) ? g : 1;
            })(),
            date_of_birth: "",
            body_weight: ""
        });
        setModalOpen(!0);
    };

    let openEdit = async (part) => {
        setLoadingAction(!0);
        try {
            let [resC, resA] = await Promise.all([
                cRepo.getAllContingents(),
                aRepo.findAthletes({ page: 1, limit: 1000, sort_by: "name", order: "asc" })
            ]);
            if (resC.status) setConts(resC.data?.data || []);
            if (resA.status) setAllAthletes(resA.data?.data || []);
        } catch (err) {}
        setLoadingAction(!1);

        let ath = part.athlete || {};
        let pContId = part.event_contingent?.contingent_id || part.event_contingent?.contingent?.id || ath.contingent_id || myContId || "";
        setModalMode("edit");
        setEditingPartId(part.id);
        setEditingAthId(ath.id || null);
        setIsNewAth(!1);
        setForm({
            category_id: String(part.category_id || ""),
            contingent_id: String(pContId),
            athlete_id: ath.id ? String(ath.id) : "",
            athlete_ids: [],
            team_name: part.team_name || "",
            name: ath.name || part.team_name || "",
            gender: ath.gender || 1,
            date_of_birth: ath.date_of_birth ? ath.date_of_birth.split("T")[0] : "",
            body_weight: ath.body_weight !== undefined && ath.body_weight !== null ? String(ath.body_weight) : ""
        });
        setModalOpen(!0);
    };

    let saveParticipant = async (ev) => {
        ev.preventDefault();
        if (!form.category_id) return alert("Pilih kategori pertandingan terlebih dahulu!");
        let targetContId = form.contingent_id ? Number(form.contingent_id) : myContId;
        if (!targetContId) return alert("Pilih kontingen terlebih dahulu!");

        setLoadingAction(!0);
        try {
            if (modalMode === "edit") {
                // Update participant category
                let updateData = {
                    category_id: Number(form.category_id),
                    contingent_id: targetContId
                };
                if (isModalTeam) {
                    updateData.team_name = form.team_name ? form.team_name.trim() : form.name;
                } else if (editingAthId) {
                    updateData.athlete_id = Number(editingAthId);
                    // Update athlete info if athlete exists
                    try {
                        await aRepo.updateAthlete(editingAthId, {
                            name: form.name,
                            gender: Number(form.gender),
                            date_of_birth: form.date_of_birth || void 0,
                            body_weight: form.body_weight !== "" ? Number(form.body_weight) : 0,
                            contingent_id: targetContId
                        });
                    } catch (athErr) {
                        console.error("Failed to update athlete:", athErr);
                    }
                }
                let { status: ok } = await x.eventRepo.updateParticipant(s.id, editingPartId, updateData);
                if (ok) {
                    setModalOpen(!1);
                    i();
                } else {
                    alert("Gagal memperbarui data peserta. Silakan coba lagi.");
                }
            } else {
                // Add mode
                if (isModalTeam) {
                    if (!form.team_name || !form.team_name.trim()) {
                        setLoadingAction(!1);
                        return alert("Nama Tim / Regu wajib diisi!");
                    }
                    let teamIds = [...form.athlete_ids];
                    if (isNewAth && form.name) {
                        let { status: okA, data: resA } = await aRepo.createAthlete({
                            name: form.name,
                            gender: Number(form.gender),
                            date_of_birth: form.date_of_birth || void 0,
                            body_weight: form.body_weight !== "" ? Number(form.body_weight) : 0,
                            contingent_id: targetContId,
                            is_verified: !0
                        });
                        if (okA && resA?.data?.id) teamIds.push(resA.data.id);
                    }
                    if (teamIds.length < 3) {
                        setLoadingAction(!1);
                        return alert("Kategori beregu wajib memilih minimal 3 atlet dalam 1 tim/regu!");
                    }
                    let { status: ok } = await x.eventRepo.register(s.id, {
                        contingent_id: targetContId,
                        team_name: form.team_name.trim(),
                        athletes: teamIds.map(aid => ({
                            athlete_id: Number(aid),
                            category_id: Number(form.category_id),
                            contingent_id: targetContId,
                            team_name: form.team_name.trim()
                        }))
                    });
                    if (ok) {
                        setModalOpen(!1);
                        i();
                    } else {
                        alert("Gagal mendaftarkan tim.");
                    }
                } else {
                    let targetAthId = form.athlete_id ? Number(form.athlete_id) : null;
                    if (isNewAth) {
                        if (!form.name) {
                            setLoadingAction(!1);
                            return alert("Nama atlet baru wajib diisi!");
                        }
                        let { status: okA, data: resA } = await aRepo.createAthlete({
                            name: form.name,
                            gender: Number(form.gender),
                            date_of_birth: form.date_of_birth || void 0,
                            body_weight: form.body_weight !== "" ? Number(form.body_weight) : 0,
                            contingent_id: targetContId,
                            is_verified: !0
                        });
                        if (!okA || !resA?.data?.id) {
                            setLoadingAction(!1);
                            return alert("Gagal membuat atlet baru.");
                        }
                        targetAthId = resA.data.id;
                    } else if (!targetAthId) {
                        setLoadingAction(!1);
                        return alert("Pilih atlet terlebih dahulu!");
                    }
                    let { status: ok } = await x.eventRepo.register(s.id, {
                        contingent_id: targetContId,
                        athletes: [{
                            athlete_id: targetAthId,
                            category_id: Number(form.category_id),
                            contingent_id: targetContId
                        }]
                    });
                    if (ok) {
                        setModalOpen(!1);
                        i();
                    } else {
                        alert("Gagal mendaftarkan atlet.");
                    }
                }
            }
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan saat memproses data.");
        }
        setLoadingAction(!1);
    };

    let deletePart = async (ev, partId) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (!confirm("Yakin ingin menghapus peserta ini dari event?")) return;
        setLoadingAction(!0);
        try {
            let { status: ok } = await x.eventRepo.deleteParticipant(s.id, partId);
            if (ok) i();
            else alert("Gagal menghapus peserta.");
        } catch (err) {
            alert("Gagal menghapus peserta.");
        }
        setLoadingAction(!1);
    };

    return (0, o.jsxs)("div", {
        className: "space-y-5 text-gray-800",
        children: [
            // Modal Add / Edit
            modalOpen && (0, o.jsx)("div", {
                className: "fixed inset-0 z-50 overflow-y-auto bg-black/60 p-2 sm:p-4 flex items-center justify-center",
                style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, backgroundColor: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", overflowY: "auto" },
                onClick: () => setModalOpen(!1),
                children: (0, o.jsxs)("div", {
                    className: "bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 flex flex-col my-auto",
                    style: { maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" },
                    onClick: e => e.stopPropagation(),
                    children: [
                        // Modal Header (Pinned at top)
                        (0, o.jsxs)("div", {
                            className: "flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/80 shrink-0",
                            style: { flexShrink: 0 },
                            children: [
                                (0, o.jsxs)("div", {
                                    children: [
                                        (0, o.jsx)("h3", {
                                            className: "text-lg font-bold text-gray-800",
                                            children: modalMode === "edit" ? "Edit Data Peserta" : (isModalTeam ? "Daftarkan Tim / Regu Baru" : "Daftarkan Atlet Baru")
                                        }),
                                        isModalTeam && (0, o.jsx)("p", {
                                            className: "text-xs text-gray-500 mt-0.5",
                                            children: selModalCat?.category?.name || "Kategori Beregu"
                                        })
                                    ]
                                }),
                                (0, o.jsx)("button", {
                                    type: "button",
                                    onClick: () => setModalOpen(!1),
                                    className: "text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-md hover:bg-gray-100 transition",
                                    children: "✕"
                                })
                            ]
                        }),

                        // Modal Form Body (Scrollable, never pushes buttons off)
                        (0, o.jsxs)("form", {
                            id: "regosh-modal-form-716",
                            onSubmit: saveParticipant,
                            className: "p-6 space-y-4 text-sm flex-1 overflow-y-auto",
                            style: { overflowY: "auto", flex: "1 1 auto", maxHeight: "calc(90vh - 130px)" },
                            children: [
                                (0, o.jsxs)("div", {
                                    children: [
                                        (0, o.jsx)("label", { className: "block font-medium text-gray-700 mb-1", children: "Kategori Pertandingan (Kelas) *" }),
                                        (0, o.jsxs)("select", {
                                            required: !0,
                                            value: form.category_id,
                                            onChange: e => {
                                                let val = e.target.value;
                                                let foundCat = cats.find(c => String(c.id) === String(val));
                                                let catGen = Number(foundCat?.category?.gender) || 0;
                                                if (catGen !== 1 && catGen !== 2) {
                                                    let cName = foundCat?.category?.name || "";
                                                    let hp = /\bputra\b/i.test(cName), hpi = /\bputri\b/i.test(cName);
                                                    if (hpi && !hp) catGen = 2;
                                                    else if (hp && !hpi) catGen = 1;
                                                }
                                                setTeamAthSearch("");
                                                setShowAllAthletes(!1);
                                                setForm(prev => ({ ...prev, category_id: val, athlete_id: "", athlete_ids: [], gender: (catGen === 1 || catGen === 2) ? catGen : prev.gender }));
                                            },
                                            className: "w-full border border-gray-300 rounded-lg p-2.5 text-gray-800 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500",
                                            children: [
                                                (0, o.jsx)("option", { value: "", disabled: !0, children: "-- Pilih Kategori / Kelas --" }),
                                                cats.map(c => (0, o.jsx)("option", { value: c.id, children: c.category?.name }, c.id))
                                            ]
                                        }),
                                        catCriteria && modalMode === "add" && (0, o.jsxs)("div", {
                                            style: { marginTop: "6px", padding: "8px 12px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", color: "#475569", display: "flex", flexWrap: "wrap", gap: "4px 12px" },
                                            children: [
                                                (0, o.jsxs)("span", { children: ["Jenis Kelamin: ", (0, o.jsx)("strong", { style: { color: "#1e293b" }, children: catCriteria.catGen === 1 ? "Putra" : catCriteria.catGen === 2 ? "Putri" : "Bebas" })] }),
                                                (0, o.jsxs)("span", { children: ["Tahun Lahir: ", (0, o.jsx)("strong", { style: { color: "#1e293b" }, children: (catCriteria.minY && catCriteria.maxY) ? `${catCriteria.minY} - ${catCriteria.maxY}` : catCriteria.minY ? `>= ${catCriteria.minY}` : catCriteria.maxY ? `<= ${catCriteria.maxY}` : "Bebas" })] }),
                                                (0, o.jsxs)("span", { children: ["Berat Badan: ", (0, o.jsx)("strong", { style: { color: "#1e293b" }, children: (catCriteria.minW > 0 && catCriteria.maxW > 0) ? `${catCriteria.minW} - ${catCriteria.maxW} Kg` : catCriteria.minW > 0 ? `>= ${catCriteria.minW} Kg` : catCriteria.maxW > 0 ? `<= ${catCriteria.maxW} Kg` : "Bebas" })] }),
                                                (0, o.jsxs)("span", { style: { color: eligibleAthletes.length > 0 ? "#059669" : "#d97706", fontWeight: 600 }, children: ["(", eligibleAthletes.length, " atlet sesuai)"] })
                                            ]
                                        })
                                    ]
                                }),
                                (0, o.jsxs)("div", {
                                    children: [
                                        (0, o.jsx)("label", { className: "block font-medium text-gray-700 mb-1", children: "Kontingen *" }),
                                        (0, o.jsxs)("select", {
                                            required: !0,
                                            disabled: Boolean(myContId),
                                            value: form.contingent_id,
                                            onChange: e => setForm(prev => ({ ...prev, contingent_id: e.target.value, athlete_id: "", athlete_ids: [] })),
                                            className: `w-full border border-gray-300 rounded-lg p-2.5 text-gray-800 bg-white ${myContId ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-green-500 focus:border-green-500'}`,
                                            children: [
                                                (0, o.jsx)("option", { value: "", disabled: !0, children: "-- Pilih Kontingen --" }),
                                                myContId ? (
                                                    (0, o.jsx)("option", { value: myContId, children: s_user?.contingent?.name || "Kontingen Anda" })
                                                ) : (
                                                    conts.map(c => (0, o.jsxs)("option", { value: c.id, children: [c.name, c.abbreviation ? ` (${c.abbreviation})` : ""] }, c.id))
                                                )
                                            ]
                                        }),
                                        myContId && (0, o.jsx)("p", { className: "text-[11px] text-gray-500 mt-1", children: "Terkunci sesuai akun kontingen Anda." })
                                    ]
                                }),
                                modalMode === "edit" ? (
                                    (0, o.jsxs)("div", {
                                        className: "space-y-3 p-3.5 bg-gray-50 rounded-lg border border-gray-200",
                                        children: [
                                            (0, o.jsx)("div", { className: "text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1", children: "Detail Data Peserta / Atlet" }),
                                            (0, o.jsxs)("div", {
                                                children: [
                                                    (0, o.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: isModalTeam ? "Nama Tim / Regu *" : "Nama Lengkap Atlet *" }),
                                                    (0, o.jsx)("input", {
                                                        required: !0,
                                                        type: "text",
                                                        value: form.name,
                                                        onChange: e => setForm({ ...form, name: e.target.value }),
                                                        className: "w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
                                                    })
                                                ]
                                            }),
                                            !isModalTeam && (0, o.jsxs)("div", {
                                                className: "grid grid-cols-2 gap-2",
                                                children: [
                                                    (0, o.jsxs)("div", {
                                                        children: [
                                                            (0, o.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Jenis Kelamin" }),
                                                            (0, o.jsxs)("select", {
                                                                value: form.gender,
                                                                onChange: e => setForm({ ...form, gender: e.target.value }),
                                                                className: "w-full border border-gray-300 rounded-lg p-2 text-sm bg-white",
                                                                children: [
                                                                    (0, o.jsx)("option", { value: 1, children: "Putra" }),
                                                                    (0, o.jsx)("option", { value: 2, children: "Putri" })
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    (0, o.jsxs)("div", {
                                                        children: [
                                                            (0, o.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Berat Badan (Kg)" }),
                                                            (0, o.jsx)("input", {
                                                                type: "number",
                                                                value: form.body_weight,
                                                                onChange: e => setForm({ ...form, body_weight: e.target.value }),
                                                                placeholder: "Contoh: 40",
                                                                className: "w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
                                                            })
                                                        ]
                                                    }),
                                                    (0, o.jsxs)("div", {
                                                        className: "col-span-2",
                                                        children: [
                                                            (0, o.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Tanggal Lahir" }),
                                                            (0, o.jsx)("input", {
                                                                type: "date",
                                                                value: form.date_of_birth,
                                                                onChange: e => setForm({ ...form, date_of_birth: e.target.value }),
                                                                className: "w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ) : isModalTeam ? (
                                    (0, o.jsxs)(o.Fragment, {
                                        children: [
                                            (0, o.jsxs)("div", {
                                                children: [
                                                    (0, o.jsx)("label", { className: "block font-medium text-gray-700 mb-1", children: "Nama Tim / Regu *" }),
                                                    (0, o.jsx)("input", {
                                                        required: !0,
                                                        type: "text",
                                                        value: form.team_name,
                                                        onChange: e => setForm({ ...form, team_name: e.target.value }),
                                                        placeholder: "Contoh: Regu A, INKAI Batam 1",
                                                        className: "w-full border border-gray-300 rounded-lg p-2.5 text-gray-800 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    })
                                                ]
                                            }),
                                            (0, o.jsxs)("div", {
                                                className: "space-y-2 pt-1",
                                                children: [
                                                    (0, o.jsxs)("div", {
                                                        className: "flex items-center justify-between",
                                                        children: [
                                                            (0, o.jsxs)("label", {
                                                                className: "block font-medium text-gray-700",
                                                                children: [
                                                                    "Pilih Anggota Tim / Regu ",
                                                                    (0, o.jsxs)("span", {
                                                                        className: form.athlete_ids.length >= 3 ? "text-emerald-600 font-bold" : "text-amber-600 font-bold",
                                                                        children: ["(", form.athlete_ids.length, " Terpilih, min 3) *"]
                                                                    })
                                                                ]
                                                            }),
                                                            (0, o.jsx)("button", {
                                                                type: "button",
                                                                onClick: () => setShowAllAthletes(!showAllAthletes),
                                                                className: "text-[11px] font-medium text-primary-600 hover:underline cursor-pointer",
                                                                children: showAllAthletes ? "Terapkan Filter Kategori" : "Tampilkan Semua Atlet"
                                                            })
                                                        ]
                                                    }),

                                                    // Selected chips preview
                                                    form.athlete_ids.length > 0 && (0, o.jsxs)("div", {
                                                        className: "p-2.5 bg-emerald-50/90 border border-emerald-200 rounded-lg space-y-1.5",
                                                        children: [
                                                            (0, o.jsxs)("div", {
                                                                className: "flex justify-between items-center text-xs font-semibold text-emerald-800",
                                                                children: [
                                                                    (0, o.jsxs)("span", { children: ["Anggota Regu Terpilih (", form.athlete_ids.length, " atlet):"] }),
                                                                    (0, o.jsx)("button", {
                                                                        type: "button",
                                                                        onClick: () => setForm(prev => ({ ...prev, athlete_ids: [] })),
                                                                        className: "text-[11px] text-red-600 hover:underline cursor-pointer",
                                                                        children: "Hapus Semua"
                                                                    })
                                                                ]
                                                            }),
                                                            (0, o.jsx)("div", {
                                                                className: "flex flex-wrap gap-1.5 max-h-24 overflow-y-auto",
                                                                children: form.athlete_ids.map((aid, idx) => {
                                                                    let ath = allAthletes.find(a => Number(a.id) === Number(aid));
                                                                    return (0, o.jsxs)("span", {
                                                                        className: "inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-emerald-300 text-emerald-900 rounded-md text-xs font-medium shadow-2xs",
                                                                        children: [
                                                                            (0, o.jsxs)("span", { children: [idx + 1, ". ", ath?.name || `Atlet #${aid}`, ath?.body_weight ? ` (${ath.body_weight} kg)` : ""] }),
                                                                            (0, o.jsx)("button", {
                                                                                type: "button",
                                                                                onClick: () => setForm(prev => ({ ...prev, athlete_ids: prev.athlete_ids.filter(x => x !== aid) })),
                                                                                className: "text-red-500 hover:text-red-700 font-bold ml-1 cursor-pointer",
                                                                                children: "✕"
                                                                            })
                                                                        ]
                                                                    }, aid);
                                                                })
                                                            })
                                                        ]
                                                    }),

                                                    // Search input
                                                    (0, o.jsx)("input", {
                                                        type: "text",
                                                        placeholder: "🔍 Cari nama atlet...",
                                                        value: teamAthSearch,
                                                        onChange: e => setTeamAthSearch(e.target.value),
                                                        className: "w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs bg-white focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                                    }),

                                                    // Athletes List Box with clean scrolling
                                                    (0, o.jsx)("div", {
                                                        className: "border border-gray-300 rounded-lg p-2 max-h-56 overflow-y-auto space-y-1 bg-white divide-y divide-gray-50",
                                                        children: searchedAthletes.length === 0 ? (
                                                            (0, o.jsxs)("div", {
                                                                className: "p-4 text-center space-y-1.5",
                                                                children: [
                                                                    (0, o.jsx)("p", { className: "text-xs text-amber-600 font-medium", children: "Tidak ada atlet yang cocok dengan kriteria." }),
                                                                    !showAllAthletes && (0, o.jsx)("button", {
                                                                        type: "button",
                                                                        onClick: () => setShowAllAthletes(!0),
                                                                        className: "text-xs text-blue-600 hover:underline font-semibold cursor-pointer",
                                                                        children: "Tampilkan Semua Atlet Kontingen"
                                                                    })
                                                                ]
                                                            })
                                                        ) : (
                                                            searchedAthletes.map(a => {
                                                                let isChecked = form.athlete_ids.includes(a.id);
                                                                let by = a.date_of_birth ? new Date(a.date_of_birth).getFullYear() : null;
                                                                return (0, o.jsxs)("label", {
                                                                    className: `flex items-center justify-between p-2 rounded cursor-pointer text-xs transition ${isChecked ? "bg-green-100/70 border border-green-300" : "hover:bg-gray-50 border border-transparent"}`,
                                                                    children: [
                                                                        (0, o.jsxs)("div", {
                                                                            className: "flex items-center gap-2.5 min-w-0 pr-2",
                                                                            children: [
                                                                                (0, o.jsx)("input", {
                                                                                    type: "checkbox",
                                                                                    checked: isChecked,
                                                                                    onChange: () => {
                                                                                        let next = isChecked ? form.athlete_ids.filter(id => id !== a.id) : [...form.athlete_ids, a.id];
                                                                                        setForm(prev => ({ ...prev, athlete_ids: next }));
                                                                                    },
                                                                                    className: "rounded border-gray-300 text-green-600 focus:ring-green-500 shrink-0"
                                                                                }),
                                                                                (0, o.jsxs)("div", {
                                                                                    className: "truncate",
                                                                                    children: [
                                                                                        (0, o.jsx)("span", { className: `font-medium ${isChecked ? "text-green-900 font-semibold" : "text-gray-800"}`, children: a.name }),
                                                                                        (0, o.jsxs)("span", {
                                                                                            className: "text-gray-400 text-[11px] ml-1.5",
                                                                                            children: [
                                                                                                "(", a.gender === 1 ? "Putra" : a.gender === 2 ? "Putri" : "-",
                                                                                                by ? `, Thn ${by}` : "",
                                                                                                a.body_weight ? `, ${a.body_weight} kg` : "",
                                                                                                ")"
                                                                                            ]
                                                                                        })
                                                                                    ]
                                                                                })
                                                                            ]
                                                                        }),
                                                                        isChecked && (0, o.jsx)("span", { className: "text-[11px] font-bold text-green-700 shrink-0", children: "✓ Terpilih" })
                                                                    ]
                                                                }, a.id);
                                                            })
                                                        )
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ) : (
                                    (0, o.jsxs)(o.Fragment, {
                                        children: [
                                            (0, o.jsx)("label", { className: "block font-medium text-gray-700 mb-1", children: "Pilih Atlet Terdaftar *" }),
                                            !isNewAth ? (
                                                (0, o.jsxs)("select", {
                                                    required: !0,
                                                    value: form.athlete_id,
                                                    onChange: e => {
                                                        let val = e.target.value;
                                                        let found = eligibleAthletes.find(a => String(a.id) === String(val));
                                                        let fContId = found?.contingent_id || found?.contingent?.id || "";
                                                        setForm(prev => ({ ...prev, athlete_id: val, contingent_id: prev.contingent_id || (fContId ? String(fContId) : "") }));
                                                    },
                                                    className: "w-full border border-gray-300 rounded-lg p-2.5 text-gray-800 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500",
                                                    children: [
                                                        (0, o.jsx)("option", { value: "", disabled: !0, children: eligibleAthletes.length === 0 ? "-- Tidak ada atlet yang sesuai dengan kriteria kategori ini --" : "-- Pilih Atlet --" }),
                                                        eligibleAthletes.map(a => {
                                                            let dt = a.date_of_birth ? new Date(a.date_of_birth) : null;
                                                            let by = (dt && !isNaN(dt.getTime())) ? dt.getFullYear() : (a.date_of_birth ? (String(a.date_of_birth).match(/(\d{4})/)?.[1] || "") : "");
                                                            return (0, o.jsxs)("option", { value: a.id, children: [a.name, " (", Number(a.gender) === 1 ? "Putra" : Number(a.gender) === 2 ? "Putri" : "-", a.body_weight ? `, ${a.body_weight} Kg` : "", by ? `, Thn ${by}` : "", (!form.contingent_id && a.contingent?.name) ? `, ${a.contingent.name}` : "", ")"] }, a.id);
                                                        })
                                                    ]
                                                })
                                            ) : (
                                                (0, o.jsxs)("div", {
                                                    className: "p-3.5 bg-green-50/50 rounded-lg border border-green-200 space-y-3",
                                                    children: [
                                                        (0, o.jsxs)("div", {
                                                            children: [
                                                                (0, o.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Nama Atlet Baru *" }),
                                                                (0, o.jsx)("input", {
                                                                    required: !0,
                                                                    type: "text",
                                                                    value: form.name,
                                                                    onChange: e => setForm({ ...form, name: e.target.value }),
                                                                    placeholder: "Nama lengkap atlet",
                                                                    className: "w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
                                                                })
                                                            ]
                                                        }),
                                                        (0, o.jsxs)("div", {
                                                            className: "grid grid-cols-2 gap-2",
                                                            children: [
                                                                (0, o.jsxs)("div", {
                                                                    children: [
                                                                        (0, o.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Jenis Kelamin" }),
                                                                        (0, o.jsxs)("select", {
                                                                            value: form.gender,
                                                                            onChange: e => setForm({ ...form, gender: e.target.value }),
                                                                            className: "w-full border border-gray-300 rounded-lg p-2 text-sm bg-white",
                                                                            children: [
                                                                                (0, o.jsx)("option", { value: 1, children: "Putra" }),
                                                                                (0, o.jsx)("option", { value: 2, children: "Putri" })
                                                                            ]
                                                                        })
                                                                    ]
                                                                }),
                                                                (0, o.jsxs)("div", {
                                                                    children: [
                                                                        (0, o.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Berat Badan (Kg)" }),
                                                                        (0, o.jsx)("input", {
                                                                            type: "number",
                                                                            value: form.body_weight,
                                                                            onChange: e => setForm({ ...form, body_weight: e.target.value }),
                                                                            placeholder: "Contoh: 40",
                                                                            className: "w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
                                                                        })
                                                                    ]
                                                                }),
                                                                (0, o.jsxs)("div", {
                                                                    className: "col-span-2",
                                                                    children: [
                                                                        (0, o.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Tanggal Lahir" }),
                                                                        (0, o.jsx)("input", {
                                                                            type: "date",
                                                                            value: form.date_of_birth,
                                                                            onChange: e => setForm({ ...form, date_of_birth: e.target.value }),
                                                                            className: "w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
                                                                        })
                                                                    ]
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            )
                                        ]
                                    })
                                )
                            ]
                        }),

                        // Modal Footer (Pinned at bottom, NEVER CUT OFF!)
                        (0, o.jsxs)("div", {
                            className: "flex justify-end gap-2 px-6 py-3.5 border-t border-gray-100 bg-gray-50/80 shrink-0",
                            style: { flexShrink: 0 },
                            children: [
                                (0, o.jsx)("button", {
                                    type: "button",
                                    onClick: () => setModalOpen(!1),
                                    className: "px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition text-sm font-medium",
                                    children: "Batal"
                                }),
                                (0, o.jsxs)("button", {
                                    type: "submit",
                                    form: "regosh-modal-form-716",
                                    disabled: loadingAction,
                                    className: `px-5 py-2 text-white rounded-lg cursor-pointer transition text-sm font-semibold shadow-sm flex items-center gap-1.5 ${loadingAction ? 'opacity-70 cursor-not-allowed bg-green-500' : 'bg-green-600 hover:bg-green-700'}`,
                                    children: [
                                        loadingAction && (0, o.jsx)("span", { className: "animate-spin", children: "⏳" }),
                                        modalMode === "edit" ? "Simpan Perubahan" : (isModalTeam ? `Daftarkan Tim (${form.athlete_ids.length} Atlet)` : "Simpan & Daftarkan")
                                    ]
                                })
                            ]
                        })
                    ]
                })
            }),

            // Main Card (Design matching OSH-Event Participant List)
            (0, o.jsxs)("div", {
                className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
                children: [
                    // Card Top Bar Header
                    (0, o.jsxs)("div", {
                        className: "px-5 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-200 bg-white",
                        children: [
                            // Left Title with User Icon
                            (0, o.jsxs)("div", {
                                className: "flex items-center gap-2.5",
                                children: [
                                    (0, o.jsx)("div", {
                                        className: "text-gray-800 flex items-center justify-center",
                                        children: (0, o.jsx)("svg", {
                                            width: "22",
                                            height: "22",
                                            viewBox: "0 0 24 24",
                                            fill: "currentColor",
                                            children: (0, o.jsx)("path", {
                                                d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                                            })
                                        })
                                    }),
                                    (0, o.jsxs)("h3", {
                                        className: "text-gray-800 font-bold text-base md:text-lg tracking-tight",
                                        children: [
                                            tabType === "individual" ? "Participant List" : "Participant List (Team / Beregu)",
                                            s_user?.contingent?.name ? ` - ${s_user.contingent.name}` : ""
                                        ]
                                    })
                                ]
                            }),
                            // Right Action Buttons: Download & + Add Participant
                            (0, o.jsxs)("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    // Download Button
                                    (0, o.jsxs)("button", {
                                        type: "button",
                                        onClick: exportCSV,
                                        className: "cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 text-white rounded text-xs md:text-sm font-semibold shadow-xs transition", style: { backgroundColor: "#36b9cc", color: "#ffffff", padding: "6px 14px", borderRadius: "4px", fontWeight: "600", fontSize: "13px", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" },
                                        children: [
                                            (0, o.jsx)("svg", {
                                                width: "14",
                                                height: "14",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                stroke: "currentColor",
                                                strokeWidth: "2.5",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                children: [
                                                    (0, o.jsx)("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
                                                    (0, o.jsx)("polyline", { points: "7 10 12 15 17 10" }),
                                                    (0, o.jsx)("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
                                                ]
                                            }),
                                            "Download"
                                        ]
                                    }),
                                    // + Add Participant Button
                                    (0, o.jsxs)("button", {
                                        type: "button",
                                        onClick: openAdd,
                                        className: "cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 text-white rounded text-xs md:text-sm font-semibold shadow-xs transition", style: { backgroundColor: "#36b9cc", color: "#ffffff", padding: "6px 14px", borderRadius: "4px", fontWeight: "600", fontSize: "13px", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" },
                                        children: [
                                            (0, o.jsx)("svg", {
                                                width: "14",
                                                height: "14",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                stroke: "currentColor",
                                                strokeWidth: "2.5",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                children: [
                                                    (0, o.jsx)("path", { d: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
                                                    (0, o.jsx)("circle", { cx: "8.5", cy: "7", r: "4" }),
                                                    (0, o.jsx)("line", { x1: "20", y1: "8", x2: "20", y2: "14" }),
                                                    (0, o.jsx)("line", { x1: "23", y1: "11", x2: "17", y2: "11" })
                                                ]
                                            }),
                                            "+ Add Participant"
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),

                    // Filter & Search Controls Bar
                    (0, o.jsxs)("div", {
                        className: "p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between text-xs md:text-sm",
                        children: [
                            // Filters: Type (Individual/Team), Gender, Class
                            (0, o.jsxs)("div", {
                                className: "flex items-center gap-2 flex-wrap",
                                children: [
                                    // Tab Type
                                    (0, o.jsxs)("div", {
                                        className: "inline-flex rounded-md shadow-xs bg-gray-200 p-0.5",
                                        children: [
                                            (0, o.jsx)("button", {
                                                type: "button",
                                                onClick: () => setTabType("individual"),
                                                className: `px-2.5 py-1 text-xs font-medium rounded ${tabType === 'individual' ? 'bg-white text-gray-800 shadow-xs font-semibold' : 'text-gray-600 hover:text-gray-900'}`,
                                                children: "Individual"
                                            }),
                                            (0, o.jsx)("button", {
                                                type: "button",
                                                onClick: () => setTabType("team"),
                                                className: `px-2.5 py-1 text-xs font-medium rounded ${tabType === 'team' ? 'bg-white text-gray-800 shadow-xs font-semibold' : 'text-gray-600 hover:text-gray-900'}`,
                                                children: "Beregu (Team)"
                                            })
                                        ]
                                    }),
                                    // Gender Filter
                                    (0, o.jsxs)("select", {
                                        value: genderFilter,
                                        onChange: e => setGenderFilter(e.target.value),
                                        className: "border border-gray-300 rounded-md py-1.5 px-2.5 bg-white text-gray-700 text-xs focus:outline-none",
                                        children: [
                                            (0, o.jsx)("option", { value: "all", children: "Semua Gender" }),
                                            (0, o.jsx)("option", { value: "1", children: "Putra" }),
                                            (0, o.jsx)("option", { value: "2", children: "Putri" })
                                        ]
                                    }),
                                    // Class Filter
                                    (0, o.jsxs)("select", {
                                        value: catFilter,
                                        onChange: e => setCatFilter(e.target.value),
                                        className: "border border-gray-300 rounded-md py-1.5 px-2.5 bg-white text-gray-700 text-xs focus:outline-none max-w-xs",
                                        children: [
                                            (0, o.jsx)("option", { value: "all", children: "Semua Kelas" }),
                                            cats.map(c => (0, o.jsx)("option", { value: c.id, children: c.category?.name }, c.id))
                                        ]
                                    }),
                                    // Total count
                                    (0, o.jsxs)("span", {
                                        className: "text-xs font-semibold text-gray-500 ml-1",
                                        children: ["Total: ", filteredParticipants.length]
                                    })
                                ]
                            }),
                            // Search box placed on right with search icon at far right corner
                            (0, o.jsxs)("div", {
                                className: "relative flex-1 max-w-md md:max-w-xs",
                                style: { position: "relative", marginLeft: "auto" },
                                children: [
                                    (0, o.jsx)("input", {
                                        type: "text",
                                        value: search,
                                        onChange: e => setSearch(e.target.value),
                                        placeholder: "Cari nama peserta, kontingen, atau kelas...",
                                        style: { paddingLeft: "16px", paddingRight: "42px" },
                                        className: "w-full py-1.5 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#36b9cc]"
                                    }),
                                    (0, o.jsx)("div", {
                                        style: { position: "absolute", top: "50%", right: "14px", left: "auto", transform: "translateY(-50%)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", color: "#9ca3af" },
                                        children: (0, o.jsx)(u.Icon, { icon: "solar:magnifer-linear", width: 16 })
                                    })
                                ]
                            })
                        ]
                    }),

                    // Responsive Table: Exact column order requested by user
                    // Order: 1. No, 2. Nama, 3. Kontingen, 4. Kelas, 5. Jenis Kelamin, 6. Tanggal Lahir, 7. Berat badan, 8. Actions
                    (0, o.jsx)("div", {
                        className: "overflow-x-auto",
                        children: (0, o.jsxs)("table", {
                            className: "w-full text-left border-collapse",
                            children: [
                                (0, o.jsx)("thead", {
                                    style: { color: "#000000" },
                                    children: (0, o.jsxs)("tr", {
                                        className: "bg-[#f8f9fc] text-black text-xs font-bold border-b border-gray-200 uppercase tracking-wider",
                                        style: { color: "#000000" },
                                        children: [
                                            (0, o.jsx)("th", { style: { color: "#000000" }, className: "py-3 px-3 text-center w-12 border-r border-gray-100 font-bold", children: "No" }),
                                            (0, o.jsx)("th", { style: { color: "#000000" }, className: "py-3 px-4 border-r border-gray-100 font-bold", children: "Nama" }),
                                            (0, o.jsx)("th", { style: { color: "#000000" }, className: "py-3 px-4 border-r border-gray-100 font-bold", children: "Kontingen" }),
                                            (0, o.jsx)("th", { style: { color: "#000000" }, className: "py-3 px-4 border-r border-gray-100 font-bold", children: "Kelas" }),
                                            (0, o.jsx)("th", { style: { color: "#000000" }, className: "py-3 px-4 border-r border-gray-100 font-bold", children: "Jenis Kelamin" }),
                                            (0, o.jsx)("th", { style: { color: "#000000" }, className: "py-3 px-4 border-r border-gray-100 font-bold", children: "Tanggal Lahir" }),
                                            (0, o.jsx)("th", { style: { color: "#000000" }, className: "py-3 px-4 border-r border-gray-100 font-bold", children: "Berat badan" }),
                                            (0, o.jsx)("th", { style: { color: "#000000" }, className: "py-3 px-4 text-center font-bold", children: "Actions" })
                                        ]
                                    })
                                }),
                                (0, o.jsx)("tbody", {
                                    className: "divide-y divide-gray-200 bg-white text-xs md:text-sm",
                                    children: filteredParticipants.length === 0 ? (
                                        (0, o.jsx)("tr", {
                                            children: (0, o.jsx)("td", {
                                                colSpan: 8,
                                                className: "py-12 text-center text-gray-400",
                                                children: (0, o.jsxs)("div", {
                                                    className: "flex flex-col items-center justify-center gap-2",
                                                    children: [
                                                        (0, o.jsx)(u.Icon, { icon: "solar:user-cross-linear", width: 38, className: "text-gray-300" }),
                                                        (0, o.jsx)("span", { className: "font-medium text-gray-500", children: "Tidak ada peserta yang sesuai dengan kriteria / filter." }),
                                                        (0, o.jsx)("button", {
                                                            type: "button",
                                                            onClick: openAdd,
                                                            className: "mt-1 text-xs text-[#36b9cc] hover:underline font-semibold",
                                                            children: "+ Klik di sini untuk mendaftarkan peserta baru"
                                                        })
                                                    ]
                                                })
                                            })
                                        })
                                    ) : (
                                        filteredParticipants.map((p, idx) => {
                                            let ath = p.athlete;
                                            let catObj = cats.find(c => c.id === p.category_id);
                                            let catName = catObj?.category?.name || p.category?.category?.name || "-";
                                            let contName = p.event_contingent?.contingent?.name || p.event_contingent?.contingent?.abbreviation || ath?.contingent?.name || "-";
                                            let athName = ath?.name || p.team_name || "-";
                                            let genderText = ath?.gender ? formatGender(ath.gender) : formatGender(catObj?.category?.gender);
                                            let dobText = ath?.date_of_birth ? formatDate(ath.date_of_birth) : "-";
                                            let weightText = ath?.body_weight ? formatWeight(ath.body_weight) : "-";

                                            return (0, o.jsxs)("tr", {
                                                className: "hover:bg-gray-50/80 transition duration-100",
                                                children: [
                                                    // 1. No (#)
                                                    (0, o.jsx)("td", {
                                                        className: "py-3 px-3 text-center text-gray-600 font-medium border-r border-gray-100",
                                                        children: idx + 1
                                                    }),
                                                    // 2. Nama
                                                    (0, o.jsx)("td", {
                                                        className: "py-3 px-4 font-semibold text-gray-800 tracking-wide border-r border-gray-100",
                                                        children: athName
                                                    }),
                                                    // 3. Kontingen
                                                    (0, o.jsx)("td", {
                                                        className: "py-3 px-4 text-gray-700 border-r border-gray-100",
                                                        children: contName
                                                    }),
                                                    // 4. Kelas
                                                    (0, o.jsx)("td", {
                                                        className: "py-3 px-4 text-gray-700 border-r border-gray-100",
                                                        children: catName
                                                    }),
                                                    // 5. Jenis Kelamin
                                                    (0, o.jsx)("td", {
                                                        className: "py-3 px-4 text-gray-700 border-r border-gray-100",
                                                        children: genderText
                                                    }),
                                                    // 6. Tanggal Lahir
                                                    (0, o.jsx)("td", {
                                                        className: "py-3 px-4 text-gray-600 border-r border-gray-100",
                                                        children: dobText
                                                    }),
                                                    // 7. Berat badan
                                                    (0, o.jsx)("td", {
                                                        className: "py-3 px-4 text-gray-600 border-r border-gray-100",
                                                        children: weightText
                                                    }),

                                                    // 9. Actions (Edit amber, delete red)
                                                    (0, o.jsx)("td", {
                                                        className: "py-3 px-4 text-center whitespace-nowrap",
                                                        children: (0, o.jsxs)("div", {
                                                            style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
                                                            className: "flex items-center justify-center gap-2",
                                                            children: [
                                                                (0, o.jsx)("button", {
                                                                    type: "button",
                                                                    onClick: () => openEdit(p),
                                                                    className: "px-2.5 py-1 text-white rounded text-xs font-semibold shadow-xs transition cursor-pointer", style: { backgroundColor: "#f6c23e", color: "#ffffff", padding: "4px 10px", borderRadius: "4px", fontWeight: "600", fontSize: "12px", border: "none", cursor: "pointer", display: "inline-block" },
                                                                    children: "Edit"
                                                                }),
                                                                (0, o.jsx)("button", {
                                                                    type: "button",
                                                                    onClick: (e) => deletePart(e, p.id),
                                                                    className: "px-2.5 py-1 text-white rounded text-xs font-semibold shadow-xs transition cursor-pointer", style: { backgroundColor: "#e74a3b", color: "#ffffff", padding: "4px 10px", borderRadius: "4px", fontWeight: "600", fontSize: "12px", border: "none", cursor: "pointer", display: "inline-block" },
                                                                    children: "Delete"
                                                                })
                                                            ]
                                                        })
                                                    })
                                                ]
                                            }, p.id || idx);
                                        })
                                    )
                                })
                            ]
                        })
                    })
                ]
            })
        ]
    });
};

;
let U=[{key:0,label:"Detail",icon:"solar:info-circle-line-duotone"},{key:3,label:"Register",icon:"solar:clipboard-list-line-duotone"},{key:1,label:"Peserta",icon:"solar:users-group-rounded-line-duotone"},{key:2,label:"Hasil",icon:"solar:ranking-line-duotone"}],Q=(0,g.withWrapSuspense)((0,H.withAuth)(()=>{let e=(0,f.useRouter)(),t=(0,f.useSearchParams)().get("id"),tabParam=(0,f.useSearchParams)().get("tab"),authUser=(0,redux.useSelector)(e=>e?.auth?.user),isContingent=authUser?.access===1||Boolean(authUser?.contingent),[r,n]=(0,c.useState)(isContingent?3:0),[s,a]=(0,c.useState)(null),i=async()=>{if(!t)return;let{status:e,data:r}=await x.eventRepo.getEvent(parseInt(t));e&&a(r.data)};return((0,c.useEffect)(()=>{i()},[]),s)?(0,o.jsx)(m.DashboardLayout,{children:(0,o.jsxs)(d.motion.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3},className:"space-y-6",children:[(0,o.jsxs)("div",{className:"relative w-full flex flex-row gap-4",children:[(0,o.jsx)("button",{onClick:()=>e.back(),className:"cursor-pointer bg-white text-gray-600 rounded p-2 border border-gray-200 hover:bg-green-50 hover:border-green-200 hover:text-green-600",children:(0,o.jsx)(u.Icon,{icon:"solar:alt-arrow-left-line-duotone",width:24})}),(0,o.jsx)("div",{className:"w-full border-b border-gray-200 flex gap-2",children:(isContingent?U.filter(tab=>tab.key!==1):U.filter(tab=>tab.key!==3)).map(e=>(0,o.jsxs)("button",{onClick:()=>n(e.key),className:`
                                cursor-pointer hover:bg-green-100 hover:text-green-600 relative px-4 md:px-8 py-3 gap-2 text-sm font-medium flex items-center transition-colors duration-200 rounded-t-lg
                                ${r===e.key?"text-green-600 bg-green-100":"text-gray-500 hover:text-gray-700"}`,children:[(0,o.jsx)(u.Icon,{icon:e.icon,className:"text-lg"}),e.label," ",1===e.key&&s&&`(${s.count_participants})`,3===e.key&&s&&`(${s.categories?.length||0})`,r===e.key&&(0,o.jsx)(d.motion.div,{layoutId:"active-tab",className:"absolute bottom-0 left-0 right-0 h-[2px] bg-green-500 rounded-full",transition:{type:"spring",stiffness:300,damping:30}})]},e.key))})]}),(0,o.jsx)(h.AnimatePresence,{mode:"wait",children:(0,o.jsx)(d.motion.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},exit:{opacity:0,y:-10},transition:{duration:.25},className:"flex flex-col gap-4",children:0===r?(0,o.jsx)(F,{event:s,refresh:i}):(3===r||1===r)?(0,o.jsx)(RegOSH,{event:s,refresh:i,user:authUser}):2===r?(0,o.jsx)(B,{event:s,refresh:i}):null},r)})]})}):null}));e.s(["default",0,Q],48958)}]);