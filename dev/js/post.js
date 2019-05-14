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

  // publish
  $(".publish-button").on("click", function(e) {
    e.preventDefault();
    removeErrors();

    var data = {
      title: $("#post-title").val(),
      body: $("#post-body").html()
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
        $(location).attr("href", "/");
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
