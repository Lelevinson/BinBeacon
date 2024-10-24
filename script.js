// Initialize the map and set default view to Yuan Ze University
var map = L.map("map").setView([24.9705, 121.2634], 16); // Yuan Ze University coordinates

// Load and display tile layer on the map (OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
	maxZoom: 19,
	attribution: "© OpenStreetMap",
}).addTo(map);

// Trash bin data (lat, lon, type) around Yuan Ze University
var trashBins = [
	{ lat: 24.971, lon: 121.262, type: "recyclable" }, // Near the main gate
	{ lat: 24.972, lon: 121.264, type: "non-recyclable" }, // Near the library
	{ lat: 24.9697, lon: 121.26745, type: "recyclable" }, // Near the dormitory
	{ lat: 24.9685, lon: 121.26759, type: "non-recyclable" },
	{ lat: 24.969, lon: 121.261, type: "non-recyclable" }, // Near the parking area
	{ lat: 24.9705, lon: 121.2631, type: "recyclable" }, // Central area
];

// Function to create custom markers with different colors
function createBinMarker(lat, lon, type) {
	var markerColor;
	var iconHtml;

	// Set color and icon based on bin type
	if (type === "recyclable") {
		markerColor = "green"; // Recyclable bins
		iconHtml = `<span style="color:${markerColor}; font-weight:bold;">♻️ Recyclable</span>`;
	} else {
		markerColor = "red"; // Non-recyclable bins
		iconHtml = `<span style="color:${markerColor}; font-weight:bold;">🗑️ Non-Recyclable</span>`;
	}

	// Custom colored icon using Leaflet
	var customIcon = L.divIcon({
		className: "custom-div-icon",
		html: `<div style="background-color:${markerColor};width:15px;height:15px;border-radius:50%;"></div>`,
		iconSize: [15, 15],
	});

	// Create the marker with the custom icon
	L.marker([lat, lon], { icon: customIcon })
		.addTo(map)
		.bindPopup(iconHtml, { closeOnClick: false, autoClose: false })
		.on("mouseover", function (e) {
			this.openPopup();
		})
		.on("mouseout", function (e) {
			this.closePopup();
		});
}

// Check if geolocation is available
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(
		function (position) {
			const lat = position.coords.latitude;
			const lon = position.coords.longitude;

			// Set the map view to the user's current location
			map.setView([lat, lon], 16);

			// Add a marker at the current location
			L.marker([lat, lon]).addTo(map).bindPopup("You are here!").openPopup();

			// Add trash bin markers around Yuan Ze University
			trashBins.forEach(function (bin) {
				createBinMarker(bin.lat, bin.lon, bin.type);
			});
		},
		function () {
			alert(
				"Geolocation failed. Showing default location at Yuan Ze University."
			);
			// Add trash bin markers in case geolocation fails
			trashBins.forEach(function (bin) {
				createBinMarker(bin.lat, bin.lon, bin.type);
			});
		}
	);
} else {
	alert("Geolocation is not supported by this browser.");
	// Add trash bin markers in case geolocation is not supported
	trashBins.forEach(function (bin) {
		createBinMarker(bin.lat, bin.lon, bin.type);
	});
}
