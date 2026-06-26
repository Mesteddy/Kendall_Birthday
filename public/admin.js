async function loadSettings() {
  const response = await fetch("/config");

  const config = await response.json();

  document.getElementById("birthdayTitle").value = config.title;

  document.getElementById("birthdayDate").value = config.birthdayDate;

  document.getElementById("street").value = config.street;

  document.getElementById("city").value = config.city;

  document.getElementById("state").value = config.state;

  document.getElementById("zip").value = config.zip;

  document.getElementById("wishlist").value = config.wishlist;
}

async function saveSettings() {
  const config = {
    title: document.getElementById("birthdayTitle").value,

    birthdayDate: document.getElementById("birthdayDate").value,
    street: document.getElementById("street").value,

    city: document.getElementById("city").value,

    state: document.getElementById("state").value,

    zip: document.getElementById("zip").value,

    wishlist: document.getElementById("wishlist").value,
  };

  const response = await fetch("/config", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(config),
  });

  const result = await response.json();

  if (result.success) {
    alert("✅ Settings saved!");
  }
}
async function loadGallery() {
  const response = await fetch("/gallery");

  const gallery = await response.json();

  const container = document.getElementById("photoList");

  container.innerHTML = "";

  gallery.forEach((item, index) => {
    container.innerHTML += `
            <div class="photo-card">

                <img
                    src="${item.image}"
                    class="admin-photo">

                <h3>${item.title}</h3>

                <button onclick="deletePhoto(${index})">

                    🗑 Delete

                </button>

            </div>
        `;
  });
}

async function uploadPhoto() {
  const title = document.getElementById("photoTitle").value;

  const photo = document.getElementById("photo").files[0];

  if (!title || !photo) {
    alert("Please enter a title and choose a photo.");

    return;
  }

  const formData = new FormData();

  formData.append("title", title);

  formData.append("photo", photo);

  const response = await fetch("/upload", {
    method: "POST",

    body: formData,
  });

  const result = await response.json();

  if (result.success) {
    alert("Picture Uploaded!");

    document.getElementById("photoTitle").value = "";

    document.getElementById("photo").value = "";

    loadGallery();
  }
}
async function deletePhoto(index) {
  if (!confirm("Delete this photo?")) {
    return;
  }

  const response = await fetch("/delete/" + index, {
    method: "DELETE",
  });

  const result = await response.json();

  if (result.success) {
    loadGallery();
  }
}

loadGallery();

loadSettings();
loadGallery();
uploadPhoto();
deletePhoto();
