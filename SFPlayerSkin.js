// The idea is that this can be a web component

function SFPlayerSkin(player, div) {
  setInterval(updatePercentage, 50);

  function updatePercentage() {
    var percent = player.getPositionPercent();
    var time = player.getPositionTime();
    div.innerHTML = Math.floor(percent) + '% played <br/>' + Math.floor(time * 100)/100 + ' elapsed';
  }
}