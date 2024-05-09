import * as THREE from "three";
import Experience from "../Experience";
import { ScrollTrigger } from "gsap/ScrollTrigger"
import GSAP from "gsap";
import ASScroll from "@ashthornton/asscroll"

export default class Controls {
   experience: Experience;
   scene: THREE.Scene;
   resources: any;
   time: any;
   timeline!: gsap.core.Timeline;
   room: any;
   sizes: any;
   rectLight?: THREE.RectAreaLight;
   asscroll!: ASScroll;
   circleFirst: THREE.Mesh<THREE.CircleGeometry, THREE.MeshStandardMaterial>;
   circleSecond: THREE.Mesh<THREE.CircleGeometry, THREE.MeshStandardMaterial>;
   circleThird: THREE.Mesh<THREE.CircleGeometry, THREE.MeshStandardMaterial>;


   constructor() {
      this.experience = new Experience();
      this.scene = this.experience.scene;
      this.resources = this.experience.resources;
      this.time = this.experience.time;
      this.room = this.experience.world.room.actualRoom;
      this.sizes = this.experience.sizes;
      // this.rectLight = this.experience.world.room.roomChildren['rectLight'] as THREE.RectAreaLight;

      this.circleFirst = this.experience.world.floor.circleFirst;
      this.circleSecond = this.experience.world.floor.circleSecond;
      this.circleThird = this.experience.world.floor.circleThird;

      GSAP.registerPlugin(ScrollTrigger)
      this.setSmoothScroll()
      this.setScrollTriggerRoom01();
      // this.clearSmoothScroll();
   }

   setupAsscroll() {
      // https://github.com/ashthornton/asscroll
      const asscroll = new ASScroll({
         ease: 0.1,
         disableRaf: true,
      });

      GSAP.ticker.add(asscroll.update);

      ScrollTrigger.defaults({
         scroller: asscroll.containerElement,
      });

      ScrollTrigger.scrollerProxy(asscroll.containerElement, {
         scrollTop(value) {
            if (arguments.length) {
               //@ts-ignore
               asscroll.currentPos = value;
               return;
            }
            return asscroll.currentPos;
         },
         getBoundingClientRect() {
            return {
               top: 0,
               left: 0,
               width: window.innerWidth,
               height: window.innerHeight,
            };
         },
         fixedMarkers: true,
      });

      asscroll.on("update", ScrollTrigger.update);
      ScrollTrigger.addEventListener("refresh", asscroll.resize);

      requestAnimationFrame(() => {
         asscroll.enable({
            newScrollElements: document.querySelectorAll(
               ".gsap-marker-start, .gsap-marker-end, [asscroll]"
            ),
         });
      });
      return asscroll;
   }

   setSmoothScroll() {
      this.asscroll = this.setupAsscroll()
   }

   setScrollTriggerRoom01() {
      ScrollTrigger.matchMedia({
         //desktop
         "(min-width: 969px)": () => {
            this.room.scale.set(0.11, 0.11, 0.11)
            // if (this.rectLight) {
            //    this.rectLight.intensity = 3;
            // }
            //first section
            //@ts-ignore
            const firstTimeline = new GSAP.timeline({
               scrollTrigger: {
                  trigger: ".first-section-margin",
                  // markers: true,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 0.5,
                  invalidateOnRefresh: true,
               }
            }).to(this.room.position, {
               x: () => this.sizes.width * 0.0012
            })

            //second section
            //@ts-ignore
            const secondTimeline = new GSAP.timeline({
               scrollTrigger: {
                  trigger: ".second-section-margin",
                  // markers: true,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 0.5,
                  invalidateOnRefresh: true,
               }
            }).to(this.room.position, {
               x: () => -this.sizes.width * 0.0015
            })

            //third section
            //@ts-ignore
            const thirdTimeline = new GSAP.timeline({
               scrollTrigger: {
                  trigger: ".third-section-margin",
                  // markers: true,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 0.5,
                  invalidateOnRefresh: true,
               }
            }).to(this.room.position, {
               x: () => this.sizes.width * 0.0012
            })
         },
         //mobile
         "(max-width: 968px)": () => {
            this.room.scale.set(0.1, 0.1, 0.1)
            // if (this.rectLight) {
            //    this.rectLight.intensity = 1.5;
            // }
            //first section
            //@ts-ignore
            const firstTimeline = new GSAP.timeline({
               scrollTrigger: {
                  trigger: ".first-section-margin",
                  // markers: true,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 0.5,
                  invalidateOnRefresh: true,
               }
            }).to(this.room.scale, {
               x: 0.1, y: 0.1, z: 0.1
            })

            //second section
            //@ts-ignore
            const secondTimeline = new GSAP.timeline({
               scrollTrigger: {
                  trigger: ".second-section-margin",
                  // markers: true,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 0.5,
                  invalidateOnRefresh: true,
               }
            }).to(this.room.position, {
               x: () => -this.sizes.width * 0.0015
            })

            //third section
            //@ts-ignore
            const thirdTimeline = new GSAP.timeline({
               scrollTrigger: {
                  trigger: ".third-section-margin",
                  // markers: true,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 0.5,
                  invalidateOnRefresh: true,
               }
            }).to(this.room.position, {
               x: () => this.sizes.width * 0.0012
            })
         },
         all: () => {
            const sections = document.querySelectorAll(".section")
            sections.forEach((section) => {
               const progressWrapper = section.querySelector(".progress-wrapper")
               const progressBar = section.querySelector(".progress-bar")

               if (section.classList.contains("right")) {
                  GSAP.to(section, {
                     borderTopLeftRadius: 20,
                     scrollTrigger: {
                        trigger: section,
                        start: "top bottom",
                        end: "top top",
                        scrub: 0.6,
                     },
                  });
                  GSAP.to(section, {
                     borderBottomLeftRadius: 700,
                     scrollTrigger: {
                        trigger: section,
                        start: "bottom bottom",
                        end: "bottom top",
                        scrub: 0.6,
                     },
                  });
               }
               else {
                  GSAP.to(section, {
                     borderTopRightRadius: 20,
                     scrollTrigger: {
                        trigger: section,
                        start: "top bottom",
                        end: "top top",
                        scrub: 0.6,
                     },
                  });
                  GSAP.to(section, {
                     borderBottomRightRadius: 700,
                     scrollTrigger: {
                        trigger: section,
                        start: "bottom bottom",
                        end: "bottom top",
                        scrub: 0.6,
                     },
                  });
               }

               GSAP.from(progressBar, {
                  scaleY: 0,
                  scrollTrigger: {
                     trigger: section,
                     start: "top top",
                     end: "bottom bottom",
                     scrub: 0.5,
                     pin: progressWrapper,
                     pinSpacing: false
                  }
               })
            })

            //first circle animation
            //@ts-ignore
            const firstTimeline = new GSAP.timeline({
               scrollTrigger: {
                  trigger: ".first-section-margin",
                  // markers: true,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 0.5,
                  invalidateOnRefresh: true,
               }
            }).to(this.circleFirst.scale, {
               x: 3, y: 3, z: 3
            })

            //second section
            //@ts-ignore
            const secondTimeline = new GSAP.timeline({
               scrollTrigger: {
                  trigger: ".second-section-margin",
                  // markers: true,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 0.5,
                  invalidateOnRefresh: true,
               }
            }).to(this.circleSecond.scale, {
               x: 3, y: 3, z: 3
            })

            //third section
            //@ts-ignore
            const thirdTimeline = new GSAP.timeline({
               scrollTrigger: {
                  trigger: ".third-section-margin",
                  // markers: true,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 0.5,
                  invalidateOnRefresh: true,
               }
            }).to(this.circleThird.scale, {
               x: 3, y: 3, z: 3
            })
         }

      })
   }

   clearSmoothScroll() {
      GSAP.ticker.remove(this.asscroll.update);
      this.asscroll.off("update", ScrollTrigger.update);
      ScrollTrigger.removeEventListener("refresh", this.asscroll.resize);
   }

   update() {

   }
}