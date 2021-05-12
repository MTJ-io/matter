// const path =
//   "M92.556,359c16.79,0,22.473-9.002,29.312-15.825C135.833,329.159,153,335.128,153,357.71V462h104.29 c22.582,0,28.551-17.167,14.544-31.131c-6.832-6.84-15.834-12.523-15.834-29.321C256,382.889,275.028,359,307.5,359 s51.5,23.889,51.5,42.548c0,16.798-9.002,22.481-15.825,29.321C329.159,444.833,335.128,462,357.71,462H462V357.71 c0-22.582-17.167-28.551-31.131-14.535c-6.84,6.823-12.523,15.825-29.321,15.825C382.889,359,359,339.972,359,307.5 s23.889-51.5,42.548-51.5c16.798,0,22.481,9.002,29.321,15.834C444.833,285.841,462,279.872,462,257.29V153H357.71 c-22.582,0-28.551-17.167-14.535-31.131c6.823-6.84,15.825-12.523,15.825-29.312C359,73.889,339.972,50,307.5,50 S256,73.889,256,92.556c0,16.79,9.002,22.473,15.834,29.312C285.841,135.833,279.872,153,257.29,153H153v104.29 c0,22.582-17.167,28.551-31.131,14.544C115.029,265.002,109.346,256,92.556,256C73.889,256,50,275.028,50,307.5 S73.889,359,92.556,359z";

// const loadSvg = function (url) {
//   return fetch(url)
//     .then(function (response) {
//       return response.text();
//     })
//     .then(function (raw) {
//       return new window.DOMParser().parseFromString(raw, "image/svg+xml");
//     });
// };

const colours = ["#f19648", "#f5d259", "#f55a3c", "#063e7b", "#ececd1"];

function radToDeg(radians) {
  var pi = Math.PI;
  radians / (pi / 180);
  return radians / (pi / 180);
}

//matter stuff:
let width = window.innerWidth;
let height = window.innerHeight;

// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Common = Matter.Common,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Composite = Matter.Composite,
  Bodies = Matter.Bodies,
  Vertices = Matter.Vertices,
  Svg = Matter.Svg;

// create an engine
var engine = Engine.create(),
  world = engine.world;

// create a renderer
var canvas = document.getElementById("matter");
console.log(canvas);

var render = Render.create({
  canvas: canvas,
  engine: engine,
  options: {
    width: width,
    height: height,
    wireframes: true,
  },
});
// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// svgs
var select = function (root, selector) {
  return Array.prototype.slice.call(root.querySelectorAll(selector));
};

const svgs = document.getElementById("svgs");

const matterBodies = [];
[...svgs.children].map((svg, i) => {
  var color = colours[i];

  var vertexSets = select(svg, "path").map(function (path) {
    return Vertices.scale(Svg.pathToVertices(path, 30), 1, 1);
  });

  matterBodies[i] = Bodies.fromVertices(
    300 + i * 150,
    200 + i * 50,
    vertexSets,
    {
      render: {
        fillStyle: color,
        strokeStyle: color,
        lineWidth: 1,
      },
    },
    true
  );

  console.log("vertex", vertexSets);

  // Matter.Body.setCentre(matterBodies[i], Matter.Vector.create(100, 10), true);
  // Matter.Body.setCentre(
  //   matterBodies[i],
  //   Matter.Vector.sub(matterBodies[i].bounds.min, matterBodies[i].position),
  //   true
  // );

  // let xOffset = svg.viewBox.animVal.width - matterBodies[i].bounds.min.x;
  // let yOffset = svg.viewBox.animVal.height - matterBodies[i].bounds.min.y;
  // console.log(xOffset, yOffset);
  // Matter.Body.setCentre(
  //   matterBodies[i],
  //   Matter.Vector.create(xOffset, yOffset),
  //   true
  // );

  //Body.translate(body, Vector.sub(body.bounds.min, body.position))

  console.log("bounds", matterBodies[i].bounds);

  Composite.add(world, matterBodies[i]);
});

Composite.add(world, [
  Bodies.rectangle(width / 2, 0, width, 50, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 50, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 50, height, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 50, height, { isStatic: true }),
]);

// add mouse control
var mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: true,
      },
    },
  });

Composite.add(world, mouseConstraint);
console.log("world", world);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
Render.lookAt(render, {
  min: { x: 0, y: 0 },
  max: { x: window.innerWidth, y: window.innerHeight },
});

// paper stuff

let paperSvgs = [];
paper.install(window);

window.onload = function () {
  // Setup directly from canvas id:
  paper.setup("paperCanvas");

  [...svgs.children].map((svg, i) => {
    paperSvgs[i] = project.importSVG(svg);
    // svg = new Path(loadSvg("./svg/svg.svg"));
    paperSvgs[i].fillColor = colours[i];
    // paperSvgs[i].applyMatrix = false;
  });

  console.log("item", paperSvgs[0]);

  let r = 100;
  paper.view.onFrame = function (event) {
    for (let i = 0; i < paperSvgs.length; i++) {
      paperSvgs[i].position = [
        matterBodies[i].position.x,
        matterBodies[i].position.y,
      ];
      paperSvgs[i].rotation = radToDeg(matterBodies[i].angle);

      paperSvgs[i].applyMatrix = false;
    }
  };
};
