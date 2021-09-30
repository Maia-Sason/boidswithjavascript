let typewriter = document.querySelector("#hero");
let container = document.getElementsByClassName('type-contain')[0];

const changeText = () => {
  if (!writing.text) {
    const text = document.querySelector('#hero');
    text.style.display = "none";
  } else {
    const text = document.querySelector('#hero');
    text.style.display = "block";
  }
}

const writing = {
  text: true,
};
gui.add(writing, "text", true, false).onChange(changeText);

const delay = async (ms) => new Promise(res => setTimeout(res, ms));

const resizeText = (element) => {
  if (element) {
    let fontSize = window.getComputedStyle(element).fontSize;
    element.style.fontSize = `${(parseFloat(fontSize) - 1)}px`;

    if (element.clientWidth >= window.innerWidth - 200 ) {
      resizeText(element);
    }
  }
}

let string = ["Hello", "I'm Maia", "I'm a front end developer!"];

typewriter.innerHTML = ""
const write = async () => {
  let start = 0;
  while (true) {
    for (let i = 0; i < string.length; i++) {
      await delay(200);
        for (let j = start; j < string[i].length; j++) {
          await delay(40 + Math.random() * 15);
          typewriter.innerHTML += string[i].charAt(j);
          await resizeText(typewriter);
        }
        await delay(1000);
        for (let j = 0; j <= string[i].length; j++) {
          await delay(70);
          let str = string[i];
          str = str.substring(0, str.length - j);
          if (i < string.length - 1 && j < string[i].length && str == (string[i + 1].substring(0, str.length))) {
            start = str.length;
            typewriter.innerHTML = str;
            typewriter.style.fontSize = "150px";
            resizeText(typewriter);
            break;
          }
          start = 0;
          typewriter.innerHTML = str;
          typewriter.style.fontSize = "150px";
          resizeText(typewriter);
        }
      await delay(100);
    }
  }
}

write();