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
      src: "https://player.vimeo.com/video/1200900620?autoplay=1",
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
    const lightboxContent = document.querySelector(".lightbox-content");
    if (lightboxContent) lightboxContent.classList.add("media-only");

    if (data.type === "video") {
      if (data.src.endsWith(".mp4")) {
        const video = document.createElement("video");
        video.src = data.src;
        video.controls = true;
        video.autoplay = true;
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

  // --- Photography Showcase Dynamic Gallery ---
  const photographyItems = [
    { id: "p1", file: "Crazy_Banana_Product.jpg", title: "Crazy Banana Concept Shoot", category: "Product & Commercial", tag: "product", layout: "span-large" },
    { id: "p2", file: "Crazy_Banana_Product_1.jpg", title: "Crazy Banana Studio Setup", category: "Product & Commercial", tag: "product", layout: "span-v" },
    { id: "p3", file: "Crazy_Banana_Product_2.jpg", title: "Crazy Banana Details", category: "Product & Commercial", tag: "product", layout: "span-h" },
    { id: "p4", file: "Crazy_Banana_Product_3.jpg", title: "Crazy Banana Yellow Grade", category: "Product & Commercial", tag: "product", layout: "standard" },
    { id: "p5", file: "Crazy_Banana_Product_4.jpg", title: "Crazy Banana Commercial", category: "Product & Commercial", tag: "product", layout: "standard" },
    { id: "p6", file: "Crazy_Banana_Product_5.jpg", title: "Crazy Banana Creative Styling", category: "Product & Commercial", tag: "product", layout: "span-v" },
    
    { id: "p7", file: "IMG_8034 copy.jpg", title: "Studio Fashion Editorial 1", category: "Fashion & Portraits", tag: "portrait", layout: "span-v" },
    { id: "p8", file: "IMG_8048 copy.jpg", title: "Studio Fashion Editorial 2", category: "Fashion & Portraits", tag: "portrait", layout: "standard" },
    { id: "p9", file: "IMG_8053.jpg", title: "Studio Portrait Session 1", category: "Fashion & Portraits", tag: "portrait", layout: "standard" },
    { id: "p10", file: "IMG_8071 copy.jpg", title: "Studio Portrait Session 2", category: "Fashion & Portraits", tag: "portrait", layout: "span-large" },
    { id: "p11", file: "IMG_8083.jpg", title: "Studio Portrait Session 3", category: "Fashion & Portraits", tag: "portrait", layout: "standard" },
    { id: "p12", file: "IMG_8105 copy.jpg", title: "Model Portfolio Editorial 1", category: "Fashion & Portraits", tag: "portrait", layout: "span-v" },
    { id: "p13", file: "IMG_8110 copy.jpg", title: "Model Portfolio Editorial 2", category: "Fashion & Portraits", tag: "portrait", layout: "standard" },
    { id: "p14", file: "IMG_8123 copy.jpg", title: "Model Portfolio Editorial 3", category: "Fashion & Portraits", tag: "portrait", layout: "standard" },
    { id: "p15", file: "IMG_8129.jpg", title: "Model Portfolio Editorial 4", category: "Fashion & Portraits", tag: "portrait", layout: "span-h" },
    { id: "p16", file: "IMG_8168 copy.jpg", title: "Corporate Portraiture 1", category: "Fashion & Portraits", tag: "portrait", layout: "standard" },
    { id: "p17", file: "IMG_8170 copy.jpg", title: "Corporate Portraiture 2", category: "Fashion & Portraits", tag: "portrait", layout: "span-v" },
    { id: "p18", file: "IMG_8185 copy.jpg", title: "Corporate Portraiture 3", category: "Fashion & Portraits", tag: "portrait", layout: "standard" },
    { id: "p19", file: "IMG_8753 ---copy.jpg", title: "Lifestyle Model Session 1", category: "Fashion & Portraits", tag: "portrait", layout: "standard" },
    { id: "p20", file: "IMG_8788 c3opy.jpg", title: "Lifestyle Model Session 2", category: "Fashion & Portraits", tag: "portrait", layout: "span-h" },
    { id: "p21", file: "IMG_8912 copy.JPG", title: "Lifestyle Model Session 3", category: "Fashion & Portraits", tag: "portrait", layout: "standard" },
    { id: "p22", file: "IMG_9070 copy.jpg", title: "Outdoor Portrait Campaign", category: "Fashion & Portraits", tag: "portrait", layout: "span-large" },
    { id: "p23", file: "5Z8A6967.jpg", title: "Premium Studio Portrait", category: "Fashion & Portraits", tag: "portrait", layout: "span-v" },

    { id: "p24", file: "Facebook 3.jpg", title: "Social Content Production 1", category: "Events & Social", tag: "event", layout: "standard" },
    { id: "p25", file: "Facebook 10.jpg", title: "Social Content Production 2", category: "Events & Social", tag: "event", layout: "standard" },
    { id: "p26", file: "Facebook 16.jpg", title: "Social Content Production 3", category: "Events & Social", tag: "event", layout: "span-h" },
    { id: "p27", file: "Facebook 20.jpg", title: "Social Content Production 4", category: "Events & Social", tag: "event", layout: "standard" },
    
    { id: "p28", file: "27629410_390813834715044_843683683027766351_o.jpg", title: "Live Event Coverage 1", category: "Events & Social", tag: "event", layout: "standard" },
    { id: "p29", file: "27629525_391163281346766_446217568756798736_o.jpg", title: "Live Event Coverage 2", category: "Events & Social", tag: "event", layout: "span-h" },
    { id: "p30", file: "28166849_395948717534889_5493449548623914799_n.jpg", title: "Live Event Coverage 3", category: "Events & Social", tag: "event", layout: "standard" },
    { id: "p31", file: "35432243_447212359075191_5185778319605366784_o.jpg", title: "Press Conference Coverage", category: "Events & Social", tag: "event", layout: "standard" },
    { id: "p32", file: "37960079_485273921935701_1659554249115172864_o.jpg", title: "Media Conference Press", category: "Events & Social", tag: "event", layout: "span-h" },
    { id: "p33", file: "38043188_489158558213904_2565528053463646208_o.jpg", title: "Live Media Interview 1", category: "Events & Social", tag: "event", layout: "standard" },
    { id: "p34", file: "38071726_489171418212618_2991628911336488960_o.jpg", title: "Live Media Interview 2", category: "Events & Social", tag: "event", layout: "standard" },
    { id: "p35", file: "38085905_489170161546077_8092812713266249728_o.jpg", title: "Live Media Interview 3", category: "Events & Social", tag: "event", layout: "standard" },
    { id: "p36", file: "38159110_489146551548438_2467618892357304320_o.jpg", title: "Press Conference Broadcast 1", category: "Events & Social", tag: "event", layout: "span-h" },
    { id: "p37", file: "38274507_489145234881903_6650924198371786752_o.jpg", title: "Press Conference Broadcast 2", category: "Events & Social", tag: "event", layout: "standard" },
    { id: "p38", file: "38703298_496810157448744_7539977588215644160_n.jpg", title: "Press Conference Broadcast 3", category: "Events & Social", tag: "event", layout: "standard" },

    { id: "p39", file: "1.jpg", title: "Creative Concept Shoot 1", category: "Product & Commercial", tag: "product", layout: "standard" },
    { id: "p40", file: "2.jpg", title: "Creative Concept Shoot 2", category: "Product & Commercial", tag: "product", layout: "standard" },
    { id: "p41", file: "3.jpg", title: "Creative Concept Shoot 3", category: "Product & Commercial", tag: "product", layout: "span-v" },
    { id: "p42", file: "4.jpg", title: "Creative Concept Shoot 4", category: "Product & Commercial", tag: "product", layout: "standard" },
    { id: "p43", file: "13.jpg", title: "Visual Branding Campaign", category: "Product & Commercial", tag: "product", layout: "span-large" },
    { id: "p44", file: "15.jpg", title: "Visual Catalog Product", category: "Product & Commercial", tag: "product", layout: "span-v" },

    { id: "p45", file: "1-8.jpg", title: "Media Production Scene 1", category: "Events & Social", tag: "event", layout: "standard" },
    { id: "p46", file: "1-13.jpg", title: "Media Production Scene 2", category: "Events & Social", tag: "event", layout: "standard" },
    { id: "p47", file: "1-21.jpg", title: "Media Production Scene 3", category: "Events & Social", tag: "event", layout: "standard" },
    { id: "p48", file: "1-349.jpg", title: "Studio Behind-the-Scenes 1", category: "Fashion & Portraits", tag: "portrait", layout: "span-large" },
    { id: "p49", file: "1-473 copy.jpg", title: "Studio Behind-the-Scenes 2", category: "Fashion & Portraits", tag: "portrait", layout: "span-h" },
    { id: "p50", file: "1-485-- copy.jpg", title: "Studio Behind-the-Scenes 3", category: "Fashion & Portraits", tag: "portrait", layout: "standard" },
    { id: "p51", file: "Panorama3.jpg", title: "Wide Angle Event Panorama", category: "Events & Social", tag: "event", layout: "span-h" },
    { id: "p52", file: "result_img_2022_01_13_01_18_09.jpg", title: "Creative Retouching Test", category: "Product & Commercial", tag: "product", layout: "standard" },
    { id: "p53", file: "test 444.jpg", title: "Commercial Studio Lighting", category: "Product & Commercial", tag: "product", layout: "standard" }
  ];

  const track1a = document.getElementById("photo-track-1a");
  const track1b = document.getElementById("photo-track-1b");
  const track2a = document.getElementById("photo-track-2a");
  const track2b = document.getElementById("photo-track-2b");
  const heroTrackA = document.getElementById("hero-photo-track-a");
  const heroTrackB = document.getElementById("hero-photo-track-b");
  const photoFilters = document.querySelectorAll(".photo-filter-btn");

  let currentPhotoFilter = "all";

  function openPhotoLightbox(photoItem) {
    const data = {
      title: photoItem.title,
      price: photoItem.category,
      type: "image",
      src: `PICS/${photoItem.file}`,
      desc: `High-quality visual content asset captured and processed under AR Media Production agency. Professional framing, color correction, and final retouching coordinates.`,
      labels: ["Asset Category", "Platform / Media", "Primary Software", "Role"],
      values: [photoItem.category, "Social / Web / Print", "Adobe Photoshop & Lightroom", "Production Director"]
    };
    openLightbox(data);
  }

  function renderPhotoMarquees() {
    // Helper to repeat items if they are too few (to ensure seamless wrapping)
    function ensureMinimumItems(items, min = 12) {
      if (items.length === 0) return [];
      let repeated = [...items];
      while (repeated.length < min) {
        repeated = repeated.concat(items);
      }
      return repeated;
    }

    function generateTrackHtml(items) {
      return items.map(item => `
        <div class="photo-card-item ${item.layout}" data-photo-id="${item.id}">
          <div class="photo-preview-container">
            <img class="photo-grid-img" src="PICS/${item.file}" alt="${item.title}" loading="lazy">
          </div>
        </div>
      `).join("");
    }

    // Render Hero tracks if they exist (always showing all photos)
    if (heroTrackA && heroTrackB && heroTrackA.innerHTML === "") {
      const heroHtml = generateTrackHtml(ensureMinimumItems(photographyItems, 12));
      heroTrackA.innerHTML = heroHtml;
      heroTrackB.innerHTML = heroHtml;
    }

    if (!track1a || !track1b || !track2a || !track2b) return;

    // Filter items based on active category tag
    const filteredItems = photographyItems.filter(item => {
      return currentPhotoFilter === "all" || item.tag === currentPhotoFilter;
    });

    // Distribute items to Row 1 (even index) and Row 2 (odd index)
    let row1Items = filteredItems.filter((_, idx) => idx % 2 === 0);
    let row2Items = filteredItems.filter((_, idx) => idx % 2 !== 0);

    const row1Final = ensureMinimumItems(row1Items, 12);
    const row2Final = ensureMinimumItems(row2Items, 12);

    const htmlRow1 = generateTrackHtml(row1Final);
    const htmlRow2 = generateTrackHtml(row2Final);

    // Set identical content to both tracks in each row for seamless looping
    track1a.innerHTML = htmlRow1;
    track1b.innerHTML = htmlRow1;
    track2a.innerHTML = htmlRow2;
    track2b.innerHTML = htmlRow2;

    // Bind click events to all photo cards
    document.querySelectorAll(".photo-card-item").forEach(card => {
      card.addEventListener("click", () => {
        const photoId = card.getAttribute("data-photo-id");
        const photoItem = photographyItems.find(p => p.id === photoId);
        if (photoItem) {
          openPhotoLightbox(photoItem);
        }
      });
    });
  }

  // Filters Event
  photoFilters.forEach(btn => {
    btn.addEventListener("click", () => {
      photoFilters.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentPhotoFilter = btn.getAttribute("data-filter");
      renderPhotoMarquees();
    });
  });

  // Call initial render
  renderPhotoMarquees();
});
