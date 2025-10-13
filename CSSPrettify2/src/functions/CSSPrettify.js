import { parseCSS, reformatCSS, filterCSS, stringifyCSS } from "./functions.js";
import fs from "fs";

class CSSPrettify { 
    // Static function to prettify CSS string
    static prettify(css, options = {}) {
        return stringifyCSS(filterCSS(reformatCSS(parseCSS(css)), options));
    }

    static prettifyFile(filePath, options = {}) {
        const css = fs.readFileSync(filePath, "utf-8");
        const prettified = CSSPrettify.prettify(css, options);
        const filePathwithoutExt = filePath.replace(/\.[^/.]+$/, "");
        const newFilePath = `${filePathwithoutExt}.prettified.css`;
        fs.writeFileSync(newFilePath, prettified, "utf-8");
    }
}

export default CSSPrettify;