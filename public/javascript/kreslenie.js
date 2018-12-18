function Kreslenie(hra, canvas, sirkaPola, vyskaPola) {
    this.hra = hra;
    this.canvas = canvas;
    this.sirkaPola = sirkaPola;
    this.vyskaPola = vyskaPola;
    this.context = canvas.getContext('2d');
}

Kreslenie.prototype.Blok = function(blok) {
    var ctx = this.context;
    var tvrdy = (blok instanceof TvrdyBlok || blok instanceof NerozbitnyBlok);
    var x = blok.x;
    var y = blok.y;
    var height = blok.height;
    var width = blok.width;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.lineWidth = 2;
    ctx.fillStyle = blok.color;
    ctx.fillRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(width - 1, 0);
    ctx.lineTo(width - 1, height - 1);
    ctx.lineTo(0, height - 1);
    ctx.strokeStyle = "black";
    ctx.stroke();

    if (tvrdy) {
        ctx.save();
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(2, height - 6);
        ctx.lineTo(2, 2);
        ctx.lineTo(width - 6, 2);
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(width - 4, 0);
        ctx.lineTo(width - 4, height - 4);
        ctx.lineTo(0, height - 4);
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.stroke();
        ctx.restore();
    }
    if (blok.jePrvy()) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, height);
        ctx.stroke();
    }
    ctx.restore();
};

Kreslenie.prototype.vzdialenost = function(blok) {
    var x = blok.currX,
            y = blok.currY,
            width = blok.width - 2,
            height = blok.height - 2;
    var fromX = x,
            fromY = 0;
    if (fromX > width) {
        fromX = width;
        fromY = x - width;
    }
    var toX = 0;
    var toY = y;
    if (y > height) {
        toX = y - height;
        toY = height;
    }
    return {
        fromX: fromX,
        toX: toX,
        fromY: fromY,
        toY: toY
    };
};

Kreslenie.prototype.krLopta = function(color, x, y, rad) {
    var ctx = this.context;
    ctx.fillStyle = color;
    ctx.save(); 
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, rad, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    var grad = ctx.createRadialGradient(-3, -3, 0, 0, 0, rad);
    grad.addColorStop(0.150, 'rgba(255,255,255, 0.3)');
    grad.addColorStop(0.2, 'rgba(0,0,0,0.0)');
    grad.addColorStop(0.9, 'rgba(0,0,0,0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0.1)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
};

Kreslenie.prototype.krPlosina = function(plosina) {
    var ctx = this.context;
    var width = plosina.width,
            height = plosina.height,
            x = plosina.x,
            y = plosina.y;
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    var grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(0,0,0,0.4)');
    grad.addColorStop(0.3, 'rgba(0,0,0, 0.0)');
    grad.addColorStop(1, 'rgba(0,0,0, 0.5)');

    ctx.beginPath();
    ctx.arc(height / 2, height / 2, height / 2, Math.PI / 2,
            Math.PI * 3 / 2);
    ctx.lineTo(height / 2 + 10, 0);
    ctx.lineTo(height / 2 + 10, height);
    ctx.closePath();
    ctx.fillStyle = '#06064c';
    ctx.fill();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(height / 2 + 10, 0);
    ctx.lineTo(height / 2 + 10, height);
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(height / 2 + 10, 0);
    ctx.lineTo(height / 2 + 10, height);
    ctx.lineTo(width - height / 2 - 10, height);
    ctx.lineTo(width - height / 2 - 10, 0);
    ctx.closePath();
    ctx.fillStyle = plosina.color;
    ctx.fill();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(width - height / 2 - 10, 0);
    ctx.lineTo(width - height / 2 - 10, height);
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width - height / 2, height / 2, height / 2, Math.PI * 3 / 2, Math.PI / 2);
    ctx.lineTo(width - height / 2 - 10, height);
    ctx.lineTo(width - height / 2 - 10, 0);
    ctx.closePath();
    ctx.fillStyle = '#06064c';
    ctx.fill();
    ctx.fillStyle = grad;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(height / 2, height / 2, height / 2, Math.PI * 2 / 3, Math.PI * 4 / 3);
    ctx.closePath();
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(width - height / 2, height / 2, height / 2, -Math.PI / 3, Math.PI / 3);
    ctx.closePath();
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.fillStyle = grad;
    ctx.fill();
    
    ctx.restore();
};

Kreslenie.prototype.kresliVylepsenie = function(prize) {
    var ctx = this.context;
    var x = prize.x,
            y = prize.y,
            width = prize.width,
            height = prize.height,
            color = prize.color;
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    var grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(0,0,0,0.3)');
    grad.addColorStop(0.2, 'rgba(255,255,255,0.6)');
    grad.addColorStop(0.4, 'rgba(0,0,0, 0.0)');
    grad.addColorStop(1, 'rgba(0,0,0, 0.5)');
    ctx.fillStyle = color;
    ctx.arc(height / 2, height / 2, height / 2, Math.PI / 2,
            Math.PI * 3 / 2);
    ctx.lineTo(width - height / 2, 0);
    ctx.arc(width - height / 2, height / 2, height / 2,
            Math.PI * 3 / 2, Math.PI / 2);
    ctx.lineTo(height / 2, height);
    ctx.fill();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(prize.vstrede.x, prize.vstrede.y + 5);
    ctx.fillStyle = 'yellow';
    ctx.shadowColor = 'black';
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 0;
    ctx.font = "bold 14pt Courier";
    ctx.textAlign = 'center';
    ctx.fillText(prize.pismeno, 0, 0, width);
    ctx.strokeStyle = 'black';
    ctx.restore();
};

Kreslenie.prototype.clear = function() {
    this.context.clearRect(0, 0, 898, 640);
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, 898, 640);
};

Kreslenie.prototype.clearHra = function() {
    this.context.clearRect(0, 0, this.sirkaPola, this.vyskaPola);
};

Kreslenie.prototype.Pozadie = function() {
    this.context.fillStyle = '#164693';
    this.context.fillRect(0, 0, this.sirkaPola, this.vyskaPola);
    this.oddelovac();
};

Kreslenie.prototype.Statistika = function() {
    var ctx = this.context;
    ctx.save();
    ctx.translate(this.sirkaPola + 20, 0);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 30px  arial';
    ctx.fillText('Skóre: ', 0, 40, this.canvas.width - this.sirkaPola - 100);
    ctx.fillText('Úroveň: ', 0, 120, this.canvas.width - this.sirkaPola - 100);
    ctx.fillText('Životy: ', 0, 180, this.canvas.width - this.sirkaPola - 100);
    ctx.restore();
};

Kreslenie.prototype.Popis = function() {
    var ctx = this.context;
    ctx.save();
    ctx.translate(this.sirkaPola + 20, 260);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 30px arial';
    ctx.fillText('Vylepšenia: ', 0, 0);
    ctx.fillStyle = 'white';

    var rozsirenie = new Rozsirenie(this.game);
    rozsirenie.umiestni(0, 40);
    this.kresliVylepsenie(rozsirenie);
    ctx.font = 'bold 15px arial';
    ctx.fillText(' - Rozšírenie', 40, 54);

    var lepidlo = new Lepidlo(this.game);
    lepidlo.umiestni(0, 70);
    this.kresliVylepsenie(lepidlo);
    ctx.fillText(' - Lepidlo', 40, 84);

    var spomalenie = new Spomalenie(this.game);
    spomalenie.umiestni(0, 100);
    this.kresliVylepsenie(spomalenie);
    ctx.fillText(' - Spomalenie', 40, 114);

    var tri = new Tri_lopty(this.game);
    tri.umiestni(0, 130);
    this.kresliVylepsenie(tri);
    ctx.fillText(' - Tri lopty', 40, 144);

    var zivot = new Zivot(this.game);
    zivot.umiestni(0, 160);
    this.kresliVylepsenie(zivot);

    ctx.fillText(' - Život', 40, 174);
    ctx.font = 'bold 30px arial';

    ctx.fillText('Ovládanie: ', 0, 234);
    ctx.font = 'bold 15px arial';
    ctx.fillText('začať/porkačovať - medzerník', 0, 260);
    ctx.fillText('pohyb - šípky, myš', 0, 280);
    ctx.restore();
};

Kreslenie.prototype.aktualizujStatistiku = function(skore, uroven) {
    var ctx = this.context;
    ctx.save();
    ctx.translate(this.sirkaPola, 0);
    ctx.clearRect(150, 0, this.canvas.width - this.sirkaPola - 150, 200);
    ctx.fillStyle = 'black';
    ctx.fillRect(150, 0, this.canvas.width - this.sirkaPola - 150, 200);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 30px  arial';
    ctx.fillText(skore, 150, 40, this.canvas.width - this.sirkaPola - 200);
    ctx.fillText(uroven, 150, 120, this.canvas.width - this.sirkaPola - 200);
    ctx.restore();
};

Kreslenie.prototype.Zivoty = function() {
    var ctx = this.context;
    ctx.save();
    ctx.translate(this.sirkaPola + 20, 200);
    ctx.clearRect(0, 0, this.canvas.width - this.sirkaPola - 20, 35);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.canvas.width - this.sirkaPola - 20, 35);
    ctx.scale(0.5, 0.5);
    var plosina = new Plosina(this.hra);
    for (var i = 0, offset = 0; i < this.hra.zivoty; i++, offset += 15) {
        plosina.umiestni(i * plosina.width + offset, 0);
        this.krPlosina(plosina);
    }
    ctx.restore();
};

Kreslenie.prototype.oddelovac = function() {
    var ctx = this.context;
    ctx.save();
    ctx.translate(this.sirkaPola + 2, 0);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#4e5766';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, this.vyskaPola);
    ctx.stroke();
    ctx.restore();
};

Kreslenie.prototype.sprava = function(sprava, x, y) {
    var ctx = this.context;
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 40px arial';
    ctx.fillText(sprava, x, y);
    ctx.restore();
};

Kreslenie.prototype.muteButton = function (){
    var ctx = this.context;
    ctx.save();
    ctx.translate(this.sirkaPola + 20, 560);
    ctx.beginPath();
    ctx.rect(0, 0, 120, 70); 
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFFFFF'; 
    ctx.stroke();
    ctx.closePath();
    ctx.font = 'bold 40px arial';  
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Zvuk', 15, 50);
    ctx.font = 'bold 15px arial';  
    ctx.fillText('-klik pre zapnutie ', 120, 30);
    ctx.fillText(' alebo vypnutie zvuku', 120, 50);
    ctx.restore();
};

Kreslenie.prototype.startScreen = function() {
    var ctx = this.context;
    ctx.save();
    var imageObj = new Image();
    imageObj.onload = function() {
        ctx.drawImage(imageObj, 200, 0);
    };
    imageObj.src = "images/1.jpg";

    ctx.beginPath();
    ctx.rect(320, 350, 240, 90); 
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFFFFF'; 
    ctx.stroke();
    ctx.closePath();
    ctx.font = 'bold 40px arial';  
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Štart hry', 360, 410);

    ctx.beginPath();
    ctx.rect(320, 460, 240, 90); 
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFFFFF'; 
    ctx.stroke();
    ctx.closePath();
    ctx.font = 'bold 40px arial';  
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Autor', 390, 520);

    ctx.restore();
};

Kreslenie.prototype.autor = function(){
    var ctx = this.context;
    ctx.save();

    ctx.font = 'bold 40px arial';  
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Adam Benovič', 300, 50);
    ctx.font = 'bold 20px arial'; 
    ctx.fillText('Som 20 ročný študent nultého ročníku na FIIT STU.  Túto hru som vytvoril ako ', 120, 80);
    ctx.fillText('projekt vrámci predmetu Základy tvorby interaktívnych aplikácií. Kontaktujte ma', 120, 101);
    ctx.fillText('na mojom e-maily: benovic16@student.fiit.stuba.sk', 120, 121);

    var imageObj = new Image();
    imageObj.onload = function() {
        ctx.drawImage(imageObj, 200, 150);
    };
    imageObj.src = "obrazky/2.png";

    ctx.beginPath();
    ctx.rect(320, 350, 240, 90); 
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFFFFF'; 
    ctx.stroke();
    ctx.closePath();
    ctx.font = 'bold 40px arial';  
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Štart hry', 360, 410);
    ctx.restore();
};

Kreslenie.prototype.cernota = function () {
    var ctx = this.context;
    ctx.save();
    var imageObj = new Image();
    imageObj.onload = function() {
        ctx.drawImage(imageObj, 598, 0);
    };
    imageObj.src = "images/3.png";
    ctx.restore();
};