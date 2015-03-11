/**
 * [matrix description]
 * @param
 * [
 *      [a, b, c, d],
 *      [e, f, g, h],
 *      [i, j, k, l],
 *      [m, n, o, p]
 * ]
 * [
 *      [a, b, c, d]
 * ]
 */
function Matrix(rowMajorMatrix) {
    if (rowMajorMatrix) {
        this.matrix = rowMajorMatrix;
    } else { //I
        this.matrix = [
                        [1, 0, 0, 0],
                        [0, 1, 0, 0],
                        [0, 0, 1, 0],
                        [0, 0, 0, 1]
                    ];
    }
};

Matrix.prototype.x = function(matrix) {
    return this.preMultiply(matrix);
};

Matrix.prototype.get = function() {
    return this.matrix;
};

Matrix.prototype.preMultiply = function(matrix) {
    if (matrix instanceof Matrix) {
        matrix = matrix.get();
    }

    if (matrix.length !== 4) {
        throw new Error(['우변은 항상 4*4 행렬이어야 함']);
    }

    var eles = [],
        ml = this.matrix,
        mr = matrix;

    for(var j = 0, row = ml.length; j < row; j++) {
        eles[j] = [];

        var a = ml[j][0],
            b = ml[j][1],
            c = ml[j][2],
            d = ml[j][3];

        for (var k = 0, col = mr[j].length; k < col; k++) {
            var sum = (a * mr[0][k]) + (b * mr[1][k]) + (c * mr[2][k]) + (d * mr[3][k]);

            eles[j][k] = sum;
        }
    }

    return new Matrix(eles);
};

Matrix.prototype.project = function(homogeneous) {
    if (!homogeneous) {
        homogeneous = this.matrix[0];
    }

    var cartesian = [
                        homogeneous[0]/homogeneous[3],
                        homogeneous[1]/homogeneous[3],
                        homogeneous[2]/homogeneous[3],
                        1
                    ];

    return cartesian;
};

Matrix.prototype.transpose = function(matrix) {
    if (!matrix) {
        matrix = this.matrix;
    }

    if (matrix instanceof Matrix) {
        matrix = matrix.get();
    }

    var ret = [[],[],[],[]];

    for (var i = 0, len = matrix.length; i < len; i++) {
        ret[0][i] = matrix[i][0];
        ret[1][i] = matrix[i][1];
        ret[2][i] = matrix[i][2];
        ret[3][i] = matrix[i][3];
    }

    return new Matrix(ret);
};

Matrix.prototype.inverse = function() {
    var te = [[],[],[],[]],
        me = this.matrix;

    var n11 = me[0][0], n12 = me[1][0], n13 = me[2][0], n14 = me[3][0];
    var n21 = me[0][1], n22 = me[1][1], n23 = me[2][1], n24 = me[3][1];
    var n31 = me[0][2], n32 = me[1][2], n33 = me[2][2], n34 = me[3][2];
    var n41 = me[0][3], n42 = me[1][3], n43 = me[2][3], n44 = me[3][3];

    te[0][0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
    te[0][1] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
    te[0][2] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
    te[0][3] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
    te[1][0] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
    te[1][1] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
    te[1][2] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
    te[1][3] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
    te[2][0] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
    te[2][1] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
    te[2][2] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
    te[2][3] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
    te[3][0] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
    te[3][1] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
    te[3][2] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
    te[3][3] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

    var det = n11 * te[0][0] + n21 * te[0][1] + n31 * te[0][2] + n41 * te[0][3];

    if (det == 0) {
        debugger;
        console.warn("can't invert matrix, determinat is 0");
        return;
    }

    var s = 1 / det;

    te[0][0] *= s; te[0][1] *= s; te[0][2] *= s; te[0][3] *= s;
    te[1][0] *= s; te[1][1] *= s; te[1][2] *= s; te[1][3] *= s;
    te[2][0] *= s; te[2][1] *= s; te[2][2] *= s; te[2][3] *= s;
    te[3][0] *= s; te[3][1] *= s; te[3][2] *= s; te[3][3] *= s;

    return new Matrix(te).transpose();

};


























