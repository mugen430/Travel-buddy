var service;
var map;
var instance;
$("#findCity").on("click", function (event) {
    event.preventDefault();
    searchForCityByName();
});
$("input").keypress(event => {
    if (event.which == 13) {
        searchForCityByName();
    }
});
document.addEventListener('DOMContentLoaded', function () {
    var options = {
        dismissible: true,
        inDuration: 500,
        outDuration: 500
    }
    var elem = document.querySelector('.modal');
    instance = M.Modal.init(elem, options);
});

function convertToTitleCase(str) {
    let words = str.toLowerCase().split(" ");
    words.forEach(function (item, index) {
        words[index] = item[0].toUpperCase() + item.slice(1);
    })
    return words.join(" ");
}

function searchForCityByName() {
    var city = $("#search-input").val();
    var APIKey = "089100f1dce99fc69ca132b28b1e31ea";
    var queryURLWeather =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=imperial&appid=" +
        APIKey;
    $.ajax({
        url: queryURLWeather,
        method: "GET",
        error: (function (err) {
            return instance.open();
        })
    }).then(function (response) {
        console.log(response);
        $(".temp").text(
            "Current Temperature " +
            response.main.temp +
            String.fromCharCode(176) +
            "F in " +
            convertToTitleCase(city)
        );
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        get_travel_results(lat, lon)


    });
};
function get_travel_results(lat, long) {
    var city = $("#search-input").val();
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://tripadvisor1.p.rapidapi.com/restaurants/list-by-latlng?limit=10&currency=USD&distance=2&lunit=km&lang=en_US&latitude=${lat}&longitude=${long}`,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
            "x-rapidapi-key": "618050ee8dmsh8ac10980b6e1b1ep15855ejsn20bf06554b3a"
        }
    }
    $.ajax(settings).done(function (response) {
        console.log(response);
        $("#rest_results").empty()

        if (response.data.length) {
            for (let i = 0; i < 3; i++) {
                const place_name = response.data[i].name
                const address = response.data[i].address
                const url = response.data[i].website
                if (place_name, address, url !== undefined) {
                    $("#rest_results").append(`<p>${place_name}</p><p>${address}</p><p>${url}</p><hr/>`)
                }

            }
            get_hotel_results(response.data[0].ancestors[0].location_id)
        } else {
            $("#rest_results").append("<p>No Results found</p>")
        }

    });
}
function get_hotel_results(location_hotel) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://tripadvisor1.p.rapidapi.com/hotels/list?offset=0&currency=USD&limit=10&order=asc&lang=en_US&sort=recommended&location_id=${location_hotel}&adults=1&checkin=%3Crequired%3E&rooms=1&nights=2`,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
            "x-rapidapi-key": "618050ee8dmsh8ac10980b6e1b1ep15855ejsn20bf06554b3a"
        }
    }

    $.ajax(settings).done(function (response) {
        console.log(response);


        if (response.data.length) {
            for (let i = 0; i < 3; i++) {
                const hotel_name = response.data[i].name
                const hotel_price = response.data[i].price
                const hotel_ranking = response.data[i].ranking
                if (hotel_name, hotel_price, hotel_ranking !== undefined) {
                    $("#lodge_results").append(`<p>${hotel_name}</p><p>${hotel_price}</p><p>${hotel_ranking}</p><hr/>`)
                }

            }

        } else {
            $("#lodge_results").append("<p>No Results found</p>")
        }

    });
} 
