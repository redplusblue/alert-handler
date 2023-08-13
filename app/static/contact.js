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
      // For email field
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
              !child.classList.contains("greeting-wrapper") &&
              !child.classList.contains("submit-button")
            ) {
              child.style.display = "none";
            }
          }
          greeting = document.querySelector(".greeting");
          greeting.style.width = "66ch";
          greeting.style.height = "auto";
          greeting.style.fontSize = "2rem";
          greeting.innerHTML = "";
          greeting.style.animation = "none";
          setTimeout(() => {
            if (parseInt(remaining) < 60) {
              document.querySelector(".greeting").innerHTML =
                "Server Busy! Please wait " +
                String(remaining) +
                " seconds before sending another message.";
            } else
              document.querySelector(".greeting").innerHTML =
                "Server Busy! Please wait " +
                String(Math.floor(remaining / 60)) +
                " minutes before sending another message.";
            greeting.style.animation =
              "typing 3s steps(100), blink 0.5s step-end infinite alternate";
          }, 100);
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
    if (!child.classList.contains("greeting-wrapper")) {
      child.style.display = "none";
    }
  }
  // Modify the greeting element
  const greeting = document.querySelector(".greeting");
  greeting.style.width = "27ch";
  greeting.style.height = "auto";
  greeting.style.fontSize = "3rem";
  greeting.innerHTML = "";
  greeting.style.animation = "none";

  setTimeout(() => {
    greeting.innerHTML = "Thank you for your message!";
    greeting.style.animation =
      "typing 2s steps(100), blink 0.5s step-end infinite alternate";
  }, 100);
}
