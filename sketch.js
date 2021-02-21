//Canvas variables
let rows = 10;
let cols = 10;
let w;
let h;
//Grid vardiables
let grid = new Array(rows);

//algo variables
let current;
let stack = [];


//Cell defitinion
function Cell(i, j) {
    //coordinates
    this.i = i;
    this.j = j;
    this.x = j * w;
    this.y = i * h;

    //for maze creation
    //Top-Right-Bottom-Left
    this.isWall = false;
    this.visited = false;

    //Button for debugging
    // this.button = createButton("get");
    // let offsetX = w / 2 - this.button.size().width / 2;
    // let offsetY = h / 2 - this.button.size().height / 2;
    // this.button.position(this.x + offsetX, this.y + offsetY);
    // this.button.mousePressed(_ => {
    //     console.log(this);
    // });


    this.show = function(col) {
        //cell
        if (this.isWall) {
            fill(51);
        } else if (!this.visited) {
            fill(col);
        } else {
            fill(color(218, 112, 214, 100));
        }
        noStroke();
        rect(this.x, this.y, w, h);
    }
}


//Drawign functions

function setup() {
    //set canvas
    createCanvas(600, 600);
    w = width / cols;
    h = height / rows;

    //create grid
    for (let i = 0; i < rows; i++) {
        grid[i] = (new Array(cols));
    }

    //create cells
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = new Cell(i, j);
        }
    }

    //setup for maze creation
    current = grid[0][0];

    //create maze
    while (true) {
        current.visited = true;
        let next = checkForNext(current);
        if (next) {
            //need to check if this nodes causes a connection
            if (checkForConnection(next)) {
                next.visited = true;
                next.isWall = true;
            } else {
                stack.push(current);
                current = next;
            }

        } else if (stack.length > 0) {
            current = stack.pop();
        } else {
            //Done?
            console.log("Done!");
            break;
        }
    }

    //set final to not wall
    grid[rows - 1][cols - 1].isWall = false;
}

function checkForNext(current) {
    let neighbors = [];

    //check for top neighbor
    if (current.i > 0 && !grid[current.i - 1][current.j].visited && !grid[current.i - 1][current.j].isWall) {
        neighbors.push(grid[current.i - 1][current.j]);
    }

    //check for right
    if (current.j < cols - 1 && !grid[current.i][current.j + 1].visited && !grid[current.i][current.j + 1].isWall) {
        neighbors.push(grid[current.i][current.j + 1]);
    }

    //check for bottom
    if (current.i < rows - 1 && !grid[current.i + 1][current.j].visited && !grid[current.i + 1][current.j].isWall) {
        neighbors.push(grid[current.i + 1][current.j]);
    }

    //check for left
    if (current.j > 0 && !grid[current.i][current.j - 1].visited && !grid[current.i][current.j - 1].isWall) {
        neighbors.push(grid[current.i][current.j - 1]);
    }

    if (neighbors.length > 0) {
        return neighbors[Math.floor(Math.random() * neighbors.length)];
    } else {
        return undefined;
    }
}


function checkForConnection(current) {
    let count = 0;
    if (current.i > 0 && grid[current.i - 1][current.j].visited && !grid[current.i - 1][current.j].isWall) {
        //check for top
        count++;
    }
    if (current.i < rows - 1 && grid[current.i + 1][current.j].visited && !grid[current.i + 1][current.j].isWall) {
        //check for bottom
        count++;
    }
    if (current.j > 0 && grid[current.i][current.j - 1].visited && !grid[current.i][current.j - 1].isWall) {
        //check for left
        count++;
    }
    if (current.j < cols - 1 && grid[current.i][current.j + 1].visited && !grid[current.i][current.j + 1].isWall) {
        //check for right
        count++;
    }
    return count >= 2;
}

function draw() {

    background(51);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j].show(color(10, 100, 10, 100));
        }
    }




}