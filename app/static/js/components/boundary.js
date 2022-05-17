class Boundary {
    constructor(x, y, w, h) {
        let options = {
            isStatic: true,
            //visibility
            render: {
                visible: false
            },
        }

        this.body = Bodies.rectangle(x, y, w, h, options);
        World.add(world, this.body);
    }
}