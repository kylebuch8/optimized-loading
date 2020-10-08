(function () {
  var searchForm = document.querySelector("#searchForm");
  var searchFormInput = document.querySelector("#searchFormInput");
  var searchFormAutocomplete = document.querySelector("#searchFormAutocomplete");
  var searchItems = [
    "Item 1",
    "Item 2",
    "United States",
    "Chicago Cubs",
    "Red Hat",
    "Purple",
    "Curious George",
    "United Kingdom",
    "Elephant",
    "Baseball",
    "Bingo",
    "Book",
    "Android",
    "iOS",
    "Linux",
    "Red Hat Enterprise Linux"
  ];

  searchForm.addEventListener("submit", searchFormSubmitHandler);

  searchFormAutocomplete.autocompleteRequest = function(params, callback) {
    const regx = new RegExp("\^" + params.query, "i");
    callback(searchItems.filter(function (item) {
      return regx.test(item);
    }));
  };

  function searchFormSubmitHandler(event) {
    event.preventDefault();

    var number;
    var host = (window.portal && window.portal.host) || 'https://access.redhat.com';
    var query = searchFormInput.value;

    switch (query) {
      case /^case:\s*(\d{1,})$/.test(query) :
        number = query.split(':')[1];
        number = number.length < 8 ? padZeroes(number): number;
        window.location = host + '/support/cases/' + number;
        break;
    
      case /^doc-(\d*)/.test(query):
        number = query.split('-')[1];
        window.location = host + '/node/' + number;
        break;

      case /^it-(.*)/.test(query):
        window.location = host + '/support/cases/list/';
        break;

      default:
        window.location = host + '/search/#/?q=' + encodeURIComponent(query);
    }
  }
}());