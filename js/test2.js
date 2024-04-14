document.addEventListener("DOMContentLoaded", function() {
    const list = document.getElementById("list");
    const items = list.getElementsByTagName("li");
    let currentIndex = 0;

    function rotateList() {
        // Remove 'active' class from current active item
        items[currentIndex].classList.remove("active");

        // Update currentIndex to the next item
        currentIndex = (currentIndex + 1) % items.length;

        // Add 'active' class to the new active item
        items[currentIndex].classList.add("active");

        // Move the top item to the bottom
        list.appendChild(items[0]);
    }

    // Set interval to rotate the list every 2 seconds
    setInterval(rotateList, 2000);
});
