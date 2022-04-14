
import JSRP from "json-schema-ref-parser";

export function dereference(json_obj, callback) {
    let parser = new JSRP();

    inne_parse(parser, json_obj).then(function(){
        callback && callback(null, json_obj)
    }).catch(function(e){
        callback && callback(e)
    })
}

async function inne_parse(parser, json_obj) {
    for (const [key, value] of Object.entries(json_obj)) {    
        if (key == "schema") {
            let schema = await parser.dereference(value)
            json_obj[key] = schema
        } else {
            if (Object.prototype.toString.call(value) === '[Object Object]') {
                await inne_parse(parser, value)
            }
        }
    }
}