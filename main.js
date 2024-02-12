document.getElementById('restart-button').addEventListener('click', function() {
  fetch('/restart')
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
});
