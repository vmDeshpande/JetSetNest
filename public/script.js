let navbarDiv = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
    navbarDiv.classList.add("navbar-cng");
  } else {
    navbarDiv.classList.remove("navbar-cng");
  }
});

const navbarCollapseDiv = document.getElementById("navbar-collapse");
const navbarShowBtn = document.getElementById("navbar-show-btn");
const navbarCloseBtn = document.getElementById("navbar-close-btn");
// show navbar
if (navbarShowBtn) {
  navbarShowBtn.addEventListener("click", () => {
    navbarCollapseDiv.classList.add("navbar-collapse-rmw");
  });
}
// hide side bar
if (navbarCloseBtn) {
  navbarCloseBtn.addEventListener("click", () => {
    navbarCollapseDiv.classList.remove("navbar-collapse-rmw");
  });
}

document.addEventListener("click", (e) => {
  if (
    e.target.id != "navbar-collapse" &&
    e.target.id != "navbar-show-btn" &&
    e.target.parentElement.id != "navbar-show-btn"
  ) {
    navbarCollapseDiv.classList.remove("navbar-collapse-rmw");
  }
});

// stop transition and animatino during window resizing
let resizeTimer;
window.addEventListener("resize", () => {
  document.body.classList.add("resize-animation-stopper");
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove("resize-animation-stopper");
  }, 400);
});

toggleAuthLinks();
// register function
function register() {
  let registrationData;
  registrationData = {
    username: document.getElementById("username").value,
    number: document.getElementById("number").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registrationData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.message === "User registration successful") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `registration successful`,
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/login.html";
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: `${data.message}`,
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `${error.message}`,
      });
    });
}

// inquire function
function inquire() {
  let inquireData;
  inquireData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
  };

  fetch("/inquire", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inquireData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.message === "Inquire Submitted") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Inquire Submitted`,
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: `${data.message}`,
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `${error.message}`,
      });
    });
}

// login function
function login() {
  const loginData = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };

  fetch(`/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.message === "User login successful") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `login successful`,
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/";
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: `${data.message}`,
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `${error.messsage}`,
      });
    });
}

//  admin login
function adminlogin() {
  const loginData = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };

  fetch(`/adminlogin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.message === "Admin login successful") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `login successful`,
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/admin/html/layouts-container.html";
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: `${data.message}`,
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `${error.messsage}`,
      });
    });
}

// check login activity
async function isUser() {
  try {
    const response = await fetch("/check-auth-status");
    const data = await response.json();

    return data.isUser || false;
  } catch (error) {
    console.error("Error checking company status:", error);
    return false;
  }
}

async function isAdmin() {
  try {
    const response = await fetch("/check-auth-status");
    const data = await response.json();

    return data.isAdmin || false;
  } catch (error) {
    console.error("Error checking company status:", error);
    return false;
  }
}

// toggle links
async function toggleAuthLinks() {
  const loginLink = document.getElementById("loginLink");
  const logoutButton = document.getElementById("logoutLink");
  const adminPanel = document.getElementById("adminPanel");
  const userPanel = document.getElementById("userPanel");

  console.log("waiting for login...");
  if (await isUser()) {
    console.log("logged in as user");
    if (loginLink) loginLink.style.display = "none";
    if (logoutButton) logoutButton.style.display = "inline";
    if (userPanel) userPanel.style.display = "inline";
    if (adminPanel) adminPanel.style.display = "none";
  } else if (await isAdmin()) {
    console.log("logged in as admin");
    if (loginLink) loginLink.style.display = "none";
    if (userPanel) userPanel.style.display = "none";
    if (logoutButton) logoutButton.style.display = "inline";
    if (adminPanel) adminPanel.style.display = "inline";
  } else {
    console.log("no one logged in");
    if (loginLink) loginLink.style.display = "inline";
    if (logoutButton) logoutButton.style.display = "none";
    if (userPanel) userPanel.style.display = "none";
    if (adminPanel) adminPanel.style.display = "none";
  }
}

// logout function
const logoutButton = document.getElementById("logoutLink");

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    fetch("/logout")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        window.location.href = "/login.html";
      })
      .catch((error) => console.error("Error:", error));
  });
}

// submit package
function submitPackage() {
  console.log("called");
  const packageData = new FormData();
  packageData.append(
    "packageTitle",
    document.getElementById("basic-icon-default-fullname").value
  ),
    packageData.append(
      "tourLocation",
      document.getElementById("basic-icon-default-company").value
    ),
    packageData.append(
      "price",
      document.getElementById("basic-icon-default-email").value
    ),
    packageData.append(
      "date",
      document.getElementById("html5-date-input").value
    ),
    packageData.append(
      "description",
      document.getElementById("basic-icon-default-message").value
    );

  const thumbnailInput = document.getElementById("formFile");
  packageData.append("thumbnailImage", thumbnailInput.files[0]);

  fetch("/upload-package", {
    method: "POST",
    body: packageData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.message === "Package uploaded successfully") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Package uploaded successfully",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/admin/html/layouts-container.html";
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: `${data.message}`,
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `${error.message}`,
      });
    });
}

// load packages on page
document.addEventListener("DOMContentLoaded", async () => {
  const PublicPackages = document.getElementById("loadPackagesOnPublic");
  const DestinationsLoad = document.getElementById("destinationsLoad");
  const AdminPackages = document.getElementById("loadPackagesOnAdmin");
  const UserPackages = document.getElementById("loadBookedPackages");
  const InquiresLoad = document.getElementById("inquiresLoad");
  const BookingsLoad = document.getElementById("bookingsLoad");

  if (PublicPackages) {
    try {
      const response = await fetch("/get-packages-listings");
      if (!response.ok) {
        throw new Error(`Failed to fetch packages: ${response.statusText}`);
      }

      const responseData = await response.json();

      if (!Array.isArray(responseData)) {
        throw new Error("Invalid response format: expected an array");
      }

      for (const package of responseData) {
        try {
          const response2 = await fetch(
            `/image?imageId=${package.thumbnailImage}`
          );
          if (!response2.ok) {
            console.log(
              "Failed to fetch thumbnail image:",
              response2.statusText
            );
            continue;
          }

          const responseData2 = await response2.json();
          const base64Data = responseData2.fileData;

          const blob = base64toBlob(base64Data);

          const blobUrl = URL.createObjectURL(blob);

          const packageCard = document.createElement("div");
          packageCard.classList.add("blog-item", "my-2", "shadow");
          console.log(package);

          packageCard.innerHTML = `
            <div class="blog-item-top">
              <img src="${blobUrl}" alt="blog">
              <span class="blog-date">${package.date}</span>
            </div>
            <div class="blog-item-bottom">
              <h3>${package.packageTitle}</h3>
              <p><strong>Location:</strong> ${package.tourLocation}</p>
              <p><strong>Price:</strong> ₹${package.price}</p>
              <p class="text">${package.description}</p>
              <button class="btn" onclick="handlePackageBooking('${package.date}', '${blobUrl}', '${package.packageTitle}', '${package.tourLocation}', '${package.price}', '${package.description}')">Book Now</button>
            </div>

          `;

          PublicPackages.appendChild(packageCard);
        } catch (error) {
          console.error("Error fetching thumbnail image:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching packages listings:", error);
    }
  } else {
    console.log("none");
  }

  if (DestinationsLoad) {
    try {
      const response = await fetch("/get-packages-listings");
      if (!response.ok) {
        throw new Error(`Failed to fetch packages: ${response.statusText}`);
      }

      const responseData = await response.json();

      if (!Array.isArray(responseData)) {
        throw new Error("Invalid response format: expected an array");
      }

      for (const package of responseData) {
        try {
          const response2 = await fetch(
            `/image?imageId=${package.thumbnailImage}`
          );
          if (!response2.ok) {
            console.log(
              "Failed to fetch thumbnail image:",
              response2.statusText
            );
            continue;
          }

          const responseData2 = await response2.json();
          const base64Data = responseData2.fileData;

          const blob = base64toBlob(base64Data);

          const blobUrl = URL.createObjectURL(blob);

          const packageCard = document.createElement("div");
          packageCard.classList.add("blog-item", "my-2", "shadow");
          console.log(package);

          packageCard.innerHTML = `
            <div class="blog-item-top">
              <img src="${blobUrl}" alt="blog">
            </div>
            <div class="blog-item-bottom">
              <h3>${package.packageTitle}</h3>
              <p><strong>Location:</strong> ${package.tourLocation}</p>
              <p class="text">${package.description}</p>
            </div>            
          `;

          DestinationsLoad.appendChild(packageCard);
        } catch (error) {
          console.error("Error fetching thumbnail image:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching packages listings:", error);
    }
  } else {
    console.log("none");
  }

  if (AdminPackages) {
    try {
      const response = await fetch("/get-packages-listings");
      if (!response.ok) {
        throw new Error(`Failed to fetch packages: ${response.statusText}`);
      }

      const responseData = await response.json();

      if (!Array.isArray(responseData)) {
        throw new Error("Invalid response format: expected an array");
      }

      for (const package of responseData) {
        try {
          const response2 = await fetch(
            `/image?imageId=${package.thumbnailImage}`
          );
          if (!response2.ok) {
            console.log(
              "Failed to fetch thumbnail image:",
              response2.statusText
            );
            continue;
          }

          const responseData2 = await response2.json();
          const base64Data = responseData2.fileData;

          const blob = base64toBlob(base64Data);

          const blobUrl = URL.createObjectURL(blob);

          const packageCard = document.createElement("div");
          packageCard.classList.add("col");
          console.log(package);

          packageCard.innerHTML = `
            <div class="card h-100">
            <img class="card-img-top" src="${blobUrl}" alt="Card image cap" />
            <div class="card-body">
              <h5 class="card-title">${package.packageTitle}</h5>
              <small class="float-start">${package.tourLocation}</small><br>
              <small class="text-muted float-start">${package.date}</small><br>
              <p class="card-text">
              ${package.description}
              </p>
              <button href="javascript:void(0)" class="btn btn-outline-primary">₹${package.price}</button>
            </div>
          </div>
          `;

          AdminPackages.appendChild(packageCard);
        } catch (error) {
          console.error("Error fetching thumbnail image:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching packages listings:", error);
    }
  } else {
    console.log("none");
  }

  if (UserPackages) {
    try {
      const response = await fetch("/get-booked-packages-listings");
      if (!response.ok) {
          console.log(`Failed to fetch packages: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      console.log(responseData);
  
      // Assuming responseData is an array of package objects
  
      for (const booking of responseData) {
        for (const bookedPackage of booking.bookings) {
          try {
              const packageCard = document.createElement("div");
              packageCard.classList.add("blog-item", "my-2", "shadow");
  
              packageCard.innerHTML = `
                  <div class="blog-item-top">
                      <img src="${bookedPackage.blobUrl}" alt="blog">
                      <span class="blog-date">${bookedPackage.date}</span>
                  </div>
                  <div class="blog-item-bottom">
                      <h3>${bookedPackage.packageTitle}</h3>
                      <p><strong>Location:</strong> ${bookedPackage.tourLocation}</p>
                      <p><strong>Price:</strong> ₹${bookedPackage.price}</p>
                      <p class="text">${bookedPackage.description}</p>
                      <button class="btn" onclick="cancelPackageBooking('${bookedPackage.date}', '${bookedPackage.blobUrl}', '${bookedPackage.packageTitle}', '${bookedPackage.tourLocation}', '${bookedPackage.price}', '${bookedPackage.description}')">Cancel Booking</button>
                  </div>
              `;
  
              UserPackages.appendChild(packageCard);
          } catch (error) {
              console.error("Error fetching thumbnail image:", error);
          }
        }
      }
  } catch (error) {
      console.error("Error fetching packages listings:", error);
  }  
  } else {
    console.log("none");
  }

  if (InquiresLoad) {
    try {
        const response = await fetch("/get-all-inquiries");
        if (!response.ok) {
            throw new Error(`Failed to fetch inquiries: ${response.statusText}`);
        }

        const responseData = await response.json();

        if (!Array.isArray(responseData)) {
            throw new Error("Invalid response format: expected an array");
        }

        let counter = 1; // Initialize the counter variable

        for (const inquire of responseData) {
            const inquireRow = document.createElement("tr");
            console.log(inquire);

            inquireRow.innerHTML = `
                <th scope="row">${counter}</th>
                <td>${inquire.name}</td>
                <td>${inquire.email}</td>
                <td>${inquire.message}</td>
            `;

            InquiresLoad.appendChild(inquireRow);
            
            counter++; // Increment the counter for the next row
        }
    } catch (error) {
        console.error("Error fetching inquiries listings:", error);
    }
} else {
    console.log("none");
}

if (BookingsLoad) {
  try {
      const response = await fetch("/get-booked-packages-listings-admin");
      if (!response.ok) {
          throw new Error(`Failed to fetch bookings: ${response.statusText}`);
      }
      const responseData = await response.json();

      if (!Array.isArray(responseData)) {
          throw new Error("Invalid response format: expected an array");
      }

      let counter = 1; // Initialize the counter variable

      for (const booking of responseData) {
          for (const bookedPackage of booking.bookings) {
              const bookingRow = document.createElement("tr");
              console.log(bookedPackage);

              bookingRow.innerHTML = `
                  <th scope="row">${counter}</th>
                  <td>${bookedPackage.packageTitle}</td>
                  <td>${booking.username}</td>
                  <td>${booking.email}</td>
                  <td>${booking.number}</td>
              `;

              BookingsLoad.appendChild(bookingRow);
              
              counter++; // Increment the counter for the next row
          }
      }
  } catch (error) {
      console.error("Error fetching bookings listings:", error);
  }
} else {
  console.log("none");
}



});

function base64toBlob(base64Data) {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: "image/png" });
}

async function handlePackageBooking(date, blobUrl, packageTitle, tourLocation, price, description) {
  if(await isUser()) {
    fetch("/package-booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, blobUrl, packageTitle, tourLocation, price, description }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.message === "Booking status updated successfully") {
          Swal.fire({
            icon: "info",
            title: "Payment!",
            text: `Pay ₹${price} ?`,
            confirmButtonText: "Pay",
          }).then(() => {
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: `Booking status updated successfully`,
              confirmButtonText: "OK",
            })
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `Booking status updating Failed.`,
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: `You need to login first!`,
      confirmButtonText: "OK",
    }).then((result) => {
        window.location.href = "/login.html";
    });
  }
}
  function cancelPackageBooking(date, blobUrl, packageTitle, tourLocation, price, description) {
    fetch("/cancel-package-booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, blobUrl, packageTitle, tourLocation, price, description }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.message === "Booking canceled successfully") {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: `Booking canceled successfully`,
            confirmButtonText: "OK",
          }).then((result) => {
              window.location.href = "/userPanel.html";
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `Booking status updating Failed.`,
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }