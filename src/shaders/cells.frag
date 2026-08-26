
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColors[16];
uniform float uSeed;
uniform float uGrain;
uniform float uTransition;
uniform float uOctaves;
uniform vec4 uStyleParams; // x: cell scale, y: glow

varying vec2 vUv;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

vec3 getGradientColor(float t) {
    t = clamp(t, 0.0, 1.0);
    float scaled = t * 15.0; 
    int i = int(floor(scaled));
    float f = fract(scaled);
    
    vec3 c1 = vec3(0.0);
    vec3 c2 = vec3(0.0);
    
    if (i == 0) { c1 = uColors[0]; c2 = uColors[1]; }
    else if (i == 1) { c1 = uColors[1]; c2 = uColors[2]; }
    else if (i == 2) { c1 = uColors[2]; c2 = uColors[3]; }
    else if (i == 3) { c1 = uColors[3]; c2 = uColors[4]; }
    else if (i == 4) { c1 = uColors[4]; c2 = uColors[5]; }
    else if (i == 5) { c1 = uColors[5]; c2 = uColors[6]; }
    else if (i == 6) { c1 = uColors[6]; c2 = uColors[7]; }
    else if (i == 7) { c1 = uColors[7]; c2 = uColors[8]; }
    else if (i == 8) { c1 = uColors[8]; c2 = uColors[9]; }
    else if (i == 9) { c1 = uColors[9]; c2 = uColors[10]; }
    else if (i == 10) { c1 = uColors[10]; c2 = uColors[11]; }
    else if (i == 11) { c1 = uColors[11]; c2 = uColors[12]; }
    else if (i == 12) { c1 = uColors[12]; c2 = uColors[13]; }
    else if (i == 13) { c1 = uColors[13]; c2 = uColors[14]; }
    else { c1 = uColors[14]; c2 = uColors[15]; }

    return mix(c1, c2, f);
}

float voronoi(vec2 p, out vec2 nearestCell) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float minDist = 8.0;

    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 offset = vec2(float(x), float(y));
            vec2 cell = i + offset;
            vec2 point = cell + 0.5 + hash2(cell) * 0.4;
            float d = length(point - (i + f));
            if (d < minDist) {
                minDist = d;
                nearestCell = cell;
            }
        }
    }
    return minDist;
}

void main() {
    vec2 st = vUv * 2.0 - 1.0;
    st.x *= uResolution.x / uResolution.y;

    vec2 p = st * uStyleParams.x + vec2(uSeed * 30.0);
    p += vec2(snoise(p * 0.5 + uTime * 0.05) * 0.35);

    vec2 nearestCell;
    float d = voronoi(p, nearestCell);

    float edge = 1.0 - smoothstep(0.0, 0.22, d);
    float cellT = clamp(hash(nearestCell), 0.0, 1.0);
    vec3 col = getGradientColor(cellT);

    col *= 0.6 + 0.5 * edge;
    vec3 edgeColor = mix(uColors[15], vec3(1.0), 0.4);
    col = mix(col, edgeColor, edge * clamp(uStyleParams.y * 0.6, 0.0, 1.0));

    float noiseVal = fract(sin(dot(vUv * uResolution, vec2(12.9898, 78.233))) * 43758.5453);
    col += (noiseVal - 0.5) * uGrain;

    vec3 canvasColor = uColors[0] * 0.5 + vec3(0.5);
    col = mix(col, canvasColor, smoothstep(0.0, 0.8, uTransition));

    gl_FragColor = vec4(col, 1.0);
}
