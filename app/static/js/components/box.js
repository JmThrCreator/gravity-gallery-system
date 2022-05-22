class Box {
    constructor(x, y, w, h, img) {
        let options = {
            //chamfer: { radius:10 },
            render: {
                sprite: {
                    texture: staticFolder + img,
                    xScale: 0.5,
                    yScale: 0.5,
                }
            }
        }
        this.body = Bodies.rectangle(x, y, w, h, options);
        World.add(world, this.body);
    }
}