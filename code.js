var canvas = null; // the fabric canvas
var bgimage = null; // the html image element for the uploaded image

var canvas_bgimage = null; // the canvas element for the uploaded image
var canvas_outline = null; // the crop outline on the canvas
var canvas_hat = null;  // the christmas hat on the canvas

var output_data = ""; // the image data from the christmas-ified image

$(function() {
    // hide the editing and saving pages
    $("#edit,#save").hide();

    // also hide the <input type="file"> box.
    $("#upload_box").hide();

    // if an image has been uploaded, load it and switch to edit mode
    if($("#image").val() === "1")
    {
        $("#upload").hide();
        $("#edit").show();

        bgimage = new Image();
        bgimage.onload = function() {
            initializeEditPage();
        };
        bgimage.src = $("#base64").val();
    }

    // upload
    $("#upload_button").click(function() {
        // clicking the upload button is the same as clicking the browse button
        // (although the browse button is invisible for design purposes)
        $("#upload_box").click();
    });

    // when an image is selected
    $("#upload_box").change(function(e) {
        // submit the form (upload it)
        $("#upload_form").submit();
    });

    // edit
    $("#finish_edit").click(function() {
        // save the image
        output_data = saveImage();

        // put the output data in the preview <img> tag
        $("#preview").attr("src", output_data);
        // also store the image data for download
        $("#image_data").val(output_data.substring("data:image/png;base64,".length));

        // go to the "download final image" page
        $("#edit").hide();
        $("#save").show();
    });

    $("#restart_button").click(function() {
        // when you click the restart button, just reloads the current page
        window.location.href = '';
    });

    // initialize the canvas
    canvas = new fabric.Canvas('canvas', {
        enableRetinaScaling: false, // to prevent crashing on high dpi devices
        backgroundColor: "#65D695",
        preserveObjectStacking: true, // to keep the crop lines on top
        selection: false, // no need, especially on mobile
    });

    // update the canvas whenever the window resizes
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

    // resize and crop canvas
    resizeCanvas(500);
    var center = new fabric.Point(canvas.width / 2, canvas.height / 2);
    canvas.zoomToPoint(center, 5 / 3);

    // save image
    canvas.renderAll();
    return canvas.toDataURL('png');

    // we might want to worry about resetting the canvas (the zoom & crop lines),
    // however we always go directly to the download page so it's fine.
}

// resizes the canvas to the width of the page
// UNLESS a width is passed, in which case that's the new width
function resizeCanvas(forcew) {
    // expand the canvas up to 500pixels
    var w = $("#edit").innerWidth();
    if(w > 500)
        w = 500;

    // unless forcew is passed, that overrides everything
    if(typeof forcew === "number") w = forcew;

    // resize the canvas
    if(canvas.getWidth() != w)
    {
        canvas.setDimensions({
            width: w,
            height: w
        })
    }

    // update the zoom
    canvas.setZoom(w / 500);
}

// once the image is loaded, gets stuff ready to edit
function initializeEditPage() {
    // add the bg image
    canvas_bgimage = new fabric.Image(bgimage);

    // add the outline
    canvas_outline = new fabric.Rect({
        stroke: "rgb(0, 255, 0)",
        fill: "rgba(0, 0, 0, 0)",
    });

    // scale the canvas
    resizeCanvas();

    // center the background image & outline, and lock them from being edited
    lock_and_center(canvas_bgimage);
    lock_and_center(canvas_outline);

    // style the crop outline
    canvas_outline.set({
        strokeWidth: 2,
        strokeDashArray: [8, 8]
    });

    // load the santa hat image
    var _hat = new Image();
    _hat.crossOrigin = "Anonymous";
    _hat.onload = function() {
        canvas_hat = new fabric.Image(_hat);
        // position the hat and set some colors and stuff
        canvas_hat.set({
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

        canvas.add(canvas_bgimage); // add the bg image
        canvas.add(canvas_hat);     // add the christmas hat
        canvas.add(canvas_outline); // add the crop outline
        canvas.setActiveObject(canvas_hat); // make sure the christmas hat is selected
    };
    _hat.src = "res/Christmas-Hat.png";

    // change the visible card
    $("#upload").hide();
    $("#edit").show();

    // scale the canvas
    resizeCanvas();
}

// a function that resizes obj to 300x300 pixels, centers it, and prevents it
// from being moved
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
