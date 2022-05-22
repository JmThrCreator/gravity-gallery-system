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

            var positionX
            if (nx == 1) positionX=width/2-w
            else if (nx == 2) positionX=x+width/5 - w
            else if (nx == 3) positionX=x

            return Bodies.rectangle(positionX, y, imageList[ix].width/2, imageList[ix].height/2, options);
        });

        World.add(world, stack);
    }
}