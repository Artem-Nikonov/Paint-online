//Создание холста
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var tempCanvas = document.createElement('canvas');
tempCanvas.width = canvas.width;
tempCanvas.height = canvas.height;
var tempCtx = tempCanvas.getContext('2d');

//Настройки фона
ctx.fillStyle = "white";
ctx.fillRect(0, 0, 700, 500);
erase();

//Изначально выбран карандаш
lines();


function lines() {
	
	//Initialize mouse coordinates to 0,0
	var mouse = { x: 0, y: 0};

	//Paint includes line width, line cap, and color
	paint = function() {
		tempCtx.lineTo(mouse.x, mouse.y);
		tempCtx.lineWidth = lineWidthRange();
		tempCtx.lineJoin = 'round';
		tempCtx.lineCap = brushstyle;
		tempCtx.strokeStyle = colors;
		tempCtx.stroke();
		ctx.drawImage(tempCanvas, 0, 0);
	};

	//Find mouse coordinates relative to canvas
	linesMousemove = function(e){
		mouse.x = e.pageX - this.offsetLeft;
		mouse.y = e.pageY - this.offsetTop;
	};

	//User clicks down on canvas to trigger paint
	linesMousedown = function(){
		tempCtx.beginPath();
		tempCtx.moveTo(mouse.x, mouse.y);
		canvas.addEventListener('mousemove', paint, false);
	};

	//When mouse lifts up, line stops painting
	linesMouseup = function(){
		
		canvas.removeEventListener('mousemove', paint, false);
	};

	//When mouse leaves canvas, line stops painting
	linesMouseout = function() {
		canvas.removeEventListener('mousemove', paint, false);
	};

	//Event listeners that will trigger the paint functions when
	//mousedown, mousemove, mouseup, mouseout
	canvas.addEventListener('mousedown', linesMousedown, false);
	canvas.addEventListener('mousemove', linesMousemove, false);
	canvas.addEventListener('mouseup', linesMouseup, false);
	canvas.addEventListener('mouseout', linesMouseout, false);

};

//Color palette
var colors;
var id = undefined
function changeColors(palette) {
	const paletteColors = {
		"red": "red",
		"red1": "#F16161",
		"red2": "#F69FA0",
		"orange": "orange",
		"orange1": "#F99F62",
		"orange2": "#FBB57B",
		"blue": "#09C2DB",
		"blue1": "#8BD3DC",
		"blue2": "#B9E3E8",
		"indigo": "#0E38AD",
		"indigo1": "#546AB2",
		"indigo2": "#9C96C9",
		"green": "green",
		"green1": "#97CD7E",
		"green2": "#C6E2BB",
		"black": "black",
		"black1": "#545454",
		"black2": "#B2B2B2",
		"yellow": "yellow",
		"yellow1": "#F7F754",
		"yellow2": "#F7F4B1",
		"purple": "#B9509E",
		"purple1": "#D178B1",
		"purple2": "#E3ABCE",
		"erase": "white"
	};
	colors = paletteColors[palette.id] || "defaultColor";
	document.getElementById("colorFill").style = `background:${paletteColors[palette.id]}` 
	if(id != undefined){
		document.getElementById(id).style = 'outline: none;';
	}
	
	id = palette.id
	document.getElementById(id).style = 'outline: rgb(55, 55, 55) 2px solid;';
	
	 
	
};

//Change brush style
var brushstyle;
function changeBrushStyle(obj) {
	switch(obj.id) {
		case "round":
			brushstyle = "round";
			break;
		case "square":
			brushstyle = "butt";
			break;
		case "rough":
			brushstyle = "square";
			break;
	}
};

//Change line width
function lineWidthRange() {
    var widthLine = document.getElementById("myRange").value;
    return widthLine;
};

//Clear canvas
function erase() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	tempCtx.clearRect(0, 0, canvas.width, canvas.height);
};

//Save image
var button = document.getElementById('dwnld');
button.addEventListener('click', function (e) {
var dataURL = canvas.toDataURL('image/png');
button.href = dataURL;

});

//Прямоугольник
function rectangle() {
    removeBrushEventListeners();
    // Initialize mouse coordinates to 0,0
    var mouse = { x: 0, y: 0 };

    // Draw rectangle
    let draw = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.strokeStyle = colors;
        ctx.lineWidth = lineWidthRange();
        if (colors === "white") ctx.strokeStyle = "black";
        ctx.rect(mouse.x, mouse.y, mouse.w, mouse.h);
		ctx.drawImage(tempCanvas, 0, 0);
        ctx.stroke();
        
    };

    rectMouseMove = function (e) {
        mouse.w = (e.pageX - this.offsetLeft) - mouse.x;
        mouse.h = (e.pageY - this.offsetTop) - mouse.y;
    };

    rectMouseDown = function (e) {
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        canvas.addEventListener('mousemove', draw, false);
    };

    rectMouseUp = function () {
        tempCtx.drawImage(canvas, 0, 0);
        canvas.removeEventListener('mousemove', draw, false);
		canvas.removeEventListener('mousedown', rectMouseDown);
		canvas.removeEventListener('mouseup', rectMouseUp);
		canvas.removeEventListener('mousemove', rectMouseMove);
		canvas.removeEventListener('mouseout', rectMouseout);

    };

    rectMouseout = function () {
        canvas.removeEventListener('mousemove', draw, false);
    };

    canvas.addEventListener('mousedown', rectMouseDown, false);
    canvas.addEventListener('mouseup', rectMouseUp, false);
    canvas.addEventListener('mousemove', rectMouseMove, false);
    canvas.addEventListener('mouseout', rectMouseout, false);
};
///Рисование Овала
function oval() {
	removeBrushEventListeners();
	var centerX = 0;
	var centerY = 0;
	
	drawOval = function() {
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	  ctx.beginPath();
	  // Рассчитываем расстояние от текущих координат мыши до центра овала
	  const distanceX = mouseX - centerX;
	  const distanceY = mouseY - centerY;
	  // Используем расстояние для определения размера овала
	  ctx.ellipse(centerX, centerY, Math.abs(distanceX), Math.abs(distanceY), 0, 0, 2 * Math.PI);
	  ctx.drawImage(tempCanvas, 0, 0);
	  ctx.stroke();
	}
  
	ovalMouseMove = function (e) {
	  const rect = canvas.getBoundingClientRect();
	  mouseX = e.clientX - rect.left;
	  mouseY = e.clientY - rect.top;
	  // Обновляем значения width и height в зависимости от расстояния до центра
	  width = Math.abs(mouseX - centerX);
	  height = Math.abs(mouseY - centerY);
	};
	
	ovalMouseDown = function (e) {
	  centerX = e.pageX - this.offsetLeft;
	  centerY = e.pageY - this.offsetTop;
	  canvas.addEventListener('mousemove', drawOval, false);
	};
	
	ovalMouseUp = function () {
	  tempCtx.drawImage(canvas, 0, 0);
	  canvas.removeEventListener('mousemove', drawOval, false);
	  canvas.removeEventListener('mousedown', ovalMouseDown);
	  canvas.removeEventListener('mouseup', ovalMouseUp);
	  canvas.removeEventListener('mousemove', ovalMouseMove);
	  canvas.removeEventListener('mouseout', ovalMouseout);
	};
	
	ovalMouseout = function () {
	  canvas.removeEventListener('mousemove', drawOval, false);
	};
	
	canvas.addEventListener('mousedown', ovalMouseDown, false);
	canvas.addEventListener('mouseup', ovalMouseUp, false);
	canvas.addEventListener('mousemove', ovalMouseMove, false);
	canvas.addEventListener('mouseout', ovalMouseout, false);
  };

////Треугольник
function triangle() {

	let numberOfTriangleVertices = 0;
	removeBrushEventListeners()
	function drawLines() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
	
		ctx.moveTo(firstX, firstY);
		ctx.lineTo(movableX, movableY);
	
		ctx.moveTo(fixedX, fixedY);
		ctx.lineTo(movableX, movableY);
	
		ctx.drawImage(tempCanvas, 0, 0);		
		ctx.strokeStyle = colors;
        ctx.lineWidth = lineWidthRange();
        if (colors === "white") ctx.strokeStyle = "black";
		ctx.stroke();
	}
	function handleMouseMove(e) {
    	movableX = e.pageX - this.offsetLeft;
    	movableY = e.pageY - this.offsetTop;

        switch (numberOfTriangleVertices) {
            case 0:
                break;
            case 1:	
                drawLine();
                break;
            case 2:

                drawLines();
                break;
            case 3:
				ctx.drawImage(tempCanvas, 0, 0);
                canvas.removeEventListener('mousedown', handleMouseDown);
                canvas.removeEventListener('mousemove', handleMouseMove);
                break;
        }
    }
	function handleMouseDown(e) {
		numberOfTriangleVertices++;
		fixedX = e.pageX - this.offsetLeft;
		fixedY = e.pageY - this.offsetTop;
	
		if (numberOfTriangleVertices === 1) {
			firstX = fixedX;
			firstY = fixedY;
		}
		tempCtx.drawImage(canvas, 0, 0);
	}
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
}

///Прямая линия 
function straightLine()
{
	let numberOfPoints = 0;
	removeBrushEventListeners();

	function handleMouseMove(e) {
    	movableX = e.pageX - this.offsetLeft;
    	movableY = e.pageY - this.offsetTop;

        switch (numberOfPoints) {
            case 1:	
                drawLine();
                break;
            case 2:
                drawLine();
				ctx.drawImage(tempCanvas, 0, 0);
                canvas.removeEventListener('mousedown', handleMouseDown);
                canvas.removeEventListener('mousemove', handleMouseMove);
                break;
        }
    }
	function handleMouseDown(e) {
		numberOfPoints++;
		fixedX = e.pageX - this.offsetLeft;
		fixedY = e.pageY - this.offsetTop;
	
		if (numberOfPoints === 1) {
			firstX = fixedX;
			firstY = fixedY;
		}
		tempCtx.drawImage(canvas, 0, 0);
	}
	canvas.addEventListener('mousedown', handleMouseDown);
	canvas.addEventListener('mousemove', handleMouseMove);
}

/// вспомогательные функциии
function removeBrushEventListeners(){
	canvas.removeEventListener('mousedown', linesMousedown);
	canvas.removeEventListener('mousemove', linesMousemove);
	canvas.removeEventListener('mouseup', linesMouseup);
	canvas.removeEventListener('mouseout', linesMouseout);
}	

function drawLine() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.moveTo(fixedX, fixedY);
	ctx.lineTo(movableX, movableY);
	ctx.drawImage(tempCanvas, 0, 0);		
	ctx.strokeStyle = colors;
	ctx.lineWidth = lineWidthRange();
	if (colors === "white") ctx.strokeStyle = "black";
	ctx.stroke();		
}

///Заливка
function colorFill() {
    removeBrushEventListeners();

    var mouse = { x: 0, y: 0 };
    const fillColor = colors;
    const visited = new Set();
    const stack = [];
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    function isInsideCanvas(x, y) {
        return x >= 0 && x < canvas.width && y >= 0 && y < canvas.height;
    }

    function setPixel(x, y) {
        tempCtx.fillStyle = fillColor;
        tempCtx.fillRect(x, y, 1, 1);
    }

    function pushPixel(x, y) {
        const key = `${x}-${y}`;
        if (!visited.has(key) && isInsideCanvas(x, y)) {
            stack.push({ x, y });
            visited.add(key);
        }
    }

    function floodFill(startX, startY) {
        const targetColor = getPixelColor(startX, startY);
        stack.push({ x: startX, y: startY });

        while (stack.length) {
            const { x, y } = stack.pop();
            const pixelColor = getPixelColor(x, y);

            if (compareColors(pixelColor, targetColor)) {
                setPixel(x, y);

                pushPixel(x + 1, y);
                pushPixel(x - 1, y);
                pushPixel(x, y + 1);
                pushPixel(x, y - 1);
            }
        }
    }

    let fillMouseDown = function (e) {
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        floodFill(mouse.x, mouse.y);
		ctx.drawImage(tempCanvas, 0, 0);
        canvas.removeEventListener('mousedown', fillMouseDown);
    };

    canvas.addEventListener('mousedown', fillMouseDown, false);

    function getPixelColor(x, y) {
        const index = (y * canvas.width + x) * 4;
        return (
            (imageData.data[index] << 24) |
            (imageData.data[index + 1] << 16) |
            (imageData.data[index + 2] << 8) |
            imageData.data[index + 3]
        );
    }

    function compareColors(color1, color2) {
        return color1 === color2;
    }
}




  





