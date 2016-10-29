
function MTheory(cb)
{
	var me = this;
	var w = 100;
	var h = 200;
	this.treble_cleff = new LG();
	this.bass_cleff = new LG();
	this.treble_cleff.init_from_image('treble cleff', w, h, 'tc.gif', function()
	{
		me.bass_cleff.init_from_image('bass cleff', w, h, 'bc.gif', cb);
	});
	
}

MTheory.prototype.oval = function(p, rx, ry, stroke_color, fill_color)
{
	var N = 10;
	var rv = new LPoly(fill_color, stroke_color);
	var scalar = 180 / Math.PI;
	for(var i = 0; i < 360; i+=N)
	{
		var np = new R2(Math.round(rx * Math.cos(i / scalar)), Math.round(ry * Math.sin(i / scalar)));
		np.add(p);
		rv.add(np);
	}
	return rv;
};

MTheory.prototype.rect = function(p, width, height, stroke_color, fill_color)
{
	var rv = new LPoly(fill_color, stroke_color);
	rv.add(new R2(p.x, p.y));
	rv.add(new R2(p.x, p.y+height));
	rv.add(new R2(p.x+width, p.y+height));
	rv.add(new R2(p.x+width, p.y));
	return rv;
};

MTheory.prototype.lines = function(p, size, steps)
{
	steps *= 0.62;
	var rv = [];
	var h = size * 0.15;
	var spacing = h * 5;
	var w = size * steps * 2;
	for(var i = 0; i < 5; i++)
	{
		rv.push(this.rect(new R2(p.x, p.y + i * spacing), w, h, undefined, 'black'));
	}
	return rv;
};

//returns a list of lpolys representing a node at location x with size param size : type specifies if stem 
//is drawn down or up
MTheory.prototype.note = function(p, size, type, line_on, color)
{
	color = (typeof color == 'undefined')? 'black' : color;
	line_on = (typeof line_on == 'undefined')? false : line_on;
	var rv = [];
	var note_width = size * 0.3;
	var note_height = size * 0.25;
	var rect_height = 1.5 * size;
	var rect_width = 0.1 * size;
	rv.push(this.oval(p, note_width, note_height, undefined, color));
	var np = p.clone();
	
	
	if(typeof type == 'undefined' || type == 0)
	{
		np.add(new R2(size * 0.18, -0.1 * size - rect_height));
		rv.push(this.rect(np, rect_width, rect_height, undefined, color));
	
	}
	else
	{
		np.add(new R2(-size * 0.28, 0.1 * size));
		rv.push(this.rect(np, rect_width, rect_height, undefined, color));
	}
	if(line_on)
	{
		var np = p.clone();
		np.x -= 1.5 * note_width;
		np.y -= 0.3 * note_height;
		rv.push(this.rect(np, note_width * 3, note_height * 0.3, undefined, color));
	}
	return rv;
};

// 0 treble, 1 bass
MTheory.prototype.note_names = function(type)
{
	if(type == 0) return 'a g f e d c b a g f e d c'.split(' ');
	return 'c b a g f e d c b a g f e'.split(' ');
};

MTheory.prototype.note_for_notes = function(p, index, step, size, color)
{
	var np = p.clone();
	np.y += 0;
	var xs = size * 1.0;
	var ys = size * 0.4;
	
	np.y += ys * (index-2);
	if(index >= 8) np.y -= ys * 0.3;
	np.x += xs * step;
	return this.note(np, size * 0.9, index <= 6, index == 0 || index == 12, color);
};



//type: 0 treble, 1 : bass

MTheory.prototype.notes = function(g, p, type, size, notes, tf)
{
	if(typeof tf == 'undefined') tf = [];
	var si = {w : size * 2, h : size * 4};
	if(type == 0)
	{
		
		g.lgwh(this.treble_cleff, p.clone(), si.w, si.h);
	}else
	{
		si.h *= 0.8;
		g.lgwh(this.bass_cleff, p.clone(), si.w, si.h);
	}
	
	g.LPoly_list(this.lines(p.clone(), size, notes.length + 1));
	var me = this;
	notes.forEach(function(n, i)
	{
		if(typeof n == 'undefined') return;
		var col = (i < tf.length) ? ((tf[i])?'green':'red') : 'black';
		g.LPoly_list(me.note_for_notes(p.clone(), n, i+3, size, col));
	});
};

function lg_fader(g)
{
	this.g = g;
	this.re = function(count, speed, f, cb)
	{
		var i = 0;
		setTimeout(function r()
		{
			f(i);
			i++;
			if(i < count) setTimeout(r, speed);
			else cb();
		}, speed);
	};
	this.fadeOut = function(cb)
	{
		var g = this.g;
		this.re(40, 1/30, function(i)
		{
			g.clear('rgba(255,255,255,' + (i/40) + ')');
		}, cb);
	};
	
}