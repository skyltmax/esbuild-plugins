var Y=Object.create;var y=Object.defineProperty;var B=Object.getOwnPropertyDescriptor;var W=Object.getOwnPropertyNames;var z=Object.getPrototypeOf,H=Object.prototype.hasOwnProperty;var j=e=>y(e,"__esModule",{value:!0});var I=(e,o)=>{j(e);for(var t in o)y(e,t,{get:o[t],enumerable:!0})},q=(e,o,t)=>{if(o&&typeof o=="object"||typeof o=="function")for(let n of W(o))!H.call(e,n)&&n!=="default"&&y(e,n,{get:()=>o[n],enumerable:!(t=B(o,n))||t.enumerable});return e},a=e=>q(j(y(e!=null?Y(z(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);I(exports,{default:()=>ie,liveReloadPlugin:()=>O,postCssPlugin:()=>S,tslintPlugin:()=>_,yamlPlugin:()=>w});var k=a(require("fs-extra")),v=a(require("path")),R=a(require("js-yaml")),G=({loadOptions:e}={})=>({name:"yaml",setup(o){o.onResolve({filter:/\.(yml|yaml)$/},t=>{if(t.resolveDir==="")return;let n=v.default.isAbsolute(t.path)?t.path:v.default.join(t.resolveDir,t.path);return{path:n,namespace:"yaml",watchFiles:[n]}}),o.onLoad({filter:/.*/,namespace:"yaml"},async t=>{let n=await k.default.readFile(t.path),s=R.default.load(new TextDecoder().decode(n),e);return{contents:JSON.stringify(s),loader:"json"}})}}),w=G;var E=a(require("postcss")),F=a(require("glob")),P=a(require("path")),$=a(require("fs-extra")),K=({plugins:e}={})=>({name:"postcss",setup:function(o){o.onResolve({filter:/.\.(css)$/,namespace:"file"},t=>{if(t.resolveDir==="")return;let n=P.default.isAbsolute(t.path)?t.path:P.default.join(t.resolveDir,t.path),s=F.default.sync(`${t.resolveDir}/**/*.css`);return{path:n,namespace:"postcss",watchFiles:s}}),o.onLoad({filter:/.*/,namespace:"postcss"},async t=>{let n=await $.default.readFile(t.path);return{contents:(await(0,E.default)(e).process(n,{from:t.path})).css,loader:"css"}})}}),S=K;var J=a(require("http"));var A='(()=>{var r=window.__esbuildLiveReloadPort||3035,l=new EventSource(`http://localhost:${r}/esbuild`);l.onmessage=s=>{let e=JSON.parse(s.data);if(e.success)console.log("esbuild rebuilt, reloading"),location.reload();else if(console.error("esbuild build failed:"),e.errors)for(let o of e.errors)console.error(o.text)};})();\n';var U=({port:e}={})=>({name:"liveReload",setup(o){let t=o.initialOptions,n=t.watch,s=[];if(e=e||3035,n){let p={js:`;window.__esbuildLiveReloadPort = ${e};`+A};(0,J.createServer)((r,i)=>{if(r.url==="/esbuild"){s.push(i.writeHead(200,{"Access-Control-Allow-Origin":"*","Content-Type":"text/event-stream","Cache-Control":"no-cache",Connection:"keep-alive"}));return}}).listen(e),console.info(`LiveReload server listening on :${e}`),t.banner=p,t.watch={onRebuild(r,i){let u=r==null?void 0:r.errors[0],f={success:!u,errors:r==null?void 0:r.errors};s.forEach(h=>h.write(`data: ${JSON.stringify(f)}

`)),u||(s.length=0)}}}}}),O=U;var N=a(require("fs")),l=a(require("path")),M=a(require("child_process"));var D=!!process.stdout.isTTY,V=!!process.stderr.isTTY,m={width:60,height:20,clear(){},banner(e){return e||(e="-"),e.repeat(Math.floor((m.width-1)/e.length))}};if(D||V){let e=D&&process.stdout||process.stderr,o=()=>{m.width=e.columns,m.height=e.rows};e.on("resize",o),o(),m.clear=()=>{e.write("c")}}function X(e,o){let t=0;if(o===!0){let n=process.env.TERM||"";t=n&&["xterm","screen","vt100"].some(s=>n.indexOf(s)!=-1)?n.indexOf("256color")!=-1?8:4:2}else o!==!1&&e.isTTY&&(t=e.getColorDepth());return t}function L(e,o){return Z(X(e,o),o)}function Z(e,o){let t=c=>`[${c}m`,n=e>0||o?(c,p)=>{let r=t(c),i=t(p);return u=>r+u+i}:c=>p=>p,s=e>=8?(c,p,r)=>{let i="["+p+"m",u="["+r+"m";return f=>i+f+u}:e>0?(c,p,r)=>{let i="["+c+"m",u="["+r+"m";return f=>i+f+u}:(c,p,r)=>i=>i;return{_hint:o,ncolors:e,reset:o||e>0?"e[0m":"",bold:n("1","22"),italic:n("3","23"),underline:n("4","24"),inverse:n("7","27"),white:s("37","38;2;255;255;255","39"),grey:s("90","38;5;244","39"),black:s("30","38;5;16","39"),blue:s("34","38;5;75","39"),cyan:s("36","38;5;87","39"),green:s("32","38;5;84","39"),magenta:s("35","38;5;213","39"),purple:s("35","38;5;141","39"),pink:s("35","38;5;211","39"),red:s("31","38;2;255;110;80","39"),yellow:s("33","38;5;227","39"),lightyellow:s("93","38;5;229","39"),orange:s("33","38;5;215","39")}}var T=L(process.stdout),he=L(process.stderr);function ee(e,o){let t=o||process.cwd();if(e.entryPoints&&Object.keys(e.entryPoints).length>0){let n="";if(Array.isArray(e.entryPoints))n=e.entryPoints[0];else for(let s of Object.keys(e.entryPoints)){n=e.entryPoints[s];break}t=l.resolve(t,l.dirname(n))}return t}function*te(e,o){e=l.resolve(e);let t=l.parse(e).root;for(o=o?l.resolve(o):t;yield l.join(e,"tsconfig.json"),!(e==o||(e=l.dirname(e),e==t)););}function oe(e,o){for(let t of te(e,o))try{if((0,N.statSync)(t).isFile())return t}catch{}return null}function ne(e){let o="",t=process.cwd(),n="tsc";e&&process.chdir(e);try{o=require.resolve("typescript")}catch{}if(e&&process.chdir(t),o){let s=l.sep+"node_modules"+l.sep,c=o.indexOf(s);if(c!=-1)return l.join(o.substr(0,c+s.length-l.sep.length),".bin",n)}return n}function se(e){return!!e}var re=({cwd:e}={})=>({name:"tslint",setup(o){let t=o.initialOptions,n=ee(t,e),s=oe(n,e),c=ne(e);if(!c)throw new Error("Typescript compiler not found");let p=["--noEmit","--pretty",s&&"--project",s].filter(se),r=[],i,u=null,f,h;o.onStart(()=>{f&&f(),i=new Promise((b,le)=>{let d=(0,M.spawn)(c,p,{stdio:["inherit","pipe","inherit"],cwd:e});r.length=0,d.stdout.setEncoding("utf8"),d.stdout.on("data",function(g){r.push(g)});let x=()=>{try{d.kill()}catch{}};process.on("exit",x);let C=g=>{u=g,process.removeListener("exit",x),console.log(m.banner("\u2014")),console.log(g===0?T.green("TS: OK"):T.red(`TS: code ${g}`)),console.log(m.banner("\u2014")),console.log(r.join("")),b()};d.on("close",C),f=()=>{process.off("exit",x),d.off("close",C),d.kill()}})}),o.onEnd(b=>(i==null||i.then(()=>{h&&clearTimeout(h),u!==0&&b.errors.push({pluginName:"tslint",text:r.join(""),location:null,notes:[],detail:null})}),t.watch||(h=setTimeout(()=>console.log("Waiting for TypeScript... (^C to skip)"),1e3)),i))}}),_=re;var ie={yamlPlugin:w,postCssPlugin:S,liveReloadPlugin:O,tslintPlugin:_};0&&(module.exports={liveReloadPlugin,postCssPlugin,tslintPlugin,yamlPlugin});
