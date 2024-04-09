let currentPage = 1;
const perPage = 10;
let darkMode = false;

function getRepos() {
    const username = document.getElementById('username').value;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.github.com/users/' + username + '/repos?page=' + currentPage + '&per_page=' + perPage, true);
    xhr.onload = function() {
        if (this.status === 200) {
            const repos = JSON.parse(this.responseText);
            let output = '';
            for(const i in repos) {
                output +=
                    '<h3>' + repos[i].name + '</h3>' +
                    '<button onclick="getCommits(\'' + username + '\', \'' + repos[i].name + '\')">Ver Commits</button>';
            }
            document.getElementById('repos').innerHTML = output;
        } else {
            document.getElementById('repos').innerHTML = 'Erro ao obter repositórios. Por favor, tente novamente.';
        }
    }
    xhr.onerror = function() {
        document.getElementById('repos').innerHTML = 'Erro ao obter repositórios. Por favor, tente novamente.';
    }
    xhr.send();
}

function getCommits(username, repo) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.github.com/repos/' + username + '/' + repo + '/commits?page=' + currentPage + '&per_page=' + perPage, true);
    xhr.onload = function() {
        if (this.status === 200) {
            let commits = JSON.parse(this.responseText);
            let output = '';
            for(const i in commits) {
                output +=
                    '<h3>' + commits[i].commit.message + '</h3>' +
                    '<p>' + new Date(commits[i].commit.author.date).toLocaleString() + '</p>'+
                    '<a href="https://github.com/' + username + '/' + repo + '/commit/' + commits[i].sha + '">Ver Commit no GitHub</a>';

            }
            document.getElementById('commits').innerHTML = output;
        } else if (this.status === 404) {
            document.getElementById('commits').innerHTML = 'Este repositório é privado ou não existe.';
        } else {
            document.getElementById('commits').innerHTML = 'Erro ao obter commits. Por favor, tente novamente.';
        }
    }
    xhr.onerror = function() {
        document.getElementById('commits').innerHTML = 'Erro ao obter commits. Por favor, tente novamente.';
    }
    xhr.send();
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        getRepos();
    }
}

function nextPage() {
    currentPage++;
    getRepos();
}

function toggleTheme() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode');
    document.getElementById('commits').classList.toggle('dark-mode');
    document.getElementById('title').classList.toggle('dark-mode');
    document.getElementById('repos').classList.toggle('dark-mode');
    let buttons = document.querySelectorAll('button');
    buttons.forEach(function(button) {
        button.classList.toggle('dark-mode');
    });
    let themeIcon = document.getElementById('theme-icon');
    themeIcon.src = darkMode ? 'assets/moon-fill.svg' : 'assets/brightness-high-fill.svg';
    themeIcon.alt = darkMode ? 'Modo Escuro' : 'Modo Claro';
}