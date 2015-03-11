function Element(model, position) {
    this.model = model;
    this.position = position;
    this.m = this.getWorldMatrix(position);
}
Element.prototype = Object.create(Graphics.prototype);
Element.prototype.constructor = Element;

Element.prototype.setMatrix = function(m) {
    this.m = m;
};

Element.prototype.update = function(step) {
    this.position.degree -= step || 0;
    this.m = this.getWorldMatrix(this.position);
};
