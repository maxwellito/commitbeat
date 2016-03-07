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
  var len = input.length * 4,
    val = hexToInt(input),
    output = new Int8Array(input.length * 4);

  for (len--; len >= 0; len--) {
    output[len] = (val % 2 === 0) ? 0 : 1;
    val = val >> 1;
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