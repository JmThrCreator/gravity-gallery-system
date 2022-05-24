// JS

// Matter JS setup
var Engine = Matter.Engine,
  Bodies = Matter.Bodies,
  World = Matter.World,
  Composite = Matter.Composite,
  Composites = Matter.Composites,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Render = Matter.Render,
  Runner = Matter.Runner;

var width = window.innerWidth - 15,
  height = window.innerHeight - 100;

// engine
var engine = Engine.create(),
  world = engine.world;

engine.gravity.y = 1;

// render
var render = Render.create({
  element: document.body,
  engine: engine,
  options:
  {
    wireframes: false,
    background: '#e1dcd5',
  }
});

render.canvas.width = width
render.canvas.height = height
render.options.pixelRatio = 1;
Render.run(render);

// runner
var runner = Matter.Runner.create();
Runner.run(runner, engine);

// mouse
let mouse = Mouse.create(render.canvas);
let mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    render: {
      visible: false
    }
  }
});
render.mouse = mouse;
World.add(world, mouseConstraint);

// Sort z-index by category
Matter.Events.on(engine.world, "afterAdd", function() {
  engine.world.bodies.sort((a, b) => {
      return b.collisionFilter.category - a.collisionFilter.category;
  });
});

// bodies
createBoundaires();
createBodies();

// Create boundaires
function createBoundaires() {
    new Boundary(0,height,width*2,40); // bottom
    new Boundary(0,0,40,height*2); // left
    new Boundary(width,0,40,height*2); // right
}

function createBodies() {
    function randomX() {
        return Math.random()*width
      }
      function randomY() {
        return Math.random()* (height-200) - 500
      }
      
      new Wireframe(randomX(), randomY(), 160, 100, "#b87be7");
      new Wireframe(randomX(), randomY(), 160, 100, "#a0e167");
      new Wireframe(randomX(), randomY(), 160, 100, "#7bafe7");
      new Wireframe(randomX(), randomY(), 160, 100, "#cf5d5d");
}


// Resize window
window.addEventListener('resize', function () {
    width = window.innerWidth - 15,
    height = window.innerHeight - 100;
    render.canvas.width = width;
    render.canvas.height = height;
  

    removeBoundaries();
    createBoundaires();
});
  

// Remove boundaires
function removeBoundaries() {
    let bodies = Matter.Composite.allBodies(engine.world);
  
    for (let i = 0; i < bodies.length; i++) {
        //if boundary, remove
        if (bodies[i].collisionFilter.category == 2) {
            World.remove(world, bodies[i]);
        }
    }
}