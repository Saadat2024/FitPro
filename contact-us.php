<?php
$name =$_POST['name'];
$email =$_POST['email'];
$gender =$_POST['gender'];
$message = $_POST['message'];

//db connection
$conn = new mysqli ('localhost','root','', 'fitpro');
if($conn->connect_error){
    die ('connection failed:'.$conn->connect_error);
}
else{
    //insert data into database
    $stmt = $conn -> prepare("insert into contactus (name,email,gender,message) values (?,?,?,?)");
    $stmt -> bind_param("ssss",$name,$email,$gender,$message);
    $stmt -> execute();
    $stmt -> close();
    $stmt -> close();


}

?>