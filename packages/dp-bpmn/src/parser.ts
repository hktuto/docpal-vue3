import { XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser';
import {BPMNJSON} from "./types";


/**
 * Converts a BPMN text to JSON format.
 *
 * @param {string} bpmnText - The BPMN text to be converted.
 * @return {JSON} The JSON representation of the BPMN text.
 */
export const bpmnToJson = (bpmnText:string) :BPMNJSON => {
    const parser = new XMLParser( {
        ignoreAttributes: false,
        attributeNamePrefix : "attr_",
        cdataPropName:     "__cdata",
        allowBooleanAttributes: true,
        parseAttributeValue: true
    });
    return parser.parse(bpmnText);
}

/**
 * Converts a JSON object to a BPMN XML string.
 *
 * @param {JSON} json - The JSON object to be converted.
 * @return {string} The resulting BPMN XML string.
 */
export const jsonToBpmn =  (json:BPMNJSON):string => {
    const builder = new XMLBuilder(
        {
            ignoreAttributes: false,
            attributeNamePrefix : "attr_",
            cdataPropName:     "__cdata",
            // @ts-ignore
            allowBooleanAttributes: true,
            suppressBooleanAttributes: false
        }
    );
    return builder.build(json);
}