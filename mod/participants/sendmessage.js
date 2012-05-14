(function() {

    $("#page-sendmessage").live('pageshow',function() {
                
        setupPage();
        logInfo("Page show fired");
        
        setTimeout(function(){
            $("#textarea-a").focus();
        },0);
        
        function messageSend(data){
            popMessage("Message sent");
        }
        
        $("#bsend").click(function(){
            var data = {
                "messages[0][touserid]" : localStorage.getItem("current_user"),
                "messages[0][text]" : $("#textarea-a").val()
            }        
            
            moodleWSCall('moodle_message_send_instantmessages', data, messageSend, {nocache: 1});
        });
       
            
    });
    
})();