/**
 * [Vector description]
 * @param
 * [x, y, z]
 */
function Vector(element) {
    this.vector = element;
}

Vector.prototype.div = function(k) {
    return new Vector([this.vector[0]/k, this.vector[1]/k, this.vector[2]/k]);
};

Vector.prototype.sub = function(el) {
    if (el.get) {
        el = el.get();
    }
    return new Vector([this.vector[0]-el[0], this.vector[1]-el[1], this.vector[2]-el[2]]);
};

Vector.prototype.add = function(el) {
    if (el.get) {
        el = el.get();
    }

    if (this.vector.length === 1) {
        this.vector = this.vector[0];
    }

    return new Vector([this.vector[0]+el[0], this.vector[1]+el[1], this.vector[2]+el[2]]);
};

Vector.prototype.norm = function() {
    return this.div(this.len());
};

Vector.prototype.len = function() {
    var x = this.vector[0],
        y = this.vector[1],
        z = this.vector[2];
    return Math.sqrt(x*x + y*y + z*z);
};

Vector.prototype.get = function() {
    return this.vector;
};

Vector.prototype.cross = function(el) {
    if (el.get) {
        el = el.get();
    }

    var v = this.vector;

    var x = v[1]*el[2] - v[2]*el[1],
        y = -(v[0]*el[2] - v[2]*el[0]),
        z = v[0]*el[1] - v[1]*el[0];

    return new Vector([x, y, z]);
};

Vector.prototype.dot = function(el) {
    if (el.get) {
        el = el.get();
    }

    return this.vector[0] * el[0] + this.vector[1] * el[1] + this.vector[2] * el[2];
};

Vector.prototype.scale = function(r) {
    return new Vector([this.vector[0] * r, this.vector[1] * r, this.vector[2] * r]);

}