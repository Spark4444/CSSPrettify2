1. Parse css to Json with "css-to-json"
https://www.npmjs.com/package/css-to-json
example json:
```json
{
  "children": {
    "@media (max-width: 800px)": {
      "children": {
        "#main #comments": {
          "children": {},
          "attributes": {
            "margin": "0px",
            "width": "auto",
            "background": "red"
          }
        },
        "#main #buttons": {
          "children": {},
          "attributes": {
            "padding": "5px 10px",
            "color": "blue"
          }
        }
      },
      "attributes": {}
    },
    "#main #content": {
      "children": {},
      "attributes": {
        "margin": "0 7.6%",
        "width": "auto"
      }
    },
    "#nav-below": {
      "children": {},
      "attributes": {
        "border-bottom": "1px solid #ddd",
        "margin-bottom": "1.625em",
        "background-image": "url(http://www.example.com/images/im.jpg)"
      }
    }
  },
  "attributes": {}
}
```

2. Sort the json alphabetically by selectors and sort the properties alphabetically inside each selector as well.
3. If a selector has two or more identical properties, merge them into one property with a comma-separated value.
4. Return the sorted and merged json.
5. Use electron for gui and node js for backend.
6. Js from frontend shouldnt handle any logic for the prettyfying, only send the css to backend and get the json back.