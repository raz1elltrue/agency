/* eslint-disable no-undef */
$(function() {
  // eslint-disable next-line

  var editor = new MediumEditor("#post-body", {
    placeholder: {
      text: "",
      hideOnClick: true
    }
  });

  // clear
  $("post-form input, #post-body").on("focus", function() {
    $("p.error").remove();
    $("input, div").removeClass("error");
  });

  // publish
  $(".publish-button").on("click", function(e) {
    e.preventDefault();

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
});

/* eslint-enable no-undef */
