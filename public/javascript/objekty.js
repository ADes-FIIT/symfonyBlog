function HernyObjekt(hra, color) {
    this.color = color;
    this.hra = hra;
};

HernyObjekt.prototype.aktualizuj = function() {
};

HernyObjekt.prototype.umiestni = function(x, y) {
    this.x = x;
    this.y = y;
};

Object.defineProperty(HernyObjekt.prototype, "dole", {
    get: function() {
        return this.y + this.height;
    }
});

Object.defineProperty(HernyObjekt.prototype, "vpravo", {
    get: function() {
        return this.x + this.width;
    }
});

Object.defineProperty(HernyObjekt.prototype, "vstrede", {
    get: function() {
        var halfWidth = (this.radius) ? this.radius : this.width / 2;
        var halfHeight = (this.radius) ? this.radius : this.height / 2;
        var cX = this.x + halfWidth;
        var cY = this.y + halfHeight;
        var vstrede = {
            'x': cX,
            'y': cY
        };
        return vstrede;
    }
});

function Lopta() {
    HernyObjekt.apply(this, arguments);    
    this.normalnaRychlost = {
        x: 3,
        y: -7
    }; 
    this.color = '#FFFF99';
    this.radius = 5;
    this.zalepene = null;
    this.sila = 1;
    this.width = this.height = this.radius * 2;
    this.hra.kolizia.novaLopta(this);
};

Lopta.prototype = Object.create(HernyObjekt.prototype);

Lopta.prototype.aktualizuj = function() {
    this.pohyb();
};

Lopta.prototype.kresli = function() {
    this.hra.kreslenie.krLopta(this.color, this.x + this.radius,
            this.y + this.radius, this.radius);
};

Lopta.prototype.pohyb = function() {
    if (this.zalepene) {
        var offset = this.zalepene;
        this.x = this.hra.plosina.x + offset;
    } else {
        var now = new Date().getTime();
        var delta = now - this.hra.posledneVykreslenie;
        var k = delta / this.hra.oneskorenie;
        this.x += this.xVelocity * k;
        this.y += this.yVelocity * k;
    }
    if (this.y <= 0) {
        this.yVelocity = -this.yVelocity;
        this.y = 1;
    }
    if (this.vpravo >= this.hra.width) {
        this.xVelocity = -this.xVelocity;
        this.x = this.hra.width - (this.width + 1);
    }
    if (this.x <= 0) {
        this.xVelocity = -this.xVelocity;
        this.x = 1;
    }
    if (this.y >= this.hra.height) {
        this.smrt();
    }
};

Lopta.prototype.roztroj = function() {
    var lava = new Lopta(this.hra);
    var prava = new Lopta(this.hra);
    this.hra.lopty.push(lava);
    lava.umiestni(this.x - this.width - 5, this.y);
    lava.yVelocity = prava.yVelocity = this.yVelocity;
    lava.xVelocity = this.xVelocity - 1;
    this.hra.kolizia.novaLopta(lava);

    this.hra.lopty.push(prava);
    prava.umiestni(this.vpravo + 5, this.y);
    prava.xVelocity = this.xVelocity + 1;
    this.hra.kolizia.novaLopta(prava);

};

Lopta.prototype.rychlostNaNormalnu = function() {
    this.xVelocity = this.normalnaRychlost.x;
    this.yVelocity = this.normalnaRychlost.y;
};

Lopta.zvukSmrtLopty = new Audio('images/death.wav');

Lopta.prototype.smrt = function() {
    this.hra.lopty.forEach(function(val, index) {
        if (val === this) {
            this.hra.lopty.splice(index, 1);
        }
    }, this);
    this.hra.kolizia.zmazLopta(this);

    if (this.hra.lopty.length == 1 && !this.hra.paused) {
        this.hra.obnov();
    }

    if (this.hra.lopty.length === 0 && !this.hra.paused) {
        this.hra.strataZivota();
    }
    Lopta.zvukSmrtLopty.play();
};

function Plosina() {
    HernyObjekt.apply(this, arguments);
    this.color = '#19e8bb';
    this.width = 80;
    this.height = 20;
    this.krok = 20;
    this.smer = 0;
    this.normalnaSirka = 80;
}
Plosina.prototype = Object.create(HernyObjekt.prototype);

Plosina.prototype.pohyb = function() {
    var x = this.x;
    x += (this.smer * this.krok);
            if (x < 0) {
            x = 0;
        } else if (x+this.width > this.hra.width) {
            x = this.hra.width - this.width;
        }
        this.x = x;
};

Plosina.prototype.zaciatokPohybu = function(keyCode) {
    this.smer = (keyCode == 39)? 1 : -1;
};

Plosina.prototype.stop = function() {
  this.smer = 0;  
};

Plosina.prototype.kresli = function() {
    var color = this.color;
    this.hra.kreslenie.krPlosina(this, true);
};

Plosina.prototype.aktualizuj = function() {
    if (this.celkovaSirka && this.width < this.celkovaSirka) {
        this.width++;
        if (this.width % 2 !== 0) {
            this.x--;
        }
    } else {
        delete this.celkovaSirka;
    }
    this.pohyb();
};

Plosina.prototype.extend = function() {
    this.celkovaSirka = this.width * 2;
};

Plosina.prototype.naNormalnuSirku = function() {
    this.width = this.normalnaSirka;
    this.celkovaSirka = null;
};

function LepkavaPlosina() {
    Plosina.apply(this, arguments);
    this.lepkava = true;
    this.color = '#006600';
    this.nabita = null;
};

LepkavaPlosina.prototype = Object.create(Plosina.prototype);

LepkavaPlosina.prototype.pusti = function(lopta, startovaciaRychlost) {
    if (!this.nabita) {
        return;
    }
    this.nabita.lopta.yVelocity = this.nabita.startovaciaRychlost.y;
    this.nabita.lopta.xVelocity = this.nabita.startovaciaRychlost.x;
    this.nabita.lopta.zalepene = null;
    this.nabita = null;
};

LepkavaPlosina.prototype.constructor = LepkavaPlosina();

function Blok(objekt, color, vlastnosti, zbierka) {
    HernyObjekt.apply(this, arguments);
    this.color = color;
    this.hp = 1;
    this.zbierka = zbierka;
    this.row = vlastnosti.row;
    this.col = vlastnosti.col;
    this.width = vlastnosti.rozmery.width;
    this.height = vlastnosti.rozmery.height;
    this.x = this.col * this.width;
    this.y = this.row * this.height;
};

Blok.prototype = Object.create(HernyObjekt.prototype);

Object.defineProperty(Blok.prototype, 'skore', {
    get: function() {
        return (this instanceof TvrdyBlok) ? this.hra.uroven * 50 : this.zbierka.skore[this.color];
    }
});

Blok.prototype.kresli = function() {
    var color = this.color;
    this.hra.kreslenie.Blok(this);
};

Blok.zvukZrazka = new Audio('images/hit.wav');

Blok.prototype.zrazka = function(lopta) {
    if (this.nerozbitny) {
        return;
    }
    this.hp -= lopta.sila;
    if (this.hp <= 0) {
        this.smrt();
        Blok.zvukZrazka.play();
    }
};

Blok.prototype.nahodneVylepsenie = function() {
    var length = this.hra.sancaVylepsenia.length;
    var rand = Math.floor(Math.random() * (length - 0.0001));
    return this.hra.sancaVylepsenia[rand];

};

Blok.prototype.smrt = function() {
    this.hra.celkoveSkore += this.skore;
    var stastie = this.hra.generujVylepsenia && this.nahodneVylepsenie();
    if (stastie) {
        var vylepsenie = this.hra.nahodneVylepsenie();
        vylepsenie.umiestni(this.vstrede.x - vylepsenie.width / 2, this.vstrede.y - vylepsenie.height / 2);
    }
    this.zbierka.odstran(this);
};

Blok.prototype.jePosledny = function() {
    return !!(this.col === this.zbierka.cols - 1);
};

Blok.prototype.jeHore = function() {
    return !!(this.row === 0);
};

Blok.prototype.jePrvy = function() {
    return (this.col === 0);
};

Object.defineProperty(Blok.prototype, "nad", {
    get: function() {
        return this.zbierka.nad(this);
    }
});

Object.defineProperty(Blok.prototype, "pod", {
    get: function() {
        return this.zbierka.pod(this);
    }
});

Object.defineProperty(Blok.prototype, "dalsi", {
    get: function() {
        return this.zbierka.dalsi(this);
    }
});

Object.defineProperty(Blok.prototype, "predosly", {
    get: function() {
        return this.zbierka.predosly(this);
    }
});

Lopta.prototype.constructor = Lopta;
Plosina.prototype.constructor = Plosina;
Blok.prototype.constructor = Blok;

function TvrdyBlok() {
    Blok.apply(this, arguments);
    this.color = '#B8B8B8';
    this.hp = 2;
};

Object.defineProperty(TvrdyBlok.prototype, "skore", {
    get: function() {
        return this.hra.uroven * 50;
    }
});

TvrdyBlok.prototype = Object.create(Blok.prototype);

TvrdyBlok.prototype.kresli = function() {
    this.hra.kreslenie.Blok(this);
};

TvrdyBlok.prototype.constructor = TvrdyBlok;

function NerozbitnyBlok() {
    Blok.apply(this, arguments);
    this.color = "#CC9900";
    this.nerozbitny = true;
};

NerozbitnyBlok.prototype = Object.create(Blok.prototype);

NerozbitnyBlok.prototype.constructor = NerozbitnyBlok;