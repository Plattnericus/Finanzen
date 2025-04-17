document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        
        item.classList.toggle('active');
      });
    });
    
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        categoryBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const category = this.getAttribute('data-category');
        filterFAQs(category);
      });
    });
    
    const faqSearch = document.getElementById('faqSearch');
    const searchFaqBtn = document.getElementById('searchFaqBtn');
    
    searchFaqBtn.addEventListener('click', searchFAQs);
    faqSearch.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') searchFAQs();
    });
    
    function filterFAQs(category) {
      const faqs = document.querySelectorAll('.faq-item');
      
      faqs.forEach(faq => {
        if (category === 'all' || faq.getAttribute('data-category') === category) {
          faq.style.display = 'block';
        } else {
          faq.style.display = 'none';
        }
      });
    }
    
    function searchFAQs() {
      const searchTerm = faqSearch.value.toLowerCase();
      const faqs = document.querySelectorAll('.faq-item');
      
      if (searchTerm.trim() === '') {
        const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
        filterFAQs(activeCategory);
        return;
      }
      
      faqs.forEach(faq => {
        const question = faq.querySelector('h3').textContent.toLowerCase();
        const answer = faq.querySelector('.faq-answer').textContent.toLowerCase();
        
        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
          faq.style.display = 'block';
          faq.classList.add('active');
        } else {
          faq.style.display = 'none';
        }
      });
    }
  });