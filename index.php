<?php
if(isset($_FILES['image']))
{
    $errors=array();
    $allowed_ext= array('jpg','jpeg','png','gif');
    $file_name =$_FILES['image']['name'];
 //   $file_name =$_FILES['image']['tmp_name'];
    $file_ext = strtolower( end(explode('.',$file_name)));


    $file_size=$_FILES['image']['size'];
    $file_tmp= $_FILES['image']['tmp_name'];

    $type = pathinfo($file_tmp, PATHINFO_EXTENSION);
    $data = file_get_contents($file_ext);
    $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);

    if($file_size > 2097152)
    {
        header("Location: index.php?toobig");
        exit;
    }

    header("Location: index.php")
}
?>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="stylesheet" href="style.css" />
        <script type="text/javascript" src="jquery-3.1.1.min.js"></script>
        <script type="text/javascript" src="fabric/fabric.min.js"></script>
        <script type="text/javascript" src="code.js"></script>
    </head>
    <body>
        <img src="res/titlex2.png" id="header" />

        <div id="content">
            <div id="upload">
                <form action="" method="POST" enctype="multipart/form-data">
                    <input id="upload_box" type="file" name="image" accept="image/*" />

                    <button class="full" id="upload_button">Choose Image</button>
                </form>
            </div>

            <div id="edit">
                <canvas id="canvas" width="0" height="0"></canvas>
                <button class="full" id="finish_edit">Finish</button>
            </div>

            <div id="save">

                <img id="preview" />

                <form method="POST" action="download.php">
                    <input type="hidden" value="" name="data" id="image_data" />
                    <input type="hidden" value="" name="name" id="output_filename" />
                    <button class="full" type="submit" id="save_button">Download</button>
                    <button class="full" type="button" id="restart_button">Do Another</button>
                </form>
            </div>

            <div id="footer">
                We do not save any of your personal information (including any photos you upload).
            </div>
        </div>
    </body>
</html>
