class Gallery {
    constructor(x, y, nx, ny, w, h) {
        var length = imageList.length;

        if (width < 800) x = width/2-140, y = height/4, w = 20, h = 20;

        let stack = Composites.stack(x, y, nx, ny, w, h, function(x, y, ix, iy) {

            if (iy == 1) ix += 3;
            else if (iy == 2) ix += 6;

            if (imageList.length <= ix) return;

            console.log(width*0.001, imageList[ix].width)
            
            var scale
            var widthMultiplier
            if (width < 800) scale = 0.25, widthMultiplier = 4;
            else scale = 0.5, widthMultiplier = 2;

            let options = {
                //chamfer: { radius:10 },
                render: {
                    sprite: {
                        texture: staticFolder + imageList[ix].path,
                        xScale: scale,
                        yScale: scale,
                    }
                }
            }

            return Bodies.rectangle(x, y, imageList[ix].width/widthMultiplier, imageList[ix].height/widthMultiplier, options);
        });

        World.add(world, stack);
    }
}