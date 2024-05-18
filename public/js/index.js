window.onload = () => {
  if (sessionStorage.name) {
    if (window.location.pathname === "/login") {
      location.href = "/";
    }
  } else {
    if (window.location.pathname !== "/login") {
      location.href = "/login";
    }
  }
};
const displayUsername = () => {
  const usernameSpan = document.getElementById("username");
  if (usernameSpan) {
    const name = sessionStorage.name || "Guest";
    usernameSpan.textContent = name;
  }
};

window.onload = () => {
  if (sessionStorage.name) {
    displayUsername();
  } else {
    location.href = "/login";
  }
};

// Function to handle logout
const handleLogout = () => {
  // Clear sessionStorage
  sessionStorage.clear();

  // Redirect to the login page
  location.href = "page-login.html";
};

document.addEventListener("DOMContentLoaded", () => {
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", (event) => {
      event.preventDefault();

      // Call the handleLogout function
      handleLogout();
    });
  }
});

const logOut = document.querySelector(".logout");

logOut.onclick = () => {
  sessionStorage.clear();
  location.reload();
};
