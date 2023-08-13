const form = document.querySelector("form");
// static/script.js
document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.querySelector("input[type='submit']");
  const inputFields = form.querySelectorAll("input, textarea");

  inputFields.forEach((input) => {
    input.addEventListener("input", validateForm);
  });

  function validateForm() {
    let isValid = true;
    inputFields.forEach((input) => {
      if (!input.validity.valid) {
        isValid = false;
      }
    });

    submitButton.disabled = !isValid;
  }
});

document
  .getElementsByTagName("form")[0]
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const submitButton = document.querySelector("input[type='submit']");

    submitButton.disabled = true;
    submitButton.value = "Sending...";
    // Perform an AJAX request to submit the form data
    fetch("/submit", {
      method: "POST",
      body: new FormData(form),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response
        if (data.status === "success") {
          setTimeout(function () {
            submitButton.value = "Sent";
            submitButton.style.backgroundColor = "green";
            submitButton.style.color = "white";
          }, 2000); // 2 seconds
          // Wait 3 seconds
          setTimeout(success, 3000);
        } else if (data.status === "exceeded") {
          remaining = data.remaining_time;
          submitButton.value = "Exceeded";
          submitButton.style.backgroundColor = "yellow";
          submitButton.style.color = "black";
          // Hide the form elements
          for (child of form.children) {
            // If the element does not have .greeting class, hide it
            if (
              !child.classList.contains("greeting") &&
              !child.classList.contains("submit-button")
            ) {
              child.style.display = "none";
            }
          }
          document.querySelector(".greeting").innerHTML =
            "Server Busy! Please wait " +
            String(Math.floor(remaining / 60)) +
            " minutes before sending another message";
        } else {
          // submission failure, throw error
          throw new Error(data.error);
        }
      })
      .catch((error) => {
        // Handle errors if needed
        submitButton.value = "Failed to send";
        submitButton.style.backgroundColor = "red";
        submitButton.style.color = "white";
      });
  });

function success() {
  // Hide the form elements
  for (child of form.children) {
    // If the element does not have .greeting class, hide it
    if (!child.classList.contains("greeting")) {
      child.style.display = "none";
    }
  }
  // Modify the greeting element
  const greeting = document.querySelector(".greeting");
  greeting.children[0].innerHTML = "Thank you for your message!";
  greeting.style.fontSize = "3rem";
}
