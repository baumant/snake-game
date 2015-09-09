var grid = {
    dim: 25
};

var box = "<div class='box'> </div>",
	fps = 10,
	score = 0,
	highscore = 0,
	snakeCurrent = [ [10, 12], [11, 12], [12, 12] ],
	dir = "right",
	food = {
    position: [(Math.floor((Math.random() * grid.dim) + 1)), (Math.floor((Math.random() * grid.dim) + 1))]
	},
	eating = false,
	paused = false,
	endgame = false;

function render(grid) {

    var col = 1;
    var row = 1;
    for (var x = 1; x <= (grid.dim * grid.dim); x++) {

        if (x % grid.dim === 0) {
            $('.container').append(box).children(':last').attr('data-pos', [col, row]);

            col += 1;
            $('.container').append('<br>');
            col = 1;
            row += 1;

        } else {
            $('.container').append(box);
            $('.container').children(':last').attr('data-pos', [col, row]);
            col += 1;
        }
    }
}

function createSnake() {
    snakeHead = snakeCurrent[snakeCurrent.length - 1];
    for (var i = snakeCurrent.length - 1; i >= 0; i--) {
        $('*[data-pos="' + snakeCurrent[i] + '"]').addClass('snake');
    }
}

$(document).keydown(function(event) {
    if (event.keyCode == 40 && dir != "down" && dir != "up" && !paused && !endgame) {
        dir = "down";
        move();
    } else if (event.keyCode == 39 && dir != "right" && dir != "left" && !paused && !endgame) {
        dir = "right";
        move();
    } else if (event.keyCode == 38 && dir != "down" && dir != "up" && !paused && !endgame) {

        dir = "up";
        move();

    } else if (event.keyCode == 37 && dir != "right" && dir != "left" && !paused && !endgame) {

        dir = "left";
        move();

    } else if (event.keyCode == 27) {
        paused = true;

    }

});

function pause() {
    $('.pause').addClass('on');
    $('.resume').click(function() {
        paused = false;
        $('.pause').removeClass('on');

    });
    $('.new-game').click(function() {
        paused = false;
        endgame = true;
        $('.pause').removeClass('on');

    });
}

function move() {

    if (dir == "right") {
        moveRight();
    } else if (dir == "left") {
        moveLeft();
    } else if (dir == "up") {
        moveUp();
    } else if (dir == "down") {
        moveDown();
    }



    if (!eating) {
        $('*[data-pos="' + snakeCurrent[0] + '"]').removeClass('snake');
        snakeCurrent.shift();
    } else {
        dropFood();
        eating = false;
    }

    snakeHead = snakeCurrent[snakeCurrent.length - 1];

    isHit();
    isEating();

    $('*[data-pos="' + snakeHead + '"]').addClass('snake');
}


function moveRight() {
    snakeCurrent.push([(snakeHead[0] + 1), snakeHead[1]]);
}

function moveLeft() {
    snakeCurrent.push([(snakeHead[0] - 1), (snakeHead[1])]);
}

function moveUp() {
    snakeCurrent.push([(snakeHead[0]), (snakeHead[1] - 1)]);
}

function moveDown() {
    snakeCurrent.push([(snakeHead[0]), (snakeHead[1] + 1)]);
}

function dropFood() {
    food.position = [(Math.floor((Math.random() * grid.dim) + 1)), (Math.floor((Math.random() * grid.dim) + 1))];
    $('*[data-pos="' + food.position + '"]').addClass('food');
}

function isHit() {
    if (snakeHead[0] === 0 || snakeHead[0] === (grid.dim + 1) || snakeHead[1] === 0 || snakeHead[1] === (grid.dim + 1)) {
        endgame = true;
    }

    for (var i = snakeCurrent.length - 2; i >= 0; i--) {
        if (snakeHead[0] === snakeCurrent[i][0] && snakeHead[1] === snakeCurrent[i][1]) {
            endgame = true;
        }
    }
}

function isEating() {
    if ($('*[data-pos="' + snakeHead + '"]').hasClass('food')) {
        $('*[data-pos="' + food.position + '"]').removeClass('food');
        eating = true;
        score += 1;
        $('.score').text(score);
        fps += (0.5);
    }
}


function gameOver() {

    $('.game-over').addClass('on');

    if (score > highscore) {
        $('.game-over h1').append('<br>HIGHSCORE!!');
        highscore = score;
        $(".highscore").text(score);

    }

    $('.new-game').click(function() {
        $('.game-over h1').text('GAME OVER');
        endgame = false;
        $('.game-over').removeClass('on');
        $('.snake').removeClass('snake');
        snakeCurrent = [
            [10, 12],
            [11, 12],
            [12, 12]
        ];
        createSnake();
        dir = "right";
        score = 0;
        $(".score").text(score);
        fps = 10;
    });


}

function gameLoop() {
    if (!paused && !endgame) {

        move();

    } else {
        if (paused) {
            pause();
        } else if (endgame) {
            gameOver();
        }
    }
    setTimeout(gameLoop, 1000 / fps);
}


$(document).ready(function() {
    render(grid);
    createSnake();
    dropFood();
    gameLoop();

});
