$(document).ready(function(){

                setInterval(function(){
                    $('[id=timeid]').each(function(){
                        var oldTime = $(this).text();
                        var oldTimeSplit = oldTime.split(':');
                        var oldMinutes = parseInt(oldTimeSplit[0]);
                        var oldSeconds = parseInt(oldTimeSplit[1]);
                        oldSeconds = oldSeconds + oldMinutes * 60;
                        var newSeconds = oldSeconds + 1;
                        var newMinutes = Math.floor(newSeconds/60);
                        newSeconds = newSeconds % 60;
                        if(newSeconds < 10) newSeconds = '0' + newSeconds
                        if(newMinutes < 10) newMinutes = '0' + newMinutes
                        var newTime = newMinutes + ":" + newSeconds;
                        $(this).text(newTime);
                    });
                },1000);
    });
