class Box {
    constructor(x, y, w, h, img) {


        var scale
        var widthMultiplier
        if (width < 800) scale = 0.25, widthMultiplier = 2;
        else scale = 0.5, widthMultiplier = 1;
        
        let options = {
            //chamfer: { radius:10 },
            render: {
                sprite: {
                    texture: staticFolder + img,
                    xScale: scale,
                    yScale: scale,
                }
            }
        }
        this.body = Bodies.rectangle(x, y, w/widthMultiplier, h/widthMultiplier, options);
        World.add(world, this.body);
    }
}