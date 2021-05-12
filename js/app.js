const path =
  "M92.556,359c16.79,0,22.473-9.002,29.312-15.825C135.833,329.159,153,335.128,153,357.71V462h104.29 c22.582,0,28.551-17.167,14.544-31.131c-6.832-6.84-15.834-12.523-15.834-29.321C256,382.889,275.028,359,307.5,359 s51.5,23.889,51.5,42.548c0,16.798-9.002,22.481-15.825,29.321C329.159,444.833,335.128,462,357.71,462H462V357.71 c0-22.582-17.167-28.551-31.131-14.535c-6.84,6.823-12.523,15.825-29.321,15.825C382.889,359,359,339.972,359,307.5 s23.889-51.5,42.548-51.5c16.798,0,22.481,9.002,29.321,15.834C444.833,285.841,462,279.872,462,257.29V153H357.71 c-22.582,0-28.551-17.167-14.535-31.131c6.823-6.84,15.825-12.523,15.825-29.312C359,73.889,339.972,50,307.5,50 S256,73.889,256,92.556c0,16.79,9.002,22.473,15.834,29.312C285.841,135.833,279.872,153,257.29,153H153v104.29 c0,22.582-17.167,28.551-31.131,14.544C115.029,265.002,109.346,256,92.556,256C73.889,256,50,275.028,50,307.5 S73.889,359,92.556,359z";

const loadSvg = function (url) {
  return fetch(url)
    .then(function (response) {
      return response.text();
    })
    .then(function (raw) {
      return new window.DOMParser().parseFromString(raw, "image/svg+xml");
    });
};

// paper stuff

let svg;
paper.install(window);

window.onload = function () {
  // Setup directly from canvas id:
  paper.setup("paperCanvas");

  console.log("width", paper.view.size.width);

  svg = project.importSVG(document.getElementById("hand-svg"));
  // svg = new Path(loadSvg("./svg/svg.svg"));
  svg.fillColor = "#ff0000";
  console.log("svg is", svg);
};

//matter stuff:

// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Common = Matter.Common,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Bodies = Matter.Bodies,
  Vertices = Matter.Vertices,
  Svg = Matter.Svg,
  Composite = Matter.Composite;

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
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false, // <-- important
  },
});

// svgs
// add bodies
if (typeof fetch !== "undefined") {
  var select = function (root, selector) {
    return Array.prototype.slice.call(root.querySelectorAll(selector));
  };
  const svgs = document.getElementById("svgs");
  console.log(svgs);

  [...svgs.children].map((svg, i) => {
    console.log(svg);
    var color = Common.choose([
      "#f19648",
      "#f5d259",
      "#f55a3c",
      "#063e7b",
      "#ececd1",
    ]);

    var vertexSets = select(svg, "path").map(function (path) {
      return Vertices.scale(Svg.pathToVertices(path, 30), 1, 1);
    });

    Composite.add(
      world,
      Bodies.fromVertices(
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
      )
    );
  });

  // loadSvg("./svg/svg.svg").then(function (root) {
  //   var color = Common.choose([
  //     "#f19648",
  //     "#f5d259",
  //     "#f55a3c",
  //     "#063e7b",
  //     "#ececd1",
  //   ]);

  //   var vertexSets = select(root, "path").map(function (path) {
  //     return Svg.pathToVertices(path, 30);
  //   });

  //   Composite.add(
  //     world,
  //     Bodies.fromVertices(
  //       window.innerWidth / 1.3,
  //       80,
  //       vertexSets,
  //       {
  //         render: {
  //           fillStyle: "red",
  //           strokeStyle: color,
  //           lineWidth: 1,
  //         },
  //       },
  //       true
  //     )
  //   );
  // });
} else {
  Common.warn("Fetch is not available. Could not load SVG.");
}

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(
  window.innerWidth / 2,
  window.innerHeight,
  window.innerWidth,
  60,
  {
    isStatic: true,
  }
);

// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB, ground]);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
