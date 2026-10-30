var e=e=>e<.5?2*e*e:1-(-2*e+2)**2/2,t=e=>e>=1?1:1-2**(-10*e),n=()=>new Promise(e=>requestAnimationFrame(e));async function r(r,i){let a=r.getContext(`webgl`,{alpha:!1,antialias:!1,depth:!1,stencil:!1,powerPreference:`low-power`,failIfMajorPerformanceCaveat:!0,preserveDrawingBuffer:!1});if(!a)return null;let o=!1,s=0,c=!1,l=a.getExtension(`WEBGL_lose_context`),u=(e,t)=>{let n=a.createShader(e);return a.shaderSource(n,t),a.compileShader(n),n},d=a.createProgram(),f=u(a.VERTEX_SHADER,`attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`),p=u(a.FRAGMENT_SHADER,`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uC0,uN0,uR0,uC1,uN1,uR1;
uniform vec4 uK0,uK1;
uniform vec2 uE0,uE1,uCov0,uCov1,uLight,uRes;
uniform float uMix,uZoom,uGain,uDpr;
vec3 shade(sampler2D C,sampler2D N,sampler2D R,vec4 k,vec2 e,vec2 cov,float zoom){
  vec2 px=floor(gl_FragCoord.xy)+.5;
  vec2 vUv=px/uRes;
  vec2 uv=(vUv-.5)*cov/zoom+.5;
  vec2 t=vec2(uv.x,1.-uv.y);
  vec3 base=texture2D(C,t).rgb;
  vec3 nm=texture2D(N,t).rgb*2.-1.;
  float r=clamp(texture2D(R,t).r*k.y,.05,1.);
  vec2 nxy=nm.xy*k.x;
  float shadeK=1.;
  if(k.z>.5){
    float half_=floor(.5*uRes.x);
    float gx=px.x-half_;
    float gw=1.5*uDpr;
    if(k.z>1.5){
      float m=min(uRes.x*.5,uRes.y);
      vec2 dc=vec2(px.x<half_?half_*.5:half_*1.5,.5*uRes.y);
      vec2 c=px-dc;
      vec2 b=vec2(half_*.5,.5*uRes.y)-vec2(m*.1);
      vec2 q=abs(c)-b;
      float d=length(max(q,0.))+min(max(q.x,q.y),0.);
      float w=m*.016;
      vec2 g=max(q.x,q.y)>0.?normalize(max(q,vec2(1e-4))):(q.x>q.y?vec2(1.,0.):vec2(0.,1.));
      g*=sign(c);
      float s=d/w;
      nxy=d<-w?nxy:vec2(0.);
      if(abs(s)<1.){nxy+=g*(s>0.?-1.:1.)*.8;shadeK=.9;}
    }
    if(abs(gx)<gw)shadeK=.28;
    else if(abs(gx)<gw*2.5)nxy.x+=sign(gx)*.5;
  }
  vec3 n=normalize(vec3(nxy,1.));
  vec2 a=vec2(uRes.x/uRes.y,.55);
  vec3 l=normalize(vec3((uLight-vUv)*a,.55));
  vec3 h=normalize(l+vec3(0.,0.,1.));
  float diff=max(dot(n,l),0.);
  float spec=pow(max(dot(n,h),0.),mix(60.,6.,r))*(1.-r)*.26*uGain;
  vec3 col=(base*(e.x+.22*diff)+spec*e.y)*shadeK;
  if(k.w>.5&&px.y<3.*uDpr)col=vec3(.082);
  return col;
}
void main(){
  vec3 a=shade(uC0,uN0,uR0,uK0,uE0,uCov0,1.);
  vec3 b=uMix>0.?shade(uC1,uN1,uR1,uK1,uE1,uCov1,uZoom):a;
  gl_FragColor=vec4(mix(a,b,uMix),1.);
}`);a.attachShader(d,f),a.attachShader(d,p),a.linkProgram(d);let m=a.getExtension(`KHR_parallel_shader_compile`);if(m)for(let e=0;e<600&&!a.getProgramParameter(d,m.COMPLETION_STATUS_KHR);e++)await n();if(!a.getProgramParameter(d,a.LINK_STATUS))return console.warn(a.getShaderInfoLog(p)||a.getProgramInfoLog(d)),l?.loseContext(),null;a.deleteShader(f),a.deleteShader(p),a.useProgram(d);let h=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,h),a.bufferData(a.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),a.STATIC_DRAW);let g=a.getAttribLocation(d,`p`);a.enableVertexAttribArray(g),a.vertexAttribPointer(g,2,a.FLOAT,!1,0,0);let _=e=>a.getUniformLocation(d,e),v={k0:_(`uK0`),k1:_(`uK1`),e0:_(`uE0`),e1:_(`uE1`),cov0:_(`uCov0`),cov1:_(`uCov1`),light:_(`uLight`),res:_(`uRes`),mix:_(`uMix`),zoom:_(`uZoom`),gain:_(`uGain`),dpr:_(`uDpr`)};[`uC0`,`uN0`,`uR0`,`uC1`,`uN1`,`uR1`].forEach((e,t)=>a.uniform1i(_(e),t));let y=1,b=()=>{y=Math.min(devicePixelRatio||1,1.5);let e=Math.max(1,Math.round(r.clientWidth*y)),t=Math.max(1,Math.round(r.clientHeight*y));(r.width!==e||r.height!==t)&&(r.width=e,r.height=t,a.viewport(0,0,e,t)),H()},x=new ResizeObserver(b),S=async e=>createImageBitmap(await(await fetch(e)).blob()),C=e=>{let t=a.createTexture();return a.bindTexture(a.TEXTURE_2D,t),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,a.RGBA,a.UNSIGNED_BYTE,e),e.close(),t},w=new Set,T=e=>{let t=i.mats[e];t&&!w.has(e)&&(w.add(e),[t.normal,t.rough].forEach(e=>fetch(e).catch(()=>{})))},E=async(e,t)=>{let r=i.mats[e],a=await Promise.all([S(t),S(r.normal),S(r.rough)]),s=[];for(let e of a)await n(),o?e.close():s.push(C(e));return{id:e,t:s,k:r.k,e:r.e,size:r.size}},D=e=>e?.t.forEach(e=>a.deleteTexture(e)),O=e=>{let t=r.width/r.height,n=e.size[0]/e.size[1];return t>n?[1,n/t]:[t/n,1]},k=null,A=null,j=-1,M=null,N=!1,P={x:.72,y:.7},F={x:P.x,y:P.y},I={x:P.x,y:P.y},L=-1,R=(e,t)=>e.t.forEach((e,n)=>(a.activeTexture(a.TEXTURE0+t+n),a.bindTexture(a.TEXTURE_2D,e))),z=n=>{if(!k)return;let o=0,s=1;if(A&&j>=0){let r=(n-j)/1e3;o=e(Math.min(1,r/i.dur.swap)),s=1.06-.06*t(Math.min(1,r/i.dur.wipe)),r>=i.dur.wipe&&(D(k),k=A,A=null,j=-1,o=0,s=1,U())}if(L>=0){let t=(n-L)/1e3/i.dur.draw;t>=1?L=-1:(I.x=-.25+1.5*e(t),I.y=.62)}F.x+=(I.x-F.x)*.08,F.y+=(I.y-F.y)*.08,R(k,0),R(A??k,3),a.uniform4fv(v.k0,k.k),a.uniform4fv(v.k1,(A??k).k),a.uniform2fv(v.e0,k.e),a.uniform2fv(v.e1,(A??k).e),a.uniform2fv(v.cov0,O(k)),a.uniform2fv(v.cov1,O(A??k)),a.uniform2f(v.light,F.x,F.y),a.uniform2f(v.res,r.width,r.height),a.uniform1f(v.mix,o),a.uniform1f(v.zoom,s),a.uniform1f(v.gain,1),a.uniform1f(v.dpr,y),a.drawArrays(a.TRIANGLE_STRIP,0,4)},B=()=>j>=0||L>=0||Math.abs(I.x-F.x)>8e-4||Math.abs(I.y-F.y)>8e-4,V=e=>{s=0,!(o||c)&&(z(e),B()&&(s=requestAnimationFrame(V)))};function H(){s||o||c||(s=requestAnimationFrame(V))}function U(){if(!M||N||A||o)return;let e=M;M=null,!(k&&e.id===k.id)&&(N=!0,E(e.id,e.color).then(e=>{if(N=!1,o)return D(e);if(M&&M.id!==e.id)return D(e),U();A=e,j=performance.now(),H()}).catch(()=>{N=!1,i.onLost()}))}let W=e=>{e.preventDefault(),o||i.onLost()};r.addEventListener(`webglcontextlost`,W);let G={show(e,t){M={id:e,color:t},U()},light(e,t){L>=0||(I.x=Math.max(-.3,Math.min(1.3,e)),I.y=Math.max(-.3,Math.min(1.3,t)),H())},rest(){I.x=P.x,I.y=P.y,H()},pass(){L=performance.now(),H()},prefetch:T,pause(e){c=e,e&&s?(cancelAnimationFrame(s),s=0):e||H()},destroy(){o||(o=!0,cancelAnimationFrame(s),x.disconnect(),r.removeEventListener(`webglcontextlost`,W),D(k),D(A),k=A=null,a.deleteProgram(d),a.deleteBuffer(h),l?.loseContext())}};try{k=await E(i.first,i.color)}catch{return G.destroy(),null}if(o)return null;if(x.observe(r),b(),cancelAnimationFrame(s),s=0,!await new Promise(e=>{let t=0,n=0,i=0,a=0,s=c=>{if(o)return e(!1);if(t===0?n=c:c-i>50&&a++,i=c,I.x=.2+t/89*.6,I.y=.6,z(c),++t<90)return void requestAnimationFrame(s);let l=(c-n)/89;r.dataset.probe=`${l.toFixed(1)} мс, медленных ${a}`,e(l<=20&&a<=3)};requestAnimationFrame(s)})||o)return G.destroy(),null;for(let e=i.cur();k&&e!==k.id;e=i.cur()){let t;try{t=await E(e,i.colorOf(e))}catch{return G.destroy(),null}if(o)return D(t),null;D(k),k=t}return I.x=P.x,I.y=P.y,H(),G}export{r as startGl};