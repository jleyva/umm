(function() {
    setupPage();

    $("#page-addnote").live('pageshow',function() {        
        setTimeout(function(){
            $("#textarea-a").focus();
        },0);
        
        function noteAdded(data){
            popMessage("Note added");
        }
        
        $("#bsend").click(function(){
            var data = {
                "notes[0][userid]" : localStorage.getItem("current_user"),
                "notes[0][publishstate]": 'personal',
                "notes[0][courseid]": localStorage.getItem("current_course"),
                "notes[0][text]": $("#textarea-a").val(),
                "notes[0][format]": 'text'
            }        
            
            moodleWSCall('moodle_notes_create_notes', data, noteAdded, {nocache: 1});
        });
       
            
    });
    
})();