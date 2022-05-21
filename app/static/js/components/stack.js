class Gallery {
    constructor(x, y, nx, ny, w, h) {
        var length = imageList.length;

        var nx = nx;

        if (width > 750){
            nx = 3
        }
        else if (width <= 750 && width > 400) {
            nx = 2
        }
        else if (width <= 400) {
            nx = 1
        }


        let stack = Composites.stack(x, y, nx, ny, w, h, function(x, y, ix, iy) {

            if (iy == 1) ix += 3;
            else if (iy == 2) ix += 6;

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

            var position
            if (nx == 1) position=1
            else if (nx == 2) position=1.25
            else if (nx == 3) position=2

            return Bodies.rectangle(x, y, imageList[ix].width/position, imageList[ix].height/2, options);
        });

        World.add(world, stack);
    }
}