let rows = 8;
let cols = 15;
let height = 700;
let width = 1500;
let w;
let h;
let grid = new Array(rows);

//A custom button that I created to check if button is hidden
//I know I dont need a new definiton just to check isHidden but I wanted to see how 
//inheritance looks b like in JS
function DisplayButton(text) {
    let hidden = false;

    this.button = createButton(text);
    this.size = function() {
        return this.button.size();
    };
    this.position = function(x, y) {
        this.button.position(x, y);
    };
    this.mousePressed = function(f) {
        this.button.mousePressed(f);
    };
    this.hide = function() {
        this.button.hide();
        this.hidden = true;
    }

    this.show = function() {
        this.button.show();
        this.hidden = false;
    }

    this.resize = function(w, h) {
        this.button.size(w, h);
    }
}

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.x = j * w;
    this.y = i * h;

    this.blocked = false;

    this.buttonEnter = new DisplayButton("enter");
    this.buttonExit = new DisplayButton("exit");
    this.buttonBlock = new DisplayButton("block");
    this.buttonUnblock = new DisplayButton("ub")

    let offsetX = w / 2 - this.buttonEnter.size().width / 2;
    let offsetY = h / 2 - this.buttonEnter.size().height / 2;

    this.buttonEnter.position(this.x + offsetX, this.y + offsetY - this.buttonEnter.size().height / 2);
    // this.buttonEnter.resize(w / 4, h / 4);
    this.buttonEnter.mousePressed(() => {
        this.buttonEnter.hide();
        this.buttonExit.show();
        // console.log(this);
    });

    this.buttonExit.position(this.x + offsetX, this.y + offsetY - this.buttonEnter.size().height / 2);
    this.buttonExit.mousePressed(() => {
        this.buttonExit.hide();
        this.buttonEnter.show();
    })
    this.buttonExit.hide();

    this.buttonBlock.position(this.x + offsetX, this.y + offsetY + this.buttonEnter.size().height / 2);
    this.buttonBlock.mousePressed(() => {
        this.buttonUnblock.show();
        this.buttonBlock.hide();
        this.buttonExit.hide();
        this.buttonEnter.hide();
        this.blocked = true;
    });


    this.buttonUnblock.position(this.x + offsetX, this.y + offsetY);
    this.buttonUnblock.mousePressed(() => {
        this.buttonBlock.show();
        this.buttonUnblock.hide();
        this.buttonEnter.show();
        this.blocked = false;
    });
    this.buttonUnblock.hide();
    this.show = function() {
        if (this.blocked) {
            fill(51);
        } else if (!this.buttonEnter.hidden) {
            fill(color(0, 0, 255, 100));
        } else {
            fill(color(0, 255, 0, 100));
        }
        rect(this.x, this.y, w, h);
    }
}

function setup() {
    createCanvas(width, height);
    w = width / cols;
    h = height / rows;

    //create grid
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
    }

    //create cells
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = new Cell(i, j);
        }
    }
}

function draw() {
    background(51);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j].show();
        }
    }
}