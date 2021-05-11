const engine = Matter.Engine.create();
const render = Matter.Render.create({
  element: document.body,
  engine: engine,
});
const bodies = [
  Matter.Bodies.rectangle(400, 210, 810, 60, { isStatic: true }),
  ...[...document.querySelectorAll("svg > path")].map((path) => {
    const body = Matter.Bodies.fromVertices(
      100,
      80,
      Matter.Svg.pathToVertices(path),
      {},
      true
    );
    Matter.Body.scale(body, 0.2, 0.2);
    return body;
  }),
];
Matter.World.add(engine.world, bodies);
Matter.Engine.run(engine);
Matter.Render.run(render);
