// Скрипт для управления воспроизведением видео
document.addEventListener('DOMContentLoaded', function() {
    // Управление фоновым видео
    const bgVideo = document.getElementById('bg-video');
    
    if (bgVideo) {
        // Попытка воспроизведения фонового видео (уже muted в HTML)
        bgVideo.play().catch(function(error) {
            console.log('Автовоспроизведение видео заблокировано браузером:', error);
        });
    }

    // Управление клипами - пауза при наведении для экономии ресурсов
    const clipBubbles = document.querySelectorAll('.clip-card video');
    
    clipBubbles.forEach(video => {
        // Предзагрузка видео
        video.load();
        
        // Воспроизведение при попадании в область видимости
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            });
        }, {
            threshold: 0.5
        });

        observer.observe(video);
    });

    // Плавное появление элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Применяем анимацию появления к секциям
    document.querySelectorAll('.hero, .clips-section, .about-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(section);
    });

    // Плавное появление клипов при загрузке
    const clipCards = document.querySelectorAll('.clip-card');
    clipCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transition = `opacity 0.6s ease ${index * 0.15}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
        }, 100 + index * 150);
    });

    // Параллакс эффект для пузырей с клипами
    const clipsCloud = document.querySelector('.clips-cloud');
    if (clipsCloud) {
        let ticking = false;

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    const scrolled = window.pageYOffset;
                    const bubbles = document.querySelectorAll('.clip-card');

                    ticking = false;
                });

                ticking = true;
            }
        });
    }

    // Добавляем эффект пульсации для социальных иконок
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach((link, index) => {
        link.style.animationDelay = `${index * 0.1}s`;
    });

    // Обработка изменения размера окна для оптимизации
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Перезапуск Intersection Observer при изменении размера
            clipBubbles.forEach(video => {
                video.load();
            });
        }, 250);
    });
});
