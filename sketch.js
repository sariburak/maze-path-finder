//Canvas variables
var rows = 10;
var cols = 10;
var w;
var h;
//Grid vardiables
var grid = new Array(rows);

//algo variables
var current;
var stack = [];


//Wall definition
function Wall(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.show = function() {
        fill(0);
        noStroke();
        line(this.x1, this.y1, this.x2, this.y2);
    }
}

//Cell defitinion
function Cell(i, j) {
    //coordinates
    this.i = i;
    this.j = j;
    this.x = j * w;
    this.y = i * h;

    //for maze creation
    //Top-Right-Bottom-Left
    this.accessible_neigbours = [undefined, undefined, undefined, undefined];
    this.visited = false;

    //Button for debugging
    this.button = createButton("get");
    var offsetX = w / 2 - this.button.size().width / 2;
    var offsetY = h / 2 - this.button.size().height / 2;
    this.button.position(this.x + offsetX, this.y + offsetY);
    this.button.mousePressed(_ => {
        console.log(this);
    });


    this.show = function(col) {
        //cell
        if (!this.visited) {
            fill(col);
        } else {
            fill(color(218, 112, 214, 100));
        }
        noStroke();
        rect(this.x, this.y, w, h);

        //walls
        stroke(255);
        if (!this.accessible_neigbours[0]) {
            //top
            line(this.x, this.y, this.x + w, this.y);
        }
        if (!this.accessible_neigbours[1]) {
            //right
            line(this.x + w, this.y, this.x + w, this.y + w);
        }
        if (!this.accessible_neigbours[2]) {
            //bottom
            line(this.x + w, this.y + w, this.x, this.y + w);
        }
        if (!this.accessible_neigbours[3]) {
            line(this.x, this.y, this.x, this.y + w);
        }
    }
}


//Drawign functions

function setup() {
    //set canvas
    createCanvas(600, 600);
    w = width / cols;
    h = height / rows;

    //create grid
    for (var i = 0; i < rows; i++) {
        grid[i] = (new Array(cols));
    }

    //create cells
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = new Cell(i, j);
        }
    }

    //setup
    current = grid[0][0];
    stack.push(current);
}

function checkForNext(current) {
    var neighbors = [];

    //check for top neighbor
    if (current.i > 0 && !grid[current.i - 1][current.j].visited) {
        neighbors.push(grid[current.i - 1][current.j]);
    }

    //check for right
    if (current.j < cols - 1 && !grid[current.i][current.j + 1].visited) {
        neighbors.push(grid[current.i][current.j + 1]);
    }

    //check for bottom
    if (current.i < rows - 1 && !grid[current.i + 1][current.j].visited) {
        neighbors.push(grid[current.i + 1][current.j]);
    }

    //check for left
    if (current.j > 0 && !grid[current.i][current.j - 1].visited) {
        neighbors.push(grid[current.i][current.j - 1]);
    }

    if (neighbors.length > 0) {
        return neighbors[Math.floor(Math.random() * neighbors.length)];
    } else {
        return undefined;
    }
}


function removeWalls(current, next) {
    var diff_i = current.i - next.i;
    var diff_j = current.j - next.j;
    if (diff_i === 1) {
        current.accessible_neigbours[0] = next;
        next.accessible_neigbours[2] = current;
    }
    if (diff_i === -1) {
        current.accessible_neigbours[2] = next;
        next.accessible_neigbours[0] = current;
    }
    if (diff_j === 1) {
        current.accessible_neigbours[3] = next;
        next.accessible_neigbours[1] = current;
    }
    if (diff_j === -1) {
        current.accessible_neigbours[1] = next;
        next.accessible_neigbours[3] = current;
    }
}

function draw() {
    background(51);
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j].show(color(10, 100, 10, 100));
        }
    }
    current.visited = true;
    var next = checkForNext(current);
    if (next) {
        stack.push(current);

        removeWalls(current, next);

        current = next;
    } else if (stack.length > 0) {
        current = stack.pop();
    } else {
        console.log("done");
        noLoop();
    }

}