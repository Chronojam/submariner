import { Shape, Stage } from '@createjs/easeljs';

// Do some initialization
// Set size of canvas
const canvas = document.getElementById("screen");
canvas.width = window.outerWidth / 2;
canvas.height = 2000;

var stage = new Stage('screen');
var shape = new Shape();
shape.graphics.beginFill('grey').drawRect(
    window.outerWidth /2 ,
    0, canvas.width, canvas.height);
stage.addChild(shape);
stage.update();

// even though Rollup is bundling all your files together, errors and
// logs will still point to your original source modules
console.log('if you have sourcemaps enabled in your devtools, click on main.js:5 -->');