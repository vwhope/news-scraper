
// function to add a note for specified article id in Articles collection
// When you click the Save Article button
function saveArticle(id, saved) {
    $.ajax({
        method: "POST",
        url: "/save/",
        data: {
            // update saved field to true
            saved: saved,
            id: id
        }
    })
    // With that done
    .then(function(data) {
        // Log the response
        console.log(data);
    });

    return false;
}

// function to delete Article and associated notes from the database
// or can just change saved field to false
// When you click the delete Article button
$(document).on("click", "#deleteArticle", function(id) {

    function deleteArticle(id) {
        $.ajax({
            method: "DELETE",
            url: "/scrape/" + id,
            data: {
                // update saved field to true
                saved: true
            }
        })
        // With that done
        .then(function(data) {
            // Log the response
            console.log(data);
        });
    }
})
