
var data = null;
var graph = null;

function custom(x, y) {
    return (-Math.sin(x / Math.PI) * Math.cos(y / Math.PI) * 10 + 10) * 1000;
}

function drawVisualization() {
    var style = document.getElementById("style").value;
    var withValue =
        ["bar-color", "bar-size", "dot-size", "dot-color"].indexOf(style) != -1;

    // Create and populate a data table.
    data = new vis.DataSet();

    generateSampleData(withValue, data);

    console.log(data);
    // specify options
    var options = {
        width: "600px",
        height: "600px",
        style: style,
        showPerspective: true,
        showGrid: true,
        showShadow: false,

        // Option tooltip can be true, false, or a function returning a string with HTML contents
        //tooltip: true,
        tooltip: function (point) {
            // parameter point contains properties x, y, z
            return "value: <b>" + point.z + "</b>";
        },

        xValueLabel: function (value) {
            return moment().add(value, "days").format("DD MMM");
        },

        yValueLabel: function (value) {
            return value * 10 + "%";
        },

        zValueLabel: function (value) {
            return value / 1000 + "K";
        },

        keepAspectRatio: true,
        verticalRatio: 0.5,
    };

    var camera = graph ? graph.getCameraPosition() : null;

    // create our graph
    var container = document.getElementById("mygraph");
    // console.log(JSON.stringify(data));
    graph = new vis.Graph3d(container, data, options);

    if (camera) graph.setCameraPosition(camera); // restore camera position

    document.getElementById("style").onchange = drawVisualization;
}

function generateSampleData(withValue, data) {

    var steps = 5; // number of datapoints will be steps*steps
    var axisMax = 10;
    var axisStep = axisMax / steps;
    for (var x = 0; x <= axisMax; x += axisStep) {
        for (var y = 0; y <= axisMax; y += axisStep) {
            var z = custom(x, y);
            if (withValue) {
                var value = y - x;
                data.add({ x: x, y: y, z: z, style: value });
            } else {
                data.add({ x: x, y: y, z: z });
            }
        }
    }
}

window.addEventListener("load", () => {
    drawVisualization();
});