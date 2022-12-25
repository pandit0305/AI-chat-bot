import bot from './assets/bot.svg';
import user from "./assets/user.svg";

const form = document.querySelector("form");

const chatContainer = document.querySelector("#chat-container");

let loadInterval;

const loader = (element)=>{
  element.textContent = "";

  loadInterval = setInterval(()=>{
    element.textContent += ".";

    // reset the loading
    if(element.textContent === "...."){
      element.textContent ="";
    }
  },300)

}

const typetext =(element, text)=>{
  let index = 0;
  let interval = setInterval(()=>{
    if(index < text.length){
      element.textContent += text.charAt(index);
      index++;
    }else{
      clearInterval(interval);
    }
  },20)
}


const generateUniqueId = ()=>{
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timeStamp}-${hexadecimalString}`;
}

const chatWith =(isAI, value, uniqueId)=>{
  return (
    `
      <div class="wrapper ${isAI && "ai"}">
          <div class="chat">
            <div class="profile">
              <img 
                src="${isAI ? bot : user}"
                alt="${isAI ? "bot" : "user"}"
              />
            </div>
            <div class="message" id=${uniqueId}> 
              ${value}
            </div>
          </div>
      </div>
    `
  )
}


const handleSubmit = async(e) =>{
  e.preventDefault();

  const data = new FormData(form);

  //user chat 

  chatContainer.innerHTML += chatWith(false, data.get("prompt"));

  form.reset();

  //robot chat

  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatWith(true, " ", uniqueId);

  chatContainer.scrollTo = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  const response = await fetch("https://vast-lime-angelfish-slip.cyclic.app",{
    method:"POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: data.get("prompt")
    })
  })

  clearInterval(loadInterval);

  messageDiv.innerHTML = "";

  if(response.ok){
    const data = await response.json();
    const parseData = data.bot.trim();

    typetext(messageDiv,parseData);

  }else{
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong";

    alert(err);

  }

}

form.addEventListener("submit", handleSubmit);

form.addEventListener("keyup", (e)=>{
  if(e.keyCode === 13){
    handleSubmit(e);
  }
})