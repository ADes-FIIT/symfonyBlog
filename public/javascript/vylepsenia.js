function Vylepsenie(hra, objekt) {
    HernyObjekt.apply(this, arguments);
    this.width = 32;
    this.height = 14;
    this.dy = 4;
    this.zbierka = objekt;
};

Vylepsenie.prototype = Object.create(HernyObjekt.prototype);

Vylepsenie.prototype.kresli = function() {
    this.hra.kreslenie.kresliVylepsenie(this);
};

Vylepsenie.prototype.pohyb = function() {
    this.y += this.dy;
    if (this.dole >= this.hra.plosina.y &&
            this.y <= this.hra.plosina.dole &&
            this.vpravo > this.hra.plosina.x && this.x < this.hra.plosina.vpravo) {
        if (this.hra.aktivneVylepsenie != this.constructor) {
            this.aktivuj();
        }
        this.smrt();
    }
    if (this.y > this.hra.height) {
        this.smrt();
    }
};

Vylepsenie.prototype.smrt = function() {
    this.zbierka.odstran(this);
};

Vylepsenie.prototype.constructor = Vylepsenie;
function Rozsirenie() {
    Vylepsenie.apply(this, arguments);
    this.color = '#2E8AE6';
    this.pismeno = 'R';
}

Rozsirenie.prototype = Object.create(Vylepsenie.prototype);

Rozsirenie.prototype.aktivuj = function() {
    this.hra.obnov();
    this.hra.plosina.extend();
    this.hra.aktivneVylepsenie = this.constructor;
};
Rozsirenie.prototype.deaktivuj = function() {
    this.plosina.naNormalnuSirku();
    this.aktivneVylepsenie = null;
};

Rozsirenie.prototype.constructor = Rozsirenie;

function Lepidlo() {
    Vylepsenie.apply(this, arguments);
    this.color = '#006600';
    this.pismeno = 'L';
};

Lepidlo.prototype = Object.create(Vylepsenie.prototype);

Lepidlo.prototype.aktivuj = function() {
    this.hra.obnov();
    var x = this.hra.plosina.x;
    var y = this.hra.plosina.y;
    this.hra.plosina = new LepkavaPlosina(this.hra);
    this.hra.plosina.umiestni(x, y);
    var listener = this.listener.bind(this.hra);
    window.addEventListener('keypress', listener);
    this.hra.listeners = listener;
    this.hra.aktivneVylepsenie = this.constructor;
};

Lepidlo.prototype.deaktivuj = function() {
    this.plosina.pusti();
    var x = this.plosina.x;
    var y = this.plosina.y;
    this.plosina = new Plosina(this);
    this.plosina.umiestni(x, y);
    this.aktivneVylepsenie = null;
    window.removeEventListener('keypress', this.currentListener);
    this.currentListener = null;
};

Lepidlo.prototype.listener = function(e) {
    if (e.keyCode == 32 || e.key == "Spacebar" || e.key == " ") {
        return this.plosina.lepkava && this.plosina.pusti();
    } else return;
};

Lepidlo.prototype.constructor = Lepidlo;

function Spomalenie() {
    Vylepsenie.apply(this, arguments);
    this.color = '#E65C00';
    this.pismeno = 'S';
};

Spomalenie.prototype = Object.create(Vylepsenie.prototype);

Spomalenie.prototype.aktivuj = function() {
    this.hra.obnov();
    this.hra.lopty.forEach(function(val) {
        val.xVelocity = val.xVelocity / 2;
        val.yVelocity = val.yVelocity / 2;
    });
    this.hra.aktivneVylepsenie = this.constructor;
};

Spomalenie.prototype.deaktivuj = function() {
    this.lopty.forEach(function(val) {
        val.xVelocity = val.xVelocity * 2;
        val.yVelocity = val.yVelocity * 2;
    });
    this.aktivneVylepsenie = null;
};

Spomalenie.prototype.constructor = Spomalenie;

function Tri_lopty() {
    Vylepsenie.apply(this, arguments);
    this.color = '#990033';
    this.pismeno = 'T';
}

Tri_lopty.prototype = Object.create(Vylepsenie.prototype);

Tri_lopty.prototype.aktivuj = function() {
    this.hra.obnov();
    this.hra.lopty.forEach(function(lopta) {
        lopta.roztroj();
    });
    this.hra.aktivneVylepsenie = this.constructor;
    this.zbierka.vycisti();    
};

Tri_lopty.prototype.deaktivuj = function() {
    this.aktivneVylepsenie = null;
};

Tri_lopty.prototype.constructor = Tri_lopty;

function Zivot() {
    Vylepsenie.apply(this, arguments);
    this.color = 'gray';
    this.pismeno = 'Ž';
};

Zivot.prototype = Object.create(Vylepsenie.prototype);

Zivot.prototype.aktivuj = function() {
    var stav = this.hra.zivoty;
    this.hra.zivoty = Math.min(this.hra.zivoty + 1, 5);
    var rozdiel = this.hra.zivoty - stav;
    if (rozdiel) {
        this.hra.kreslenie.Zivoty();
    } else {
        this.hra.celkoveSkore += 500;
    }
};

Zivot.prototype.deaktivuj = function() {
    return;
};

Zivot.prototype.constructor = Zivot;

function ZbierkaVylepseni(hra) {
    this.vylepsenia = [];
    this.tovaren = new TovarenNaVylepsenia(hra);
}

ZbierkaVylepseni.prototype.add = function(vylepsenie) {
    this.vylepsenia.push(vylepsenie);
};

ZbierkaVylepseni.prototype.odstran = function(vylepsenie) {
    this.vylepsenia.forEach(function(val, index, array) {
        if (val === vylepsenie) {
            array.splice(index, 1);
        }
    });
};

ZbierkaVylepseni.prototype.kresli = function() {
    this.vylepsenia.forEach(function(val) {
        val.kresli();
    });
};

ZbierkaVylepseni.prototype.aktualizuj = function() {
    this.vylepsenia.forEach(function(val) {
        val.pohyb();
    });
};

ZbierkaVylepseni.prototype.vycisti = function() {
    this.vylepsenia = [];
};

ZbierkaVylepseni.prototype.create = function(typ) {
    var vylepsenie = this.tovaren.create(typ);
    this.add(vylepsenie);
    return vylepsenie;
};

function TovarenNaVylepsenia(hra) {
    this.hra = hra;
};

TovarenNaVylepsenia.prototype.create = function(typ) {
    var vylepsenie;
    switch (typ) {
        case 'Rozsirenie':
            vylepsenie = new Rozsirenie(this.hra, this.hra.vylepsenia);
            break;
        case 'Lepidlo':
            vylepsenie = new Lepidlo(this.hra, this.hra.vylepsenia);
            break;
        case 'Spomalenie':
            vylepsenie = new Spomalenie(this.hra, this.hra.vylepsenia);
            break;
        case 'Tri_lopty':
            vylepsenie = new Tri_lopty(this.hra, this.hra.vylepsenia);
            break;
        case 'Zivot':
            vylepsenie = new Zivot(this.hra, this.hra.vylepsenia);
            break;
        default:
            return null;
    }
    return vylepsenie;
};