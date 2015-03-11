function Graphics() {}

Graphics.prototype.getWorldMatrix = function(m) {
    var t = this.getTranslateMatrix(m.x, m.y, m.z),
        r = this.getYRotationMatrix(m.degree || 0);
    return t.x(r);
};

Graphics.prototype.getViewingMatrix = function(v) {
    var cam = this.getCam(v),
        eye = cam.eye,
        u = cam.u,
        v = cam.v,
        n = cam.n,
        T = this.getTranslateMatrix(-eye[0], -eye[1], -eye[2]),
        R = [
                [u[0], v[0], n[0], 0],
                [u[1], v[1], n[1], 0],
                [u[2], v[2], n[2], 0],
                [0, 0, 0, 1]
            ];

    return T.x(R);
};

Graphics.prototype.getCam = function(v) {
    var eye = new Matrix([v.eye]).x(this.getYRotationMatrix(v.degree)).get()[0],
        at = v.at,
        up = v.up,
        n = new Vector(eye).sub(at).norm(),
        u = new Vector(up).cross(n).norm(),
        v = n.cross(u);

    return {
        eye: eye,
        n: n.get(),
        u: u.get(),
        v: v.get()
    };
};

Graphics.prototype.getProjectionMatrix = function(p) {
    var n = p.n,
        f = p.f,
        t = n,
        b = -n,
        l = -n,
        r = n;
    //fov : 45, aspect : 1
    // var cot = 1 / (Math.tan(p.fov/2 * Math.PI / 180));

    var ma = {
            orthographic : [[1,0,0,0],
                            [0,1,0,0],
                            [0,0,0,0],
                            [0,0,0,1]],
            // perspective : [[(2*n)/(r-l), 0, 0, 0],
            //                 [0, 2*n/(t-b), 0, 0],
            //                 [(r+l)/(r-l), (t+b)/(t-b), -(f+n)/(f-n), -1],
            //                 [0, 0, -(2*f*n)/(f-n), 0]]
            perspective : [[(2*n)/(r-l), 0, 0, 0],
                            [0, 2*n/(t-b), 0, 0],
                            [(r+l)/(r-l), (t+b)/(t-b), -(f+n)/(f-n), 1],
                            [0, 0, -(2*f*n)/(f-n), 0]]
            // perspective : [
            //                 [cot, 0, 0, 0],
            //                 [0, cot, 0, 0],
            //                 [0, 0, -(f+n)/(f-n), -1],
            //                 [0, 0, -(2*f*n)/(f-n), 0]
            //             ]
        };

    return new Matrix(ma[p.m]);
};

Graphics.prototype.getTranslateMatrix = function(tx, ty, tz) {
    return new Matrix([
                [1,  0,  0,  0],
                [0,  1,  0,  0],
                [0,  0,  1,  0],
                [tx || 0, ty || 0, tz || 0, 1]
            ]);
};

Graphics.prototype.getScaleMatrix = function(sx, sy, sz) {
    return new Matrix([
                [sx || 0, 0,  0, 0],
                [0, sy || 0,  0, 0],
                [0,  0, sz || 0, 0],
                [0,  0,  0, 1]
            ]);
};

Graphics.prototype.getYRotationMatrix = function(degree) {
    if (typeof degree !== 'number') {
        return;
    }

    var radian = degree * Math.PI / 180,
        cos = Math.cos(radian),
        sin = Math.sin(radian);

    return new Matrix([
                [cos,  0, sin, 0],
                [0,    1,   0, 0],
                [-sin, 0, cos, 0],
                [0,    0,   0, 1]
            ]);
};