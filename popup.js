(async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const productList = document.getElementById("product-list");
  const loadingSpinner = document.getElementById("loading-spinner");
  if (tabs.length > 0) {
    const activeTab = tabs[0];
    const title = activeTab.title
      ? activeTab.title.split("-")[0].trim()
      : "no product";
    // document.querySelector(".title").textContent = title;//to add etail of product on webpage
    console.log("Active tab title:", title);
    const apiUrl = `https://serpapi.com/search.json?engine=google_shopping&q=${title}+ecofriendly&gl=in&api_key=Your_api_key_here`; // Replace with your actual API key

    document.addEventListener("DOMContentLoaded", (event) => {
      // const titleElement = document.querySelector(".title");
      // if (titleElement) {
      //   titleElement.textContent = title; // 'title' needs to be accessible here
      // } else {
      //   console.error("Element with class 'title' was not found.");
      // }
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log("Data:", data);
          if (data.shopping_results && Array.isArray(data.shopping_results)) {
            data.shopping_results.forEach((product) => {
              const productDiv = document.createElement("div");
              productDiv.className = "product";

              const productName = document.createElement("h2");
              productName.textContent = product.title;

              const productPrice = document.createElement("p");
              productPrice.textContent = `Price: ${product.price}`;

              const productImage = document.createElement("img");
              productImage.src = product.thumbnail;
              productImage.alt = product.title;

              const shopButton = document.createElement("a");
              shopButton.className = "shop-button";
              shopButton.href = product.product_link;  // Assuming the API returns a 'link' field for the product URL
              shopButton.target = "_blank"; // This ensures the link opens in a new tab
              shopButton.textContent = "Shop Now";

              const heartButton = document.createElement("span");
              heartButton.className = "heart-button";
              heartButton.innerHTML = "&#9829;"; // Unicode for heart symbol
              heartButton.addEventListener("click", () => {
                heartButton.classList.toggle("active");
              });

              productDiv.appendChild(productName);
              productDiv.appendChild(productPrice);
              productDiv.appendChild(productImage);
              productDiv.appendChild(shopButton);
              productDiv.appendChild(heartButton);

              productList.appendChild(productDiv);
            });
            // Hide the loading spinner and show the product list
            loadingSpinner.style.display = "none";
            productList.style.opacity = 1;
          } else {
            console.error(
              "Expected data.shopping_results to be an array but got:",
              data.shopping_results
            );
          }
        });
    });
  }
})();
