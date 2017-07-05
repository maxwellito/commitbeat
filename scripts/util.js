/**
 * Method to load commit information from GitHub
 * @param  {string}   repo      Repo name (ex: 'maxwellito/commitbeat')
 * @param  {function} callback  Callback for success case
 * @return {promise}     Promise resolved with GitHub data
 */
function githubFetcher (repo, callback) {
  var xmlhttp = new XMLHttpRequest();
  var url = 'https://api.github.com/repos/' + repo + '/commits';

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var myArr = JSON.parse(xmlhttp.responseText);
      callback(myArr);
    }
  };
  xmlhttp.open('GET', url, true);
  xmlhttp.send();
}

/**
 * Transform an string of hex chars into
 * an array of int
 * @param  {string} input HEX code to transform
 * @return {Int8Array}    Array of integers
 */
function hexToArray (input) {
  var four, val, len = input.length * 4,
      output = [];

  for (var i = 0; i < len; i++) {
    val = hexToInt(input.substr(i, 1))
    for (four = 3; four >= 0; four--) {
      output[i * 4 + four] = (val % 2 === 0) ? 0 : 1;
      val = val >> 1;
    }
  }
  return output;
}

/**
 * Transform a string of hex chars into
 * an integer
 * @param  {string} input HEX code to transform
 * @return {number}
 */
function hexToInt (input) {
  return parseInt(input, 16);
}

/**
 * Trun a binary array to an integer
 * @param  {array} input Input to transform
 * @return {number}
 */
function binToInt (input) {
  return input.reduce(function (acc, val) {
    return acc * 2 + val;
  }, 0);
}