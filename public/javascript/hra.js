function Hra() {
    this.fps = 60;
    var canvas = document.getElementById('herne_pole');
    this.height = 640;
    this.width = 598;
    this.kreslenie = new Kreslenie(this, canvas, this.width, this.height);
    this.uroven = 1;
    this.zivoty = 1;
    this.celkoveSkore = 0;
    this.paused = true;
    this.posledneVykreslenie = 0;
    this.pausedAt = null;
    this.koniec = false;
    this.generujVylepsenia = 1;
    this.typyVylepseni = ['Rozsirenie', 'Lepidlo', 'Spomalenie', 'Tri_lopty',
        'Zivot'];
    this.sancaVylepsenia = [0, 0, 0, 1];
    this.vylepsenia = new ZbierkaVylepseni(this);
    this.aktivneVylepsenie = null;
    this.kolizia = new Kolizia(this);
    var plosina = new Plosina(this);
    this.plosina = plosina;
    this.lopty = [];
    var lopta = new Lopta(this);
    lopta.umiestni(256 - lopta.radius, 450 - lopta.height);
    this.lopty.push(lopta);
    this.urovne = {
       1: [
            ['nb', 'nb', 'nb', 'nb', 'nb', 'nb', 'nb', 'nb', 'nb', 'nb', 'nb', 'nb', 'nb'],
            ['tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb'],
            ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a'],
            ['l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
            ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y'],
            ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
            ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g'],
            ['r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r'],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        2: [
            ['tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb'],
            ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a'],
            ['l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
            ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'y'],
            ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
            ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g'],
            ['r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r'],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        2: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['r', 'y', 'r', 'y', 'r', 'y', 'r', 'r', 'y', 'r', 'y', 'r', 'y'],
            ['a', 'w', 'a', 'w', 'a', 'w', 'a', 'w', 'a', 'w', 'a', 'w', 'a'],
            ['tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb'],
            ['b', 'o', 'b', 'o', 'b', 'o', 'b', 'o', 'o', 'b', 'o', 'b', 'o'],
            ['o', 'g', 'o', 'g', 'o', 'g', 'o', 'g', 'g', 'o', 'g', 'o', 'g'],
            ['tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb']
        ],
        3: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'r', 'r'],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'y', 'y', 'y', 'y', 'y'],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['b', 'b', 'b', 'b', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l'],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['w', 'w', 'w', 'w', 'w', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a'],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['p', 'p', 'p', 'p', 'p', 'p', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['y', 'y', 'y', 'y', 'y', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g'],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['l', 'l', 'l', 'l', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b']
        ],
        4: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 'nb', 'nb', 'nb', 'nb', 'nb', 'nb', 'nb', 0, 0, 0],
            [0, 0, 'nb', 'nb', 'r', 'r', 'r', 'r', 'r', 'nb', 'nb', 0, 0],
            [0, 0, 'nb', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'nb', 0, 0],
            [0, 0, 'nb', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'nb', 0, 0],
            [0, 0, 'nb', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'nb', 0, 0],
            [0, 0, 'nb', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'nb', 0, 0],
            [0, 0, 'nb', 'tb', 'p', 'p', 'p', 'p', 'p', 'tb', 'nb', 0, 0],
            [0, 0, 'nb', 'tb', 'tb', 'w', 'w', 'w', 'tb', 'tb', 'nb', 0, 0]
        ],
        5: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 'w', 'w', 'w', 'w', 'w', 0, 'r', 'r', 'r', 'r', 'r', 0],
            [0, 'r', 'r', 'r', 'r', 'r', 0, 'l', 'l', 'l', 'l', 'l', 0],
            [0, 'p', 'p', 'p', 'p', 'p', 0, 'w', 'w', 'w', 'w', 'w', 0],
            [0, 'g', 'g', 'g', 'g', 'g', 0, 'o', 'o', 'o', 'o', 'o', 0],
            [0, 'b', 'b', 'b', 'b', 'b', 0, 'p', 'p', 'p', 'p', 'p', 0],
            [0, 'y', 'y', 'y', 'y', 'y', 0, 'g', 'g', 'g', 'g', 'g', 0],
            [0, 'w', 'w', 'w', 'w', 'w', 0, 'r', 'r', 'r', 'r', 'r', 0],
            [0, 'l', 'l', 'l', 'l', 'l', 0, 'a', 'a', 'a', 'a', 'a', 0],
            [0, 'r', 'r', 'r', 'r', 'r', 0, 'r', 'r', 'r', 'r', 'r', 0],
            [0, 'w', 'w', 'w', 'w', 'w', 0, 'y', 'y', 'y', 'y', 'y', 0],
            [0, 'o', 'o', 'o', 'o', 'o', 0, 'b', 'b', 'b', 'b', 'b', 0],
            [0, 'w', 'w', 'w', 'w', 'w', 0, 'r', 'r', 'r', 'r', 'r', 0],
            [0, 'y', 'y', 'y', 'y', 'y', 0, 'g', 'g', 'g', 'g', 'g', 0],
        ],
        6: [
            ['b', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['w', 'w', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['y', 'y', 'y', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['g', 'g', 'g', 'g', 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ['a', 'a', 'a', 'a', 'a', 0, 0, 0, 0, 0, 0, 0, 0],
            ['o', 'o', 'o', 'o', 'o', 'o', 0, 0, 0, 0, 0, 0, 0],
            ['r', 'r', 'r', 'r', 'r', 'r', 'r', 0, 0, 0, 0, 0, 0],
            ['l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 0, 0, 0, 0, 0],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 0, 0, 0, 0],
            ['a', 'a', 'a', 'a', 'a', 'y', 'y', 'y', 'y', 'y', 0, 0, 0],
            ['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 0, 0],
            ['tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'tb', 'r'],
        ]
        
    };
    this.kreslenie.startScreen();
};

Hra.prototype.gameloop = function() {
    if (this.posledneVykreslenie == 0) 
        this.posledneVykreslenie = new Date().getTime();
    var aktualne = new Date().getTime();
    var delta = aktualne - this.posledneVykreslenie;
    if (delta >= this.oneskorenie && !this.paused) {
        this.aktualizujVsetko();
        if (this.paused)
            return;
        this.vykresliVsetko();
        this.posledneVykreslenie = new Date().getTime();
    }  
    this.loop = requestAnimationFrame(Hra.prototype.gameloop.bind(this));
};

Hra.prototype.obnov = function() {

    return this.aktivneVylepsenie && this.aktivneVylepsenie.prototype.deaktivuj.call(this);
};

Hra.prototype.nahodneVylepsenie = function() {
    var int = Math.floor(Math.random() * (this.typyVylepseni.length - 0.0001));
    var typ = this.typyVylepseni[int];
    var vylepsenie = this.vylepsenia.create(typ);
    return vylepsenie;
};

Hra.prototype.vyhra = function() {
    this.koniec = true;
    this.kreslenie.clear();
    this.kreslenie.cernota();
    this.kreslenie.sprava('Vyhrali ste!', 300, this.height / 2 );
    this.kreslenie.sprava('Vaše skóre: ' + this.celkoveSkore, 250, this.height / 2 + 91);
    this.kreslenie.sprava('stlačte medzerník pre reštart', 150, this.height / 2 + 182 );
};

Hra.prototype.prehra = function() {
    this.pause();
    this.koniec = true;
    this.kreslenie.clear();
    this.kreslenie.cernota();
    this.kreslenie.sprava('Koniec hry!', 300, this.height / 2 );
    this.kreslenie.sprava('Vaše skóre: ' + this.celkoveSkore, 250, this.height / 2 + 91);
    this.kreslenie.sprava('stlačte medzerník pre reštart', 150, this.height / 2 + 182 );
};

Hra.prototype.restart = function() {
    this.koniec = false;
    this.uroven = 0;
    this.celkoveSkore = 0;
    this.zivoty = 3;
    this.dalsiaUroven();
};

Hra.prototype.vykresliUroven = function() {
    this.kreslenie.clear();
    this.kreslenie.Pozadie();
    this.kreslenie.Statistika();
    this.kreslenie.Zivoty();
    this.kreslenie.Popis();
    this.kreslenie.muteButton();
    this.zaciatocnaPozicia();
    this.vylepsenia.vycisti();
    this.bloky = new Bloky(this);
    this.vykresliVsetko();
};

Hra.prototype.strataZivota = function() {
    this.zivoty--; 
    this.kreslenie.Zivoty();
    this.celkoveSkore = Math.max(this.celkoveSkore - 500, 0);
    if(this.zivoty < 0){
        this.zivoty = 0;
        this.prehra();
        return;
    }
    this.obnov();
    this.zaciatocnaPozicia();
    this.vykresliVsetko();
    this.pause();
};

Hra.prototype.zaciatocnaPozicia= function() {
    this.plosina.umiestni(this.width / 2 - this.plosina.width / 2, this.height - 60);
    this.lopty.forEach(function(hodnota) {
        hodnota.smrt();
    });
    this.lopty = [];
    this.lopty.push(new Lopta(this));
    this.lopty[0].umiestni(this.width / 2 - this.lopty[0].radius, this.height - 60 - this.lopty[0].height);
    this.lopty[0].rychlostNaNormalnu();
};

Hra.prototype.start = function() {
    var hra = this;
    hra.koniec = false;
    hra.paused = false;
    
     document.addEventListener('mousemove', function(e) {
     var offset = hra.kreslenie.canvas.getBoundingClientRect().left;
     var x = (e.clientX - offset) - hra.plosina.width / 2;
     if (x < 0) {
     x = 0;
     } else if (x + hra.plosina.width > hra.width) {
     x = hra.width - hra.plosina.width;
     }
     hra.plosina.x = x;
     });
     
    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 39 || e.keyCode === 37) {
            hra.plosina.zaciatokPohybu(e.keyCode);
        }
    });

    document.addEventListener('keyup', function(e) {
        if (e.keyCode === 39 || e.keyCode === 37) {
            hra.plosina.stop();
        }
    });
    if (this.pausedAt) {
        var now = new Date().getTime();
        var pausedFor = now - this.pausedAt;
        this.posledneVykreslenie += pausedFor;
    }
    this.gameloop();
};

Object.defineProperty(Hra.prototype, 'oneskorenie', {
    get: function() {
        return 1000 / this.fps;
    }
});

Hra.prototype.pause = function() {
    if (this.paused)
        return;
    var cancelAnimationFrame = cancelAnimationFrame || clearTimeout;
    cancelAnimationFrame(this.loop);
    this.pausedAt = new Date().getTime();
    this.paused = true;
};

Hra.prototype.dalsiaUroven = function() {
    this.pause();
    this.uroven++;
    if (!this.urovne[this.uroven])
        this.vyhra();
    else {
        this.obnov();
        this.aktualizujVsetko();
        this.vykresliUroven();
    }
};

Hra.prototype.vykresliVsetko = function() {
    this.kreslenie.clearHra();
    this.kreslenie.Pozadie();
    for (var i = 0; i < this.lopty.length; i++) {
        this.lopty[i].kresli();
    }
    this.bloky.kresli();
    this.plosina.kresli();
    this.vylepsenia.kresli();
};

Hra.prototype.aktualizujVsetko = function() {
    for (var i = 0; i < this.lopty.length; i++) {
        this.lopty[i].aktualizuj();
    };
    this.plosina.aktualizuj();
    this.vylepsenia.aktualizuj();
    this.kolizia.aktualizuj();
    this.kreslenie.aktualizujStatistiku(this.celkoveSkore, this.uroven);
};


function Bloky(hra) {
    this.length = 0;
    this.rozmeryBloku = {
        height: 23,
        width: 46
    };
    this.typBloku = {
        'r': '#FF0000',
        'g': '#008000',
        'b': '#0000FF',
        'y': '#FFFF00',
        'p': '#FFC0CB',
        'o': '#FFA500',
        'w': '#FFFFFF',
        'l': '#00FF00',
        'a': '#00FFFF'
    };
    this.skore = {
        '#FF0000': 10,
        '#008000': 20,
        '#0000FF': 30,
        '#FFFF00': 40,
        '#FFC0CB': 50,
        '#FFA500': 60,
        '#FFFFFF': 70,
        '#00FF00': 80,
        '#00FFFF': 90
    };
    this.hra = hra;
    this.bloky = [];
    var uroven = this.hra.urovne[this.hra.uroven];
    var rows = uroven.length;
    for (var r = 0; r < rows; r++) {
        this.bloky.push([]);
        var col = 0;
        uroven[r].forEach(
                function(hodnota) {
                    switch (hodnota) {
                        case 'nb':
                            this.bloky[r].push(new NerozbitnyBlok(this.hra, null, {
                                row: r,
                                col: col,
                                rozmery: this.rozmeryBloku
                            }, this));
                            break;
                        case 'tb':
                            this.bloky[r].push(new TvrdyBlok(this.hra, null, {
                                row: r,
                                col: col,
                                rozmery: this.rozmeryBloku
                            }, this));
                            this.length++;
                            break;
                        case 0:
                            this.bloky[r].push(null);
                            break;
                        default:
                            this.bloky[r].push(new Blok(this.hra, this.typBloku[hodnota], {
                                row: r,
                                col: col,
                                rozmery: this.rozmeryBloku
                            }, this
                                    ));
                            this.length++;
                            break;
                    }
                    col++;
                }, this);
    }
};

Bloky.prototype.kresli = function() {
    this.bloky.forEach(function(el, index, pole) {
        if (Array.isArray(el)) {
            el.forEach(function(hodnota) {
                if (hodnota instanceof Blok) {
                    hodnota.kresli();
                }
            });
        }
    });
};

Bloky.prototype.odstran = function(blok) {
    var row = blok.row, col = blok.col;
    this.bloky[row][col] = null;
    this.length--;
    if (this.length === 0) {
        this.hra.dalsiaUroven();
    }
};

Bloky.prototype.vyrez = function(obj) {
    var existuje = [];
    for (var i = obj.rows[0]; i <= Math.min(obj.rows[1], this.bloky.length); i++) {
        for (var k = obj.cols[0]; k <= obj.cols[1]; k++) {
            if (Array.isArray(this.bloky[i])) {
                var blok = this.bloky[i][k];
                if (blok)
                    existuje.push(blok);
            }
        }
    }
    return existuje;
};

Bloky.prototype.nad = function(blok) {
    var row = blok.row,
            col = blok.col;
    var nad = row - 1;
    if (nad < 0)
        return null;
    return this.bloky[nad][col];
};

Bloky.prototype.pod = function(blok) {
    var row = blok.row,
            col = blok.col;
    var pod = row + 1;
    if (pod > this.bloky.length - 1)
        return null;
    return this.bloky[pod][col];
};

Bloky.prototype.dalsi = function(blok) {
    var row = blok.row,
            col = blok.col;
    var dalsi = col + 1;
    if (dalsi > this.cols - 1)
        return null;
    return this.bloky[row][dalsi];
};

Bloky.prototype.predosly = function(blok) {
    var row = blok.row,
            col = blok.col;
    var predosly = col - 1;
    if (predosly < 0)
        return null;
    return this.bloky[row][predosly];
};

Object.defineProperty(Bloky.prototype, 'rows', {
    get: function() {
        return this.bloky.length;
    }
});

Object.defineProperty(Bloky.prototype, 'cols', {
    get: function() {
        return this.bloky[0].length;
    }
});

Hra.prototype.oautorovi = function(){
    this.kreslenie.clear();
    this.kreslenie.autor();
}

Hra.pozMysi =  function(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
};

Hra.startButton = {
    x: 320,
    y: 350,
    width: 240,
    heigth: 90
};

Hra.autorButton = {
    x: 320,
    y: 460,
    width: 240,
    heigth: 90
};
Hra.muteButton = {
    x: 618,
    y: 560,
    width: 120,
    heigth: 70
};

Hra.vtlacidle = function(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.heigth && pos.y > rect.y
};