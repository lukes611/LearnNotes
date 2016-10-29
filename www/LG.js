
function LG()
{
}
//initialize from an onscreen canvas
LG.prototype.init_onscreen = function(canvasName, wid, hei)
{
	this.name = canvasName;
	this.canvas = document.getElementById(this.name);
	this.context = this.canvas.getContext('2d');
	this.w = wid;
	this.h = hei;
};
//create offscreen canvas
LG.prototype.init_offscreen = function(name, wid, hei)
{
	this.name = name;
	this.w = wid;
	this.h = hei;
	this.canvas = document.createElement('canvas');
	this.canvas.width = this.w;
	this.canvas.height = this.h;
	this.context = this.canvas.getContext('2d');
};
//create offscreen canvas from an image (requires callback)
LG.prototype.init_from_image = function(name, wid, hei, path_to_image, cb)
{
	this.name = name;
	this.canvas = document.createElement('canvas');
	this.context = this.canvas.getContext('2d');
	this.w = wid;
	this.h = hei;
	this.canvas.width = this.w;
	this.canvas.height = this.h;
	var new_im = new Image();
	var me = this;
	new_im.onload = function()
	{
		me.context.drawImage(new_im, 0, 0, me.w, me.h);
		cb();
	};
	new_im.src = path_to_image;
};
//clear the screen
LG.prototype.clear = function(col)
{
	this.context.fillStyle = col;
	this.context.fillRect(0,0,this.w,this.h);
};
//draw a line
LG.prototype.line = function(p1, p2, col)
{
	this.context.beginPath();
	this.context.moveTo(p1.x, p1.y);
	this.context.lineTo(p2.x, p2.y);
	this.context.lineWidth = 1;
	this.context.strokeStyle = col;
	this.context.stroke();
};
//draw a circle
LG.prototype.circle = function(center, radius, col)
{
	this.context.beginPath();
	this.context.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
	this.context.lineWidth = 1;
	this.context.strokeStyle = col;
	this.context.stroke();
};
//draw an LG object
LG.prototype.lg = function(lg,p)
{
	this.context.drawImage(lg.canvas, p.x, p.y);
};

LG.prototype.lgwh = function(lg,p, w, h)
{
	this.context.drawImage(lg.canvas, p.x, p.y, w, h);
};


//draw a polygon
LG.prototype.polygon = function(points_list, col)
{
	var i = 1;
	this.context.beginPath();
	if(points_list.length > 0)
		this.context.moveTo(points_list[0].x, points_list[0].y);
	for(; i < points_list.length; i++)
		this.context.lineTo(points_list[i].x, points_list[i].y);
	this.context.closePath();
	this.context.lineWidth = 1;
	this.context.strokeStyle = col;
	this.context.stroke();
};

//draw a set of triangles, where t_list is a list of R2, and t_list[0+x],t_list[1+x],t_list[2+x] is a triangle
LG.prototype.triangles = function(t_list, col)
{
	var i = 0;
	this.context.beginPath();
	for(; i < t_list.length; i+=3)
	{
		this.context.moveTo(t_list[i].x, t_list[i].y);
		this.context.lineTo(t_list[i+1].x, t_list[i+1].y);
		this.context.lineTo(t_list[i+2].x, t_list[i+2].y);
		this.context.lineTo(t_list[i].x, t_list[i].y);
	}
	this.context.closePath();
	this.context.lineWidth = 1;
	this.context.strokeStyle = col;
	this.context.stroke();
};


//draw a set of quads, where q_list is a list of R2/R3 (only uses x,y), and q_list[0+x],q_list[1+x],q_list[2+x],q_list[3+x] is a quad,
//c_list is a list of colors per quadrant
LG.prototype.quads_with_colors = function(q_list, c_list)
{
	var i = 0, j = 0;
	
	for(; i < q_list.length; i+=4, j++)
	{
		this.context.beginPath();
		this.context.moveTo(q_list[i].x, q_list[i].y);
		this.context.lineTo(q_list[i+1].x, q_list[i+1].y);
		this.context.lineTo(q_list[i+2].x, q_list[i+2].y);
		this.context.lineTo(q_list[i+3].x, q_list[i+3].y);
		this.context.lineTo(q_list[i].x, q_list[i].y);
		this.context.closePath();
		this.context.lineWidth = 1;
		this.context.strokeStyle = c_list[j];
		this.context.stroke();
	}
};


//draw a set of quads, where q_list is a list of R2/R3 (only uses x,y), and q_list[0+x],q_list[1+x],q_list[2+x],q_list[3+x] is a quad,
//c_list is a list of colors per quadrant
LG.prototype.quads_with_colorsf = function(q_list, c_list)
{
	var i = 0, j = 0;
	this.context.strokeStyle = 'black';
		
	for(; i < q_list.length; i+=4, j++)
	{
		this.context.lineWidth = 1;
		this.context.fillStyle = c_list[j];
		this.context.beginPath();
		this.context.moveTo(q_list[i].x, q_list[i].y);
		this.context.lineTo(q_list[i+1].x, q_list[i+1].y);
		this.context.lineTo(q_list[i+2].x, q_list[i+2].y);
		this.context.lineTo(q_list[i+3].x, q_list[i+3].y);
		this.context.closePath();
		this.context.fill();
		this.context.stroke();
		
	}
};

//draw an array of LPoly objects
LG.prototype.LPoly_list = function(list)
{
	var i = 0, j;
	this.lineWidth = 1;
	for(; i < list.length; i++)
	{
		if(list[i].list.length < 2) continue;
		if(list[i].fill_on) this.context.fillStyle = list[i].fill_color;
		if(list[i].stroke_on) this.context.strokeStyle = list[i].stroke_color;
		this.context.beginPath();
		this.context.moveTo(list[i].list[0].x, list[i].list[0].y);
		for(j = 1; j < list[i].list.length; j++) this.context.lineTo(list[i].list[j].x, list[i].list[j].y);
		this.context.lineTo(list[i].list[list[i].list.length-1].x, list[i].list[list[i].list.length-1].y);
		this.context.closePath();
		if(list[i].fill_on) this.context.fill();
		if(list[i].stroke_on) this.context.stroke();
	}
};

//draw a single LPoly object
LG.prototype.LPoly = function(p)
{
	if(p.list.length < 2) return;
	var j;
	this.lineWidth = 1;
	if(p.fill_on) this.context.fillStyle = p.fill_color;
	if(p.stroke_on) this.context.strokeStyle = p.stroke_color;
	this.context.beginPath();
	this.context.moveTo(p.list[0].x, p.list[0].y);
	for(j = 1; j < p.list.length; j++) this.context.lineTo(p.list[j].x, p.list[j].y);
	this.context.lineTo(p.list[0].x, p.list[0].y);
	this.context.closePath();
	if(p.fill_on) this.context.fill();
	if(p.stroke_on) this.context.stroke();
};

//draw a string at given a location p and string s and color c and size of font
LG.prototype.string = function(s, p, c, size)
{
	if(typeof c == 'undefined') c = 'red';
	if(typeof size == 'undefined') size = 25;
	this.context.fillStyle = c;
	this.context.strokeStyle = c;
	this.context.font = 'italic '+size+'pt Calibri';
	this.context.fillText(s, p.x, p.y);
};

