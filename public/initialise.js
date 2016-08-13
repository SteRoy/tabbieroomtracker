   var jQT = new $.jQT({
                icon: 'jqtouch.png',
                icon4: 'jqtouch4.png',
                addGlossToIcon: false,
                startupScreen: 'jqt_startup.png',
                statusBar: 'black-translucent',
                preloadImages: []
            });

            var socket = io();
            //socket.emit('roomout', 'Room 101');

            socket.on('debateStart', function(data){
                var room = $("[roomname='" + data + "']");
                room.removeClass('noDebate');
                room.addClass('in');
                room.children('small').remove();
                room.html(room.text()+'<small class=counter>Debating</small>');
            })

            socket.on('debateOut', function(data){
                var room = $("[roomname='" + data + "']");
                room.removeClass('in');
                room.addClass('out');
                room.children('small').remove();
                room.html(room.text()+'<small class=counter>Out</small>');
            })

            socket.on('ballotGot', function(data){
                var room = $("[roomname='" + data + "']");
                room.removeClass('out');
                room.addClass('ballotgot');
                room.children('small').remove();
                room.html(room.text()+'<small class=counter>Ballot</small>');
            })
            

            // Some sample Javascript functions:
            $(function(){

                // Show a swipe event on swipe test
                $('#swipeme').on("swipe", function(evt, data) {
                    var details = !data ? '': '<strong>' + data.direction + '/' + data.deltaX +':' + data.deltaY + '</strong>!';
                    $(this).html('You swiped ' + details );
                    $(this).parent().after('<li>swiped!</li>')
                });

                $('#tapme').on("tap", function(){
                    $(this).parent().after('<li>tapped!</li>')
                });

                $(".roomtrack").on("tap", function(e){
                    e.preventDefault();
                    if ( $( this ).hasClass( "out" ) ){
                        socket.emit('ballotgot', $(this).attr('roomname'));
                    }
                    else if ( $( this ).hasClass( "in" ) ){
                        socket.emit('roomout', $(this).attr('roomname'));
                    }
                    else if ($( this ).hasClass( "ballotgot" )){
                        socket.emit('roomin', $(this).attr('roomname'));
                    }
                    else if ($(this).hasClass("noDebate")){
                        socket.emit('debateStart', $(this).attr('roomname'))
                    }
                });

                $('a[target="_blank"]').bind('click', function() {
                    if (confirm('This link opens in a new window.')) {
                        return true;
                    } else {
                        return false;
                    }
                });

                // Page animation callback events
                $('#pageevents').
                    bind('pageAnimationStart', function(e, info){ 
                        $(this).find('.info').append('Started animating ' + info.direction + '&hellip;  And the link ' +
                            'had this custom data: ' + $(this).data('referrer').data('custom') + '<br>');
                    }).
                    bind('pageAnimationEnd', function(e, info){
                        $(this).find('.info').append('Finished animating ' + info.direction + '.<br><br>');

                    });
                
                // Page animations end with AJAX callback event, example 1 (load remote HTML only first time)
                $('#callback').bind('pageAnimationEnd', function(e, info){

                    // Make sure the data hasn't already been loaded (we'll set 'loaded' to true a couple lines further down)
                    if (!$(this).data('loaded')) {
                        
                        // Append a placeholder in case the remote HTML takes its sweet time making it back
                        // Then, overwrite the "Loading" placeholder text with the remote HTML
                        $(this).append($('<div>Loading</div>').load('ajax.html .info', function() {        
                            // Set the 'loaded' var to true so we know not to reload
                            // the HTML next time the #callback div animation ends
                            $(this).parent().data('loaded', true);  
                        }));
                    }
                });
                // Orientation callback event
                $('#jqt').bind('turn', function(e, data){
                    $('#orient').html('Orientation: ' + data.orientation);
                });
                
            });