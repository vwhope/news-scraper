/* Toggle between adding and removing the "responsive" class
// to topnav when the user clicks on the hamburger icon */
function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

$(document).ready(function() {

  // function to save an Article
  // when user clicks the "Save Article" button,
  // the "saved" field toggles from false to true
  // for specified article id in Article collection
  function saveArticle(button, save) {

    //let button = $(this);
    let id = button.data("id");

    $.ajax({
        method: "POST",
        url: "/save/",
        data: {
            // update saved field
            saved: save,
            id: id
        }
    })
    // With that done
    .then(function(data) {
        // Log the response
        console.log(data);

        let parent = button.parent().parent();
        let unsaved = parent.find(".unsaved");
        let saved = parent.find(".saved");

        if (save) {

            saved.css("display", "block");
            unsaved.css("display", "none");

        } else {

            saved.css("display", "none");
            unsaved.css("display", "block");

        }
    });
  }

  $(".deleteSavedButton").on("click", function() {
    saveArticle($(this), false);
  });

  $(".saveButton").on("click", function() {
    saveArticle($(this), true);
  });

  $("#notesModal").on("show.bs.modal", function(event) {

    var button = $(event.relatedTarget);
    var articleId = button.data("id");
    var modal = $(this);

    $.ajax({
      method: "GET",
      url: "/articles/" + articleId
    })
    .then(function(data) {
      // Log response
      console.log(data);
      modal.find("#notesModalTitle").text(data.article.title);

      if (data.notes) {

        var savedNote = modal.find(".allNotes");
        savedNote.empty();

        // This is an example of let vs var.
        // let must be used to prevent lazy
        // evaluation of note._id in the on
        // click callback, else the button
        // will always delete the last note.

        for (let note of data.notes) {

          let button = $("<button class='deleteNote'>delete</button>");
          let span = $("<span />");

          button.on("click", function() {

            $.ajax({
              method: "POST",
              url: "/deleteNote/" + note._id
            })
            .then(function(res) {
              console.log(res);
              span.remove();
            })
            .catch(function(err) {
              console.log(err);
            });
          })

          span.append("<li>" + note.body + "</li>");
          span.append(button);

          savedNote.append(span);
        }
      }

      // Before adding click handler, remove any
      // that may have been previously added
      modal.find("#notesModalSaveButton").off("click");

      modal.find("#notesModalSaveButton").on("click", function() {
        // POST request to save note text (body) for specific article
        $.ajax({
          method: "POST",
          url: "/notes/" + articleId,
          data: {
            // Value taken from note textarea
            body: $("#notesText").val()
          }
        })
        .then(function(data) {
          // Log response
          console.log(data);
        })
        .catch(function(err) {
          console.log(err);
        });

        // clear input textarea for note
        $("#notesText").val("");
      });
    })
    .catch(function(error) {
      console.log(error);
    });
  });


  // begin word search
  $("#submitWordButton").click(
    function(event) {
      event.preventDefault();
      var userWord =  $("#userWord").val(); // get word user entered into search box
      console.log(userWord);
      searchTitle(userWord);
    }
  );

  function searchTitle (word) {
    console.log("I ran the searchTitle function");
    console.log("search word = " + word);
    $.ajax({
      method: "GET",
      url: "/search/" + word
    })
    .then(function(res) {
      console.log(res);

      $("#searchResult").empty();
      $("#searchResult").append(res);

      // TODO: Is there a better way to do this?
      // This is duplicated code in document.ready() - function saveArticle

      $(".deleteSavedButton").on("click", function() {
        saveArticle($(this), false);
      });

      $(".saveButton").on("click", function() {
        saveArticle($(this), true);
      });
    })
    .catch(function(err) {
      console.log(err);
    });
  }


 // end word search

});