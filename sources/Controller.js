function Controller() {
    this.canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');

    // this.drawGrid();
    this.initCtxStyle();
    this.addEventListener();

    this.setup();
}

Controller.prototype.setup = function() {
    this.v = {
                degree: 0,
                eye: [0,0,-20,1],
                at: [0,0,0],
                up: [0,1,0]
            };
    this.p = {
            n: 10,
            f: 110,
            fov: 45,
            m: 'perspective'
        };
    this.degree = 0;

    this.model = new Modeller(this.v, this.p);
    this.mapper = new Mapper(this.ctx, this.execute.bind(this));
};

Controller.prototype.execute = function() {
    var w = this.canvas.width/2,
        h = this.canvas.height/2,
        screenM = new Matrix([
                                [w, 0, 0, 0],
                                [0, h, 0, 0],
                                [0, 0, 1, 0],
                                [w, h, 0, 1]
                            ]),
        coords = this.model.transform(this.degree, screenM);

    this.draw(coords);
    this.mapper.mapping(coords, this.model.getModelProperties(), this.degree);
};

Controller.prototype.draw = function(vertice) {
    var ctx = this.ctx;

    for (var i = 0, len = vertice.length-1; i < len; i++) {
        var a = [
                    vertice[i][0],
                    vertice[i][1]
                ],
            b = [
                    vertice[i+1][0],
                    vertice[i+1][1]
                ];

        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
    }
};

Controller.prototype.redraw = function() {
    this.clearCanvas();
    // this.drawGrid();
    this.execute();
};

Controller.prototype.drawGrid = function() {
    var ctx = this.ctx,
        step = 10;

    ctx.save();

    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#ccc';

    for (var i = step + 0.5; i < ctx.canvas.width; i += step ) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, ctx.canvas.height);
        ctx.stroke();
    }

    for (var i = step + 0.5; i < ctx.canvas.height; i += step) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(ctx.canvas.width, i);
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(0,150);//x,y
    ctx.lineTo(600,150);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(300,0);
    ctx.lineTo(300,300);
    ctx.stroke();

    ctx.restore();
};

Controller.prototype.addEventListener = function() {
    document.getElementById('btn').addEventListener('click', this.rotate.bind(this));
};

Controller.prototype.rotate = function(e) {
    var target = e.target,
        content = target.textContent,
        step = 360/50,
        self = this;

    if (content === 'ROTATE') {
        target.textContent = 'STOP';

        this.interval = window.setInterval(function(){
            self.degree += step;
            self.redraw();
        },100)
    } else {
        target.textContent = 'ROTATE';
        window.clearInterval(this.interval);
    }
};

Controller.prototype.clearCanvas = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Controller.prototype.initCtxStyle = function() {
    this.ctx.strokeStyle = '#0000ff';
    this.ctx.save();
};