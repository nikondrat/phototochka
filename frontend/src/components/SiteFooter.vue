<template>
  <footer class="footer" aria-labelledby="footer-title">
    <div class="container footer__grid">
      <div class="footer__brand">
        <a class="footer__logo" href="#top">
          <span class="footer__dot" />ФотоТочка
        </a>
        <p>
          ФотоТочка объединяет фотографов, бренды и агентства: помогает быстро находить, лицензировать и
          распространять актуальные визуальные материалы по всему миру.
        </p>
      </div>
      <div class="footer__column" id="blog">
        <h3>Блог</h3>
        <a href="#">Советы авторам</a>
        <a href="#">Тренды фотографии</a>
        <a href="#">Обзоры коллекций</a>
      </div>
      <div class="footer__column" id="help">
        <h3>Помощь</h3>
        <a href="#">FAQ</a>
        <a href="#">Контакты</a>
        <a href="#">Техподдержка</a>
      </div>
      <div class="footer__column" id="about">
        <h3>Служебные страницы</h3>
        <a href="#">Политика конфиденциальности</a>
        <a href="#">Пользовательское соглашение</a>
        <a href="#">Правила использования контента</a>
      </div>
    </div>
    <div class="footer__bottom">
      <div class="container footer__bottom-inner">
        <span>© {{ new Date().getFullYear() }} ФотоТочка. Все права защищены.</span>
        <div class="footer__socials" aria-label="Социальные сети">
          <a href="#" aria-label="Telegram">TG</a>
          <a href="#" aria-label="VK">VK</a>
          <a href="#" aria-label="YouTube">YT</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #0f172a;
  color: #ffffff;
  padding: 4rem 0 2.5rem;
}

.footer__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.footer__logo {
  font-family: 'Playfair Display', 'Inter', serif;
  font-size: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: #ffffff;
  margin-bottom: 1rem;
}

.footer__dot {
  inline-size: 14px;
  block-size: 14px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.55);
}

.footer__brand p {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  max-width: 280px;
}

.footer__column h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.72);
}

.footer__column a {
  display: block;
  margin-bottom: 0.75rem;
  color: #ffffff;
  opacity: 0.75;
  transition: opacity 0.2s ease;
}

.footer__column a:hover {
  opacity: 1;
}

.footer__bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
}

.footer__bottom-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.65);
}

.footer__socials {
  display: flex;
  gap: 0.75rem;
}

.footer__socials a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 32px;
  block-size: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.35);
  opacity: 0.85;
}

.footer__socials a:hover {
  opacity: 1;
  border-color: #ffffff;
}

@media (max-width: 640px) {
  .footer__bottom-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
