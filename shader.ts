let gl: WebGLRenderingContext;
let vertexShader: string;
let fragmentShader: string;
window.onload = (_: any) => {
	let canv = document.getElementById("canvas") as HTMLCanvasElement;
	canv.width = window.innerWidth;
	canv.height = window.innerHeight;
	gl = canv.getContext("webgl") as WebGLRenderingContext;
	vertexShader = httpGet("shader.vert");
	fragmentShader = httpGet("shader.frag");
	main(gl);
};

let prepareCanvas = () => {
	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);
};

function httpGet(url: string) {
	let req = new XMLHttpRequest();
	req.open("GET", url, false);
	req.send(null);
	return req.responseText;
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
	let shader = gl.createShader(type) as WebGLShader;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) {
		return shader;
	}
	console.error(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
	return null;
}

function createProgram(gl: WebGLRenderingContext, vertexShader: string, fragmentShader: string) {
	var program = gl.createProgram() as WebGLProgram;
	let vert = createShader(gl, gl.VERTEX_SHADER, vertexShader) as WebGLShader;
	let frag = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader) as WebGLShader;
	gl.attachShader(program, vert);
	gl.attachShader(program, frag);
	gl.linkProgram(program);
	var success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) {
		return program;
	}
	gl.deleteProgram(program);
	return null;
}

function main(gl: WebGLRenderingContext) {
	let program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram;

	let trigVertBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, trigVertBuffer);
	let posAttribute = gl.getAttribLocation(program, "pos");
	// 4th is just (2nd param * sizeof(type))
	// 2nd param is number of items per object (vec2 is 2, vec3 is 3)
	gl.vertexAttribPointer(posAttribute, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(posAttribute);

	let draw = () => {
		prepareCanvas();
		let positions = [
			// 1st triangle
			-1, -1,
			-1, 1,
			1, 1,
			// 2nd triangle
			1, -1,
			-1, -1,
			1, 1,
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
		gl.useProgram(program);
		gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);
	}
	draw();
	setInterval(draw, 1000);
}
