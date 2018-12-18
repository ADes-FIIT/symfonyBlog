function Kolizia(hra) {
    this.hra = hra;
    this.lopty = [];
}

Kolizia.prototype.novaLopta = function(lopta) {
    this.lopty.push(lopta);
};

Kolizia.prototype.aktualizuj = function() {
    this.lopty.forEach(function(hodnota) {
        this.sleduj(hodnota);
    }, this);
};

Kolizia.prototype.zmazLopta = function(lopta) {
    this.lopty.forEach(function(hodnota, index, pole) {
        if (lopta === hodnota) {
            pole.splice(index, 1);
        }
    });
};

Kolizia.prototype.kamSmeruje = function(lopta) {
    var bloky = this.hra.bloky;
    var height = this.hra.bloky.rozmeryBloku.height;
    var width = this.hra.bloky.rozmeryBloku.width;

    var rowTop = Math.floor(lopta.y / height);
    var rowBot = Math.floor(lopta.dole / height);
    var colLeft = Math.floor(lopta.x / width);
    var colRight = Math.floor(lopta.vpravo / width);
    var moznosti = bloky.vyrez({
        rows: [rowTop, rowBot],
        cols: [colLeft, colRight]
    });
    if (moznosti.length === 0) {
        return;
    }
    var i = 0;
    while (
            moznosti[i]  &&  i < moznosti.length) {
        this.koliziaBlok(lopta, moznosti[i]);
        i++;
    }
};

Kolizia.prototype.koliziaBlok = function(lopta, blok) {
    var pretina = this.pretina(lopta, blok);
    if (pretina) {
        switch (pretina) {
            case "hore":
                lopta.y = blok.y - lopta.height;
                lopta.yVelocity = -lopta.yVelocity;
                break;
            case 'dole':
                lopta.y = blok.dole;
                lopta.yVelocity = -lopta.yVelocity;
                break;
            case 'vlavo':
                lopta.x = blok.x - lopta.width;
                lopta.xVelocity = -lopta.xVelocity;
                break;
            case 'vpravo':
                lopta.x = blok.vpravo;
                lopta.xVelocity = -lopta.xVelocity;
                break;
        }
        blok.zrazka(lopta);
        return true;
    }
    return false;
};

Kolizia.prototype.pretina = function(lopta, blok) {
    var najblizsieX = this.limit(lopta.vstrede.x, blok.x, blok.vpravo);
    var najblizsieY = this.limit(lopta.vstrede.y, blok.y, blok.dole);

    var dx = lopta.vstrede.x - najblizsieX;
    var dy = lopta.vstrede.y - najblizsieY;

    var d = Math.sqrt((dx * dx) + (dy * dy));

    if (d < lopta.radius) {
        var strana = this.zistiStranu(blok, lopta);
        return strana;
    }
    return false;
};

Kolizia.prototype.pomocnaPriamka = function(x1, x2, y1, y2) {
    var dx = x2 - x1,
            dy = y2 - y1;
    if (dx == 0) {
        return {x: x2};
    } else if (dy == 0) {
        return {y: y2};
    }
    var k = (y2 - y1) / (x2 - x1),
            b = y1 - k * x1;
    return {
        k: k,
        b: b
    };
};

Kolizia.prototype.krizuje = function(priamka, strana) {
    var o = {};
    var y = strana.y, x = strana.x, max = strana.max, min = strana.min, k = priamka.k, b = priamka.b;

    if (k != undefined) {
        if (y) {
            o.x = (y - b) / k;
            return (o.x >= min && o.x <= max);
        } else if (x) {
            o.y = x * k + b;
            return (o.y >= min && o.y <= max);
        }
    } else if (priamka.y != undefined) {
        if (y) {
            return (y == priamka.y);
        } else if (x) {
            return (priamka.y >= min && priamka.y <= max);
        }
    } else if (priamka.x != undefined) {
        if (x) {
            return (x == priamka.x);
        } else if (y) {
            return (priamka.x >= min && priamka.x <= max);
        }
    }
};

Kolizia.prototype.zistiStranu = function(blok, lopta) {
    var vlavo = {
        x: blok.x,
        min: blok.y - lopta.radius,
        max: blok.dole + lopta.radius,
        ktora: 'vlavo'
    };
    var vpravo = {
        x: blok.vpravo,
        min: blok.y - lopta.radius,
        max: blok.dole + lopta.radius,
        ktora: 'vpravo'
    };
    var hore = {
        y: blok.y,
        min: blok.x - lopta.radius,
        max: blok.vpravo + lopta.radius,
        ktora: "hore"
    };
    var dole = {
        y: blok.dole,
        min: blok.x - lopta.radius,
        max: blok.vpravo + lopta.radius,
        ktora: 'dole'
    };
    var y1 = lopta.vstrede.y;
    var x1 = lopta.vstrede.x;
    var y = y1 - lopta.yVelocity;
    var x = x1 - lopta.xVelocity;

    var path = this.pomocnaPriamka(x, x1, y, y1);

    var hranica = [vlavo, hore, vpravo, dole];
    var strany = [];
    for (var i = 0; i < hranica.length; i++) {
        if (this.krizuje(path, hranica[i])) {
            strany.push(hranica[i].ktora);
        }
    }
    for (var i = 0; i < strany.length; i++) {
        switch (strany[i]) {
            case 'hore':
                if (lopta.yVelocity < 0 || blok.jeHore()) {
                    strany[i] = null;
                }
                break;
            case 'dole':
                if (lopta.yVelocity > 0) {
                    strany[i] = null;
                }
                break;
            case 'vlavo':
                if (lopta.xVelocity < 0 || blok.jePrvy()) {
                    strany[i] = null;
                }
                break;
            case 'vpravo':
                if (lopta.xVelocity > 0 || blok.jePosledny()) {
                    strany[i] = null;
                }
                break;
        }
    }
    var ktora;
    for (var i = 0; i < strany.length; i++) {
        if (!strany[i])
            continue;
        else
            ktora = strany[i];
    }
    return ktora;
};

Kolizia.prototype.limit = function(mid, min, max) {
    if (min <= mid && mid <= max)
        return mid;
    else if (mid < min)
        return min;
    else if (mid > max)
        return max;
};

Kolizia.prototype.sleduj = function(lopta) {
    if (!lopta)
        return;
    var vyskaBloku = this.hra.bloky.rows * this.hra.bloky.rozmeryBloku.height;
    var plosina = this.hra.plosina;
    if (lopta.y <= vyskaBloku) {
        this.kamSmeruje(lopta);
    } else if (lopta.dole >= plosina.y && lopta.y <= plosina.vstrede.y && lopta.yVelocity > 0) {
        this.koliziaPlosina(lopta, plosina);
    }
};

Kolizia.prototype.uhol = function(lopta, uhol) {
    var rad = uhol / 180 * Math.PI;
    v = Math.sqrt(Math.pow(lopta.xVelocity, 2) + Math.pow(lopta.yVelocity, 2));

    var dy = -Math.abs(v * Math.sin(rad));
    var dx = v * Math.cos(rad);
    lopta.y = this.hra.plosina.y - lopta.height;
    return {
        x: dx,
        y: dy
    };
};

Kolizia.zvukZrazkaPlosina = new Audio('images/hit.wav');

Kolizia.prototype.koliziaPlosina = function(lopta, plosina) {
    var offset = lopta.vstrede.x - plosina.x;
    if (offset < 0 || offset > plosina.width)
        return;

    for (var i = 1; i < 6; i++) {
        if (offset < i * plosina.width / 5)
            break;
    }

    var rychlost;

    switch (i) {
        case 1:
            rychlost = this.uhol(lopta, 150);
            break;
        case 2:
            rychlost = this.uhol(lopta, 120);
            break;
        case 3:
            lopta.y = this.hra.plosina.y - lopta.height;
            rychlost = {
                x: lopta.xVelocity,
                y: -lopta.yVelocity
            };
            break;
        case 4:
            rychlost = this.uhol(lopta, 60);
            break;
        case 5:
            rychlost = this.uhol(lopta, 30);
            break;
        default:
            return;
    }

    Kolizia.zvukZrazkaPlosina.play();

    if (plosina instanceof LepkavaPlosina) {
        lopta.yVelocity = lopta.xVelocity = 0;
        lopta.zalepene = offset;
        plosina.nabita = {
            'lopta': lopta,
            'startovaciaRychlost': rychlost
        };
    } else {
        lopta.yVelocity = rychlost.y;
        lopta.xVelocity = rychlost.x;
    } 
};