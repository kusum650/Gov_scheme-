// nav.js - Handles dynamic navbar update based on login state
window.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('user');
  const navLinks = document.querySelector('.nav-links');
  
  if (user && navLinks) {
    const userData = JSON.parse(user);
    
    // Find Login and Register links
    const links = Array.from(navLinks.querySelectorAll('a'));
    const loginLink = links.find(a => a.href.includes('login.html'));
    const registerLink = links.find(a => a.href.includes('register.html'));
    
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    
    // Remove existing logout if any to avoid duplicates
    const existingButtons = Array.from(navLinks.querySelectorAll('button'));
    const oldLogout = existingButtons.find(b => b.innerText.toLowerCase().includes('logout') || (b.getAttribute('onclick') && b.getAttribute('onclick').includes('logout')));
    if (oldLogout) oldLogout.style.display = 'none';

    // Create Account Tab
    const accountTab = document.createElement('a');
    accountTab.href = "#";
    accountTab.style.fontWeight = "bold";
    accountTab.style.color = "#d4fcf4";
    accountTab.innerText = "👤 " + userData.username + " (Account)";
    
    // Create Logout Button
    const logoutBtn = document.createElement('button');
    logoutBtn.innerText = "Logout";
    logoutBtn.style.padding = "6px 14px";
    logoutBtn.style.borderRadius = "20px";
    logoutBtn.style.border = "none";
    logoutBtn.style.cursor = "pointer";
    logoutBtn.style.backgroundColor = "#ff4d4d";
    logoutBtn.style.color = "white";
    logoutBtn.style.fontWeight = "bold";
    logoutBtn.style.marginLeft = "10px";
    
    logoutBtn.onclick = async () => {
      localStorage.removeItem("user");
      try {
        await fetch("http://localhost:3000/logout", { credentials: "include" });
      } catch(e) {}
      alert("Logged out successfully");
      window.location.href = "login.html";
    };

    navLinks.appendChild(accountTab);
    navLinks.appendChild(logoutBtn);
  }
});
