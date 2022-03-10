
var data = null;
var graph = null;

function drawVisualization(refData) {

    var graphStyle = refData ? refData.graphDetails.style : "bar";
    var graphWidth = refData ? refData.graphDetails.width : "600px";
    var graphHeight = refData ? refData.graphDetails.height : "400px";
    var graphAxisStep = refData ? refData.graphDetails.axisStep : 2;
    data = [];

    generateSampleData(data, refData)

    // specify options
    var options = {
        width: graphWidth,
        height: graphHeight,
        style: graphStyle,
        showPerspective: true,
        showGrid: true,
        showShadow: false,

        xValueLabel: function (value) {
            return value;
        },

        yValueLabel: function (value) {
            return value;
        },

        zValueLabel: function (value) {
            return value;
        },

        // Option tooltip can be true, false, or a function returning a string with HTML contents
        tooltip: function (point) {

            console.log(point)
            if (baseMap) {
                return "Component Name: <b>" + point.data.extra.componentName + "</b><br>" +
                    "Version: <b>" + point.data.extra.deploymentData[point.y / graphAxisStep].buildVersion + "</b><br>" +
                    "Timestamp: <b>" + new Date(point.data.extra.deploymentData[point.y / graphAxisStep].timestamp) + "</b><br>"
            }

            return "Component Name: <b>" + point.data.extra.componentName + "</b><br>" +
                "Version: <b>" + point.z + "</b><br>" +
                "Timestamp: <b>" + new Date(point.data.extra.deploymentData[point.y / graphAxisStep].timestamp) + "</b><br>"
        },

        // Tooltip default styling can be overridden
        tooltipStyle: {
            content: {
                background: "rgba(255, 255, 255, 0.7)",
                padding: "10px",
                borderRadius: "10px",
            },
            line: {
                borderLeft: "1px dotted rgba(0, 0, 0, 0.5)",
            },
            dot: {
                border: "5px solid rgba(0, 0, 0, 0.5)",
            },
        },

        keepAspectRatio: true,
        verticalRatio: 0.5,
    };

    var camera = graph ? graph.getCameraPosition() : null;
    var container = document.getElementById("mygraph");
    graph = new vis.Graph3d(container, data, options);
    if (camera) graph.setCameraPosition(camera); // restore camera position

    // document.getElementById("style").onchange = drawVisualization;
}

function normalizeValuesZAxis(metaData) {

    let linkedBaseVersionMap = new Map();
    var baseVersion = null
    var baseVersionIndex = 0

    console.log(metaData)
    metaData.deploymentData.forEach(element => {

        if (linkedBaseVersionMap.size == 0) {
            baseVersion = element.buildVersion
            linkedBaseVersionMap.set(baseVersionIndex, new Array(baseVersion, 10))
            baseVersionIndex += 1
        } else {

            var newBaseVersion = element.buildVersion
            if (baseVersion != newBaseVersion) {

                var newZ = linkedBaseVersionMap.get(baseVersionIndex - 1)[1] + 5
                linkedBaseVersionMap.set(baseVersionIndex, new Array(newBaseVersion, newZ))
                baseVersionIndex += 1
                baseVersion = newBaseVersion
            } else {
                var newZ = linkedBaseVersionMap.get(baseVersionIndex - 1)[1]
                linkedBaseVersionMap.set(baseVersionIndex, new Array(newBaseVersion, newZ))
                baseVersionIndex += 1
            }
        }
    });

    return linkedBaseVersionMap
}

function generateSampleData(data, refData) {

    if (refData) {
        var axisStep = refData.graphDetails.axisStep; //let n = 2
        var xAxis = (refData.graphDetails.noOfComponents - 1)*axisStep; // there will be (noOfComponents/n + 1) rows -- x-Axis Value
        var yAxis = (refData.graphDetails.noOfDetasetPerComponent - 1) * axisStep;
        colors = refData.graphDetails.color;

        for (var x = 0; x <= xAxis; x += axisStep) {
            for (var y = 0; y <= yAxis; y += axisStep) {

                data.push({
                    x: x,
                    y: y,
                    z: 0,
                    style: {
                        fill: colors[x],
                        stroke: "#999",
                    }
                });
            }
        }


        for (let i = 0; i < data.length; i++) {
            baseMap = normalizeValuesZAxis(refData.data[data[i].x / axisStep]);
            data[i].extra = refData.data[data[i].x / axisStep]
            data[i].z = baseMap.get(data[i].y / axisStep)[1]
        }
    }
}

window.addEventListener("load", () => {
    start()
});

const start = async function () {
    // const response = await fetch("http://localhost:8080/getData");
    // return await response.json();
    const response = await fetch("data/input_data.json");
    return await response.json();
}

start()
    .then(
        c => drawVisualization(c)
    )
