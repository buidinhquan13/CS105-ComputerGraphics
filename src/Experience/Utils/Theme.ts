import { EventEmitter } from "events";

export default class Theme extends EventEmitter {
   theme: string;
   toggleButton: any;
   toggleCircle: any;


   constructor() {
      super();
      this.theme = "light";

      this.toggleButton = document.querySelector(".toggle-button")
      this.toggleCircle = document.querySelector(".toggle-circle")
      this.setEventListeners()
   }

   setEventListeners() {
      this.toggleButton.addEventListener("click", () => {
         this.theme = this.theme === "light" ? "dark" : "light"
         this.toggleCircle.classList.toggle("slide")

         let bodyEl = document.body
         bodyEl.className = this.theme
         //pass this.theme to the callback
         this.emit("switch-theme", this.theme)
      })
   }
}