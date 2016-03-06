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