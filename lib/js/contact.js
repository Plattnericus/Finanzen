document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('closePopup');
  
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
  
        const formData = {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          subject: document.getElementById('subject').value,
          message: document.getElementById('message').value
        };
  
        console.log('Formular abgeschickt:', formData);
  
        popup.classList.remove('hidden');
  
        contactForm.reset();
      });
    }
  
    if (closePopup) {
      closePopup.addEventListener('click', function() {
        popup.classList.add('hidden');

      });
    }
  });
  