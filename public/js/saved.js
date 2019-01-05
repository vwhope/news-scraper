// function to save Article - toggle "saved" field from false to true for specified article id in Articles collection
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
}
