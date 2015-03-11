var unit = 5;

function Modeller(v, p){
    this.updateView(v);
    this.updateProjection(p);

    this.originalModel.forEach(function(vertax){
        vertax.push(0,1);
    });

    this.setDomain();
    this.init();
}

Modeller.prototype = Object.create(Graphics.prototype);
Modeller.prototype.constructor = Modeller;

Modeller.prototype.originalModel = [
    [-unit,-unit], [-unit,unit], [unit,unit], [unit,-unit], [-unit,-unit]
];

Modeller.prototype.init = function() {
    this.model = new Element(this.originalModel, {x:0, y:0, z:0, degree:0});
};

Modeller.prototype.updateView = function(v) {
    this.v = v ? this.getViewingMatrix(v) : this.v;
};

Modeller.prototype.updateProjection = function(p) {
    this.p = p ? this.getProjectionMatrix(p) : this.p;
};

Modeller.prototype.transform = function(degree, screenM) {
    var self = this,
        rotateM = this.getYRotationMatrix(degree),
        mv = this.model.m.x(rotateM).x(this.v),
        mvp = mv.x(this.p),
        mvps = mvp.x(screenM),
        calculated = [];

    this.mv = mv;
    this.mvp = mvp;
    this.mvps = mvps; // ?

    this.model.model.forEach(function(vertax){
        var coords = new Matrix([vertax]).x(mvps).project();
        calculated.push([coords[0], coords[1]]);
    });

    return calculated;
};

Modeller.prototype.getModelProperties = function() {
    return {
        mv: this.mv,
        mvp: this.mvp,
        mvps: this.mvps,
        model: this.originalModel,
        domain: this.domain
    }
};

Modeller.prototype.setDomain = function() {
    var minx = Infinity,
        miny = Infinity,
        maxx = -Infinity,
        maxy = -Infinity;

    this.originalModel.forEach(function(itm, i) {
        minx = Math.min(minx, itm[0]);
        miny = Math.min(miny, itm[1]);
        maxx = Math.max(maxx, itm[0]);
        maxy = Math.max(maxy, itm[1]);
    });

    this.domain = {minx: minx, miny: miny, maxx: maxx, maxy: maxy};
};