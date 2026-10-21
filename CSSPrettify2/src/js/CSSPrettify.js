import filterCSS from "./filter.js";
import { stringifyCSS } from "./formatter.js";
import parseCSS from "./parser.js";
import reformatCSS from "./reformatter.js";
import fs from "fs";

/**
 * Prettify a CSS string
 * @param {string} css - The CSS string to prettify
 * @param {object} options - Formatting options
 * @returns {string} Prettified CSS string
 */
export function prettify(css, options = {}) {
    return stringifyCSS(filterCSS(reformatCSS(parseCSS(css)), options));
}

/**
 * Prettify a CSS file and save it with a .min.prettified.css extension
 * @param {string} filePath - Path to the CSS file
 * @param {object} options - Formatting options
 * @returns {string} Path to the prettified file
 */
export function prettifyFile(filePath, options = {}) {
    const css = fs.readFileSync(filePath, "utf-8");
    const prettified = prettify(css, options);
    const filePathwithoutExt = filePath.replace(/\.[^/.]+$/, "");
    const newFilePath = `${filePathwithoutExt}.min.prettified.css`;

    fs.writeFileSync(newFilePath, prettified, "utf-8");
    
    return newFilePath;
}