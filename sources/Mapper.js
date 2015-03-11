function Mapper(ctx, callback) {
    this.ctx = ctx;
    this.sx = ctx.canvas.width;
    this.sy = ctx.canvas.height;

    this.loadImg(callback);
}

Mapper.prototype.loadImg = function(callback) {
    var img = new Image,
        self = this;

    img.crossOrigin = "Anonymous";

    img.onload = function() {
        self.ctx.drawImage(img, 0, 0, self.sx, self.sy);
        self.d = self.ctx.getImageData(0, 0, self.sx, self.sy);

        self.ctx.clearRect(0, 0, self.sx, self.sy);

        callback();
    };

    img.src = 'http://10.64.89.147:8000/imgs/4.jpg';
};

Mapper.prototype.mapping = function(coords, mProperties, degree) {
    var domain = this.getDomain(coords);
    var uvFunc = this.parameterizeFunc(mProperties.domain);
    var self = this;

    var isReverseSide = Math.cos(degree * Math.PI / 180) < 0;
    if (isReverseSide) {
        return;
    }

    var mvpsInverse = mProperties.mvps.inverse(),
        normModel = [];

    mProperties.model.forEach(function(itm, i) {
        normModel[i] = new Vector(new Matrix([itm]).project());
    });

    //절두체 안에 있는 모델의 평면 노말(왼손)
    var lineAOnPlane = normModel[1].sub(normModel[0]),
        lineBOnPlane = normModel[3].sub(normModel[0]),
        planeNormal = lineAOnPlane.cross(lineBOnPlane).norm();

    //투영된 2차원 폴리곤 내부인지 검사할 함수
    var isIn = this.getIsInFunc(coords);

    //그릴 스크린 좌표 내에서 픽셀마다 검사
    for (var i = 0; domain.minx + i < domain.maxx; i++) {
        for (var j = 0; domain.miny + j < domain.maxy; j++) {

            var screenx = domain.minx + i,
                screeny = domain.miny + j;

            if (isIn(screenx, screeny)) {
                //선분의 양 끝 점과 방향벡터
                var nearEnd = new Matrix([[screenx, screeny, 1, 1]]).x(mvpsInverse).project(),
                    farEnd = new Matrix([[screenx, screeny, -1, 1]]).x(mvpsInverse).project(),
                    d = new Vector(nearEnd).sub(farEnd);

                //교점 계산
                var vec_result = normModel[0].sub(nearEnd),
                    scalar_result = vec_result.dot(planeNormal),
                    t = scalar_result / d.dot(planeNormal),
                    intersection = new Vector(nearEnd).add(d.scale(t)).get();

                var uv = uvFunc(intersection[0], intersection[1]);
                self.fill(screenx, screeny, uv[0], uv[1]);
            }
        }
    }
};

Mapper.prototype.getIsInFunc = function(coords) {
    return function(x, y) {
        var isIn = false,
            len = coords.length - 2,
            j = len;

        for (var i = 0; i < len; i++) {
            var a = coords[i],
                b = coords[j]
            if ((a[1] <= y && b[1] >= y) || (b[1] <= y && a[1] >= y)) {
                if (a[0] + (y - a[1])/(b[1] - a[1])*(b[0]-a[0]) <= x) {
                    isIn = !isIn;
                }
            }
            j = i;
        }

        return isIn;
    }
};


Mapper.prototype.getDomain = function(coords) {
    var minx = Infinity,
        miny = Infinity,
        maxx = -Infinity,
        maxy = -Infinity;

    coords.forEach(function(itm) {
        minx = Math.min(minx, itm[0]);
        miny = Math.min(miny, itm[1]);
        maxx = Math.max(maxx, itm[0]);
        maxy = Math.max(maxy, itm[1]);
    });

    return {minx: minx, miny: miny, maxx: maxx, maxy: maxy};
};

Mapper.prototype.parameterizeFunc = function(domain) {
    var w = domain.maxx - domain.minx,
        h = domain.maxy - domain.miny;

    return function(x, y) {
        var u = (x - domain.minx) / w,
            v = 1 - ((y - domain.miny) / h);

        return [u, v];
    };
};

Mapper.prototype.fill = function(x, y, u, v) {
    var color = this.getRGBA(u, v);

    this.ctx.fillStyle = color
    this.ctx.fillRect(x, y, 1, 1);
};

Mapper.prototype.getRGBA = function(u, v) {
    var tx = u * this.sx | 0,//Math.round(u * this.sx)
        ty = v * this.sy | 0,//Math.round(v * this.sy)
        idx = ((ty * this.sx) + tx) * 4;

    var ret = [this.d.data[idx], this.d.data[idx + 1], this.d.data[idx + 2], this.d.data[idx + 3]].join(',');

    return 'rgba(' + ret + ')';
};







// 교점이란 직선 p = Pa + td (직선의 방정식 Pa => 직선위의 한점, d = 방향벡터)의 한점이
// 평면 (p-P0)*n = 0(평면의 방정식 n => 법선벡터, * => 내적) 위에 존재한다는 의미이므로,
// 직선의 방정식을 평면의 방정식에 대입하여 t의 값을 구하고 t를 다시 직선의 방정시의 대입했을때
// 구할 수 있는 p의 값이 교점이 된다.

// 대입한식을 풀어보면
// 매개변수 : t = ( (P0-Pa)*n / d*n ) )
// 교점         : p = (Pa + td)

// 두식을 하나의 식으로 풀어보면
// 교점          : p = Pa + ( (P0-Pa)*n / d*n )d 가된다.

// 의사코드
// struct line{
//      vector Pa;     //직선상의 한점
//      vector d;       //직선의 방향 벡터
// }
// struct plane{
//      vector P0;   //평면상의 한점
//      vector n       //평면의 법선 벡터
// }

// GetIntersection (line, plane)
// {
//     vector vec_result  = plane.P0 - line.Pa;             //(P0-Pa)
//     float scalar_result = vec_result.Dot(plnae.n);  //(P0-Pa)*n
//     float t = scalr_result / line.d.dot(plane.n);       //(P0-Pa)*n / d*n
//     pi = line.Pa + line.d.Scalfe(t);                                 //교점의 계산
// }