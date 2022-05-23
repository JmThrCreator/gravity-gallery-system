// HTML

// Toggle Buttons
window.onclick = function(event) {
  let targetId = event.target.id;

  //toggle gravity
  if (targetId == "gravity") { 
    let gravityOn = document.getElementById("gravity");


    console.log(gravityOn.children[0].className);

    if (gravityOn.children[0].className == "fa-solid fa-globe") {
        gravityOn.children[0].className = "far fa-moon";
        engine.gravity.y = 1;
    } 

    else if (gravityOn.children[0].className == "far fa-moon") {
        gravityOn.children[0].className = "fa-solid fa-globe";
        engine.gravity.y = 0;
    }
  }

  else if (targetId == "add") {
      let random = Math.floor(Math.random() * imageList.length);
      let randomX = Math.floor(Math.random() * (width - 100));

      new Box(randomX, 100, imageList[random].width/2, imageList[random].height/2, imageList[random].path);

  }

  else if (targetId == "clear-bodies") clearBodies();
   
  else if (targetId == "reset-bodies")  resetBodies();
}

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

var width = window.innerWidth, 
  height = window.innerHeight;

// engine
var engine = Engine.create(),
  world = engine.world;

engine.gravity.y = 0;

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

// bodies
createBoundaires();
new Gallery(width/2-290, height/2-230, 3, 3, 50, 50, 160, 120);

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

// Create boundaires
function createBoundaires() {
  new Boundary(width/2,height,width,40); // bottom
  new Boundary(width/2,0,width,40); // top
  new Boundary(0,height/2,40,height); // left
  new Boundary(width,height/2,40,height); // right
}

// EVENTS

// Mouse over image; change cursor
Matter.Events.on(mouseConstraint, 'mousemove', function (event) {
  let mousePosition = event.mouse.position;
  let bodies = Matter.Composite.allBodies(engine.world);
  let foundPhysics = Matter.Query.point(bodies, mousePosition);
  let cursor = ""

  for (let i = 0; i < foundPhysics.length; i++) {
    let element = foundPhysics[i];
    
    if (element == undefined) // not body
      cursor = "default"
    
    else if (element.render.sprite.texture == undefined) // no image
      cursor = "pointer"
    
    else if (element.render.sprite.texture.split('large')[1] == undefined) { // gallery image
      cursor = "pointer"; 
      break;
    }
    
    else // background image
      cursor = "default";
  }

  document.body.style.cursor = cursor;
});

// Double click; Create background image
document.addEventListener('dblclick', function(event) {
  if (event.target.id != "") return; // html button

  let pos = mouse.position;
  let bodies = Matter.Composite.allBodies(engine.world);
  let foundPhysics = Matter.Query.point(bodies, pos);
  let body = "";
  
  removeBodies(background = true, gallery = false, boundaries = false);

  for (let i = 0; i < foundPhysics.length; i++) {
    let element = foundPhysics[i];

    if (element == undefined) // not body
      continue;
  
    else if (element.render.sprite.texture == undefined) // no image
      continue;
    
    else if (element.render.sprite.texture.split('large')[1] == undefined) { // gallery image
      body = element;
      break;
    }

    else // background image
      continue;
  }

  if (body == "") return; // no gallery image found

  let texture = body.render.sprite.texture;

  // background texture
  let imageNumber = texture.split('.').shift().split('_').pop();
  let largeTexture = texture.replace("small_" + imageNumber, 'large_'+ imageNumber);
  largeTexture = largeTexture.replace("small", 'large');

  // background width and height
  let body_width = body.bounds.max.x - body.bounds.min.x;
  let body_height = body.bounds.max.y - body.bounds.min.y;

  new Background(largeTexture, width/2, height/2, body_width, body_height);
})

// Clear all bodies
function clearBodies() {
  removeBodies(background = false, gallery = true, boundaries = false);
}


// Reset bodies
function resetBodies() {

  // remove all bodies except background
  removeBodies(background = false, gallery = true, boundaries = true); 
  
  // bodies
  createBoundaires();
  new Gallery(width/2-290, height/2-230, 3, 3, 50, 50, 160, 120);

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
}

// Resize window
window.addEventListener('resize', function () {
  width = window.innerWidth;
  height = window.innerHeight;
  render.canvas.width = width;
  render.canvas.height = height;

  // remove boundaires
  removeBodies(background = false, gallery = false, boundaries = true);

  // resize background
  let bodies = Matter.Composite.allBodies(engine.world);
  for (let i = 0; i < bodies.length; i++) {
    if (bodies[i].render.sprite.texture == undefined) continue;

    else if (bodies[i].render.sprite.texture.split('large')[1] != undefined) {
      bodies[i].position.x = width/2;
      bodies[i].position.y = height/2;
    }
  }

  createBoundaires();
});

// Remove bodies
function removeBodies(background = false, gallery = false, boundaries = false) {
  let bodies = Matter.Composite.allBodies(engine.world);

  for (let i = 0; i < bodies.length; i++) {
    if (bodies[i].render.sprite.texture == undefined) { // no image = boundaries
      if (boundaries) 
        World.remove(world, bodies[i]);
    }

    else if (bodies[i].render.sprite.texture.split('large')[1] != undefined) {  // 'large' in texture = background
      if (background) 
        World.remove(world, bodies[i]);
    }
    
    else {
      if (gallery) 
        World.remove(world, bodies[i], true); // gallery
    }
  }
}