<?php


// specify your email here

$to = 'ibai600@gmail.com';



	// Assigning data from $_POST array to variables
    if (isset($_POST['name'])) { $name = $_POST['name']; }
    if (isset($_POST['email'])) { $from = $_POST['email']; }
    if (isset($_POST['phone'])) { $phone = $_POST['phone']; }
    if (isset($_POST['website'])) { $website = $_POST['website']; }
    if (isset($_POST['message'])) { $message = $_POST['message']; }
	
	// Construct subject of the email
	$subject = 'Has recibido un mensaje desde elmst.tv de ' . $name;

	// Construct email body
	$body_message .= 'Name: ' . $name . "\r\n";
	$body_message .= 'Email: ' . $from . "\r\n";
	$body_message .= 'Phone: ' . $phone . "\r\n";
	$body_message .= 'Subject: ' . $website . "\r\n";
	$body_message .= 'Message: ' . $message . "\r\n";

	// Construct headers of the message
	$headers = 'From: ' . $from . "\r\n";
	$headers .= 'Reply-To: ' . $from . "\r\n";

	$mail_sent = mail($to, $subject, $body_message, $headers);

	if ($mail_sent == true){ ?>
<script language="javascript" type="text/javascript">
		window.alert("Mensaje enviado con éxito.");
		</script>
<?php } else { ?>
<script language="javascript" type="text/javascript">
                    window.alert("Ha habido un error. Por favor, inténtalo de nuevo.");
                </script>
<?php
	} // End else
    
?>
