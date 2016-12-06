var canvas = null;
var bgimage = null;

var canvas_bgimage = null;
var canvas_outline = null;
var canvas_hat = null;

var output_data = "";

// the scale value to use when positioning objects
var positionalZoom = 1;
// the actual zoom amount
var zoomAmount = 1;

$(function() {
    $("#edit,#save").hide();
    $("#upload_box").hide();

    // upload
    $("#upload_button").click(function() {
        $("#upload_box").click();
    });

    $("#upload_box").change(function(e) {
        var reader = new FileReader();
        reader.onload = function(event) {
            bgimage = new Image();
            bgimage.crossOrigin = "Anonymous";
            bgimage.onload = function() {
                moveToEdit();
            };
            bgimage.src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
    });

    // edit
    $("#finish_edit").click(function() {
        saveImage();

        $("#preview").attr("src", output_data);

        $("#edit").hide();
        $("#save").show();
    });

    // download
    $("#save_button").click(function() {
        window.location.href = output_data;
    });

    $("#restart_button").click(function() {
        window.location.reload();
    });

    canvas = new fabric.Canvas('canvas');

    $(window).resize(function() {
        resizeCanvas();
    });
});

function saveImage() {
    // hide dotted line
    canvas_outline.setVisible(false);

    // crop and resize canvas
    resizeCanvas(500);
    var center = new fabric.Point(canvas.width / 2, canvas.height / 2);
    canvas.zoomToPoint(center, zoomAmount * 5 / 3);

    // save image
    canvas.renderAll();
    alert(canvas.width);
    output_data = canvas.toDataURL('png');
}

function resizeCanvas(forcew) {
    var w = $("#edit").innerWidth();
    console.log(w);
    if(w > 500)
        w = 500;

    if(typeof forcew === "number") w = forcew;

    if(canvas.width != w)
    {
        canvas.setHeight(w);
        canvas.setWidth(w);
    }

    var lookat = bgimage.width;
    if(bgimage.width < bgimage.height)
        lookat = bgimage.height;

    positionalZoom = 300 / lookat;
    zoomAmount = w / 500 * positionalZoom;
    canvas.setZoom(zoomAmount);
    canvas.viewportTransform[4] = 0;
    canvas.viewportTransform[5] = 0;
}

function moveToEdit() {
    // add the image
    canvas_bgimage = new fabric.Image(bgimage);

    // add the outline
    canvas_outline = new fabric.Rect({
        stroke: "red",
        fill: "rgba(0, 0, 0, 0)",
    });

    // scale the canvas
    resizeCanvas();

    // add the santa hat
    var __ = new Image();
    __.crossOrigin = "Anonymous";
    __.onload = function() {
        canvas_hat = new fabric.Image(__);
        position_hat(canvas_hat);
        canvas.add(canvas_hat);
        canvas.setActiveObject(canvas_hat);
    };
    __.src = "res/Christmas-Hat.png";

    // arrange and add to canvas
    lock_and_center(canvas_bgimage);
    lock_and_center(canvas_outline);
    canvas_outline.set({
        strokeWidth: 2 / positionalZoom,
        strokeDashArray: [8 / positionalZoom, 8 / positionalZoom]
    });

    canvas.add(canvas_bgimage);
    canvas.add(canvas_outline);

    // change the visible card
    $("#upload").hide();
    $("#edit").show();

    // scale the canvas
    resizeCanvas();
}

function position_hat(obj) {
    obj.set({
        left: 150 / positionalZoom,
        top: 50 / positionalZoom,
        width: 200 / positionalZoom,
        height: 200 / positionalZoom,

        rotatingPointOffset: 10,

        borderOpacityWhenMoving: 1.0,
        borderColor: "red",
        cornerColor: "red",
        lockUniScaling: true
    });
}

function lock_and_center(obj) {
    obj.set({
        left: 100 / positionalZoom,
        top: 100 / positionalZoom,
        width: 300 / positionalZoom,
        height: 300 / positionalZoom,

        selectable: false,
        evented: false,

        hoverCursor: "default",
        moveCursor: "default"
    });
}
