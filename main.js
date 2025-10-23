$(document).ready(function () {
  $(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    alert("Smooth scrolling activated!");
  });
});