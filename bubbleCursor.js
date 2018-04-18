function shuffle(a) {
    for ( i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function newTarget() {
    Target = Target + 1;
    var densityIndex = parameter[Trial - 1].densityIndex;
    var widthIndex = parameter[Trial - 1].widthIndex;
    var ratioIndex = parameter[Trial - 1].ratioIndex;
    $('.circle').remove();
    if (Target == 1) {
        var documentCenter_x = (documentWidth - widthn[widthIndex]) / 2;
        var documentCenter_y = (documentHeight - widthn[widthIndex]) / 2;
        currentRadius = widthn[widthIndex] / 2;
        createCircle("startCircle", widthn[widthIndex], widthn[widthIndex], documentCenter_x, documentCenter_y);
        currentCircles = $('.circle');
        selectedCircle = 0;
        previousCircle = 0;
    } else if (Target <= 10) {
        createTarget(widthIndex, densityIndex, ratioIndex);
        currentCircles = $('.circle');
    } else {
        newTrial();
    }
}

function newTrial() {
    Trial = Trial + 1;
    Target = 0;
    incorrectCount = 0;
    documentCenter_x = documentWidth / 2;
    documentCenter_y = documentHeight / 2;
    previous_x = documentWidth / 2;
    previous_y = documentHeight / 2;
    if (Trial <= 27) {
        newTarget();
    } else {
        newBlock();
    }
}

function newBlock() {
    Block = Block + 1;
    Trial = 0;
    Target = 0;
    cursorType = Cursor.pop();
    if (Block <= 4) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        parameter = []
        for (var i = 0; i < widthn.length; i++) {
            for (var j = 0; j < Ratio.length; j++) {
                for (var k = 0; k < Density.length; k++) {
                    var indices = {widthIndex: i, ratioIndex: j, densityIndex: k};
                    parameter.push(indices);
                }
            }
        }
        shuffle(parameter);
        newTrial();
    } else {
        window.location.href='demographics.html';
    }
    $(document.body).off('click');
    $(document.body).off('mousemove');
    if (cursorType == "bubble") {
        $(document.body).on('click', function(e) {
            var circle = currentCircles[selectedCircle];
            if (circle.classList.contains('correct') && mouseMoved) {
                endTime = new Date().getTime();
                var time = endTime - startTime;
                $(this).trigger('log', ['timeEvent', {cursorType: cursorType, Block: Block, Trial: Trial, Target: Target, Amplitude: distance, width: widthn[parameter[Trial - 1].widthIndex], R: Ratio[parameter[Trial - 1].ratioIndex], D:Density[parameter[Trial - 1].densityIndex], time: time, errors: incorrectCount}]);
                startTime = endTime;
                incorrectCount = 0;
                newTarget();
                var titleText = "Block#: " + Block + ",  Trial#: " + Trial + ",  Target#: " + Target;
                $('.title').text(titleText);
            } else if (circle.classList.contains('start')) {
                startTime = new Date().getTime();
                newTarget();
                var titleText = "Block#: " + Block + ",  Trial#: " + Trial + ",  Target#: " + Target;
                $('.title').text(titleText);
            } else {
                incorrectCount = incorrectCount + 1;
            }
            mouseMoved = false;
        });
        $(document.body).on('mousemove', function(e) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            var radius = findRadius(e.clientX, e.clientY);
            if (radius.additionalBubble) {
                context.beginPath();
                context.arc(e.clientX, e.clientY, radius.circleRadius, 0, Math.PI * 2, true);
                context.fillStyle = "grey";
                context.fill();
                context.arc(radius.leftOffset + currentRadius, radius.topOffset + currentRadius, radius.sepCircleRadius, 0, Math.PI * 2, true);
                context.fillStyle = "grey";
                context.fill();
            } else {
                context.beginPath();
                context.arc(e.clientX, e.clientY, radius.circleRadius, 0, Math.PI * 2, true);
                context.fillStyle = "grey";
                context.fill();
            }
            mouseMoved = true;
        });
    }
}

$(document).ready(function() {
    $('.startExperiment').on('mouseup', function(e) {
        $('.startExperiment').remove();
        $('.titleExperiment').remove();
        $('.instructionExperiment').remove();
        $("<div>").addClass('infoBar titleText title').appendTo($('.homeExperiment')).text('please start by clicking on red circle');
        $('.homeExperiment').css({"flex-flow": "row nowrap"});
        document.body.style.cursor = "crosshair";
        documentWidth = $(window).width();
        documentHeight = $(window).height();
        documentCenter_x = documentWidth / 2;
        documentCenter_y = documentHeight / 2;
        canvas = $('.canvas')[0];
        context = canvas.getContext('2d');
        context.globalAlpha = 0.1;
        canvas.width = documentWidth;
        canvas.height = documentHeight;
        var indices = {widthIndex: parseInt(widthn.length * Math.random()), ratioIndex: parseInt(Ratio.length * Math.random()), densityIndex: parseInt(Density.length * Math.random())};
        parameter.splice(0, 0, indices);
        newBlock();
    });
});

function createCircle(circleType, width, height, left, top) {
    var backgroundColor;
    var classToAdd;
    if(circleType == "startCircle"){
        backgroundColor = "red";
        classToAdd = "circle start";
    }
    else if(circleType == "targetCircle"){
        backgroundColor = "green";
        classToAdd = "circle correct";
    }
    else if(circleType == "distracterCircle"){
        backgroundColor = "grey";
        classToAdd = "circle";
    }

    $("<div>").addClass(classToAdd).css({"position": "absolute", "top": top + "px", "left": left + "px", "height": height + "px", "width": width + "px", "backgroundColor": backgroundColor, "zIndex": 1}).appendTo(document.body).on('click', function(e) {
        if (cursorType == "pointer") {
            if(circleType == "startCircle"){
                startTime = new Date().getTime();
                newTarget();
                var titleText = "Block#: " + Block + ",  Trial#: " + Trial + ",  Target#: " + Target;
                $('.title').text(titleText);
            }
            else if(circleType == "targetCircle"){
                endTime = new Date().getTime();
                var time = endTime - startTime;
                // console.log(widthIndex);
                console.log(widthn[parameter[Trial - 1]]);//un
                console.log(Trial-1);//0
                 console.log(parameter[Trial - 1]);//obj
                 console.log(parameter[Trial - 1].widthIndex);//0
                console.log(widthn[parameter[Trial - 1].widthIndex]);//un
                $(this).trigger('log', ['timeEvent', {cursorType: cursorType, Block: Block, Trial: Trial, Target: Target, Amplitude: distance, width: widthn[parameter[Trial - 1].widthIndex], R: Ratio[parameter[Trial - 1].ratioIndex], D:Density[parameter[Trial - 1].densityIndex], time: time, errors: incorrectCount}]);
                startTime = endTime;
                incorrectCount = 0;
                newTarget();
                var titleText = "Block#: " + Block + ",  Trial#: " + Trial + ",  Target#: " + Target;
                $('.title').text(titleText);
            }
            else if(circleType == "distracterCircle"){
                incorrectCount = incorrectCount + 1;
            }
        }
    });
}

function createTarget(widthIndex, densityIndex, ratioIndex) {
    var randomAngle;
    if (documentCenter_x <= documentWidth / 2 && documentCenter_y <= documentHeight / 2) {
        randomAngle = Math.PI / 2 * (0.55 + Math.random() * 0.45);
    } else if (documentCenter_x > documentWidth / 2 && documentCenter_y > documentHeight / 2) {
        randomAngle =  Math.PI / 2 * (2 + 0.55 + Math.random() * 0.45);
    } else if (documentCenter_x > documentWidth / 2 && documentCenter_y < documentHeight / 2) {
        randomAngle =  Math.PI / 2 * (1 + 0.55 + Math.random() * 0.45);
    } else {
        randomAngle =  Math.PI / 2 * (3 + 0.55 + Math.random() * 0.45);
    }
    distance = Amplitude[shuffle([0, 0, 0, 1, 1, 1, 2, 2, 2]).pop()];

    var edgeCircles = [[1, 1], [-1, -1]];
    var effectiveWidth = Ratio[ratioIndex] * widthn[widthIndex];

    var X = documentCenter_x - widthn[widthIndex] / 2 + Math.cos(randomAngle) * distance;
    var Y = documentCenter_y - widthn[widthIndex] / 2 + Math.sin(randomAngle) * distance;

    previous_x = documentCenter_x;
    previous_y = documentCenter_y;
    documentCenter_x = X;
    documentCenter_y = Y;

    for (var i = 0; i < edgeCircles.length; i++) {
        createCircle("distracterCircle", widthn[widthIndex], widthn[widthIndex], X + edgeCircles[i][0] * Math.cos(randomAngle) * (widthn[widthIndex] / 2 + effectiveWidth), Y + edgeCircles[i][1] * Math.sin(randomAngle) * (widthn[widthIndex] / 2 + effectiveWidth));
        createCircle("distracterCircle", widthn[widthIndex], widthn[widthIndex], X + edgeCircles[i][0] * Math.cos(randomAngle + Math.PI / 2) * (widthn[widthIndex] / 2 + effectiveWidth), Y + edgeCircles[i][1] * Math.sin(randomAngle + Math.PI / 2) * (widthn[widthIndex] / 2 + effectiveWidth));
    }
    createCircle("targetCircle", widthn[widthIndex], widthn[widthIndex], X, Y);
    createDistracters(widthIndex, densityIndex, effectiveWidth, randomAngle);
}

function createDistracters(widthIndex, densityIndex, effectiveWidth, randomAngle) {
    for (var i = 0; i < 18; i++) {
        for (var circleIndex = 0; circleIndex < Density[densityIndex]; circleIndex++) {
            var collision = true;
            var circles = $('.circle');
            var X = 0;
            var Y = 0;
            while (collision) {
                collision = false;
                var dist = documentWidth / 2;
                dist = Math.max(dist * Math.random(), widthn[widthIndex]);
                X = previous_x + Math.cos(randomAngle - Math.PI * 2 / (2 * 18) + (i - 0.5) * Math.PI * 2 / 18 + Math.random() * Math.PI * 2 / 18) * dist;
                Y = previous_y + Math.sin(randomAngle - Math.PI * 2 / (2 * 18) + (i - 0.5) * Math.PI * 2 / 18 + Math.random() * Math.PI * 2 / 18) * dist;
                for (var i = 0; i < circles.length; i++) {
                    if ((X > circles[i].getBoundingClientRect().left - currentRadius * 5 && X < circles[i].getBoundingClientRect().left + currentRadius * 4 && Y > circles[i].getBoundingClientRect().top  - currentRadius * 5 && Y < circles[i].getBoundingClientRect().top + currentRadius * 4) || (X > documentCenter_x - effectiveWidth * 1.5 && X < documentCenter_x + effectiveWidth * 1.5 && Y > documentCenter_y - effectiveWidth * 1.5 && Y < documentCenter_y + effectiveWidth * 1.5)) {
                        collision = true;
                        break;
                    }
                }
            }
            createCircle("distracterCircle", widthn[widthIndex], widthn[widthIndex], X, Y);
        }
    }
}

function findRadius(X, Y) {
    var min = [];
    var max = [];
    var firstLow = {index: 0, distance: documentWidth, leftOffset: 0, topOffset: 0};
    var secondLow = {index: 0, distance: documentWidth, leftOffset: 0, topOffset: 0};
    for (var i = 0; i < currentCircles.length; i++) {
        var centerDist = Math.sqrt((X - (currentCircles[i].getBoundingClientRect().left + currentRadius)) * (X - (currentCircles[i].getBoundingClientRect().left + currentRadius)) + (Y - (currentCircles[i].getBoundingClientRect().top + currentRadius)) * (Y - (currentCircles[i].getBoundingClientRect().top + currentRadius)));
        var minDist = centerDist - currentRadius > 0 ? centerDist - currentRadius : currentRadius;
        var maxDist = centerDist + currentRadius;
        min.push(minDist);
        max.push(maxDist);
        if (minDist < firstLow.distance) {
            secondLow.index = firstLow.index;
            secondLow.distance = firstLow.distance;
            secondLow.leftOffset = firstLow.leftOffset;
            secondLow.topOffset = firstLow.topOffset;
            firstLow.distance = minDist;
            firstLow.index = i;
            firstLow.leftOffset = currentCircles[i].getBoundingClientRect().left;
            firstLow.topOffset = currentCircles[i].getBoundingClientRect().top;
        } else if (minDist < secondLow.distance) {
            secondLow.distance = minDist;
            secondLow.index = i;
            secondLow.leftOffset = currentCircles[i].getBoundingClientRect().left;
            secondLow.topOffset = currentCircles[i].getBoundingClientRect().top;
        }
    }
    selectedCircle = firstLow.index;
    currentCircles[previousCircle].style.backgroundColor = currentCircles[previousCircle].classList.contains('correct') ? "green" : "grey";
    currentCircles[selectedCircle].style.backgroundColor = "red";
    previousCircle = selectedCircle;
    if (max[firstLow.index] + 20 > secondLow.distance && currentCircles.length != 1) {
        return {additionalBubble: true, circleRadius: secondLow.distance * 0.9, sepCircleRadius: Math.max((currentRadius + firstLow.distance - secondLow.distance * 0.8) * 1.02, currentRadius * 3), leftOffset: firstLow.leftOffset, topOffset: firstLow.topOffset};
    } else {
        return {additionalBubble: false, circleRadius: max[firstLow.index], leftOffset: firstLow.leftOffset, topOffset: firstLow.topOffset};
    }
}

var documentWidth;
var documentHeight;
var Amplitude = [256/3, 512/3, 768/3];
var widthn = [8, 16, 32];
var Ratio = [1.33, 2, 3];
var Density = [0, 2, 4];
// var Density = [0, 0.5, 1];
var parameter = [];
var Block = 0;
var Trial = 0;
var Target = 0;
var Cursor = shuffle(["pointer", "pointer", "bubble", "bubble"]);
var cursorType = "";
var canvas;
var context;
var currentRadius;
var incorrectCount = 0;
var distance = 0;
var selectedCircle = 0;
var previousCircle = 0;
var startTime = 0;
var endTime = 0;
var currentCircles = [];
var mouseMoved = false;
var documentCenter_x = documentWidth / 2;
var documentCenter_y = documentHeight / 2;
var previous_x = documentWidth / 2;
var previous_y = documentHeight / 2;