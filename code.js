var canvas = null;
var bgimage = null;

var canvas_bgimage = null;
var canvas_outline = null;
var canvas_hat = null;

var output_data = "";

$(function() {
    $("#edit,#save").hide();
    $("#upload_box").hide();

    if($("#image").val() === "1")
    {
        $("#upload").hide();
        $("#edit").show();

        bgimage = new Image();
        bgimage.onload = function() {
            moveToEdit();
        };
        bgimage.src = $("#base64").val();
    }

    // upload
    $("#upload_button").click(function() {
        $("#upload_box").click();
    });

    $("#upload_box").change(function(e) {
        $("#upload_form").submit();
    });

    // edit
    $("#finish_edit").click(function() {
        saveImage();

        $("#preview").attr("src", output_data);
        $("#image_data").val(output_data.substring("data:image/png;base64,".length));

        $("#edit").hide();
        $("#save").show();
    });

    // download
    $("#restart_button").click(function() {
        window.location.href = '';
    });

    canvas = new fabric.Canvas('canvas', {
        enableRetinaScaling: false,
        backgroundColor: "#65D695",
        preserveObjectStacking: true,
        selection: false,
    });

    $(window).resize(function() {
        resizeCanvas();
    });

    // allow scrolling on mobile
    var disableScroll = function(){
      canvas.allowTouchScrolling = false;
    };

    var enableScroll = function(){
      canvas.allowTouchScrolling = true;
    };

    canvas.on('mouse:down', function(e) {
        if(canvas.getActiveObject() == null) {
            // clicked on blank space
            // allow scroll
            enableScroll();
            // but still show controls
            canvas.setActiveObject(canvas_hat);
        }
        else {
            disableScroll();
        }
    });
    canvas.on('mouse:up', enableScroll);
});

function saveImage() {
    // hide dotted line
    canvas_outline.setVisible(false);

    // crop and resize canvas
    resizeCanvas(500);
    var center = new fabric.Point(canvas.width / 2, canvas.height / 2);
    canvas.zoomToPoint(center, 5 / 3);

    // save image
    canvas.renderAll();
    output_data = canvas.toDataURL('png');
}

function resizeCanvas(forcew) {
    var w = $("#edit").innerWidth();
    if(w > 500)
        w = 500;

    if(typeof forcew === "number") w = forcew;

    if(canvas.getWidth() != w)
    {
        canvas.setDimensions({
            width: w,
            height: w
        })
    }

    canvas.setZoom(w / 500);
}

function moveToEdit() {
    // add the image
    canvas_bgimage = new fabric.Image(bgimage);

    // add the outline
    canvas_outline = new fabric.Rect({
        stroke: "rgb(0, 255, 0)",
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
        canvas.add(canvas_bgimage);
        canvas.add(canvas_hat);
        canvas.add(canvas_outline);
        canvas.setActiveObject(canvas_hat);
    };
    __.src = "res/Christmas-Hat.png";

    // arrange and add to canvas
    lock_and_center(canvas_bgimage);
    lock_and_center(canvas_outline);
    canvas_outline.set({
        strokeWidth: 2,
        strokeDashArray: [8, 8]
    });

    // change the visible card
    $("#upload").hide();
    $("#edit").show();

    // scale the canvas
    resizeCanvas();
}

function position_hat(obj) {
    obj.set({
        left: 150,
        top: 50,
        width: 200,
        height: 200,

        rotatingPointOffset: 10,
        cornerSize: 26,

        borderScaleFactor: 1,

        borderOpacityWhenMoving: 1.0,
        borderWidth: 2,
        borderColor: "red",
        cornerColor: "red",
        lockUniScaling: true
    });
}

function lock_and_center(obj) {
    var w = 300;
    var h = 300;
    if(obj.width > obj.height)
        h *= obj.height / obj.width;
    else if(obj.width < obj.height)
        w *= obj.width / obj.height;

    obj.set({
        left: 100 + (300 - w) / 2,
        top: 100 + (300 - h) / 2,
        width: w,
        height: h,

        selectable: false,
        evented: false,

        hoverCursor: "default",
        moveCursor: "default"
    });
}
