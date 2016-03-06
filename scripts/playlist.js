function Playlist (element, player) {
  this.createTemplate(element);
  this.selectedCommit = null;
  this.player = player;
}

Playlist.prototype.repoRegExp = /^[a-z0-9_-]+\/[a-z0-9_-]+$/i;

Playlist.prototype.createTemplate = function (element) {
  this.eRepoInfo = document.createElement('div');
  this.eRepoInfo.className = 'repo-info box cnt';
  this.eRepoInfo.textContent = 'Waiting for commit list';
  this.eCommitList = document.createElement('div');
  this.eCommitList.className = 'commit-list';

  this.element = element;
  this.element.appendChild(this.eRepoInfo);
  this.element.appendChild(this.eCommitList);
};

Playlist.prototype.clearList = function () {
  while (this.eCommitList.firstChild) {
    this.eCommitList.firstChild.remove();
  }
};

Playlist.prototype.addListItem = function (data) {
  var listItem = document.createElement('div');
  listItem.className = 'inline-action box';
  
  var label = document.createElement('div');
  label.className = 'cnt';

  var sha = document.createElement('p');
  sha.textContent = data.sha;
  sha.className = 'monospace inline-text';

  var info = document.createElement('p');
  info.className = 'inline-text';
  info.textContent = data.commit.message.substr(0, 50) + (data.commit.message.length > 50 ? '...' : '');

  label.appendChild(sha);
  label.appendChild(info);

  var play = document.createElement('button');
  play.textContent = '▶';
  play.className = 'cnt';
  play.onclick = function (e) {
    this.setSelected(e.currentTarget);
    this.player.setHash(data.sha);
  }.bind(this);

  listItem.appendChild(label);
  listItem.appendChild(play);

  this.eCommitList.appendChild(listItem);
}

Playlist.prototype.setSelected = function (newCommit) {
  if (this.selectedCommit) {
    this.selectedCommit.classList.remove('active');
  }
  newCommit.classList.add('active');
  this.selectedCommit = newCommit;
};

Playlist.prototype.loadRepo = function (repo) {
  if (!this.repoRegExp.test(repo)) {
    return;
  }
  githubFetcher(repo, function (commits) {
    window.smoothScrollTo(this.element);
    this.clearList();
    commits.forEach(function (commit) {
      this.addListItem(commit);
    }.bind(this));
    this.eRepoInfo.textContent = repo + ' commits';
  }.bind(this));
};