precision mediump float;
varying vec2 coord;

void main() {
	gl_FragColor = vec4(coord.x, coord.y, coord.x * coord.y, 1);
}
