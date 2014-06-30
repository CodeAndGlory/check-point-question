/*
    checkpoint question v 1.0.0

    Copyright (C) 2014 Jody M.

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
(function($) {

    jQuery.fn.checkPointQuestion = function(options) {

        // default settings
        var defaults = {
            template: null, // file location of the html template, required
            questions: null, // individual question object, optional if file provided
            file: null, // file location of question objects, optional if questions provided
            questionID: null, // array of ids to specifiy the order of question objects on a page (ex: [4,2,1,3]), optional
            incorrectFB: "That is incorrect.  Please try again.", // default incorrect feedback
            correctFB: "Correct!" // default correct feedback
        };

        var settings = $.extend({}, defaults, options);

        var $this = $(this);

        // template is required
        if (settings.template === null) {
            alert('checkpoint question: question template must be defined.');
        
        // question or questions file is required
        } else if (settings.question === null && settings.file === null) {
            alert('checkpoint question: question file or a question must be provided');
        } else {

            // load template
            $.when(

                $.ajax({
                    url: settings.template
                })

            ).then(function(data, textStatus) {

                // if template loaded
                if (textStatus == 'success') {

                    var sourceTemplate = data;

                    // if question is null, assume questions are coming from a file
                    if (settings.questions === null) {

                        $.ajax({
                            url: settings.file
                        }).done(function(data, textStatus) {

                            if (textStatus != 'success') {
                                alert('checkpoint question: a network error occurred and the questions file did not load');
                            } else {

                                var questions = data.questions;
                                processQuestions($this, sourceTemplate, questions);

                            } // else

                        }); // done()

                    // assume questions being passed in as an argument
                    } else {

                        var questions = settings.questions;
                        processQuestions($this, sourceTemplate, questions);

                    }

                // template failed to load
                } else {
                    alert('checkpoint question: a network error occurred. the checkpoint question template did not load.');
                }

            }); // then()           

        }

        return $this;

        // private functions below
        
        /**
         * setup and render questions for plugin
         * @param  jQuery Object $this          the target element
         * @param  string sourceTemplate      string of the handlebar html template
         * @param  Array questions      array of question objects
         */
        function processQuestions($this, sourceTemplate, questions) {

            // if questionID is null, load first question
            if (settings.questionID === null) {

                var i = 0;
                $this.each(function() {

                    if(questions[i] !== undefined) {
                        setUpCheckpointQuestion(questions[i], sourceTemplate, $(this));
                    } else {
                        alert('checkpoint question: there are more checkpoints than there are questions');
                    }
                    i++;

                }); // each()

            // question order specified by array of ids
            } else {

                var i = 0;
                $this.each(function() {

                    if (settings.questionID[i] !== undefined) {

                        var question = getQuestionById(settings.questionID[i], questions);

                        if (question !== null) {
                            setUpCheckpointQuestion(question, sourceTemplate, $(this));
                        } else {
                            alert('checkpoint question: question not found with that id');
                        }

                    } else {
                        alert('checkpoint question: there are more checkpoints than there are ids');
                    }

                    i++;

                }); // each()
            } // else

        } // processQuestions

        /**
         * returns question object based on id
         * 
         * @param  {int} id    the id of the desired question to be returned
         * @param  {array} questions    an array of question objects
         * @return {object|null}    returns question object if found, null otherwise
         */
        function getQuestionById(id, questions) {

            var question = null;

            for (var index in questions) {

                if (questions[index].id == id) {
                    question = questions[index];
                    break;
                }

            } // for()

            return question;

        } // getQuestionById()

        /**
         * returns feedback for a question based on choice selected
         * 
         * @param {string} choice    selected choice
         * @param {object} question   question object that contains feedback for each choice
         * @return {string|null}    returns feedback as a string or null if feedback not found
         */
        function getFeedbackByChoice(choice, question) {

            var choiceFeedback = null;
            var questionFeedback = question.feedback;

            if(questionFeedback !== undefined) {

                for (var index in questionFeedback) {

                    if (questionFeedback[index].value == choice) {
                        choiceFeedback = questionFeedback[index].feedback;
                        break;
                    } // if

                } // for()
            } // if

            return choiceFeedback;

        } // getFeedbackByChoice()

        /**
         * renders question inside the target element and attaches events to make the checkpoint function
         * 
         * @param {question object}    question       
         * @param {string} sourceTemplate    html template for question
         * @param {jQuery Object} $elem    target element for the rendered question
         */
        function setUpCheckpointQuestion(question, sourceTemplate, $elem) {

            var template = Handlebars.compile(sourceTemplate);

            var html = template(question);
            $elem.append(html);

            var $feedback_wrapper = $('.checkpoint-question-feedback', $elem);

            $('input[type=radio]', $elem).on('click', function() {

                var $input = $(this);

                var feedback = getFeedbackByChoice($input.val(), question); // check to see if custom feedback exists

                // if custom feedback has not been set, use default feedback
                if(feedback === null) {
                    if($input.val() == question.answer) {
                        feedback = settings.correctFB;
                    } else {
                        feedback = settings.incorrectFB;
                    }
                }   

                $feedback_wrapper.html(feedback);                           

                // if correct, add css class to feedback and vice versa
                if ($input.val() == question.answer) {
                    $feedback_wrapper.removeClass('check-point-incorrect').addClass('check-point-correct');
                } else {
                    $feedback_wrapper.addClass('check-point-incorrect').removeClass('check-point-correct');
                }

            }); // on click

        } // setUpCheckpointQuestion()

    }; // checkpointQuestion

}(jQuery));