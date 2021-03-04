const directions = {
    TOP: "top",
    RIGHT: "right",
    BOTTOM: "bottom",
    LEFT: "left",
};

let width = 600,
    height = 600;

let cols = 20,
    rows = 20;

let w = width / cols,
    h = height / rows;

let cells = new Array(rows);

//variables for maze creation
let current;

let maze = [];
let remaining = [];
let path = [];
let stack = [];
let next;
let start;

//Cell defitinion
function Cell(i, j) {
    //coordinates
    this.i = i;
    this.j = j;
    this.x = j * w;
    this.y = i * h;

    // Button
    // for debugging
    // this.button = createButton("get");
    // let offsetX = w / 2 - this.button.size().width / 2;
    // let offsetY = h / 2 - this.button.size().height / 2;
    // this.button.position(this.x + offsetX, this.y + offsetY);
    // this.button.mousePressed(_ => {
    //     console.log(this);
    // });


    //variables for maze creation
    // 0 -> top, 1 -> 
    this.direction;
    this.wentTo;

    //not actually part of the algorithm, used for visualization
    this.visited = false;
    this.walls = {
        top: true,
        right: true,
        bottom: true,
        left: true
    };


    this.show = function(col) {
        noStroke();
        fill(col);
        rect(this.x, this.y, w, h);
        stroke(1);
        if (this.direction == directions.TOP) {
            triangle(this.x + w / 2, this.y + h / 3,
                this.x + 2 * w / 3, this.y + 2 * h / 3,
                this.x + w / 3, this.y + 2 * h / 3);
        }
        if (this.direction == directions.RIGHT) {
            triangle(this.x + 2 * w / 3, this.y + h / 2,
                this.x + w / 3, this.y + 2 * h / 3,
                this.x + w / 3, this.y + h / 3);
        }
        if (this.direction == directions.BOTTOM) {
            triangle(this.x + w / 2, this.y + 2 * h / 3,
                this.x + w / 3, this.y + h / 3,
                this.x + 2 * w / 3, this.y + h / 3);
        }
        if (this.direction == directions.LEFT) {
            triangle(this.x + w / 3, this.y + h / 2,
                this.x + 2 * w / 3, this.y + h / 3,
                this.x + 2 * w / 3, this.y + 2 * h / 3);
        }
        if (this.walls.top) {
            // line(x1, y1, x2, y2);
            line(this.x, this.y, this.x + w, this.y);
        }
        if (this.walls.bottom) {
            line(this.x, this.y + h, this.x + w, this.y + h);
        }
        if (this.walls.right) {
            line(this.x + w, this.y, this.x + w, this.y + h);
        }
        if (this.walls.left) {
            line(this.x, this.y, this.x, this.y + h);
        }

    }
}

function arrayRemove(arr, value) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === value) {
            arr.splice(i, 1);
            break;
        }
    }
}

function setup() {
    createCanvas(width, height);
    // frameRate(5);
    //create 2d array
    for (let i = 0; i < rows; i++) {
        cells[i] = new Array(cols);
    }

    //create cells
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            cells[i][j] = new Cell(i, j);
            remaining.push(cells[i][j]);
        }
    }

    //setup for maze creation
    let starting_cell = cells[Math.random() * rows | 0][Math.random() * cols | 0];
    maze.push(starting_cell);
    arrayRemove(remaining, starting_cell);

    start = remaining[Math.random() * remaining.length | 0];
    current = start;
}

let path_started = false;

function randomNeighbor(current) {
    let neighbors = [];
    if (current.i > 0) {
        neighbors.push(cells[current.i - 1][current.j]);
    }
    if (current.i < rows - 1) {
        neighbors.push(cells[current.i + 1][current.j]);
    }
    if (current.j > 0) {
        neighbors.push(cells[current.i][current.j - 1]);
    }
    if (current.j < cols - 1) {
        neighbors.push(cells[current.i][current.j + 1]);
    }

    if (neighbors.length > 0) {
        return neighbors[Math.random() * neighbors.length | 0];
    }
    return undefined;
}

function setDirection(current, next) {
    let y = next.i - current.i;
    let x = next.j - current.j;

    if (x === 1) {
        current.direction = directions.RIGHT;
    }
    if (x === -1) {
        current.direction = directions.LEFT;
    }
    if (y === 1) {
        current.direction = directions.BOTTOM;
    }
    if (y === -1) {
        current.direction = directions.TOP;
    }
}

function removeWalls(cells) {

}

function extendMaze() {
    let tmp = start;
    let path_from = [];
    while (!maze.includes(tmp)) {
        path_from.push(tmp);
        tmp = tmp.wentTo;
    }
    path_from.push(tmp);

    for (let i = 0; i < path_from.length - 1; i++) {
        path_from[i].walls[path_from[i].direction] = false;
    }

    for (let i = path_from.length - 1; i > 0; i--) {
        if (path_from[i - 1].direction == directions.TOP) {
            path_from[i].walls.bottom = false;
        }
        if (path_from[i - 1].direction == directions.BOTTOM) {
            path_from[i].walls.top = false;
        }
        if (path_from[i - 1].direction == directions.RIGHT) {
            path_from[i].walls.left = false;
        }
        if (path_from[i - 1].direction == directions.LEFT) {
            path_from[i].walls.right = false;
        }
    }



    for (let i = 0; i < path_from.length; i++) {
        maze.push(path_from[i]);
        arrayRemove(remaining, path_from[i]);
    }
}

function randomWalk() {
    if (maze.includes(current)) {
        console.log("push path to maze");
        //add current path to maze
        extendMaze();

        //reset path
        if (remaining.length == 0) {
            //done
            console.log("done");
            noLoop();
        } else {
            start = current = remaining[Math.random() * remaining.length | 0];
            for (let i = 0; i < path.length; i++) {
                path[i].direction = undefined;
            }
            path = [];
        }
    } else {
        path.push(current);
        let next = randomNeighbor(current);

        setDirection(current, next);

        current.wentTo = next;
        current = next;
    }
}


function draw() {
    background(51);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            cells[i][j].show(color(120, 70, 250, 100));
        }
    }


    for (let i = 0; i < path.length; i++) {
        path[i].show(color(70, 0, 70));
    }

    let tmp = start;
    let path_from = [];
    while (!maze.includes(tmp) && tmp) {
        if (path_from.includes(tmp)) {
            break;
        }
        path_from.push(tmp);
        tmp = tmp.wentTo;
    }

    for (let i = 0; i < path_from.length; i++) {
        path_from[i].show(color(100, 120, 60));
    }

    randomWalk();

    current.show(color(50, 50, 50));

    start.show(color(150, 150, 50));

    for (let i = 0; i < maze.length; i++) {
        maze[i].show(color(0, 70, 70));
    }


}