function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return passwordRegex.test(password);
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function submitForm(event) {
  const password = document.getElementById("pass").value;
  const email = document.getElementById("mail").value;

  const isEmailValid = validateEmail(email);
  const isPasswordValid = validatePassword(password);

  if (isEmailValid && isPasswordValid) {
    console.log("Form is valid! Submitting the form...");
    return true;
  } else {
    console.log("Invalid email or password format.");
    event.preventDefault();

    if (!isEmailValid) {
      alert("Please enter a valid email address.");
    }
    if (!isPasswordValid) {
      alert(
        "Password must be at least 8 characters, including one letter, one number, and one special character."
      );
    }
    return false;
  }
}

document.getElementById("sign").addEventListener("click", submitForm);
document.getElementById("login").addEventListener("click", submitForm);
