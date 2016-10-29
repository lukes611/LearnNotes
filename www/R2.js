

function R2(x, y)
{
	this.x = x;
	this.y = y;
}

R2.prototype.to_string = function()
{
	return this.x + ' ' + this.y;
};

R2.prototype.from_string = function(s)
{
	var xy = s.split(" ");
	this.x = Number(xyz[0]);
	this.y = Number(xyz[1]);
};

R2.prototype.clone = function()
{
	return new R2(this.x, this.y);
};

R2.prototype.add = function(v2)
{
	this.x += v2.x;
	this.y += v2.y;
};

R2.prototype.round = function()
{
	this.x = Math.round(this.x);
	this.y = Math.round(this.y);
};

R2.prototype.floor = function()
{
	this.x = Math.floor(this.x);
	this.y = Math.floor(this.y);
};

if(typeof module != "undefined")
	module.exports = R2;