# CheckPointQuestion #
>v.1.0.0

jQuery plugin that places a multiple choice questions throughout a page for a comprehension test.  It provides instant feedback that can be customizable.  It is simple by design, so it can be easily customized for your application. 

###Features:
* Accepts JSON file
* Accepts an array of questions as an argument
* Questions can have custom feedback
* Questions can be ordered based on the elements on the page

### Demo
See index.html for examples.  For additional options, configuration, etc., view source.

### 1. Getting Started
Load jQuery(1.7+), handlebars(1.3+), and plugin files

```html
<!-- Basic stylesheet with minimal styling -->
<link rel="stylesheet" href="demo/css/checkpointquestion.css">

<!-- Include handlebars -->
<script src="checkPointQuestion/handlebars-v1.3.0.js.js"></script>
 
<!-- Include js plugin -->
<script src="checkPointQuestion/jquery.checkpointquestion.js"></script>
```
### 2. Set up your HTML
Specify a target container for the question to be rendered.  In this example, .example-check-point is the plugin target.  The markup that is injected into the container comes from a simple handlebar template that can be easily modified for your application.

```html
<div class="example-check-point check-point-question">
</div> <!-- END .check-point-question -->
```

### 3. Call the plugin
Now call the checkPointQuestion initializer function and your questions will be ready. NOTE: The location of the checkPointQuestion handlebars template must be specified.  

```html
// example with questions stored in a variable
var exampleQuestion = [
                    {
                        "id" : 1, // unique id for question to determine specified order
                        "text" : "What color is the sky?",
                        "choices" : [
                                        {"value": "a", "choice": "The color is red!"},
                                        {"value": "b", "choice": "The color is blue!"},
                                        {"value": "c", "choice": "The color is yellow!"},
                                        {"value": "d", "choice": "The color is green!"}
                                    ],
                        "answer": "b"
                    }
                ];

// example accepting variable
$('.example-check-point').checkPointQuestion({
    template: "path/to/checkpointquestion.template.html",
    questions: exampleQuestion
});
```

License
------------
The MIT License (MIT)
