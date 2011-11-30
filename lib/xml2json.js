// Custom function
function xml2json(xml){

    var xmlDOM = $.parseXML(xml);
    
    function processMultiple($node){
        var jsondata = [];
        $node.children().each(function(index,el){
            jsondata.push(processSingle($(this)));
        });
        return jsondata;
    }

    function processSingle($node){
        var jsonnode = {};
        
        $node.children().each(function(index,el){            
            if($(this).children()[0].nodeName == 'VALUE'){
                jsonnode[$(this).attr('name')] = $($(this).children()[0]).text();
            }
            else{
                jsonnode[$(this).attr('name')] = processMultiple($($(this).children()[0]));
            }
        });
        return jsonnode;
    }
    
    var json;
    
    $xml = $(xmlDOM);
    $xml.find('RESPONSE').children().each(function(index, el){
        if(el.nodeName == 'MULTIPLE'){
            json = processMultiple($(this));
            return;
        }
        else if(el.nodeName == 'SINGLE'){
            json = processSingle($(this));
            return;            
        }
    });
    
    if($xml.find('EXCEPTION').children().length > 0){
	json = {};
        
	$xml.find('EXCEPTION').children().each(function(index, el){
	    if(el.nodeName == 'MESSAGE'){
		json.exception = 1;
		json.message = $(this).text();
		return;
	    }
	});
    }
    
    return json;
}
