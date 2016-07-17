$(document).ready(function(){

    var messages = [];
    var socket = io.connect('http://localhost:3700');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");

    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data.message);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += messages[i] + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });

    socket.on('roomin', function (data) {
        if(data.message) {
           
            }
            
        } else {
            console.log("There is a problem:", data);
        }
    });



$("#send").click(function(event) {
        event.preventDefault();
        var text = $("#textField").val();
        alert(text);
        socket.emit('send', { message: text });
    });

})
