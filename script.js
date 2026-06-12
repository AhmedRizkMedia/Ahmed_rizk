document.addEventListener("DOMContentLoaded", () => {
  // --- Header Sticky Effect ---
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // --- Mobile Menu Toggle ---
  const mobileToggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      mobileToggle.classList.toggle("open");
    });
  }

  // Close mobile menu on nav link click
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      mobileToggle?.classList.remove("open");
    });
  });


  // --- Count-up Animation for Metrics ---
  const metricValues = document.querySelectorAll(".metric-value");
  let observerTriggered = false;

  const countUp = (element) => {
    const target = parseFloat(element.getAttribute("data-target"));
    const isPercent = element.getAttribute("data-percent") === "true";
    const isPlus = element.getAttribute("data-plus") === "true";
    const duration = 2000;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = progress * (2 - progress);
      const currentVal = easedProgress * target;

      if (isPercent) {
        element.textContent = currentVal.toFixed(2) + "%";
      } else {
        element.textContent = Math.floor(currentVal).toLocaleString() + (isPlus ? "+" : "");
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        if (isPercent) {
          element.textContent = target.toFixed(2) + "%";
        } else {
          element.textContent = target.toLocaleString() + (isPlus ? "+" : "");
        }
      }
    };

    requestAnimationFrame(updateCount);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !observerTriggered) {
        observerTriggered = true;
        metricValues.forEach(val => countUp(val));
        animateBarChart();
      }
    });
  }, { threshold: 0.2 });

  const metricsSection = document.querySelector(".metrics-grid");
  if (metricsSection) {
    observer.observe(metricsSection);
  }

  // --- Case Studies Tabs ---
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-tab");
      
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      tabContents.forEach(content => {
        content.classList.remove("active");
        if (content.id === targetId) {
          content.classList.add("active");
        }
      });

      if (targetId === "case1") {
        animateBarChart();
      } else if (targetId === "case2") {
        animateDonutSegments();
      }
    });
  });

  // --- Case Study 1: Google Ads Bar Chart Animation ---
  function animateBarChart() {
    const barFills = document.querySelectorAll(".bar-fill");
    barFills.forEach(fill => {
      const width = fill.getAttribute("data-width");
      fill.style.width = width + "%";
    });
  }

  // --- Case Study 2: Donut Chart Hover / Interactivity ---
  const donutActionTitle = document.getElementById("action-title");
  const donutActionDesc = document.getElementById("action-desc");
  const legendItems = document.querySelectorAll(".legend-item");
  const donutSegments = document.querySelectorAll(".donut-segment");

  const leadActions = {
    qualified: {
      title: "Action Taken on Qualified (8.84%)",
      desc: "Double down on sourcing. Google Ads conversion optimizations resulted in a 34% CR. Trained the sales team to prioritize follow-ups to maintain hot interest."
    },
    followup: {
      title: "Action Taken on Follow-Up Needed (20.96%)",
      desc: "Identified agent response delays. Built real-time lead alerts in CRM and reduced response time from 24 hours down to under 2 hours, boosting conversion efficiency."
    },
    unqualified: {
      title: "Action Taken on Unqualified (31.97%)",
      desc: "System optimization. Shifted budget from broader keywords to targeted Google Search + WhatsApp pre-qualification chatbot, sorting out bad clicks automatically."
    },
    noanswer: {
      title: "Action Taken on No Answer (32.14%)",
      desc: "Outreach scheduling. Introduced WhatsApp auto-reminders and staggered agent calling schedules (evening/morning rotations) to improve connection success."
    },
    wrongnumber: {
      title: "Action Taken on Wrong Number (6.09%)",
      desc: "Data verification. Added a verification check on landing pages, ensuring valid country codes and active formats before forms could be submitted."
    }
  };

  function updateDonutDetails(status) {
    if (leadActions[status]) {
      donutActionTitle.textContent = leadActions[status].title;
      donutActionDesc.textContent = leadActions[status].desc;
      
      legendItems.forEach(item => {
        item.classList.remove("active");
        if (item.getAttribute("data-status") === status) {
          item.classList.add("active");
        }
      });
    }
  }

  donutSegments.forEach(seg => {
    seg.addEventListener("mouseenter", () => updateDonutDetails(seg.getAttribute("data-status")));
  });

  legendItems.forEach(item => {
    item.addEventListener("mouseenter", () => updateDonutDetails(item.getAttribute("data-status")));
  });

  function animateDonutSegments() {
    donutSegments.forEach(seg => {
      const dashArrayVal = seg.getAttribute("stroke-dasharray");
      seg.style.strokeDasharray = "0, 100";
      setTimeout(() => {
        seg.style.transition = "stroke-dasharray 1.2s ease-out";
        seg.style.strokeDasharray = dashArrayVal;
      }, 50);
    });
  }

  // --- Case Study 3: Chatbot Decision Tree Interaction ---
  const treeNodes = document.querySelectorAll(".tree-node");
  const chatbotDesc = document.getElementById("chatbot-action-desc");

  const chatbotNodeDetails = {
    start: "User enters funnel from Meta or Google Ads. Chatbot triggers automatically on WhatsApp.",
    buy: "Buy Path chosen: Chatbot asks for budget, preferred location, and timing. Pre-qualifies client as buyer.",
    sell: "Sell Path chosen: Chatbot asks for property details, area, size, and expectation. Pre-qualifies client as seller.",
    qual: "Lead qualifies budget/area specs -> Passed instantly to CRM for immediate agent routing.",
    unqual: "Lead does not meet requirements -> Added to long-term automated drip campaign. Saves agent calls."
  };

  treeNodes.forEach(node => {
    node.addEventListener("click", () => {
      treeNodes.forEach(n => n.classList.remove("active"));
      node.classList.add("active");
      
      const nodeId = node.getAttribute("data-node");
      if (chatbotNodeDetails[nodeId]) {
        chatbotDesc.innerHTML = `<strong>Selected Node - ${node.textContent.trim()}:</strong> ${chatbotNodeDetails[nodeId]}`;
      }
    });
  });

  // --- Media Production Portfolio Filtering ---
  const filterButtons = document.querySelectorAll(".filter-btn");
  const filterItems = document.querySelectorAll(".filter-item");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterVal = btn.getAttribute("data-filter");

      filterItems.forEach(item => {
        if (filterVal === "all" || item.classList.contains(filterVal)) {
          item.style.display = "block";
          setTimeout(() => { item.style.opacity = "1"; item.style.transform = "scale(1)"; }, 50);
        } else {
          item.style.opacity = "0";
          item.style.transform = "scale(0.8)";
          setTimeout(() => { item.style.display = "none"; }, 300);
        }
      });
    });
  });

  // --- Lightbox / Modal Database for Both Sections ---
  const lightbox = document.getElementById("portfolio-lightbox");
  const lightboxClose = document.querySelector(".lightbox-close");
  const mediaContainer = document.getElementById("lightbox-media-container");

  const realEstateDetails = {
    nautica: {
      title: "Select Group: Nautica at Maritime City",
      price: "From AED 1.76 Million",
      type: "image",
      src: "images/nautica.png",
      desc: "A premium waterfront residential development. Ahmed built and executed the entire lead generation system, applying structured Google Search ads and targeted WhatsApp workflows to capture qualified buyers locally and internationally.",
      labels: ["Traffic Channel", "Conversion KPI", "Cost per Lead", "Target Campaign"],
      values: ["Google Ads + WhatsApp Chatbot", "34% Conversion Rate", "444 AED CPL (40% Drop)", "Nautica Phase 1 Release"]
    },
    terragolf: {
      title: "Terra Golf Collection: Luxury Villas",
      price: "From AED 7.2 Million",
      type: "image",
      src: "images/terragolf.png",
      desc: "An exclusive boutique collection of villas overlooking the golf course. Directed target market setups focusing on ultra-high-net-worth individuals, integrating HTML email drip workflows and private viewing events to capture leads.",
      labels: ["Traffic Channel", "Conversion KPI", "Cost per Lead", "Target Campaign"],
      values: ["SEO + Email Campaigns + VIP Events", "High-Intent Lead Yield", "Optimized Premium ROI", "Terra Golf Signature Launch"]
    },
    orchard: {
      title: "The Orchard Place: Premium Living",
      price: "From AED 703,000",
      type: "image",
      src: "images/orchard.png",
      desc: "Modern luxury apartments in Jumeirah Village Circle (JVC). Created the organic and paid search strategies from scratch. Driven with zero ad spend SEO structures generating steady high-intent traffic.",
      labels: ["Traffic Channel", "Conversion KPI", "Cost per Lead", "Target Campaign"],
      values: ["Organic SEO Strategy + Meta Ads", "Steady Organic Lead Flow", "Zero Ad Spend Traffic", "The Orchard Place Launch"]
    }
  };

  const mediaProductionDetails = {
    vid_bts: {
      title: "BTS Commercial Spot",
      price: "AR Media Commercial Spot",
      type: "video",
      src: "https://player.vimeo.com/video/1200879512?autoplay=1",
      desc: "An behind-the-scenes promotional spot showcasing AR Media Production's commercial filming projects. Directed, storyboarded, and executed the editing flow with Adobe Premiere Pro.",
      labels: ["Asset Type", "Deliverable", "Platform", "Primary Role"],
      values: ["Video / Commercial", "Full HD Promo Spot", "Vimeo / Social", "Director & Executive Producer"]
    },
    vid_zee: {
      title: "Zee Connect TV Feature",
      price: "Zee TV Commercial Branding",
      type: "video",
      src: "https://player.vimeo.com/video/1200878556?autoplay=1",
      desc: "TV commercial coverage produced for Zee Connect. Structured the lighting, sound layout, camera tracking movements, and supervised the post-production rendering timeline.",
      labels: ["Asset Type", "Deliverable", "Platform", "Primary Role"],
      values: ["Video / TV Commercial", "TV Feature Spot", "Vimeo / Zee TV", "Videographer & Video Editor"]
    },
    vid_firstprint: {
      title: "First Print Company Promo",
      price: "Industrial Branding Video",
      type: "video",
      src: "https://player.vimeo.com/video/1200880870?autoplay=1",
      desc: "Industrial commercial video spot produced for First Print Company. Showcased high-speed printing machinery, design workflow, and corporate branding details.",
      labels: ["Asset Type", "Deliverable", "Platform", "Primary Role"],
      values: ["Commercial Video Spot", "Full HD Promo Spot", "Vimeo / Web", "Producer & Storyboarder"]
    },
    vid_sira: {
      title: "SIRA Corporate Campaign",
      price: "Corporate Security Campaign Spot",
      type: "video",
      src: "https://player.vimeo.com/video/1200879840?autoplay=1",
      desc: "A corporate promotional video spot shot for SIRA (Security Industry Regulatory Agency) in Dubai. Managed production crew, camera positions, and post-production flow.",
      labels: ["Asset Type", "Deliverable", "Platform", "Primary Role"],
      values: ["Corporate Videography", "Marketing Video Release", "Vimeo / SIRA", "Executive Video Producer"]
    },
    vid_presenter: {
      title: "TV Presenter Course",
      price: "Media Training Promo Spot",
      type: "video",
      src: "https://player.vimeo.com/video/1200880069?autoplay=1",
      desc: "Promo video spot covering the professional TV Presenter Course at Reporters Media Production. Designed lighting coordinates and captured key classroom training moments.",
      labels: ["Asset Type", "Deliverable", "Platform", "Primary Role"],
      values: ["Video / Event spot", "TV Presenter Spot", "Vimeo / Training", "Lead Videographer & Editor"]
    },
    vid_makeup1: {
      title: "Masaya Lojain Show - Spot 1",
      price: "Celebrity Visual Branding",
      type: "video",
      src: "https://player.vimeo.com/video/462214444?autoplay=1",
      desc: "Visual branding campaign video produced for Masaya Lojain, featuring TV personality Lojain Omran. Handled visual direction, lighting coordinates, and creative color grading.",
      labels: ["Asset Type", "Deliverable", "Platform", "Primary Role"],
      values: ["Video / Motion Graphic", "High-Resolution Social Spot", "Vimeo / Social", "Creative Visual Lead"]
    },
    vid_makeup2: {
      title: "Makeup Photo Session 1",
      price: "Makeup Photo Session",
      type: "video",
      src: "https://player.vimeo.com/video/462214521?autoplay=1",
      desc: "Commercial makeup photo session coverage video, highlighting model coordinates, lighting setups, and visual content production.",
      labels: ["Asset Type", "Deliverable", "Platform", "Primary Role"],
      values: ["Video / Promo", "High-Resolution Social Spot", "Vimeo / Social", "Creative Visual Lead"]
    }
  };

  function openLightbox(data) {
    mediaContainer.innerHTML = "";

    if (data.type === "video") {
      if (data.src.endsWith(".mp4")) {
        const video = document.createElement("video");
        video.src = data.src;
        video.controls = true;
        video.autoplay = true;
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.borderRadius = "12px";
        video.style.backgroundColor = "#000";
        mediaContainer.appendChild(video);
      } else {
        const iframe = document.createElement("iframe");
        iframe.src = data.src;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        mediaContainer.appendChild(iframe);
      }
    } else {
      const img = document.createElement("img");
      img.id = "lightbox-img-el";
      img.src = data.src;
      img.alt = data.title;
      mediaContainer.appendChild(img);
    }

    document.getElementById("lightbox-title").textContent = data.title;
    document.getElementById("lightbox-price").textContent = data.price;
    document.getElementById("lightbox-desc").textContent = data.desc;

    document.getElementById("label-col-1").textContent = data.labels[0];
    document.getElementById("lightbox-channel").textContent = data.values[0];

    document.getElementById("label-col-2").textContent = data.labels[1];
    document.getElementById("lightbox-conversion").textContent = data.values[1];

    document.getElementById("label-col-3").textContent = data.labels[2];
    document.getElementById("lightbox-cpl").textContent = data.values[2];

    document.getElementById("label-col-4").textContent = data.labels[3];
    document.getElementById("lightbox-campaign").textContent = data.values[3];

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  // Bind Real Estate Cards click
  document.querySelectorAll(".portfolio-card").forEach(card => {
    card.addEventListener("click", () => {
      const projId = card.getAttribute("data-project");
      if (realEstateDetails[projId]) {
        openLightbox(realEstateDetails[projId]);
      }
    });
  });

  // Bind Media Production Cards click
  document.querySelectorAll(".media-card-item").forEach(card => {
    card.addEventListener("click", () => {
      const mediaId = card.getAttribute("data-media-id");
      if (mediaProductionDetails[mediaId]) {
        openLightbox(mediaProductionDetails[mediaId]);
      }
    });
  });

  // Bind Marquee Cards click
  document.querySelectorAll(".marquee-card").forEach(card => {
    card.addEventListener("click", () => {
      const mediaId = card.getAttribute("data-media-id");
      if (mediaProductionDetails[mediaId]) {
        openLightbox(mediaProductionDetails[mediaId]);
      }
    });
  });


  // Close lightbox modal
  if (lightboxClose && lightbox) {
    const closeBox = () => {
      lightbox.classList.remove("active");
      mediaContainer.innerHTML = ""; 
      document.body.style.overflow = "auto";
    };
    
    lightboxClose.addEventListener("click", closeBox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeBox();
      }
    });
  }

  // --- Contact Form Handling ---
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const name = document.getElementById("form-name").value.trim();
      const email = document.getElementById("form-email").value.trim();
      const message = document.getElementById("form-message").value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = "Please fill in all fields.";
        formStatus.className = "form-status error";
        return;
      }

      formStatus.textContent = "Sending message...";
      formStatus.className = "form-status success";

      setTimeout(() => {
        formStatus.textContent = "Thank you! Your message has been sent successfully. Ahmed will get back to you shortly.";
        formStatus.className = "form-status success";
        contactForm.reset();
      }, 1500);
    });
  }
});
