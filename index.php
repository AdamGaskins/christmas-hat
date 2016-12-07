<?php
$image = false;
$file_name = "";
if(isset($_FILES['image']))
{
    $errors=array();
    $allowed_ext= array('jpg','jpeg','png','gif');
    $full_file_name =$_FILES['image']['name'];
 //   $file_name =$_FILES['image']['tmp_name'];
    $file_ext = strtolower(end(explode('.',$full_file_name)));
    $file_name = explode('.',$full_file_name)[0];

    $file_size=$_FILES['image']['size'];
    $file_tmp= $_FILES['image']['tmp_name'];

    $type = pathinfo($file_tmp, PATHINFO_EXTENSION);
    $data = file_get_contents($file_tmp);
    $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);

    if($file_size > 2097152)
    {
        header("Location: index.php?toobig");
        exit;
    }

    $image = true;
}
?>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="stylesheet" href="style.css" />
        <script type="text/javascript" src="jquery-3.1.1.min.js"></script>
        <script type="text/javascript" src="fabric/fabric.min.js"></script>
        <script type="text/javascript" src="code.js"></script>

        <input type="hidden" id="image" value="<?=$image?1:0?>" />
        <input type="hidden" id="fname" value="<?=htmlspecialchars($file_name)?>" />
        <input type="hidden" id="base64" value="<?=$base64?>" />
    </head>
    <body>
        <img src="res/titlex2.png" id="header" />

        <div id="content">
            <div id="upload">
                <form id="upload_form" action="index.php" method="POST" enctype="multipart/form-data">
                    <input id="upload_box" type="file" name="image" />

                    <button class="full" type="button" id="upload_button">Choose Image</button>
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
                    <input type="hidden" value="<?=htmlspecialchars($file_name)?>_CHRISTMAS-HAT" name="name" id="output_filename" />
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
