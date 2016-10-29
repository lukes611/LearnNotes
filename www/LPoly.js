
///a polygon class which uses either R3 or R2 objects
function LPoly(fill_color, stroke_color, list_in, list_in_clone)
{
	this.list = [];
	var i;
	if(typeof list_in != 'undefined')
		this.list.push.apply(this.list, list_in);
	if(typeof list_in_clone != 'undefined')
		for(i = 0; i < list_in_clone.length; i++) this.clone_add(list_in_clone[i]);
	this.fill_on = false;
	this.stroke_on = false;
	if(typeof fill_color != 'undefined')
	{
		this.fill_color = fill_color;
		this.fill_on = true;
	}
	if(typeof stroke_color != 'undefined')
	{
		this.stroke_color = stroke_color;
		this.stroke_on = true;
	}
	
}

//returns a deep copy of this Polygon
LPoly.prototype.clone = function()
{
	var rv = new LPoly();
	if(this.stroke_on)
	{
		rv.stroke_on = true;
		rv.stroke_color = this.stroke_color+'';
	}
	if(this.fill_on)
	{
		rv.fill_on = true;
		rv.fill_color = this.fill_color+'';
	}
	var i;
	for(i = 0; i < this.list.length; i++) rv.clone_add(this.list[i]);
	return rv;
};

//perform a clone but change the colors
LPoly.prototype.clone_change_colors = function(stroke_color, fill_color)
{
	var rv = new LPoly();
	if(typeof stroke_color != 'undefined')
	{
		rv.stroke_on = true;
		rv.stroke_color = stroke_color;
	}else if(this.stroke_on)
	{
		rv.stroke_on = true;
		rv.stroke_color = this.stroke_color+'';
	}
	if(typeof fill_color != 'undefined')
	{
		rv.fill_on = true;
		rv.fill_color = fill_color;
	}else if(this.fill_on)
	{
		rv.fill_on = true;
		rv.fill_color = this.fill_color+'';
	}
	var i;
	for(i = 0; i < this.list.length; i++) rv.clone_add(this.list[i]);
	return rv;
};

//adds an R3 point to this polygon
LPoly.prototype.add = function(p)
{
	this.list.push(p);
};

//adds a deep copy of an R3 point to this polygon
LPoly.prototype.clone_add = function(p)
{
	this.list.push(p.clone());
};

//adds rounded a deep copy of an R3 point to this polygon
LPoly.prototype.clone_add_round = function(p)
{
	var p_ = p.clone();
	p_.round();
	this.list.push(p_);
};

//perform an isometrix transform on this polygon
LPoly.prototype.iso = function()
{
	var m = new LM(4,4);
	m.init_iso_R3();
	this.multiply_R3(m);
};

//multiplies this polygon by an R3 LM matrix
LPoly.prototype.multiply_R3 = function(m)
{
	var i = 0;
	for(; i < this.list.length; i++) m.multiply_R3(this.list[i]);
};

//multiplies this matrix by an R2 LM matrix
LPoly.prototype.multiply_R2 = function(m)
{
	var i = 0;
	for(; i < this.list.length; i++) m.multiply_R2(this.list[i]);
};

