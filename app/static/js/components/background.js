class Background {
    constructor(img, x, y, w, h) {


        let scale = 0.75;
        if (width < 450) scale = 0.3;
        else if (width < 550) scale = 0.4;
        else if (width < 800) scale = 0.5;
       


        let options = {
            isStatic: true,
            // no collision
            collisionFilter: {
                'group': -1,
                'category': 2,
                'mask': 0,
            },
            render: {
                sprite: {
                    texture: img,
                    xScale: scale,
                    yScale: scale,
                }
            }
        }

        this.body = Bodies.rectangle(x, y-100, w, h, options);
        World.add(world, this.body);
    }
}