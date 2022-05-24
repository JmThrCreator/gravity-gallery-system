class Wireframe {
    constructor(x, y, w, h, color) {


        var scale
        var widthMultiplier
        if (width < 800) widthMultiplier = 2;
        else widthMultiplier = 1;
        
        let options = {
            chamfer: { radius:3 },
            render: {
                fillStyle: color,
                strokeStyle: 'black',
                lineWidth: 5
            },
        }
        this.body = Bodies.rectangle(x, y, w/widthMultiplier, h/widthMultiplier, options);
        World.add(world, this.body);
    }
}