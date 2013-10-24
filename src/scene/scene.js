var Scene = function (_globalAmbientIntensity) {
    this.objects = [];
    this.lights = [];
    this.globalAmbientIntensity = _globalAmbientIntensity;
    this.camera = null;
};

Scene.prototype.addLight = function (_light) {
    this.lights.push(_light);
}

Scene.prototype.addObject = function (_object) {
    this.objects.push(_object);
}

// global scene object
var scene;

// 0. set up the scene described in the exercise sheet (this is called before the rendering loop)
function loadScene() {

    scene = new Scene (0.2); // global ambient intensity

    loadDefaultCamera();
    loadDefaultLight();

    if (ModuleId.B3) {
        loadB3();

    } else if (ModuleId.B4) {
        loadB4();

    } else if (ModuleId.X1) {
        loadAdditionalStuff();

    } else {
        loadA1();
    }

    console.log("scene loaded");
}

function loadDefaultCamera() {
    var camera = new Camera (
        $V([0,0,10]),      // position
        $V([0,0,-1]),      // view direction
        $V([0,1,0]),       // up direction
        40,                // field of view
        1,                 // distance
        RayConfig.width,   // image width
        RayConfig.height); // image height

    scene.camera = camera;
}

function loadDefaultLight() {
    var light = new Light (
        $V([10,10,10]),      // position
        new Color(1,1,1),    // color
        0,                   // ambient intensity
        1,                   // diffuse intensity
        1);                  // specular intensity

    scene.addLight(light);
}


