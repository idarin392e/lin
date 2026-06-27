/**
 * iDarin 个人网站交互脚本
 * 包含：预加载、主题切换、轮播、导航、滚动监听、联系表单等功能
 */

(function() {
    'use strict';

    // ==================== EmailJS 初始化 ====================
    if (typeof emailjs !== 'undefined') {
        emailjs.init('IDTYnG7-6Gexs246h');
    }

    // ==================== 页面预加载 ====================
    window.addEventListener('load', function() {
        // 短暂延迟，让加载动画可见
        setTimeout(function() {
            document.body.classList.add('loaded');
        }, 600);
    });

    // ==================== 主题切换 ====================
    function initTheme() {
        // 优先读取本地保存的主题，否则根据系统偏好
        const savedTheme = localStorage.getItem('idarin-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

        document.documentElement.setAttribute('data-theme', currentTheme);
        return currentTheme;
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('idarin-theme', newTheme);
    }

    initTheme();

    // 绑定所有主题切换按钮
    document.querySelectorAll('#theme-toggle, #theme-toggle-mobile').forEach(function(btn) {
        btn.addEventListener('click', toggleTheme);
    });

    // ==================== 导航栏滚动效果 ====================
    const navBar = document.querySelector('.nav-bar');

    function updateNavbar() {
        if (window.scrollY > 50) {
            navBar.classList.add('scrolled');
        } else {
            navBar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateNavbar);

    // ==================== 移动端菜单 ====================
    const navToggle = document.getElementById('nav-toggle');
    const navMobile = document.getElementById('nav-mobile');

    if (navToggle && navMobile) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMobile.classList.toggle('open');
        });

        // 点击移动端菜单链接后自动关闭菜单
        navMobile.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMobile.classList.remove('open');
            });
        });
    }

    // ==================== 平滑滚动导航 ====================
    const navLinks = document.querySelectorAll('.nav-link');

    function smoothScrollTo(targetId) {
        const target = document.querySelector(targetId);
        if (!target) return;

        const navHeight = navBar ? navBar.offsetHeight : 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
        });
    }

    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                smoothScrollTo(href);
            }
        });
    });

    // ==================== 滚动时高亮当前导航项 ====================
    const sections = document.querySelectorAll('section[id]');

    function highlightNav() {
        const scrollPosition = window.scrollY + 150;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // 在页面顶部时高亮首页
        if (window.scrollY < 100) {
            navLinks.forEach(function(link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#home') {
                    link.classList.add('active');
                }
            });
        }
    }

    window.addEventListener('scroll', highlightNav);

    // ==================== 返回顶部按钮 ====================
    const backToTop = document.getElementById('back-to-top');

    function toggleBackToTop() {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', toggleBackToTop);
    }

    // ==================== 轮播组件初始化 ====================
    document.addEventListener('DOMContentLoaded', function() {
        // 作品案例轮播
        const portfolioSlider = document.getElementById('portfolio-slider');
        if (portfolioSlider && typeof Splide !== 'undefined') {
            const portfolioSplide = new Splide('#portfolio-slider', {
                type: 'slide',
                perPage: 2,
                gap: 0,
                arrows: false,
                pagination: false,
                autoplay: false,
                breakpoints: {
                    768: {
                        perPage: 1
                    }
                }
            });

            portfolioSplide.mount();

            document.querySelector('.portfolio-arrow-prev').addEventListener('click', function() {
                portfolioSplide.go('<');
            });
            document.querySelector('.portfolio-arrow-next').addEventListener('click', function() {
                portfolioSplide.go('>');
            });
        }

        // 客户评价轮播
        const testimonialsSlider = document.getElementById('testimonials-slider');
        if (testimonialsSlider && typeof Splide !== 'undefined') {
            const testimonialsSplide = new Splide('#testimonials-slider', {
                type: 'slide',
                perPage: 3,
                gap: 0,
                arrows: false,
                pagination: false,
                autoplay: false,
                breakpoints: {
                    1200: {
                        perPage: 2
                    },
                    768: {
                        perPage: 1
                    }
                }
            });

            testimonialsSplide.mount();

            document.querySelector('.testimonials-arrow-prev').addEventListener('click', function() {
                testimonialsSplide.go('<');
            });
            document.querySelector('.testimonials-arrow-next').addEventListener('click', function() {
                testimonialsSplide.go('>');
            });
        }
    });

    // ==================== 联系表单处理（EmailJS）====================
    const contactForm = document.getElementById('contact-form');
    if (contactForm && typeof emailjs !== 'undefined') {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const btn = this.querySelector('.btn-submit');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span>发送中...</span> <i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            // 构造 EmailJS 模板参数
            const templateParams = {
                from_name: document.getElementById('contactName').value,
                from_email: document.getElementById('contactEmail').value,
                subject: document.getElementById('contactService').value,
                message: document.getElementById('contactMessage').value
            };

            emailjs.send('service_4412999', 'template_idkw767', templateParams)
                .then(function(response) {
                    btn.innerHTML = '<span>发送成功！</span> <i class="fas fa-check"></i>';
                    contactForm.reset();
                    setTimeout(function() {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                    }, 3000);
                }, function(error) {
                    btn.innerHTML = '<span>发送失败，请重试</span> <i class="fas fa-times"></i>';
                    setTimeout(function() {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                    }, 3000);
                    console.error('EmailJS error:', error);
                });
        });
    }

})();
