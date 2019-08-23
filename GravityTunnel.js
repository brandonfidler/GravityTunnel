// Constants that dictate where to start drawing the graph.
const C_WIDTH = 500;
const C_HEIGHT = 500;
const X_OFFSET = 100;

// **Gravity data plot
// Width of plotting Area
const P_WIDTH = C_WIDTH;
// Height of plotting Area
const P_HEIGHT = 300;
// Width of Graph within plotting Area
const G_WIDTH = (P_WIDTH - 125);
const G_HEIGHT = (P_HEIGHT - 100);

//Now define the absolute coordinates of each of the four corners of
//the plotting area
let ulcorx = Math.trunc(((P_WIDTH - G_WIDTH) / 2.0));
let ulcory = Math.trunc(((P_HEIGHT - G_HEIGHT) / 2.0));
let urcory = ulcory;
let urcorx = ulcorx + G_WIDTH;
let llcorx = ulcorx;
let llcory = ulcory + G_HEIGHT;
let lrcorx = urcorx;
let lrcory = llcory;


// Now define variables that we will need compute plot scale.
const xmin = -250.0;
const xmax = 250.0;
let ymin = 1000.0;
let ymax = -1000.0;
const dmax = 25.0;

// Maximum plotting depth.
let xscale;
let yscale;
let dscale;

//Define Variables used to Describe Model Parameters.
let dx = 1.0;
let rho = -2.67;
let rad = 1.0;
let depth = 5.0;
let std = 0.01;
let ndata = 2;


const canvas = document.querySelector('.gtCanvas');
const rad_canvas = document.querySelector('.gtRadSample');
const ctx = canvas.getContext('2d');
const  r_ctx = rad_canvas.getContext('2d');

// Value for big G and a static value for the random number generator.
const G = (6.67 * Math.pow(10.0, -11.0));
let last_y;

// Font size for graph:



function paint()
{
    // Plot Cross section
    plotXSection();
    // Plot Gravity Data
    plotData();
    // Draw Parameter Labels on lower left side of plot
    labels();
    // Draw Axes
    drawAxis();
}

function drawAxis()
{
    let xint;
    ctx.beginPath();

    ctx.strokeStyle = "black";

    // Do x axis first

    ctx.moveTo(ulcorx, ulcory);
    ctx.lineTo(urcorx, urcory);

    for(xint = xmin; xint <= xmax; xint += 50)
    {
        ctx.moveTo(getDX(xint), ulcory);
        ctx.lineTo(getDX(xint), (ulcory-5));
        ctx.fillText(xint, (getDX(xint)-5), (ulcory-8));
    }

    ctx.fillText("Distance (m)", C_WIDTH/2 - 30, 25);

    //Do gravity value axis
    ctx.moveTo(20+urcorx, urcory);
    ctx.lineTo(20 + lrcorx, lrcory);
    for(xint = ymin; xint <= ymax; xint += Math.abs(ymax-ymin)/5.0)
    {
        ctx.moveTo(20+urcorx, getDY(xint));
        ctx.lineTo(15+urcorx, getDY(xint));
        ctx.fillText(xint.toFixed(3), 22 + urcorx, getDY(xint)+5);
    }
    ctx.fillText("Gravity (mgal)", lrcorx - 30, lrcory + 20);

    //Finally the depth scale
    ctx.moveTo(20+urcorx, P_HEIGHT);
    ctx.lineTo(20 + lrcorx, C_HEIGHT);
    for(xint = 0; xint <= dmax; xint += dmax / 5.0)
    {
        ctx.moveTo((20 + urcorx), Math.trunc(P_HEIGHT + xint * dscale));
        ctx.lineTo(15+urcorx, Math.trunc(P_HEIGHT + xint * dscale));
        ctx.fillText(xint.toFixed(1), 28 + urcorx, Math.trunc(P_HEIGHT + xint * dscale)+5);
    }
    ctx.fillText("Depth (m)", urcorx - 50, C_HEIGHT - 10);
    ctx.closePath();
    ctx.stroke();

}
function plotXSection()
{
    // Draw grass rectangle.
    ctx.beginPath();
    ctx.fillStyle = "#55ee33";
    ctx.rect( (ulcorx - 20), P_HEIGHT, (G_WIDTH + 40), (C_HEIGHT - 50));
    ctx.closePath();
    ctx.fill();
    let TunR = new Circle((C_WIDTH/2 - Math.trunc(rad * dscale)), (getTY() - Math.trunc(rad * dscale)+1), Math.trunc(rad * dscale * 2), "#ff0000");
    let TunB = new Circle((C_WIDTH/2 - Math.trunc(rad * xscale)), (getTY() - Math.trunc(rad * xscale)+1), Math.trunc(rad * xscale * 2), "#000000");
    let s_TunR = new SampCircle((rad_canvas.width/2), rad_canvas.height/2, Math.trunc(rad * dscale * 2), "#ff0000");
    let s_TunB = new SampCircle((rad_canvas.width/2), rad_canvas.height/2, Math.trunc(rad * xscale * 2), "#000000");
    TunR.drawCir();
    TunB.drawCir();
    s_TunR.drawCir();
    s_TunB.drawCir();
    ctx.closePath();
}
// Labels for the plot
function labels()
{
    ctx.fillStyle = "#000000";
    r_ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";
    r_ctx.fillText("Depth: ", 5, 12);
    r_ctx.fillText("Radius: ", 5, 24);
    r_ctx.fillText("Move to Surface ", 83, 24);
    r_ctx.fillText("Move to Deeper Depth", 73, 222);
    r_ctx.fillText("Decrease Radius", 2, 87);
    r_ctx.fillText("Increase Radius", 159, 87);
}
// This will make the particles for the function here.
function drawParticle(x, y)
{
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0,2*Math.PI);
    ctx.strokeStyle = "#0000bb";
    ctx.stroke();
    ctx.closePath();
}
//Plots the particles on to the canvas.
function plotData()
{
    let x;
    let temp;
    for (x = xmin; x <= xmax; x += dx)
    {
        temp = getG(x);
        drawParticle(getDX(x), getDY(temp));
    }
}
function getG(x)
{
    let save;
    save = (2.0*G*Math.PI*Math.pow(rad, 2.0) * depth * rho /
        (x*x+depth*depth) *  Math.pow(10.0, 8.0) + gaussianRand() * std /
        Math.sqrt(ndata));
    return save;
}

function getDX(x)
{
    return Math.trunc((( (x-xmin) * xscale+llcorx )));
}
// Compute y pix location in data graphic.
function getDY(y)
{
    return Math.trunc((( (ymax-y) * yscale + ulcory )));
}
function getTY()
{
    return Math.trunc(depth * dscale + P_HEIGHT)
}
// Compute scales for plotting.
function setScales()
{
    let x;
    let temp;
    ymax = -1000.0;
    //reset variable scale pointers
    ymin = 1000.0;
    for (x = xmin; x <= xmax; x += dx)
    {
        temp = getG(x);
        if (temp < ymin)
        {
            ymin = temp * 1.1;
        }
        if (temp > ymax)
        {
            ymax = temp * 1.1;
        }
    }
    xscale = G_WIDTH / (xmax - xmin);
    yscale = G_HEIGHT / (ymax - ymin);
    dscale = (C_HEIGHT - P_HEIGHT) / dmax;
}
// function value to produce normal distributed values clustered around a mean.
function gaussianRand()
{
    let x1, x2, rad, y1;
    do {
        x1 = 2 * Math.random() - 1;
        x2 = 2 * Math.random() - 1;
        rad = x1 * x1 + x2 * x2;
    } while(rad >= 1 || rad === 0);
    let c = Math.sqrt(-2 * Math.log(rad) / rad);
    return (x1 * c);
}
//circle Object
function Circle(x, y, r, stroke) {
    this.startingAngle = 0;
    this.endAngle = 2 * Math.PI;
    this.x = x;
    this.y = y;
    this.r = r;

    this.stroke = stroke;

    this.drawCir = function () {
        ctx.beginPath();
        // Treating r as a diameter to mimic java oval() function.
        // arc() method doesn't center to diameter, but builds out from origin.
        // I've added the radius to center the oval/circle object to grid.
        // -Jason
        ctx.arc(this.x+((this.r/2)), this.y+((this.r/2)), this.r/2, this.startingAngle, this.endAngle);
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.stroke;
        ctx.stroke();
    }
}

// Sample circle Object
function SampCircle(x, y, r, stroke) {
    this.startingAngle = 0;
    this.endAngle = 2 * Math.PI;
    this.x = x;
    this.y = y;
    this.r = r;

    this.stroke = stroke;

    this.drawCir = function () {
        r_ctx.beginPath();
        // Treating r as a diameter to mimic java oval() function.
        // arc() method doesn't center to diameter, but builds out from origin.
        // I've added the radius to center the oval/circle object to grid.
        // -Jason
        r_ctx.arc(this.x, this.y, this.r, this.startingAngle, this.endAngle);
        r_ctx.lineWidth = 1;
        r_ctx.strokeStyle = this.stroke;
        r_ctx.stroke();
    }
}


window.addEventListener('keydown', function (e) {
   e.preventDefault();
   //alert(e.key);
   if(e.key === "ArrowDown" && (depth < 24))
   {
       depth += 0.1;
       setValues(dx, rho, depth, std, ndata);
       ctx.clearRect(0,0, canvas.width, canvas.height);
       r_ctx.clearRect(0,0, rad_canvas.width, rad_canvas.height);
       r_ctx.backgroundColor = "#e9e9e9";
       paint();
       displaySliderValues();
       r_ctx.fillStyle = "#cc0000";
       r_ctx.fillText("Move to Deeper Depth", 73, 222);

   }
   else if(e.key === "ArrowUp" && (rad < depth-0.1))
   {
       depth -= 0.1;
       setValues(dx, rho, depth, std, ndata);
       ctx.clearRect(0,0, canvas.width, canvas.height);
       r_ctx.clearRect(0,0, rad_canvas.width, rad_canvas.height);
       r_ctx.backgroundColor = "#e9e9e9";
       paint();
       displaySliderValues();
       r_ctx.fillStyle = "#cc0000";
       r_ctx.fillText("Move to Surface ", 83, 24);
   }
   else if(e.key === "ArrowRight" && (rad < depth))
   {
       rad += 0.1;
       ctx.clearRect(0,0, canvas.width, canvas.height);
       r_ctx.clearRect(0,0, rad_canvas.width, rad_canvas.height);
       r_ctx.backgroundColor = "#e9e9e9";

       paint();
       displaySliderValues();
       r_ctx.fillStyle = "#cc0000";
       r_ctx.fillText("Increase Radius", 159, 87);
   }
   else if(e.key === "ArrowLeft" && (rad > 0.6))
   {
       rad -= 0.1;
       ctx.clearRect(0,0, canvas.width, canvas.height);
       r_ctx.clearRect(0,0, rad_canvas.width, rad_canvas.height);
       r_ctx.backgroundColor = "#e9e9e9";
       paint();
       displaySliderValues();
       r_ctx.fillStyle = "#cc0000";
       r_ctx.fillText("Decrease Radius", 2, 87);
   }
});
let dragging = false;

function radArrowLeft()
{
    if(rad > 0.6)
    {
        rad -= 0.1;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        r_ctx.clearRect(0,0, rad_canvas.width, rad_canvas.height);
        r_ctx.backgroundColor = "#e9e9e9";
        paint();
        displaySliderValues();
        r_ctx.fillStyle = "#cc0000";
        r_ctx.fillText("Decrease Radius", 2, 87);
    }
}
function radArrowRight()
{
    if(rad < depth)
    {
        rad += 0.1;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        r_ctx.clearRect(0,0, rad_canvas.width, rad_canvas.height);
        r_ctx.backgroundColor = "#e9e9e9";
        paint();
        displaySliderValues();
        r_ctx.fillStyle = "#cc0000";
        r_ctx.fillText("Increase Radius", 159, 87);
    }
}
function radArrowUp()
{
    if(rad < depth-0.1)
    {
        depth -= 0.1;
        setValues(dx, rho, depth, std, ndata);
        ctx.clearRect(0,0, canvas.width, canvas.height);
        r_ctx.clearRect(0,0, rad_canvas.width, rad_canvas.height);
        r_ctx.backgroundColor = "#e9e9e9";
        paint();
        displaySliderValues();
        r_ctx.fillStyle = "#cc0000";
        r_ctx.fillText("Move to Surface ", 83, 24);
    }
}
function radArrowDown()
{
    if(depth < 24)
    {
        depth += 0.1;
        setValues(dx, rho, depth, std, ndata);
        ctx.clearRect(0,0, canvas.width, canvas.height);
        r_ctx.clearRect(0,0, rad_canvas.width, rad_canvas.height);
        r_ctx.backgroundColor = "#e9e9e9";
        paint();
        displaySliderValues();
        r_ctx.fillStyle = "#cc0000";
        r_ctx.fillText("Move to Deeper Depth", 73, 222);
    }
}



function onDown(event)
{
    let rect = canvas.getBoundingClientRect();
    let cx = event.pageX - rect.left;
    let cy = event.pageY - rect.top;
    dragging = true;

    if(cx > 40 && cy > 300)
    {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        paint();
        displaySliderValues();
    }
}



