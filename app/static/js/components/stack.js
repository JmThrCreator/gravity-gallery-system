class Gallery {
    constructor(x, y, nx, ny, w, h) {
        var length = imageList.length;

        var nx = nx;


        let stack = Composites.stack(x, y, nx, ny, w, h, function(x, y, ix, iy) {

            if (iy == 1) ix += 3;
            else if (iy == 2) ix += 6;


            if (imageList.length <= ix) return;
            
            let options = {
                //chamfer: { radius:10 },
                render: {
                    sprite: {
                        texture: staticFolder + imageList[ix].path,
                        xScale: 0.5,
                        yScale: 0.5,
                    }
                }
            }

            if (width <= 400) {
                
            }

            return Bodies.rectangle(x, y, imageList[ix].width/2, imageList[ix].height/2, options);
        });

        World.add(world, stack);
    }
}