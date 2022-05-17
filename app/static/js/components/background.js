class Background {
    constructor(img, x, y, w, h) {
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
                    xScale: 0.75,
                    yScale: 0.75,
                }
            }
        }

        this.body = Bodies.rectangle(x, y, w, h, options);
        World.add(world, this.body);
    }
}