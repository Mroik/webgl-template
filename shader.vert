attribute vec2 pos;
varying vec2 coord;

void main() {
	coord = pos;
	gl_Position = vec4(pos.x, pos.y, 0, 1.0);
}
