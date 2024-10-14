import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const [showNewComponent, setShowNewComponent] = useState(false);
  const mainContainerRef = useRef(null);

  useEffect(() => {
    let tl = gsap.timeline();

    tl.to(".Left_h3", {
      ease: "expo.inOut",
      left: "37.4%",
      duration: 2,
    })
      .to(
        ".Right_h3",
        {
          ease: "expo.inOut",
          left: "43.4%",
          duration: 2,
        },
        "-=2"
      )
      .to(".Left_h3, .Right_h3", {
        opacity: 0,
        duration: 0.5,
        delay: 0,
      })
      .to(
        ".red-box",
        {
          opacity: 1,
          duration: 1,
          ease: "expo.inOut",
        },
        "-=1"
      )
      .call(() => {
        // Wait for 10 seconds before starting the shrinking animation

        setTimeout(() => {
          gsap.to(mainContainerRef.current, {
            opacity: 0, // Fade out smoothly
            duration: 1, // Duration for the fade-out
            ease: "power2.inOut", // Smooth ease for the fade-out
            onComplete: () => {
              gsap.to(mainContainerRef.current, {
                width: 0,
                height: 0,
                borderRadius: "100%", // Ensure it appears as a circle
                duration: 1, // Duration for shrinking
                ease: "power2.inOut", // Smooth easing for shrinking effect
                transformOrigin: "center center", // Set transform origin to center
                onComplete: () => setShowNewComponent(true), // Show new component after shrinking
              });
            },
          });
        }, 4000); // 4 seconds delay
      });
  }, []);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const PI2 = Math.PI * 2;

    // Helper function to calculate distance between two points
    Math.dist = function (a, b) {
      var dx = a.x - b.x;
      var dy = a.y - b.y;
      return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    };

    const center = { x: w / 2, y: h / 2 };
    const maxDistance = Math.sqrt(
      Math.pow(center.x, 2) + Math.pow(center.y, 2)
    );
    let stars = [];
    let time = new Date().getTime();

    class Star {
      constructor() {
        this.offset = Math.random() * maxDistance; // Random distance from the center
        this.velocity = Math.random() * 0.5 + 0.5; // Control how fast stars rotate
        this.angle = Math.random() * PI2; // Random starting angle
        this.alpha = 0.5 + Math.random() * 0.5; // Make stars more visible
        this.radius = Math.random() * 2 + 0.5; // Random star radius
        this.fillColor =
          "rgba(" +
          ~~(Math.random() * 255) +
          "," +
          ~~(Math.random() * 255) +
          "," +
          ~~(Math.random() * 255) +
          "," +
          this.alpha +
          ")"; // Random color
      }

      draw(context) {
        // Move the star around a circle
        this.angle += this.velocity * 0.01; // Control rotation speed
        this.coords = {
          x: center.x + Math.cos(this.angle) * this.offset, // x position on circle
          y: center.y + Math.sin(this.angle) * this.offset, // y position on circle
        };

        // Draw the shadow
        context.shadowBlur = 8;
        context.shadowColor = this.fillColor;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        // Draw the star
        context.fillStyle = this.fillColor;
        context.beginPath();
        context.arc(this.coords.x, this.coords.y, this.radius, 0, PI2);
        context.fill();
        context.closePath();
      }
    }

    function initStars() {
      stars = [];
      for (let i = 0; i < 200; i++) {
        stars.push(new Star());
      }
    }

    function renderStars() {
      time = new Date().getTime();
      context.clearRect(0, 0, w, h); // Clear the canvas for each frame

      // Fill background with a slight opacity to create trailing effect
      context.fillStyle = "rgba(1, 4, 35, 0.05)";
      context.fillRect(0, 0, w, h);

      stars.forEach((star) => star.draw(context));
      requestAnimationFrame(renderStars);
    }

    function resizeCanvas() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    initStars();
    renderStars();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="parent-container">
      <div className="main-container" ref={mainContainerRef}>
        <h3 className="Left_h3">AI</h3>
        <h3 className="Right_h3">WORKFORCE</h3>
        <div className="red-box">
          <canvas ref={canvasRef} />
        </div>
      </div>
      {showNewComponent && (
        <div className="new-component">New Component Appears!</div>
      )}
    </div>
  );
};

export default App;
