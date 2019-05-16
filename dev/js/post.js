/* eslint-disable no-undef */
$(function() {
  // eslint-disable next-line

  var editor = new MediumEditor("#post-body", {
    placeholder: {
      text: "",
      hideOnClick: true
    }
  });

  // remove errors
  function removeErrors() {
    $(".post-form p.error").remove();
    $(".post-form input, #post-body").removeClass("error");
  }

  // clear
  $("post-form input, #post-body").on("focus", function() {
    removeErrors();
  });

  // delete
  $(".delete-button").on("click", function(e) {
    e.preventDefault();
    removeErrors();
  });

  // publish
  $(".publish-button, .save-button").on("click", function(e) {
    e.preventDefault();
    removeErrors();

    var isDraft =
      $(this)
        .attr("class")
        .split(" ")[0] === "save-button";

    var data = {
      title: $("#post-title").val(),
      body: $("#post-body").html(),
      isDraft: isDraft,
      postId: $("#post-id").val()
    };

    $.ajax({
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      url: "/post/add"
    }).done(function(data) {
      console.log(data);
      if (!data.ok) {
        $("p.error").remove();
        $(".post-form h2").after('<p class="error">' + data.error + "</p>");
        if (data.fields) {
          data.fields.forEach(function(item) {
            $("#post-" + item).addClass("error");
          });
        }
      } else {
        /*$(".register h2").after(
            '<p class="success"> Registration success!</p>'
          );*/
        // $(location).attr("href", "/");
        if (isDraft) {
          $(location).attr("href", "/post/edit/" + data.post.id);
        } else {
          $(location).attr("href", "/posts/" + data.post.url);
        }
      }
    });
  });

  // upload
  $("#fileinfo").on("sumbit", function(e) {
    e.preventDefault();

    var formData = new FormData(this);
    $.ajax({
      type: "POST",
      url: "/upload/file",
      data: formData,
      processData: false,
      contentType: false,
      success: function(r) {
        console.log(r);
      },
      error: function(e) {
        console.log(e);
      }
    });
  });
});

/* eslint-enable no-undef */
