async function loadConfig() {
  const response = await fetch("/config");

  const config = await response.json();

  document.getElementById("page-title").textContent = config.title;
  const fullAddress = `${config.street},
${config.city},
${config.state}
${config.zip}`;

  document.getElementById("address").innerHTML = fullAddress.replaceAll(
    ",",
    "<br>",
  );

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  document.getElementById("mapLink").href = mapUrl;

  document.getElementById("wishlist").href = config.wishlist;

  updateCountdown(config.birthdayDate);
}
async function loadGallery() {
  const response = await fetch("/gallery");

  const gallery = await response.json();

  const container = document.getElementById("gallery");

  container.innerHTML = "";

  gallery.forEach((item) => {
    container.innerHTML += `
            <div class="birthday-item">

                <img src="${item.image}" class="birthday-img">

                <p class="birthday-label">
                    ${item.title}
                </p>

            </div>
        `;
  });
}
function updateCountdown(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  const birthday = new Date(year, month - 1, day);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  document.getElementById("birthday-date").innerHTML =
    "🎂 " + birthday.toLocaleDateString("en-US", options);

  const now = new Date();

  let nextBirthday = new Date(now.getFullYear(), month - 1, day);

  if (nextBirthday < now) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }

  const diff = nextBirthday - now;

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  document.getElementById("countdown").innerHTML =
    `🎉 Only <b>${days}</b> day${days !== 1 ? "s" : ""} until my birthday!`;
}
loadConfig();
loadGallery();
