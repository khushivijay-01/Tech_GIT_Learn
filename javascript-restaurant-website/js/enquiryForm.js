'use strict';

const enquiryForm = document.querySelector(".enquiry form");
const formMsg = document.getElementById("formMsg");

const successMsg = document.createElement("p");
successMsg.textContent = "Response Submitted Succesfully!";
successMsg.style.display = "none";
successMsg.style.color = "green";
successMsg.style.marginTop = "20px";

enquiryForm.after(successMsg);

function showMsg(message, color) {
  formMsg.textContent = message;
  formMsg.style.color = color;
}

enquiryForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const message = document.getElementById("message").value.trim();

  if (name === "" || email === "" || phone === "") {
    showMsg("Please fill all required fields", "red");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    showMsg("Please enter a valid email address", "red");
    return;
  }

  if (phone.length < 10) {
    showMsg("Please enter a valid phone number", "red");
    return;
  }

  const enquiryData = {
    name: name,
    email: email,
    phone: phone,
    message: message,
    submittedAt: new Date().toLocaleString(),
  };

  const enquiries = JSON.parse(localStorage.getItem("enquiries")) || [];
  enquiries.push(enquiryData);
  localStorage.setItem("enquiries", JSON.stringify(enquiries));

  enquiryForm.style.display = "none";
  formMsg.textContent = "";
  successMsg.style.display = "block";
});
