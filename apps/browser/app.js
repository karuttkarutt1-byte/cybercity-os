function openBrowser(url){
  const win = document.getElementById("browser");
  win.style.display = "flex";
  document.getElementById("frame").src = url;
}
