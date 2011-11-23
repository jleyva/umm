(function() {

    $("#btake").click(function(){
        localStorage.setItem('upload_action','takephoto');
        $.mobile.changePage("uploadimage.html");
    });
    
    $("#bbrowse").click(function(){
        localStorage.setItem('upload_action','browsephoto');
        $.mobile.changePage("uploadimage.html");
    });

})();