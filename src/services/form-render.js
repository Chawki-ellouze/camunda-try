import CamundaRest from '../services/camunda-rest';
let convert = require('xml-js');

let parseXml;

if (typeof window.DOMParser != "undefined") {
    parseXml = function(xmlStr) {
        return new window.DOMParser().parseFromString(xmlStr, "text/xml");
    };
} else if (typeof window.ActiveXObject != "undefined" &&
    new window.ActiveXObject("Microsoft.XMLDOM")) {
    parseXml = function(xmlStr) {
        let xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlStr);
        return xmlDoc;
    };
} else {
    throw new Error("No XML parser found");
}

let getFormJs = function (data) {
    let xml = data.bpmn20Xml;
    let a = parseXml(xml).getElementById('Task_0ew8n1u');
    let b = new XMLSerializer().serializeToString(a)

    console.log(a);
    let jsonForm = convert.xml2js('<?xml version="1.0" encoding="utf-8"?>'+b, {compact: true, spaces: 4});
    console.log(jsonForm);

    return jsonForm;
};

export default {
    data() {
        return {
            processDefinitions: []
        };
    },

    created() {
        CamundaRest.getProcessDefinitions().then((response) => {
            this.processDefinitions = response.data;

            CamundaRest.getXMLByKey(response.data[0].key).then((x) => {
                let jsonForm = getFormJs(x.data)
                let type = jsonForm["bpmn:userTask"]["bpmn:extensionElements"]["camunda:formData"]["camunda:formField"]["_attributes"]["type"];
                let values = jsonForm["bpmn:userTask"]["bpmn:extensionElements"]["camunda:formData"]["camunda:formField"]["camunda:value"];
                if(type === 'enum'){
                    console.log(values);
                    values.map(function(value, key) {
                        console.log(value._attributes)

                    });
                }
            }).catch(() => {

            })

        }).catch(() => {
            //console.error(e);
        });

    }
};


