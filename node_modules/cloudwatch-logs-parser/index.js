"use strict";

/**
 * Convert spaces and dashes into underscore, trim the string
 * and lower case all letters.
 * param: key (String)
 * return: (String)
 */
let fixed_keys = (key) => {
    return key.trim().replace(/\s+/g,"_").replace(/-+/g,"_").toLowerCase();
}

/**
 * Fix the invalid json provided by aws logs streaming. into 
 * a proper json object.
 */
let fix_json_string = (broken_str) => {
    let fixed_json={}
    broken_str = broken_str.substr(1, broken_str.length-2);
    if(broken_str.length <= 0) return fixed_json;

    let broken_el = broken_str.split(",");

    
    for(let index in broken_el){
        let item=broken_el[index];

        if(item.includes("=")) {
            let attr = item.split("=");
            fixed_json[fixed_keys(attr[0])] = attr.slice(1).join('=');
        
        }else {
            let prev_item = broken_el[index-1];
            let prev_attr = prev_item.split("=");

            fixed_json[fixed_keys(prev_attr[0])] = fixed_json[fixed_keys(prev_attr[0])] + item;
        }
    }
    return fixed_json;
}

/**
 * Check either the given string is in json format.
 */
let is_json = (str) => {
    return str.startsWith("{") && str.endsWith("}");
}

module.exports = function(log_stream) {
    let log=log_stream["logEvents"]
    
    //TODO: add check if log stream is in invalid format then
    //      return from here, as we can not process it.

    let model={}
    
    for (let prop in log){
        let message = log[prop]["message"].split(":");
        
        if(message.length == 1) {
            model["status"] = message[0];
            continue;
        }

        let key = fixed_keys(message[0]);
        let value = message.slice(1).join(':').trim();
        if(is_json(value)) {
            try {
                model[key] = JSON.parse(value);
            }
            catch(err) {
                model[key] = fix_json_string(value);
            }
            
        } else {
            model[key] = value;
        }
    }
    return model;
}