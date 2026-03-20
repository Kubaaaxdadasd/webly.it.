//formularz boczny
const btn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');

btn.addEventListener('click', () => {

    sidebar.classList.toggle('active');
    

    if (sidebar.classList.contains('active')) {
        btn.textContent = '✕';
    } else {
        btn.textContent = '☰';
    }
});


const sidebarLinks = document.querySelectorAll('#sidebar a');
sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('active');
        btn.textContent = '☰';
    });
});
//formualarz
// Funkcja wywoływana, gdy klikniesz w pole (focus)
function inp(element) {
    element.style.backgroundColor = "#e8f0fe"; // Jasnobłękitne tło
    element.style.borderColor = "#0056b3";     // Ciemniejsza ramka
    element.style.transition = "0.3s";         // Płynne przejście
}

// Funkcja wywoływana, gdy klikniesz poza pole (blur)
function offinp(element) {
    element.style.backgroundColor = "white";   // Powrót do białego
    element.style.borderColor = "#ccc";        // Powrót do szarej ramki
}

// button to kontakt
const heroBtn = document.getElementById('hero-btn');

heroBtn.onclick = function() {

    document.querySelector('.kontakt').scrollIntoView({ 
        behavior: 'smooth'
    });
};
function dostep(sekcja) {
    let element = sekcja.querySelector(".dostep");
    let przycisk = sekcja.querySelector(".umow");

    // SPRAWDZAMY CZY SEKCJA MA KLASĘ "brak"
    if (sekcja.classList.contains("brak")) {
        if (element) {
            element.innerHTML = "Niedostępne";
            element.style.opacity = "1";
        }
        if (przycisk) {
            przycisk.classList.add("button-disabled");
        }
    } else {
        // Opcjonalnie: co ma się dziać na działających usługach (np. napis "Dostępne")
        if (element) {
            element.innerHTML = "Dostępne";
            element.style.opacity = "1";
            element.style.background = "green"; 
        }
    }
}

// Ta funkcja obsługuje kliknięcie
function kupProjekt(nazwa) {
    localStorage.setItem('wybranyProjekt', nazwa);
    window.location.href = "index.html#kontakt";
}

// ==================== EMAILJS KONFIGURACJA ====================
// Zarejestruj się na: https://www.emailjs.com/
// 1. Załóż konto
// 2. Dodaj Email Service (Gmail, Outlook, etc.)
// 3. Skopiuj Service ID, Template ID i Public Key

// ZMIEŃ NA SWOJE DANE!
const EMAIL_SERVICE_ID = 'service_XXXXXX';      // Zmień na swoje!
const EMAIL_TEMPLATE_ID = 'template_XXXXXX';    // Zmień na swoje!
const EMAIL_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';     // Zmień na swoje!

// Inicjalizacja EmailJS
if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAIL_PUBLIC_KEY);
}

// ==================== LOCALSTORAGE BACKUP ====================
// Funkcja do zapisania formularza w localStorage
function saveFormToLocalStorage(formData) {
    let forms = JSON.parse(localStorage.getItem('weblyit_forms') || '[]');
    
    formData.id = Math.floor(Math.random() * 1000000);
    formData.data_utworzenia = new Date().toLocaleString('pl-PL');
    
    forms.push(formData);
    localStorage.setItem('weblyit_forms', JSON.stringify(forms));
    
    return formData.id;
}

// Ten kod wypełnia formularz po załadowaniu strony
window.addEventListener('load', () => {
    const wybrany = localStorage.getItem('wybranyProjekt');
    const messageField = document.getElementById('message');
    
    if (wybrany && messageField) {
        messageField.value = "Dzień dobry!\n\nInteresuje mnie zakup projektu: " + wybrany + ".\n\nMoje sugestie co do zmian:\n- (wpisz np. własne kolory, logo, dodatkowe zakładki)\n\nProszę o kontakt w celu wyceny i ustalenia szczegółów.";
        
        localStorage.removeItem('wybranyProjekt');
        
        messageField.focus();
        messageField.setSelectionRange(messageField.value.length, messageField.value.length);
    }
    
    // Obsługa formularza kontaktowego
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

/**
 * Obsługa wysyłania formularza kontaktowego
 * Wysyła maila przez EmailJS i zapisuje dane lokalnie
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    // Pobranie danych z formularza
    const formData = {
        imie: document.getElementById('name').value,
        email: document.getElementById('email').value,
        usluga: document.getElementById('select').value,
        wiadomosc: document.getElementById('message').value,
        zgoda_regulamin: document.getElementById('reg').checked
    };
    
    // Wyłączenie przycisku podczas wysyłania
    submitBtn.disabled = true;
    submitBtn.textContent = 'Wysyłanie...';
    
    try {
        // 1. Zapisz do localStorage (backup)
        const klient_id = saveFormToLocalStorage(formData);
        
        // 2. Wyślij email przez EmailJS
        const templateParams = {
            to_email: 'velocodeweb@gmail.com',  // ZMIEŃ NA SWÓJ EMAIL!
            from_name: formData.imie,
            from_email: formData.email,
            usluga: formData.usluga,
            wiadomosc: formData.wiadomosc,
            zgoda_regulamin: formData.zgoda_regulamin ? 'Tak' : 'Nie',
            klient_id: klient_id
        };
        
        const response = await emailjs.send(
            EMAIL_SERVICE_ID,
            EMAIL_TEMPLATE_ID,
            templateParams
        );
        
        if (response.status === 200) {
            // Sukces
            alert('✓ Wiadomość wysłana pomyślnie!\nTwój numer ID: ' + klient_id + '\n\nPowinieneś otrzymać potwierdzenie na mailu.');
            form.reset();
            submitBtn.textContent = 'Wysłano!';
            submitBtn.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }, 3000);
        } else {
            throw new Error('Błąd podczas wysyłania emaila');
        }
    } catch (error) {
        console.error('Błąd:', error);
        alert('✗ Błąd: ' + error.message + '\n\nTwoja wiadomość została zapisana lokalnie. Spróbuj ponownie później.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
}
