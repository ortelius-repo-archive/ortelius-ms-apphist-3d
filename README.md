# ortelius-ms-apphist-3d

Use index.html file to run 3D Bar Chart.

The sample data is in `/data/input_data.json`. 
The Data in sample json file is only sufficient for atmost 4 Component and 7 Dataset. If you want to run with more component or dataset, update the file with more data or feed the data using the API.

# The contract for the input data

```
{
  "graphDetails": {
    "axisStep": <steps between two bars: Int>,
    "noOfComponents": <number of component: Int>,
    "noOfDetasetPerComponent": <number of dataset per component: Int>,
    "style": <style of graph: String>,
    "color": <colors for components: Array<String>>,
    "height": <height of graph: String>,
    "width": <width of graph: String>
  },
  "data": [
    {
      "componentName": <ComponentName: String>,
      "deploymentData": [
        {
          "timestamp": <epoch value: Long>,
          "buildVersion": <buildVersion: String>
        }
      ]
    }
  ]
}
```

# features in 3D Bar Chart

1. The chart adapts to increase/decrease in datasets.
2. The property of graph can be controlled by passing the details related to graph in feed data.
3. The details of a bar can be seen by hovering the mouse over it.
    ![3D Chart](/assets/images/ortelius_app_hist.gif)
    

