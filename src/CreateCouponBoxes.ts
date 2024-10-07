const dataArray = ["1", "2", "3", "4", "5"];
const container = document.getElementById('scrollable-container');
const containerFragment = document.createDocumentFragment();

dataArray.forEach((item, index) => {
  const box = document.createElement('div');
  box.className = 'box';
  box.id = 'box' + (index + 1);

  const overlay = document.createElement('div');
  overlay.className = 'overlay';

  box.appendChild(overlay);

  const content = document.createElement('div');
  content.textContent = `Box ${item}`;
  box.appendChild(content);

  if (containerFragment) {
    containerFragment.appendChild(box);
  }
});

if (container) {
  container.appendChild(containerFragment);
}

const boxes = Array.from(document.querySelectorAll('.box')) as HTMLElement[];
const overlays = Array.from(document.querySelectorAll('.overlay')) as HTMLElement[];

let currentBoxIndex = 0;
const intervalDuration = 2000;

function showOverlay() {
  if (container) {

    overlays[currentBoxIndex].style.opacity = '0';
    container.removeChild(boxes[currentBoxIndex]);

    currentBoxIndex++;


    if (currentBoxIndex < boxes.length) {

      overlays[currentBoxIndex].style.opacity = '1';


      container.scrollLeft += boxes[currentBoxIndex].offsetWidth + 10;
    } else {
      container.removeChild(boxes[0]);
      boxes.shift();
      overlays.shift();
      currentBoxIndex--;
    }
  }
}

setInterval(showOverlay, intervalDuration);